import I from"./LR0Table-933671b4.js";import{_ as w,s as A,u as L,c as p,r as N,a as d,x as g,b as h,d as _,e as b,h as o,f as r,l as P,t as S,g as v,k as V,w as B,p as C,m as j,z as y}from"./index-dc83c4b8.js";/* empty css                                                                    */import{T as D}from"./index-6a57f040.js";import"./Automaton-f58b55cd.js";const z=l=>(C("data-v-da8bd620"),l=l(),j(),l),E={class:"analysis"},W={class:"content-container"},q={class:"input-string"},F={class:"first"},G={class:"parser-string"},H={key:0},J=z(()=>r("div",null,[r("h4",null,"抽象语法树"),r("div",{id:"astNodeContainer"})],-1)),K={__name:"LR0Analysis",setup(l){A();const n=L(),f=p(()=>n.getters["grammarStore/getLR0Type"]);N({});const c=d([]),u=d(null),R=p(()=>n.getters["grammarStore/getStartTNonTer"]),T=a=>{console.log(a),new D("#astNodeContainer",{data:a})};d(!0);const i=p(()=>n.getters["grammarStore/getLRParsingString"]),m=p(()=>n.getters["grammarStore/getLRPredictTable"]),k=()=>{if(!i.value||!R.value)return[];const a=n.getters["grammarStore/getLRParser"];let e=[];try{e=a.predictInputWithAST(i.value,m.value),y(()=>{T(e[e.length-1].symbols)})}catch(t){console.error(t)}const s=e.map((t,x)=>({Step:x+1,Stack:t.stack.join(" "),Symbols:t.symbols.join(" "),Input:t.input.join(" "),Action:t.move}));c.value=s};return g([()=>i.value,m],([a,e],[s,t])=>{!a||!e||k()},{immediate:!0,deep:!0}),g(()=>c,a=>{y(()=>{var e;(e=u.value)==null||e.scrollIntoView({behavior:"smooth"})})},{deep:!0}),(a,e)=>{const s=h("el-table-column"),t=h("el-table");return _(),b("div",E,[o(I),r("div",W,[r("div",{class:"content",ref_key:"analysisRef",ref:u},[r("div",q,[r("div",F,[P(S(v(f))+"预测分析 ",1),r("span",G,S(v(i)),1)])]),c.value.length?(_(),V(t,{key:1,data:c.value,stripe:"",style:{"max-width":"700px"},border:"",class:"table"},{default:B(()=>[o(s,{prop:"Step",label:"Step","header-align":"center"}),o(s,{prop:"Stack",label:"Stack","header-align":"center"}),o(s,{prop:"Symbols",label:"symbols","header-align":"center"}),o(s,{prop:"Input",label:"Input",align:"right","header-align":"center"}),o(s,{prop:"Action",label:"Action","header-align":"center"})]),_:1},8,["data"])):(_(),b("div",H,"字符串规约失败"))],512),J])])}}},Y=w(K,[["__scopeId","data-v-da8bd620"]]);export{Y as default};
