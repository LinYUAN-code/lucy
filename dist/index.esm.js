function e(e,t){return t.map((e=>e.replaceAll(/\s/g,""))).map((t=>{const r=t.split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),n=r[1].split("|").filter((e=>e&&"|"!==e)).map((t=>e.splitDerivation(t)));return{nonTerminal:r[0],derivations:n}}))}function t(e){switch(e){case"+":case"*":case"(":case")":return`\\${e}`;default:return e}}const r="ε",n="$";var i;!function(e){e[e.Normal=0]="Normal",e[e.Warnning=1]="Warnning",e[e.Error=2]="Error",e[e.None=3]="None"}(i||(i={}));let a=i.Normal;a=i.Error;var o=new class{logLevel;logChannel;constructor(e=i.Normal,t=console){this.logLevel=e,this.logChannel=t}log(...e){this.logLevel<=i.Normal&&this.logChannel.log("[normal]",...e)}warn(...e){this.logLevel<=i.Warnning&&this.logChannel.warn("[warn]",...e)}error(...e){this.logLevel<=i.Error&&this.logChannel.error("[error]",...e)}logTo(e){this.logChannel=e}}(a);function s(t,n){o.log("[generateFirstSet start]");const i=e(t,n);o.log("[grammers after transferString2Grammers]",i);const a=new Array(...i.map((e=>({tocken:e.nonTerminal,terminals:new Set})))),s=new Map;i.forEach((e=>{s.set(e.nonTerminal,e.derivations)})),a.push(...t.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0})))),a.forEach((e=>{if(!e.isTerminal)for(let t of s.get(e.tocken))1!==t.length||t[0]!==r||e.terminals.has(r)||e.terminals.add(r)}));const l=new Map;for(let e of a)l.set(e.tocken,e);for(;;){let e=!1;if(a.forEach((n=>{if(!n.isTerminal)for(let i of s.get(n.tocken))for(let a=0;a<i.length;a++){const s=i[a];if(t.isTerminal(s)){if(n.terminals.has(s)||(o.log(s),e=!0,n.terminals.add(s)),s!==r)break}else{const t=l.get(s);if(t.terminals.forEach((t=>{t!==r&&(n.terminals.has(t)||(e=!0,n.terminals.add(t)))})),!t.terminals.has(r))break}a===i.length-1&&n.terminals.add(r)}})),!e)break}return a.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}function l(e,t,n){const i=new Set;for(let a=0;a<t.length;a++){const o=t[a];if(e.isTerminal(o)){if(o!==r){i.add(o);break}}else if(n.get(o)?.terminals.forEach((e=>{i.add(e)})),!n.get(o).terminals.has(r))break;a===t.length-1&&i.add(r)}return{tocken:t.join(""),terminals:i}}class m{nonTerminals;terminals;currentLine=0;currentColumn=0;source="";constructor(e,t){this.nonTerminals=t,this.terminals=e}setSource(e){this.source=e,this.currentLine=0,this.currentColumn=0}remainString(){return this.source.slice(this.currentColumn)}next(){if(this.currentColumn===this.source.length)return{tocken:n,origin:n};for(let e of this.terminals){const t=this.source.slice(this.currentColumn).match(e[1]);if(t)return{tocken:e[0],origin:t[0]}}throw new Error(`[lexer next]: match next Terminal error \n sourecInput: ${this.source}\n remainString: ${this.source.slice(this.currentColumn)}`)}pop(){try{const e=this.next();return this.currentColumn+=e.origin.length,e}catch(e){throw e}}isTerminal(e){let t=!0;return this.nonTerminals.some((r=>r===e&&(t=!1,!0))),t}splitDerivation(e){const r=[];for(;e.length;){for(let t of this.nonTerminals){const n=e.match(new RegExp("^"+t));n&&(r.push(t),e=e.slice(n[0].length))}for(let n of this.terminals){const i=e.match(new RegExp("^"+t(n[0])));i&&(r.push(n[0]),e=e.slice(i[0].length))}}return o.log(r),r}}function c(t,n,i,a){const s=e(t,n),m=[],c=new Map;t.nonTerminals.forEach((e=>{const t={nonTerminal:e,terminal2Derivation:new Map};c.set(e,t),m.push(t)}));const f=new Map,h=new Map;for(let e of a)h.set(e.tocken,e);for(let e of i)f.set(e.tocken,e);return s.forEach((e=>{for(let n of e.derivations){const i=l(t,n,f),a=c.get(e.nonTerminal);o.log(i);for(let t of i.terminals){if(t===r)continue;let i=a?.terminal2Derivation.get(t);i||(i={nonTerminal:e.nonTerminal,derivations:[]},a?.terminal2Derivation.set(t,i)),i.derivations.push(n)}if(i.terminals.has(r))for(let t of h.get(e.nonTerminal).terminals){let r=a?.terminal2Derivation.get(t);r||(r={nonTerminal:e.nonTerminal,derivations:[]},a?.terminal2Derivation.set(t,r)),r.derivations.push(n)}}})),m}function f(e,t){for(let r of e.terminals){const e=r[0];t.forEach((t=>{const r=t.terminal2Derivation.get(e);if(r&&r.derivations.length>1)return!1}))}return!0}class h{lexer;textGrammers;constructor(e,t,r){this.lexer=new m(e,t),this.textGrammers=r}getFirstSet(){return s(this.lexer,this.textGrammers)}getFollowSet(t){return t||(t=this.getFirstSet()),function(t,i,a){o.log("[generateFllowSet start]"),a=a?Array.from(a):s(t,i);const l=e(t,i);o.log("[grammers after transferString2Grammers]",l);const m=new Array(...l.map((e=>({tocken:e.nonTerminal,terminals:new Set([n])})))),c=new Map;l.forEach((e=>{c.set(e.nonTerminal,e.derivations)})),m.push(...t.terminals.map((e=>({tocken:e[0],terminals:new Set([n]),isTerminal:!0}))));const f=new Map;for(let e of m)f.set(e.tocken,e);a.push(...t.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0}))));const h=new Map;for(let e of a)h.set(e.tocken,e);for(;;){let e=!1;if(l.forEach((t=>{for(let n of t.derivations)for(let t=n.length-2;t>=0;t--){const i=f.get(n[t]);for(let a=t+1;a<n.length;a++){const t=h.get(n[a]).terminals;for(let n of t)n!==r&&(i?.terminals.has(n)||(e=!0,i?.terminals.add(n)));if(!t.has(r))break}}})),l.forEach((t=>{const n=f.get(t.nonTerminal);for(let i of t.derivations)for(let t=i.length-1;t>=0;t--){const a=i[t],o=f.get(a);for(let t of n.terminals)t!==r&&(o?.terminals.has(t)||(e=!0,o?.terminals.add(t)));if(!h.get(a).terminals.has(r))break}})),!e)break}return m.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}(this.lexer,this.textGrammers,t)}getPredictTable(e,t){return e||(e=this.getFirstSet()),t||(t=this.getFollowSet(e)),c(this.lexer,this.textGrammers,e,t)}getPredictProcess(e,t,i){return i||(i=c(this.lexer,this.textGrammers,this.getFirstSet(),this.getFollowSet())),function(e,t,i,a){let s=i.replaceAll(/\s/g,"");const l=[];let m={parseStack:[n,a],remainingInput:i,parseAction:""};e.setSource(s);const c=new Map;for(t.forEach((e=>{c.set(e.nonTerminal,e)}));;){const t=m.parseStack[m.parseStack.length-1];if(e.isTerminal(t)){const r=e.next();if(t!==r.tocken)throw new Error(`[predict error] terminal match error tocken: ${t} stack: ${m.parseStack} remainingInput: ${e.remainString()}`);if(m.parseAction=`match ${r.tocken} ${r.origin}`,l.push(m),m=JSON.parse(JSON.stringify(m)),e.pop(),m.parseAction="",m.remainingInput=e.remainString(),m.parseStack.pop(),0===m.parseStack.length)break;continue}const n=e.next(),i=c.get(t).terminal2Derivation.get(n.tocken);if(1!==i.derivations.length)throw new Error(`[predict error] parse input fail \n terminal: ${n} \n  remainingInput: ${e.remainString()} \n grammer: ${i} `);m.parseAction=`Predict ${i.nonTerminal} => ${i.derivations[0].join(" ")}`,o.log("[predict State]",m),l.push(m),m=JSON.parse(JSON.stringify(m)),m.parseStack.pop(),m.parseStack.push(...i.derivations[0].filter((e=>e!==r)).reverse()),m.parseAction="",m.remainingInput=e.remainString()}return l}(this.lexer,i,e,t)}checkPredickTableIsValid(e){return f(this.lexer,e)}checkIsLL0(){return f(this.lexer,this.getPredictTable())}getFirstSetProgressive(){return function*(t,n){yield["1. 如果X式一个终结符号，那么FIRST(X) = X ","2. 如果 X => ε 是一个产生式，那么将e加人到 FIRST（X)中。","3. A => B0B1B2B3\n            i = 0\n            FIRST(Bi) - EmptyCharacter 加入到 FIRST(A)中\n            如果FIRST(B1)不含有EmptyCharacter退出循环\n            若B0 - B3均含有EmptyCharacter 将EmptyCharacter加入到FIRST(A)中\n        ","4. 去除所有终结符号的表项"],o.log("[generateFirstSet start]");const i=e(t,n);o.log("[grammers after transferString2Grammers]",i);const a=new Array(...i.map((e=>({tocken:e.nonTerminal,terminals:new Set})))),s=new Map;i.forEach((e=>{s.set(e.nonTerminal,e.derivations)})),a.push(...t.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0})))),yield{ruleIndex:0,result:a},a.forEach((e=>{if(!e.isTerminal)for(let t of s.get(e.tocken))1!==t.length||t[0]!==r||e.terminals.has(r)||e.terminals.add(r)})),yield{ruleIndex:1,result:a};const l=new Map;for(let e of a)l.set(e.tocken,e);for(;;){let e=!1;if(a.forEach((n=>{if(!n.isTerminal)for(let i of s.get(n.tocken))for(let a=0;a<i.length;a++){const s=i[a];if(t.isTerminal(s)){if(n.terminals.has(s)||(o.log(s),e=!0,n.terminals.add(s)),s!==r)break}else{const t=l.get(s);if(t.terminals.forEach((t=>{t!==r&&(n.terminals.has(t)||(e=!0,n.terminals.add(t)))})),!t.terminals.has(r))break}a===i.length-1&&n.terminals.add(r)}})),!e)break;yield{ruleIndex:2,result:a}}yield{ruleIndex:3,result:a.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}}(this.lexer,this.textGrammers)}getFollowSetProgressive(t){return t||(t=this.getFirstSet()),function*(t,i,a){yield["1. 将$放到FOLLOW(S)中","2. 如果存在一个产生式A => aBb ， 那么FIRST(b) 中除ε 之外的所有符号都在FOLLOW(B)中。attention: A => aBCd 那么把first(Cd)加入到Follow(B)中去","3.如果存在一个产生式 A => aB ， 或存在产生式 A => aBb 且FIRST(b) 包含 ε ，那么FOLLOW(A)中的所有符号都在FOLLOW(B)中。","4. 去除所有终结符号的表项"],o.log("[generateFllowSet start]"),a=a?Array.from(a):s(t,i);const l=e(t,i);o.log("[grammers after transferString2Grammers]",l);const m=new Array(...l.map((e=>({tocken:e.nonTerminal,terminals:new Set([n])})))),c=new Map;l.forEach((e=>{c.set(e.nonTerminal,e.derivations)})),m.push(...t.terminals.map((e=>({tocken:e[0],terminals:new Set([n]),isTerminal:!0})))),yield{ruleIndex:0,result:m};const f=new Map;for(let e of m)f.set(e.tocken,e);a.push(...t.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0}))));const h=new Map;for(let e of a)h.set(e.tocken,e);for(;;){let e=!1;if(l.forEach((t=>{for(let n of t.derivations)for(let t=n.length-2;t>=0;t--){const i=f.get(n[t]);for(let a=t+1;a<n.length;a++){const t=h.get(n[a]).terminals;for(let n of t)n!==r&&(i?.terminals.has(n)||(e=!0,i?.terminals.add(n)));if(!t.has(r))break}}})),e&&(yield{ruleIndex:1,result:m},e=!1),l.forEach((t=>{const n=f.get(t.nonTerminal);for(let i of t.derivations)for(let t=i.length-1;t>=0;t--){const a=i[t],o=f.get(a);for(let t of n.terminals)t!==r&&(o?.terminals.has(t)||(e=!0,o?.terminals.add(t)));if(!h.get(a).terminals.has(r))break}})),e&&(yield{ruleIndex:2,result:m}),!e)break}yield{ruleIndex:3,result:m.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}}(this.lexer,this.textGrammers,t)}getPredictTableProgressive(t,n){return t||(t=this.getFirstSet()),n||(n=this.getFollowSet(t)),function*(t,n,i,a){yield["1. 对 First(u) 中的所有终结符 a （不含 ε ），置 M[A, a] = A -> u","2. 若 First(u) 含 ε ，则对 Follow(A) 中的所有符号 a （可含 $ ），置 M[A, a] = A -> u"];const s=e(t,n),m=[],c=new Map;t.nonTerminals.forEach((e=>{const t={nonTerminal:e,terminal2Derivation:new Map};c.set(e,t),m.push(t)}));const f=new Map,h=new Map;for(let e of a)h.set(e.tocken,e);for(let e of i)f.set(e.tocken,e);for(let e of s)for(let n of e.derivations){const i=l(t,n,f),a=c.get(e.nonTerminal);o.log(i);for(let t of i.terminals){if(t===r)continue;let i=a?.terminal2Derivation.get(t);i||(i={nonTerminal:e.nonTerminal,derivations:[]},a?.terminal2Derivation.set(t,i)),i.derivations.push(n),yield{ruleIndex:0,result:m}}if(i.terminals.has(r))for(let t of h.get(e.nonTerminal).terminals){let r=a?.terminal2Derivation.get(t);r||(r={nonTerminal:e.nonTerminal,derivations:[]},a?.terminal2Derivation.set(t,r)),r.derivations.push(n),yield{ruleIndex:1,result:m}}}}(this.lexer,this.textGrammers,t,n)}}const g=/^[A-Z]'?/,u=/[a-z|\u0391-\u03C9]/;function p(e){const t=new Set,r=new Set;return e.forEach((e=>{const n=e.replaceAll(/\s/g,"").split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),i=n[0];t.add(i),n[1].split("|").filter((e=>e&&"|"!==e)).forEach((e=>{for(;e.length;){let n=null;if(n=e.match(g),n)t.add(n[0]),e=e.slice(n[0].length);else{if(n=e.match(u),!n)throw new Error(`[getTockFromSimpleGrammers error] cant recognize the character remaining: ${e}`);r.add(JSON.stringify([n[0],"^"+n[0]])),e=e.slice(n[0].length)}}}))})),{nonTerminals:Array.from(t).sort(((e,t)=>t.length-e.length)),terminals:Array.from(r).map((e=>{const t=JSON.parse(e);return t[1]=new RegExp(t[1]),t}))}}export{h as LL1Parser,p as getTockFromSimpleGrammers};
