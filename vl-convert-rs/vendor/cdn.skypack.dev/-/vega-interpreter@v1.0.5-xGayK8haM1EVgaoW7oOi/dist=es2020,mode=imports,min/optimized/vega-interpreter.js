function g(e,t,n){let a;t.x2&&(t.x?(n&&e.x>e.x2&&(a=e.x,e.x=e.x2,e.x2=a),e.width=e.x2-e.x):e.x=e.x2-(e.width||0)),t.xc&&(e.x=e.xc-(e.width||0)/2),t.y2&&(t.y?(n&&e.y>e.y2&&(a=e.y,e.y=e.y2,e.y2=a),e.height=e.y2-e.y):e.y=e.y2-(e.height||0)),t.yc&&(e.y=e.yc-(e.height||0)/2)}var m={NaN:NaN,E:Math.E,LN2:Math.LN2,LN10:Math.LN10,LOG2E:Math.LOG2E,LOG10E:Math.LOG10E,PI:Math.PI,SQRT1_2:Math.SQRT1_2,SQRT2:Math.SQRT2,MIN_VALUE:Number.MIN_VALUE,MAX_VALUE:Number.MAX_VALUE},x={"*":(e,t)=>e*t,"+":(e,t)=>e+t,"-":(e,t)=>e-t,"/":(e,t)=>e/t,"%":(e,t)=>e%t,">":(e,t)=>e>t,"<":(e,t)=>e<t,"<=":(e,t)=>e<=t,">=":(e,t)=>e>=t,"==":(e,t)=>e==t,"!=":(e,t)=>e!=t,"===":(e,t)=>e===t,"!==":(e,t)=>e!==t,"&":(e,t)=>e&t,"|":(e,t)=>e|t,"^":(e,t)=>e^t,"<<":(e,t)=>e<<t,">>":(e,t)=>e>>t,">>>":(e,t)=>e>>>t},M={"+":e=>+e,"-":e=>-e,"~":e=>~e,"!":e=>!e};const y=Array.prototype.slice,u=(e,t,n)=>{const a=n?n(t[0]):t[0];return a[e].apply(a,y.call(t,1))},w=(e,t,n,a,r,o,s)=>new Date(e,t||0,n??1,a||0,r||0,o||0,s||0);var D={isNaN:Number.isNaN,isFinite:Number.isFinite,abs:Math.abs,acos:Math.acos,asin:Math.asin,atan:Math.atan,atan2:Math.atan2,ceil:Math.ceil,cos:Math.cos,exp:Math.exp,floor:Math.floor,log:Math.log,max:Math.max,min:Math.min,pow:Math.pow,random:Math.random,round:Math.round,sin:Math.sin,sqrt:Math.sqrt,tan:Math.tan,clamp:(e,t,n)=>Math.max(t,Math.min(n,e)),now:Date.now,utc:Date.UTC,datetime:w,date:e=>new Date(e).getDate(),day:e=>new Date(e).getDay(),year:e=>new Date(e).getFullYear(),month:e=>new Date(e).getMonth(),hours:e=>new Date(e).getHours(),minutes:e=>new Date(e).getMinutes(),seconds:e=>new Date(e).getSeconds(),milliseconds:e=>new Date(e).getMilliseconds(),time:e=>new Date(e).getTime(),timezoneoffset:e=>new Date(e).getTimezoneOffset(),utcdate:e=>new Date(e).getUTCDate(),utcday:e=>new Date(e).getUTCDay(),utcyear:e=>new Date(e).getUTCFullYear(),utcmonth:e=>new Date(e).getUTCMonth(),utchours:e=>new Date(e).getUTCHours(),utcminutes:e=>new Date(e).getUTCMinutes(),utcseconds:e=>new Date(e).getUTCSeconds(),utcmilliseconds:e=>new Date(e).getUTCMilliseconds(),length:e=>e.length,join:function(){return u("join",arguments)},indexof:function(){return u("indexOf",arguments)},lastindexof:function(){return u("lastIndexOf",arguments)},slice:function(){return u("slice",arguments)},reverse:e=>e.slice().reverse(),parseFloat,parseInt,upper:e=>String(e).toUpperCase(),lower:e=>String(e).toLowerCase(),substring:function(){return u("substring",arguments,String)},split:function(){return u("split",arguments,String)},replace:function(){return u("replace",arguments,String)},trim:e=>String(e).trim(),regexp:RegExp,test:(e,t)=>RegExp(e).test(t)};const E=["view","item","group","xy","x","y"],h=new Set([Function,eval,setTimeout,setInterval]);typeof setImmediate=="function"&&h.add(setImmediate);const b={Literal:(e,t)=>t.value,Identifier:(e,t)=>{const n=t.name;return e.memberDepth>0?n:n==="datum"?e.datum:n==="event"?e.event:n==="item"?e.item:m[n]||e.params["$"+n]},MemberExpression:(e,t)=>{const n=!t.computed,a=e(t.object);n&&(e.memberDepth+=1);const r=e(t.property);if(n&&(e.memberDepth-=1),h.has(a[r])){console.error(`Prevented interpretation of member "${r}" which could lead to insecure code execution`);return}return a[r]},CallExpression:(e,t)=>{const n=t.arguments;let a=t.callee.name;return a.startsWith("_")&&(a=a.slice(1)),a==="if"?e(n[0])?e(n[1]):e(n[2]):(e.fn[a]||D[a]).apply(e.fn,n.map(e))},ArrayExpression:(e,t)=>t.elements.map(e),BinaryExpression:(e,t)=>x[t.operator](e(t.left),e(t.right)),UnaryExpression:(e,t)=>M[t.operator](e(t.argument)),ConditionalExpression:(e,t)=>e(t.test)?e(t.consequent):e(t.alternate),LogicalExpression:(e,t)=>t.operator==="&&"?e(t.left)&&e(t.right):e(t.left)||e(t.right),ObjectExpression:(e,t)=>t.properties.reduce((n,a)=>{e.memberDepth+=1;const r=e(a.key);return e.memberDepth-=1,h.has(e(a.value))?console.error(`Prevented interpretation of property "${r}" which could lead to insecure code execution`):n[r]=e(a.value),n},{})};function c(e,t,n,a,r,o){const s=i=>b[i.type](s,i);return s.memberDepth=0,s.fn=Object.create(t),s.params=n,s.datum=a,s.event=r,s.item=o,E.forEach(i=>s.fn[i]=function(){return r.vega[i](...arguments)}),s(e)}var v={operator(e,t){const n=t.ast,a=e.functions;return r=>c(n,a,r)},parameter(e,t){const n=t.ast,a=e.functions;return(r,o)=>c(n,a,o,r)},event(e,t){const n=t.ast,a=e.functions;return r=>c(n,a,void 0,void 0,r)},handler(e,t){const n=t.ast,a=e.functions;return(r,o)=>{const s=o.item&&o.item.datum;return c(n,a,r,s,o)}},encode(e,t){const{marktype:n,channels:a}=t,r=e.functions,o=n==="group"||n==="image"||n==="rect";return(s,i)=>{const d=s.datum;let f=0,l;for(const p in a)l=c(a[p].ast,r,i,d,void 0,s),s[p]!==l&&(s[p]=l,f=1);return n!=="rule"&&g(s,a,o),f}}};export{v as expressionInterpreter};export default null;