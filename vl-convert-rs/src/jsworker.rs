use std::path::Path;
use std::rc::Rc;

use deno_core::anyhow::anyhow;
use deno_core::anyhow::bail;
use deno_core::error::AnyError;
use deno_core::serde_v8;
use deno_core::v8;
use deno_core::Extension;
use deno_runtime::deno_permissions::Permissions;
use deno_runtime::deno_permissions::PermissionsContainer;
use deno_runtime::worker::MainWorker;
use deno_runtime::worker::WorkerOptions;

use crate::data_loading::{self, DataLoadingOptions};
use crate::module_loader::VlConvertModuleLoader;

pub struct Worker {
    worker: MainWorker,
    dl_options_key: Option<u64>,
}

impl Worker {
    pub async fn try_new(extensions: Vec<Extension>) -> Result<Self, AnyError> {
        let module_loader = Rc::new(VlConvertModuleLoader);

        let options = WorkerOptions {
            extensions,
            module_loader: module_loader.clone(),
            ..Default::default()
        };

        let main_module =
            deno_core::resolve_path("vl-convert-rs.js", Path::new(env!("CARGO_MANIFEST_DIR")))?;

        let permissions = PermissionsContainer::new(Permissions::none_without_prompt());

        let mut worker =
            MainWorker::bootstrap_from_options(main_module.clone(), permissions, options);

        worker.execute_main_module(&main_module).await?;
        worker.run_event_loop(false).await?;

        let this = Worker {
            worker,
            dl_options_key: None,
        };

        Ok(this)
    }

    pub async fn init_dataloader(
        &mut self,
        dl_options: DataLoadingOptions,
    ) -> Result<u64, AnyError> {
        let dl_options_key = data_loading::DATALOADING_OPTIONS.insert(dl_options.clone());

        let dl_options_key_script = format!("const dl_options_key = {};", dl_options_key);
        self.execute_script("ext:<anon>", dl_options_key_script.into())?;
        self.run_event_loop(false).await?;

        self.dl_options_key = Some(dl_options_key);

        Ok(dl_options_key)
    }

    pub async fn execute_script_to_json(
        &mut self,
        script: &str,
    ) -> Result<serde_json::Value, AnyError> {
        let code = script.to_string();
        let res = self.worker.js_runtime.execute_script("ext:<anon>", code)?;

        self.worker.run_event_loop(false).await?;

        let scope = &mut self.worker.js_runtime.handle_scope();
        let local = v8::Local::new(scope, res);

        // Deserialize a `v8` object into a Rust type using `serde_v8`,
        // in this case deserialize to a JSON `Value`.
        let deserialized_value = serde_v8::from_v8::<serde_json::Value>(scope, local);
        deserialized_value.map_err(|err| {
            anyhow!(
                "Failed to deserialize JavaScript value: {}",
                err.to_string()
            )
        })
    }

    pub async fn execute_script_to_string(&mut self, script: &str) -> Result<String, AnyError> {
        let code = script.to_string();
        let res = self.worker.js_runtime.execute_script("ext:<anon>", code)?;

        self.worker.run_event_loop(false).await?;

        let scope = &mut self.worker.js_runtime.handle_scope();
        let local = v8::Local::new(scope, res);

        // Deserialize a `v8` object into a Rust type using `serde_v8`,
        // in this case deserialize to a JSON `Value`.
        let deserialized_value = serde_v8::from_v8::<serde_json::Value>(scope, local);

        let value = match deserialized_value {
            Ok(value) => {
                let value = value.as_str();
                value.unwrap().to_string()
            }
            Err(err) => bail!("{}", err.to_string()),
        };

        Ok(value)
    }
}

impl Drop for Worker {
    // Cleanup the data loading options from the cache when the worker is dropped.
    fn drop(&mut self) {
        if let Some(dl_options_key) = self.dl_options_key {
            data_loading::DATALOADING_OPTIONS.remove(&dl_options_key);
        }
    }
}

impl std::ops::Deref for Worker {
    type Target = MainWorker;

    fn deref(&self) -> &Self::Target {
        &self.worker
    }
}

impl std::ops::DerefMut for Worker {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.worker
    }
}
