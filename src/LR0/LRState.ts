import generateFirstSet from "@/firstSet";
import generateFllowSet from "@/followSet";
import Lexer from "@/lexer";
import { getTockFromSimpleGrammers } from "@/simpleGrammerHelper";
import { Grammers, LRPredictLine, LRPredictResultTable, LRPredictTableLine, LRPredictTable, LRStateNode, LRStateNodeForShow, LRStateNodeItem, PredictTable, Process, Rule, LRPredictLineWithAST, LRASTNode, LRPredictResultTableWithASTNode } from "@/types/type";
import { EmptyCharacter, EndingCharacter } from "@/utils/const";
import log from "@/utils/log";

export class LRParser  {
    initialStateNode: LRStateNode | null;
    allStateNodesMap?: Map<string,LRStateNode>;
    lexer?: Lexer;
    grammers?: string[];
    constructor() {
        this.initialStateNode = null;
    }
    generateState(grammers: string[], parseStartNonTerminal: string,nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>) {
        if (!nonTerminals || !terminals) {
            // 如果用户没有自定义终结符和非终结符，那么默认它的语法是满足课本里的
            const tockenAnaRes = getTockFromSimpleGrammers(grammers);
            nonTerminals = tockenAnaRes.nonTerminals;
            terminals = tockenAnaRes.terminals;
        }
        const AugumentStart = "Augument_S";
        log.log("[nonTerminals]", nonTerminals);
        log.log("[terminals]", terminals);
        this.grammers = grammers;
        this.lexer = new Lexer(terminals, nonTerminals);
        // 定义从非终结符对应右部式子的结构
        const nonTerminals2DerivationMap = new Map<string,string[][]>();
        for (let grammer of grammers) {
            grammer = grammer.replaceAll(/\s/g, "");
            const arr = grammer.split(/(=>)|(->)/).filter(v => v !== "=>" && v !== "->" && v);//['S','AB']
            const nonTerminal = arr[0];
            const derivations = arr[1].split("|").filter(v => v).map(derivation => {
                return this.lexer!.splitDerivation(derivation);   // 将产生式的体拆开，终结符和非终结符成为个体
                //return this.lexer?.splitDerivation(derivation)
            });
            nonTerminals2DerivationMap.set(nonTerminal, derivations);
        }
        log.log(nonTerminals2DerivationMap);

        this.initialStateNode = {
            id: 0,
            items: [{
                nonTerminal: AugumentStart,
                derivation: [parseStartNonTerminal], // S
                matchPoint: 0,
            }],
            edges: [],
        }
        expandStateItems(this.initialStateNode.items,nonTerminals2DerivationMap,this.lexer);
        const allStateNodesMap = new Map<string,LRStateNode>();
        this.allStateNodesMap = allStateNodesMap;
        allStateNodesMap.set(stateItemsToString(this.initialStateNode.items),this.initialStateNode);
        const vis: boolean[] = [];
        let preSize = 0;
        while(true) {
            if(allStateNodesMap.size == preSize)break; // 目前图中的node都处理完了
            preSize = allStateNodesMap.size;
            for(let state of allStateNodesMap.values()) {
                if(vis[state.id]) continue; // 如果该状态已经遍历过，就略过
                vis[state.id] = true;
                // 判断是否可以到接受状态
                for(let item of state.items) {  // 访问这个状态中的项目
                    if(item.nonTerminal === AugumentStart && item.matchPoint === 1) { // 判断是否是接受状态
                        state.edges.push({
                            tocken: EndingCharacter,
                            next: {
                                id: -1,
                                items: [],
                                edges: [],
                            }
                        })
                    }
                }
                for(let nonTerminal of nonTerminals) {
                    let matchItems: LRStateNodeItem[] = [];
                    for(let item of state.items) {
                        if(item.derivation.length === item.matchPoint)continue;//说明这个item已经结束了
                        if(item.derivation[item.matchPoint] === nonTerminal) { //*后面是这个nonTerminal
                            matchItems.push({ // 创建一个新的节点，是通过获取这个nonTerminal获得的   看到这里了
                                nonTerminal: item.nonTerminal,
                                derivation: item.derivation,
                                matchPoint: item.matchPoint+1,
                            })
                        } 
                    }
                    if(!matchItems.length)continue; 
                    expandStateItems(matchItems,nonTerminals2DerivationMap,this.lexer); //获取这个state其他item
                    const key = stateItemsToString(matchItems);
                    if(!allStateNodesMap.has(key)) {
                        allStateNodesMap.set(key,{
                            id: allStateNodesMap.size,
                            items: matchItems,
                            edges: [],
                        })
                    }
                    state.edges.push({
                        tocken: nonTerminal,
                        next: allStateNodesMap.get(key)!,
                    });
                }
                for(let terminal of terminals) {
                    let matchItems: LRStateNodeItem[] = [];
                    for(let item of state.items) {
                        if(item.derivation.length === item.matchPoint)continue;
                        if(item.derivation[item.matchPoint] === terminal[0]) {
                            matchItems.push({
                                nonTerminal: item.nonTerminal,
                                derivation: item.derivation,
                                matchPoint: item.matchPoint+1,
                            })
                        } 
                    }
                    if(!matchItems.length)continue;
                    expandStateItems(matchItems,nonTerminals2DerivationMap,this.lexer);
                    const key = stateItemsToString(matchItems);
                    if(!allStateNodesMap.has(key)) {
                        allStateNodesMap.set(key,{
                            id: allStateNodesMap.size,
                            items: matchItems,
                            edges: [],
                        })
                    }
                    state.edges.push({
                        tocken: terminal[0],
                        next: allStateNodesMap.get(key)!,
                    });
                }
            }
        }
    }
    *generateStateProgressive(grammers: string[], parseStartNonTerminal: string,nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): IterableIterator<undefined> {
        if (!nonTerminals || !terminals) {
            const tockenAnaRes = getTockFromSimpleGrammers(grammers);
            nonTerminals = tockenAnaRes.nonTerminals;
            terminals = tockenAnaRes.terminals;
        }
        const AugumentStart = "Augument_S";
        log.log("[nonTerminals]", nonTerminals);
        log.log("[terminals]", terminals);
        this.grammers = grammers;
        this.lexer = new Lexer(terminals, nonTerminals);

        const nonTerminals2DerivationMap = new Map<string,string[][]>();
        for (let grammer of grammers) {
            grammer = grammer.replaceAll(/\s/g, "");
            const arr = grammer.split(/(=>)|(->)/).filter(v => v !== "=>" && v !== "->" && v);
            const nonTerminal = arr[0];
            const derivations = arr[1].split("|").filter(v => v).map(derivation => {
                return this.lexer!.splitDerivation(derivation);
            });
            nonTerminals2DerivationMap.set(nonTerminal, derivations);
        }
        log.log(nonTerminals2DerivationMap);

        this.initialStateNode = {
            id: 0,
            items: [{
                nonTerminal: AugumentStart,
                derivation: [parseStartNonTerminal],
                matchPoint: 0,
            }],
            edges: [],
        }
    
        expandStateItems(this.initialStateNode.items,nonTerminals2DerivationMap,this.lexer);
        yield;
        const allStateNodesMap = new Map<string,LRStateNode>();
        this.allStateNodesMap = allStateNodesMap;
        allStateNodesMap.set(stateItemsToString(this.initialStateNode.items),this.initialStateNode);
        const vis: boolean[] = [];
        let preSize = 0;
        while(true) {
            if(allStateNodesMap.size == preSize)break;
            preSize = allStateNodesMap.size;
            for(let state of allStateNodesMap.values()) {
                if(vis[state.id]) continue;
                vis[state.id] = true;
                // 判断是否可以到接受状态
                for(let item of state.items) {
                    if(item.nonTerminal === AugumentStart && item.matchPoint === 1) {
                        state.edges.push({
                            tocken: EndingCharacter,
                            next: {
                                id: -1,
                                items: [],
                                edges: [],
                            }
                        })
                    }
                }
                for(let nonTerminal of nonTerminals) {
                    let matchItems: LRStateNodeItem[] = [];
                    for(let item of state.items) {
                        if(item.derivation.length === item.matchPoint)continue;
                        if(item.derivation[item.matchPoint] === nonTerminal) {
                            matchItems.push({
                                nonTerminal: item.nonTerminal,
                                derivation: item.derivation,
                                matchPoint: item.matchPoint+1,
                            })
                        } 
                    }
                    if(!matchItems.length)continue;
                    expandStateItems(matchItems,nonTerminals2DerivationMap,this.lexer);
                    const key = stateItemsToString(matchItems);
                    if(!allStateNodesMap.has(key)) {
                        allStateNodesMap.set(key,{
                            id: allStateNodesMap.size,
                            items: matchItems,
                            edges: [],
                        })
                    }
                    state.edges.push({
                        tocken: nonTerminal,
                        next: allStateNodesMap.get(key)!,
                    });
                    yield;
                }
                for(let terminal of terminals) {
                    let matchItems: LRStateNodeItem[] = [];
                    for(let item of state.items) {
                        if(item.derivation.length === item.matchPoint)continue;
                        if(item.derivation[item.matchPoint] === terminal[0]) {
                            matchItems.push({
                                nonTerminal: item.nonTerminal,
                                derivation: item.derivation,
                                matchPoint: item.matchPoint+1,
                            })
                        } 
                    }
                    if(!matchItems.length)continue;
                    expandStateItems(matchItems,nonTerminals2DerivationMap,this.lexer);
                    const key = stateItemsToString(matchItems);
                    if(!allStateNodesMap.has(key)) {
                        allStateNodesMap.set(key,{
                            id: allStateNodesMap.size,
                            items: matchItems,
                            edges: [],
                        })
                    }
                    state.edges.push({
                        tocken: terminal[0],
                        next: allStateNodesMap.get(key)!,
                    });
                    yield;
                }
            }
        }
        return;
    }
    predictInput(input: string,predictTable: LRPredictTable): LRPredictResultTable {
        if(!this.lexer) {
            throw new Error("[generatePredictTable] must call generateState before generatePredictTable");
        }
        let ans: LRPredictResultTable = [];
        input = input.replaceAll(/\s/g, "");
        ans.push({
            stack: [0],
            symbols: [],
            input: [...this.lexer.splitDerivation(input),EndingCharacter],
        })
        while(true) {
            const step = ans[ans.length-1];
            const next = JSON.parse(JSON.stringify(step)) as LRPredictLine;
            const stateId = step.stack[step.stack.length - 1]; //获取状态id

            const predictLine = predictTable[stateId];
            let emptyCharacterFlag = false;
            let move = predictLine.action.get(step.input[0])!;
            if(move.length > 1) {
                throw new Error(`move collision ${move}`);
            }
            if(!move.length) {
                if(predictLine.action.get(EmptyCharacter)?.length === 1) {
                    move = predictLine.action.get(EmptyCharacter)!;
                    emptyCharacterFlag = true;
                } else {
                    throw new Error(`move is empty ${move}`);
                }
            }
            let cMove = move[0] as string;
            if(cMove === "acc") {
                step.move = "接受";
                break;
            }
            if(cMove.startsWith("S")) {
                // shift
                step.move = `移入${step.input[0]}`;
                if(emptyCharacterFlag) {
                    next.symbols.push(EmptyCharacter);
                } else {
                    next.symbols.push(next.input.shift()!);
                }
                next.stack.push(Number(cMove.slice(1)));
            } else {
                // reduce
                step.move = `根据${cMove}归约`;
                const grammer = cMove.slice(2,-1).replaceAll(/\s/g,"");
                const nonTerminal = grammer.split("=>")[0];
                const derivation = this.lexer.splitDerivation(grammer.split("=>")[1]);
                for(let i=0;i<derivation.length;i++) {
                    next.stack.pop();
                    next.symbols.pop();
                }
                next.symbols.push(nonTerminal);
                // goto
                const leftStateId = step.stack[next.stack.length - 1];
                const jPredictLine = predictTable[leftStateId];
                next.stack.push(jPredictLine.goto.get(nonTerminal)![0] as unknown as number);
            }
            ans.push(next);
        }
        return ans;
    }

