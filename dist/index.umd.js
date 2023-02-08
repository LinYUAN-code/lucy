!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).index={})}(this,(function(e){"use strict";function t(e,t){return t.map((e=>e.replaceAll(/\s/g,""))).map((t=>{const r=t.split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),n=r[1].split("|").filter((e=>e&&"|"!==e)).map((t=>e.splitDerivation(t)));return{nonTerminal:r[0],derivations:n}}))}function r(e){switch(e){case"+":case"*":case"(":case")":return`\\${e}`;default:return e}}const n="ε",i="$";var o;!function(e){e[e.Normal=0]="Normal",e[e.Warnning=1]="Warnning",e[e.Error=2]="Error",e[e.None=3]="None"}(o||(o={}));let s=o.Normal;s=o.Error;var a=new class{logLevel;logChannel;constructor(e=o.Normal,t=console){this.logLevel=e,this.logChannel=t}log(...e){this.logLevel<=o.Normal&&this.logChannel.log("[normal]",...e)}warn(...e){this.logLevel<=o.Warnning&&this.logChannel.warn("[warn]",...e)}error(...e){this.logLevel<=o.Error&&this.logChannel.error("[error]",...e)}logTo(e){this.logChannel=e}}(s);function l(e,r){a.log("[generateFirstSet start]");const i=t(e,r);a.log("[grammers after transferString2Grammers]",i);const o=new Array(...i.map((e=>({tocken:e.nonTerminal,terminals:new Set})))),s=new Map;i.forEach((e=>{s.set(e.nonTerminal,e.derivations)})),o.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0})))),o.forEach((e=>{if(!e.isTerminal)for(let t of s.get(e.tocken))1!==t.length||t[0]!==n||e.terminals.has(n)||e.terminals.add(n)}));const l=new Map;for(let e of o)l.set(e.tocken,e);for(;;){let t=!1;if(o.forEach((r=>{if(!r.isTerminal)for(let i of s.get(r.tocken))for(let o=0;o<i.length;o++){const s=i[o];if(e.isTerminal(s)){if(r.terminals.has(s)||(a.log(s),t=!0,r.terminals.add(s)),s!==n)break}else{const e=l.get(s);if(e.terminals.forEach((e=>{e!==n&&(r.terminals.has(e)||(t=!0,r.terminals.add(e)))})),!e.terminals.has(n))break}o===i.length-1&&r.terminals.add(n)}})),!t)break}return o.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}function m(e,t,r){const i=new Set;for(let o=0;o<t.length;o++){const s=t[o];if(e.isTerminal(s)){if(s!==n){i.add(s);break}}else if(r.get(s)?.terminals.forEach((e=>{i.add(e)})),!r.get(s).terminals.has(n))break;o===t.length-1&&i.add(n)}return{tocken:t.join(""),terminals:i}}class c{nonTerminals;terminals;currentLine=0;currentColumn=0;source="";constructor(e,t){this.nonTerminals=[...t],this.terminals=[...e]}setSource(e){this.source=e,this.currentLine=0,this.currentColumn=0}remainString(){return this.source.slice(this.currentColumn)}next(){if(this.currentColumn===this.source.length)return{tocken:i,origin:i};for(let e of this.terminals){const t=this.source.slice(this.currentColumn).match(e[1]);if(t)return{tocken:e[0],origin:t[0]}}throw new Error(`[lexer next]: match next Terminal error \n sourecInput: ${this.source}\n remainString: ${this.source.slice(this.currentColumn)}`)}pop(){try{const e=this.next();return this.currentColumn+=e.origin.length,e}catch(e){throw e}}isTerminal(e){let t=!0;return this.nonTerminals.some((r=>r===e&&(t=!1,!0))),t}splitDerivation(e){const t=[];let n=0;const i=e;for(;e.length;){for(let r of this.nonTerminals){const n=e.match(new RegExp("^"+r));if(n){t.push(r),e=e.slice(n[0].length);break}}for(let n of this.terminals){const i=e.match(new RegExp("^"+r(n[0])));if(i){t.push(n[0]),e=e.slice(i[0].length);break}}if(n++,n>5e4)throw new Error(`[splitDerivation] error: excute over MAX_EXCUTE str: ${i}  remaining str: ${e} `)}return t}getNewNonTerminal(e){let t=e;for(;;)if(t+="'",-1===this.nonTerminals.indexOf(t))return this.nonTerminals.unshift(t),t}}function f(e,r,i,o){const s=t(e,r),l=[],c=new Map;e.nonTerminals.forEach((e=>{const t={nonTerminal:e,terminal2Derivation:new Map};c.set(e,t),l.push(t)}));const f=new Map,h=new Map;for(let e of o)h.set(e.tocken,e);for(let e of i)f.set(e.tocken,e);return s.forEach((t=>{for(let r of t.derivations){const i=m(e,r,f),o=c.get(t.nonTerminal);a.log(i);for(let e of i.terminals){if(e===n)continue;let i=o?.terminal2Derivation.get(e);i||(i={nonTerminal:t.nonTerminal,derivations:[]},o?.terminal2Derivation.set(e,i)),i.derivations.push(r)}if(i.terminals.has(n))for(let e of h.get(t.nonTerminal).terminals){let n=o?.terminal2Derivation.get(e);n||(n={nonTerminal:t.nonTerminal,derivations:[]},o?.terminal2Derivation.set(e,n)),n.derivations.push(r)}}})),l}function h(e,t){for(let r of e.terminals){const e=r[0];t.forEach((t=>{const r=t.terminal2Derivation.get(e);if(r&&r.derivations.length>1)return!1}))}return!0}const g=/^[A-Z]'*/,u=/[a-z|\u0391-\u03C9]/;function p(e){const t=new Set,r=new Set;return e.forEach((e=>{const n=e.replaceAll(/\s/g,"").split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),i=n[0];t.add(i),n[1].split("|").filter((e=>e&&"|"!==e)).forEach((e=>{for(;e.length;){let n=null;if(n=e.match(g),n)t.add(n[0]),e=e.slice(n[0].length);else{if(n=e.match(u),!n)throw new Error(`[getTockFromSimpleGrammers error] cant recognize the character remaining: ${e}`);r.add(JSON.stringify([n[0],"^"+n[0]])),e=e.slice(n[0].length)}}}))})),{nonTerminals:Array.from(t).sort(((e,t)=>t.length-e.length)),terminals:Array.from(r).map((e=>{const t=JSON.parse(e);return t[1]=new RegExp(t[1]),t}))}}e.LL1Parser=class{lexer;textGrammers;constructor(e,t,r){this.lexer=new c(e,t),this.textGrammers=r}getFirstSet(){return l(this.lexer,this.textGrammers)}getFollowSet(e){return e||(e=this.getFirstSet()),function(e,r,o){a.log("[generateFllowSet start]"),o=o?Array.from(o):l(e,r);const s=t(e,r);a.log("[grammers after transferString2Grammers]",s);const m=new Array(...s.map((e=>({tocken:e.nonTerminal,terminals:new Set([i])})))),c=new Map;s.forEach((e=>{c.set(e.nonTerminal,e.derivations)})),m.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([i]),isTerminal:!0}))));const f=new Map;for(let e of m)f.set(e.tocken,e);o.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0}))));const h=new Map;for(let e of o)h.set(e.tocken,e);for(;;){let e=!1;if(s.forEach((t=>{for(let r of t.derivations)for(let t=r.length-2;t>=0;t--){const i=f.get(r[t]);for(let o=t+1;o<r.length;o++){const t=h.get(r[o]).terminals;for(let r of t)r!==n&&(i?.terminals.has(r)||(e=!0,i?.terminals.add(r)));if(!t.has(n))break}}})),s.forEach((t=>{const r=f.get(t.nonTerminal);for(let i of t.derivations)for(let t=i.length-1;t>=0;t--){const o=i[t],s=f.get(o);for(let t of r.terminals)t!==n&&(s?.terminals.has(t)||(e=!0,s?.terminals.add(t)));if(!h.get(o).terminals.has(n))break}})),!e)break}return m.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}(this.lexer,this.textGrammers,e)}getPredictTable(e,t){return e||(e=this.getFirstSet()),t||(t=this.getFollowSet(e)),f(this.lexer,this.textGrammers,e,t)}getPredictProcess(e,t,r){return r||(r=f(this.lexer,this.textGrammers,this.getFirstSet(),this.getFollowSet())),function(e,t,r,o){let s=r.replaceAll(/\s/g,"");const l=[];let m={parseStack:[i,o],remainingInput:r,parseAction:""};e.setSource(s);const c=new Map;for(t.forEach((e=>{c.set(e.nonTerminal,e)}));;){const t=m.parseStack[m.parseStack.length-1];if(e.isTerminal(t)){const r=e.next();if(t!==r.tocken)throw new Error(`[predict error] terminal match error tocken: ${t} stack: ${m.parseStack} remainingInput: ${e.remainString()}`);if(m.parseAction=`match ${r.tocken} ${r.origin}`,l.push(m),m=JSON.parse(JSON.stringify(m)),e.pop(),m.parseAction="",m.remainingInput=e.remainString(),m.parseStack.pop(),0===m.parseStack.length)break;continue}const r=e.next(),i=c.get(t).terminal2Derivation.get(r.tocken);if(1!==i.derivations.length)throw new Error(`[predict error] parse input fail \n terminal: ${r} \n  remainingInput: ${e.remainString()} \n grammer: ${i} `);m.parseAction=`Predict ${i.nonTerminal} => ${i.derivations[0].join(" ")}`,a.log("[predict State]",m),l.push(m),m=JSON.parse(JSON.stringify(m)),m.parseStack.pop(),m.parseStack.push(...i.derivations[0].filter((e=>e!==n)).reverse()),m.parseAction="",m.remainingInput=e.remainString()}return l}(this.lexer,r,e,t)}checkPredickTableIsValid(e){return h(this.lexer,e)}checkIsLL0(){return h(this.lexer,this.getPredictTable())}getFirstSetProgressive(){return function*(e,r){yield["1. 如果X式一个终结符号，那么FIRST(X) = X ","2. 如果 X => ε 是一个产生式，那么将e加人到 FIRST（X)中。","3. A => B0B1B2B3\n            i = 0\n            FIRST(Bi) - EmptyCharacter 加入到 FIRST(A)中\n            如果FIRST(B1)不含有EmptyCharacter退出循环\n            若B0 - B3均含有EmptyCharacter 将EmptyCharacter加入到FIRST(A)中\n        ","4. 去除所有终结符号的表项"],a.log("[generateFirstSet start]");const i=t(e,r);a.log("[grammers after transferString2Grammers]",i);const o=new Array(...i.map((e=>({tocken:e.nonTerminal,terminals:new Set})))),s=new Map;i.forEach((e=>{s.set(e.nonTerminal,e.derivations)})),o.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0})))),yield{ruleIndex:0,result:o},o.forEach((e=>{if(!e.isTerminal)for(let t of s.get(e.tocken))1!==t.length||t[0]!==n||e.terminals.has(n)||e.terminals.add(n)})),yield{ruleIndex:1,result:o};const l=new Map;for(let e of o)l.set(e.tocken,e);for(;;){let t=!1;if(o.forEach((r=>{if(!r.isTerminal)for(let i of s.get(r.tocken))for(let o=0;o<i.length;o++){const s=i[o];if(e.isTerminal(s)){if(r.terminals.has(s)||(a.log(s),t=!0,r.terminals.add(s)),s!==n)break}else{const e=l.get(s);if(e.terminals.forEach((e=>{e!==n&&(r.terminals.has(e)||(t=!0,r.terminals.add(e)))})),!e.terminals.has(n))break}o===i.length-1&&r.terminals.add(n)}})),!t)break;yield{ruleIndex:2,result:o}}yield{ruleIndex:3,result:o.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}}(this.lexer,this.textGrammers)}getFollowSetProgressive(e){return e||(e=this.getFirstSet()),function*(e,r,o){yield["1. 将$放到FOLLOW(S)中","2. 如果存在一个产生式A => aBb ， 那么FIRST(b) 中除ε 之外的所有符号都在FOLLOW(B)中。attention: A => aBCd 那么把first(Cd)加入到Follow(B)中去","3.如果存在一个产生式 A => aB ， 或存在产生式 A => aBb 且FIRST(b) 包含 ε ，那么FOLLOW(A)中的所有符号都在FOLLOW(B)中。","4. 去除所有终结符号的表项"],a.log("[generateFllowSet start]"),o=o?Array.from(o):l(e,r);const s=t(e,r);a.log("[grammers after transferString2Grammers]",s);const m=new Array(...s.map((e=>({tocken:e.nonTerminal,terminals:new Set([i])})))),c=new Map;s.forEach((e=>{c.set(e.nonTerminal,e.derivations)})),m.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([i]),isTerminal:!0})))),yield{ruleIndex:0,result:m};const f=new Map;for(let e of m)f.set(e.tocken,e);o.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0}))));const h=new Map;for(let e of o)h.set(e.tocken,e);for(;;){let e=!1;if(s.forEach((t=>{for(let r of t.derivations)for(let t=r.length-2;t>=0;t--){const i=f.get(r[t]);for(let o=t+1;o<r.length;o++){const t=h.get(r[o]).terminals;for(let r of t)r!==n&&(i?.terminals.has(r)||(e=!0,i?.terminals.add(r)));if(!t.has(n))break}}})),e&&(yield{ruleIndex:1,result:m},e=!1),s.forEach((t=>{const r=f.get(t.nonTerminal);for(let i of t.derivations)for(let t=i.length-1;t>=0;t--){const o=i[t],s=f.get(o);for(let t of r.terminals)t!==n&&(s?.terminals.has(t)||(e=!0,s?.terminals.add(t)));if(!h.get(o).terminals.has(n))break}})),e&&(yield{ruleIndex:2,result:m}),!e)break}yield{ruleIndex:3,result:m.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}}(this.lexer,this.textGrammers,e)}getPredictTableProgressive(e,r){return e||(e=this.getFirstSet()),r||(r=this.getFollowSet(e)),function*(e,r,i,o){yield["1. 对 First(u) 中的所有终结符 a （不含 ε ），置 M[A, a] = A -> u","2. 若 First(u) 含 ε ，则对 Follow(A) 中的所有符号 a （可含 $ ），置 M[A, a] = A -> u"];const s=t(e,r),l=[],c=new Map;e.nonTerminals.forEach((e=>{const t={nonTerminal:e,terminal2Derivation:new Map};c.set(e,t),l.push(t)}));const f=new Map,h=new Map;for(let e of o)h.set(e.tocken,e);for(let e of i)f.set(e.tocken,e);for(let t of s)for(let r of t.derivations){const i=m(e,r,f),o=c.get(t.nonTerminal);a.log(i);for(let e of i.terminals){if(e===n)continue;let i=o?.terminal2Derivation.get(e);i||(i={nonTerminal:t.nonTerminal,derivations:[]},o?.terminal2Derivation.set(e,i)),i.derivations.push(r),yield{ruleIndex:0,result:l}}if(i.terminals.has(n))for(let e of h.get(t.nonTerminal).terminals){let n=o?.terminal2Derivation.get(e);n||(n={nonTerminal:t.nonTerminal,derivations:[]},o?.terminal2Derivation.set(e,n)),n.derivations.push(r),yield{ruleIndex:1,result:l}}}}(this.lexer,this.textGrammers,e,r)}},e.clearRightRecursion=function(e,t,r){const i=[];if(!t||!r){const n=p(e);t=n.nonTerminals,r=n.terminals}a.log("[nonTerminals]",t),a.log("[terminals]",r);let o=new c(r,t);const s=new Map;for(let t of e){t=t.replaceAll(/\s/g,"");const e=t.split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),r=e[0],n=e[1].split("|").filter((e=>e)).map((e=>o.splitDerivation(e)));s.set(r,n)}a.log("[nonTerminals2DerivationMap]",s);for(let e=0;e<t.length;e++){const r=s.get(t[e]);for(let n=0;n<e;n++){const e=s.get(t[n]);for(let i=r.length-1;i>=0;i--){const o=r[i];if(o[0]===t[n]){a.log(o,t[n]);for(let t of e)a.log("[-]",t),r?.push([...t,...o.slice(1)]);r?.splice(i,1)}}}const i=[];for(let n=r.length-1;n>=0;n--){r[n][0]===t[e]&&i.push(n)}if(i.length){const a=o.getNewNonTerminal(t[e]),l=[],m=[];for(let e=r.length-1;e>=0;e--)-1===i.indexOf(e)&&l.push([...r[e][0]===n?r[e].slice(1):r[e],a]);for(let e of i)m.push([...r[e].slice(1),a]);m.push([n]),s.set(t[e],[...l,...i.length?[]:r]),s.set(a,m)}a.log("[nonTerminals2DerivationMap in process]",s,r)}for(let e of s.keys()){const t=s.get(e).map((e=>e.join(""))).join(" | ");i.push(`${e} => ${t}`)}return i},e.getTockFromSimpleGrammers=p,e.liftUpCommonTocken=function(e,t,r){let n=e;if(!t||!r){const n=p(e);t=n.nonTerminals,r=n.terminals}let i=new c(r,t);for(;;){let e=[];const t=n.map((t=>{const r=(t=t.replaceAll(/\s/g,"")).split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),o=r[0],s=r[1].split("|").filter((e=>e)).map((e=>(a.log("[debug]",n),i.splitDerivation(e)))),l=[],m=new Map;s.forEach((e=>{let t=m.get(e[0]);t?t.push(e.slice(1)):t=[e.slice(1)],m.set(e[0],t)}));for(let t of m.keys()){if(1===m.get(t)?.length){l.push(t+m.get(t)[0].join(""));continue}const r=m.get(t),n=i.getNewNonTerminal(o);l.push(t+n),e.push(n+" => "+r?.map((e=>e.join(""))).join(" | "))}return o+" => "+l.join(" | ")}));a.log("[pre]",t,e);const r=[...t,...e];if(a.log("[com]",n,r),n.length===r.length)break;n=r}return n},e.unionGrammers=function(e){let t=new Map;const r=[];e.forEach((e=>{const r=(e=e.replaceAll(/\s/g,"")).split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),n=r[0],i=r[1];if(t.has(n)){const e=t.get(n);e?.push(i),t.set(n,e)}else t.set(n,[i])}));for(let e of t.keys()){const n=[...new Set(t.get(e))];r.push(`${e} => ${n.join("|")}`.split("|").join(" | "))}return a.log(r),r}}));
