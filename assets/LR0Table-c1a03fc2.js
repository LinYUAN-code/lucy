import{_ as G,x as H,c as l,a as f,u as U,y as v,r as I,b as i,d as r,e as n,h as o,g as b,f as L,l as K,t as w,w as s,n as q,v as $,q as z,k as T,F as S,j as y}from"./index-503f6dad.js";/* empty css                                                                    */import J from"./Automaton-cf0323d5.js";const M={class:"table-container"},Q={class:"first"},W={__name:"LR0Table",setup(X){const N=H(),x=l(()=>t.getters["grammarStore/getLR0Type"]),m=f(!1),R=f(null),t=U();f(!1);const V=()=>{m.value=!m.value},D=l(()=>t.getters["grammarStore/getHideLRTable"]),O=l(()=>t.getters["grammarStore/getNonTerminal"]),P=l(()=>[...t.getters["grammarStore/getTerminal"],"$"]);l(()=>t.getters["grammarStore/getGraph"]);const B=f(!1);l(()=>t.getters["grammarStore/getUnFold"]);const C=l(()=>{const e=t.getters["grammarStore/getLRParser"];switch(x.value){case"LR(0)":return e.generateLR0PredictTable();case"SLR(1)":return e.generateSLR1PredictTable()}return[]});v(()=>C,e=>{t.commit("grammarStore/updateLRPredictTable",e.value)},{immediate:!0,deep:!0});const E=l(()=>{const e=C.value;return e.length?e.map((u,c)=>{const{action:h={},goto:k={}}=u;return{State:c,...Object.fromEntries(h.entries()),...Object.fromEntries(k.entries())}}):void 0}),j=l(()=>t.getters["grammarStore/getStartTNonTer"]);v(()=>j,(e,d)=>{e.value||N.push("/")},{immediate:!0,deep:!0}),v(()=>R,(e,d)=>{var u;e.value&&((u=R.value)==null||u.render(2),setTimeout(()=>{var c;(c=R.value)==null||c.render(2)},100))},{deep:!0});const A=f(t.state.grammarStore.unfold);return v(()=>B,e=>{e.value?t.commit("grammarStore/updateUnfold",!1):t.commit("grammarStore/updateUnfold",A.value)},{deep:!0}),I({}),(e,d)=>{const u=i("View"),c=i("Hide"),h=i("el-icon"),k=i("el-tooltip"),p=i("el-table-column"),F=i("el-table");return r(),n("div",M,[o(J,{class:"dfa"}),b(D)?z("",!0):(r(),n("div",{key:0,class:"table",onClick:d[0]||(d[0]=(...a)=>e.test&&e.test(...a))},[L("div",Q,[K(w(b(x))+"分析表 ",1),o(k,{class:"box-item",effect:"dark",content:m.value?"显示":"隐藏",placement:"top"},{default:s(()=>[o(h,{onClick:V},{default:s(()=>[m.value?(r(),T(u,{key:0})):(r(),T(c,{key:1}))]),_:1})]),_:1},8,["content"])]),q(o(F,{data:b(E),class:"table-data",stripe:"",style:{"max-width":"700px"}},{default:s(()=>[o(p,{prop:"State",label:"STATE",align:"center"}),o(p,{label:"ACTION",align:"center"},{default:s(()=>[(r(!0),n(S,null,y(b(P),a=>(r(),T(p,{key:a,prop:a,label:a,align:"center"},{default:s(_=>[L("ul",null,[(r(!0),n(S,null,y(_.row[_.column.rawColumnKey],g=>(r(),n("li",{key:g},w(g),1))),128))])]),_:2},1032,["prop","label"]))),128))]),_:1}),o(p,{label:"GOTO",align:"center"},{default:s(()=>[(r(!0),n(S,null,y(b(O),a=>(r(),T(p,{key:a,prop:a,label:a,align:"center"},{default:s(_=>[L("ul",null,[(r(!0),n(S,null,y(_.row[_.column.rawColumnKey],g=>(r(),n("li",{key:g},w(g),1))),128))])]),_:2},1032,["prop","label"]))),128))]),_:1})]),_:1},8,["data"]),[[$,!m.value]])]))])}}},te=G(W,[["__scopeId","data-v-f9b54f3f"]]);export{te as default};
