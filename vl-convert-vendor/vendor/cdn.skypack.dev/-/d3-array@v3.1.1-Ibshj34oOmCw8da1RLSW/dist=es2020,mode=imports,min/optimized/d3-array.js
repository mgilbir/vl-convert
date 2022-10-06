import{InternMap as C,InternSet as p}from"/-/internmap@v2.0.3-GWZlRrRMFcDlELwTQEZq/dist=es2020,mode=imports,min/optimized/internmap.js";export{InternMap,InternSet}from"/-/internmap@v2.0.3-GWZlRrRMFcDlELwTQEZq/dist=es2020,mode=imports,min/optimized/internmap.js";function a(n,t){return n==null||t==null?NaN:n<t?-1:n>t?1:n>=t?0:NaN}function L(n){let t=n,e=n,i=n;n.length!==2&&(t=(u,l)=>n(u)-l,e=a,i=(u,l)=>a(n(u),l));function r(u,l,d=0,s=u.length){if(d<s){if(e(l,l)!==0)return s;do{const c=d+s>>>1;i(u[c],l)<0?d=c+1:s=c}while(d<s)}return d}function f(u,l,d=0,s=u.length){if(d<s){if(e(l,l)!==0)return s;do{const c=d+s>>>1;i(u[c],l)<=0?d=c+1:s=c}while(d<s)}return d}function o(u,l,d=0,s=u.length){const c=r(u,l,d,s-1);return c>d&&t(u[c-1],l)>-t(u[c],l)?c-1:c}return{left:r,center:o,right:f}}function Q(n){return n===null?NaN:+n}function*sn(n,t){if(t===void 0)for(let e of n)e!=null&&(e=+e)>=e&&(yield e);else{let e=-1;for(let i of n)(i=t(i,++e,n))!=null&&(i=+i)>=i&&(yield i)}}const U=L(a),z=U.right,hn=U.left,an=L(Q).center;function b(n,t){let e=0;if(t===void 0)for(let i of n)i!=null&&(i=+i)>=i&&++e;else{let i=-1;for(let r of n)(r=t(r,++i,n))!=null&&(r=+r)>=r&&++e}return e}function mn(n){return n.length|0}function wn(n){return!(n>0)}function pn(n){return typeof n!="object"||"length"in n?n:Array.from(n)}function gn(n){return t=>n(...t)}function yn(...n){const t=typeof n[n.length-1]=="function"&&gn(n.pop());n=n.map(pn);const e=n.map(mn),i=n.length-1,r=new Array(i+1).fill(0),f=[];if(i<0||e.some(wn))return f;for(;;){f.push(r.map((u,l)=>n[l][u]));let o=i;for(;++r[o]===e[o];){if(o===0)return t?f.map(t):f;r[o--]=0}}}function Mn(n,t){var e=0,i=0;return Float64Array.from(n,t===void 0?r=>e+=+r||0:r=>e+=+t(r,i++,n)||0)}function xn(n,t){return n==null||t==null?NaN:t<n?-1:t>n?1:t>=n?0:NaN}function W(n,t){let e=0,i,r=0,f=0;if(t===void 0)for(let o of n)o!=null&&(o=+o)>=o&&(i=o-r,r+=i/++e,f+=i*(o-r));else{let o=-1;for(let u of n)(u=t(u,++o,n))!=null&&(u=+u)>=u&&(i=u-r,r+=i/++e,f+=i*(u-r))}if(e>1)return f/(e-1)}function $(n,t){const e=W(n,t);return e&&Math.sqrt(e)}function E(n,t){let e,i;if(t===void 0)for(const r of n)r!=null&&(e===void 0?r>=r&&(e=i=r):(e>r&&(e=r),i<r&&(i=r)));else{let r=-1;for(let f of n)(f=t(f,++r,n))!=null&&(e===void 0?f>=f&&(e=i=f):(e>f&&(e=f),i<f&&(i=f)))}return[e,i]}class F{constructor(){this._partials=new Float64Array(32),this._n=0}add(t){const e=this._partials;let i=0;for(let r=0;r<this._n&&r<32;r++){const f=e[r],o=t+f,u=Math.abs(t)<Math.abs(f)?t-(o-f):f-(o-t);u&&(e[i++]=u),t=o}return e[i]=t,this._n=i+1,this}valueOf(){const t=this._partials;let e=this._n,i,r,f,o=0;if(e>0){for(o=t[--e];e>0&&!(i=o,r=t[--e],o=i+r,f=r-(o-i),f););e>0&&(f<0&&t[e-1]<0||f>0&&t[e-1]>0)&&(r=f*2,i=o+r,r==i-o&&(o=i))}return o}}function An(n,t){const e=new F;if(t===void 0)for(let i of n)(i=+i)&&e.add(i);else{let i=-1;for(let r of n)(r=+t(r,++i,n))&&e.add(r)}return+e}function bn(n,t){const e=new F;let i=-1;return Float64Array.from(n,t===void 0?r=>e.add(+r||0):r=>e.add(+t(r,++i,n)||0))}function g(n){return n}function B(n,...t){return y(n,g,g,t)}function H(n,...t){return y(n,Array.from,g,t)}function J(n,t){for(let e=1,i=t.length;e<i;++e)n=n.flatMap(r=>r.pop().map(([f,o])=>[...r,f,o]));return n}function En(n,...t){return J(H(n,...t),t)}function Nn(n,t,...e){return J(P(n,t,...e),e)}function K(n,t,...e){return y(n,g,t,e)}function P(n,t,...e){return y(n,Array.from,t,e)}function Sn(n,...t){return y(n,g,X,t)}function In(n,...t){return y(n,Array.from,X,t)}function X(n){if(n.length!==1)throw new Error("duplicate key");return n[0]}function y(n,t,e,i){return function r(f,o){if(o>=i.length)return e(f);const u=new C,l=i[o++];let d=-1;for(const s of f){const c=l(s,++d,f),h=u.get(c);h?h.push(s):u.set(c,[s])}for(const[s,c]of u)u.set(s,r(c,o));return t(u)}(n,0)}function Y(n,t){return Array.from(t,e=>n[e])}function V(n,...t){if(typeof n[Symbol.iterator]!="function")throw new TypeError("values is not iterable");n=Array.from(n);let[e]=t;if(e&&e.length!==2||t.length>1){const i=Uint32Array.from(n,(r,f)=>f);return t.length>1?(t=t.map(r=>n.map(r)),i.sort((r,f)=>{for(const o of t){const u=x(o[r],o[f]);if(u)return u}})):(e=n.map(e),i.sort((r,f)=>x(e[r],e[f]))),Y(n,i)}return n.sort(D(e))}function D(n=a){if(n===a)return x;if(typeof n!="function")throw new TypeError("compare is not a function");return(t,e)=>{const i=n(t,e);return i||i===0?i:(n(e,e)===0)-(n(t,t)===0)}}function x(n,t){return(n==null||!(n>=n))-(t==null||!(t>=t))||(n<t?-1:n>t?1:0)}function Tn(n,t,e){return(t.length!==2?V(K(n,t,e),([i,r],[f,o])=>a(r,o)||a(i,f)):V(B(n,e),([i,r],[f,o])=>t(r,o)||a(i,f))).map(([i])=>i)}var qn=Array.prototype,Rn=qn.slice;function N(n){return()=>n}var O=Math.sqrt(50),Z=Math.sqrt(10),j=Math.sqrt(2);function _(n,t,e){var i,r=-1,f,o,u;if(t=+t,n=+n,e=+e,n===t&&e>0)return[n];if((i=t<n)&&(f=n,n=t,t=f),(u=S(n,t,e))===0||!isFinite(u))return[];if(u>0){let l=Math.round(n/u),d=Math.round(t/u);for(l*u<n&&++l,d*u>t&&--d,o=new Array(f=d-l+1);++r<f;)o[r]=(l+r)*u}else{u=-u;let l=Math.round(n*u),d=Math.round(t*u);for(l/u<n&&++l,d/u>t&&--d,o=new Array(f=d-l+1);++r<f;)o[r]=(l+r)/u}return i&&o.reverse(),o}function S(n,t,e){var i=(t-n)/Math.max(0,e),r=Math.floor(Math.log(i)/Math.LN10),f=i/Math.pow(10,r);return r>=0?(f>=O?10:f>=Z?5:f>=j?2:1)*Math.pow(10,r):-Math.pow(10,-r)/(f>=O?10:f>=Z?5:f>=j?2:1)}function Ln(n,t,e){var i=Math.abs(t-n)/Math.max(0,e),r=Math.pow(10,Math.floor(Math.log(i)/Math.LN10)),f=i/r;return f>=O?r*=10:f>=Z?r*=5:f>=j&&(r*=2),t<n?-r:r}function v(n,t,e){let i;for(;;){const r=S(n,t,e);if(r===i||r===0||!isFinite(r))return[n,t];r>0?(n=Math.floor(n/r)*r,t=Math.ceil(t/r)*r):r<0&&(n=Math.ceil(n*r)/r,t=Math.floor(t*r)/r),i=r}}function nn(n){return Math.ceil(Math.log(b(n))/Math.LN2)+1}function tn(){var n=g,t=E,e=nn;function i(r){Array.isArray(r)||(r=Array.from(r));var f,o=r.length,u,l=new Array(o);for(f=0;f<o;++f)l[f]=n(r[f],f,r);var d=t(l),s=d[0],c=d[1],h=e(l,s,c);if(!Array.isArray(h)){const dn=c,R=+h;if(t===E&&([s,c]=v(s,c,R)),h=_(s,c,R),h[h.length-1]>=c)if(dn>=c&&t===E){const w=S(s,c,R);isFinite(w)&&(w>0?c=(Math.floor(c/w)+1)*w:w<0&&(c=(Math.ceil(c*-w)+1)/-w))}else h.pop()}for(var m=h.length;h[0]<=s;)h.shift(),--m;for(;h[m-1]>c;)h.pop(),--m;var M=new Array(m+1),q;for(f=0;f<=m;++f)q=M[f]=[],q.x0=f>0?h[f-1]:s,q.x1=f<m?h[f]:c;for(f=0;f<o;++f)u=l[f],u!=null&&s<=u&&u<=c&&M[z(h,u,0,m)].push(r[f]);return M}return i.value=function(r){return arguments.length?(n=typeof r=="function"?r:N(r),i):n},i.domain=function(r){return arguments.length?(t=typeof r=="function"?r:N([r[0],r[1]]),i):t},i.thresholds=function(r){return arguments.length?(e=typeof r=="function"?r:Array.isArray(r)?N(Rn.call(r)):N(r),i):e},i}function k(n,t){let e;if(t===void 0)for(const i of n)i!=null&&(e<i||e===void 0&&i>=i)&&(e=i);else{let i=-1;for(let r of n)(r=t(r,++i,n))!=null&&(e<r||e===void 0&&r>=r)&&(e=r)}return e}function I(n,t){let e;if(t===void 0)for(const i of n)i!=null&&(e>i||e===void 0&&i>=i)&&(e=i);else{let i=-1;for(let r of n)(r=t(r,++i,n))!=null&&(e>r||e===void 0&&r>=r)&&(e=r)}return e}function G(n,t,e=0,i=n.length-1,r){for(r=r===void 0?x:D(r);i>e;){if(i-e>600){const l=i-e+1,d=t-e+1,s=Math.log(l),c=.5*Math.exp(2*s/3),h=.5*Math.sqrt(s*c*(l-c)/l)*(d-l/2<0?-1:1),m=Math.max(e,Math.floor(t-d*c/l+h)),M=Math.min(i,Math.floor(t+(l-d)*c/l+h));G(n,t,m,M,r)}const f=n[t];let o=e,u=i;for(A(n,e,t),r(n[i],f)>0&&A(n,e,i);o<u;){for(A(n,o,u),++o,--u;r(n[o],f)<0;)++o;for(;r(n[u],f)>0;)--u}r(n[e],f)===0?A(n,e,u):(++u,A(n,u,i)),u<=t&&(e=u+1),t<=u&&(i=u-1)}return n}function A(n,t,e){const i=n[t];n[t]=n[e],n[e]=i}function T(n,t,e){if(n=Float64Array.from(sn(n,e)),!(i=n.length))return;if((t=+t)<=0||i<2)return I(n);if(t>=1)return k(n);var i,r=(i-1)*t,f=Math.floor(r),o=k(G(n,f).subarray(0,f+1)),u=I(n.subarray(f+1));return o+(u-o)*(r-f)}function zn(n,t,e=Q){if(!(i=n.length))return;if((t=+t)<=0||i<2)return+e(n[0],0,n);if(t>=1)return+e(n[i-1],i-1,n);var i,r=(i-1)*t,f=Math.floor(r),o=+e(n[f],f,n),u=+e(n[f+1],f+1,n);return o+(u-o)*(r-f)}function Fn(n,t,e){return Math.ceil((e-t)/(2*(T(n,.75)-T(n,.25))*Math.pow(b(n),-1/3)))}function Vn(n,t,e){return Math.ceil((e-t)/(3.5*$(n)*Math.pow(b(n),-1/3)))}function en(n,t){let e,i=-1,r=-1;if(t===void 0)for(const f of n)++r,f!=null&&(e<f||e===void 0&&f>=f)&&(e=f,i=r);else for(let f of n)(f=t(f,++r,n))!=null&&(e<f||e===void 0&&f>=f)&&(e=f,i=r);return i}function Dn(n,t){let e=0,i=0;if(t===void 0)for(let r of n)r!=null&&(r=+r)>=r&&(++e,i+=r);else{let r=-1;for(let f of n)(f=t(f,++r,n))!=null&&(f=+f)>=f&&(++e,i+=f)}if(e)return i/e}function On(n,t){return T(n,.5,t)}function*Zn(n){for(const t of n)yield*t}function jn(n){return Array.from(Zn(n))}function rn(n,t){let e,i=-1,r=-1;if(t===void 0)for(const f of n)++r,f!=null&&(e>f||e===void 0&&f>=f)&&(e=f,i=r);else for(let f of n)(f=t(f,++r,n))!=null&&(e>f||e===void 0&&f>=f)&&(e=f,i=r);return i}function kn(n,t){const e=new C;if(t===void 0)for(let f of n)f!=null&&f>=f&&e.set(f,(e.get(f)||0)+1);else{let f=-1;for(let o of n)(o=t(o,++f,n))!=null&&o>=o&&e.set(o,(e.get(o)||0)+1)}let i,r=0;for(const[f,o]of e)o>r&&(r=o,i=f);return i}function Gn(n,t=Cn){const e=[];let i,r=!1;for(const f of n)r&&e.push(t(i,f)),i=f,r=!0;return e}function Cn(n,t){return[n,t]}function Qn(n,t,e){n=+n,t=+t,e=(r=arguments.length)<2?(t=n,n=0,1):r<3?1:+e;for(var i=-1,r=Math.max(0,Math.ceil((t-n)/e))|0,f=new Array(r);++i<r;)f[i]=n+i*e;return f}function Un(n,t=a){if(typeof n[Symbol.iterator]!="function")throw new TypeError("values is not iterable");let e=Array.from(n);const i=new Float64Array(e.length);t.length!==2&&(e=e.map(t),t=a);const r=(u,l)=>t(e[u],e[l]);let f,o;return Uint32Array.from(e,(u,l)=>l).sort(t===a?(u,l)=>x(e[u],e[l]):D(r)).forEach((u,l)=>{const d=r(u,f===void 0?u:f);d>=0?((f===void 0||d>0)&&(f=u,o=l),i[u]=o):i[u]=NaN}),i}function Wn(n,t=a){let e,i=!1;if(t.length===1){let r;for(const f of n){const o=t(f);(i?a(o,r)<0:a(o,o)===0)&&(e=f,r=o,i=!0)}}else for(const r of n)(i?t(r,e)<0:t(r,r)===0)&&(e=r,i=!0);return e}function fn(n,t=a){if(t.length===1)return rn(n,t);let e,i=-1,r=-1;for(const f of n)++r,(i<0?t(f,f)===0:t(f,e)<0)&&(e=f,i=r);return i}function $n(n,t=a){let e,i=!1;if(t.length===1){let r;for(const f of n){const o=t(f);(i?a(o,r)>0:a(o,o)===0)&&(e=f,r=o,i=!0)}}else for(const r of n)(i?t(r,e)>0:t(r,r)===0)&&(e=r,i=!0);return e}function Bn(n,t=a){if(t.length===1)return en(n,t);let e,i=-1,r=-1;for(const f of n)++r,(i<0?t(f,f)===0:t(f,e)>0)&&(e=f,i=r);return i}function Hn(n,t){const e=fn(n,t);return e<0?void 0:e}var Jn=on(Math.random);function on(n){return function(e,i=0,r=e.length){let f=r-(i=+i);for(;f;){const o=n()*f--|0,u=e[f+i];e[f+i]=e[o+i],e[o+i]=u}return e}}function Kn(n,t){let e=0;if(t===void 0)for(let i of n)(i=+i)&&(e+=i);else{let i=-1;for(let r of n)(r=+t(r,++i,n))&&(e+=r)}return e}function un(n){if(!(f=n.length))return[];for(var t=-1,e=I(n,Pn),i=new Array(e);++t<e;)for(var r=-1,f,o=i[t]=new Array(f);++r<f;)o[r]=n[r][t];return i}function Pn(n){return n.length}function Xn(){return un(arguments)}function Yn(n,t){if(typeof t!="function")throw new TypeError("test is not a function");let e=-1;for(const i of n)if(!t(i,++e,n))return!1;return!0}function _n(n,t){if(typeof t!="function")throw new TypeError("test is not a function");let e=-1;for(const i of n)if(t(i,++e,n))return!0;return!1}function vn(n,t){if(typeof t!="function")throw new TypeError("test is not a function");const e=[];let i=-1;for(const r of n)t(r,++i,n)&&e.push(r);return e}function nt(n,t){if(typeof n[Symbol.iterator]!="function")throw new TypeError("values is not iterable");if(typeof t!="function")throw new TypeError("mapper is not a function");return Array.from(n,(e,i)=>t(e,i,n))}function tt(n,t,e){if(typeof t!="function")throw new TypeError("reducer is not a function");const i=n[Symbol.iterator]();let r,f,o=-1;if(arguments.length<3){if({done:r,value:e}=i.next(),r)return;++o}for(;{done:r,value:f}=i.next(),!r;)e=t(e,f,++o,n);return e}function et(n){if(typeof n[Symbol.iterator]!="function")throw new TypeError("values is not iterable");return Array.from(n).reverse()}function rt(n,...t){n=new p(n);for(const e of t)for(const i of e)n.delete(i);return n}function it(n,t){const e=t[Symbol.iterator](),i=new p;for(const r of n){if(i.has(r))return!1;let f,o;for(;({value:f,done:o}=e.next())&&!o;){if(Object.is(r,f))return!1;i.add(f)}}return!0}function ft(n,...t){n=new p(n),t=t.map(ot);n:for(const e of n)for(const i of t)if(!i.has(e)){n.delete(e);continue n}return n}function ot(n){return n instanceof p?n:new p(n)}function ln(n,t){const e=n[Symbol.iterator](),i=new Set;for(const r of t){const f=cn(r);if(i.has(f))continue;let o,u;for(;{value:o,done:u}=e.next();){if(u)return!1;const l=cn(o);if(i.add(l),Object.is(f,l))break}}return!0}function cn(n){return n!==null&&typeof n=="object"?n.valueOf():n}function ut(n,t){return ln(t,n)}function lt(...n){const t=new p;for(const e of n)for(const i of e)t.add(i);return t}export{F as Adder,a as ascending,tn as bin,z as bisect,an as bisectCenter,hn as bisectLeft,z as bisectRight,L as bisector,b as count,yn as cross,Mn as cumsum,xn as descending,$ as deviation,rt as difference,it as disjoint,Yn as every,E as extent,bn as fcumsum,vn as filter,En as flatGroup,Nn as flatRollup,An as fsum,$n as greatest,Bn as greatestIndex,B as group,Tn as groupSort,H as groups,tn as histogram,Sn as index,In as indexes,ft as intersection,Wn as least,fn as leastIndex,nt as map,k as max,en as maxIndex,Dn as mean,On as median,jn as merge,I as min,rn as minIndex,kn as mode,v as nice,Gn as pairs,Y as permute,T as quantile,zn as quantileSorted,G as quickselect,Qn as range,Un as rank,tt as reduce,et as reverse,K as rollup,P as rollups,Hn as scan,Jn as shuffle,on as shuffler,_n as some,V as sort,ut as subset,Kn as sum,ln as superset,Fn as thresholdFreedmanDiaconis,Vn as thresholdScott,nn as thresholdSturges,S as tickIncrement,Ln as tickStep,_ as ticks,un as transpose,lt as union,W as variance,Xn as zip};export default null;