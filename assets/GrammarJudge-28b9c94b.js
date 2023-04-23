import{_ as N,u as V,c as L,r as U,i as u,a as S,o as I,b as v,d,e as x,f,t as G,g as j,h as T,w as k,F as C,j as E,k as P,l as F,p as B,m as J,n as M,v as D,q as H,E as $}from"./index-1d163ec8.js";const q=_=>(B("data-v-de099632"),_=_(),J(),_),W={class:"dialog-body"},z={class:"content"},A={class:"handle"},K={class:"btn-container"},O={class:"support-grammers-list"},Q=q(()=>f("span",{class:"preview"},"预览处理结果",-1)),X={__name:"FormatTip",props:{needHandle:{type:Array,required:!0}},emits:["saveGrammar"],setup(_,{emit:t}){const l=_,c=V(),p=e=>{for(let a in n)r.value.includes(n[a].handleText)&&(e=n[a].handle(e));return e},g=L(()=>c.getters["grammarStore/getGrammar"]),w=()=>{let e=g.value;return r.value.length&&(e=p(e)),e},h=()=>{if(r.value.length){let e=g.value;t("saveGrammar",p(e))}},n=U({needUnion:{text:"同类项",handleText:"合并同类项",handle:e=>u.unionGrammers(e)},needLiftUp:{text:"左公因子",handleText:"提取左公因子",handle:e=>u.liftUpCommonTocken(e)},needClearRecursion:{text:"左递归",handleText:"消除左递归",handle:e=>u.clearRightRecursion(e)}}),b=L(()=>{let e="";return l.needHandle.forEach((a,o)=>{e+=n[a].text,o<l.needHandle.length-1&&(e+="/")}),e}),r=S([]);return I(()=>{r.value=l.needHandle.map(e=>n[e].handleText)}),(e,a)=>{const o=v("el-checkbox"),i=v("el-checkbox-group"),m=v("el-button"),y=v("el-popover");return d(),x("div",W,[f("div",z,"检测到该文法存在"+G(j(b))+"，是否需要进行文法改写？",1),T(i,{modelValue:r.value,"onUpdate:modelValue":a[0]||(a[0]=s=>r.value=s),class:"checkbox"},{default:k(()=>[(d(!0),x(C,null,E(l.needHandle,s=>(d(),F(o,{key:s,label:n[s].handleText,size:"large"},null,8,["label"]))),128))]),_:1},8,["modelValue"]),f("div",A,[f("div",K,[T(m,{type:"primary",onClick:h},{default:k(()=>[P("确定")]),_:1})]),T(y,{placement:"top",width:250,trigger:"hover"},{reference:k(()=>[Q]),default:k(()=>[f("ul",O,[(d(!0),x(C,null,E(w(),s=>(d(),x("li",{key:s},G(s),1))),128))])]),_:1})])])}}},Y=N(X,[["__scopeId","data-v-de099632"]]);const Z={class:"judge"},ee={class:"conclusion"},te={__name:"GrammarJudge",setup(_){const t=V(),l=S(!0),c=S([]),p=S(!0),g=S(!1),w=L(()=>t.getters["grammarStore/getCustomMode"]),h=L(()=>t.getters["grammarStore/getGrammar"]),n=()=>{const r=t.getters["grammarStore/getLL1Parser"],e=t.getters["grammarStore/getFirstSet"],a=t.getters["grammarStore/getFollowSet"],o=r.getPredictTable(e,a);if(!o.length)return;let i=!0;try{o.forEach(m=>{const{terminal2Derivation:y={}}=m;y.forEach(s=>{const{derivations:R=[]}=s;if(R.length>1)throw i=!1,new Error("End")})})}catch(m){if(m.message!=="End")throw m}if(l.value=i,!w.value&&(c.value=[],u.checkNeedunionGrammers(h.value)&&c.value.push("needUnion"),u.checkNeedliftUpCommonTocken(h.value)&&c.value.push("needLiftUp"),u.checkNeedClearRightRecursion(h.value)&&c.value.push("needClearRecursion"),c.value.length>0)){g.value=!0;return}g.value=!1},b=r=>{if(!w.value){try{const{nonTerminals:e,terminals:a}=u.getTockFromSimpleGrammers(r);t.commit("grammarStore/updateNonTerminal",e),t.commit("grammarStore/updateTerminal",a),t.commit("grammarStore/updateInitialGrammar",h.value),t.commit("grammarStore/updateGrammar",r);const o=new u.LL1Parser(a,e,r),i=o.getFirstSet(),m=o.getFollowSet(i);t.commit("grammarStore/updateLL1Parser",o),t.commit("grammarStore/updateFirstSet",i),t.commit("grammarStore/updateFollowSet",m),p.value=!1}catch{$({message:"操作失败",type:"error"});return}n()}};return I(()=>{n()}),(r,e)=>{const a=v("Warning"),o=v("el-icon");return d(),x("div",Z,[M(f("div",ee,[l.value?H("",!0):(d(),F(o,{key:0},{default:k(()=>[T(a)]),_:1})),P(" 该文法"+G(l.value?"":"不")+"是LL1文法 ",1)],512),[[D,p.value]]),p.value&&g.value?(d(),F(Y,{key:0,needHandle:c.value,onSaveGrammar:b},null,8,["needHandle"])):H("",!0)])}}},re=N(te,[["__scopeId","data-v-2c02b76e"]]);export{re as default};