    predictInputWithAST(input: string,predictTable: LRPredictTable): LRPredictResultTableWithASTNode {
        if(!this.lexer) {
            throw new Error("[generatePredictTable] must call generateState before generatePredictTable");
        }
        let ans: LRPredictResultTableWithASTNode = [];
        input = input.replaceAll(/\s/g, "");
        const lid=1;
        ans.push({
            stack: [0],
            symbols: [],
            input: [...this.lexer.splitDerivation(input),EndingCharacter],
        })
        while(true) {
            const step = ans[ans.length-1];
            const next = JSON.parse(JSON.stringify(step)) as LRPredictLineWithAST;  //
            const stateId = step.stack[step.stack.length - 1];

            const predictLine = predictTable[stateId];
            const move = predictLine.action.get(step.input[0])!;
            if(move.length > 1) {
                throw new Error(`move collision ${move}`);
            }
            if(!move.length) {
                throw new Error(`move is empty ${move}`);
            }
            let cMove = move[0] as string;
            if(cMove === "acc") {
                step.move = "接受";
                break;
            }
            if(cMove.startsWith("S")) {
                // shift
                step.move = `移入${step.input[0]}`;
                //next.symbols.push(next.input.shift()!); // shuft把input的第一个元素删除并返回
                const lrnode:LRASTNode={id:lid,text:next.input.shift()!}
                next.symbols.push(lrnode);
                next.stack.push(Number(cMove.slice(1)));
            } else {
                // reduce
                step.move = `根据${cMove}归约`;
                const grammer = cMove.slice(2,-1).replaceAll(/\s/g,"");
                const nonTerminal = grammer.split("=>")[0];
                const derivation = this.lexer.splitDerivation(grammer.split("=>")[1]);
               const parentNode:LRASTNode={id:lid+1,text:nonTerminal};
                if(!parentNode.children){
                        parentNode.children=[];
                }
                for(let i=0;i<derivation.length;i++) {
                    next.stack.pop();
                    // console.log(next.symbols)
                    const temp= next.symbols.pop()!;
                    // temp!.parent=parentNode ///
                    //console.log("123",parentNode.children);
        
                    parentNode.children!.push(temp);
                    //const lrnode=next.symbols.pop() as LRASTNode;
                    //console.log("kanzheli1111111",lrnode);
                   // lrnode!.addParent(parentNode)
                }
                next.symbols.push(parentNode);
                // goto
                const leftStateId = step.stack[next.stack.length - 1];
                const jPredictLine = predictTable[leftStateId];
                next.stack.push(jPredictLine.goto.get(nonTerminal)![0] as unknown as number);
            }
            ans.push(next);
        }

        // (ans as any).astNode = 
        return ans;
    }


