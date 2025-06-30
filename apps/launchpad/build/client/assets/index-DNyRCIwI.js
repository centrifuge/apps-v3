import{g as Ue,s as hr,A as H}from"./chunk-NL6KNZEE-BfjKGAAH.js";function me(t,e){return e==="light"?{"--w3m-accent":(t==null?void 0:t["--w3m-accent"])||"hsla(231, 100%, 70%, 1)","--w3m-background":"#fff"}:{"--w3m-accent":(t==null?void 0:t["--w3m-accent"])||"hsla(230, 100%, 67%, 1)","--w3m-background":"#121313"}}var ve={exports:{}},De;function wr(){if(De)return ve.exports;De=1;var t=typeof Reflect=="object"?Reflect:null,e=t&&typeof t.apply=="function"?t.apply:function(f,s,u){return Function.prototype.apply.call(f,s,u)},r;t&&typeof t.ownKeys=="function"?r=t.ownKeys:Object.getOwnPropertySymbols?r=function(f){return Object.getOwnPropertyNames(f).concat(Object.getOwnPropertySymbols(f))}:r=function(f){return Object.getOwnPropertyNames(f)};function o(w){console&&console.warn&&console.warn(w)}var i=Number.isNaN||function(f){return f!==f};function n(){n.init.call(this)}ve.exports=n,ve.exports.once=B,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._eventsCount=0,n.prototype._maxListeners=void 0;var c=10;function g(w){if(typeof w!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof w)}Object.defineProperty(n,"defaultMaxListeners",{enumerable:!0,get:function(){return c},set:function(w){if(typeof w!="number"||w<0||i(w))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+w+".");c=w}}),n.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},n.prototype.setMaxListeners=function(f){if(typeof f!="number"||f<0||i(f))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+f+".");return this._maxListeners=f,this};function b(w){return w._maxListeners===void 0?n.defaultMaxListeners:w._maxListeners}n.prototype.getMaxListeners=function(){return b(this)},n.prototype.emit=function(f){for(var s=[],u=1;u<arguments.length;u++)s.push(arguments[u]);var d=f==="error",A=this._events;if(A!==void 0)d=d&&A.error===void 0;else if(!d)return!1;if(d){var p;if(s.length>0&&(p=s[0]),p instanceof Error)throw p;var O=new Error("Unhandled error."+(p?" ("+p.message+")":""));throw O.context=p,O}var T=A[f];if(T===void 0)return!1;if(typeof T=="function")e(T,this,s);else for(var N=T.length,E=C(T,N),u=0;u<N;++u)e(E[u],this,s);return!0};function l(w,f,s,u){var d,A,p;if(g(s),A=w._events,A===void 0?(A=w._events=Object.create(null),w._eventsCount=0):(A.newListener!==void 0&&(w.emit("newListener",f,s.listener?s.listener:s),A=w._events),p=A[f]),p===void 0)p=A[f]=s,++w._eventsCount;else if(typeof p=="function"?p=A[f]=u?[s,p]:[p,s]:u?p.unshift(s):p.push(s),d=b(w),d>0&&p.length>d&&!p.warned){p.warned=!0;var O=new Error("Possible EventEmitter memory leak detected. "+p.length+" "+String(f)+" listeners added. Use emitter.setMaxListeners() to increase limit");O.name="MaxListenersExceededWarning",O.emitter=w,O.type=f,O.count=p.length,o(O)}return w}n.prototype.addListener=function(f,s){return l(this,f,s,!1)},n.prototype.on=n.prototype.addListener,n.prototype.prependListener=function(f,s){return l(this,f,s,!0)};function _(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function y(w,f,s){var u={fired:!1,wrapFn:void 0,target:w,type:f,listener:s},d=_.bind(u);return d.listener=s,u.wrapFn=d,d}n.prototype.once=function(f,s){return g(s),this.on(f,y(this,f,s)),this},n.prototype.prependOnceListener=function(f,s){return g(s),this.prependListener(f,y(this,f,s)),this},n.prototype.removeListener=function(f,s){var u,d,A,p,O;if(g(s),d=this._events,d===void 0)return this;if(u=d[f],u===void 0)return this;if(u===s||u.listener===s)--this._eventsCount===0?this._events=Object.create(null):(delete d[f],d.removeListener&&this.emit("removeListener",f,u.listener||s));else if(typeof u!="function"){for(A=-1,p=u.length-1;p>=0;p--)if(u[p]===s||u[p].listener===s){O=u[p].listener,A=p;break}if(A<0)return this;A===0?u.shift():m(u,A),u.length===1&&(d[f]=u[0]),d.removeListener!==void 0&&this.emit("removeListener",f,O||s)}return this},n.prototype.off=n.prototype.removeListener,n.prototype.removeAllListeners=function(f){var s,u,d;if(u=this._events,u===void 0)return this;if(u.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):u[f]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete u[f]),this;if(arguments.length===0){var A=Object.keys(u),p;for(d=0;d<A.length;++d)p=A[d],p!=="removeListener"&&this.removeAllListeners(p);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(s=u[f],typeof s=="function")this.removeListener(f,s);else if(s!==void 0)for(d=s.length-1;d>=0;d--)this.removeListener(f,s[d]);return this};function v(w,f,s){var u=w._events;if(u===void 0)return[];var d=u[f];return d===void 0?[]:typeof d=="function"?s?[d.listener||d]:[d]:s?P(d):C(d,d.length)}n.prototype.listeners=function(f){return v(this,f,!0)},n.prototype.rawListeners=function(f){return v(this,f,!1)},n.listenerCount=function(w,f){return typeof w.listenerCount=="function"?w.listenerCount(f):x.call(w,f)},n.prototype.listenerCount=x;function x(w){var f=this._events;if(f!==void 0){var s=f[w];if(typeof s=="function")return 1;if(s!==void 0)return s.length}return 0}n.prototype.eventNames=function(){return this._eventsCount>0?r(this._events):[]};function C(w,f){for(var s=new Array(f),u=0;u<f;++u)s[u]=w[u];return s}function m(w,f){for(;f+1<w.length;f++)w[f]=w[f+1];w.pop()}function P(w){for(var f=new Array(w.length),s=0;s<f.length;++s)f[s]=w[s].listener||w[s];return f}function B(w,f){return new Promise(function(s,u){function d(p){w.removeListener(f,A),u(p)}function A(){typeof w.removeListener=="function"&&w.removeListener("error",d),s([].slice.call(arguments))}R(w,f,A,{once:!0}),f!=="error"&&U(w,d,{once:!0})})}function U(w,f,s){typeof w.on=="function"&&R(w,"error",f,s)}function R(w,f,s,u){if(typeof w.on=="function")u.once?w.once(f,s):w.on(f,s);else if(typeof w.addEventListener=="function")w.addEventListener(f,function d(A){u.once&&w.removeEventListener(f,d),s(A)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof w)}return ve.exports}var dr=wr();const ft=Ue(dr);var Ee,He;function gr(){if(He)return Ee;He=1;function t(r){try{return JSON.stringify(r)}catch{return'"[Circular]"'}}Ee=e;function e(r,o,i){var n=i&&i.stringify||t,c=1;if(typeof r=="object"&&r!==null){var g=o.length+c;if(g===1)return r;var b=new Array(g);b[0]=n(r);for(var l=1;l<g;l++)b[l]=n(o[l]);return b.join(" ")}if(typeof r!="string")return r;var _=o.length;if(_===0)return r;for(var y="",v=1-c,x=-1,C=r&&r.length||0,m=0;m<C;){if(r.charCodeAt(m)===37&&m+1<C){switch(x=x>-1?x:0,r.charCodeAt(m+1)){case 100:case 102:if(v>=_||o[v]==null)break;x<m&&(y+=r.slice(x,m)),y+=Number(o[v]),x=m+2,m++;break;case 105:if(v>=_||o[v]==null)break;x<m&&(y+=r.slice(x,m)),y+=Math.floor(Number(o[v])),x=m+2,m++;break;case 79:case 111:case 106:if(v>=_||o[v]===void 0)break;x<m&&(y+=r.slice(x,m));var P=typeof o[v];if(P==="string"){y+="'"+o[v]+"'",x=m+2,m++;break}if(P==="function"){y+=o[v].name||"<anonymous>",x=m+2,m++;break}y+=n(o[v]),x=m+2,m++;break;case 115:if(v>=_)break;x<m&&(y+=r.slice(x,m)),y+=String(o[v]),x=m+2,m++;break;case 37:x<m&&(y+=r.slice(x,m)),y+="%",x=m+2,m++,v--;break}++v}++m}return x===-1?r:(x<C&&(y+=r.slice(x)),y)}return Ee}var Se,Ie;function br(){if(Ie)return Se;Ie=1;const t=gr();Se=i;const e=f().console||{},r={mapHttpRequest:C,mapHttpResponse:C,wrapRequestSerializer:m,wrapResponseSerializer:m,wrapErrorSerializer:m,req:C,res:C,err:v};function o(s,u){return Array.isArray(s)?s.filter(function(A){return A!=="!stdSerializers.err"}):s===!0?Object.keys(u):!1}function i(s){s=s||{},s.browser=s.browser||{};const u=s.browser.transmit;if(u&&typeof u.send!="function")throw Error("pino: transmit option must have a send function");const d=s.browser.write||e;s.browser.write&&(s.browser.asObject=!0);const A=s.serializers||{},p=o(s.browser.serialize,A);let O=s.browser.serialize;Array.isArray(s.browser.serialize)&&s.browser.serialize.indexOf("!stdSerializers.err")>-1&&(O=!1);const T=["error","fatal","warn","info","debug","trace"];typeof d=="function"&&(d.error=d.fatal=d.warn=d.info=d.debug=d.trace=d),s.enabled===!1&&(s.level="silent");const N=s.level||"info",E=Object.create(d);E.log||(E.log=P),Object.defineProperty(E,"levelVal",{get:h}),Object.defineProperty(E,"level",{get:S,set:z});const a={transmit:u,serialize:p,asObject:s.browser.asObject,levels:T,timestamp:x(s)};E.levels=i.levels,E.level=N,E.setMaxListeners=E.getMaxListeners=E.emit=E.addListener=E.on=E.prependListener=E.once=E.prependOnceListener=E.removeListener=E.removeAllListeners=E.listeners=E.listenerCount=E.eventNames=E.write=E.flush=P,E.serializers=A,E._serialize=p,E._stdErrSerialize=O,E.child=k,u&&(E._logEvent=y());function h(){return this.level==="silent"?1/0:this.levels.values[this.level]}function S(){return this._level}function z($){if($!=="silent"&&!this.levels.values[$])throw Error("unknown level "+$);this._level=$,n(a,E,"error","log"),n(a,E,"fatal","error"),n(a,E,"warn","error"),n(a,E,"info","log"),n(a,E,"debug","log"),n(a,E,"trace","log")}function k($,I){if(!$)throw new Error("missing bindings for child Pino");I=I||{},p&&$.serializers&&(I.serializers=$.serializers);const te=I.serializers;if(p&&te){var X=Object.assign({},A,te),L=s.browser.serialize===!0?Object.keys(X):p;delete $.serializers,b([$],L,X,this._stdErrSerialize)}function D(K){this._childLevel=(K._childLevel|0)+1,this.error=l(K,$,"error"),this.fatal=l(K,$,"fatal"),this.warn=l(K,$,"warn"),this.info=l(K,$,"info"),this.debug=l(K,$,"debug"),this.trace=l(K,$,"trace"),X&&(this.serializers=X,this._serialize=L),u&&(this._logEvent=y([].concat(K._logEvent.bindings,$)))}return D.prototype=this,new D(this)}return E}i.levels={values:{fatal:60,error:50,warn:40,info:30,debug:20,trace:10},labels:{10:"trace",20:"debug",30:"info",40:"warn",50:"error",60:"fatal"}},i.stdSerializers=r,i.stdTimeFunctions=Object.assign({},{nullTime:B,epochTime:U,unixTime:R,isoTime:w});function n(s,u,d,A){const p=Object.getPrototypeOf(u);u[d]=u.levelVal>u.levels.values[d]?P:p[d]?p[d]:e[d]||e[A]||P,c(s,u,d)}function c(s,u,d){!s.transmit&&u[d]===P||(u[d]=function(A){return function(){const O=s.timestamp(),T=new Array(arguments.length),N=Object.getPrototypeOf&&Object.getPrototypeOf(this)===e?e:this;for(var E=0;E<T.length;E++)T[E]=arguments[E];if(s.serialize&&!s.asObject&&b(T,this._serialize,this.serializers,this._stdErrSerialize),s.asObject?A.call(N,g(this,d,T,O)):A.apply(N,T),s.transmit){const a=s.transmit.level||u.level,h=i.levels.values[a],S=i.levels.values[d];if(S<h)return;_(this,{ts:O,methodLevel:d,methodValue:S,transmitValue:i.levels.values[s.transmit.level||u.level],send:s.transmit.send,val:u.levelVal},T)}}}(u[d]))}function g(s,u,d,A){s._serialize&&b(d,s._serialize,s.serializers,s._stdErrSerialize);const p=d.slice();let O=p[0];const T={};A&&(T.time=A),T.level=i.levels.values[u];let N=(s._childLevel|0)+1;if(N<1&&(N=1),O!==null&&typeof O=="object"){for(;N--&&typeof p[0]=="object";)Object.assign(T,p.shift());O=p.length?t(p.shift(),p):void 0}else typeof O=="string"&&(O=t(p.shift(),p));return O!==void 0&&(T.msg=O),T}function b(s,u,d,A){for(const p in s)if(A&&s[p]instanceof Error)s[p]=i.stdSerializers.err(s[p]);else if(typeof s[p]=="object"&&!Array.isArray(s[p]))for(const O in s[p])u&&u.indexOf(O)>-1&&O in d&&(s[p][O]=d[O](s[p][O]))}function l(s,u,d){return function(){const A=new Array(1+arguments.length);A[0]=u;for(var p=1;p<A.length;p++)A[p]=arguments[p-1];return s[d].apply(this,A)}}function _(s,u,d){const A=u.send,p=u.ts,O=u.methodLevel,T=u.methodValue,N=u.val,E=s._logEvent.bindings;b(d,s._serialize||Object.keys(s.serializers),s.serializers,s._stdErrSerialize===void 0?!0:s._stdErrSerialize),s._logEvent.ts=p,s._logEvent.messages=d.filter(function(a){return E.indexOf(a)===-1}),s._logEvent.level.label=O,s._logEvent.level.value=T,A(O,s._logEvent,N),s._logEvent=y(E)}function y(s){return{ts:0,messages:[],bindings:s||[],level:{label:"",value:0}}}function v(s){const u={type:s.constructor.name,msg:s.message,stack:s.stack};for(const d in s)u[d]===void 0&&(u[d]=s[d]);return u}function x(s){return typeof s.timestamp=="function"?s.timestamp:s.timestamp===!1?B:U}function C(){return{}}function m(s){return s}function P(){}function B(){return!1}function U(){return Date.now()}function R(){return Math.round(Date.now()/1e3)}function w(){return new Date(Date.now()).toISOString()}function f(){function s(u){return typeof u<"u"&&u}try{return typeof globalThis<"u"||Object.defineProperty(Object.prototype,"globalThis",{get:function(){return delete Object.prototype.globalThis,this.globalThis=this},configurable:!0}),globalThis}catch{return s(self)||s(window)||s(this)||{}}}return Se}var pr=br();const ht=Ue(pr);function mr(t){if(t.length>=255)throw new TypeError("Alphabet too long");const e=new Uint8Array(256);for(let l=0;l<e.length;l++)e[l]=255;for(let l=0;l<t.length;l++){const _=t.charAt(l),y=_.charCodeAt(0);if(e[y]!==255)throw new TypeError(_+" is ambiguous");e[y]=l}const r=t.length,o=t.charAt(0),i=Math.log(r)/Math.log(256),n=Math.log(256)/Math.log(r);function c(l){if(l instanceof Uint8Array||(ArrayBuffer.isView(l)?l=new Uint8Array(l.buffer,l.byteOffset,l.byteLength):Array.isArray(l)&&(l=Uint8Array.from(l))),!(l instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(l.length===0)return"";let _=0,y=0,v=0;const x=l.length;for(;v!==x&&l[v]===0;)v++,_++;const C=(x-v)*n+1>>>0,m=new Uint8Array(C);for(;v!==x;){let U=l[v],R=0;for(let w=C-1;(U!==0||R<y)&&w!==-1;w--,R++)U+=256*m[w]>>>0,m[w]=U%r>>>0,U=U/r>>>0;if(U!==0)throw new Error("Non-zero carry");y=R,v++}let P=C-y;for(;P!==C&&m[P]===0;)P++;let B=o.repeat(_);for(;P<C;++P)B+=t.charAt(m[P]);return B}function g(l){if(typeof l!="string")throw new TypeError("Expected String");if(l.length===0)return new Uint8Array;let _=0,y=0,v=0;for(;l[_]===o;)y++,_++;const x=(l.length-_)*i+1>>>0,C=new Uint8Array(x);for(;_<l.length;){const U=l.charCodeAt(_);if(U>255)return;let R=e[U];if(R===255)return;let w=0;for(let f=x-1;(R!==0||w<v)&&f!==-1;f--,w++)R+=r*C[f]>>>0,C[f]=R%256>>>0,R=R/256>>>0;if(R!==0)throw new Error("Non-zero carry");v=w,_++}let m=x-v;for(;m!==x&&C[m]===0;)m++;const P=new Uint8Array(y+(x-m));let B=y;for(;m!==x;)P[B++]=C[m++];return P}function b(l){const _=g(l);if(_)return _;throw new Error("Non-base"+r+" character")}return{encode:c,decodeUnsafe:g,decode:b}}var vr="123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";const wt=mr(vr);var Oe={};/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var Pe=function(t,e){return Pe=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,o){r.__proto__=o}||function(r,o){for(var i in o)o.hasOwnProperty(i)&&(r[i]=o[i])},Pe(t,e)};function yr(t,e){Pe(t,e);function r(){this.constructor=t}t.prototype=e===null?Object.create(e):(r.prototype=e.prototype,new r)}var Le=function(){return Le=Object.assign||function(e){for(var r,o=1,i=arguments.length;o<i;o++){r=arguments[o];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},Le.apply(this,arguments)};function xr(t,e){var r={};for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&e.indexOf(o)<0&&(r[o]=t[o]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,o=Object.getOwnPropertySymbols(t);i<o.length;i++)e.indexOf(o[i])<0&&Object.prototype.propertyIsEnumerable.call(t,o[i])&&(r[o[i]]=t[o[i]]);return r}function _r(t,e,r,o){var i=arguments.length,n=i<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,r):o,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,r,o);else for(var g=t.length-1;g>=0;g--)(c=t[g])&&(n=(i<3?c(n):i>3?c(e,r,n):c(e,r))||n);return i>3&&n&&Object.defineProperty(e,r,n),n}function Ar(t,e){return function(r,o){e(r,o,t)}}function $r(t,e){if(typeof Reflect=="object"&&typeof Reflect.metadata=="function")return Reflect.metadata(t,e)}function Er(t,e,r,o){function i(n){return n instanceof r?n:new r(function(c){c(n)})}return new(r||(r=Promise))(function(n,c){function g(_){try{l(o.next(_))}catch(y){c(y)}}function b(_){try{l(o.throw(_))}catch(y){c(y)}}function l(_){_.done?n(_.value):i(_.value).then(g,b)}l((o=o.apply(t,e||[])).next())})}function Sr(t,e){var r={label:0,sent:function(){if(n[0]&1)throw n[1];return n[1]},trys:[],ops:[]},o,i,n,c;return c={next:g(0),throw:g(1),return:g(2)},typeof Symbol=="function"&&(c[Symbol.iterator]=function(){return this}),c;function g(l){return function(_){return b([l,_])}}function b(l){if(o)throw new TypeError("Generator is already executing.");for(;r;)try{if(o=1,i&&(n=l[0]&2?i.return:l[0]?i.throw||((n=i.return)&&n.call(i),0):i.next)&&!(n=n.call(i,l[1])).done)return n;switch(i=0,n&&(l=[l[0]&2,n.value]),l[0]){case 0:case 1:n=l;break;case 4:return r.label++,{value:l[1],done:!1};case 5:r.label++,i=l[1],l=[0];continue;case 7:l=r.ops.pop(),r.trys.pop();continue;default:if(n=r.trys,!(n=n.length>0&&n[n.length-1])&&(l[0]===6||l[0]===2)){r=0;continue}if(l[0]===3&&(!n||l[1]>n[0]&&l[1]<n[3])){r.label=l[1];break}if(l[0]===6&&r.label<n[1]){r.label=n[1],n=l;break}if(n&&r.label<n[2]){r.label=n[2],r.ops.push(l);break}n[2]&&r.ops.pop(),r.trys.pop();continue}l=e.call(t,r)}catch(_){l=[6,_],i=0}finally{o=n=0}if(l[0]&5)throw l[1];return{value:l[0]?l[1]:void 0,done:!0}}}function Or(t,e,r,o){o===void 0&&(o=r),t[o]=e[r]}function Cr(t,e){for(var r in t)r!=="default"&&!e.hasOwnProperty(r)&&(e[r]=t[r])}function Re(t){var e=typeof Symbol=="function"&&Symbol.iterator,r=e&&t[e],o=0;if(r)return r.call(t);if(t&&typeof t.length=="number")return{next:function(){return t&&o>=t.length&&(t=void 0),{value:t&&t[o++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function ir(t,e){var r=typeof Symbol=="function"&&t[Symbol.iterator];if(!r)return t;var o=r.call(t),i,n=[],c;try{for(;(e===void 0||e-- >0)&&!(i=o.next()).done;)n.push(i.value)}catch(g){c={error:g}}finally{try{i&&!i.done&&(r=o.return)&&r.call(o)}finally{if(c)throw c.error}}return n}function Tr(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(ir(arguments[e]));return t}function zr(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;for(var o=Array(t),i=0,e=0;e<r;e++)for(var n=arguments[e],c=0,g=n.length;c<g;c++,i++)o[i]=n[c];return o}function he(t){return this instanceof he?(this.v=t,this):new he(t)}function kr(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o=r.apply(t,e||[]),i,n=[];return i={},c("next"),c("throw"),c("return"),i[Symbol.asyncIterator]=function(){return this},i;function c(v){o[v]&&(i[v]=function(x){return new Promise(function(C,m){n.push([v,x,C,m])>1||g(v,x)})})}function g(v,x){try{b(o[v](x))}catch(C){y(n[0][3],C)}}function b(v){v.value instanceof he?Promise.resolve(v.value.v).then(l,_):y(n[0][2],v)}function l(v){g("next",v)}function _(v){g("throw",v)}function y(v,x){v(x),n.shift(),n.length&&g(n[0][0],n[0][1])}}function Pr(t){var e,r;return e={},o("next"),o("throw",function(i){throw i}),o("return"),e[Symbol.iterator]=function(){return this},e;function o(i,n){e[i]=t[i]?function(c){return(r=!r)?{value:he(t[i](c)),done:i==="return"}:n?n(c):c}:n}}function Lr(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=t[Symbol.asyncIterator],r;return e?e.call(t):(t=typeof Re=="function"?Re(t):t[Symbol.iterator](),r={},o("next"),o("throw"),o("return"),r[Symbol.asyncIterator]=function(){return this},r);function o(n){r[n]=t[n]&&function(c){return new Promise(function(g,b){c=t[n](c),i(g,b,c.done,c.value)})}}function i(n,c,g,b){Promise.resolve(b).then(function(l){n({value:l,done:g})},c)}}function Rr(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}function jr(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)Object.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function Ur(t){return t&&t.__esModule?t:{default:t}}function Nr(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return e.get(t)}function Br(t,e,r){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");return e.set(t,r),r}const Mr=Object.freeze(Object.defineProperty({__proto__:null,get __assign(){return Le},__asyncDelegator:Pr,__asyncGenerator:kr,__asyncValues:Lr,__await:he,__awaiter:Er,__classPrivateFieldGet:Nr,__classPrivateFieldSet:Br,__createBinding:Or,__decorate:_r,__exportStar:Cr,__extends:yr,__generator:Sr,__importDefault:Ur,__importStar:jr,__makeTemplateObject:Rr,__metadata:$r,__param:Ar,__read:ir,__rest:xr,__spread:Tr,__spreadArrays:zr,__values:Re},Symbol.toStringTag,{value:"Module"})),Dr=hr(Mr);var q={},qe;function Hr(){if(qe)return q;qe=1,Object.defineProperty(q,"__esModule",{value:!0}),q.isBrowserCryptoAvailable=q.getSubtleCrypto=q.getBrowerCrypto=void 0;function t(){return(H===null||H===void 0?void 0:H.crypto)||(H===null||H===void 0?void 0:H.msCrypto)||{}}q.getBrowerCrypto=t;function e(){const o=t();return o.subtle||o.webkitSubtle}q.getSubtleCrypto=e;function r(){return!!t()&&!!e()}return q.isBrowserCryptoAvailable=r,q}var F={},Fe;function Ir(){if(Fe)return F;Fe=1,Object.defineProperty(F,"__esModule",{value:!0}),F.isBrowser=F.isNode=F.isReactNative=void 0;function t(){return typeof document>"u"&&typeof navigator<"u"&&navigator.product==="ReactNative"}F.isReactNative=t;function e(){return typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u"}F.isNode=e;function r(){return!t()&&!e()}return F.isBrowser=r,F}var Ke;function qr(){return Ke||(Ke=1,function(t){Object.defineProperty(t,"__esModule",{value:!0});const e=Dr;e.__exportStar(Hr(),t),e.__exportStar(Ir(),t)}(Oe)),Oe}var dt=qr(),ye={exports:{}},We;function Fr(){return We||(We=1,function(t,e){var r=typeof globalThis<"u"&&globalThis||typeof self<"u"&&self||typeof H<"u"&&H,o=function(){function n(){this.fetch=!1,this.DOMException=r.DOMException}return n.prototype=r,new n}();(function(n){(function(c){var g=typeof n<"u"&&n||typeof self<"u"&&self||typeof H<"u"&&H||{},b={searchParams:"URLSearchParams"in g,iterable:"Symbol"in g&&"iterator"in Symbol,blob:"FileReader"in g&&"Blob"in g&&function(){try{return new Blob,!0}catch{return!1}}(),formData:"FormData"in g,arrayBuffer:"ArrayBuffer"in g};function l(a){return a&&DataView.prototype.isPrototypeOf(a)}if(b.arrayBuffer)var _=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],y=ArrayBuffer.isView||function(a){return a&&_.indexOf(Object.prototype.toString.call(a))>-1};function v(a){if(typeof a!="string"&&(a=String(a)),/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(a)||a==="")throw new TypeError('Invalid character in header field name: "'+a+'"');return a.toLowerCase()}function x(a){return typeof a!="string"&&(a=String(a)),a}function C(a){var h={next:function(){var S=a.shift();return{done:S===void 0,value:S}}};return b.iterable&&(h[Symbol.iterator]=function(){return h}),h}function m(a){this.map={},a instanceof m?a.forEach(function(h,S){this.append(S,h)},this):Array.isArray(a)?a.forEach(function(h){if(h.length!=2)throw new TypeError("Headers constructor: expected name/value pair to be length 2, found"+h.length);this.append(h[0],h[1])},this):a&&Object.getOwnPropertyNames(a).forEach(function(h){this.append(h,a[h])},this)}m.prototype.append=function(a,h){a=v(a),h=x(h);var S=this.map[a];this.map[a]=S?S+", "+h:h},m.prototype.delete=function(a){delete this.map[v(a)]},m.prototype.get=function(a){return a=v(a),this.has(a)?this.map[a]:null},m.prototype.has=function(a){return this.map.hasOwnProperty(v(a))},m.prototype.set=function(a,h){this.map[v(a)]=x(h)},m.prototype.forEach=function(a,h){for(var S in this.map)this.map.hasOwnProperty(S)&&a.call(h,this.map[S],S,this)},m.prototype.keys=function(){var a=[];return this.forEach(function(h,S){a.push(S)}),C(a)},m.prototype.values=function(){var a=[];return this.forEach(function(h){a.push(h)}),C(a)},m.prototype.entries=function(){var a=[];return this.forEach(function(h,S){a.push([S,h])}),C(a)},b.iterable&&(m.prototype[Symbol.iterator]=m.prototype.entries);function P(a){if(!a._noBody){if(a.bodyUsed)return Promise.reject(new TypeError("Already read"));a.bodyUsed=!0}}function B(a){return new Promise(function(h,S){a.onload=function(){h(a.result)},a.onerror=function(){S(a.error)}})}function U(a){var h=new FileReader,S=B(h);return h.readAsArrayBuffer(a),S}function R(a){var h=new FileReader,S=B(h),z=/charset=([A-Za-z0-9_-]+)/.exec(a.type),k=z?z[1]:"utf-8";return h.readAsText(a,k),S}function w(a){for(var h=new Uint8Array(a),S=new Array(h.length),z=0;z<h.length;z++)S[z]=String.fromCharCode(h[z]);return S.join("")}function f(a){if(a.slice)return a.slice(0);var h=new Uint8Array(a.byteLength);return h.set(new Uint8Array(a)),h.buffer}function s(){return this.bodyUsed=!1,this._initBody=function(a){this.bodyUsed=this.bodyUsed,this._bodyInit=a,a?typeof a=="string"?this._bodyText=a:b.blob&&Blob.prototype.isPrototypeOf(a)?this._bodyBlob=a:b.formData&&FormData.prototype.isPrototypeOf(a)?this._bodyFormData=a:b.searchParams&&URLSearchParams.prototype.isPrototypeOf(a)?this._bodyText=a.toString():b.arrayBuffer&&b.blob&&l(a)?(this._bodyArrayBuffer=f(a.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):b.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(a)||y(a))?this._bodyArrayBuffer=f(a):this._bodyText=a=Object.prototype.toString.call(a):(this._noBody=!0,this._bodyText=""),this.headers.get("content-type")||(typeof a=="string"?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):b.searchParams&&URLSearchParams.prototype.isPrototypeOf(a)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},b.blob&&(this.blob=function(){var a=P(this);if(a)return a;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))}),this.arrayBuffer=function(){if(this._bodyArrayBuffer){var a=P(this);return a||(ArrayBuffer.isView(this._bodyArrayBuffer)?Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset,this._bodyArrayBuffer.byteOffset+this._bodyArrayBuffer.byteLength)):Promise.resolve(this._bodyArrayBuffer))}else{if(b.blob)return this.blob().then(U);throw new Error("could not read as ArrayBuffer")}},this.text=function(){var a=P(this);if(a)return a;if(this._bodyBlob)return R(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(w(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},b.formData&&(this.formData=function(){return this.text().then(p)}),this.json=function(){return this.text().then(JSON.parse)},this}var u=["CONNECT","DELETE","GET","HEAD","OPTIONS","PATCH","POST","PUT","TRACE"];function d(a){var h=a.toUpperCase();return u.indexOf(h)>-1?h:a}function A(a,h){if(!(this instanceof A))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');h=h||{};var S=h.body;if(a instanceof A){if(a.bodyUsed)throw new TypeError("Already read");this.url=a.url,this.credentials=a.credentials,h.headers||(this.headers=new m(a.headers)),this.method=a.method,this.mode=a.mode,this.signal=a.signal,!S&&a._bodyInit!=null&&(S=a._bodyInit,a.bodyUsed=!0)}else this.url=String(a);if(this.credentials=h.credentials||this.credentials||"same-origin",(h.headers||!this.headers)&&(this.headers=new m(h.headers)),this.method=d(h.method||this.method||"GET"),this.mode=h.mode||this.mode||null,this.signal=h.signal||this.signal||function(){if("AbortController"in g){var $=new AbortController;return $.signal}}(),this.referrer=null,(this.method==="GET"||this.method==="HEAD")&&S)throw new TypeError("Body not allowed for GET or HEAD requests");if(this._initBody(S),(this.method==="GET"||this.method==="HEAD")&&(h.cache==="no-store"||h.cache==="no-cache")){var z=/([?&])_=[^&]*/;if(z.test(this.url))this.url=this.url.replace(z,"$1_="+new Date().getTime());else{var k=/\?/;this.url+=(k.test(this.url)?"&":"?")+"_="+new Date().getTime()}}}A.prototype.clone=function(){return new A(this,{body:this._bodyInit})};function p(a){var h=new FormData;return a.trim().split("&").forEach(function(S){if(S){var z=S.split("="),k=z.shift().replace(/\+/g," "),$=z.join("=").replace(/\+/g," ");h.append(decodeURIComponent(k),decodeURIComponent($))}}),h}function O(a){var h=new m,S=a.replace(/\r?\n[\t ]+/g," ");return S.split("\r").map(function(z){return z.indexOf(`
`)===0?z.substr(1,z.length):z}).forEach(function(z){var k=z.split(":"),$=k.shift().trim();if($){var I=k.join(":").trim();try{h.append($,I)}catch(te){console.warn("Response "+te.message)}}}),h}s.call(A.prototype);function T(a,h){if(!(this instanceof T))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');if(h||(h={}),this.type="default",this.status=h.status===void 0?200:h.status,this.status<200||this.status>599)throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");this.ok=this.status>=200&&this.status<300,this.statusText=h.statusText===void 0?"":""+h.statusText,this.headers=new m(h.headers),this.url=h.url||"",this._initBody(a)}s.call(T.prototype),T.prototype.clone=function(){return new T(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new m(this.headers),url:this.url})},T.error=function(){var a=new T(null,{status:200,statusText:""});return a.ok=!1,a.status=0,a.type="error",a};var N=[301,302,303,307,308];T.redirect=function(a,h){if(N.indexOf(h)===-1)throw new RangeError("Invalid status code");return new T(null,{status:h,headers:{location:a}})},c.DOMException=g.DOMException;try{new c.DOMException}catch{c.DOMException=function(h,S){this.message=h,this.name=S;var z=Error(h);this.stack=z.stack},c.DOMException.prototype=Object.create(Error.prototype),c.DOMException.prototype.constructor=c.DOMException}function E(a,h){return new Promise(function(S,z){var k=new A(a,h);if(k.signal&&k.signal.aborted)return z(new c.DOMException("Aborted","AbortError"));var $=new XMLHttpRequest;function I(){$.abort()}$.onload=function(){var L={statusText:$.statusText,headers:O($.getAllResponseHeaders()||"")};k.url.indexOf("file://")===0&&($.status<200||$.status>599)?L.status=200:L.status=$.status,L.url="responseURL"in $?$.responseURL:L.headers.get("X-Request-URL");var D="response"in $?$.response:$.responseText;setTimeout(function(){S(new T(D,L))},0)},$.onerror=function(){setTimeout(function(){z(new TypeError("Network request failed"))},0)},$.ontimeout=function(){setTimeout(function(){z(new TypeError("Network request timed out"))},0)},$.onabort=function(){setTimeout(function(){z(new c.DOMException("Aborted","AbortError"))},0)};function te(L){try{return L===""&&g.location.href?g.location.href:L}catch{return L}}if($.open(k.method,te(k.url),!0),k.credentials==="include"?$.withCredentials=!0:k.credentials==="omit"&&($.withCredentials=!1),"responseType"in $&&(b.blob?$.responseType="blob":b.arrayBuffer&&($.responseType="arraybuffer")),h&&typeof h.headers=="object"&&!(h.headers instanceof m||g.Headers&&h.headers instanceof g.Headers)){var X=[];Object.getOwnPropertyNames(h.headers).forEach(function(L){X.push(v(L)),$.setRequestHeader(L,x(h.headers[L]))}),k.headers.forEach(function(L,D){X.indexOf(D)===-1&&$.setRequestHeader(D,L)})}else k.headers.forEach(function(L,D){$.setRequestHeader(D,L)});k.signal&&(k.signal.addEventListener("abort",I),$.onreadystatechange=function(){$.readyState===4&&k.signal.removeEventListener("abort",I)}),$.send(typeof k._bodyInit>"u"?null:k._bodyInit)})}return E.polyfill=!0,g.fetch||(g.fetch=E,g.Headers=m,g.Request=A,g.Response=T),c.Headers=m,c.Request=A,c.Response=T,c.fetch=E,Object.defineProperty(c,"__esModule",{value:!0}),c})({})})(o),o.fetch.ponyfill=!0,delete o.fetch.polyfill;var i=r.fetch?r:o;e=i.fetch,e.default=i.fetch,e.fetch=i.fetch,e.Headers=i.Headers,e.Request=i.Request,e.Response=i.Response,t.exports=e}(ye,ye.exports)),ye.exports}var Kr=Fr();const gt=Ue(Kr);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xe=globalThis,Ne=xe.ShadowRoot&&(xe.ShadyCSS===void 0||xe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Be=Symbol(),Ge=new WeakMap;let nr=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==Be)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(Ne&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=Ge.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&Ge.set(r,e))}return e}toString(){return this.cssText}};const M=t=>new nr(typeof t=="string"?t:t+"",void 0,Be),ie=(t,...e)=>{const r=t.length===1?t[0]:e.reduce((o,i,n)=>o+(c=>{if(c._$cssResult$===!0)return c.cssText;if(typeof c=="number")return c;throw Error("Value passed to 'css' function must be a 'css' function result: "+c+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new nr(r,t,Be)},Wr=(t,e)=>{if(Ne)t.adoptedStyleSheets=e.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(const r of e){const o=document.createElement("style"),i=xe.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=r.cssText,t.appendChild(o)}},Ye=Ne?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return M(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Gr,defineProperty:Yr,getOwnPropertyDescriptor:Zr,getOwnPropertyNames:Jr,getOwnPropertySymbols:Xr,getPrototypeOf:Qr}=Object,Y=globalThis,Ze=Y.trustedTypes,Vr=Ze?Ze.emptyScript:"",Ce=Y.reactiveElementPolyfillSupport,le=(t,e)=>t,je={toAttribute(t,e){switch(e){case Boolean:t=t?Vr:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},sr=(t,e)=>!Gr(t,e),Je={attribute:!0,type:String,converter:je,reflect:!1,useDefault:!1,hasChanged:sr};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Y.litPropertyMetadata??(Y.litPropertyMetadata=new WeakMap);let oe=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=Je){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,r);i!==void 0&&Yr(this.prototype,e,i)}}static getPropertyDescriptor(e,r,o){const{get:i,set:n}=Zr(this.prototype,e)??{get(){return this[r]},set(c){this[r]=c}};return{get:i,set(c){const g=i==null?void 0:i.call(this);n==null||n.call(this,c),this.requestUpdate(e,g,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Je}static _$Ei(){if(this.hasOwnProperty(le("elementProperties")))return;const e=Qr(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(le("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(le("properties"))){const r=this.properties,o=[...Jr(r),...Xr(r)];for(const i of o)this.createProperty(i,r[i])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,i]of r)this.elementProperties.set(o,i)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const i=this._$Eu(r,o);i!==void 0&&this._$Eh.set(i,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const i of o)r.unshift(Ye(i))}else e!==void 0&&r.push(Ye(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(r=>r(this))}addController(e){var r;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)==null||r.call(e))}removeController(e){var r;(r=this._$EO)==null||r.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Wr(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostConnected)==null?void 0:o.call(r)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostDisconnected)==null?void 0:o.call(r)})}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){var n;const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(i!==void 0&&o.reflect===!0){const c=(((n=o.converter)==null?void 0:n.toAttribute)!==void 0?o.converter:je).toAttribute(r,o.type);this._$Em=e,c==null?this.removeAttribute(i):this.setAttribute(i,c),this._$Em=null}}_$AK(e,r){var n,c;const o=this.constructor,i=o._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const g=o.getPropertyOptions(i),b=typeof g.converter=="function"?{fromAttribute:g.converter}:((n=g.converter)==null?void 0:n.fromAttribute)!==void 0?g.converter:je;this._$Em=i,this[i]=b.fromAttribute(r,g.type)??((c=this._$Ej)==null?void 0:c.get(i))??null,this._$Em=null}}requestUpdate(e,r,o){var i;if(e!==void 0){const n=this.constructor,c=this[e];if(o??(o=n.getPropertyOptions(e)),!((o.hasChanged??sr)(c,r)||o.useDefault&&o.reflect&&c===((i=this._$Ej)==null?void 0:i.get(e))&&!this.hasAttribute(n._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:i,wrapped:n},c){o&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,c??r??this[e]),n!==!0||c!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,c]of this._$Ep)this[n]=c;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,c]of i){const{wrapped:g}=c,b=this[n];g!==!0||this._$AL.has(n)||b===void 0||this.C(n,void 0,c,b)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(o=this._$EO)==null||o.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(r)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(r)}willUpdate(e){}_$AE(e){var r;(r=this._$EO)==null||r.forEach(o=>{var i;return(i=o.hostUpdated)==null?void 0:i.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(r=>this._$ET(r,this[r]))),this._$EM()}updated(e){}firstUpdated(e){}};oe.elementStyles=[],oe.shadowRootOptions={mode:"open"},oe[le("elementProperties")]=new Map,oe[le("finalized")]=new Map,Ce==null||Ce({ReactiveElement:oe}),(Y.reactiveElementVersions??(Y.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ue=globalThis,Ae=ue.trustedTypes,Xe=Ae?Ae.createPolicy("lit-html",{createHTML:t=>t}):void 0,ar="$lit$",G=`lit$${Math.random().toFixed(9).slice(2)}$`,cr="?"+G,et=`<${cr}>`,re=document,we=()=>re.createComment(""),de=t=>t===null||typeof t!="object"&&typeof t!="function",Me=Array.isArray,rt=t=>Me(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",Te=`[ 	
\f\r]`,ce=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Qe=/-->/g,Ve=/>/g,Q=RegExp(`>|${Te}(?:([^\\s"'>=/]+)(${Te}*=${Te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),er=/'/g,rr=/"/g,lr=/^(?:script|style|textarea|title)$/i,ur=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),mt=ur(1),vt=ur(2),se=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),tr=new WeakMap,V=re.createTreeWalker(re,129);function fr(t,e){if(!Me(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Xe!==void 0?Xe.createHTML(e):e}const tt=(t,e)=>{const r=t.length-1,o=[];let i,n=e===2?"<svg>":e===3?"<math>":"",c=ce;for(let g=0;g<r;g++){const b=t[g];let l,_,y=-1,v=0;for(;v<b.length&&(c.lastIndex=v,_=c.exec(b),_!==null);)v=c.lastIndex,c===ce?_[1]==="!--"?c=Qe:_[1]!==void 0?c=Ve:_[2]!==void 0?(lr.test(_[2])&&(i=RegExp("</"+_[2],"g")),c=Q):_[3]!==void 0&&(c=Q):c===Q?_[0]===">"?(c=i??ce,y=-1):_[1]===void 0?y=-2:(y=c.lastIndex-_[2].length,l=_[1],c=_[3]===void 0?Q:_[3]==='"'?rr:er):c===rr||c===er?c=Q:c===Qe||c===Ve?c=ce:(c=Q,i=void 0);const x=c===Q&&t[g+1].startsWith("/>")?" ":"";n+=c===ce?b+et:y>=0?(o.push(l),b.slice(0,y)+ar+b.slice(y)+G+x):b+G+(y===-2?g:x)}return[fr(t,n+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};class ge{constructor({strings:e,_$litType$:r},o){let i;this.parts=[];let n=0,c=0;const g=e.length-1,b=this.parts,[l,_]=tt(e,r);if(this.el=ge.createElement(l,o),V.currentNode=this.el.content,r===2||r===3){const y=this.el.content.firstChild;y.replaceWith(...y.childNodes)}for(;(i=V.nextNode())!==null&&b.length<g;){if(i.nodeType===1){if(i.hasAttributes())for(const y of i.getAttributeNames())if(y.endsWith(ar)){const v=_[c++],x=i.getAttribute(y).split(G),C=/([.?@])?(.*)/.exec(v);b.push({type:1,index:n,name:C[2],strings:x,ctor:C[1]==="."?it:C[1]==="?"?nt:C[1]==="@"?st:$e}),i.removeAttribute(y)}else y.startsWith(G)&&(b.push({type:6,index:n}),i.removeAttribute(y));if(lr.test(i.tagName)){const y=i.textContent.split(G),v=y.length-1;if(v>0){i.textContent=Ae?Ae.emptyScript:"";for(let x=0;x<v;x++)i.append(y[x],we()),V.nextNode(),b.push({type:2,index:++n});i.append(y[v],we())}}}else if(i.nodeType===8)if(i.data===cr)b.push({type:2,index:n});else{let y=-1;for(;(y=i.data.indexOf(G,y+1))!==-1;)b.push({type:7,index:n}),y+=G.length-1}n++}}static createElement(e,r){const o=re.createElement("template");return o.innerHTML=e,o}}function ae(t,e,r=t,o){var c,g;if(e===se)return e;let i=o!==void 0?(c=r._$Co)==null?void 0:c[o]:r._$Cl;const n=de(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((g=i==null?void 0:i._$AO)==null||g.call(i,!1),n===void 0?i=void 0:(i=new n(t),i._$AT(t,r,o)),o!==void 0?(r._$Co??(r._$Co=[]))[o]=i:r._$Cl=i),i!==void 0&&(e=ae(t,i._$AS(t,e.values),i,o)),e}class ot{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,i=((e==null?void 0:e.creationScope)??re).importNode(r,!0);V.currentNode=i;let n=V.nextNode(),c=0,g=0,b=o[0];for(;b!==void 0;){if(c===b.index){let l;b.type===2?l=new be(n,n.nextSibling,this,e):b.type===1?l=new b.ctor(n,b.name,b.strings,this,e):b.type===6&&(l=new at(n,this,e)),this._$AV.push(l),b=o[++g]}c!==(b==null?void 0:b.index)&&(n=V.nextNode(),c++)}return V.currentNode=re,i}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}}class be{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,r,o,i){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=ae(this,e,r),de(e)?e===j||e==null||e===""?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==se&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):rt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==j&&de(this._$AH)?this._$AA.nextSibling.data=e:this.T(re.createTextNode(e)),this._$AH=e}$(e){var n;const{values:r,_$litType$:o}=e,i=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=ge.createElement(fr(o.h,o.h[0]),this.options)),o);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(r);else{const c=new ot(i,this),g=c.u(this.options);c.p(r),this.T(g),this._$AH=c}}_$AC(e){let r=tr.get(e.strings);return r===void 0&&tr.set(e.strings,r=new ge(e)),r}k(e){Me(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,i=0;for(const n of e)i===r.length?r.push(o=new be(this.O(we()),this.O(we()),this,this.options)):o=r[i],o._$AI(n),i++;i<r.length&&(this._$AR(o&&o._$AB.nextSibling,i),r.length=i)}_$AR(e=this._$AA.nextSibling,r){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,r);e&&e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){var r;this._$AM===void 0&&(this._$Cv=e,(r=this._$AP)==null||r.call(this,e))}}class $e{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,i,n){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=r,this._$AM=i,this.options=n,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=j}_$AI(e,r=this,o,i){const n=this.strings;let c=!1;if(n===void 0)e=ae(this,e,r,0),c=!de(e)||e!==this._$AH&&e!==se,c&&(this._$AH=e);else{const g=e;let b,l;for(e=n[0],b=0;b<n.length-1;b++)l=ae(this,g[o+b],r,b),l===se&&(l=this._$AH[b]),c||(c=!de(l)||l!==this._$AH[b]),l===j?e=j:e!==j&&(e+=(l??"")+n[b+1]),this._$AH[b]=l}c&&!i&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class it extends $e{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}}class nt extends $e{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==j)}}class st extends $e{constructor(e,r,o,i,n){super(e,r,o,i,n),this.type=5}_$AI(e,r=this){if((e=ae(this,e,r,0)??j)===se)return;const o=this._$AH,i=e===j&&o!==j||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,n=e!==j&&(o===j||i);i&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r;typeof this._$AH=="function"?this._$AH.call(((r=this.options)==null?void 0:r.host)??this.element,e):this._$AH.handleEvent(e)}}class at{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){ae(this,e)}}const ze=ue.litHtmlPolyfillSupport;ze==null||ze(ge,be),(ue.litHtmlVersions??(ue.litHtmlVersions=[])).push("3.3.0");const ct=(t,e,r)=>{const o=(r==null?void 0:r.renderBefore)??e;let i=o._$litPart$;if(i===void 0){const n=(r==null?void 0:r.renderBefore)??null;o._$litPart$=i=new be(e.insertBefore(we(),n),n,void 0,r??{})}return i._$AI(t),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ee=globalThis;class _e extends oe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;const e=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=e.firstChild),e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ct(r,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return se}}var or;_e._$litElement$=!0,_e.finalized=!0,(or=ee.litElementHydrateSupport)==null||or.call(ee,{LitElement:_e});const ke=ee.litElementPolyfillSupport;ke==null||ke({LitElement:_e});(ee.litElementVersions??(ee.litElementVersions=[])).push("4.2.0");let fe,Z,J;function yt(t,e){fe=document.createElement("style"),Z=document.createElement("style"),J=document.createElement("style"),fe.textContent=ne(t).core.cssText,Z.textContent=ne(t).dark.cssText,J.textContent=ne(t).light.cssText,document.head.appendChild(fe),document.head.appendChild(Z),document.head.appendChild(J),lt(e)}function lt(t){Z&&J&&(t==="light"?(Z.removeAttribute("media"),J.media="enabled"):(J.removeAttribute("media"),Z.media="enabled"))}function xt(t){fe&&Z&&J&&(fe.textContent=ne(t).core.cssText,Z.textContent=ne(t).dark.cssText,J.textContent=ne(t).light.cssText)}function ne(t){return{core:ie`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      @keyframes w3m-shake {
        0% {
          transform: scale(1) rotate(0deg);
        }
        20% {
          transform: scale(1) rotate(-1deg);
        }
        40% {
          transform: scale(1) rotate(1.5deg);
        }
        60% {
          transform: scale(1) rotate(-1.5deg);
        }
        80% {
          transform: scale(1) rotate(1deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }
      @keyframes w3m-iframe-fade-out {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
      @keyframes w3m-iframe-zoom-in {
        0% {
          transform: translateY(50px);
          opacity: 0;
        }
        100% {
          transform: translateY(0px);
          opacity: 1;
        }
      }
      @keyframes w3m-iframe-zoom-in-mobile {
        0% {
          transform: scale(0.95);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      :root {
        --w3m-modal-width: 360px;
        --w3m-color-mix-strength: ${M(t!=null&&t["--w3m-color-mix-strength"]?`${t["--w3m-color-mix-strength"]}%`:"0%")};
        --w3m-font-family: ${M((t==null?void 0:t["--w3m-font-family"])||"Inter, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;")};
        --w3m-font-size-master: ${M((t==null?void 0:t["--w3m-font-size-master"])||"10px")};
        --w3m-border-radius-master: ${M((t==null?void 0:t["--w3m-border-radius-master"])||"4px")};
        --w3m-z-index: ${M((t==null?void 0:t["--w3m-z-index"])||999)};

        --wui-font-family: var(--w3m-font-family);

        --wui-font-size-mini: calc(var(--w3m-font-size-master) * 0.8);
        --wui-font-size-micro: var(--w3m-font-size-master);
        --wui-font-size-tiny: calc(var(--w3m-font-size-master) * 1.2);
        --wui-font-size-small: calc(var(--w3m-font-size-master) * 1.4);
        --wui-font-size-paragraph: calc(var(--w3m-font-size-master) * 1.6);
        --wui-font-size-medium: calc(var(--w3m-font-size-master) * 1.8);
        --wui-font-size-large: calc(var(--w3m-font-size-master) * 2);
        --wui-font-size-title-6: calc(var(--w3m-font-size-master) * 2.2);
        --wui-font-size-medium-title: calc(var(--w3m-font-size-master) * 2.4);
        --wui-font-size-2xl: calc(var(--w3m-font-size-master) * 4);

        --wui-border-radius-5xs: var(--w3m-border-radius-master);
        --wui-border-radius-4xs: calc(var(--w3m-border-radius-master) * 1.5);
        --wui-border-radius-3xs: calc(var(--w3m-border-radius-master) * 2);
        --wui-border-radius-xxs: calc(var(--w3m-border-radius-master) * 3);
        --wui-border-radius-xs: calc(var(--w3m-border-radius-master) * 4);
        --wui-border-radius-s: calc(var(--w3m-border-radius-master) * 5);
        --wui-border-radius-m: calc(var(--w3m-border-radius-master) * 7);
        --wui-border-radius-l: calc(var(--w3m-border-radius-master) * 9);
        --wui-border-radius-3xl: calc(var(--w3m-border-radius-master) * 20);

        --wui-font-weight-light: 400;
        --wui-font-weight-regular: 500;
        --wui-font-weight-medium: 600;
        --wui-font-weight-bold: 700;

        --wui-letter-spacing-2xl: -1.6px;
        --wui-letter-spacing-medium-title: -0.96px;
        --wui-letter-spacing-title-6: -0.88px;
        --wui-letter-spacing-large: -0.8px;
        --wui-letter-spacing-medium: -0.72px;
        --wui-letter-spacing-paragraph: -0.64px;
        --wui-letter-spacing-small: -0.56px;
        --wui-letter-spacing-tiny: -0.48px;
        --wui-letter-spacing-micro: -0.2px;
        --wui-letter-spacing-mini: -0.16px;

        --wui-spacing-0: 0px;
        --wui-spacing-4xs: 2px;
        --wui-spacing-3xs: 4px;
        --wui-spacing-xxs: 6px;
        --wui-spacing-2xs: 7px;
        --wui-spacing-xs: 8px;
        --wui-spacing-1xs: 10px;
        --wui-spacing-s: 12px;
        --wui-spacing-m: 14px;
        --wui-spacing-l: 16px;
        --wui-spacing-2l: 18px;
        --wui-spacing-xl: 20px;
        --wui-spacing-xxl: 24px;
        --wui-spacing-2xl: 32px;
        --wui-spacing-3xl: 40px;
        --wui-spacing-4xl: 90px;
        --wui-spacing-5xl: 95px;

        --wui-icon-box-size-xxs: 14px;
        --wui-icon-box-size-xs: 20px;
        --wui-icon-box-size-sm: 24px;
        --wui-icon-box-size-md: 32px;
        --wui-icon-box-size-mdl: 36px;
        --wui-icon-box-size-lg: 40px;
        --wui-icon-box-size-2lg: 48px;
        --wui-icon-box-size-xl: 64px;

        --wui-icon-size-inherit: inherit;
        --wui-icon-size-xxs: 10px;
        --wui-icon-size-xs: 12px;
        --wui-icon-size-sm: 14px;
        --wui-icon-size-md: 16px;
        --wui-icon-size-mdl: 18px;
        --wui-icon-size-lg: 20px;
        --wui-icon-size-xl: 24px;
        --wui-icon-size-xxl: 28px;

        --wui-wallet-image-size-inherit: inherit;
        --wui-wallet-image-size-sm: 40px;
        --wui-wallet-image-size-md: 56px;
        --wui-wallet-image-size-lg: 80px;

        --wui-visual-size-size-inherit: inherit;
        --wui-visual-size-sm: 40px;
        --wui-visual-size-md: 55px;
        --wui-visual-size-lg: 80px;

        --wui-box-size-md: 100px;
        --wui-box-size-lg: 120px;

        --wui-ease-out-power-2: cubic-bezier(0, 0, 0.22, 1);
        --wui-ease-out-power-1: cubic-bezier(0, 0, 0.55, 1);

        --wui-ease-in-power-3: cubic-bezier(0.66, 0, 1, 1);
        --wui-ease-in-power-2: cubic-bezier(0.45, 0, 1, 1);
        --wui-ease-in-power-1: cubic-bezier(0.3, 0, 1, 1);

        --wui-ease-inout-power-1: cubic-bezier(0.45, 0, 0.55, 1);

        --wui-duration-lg: 200ms;
        --wui-duration-md: 125ms;
        --wui-duration-sm: 75ms;

        --wui-path-network-sm: path(
          'M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z'
        );

        --wui-path-network-md: path(
          'M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z'
        );

        --wui-path-network-lg: path(
          'M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z'
        );

        --wui-width-network-sm: 36px;
        --wui-width-network-md: 48px;
        --wui-width-network-lg: 86px;

        --wui-height-network-sm: 40px;
        --wui-height-network-md: 54px;
        --wui-height-network-lg: 96px;

        --wui-icon-size-network-xs: 12px;
        --wui-icon-size-network-sm: 16px;
        --wui-icon-size-network-md: 24px;
        --wui-icon-size-network-lg: 42px;

        --wui-color-inherit: inherit;

        --wui-color-inverse-100: #fff;
        --wui-color-inverse-000: #000;

        --wui-cover: rgba(20, 20, 20, 0.8);

        --wui-color-modal-bg: var(--wui-color-modal-bg-base);

        --wui-color-accent-100: var(--wui-color-accent-base-100);
        --wui-color-accent-090: var(--wui-color-accent-base-090);
        --wui-color-accent-080: var(--wui-color-accent-base-080);

        --wui-color-success-100: var(--wui-color-success-base-100);
        --wui-color-success-125: var(--wui-color-success-base-125);

        --wui-color-warning-100: var(--wui-color-warning-base-100);

        --wui-color-error-100: var(--wui-color-error-base-100);
        --wui-color-error-125: var(--wui-color-error-base-125);

        --wui-color-blue-100: var(--wui-color-blue-base-100);
        --wui-color-blue-90: var(--wui-color-blue-base-90);

        --wui-icon-box-bg-error-100: var(--wui-icon-box-bg-error-base-100);
        --wui-icon-box-bg-blue-100: var(--wui-icon-box-bg-blue-base-100);
        --wui-icon-box-bg-success-100: var(--wui-icon-box-bg-success-base-100);
        --wui-icon-box-bg-inverse-100: var(--wui-icon-box-bg-inverse-base-100);

        --wui-all-wallets-bg-100: var(--wui-all-wallets-bg-100);

        --wui-avatar-border: var(--wui-avatar-border-base);

        --wui-thumbnail-border: var(--wui-thumbnail-border-base);

        --wui-wallet-button-bg: var(--wui-wallet-button-bg-base);

        --wui-box-shadow-blue: var(--wui-color-accent-glass-020);
      }

      @supports (background: color-mix(in srgb, white 50%, black)) {
        :root {
          --wui-color-modal-bg: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-modal-bg-base)
          );

          --wui-box-shadow-blue: color-mix(in srgb, var(--wui-color-accent-100) 20%, transparent);

          --wui-color-accent-100: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 100%,
            transparent
          );
          --wui-color-accent-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-color-accent-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );
          --wui-color-accent-glass-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-color-accent-glass-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );
          --wui-color-accent-glass-020: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 20%,
            transparent
          );
          --wui-color-accent-glass-015: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 15%,
            transparent
          );
          --wui-color-accent-glass-010: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 10%,
            transparent
          );
          --wui-color-accent-glass-005: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 5%,
            transparent
          );
          --wui-color-accent-002: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 2%,
            transparent
          );

          --wui-color-fg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-100)
          );
          --wui-color-fg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-125)
          );
          --wui-color-fg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-150)
          );
          --wui-color-fg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-175)
          );
          --wui-color-fg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-200)
          );
          --wui-color-fg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-225)
          );
          --wui-color-fg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-250)
          );
          --wui-color-fg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-275)
          );
          --wui-color-fg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-300)
          );
          --wui-color-fg-325: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-325)
          );
          --wui-color-fg-350: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-350)
          );

          --wui-color-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-100)
          );
          --wui-color-bg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-125)
          );
          --wui-color-bg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-150)
          );
          --wui-color-bg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-175)
          );
          --wui-color-bg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-200)
          );
          --wui-color-bg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-225)
          );
          --wui-color-bg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-250)
          );
          --wui-color-bg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-275)
          );
          --wui-color-bg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-300)
          );
          --wui-color-bg-325: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-325)
          );
          --wui-color-bg-350: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-350)
          );

          --wui-color-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-success-base-100)
          );
          --wui-color-success-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-success-base-125)
          );

          --wui-color-warning-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-warning-base-100)
          );

          --wui-color-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-error-base-100)
          );
          --wui-color-blue-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-blue-base-100)
          );
          --wui-color-blue-90: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-blue-base-90)
          );
          --wui-color-error-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-error-base-125)
          );

          --wui-icon-box-bg-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-error-base-100)
          );
          --wui-icon-box-bg-accent-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-blue-base-100)
          );
          --wui-icon-box-bg-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-success-base-100)
          );
          --wui-icon-box-bg-inverse-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-inverse-base-100)
          );

          --wui-all-wallets-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-all-wallets-bg-100)
          );

          --wui-avatar-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-avatar-border-base)
          );

          --wui-thumbnail-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-thumbnail-border-base)
          );

          --wui-wallet-button-bg: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-wallet-button-bg-base)
          );
        }
      }
    `,light:ie`
      :root {
        --w3m-color-mix: ${M((t==null?void 0:t["--w3m-color-mix"])||"#fff")};
        --w3m-accent: ${M(me(t,"dark")["--w3m-accent"])};
        --w3m-default: #fff;

        --wui-color-modal-bg-base: ${M(me(t,"dark")["--w3m-background"])};
        --wui-color-accent-base-100: var(--w3m-accent);

        --wui-color-blueberry-100: hsla(230, 100%, 67%, 1);
        --wui-color-blueberry-090: hsla(231, 76%, 61%, 1);
        --wui-color-blueberry-080: hsla(230, 59%, 55%, 1);
        --wui-color-blueberry-050: hsla(231, 100%, 70%, 0.1);

        --wui-color-fg-100: #e4e7e7;
        --wui-color-fg-125: #d0d5d5;
        --wui-color-fg-150: #a8b1b1;
        --wui-color-fg-175: #a8b0b0;
        --wui-color-fg-200: #949e9e;
        --wui-color-fg-225: #868f8f;
        --wui-color-fg-250: #788080;
        --wui-color-fg-275: #788181;
        --wui-color-fg-300: #6e7777;
        --wui-color-fg-325: #9a9a9a;
        --wui-color-fg-350: #363636;

        --wui-color-bg-100: #141414;
        --wui-color-bg-125: #191a1a;
        --wui-color-bg-150: #1e1f1f;
        --wui-color-bg-175: #222525;
        --wui-color-bg-200: #272a2a;
        --wui-color-bg-225: #2c3030;
        --wui-color-bg-250: #313535;
        --wui-color-bg-275: #363b3b;
        --wui-color-bg-300: #3b4040;
        --wui-color-bg-325: #252525;
        --wui-color-bg-350: #ffffff;

        --wui-color-success-base-100: #26d962;
        --wui-color-success-base-125: #30a46b;

        --wui-color-warning-base-100: #f3a13f;

        --wui-color-error-base-100: #f25a67;
        --wui-color-error-base-125: #df4a34;

        --wui-color-blue-base-100: rgba(102, 125, 255, 1);
        --wui-color-blue-base-90: rgba(102, 125, 255, 0.9);

        --wui-color-success-glass-001: rgba(38, 217, 98, 0.01);
        --wui-color-success-glass-002: rgba(38, 217, 98, 0.02);
        --wui-color-success-glass-005: rgba(38, 217, 98, 0.05);
        --wui-color-success-glass-010: rgba(38, 217, 98, 0.1);
        --wui-color-success-glass-015: rgba(38, 217, 98, 0.15);
        --wui-color-success-glass-020: rgba(38, 217, 98, 0.2);
        --wui-color-success-glass-025: rgba(38, 217, 98, 0.25);
        --wui-color-success-glass-030: rgba(38, 217, 98, 0.3);
        --wui-color-success-glass-060: rgba(38, 217, 98, 0.6);
        --wui-color-success-glass-080: rgba(38, 217, 98, 0.8);

        --wui-color-success-glass-reown-020: rgba(48, 164, 107, 0.2);

        --wui-color-warning-glass-reown-020: rgba(243, 161, 63, 0.2);

        --wui-color-error-glass-001: rgba(242, 90, 103, 0.01);
        --wui-color-error-glass-002: rgba(242, 90, 103, 0.02);
        --wui-color-error-glass-005: rgba(242, 90, 103, 0.05);
        --wui-color-error-glass-010: rgba(242, 90, 103, 0.1);
        --wui-color-error-glass-015: rgba(242, 90, 103, 0.15);
        --wui-color-error-glass-020: rgba(242, 90, 103, 0.2);
        --wui-color-error-glass-025: rgba(242, 90, 103, 0.25);
        --wui-color-error-glass-030: rgba(242, 90, 103, 0.3);
        --wui-color-error-glass-060: rgba(242, 90, 103, 0.6);
        --wui-color-error-glass-080: rgba(242, 90, 103, 0.8);

        --wui-color-error-glass-reown-020: rgba(223, 74, 52, 0.2);

        --wui-color-gray-glass-001: rgba(255, 255, 255, 0.01);
        --wui-color-gray-glass-002: rgba(255, 255, 255, 0.02);
        --wui-color-gray-glass-005: rgba(255, 255, 255, 0.05);
        --wui-color-gray-glass-010: rgba(255, 255, 255, 0.1);
        --wui-color-gray-glass-015: rgba(255, 255, 255, 0.15);
        --wui-color-gray-glass-020: rgba(255, 255, 255, 0.2);
        --wui-color-gray-glass-025: rgba(255, 255, 255, 0.25);
        --wui-color-gray-glass-030: rgba(255, 255, 255, 0.3);
        --wui-color-gray-glass-060: rgba(255, 255, 255, 0.6);
        --wui-color-gray-glass-080: rgba(255, 255, 255, 0.8);
        --wui-color-gray-glass-090: rgba(255, 255, 255, 0.9);

        --wui-color-dark-glass-100: rgba(42, 42, 42, 1);

        --wui-icon-box-bg-error-base-100: #3c2426;
        --wui-icon-box-bg-blue-base-100: #20303f;
        --wui-icon-box-bg-success-base-100: #1f3a28;
        --wui-icon-box-bg-inverse-base-100: #243240;

        --wui-all-wallets-bg-100: #222b35;

        --wui-avatar-border-base: #252525;

        --wui-thumbnail-border-base: #252525;

        --wui-wallet-button-bg-base: var(--wui-color-bg-125);

        --w3m-card-embedded-shadow-color: rgb(17 17 18 / 25%);
      }
    `,dark:ie`
      :root {
        --w3m-color-mix: ${M((t==null?void 0:t["--w3m-color-mix"])||"#000")};
        --w3m-accent: ${M(me(t,"light")["--w3m-accent"])};
        --w3m-default: #000;

        --wui-color-modal-bg-base: ${M(me(t,"light")["--w3m-background"])};
        --wui-color-accent-base-100: var(--w3m-accent);

        --wui-color-blueberry-100: hsla(231, 100%, 70%, 1);
        --wui-color-blueberry-090: hsla(231, 97%, 72%, 1);
        --wui-color-blueberry-080: hsla(231, 92%, 74%, 1);

        --wui-color-fg-100: #141414;
        --wui-color-fg-125: #2d3131;
        --wui-color-fg-150: #474d4d;
        --wui-color-fg-175: #636d6d;
        --wui-color-fg-200: #798686;
        --wui-color-fg-225: #828f8f;
        --wui-color-fg-250: #8b9797;
        --wui-color-fg-275: #95a0a0;
        --wui-color-fg-300: #9ea9a9;
        --wui-color-fg-325: #9a9a9a;
        --wui-color-fg-350: #d0d0d0;

        --wui-color-bg-100: #ffffff;
        --wui-color-bg-125: #f5fafa;
        --wui-color-bg-150: #f3f8f8;
        --wui-color-bg-175: #eef4f4;
        --wui-color-bg-200: #eaf1f1;
        --wui-color-bg-225: #e5eded;
        --wui-color-bg-250: #e1e9e9;
        --wui-color-bg-275: #dce7e7;
        --wui-color-bg-300: #d8e3e3;
        --wui-color-bg-325: #f3f3f3;
        --wui-color-bg-350: #202020;

        --wui-color-success-base-100: #26b562;
        --wui-color-success-base-125: #30a46b;

        --wui-color-warning-base-100: #f3a13f;

        --wui-color-error-base-100: #f05142;
        --wui-color-error-base-125: #df4a34;

        --wui-color-blue-base-100: rgba(102, 125, 255, 1);
        --wui-color-blue-base-90: rgba(102, 125, 255, 0.9);

        --wui-color-success-glass-001: rgba(38, 181, 98, 0.01);
        --wui-color-success-glass-002: rgba(38, 181, 98, 0.02);
        --wui-color-success-glass-005: rgba(38, 181, 98, 0.05);
        --wui-color-success-glass-010: rgba(38, 181, 98, 0.1);
        --wui-color-success-glass-015: rgba(38, 181, 98, 0.15);
        --wui-color-success-glass-020: rgba(38, 181, 98, 0.2);
        --wui-color-success-glass-025: rgba(38, 181, 98, 0.25);
        --wui-color-success-glass-030: rgba(38, 181, 98, 0.3);
        --wui-color-success-glass-060: rgba(38, 181, 98, 0.6);
        --wui-color-success-glass-080: rgba(38, 181, 98, 0.8);

        --wui-color-success-glass-reown-020: rgba(48, 164, 107, 0.2);

        --wui-color-warning-glass-reown-020: rgba(243, 161, 63, 0.2);

        --wui-color-error-glass-001: rgba(240, 81, 66, 0.01);
        --wui-color-error-glass-002: rgba(240, 81, 66, 0.02);
        --wui-color-error-glass-005: rgba(240, 81, 66, 0.05);
        --wui-color-error-glass-010: rgba(240, 81, 66, 0.1);
        --wui-color-error-glass-015: rgba(240, 81, 66, 0.15);
        --wui-color-error-glass-020: rgba(240, 81, 66, 0.2);
        --wui-color-error-glass-025: rgba(240, 81, 66, 0.25);
        --wui-color-error-glass-030: rgba(240, 81, 66, 0.3);
        --wui-color-error-glass-060: rgba(240, 81, 66, 0.6);
        --wui-color-error-glass-080: rgba(240, 81, 66, 0.8);

        --wui-color-error-glass-reown-020: rgba(223, 74, 52, 0.2);

        --wui-icon-box-bg-error-base-100: #f4dfdd;
        --wui-icon-box-bg-blue-base-100: #d9ecfb;
        --wui-icon-box-bg-success-base-100: #daf0e4;
        --wui-icon-box-bg-inverse-base-100: #dcecfc;

        --wui-all-wallets-bg-100: #e8f1fa;

        --wui-avatar-border-base: #f3f4f4;

        --wui-thumbnail-border-base: #eaefef;

        --wui-wallet-button-bg-base: var(--wui-color-bg-125);

        --wui-color-gray-glass-001: rgba(0, 0, 0, 0.01);
        --wui-color-gray-glass-002: rgba(0, 0, 0, 0.02);
        --wui-color-gray-glass-005: rgba(0, 0, 0, 0.05);
        --wui-color-gray-glass-010: rgba(0, 0, 0, 0.1);
        --wui-color-gray-glass-015: rgba(0, 0, 0, 0.15);
        --wui-color-gray-glass-020: rgba(0, 0, 0, 0.2);
        --wui-color-gray-glass-025: rgba(0, 0, 0, 0.25);
        --wui-color-gray-glass-030: rgba(0, 0, 0, 0.3);
        --wui-color-gray-glass-060: rgba(0, 0, 0, 0.6);
        --wui-color-gray-glass-080: rgba(0, 0, 0, 0.8);
        --wui-color-gray-glass-090: rgba(0, 0, 0, 0.9);

        --wui-color-dark-glass-100: rgba(233, 233, 233, 1);

        --w3m-card-embedded-shadow-color: rgb(224 225 233 / 25%);
      }
    `}}const _t=ie`
  *,
  *::after,
  *::before,
  :host {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-style: normal;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    font-family: var(--wui-font-family);
    backface-visibility: hidden;
  }
`,At=ie`
  button,
  a {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      box-shadow var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border, box-shadow, border-radius;
    outline: none;
    border: none;
    column-gap: var(--wui-spacing-3xs);
    background-color: transparent;
    text-decoration: none;
  }

  wui-flex {
    transition: border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius;
  }

  button:disabled > wui-wallet-image,
  button:disabled > wui-all-wallets-image,
  button:disabled > wui-network-image,
  button:disabled > wui-image,
  button:disabled > wui-transaction-visual,
  button:disabled > wui-logo {
    filter: grayscale(1);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-gray-glass-005);
    }

    button:active:enabled {
      background-color: var(--wui-color-gray-glass-010);
    }
  }

  button:disabled > wui-icon-box {
    opacity: 0.5;
  }

  input {
    border: none;
    outline: none;
    appearance: none;
  }
`,$t=ie`
  .wui-color-inherit {
    color: var(--wui-color-inherit);
  }

  .wui-color-accent-100 {
    color: var(--wui-color-accent-100);
  }

  .wui-color-error-100 {
    color: var(--wui-color-error-100);
  }

  .wui-color-blue-100 {
    color: var(--wui-color-blue-100);
  }

  .wui-color-blue-90 {
    color: var(--wui-color-blue-90);
  }

  .wui-color-error-125 {
    color: var(--wui-color-error-125);
  }

  .wui-color-success-100 {
    color: var(--wui-color-success-100);
  }

  .wui-color-success-125 {
    color: var(--wui-color-success-125);
  }

  .wui-color-inverse-100 {
    color: var(--wui-color-inverse-100);
  }

  .wui-color-inverse-000 {
    color: var(--wui-color-inverse-000);
  }

  .wui-color-fg-100 {
    color: var(--wui-color-fg-100);
  }

  .wui-color-fg-200 {
    color: var(--wui-color-fg-200);
  }

  .wui-color-fg-300 {
    color: var(--wui-color-fg-300);
  }

  .wui-color-fg-325 {
    color: var(--wui-color-fg-325);
  }

  .wui-color-fg-350 {
    color: var(--wui-color-fg-350);
  }

  .wui-bg-color-inherit {
    background-color: var(--wui-color-inherit);
  }

  .wui-bg-color-blue-100 {
    background-color: var(--wui-color-accent-100);
  }

  .wui-bg-color-error-100 {
    background-color: var(--wui-color-error-100);
  }

  .wui-bg-color-error-125 {
    background-color: var(--wui-color-error-125);
  }

  .wui-bg-color-success-100 {
    background-color: var(--wui-color-success-100);
  }

  .wui-bg-color-success-125 {
    background-color: var(--wui-color-success-100);
  }

  .wui-bg-color-inverse-100 {
    background-color: var(--wui-color-inverse-100);
  }

  .wui-bg-color-inverse-000 {
    background-color: var(--wui-color-inverse-000);
  }

  .wui-bg-color-fg-100 {
    background-color: var(--wui-color-fg-100);
  }

  .wui-bg-color-fg-200 {
    background-color: var(--wui-color-fg-200);
  }

  .wui-bg-color-fg-300 {
    background-color: var(--wui-color-fg-300);
  }

  .wui-color-fg-325 {
    background-color: var(--wui-color-fg-325);
  }

  .wui-color-fg-350 {
    background-color: var(--wui-color-fg-350);
  }
`;function pe(t){return{formatters:void 0,fees:void 0,serializers:void 0,...t}}const Et=pe({id:"5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",name:"Solana",network:"solana-mainnet",nativeCurrency:{name:"Solana",symbol:"SOL",decimals:9},rpcUrls:{default:{http:["https://rpc.walletconnect.org/v1"]}},blockExplorers:{default:{name:"Solscan",url:"https://solscan.io"}},testnet:!1,chainNamespace:"solana",caipNetworkId:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",deprecatedCaipNetworkId:"solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ"}),St=pe({id:"EtWTRABZaYq6iMfeYKouRu166VU2xqa1",name:"Solana Devnet",network:"solana-devnet",nativeCurrency:{name:"Solana",symbol:"SOL",decimals:9},rpcUrls:{default:{http:["https://rpc.walletconnect.org/v1"]}},blockExplorers:{default:{name:"Solscan",url:"https://solscan.io"}},testnet:!0,chainNamespace:"solana",caipNetworkId:"solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",deprecatedCaipNetworkId:"solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K"});pe({id:"4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z",name:"Solana Testnet",network:"solana-testnet",nativeCurrency:{name:"Solana",symbol:"SOL",decimals:9},rpcUrls:{default:{http:["https://rpc.walletconnect.org/v1"]}},blockExplorers:{default:{name:"Solscan",url:"https://solscan.io"}},testnet:!0,chainNamespace:"solana",caipNetworkId:"solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z"});pe({id:"000000000019d6689c085ae165831e93",caipNetworkId:"bip122:000000000019d6689c085ae165831e93",chainNamespace:"bip122",name:"Bitcoin",nativeCurrency:{name:"Bitcoin",symbol:"BTC",decimals:8},rpcUrls:{default:{http:["https://rpc.walletconnect.org/v1"]}}});pe({id:"000000000933ea01ad0ee984209779ba",caipNetworkId:"bip122:000000000933ea01ad0ee984209779ba",chainNamespace:"bip122",name:"Bitcoin Testnet",nativeCurrency:{name:"Bitcoin",symbol:"BTC",decimals:8},rpcUrls:{default:{http:["https://rpc.walletconnect.org/v1"]}},testnet:!0});let W;function Ot(t){t&&(W=t)}function Ct(){if(!W)throw new Error('Please call "createAppKit" before using "useAppKit" hook');async function t(r){await(W==null?void 0:W.open(r))}async function e(){await(W==null?void 0:W.close())}return{open:t,close:e}}export{j as E,ft as N,ht as O,se as T,wt as V,Et as a,pr as b,dt as c,lt as d,dr as e,xt as f,me as g,Ot as h,ie as i,_e as j,At as k,$t as l,vt as m,yt as n,gt as o,sr as p,je as q,_t as r,St as s,wr as t,Ct as u,mt as x};
