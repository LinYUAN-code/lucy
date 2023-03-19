import Lexer from "@/lexer";
import { getTockFromSimpleGrammers } from "@/simpleGrammerHelper";
import { Grammers, LRStateNode, LRStateNodeForShow, LRStateNodeItem } from "@/types/type";
import log from "@/utils/log";

export class LRStateMachine  {
    initialStateNode: LRStateNode | null;
    constructor() {
        this.initialStateNode = null;
    }
    generateState(grammers: string[], parseStartNonTerminal: string,nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>) {
        if (!nonTerminals || !terminals) {
            const tockenAnaRes = getTockFromSimpleGrammers(grammers);
            nonTerminals = tockenAnaRes.nonTerminals;
            terminals = tockenAnaRes.terminals;
        }
        const AugumentStart = "Augument_S";
        log.log("[nonTerminals]", nonTerminals);
        log.log("[terminals]", terminals);
        let lexer = new Lexer(terminals, nonTerminals);

        const nonTerminals2DerivationMap = new Map<string,string[][]>();
        for (let grammer of grammers) {
            grammer = grammer.replaceAll(/\s/g, "");
            const arr = grammer.split(/(=>)|(->)/).filter(v => v !== "=>" && v !== "->" && v);
            const nonTerminal = arr[0];
            const derivations = arr[1].split("|").filter(v => v).map(derivation => {
                return lexer.splitDerivation(derivation);
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
        expandStateItems(this.initialStateNode.items,nonTerminals2DerivationMap,lexer);
        const allStateNodesMap = new Map<string,LRStateNode>();
        allStateNodesMap.set(stateItemsToString(this.initialStateNode.items),this.initialStateNode);
        const vis: boolean[] = [];
        let preSize = 0;
        while(true) {
            if(allStateNodesMap.size == preSize)break;
            preSize = allStateNodesMap.size;
            for(let state of allStateNodesMap.values()) {
                if(vis[state.id]) continue;
                vis[state.id] = true;
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
                    expandStateItems(matchItems,nonTerminals2DerivationMap,lexer);
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
                    expandStateItems(matchItems,nonTerminals2DerivationMap,lexer);
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
    }
    return ans;
}

function expandStateItems(items: LRStateNodeItem[],nonTerminals2DerivationMap: Map<string,string[][]>,lexer: Lexer) {
    for(let i=0;i<items.length;i++) {
        const item = items[i];
        const tocken = item.derivation[item.matchPoint];
        if(lexer.isTerminal(tocken))continue;
        const derivations = nonTerminals2DerivationMap.get(tocken);
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
            });
        });
    }
}