!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).index={})}(this,(function(e){"use strict";function t(e,t){return t.map((e=>e.replaceAll(/\s/g,""))).map((t=>{const n=t.split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),r=n[1].split("|").filter((e=>e&&"|"!==e)).map((t=>e.splitDerivation(t)));return{nonTerminal:n[0],derivations:r}}))}function n(e){switch(e){case"+":case"*":case"(":case")":return`\\${e}`;default:return e}}const r="ε",i="$";var o;!function(e){e[e.Normal=0]="Normal",e[e.Warnning=1]="Warnning",e[e.Error=2]="Error",e[e.None=3]="None"}(o||(o={}));let s=o.Normal;s=o.Error;var l=new class{logLevel;logChannel;constructor(e=o.Normal,t=console){this.logLevel=e,this.logChannel=t}log(...e){this.logLevel<=o.Normal&&this.logChannel.log("[normal]",...e)}warn(...e){this.logLevel<=o.Warnning&&this.logChannel.warn("[warn]",...e)}error(...e){this.logLevel<=o.Error&&this.logChannel.error("[error]",...e)}logTo(e){this.logChannel=e}}(s);function a(e,n){l.log("[generateFirstSet start]");const i=t(e,n);l.log("[grammers after transferString2Grammers]",i);const o=new Array(...i.map((e=>({tocken:e.nonTerminal,terminals:new Set})))),s=new Map;i.forEach((e=>{s.set(e.nonTerminal,e.derivations)})),o.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0})))),o.forEach((e=>{if(!e.isTerminal)for(let t of s.get(e.tocken))1!==t.length||t[0]!==r||e.terminals.has(r)||e.terminals.add(r)}));const a=new Map;for(let e of o)a.set(e.tocken,e);for(;;){let t=!1;if(o.forEach((n=>{if(!n.isTerminal)for(let i of s.get(n.tocken))for(let o=0;o<i.length;o++){const s=i[o];if(e.isTerminal(s)){if(n.terminals.has(s)||(l.log(s),t=!0,n.terminals.add(s)),s!==r)break}else{const e=a.get(s);if(e.terminals.forEach((e=>{e!==r&&(n.terminals.has(e)||(t=!0,n.terminals.add(e)))})),!e.terminals.has(r))break}o===i.length-1&&n.terminals.add(r)}})),!t)break}return o.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}function c(e,t,n){const i=new Set;for(let o=0;o<t.length;o++){const s=t[o];if(e.isTerminal(s)){if(s!==r){i.add(s);break}}else if(n.get(s)?.terminals.forEach((e=>{i.add(e)})),!n.get(s).terminals.has(r))break;o===t.length-1&&i.add(r)}return{tocken:t.join(""),terminals:i}}function m(e,n,o){l.log("[generateFllowSet start]"),o=o?Array.from(o):a(e,n);const s=t(e,n);l.log("[grammers after transferString2Grammers]",s);const c=new Array(...s.map((e=>({tocken:e.nonTerminal,terminals:new Set([i])})))),m=new Map;s.forEach((e=>{m.set(e.nonTerminal,e.derivations)})),c.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([i]),isTerminal:!0}))));const f=new Map;for(let e of c)f.set(e.tocken,e);o.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0}))));const h=new Map;for(let e of o)h.set(e.tocken,e);for(;;){let e=!1;if(s.forEach((t=>{for(let n of t.derivations)for(let t=n.length-2;t>=0;t--){const i=f.get(n[t]);for(let o=t+1;o<n.length;o++){const t=h.get(n[o]).terminals;for(let n of t)n!==r&&(i?.terminals.has(n)||(e=!0,i?.terminals.add(n)));if(!t.has(r))break}}})),s.forEach((t=>{const n=f.get(t.nonTerminal);for(let i of t.derivations)for(let t=i.length-1;t>=0;t--){const o=i[t],s=f.get(o);for(let t of n.terminals)t!==r&&(s?.terminals.has(t)||(e=!0,s?.terminals.add(t)));if(!h.get(o).terminals.has(r))break}})),!e)break}return c.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}class f{nonTerminals;terminals;currentLine=0;currentColumn=0;source="";constructor(e,t){this.nonTerminals=[...t],this.terminals=[...e]}setSource(e){this.source=e,this.currentLine=0,this.currentColumn=0}remainString(){return this.source.slice(this.currentColumn)}next(){if(this.currentColumn>=this.source.length)return{tocken:i,origin:i};for(let e of this.terminals){const t=this.source.slice(this.currentColumn).match(e[1]);if(t)return{tocken:e[0],origin:t[0]}}throw new Error(`[lexer next]: match next Terminal error \n sourecInput: ${this.source}\n remainString: ${this.source.slice(this.currentColumn)}`)}pop(){try{const e=this.next();return e.tocken!==i&&(this.currentColumn+=e.origin.length),e}catch(e){throw e}}nextNotEmptyTerminal(){for(;;){const e=this.next();if("whiteSpace"!==e.tocken)return e;this.currentColumn+=e.origin.length}}nextNotEmpty(e){const t=this.currentColumn;for(let t=0;t<e-1;t++)this.popNotEmptyTerminal();const n=this.nextNotEmptyTerminal();return this.currentColumn=t,n}popNotEmptyTerminal(){const e=this.nextNotEmptyTerminal();return e.tocken!==i&&(this.currentColumn+=e.origin.length),e}isTerminal(e){let t=!0;return this.nonTerminals.some((n=>n===e&&(t=!1,!0))),t}splitDerivation(e){const t=[];let r=0;const i=e;for(;e.length;){for(let n of this.nonTerminals){const r=e.match(new RegExp("^"+n));if(r){t.push(n),e=e.slice(r[0].length);break}}for(let r of this.terminals){const i=e.match(new RegExp("^"+n(r[0])));if(i){t.push(r[0]),e=e.slice(i[0].length);break}}if(r++,r>5e4)throw new Error(`[splitDerivation] error: excute over MAX_EXCUTE str: ${i}  remaining str: ${e} `)}return t}getNewNonTerminal(e){let t=e;for(;;)if(t+="'",-1===this.nonTerminals.indexOf(t))return this.nonTerminals.unshift(t),t}}function h(e,n,i,o){const s=t(e,n),a=[],m=new Map;e.nonTerminals.forEach((e=>{const t={nonTerminal:e,terminal2Derivation:new Map};m.set(e,t),a.push(t)}));const f=new Map,h=new Map;for(let e of o)h.set(e.tocken,e);for(let e of i)f.set(e.tocken,e);return s.forEach((t=>{for(let n of t.derivations){const i=c(e,n,f),o=m.get(t.nonTerminal);l.log(i);let s=new Map;for(let e of i.terminals){if(e===r)continue;let i=o?.terminal2Derivation.get(e);s.set(e,!0),i||(i={nonTerminal:t.nonTerminal,derivations:[]},o?.terminal2Derivation.set(e,i)),i.derivations.push(n)}if(i.terminals.has(r))for(let e of h.get(t.nonTerminal).terminals){if(s.has(e))continue;let r=o?.terminal2Derivation.get(e);r||(r={nonTerminal:t.nonTerminal,derivations:[]},o?.terminal2Derivation.set(e,r)),r.derivations.push(n)}}})),a}function g(e,t){for(let n of e.terminals){const e=n[0];t.forEach((t=>{const n=t.terminal2Derivation.get(e);if(n&&n.derivations.length>1)return!1}))}return!0}const p=/^[A-Z]'*/,u=/[a-z|\u0391-\u03C9]/;function d(e){const t=new Set,n=new Set;return e.forEach((e=>{const r=e.replaceAll(/\s/g,"").split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),i=r[0];t.add(i),r[1].split("|").filter((e=>e&&"|"!==e)).forEach((e=>{for(;e.length;){let r=null;if(r=e.match(p),r)t.add(r[0]),e=e.slice(r[0].length);else{if(r=e.match(u),!r)throw new Error(`[getTockFromSimpleGrammers error] cant recognize the character remaining: ${e}`);n.add(JSON.stringify([r[0],"^"+r[0]])),e=e.slice(r[0].length)}}}))})),{nonTerminals:Array.from(t).sort(((e,t)=>t.length-e.length)),terminals:Array.from(n).map((e=>{const t=JSON.parse(e);return t[1]=new RegExp(t[1]),t}))}}function T(e){e=e.sort(((e,t)=>e<t?-1:1));let t="";for(let n of e)t+=` ${k(n)}`;return t}function k(e){let t=`${e.nonTerminal} => `;for(let n=0;n<e.derivation.length;n++)n===e.matchPoint&&(n||(t+=" "),t+="· "),n===e.derivation.length-1?t+=`${e.derivation[n]}`:t+=`${e.derivation[n]} `;return t}function w(e,t,n){for(let r=0;r<e.length;r++){const i=e[r],o=i.derivation[i.matchPoint];if(n.isTerminal(o))continue;t.get(o)?.forEach((t=>{let n=!1;for(let r of e)if(r.nonTerminal===o&&0===r.matchPoint){if(r.derivation.length!==t.length)continue;let e=!0;for(let n=0;n<t.length;n++)if(r.derivation[n]!==t[n]){e=!1;break}if(e){n=!0;break}}n||e.push({nonTerminal:o,matchPoint:0,derivation:t})}))}}e.LL1Parser=class{lexer;textGrammers;constructor(e,t,n){this.lexer=new f(e,t),this.textGrammers=n}getFirstSet(){return a(this.lexer,this.textGrammers)}getFollowSet(e){return e||(e=this.getFirstSet()),m(this.lexer,this.textGrammers,e)}getPredictTable(e,t){return e||(e=this.getFirstSet()),t||(t=this.getFollowSet(e)),h(this.lexer,this.textGrammers,e,t)}getPredictProcess(e,t,n){return n||(n=h(this.lexer,this.textGrammers,this.getFirstSet(),this.getFollowSet())),function(e,t,n,o){let s=n.replaceAll(/\s/g,"");const a=[];let c={parseStack:[i,o],remainingInput:n,parseAction:""};e.setSource(s);const m=new Map;t.forEach((e=>{m.set(e.nonTerminal,e)}));try{for(;;){const t=c.parseStack[c.parseStack.length-1];if(e.isTerminal(t)){const n=e.next();if(t!==n.tocken)throw new Error(`[predict error] terminal match error tocken: ${t} stack: ${c.parseStack} remainingInput: ${e.remainString()}`);if(c.parseAction=`match ${n.tocken} ${n.origin}`,a.push(c),c=JSON.parse(JSON.stringify(c)),e.pop(),c.parseAction="",c.remainingInput=e.remainString(),c.parseStack.pop(),0===c.parseStack.length)break;continue}const n=e.next(),i=m.get(t).terminal2Derivation.get(n.tocken);if(1!==i.derivations.length)throw new Error(`[predict error] parse input fail \n terminal: ${n} \n  remainingInput: ${e.remainString()} \n grammer: ${i} `);c.parseAction=`Predict ${i.nonTerminal} => ${i.derivations[0].join(" ")}`,l.log("[predict State]",c),a.push(c),c=JSON.parse(JSON.stringify(c)),c.parseStack.pop(),c.parseStack.push(...i.derivations[0].filter((e=>e!==r)).reverse()),c.parseAction="",c.remainingInput=e.remainString()}}catch(e){return console.error(e),a}return a}(this.lexer,n,e,t)}checkPredickTableIsValid(e){return g(this.lexer,e)}checkIsLL0(){return g(this.lexer,this.getPredictTable())}getFirstSetProgressive(){return function*(e,n){yield["1. 如果X式一个终结符号，那么FIRST(X) = X ","2. 如果 X => ε 是一个产生式，那么将e加人到 FIRST（X)中。","3. A => B0B1B2B3\n            i = 0\n            FIRST(Bi) - EmptyCharacter 加入到 FIRST(A)中\n            如果FIRST(B1)不含有EmptyCharacter退出循环\n            若B0 - B3均含有EmptyCharacter 将EmptyCharacter加入到FIRST(A)中\n        ","4. 去除所有终结符号的表项"],l.log("[generateFirstSet start]");const i=t(e,n);l.log("[grammers after transferString2Grammers]",i);const o=new Array(...i.map((e=>({tocken:e.nonTerminal,terminals:new Set})))),s=new Map;i.forEach((e=>{s.set(e.nonTerminal,e.derivations)})),o.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0})))),yield{ruleIndex:0,result:o},o.forEach((e=>{if(!e.isTerminal)for(let t of s.get(e.tocken))1!==t.length||t[0]!==r||e.terminals.has(r)||e.terminals.add(r)})),yield{ruleIndex:1,result:o};const a=new Map;for(let e of o)a.set(e.tocken,e);for(;;){let t=!1;if(o.forEach((n=>{if(!n.isTerminal)for(let i of s.get(n.tocken))for(let o=0;o<i.length;o++){const s=i[o];if(e.isTerminal(s)){if(n.terminals.has(s)||(l.log(s),t=!0,n.terminals.add(s)),s!==r)break}else{const e=a.get(s);if(e.terminals.forEach((e=>{e!==r&&(n.terminals.has(e)||(t=!0,n.terminals.add(e)))})),!e.terminals.has(r))break}o===i.length-1&&n.terminals.add(r)}})),!t)break;yield{ruleIndex:2,result:o}}yield{ruleIndex:3,result:o.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}}(this.lexer,this.textGrammers)}getFollowSetProgressive(e){return e||(e=this.getFirstSet()),function*(e,n,o){yield["1. 将$放到FOLLOW(S)中","2. 如果存在一个产生式A => aBb ， 那么FIRST(b) 中除ε 之外的所有符号都在FOLLOW(B)中。attention: A => aBCd 那么把first(Cd)加入到Follow(B)中去","3.如果存在一个产生式 A => aB ， 或存在产生式 A => aBb 且FIRST(b) 包含 ε ，那么FOLLOW(A)中的所有符号都在FOLLOW(B)中。","4. 去除所有终结符号的表项"],l.log("[generateFllowSet start]"),o=o?Array.from(o):a(e,n);const s=t(e,n);l.log("[grammers after transferString2Grammers]",s);const c=new Array(...s.map((e=>({tocken:e.nonTerminal,terminals:new Set([i])})))),m=new Map;s.forEach((e=>{m.set(e.nonTerminal,e.derivations)})),c.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([i]),isTerminal:!0})))),yield{ruleIndex:0,result:c};const f=new Map;for(let e of c)f.set(e.tocken,e);o.push(...e.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0}))));const h=new Map;for(let e of o)h.set(e.tocken,e);for(;;){let e=!1;if(s.forEach((t=>{for(let n of t.derivations)for(let t=n.length-2;t>=0;t--){const i=f.get(n[t]);for(let o=t+1;o<n.length;o++){const t=h.get(n[o]).terminals;for(let n of t)n!==r&&(i?.terminals.has(n)||(e=!0,i?.terminals.add(n)));if(!t.has(r))break}}})),e&&(yield{ruleIndex:1,result:c},e=!1),s.forEach((t=>{const n=f.get(t.nonTerminal);for(let i of t.derivations)for(let t=i.length-1;t>=0;t--){const o=i[t],s=f.get(o);for(let t of n.terminals)t!==r&&(s?.terminals.has(t)||(e=!0,s?.terminals.add(t)));if(!h.get(o).terminals.has(r))break}})),e&&(yield{ruleIndex:2,result:c}),!e)break}yield{ruleIndex:3,result:c.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}}(this.lexer,this.textGrammers,e)}getPredictTableProgressive(e,n){return e||(e=this.getFirstSet()),n||(n=this.getFollowSet(e)),function*(e,n,i,o){yield["1. 对 First(u) 中的所有终结符 a （不含 ε ），置 M[A, a] = A -> u","2. 若 First(u) 含 ε ，则对 Follow(A) 中的所有符号 a （可含 $ ），置 M[A, a] = A -> u"];const s=t(e,n),a=[],m=new Map;e.nonTerminals.forEach((e=>{const t={nonTerminal:e,terminal2Derivation:new Map};m.set(e,t),a.push(t)}));const f=new Map,h=new Map;for(let e of o)h.set(e.tocken,e);for(let e of i)f.set(e.tocken,e);for(let t of s)for(let n of t.derivations){const i=c(e,n,f),o=m.get(t.nonTerminal);l.log(i);for(let e of i.terminals){if(e===r)continue;let i=o?.terminal2Derivation.get(e);i||(i={nonTerminal:t.nonTerminal,derivations:[]},o?.terminal2Derivation.set(e,i)),i.derivations.push(n),yield{ruleIndex:0,result:a}}if(i.terminals.has(r))for(let e of h.get(t.nonTerminal).terminals){let r=o?.terminal2Derivation.get(e);r||(r={nonTerminal:t.nonTerminal,derivations:[]},o?.terminal2Derivation.set(e,r)),r.derivations.push(n),yield{ruleIndex:1,result:a}}}}(this.lexer,this.textGrammers,e,n)}},e.LRParser=class{initialStateNode;allStateNodesMap;lexer;grammers;constructor(){this.initialStateNode=null}generateState(e,t,n,r){if(!n||!r){const t=d(e);n=t.nonTerminals,r=t.terminals}const o="Augument_S";l.log("[nonTerminals]",n),l.log("[terminals]",r),this.grammers=e,this.lexer=new f(r,n);const s=new Map;for(let t of e){t=t.replaceAll(/\s/g,"");const e=t.split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),n=e[0],r=e[1].split("|").filter((e=>e)).map((e=>this.lexer.splitDerivation(e)));s.set(n,r)}l.log(s),this.initialStateNode={id:0,items:[{nonTerminal:o,derivation:[t],matchPoint:0}],edges:[]},w(this.initialStateNode.items,s,this.lexer);const a=new Map;this.allStateNodesMap=a,a.set(T(this.initialStateNode.items),this.initialStateNode);const c=[];let m=0;for(;a.size!=m;){m=a.size;for(let e of a.values())if(!c[e.id]){c[e.id]=!0;for(let t of e.items)t.nonTerminal===o&&1===t.matchPoint&&e.edges.push({tocken:i,next:{id:-1,items:[],edges:[]}});for(let t of n){let n=[];for(let r of e.items)r.derivation.length!==r.matchPoint&&r.derivation[r.matchPoint]===t&&n.push({nonTerminal:r.nonTerminal,derivation:r.derivation,matchPoint:r.matchPoint+1});if(!n.length)continue;w(n,s,this.lexer);const r=T(n);a.has(r)||a.set(r,{id:a.size,items:n,edges:[]}),e.edges.push({tocken:t,next:a.get(r)})}for(let t of r){let n=[];for(let r of e.items)r.derivation.length!==r.matchPoint&&r.derivation[r.matchPoint]===t[0]&&n.push({nonTerminal:r.nonTerminal,derivation:r.derivation,matchPoint:r.matchPoint+1});if(!n.length)continue;w(n,s,this.lexer);const r=T(n);a.has(r)||a.set(r,{id:a.size,items:n,edges:[]}),e.edges.push({tocken:t[0],next:a.get(r)})}}}}predictInput(e,t){if(!this.lexer)throw new Error("[generatePredictTable] must call generateState before generatePredictTable");let n=[];for(e=e.replaceAll(/\s/g,""),n.push({stack:[0],symbols:[],input:[...this.lexer.splitDerivation(e),i]});;){const e=n[n.length-1],r=JSON.parse(JSON.stringify(e)),i=t[e.stack[e.stack.length-1]].action.get(e.input[0]);if(i.length>1)throw new Error(`move collision ${i}`);if(!i.length)throw new Error(`move is empty ${i}`);let o=i[0];if("acc"===o){e.move="接受";break}if(o.startsWith("S"))e.move=`移入${e.input[0]}`,r.symbols.push(r.input.shift()),r.stack.push(Number(o.slice(1)));else{e.move=`根据${o}归约`;const n=o.slice(2,-1).replaceAll(/\s/g,""),i=n.split("=>")[0],s=this.lexer.splitDerivation(n.split("=>")[1]);for(let e=0;e<s.length;e++)r.stack.pop(),r.symbols.pop();r.symbols.push(i);const l=t[e.stack[r.stack.length-1]];r.stack.push(l.goto.get(i)[0])}n.push(r)}return n}generateLR0PredictTable(){if(!this.initialStateNode||!this.allStateNodesMap||!this.lexer)throw new Error("[generatePredictTable] must call generateState before generatePredictTable");const e=[];for(let t of this.allStateNodesMap.values()){let n={id:t.id,action:new Map,goto:new Map};for(let e of this.lexer.nonTerminals)n.goto.set(e,[]);for(let e of this.lexer.terminals)n.action.set(e[0],[]);n.action.set(i,[]);for(let e of t.edges)e.tocken!==i?this.lexer.isTerminal(e.tocken)?n.action.get(e.tocken).push(`S${e.next.id}`):n.goto.get(e.tocken).push(e.next.id):n.action.get(e.tocken).push("acc");for(let e of t.items)if(e.matchPoint===e.derivation.length)for(let t of this.lexer.terminals)n.action.get(t[0]).push(`r(${e.nonTerminal} => ${e.derivation.join(" ")})`);e.push(n)}return e.sort(((e,t)=>e.id-t.id)),e}generateSLR1PredictTable(){if(!(this.initialStateNode&&this.allStateNodesMap&&this.lexer&&this.grammers))throw new Error("[generatePredictTable] must call generateState before generatePredictTable");const e=m(this.lexer,this.grammers),t=[];for(let n of this.allStateNodesMap.values()){let r={id:n.id,action:new Map,goto:new Map};for(let e of this.lexer.nonTerminals)r.goto.set(e,[]);for(let e of this.lexer.terminals)r.action.set(e[0],[]);r.action.set(i,[]);for(let e of n.edges)e.tocken!==i?this.lexer.isTerminal(e.tocken)?r.action.get(e.tocken).push(`S${e.next.id}`):r.goto.get(e.tocken).push(e.next.id):r.action.get(e.tocken).push("acc");for(let t of n.items)if(t.matchPoint===t.derivation.length){let n=[];for(let r of e)if(r.tocken===t.nonTerminal){n=[...r.terminals.values()];break}for(let e of n)r.action.get(e[0]).push(`r(${t.nonTerminal} => ${t.derivation.join(" ")})`)}t.push(r)}return t.sort(((e,t)=>e.id-t.id)),t}get stateGraph(){const e=[],t=n=>{if(e[n.id])return e[n.id];const r={};e[n.id]=r,r.id=n.id,r.items=n.items.map((e=>k(e))),r.edges=[];for(let e of n.edges)r.edges.push({tocken:e.tocken,next:t(e.next)});return r};return t(this.initialStateNode)}},e.Lexer=f,e.checkNeedClearRightRecursion=function(e,t,n){if(!t||!n){const r=d(e);t=r.nonTerminals,n=r.terminals}l.log("[nonTerminals]",t),l.log("[terminals]",n);let r=new f(n,t);const i=new Map;for(let t of e){t=t.replaceAll(/\s/g,"");const e=t.split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),n=e[0],o=e[1].split("|").filter((e=>e)).map((e=>r.splitDerivation(e)));i.set(n,o)}l.log("[nonTerminals2DerivationMap]",i);for(let e=0;e<t.length;e++){const n=i.get(t[e]);for(let r=n.length-1;r>=0;r--){if(n[r][0]===t[e])return!0}}return!1},e.checkNeedliftUpCommonTocken=function(e,t,n){let r=e;if(!t||!n){const r=d(e);t=r.nonTerminals,n=r.terminals}let i=new f(n,t);for(let e of r){e=e.replaceAll(/\s/g,"");const t=e.split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e))[1].split("|").filter((e=>e)).map((e=>(l.log("[debug]",r),i.splitDerivation(e)))),n=new Map;t.forEach((e=>{let t=n.get(e[0]);t?t.push(e.slice(1)):t=[e.slice(1)],n.set(e[0],t)}));for(let e of n.keys())if(1!==n.get(e)?.length)return!0}return!1},e.checkNeedunionGrammers=function(e){let t=new Map;for(let n of e){n=n.replaceAll(/\s/g,"");const e=n.split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),r=e[0],i=e[1];if(t.has(r))return!0;t.set(r,[i])}return!1},e.clearRightRecursion=function(e,t,n){const i=[];if(!t||!n){const r=d(e);t=r.nonTerminals,n=r.terminals}l.log("[nonTerminals]",t),l.log("[terminals]",n);let o=new f(n,t);const s=new Map;for(let t of e){t=t.replaceAll(/\s/g,"");const e=t.split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),n=e[0],r=e[1].split("|").filter((e=>e)).map((e=>o.splitDerivation(e)));s.set(n,r)}l.log("[nonTerminals2DerivationMap]",s);for(let e=0;e<t.length;e++){const n=s.get(t[e]);for(let r=0;r<e;r++){const e=s.get(t[r]);for(let i=n.length-1;i>=0;i--){const o=n[i];if(o[0]===t[r]){l.log(o,t[r]);for(let t of e)l.log("[-]",t),n?.push([...t,...o.slice(1)]);n?.splice(i,1)}}}const i=[];for(let r=n.length-1;r>=0;r--){n[r][0]===t[e]&&i.push(r)}if(i.length){const l=o.getNewNonTerminal(t[e]),a=[],c=[];for(let e=n.length-1;e>=0;e--)-1===i.indexOf(e)&&a.push([...n[e][0]===r?n[e].slice(1):n[e],l]);for(let e of i)c.push([...n[e].slice(1),l]);c.push([r]),s.set(t[e],[...a,...i.length?[]:n]),s.set(l,c)}l.log("[nonTerminals2DerivationMap in process]",s,n)}for(let e of s.keys()){const t=s.get(e).map((e=>e.join(" "))).join(" | ");i.push(`${e} => ${t}`)}return i},e.getTockFromSimpleGrammers=d,e.liftUpCommonTocken=function(e,t,n){let r=e;if(!t||!n){const r=d(e);t=r.nonTerminals,n=r.terminals}let i=new f(n,t);for(;;){let e=[];const t=r.map((t=>{const n=(t=t.replaceAll(/\s/g,"")).split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),o=n[0],s=n[1].split("|").filter((e=>e)).map((e=>(l.log("[debug]",r),i.splitDerivation(e)))),a=[],c=new Map;s.forEach((e=>{let t=c.get(e[0]);t?t.push(e.slice(1)):t=[e.slice(1)],c.set(e[0],t)}));for(let t of c.keys()){if(1===c.get(t)?.length){a.push(t+c.get(t)[0].join(""));continue}const n=c.get(t),r=i.getNewNonTerminal(o);a.push(t+r),e.push(r+" => "+n?.map((e=>e.join(" "))).join(" | "))}return o+" => "+a.join(" | ")}));l.log("[pre]",t,e);const n=[...t,...e];if(l.log("[com]",r,n),r.length===n.length)break;r=n}return r},e.unionGrammers=function(e,t,n){let r=new Map;const i=[];if(!t||!n){const r=d(e);t=r.nonTerminals,n=r.terminals}let o=new f(n,t);e.forEach((e=>{const t=(e=e.replaceAll(/\s/g,"")).split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),n=t[0],s=t[1].split("|").filter((e=>e)).map((e=>(l.log("[debug]",i),o.splitDerivation(e))));if(r.has(n)){const e=r.get(n);s.forEach((t=>{const n=t.join(" ");-1===e?.indexOf(n)&&e.push(n)}))}else r.set(n,s.map((e=>e.join(" "))))}));for(let e of r.keys()){const t=[...new Set(r.get(e))];i.push(`${e} => ${t.join("|")}`.split("|").join(" | "))}return l.log(i),i}}));
