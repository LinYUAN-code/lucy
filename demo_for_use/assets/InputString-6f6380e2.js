import{_ as h,u as y,r as i,c as b,d as s,o as d,k as C,h as c,g as l,e as k,f as _,i as w,s as B,y as x,z as N}from"./index-05677f7b.js";/* empty css                                                                    */const T=t=>(x("data-v-a243e20c"),t=t(),N(),t),U={class:"dialog-body"},j={key:0,class:"item"},q=T(()=>l("span",null,"请输入待分析字符串：",-1)),z={class:"btn-container"},E={__name:"InputString",props:{dialogVisible:{type:Boolean,required:!0},type:{type:String},data:{type:Object,default:{}},notShowInput:{type:Boolean,default:!1},notShowNonTer:{type:Boolean,default:!1}},emits:["saveInput","onClose"],setup(t,{emit:p}){var r,u;const e=t,m=y(),o=i(((r=e.data)==null?void 0:r.inputString)??""),g=i(((u=e.data)==null?void 0:u.value)??""),v=()=>{p("onClose")};b(()=>m.getters["grammarStore/getNonTerminal"]);const S=()=>{!o.value&&!e.notShowInput||p("saveInput",o.value,g.value)};return(F,a)=>{const f=s("el-input"),I=s("el-button"),V=s("el-dialog");return d(),C(V,{modelValue:e.dialogVisible,"onUpdate:modelValue":a[1]||(a[1]=n=>e.dialogVisible=n),title:"提示",class:"dialog",onClose:v,width:"500px"},{default:c(()=>[l("div",U,[e.notShowInput?w("",!0):(d(),k("div",j,[q,_(f,{modelValue:o.value,"onUpdate:modelValue":a[0]||(a[0]=n=>o.value=n),placeholder:"请使用空格分隔每个token",clearable:"",class:"input-area"},null,8,["modelValue"])])),l("div",z,[_(I,{type:"primary",class:"sure-btn",onClick:S},{default:c(()=>[B("确定")]),_:1})])])]),_:1},8,["modelValue"])}}},D=h(E,[["__scopeId","data-v-a243e20c"]]);export{D as I};