    *predictInputProgressive(input: string,predictTable: LRPredictTable): IterableIterator<LRPredictResultTableWithASTNode> {
        if(!this.lexer) {
            throw new Error("[generatePredictTable] must call generateState before generatePredictTable");
        }
        let ans: LRPredictResultTableWithASTNode = [];
        input = input.replaceAll(/\s/g, "");
        const lid=100;
        ans.push({
            stack: [0],
            symbols: [],
            input: [...this.lexer.splitDerivation(input),EndingCharacter],
        })
        yield ans;
        while(true) {
            const step = ans[ans.length-1];
            const next = JSON.parse(JSON.stringify(step)) as LRPredictLineWithAST;  //
            const stateId = step.stack[step.stack.length - 1];

            const predictLine = predictTable[stateId];
            const move = predictLine.action.get(step.input[0])!;
            if(move.length > 1) {
                throw new Error(`move collision ${move}`);
            }
            if(!move.length) {
                throw new Error(`move is empty ${move}`);
            }
            let cMove = move[0] as string;
            if(cMove === "acc") {
                step.move = "接受";
                break;
            }
            if(cMove.startsWith("S")) {
                // shift
                step.move = `移入${step.input[0]}`;
                //next.symbols.push(next.input.shift()!); // shuft把input的第一个元素删除并返回
                const lrnode:LRASTNode={id:lid,text:next.input.shift()!}
                next.symbols.push(lrnode);
                next.stack.push(Number(cMove.slice(1)));
            } else {
                // reduce
                step.move = `根据${cMove}归约`;
                const grammer = cMove.slice(2,-1).replaceAll(/\s/g,"");
                const nonTerminal = grammer.split("=>")[0];
                const derivation = this.lexer.splitDerivation(grammer.split("=>")[1]);
               const parentNode:LRASTNode={id:lid-1,text:nonTerminal};
                if(!parentNode.children){
                        parentNode.children=[];
                }
                for(let i=0;i<derivation.length;i++) {
                    next.stack.pop();
                    // console.log(next.symbols)
                    const temp= next.symbols.pop()!;
                    // temp!.parent=parentNode ///
                    //console.log("123",parentNode.children);
        
                    parentNode.children!.push(temp);
                    //const lrnode=next.symbols.pop() as LRASTNode;
                    //console.log("kanzheli1111111",lrnode);
                   // lrnode!.addParent(parentNode)
                }
                next.symbols.push(parentNode);
                // goto
                const leftStateId = step.stack[next.stack.length - 1];
                const jPredictLine = predictTable[leftStateId];
                next.stack.push(jPredictLine.goto.get(nonTerminal)![0] as unknown as number);
            }
            yield ans;
            ans.push(next);
        }
        
        // (ans as any).astNode = 
        return ans;
    }

