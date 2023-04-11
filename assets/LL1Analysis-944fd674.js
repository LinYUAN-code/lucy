import{b as te,R as ne}from"./RightTips-990f7f6b.js";import{C as re}from"./Header-f90be2a6.js";import{I as oe}from"./InputString-6f6380e2.js";import{D as se,_ as ae,a as ie,u as le,b as de,c as D,r as W,w as ce,d as M,o as A,e as V,f as C,g as O,t as $,m as P,h as F,k as K,i as ue,F as X,j as Q,y as pe,z as fe}from"./index-05677f7b.js";import"./index.cjs-5f979497.js";/* empty css                                                                    */var H={},he={get exports(){return H},set exports(E){H=E}},z={},be={get exports(){return z},set exports(E){z=E}};(function(E,J){(function(x,I){E.exports=I()})(window,function(){return function(x){var I={};function h(s){if(I[s])return I[s].exports;var d=I[s]={i:s,l:!1,exports:{}};return x[s].call(d.exports,d,d.exports,h),d.l=!0,d.exports}return h.m=x,h.c=I,h.d=function(s,d,f){h.o(s,d)||Object.defineProperty(s,d,{enumerable:!0,get:f})},h.r=function(s){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(s,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(s,"__esModule",{value:!0})},h.t=function(s,d){if(1&d&&(s=h(s)),8&d||4&d&&typeof s=="object"&&s&&s.__esModule)return s;var f=Object.create(null);if(h.r(f),Object.defineProperty(f,"default",{enumerable:!0,value:s}),2&d&&typeof s!="string")for(var y in s)h.d(f,y,function(k){return s[k]}.bind(null,y));return f},h.n=function(s){var d=s&&s.__esModule?function(){return s.default}:function(){return s};return h.d(d,"a",d),d},h.o=function(s,d){return Object.prototype.hasOwnProperty.call(s,d)},h.p="",h(h.s=0)}([function(x,I,h){Object.defineProperty(I,"__esModule",{value:!0}),I.default=c;var s,d=(s=h(1))&&s.__esModule?s:{default:s};function f(e,t){return function(n){if(Array.isArray(n))return n}(e)||function(n,r){var i=[],l=!0,p=!1,b=void 0;try{for(var N,_=n[Symbol.iterator]();!(l=(N=_.next()).done)&&(i.push(N.value),!r||i.length!==r);l=!0);}catch(g){p=!0,b=g}finally{try{l||_.return==null||_.return()}finally{if(p)throw b}}return i}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function y(e){var t={};return e.reduce(function(n,r){return t[r]||(t[r]=!0,n.push(r)),n},[])}function k(e,t){requestAnimationFrame(function(){t.enter(),requestAnimationFrame(function(){t.active(),setTimeout(function(){t.leave()},e)})})}function c(e,t){var n=this;this.treeNodes=[],this.nodesById={},this.leafNodesById={},this.liElementsById={},this.willUpdateNodesById={},this.container=e,this.options=Object.assign({selectMode:"checkbox",values:[],disables:[],beforeLoad:null,loaded:null,url:null,method:"GET",closeDepth:null},t),Object.defineProperties(this,{values:{get:function(){return this.getValues()},set:function(r){return this.setValues(y(r))}},disables:{get:function(){return this.getDisables()},set:function(r){return this.setDisables(y(r))}},selectedNodes:{get:function(){var r=[],i=this.nodesById;for(var l in i)if(i.hasOwnProperty(l)&&(i[l].status===1||i[l].status===2)){var p=Object.assign({},i[l]);delete p.parent,delete p.children,r.push(p)}return r}},disabledNodes:{get:function(){var r=[],i=this.nodesById;for(var l in i)if(i.hasOwnProperty(l)&&i[l].disabled){var p=Object.assign({},i[l]);delete p.parent,r.push(p)}return r}}}),this.options.url?this.load(function(r){n.init(r)}):this.init(this.options.data)}h(2),c.prototype.init=function(e){var t=c.parseTreeData(e),n=t.treeNodes,r=t.nodesById,i=t.leafNodesById,l=t.defaultValues,p=t.defaultDisables;this.treeNodes=n,this.nodesById=r,this.leafNodesById=i,this.render(this.treeNodes);var b=this.options,N=b.values,_=b.disables,g=b.loaded;N&&N.length&&(l=N),l.length&&this.setValues(l),_&&_.length&&(p=_),p.length&&this.setDisables(p),g&&g.call(this)},c.prototype.load=function(e){var t=this.options,n=t.url,r=t.method,i=t.beforeLoad;(0,d.default)({url:n,method:r,success:function(l){var p=l;i&&(p=i(l)),e(p)}})},c.prototype.render=function(e){var t=c.createRootEle();t.appendChild(this.buildTree(e,0)),this.bindEvent(t);var n=document.querySelector(this.container);(function(r){for(;r.firstChild;)r.removeChild(r.firstChild)})(n),n.appendChild(t)},c.prototype.buildTree=function(e,t){var n=this,r=c.createUlEle();return e&&e.length&&e.forEach(function(i){var l=c.createLiEle(i,t===n.options.closeDepth-1);n.liElementsById[i.id]=l;var p=null;i.children&&i.children.length&&(p=n.buildTree(i.children,t+1)),p&&l.appendChild(p),r.appendChild(l)}),r},c.prototype.bindEvent=function(e){var t=this;e.addEventListener("click",function(n){var r=n.target;r.nodeName==="SPAN"&&(r.classList.contains("treejs-checkbox")||r.classList.contains("treejs-label"))?t.onItemClick(r.parentNode.nodeId):r.nodeName==="LI"&&r.classList.contains("treejs-node")?t.onItemClick(r.nodeId):r.nodeName==="SPAN"&&r.classList.contains("treejs-switcher")&&t.onSwitcherClick(r)},!1)},c.prototype.onItemClick=function(e){var t=this.nodesById[e],n=this.options.onChange;t.disabled||(this.setValue(e),this.updateLiElements()),n&&n.call(this)},c.prototype.setValue=function(e){var t=this.nodesById[e];if(t){var n=t.status,r=n===1||n===2?0:2;t.status=r,this.markWillUpdateNode(t),this.walkUp(t,"status"),this.walkDown(t,"status")}},c.prototype.getValues=function(){var e=[];for(var t in this.leafNodesById)this.leafNodesById.hasOwnProperty(t)&&(this.leafNodesById[t].status!==1&&this.leafNodesById[t].status!==2||e.push(t));return e},c.prototype.setValues=function(e){var t=this;this.emptyNodesCheckStatus(),e.forEach(function(r){t.setValue(r)}),this.updateLiElements();var n=this.options.onChange;n&&n.call(this)},c.prototype.setDisable=function(e){var t=this.nodesById[e];t&&(t.disabled||(t.disabled=!0,this.markWillUpdateNode(t),this.walkUp(t,"disabled"),this.walkDown(t,"disabled")))},c.prototype.getDisables=function(){var e=[];for(var t in this.leafNodesById)this.leafNodesById.hasOwnProperty(t)&&this.leafNodesById[t].disabled&&e.push(t);return e},c.prototype.setDisables=function(e){var t=this;this.emptyNodesDisable(),e.forEach(function(n){t.setDisable(n)}),this.updateLiElements()},c.prototype.emptyNodesCheckStatus=function(){this.willUpdateNodesById=this.getSelectedNodesById(),Object.values(this.willUpdateNodesById).forEach(function(e){e.disabled||(e.status=0)})},c.prototype.emptyNodesDisable=function(){this.willUpdateNodesById=this.getDisabledNodesById(),Object.values(this.willUpdateNodesById).forEach(function(e){e.disabled=!1})},c.prototype.getSelectedNodesById=function(){return Object.entries(this.nodesById).reduce(function(e,t){var n=f(t,2),r=n[0],i=n[1];return i.status!==1&&i.status!==2||(e[r]=i),e},{})},c.prototype.getDisabledNodesById=function(){return Object.entries(this.nodesById).reduce(function(e,t){var n=f(t,2),r=n[0],i=n[1];return i.disabled&&(e[r]=i),e},{})},c.prototype.updateLiElements=function(){var e=this;Object.values(this.willUpdateNodesById).forEach(function(t){e.updateLiElement(t)}),this.willUpdateNodesById={}},c.prototype.markWillUpdateNode=function(e){this.willUpdateNodesById[e.id]=e},c.prototype.onSwitcherClick=function(e){var t=e.parentNode,n=t.lastChild,r=n.scrollHeight;t.classList.contains("treejs-node__close")?k(150,{enter:function(){n.style.height=0,n.style.opacity=0},active:function(){n.style.height="".concat(r,"px"),n.style.opacity=1},leave:function(){n.style.height="",n.style.opacity="",t.classList.remove("treejs-node__close")}}):k(150,{enter:function(){n.style.height="".concat(r,"px"),n.style.opacity=1},active:function(){n.style.height=0,n.style.opacity=0},leave:function(){n.style.height="",n.style.opacity="",t.classList.add("treejs-node__close")}})},c.prototype.walkUp=function(e,t){var n=e.parent;if(n){if(t==="status"){var r=null,i=n.children.reduce(function(p,b){return isNaN(b.status)?p:p+b.status},0);if(r=i?i===2*n.children.length?2:1:0,n.status===r)return;n.status=r}else{var l=n.children.reduce(function(p,b){return p&&b.disabled},!0);if(n.disabled===l)return;n.disabled=l}this.markWillUpdateNode(n),this.walkUp(n,t)}},c.prototype.walkDown=function(e,t){var n=this;e.children&&e.children.length&&e.children.forEach(function(r){t==="status"&&r.disabled||(r[t]=e[t],n.markWillUpdateNode(r),n.walkDown(r,t))})},c.prototype.updateLiElement=function(e){var t=this.liElementsById[e.id].classList;switch(e.status){case 0:t.remove("treejs-node__halfchecked","treejs-node__checked");break;case 1:t.remove("treejs-node__checked"),t.add("treejs-node__halfchecked");break;case 2:t.remove("treejs-node__halfchecked"),t.add("treejs-node__checked")}switch(e.disabled){case!0:t.contains("treejs-node__disabled")||t.add("treejs-node__disabled");break;case!1:t.contains("treejs-node__disabled")&&t.remove("treejs-node__disabled")}},c.parseTreeData=function(e){var t,n=(t=e,JSON.parse(JSON.stringify(t))),r={},i={},l=[],p=[];return function b(N,_){N.forEach(function(g){r[g.id]=g,g.checked&&l.push(g.id),g.disabled&&p.push(g.id),_&&(g.parent=_),g.children&&g.children.length?b(g.children,g):i[g.id]=g})}(n),{treeNodes:n,nodesById:r,leafNodesById:i,defaultValues:l,defaultDisables:p}},c.createRootEle=function(){var e=document.createElement("div");return e.classList.add("treejs"),e},c.createUlEle=function(){var e=document.createElement("ul");return e.classList.add("treejs-nodes"),e},c.createLiEle=function(e,t){var n=document.createElement("li");if(n.classList.add("treejs-node"),t&&n.classList.add("treejs-node__close"),e.children&&e.children.length){var r=document.createElement("span");r.classList.add("treejs-switcher"),n.appendChild(r)}else n.classList.add("treejs-placeholder");var i=document.createElement("span");i.classList.add("treejs-checkbox"),n.appendChild(i);var l=document.createElement("span");l.classList.add("treejs-label");var p=document.createTextNode(e.text);return l.appendChild(p),n.appendChild(l),n.nodeId=e.id,n}},function(x,I,h){Object.defineProperty(I,"__esModule",{value:!0}),I.default=function(s){var d={method:"GET",url:"",async:!0,success:null,failed:null,"Content-Type":"application/json; charset=utf-8"},f=Object.assign(d,s),y=new XMLHttpRequest,k=Object.entries(f.data).reduce(function(e,t){var n,r,i=(r=2,function(b){if(Array.isArray(b))return b}(n=t)||function(b,N){var _=[],g=!0,B=!1,T=void 0;try{for(var a,o=b[Symbol.iterator]();!(g=(a=o.next()).done)&&(_.push(a.value),!N||_.length!==N);g=!0);}catch(u){B=!0,T=u}finally{try{g||o.return==null||o.return()}finally{if(B)throw T}}return _}(n,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()),l=i[0],p=i[1];return e.push("".concat(l,"=").concat(p)),e},[]).join("&");if(f.method.toUpperCase()==="POST")y.open(f.method,f.url,f.async),y.setRequestHeader("Content-Type",f["Content-Type"]),y.send(k);else if(f.method.toUpperCase()==="GET"){var c=f.url;k&&(c.indexOf("?"),c+="&".concat(k)),y.open(f.method,c,f.async),y.setRequestHeader("Content-Type",f["Content-Type"]),y.send(null)}y.onreadystatechange=function(){if(y.readyState===4&&y.status===200){var e=y.responseText;f["Content-Type"]===d["Content-Type"]&&(e=JSON.parse(e)),f.success&&f.success(e)}else f.failed&&f.failed(y.status)}}},function(x,I,h){var s=h(3);typeof s=="string"&&(s=[[x.i,s,""]]);var d={hmr:!0,transform:void 0,insertInto:void 0};h(5)(s,d),s.locals&&(x.exports=s.locals)},function(x,I,h){(x.exports=h(4)(!1)).push([x.i,`.treejs {
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
`,""])},function(x,I){x.exports=function(h){var s=[];return s.toString=function(){return this.map(function(d){var f=function(y,k){var c=y[1]||"",e=y[3];if(!e)return c;if(k&&typeof btoa=="function"){var t=(r=e,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),n=e.sources.map(function(i){return"/*# sourceURL="+e.sourceRoot+i+" */"});return[c].concat(n).concat([t]).join(`
`)}var r;return[c].join(`
`)}(d,h);return d[2]?"@media "+d[2]+"{"+f+"}":f}).join("")},s.i=function(d,f){typeof d=="string"&&(d=[[null,d,""]]);for(var y={},k=0;k<this.length;k++){var c=this[k][0];typeof c=="number"&&(y[c]=!0)}for(k=0;k<d.length;k++){var e=d[k];typeof e[0]=="number"&&y[e[0]]||(f&&!e[2]?e[2]=f:f&&(e[2]="("+e[2]+") and ("+f+")"),s.push(e))}},s}},function(x,I,h){var s,d,f={},y=(s=function(){return window&&document&&document.all&&!window.atob},function(){return typeof d>"u"&&(d=s.apply(this,arguments)),d}),k=function(a){var o={};return function(u){if(typeof u=="function")return u();if(typeof o[u]>"u"){var m=function(w){return document.querySelector(w)}.call(this,u);if(window.HTMLIFrameElement&&m instanceof window.HTMLIFrameElement)try{m=m.contentDocument.head}catch{m=null}o[u]=m}return o[u]}}(),c=null,e=0,t=[],n=h(6);function r(a,o){for(var u=0;u<a.length;u++){var m=a[u],w=f[m.id];if(w){w.refs++;for(var j=0;j<w.parts.length;j++)w.parts[j](m.parts[j]);for(;j<m.parts.length;j++)w.parts.push(_(m.parts[j],o))}else{var L=[];for(j=0;j<m.parts.length;j++)L.push(_(m.parts[j],o));f[m.id]={id:m.id,refs:1,parts:L}}}}function i(a,o){for(var u=[],m={},w=0;w<a.length;w++){var j=a[w],L=o.base?j[0]+o.base:j[0],v={css:j[1],media:j[2],sourceMap:j[3]};m[L]?m[L].parts.push(v):u.push(m[L]={id:L,parts:[v]})}return u}function l(a,o){var u=k(a.insertInto);if(!u)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var m=t[t.length-1];if(a.insertAt==="top")m?m.nextSibling?u.insertBefore(o,m.nextSibling):u.appendChild(o):u.insertBefore(o,u.firstChild),t.push(o);else if(a.insertAt==="bottom")u.appendChild(o);else{if(typeof a.insertAt!="object"||!a.insertAt.before)throw new Error(`[Style Loader]

 Invalid value for parameter 'insertAt' ('options.insertAt') found.
 Must be 'top', 'bottom', or Object.
 (https://github.com/webpack-contrib/style-loader#insertat)
`);var w=k(a.insertInto+" "+a.insertAt.before);u.insertBefore(o,w)}}function p(a){if(a.parentNode===null)return!1;a.parentNode.removeChild(a);var o=t.indexOf(a);o>=0&&t.splice(o,1)}function b(a){var o=document.createElement("style");return a.attrs.type===void 0&&(a.attrs.type="text/css"),N(o,a.attrs),l(a,o),o}function N(a,o){Object.keys(o).forEach(function(u){a.setAttribute(u,o[u])})}function _(a,o){var u,m,w,j;if(o.transform&&a.css){if(!(j=o.transform(a.css)))return function(){};a.css=j}if(o.singleton){var L=e++;u=c||(c=b(o)),m=T.bind(null,u,L,!1),w=T.bind(null,u,L,!0)}else a.sourceMap&&typeof URL=="function"&&typeof URL.createObjectURL=="function"&&typeof URL.revokeObjectURL=="function"&&typeof Blob=="function"&&typeof btoa=="function"?(u=function(v){var S=document.createElement("link");return v.attrs.type===void 0&&(v.attrs.type="text/css"),v.attrs.rel="stylesheet",N(S,v.attrs),l(v,S),S}(o),m=function(v,S,R){var U=R.css,q=R.sourceMap,Z=S.convertToAbsoluteUrls===void 0&&q;(S.convertToAbsoluteUrls||Z)&&(U=n(U)),q&&(U+=`
/*# sourceMappingURL=data:application/json;base64,`+btoa(unescape(encodeURIComponent(JSON.stringify(q))))+" */");var ee=new Blob([U],{type:"text/css"}),G=v.href;v.href=URL.createObjectURL(ee),G&&URL.revokeObjectURL(G)}.bind(null,u,o),w=function(){p(u),u.href&&URL.revokeObjectURL(u.href)}):(u=b(o),m=function(v,S){var R=S.css,U=S.media;if(U&&v.setAttribute("media",U),v.styleSheet)v.styleSheet.cssText=R;else{for(;v.firstChild;)v.removeChild(v.firstChild);v.appendChild(document.createTextNode(R))}}.bind(null,u),w=function(){p(u)});return m(a),function(v){if(v){if(v.css===a.css&&v.media===a.media&&v.sourceMap===a.sourceMap)return;m(a=v)}else w()}}x.exports=function(a,o){if(typeof DEBUG<"u"&&DEBUG&&typeof document!="object")throw new Error("The style-loader cannot be used in a non-browser environment");(o=o||{}).attrs=typeof o.attrs=="object"?o.attrs:{},o.singleton||typeof o.singleton=="boolean"||(o.singleton=y()),o.insertInto||(o.insertInto="head"),o.insertAt||(o.insertAt="bottom");var u=i(a,o);return r(u,o),function(m){for(var w=[],j=0;j<u.length;j++){var L=u[j];(v=f[L.id]).refs--,w.push(v)}for(m&&r(i(m,o),o),j=0;j<w.length;j++){var v;if((v=w[j]).refs===0){for(var S=0;S<v.parts.length;S++)v.parts[S]();delete f[v.id]}}}};var g,B=(g=[],function(a,o){return g[a]=o,g.filter(Boolean).join(`
`)});function T(a,o,u,m){var w=u?"":m.css;if(a.styleSheet)a.styleSheet.cssText=B(o,w);else{var j=document.createTextNode(w),L=a.childNodes;L[o]&&a.removeChild(L[o]),L.length?a.insertBefore(j,L[o]):a.appendChild(j)}}},function(x,I){x.exports=function(h){var s=typeof window<"u"&&window.location;if(!s)throw new Error("fixUrls requires window.location");if(!h||typeof h!="string")return h;var d=s.protocol+"//"+s.host,f=d+s.pathname.replace(/\/[^\/]*$/,"/");return h.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(y,k){var c,e=k.trim().replace(/^"(.*)"$/,function(t,n){return n}).replace(/^'(.*)'$/,function(t,n){return n});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(e)?y:(c=e.indexOf("//")===0?e:e.indexOf("/")===0?d+e:f+e.replace(/^\.\//,""),"url("+JSON.stringify(c)+")")})}}]).default})})(be);(function(E){E.exports=z})(he);const me=se(H);const Y=E=>(pe("data-v-c144c64a"),E=E(),fe(),E),ve={class:"analysis-container"},ye={class:"analysis"},ge={class:"content"},je={class:"input-string"},_e=Y(()=>O("h3",null,"Ast Explore",-1)),we=Y(()=>O("div",{id:"astNodeContainer"},null,-1)),xe={__name:"LL1Analysis",setup(E){const J=ie(),x=le();let I=de({});const h=D(()=>x.getters["grammarStore/getStartTNonTer"]),s=(l,p)=>{x.commit("grammarStore/updateLL1ParserString",l),n.value=!1},d=D(()=>x.getters["grammarStore/getLL1ParserString"]),f=D(()=>x.getters["grammarStore/getLL1Parser"]),y=D(()=>{const l=x.getters["grammarStore/getFirstSet"],p=x.getters["grammarStore/getFollowSet"];return f.value.getPredictTable(l,p)}),k=D(()=>[...x.getters["grammarStore/getTerminal"],"$"]),c=D(()=>y.value.length?y.value.map(p=>{const{nonTerminal:b="",terminal2Derivation:N={}}=p,_=new Map;return N.forEach((g,B)=>{const{derivations:T=[],nonTerminal:a=""}=g,o=T.map(u=>u.length?`${a} => ${u.join(" ")}`:"");_.set(B,o)}),{nonTerminal:b,...Object.fromEntries(_.entries())}}):[]),e=W([]),t=()=>{if(!d.value||!h.value)return[];let l;try{l=f.value.getPredictProcess(d.value,h.value,y.value),console.log("ast",l.astNode),new me("#astNodeContainer",{data:[l.astNode]})}catch(b){console.log(b)}const p=l.map((b,N)=>({Step:N+1,Stack:b.parseStack.reverse().join(""),Input:b.remainingInput+"$",Action:b.parseAction}));e.value=p},n=W(!1),r=()=>{!d.value||!h.value?J.push(te[2].route):n.value=!1},i=()=>{n.value=!0,I.inputString=d,I.value=h};return ce([()=>d.value,h],([l,p],[b,N])=>{!l||!p?n.value=!0:t()},{immediate:!0,deep:!0}),(l,p)=>{const b=M("Edit"),N=M("el-icon"),_=M("el-table-column"),g=M("el-table");return A(),V("div",ve,[C(ne,{type:"grammar"}),O("div",ye,[C(re,{step:3,type:"LL1"}),O("div",ge,[O("div",je,[O("span",null,"输入串："+$(P(d)),1),O("span",null,"首个非终结符："+$(P(h)),1),C(N,{class:"icon",onClick:i},{default:F(()=>[C(b)]),_:1})]),C(g,{data:e.value,stripe:"",style:{width:"100%"},border:"",class:"table"},{default:F(()=>[C(_,{prop:"Step",label:"Step",align:"center"}),C(_,{prop:"Stack",label:"Stack",align:"center"}),C(_,{prop:"Input",label:"Input",align:"center"}),C(_,{prop:"Action",label:"Action",align:"center"})]),_:1},8,["data"]),C(g,{data:P(c),"max-height":"600",border:"",class:"table-data"},{default:F(()=>[C(_,{fixed:"",prop:"nonTerminal",label:"",width:"150",align:"center"}),(A(!0),V(X,null,Q(P(k),B=>(A(),K(_,{key:B,prop:B,label:B,align:"center"},{default:F(T=>[O("ul",null,[(A(!0),V(X,null,Q(T.row[T.column.rawColumnKey],a=>(A(),V("li",{key:a},$(a),1))),128))])]),_:2},1032,["prop","label"]))),128))]),_:1},8,["data"])]),_e,we]),n.value?(A(),K(oe,{key:0,dialogVisible:n.value,type:"LL1",onSaveInput:s,data:P(I),onOnClose:r},null,8,["dialogVisible","data"])):ue("",!0)])}}},Ce=ae(xe,[["__scopeId","data-v-c144c64a"]]);export{Ce as default};
