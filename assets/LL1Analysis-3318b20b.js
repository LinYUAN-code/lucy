import{b as te,R as ne}from"./RightTips-4f346bf7.js";import{C as re}from"./Header-f97b559f.js";import{I as oe}from"./InputString-22ac48b9.js";import{D as se,_ as ae,a as ie,u as le,b as de,c as D,r as G,w as ce,d as P,o as A,e as M,f as T,g as U,t as W,m as V,h as F,k as K,i as ue,F as X,j as Q,y as pe,z as fe}from"./index-9387c24e.js";import"./index.cjs-5f979497.js";/* empty css                                                                    */var $={},he={get exports(){return $},set exports(B){$=B}},H={},be={get exports(){return H},set exports(B){H=B}};(function(B,z){(function(x,N){B.exports=N()})(window,function(){return function(x){var N={};function h(s){if(N[s])return N[s].exports;var d=N[s]={i:s,l:!1,exports:{}};return x[s].call(d.exports,d,d.exports,h),d.l=!0,d.exports}return h.m=x,h.c=N,h.d=function(s,d,f){h.o(s,d)||Object.defineProperty(s,d,{enumerable:!0,get:f})},h.r=function(s){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(s,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(s,"__esModule",{value:!0})},h.t=function(s,d){if(1&d&&(s=h(s)),8&d||4&d&&typeof s=="object"&&s&&s.__esModule)return s;var f=Object.create(null);if(h.r(f),Object.defineProperty(f,"default",{enumerable:!0,value:s}),2&d&&typeof s!="string")for(var g in s)h.d(f,g,function(k){return s[k]}.bind(null,g));return f},h.n=function(s){var d=s&&s.__esModule?function(){return s.default}:function(){return s};return h.d(d,"a",d),d},h.o=function(s,d){return Object.prototype.hasOwnProperty.call(s,d)},h.p="",h(h.s=0)}([function(x,N,h){Object.defineProperty(N,"__esModule",{value:!0}),N.default=c;var s,d=(s=h(1))&&s.__esModule?s:{default:s};function f(e,t){return function(n){if(Array.isArray(n))return n}(e)||function(n,r){var l=[],i=!0,p=!1,_=void 0;try{for(var I,b=n[Symbol.iterator]();!(i=(I=b.next()).done)&&(l.push(I.value),!r||l.length!==r);i=!0);}catch(m){p=!0,_=m}finally{try{i||b.return==null||b.return()}finally{if(p)throw _}}return l}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function g(e){var t={};return e.reduce(function(n,r){return t[r]||(t[r]=!0,n.push(r)),n},[])}function k(e,t){requestAnimationFrame(function(){t.enter(),requestAnimationFrame(function(){t.active(),setTimeout(function(){t.leave()},e)})})}function c(e,t){var n=this;this.treeNodes=[],this.nodesById={},this.leafNodesById={},this.liElementsById={},this.willUpdateNodesById={},this.container=e,this.options=Object.assign({selectMode:"checkbox",values:[],disables:[],beforeLoad:null,loaded:null,url:null,method:"GET",closeDepth:null},t),Object.defineProperties(this,{values:{get:function(){return this.getValues()},set:function(r){return this.setValues(g(r))}},disables:{get:function(){return this.getDisables()},set:function(r){return this.setDisables(g(r))}},selectedNodes:{get:function(){var r=[],l=this.nodesById;for(var i in l)if(l.hasOwnProperty(i)&&(l[i].status===1||l[i].status===2)){var p=Object.assign({},l[i]);delete p.parent,delete p.children,r.push(p)}return r}},disabledNodes:{get:function(){var r=[],l=this.nodesById;for(var i in l)if(l.hasOwnProperty(i)&&l[i].disabled){var p=Object.assign({},l[i]);delete p.parent,r.push(p)}return r}}}),this.options.url?this.load(function(r){n.init(r)}):this.init(this.options.data)}h(2),c.prototype.init=function(e){var t=c.parseTreeData(e),n=t.treeNodes,r=t.nodesById,l=t.leafNodesById,i=t.defaultValues,p=t.defaultDisables;this.treeNodes=n,this.nodesById=r,this.leafNodesById=l,this.render(this.treeNodes);var _=this.options,I=_.values,b=_.disables,m=_.loaded;I&&I.length&&(i=I),i.length&&this.setValues(i),b&&b.length&&(p=b),p.length&&this.setDisables(p),m&&m.call(this)},c.prototype.load=function(e){var t=this.options,n=t.url,r=t.method,l=t.beforeLoad;(0,d.default)({url:n,method:r,success:function(i){var p=i;l&&(p=l(i)),e(p)}})},c.prototype.render=function(e){var t=c.createRootEle();t.appendChild(this.buildTree(e,0)),this.bindEvent(t);var n=document.querySelector(this.container);(function(r){for(;r.firstChild;)r.removeChild(r.firstChild)})(n),n.appendChild(t)},c.prototype.buildTree=function(e,t){var n=this,r=c.createUlEle();return e&&e.length&&e.forEach(function(l){var i=c.createLiEle(l,t===n.options.closeDepth-1);n.liElementsById[l.id]=i;var p=null;l.children&&l.children.length&&(p=n.buildTree(l.children,t+1)),p&&i.appendChild(p),r.appendChild(i)}),r},c.prototype.bindEvent=function(e){var t=this;e.addEventListener("click",function(n){var r=n.target;r.nodeName==="SPAN"&&(r.classList.contains("treejs-checkbox")||r.classList.contains("treejs-label"))?t.onItemClick(r.parentNode.nodeId):r.nodeName==="LI"&&r.classList.contains("treejs-node")?t.onItemClick(r.nodeId):r.nodeName==="SPAN"&&r.classList.contains("treejs-switcher")&&t.onSwitcherClick(r)},!1)},c.prototype.onItemClick=function(e){var t=this.nodesById[e],n=this.options.onChange;t.disabled||(this.setValue(e),this.updateLiElements()),n&&n.call(this)},c.prototype.setValue=function(e){var t=this.nodesById[e];if(t){var n=t.status,r=n===1||n===2?0:2;t.status=r,this.markWillUpdateNode(t),this.walkUp(t,"status"),this.walkDown(t,"status")}},c.prototype.getValues=function(){var e=[];for(var t in this.leafNodesById)this.leafNodesById.hasOwnProperty(t)&&(this.leafNodesById[t].status!==1&&this.leafNodesById[t].status!==2||e.push(t));return e},c.prototype.setValues=function(e){var t=this;this.emptyNodesCheckStatus(),e.forEach(function(r){t.setValue(r)}),this.updateLiElements();var n=this.options.onChange;n&&n.call(this)},c.prototype.setDisable=function(e){var t=this.nodesById[e];t&&(t.disabled||(t.disabled=!0,this.markWillUpdateNode(t),this.walkUp(t,"disabled"),this.walkDown(t,"disabled")))},c.prototype.getDisables=function(){var e=[];for(var t in this.leafNodesById)this.leafNodesById.hasOwnProperty(t)&&this.leafNodesById[t].disabled&&e.push(t);return e},c.prototype.setDisables=function(e){var t=this;this.emptyNodesDisable(),e.forEach(function(n){t.setDisable(n)}),this.updateLiElements()},c.prototype.emptyNodesCheckStatus=function(){this.willUpdateNodesById=this.getSelectedNodesById(),Object.values(this.willUpdateNodesById).forEach(function(e){e.disabled||(e.status=0)})},c.prototype.emptyNodesDisable=function(){this.willUpdateNodesById=this.getDisabledNodesById(),Object.values(this.willUpdateNodesById).forEach(function(e){e.disabled=!1})},c.prototype.getSelectedNodesById=function(){return Object.entries(this.nodesById).reduce(function(e,t){var n=f(t,2),r=n[0],l=n[1];return l.status!==1&&l.status!==2||(e[r]=l),e},{})},c.prototype.getDisabledNodesById=function(){return Object.entries(this.nodesById).reduce(function(e,t){var n=f(t,2),r=n[0],l=n[1];return l.disabled&&(e[r]=l),e},{})},c.prototype.updateLiElements=function(){var e=this;Object.values(this.willUpdateNodesById).forEach(function(t){e.updateLiElement(t)}),this.willUpdateNodesById={}},c.prototype.markWillUpdateNode=function(e){this.willUpdateNodesById[e.id]=e},c.prototype.onSwitcherClick=function(e){var t=e.parentNode,n=t.lastChild,r=n.scrollHeight;t.classList.contains("treejs-node__close")?k(150,{enter:function(){n.style.height=0,n.style.opacity=0},active:function(){n.style.height="".concat(r,"px"),n.style.opacity=1},leave:function(){n.style.height="",n.style.opacity="",t.classList.remove("treejs-node__close")}}):k(150,{enter:function(){n.style.height="".concat(r,"px"),n.style.opacity=1},active:function(){n.style.height=0,n.style.opacity=0},leave:function(){n.style.height="",n.style.opacity="",t.classList.add("treejs-node__close")}})},c.prototype.walkUp=function(e,t){var n=e.parent;if(n){if(t==="status"){var r=null,l=n.children.reduce(function(p,_){return isNaN(_.status)?p:p+_.status},0);if(r=l?l===2*n.children.length?2:1:0,n.status===r)return;n.status=r}else{var i=n.children.reduce(function(p,_){return p&&_.disabled},!0);if(n.disabled===i)return;n.disabled=i}this.markWillUpdateNode(n),this.walkUp(n,t)}},c.prototype.walkDown=function(e,t){var n=this;e.children&&e.children.length&&e.children.forEach(function(r){t==="status"&&r.disabled||(r[t]=e[t],n.markWillUpdateNode(r),n.walkDown(r,t))})},c.prototype.updateLiElement=function(e){var t=this.liElementsById[e.id].classList;switch(e.status){case 0:t.remove("treejs-node__halfchecked","treejs-node__checked");break;case 1:t.remove("treejs-node__checked"),t.add("treejs-node__halfchecked");break;case 2:t.remove("treejs-node__halfchecked"),t.add("treejs-node__checked")}switch(e.disabled){case!0:t.contains("treejs-node__disabled")||t.add("treejs-node__disabled");break;case!1:t.contains("treejs-node__disabled")&&t.remove("treejs-node__disabled")}},c.parseTreeData=function(e){var t,n=(t=e,JSON.parse(JSON.stringify(t))),r={},l={},i=[],p=[];return function _(I,b){I.forEach(function(m){r[m.id]=m,m.checked&&i.push(m.id),m.disabled&&p.push(m.id),b&&(m.parent=b),m.children&&m.children.length?_(m.children,m):l[m.id]=m})}(n),{treeNodes:n,nodesById:r,leafNodesById:l,defaultValues:i,defaultDisables:p}},c.createRootEle=function(){var e=document.createElement("div");return e.classList.add("treejs"),e},c.createUlEle=function(){var e=document.createElement("ul");return e.classList.add("treejs-nodes"),e},c.createLiEle=function(e,t){var n=document.createElement("li");if(n.classList.add("treejs-node"),t&&n.classList.add("treejs-node__close"),e.children&&e.children.length){var r=document.createElement("span");r.classList.add("treejs-switcher"),n.appendChild(r)}else n.classList.add("treejs-placeholder");var l=document.createElement("span");l.classList.add("treejs-checkbox"),n.appendChild(l);var i=document.createElement("span");i.classList.add("treejs-label");var p=document.createTextNode(e.text);return i.appendChild(p),n.appendChild(i),n.nodeId=e.id,n}},function(x,N,h){Object.defineProperty(N,"__esModule",{value:!0}),N.default=function(s){var d={method:"GET",url:"",async:!0,success:null,failed:null,"Content-Type":"application/json; charset=utf-8"},f=Object.assign(d,s),g=new XMLHttpRequest,k=Object.entries(f.data).reduce(function(e,t){var n,r,l=(r=2,function(_){if(Array.isArray(_))return _}(n=t)||function(_,I){var b=[],m=!0,L=!1,E=void 0;try{for(var a,o=_[Symbol.iterator]();!(m=(a=o.next()).done)&&(b.push(a.value),!I||b.length!==I);m=!0);}catch(u){L=!0,E=u}finally{try{m||o.return==null||o.return()}finally{if(L)throw E}}return b}(n,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()),i=l[0],p=l[1];return e.push("".concat(i,"=").concat(p)),e},[]).join("&");if(f.method.toUpperCase()==="POST")g.open(f.method,f.url,f.async),g.setRequestHeader("Content-Type",f["Content-Type"]),g.send(k);else if(f.method.toUpperCase()==="GET"){var c=f.url;k&&(c.indexOf("?"),c+="&".concat(k)),g.open(f.method,c,f.async),g.setRequestHeader("Content-Type",f["Content-Type"]),g.send(null)}g.onreadystatechange=function(){if(g.readyState===4&&g.status===200){var e=g.responseText;f["Content-Type"]===d["Content-Type"]&&(e=JSON.parse(e)),f.success&&f.success(e)}else f.failed&&f.failed(g.status)}}},function(x,N,h){var s=h(3);typeof s=="string"&&(s=[[x.i,s,""]]);var d={hmr:!0,transform:void 0,insertInto:void 0};h(5)(s,d),s.locals&&(x.exports=s.locals)},function(x,N,h){(x.exports=h(4)(!1)).push([x.i,`.treejs {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  font-size: 14px;
}
.treejs *:after,
.treejs *:before {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}
.treejs > .treejs-node {
  padding-left: 0;
}
.treejs .treejs-nodes {
  list-style: none;
  padding-left: 20px;
  overflow: hidden;
  -webkit-transition: height 150ms ease-out, opacity 150ms ease-out;
  -o-transition: height 150ms ease-out, opacity 150ms ease-out;
  transition: height 150ms ease-out, opacity 150ms ease-out;
}
.treejs .treejs-node {
  cursor: pointer;
  overflow: hidden;
}
.treejs .treejs-node.treejs-placeholder {
  padding-left: 20px;
}
.treejs .treejs-switcher {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: relative;
  -webkit-transition: -webkit-transform 150ms ease-out;
  transition: -webkit-transform 150ms ease-out;
  -o-transition: transform 150ms ease-out;
  transition: transform 150ms ease-out;
  transition: transform 150ms ease-out, -webkit-transform 150ms ease-out;
}
.treejs .treejs-switcher:before {
  position: absolute;
  top: 8px;
  left: 6px;
  display: block;
  content: ' ';
  border: 4px solid transparent;
  border-top: 4px solid rgba(0, 0, 0, 0.4);
  -webkit-transition: border-color 150ms;
  -o-transition: border-color 150ms;
  transition: border-color 150ms;
}
.treejs .treejs-switcher:hover:before {
  border-top: 4px solid rgba(0, 0, 0, 0.65);
}
.treejs .treejs-node__close > .treejs-switcher {
  -webkit-transform: rotate(-90deg);
      -ms-transform: rotate(-90deg);
          transform: rotate(-90deg);
}
.treejs .treejs-node__close > .treejs-nodes {
  height: 0;
}
.treejs .treejs-checkbox {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: relative;
}
.treejs .treejs-checkbox:before {
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  cursor: pointer;
  position: absolute;
  top: 2px;
  content: ' ';
  display: block;
  width: 16px;
  height: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}
.treejs .treejs-checkbox:hover:before {
  -webkit-box-shadow: 0 0 2px 1px #1890ff;
          box-shadow: 0 0 2px 1px #1890ff;
}
.treejs .treejs-node__checked > .treejs-checkbox:before {
  background-color: #1890ff;
  border-color: #1890ff;
}
.treejs .treejs-node__checked > .treejs-checkbox:after {
  position: absolute;
  content: ' ';
  display: block;
  top: 4px;
  left: 5px;
  width: 5px;
  height: 9px;
  border: 2px solid #fff;
  border-top: none;
  border-left: none;
  -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
          transform: rotate(45deg);
}
.treejs .treejs-node__halfchecked > .treejs-checkbox:before {
  background-color: #1890ff;
  border-color: #1890ff;
}
.treejs .treejs-node__halfchecked > .treejs-checkbox:after {
  position: absolute;
  content: ' ';
  display: block;
  top: 9px;
  left: 3px;
  width: 10px;
  height: 2px;
  background-color: #fff;
}
.treejs .treejs-node__disabled {
  cursor: not-allowed;
  color: rgba(0, 0, 0, 0.25);
}
.treejs .treejs-node__disabled .treejs-checkbox {
  cursor: not-allowed;
}
.treejs .treejs-node__disabled .treejs-checkbox:before {
  cursor: not-allowed;
  border-color: #d9d9d9 !important;
  background-color: #f5f5f5 !important;
}
.treejs .treejs-node__disabled .treejs-checkbox:hover:before {
  -webkit-box-shadow: none !important;
          box-shadow: none !important;
}
.treejs .treejs-node__disabled .treejs-node__checked > .treejs-checkbox:after {
  border-color: #d9d9d9;
}
.treejs .treejs-node__disabled .treejs-node__halfchecked > .treejs-checkbox:after {
  background-color: #d9d9d9;
}
.treejs .treejs-node__disabled.treejs-node__checked > .treejs-checkbox:after {
  border-color: #d9d9d9;
}
.treejs .treejs-node__disabled.treejs-node__halfchecked > .treejs-checkbox:after {
  background-color: #d9d9d9;
}
.treejs .treejs-label {
  vertical-align: middle;
}
`,""])},function(x,N){x.exports=function(h){var s=[];return s.toString=function(){return this.map(function(d){var f=function(g,k){var c=g[1]||"",e=g[3];if(!e)return c;if(k&&typeof btoa=="function"){var t=(r=e,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),n=e.sources.map(function(l){return"/*# sourceURL="+e.sourceRoot+l+" */"});return[c].concat(n).concat([t]).join(`
`)}var r;return[c].join(`
`)}(d,h);return d[2]?"@media "+d[2]+"{"+f+"}":f}).join("")},s.i=function(d,f){typeof d=="string"&&(d=[[null,d,""]]);for(var g={},k=0;k<this.length;k++){var c=this[k][0];typeof c=="number"&&(g[c]=!0)}for(k=0;k<d.length;k++){var e=d[k];typeof e[0]=="number"&&g[e[0]]||(f&&!e[2]?e[2]=f:f&&(e[2]="("+e[2]+") and ("+f+")"),s.push(e))}},s}},function(x,N,h){var s,d,f={},g=(s=function(){return window&&document&&document.all&&!window.atob},function(){return typeof d>"u"&&(d=s.apply(this,arguments)),d}),k=function(a){var o={};return function(u){if(typeof u=="function")return u();if(typeof o[u]>"u"){var v=function(w){return document.querySelector(w)}.call(this,u);if(window.HTMLIFrameElement&&v instanceof window.HTMLIFrameElement)try{v=v.contentDocument.head}catch{v=null}o[u]=v}return o[u]}}(),c=null,e=0,t=[],n=h(6);function r(a,o){for(var u=0;u<a.length;u++){var v=a[u],w=f[v.id];if(w){w.refs++;for(var j=0;j<w.parts.length;j++)w.parts[j](v.parts[j]);for(;j<v.parts.length;j++)w.parts.push(b(v.parts[j],o))}else{var S=[];for(j=0;j<v.parts.length;j++)S.push(b(v.parts[j],o));f[v.id]={id:v.id,refs:1,parts:S}}}}function l(a,o){for(var u=[],v={},w=0;w<a.length;w++){var j=a[w],S=o.base?j[0]+o.base:j[0],y={css:j[1],media:j[2],sourceMap:j[3]};v[S]?v[S].parts.push(y):u.push(v[S]={id:S,parts:[y]})}return u}function i(a,o){var u=k(a.insertInto);if(!u)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var v=t[t.length-1];if(a.insertAt==="top")v?v.nextSibling?u.insertBefore(o,v.nextSibling):u.appendChild(o):u.insertBefore(o,u.firstChild),t.push(o);else if(a.insertAt==="bottom")u.appendChild(o);else{if(typeof a.insertAt!="object"||!a.insertAt.before)throw new Error(`[Style Loader]

 Invalid value for parameter 'insertAt' ('options.insertAt') found.
 Must be 'top', 'bottom', or Object.
 (https://github.com/webpack-contrib/style-loader#insertat)
`);var w=k(a.insertInto+" "+a.insertAt.before);u.insertBefore(o,w)}}function p(a){if(a.parentNode===null)return!1;a.parentNode.removeChild(a);var o=t.indexOf(a);o>=0&&t.splice(o,1)}function _(a){var o=document.createElement("style");return a.attrs.type===void 0&&(a.attrs.type="text/css"),I(o,a.attrs),i(a,o),o}function I(a,o){Object.keys(o).forEach(function(u){a.setAttribute(u,o[u])})}function b(a,o){var u,v,w,j;if(o.transform&&a.css){if(!(j=o.transform(a.css)))return function(){};a.css=j}if(o.singleton){var S=e++;u=c||(c=_(o)),v=E.bind(null,u,S,!1),w=E.bind(null,u,S,!0)}else a.sourceMap&&typeof URL=="function"&&typeof URL.createObjectURL=="function"&&typeof URL.revokeObjectURL=="function"&&typeof Blob=="function"&&typeof btoa=="function"?(u=function(y){var C=document.createElement("link");return y.attrs.type===void 0&&(y.attrs.type="text/css"),y.attrs.rel="stylesheet",I(C,y.attrs),i(y,C),C}(o),v=function(y,C,R){var O=R.css,q=R.sourceMap,Z=C.convertToAbsoluteUrls===void 0&&q;(C.convertToAbsoluteUrls||Z)&&(O=n(O)),q&&(O+=`
/*# sourceMappingURL=data:application/json;base64,`+btoa(unescape(encodeURIComponent(JSON.stringify(q))))+" */");var ee=new Blob([O],{type:"text/css"}),J=y.href;y.href=URL.createObjectURL(ee),J&&URL.revokeObjectURL(J)}.bind(null,u,o),w=function(){p(u),u.href&&URL.revokeObjectURL(u.href)}):(u=_(o),v=function(y,C){var R=C.css,O=C.media;if(O&&y.setAttribute("media",O),y.styleSheet)y.styleSheet.cssText=R;else{for(;y.firstChild;)y.removeChild(y.firstChild);y.appendChild(document.createTextNode(R))}}.bind(null,u),w=function(){p(u)});return v(a),function(y){if(y){if(y.css===a.css&&y.media===a.media&&y.sourceMap===a.sourceMap)return;v(a=y)}else w()}}x.exports=function(a,o){if(typeof DEBUG<"u"&&DEBUG&&typeof document!="object")throw new Error("The style-loader cannot be used in a non-browser environment");(o=o||{}).attrs=typeof o.attrs=="object"?o.attrs:{},o.singleton||typeof o.singleton=="boolean"||(o.singleton=g()),o.insertInto||(o.insertInto="head"),o.insertAt||(o.insertAt="bottom");var u=l(a,o);return r(u,o),function(v){for(var w=[],j=0;j<u.length;j++){var S=u[j];(y=f[S.id]).refs--,w.push(y)}for(v&&r(l(v,o),o),j=0;j<w.length;j++){var y;if((y=w[j]).refs===0){for(var C=0;C<y.parts.length;C++)y.parts[C]();delete f[y.id]}}}};var m,L=(m=[],function(a,o){return m[a]=o,m.filter(Boolean).join(`
`)});function E(a,o,u,v){var w=u?"":v.css;if(a.styleSheet)a.styleSheet.cssText=L(o,w);else{var j=document.createTextNode(w),S=a.childNodes;S[o]&&a.removeChild(S[o]),S.length?a.insertBefore(j,S[o]):a.appendChild(j)}}},function(x,N){x.exports=function(h){var s=typeof window<"u"&&window.location;if(!s)throw new Error("fixUrls requires window.location");if(!h||typeof h!="string")return h;var d=s.protocol+"//"+s.host,f=d+s.pathname.replace(/\/[^\/]*$/,"/");return h.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(g,k){var c,e=k.trim().replace(/^"(.*)"$/,function(t,n){return n}).replace(/^'(.*)'$/,function(t,n){return n});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(e)?g:(c=e.indexOf("//")===0?e:e.indexOf("/")===0?d+e:f+e.replace(/^\.\//,""),"url("+JSON.stringify(c)+")")})}}]).default})})(be);(function(B){B.exports=H})(he);const me=se($);const Y=B=>(pe("data-v-f96b0f85"),B=B(),fe(),B),ve={class:"analysis-container"},ye={class:"analysis"},ge={class:"content"},je={class:"input-string"},_e=Y(()=>U("h3",null,"Ast Explore",-1)),we=Y(()=>U("div",{id:"astNodeContainer"},null,-1)),xe={__name:"LL1Analysis",setup(B){const z=ie(),x=le();let N=de({});const h=D(()=>x.getters["grammarStore/getStartTNonTer"]),s=(i,p)=>{x.commit("grammarStore/updateLL1ParserString",i),n.value=!1},d=D(()=>x.getters["grammarStore/getLL1ParserString"]),f=D(()=>x.getters["grammarStore/getLL1Parser"]),g=D(()=>{const i=x.getters["grammarStore/getFirstSet"],p=x.getters["grammarStore/getFollowSet"];return f.value.getPredictTable(i,p)}),k=D(()=>[...x.getters["grammarStore/getTerminal"],"$"]),c=D(()=>g.value.length?g.value.map(p=>{const{nonTerminal:_="",terminal2Derivation:I={}}=p,b=new Map;return I.forEach((m,L)=>{const{derivations:E=[],nonTerminal:a=""}=m,o=E.map(u=>u.length?`${a} => ${u.join(" ")}`:"");b.set(L,o)}),{nonTerminal:_,...Object.fromEntries(b.entries())}}):[]),e=G([]),t=()=>{var _,I;if(!d.value||!h.value)return[];let i;try{i=f.value.getPredictProcess(d.value,h.value,g.value),console.log("ast",i.astNode),new me("#astNodeContainer",{data:[i.astNode]})}catch(b){i=[...b.value,{parseStack:(_=b.value[b.value.length-1].parseStack)==null?void 0:_.slice(0,-1),remainingInput:(I=b.value[b.value.length-1].remainingInput)==null?void 0:I.slice(1),parseAction:"match failed"}],console.error(b)}const p=i.map((b,m)=>{var L,E,a;return{Step:m+1,Stack:(a=(E=(L=b.parseStack)==null?void 0:L.slice())==null?void 0:E.reverse())==null?void 0:a.join(""),Input:b.remainingInput+"$",Action:b.parseAction}});e.value=p},n=G(!1),r=()=>{!d.value||!h.value?z.push(te[2].route):n.value=!1},l=()=>{n.value=!0,N.inputString=d,N.value=h};return ce([()=>d.value,h],([i,p],[_,I])=>{!i||!p?n.value=!0:t()},{immediate:!0,deep:!0}),(i,p)=>{const _=P("Edit"),I=P("el-icon"),b=P("el-table-column"),m=P("el-table");return A(),M("div",ve,[T(ne,{type:"grammar"}),U("div",ye,[T(re,{step:3,type:"LL1"}),U("div",ge,[U("div",je,[U("span",null,"输入串："+W(V(d)),1),T(I,{class:"icon",onClick:l},{default:F(()=>[T(_)]),_:1})]),T(m,{data:e.value,stripe:"",style:{width:"100%"},border:"",class:"table"},{default:F(()=>[T(b,{prop:"Step",label:"Step",align:"center"}),T(b,{prop:"Stack",label:"Stack",align:"center"}),T(b,{prop:"Input",label:"Input",align:"center"}),T(b,{prop:"Action",label:"Action",align:"center"})]),_:1},8,["data"]),T(m,{data:V(c),"max-height":"600",border:"",class:"table-data"},{default:F(()=>[T(b,{fixed:"",prop:"nonTerminal",label:"",width:"150",align:"center"}),(A(!0),M(X,null,Q(V(k),L=>(A(),K(b,{key:L,prop:L,label:L,align:"center"},{default:F(E=>[U("ul",null,[(A(!0),M(X,null,Q(E.row[E.column.rawColumnKey],a=>(A(),M("li",{key:a},W(a),1))),128))])]),_:2},1032,["prop","label"]))),128))]),_:1},8,["data"])]),_e,we]),n.value?(A(),K(oe,{key:0,dialogVisible:n.value,type:"LL1",onSaveInput:s,data:V(N),onOnClose:r},null,8,["dialogVisible","data"])):ue("",!0)])}}},Ce=ae(xe,[["__scopeId","data-v-f96b0f85"]]);export{Ce as default};