    generateLR0PredictTable() {
        if(!this.initialStateNode || !this.allStateNodesMap || !this.lexer) {
            throw new Error("[generatePredictTable] must call generateState before generatePredictTable");
        }
        const predictTable: LRPredictTable = [];
        for(let stateNode of this.allStateNodesMap.values()) {
            let predictLine: LRPredictTableLine = {
                id: stateNode.id,
                action: new Map(),
                goto: new Map()
            };
            for(let nonTerminal  of this.lexer.nonTerminals) {
                predictLine.goto.set(nonTerminal,[]);
            }
            for(let terminal  of this.lexer.terminals) {
                predictLine.action.set(terminal[0],[]);
            }
            predictLine.action.set(EndingCharacter,[]);
            for(let edge of stateNode.edges) {
                if(edge.tocken === EndingCharacter) {
                    predictLine.action.get(edge.tocken)!.push("acc");
                    continue;
                }
                if(this.lexer.isTerminal(edge.tocken)) {
                    predictLine.action.get(edge.tocken)!.push(`S${edge.next.id}`);
                } else {
                    predictLine.goto.get(edge.tocken)!.push(edge.next.id);
                }
            }
            for(let item of stateNode.items) {
                if(item.matchPoint === item.derivation.length) { // reduce
                    for(let terminal of this.lexer.terminals) {
                        predictLine.action.get(terminal[0])!.push(`r(${item.nonTerminal} => ${item.derivation.join(" ")})`);
                    }
                    if(!predictLine.action.get(EndingCharacter)?.length) {
                        predictLine.action.get(EndingCharacter)!.push(`r(${item.nonTerminal} => ${item.derivation.join(" ")})`);
                    }
                }
            }
            predictTable.push(predictLine);
        }   
        predictTable.sort((a,b)=>{
            return a.id - b.id;
        });
        return predictTable;
    }
    // *generateLR0PredictTableProgressive(): IterableIterator<Rule | Process<PredictTable>> {
    //     if(!this.initialStateNode || !this.allStateNodesMap || !this.lexer) {
    //         throw new Error("[generatePredictTable] must call generateState before generatePredictTable");
    //     }
    //     yield [
    //         "1. 对 First(u) 中的所有终结符 a （不含 ε ），置 M[A, a] = A -> u",
    //         "2. 若 First(u) 含 ε ，则对 Follow(A) 中的所有符号 a （可含 $ ），置 M[A, a] = A -> u"
    //     ]
    //     const predictTable: LRPredictTable = [];
    //     for(let stateNode of this.allStateNodesMap.values()) {
    //         let predictLine: LRPredictTableLine = {
    //             id: stateNode.id,
    //             action: new Map(),
    //             goto: new Map()
    //         };
    //         for(let nonTerminal  of this.lexer.nonTerminals) {
    //             predictLine.goto.set(nonTerminal,[]);
    //         }
    //         for(let terminal  of this.lexer.terminals) {
    //             predictLine.action.set(terminal[0],[]);
    //         }
    //         predictLine.action.set(EndingCharacter,[]);
    //         for(let edge of stateNode.edges) {
    //             if(edge.tocken === EndingCharacter) {
    //                 predictLine.action.get(edge.tocken)!.push("acc");
    //                 continue;
    //             }
    //             if(this.lexer.isTerminal(edge.tocken)) {
    //                 predictLine.action.get(edge.tocken)!.push(`S${edge.next.id}`);
    //             } else {
    //                 predictLine.goto.get(edge.tocken)!.push(edge.next.id);
    //             }
    //         }
    //         for(let item of stateNode.items) {
    //             if(item.matchPoint === item.derivation.length) { // reduce
    //                 for(let terminal of this.lexer.terminals) {
    //                     predictLine.action.get(terminal[0])!.push(`r(${item.nonTerminal} => ${item.derivation.join(" ")})`);
    //                 }
    //             }
    //         }
    //         predictTable.push(predictLine);
    //     }   
    //     predictTable.sort((a,b)=>{
    //         return a.id - b.id;
    //     });
    //     return predictTable;
    // }
    generateSLR1PredictTable() {
        if(!this.initialStateNode || !this.allStateNodesMap || !this.lexer || !this.grammers) {
            throw new Error("[generatePredictTable] must call generateState before generatePredictTable");
        }
        const followSet = generateFllowSet(this.lexer,this.grammers);
        console.log(followSet)
        const predictTable: LRPredictTable = [];
        for(let stateNode of this.allStateNodesMap.values()) {
            let predictLine: LRPredictTableLine = {
                id: stateNode.id,
                action: new Map(),
                goto: new Map()
            };
            for(let nonTerminal  of this.lexer.nonTerminals) {
                predictLine.goto.set(nonTerminal,[]);
            }
            for(let terminal  of this.lexer.terminals) {
                predictLine.action.set(terminal[0],[]);
            }
            predictLine.action.set(EndingCharacter,[]);
            for(let edge of stateNode.edges) {
                if(edge.tocken === EndingCharacter) {
                    predictLine.action.get(edge.tocken)!.push("acc");
                    continue;
                }
                if(this.lexer.isTerminal(edge.tocken)) {
                    predictLine.action.get(edge.tocken)!.push(`S${edge.next.id}`);
                } else {
                    predictLine.goto.get(edge.tocken)!.push(edge.next.id);
                }
            }
            for(let item of stateNode.items) {
                if(item.matchPoint === item.derivation.length) { // reduce
                    let followCh: string[] = [];
                    for(let setLine of followSet) {
                        if(setLine.tocken === item.nonTerminal) {
                            followCh = [...setLine.terminals.values()];
                            break;
                        }
                    }
                    for(let terminal of followCh) {
                        predictLine.action.get(terminal[0])!.push(`r(${item.nonTerminal} => ${item.derivation.join(" ")})`);
                    }
                }
            }
            predictTable.push(predictLine);
        }   
        predictTable.sort((a,b)=>{
            return a.id - b.id;
        });
        return predictTable;
    }
    get stateGraph(): LRStateNodeForShow {
        const vis: any[] = [];
        const dfs = (node: any) => {
            if(vis[node.id]) {
                return vis[node.id];
            }
            const newNode: any = {};
            vis[node.id] = newNode;
            newNode.id = node.id;
            newNode.items = node.items.map((item: any)=>{
                return stateItemToString(item);
            })
            newNode.edges = [];
            for(let edge of node.edges) {
                newNode.edges.push({
                    tocken: edge.tocken,
                    next: dfs(edge.next)
                })
            }
            return newNode;
        }
        return dfs(this.initialStateNode);
    }
}

