var lucy=function(e){"use strict";function t(e,t){return t.map((e=>e.replaceAll(/\s/g,""))).map((t=>{const r=t.split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),n=r[1].split("|").filter((e=>e&&"|"!==e)).map((t=>e.splitDerivation(t)));return{nonTerminal:r[0],derivations:n}}))}function r(e){switch(e){case"+":case"*":case"(":case")":return`\\${e}`;default:return e}}const n="ε",i="$";var a;!function(e){e[e.Normal=0]="Normal",e[e.Warnning=1]="Warnning",e[e.Error=2]="Error",e[e.None=3]="None"}(a||(a={}));let o=a.Normal;o=a.Error;var s=new class{logLevel;logChannel;constructor(e=a.Normal,t=console){this.logLevel=e,this.logChannel=t}log(...e){this.logLevel<=a.Normal&&this.logChannel.log("[normal]",...e)}warn(...e){this.logLevel<=a.Warnning&&this.logChannel.warn("[warn]",...e)}error(...e){this.logLevel<=a.Error&&this.logChannel.error("[error]",...e)}logTo(e){this.logChannel=e}}(o);function l(e,r){s.log("[generateFirstSet start]");const i=t(e,r);s.log("[grammers after transferString2Grammers]",i);const a=new Array(...i.map((e=>({tocken:e.nonTerminal,terminals:new Set})))),o=new Map;i.forEach((e=>{o.set(e.nonTerminal,e.derivations)})),a.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0})))),a.forEach((e=>{if(!e.isTerminal)for(let t of o.get(e.tocken))1!==t.length||t[0]!==n||e.terminals.has(n)||e.terminals.add(n)}));const l=new Map;for(let e of a)l.set(e.tocken,e);for(;;){let t=!1;if(a.forEach((r=>{if(!r.isTerminal)for(let i of o.get(r.tocken))for(let a=0;a<i.length;a++){const o=i[a];if(e.isTerminal(o)){if(r.terminals.has(o)||(s.log(o),t=!0,r.terminals.add(o)),o!==n)break}else{const e=l.get(o);if(e.terminals.forEach((e=>{e!==n&&(r.terminals.has(e)||(t=!0,r.terminals.add(e)))})),!e.terminals.has(n))break}a===i.length-1&&r.terminals.add(n)}})),!t)break}return a.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}function m(e,t,r){const i=new Set;for(let a=0;a<t.length;a++){const o=t[a];if(e.isTerminal(o)){if(o!==n){i.add(o);break}}else if(r.get(o)?.terminals.forEach((e=>{i.add(e)})),!r.get(o).terminals.has(n))break;a===t.length-1&&i.add(n)}return{tocken:t.join(""),terminals:i}}class c{nonTerminals;terminals;currentLine=0;currentColumn=0;source="";constructor(e,t){this.nonTerminals=t,this.terminals=e}setSource(e){this.source=e,this.currentLine=0,this.currentColumn=0}remainString(){return this.source.slice(this.currentColumn)}next(){if(this.currentColumn===this.source.length)return{tocken:i,origin:i};for(let e of this.terminals){const t=this.source.slice(this.currentColumn).match(e[1]);if(t)return{tocken:e[0],origin:t[0]}}throw new Error(`[lexer next]: match next Terminal error \n sourecInput: ${this.source}\n remainString: ${this.source.slice(this.currentColumn)}`)}pop(){try{const e=this.next();return this.currentColumn+=e.origin.length,e}catch(e){throw e}}isTerminal(e){let t=!0;return this.nonTerminals.some((r=>r===e&&(t=!1,!0))),t}splitDerivation(e){const t=[];for(;e.length;){for(let r of this.nonTerminals){const n=e.match(new RegExp("^"+r));n&&(t.push(r),e=e.slice(n[0].length))}for(let n of this.terminals){const i=e.match(new RegExp("^"+r(n[0])));i&&(t.push(n[0]),e=e.slice(i[0].length))}}return s.log(t),t}}function f(e,r,i,a){const o=t(e,r),l=[],c=new Map;e.nonTerminals.forEach((e=>{const t={nonTerminal:e,terminal2Derivation:new Map};c.set(e,t),l.push(t)}));const f=new Map,h=new Map;for(let e of a)h.set(e.tocken,e);for(let e of i)f.set(e.tocken,e);return o.forEach((t=>{for(let r of t.derivations){const i=m(e,r,f),a=c.get(t.nonTerminal);s.log(i);for(let e of i.terminals){if(e===n)continue;let i=a?.terminal2Derivation.get(e);i||(i={nonTerminal:t.nonTerminal,derivations:[]},a?.terminal2Derivation.set(e,i)),i.derivations.push(r)}if(i.terminals.has(n))for(let e of h.get(t.nonTerminal).terminals){let n=a?.terminal2Derivation.get(e);n||(n={nonTerminal:t.nonTerminal,derivations:[]},a?.terminal2Derivation.set(e,n)),n.derivations.push(r)}}})),l}function h(e,t){for(let r of e.terminals){const e=r[0];t.forEach((t=>{const r=t.terminal2Derivation.get(e);if(r&&r.derivations.length>1)return!1}))}return!0}const g=/^[A-Z]'?/,u=/[a-z|\u0391-\u03C9]/;return e.LL1Parser=class{lexer;textGrammers;constructor(e,t,r){this.lexer=new c(e,t),this.textGrammers=r}getFirstSet(){return l(this.lexer,this.textGrammers)}getFollowSet(e){return e||(e=this.getFirstSet()),function(e,r,a){s.log("[generateFllowSet start]"),a=a?Array.from(a):l(e,r);const o=t(e,r);s.log("[grammers after transferString2Grammers]",o);const m=new Array(...o.map((e=>({tocken:e.nonTerminal,terminals:new Set([i])})))),c=new Map;o.forEach((e=>{c.set(e.nonTerminal,e.derivations)})),m.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([i]),isTerminal:!0}))));const f=new Map;for(let e of m)f.set(e.tocken,e);a.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0}))));const h=new Map;for(let e of a)h.set(e.tocken,e);for(;;){let e=!1;if(o.forEach((t=>{for(let r of t.derivations)for(let t=r.length-2;t>=0;t--){const i=f.get(r[t]);for(let a=t+1;a<r.length;a++){const t=h.get(r[a]).terminals;for(let r of t)r!==n&&(i?.terminals.has(r)||(e=!0,i?.terminals.add(r)));if(!t.has(n))break}}})),o.forEach((t=>{const r=f.get(t.nonTerminal);for(let i of t.derivations)for(let t=i.length-1;t>=0;t--){const a=i[t],o=f.get(a);for(let t of r.terminals)t!==n&&(o?.terminals.has(t)||(e=!0,o?.terminals.add(t)));if(!h.get(a).terminals.has(n))break}})),!e)break}return m.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}(this.lexer,this.textGrammers,e)}getPredictTable(e,t){return e||(e=this.getFirstSet()),t||(t=this.getFollowSet(e)),f(this.lexer,this.textGrammers,e,t)}getPredictProcess(e,t,r){return r||(r=f(this.lexer,this.textGrammers,this.getFirstSet(),this.getFollowSet())),function(e,t,r,a){let o=r.replaceAll(/\s/g,"");const l=[];let m={parseStack:[i,a],remainingInput:r,parseAction:""};e.setSource(o);const c=new Map;for(t.forEach((e=>{c.set(e.nonTerminal,e)}));;){const t=m.parseStack[m.parseStack.length-1];if(e.isTerminal(t)){const r=e.next();if(t!==r.tocken)throw new Error(`[predict error] terminal match error tocken: ${t} stack: ${m.parseStack} remainingInput: ${e.remainString()}`);if(m.parseAction=`match ${r.tocken} ${r.origin}`,l.push(m),m=JSON.parse(JSON.stringify(m)),e.pop(),m.parseAction="",m.remainingInput=e.remainString(),m.parseStack.pop(),0===m.parseStack.length)break;continue}const r=e.next(),i=c.get(t).terminal2Derivation.get(r.tocken);if(1!==i.derivations.length)throw new Error(`[predict error] parse input fail \n terminal: ${r} \n  remainingInput: ${e.remainString()} \n grammer: ${i} `);m.parseAction=`Predict ${i.nonTerminal} => ${i.derivations[0].join(" ")}`,s.log("[predict State]",m),l.push(m),m=JSON.parse(JSON.stringify(m)),m.parseStack.pop(),m.parseStack.push(...i.derivations[0].filter((e=>e!==n)).reverse()),m.parseAction="",m.remainingInput=e.remainString()}return l}(this.lexer,r,e,t)}checkPredickTableIsValid(e){return h(this.lexer,e)}checkIsLL0(){return h(this.lexer,this.getPredictTable())}getFirstSetProgressive(){return function*(e,r){yield["1. 如果X式一个终结符号，那么FIRST(X) = X ","2. 如果 X => ε 是一个产生式，那么将e加人到 FIRST（X)中。","3. A => B0B1B2B3\n            i = 0\n            FIRST(Bi) - EmptyCharacter 加入到 FIRST(A)中\n            如果FIRST(B1)不含有EmptyCharacter退出循环\n            若B0 - B3均含有EmptyCharacter 将EmptyCharacter加入到FIRST(A)中\n        ","4. 去除所有终结符号的表项"],s.log("[generateFirstSet start]");const i=t(e,r);s.log("[grammers after transferString2Grammers]",i);const a=new Array(...i.map((e=>({tocken:e.nonTerminal,terminals:new Set})))),o=new Map;i.forEach((e=>{o.set(e.nonTerminal,e.derivations)})),a.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0})))),yield{ruleIndex:0,result:a},a.forEach((e=>{if(!e.isTerminal)for(let t of o.get(e.tocken))1!==t.length||t[0]!==n||e.terminals.has(n)||e.terminals.add(n)})),yield{ruleIndex:1,result:a};const l=new Map;for(let e of a)l.set(e.tocken,e);for(;;){let t=!1;if(a.forEach((r=>{if(!r.isTerminal)for(let i of o.get(r.tocken))for(let a=0;a<i.length;a++){const o=i[a];if(e.isTerminal(o)){if(r.terminals.has(o)||(s.log(o),t=!0,r.terminals.add(o)),o!==n)break}else{const e=l.get(o);if(e.terminals.forEach((e=>{e!==n&&(r.terminals.has(e)||(t=!0,r.terminals.add(e)))})),!e.terminals.has(n))break}a===i.length-1&&r.terminals.add(n)}})),!t)break;yield{ruleIndex:2,result:a}}yield{ruleIndex:3,result:a.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}}(this.lexer,this.textGrammers)}getFollowSetProgressive(e){return e||(e=this.getFirstSet()),function*(e,r,a){yield["1. 将$放到FOLLOW(S)中","2. 如果存在一个产生式A => aBb ， 那么FIRST(b) 中除ε 之外的所有符号都在FOLLOW(B)中。attention: A => aBCd 那么把first(Cd)加入到Follow(B)中去","3.如果存在一个产生式 A => aB ， 或存在产生式 A => aBb 且FIRST(b) 包含 ε ，那么FOLLOW(A)中的所有符号都在FOLLOW(B)中。","4. 去除所有终结符号的表项"],s.log("[generateFllowSet start]"),a=a?Array.from(a):l(e,r);const o=t(e,r);s.log("[grammers after transferString2Grammers]",o);const m=new Array(...o.map((e=>({tocken:e.nonTerminal,terminals:new Set([i])})))),c=new Map;o.forEach((e=>{c.set(e.nonTerminal,e.derivations)})),m.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([i]),isTerminal:!0})))),yield{ruleIndex:0,result:m};const f=new Map;for(let e of m)f.set(e.tocken,e);a.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0}))));const h=new Map;for(let e of a)h.set(e.tocken,e);for(;;){let e=!1;if(o.forEach((t=>{for(let r of t.derivations)for(let t=r.length-2;t>=0;t--){const i=f.get(r[t]);for(let a=t+1;a<r.length;a++){const t=h.get(r[a]).terminals;for(let r of t)r!==n&&(i?.terminals.has(r)||(e=!0,i?.terminals.add(r)));if(!t.has(n))break}}})),e&&(yield{ruleIndex:1,result:m},e=!1),o.forEach((t=>{const r=f.get(t.nonTerminal);for(let i of t.derivations)for(let t=i.length-1;t>=0;t--){const a=i[t],o=f.get(a);for(let t of r.terminals)t!==n&&(o?.terminals.has(t)||(e=!0,o?.terminals.add(t)));if(!h.get(a).terminals.has(n))break}})),e&&(yield{ruleIndex:2,result:m}),!e)break}yield{ruleIndex:3,result:m.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}}(this.lexer,this.textGrammers,e)}getPredictTableProgressive(e,r){return e||(e=this.getFirstSet()),r||(r=this.getFollowSet(e)),function*(e,r,i,a){yield["1. 对 First(u) 中的所有终结符 a （不含 ε ），置 M[A, a] = A -> u","2. 若 First(u) 含 ε ，则对 Follow(A) 中的所有符号 a （可含 $ ），置 M[A, a] = A -> u"];const o=t(e,r),l=[],c=new Map;e.nonTerminals.forEach((e=>{const t={nonTerminal:e,terminal2Derivation:new Map};c.set(e,t),l.push(t)}));const f=new Map,h=new Map;for(let e of a)h.set(e.tocken,e);for(let e of i)f.set(e.tocken,e);for(let t of o)for(let r of t.derivations){const i=m(e,r,f),a=c.get(t.nonTerminal);s.log(i);for(let e of i.terminals){if(e===n)continue;let i=a?.terminal2Derivation.get(e);i||(i={nonTerminal:t.nonTerminal,derivations:[]},a?.terminal2Derivation.set(e,i)),i.derivations.push(r),yield{ruleIndex:0,result:l}}if(i.terminals.has(n))for(let e of h.get(t.nonTerminal).terminals){let n=a?.terminal2Derivation.get(e);n||(n={nonTerminal:t.nonTerminal,derivations:[]},a?.terminal2Derivation.set(e,n)),n.derivations.push(r),yield{ruleIndex:1,result:l}}}}(this.lexer,this.textGrammers,e,r)}},e.getTockFromSimpleGrammers=function(e){const t=new Set,r=new Set;return e.forEach((e=>{const n=e.replaceAll(/\s/g,"").split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),i=n[0];t.add(i),n[1].split("|").filter((e=>e&&"|"!==e)).forEach((e=>{for(;e.length;){let n=null;if(n=e.match(g),n)t.add(n[0]),e=e.slice(n[0].length);else{if(n=e.match(u),!n)throw new Error(`[getTockFromSimpleGrammers error] cant recognize the character remaining: ${e}`);r.add(JSON.stringify([n[0],"^"+n[0]])),e=e.slice(n[0].length)}}}))})),{nonTerminals:Array.from(t).sort(((e,t)=>t.length-e.length)),terminals:Array.from(r).map((e=>{const t=JSON.parse(e);return t[1]=new RegExp(t[1]),t}))}},e}({});
