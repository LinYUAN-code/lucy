import generateFirstSet, { getDerivationFirstSet } from "@/firstSet";
import generateFllowSet from "@/followSet";
import Lexer from "@/lexer";
import { getTockFromSimpleGrammers } from "@/simpleGrammerHelper";
import { Grammers, LRPredictLine, LRPredictResultTable, LRPredictTableLine, LRPredictTable, LRStateNode, LRStateNodeForShow, LRStateNodeItem, PredictTable, Process, Rule, NonTerminal, GrammerSetLine, GrammerSet, PredictLine } from "@/types/type";
import { EmptyCharacter, EndingCharacter } from "@/utils/const";
import log from "@/utils/log";
const AugumentStart = "Augument_S";
export class LR1Parser  {
    initialStateNode: LRStateNode | null;
    allStateNodesMap?: Map<string,LRStateNode>;
    lexer?: Lexer;
    grammers?: string[];
    firstSet?: GrammerSet;
    constructor() {
        this.initialStateNode = null;
    }
    generateState(grammers: string[], parseStartNonTerminal: string,nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>) {
        if (!nonTerminals || !terminals) {
            const tockenAnaRes = getTockFromSimpleGrammers(grammers);
            nonTerminals = tockenAnaRes.nonTerminals;
            terminals = tockenAnaRes.terminals;
        }
        log.log("[nonTerminals]", nonTerminals);
        log.log("[terminals]", terminals);
        this.grammers = grammers;
        this.lexer = new Lexer(terminals, nonTerminals);
        this.firstSet = generateFirstSet(this.lexer,grammers);

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
                lookAheadTocken: [EndingCharacter],
            }],
            edges: [],
        }
        expandStateItems(this.initialStateNode.items,nonTerminals2DerivationMap,this.lexer,this.firstSet);
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
                                lookAheadTocken: item.lookAheadTocken,
                            })
                        } 
                    }
                    if(!matchItems.length)continue;
                    expandStateItems(matchItems,nonTerminals2DerivationMap,this.lexer,this.firstSet);
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
                                lookAheadTocken: item.lookAheadTocken,
                            })
                        } 
                    }
                    if(!matchItems.length)continue;
                    expandStateItems(matchItems,nonTerminals2DerivationMap,this.lexer,this.firstSet);
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
        if(!this.firstSet) {
            this.firstSet = generateFirstSet(this.lexer,grammers);
        }

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
        expandStateItems(this.initialStateNode.items,nonTerminals2DerivationMap,this.lexer,this.firstSet!);
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
                    expandStateItems(matchItems,nonTerminals2DerivationMap,this.lexer,this.firstSet!);
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
                    expandStateItems(matchItems,nonTerminals2DerivationMap,this.lexer,this.firstSet!);
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
            const stateId = step.stack[step.stack.length - 1];

            let predictLine: LRPredictTableLine | undefined = getItemByIdFromArr(predictTable,stateId);
            for(let line of predictTable) {
                if(line.id === stateId) {
                    predictLine = line;
                    break;
                }
            }
            if(!predictLine) {
                throw new Error(`[predict] stateId: ${stateId} 的预测行找不到`);
            }
            let emptyCharacterFlag = false;
            let move: any[] = [];
            move = predictLine.action.get(step.input[0])!;
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
                const jPredictLine = getItemByIdFromArr(predictTable,leftStateId);;
                next.stack.push(jPredictLine.goto.get(nonTerminal)![0] as unknown as number);
            }
            ans.push(next);
        }
        return ans;
    }
    mergeNewNode(node: LRStateNode,addNode: LRStateNode) {
        node.id = Number(`${node.id}${addNode.id}`);
        if(node.items.length !== addNode.items.length) {
            throw new Error("[mergeNewNode] 合并核心节点出错");
        }
        for(let i=0;i<node.items.length;i++) {
            const item = node.items[i];
            const addItem = addNode.items[i];
            for(let cha of addItem.lookAheadTocken!) {
                if(item.lookAheadTocken?.indexOf(cha) === -1) {
                    item.lookAheadTocken.push(cha);
                }
            }
        }
        node.acc = node.acc || addNode.acc;
    }
    generateLALRPredictTable() {
        if(!this.initialStateNode || !this.allStateNodesMap || !this.lexer) {
            throw new Error("[generatePredictTable] must call generateState before generatePredictTable");
        }
        // 合并项集
        const mergeMap = new Map<string,LRStateNode>();
        const joinMapDfs = () => {
            const vis = new Map<number,boolean>();
            const dfs = (node: LRStateNode) => {
                if(vis.has(node.id))return ;
                vis.set(node.id,true);
                const key = stateItemsToString(node.items,false);
                let newNode: LRStateNode | undefined = mergeMap.get(key);
                if(!newNode) {
                    newNode = {
                        id: node.id,
                        items: [],
                        edges: [],
                        acc: node.acc
                    };
                    for(let item of node.items) {
                        newNode.items.push(JSON.parse(JSON.stringify(item)));
                    }
                    newNode!.edges = [];
                    mergeMap.set(key,newNode!);
                } else {
                    this.mergeNewNode(newNode,node);
                }
                for(let edge of node.edges) {
                    dfs(edge.next);
                }
            }
            dfs(this.initialStateNode!);
        }
        joinMapDfs();


        const id2idMap = new Map<number,number>();
        const MapMapDfs = () => {
            const vis = new Map<number,boolean>();
            const dfs = (node: LRStateNode) => {
                if(vis.has(node.id))return ;
                vis.set(node.id,true);
                const key = stateItemsToString(node.items,false);
                id2idMap.set(node.id,mergeMap.get(key)!.id);
                for(let edge of node.edges) {
                    dfs(edge.next);
                }
            }
            dfs(this.initialStateNode!);
        }
        MapMapDfs();
        const i2i = (id: number):number => id2idMap.get(id)!;
        const predictTable: LRPredictTable = [];
        const used = new Map<number,boolean>();
        for(let stateNode of this.allStateNodesMap.values()) {
            if(used.get(i2i(stateNode.id)))continue;
            used.set(i2i(stateNode.id),true);
            let predictLine: LRPredictTableLine = {
                id: i2i(stateNode.id),
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
                    predictLine.action.get(edge.tocken)!.push(`S${i2i(edge.next.id)}`);
                } else {
                    predictLine.goto.get(edge.tocken)!.push(i2i(edge.next.id));
                }
            }
            let items: LRStateNodeItem[] = stateNode.items;
            if(i2i(stateNode.id) !== stateNode.id) {
                items = mergeMap.get(stateItemsToString(stateNode.items,false))!.items;
            }
            for(let item of items) {
                if(item.matchPoint === item.derivation.length) { // reduce
                    if(item.nonTerminal === AugumentStart)continue;
                    for(let tocken of item.lookAheadTocken!) {
                        predictLine.action.get(tocken)!.push(`r(${item.nonTerminal} => ${item.derivation.join(" ")})`);
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
    generateLR1PredictTable() {
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
                    if(item.nonTerminal === AugumentStart)continue;
                    for(let tocken of item.lookAheadTocken!) {
                        predictLine.action.get(tocken)!.push(`r(${item.nonTerminal} => ${item.derivation.join(" ")})`);
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

function stateItemsToString(items: LRStateNodeItem[],needLookAhead: boolean = true): string { 
    items = items.sort((a,b)=>{
        if(a<b) {
            return -1;
        }
        return 1;
    })
    let ans = "";
    for(let item of items) {
        ans += ` ${stateItemToString(item,needLookAhead)}`;
    }
    return ans;
}
function stateItemToString(item: LRStateNodeItem,needLookAhead: boolean = true): string { 
    let ans = `${item.nonTerminal} => `;
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
    if(item.lookAheadTocken?.length && needLookAhead) {
        ans += " , " + item.lookAheadTocken.join("/");
    }
    return ans;
}
function expandStateItems(items: LRStateNodeItem[],nonTerminals2DerivationMap: Map<string,string[][]>,lexer: Lexer,firstSet: GrammerSet) {
    for(let i=0;i<items.length;i++) {
        const item = items[i];
        const tocken = item.derivation[item.matchPoint];
        if(lexer.isTerminal(tocken))continue;
        const derivations = nonTerminals2DerivationMap.get(tocken);
        const deriForFirstSet = item.derivation.slice(item.matchPoint+1);
        const lookAheadTocken = [...getDerivationFirstSet(lexer,deriForFirstSet,firstSet).terminals];
        if(!lookAheadTocken.length || lookAheadTocken.indexOf(EmptyCharacter)!==-1) {
            lookAheadTocken.push(...item.lookAheadTocken!);
        }
        derivations?.forEach(derivation=>{
            let inFlag = false;
            for(let jItem of items) {
                if(jItem.nonTerminal === tocken && jItem.matchPoint === 0) {
                    if(jItem.derivation.length !== derivation.length)continue;
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
                lookAheadTocken,
            });
        });
    }
}

function getItemByIdFromArr(arr: any[],id: any): any {
    for(let item of arr) {
        if(item.id === id) {
            return item;
        }
    }
}