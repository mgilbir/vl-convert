use log::{debug, trace};
use std::collections::HashMap;
use std::path::PathBuf;
use std::str::FromStr;
use std::sync::{Arc, RwLock};
use std::time::Duration;

use crate::anyhow::bail;
use deno_core::error::AnyError;
use deno_core::op2;

deno_core::extension!(
    vl_convert_data_loader_runtime,
    ops = [op_fetch_url, op_read_file, op_vega_loader_opts]
);

const DEFAULT_BASE_URL: &str = "https://vega.github.io/vega-datasets/";

use std::sync::atomic::{AtomicU64, Ordering};
fn get_cache_id() -> u64 {
    static COUNTER: AtomicU64 = AtomicU64::new(1);
    COUNTER.fetch_add(1, Ordering::Relaxed)
}

pub struct Cache<V> {
    map: Arc<RwLock<HashMap<u64, Arc<RwLock<V>>>>>,
}

impl<V> Cache<V> {
    fn new() -> Self {
        Cache {
            map: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    pub fn insert(&self, value: V) -> u64 {
        let next_id = get_cache_id();
        let mut map = self.map.write().unwrap();
        map.insert(next_id, Arc::new(RwLock::new(value)));
        next_id
    }

    pub fn get(&self, key: &u64) -> Option<Arc<RwLock<V>>> {
        let map = self.map.read().unwrap();
        map.get(key).cloned()
    }

    pub fn remove(&self, key: &u64) -> Option<Arc<RwLock<V>>> {
        let mut map = self.map.write().unwrap();
        map.remove(key)
    }
}

lazy_static! {
    pub static ref DATALOADING_OPTIONS: Cache<DataLoadingOptions> = Cache::new();

    pub static ref DATALOADER_JS_SCRIPT: String = r#"
if (dl_options_key === undefined) {
    throw new Error("Data loading options not initialized");
}

var op_read_file;
var op_fetch_url;
var op_vega_loader_opts;
import("ext:core/ops").then((imported) => {
    op_read_file = function(...args) { return imported.op_read_file(dl_options_key, ...args); };
    op_fetch_url = function(...args) { return imported.op_fetch_url(dl_options_key, ...args); };
    op_vega_loader_opts = function(...args) { return imported.op_vega_loader_opts(dl_options_key, ...args); };
})

if (errors === undefined) {
    var errors = [];
}

function try_or_throw(fn) {
    return function (...args) {
        return fn(...args)
        .then(function (result) {
            return result;
        })
        .catch(function (e) {
            errors.push(e);
            throw new Error(e);
        });
    }
}

function custom_loader() {
    const converter_opts = JSON.parse(op_vega_loader_opts());
    const httpAccess = converter_opts.has_network_access;
    const fileAccess = converter_opts.has_file_access;
    const baseURL = converter_opts.base_url;

    const protocol_re = /^(data:|([A-Za-z]+:)?\/\/)/;

    // Allow HTTP/HTTPS and file and embedded data
    const allowed_re =
        /^(?:(?:https?|file|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i; // eslint-disable-line no-useless-escape
    const whitespace_re =
        /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g; // eslint-disable-line no-control-regex

    const fileProtocol = "file://";
    const dataProtocol = "data:";

    return {
        options: {},
        fileAccess: fileAccess,
        httpAccess: httpAccess,
        file: try_or_throw(op_read_file),
        http: try_or_throw(op_fetch_url),
        load: async function load(uri, options) {
            if (uri.startsWith(fileProtocol)) {
                if (!fileAccess) {
                    errors.push("File access not allowed");
                    throw new Error("File access not allowed");
                }

                uri = uri.slice(fileProtocol.length);
                return this.file(uri);
            }

            if (uri.startsWith(dataProtocol)) {
                return fetch(uri);
            }

            if (uri.startsWith("http://") || uri.startsWith("https://")) {
                if (!httpAccess) {
                    errors.push("HTTP access not allowed");
                    throw new Error("HTTP access not allowed");
                }

                return this.http(uri, options);
            }

            // We have an URI that is not qualified. Try everything that is allowed.
            sources = [];
            // errors.push(`loading ${uri} - file access ${fileAccess} - http access ${httpAccess}`);
            if (this.fileAccess) {
                sources.push(this.file(uri));
            }
            if (this.httpAccess) {
                sources.push(this.http(uri));
            }

            // Wait for all sources to finish
            return Promise.any(sources)
                .then(function (result) {
                    return result;
                })
                .catch(function (e) {
                    errors.push(`Could not load data: ${e.value} - Errors: ${JSON.stringify(e.errors)}`);
                    throw new Error(e);
                });
        },
        sanitize: async function (uri, options) {
            // Original from vega/vega-loader/src/loader.js
            // It's not used directly in the load operation, but can be used while processing URIs.
            // Removed use of a base.
            options = { ...this.options, ...options };

            const result = { href: null };

            const isAllowed = allowed_re.test(uri.replace(whitespace_re, ""));

            if (uri == null || typeof uri !== "string" || !isAllowed) {
                errors.push(`Sanitize failure, invalid URI: ${uri}`);
                return Promise.reject(new Error(`Invalid URI: ${uri}`));
            }

            const hasProtocol = protocol_re.test(uri);

            let loadFile;
            const isFile = uri.startsWith(fileProtocol);
            if (isFile) {
                // strip file protocol
                uri = uri.slice(fileProtocol.length);
            } else if (uri.startsWith("//")) {
                if (options.defaultProtocol === "file") {
                    // if is file, strip protocol and set loadFile flag
                    uri = uri.slice(2);
                    loadFile = true;
                } else {
                    // if relative protocol (starts with '//'), prepend default protocol
                    uri = (options.defaultProtocol || "http") + ":" + uri;
                }
            }

            // set uri
            result.href = uri;

            // set default result target, if specified
            if (options.target) {
                result.target = options.target + "";
            }

            // set default result rel, if specified (#1542)
            if (options.rel) {
                result.rel = options.rel + "";
            }

            // provide control over cross-origin image handling (#2238)
            // https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
            if (options.context === "image" && options.crossOrigin) {
                result.crossOrigin = options.crossOrigin + "";
            }

            return Promise.resolve(result);
        },
    };
}
            "#.to_string();
}

#[derive(Debug, Clone)]
pub struct DataLoadingOptions {
    pub has_network_access: bool,
    pub has_file_access: bool,
    pub base_url: String,
    pub allowed_base_urls: Vec<String>,
    pub allowed_base_datadirs: Vec<PathBuf>,
}

impl DataLoadingOptions {
    fn vegaloader_opts(&self) -> VegaLoaderOpts {
        VegaLoaderOpts {
            has_network_access: self.has_network_access,
            has_file_access: self.has_file_access,
            base_url: self.base_url.clone(),
        }
    }

    pub fn parse_and_set_allowed_base_datadirs(&mut self, allowed_base_datadirs: Vec<String>) {
        let mut parsed_allowed_base_datadirs = Vec::new();
        for allowed_base_datadir in allowed_base_datadirs {
            let pb_allowed_base_datadir =
                PathBuf::from_str(allowed_base_datadir.as_str()).expect("Invalid base datadir");
            parsed_allowed_base_datadirs.push(pb_allowed_base_datadir);
        }
        self.allowed_base_datadirs = parsed_allowed_base_datadirs;
    }
}

impl Default for DataLoadingOptions {
    fn default() -> Self {
        DataLoadingOptions {
            has_network_access: true,
            has_file_access: false,
            base_url: DEFAULT_BASE_URL.to_string(),
            allowed_base_urls: vec![],
            allowed_base_datadirs: vec![],
        }
    }
}

#[derive(serde::Serialize)]
struct VegaLoaderOpts {
    has_network_access: bool,
    has_file_access: bool,
    base_url: String,
}

#[op2]
#[string]
fn op_vega_loader_opts(#[bigint] cache_id: u64) -> Result<String, AnyError> {
    debug!("Want to get vega loader options");
    let opts = DATALOADING_OPTIONS.get(&cache_id).unwrap();
    let data_loading_options = opts.read().expect("Failed access the data loader options");

    let vega_loader_opts = data_loading_options.vegaloader_opts();

    // We return a serialized JSON object with the data loading options.
    serde_json::to_string(&vega_loader_opts).map_err(AnyError::from)
}

#[op2(async)]
#[string]
async fn op_fetch_url(#[bigint] cache_id: u64, #[string] url: String) -> Result<String, AnyError> {
    debug!("Want to fetch url: {}", url);
    // Take a read lock on the DATALOADING_OPTIONS and check if network access is allowed
    let opts = DATALOADING_OPTIONS.get(&cache_id).unwrap();
    let data_loading_options = opts.read().expect("Failed access the data loader options");
    if !data_loading_options.has_network_access {
        bail!("Network access not allowed")
    }

    let mut base_url_str = data_loading_options.base_url.clone();
    if !base_url_str.ends_with('/') {
        // Prepare URL so that the subsequent join doesn't override the last part of the base URL
        base_url_str = format!("{}/", base_url_str);
    }
    let base_url = url::Url::parse(base_url_str.as_str()).expect("Failed to parse base URL");

    debug!(
        "Allowed base urls: {:?}",
        data_loading_options.allowed_base_urls
    );

    match url::Url::parse(&url) {
        Ok(req_url) => {
            // We have an absolute URL. Check if it is allowed.
            if data_loading_options.allowed_base_urls.is_empty() {
                // If we don't have an allow-list of base URLs, allow everything.
                return fetch_url(req_url.to_string()).await;
            }

            // If the url starts with a substring in the allowed_base_urls_json, fetch the url
            for allowed_base_url in &data_loading_options.allowed_base_urls {
                if url.starts_with(allowed_base_url) {
                    return fetch_url(req_url.to_string()).await;
                }
            }
        }
        Err(_) => {
            // The requested URL is not a valid absolute URL.
            // Try to resolve it against the default base URL or valid base URLs.
            let req_url = base_url
                .join(&url)
                .expect("Failed to construct a valid URL");

            if let Ok(v) = fetch_url(req_url.to_string()).await {
                return Ok(v);
            } else {
                for allowed_base_url in &data_loading_options.allowed_base_urls {
                    let req_url = url::Url::parse(allowed_base_url)
                        .expect("Failed to parse allowed base URL")
                        .join(&url)
                        .expect("Failed to construct a valid URL");
                    if let Ok(v) = fetch_url(req_url.to_string()).await {
                        return Ok(v);
                    }
                }
            }
        }
    }
    bail!("External data url not allowed: {}", url)

    // Otherwise, return an error saying that the url is not allowed
}

async fn fetch_url(url: String) -> Result<String, AnyError> {
    trace!("Fetching url: {}", url);
    let client = reqwest::Client::new();
    let timeout_duration = Duration::from_secs(10);
    let resp = client.get(&url).timeout(timeout_duration).send().await?;
    if resp.status() != reqwest::StatusCode::OK {
        bail!("Failed to fetch url: {} - {}", url, resp.status());
    }
    let text = resp.text().await?;
    Ok(text)
}

#[op2(async)]
#[string]
async fn op_read_file(#[bigint] cache_id: u64, #[string] path: String) -> Result<String, AnyError> {
    debug!("Want to read file: {}", path);
    // Take a read lock on the DATALOADING_OPTIONS and check if file access is allowed
    let opts = DATALOADING_OPTIONS.get(&cache_id).unwrap();
    let data_loading_options = opts.read().expect("Failed access the data loader options");

    if !data_loading_options.has_file_access {
        bail!("File access not allowed")
    }

    debug!(
        "Allowed base datadirs: {:?}",
        data_loading_options.allowed_base_datadirs
    );

    if data_loading_options.allowed_base_datadirs.is_empty() {
        bail!("No allowed base datadirs provided")
    }

    // Iterate over the allowed_base_datadirs and check if the path starts with any of them
    for base_datadir in &data_loading_options.allowed_base_datadirs {
        let pb_path = PathBuf::from_str(path.as_str()).expect("Invalid path");
        let sanitized_path = sanitize_path(pb_path)?;

        if sanitized_path.is_absolute() {
            if sanitized_path.starts_with(base_datadir) {
                return read_file(sanitized_path).await;
            } else {
                // Path not allowed, keep iterating
                continue;
            }
        } else {
            // Join the base datadir with the path and check if the file exists
            let joined_path = sanitize_path(base_datadir.join(sanitized_path))?;
            if joined_path.exists() {
                return read_file(joined_path).await;
            } else {
                // File not found, keep iterating
                continue;
            }
        }
    }

    bail!("File not found or not allowed: {}", path)
}

async fn read_file(path: PathBuf) -> Result<String, AnyError> {
    trace!("Reading file: {:?}", path);
    let file_content = tokio::fs::read_to_string(path).await?;
    Ok(file_content)
}

fn sanitize_path(path: PathBuf) -> Result<PathBuf, AnyError> {
    use std::path;

    let mut sanitized_path_parts = Vec::new();

    for part in path.iter() {
        if part == "." {
            // Skip
        } else if part.to_string_lossy() == path::MAIN_SEPARATOR.to_string()
            && sanitized_path_parts.is_empty()
        {
            sanitized_path_parts.push(part);
        } else if part == ".." {
            match sanitized_path_parts.pop() {
                Some(separator)
                    if separator.to_string_lossy() == path::MAIN_SEPARATOR.to_string() =>
                {
                    bail!("Path traversal reaching beyond root of relative path")
                }
                Some(_) => {}
                None => bail!("Path traversal reaching beyond root of relative path"),
            }
        } else {
            sanitized_path_parts.push(part);
        }
    }

    Ok(PathBuf::from_iter(sanitized_path_parts))
}

#[cfg(test)]
mod tests_path_sanitizer {
    use super::*;

    #[test]
    fn remove_path_encoded_traversal() {
        let p = PathBuf::from_str("bla/foo/../../path").expect("infallible");
        let got = sanitize_path(p).unwrap();

        assert_eq!(got.to_str().unwrap(), "path");
    }

    #[test]
    fn remove_path_encoded_traversal_with_filename() {
        let p = PathBuf::from_str("bla/foo/../../path/baz.json").expect("infallible");
        let got = sanitize_path(p).unwrap();

        assert_eq!(got.to_str().unwrap(), "path/baz.json");
    }

    #[test]
    fn remove_path_encoded_traversal_respect_root() {
        let p = PathBuf::from_str("/bla/foo/../path").expect("infallible");
        let got = sanitize_path(p).unwrap();

        assert_eq!(got.to_str().unwrap(), "/bla/path");
    }

    #[test]
    fn remove_path_encoded_traversal_overreaching() {
        let p = PathBuf::from_str("foo/../../path").expect("infallible");
        assert!(sanitize_path(p).is_err());
    }

    #[test]
    fn remove_path_encoded_traversal_overreaching_local() {
        let p = PathBuf::from_str("./foo/../../path").expect("infallible");
        let x = sanitize_path(p);
        assert!(x.is_err());
    }

    #[test]
    fn remove_path_encoded_traversal_overreaching_local_mid_path() {
        let p = PathBuf::from_str("foo/./bar/../../../path").expect("infallible");
        let x = sanitize_path(p);
        assert!(x.is_err());
    }

    #[test]
    fn remove_path_encoded_traversal_overreaching_beyond_root() {
        let p = PathBuf::from_str("/foo/../../path").expect("infallible");
        let x = sanitize_path(p);
        assert!(x.is_err());
    }
}

#[cfg(test)]
mod tests_load_custom_dataloader {
    use super::*;
    use crate::jsworker;
    use std::io::Write;

    struct TestFile {
        name: String,
        content: Vec<String>,
    }

    impl TestFile {
        fn write(&self, dir: &tempfile::TempDir) -> PathBuf {
            let file_path = dir.path().join(&self.name);
            let mut file = std::fs::File::create(&file_path).unwrap();
            for line in &self.content {
                writeln!(file, "{}", line).unwrap();
            }
            file_path
        }
    }

    fn prepare_default_test_file() -> TestFile {
        TestFile {
            name: "seattle-weather.csv".into(),
            content: vec![
                "date,precipitation,temp_max,temp_min,wind,weather".into(),
                "2024-01-01,0.0,12.8,5.0,4.7,sun".into(),
            ],
        }
    }

    async fn prepare_custom_loader_test(
        dir: &tempfile::TempDir,
        dl_options: DataLoadingOptions,
        test_files: Vec<TestFile>,
    ) -> jsworker::Worker {
        env_logger::try_init().ok();

        for test_file in test_files {
            test_file.write(dir);
        }

        prepare_default_test_file().write(dir);

        let extensions = vec![vl_convert_data_loader_runtime::init_ops()];
        let mut worker = jsworker::Worker::try_new(extensions).await.unwrap();
        worker.init_dataloader(dl_options).await.unwrap();

        worker
            .execute_script(
                "ext:<anon>",
                deno_core::FastString::from_static(&DATALOADER_JS_SCRIPT),
            )
            .unwrap();
        worker.run_event_loop(false).await.unwrap();

        worker
    }

    fn assert_common_head<T: PartialEq + std::fmt::Debug>(a: Vec<T>, b: Vec<T>) {
        let min_len = a.len().min(b.len());
        assert_eq!(
            &a[..min_len],
            &b[..min_len],
            "Vectors do not match in the prefix of length {}",
            min_len
        );
    }

    async fn test(
        tmp_dir: &tempfile::TempDir,
        dl_options: DataLoadingOptions,
        path: &str,
        expected: Option<Vec<&str>>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut worker =
            prepare_custom_loader_test(&tmp_dir, dl_options.clone(), Default::default()).await;

        let dataloader_str = r#"
                let cl = custom_loader();
                let fileAccess = cl.fileAccess;
                let httpAccess = cl.httpAccess;
                var loaded_data;
            "#;
        worker
            .execute_script(
                "ext:<anon>",
                deno_core::FastString::from_static(dataloader_str),
            )
            .unwrap();
        worker.run_event_loop(false).await.unwrap();

        let has_file_access = worker.execute_script_to_json("fileAccess").await.unwrap();
        assert_eq!(has_file_access, dl_options.clone().has_file_access);

        let has_http_access = worker.execute_script_to_json("httpAccess").await.unwrap();
        assert_eq!(has_http_access, dl_options.clone().has_network_access);

        let script_load_http = format!(
            r#"
            cl.load("{path}").then(data => {{
                loaded_data = data;
            }}).catch(err => {{
                throw new Error(err.message);
            }});
            "#,
            path = path
        );

        worker
            .execute_script("ext:<anon>", deno_core::FastString::from(script_load_http))
            .unwrap();
        match worker.run_event_loop(false).await {
            Ok(_) => {
                if let Some(expected) = expected {
                    let data_from_http =
                        worker.execute_script_to_json("loaded_data").await.unwrap();
                    let data_lines: Vec<&str> =
                        data_from_http.as_str().unwrap().split('\n').collect();
                    assert_common_head(data_lines, expected);
                } else {
                    panic!("Expected an error, but got success");
                }
            }
            Err(err) => {
                if expected.is_some() {
                    panic!("Expected success, but got an error {}", err.to_string());
                }
            }
        }
        Ok(())
    }

    #[tokio::test]
    async fn test_all_disabled_err_on_http() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: false,
            has_file_access: false,
            ..Default::default()
        };
        let path = "https://vega.github.io/vega-datasets/data/seattle-weather.csv";

        test(&tmp_dir, dl_options, path, None).await.unwrap();
    }

    #[tokio::test]
    async fn test_all_disabled_err_on_file() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: false,
            has_file_access: false,
            ..Default::default()
        };
        let tmp_file_path = tmp_dir.path().join("seattle-weather.csv");
        let path = format!("file://{}", tmp_file_path.to_str().unwrap());

        test(&tmp_dir, dl_options, &path, None).await.unwrap();
    }

