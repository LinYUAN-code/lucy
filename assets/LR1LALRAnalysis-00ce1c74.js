import f from"./LR1LALRTable-a23e218a.js";import{_ as A,x as k,u as x,c,r as T,a as u,y as g,b as m,d as _,e as b,h as r,f as i,l as w,t as L,g as y,k as I,w as N,A as V}from"./index-503f6dad.js";/* empty css                                                                    */import"./Automaton-cf0323d5.js";const B={class:"analysis"},P={class:"input-string"},j={class:"first"},D={class:"parser-string"},C={key:0},E={__name:"LR1LALRAnalysis",setup(q){k();const s=x(),h=c(()=>s.getters["grammarStore/getLR1LALRType"]);T({});const l=u([]),d=u(null),v=c(()=>s.getters["grammarStore/getStartTNonTer"]);u(!0);const o=c(()=>s.getters["grammarStore/getLRParsingString"]),p=c(()=>s.getters["grammarStore/getLR1LALRPredictTable"]),R=()=>{if(console.log(1),!o.value||!v.value)return[];console.log(2);const n=s.getters["grammarStore/getLR1LALRParser"];let e=[];try{console.log(o.value,p.value),e=n.predictInput(o.value,p.value)}catch(t){console.error(t)}console.log(e);const a=e.map((t,S)=>({Step:S+1,Stack:t.stack.join(" "),Symbols:t.symbols.join(" "),Input:t.input.join(" "),Action:t.move}));l.value=a};return g([()=>o.value,p],([n,e],[a,t])=>{!n||!e||R()},{immediate:!0,deep:!0}),g(()=>l,n=>{V(()=>{var e;(e=d.value)==null||e.scrollIntoView({behavior:"smooth"})})},{deep:!0}),(n,e)=>{const a=m("el-table-column"),t=m("el-table");return _(),b("div",B,[r(f),i("div",{class:"content",ref_key:"analysisRef",ref:d},[i("div",P,[i("div",j,[w(L(y(h))+"预测分析 ",1),i("span",D,L(y(o)),1)])]),l.value.length?(_(),I(t,{key:1,data:l.value,stripe:"",style:{"max-width":"700px"},border:"",class:"table"},{default:N(()=>[r(a,{prop:"Step",label:"Step","header-align":"center"}),r(a,{prop:"Stack",label:"Stack","header-align":"center"}),r(a,{prop:"Symbols",label:"symbols","header-align":"center"}),r(a,{prop:"Input",label:"Input",align:"right","header-align":"center"}),r(a,{prop:"Action",label:"Action","header-align":"center"})]),_:1},8,["data"])):(_(),b("div",C,"字符串规约失败"))],512)])}}},J=A(E,[["__scopeId","data-v-adb0e46f"]]);export{J as default};
