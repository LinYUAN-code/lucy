import{L as T,R as w}from"./RightTips-990f7f6b.js";import{C}from"./Header-f90be2a6.js";import{I as N}from"./InputString-6f6380e2.js";import{_ as A,a as x,u as P,c,b as V,r as f,w as B,d as i,o as h,e as D,f as t,g as r,t as b,m as d,h as y,k as j,i as E}from"./index-05677f7b.js";/* empty css                                                                    */const q={class:"analysis-container"},H={class:"analysis"},O={class:"content"},z={class:"input-string"},F={__name:"LR0Analysis",setup(G){const _=x(),n=P();c(()=>_.currentRoute.value.query.type);const u=V({}),l=c(()=>n.getters["grammarStore/getStartTNonTer"]),g=f(!0),R=(o,p)=>{n.commit("grammarStore/updateLRParsingString",o),s.value=!1},a=c(()=>n.getters["grammarStore/getLRParsingString"]),L=c(()=>{if(!a.value||!l.value)return[];const o=n.getters["grammarStore/getLRParser"],p=n.getters["grammarStore/getLRPredictTable"];return o.predictInput(a.value,p).map((e,m)=>({Step:m+1,Stack:e.stack.join(" "),Symbols:e.symbols.join(" "),Input:e.input.join(" "),Action:e.move}))}),s=f(!1),k=()=>{!a.value||!l.value?_.push(T[2].route):s.value=!1},I=()=>{g.value=!1,s.value=!0,u.inputString=a,u.value=l};return B(()=>a,o=>{o.value||(s.value=!0)},{immediate:!0,deep:!0}),(o,p)=>{const v=i("Edit"),S=i("el-icon"),e=i("el-table-column"),m=i("el-table");return h(),D("div",q,[t(w,{type:"grammar"}),r("div",H,[t(C,{step:3,type:"LR0"}),r("div",O,[r("div",z,[r("span",null,"输入串："+b(d(a)),1),r("span",null,"首个非终结符："+b(d(l)),1),t(S,{class:"icon",onClick:I},{default:y(()=>[t(v)]),_:1})]),t(m,{data:d(L),stripe:"",style:{width:"100%"},border:"",class:"table"},{default:y(()=>[t(e,{prop:"Step",label:"Step","header-align":"center"}),t(e,{prop:"Stack",label:"Stack","header-align":"center"}),t(e,{prop:"Symbols",label:"symbols","header-align":"center"}),t(e,{prop:"Input",label:"Input",align:"right","header-align":"center"}),t(e,{prop:"Action",label:"Action","header-align":"center"})]),_:1},8,["data"])])]),s.value?(h(),j(N,{key:0,dialogVisible:s.value,type:"LL1",onSaveInput:R,data:u,notShowNonTer:g.value,onOnClose:k},null,8,["dialogVisible","data","notShowNonTer"])):E("",!0)])}}},W=A(F,[["__scopeId","data-v-55f79598"]]);export{W as default};