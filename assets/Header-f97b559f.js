import{_ as J,c as N,r as A,a as K,d as u,o as a,e as _,g as c,f as n,h as s,m,B as M,k as f,F as T,j as V,s as H,t as l,i as O,y as P,z as Q}from"./index-9387c24e.js";import{b as U,L as W}from"./RightTips-4f346bf7.js";const X=r=>(P("data-v-c5e17f8c"),r=r(),Q(),r),Y={class:"header"},Z={class:"el-dropdown-link"},$={key:1},ee={class:"title"},te={class:"el-dropdown-link"},oe={key:1},se=X(()=>c("div",{class:"hr"},null,-1)),ae={__name:"Header",props:{step:{type:Number},type:{type:String}},setup(r){var R,g,x,w;const e=r,t=N(()=>e.type==="LL1"?U:W),j=N(()=>{var o;return(o=t.value[e.step-1])==null?void 0:o.text}),k=[(R=t.value[e.step+1])==null?void 0:R.text,(g=t.value[e.step+2])==null?void 0:g.text],i=A(Number(localStorage.getItem("nextRouteForAutomaton"))??0),z=o=>{i.value=o,localStorage.setItem("nextRouteForAutomaton",o)},y=[(x=t.value[e.step-1])==null?void 0:x.text,(w=t.value[e.step-2])==null?void 0:w.text],v=A((e.step===2?Number(localStorage.getItem("backRouteForLRTable")):Number(localStorage.getItem("nextRouteForLRAnalysis")))??0),D=o=>{v.value=o,e.step===2?localStorage.setItem("backRouteForLRTable",o):e.step===3&&localStorage.setItem("nextRouteForLRAnalysis",o)},h=K(),E=()=>{h.push(t.value[e.step-1-((e.step===2||e.step===3)&&e.type==="LR0"?v.value:0)].route)},q=()=>{h.push(t.value[e.step+1+(e.step===1&&e.type==="LR0"?i.value:0)].route)};return(o,ne)=>{var S,B,F;const L=u("el-icon"),b=u("el-dropdown-item"),I=u("el-dropdown-menu"),C=u("el-dropdown"),G=u("ArrowRight");return a(),_("div",null,[c("div",Y,[c("span",{onClick:E,class:"back"},[n(L,{class:"icon"},{default:s(()=>[n(m(M))]),_:1}),(e.step===2||e.step===3)&&e.type==="LR0"?(a(),f(C,{key:0,onCommand:D},{dropdown:s(()=>[n(I,null,{default:s(()=>[(a(),_(T,null,V(y,(d,p)=>n(b,{key:d,command:p,disabled:v.value===p},{default:s(()=>[H(l(d),1)]),_:2},1032,["command","disabled"])),64))]),_:1})]),default:s(()=>[c("span",Z,l(y[v.value]),1)]),_:1})):(a(),_("span",$,l(m(j)),1))]),c("span",ee,l((S=m(t)[e.step])==null?void 0:S.text),1),c("div",{class:"next",onClick:q},[e.step===1&&e.type==="LR0"?(a(),f(C,{key:0,onCommand:z},{dropdown:s(()=>[n(I,null,{default:s(()=>[(a(),_(T,null,V(k,(d,p)=>n(b,{key:d,command:p,disabled:i.value===p},{default:s(()=>[H(l(d),1)]),_:2},1032,["command","disabled"])),64))]),_:1})]),default:s(()=>[c("span",te,l(k[i.value]),1)]),_:1})):(a(),_("span",oe,l((B=m(t)[e.step+1])==null?void 0:B.text),1)),(F=m(t)[e.step+1])!=null&&F.text?(a(),f(L,{key:2,class:"icon"},{default:s(()=>[n(G)]),_:1})):O("",!0)])]),se])}}},re=J(ae,[["__scopeId","data-v-c5e17f8c"]]);export{re as C};
