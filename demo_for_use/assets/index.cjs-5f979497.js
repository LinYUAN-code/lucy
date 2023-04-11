var B=Object.defineProperty;var J=(o,t,r)=>t in o?B(o,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):o[t]=r;var S=(o,t,r)=>(J(o,typeof t!="symbol"?t+"":t,r),r);var x={};function M(o,t){return t.map(r=>r.replaceAll(/\s/g,"")).map(r=>{const n=r.split(/(=>)|(->)/).filter(a=>a!=="=>"&&a!=="->"&&a),l=n[1].split("|").filter(a=>a&&a!=="|").map(a=>o.splitDerivation(a));return{nonTerminal:n[0],derivations:l}})}function W(o){switch(o){case"+":case"*":case"(":case")":return`\\${o}`;default:return o}}const d="ε",w="$";var b;(function(o){o[o.Normal=0]="Normal",o[o.Warnning=1]="Warnning",o[o.Error=2]="Error",o[o.None=3]="None"})(b||(b={}));let G=b.Normal;G=b.Error;var T=new class{constructor(o=b.Normal,t=console){S(this,"logLevel");S(this,"logChannel");this.logLevel=o,this.logChannel=t}log(...o){this.logLevel<=b.Normal&&this.logChannel.log("[normal]",...o)}warn(...o){this.logLevel<=b.Warnning&&this.logChannel.warn("[warn]",...o)}error(...o){this.logLevel<=b.Error&&this.logChannel.error("[error]",...o)}logTo(o){this.logChannel=o}}(G);function C(o,t){T.log("[generateFirstSet start]");const r=M(o,t);T.log("[grammers after transferString2Grammers]",r);const n=new Array(...r.map(e=>({tocken:e.nonTerminal,terminals:new Set}))),l=new Map;r.forEach(e=>{l.set(e.nonTerminal,e.derivations)}),n.push(...o.terminals.map(e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0}))),n.forEach(e=>{if(!e.isTerminal)for(let s of l.get(e.tocken))s.length!==1||s[0]!==d||e.terminals.has(d)||e.terminals.add(d)});const a=new Map;for(let e of n)a.set(e.tocken,e);for(;;){let e=!1;if(n.forEach(s=>{if(!s.isTerminal)for(let f of l.get(s.tocken))for(let i=0;i<f.length;i++){const c=f[i];if(o.isTerminal(c)){if(s.terminals.has(c)||(T.log(c),e=!0,s.terminals.add(c)),c!==d)break}else{const h=a.get(c);if(h.terminals.forEach(m=>{m!==d&&(s.terminals.has(m)||(e=!0,s.terminals.add(m)))}),!h.terminals.has(d))break}i===f.length-1&&s.terminals.add(d)}}),!e)break}return n.filter(e=>!e.isTerminal).sort((e,s)=>e.tocken<s.tocken?-1:1).map(e=>(e.terminals=new Set(Array.from(e.terminals).sort((s,f)=>s<f?-1:1)),e))}function R(o,t,r){var l;const n=new Set;for(let a=0;a<t.length;a++){const e=t[a];if(o.isTerminal(e)){if(e!==d){n.add(e);break}}else if((l=r.get(e))==null||l.terminals.forEach(s=>{n.add(s)}),!r.get(e).terminals.has(d))break;a===t.length-1&&n.add(d)}return{tocken:t.join(""),terminals:n}}function D(o,t,r){T.log("[generateFllowSet start]"),r=r?Array.from(r):C(o,t);const n=M(o,t);T.log("[grammers after transferString2Grammers]",n);const l=new Array(...n.map(f=>({tocken:f.nonTerminal,terminals:new Set([w])}))),a=new Map;n.forEach(f=>{a.set(f.nonTerminal,f.derivations)}),l.push(...o.terminals.map(f=>({tocken:f[0],terminals:new Set([w]),isTerminal:!0})));const e=new Map;for(let f of l)e.set(f.tocken,f);r.push(...o.terminals.map(f=>({tocken:f[0],terminals:new Set([f[0]]),isTerminal:!0})));const s=new Map;for(let f of r)s.set(f.tocken,f);for(;;){let f=!1;if(n.forEach(i=>{for(let c of i.derivations)for(let h=c.length-2;h>=0;h--){const m=e.get(c[h]);for(let p=h+1;p<c.length;p++){const u=s.get(c[p]).terminals;for(let g of u)g!==d&&(m!=null&&m.terminals.has(g)||(f=!0,m==null||m.terminals.add(g)));if(!u.has(d))break}}}),n.forEach(i=>{const c=e.get(i.nonTerminal);for(let h of i.derivations)for(let m=h.length-1;m>=0;m--){const p=h[m],u=e.get(p);for(let g of c.terminals)g!==d&&(u!=null&&u.terminals.has(g)||(f=!0,u==null||u.terminals.add(g)));if(!s.get(p).terminals.has(d))break}}),!f)break}return l.filter(f=>!f.isTerminal).sort((f,i)=>f.tocken<i.tocken?-1:1).map(f=>(f.terminals=new Set(Array.from(f.terminals).sort((i,c)=>i<c?-1:1)),f))}class y{constructor(t,r){S(this,"nonTerminals");S(this,"terminals");S(this,"currentLine",0);S(this,"currentColumn",0);S(this,"source","");this.nonTerminals=[...r],this.terminals=[...t]}setSource(t){this.source=t,this.currentLine=0,this.currentColumn=0}remainString(){return this.source.slice(this.currentColumn)}next(){if(this.currentColumn>=this.source.length)return{tocken:w,origin:w};for(let t of this.terminals){const r=this.source.slice(this.currentColumn).match(t[1]);if(r)return{tocken:t[0],origin:r[0]}}throw new Error(`[lexer next]: match next Terminal error 
 sourecInput: ${this.source}
 remainString: ${this.source.slice(this.currentColumn)}`)}pop(){try{const t=this.next();return t.tocken!==w&&(this.currentColumn+=t.origin.length),t}catch(t){throw t}}nextNotEmptyTerminal(){for(;;){const t=this.next();if(t.tocken!=="whiteSpace")return t;this.currentColumn+=t.origin.length}}nextNotEmpty(t){const r=this.currentColumn;for(let l=0;l<t-1;l++)this.popNotEmptyTerminal();const n=this.nextNotEmptyTerminal();return this.currentColumn=r,n}popNotEmptyTerminal(){const t=this.nextNotEmptyTerminal();return t.tocken!==w&&(this.currentColumn+=t.origin.length),t}isTerminal(t){let r=!0;return this.nonTerminals.some(n=>n===t&&(r=!1,!0)),r}splitDerivation(t){const r=[];let n=0;const l=t;for(;t.length;){for(let a of this.nonTerminals){const e=t.match(new RegExp("^"+a));if(e){r.push(a),t=t.slice(e[0].length);break}}for(let a of this.terminals){const e=t.match(new RegExp("^"+W(a[0])));if(e){r.push(a[0]),t=t.slice(e[0].length);break}}if(n++,n>5e4)throw new Error(`[splitDerivation] error: excute over MAX_EXCUTE str: ${l}  remaining str: ${t} `)}return r}getNewNonTerminal(t){let r=t;for(;;)if(r+="'",this.nonTerminals.indexOf(r)===-1)return this.nonTerminals.unshift(r),r}}function L(o,t,r,n){const l=M(o,t),a=[],e=new Map;o.nonTerminals.forEach(i=>{const c={nonTerminal:i,terminal2Derivation:new Map};e.set(i,c),a.push(c)});const s=new Map,f=new Map;for(let i of n)f.set(i.tocken,i);for(let i of r)s.set(i.tocken,i);return l.forEach(i=>{for(let c of i.derivations){const h=R(o,c,s),m=e.get(i.nonTerminal);T.log(h);let p=new Map;for(let u of h.terminals){if(u===d)continue;let g=m==null?void 0:m.terminal2Derivation.get(u);p.set(u,!0),g||(g={nonTerminal:i.nonTerminal,derivations:[]},m==null||m.terminal2Derivation.set(u,g)),g.derivations.push(c)}if(h.terminals.has(d))for(let u of f.get(i.nonTerminal).terminals){if(p.has(u))continue;let g=m==null?void 0:m.terminal2Derivation.get(u);g||(g={nonTerminal:i.nonTerminal,derivations:[]},m==null||m.terminal2Derivation.set(u,g)),g.derivations.push(c)}}}),a}function O(o,t){for(let r of o.terminals){const n=r[0];t.forEach(l=>{const a=l.terminal2Derivation.get(n);if(a&&a.derivations.length>1)return!1})}return!0}const X=/^[A-Z]'*/,z=/[a-z|\u0391-\u03C9]/;function N(o){const t=new Set,r=new Set;return o.forEach(n=>{const l=n.replaceAll(/\s/g,"").split(/(=>)|(->)/).filter(e=>e!=="=>"&&e!=="->"&&e),a=l[0];t.add(a),l[1].split("|").filter(e=>e&&e!=="|").forEach(e=>{for(;e.length;){let s=null;if(s=e.match(X),s)t.add(s[0]),e=e.slice(s[0].length);else{if(s=e.match(z),!s)throw new Error(`[getTockFromSimpleGrammers error] cant recognize the character remaining: ${e}`);r.add(JSON.stringify([s[0],"^"+s[0]])),e=e.slice(s[0].length)}}})}),{nonTerminals:Array.from(t).sort((n,l)=>l.length-n.length),terminals:Array.from(r).map(n=>{const l=JSON.parse(n);return l[1]=new RegExp(l[1]),l})}}function P(o){o=o.sort((r,n)=>r<n?-1:1);let t="";for(let r of o)t+=` ${j(r)}`;return t}function j(o){let t=`${o.nonTerminal} => `;for(let r=0;r<o.derivation.length;r++)r===o.matchPoint&&(r||(t+=" "),t+="· "),r===o.derivation.length-1?t+=`${o.derivation[r]}`:t+=`${o.derivation[r]} `;return t}function F(o,t,r){var n;for(let l=0;l<o.length;l++){const a=o[l],e=a.derivation[a.matchPoint];r.isTerminal(e)||(n=t.get(e))==null||n.forEach(s=>{let f=!1;for(let i of o)if(i.nonTerminal===e&&i.matchPoint===0){if(i.derivation.length!==s.length)continue;let c=!0;for(let h=0;h<s.length;h++)if(i.derivation[h]!==s[h]){c=!1;break}if(c){f=!0;break}}f||o.push({nonTerminal:e,matchPoint:0,derivation:s})})}}x.LL1Parser=class{constructor(o,t,r){S(this,"lexer");S(this,"textGrammers");this.lexer=new y(o,t),this.textGrammers=r}getFirstSet(){return C(this.lexer,this.textGrammers)}getFollowSet(o){return o||(o=this.getFirstSet()),D(this.lexer,this.textGrammers,o)}getPredictTable(o,t){return o||(o=this.getFirstSet()),t||(t=this.getFollowSet(o)),L(this.lexer,this.textGrammers,o,t)}getPredictProcess(o,t,r){if(r||(r=L(this.lexer,this.textGrammers,this.getFirstSet(),this.getFollowSet())),!this.lexer.nonTerminals.some(n=>t===n))throw new Error("1");return function(n,l,a,e){var u;let s=a.replaceAll(/\s/g,"");const f=[];let i=1;const c={id:0,text:e,check:!1},h=[c];let m={parseStack:[w,e],remainingInput:a,parseAction:""};n.setSource(s);const p=new Map;l.forEach(g=>{p.set(g.nonTerminal,g)});try{for(;;){const g=m.parseStack[m.parseStack.length-1];if(n.isTerminal(g)){const E=n.next();if(g!==E.tocken)throw new Error(`[predict error] terminal match error tocken: ${g} stack: ${m.parseStack} remainingInput: ${n.remainString()}`);{if(m.parseAction=`match ${E.tocken} ${E.origin}`,f.push(m),m=JSON.parse(JSON.stringify(m)),n.pop(),m.parseAction="",m.remainingInput=n.remainString(),m.parseStack.pop(),m.parseStack.length===0)break;const $=h.pop();$.children||($.children=[]),$.children.push({id:i++,text:E.origin,check:!1})}continue}const k=n.next(),v=p.get(g).terminal2Derivation.get(k.tocken);if(((u=v==null?void 0:v.derivations)==null?void 0:u.length)!==1)throw new Error(`[predict error] parse input fail 
 terminal: ${k} 
  remainingInput: ${n.remainString()} 
 grammer: ${v} `);m.parseAction=`Predict ${v.nonTerminal} => ${v.derivations[0].join(" ")}`,T.log("[predict State]",m),f.push(m),m=JSON.parse(JSON.stringify(m)),m.parseStack.pop();const A=h.pop(),I=v.derivations[0].filter(E=>E!==d);A.children||(A.children=[]);for(let E of I)A.children.push({id:i++,text:E,check:!1});h.push(...[...A.children].reverse()),m.parseStack.push(...I.reverse()),m.parseAction="",m.remainingInput=n.remainString()}}catch(g){throw g.value=f,g}return f.astNode=c,f}(this.lexer,r,o,t)}checkPredickTableIsValid(o){return O(this.lexer,o)}checkIsLL0(){return O(this.lexer,this.getPredictTable())}getFirstSetProgressive(){return function*(o,t){yield["1. 如果X式一个终结符号，那么FIRST(X) = X ","2. 如果 X => ε 是一个产生式，那么将e加人到 FIRST（X)中。",`3. A => B0B1B2B3
            i = 0
            FIRST(Bi) - EmptyCharacter 加入到 FIRST(A)中
            如果FIRST(B1)不含有EmptyCharacter退出循环
            若B0 - B3均含有EmptyCharacter 将EmptyCharacter加入到FIRST(A)中
        `,"4. 去除所有终结符号的表项"],T.log("[generateFirstSet start]");const r=M(o,t);T.log("[grammers after transferString2Grammers]",r);const n=new Array(...r.map(e=>({tocken:e.nonTerminal,terminals:new Set}))),l=new Map;r.forEach(e=>{l.set(e.nonTerminal,e.derivations)}),n.push(...o.terminals.map(e=>({tocken:e[0],terminals:new Set([e[0]]),isTerminal:!0}))),yield{ruleIndex:0,result:n},n.forEach(e=>{if(!e.isTerminal)for(let s of l.get(e.tocken))s.length!==1||s[0]!==d||e.terminals.has(d)||e.terminals.add(d)}),yield{ruleIndex:1,result:n};const a=new Map;for(let e of n)a.set(e.tocken,e);for(;;){let e=!1;if(n.forEach(s=>{if(!s.isTerminal)for(let f of l.get(s.tocken))for(let i=0;i<f.length;i++){const c=f[i];if(o.isTerminal(c)){if(s.terminals.has(c)||(T.log(c),e=!0,s.terminals.add(c)),c!==d)break}else{const h=a.get(c);if(h.terminals.forEach(m=>{m!==d&&(s.terminals.has(m)||(e=!0,s.terminals.add(m)))}),!h.terminals.has(d))break}i===f.length-1&&s.terminals.add(d)}}),!e)break;yield{ruleIndex:2,result:n}}yield{ruleIndex:3,result:n.filter(e=>!e.isTerminal).sort((e,s)=>e.tocken<s.tocken?-1:1).map(e=>(e.terminals=new Set(Array.from(e.terminals).sort((s,f)=>s<f?-1:1)),e))}}(this.lexer,this.textGrammers)}getFollowSetProgressive(o){return o||(o=this.getFirstSet()),function*(t,r,n){yield["1. 将$放到FOLLOW(S)中","2. 如果存在一个产生式A => aBb ， 那么FIRST(b) 中除ε 之外的所有符号都在FOLLOW(B)中。attention: A => aBCd 那么把first(Cd)加入到Follow(B)中去","3.如果存在一个产生式 A => aB ， 或存在产生式 A => aBb 且FIRST(b) 包含 ε ，那么FOLLOW(A)中的所有符号都在FOLLOW(B)中。","4. 去除所有终结符号的表项"],T.log("[generateFllowSet start]"),n=n?Array.from(n):C(t,r);const l=M(t,r);T.log("[grammers after transferString2Grammers]",l);const a=new Array(...l.map(i=>({tocken:i.nonTerminal,terminals:new Set([w])}))),e=new Map;l.forEach(i=>{e.set(i.nonTerminal,i.derivations)}),a.push(...t.terminals.map(i=>({tocken:i[0],terminals:new Set([w]),isTerminal:!0}))),yield{ruleIndex:0,result:a};const s=new Map;for(let i of a)s.set(i.tocken,i);n.push(...t.terminals.map(i=>({tocken:i[0],terminals:new Set([i[0]]),isTerminal:!0})));const f=new Map;for(let i of n)f.set(i.tocken,i);for(;;){let i=!1;if(l.forEach(c=>{for(let h of c.derivations)for(let m=h.length-2;m>=0;m--){const p=s.get(h[m]);for(let u=m+1;u<h.length;u++){const g=f.get(h[u]).terminals;for(let k of g)k!==d&&(p!=null&&p.terminals.has(k)||(i=!0,p==null||p.terminals.add(k)));if(!g.has(d))break}}}),i&&(yield{ruleIndex:1,result:a},i=!1),l.forEach(c=>{const h=s.get(c.nonTerminal);for(let m of c.derivations)for(let p=m.length-1;p>=0;p--){const u=m[p],g=s.get(u);for(let k of h.terminals)k!==d&&(g!=null&&g.terminals.has(k)||(i=!0,g==null||g.terminals.add(k)));if(!f.get(u).terminals.has(d))break}}),i&&(yield{ruleIndex:2,result:a}),!i)break}yield{ruleIndex:3,result:a.filter(i=>!i.isTerminal).sort((i,c)=>i.tocken<c.tocken?-1:1).map(i=>(i.terminals=new Set(Array.from(i.terminals).sort((c,h)=>c<h?-1:1)),i))}}(this.lexer,this.textGrammers,o)}getPredictTableProgressive(o,t){return o||(o=this.getFirstSet()),t||(t=this.getFollowSet(o)),function*(r,n,l,a){yield["1. 对 First(u) 中的所有终结符 a （不含 ε ），置 M[A, a] = A -> u","2. 若 First(u) 含 ε ，则对 Follow(A) 中的所有符号 a （可含 $ ），置 M[A, a] = A -> u"];const e=M(r,n),s=[],f=new Map;r.nonTerminals.forEach(h=>{const m={nonTerminal:h,terminal2Derivation:new Map};f.set(h,m),s.push(m)});const i=new Map,c=new Map;for(let h of a)c.set(h.tocken,h);for(let h of l)i.set(h.tocken,h);for(let h of e)for(let m of h.derivations){const p=R(r,m,i),u=f.get(h.nonTerminal);T.log(p);for(let g of p.terminals){if(g===d)continue;let k=u==null?void 0:u.terminal2Derivation.get(g);k||(k={nonTerminal:h.nonTerminal,derivations:[]},u==null||u.terminal2Derivation.set(g,k)),k.derivations.push(m),yield{ruleIndex:0,result:s}}if(p.terminals.has(d))for(let g of c.get(h.nonTerminal).terminals){let k=u==null?void 0:u.terminal2Derivation.get(g);k||(k={nonTerminal:h.nonTerminal,derivations:[]},u==null||u.terminal2Derivation.set(g,k)),k.derivations.push(m),yield{ruleIndex:1,result:s}}}}(this.lexer,this.textGrammers,o,t)}},x.LRParser=class{constructor(){S(this,"initialStateNode");S(this,"allStateNodesMap");S(this,"lexer");S(this,"grammers");this.initialStateNode=null}generateState(o,t,r,n){if(!r||!n){const i=N(o);r=i.nonTerminals,n=i.terminals}const l="Augument_S";T.log("[nonTerminals]",r),T.log("[terminals]",n),this.grammers=o,this.lexer=new y(n,r);const a=new Map;for(let i of o){i=i.replaceAll(/\s/g,"");const c=i.split(/(=>)|(->)/).filter(p=>p!=="=>"&&p!=="->"&&p),h=c[0],m=c[1].split("|").filter(p=>p).map(p=>this.lexer.splitDerivation(p));a.set(h,m)}T.log(a),this.initialStateNode={id:0,items:[{nonTerminal:l,derivation:[t],matchPoint:0}],edges:[]},F(this.initialStateNode.items,a,this.lexer);const e=new Map;this.allStateNodesMap=e,e.set(P(this.initialStateNode.items),this.initialStateNode);const s=[];let f=0;for(;e.size!=f;){f=e.size;for(let i of e.values())if(!s[i.id]){s[i.id]=!0;for(let c of i.items)c.nonTerminal===l&&c.matchPoint===1&&i.edges.push({tocken:w,next:{id:-1,items:[],edges:[]}});for(let c of r){let h=[];for(let p of i.items)p.derivation.length!==p.matchPoint&&p.derivation[p.matchPoint]===c&&h.push({nonTerminal:p.nonTerminal,derivation:p.derivation,matchPoint:p.matchPoint+1});if(!h.length)continue;F(h,a,this.lexer);const m=P(h);e.has(m)||e.set(m,{id:e.size,items:h,edges:[]}),i.edges.push({tocken:c,next:e.get(m)})}for(let c of n){let h=[];for(let p of i.items)p.derivation.length!==p.matchPoint&&p.derivation[p.matchPoint]===c[0]&&h.push({nonTerminal:p.nonTerminal,derivation:p.derivation,matchPoint:p.matchPoint+1});if(!h.length)continue;F(h,a,this.lexer);const m=P(h);e.has(m)||e.set(m,{id:e.size,items:h,edges:[]}),i.edges.push({tocken:c[0],next:e.get(m)})}}}}predictInput(o,t){if(!this.lexer)throw new Error("[generatePredictTable] must call generateState before generatePredictTable");let r=[];for(o=o.replaceAll(/\s/g,""),r.push({stack:[0],symbols:[],input:[...this.lexer.splitDerivation(o),w]});;){const n=r[r.length-1],l=JSON.parse(JSON.stringify(n)),a=t[n.stack[n.stack.length-1]].action.get(n.input[0]);if(a.length>1)throw new Error(`move collision ${a}`);if(!a.length)throw new Error(`move is empty ${a}`);let e=a[0];if(e==="acc"){n.move="接受";break}if(e.startsWith("S"))n.move=`移入${n.input[0]}`,l.symbols.push(l.input.shift()),l.stack.push(Number(e.slice(1)));else{n.move=`根据${e}归约`;const s=e.slice(2,-1).replaceAll(/\s/g,""),f=s.split("=>")[0],i=this.lexer.splitDerivation(s.split("=>")[1]);for(let h=0;h<i.length;h++)l.stack.pop(),l.symbols.pop();l.symbols.push(f);const c=t[n.stack[l.stack.length-1]];l.stack.push(c.goto.get(f)[0])}r.push(l)}return r}generateLR0PredictTable(){if(!this.initialStateNode||!this.allStateNodesMap||!this.lexer)throw new Error("[generatePredictTable] must call generateState before generatePredictTable");const o=[];for(let t of this.allStateNodesMap.values()){let r={id:t.id,action:new Map,goto:new Map};for(let n of this.lexer.nonTerminals)r.goto.set(n,[]);for(let n of this.lexer.terminals)r.action.set(n[0],[]);r.action.set(w,[]);for(let n of t.edges)n.tocken!==w?this.lexer.isTerminal(n.tocken)?r.action.get(n.tocken).push(`S${n.next.id}`):r.goto.get(n.tocken).push(n.next.id):r.action.get(n.tocken).push("acc");for(let n of t.items)if(n.matchPoint===n.derivation.length)for(let l of this.lexer.terminals)r.action.get(l[0]).push(`r(${n.nonTerminal} => ${n.derivation.join(" ")})`);o.push(r)}return o.sort((t,r)=>t.id-r.id),o}generateSLR1PredictTable(){if(!(this.initialStateNode&&this.allStateNodesMap&&this.lexer&&this.grammers))throw new Error("[generatePredictTable] must call generateState before generatePredictTable");const o=D(this.lexer,this.grammers),t=[];for(let r of this.allStateNodesMap.values()){let n={id:r.id,action:new Map,goto:new Map};for(let l of this.lexer.nonTerminals)n.goto.set(l,[]);for(let l of this.lexer.terminals)n.action.set(l[0],[]);n.action.set(w,[]);for(let l of r.edges)l.tocken!==w?this.lexer.isTerminal(l.tocken)?n.action.get(l.tocken).push(`S${l.next.id}`):n.goto.get(l.tocken).push(l.next.id):n.action.get(l.tocken).push("acc");for(let l of r.items)if(l.matchPoint===l.derivation.length){let a=[];for(let e of o)if(e.tocken===l.nonTerminal){a=[...e.terminals.values()];break}for(let e of a)n.action.get(e[0]).push(`r(${l.nonTerminal} => ${l.derivation.join(" ")})`)}t.push(n)}return t.sort((r,n)=>r.id-n.id),t}get stateGraph(){const o=[],t=r=>{if(o[r.id])return o[r.id];const n={};o[r.id]=n,n.id=r.id,n.items=r.items.map(l=>j(l)),n.edges=[];for(let l of r.edges)n.edges.push({tocken:l.tocken,next:t(l.next)});return n};return t(this.initialStateNode)}},x.Lexer=y,x.checkNeedClearRightRecursion=function(o,t,r){if(!t||!r){const a=N(o);t=a.nonTerminals,r=a.terminals}T.log("[nonTerminals]",t),T.log("[terminals]",r);let n=new y(r,t);const l=new Map;for(let a of o){a=a.replaceAll(/\s/g,"");const e=a.split(/(=>)|(->)/).filter(i=>i!=="=>"&&i!=="->"&&i),s=e[0],f=e[1].split("|").filter(i=>i).map(i=>n.splitDerivation(i));l.set(s,f)}T.log("[nonTerminals2DerivationMap]",l);for(let a=0;a<t.length;a++){const e=l.get(t[a]);for(let s=e.length-1;s>=0;s--)if(e[s][0]===t[a])return!0}return!1},x.checkNeedliftUpCommonTocken=function(o,t,r){var a;let n=o;if(!t||!r){const e=N(o);t=e.nonTerminals,r=e.terminals}let l=new y(r,t);for(let e of n){e=e.replaceAll(/\s/g,"");const s=e.split(/(=>)|(->)/).filter(i=>i!=="=>"&&i!=="->"&&i)[1].split("|").filter(i=>i).map(i=>(T.log("[debug]",n),l.splitDerivation(i))),f=new Map;s.forEach(i=>{let c=f.get(i[0]);c?c.push(i.slice(1)):c=[i.slice(1)],f.set(i[0],c)});for(let i of f.keys())if(((a=f.get(i))==null?void 0:a.length)!==1)return!0}return!1},x.checkNeedunionGrammers=function(o){let t=new Map;for(let r of o){r=r.replaceAll(/\s/g,"");const n=r.split(/(=>)|(->)/).filter(e=>e!=="=>"&&e!=="->"&&e),l=n[0],a=n[1];if(t.has(l))return!0;t.set(l,[a])}return!1},x.clearRightRecursion=function(o,t,r){const n=[];if(!t||!r){const e=N(o);t=e.nonTerminals,r=e.terminals}T.log("[nonTerminals]",t),T.log("[terminals]",r);let l=new y(r,t);const a=new Map;for(let e of o){e=e.replaceAll(/\s/g,"");const s=e.split(/(=>)|(->)/).filter(c=>c!=="=>"&&c!=="->"&&c),f=s[0],i=s[1].split("|").filter(c=>c).map(c=>l.splitDerivation(c));a.set(f,i)}T.log("[nonTerminals2DerivationMap]",a);for(let e=0;e<t.length;e++){const s=a.get(t[e]);for(let i=0;i<e;i++){const c=a.get(t[i]);for(let h=s.length-1;h>=0;h--){const m=s[h];if(m[0]===t[i]){T.log(m,t[i]);for(let p of c)T.log("[-]",p),s==null||s.push([...p,...m.slice(1)]);s==null||s.splice(h,1)}}}const f=[];for(let i=s.length-1;i>=0;i--)s[i][0]===t[e]&&f.push(i);if(f.length){const i=l.getNewNonTerminal(t[e]),c=[],h=[];for(let m=s.length-1;m>=0;m--)f.indexOf(m)===-1&&c.push([...s[m][0]===d?s[m].slice(1):s[m],i]);for(let m of f)h.push([...s[m].slice(1),i]);h.push([d]),a.set(t[e],[...c,...f.length?[]:s]),a.set(i,h)}T.log("[nonTerminals2DerivationMap in process]",a,s)}for(let e of a.keys()){const s=a.get(e).map(f=>f.join(" ")).join(" | ");n.push(`${e} => ${s}`)}return n},x.getTockFromSimpleGrammers=N,x.liftUpCommonTocken=function(o,t,r){let n=o;if(!t||!r){const a=N(o);t=a.nonTerminals,r=a.terminals}let l=new y(r,t);for(;;){let a=[];const e=n.map(f=>{var u;const i=(f=f.replaceAll(/\s/g,"")).split(/(=>)|(->)/).filter(g=>g!=="=>"&&g!=="->"&&g),c=i[0],h=i[1].split("|").filter(g=>g).map(g=>(T.log("[debug]",n),l.splitDerivation(g))),m=[],p=new Map;h.forEach(g=>{let k=p.get(g[0]);k?k.push(g.slice(1)):k=[g.slice(1)],p.set(g[0],k)});for(let g of p.keys()){if(((u=p.get(g))==null?void 0:u.length)===1){m.push(g+p.get(g)[0].join(""));continue}const k=p.get(g),v=l.getNewNonTerminal(c);m.push(g+v),a.push(v+" => "+(k==null?void 0:k.map(A=>A.join(" ")).join(" | ")))}return c+" => "+m.join(" | ")});T.log("[pre]",e,a);const s=[...e,...a];if(T.log("[com]",n,s),n.length===s.length)break;n=s}return n},x.unionGrammers=function(o,t,r){let n=new Map;const l=[];if(!t||!r){const e=N(o);t=e.nonTerminals,r=e.terminals}let a=new y(r,t);o.forEach(e=>{const s=(e=e.replaceAll(/\s/g,"")).split(/(=>)|(->)/).filter(c=>c!=="=>"&&c!=="->"&&c),f=s[0],i=s[1].split("|").filter(c=>c).map(c=>(T.log("[debug]",l),a.splitDerivation(c)));if(n.has(f)){const c=n.get(f);i.forEach(h=>{const m=h.join(" ");(c==null?void 0:c.indexOf(m))===-1&&c.push(m)})}else n.set(f,i.map(c=>c.join(" ")))});for(let e of n.keys()){const s=[...new Set(n.get(e))];l.push(`${e} => ${s.join("|")}`.split("|").join(" | "))}return T.log(l),l};export{x as i};