function e(e,t){return t.map((e=>e.replaceAll(/\s/g,""))).map((t=>{const r=t.split(/(=>)|(->)/).filter((e=>"=>"!==e&&"->"!==e&&e)),n=r[1].split("|").filter((e=>e&&"|"!==e)).map((t=>e.splitDerivation(t)));return{nonTerminal:r[0],derivations:n}}))}function t(e){switch(e){case"+":case"*":case"(":case")":return`\\${e}`;default:return e}}const r="ε",n="$";var i;!function(e){e[e.Normal=0]="Normal",e[e.Warnning=1]="Warnning",e[e.Error=2]="Error",e[e.None=3]="None"}(i||(i={}));let o=i.Normal;o=i.Error;var s=new class{logLevel;logChannel;constructor(e=i.Normal,t=console){this.logLevel=e,this.logChannel=t}log(...e){this.logLevel<=i.Normal&&this.logChannel.log("[normal]",...e)}warn(...e){this.logLevel<=i.Warnning&&this.logChannel.warn("[warn]",...e)}error(...e){this.logLevel<=i.Error&&this.logChannel.error("[error]",...e)}logTo(e){this.logChannel=e}}(o);function a(t,n){s.log("[generateFirstSet start]");const i=e(t,n);s.log("[grammers after transferString2Grammers]",i);const o=new Array(...i.map((e=>({tocken:e.nonTerminal,terminals:new Set})))),a=new Map;i.forEach((e=>{a.set(e.nonTerminal,e.derivations)})),o.push(...t.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0})))),o.forEach((e=>{if(!e.isTerminal)for(let t of a.get(e.tocken))1!==t.length||t[0]!==r||e.terminals.has(r)||e.terminals.add(r)}));const l=new Map;for(let e of o)l.set(e.tocken,e);for(;;){let e=!1;if(o.forEach((n=>{if(!n.isTerminal)for(let i of a.get(n.tocken))for(let o=0;o<i.length;o++){const a=i[o];if(t.isTerminal(a)){if(n.terminals.has(a)||(s.log(a),e=!0,n.terminals.add(a)),a!==r)break}else{const t=l.get(a);if(t.terminals.forEach((t=>{t!==r&&(n.terminals.has(t)||(e=!0,n.terminals.add(t)))})),!t.terminals.has(r))break}o===i.length-1&&n.terminals.add(r)}})),!e)break}return o.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}function l(e,t,n){const i=new Set;for(let o=0;o<t.length;o++){const s=t[o];if(e.isTerminal(s)){if(s!==r){i.add(s);break}}else if(n.get(s)?.terminals.forEach((e=>{i.add(e)})),!n.get(s).terminals.has(r))break;o===t.length-1&&i.add(r)}return{tocken:t.join(""),terminals:i}}class c{nonTerminals;terminals;currentLine=0;currentColumn=0;source="";constructor(e,t){this.nonTerminals=t,this.terminals=e}setSource(e){this.source=e,this.currentLine=0,this.currentColumn=0}remainString(){return this.source.slice(this.currentColumn)}next(){if(this.currentColumn===this.source.length)return{tocken:n,origin:n};for(let e of this.terminals){const t=this.source.slice(this.currentColumn).match(e[1]);if(t)return{tocken:e[0],origin:t[0]}}throw new Error(`[lexer next]: match next Terminal error \n sourecInput: ${this.source}\n remainString: ${this.source.slice(this.currentColumn)}`)}pop(){try{const e=this.next();return this.currentColumn+=e.origin.length,e}catch(e){throw e}}isTerminal(e){let t=!0;return this.nonTerminals.some((r=>r===e&&(t=!1,!0))),t}splitDerivation(e){const r=[];for(;e.length;){for(let t of this.nonTerminals){const n=e.match(new RegExp("^"+t));n&&(r.push(t),e=e.slice(n[0].length))}for(let n of this.terminals){const i=e.match(new RegExp("^"+t(n[0])));i&&(r.push(n[0]),e=e.slice(i[0].length))}}return s.log(r),r}}function m(t,n,i,o){const a=e(t,n),c=[],m=new Map;t.nonTerminals.forEach((e=>{const t={nonTerminal:e,terminal2Derivation:new Map};m.set(e,t),c.push(t)}));const h=new Map,f=new Map;for(let e of o)f.set(e.tocken,e);for(let e of i)h.set(e.tocken,e);return a.forEach((e=>{for(let n of e.derivations){const i=l(t,n,h),o=m.get(e.nonTerminal);s.log(i);for(let t of i.terminals){if(t===r)continue;let i=o?.terminal2Derivation.get(t);i||(i={nonTerminal:e.nonTerminal,derivations:[]},o?.terminal2Derivation.set(t,i)),i.derivations.push(n)}if(i.terminals.has(r))for(let t of f.get(e.nonTerminal).terminals){let r=o?.terminal2Derivation.get(t);r||(r={nonTerminal:e.nonTerminal,derivations:[]},o?.terminal2Derivation.set(t,r)),r.derivations.push(n)}}})),c}function h(e,t){for(let r of e.terminals){const e=r[0];t.forEach((t=>{const r=t.terminal2Derivation.get(e);if(r&&r.derivations.length>1)return!1}))}return!0}class f{lexer;textGrammers;constructor(e,t,r){this.lexer=new c(e,t),this.textGrammers=r}getFirstSet(){return a(this.lexer,this.textGrammers)}getFollowSet(t){return function(t,i,o){s.log("[generateFllowSet start]"),o||(o=a(t,i));const l=e(t,i);s.log("[grammers after transferString2Grammers]",l);const c=new Array(...l.map((e=>({tocken:e.nonTerminal,terminals:new Set([n])})))),m=new Map;l.forEach((e=>{m.set(e.nonTerminal,e.derivations)})),c.push(...t.terminals.map((e=>({tocken:e[0],terminals:new Set([n]),isTerminal:!0}))));const h=new Map;for(let e of c)h.set(e.tocken,e);o.push(...t.terminals.map((e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0}))));const f=new Map;for(let e of o)f.set(e.tocken,e);for(;;){let e=!1;if(l.forEach((t=>{for(let n of t.derivations)for(let t=n.length-2;t>=0;t--){const i=h.get(n[t]);for(let o=t+1;o<n.length;o++){const t=f.get(n[o]).terminals;for(let n of t)n!==r&&(i?.terminals.has(n)||(e=!0,i?.terminals.add(n)));if(!t.has(r))break}}})),l.forEach((t=>{const n=h.get(t.nonTerminal);for(let i of t.derivations)for(let t=i.length-1;t>=0;t--){const o=i[t],s=h.get(o);for(let t of n.terminals)t!==r&&(s?.terminals.has(t)||(e=!0,s?.terminals.add(t)));if(!f.get(o).terminals.has(r))break}})),!e)break}return c.filter((e=>!e.isTerminal)).sort(((e,t)=>e.tocken<t.tocken?-1:1)).map((e=>(e.terminals=new Set(Array.from(e.terminals).sort(((e,t)=>e<t?-1:1))),e)))}(this.lexer,this.textGrammers,t)}getPredictTable(e,t){return e||(e=this.getFirstSet()),t||(t=this.getFollowSet(e)),m(this.lexer,this.textGrammers,e,t)}getPredictProcess(e,t,i){return i||(i=m(this.lexer,this.textGrammers,this.getFirstSet(),this.getFollowSet())),function(e,t,i,o){let a=i.replaceAll(/\s/g,"");const l=[];let c={parseStack:[n,o],remainingInput:i,parseAction:""};e.setSource(a);const m=new Map;for(t.forEach((e=>{m.set(e.nonTerminal,e)}));;){const t=c.parseStack[c.parseStack.length-1];if(e.isTerminal(t)){const r=e.next();if(t!==r.tocken)throw new Error(`[predict error] terminal match error tocken: ${t} stack: ${c.parseStack} remainingInput: ${e.remainString()}`);if(c.parseAction=`match ${r.tocken} ${r.origin}`,l.push(c),c=JSON.parse(JSON.stringify(c)),e.pop(),c.parseAction="",c.remainingInput=e.remainString(),c.parseStack.pop(),0===c.parseStack.length)break;continue}const n=e.next(),i=m.get(t).terminal2Derivation.get(n.tocken);if(1!==i.derivations.length)throw new Error(`[predict error] parse input fail \n terminal: ${n} \n  remainingInput: ${e.remainString()} \n grammer: ${i} `);c.parseAction=`Predict ${i.nonTerminal} => ${i.derivations[0].join(" ")}`,s.log("[predict State]",c),l.push(c),c=JSON.parse(JSON.stringify(c)),c.parseStack.pop(),c.parseStack.push(...i.derivations[0].filter((e=>e!==r)).reverse()),c.parseAction="",c.remainingInput=e.remainString()}return l}(this.lexer,i,e,t)}checkPredickTableIsValid(e){return h(this.lexer,e)}checkIsLL0(){return h(this.lexer,this.getPredictTable())}}export{f as LL0Parser};
