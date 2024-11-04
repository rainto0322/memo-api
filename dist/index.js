"use strict";var e=require("http"),t=require("path");const o=async(e,t)=>{const o={};return e.params.forEach(((e,r)=>{o[e]=t[r+1]})),o},r={".svg":"image/svg+xml",".html":"text/html",".css":"text/css",".js":"application/javascript",".jpg":"image/jpeg",".png":"image/png",".ico":"image/x-icon"},n={GET:e=>`[42m ${e} [0m`,POST:e=>`[41m ${e} [0m`,PUT:e=>`[43m ${e} [0m`,DELETE:e=>`[41m ${e} [0m`,URL:e=>`[93m ${e} [0m`};exports.MemoApi=class{constructor(){this.config={port:4e3,hosts:[],logger:!0,limit:null},this.routes=[],this.methods=["GET","POST","PUT","DELETE"],this.methods.forEach((e=>{this[e.toLowerCase()]=(t,o,r)=>{this.addRoute(t,e,o,r)}}))}addRoute(e,t,o,r){let n={path:e,method:t,callback:o,option:r},s=[];e.includes(":")&&"/:"!==e&&(n.path=new RegExp("^"+e.replace(/:([^\/]*)/g,((e,t)=>(s.push(t),"([^\\/]*)")))+"$"),n.path.params=s),this.routes.push(n)}register(e){e(this)}async errorHandle(e,t){t.statusCode=e.code,console.error(e.message),t.end(JSON.stringify({code:e.code||400,error:e.message}))}replyHandle(e){const t=e.end;e.end=function(o,r,n){"object"!=typeof o||Buffer.isBuffer(o)||(o.code=200,o.ok=!0,o=JSON.stringify(o)),t.call(e,o,r,n)}}async preHandle(e,t,o){this.replyHandle(t);try{if(o.option){const{schema:r}=o.option,n=(e=>t=>{const o={},{body:r,require:n}=e;n&&n.forEach((e=>{if(void 0===t[e])throw new Error(`Parameter ${e} must be filled in.`)}));for(const e in r){const n=t[e],{type:s,length:a,RegExp:i}=r[e],c=s.name.toLowerCase();if(void 0!==n&&typeof n!==c)throw new Error(`Invalid type for "${e}". Expected "${c}", not "${typeof n}".`);if(i&&!i.test(n))throw new Error(`"${e}" does not conform to the format.`);if(a&&typeof n===String){let t=n.length;if(a[0]===a[1]&&t!==a[0])throw new Error(`Invalid type for "${e}". The parameter length should be equal "${a[0]}".`);if(t<a[0]||t>a[1])throw new Error(`Invalid type for "${e}". The parameter length should be between "${a[0]}" and "${a[1]}".`)}r[e].default?o[e]=void 0!==n?n:r[e].default:o[e]=n}return o})(r),s=await n(e.body);return s&&(e.body=s),o.callback(e,t)}return o.callback(e,t)}catch(e){e.code=400,await this.errorHandle(e,t)}}async routeHandle(e,t){const{method:r,headers:n,url:s}=e,{pathname:a}=new URL(s,`http://${n.host}`);for(const n of this.routes)if(n.method===r){const{path:r}=n,s=a.match(r);if(s&&r.params)return e.params=await o(r,s),this.preHandle(e,t,n);if(n.path===a)return this.preHandle(e,t,n);if("/:"===n.path)return this.preHandle(e,t,n)}}allowedHosts(e,t){const{hosts:o}=this.config,{host:r}=e.headers;if(0!==o.length&&!o.includes(r)){const e=new Error("=͟͟͞͞ʕ•̫͡•ʔ=͟͟͞͞  Sorry, you are not on the domain whitelist !");e.code=403,t.end(e)}}async Initial(e,o){const{limit:s}=this.config,a=performance.now();this.allowedHosts(e,o),o.setHeader("Access-Control-Allow-Origin","*"),o.setHeader("Access-Control-Allow-Headers","Content-Type"),o.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE"),o.setHeader("Content-Type",`${(e=>{const{pathname:o}=new URL(e.url,`http://${e.headers.host}`);return"/"===o?"text/html":o.includes("/img/")?"image/png":r[t.extname(o)]||"text/plain"})(e)}; charset=utf-8`);try{e.query=await(async e=>{const{headers:t,url:o}=e,{searchParams:r}=new URL(o,`http://${t.host}`);if(r.length>0){const e={};return r.forEach(((t,o)=>{e[o]=t})),e}})(e),e.body=await(async(e,t,o)=>new Promise((r=>{let n=[];e.on("data",(e=>{n.push(e)})),e.on("end",(()=>{if(n=Buffer.concat(n).toString(),!n)return r({});null!==o&&n.length>o&&(t.statusCode=413,t.end(JSON.stringify({ok:!1,error:"ʕ•̫͡•ʔ Request entity is too large."})));try{r(JSON.parse(n))}catch(e){console.error(e),r({})}}))})))(e,o,s),await this.routeHandle(e,o)}catch(e){o.end(e.message)}finally{const{logger:t}=this.config;if(t){const{method:t,url:o,headers:r}=e,{pathname:s}=new URL(o,`http://${r.host}`),i=(performance.now()-a).toFixed(2);console.log(n[t](t),n.URL(s),` Took${n.URL(i)}ms`)}}}configure(e){for(const t in e)this.config.hasOwnProperty(t)&&(this.config[t]=e[t])}listen(t,o){this.configure(t);const{port:r}=this.config,n=e.createServer(this.Initial.bind(this));var s;s=`[45m ʕ•̮͡•ʔ丿Service is running on port [41m ${r} [0m`,console.log(s),n.listen(r,o)}};
