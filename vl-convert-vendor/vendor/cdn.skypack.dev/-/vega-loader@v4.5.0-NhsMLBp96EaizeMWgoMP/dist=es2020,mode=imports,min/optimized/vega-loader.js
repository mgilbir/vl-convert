import{toBoolean as mr,toNumber as J,toDate as gr,toString as Ar,identity as V,hasOwnProperty as $,error as T,extend as C,isFunction as H,stringValue as q,field as Rr,isObject as Tr,isArray as Ir,isIterable as Br}from"/-/vega-util@v1.17.0-uRskU0IBL2vWCP4Va8OC/dist=es2020,mode=imports,min/optimized/vega-util.js";import{dsvFormat as Ur}from"/-/d3-dsv@v3.0.1-u1xCRjaLJc0qqv1Z5ERe/dist=es2020,mode=imports,min/optimized/d3-dsv.js";import{feature as _r,mesh as dr}from"/-/topojson-client@v3.1.0-fyhI24JwGwsqazuuSEoq/dist=es2020,mode=imports,min/optimized/topojson-client.js";import{timeFormatDefaultLocale as Dr}from"/-/vega-format@v1.1.0-B5FcaDDiQ30f8APLWM4h/dist=es2020,mode=imports,min/optimized/vega-format.js";var G=typeof global!="undefined"?global:typeof self!="undefined"?self:typeof window!="undefined"?window:{},g=[],F=[],vr=typeof Uint8Array!="undefined"?Uint8Array:Array,Y=!1;function Z(){Y=!0;for(var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r=0,i=n.length;r<i;++r)g[r]=n[r],F[n.charCodeAt(r)]=r;F["-".charCodeAt(0)]=62,F["_".charCodeAt(0)]=63}function Pr(n){Y||Z();var r,i,e,t,o,u,h=n.length;if(h%4>0)throw new Error("Invalid string. Length must be a multiple of 4");o=n[h-2]==="="?2:n[h-1]==="="?1:0,u=new vr(h*3/4-o),e=o>0?h-4:h;var s=0;for(r=0,i=0;r<e;r+=4,i+=3)t=F[n.charCodeAt(r)]<<18|F[n.charCodeAt(r+1)]<<12|F[n.charCodeAt(r+2)]<<6|F[n.charCodeAt(r+3)],u[s++]=t>>16&255,u[s++]=t>>8&255,u[s++]=t&255;return o===2?(t=F[n.charCodeAt(r)]<<2|F[n.charCodeAt(r+1)]>>4,u[s++]=t&255):o===1&&(t=F[n.charCodeAt(r)]<<10|F[n.charCodeAt(r+1)]<<4|F[n.charCodeAt(r+2)]>>2,u[s++]=t>>8&255,u[s++]=t&255),u}function Sr(n){return g[n>>18&63]+g[n>>12&63]+g[n>>6&63]+g[n&63]}function Cr(n,r,i){for(var e,t=[],o=r;o<i;o+=3)e=(n[o]<<16)+(n[o+1]<<8)+n[o+2],t.push(Sr(e));return t.join("")}function X(n){Y||Z();for(var r,i=n.length,e=i%3,t="",o=[],u=16383,h=0,s=i-e;h<s;h+=u)o.push(Cr(n,h,h+u>s?s:h+u));return e===1?(r=n[i-1],t+=g[r>>2],t+=g[r<<4&63],t+="=="):e===2&&(r=(n[i-2]<<8)+n[i-1],t+=g[r>>10],t+=g[r>>4&63],t+=g[r<<2&63],t+="="),o.push(t),o.join("")}function U(n,r,i,e,t){var o,u,h=t*8-e-1,s=(1<<h)-1,a=s>>1,l=-7,c=i?t-1:0,y=i?-1:1,x=n[r+c];for(c+=y,o=x&(1<<-l)-1,x>>=-l,l+=h;l>0;o=o*256+n[r+c],c+=y,l-=8);for(u=o&(1<<-l)-1,o>>=-l,l+=e;l>0;u=u*256+n[r+c],c+=y,l-=8);if(o===0)o=1-a;else{if(o===s)return u?NaN:(x?-1:1)*Infinity;u=u+Math.pow(2,e),o=o-a}return(x?-1:1)*u*Math.pow(2,o-e)}function Q(n,r,i,e,t,o){var u,h,s,a=o*8-t-1,l=(1<<a)-1,c=l>>1,y=t===23?Math.pow(2,-24)-Math.pow(2,-77):0,x=e?0:o-1,w=e?1:-1,B=r<0||r===0&&1/r<0?1:0;for(r=Math.abs(r),isNaN(r)||r===Infinity?(h=isNaN(r)?1:0,u=l):(u=Math.floor(Math.log(r)/Math.LN2),r*(s=Math.pow(2,-u))<1&&(u--,s*=2),u+c>=1?r+=y/s:r+=y*Math.pow(2,1-c),r*s>=2&&(u++,s/=2),u+c>=l?(h=0,u=l):u+c>=1?(h=(r*s-1)*Math.pow(2,t),u=u+c):(h=r*Math.pow(2,c-1)*Math.pow(2,t),u=0));t>=8;n[i+x]=h&255,x+=w,h/=256,t-=8);for(u=u<<t|h,a+=t;a>0;n[i+x]=u&255,x+=w,u/=256,a-=8);n[i+x-w]|=B*128}var Yr={}.toString,K=Array.isArray||function(n){return Yr.call(n)=="[object Array]"};/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */var Mr=50;f.TYPED_ARRAY_SUPPORT=G.TYPED_ARRAY_SUPPORT!==void 0?G.TYPED_ARRAY_SUPPORT:!0;function M(){return f.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function R(n,r){if(M()<r)throw new RangeError("Invalid typed array length");return f.TYPED_ARRAY_SUPPORT?(n=new Uint8Array(r),n.__proto__=f.prototype):(n===null&&(n=new f(r)),n.length=r),n}function f(n,r,i){if(!f.TYPED_ARRAY_SUPPORT&&!(this instanceof f))return new f(n,r,i);if(typeof n=="number"){if(typeof r=="string")throw new Error("If encoding is specified then the first argument must be a string");return N(this,n)}return b(this,n,r,i)}f.poolSize=8192,f._augment=function(n){return n.__proto__=f.prototype,n};function b(n,r,i,e){if(typeof r=="number")throw new TypeError('"value" argument must not be a number');return typeof ArrayBuffer!="undefined"&&r instanceof ArrayBuffer?Lr(n,r,i,e):typeof r=="string"?kr(n,r,i):Or(n,r)}f.from=function(n,r,i){return b(null,n,r,i)},f.TYPED_ARRAY_SUPPORT&&(f.prototype.__proto__=Uint8Array.prototype,f.__proto__=Uint8Array);function rr(n){if(typeof n!="number")throw new TypeError('"size" argument must be a number');if(n<0)throw new RangeError('"size" argument must not be negative')}function Nr(n,r,i,e){return rr(r),r<=0?R(n,r):i!==void 0?typeof e=="string"?R(n,r).fill(i,e):R(n,r).fill(i):R(n,r)}f.alloc=function(n,r,i){return Nr(null,n,r,i)};function N(n,r){if(rr(r),n=R(n,r<0?0:L(r)|0),!f.TYPED_ARRAY_SUPPORT)for(var i=0;i<r;++i)n[i]=0;return n}f.allocUnsafe=function(n){return N(null,n)},f.allocUnsafeSlow=function(n){return N(null,n)};function kr(n,r,i){if((typeof i!="string"||i==="")&&(i="utf8"),!f.isEncoding(i))throw new TypeError('"encoding" must be a valid string encoding');var e=ir(r,i)|0;n=R(n,e);var t=n.write(r,i);return t!==e&&(n=n.slice(0,t)),n}function k(n,r){var i=r.length<0?0:L(r.length)|0;n=R(n,i);for(var e=0;e<i;e+=1)n[e]=r[e]&255;return n}function Lr(n,r,i,e){if(r.byteLength,i<0||r.byteLength<i)throw new RangeError("'offset' is out of bounds");if(r.byteLength<i+(e||0))throw new RangeError("'length' is out of bounds");return i===void 0&&e===void 0?r=new Uint8Array(r):e===void 0?r=new Uint8Array(r,i):r=new Uint8Array(r,i,e),f.TYPED_ARRAY_SUPPORT?(n=r,n.__proto__=f.prototype):n=k(n,r),n}function Or(n,r){if(A(r)){var i=L(r.length)|0;return n=R(n,i),n.length===0||r.copy(n,0,0,i),n}if(r){if(typeof ArrayBuffer!="undefined"&&r.buffer instanceof ArrayBuffer||"length"in r)return typeof r.length!="number"||ti(r.length)?R(n,0):k(n,r);if(r.type==="Buffer"&&K(r.data))return k(n,r.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function L(n){if(n>=M())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+M().toString(16)+" bytes");return n|0}f.isBuffer=oi;function A(n){return!!(n!=null&&n._isBuffer)}f.compare=function(r,i){if(!A(r)||!A(i))throw new TypeError("Arguments must be Buffers");if(r===i)return 0;for(var e=r.length,t=i.length,o=0,u=Math.min(e,t);o<u;++o)if(r[o]!==i[o]){e=r[o],t=i[o];break}return e<t?-1:t<e?1:0},f.isEncoding=function(r){switch(String(r).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},f.concat=function(r,i){if(!K(r))throw new TypeError('"list" argument must be an Array of Buffers');if(r.length===0)return f.alloc(0);var e;if(i===void 0)for(i=0,e=0;e<r.length;++e)i+=r[e].length;var t=f.allocUnsafe(i),o=0;for(e=0;e<r.length;++e){var u=r[e];if(!A(u))throw new TypeError('"list" argument must be an Array of Buffers');u.copy(t,o),o+=u.length}return t};function ir(n,r){if(A(n))return n.length;if(typeof ArrayBuffer!="undefined"&&typeof ArrayBuffer.isView=="function"&&(ArrayBuffer.isView(n)||n instanceof ArrayBuffer))return n.byteLength;typeof n!="string"&&(n=""+n);var i=n.length;if(i===0)return 0;for(var e=!1;;)switch(r){case"ascii":case"latin1":case"binary":return i;case"utf8":case"utf-8":case void 0:return D(n).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return i*2;case"hex":return i>>>1;case"base64":return cr(n).length;default:if(e)return D(n).length;r=(""+r).toLowerCase(),e=!0}}f.byteLength=ir;function Wr(n,r,i){var e=!1;if((r===void 0||r<0)&&(r=0),r>this.length)return"";if((i===void 0||i>this.length)&&(i=this.length),i<=0)return"";if(i>>>=0,r>>>=0,i<=r)return"";for(n||(n="utf8");;)switch(n){case"hex":return Xr(this,r,i);case"utf8":case"utf-8":return or(this,r,i);case"ascii":return Gr(this,r,i);case"latin1":case"binary":return Zr(this,r,i);case"base64":return Hr(this,r,i);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Qr(this,r,i);default:if(e)throw new TypeError("Unknown encoding: "+n);n=(n+"").toLowerCase(),e=!0}}f.prototype._isBuffer=!0;function I(n,r,i){var e=n[r];n[r]=n[i],n[i]=e}f.prototype.swap16=function(){var r=this.length;if(r%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var i=0;i<r;i+=2)I(this,i,i+1);return this},f.prototype.swap32=function(){var r=this.length;if(r%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var i=0;i<r;i+=4)I(this,i,i+3),I(this,i+1,i+2);return this},f.prototype.swap64=function(){var r=this.length;if(r%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var i=0;i<r;i+=8)I(this,i,i+7),I(this,i+1,i+6),I(this,i+2,i+5),I(this,i+3,i+4);return this},f.prototype.toString=function(){var r=this.length|0;return r===0?"":arguments.length===0?or(this,0,r):Wr.apply(this,arguments)},f.prototype.equals=function(r){if(!A(r))throw new TypeError("Argument must be a Buffer");return this===r?!0:f.compare(this,r)===0},f.prototype.inspect=function(){var r="",i=Mr;return this.length>0&&(r=this.toString("hex",0,i).match(/.{2}/g).join(" "),this.length>i&&(r+=" ... ")),"<Buffer "+r+">"},f.prototype.compare=function(r,i,e,t,o){if(!A(r))throw new TypeError("Argument must be a Buffer");if(i===void 0&&(i=0),e===void 0&&(e=r?r.length:0),t===void 0&&(t=0),o===void 0&&(o=this.length),i<0||e>r.length||t<0||o>this.length)throw new RangeError("out of range index");if(t>=o&&i>=e)return 0;if(t>=o)return-1;if(i>=e)return 1;if(i>>>=0,e>>>=0,t>>>=0,o>>>=0,this===r)return 0;for(var u=o-t,h=e-i,s=Math.min(u,h),a=this.slice(t,o),l=r.slice(i,e),c=0;c<s;++c)if(a[c]!==l[c]){u=a[c],h=l[c];break}return u<h?-1:h<u?1:0};function nr(n,r,i,e,t){if(n.length===0)return-1;if(typeof i=="string"?(e=i,i=0):i>2147483647?i=2147483647:i<-2147483648&&(i=-2147483648),i=+i,isNaN(i)&&(i=t?0:n.length-1),i<0&&(i=n.length+i),i>=n.length){if(t)return-1;i=n.length-1}else if(i<0)if(t)i=0;else return-1;if(typeof r=="string"&&(r=f.from(r,e)),A(r))return r.length===0?-1:er(n,r,i,e,t);if(typeof r=="number")return r=r&255,f.TYPED_ARRAY_SUPPORT&&typeof Uint8Array.prototype.indexOf=="function"?t?Uint8Array.prototype.indexOf.call(n,r,i):Uint8Array.prototype.lastIndexOf.call(n,r,i):er(n,[r],i,e,t);throw new TypeError("val must be string, number or Buffer")}function er(n,r,i,e,t){var o=1,u=n.length,h=r.length;if(e!==void 0&&(e=String(e).toLowerCase(),e==="ucs2"||e==="ucs-2"||e==="utf16le"||e==="utf-16le")){if(n.length<2||r.length<2)return-1;o=2,u/=2,h/=2,i/=2}function s(x,w){return o===1?x[w]:x.readUInt16BE(w*o)}var a;if(t){var l=-1;for(a=i;a<u;a++)if(s(n,a)===s(r,l===-1?0:a-l)){if(l===-1&&(l=a),a-l+1===h)return l*o}else l!==-1&&(a-=a-l),l=-1}else for(i+h>u&&(i=u-h),a=i;a>=0;a--){for(var c=!0,y=0;y<h;y++)if(s(n,a+y)!==s(r,y)){c=!1;break}if(c)return a}return-1}f.prototype.includes=function(r,i,e){return this.indexOf(r,i,e)!==-1},f.prototype.indexOf=function(r,i,e){return nr(this,r,i,e,!0)},f.prototype.lastIndexOf=function(r,i,e){return nr(this,r,i,e,!1)};function zr(n,r,i,e){i=Number(i)||0;var t=n.length-i;e?(e=Number(e),e>t&&(e=t)):e=t;var o=r.length;if(o%2!==0)throw new TypeError("Invalid hex string");e>o/2&&(e=o/2);for(var u=0;u<e;++u){var h=parseInt(r.substr(u*2,2),16);if(isNaN(h))return u;n[i+u]=h}return u}function jr(n,r,i,e){return v(D(r,n.length-i),n,i,e)}function tr(n,r,i,e){return v(ni(r),n,i,e)}function Jr(n,r,i,e){return tr(n,r,i,e)}function Vr(n,r,i,e){return v(cr(r),n,i,e)}function $r(n,r,i,e){return v(ei(r,n.length-i),n,i,e)}f.prototype.write=function(r,i,e,t){if(i===void 0)t="utf8",e=this.length,i=0;else if(e===void 0&&typeof i=="string")t=i,e=this.length,i=0;else if(isFinite(i))i=i|0,isFinite(e)?(e=e|0,t===void 0&&(t="utf8")):(t=e,e=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");var o=this.length-i;if((e===void 0||e>o)&&(e=o),r.length>0&&(e<0||i<0)||i>this.length)throw new RangeError("Attempt to write outside buffer bounds");t||(t="utf8");for(var u=!1;;)switch(t){case"hex":return zr(this,r,i,e);case"utf8":case"utf-8":return jr(this,r,i,e);case"ascii":return tr(this,r,i,e);case"latin1":case"binary":return Jr(this,r,i,e);case"base64":return Vr(this,r,i,e);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return $r(this,r,i,e);default:if(u)throw new TypeError("Unknown encoding: "+t);t=(""+t).toLowerCase(),u=!0}},f.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function Hr(n,r,i){return r===0&&i===n.length?X(n):X(n.slice(r,i))}function or(n,r,i){i=Math.min(n.length,i);for(var e=[],t=r;t<i;){var o=n[t],u=null,h=o>239?4:o>223?3:o>191?2:1;if(t+h<=i){var s,a,l,c;switch(h){case 1:o<128&&(u=o);break;case 2:s=n[t+1],(s&192)===128&&(c=(o&31)<<6|s&63,c>127&&(u=c));break;case 3:s=n[t+1],a=n[t+2],(s&192)===128&&(a&192)===128&&(c=(o&15)<<12|(s&63)<<6|a&63,c>2047&&(c<55296||c>57343)&&(u=c));break;case 4:s=n[t+1],a=n[t+2],l=n[t+3],(s&192)===128&&(a&192)===128&&(l&192)===128&&(c=(o&15)<<18|(s&63)<<12|(a&63)<<6|l&63,c>65535&&c<1114112&&(u=c))}}u===null?(u=65533,h=1):u>65535&&(u-=65536,e.push(u>>>10&1023|55296),u=56320|u&1023),e.push(u),t+=h}return qr(e)}var ur=4096;function qr(n){var r=n.length;if(r<=ur)return String.fromCharCode.apply(String,n);for(var i="",e=0;e<r;)i+=String.fromCharCode.apply(String,n.slice(e,e+=ur));return i}function Gr(n,r,i){var e="";i=Math.min(n.length,i);for(var t=r;t<i;++t)e+=String.fromCharCode(n[t]&127);return e}function Zr(n,r,i){var e="";i=Math.min(n.length,i);for(var t=r;t<i;++t)e+=String.fromCharCode(n[t]);return e}function Xr(n,r,i){var e=n.length;(!r||r<0)&&(r=0),(!i||i<0||i>e)&&(i=e);for(var t="",o=r;o<i;++o)t+=ii(n[o]);return t}function Qr(n,r,i){for(var e=n.slice(r,i),t="",o=0;o<e.length;o+=2)t+=String.fromCharCode(e[o]+e[o+1]*256);return t}f.prototype.slice=function(r,i){var e=this.length;r=~~r,i=i===void 0?e:~~i,r<0?(r+=e,r<0&&(r=0)):r>e&&(r=e),i<0?(i+=e,i<0&&(i=0)):i>e&&(i=e),i<r&&(i=r);var t;if(f.TYPED_ARRAY_SUPPORT)t=this.subarray(r,i),t.__proto__=f.prototype;else{var o=i-r;t=new f(o,void 0);for(var u=0;u<o;++u)t[u]=this[u+r]}return t};function p(n,r,i){if(n%1!==0||n<0)throw new RangeError("offset is not uint");if(n+r>i)throw new RangeError("Trying to access beyond buffer length")}f.prototype.readUIntLE=function(r,i,e){r=r|0,i=i|0,e||p(r,i,this.length);for(var t=this[r],o=1,u=0;++u<i&&(o*=256);)t+=this[r+u]*o;return t},f.prototype.readUIntBE=function(r,i,e){r=r|0,i=i|0,e||p(r,i,this.length);for(var t=this[r+--i],o=1;i>0&&(o*=256);)t+=this[r+--i]*o;return t},f.prototype.readUInt8=function(r,i){return i||p(r,1,this.length),this[r]},f.prototype.readUInt16LE=function(r,i){return i||p(r,2,this.length),this[r]|this[r+1]<<8},f.prototype.readUInt16BE=function(r,i){return i||p(r,2,this.length),this[r]<<8|this[r+1]},f.prototype.readUInt32LE=function(r,i){return i||p(r,4,this.length),(this[r]|this[r+1]<<8|this[r+2]<<16)+this[r+3]*16777216},f.prototype.readUInt32BE=function(r,i){return i||p(r,4,this.length),this[r]*16777216+(this[r+1]<<16|this[r+2]<<8|this[r+3])},f.prototype.readIntLE=function(r,i,e){r=r|0,i=i|0,e||p(r,i,this.length);for(var t=this[r],o=1,u=0;++u<i&&(o*=256);)t+=this[r+u]*o;return o*=128,t>=o&&(t-=Math.pow(2,8*i)),t},f.prototype.readIntBE=function(r,i,e){r=r|0,i=i|0,e||p(r,i,this.length);for(var t=i,o=1,u=this[r+--t];t>0&&(o*=256);)u+=this[r+--t]*o;return o*=128,u>=o&&(u-=Math.pow(2,8*i)),u},f.prototype.readInt8=function(r,i){return i||p(r,1,this.length),this[r]&128?(255-this[r]+1)*-1:this[r]},f.prototype.readInt16LE=function(r,i){i||p(r,2,this.length);var e=this[r]|this[r+1]<<8;return e&32768?e|4294901760:e},f.prototype.readInt16BE=function(r,i){i||p(r,2,this.length);var e=this[r+1]|this[r]<<8;return e&32768?e|4294901760:e},f.prototype.readInt32LE=function(r,i){return i||p(r,4,this.length),this[r]|this[r+1]<<8|this[r+2]<<16|this[r+3]<<24},f.prototype.readInt32BE=function(r,i){return i||p(r,4,this.length),this[r]<<24|this[r+1]<<16|this[r+2]<<8|this[r+3]},f.prototype.readFloatLE=function(r,i){return i||p(r,4,this.length),U(this,r,!0,23,4)},f.prototype.readFloatBE=function(r,i){return i||p(r,4,this.length),U(this,r,!1,23,4)},f.prototype.readDoubleLE=function(r,i){return i||p(r,8,this.length),U(this,r,!0,52,8)},f.prototype.readDoubleBE=function(r,i){return i||p(r,8,this.length),U(this,r,!1,52,8)};function E(n,r,i,e,t,o){if(!A(n))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>t||r<o)throw new RangeError('"value" argument is out of bounds');if(i+e>n.length)throw new RangeError("Index out of range")}f.prototype.writeUIntLE=function(r,i,e,t){if(r=+r,i=i|0,e=e|0,!t){var o=Math.pow(2,8*e)-1;E(this,r,i,e,o,0)}var u=1,h=0;for(this[i]=r&255;++h<e&&(u*=256);)this[i+h]=r/u&255;return i+e},f.prototype.writeUIntBE=function(r,i,e,t){if(r=+r,i=i|0,e=e|0,!t){var o=Math.pow(2,8*e)-1;E(this,r,i,e,o,0)}var u=e-1,h=1;for(this[i+u]=r&255;--u>=0&&(h*=256);)this[i+u]=r/h&255;return i+e},f.prototype.writeUInt8=function(r,i,e){return r=+r,i=i|0,e||E(this,r,i,1,255,0),f.TYPED_ARRAY_SUPPORT||(r=Math.floor(r)),this[i]=r&255,i+1};function _(n,r,i,e){r<0&&(r=65535+r+1);for(var t=0,o=Math.min(n.length-i,2);t<o;++t)n[i+t]=(r&255<<8*(e?t:1-t))>>>(e?t:1-t)*8}f.prototype.writeUInt16LE=function(r,i,e){return r=+r,i=i|0,e||E(this,r,i,2,65535,0),f.TYPED_ARRAY_SUPPORT?(this[i]=r&255,this[i+1]=r>>>8):_(this,r,i,!0),i+2},f.prototype.writeUInt16BE=function(r,i,e){return r=+r,i=i|0,e||E(this,r,i,2,65535,0),f.TYPED_ARRAY_SUPPORT?(this[i]=r>>>8,this[i+1]=r&255):_(this,r,i,!1),i+2};function d(n,r,i,e){r<0&&(r=4294967295+r+1);for(var t=0,o=Math.min(n.length-i,4);t<o;++t)n[i+t]=r>>>(e?t:3-t)*8&255}f.prototype.writeUInt32LE=function(r,i,e){return r=+r,i=i|0,e||E(this,r,i,4,4294967295,0),f.TYPED_ARRAY_SUPPORT?(this[i+3]=r>>>24,this[i+2]=r>>>16,this[i+1]=r>>>8,this[i]=r&255):d(this,r,i,!0),i+4},f.prototype.writeUInt32BE=function(r,i,e){return r=+r,i=i|0,e||E(this,r,i,4,4294967295,0),f.TYPED_ARRAY_SUPPORT?(this[i]=r>>>24,this[i+1]=r>>>16,this[i+2]=r>>>8,this[i+3]=r&255):d(this,r,i,!1),i+4},f.prototype.writeIntLE=function(r,i,e,t){if(r=+r,i=i|0,!t){var o=Math.pow(2,8*e-1);E(this,r,i,e,o-1,-o)}var u=0,h=1,s=0;for(this[i]=r&255;++u<e&&(h*=256);)r<0&&s===0&&this[i+u-1]!==0&&(s=1),this[i+u]=(r/h>>0)-s&255;return i+e},f.prototype.writeIntBE=function(r,i,e,t){if(r=+r,i=i|0,!t){var o=Math.pow(2,8*e-1);E(this,r,i,e,o-1,-o)}var u=e-1,h=1,s=0;for(this[i+u]=r&255;--u>=0&&(h*=256);)r<0&&s===0&&this[i+u+1]!==0&&(s=1),this[i+u]=(r/h>>0)-s&255;return i+e},f.prototype.writeInt8=function(r,i,e){return r=+r,i=i|0,e||E(this,r,i,1,127,-128),f.TYPED_ARRAY_SUPPORT||(r=Math.floor(r)),r<0&&(r=255+r+1),this[i]=r&255,i+1},f.prototype.writeInt16LE=function(r,i,e){return r=+r,i=i|0,e||E(this,r,i,2,32767,-32768),f.TYPED_ARRAY_SUPPORT?(this[i]=r&255,this[i+1]=r>>>8):_(this,r,i,!0),i+2},f.prototype.writeInt16BE=function(r,i,e){return r=+r,i=i|0,e||E(this,r,i,2,32767,-32768),f.TYPED_ARRAY_SUPPORT?(this[i]=r>>>8,this[i+1]=r&255):_(this,r,i,!1),i+2},f.prototype.writeInt32LE=function(r,i,e){return r=+r,i=i|0,e||E(this,r,i,4,2147483647,-2147483648),f.TYPED_ARRAY_SUPPORT?(this[i]=r&255,this[i+1]=r>>>8,this[i+2]=r>>>16,this[i+3]=r>>>24):d(this,r,i,!0),i+4},f.prototype.writeInt32BE=function(r,i,e){return r=+r,i=i|0,e||E(this,r,i,4,2147483647,-2147483648),r<0&&(r=4294967295+r+1),f.TYPED_ARRAY_SUPPORT?(this[i]=r>>>24,this[i+1]=r>>>16,this[i+2]=r>>>8,this[i+3]=r&255):d(this,r,i,!1),i+4};function fr(n,r,i,e,t,o){if(i+e>n.length)throw new RangeError("Index out of range");if(i<0)throw new RangeError("Index out of range")}function hr(n,r,i,e,t){return t||fr(n,r,i,4),Q(n,r,i,e,23,4),i+4}f.prototype.writeFloatLE=function(r,i,e){return hr(this,r,i,!0,e)},f.prototype.writeFloatBE=function(r,i,e){return hr(this,r,i,!1,e)};function sr(n,r,i,e,t){return t||fr(n,r,i,8),Q(n,r,i,e,52,8),i+8}f.prototype.writeDoubleLE=function(r,i,e){return sr(this,r,i,!0,e)},f.prototype.writeDoubleBE=function(r,i,e){return sr(this,r,i,!1,e)},f.prototype.copy=function(r,i,e,t){if(e||(e=0),!t&&t!==0&&(t=this.length),i>=r.length&&(i=r.length),i||(i=0),t>0&&t<e&&(t=e),t===e)return 0;if(r.length===0||this.length===0)return 0;if(i<0)throw new RangeError("targetStart out of bounds");if(e<0||e>=this.length)throw new RangeError("sourceStart out of bounds");if(t<0)throw new RangeError("sourceEnd out of bounds");t>this.length&&(t=this.length),r.length-i<t-e&&(t=r.length-i+e);var o=t-e,u;if(this===r&&e<i&&i<t)for(u=o-1;u>=0;--u)r[u+i]=this[u+e];else if(o<1e3||!f.TYPED_ARRAY_SUPPORT)for(u=0;u<o;++u)r[u+i]=this[u+e];else Uint8Array.prototype.set.call(r,this.subarray(e,e+o),i);return o},f.prototype.fill=function(r,i,e,t){if(typeof r=="string"){if(typeof i=="string"?(t=i,i=0,e=this.length):typeof e=="string"&&(t=e,e=this.length),r.length===1){var o=r.charCodeAt(0);o<256&&(r=o)}if(t!==void 0&&typeof t!="string")throw new TypeError("encoding must be a string");if(typeof t=="string"&&!f.isEncoding(t))throw new TypeError("Unknown encoding: "+t)}else typeof r=="number"&&(r=r&255);if(i<0||this.length<i||this.length<e)throw new RangeError("Out of range index");if(e<=i)return this;i=i>>>0,e=e===void 0?this.length:e>>>0,r||(r=0);var u;if(typeof r=="number")for(u=i;u<e;++u)this[u]=r;else{var h=A(r)?r:D(new f(r,t).toString()),s=h.length;for(u=0;u<e-i;++u)this[u+i]=h[u%s]}return this};var Kr=/[^+\/0-9A-Za-z-_]/g;function br(n){if(n=ri(n).replace(Kr,""),n.length<2)return"";for(;n.length%4!==0;)n=n+"=";return n}function ri(n){return n.trim?n.trim():n.replace(/^\s+|\s+$/g,"")}function ii(n){return n<16?"0"+n.toString(16):n.toString(16)}function D(n,r){r=r||Infinity;for(var i,e=n.length,t=null,o=[],u=0;u<e;++u){if(i=n.charCodeAt(u),i>55295&&i<57344){if(!t){if(i>56319){(r-=3)>-1&&o.push(239,191,189);continue}else if(u+1===e){(r-=3)>-1&&o.push(239,191,189);continue}t=i;continue}if(i<56320){(r-=3)>-1&&o.push(239,191,189),t=i;continue}i=(t-55296<<10|i-56320)+65536}else t&&((r-=3)>-1&&o.push(239,191,189));if(t=null,i<128){if((r-=1)<0)break;o.push(i)}else if(i<2048){if((r-=2)<0)break;o.push(i>>6|192,i&63|128)}else if(i<65536){if((r-=3)<0)break;o.push(i>>12|224,i>>6&63|128,i&63|128)}else if(i<1114112){if((r-=4)<0)break;o.push(i>>18|240,i>>12&63|128,i>>6&63|128,i&63|128)}else throw new Error("Invalid code point")}return o}function ni(n){for(var r=[],i=0;i<n.length;++i)r.push(n.charCodeAt(i)&255);return r}function ei(n,r){for(var i,e,t,o=[],u=0;u<n.length&&!((r-=2)<0);++u)i=n.charCodeAt(u),e=i>>8,t=i%256,o.push(t),o.push(e);return o}function cr(n){return Pr(br(n))}function v(n,r,i,e){for(var t=0;t<e&&!(t+i>=r.length||t>=n.length);++t)r[t+i]=n[t];return t}function ti(n){return n!==n}function oi(n){return n!=null&&(!!n._isBuffer||ar(n)||ui(n))}function ar(n){return!!n.constructor&&typeof n.constructor.isBuffer=="function"&&n.constructor.isBuffer(n)}function ui(n){return typeof n.readFloatLE=="function"&&typeof n.slice=="function"&&ar(n.slice(0,0))}const fi=/^(data:|([A-Za-z]+:)?\/\/)/,hi=/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|file|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,si=/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g,lr="file://";function ci(n,r){return i=>({options:i||{},sanitize:li,load:ai,fileAccess:!!r,file:pi(r),http:wi(n)})}async function ai(n,r){const i=await this.sanitize(n,r),e=i.href;return i.localFile?this.file(e):this.http(e,r)}async function li(n,r){r=C({},this.options,r);const i=this.fileAccess,e={href:null};let t,o,u;const h=hi.test(n.replace(si,""));(n==null||typeof n!="string"||!h)&&T("Sanitize failure, invalid URI: "+q(n));const s=fi.test(n);return(u=r.baseURL)&&!s&&(!n.startsWith("/")&&!u.endsWith("/")&&(n="/"+n),n=u+n),o=(t=n.startsWith(lr))||r.mode==="file"||r.mode!=="http"&&!s&&i,t?n=n.slice(lr.length):n.startsWith("//")&&(r.defaultProtocol==="file"?(n=n.slice(2),o=!0):n=(r.defaultProtocol||"http")+":"+n),Object.defineProperty(e,"localFile",{value:!!o}),e.href=n,r.target&&(e.target=r.target+""),r.rel&&(e.rel=r.rel+""),r.context==="image"&&r.crossOrigin&&(e.crossOrigin=r.crossOrigin+""),e}function pi(n){return n?r=>new Promise((i,e)=>{n.readFile(r,(t,o)=>{t?e(t):i(o)})}):xi}async function xi(){T("No file system access.")}function wi(n){return n?async function(r,i){const e=C({},this.options.http,i),t=i&&i.response,o=await n(r,e);return o.ok?H(o[t])?o[t]():o.text():T(o.status+""+o.statusText)}:Ei}async function Ei(){T("No HTTP fetch method available.")}const yi=n=>n!=null&&n===n,Fi=n=>n==="true"||n==="false"||n===!0||n===!1,mi=n=>!Number.isNaN(Date.parse(n)),pr=n=>!Number.isNaN(+n)&&!(n instanceof Date),gi=n=>pr(n)&&Number.isInteger(+n),O={boolean:mr,integer:J,number:J,date:gr,string:Ar,unknown:V},P=[Fi,gi,pr,mi],Ai=["boolean","integer","number","date"];function xr(n,r){if(!n||!n.length)return"unknown";const i=n.length,e=P.length,t=P.map((o,u)=>u+1);for(let o=0,u=0,h,s;o<i;++o)for(s=r?n[o][r]:n[o],h=0;h<e;++h)if(t[h]&&yi(s)&&!P[h](s)&&(t[h]=0,++u,u===P.length))return"string";return Ai[t.reduce((o,u)=>o===0?u:o,0)-1]}function wr(n,r){return r.reduce((i,e)=>(i[e]=xr(n,e),i),{})}function Er(n){const r=function(i,e){const t={delimiter:n};return W(i,e?C(e,t):t)};return r.responseType="text",r}function W(n,r){return r.header&&(n=r.header.map(q).join(r.delimiter)+`
`+n),Ur(r.delimiter).parse(n+"")}W.responseType="text";function Ri(n){return typeof f=="function"&&H(f.isBuffer)?f.isBuffer(n):!1}function z(n,r){const i=r&&r.property?Rr(r.property):V;return Tr(n)&&!Ri(n)?Ti(i(n),r):i(JSON.parse(n))}z.responseType="json";function Ti(n,r){return!Ir(n)&&Br(n)&&(n=[...n]),r&&r.copy?JSON.parse(JSON.stringify(n)):n}const Ii={interior:(n,r)=>n!==r,exterior:(n,r)=>n===r};function yr(n,r){let i,e,t,o;return n=z(n,r),r&&r.feature?(i=_r,t=r.feature):r&&r.mesh?(i=dr,t=r.mesh,o=Ii[r.filter]):T("Missing TopoJSON feature or mesh parameter."),e=(e=n.objects[t])?i(n,e,o):T("Invalid TopoJSON object: "+t),e&&e.features||[e]}yr.responseType="json";const S={dsv:W,csv:Er(","),tsv:Er("	"),json:z,topojson:yr};function j(n,r){return arguments.length>1?(S[n]=r,this):$(S,n)?S[n]:null}function Bi(n){const r=j(n);return r&&r.responseType||"text"}function Ui(n,r,i,e){r=r||{};const t=j(r.type||"json");return t||T("Unknown data format type: "+r.type),n=t(n,r),r.parse&&_i(n,r.parse,i,e),$(n,"columns")&&delete n.columns,n}function _i(n,r,i,e){if(!n.length)return;const t=Dr();i=i||t.timeParse,e=e||t.utcParse;let o=n.columns||Object.keys(n[0]),u,h,s,a,l,c;r==="auto"&&(r=wr(n,o)),o=Object.keys(r);const y=o.map(x=>{const w=r[x];let B,m;if(w&&(w.startsWith("date:")||w.startsWith("utc:"))){B=w.split(/:(.+)?/,2),m=B[1],(m[0]==="'"&&m[m.length-1]==="'"||m[0]==='"'&&m[m.length-1]==='"')&&(m=m.slice(1,-1));const Fr=B[0]==="utc"?e:i;return Fr(m)}if(!O[w])throw Error("Illegal format pattern: "+x+":"+w);return O[w]});for(s=0,l=n.length,c=o.length;s<l;++s)for(u=n[s],a=0;a<c;++a)h=o[a],u[h]=y[a](u[h])}const di=ci(typeof fetch!="undefined"&&fetch,null);export{S as format,j as formats,xr as inferType,wr as inferTypes,di as loader,Ui as read,Bi as responseType,O as typeParsers};export default null;