    #[tokio::test]
    async fn test_only_http_absolute_url_under_base_url() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: true,
            has_file_access: false,
            ..Default::default()
        };
        let path = "https://vega.github.io/vega-datasets/data/seattle-weather.csv";
        let expected = Some(vec![
            "date,precipitation,temp_max,temp_min,wind,weather",
            "2012-01-01,0.0,12.8,5.0,4.7,drizzle",
        ]);

        test(&tmp_dir, dl_options, path, expected).await.unwrap();
    }

    #[tokio::test]
    async fn test_only_http_relative_on_default_base_url() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: true,
            has_file_access: false,
            ..Default::default()
        };
        let path = "data/seattle-weather.csv";
        let expected = Some(vec![
            "date,precipitation,temp_max,temp_min,wind,weather",
            "2012-01-01,0.0,12.8,5.0,4.7,drizzle",
        ]);

        test(&tmp_dir, dl_options, path, expected).await.unwrap();
    }

    #[tokio::test]
    async fn test_only_http_full_url_without_restrictions_on_allowed_baseurls() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: true,
            has_file_access: false,
            ..Default::default()
        };
        let path =
            "https://raw.githubusercontent.com/vega/vega-datasets/master/data/seattle-weather.csv";
        let expected = Some(vec![
            "date,precipitation,temp_max,temp_min,wind,weather",
            "2012-01-01,0.0,12.8,5.0,4.7,drizzle",
        ]);

        test(&tmp_dir, dl_options, path, expected).await.unwrap();
    }

    #[tokio::test]
    async fn test_only_http_err_on_wrong_url() {
        for path in [
            "https://vega.github.iox/vega-datasets/data/seattle-weather.csv",
            "https://vega.github.io/vega-datasets/data/seattle-weather_wrong_filename.csv",
        ] {
            let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

            let dl_options = DataLoadingOptions {
                has_network_access: true,
                has_file_access: false,
                ..Default::default()
            };

            test(&tmp_dir, dl_options, path, None).await.unwrap();
        }
    }

    #[tokio::test]
    async fn test_only_http_with_allowed_urls_absolute_url() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: true,
            has_file_access: false,
            allowed_base_urls: vec![
                "https://raw.githubusercontent.com/vega/vega-datasets".to_string()
            ],
            ..Default::default()
        };
        let path =
            "https://raw.githubusercontent.com/vega/vega-datasets/master/data/seattle-weather.csv";
        let expected = Some(vec![
            "date,precipitation,temp_max,temp_min,wind,weather",
            "2012-01-01,0.0,12.8,5.0,4.7,drizzle",
        ]);

        test(&tmp_dir, dl_options, path, expected).await.unwrap();
    }

    #[tokio::test]
    async fn test_only_http_with_allowed_urls_absolute_url_err() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: true,
            has_file_access: false,
            allowed_base_urls: vec![
                "https://raw.githubusercontent.com/vega/vega-datasets".to_string()
            ],
            ..Default::default()
        };
        let path = "https://vega.github.io/vega-datasets/data/seattle-weather.csv";

        test(&tmp_dir, dl_options, path, None).await.unwrap();
    }

    #[tokio::test]
    async fn test_only_http_relative_on_allowed_base_url() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: true,
            has_file_access: false,
            allowed_base_urls: vec![
                "https://raw.githubusercontent.com/rmcelreath/rethinking/master/".to_string(),
            ],
            ..Default::default()
        };
        let path = "data/Kline.csv";
        let expected = Some(vec!["culture;population;contact;total_tools;mean_TU\r"]);

        test(&tmp_dir, dl_options, path, expected).await.unwrap();
    }

    #[tokio::test]
    async fn test_only_http_err_on_file() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: true,
            has_file_access: false,
            ..Default::default()
        };
        let tmp_file_path = tmp_dir.path().join("seattle-weather.csv");
        let path = format!("file://{}", tmp_file_path.to_str().unwrap());

        test(&tmp_dir, dl_options, &path, None).await.unwrap();
    }

    #[tokio::test]
    async fn test_only_file_err_on_absolute_url_under_base_url() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: false,
            has_file_access: true,
            ..Default::default()
        };
        let path = "https://vega.github.io/vega-datasets/data/seattle-weather.csv";

        test(&tmp_dir, dl_options, path, None).await.unwrap();
    }

    #[tokio::test]
    async fn test_only_file_full_path_with_file_schema_err_because_no_allowed_dirs() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: false,
            has_file_access: true,
            ..Default::default()
        };
        let tmp_file_path = tmp_dir.path().join("seattle-weather.csv");
        let path = format!("file://{}", tmp_file_path.to_str().unwrap());

        test(&tmp_dir, dl_options, &path, None).await.unwrap();
    }

    #[tokio::test]
    async fn test_only_file_full_path_with_file_schema() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: false,
            has_file_access: true,
            allowed_base_datadirs: vec![tmp_dir.path().to_path_buf()],
            ..Default::default()
        };
        let tmp_file_path = tmp_dir.path().join("seattle-weather.csv");
        let path = format!("file://{}", tmp_file_path.to_str().unwrap());

        let expected = Some(vec![
            "date,precipitation,temp_max,temp_min,wind,weather",
            "2024-01-01,0.0,12.8,5.0,4.7,sun",
        ]);

        test(&tmp_dir, dl_options, &path, expected).await.unwrap();
    }

    #[tokio::test]
    async fn test_only_file_full_path() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: false,
            has_file_access: true,
            allowed_base_datadirs: vec![tmp_dir.path().to_path_buf()],
            ..Default::default()
        };
        let tmp_file_path = tmp_dir.path().join("seattle-weather.csv");
        let path = format!("{}", tmp_file_path.to_str().unwrap());

        let expected = Some(vec![
            "date,precipitation,temp_max,temp_min,wind,weather",
            "2024-01-01,0.0,12.8,5.0,4.7,sun",
        ]);

        test(&tmp_dir, dl_options, &path, expected).await.unwrap();
    }

    #[tokio::test]
    async fn test_only_file_relative_path() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: false,
            has_file_access: true,
            allowed_base_datadirs: vec![tmp_dir.path().to_path_buf()],
            ..Default::default()
        };
        let path = "seattle-weather.csv";

        let expected = Some(vec![
            "date,precipitation,temp_max,temp_min,wind,weather",
            "2024-01-01,0.0,12.8,5.0,4.7,sun",
        ]);

        test(&tmp_dir, dl_options, &path, expected).await.unwrap();
    }

    #[tokio::test]
    async fn test_only_file_err_on_missing_file() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: false,
            has_file_access: true,
            allowed_base_datadirs: vec![tmp_dir.path().to_path_buf()],
            ..Default::default()
        };
        let path = "amsterdam-weather.csv";

        test(&tmp_dir, dl_options, &path, None).await.unwrap();
    }

    #[tokio::test]
    async fn test_http_and_file_relative_path_exists_in_both_returns_file() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: true,
            has_file_access: true,
            allowed_base_urls: vec!["https://vega.github.io/vega-datasets/data/".to_string()],
            allowed_base_datadirs: vec![tmp_dir.path().to_path_buf()],
            ..Default::default()
        };
        let path = "seattle-weather.csv";

        let expected = Some(vec![
            "date,precipitation,temp_max,temp_min,wind,weather",
            "2024-01-01,0.0,12.8,5.0,4.7,sun",
        ]);

        test(&tmp_dir, dl_options, &path, expected).await.unwrap();
    }

    #[tokio::test]
    async fn test_http_and_file_full_path_no_file_schema() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: true,
            has_file_access: true,
            allowed_base_urls: vec!["https://vega.github.io/vega-datasets/data/".to_string()],
            allowed_base_datadirs: vec![tmp_dir.path().to_path_buf()],
            ..Default::default()
        };
        let tmp_file_path = tmp_dir.path().join("seattle-weather.csv");
        let path = format!("{}", tmp_file_path.to_str().unwrap());

        let expected = Some(vec![
            "date,precipitation,temp_max,temp_min,wind,weather",
            "2024-01-01,0.0,12.8,5.0,4.7,sun",
        ]);

        test(&tmp_dir, dl_options, &path, expected).await.unwrap();
    }

    #[tokio::test]
    async fn test_http_and_file_full_path_with_file_schema() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: true,
            has_file_access: true,
            allowed_base_urls: vec!["https://vega.github.io/vega-datasets/data/".to_string()],
            allowed_base_datadirs: vec![tmp_dir.path().to_path_buf()],
            ..Default::default()
        };
        let tmp_file_path = tmp_dir.path().join("seattle-weather.csv");
        let path = format!("file://{}", tmp_file_path.to_str().unwrap());

        let expected = Some(vec![
            "date,precipitation,temp_max,temp_min,wind,weather",
            "2024-01-01,0.0,12.8,5.0,4.7,sun",
        ]);

        test(&tmp_dir, dl_options, &path, expected).await.unwrap();
    }

    #[tokio::test]
    async fn test_http_and_file_full_url() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: true,
            has_file_access: true,
            allowed_base_urls: vec!["https://vega.github.io/vega-datasets/data/".to_string()],
            allowed_base_datadirs: vec![tmp_dir.path().to_path_buf()],
            ..Default::default()
        };
        let path = "https://vega.github.io/vega-datasets/data/seattle-weather.csv";

        let expected = Some(vec![
            "date,precipitation,temp_max,temp_min,wind,weather",
            "2012-01-01,0.0,12.8,5.0,4.7,drizzle",
        ]);

        test(&tmp_dir, dl_options, &path, expected).await.unwrap();
    }

    #[tokio::test]
    async fn test_http_and_file_no_match() {
        let tmp_dir: tempfile::TempDir = tempfile::tempdir().unwrap();

        let dl_options = DataLoadingOptions {
            has_network_access: true,
            has_file_access: true,
            allowed_base_urls: vec!["https://vega.github.io/vega-datasets/data/".to_string()],
            allowed_base_datadirs: vec![tmp_dir.path().to_path_buf()],
            ..Default::default()
        };
        let path = "dummy_missing_file.csv";

        test(&tmp_dir, dl_options, &path, None).await.unwrap();
    }
}