function stateItemsToString(items: LRStateNodeItem[]): string { 
    items  = items.sort((a,b)=>{
        if(a<b) {
            return -1;
        }
        return 1;
    })
    let ans = "";
    for(let item of items) {
        ans += ` ${stateItemToString(item)}`;
    }
    return ans;
}
function stateItemToString(item: LRStateNodeItem): string { 
    let ans = `${item.nonTerminal} -> `;
    for(let i=0;i<item.derivation.length;i++) {
        if(i===item.matchPoint) {
            if(!i)ans += " ";
            ans += "· ";
        }
        if(i===item.derivation.length - 1) {
            ans += `${item.derivation[i]}`;
        }else {
            ans += `${item.derivation[i]} `;
        }
        if(i === (item.derivation.length-1) && item.matchPoint === item.derivation.length) {
            ans += "·"
        }
    }
    return ans;
}

// 
function expandStateItems(items: LRStateNodeItem[],nonTerminals2DerivationMap: Map<string,string[][]>,lexer: Lexer) {
    for(let i=0;i<items.length;i++) { // 对项集中的每一个项遍历
        const item = items[i];
        const tocken = item.derivation[item.matchPoint];//取 * 之后的字符,比如S'->*S，取S
        if(lexer.isTerminal(tocken))continue; // 如果是终结符就跳过
        const derivations = nonTerminals2DerivationMap.get(tocken);  // 取出非终结符的推导式,比如S->AB，取A，B
                                                                    // 这里的derivations就是接下来语法分析将会见到的字符，可能是非终结符，可能是终结符
        derivations?.forEach(derivation=>{
            let inFlag = false;
            for(let jItem of items) {//遍历项集有没有这个项,如果有后面就不要加入
                if(jItem.nonTerminal === tocken && jItem.matchPoint === 0) { //如果项集里目前存在这个token的项，且占位点也是0的化，还不能确定一定是这个项
                    if(jItem.derivation.length !== derivation.length)continue; // 如果他们推导出来的体不一样长就不是一个体
                    let equal = true;
                    for(let i=0;i<derivation.length;i++) {
                        if(jItem.derivation[i] !== derivation[i]) {
                            equal = false;
                            break;
                        }
                    }
                    if(equal) {
                        inFlag = true;
                        break;
                    }
                }   
            }
            if(inFlag)return ;
            items.push({
                nonTerminal: tocken,
                matchPoint: 0,
                derivation,
            });
        });
    }
}