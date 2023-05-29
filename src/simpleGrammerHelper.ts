import Lexer from "./lexer";
import { NonTerminal, Terminal } from "./types/type";
import { EmptyCharacter } from "./utils/const";
import log from "./utils/log";

/*
    如果用户输入的是书上那种简单文法，该函数自动识别出终结符和非终结符
    非终结符: /^[A-Z]'* /
    终结符: /[a-z|\u0391-\u03C9]/  (小写字母以及Greek Symbols)
    ex: https://unicode-table.com/en/sets/greek-symbols/
    推导符号: => ->
*/
const simpleNonTerminalReg = /^[A-Z]'*/;
const simpleTerminalReg = /[a-z|\u0391-\u03C9]/;
const otherTerminal=['(',')','+','*','-'];
export function getTockFromSimpleGrammers(inGrammers: Array<string>): {
    nonTerminals: Array<string>,
    terminals: Array<[string, RegExp]>,
} {
    const nonTerminals: Set<string> = new Set();
    const terminals: Set<string> = new Set();
    inGrammers.forEach(grammer => {
        const arr = grammer.replaceAll(/\s/g, "").split(/(=>)|(->)/).filter(v => v !== "=>" && v !== "->" && v);
        const nonTerminal = arr[0];
        nonTerminals.add(nonTerminal);
        arr[1].split("|").filter(v => v && v !== "|").forEach(derivation => {
            while (derivation.length) {
                let matchResult = null;
                matchResult = derivation.match(simpleNonTerminalReg);
                // 切割ABC这种非终结符
                if (matchResult) {
                    nonTerminals.add(matchResult[0]);
                    derivation = derivation.slice(matchResult[0].length);
                    continue;
                }
                matchResult = derivation.match(simpleTerminalReg);
                if (matchResult) {
                    terminals.add(JSON.stringify([matchResult[0], "^" + matchResult[0]]));
                    derivation = derivation.slice(matchResult[0].length);
                    continue;
                }
                throw new Error(`[getTockFromSimpleGrammers error] cant recognize the character remaining: ${derivation}`);
            }
        })
    })
    return {
        nonTerminals: Array.from(nonTerminals).sort((a, b) => {
            // 做一个简单排序 防止B 和 B' 冲突
            return b.length - a.length;
        }),
        terminals: Array.from(terminals).map(jsonData => {
            const terminal = JSON.parse(jsonData);
            terminal[1] = new RegExp(terminal[1]);
            return terminal;
        })
    }
}

/*
    检测文法是否需要简单合并去重
*/
export function checkNeedunionGrammers(grammers: Array<string>): boolean {
    let unionMap = new Map<string, Array<string>>();
    for (let grammer of grammers) {
        grammer = grammer.replaceAll(/\s/g, "");
        const arr = grammer.split(/(=>)|(->)/).filter(v => v !== "=>" && v !== "->" && v);
        const nonTerminal = arr[0];
        const derivation = arr[1];
        if (unionMap.has(nonTerminal)) {
            return true;
        } else {
            unionMap.set(nonTerminal, [derivation]);
        }
    }
    return false;
}
/*
    A -> a
    A -> c
    ===>
    A -> a | c

    并且会简单去重
*/
export function unionGrammers(grammers: Array<string>, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): Array<string> {
    let unionMap = new Map<string, Array<string>>();
    const result: Array<string> = [];
    if (!nonTerminals || !terminals) {
        const tockenAnaRes = getTockFromSimpleGrammers(grammers);
        nonTerminals = tockenAnaRes.nonTerminals;
        terminals = tockenAnaRes.terminals;
    }
    let lexer = new Lexer(terminals, nonTerminals);
    grammers.forEach(grammer => {
        grammer = grammer.replaceAll(/\s/g, "");
        const arr = grammer.split(/(=>)|(->)/).filter(v => v !== "=>" && v !== "->" && v);
        const nonTerminal = arr[0];
        const derivations = arr[1].split("|").filter(v => v).map(derivation => {
            log.log("[debug]", result);
            return lexer.splitDerivation(derivation);
        })

        if (unionMap.has(nonTerminal)) {
            const arr = unionMap.get(nonTerminal);
            derivations.forEach(derivation=>{
                const deri = derivation.join(" ");
                if(arr?.indexOf(deri) === -1) {
                    arr.push(deri);
                }
            })
        } else {
            unionMap.set(nonTerminal, derivations.map(derivation=>{
                return derivation.join(" ");
            }));
        }
    })
    for (let nonTerminal of unionMap.keys()) {
        const derivations = [...new Set(unionMap.get(nonTerminal)!)];
        result.push(`${nonTerminal} -> ${derivations.join("|")}`.split("|").join(" | "));
    }
    log.log(result);
    return result;
}

/*
    检测是否需要进行提左公共因子
*/
export function checkNeedliftUpCommonTocken(grammers: Array<string>, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): boolean {
    let result: Array<string> = grammers;
    if (!nonTerminals || !terminals) {
        const tockenAnaRes = getTockFromSimpleGrammers(grammers);
        nonTerminals = tockenAnaRes.nonTerminals;
        terminals = tockenAnaRes.terminals;
    }
    let lexer = new Lexer(terminals, nonTerminals);
    for (let grammer of result) {
        grammer = grammer.replaceAll(/\s/g, "");
        const arr = grammer.split(/(=>)|(->)/).filter(v => v !== "=>" && v !== "->" && v);
        const derivations = arr[1].split("|").filter(v => v).map(derivation => {
            log.log("[debug]", result);
            return lexer.splitDerivation(derivation);
        })
        const firstTocken2DerivationsMap = new Map<NonTerminal | Terminal, string[][]>();
        derivations.forEach(derivation => {
            let arr = firstTocken2DerivationsMap.get(derivation[0]);
            if (!arr) {
                arr = [derivation.slice(1)];
            } else {
                arr.push(derivation.slice(1));
            }
            firstTocken2DerivationsMap.set(derivation[0], arr);
        })
        for (let tocken of firstTocken2DerivationsMap.keys()) {
            if (firstTocken2DerivationsMap.get(tocken)?.length === 1) {
                continue;
            }
            return true;
        }
    }
    return false;
}
export function liftUpCommonTocken(grammers: Array<string>, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): Array<string> {
    let result: Array<string> = grammers;
    if (!nonTerminals || !terminals) {
        const tockenAnaRes = getTockFromSimpleGrammers(grammers);
        nonTerminals = tockenAnaRes.nonTerminals;
        terminals = tockenAnaRes.terminals;
    }
    let lexer = new Lexer(terminals, nonTerminals);
    while (true) {
        let newAddGrammers: string[] = [];
        const tmpResult = result.map(grammer => {
            grammer = grammer.replaceAll(/\s/g, "");
            const arr = grammer.split(/(=>)|(->)/).filter(v => v !== "=>" && v !== "->" && v);
            const nonTerminal = arr[0];
            const derivations = arr[1].split("|").filter(v => v).map(derivation => {
                log.log("[debug]", result);
                return lexer.splitDerivation(derivation);
            })
            const newDerivation = [];
            const firstTocken2DerivationsMap = new Map<NonTerminal | Terminal, string[][]>();
            derivations.forEach(derivation => {
                let arr = firstTocken2DerivationsMap.get(derivation[0]);
                if (!arr) {
                    arr = [derivation.slice(1)];
                } else {
                    arr.push(derivation.slice(1));
                }
                firstTocken2DerivationsMap.set(derivation[0], arr);
            })
            for (let tocken of firstTocken2DerivationsMap.keys()) {
                if (firstTocken2DerivationsMap.get(tocken)?.length === 1) {
                    newDerivation.push(tocken + firstTocken2DerivationsMap.get(tocken)![0].join(""));
                    continue;
                }
                const derivations = firstTocken2DerivationsMap.get(tocken);
                // 可以提取公因子
                const newUnTerminal = lexer.getNewNonTerminal(nonTerminal);
                newDerivation.push(tocken + newUnTerminal);
                newAddGrammers.push(newUnTerminal + " -> " + derivations?.map(v => v.join(" ")).join(" | "));
            }
            return nonTerminal + " -> " + newDerivation.join(" | ");
        });
        log.log("[pre]", tmpResult, newAddGrammers);
        const newResult = [...tmpResult, ...newAddGrammers];
        log.log("[com]", result, newResult);
        if (result.length === newResult.length) {
            break;
        }
        result = newResult;
    }
    return result;
}
/*
    检查是否需要清楚左递归
*/
export function checkNeedClearRightRecursion(grammers: Array<string>, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): boolean {
    const result: Array<string> = [];
    if (!nonTerminals || !terminals) {
        const tockenAnaRes = getTockFromSimpleGrammers(grammers);
        nonTerminals = tockenAnaRes.nonTerminals;
        terminals = tockenAnaRes.terminals;
    }
    log.log("[nonTerminals]", nonTerminals);
    log.log("[terminals]", terminals);
    let lexer = new Lexer(terminals, nonTerminals);
    const nonTerminals2DerivationMap = new Map<NonTerminal, string[][]>();
    for (let grammer of grammers) {
        grammer = grammer.replaceAll(/\s/g, "");
        const arr = grammer.split(/(=>)|(->)/).filter(v => v !== "=>" && v !== "->" && v);
        const nonTerminal = arr[0];
        const derivations = arr[1].split("|").filter(v => v).map(derivation => {
            return lexer.splitDerivation(derivation);
        });
        nonTerminals2DerivationMap.set(nonTerminal, derivations);
    }
    log.log("[nonTerminals2DerivationMap]", nonTerminals2DerivationMap);
    for (let i = 0; i < nonTerminals.length; i++) {
        const gI = nonTerminals2DerivationMap.get(nonTerminals[i]);
        // 消除左递归
        for (let j = gI!.length - 1; j >= 0; j--) {
            const grammer = gI![j];
            if (grammer[0] === nonTerminals[i]) {
                // 存在左递归
                return true;
            }
        }
    }
    return false;
}
/*
    消除左递归
    直接左递归-间接左递归
    要求： 输入文法不含有EmptyCharater 和 环
*/
// TODO! clearLeftRecursion 名字打错了要改
export function clearRightRecursion(grammers: Array<string>, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): Array<string> {
    const result: Array<string> = [];
    if (!nonTerminals || !terminals) {
        const tockenAnaRes = getTockFromSimpleGrammers(grammers);
        nonTerminals = tockenAnaRes.nonTerminals;
        terminals = tockenAnaRes.terminals;
    }
    log.log("[nonTerminals]", nonTerminals);
    log.log("[terminals]", terminals);
    let lexer = new Lexer(terminals, nonTerminals);
    const nonTerminals2DerivationMap = new Map<NonTerminal, string[][]>();
    for (let grammer of grammers) {
        grammer = grammer.replaceAll(/\s/g, "");
        const arr = grammer.split(/(=>)|(->)/).filter(v => v !== "=>" && v !== "->" && v);
        const nonTerminal = arr[0];
        const derivations = arr[1].split("|").filter(v => v).map(derivation => {
            return lexer.splitDerivation(derivation);
        });
        nonTerminals2DerivationMap.set(nonTerminal, derivations);
    }
    log.log("[nonTerminals2DerivationMap]", nonTerminals2DerivationMap);
    for (let i = 0; i < nonTerminals.length; i++) {
        const gI = nonTerminals2DerivationMap.get(nonTerminals[i]);
        // 替换产生式
        for (let j = 0; j < i; j++) {
            const gJ = nonTerminals2DerivationMap.get(nonTerminals[j]);
            for (let k = gI!.length - 1; k >= 0; k--) {
                const grammer = gI![k];
                if (grammer[0] === nonTerminals[j]) {
                    // replace
                    log.log(grammer, nonTerminals[j]);
                    for (let jgrammer of gJ!) {
                        log.log("[-]", jgrammer);
                        gI?.push([...jgrammer, ...grammer.slice(1)]);
                    }
                    gI?.splice(k, 1);
                }
            }
        }
        const needHandleIndex: number[] = [];
        // 消除左递归
        for (let j = gI!.length - 1; j >= 0; j--) {
            const grammer = gI![j];
            if (grammer[0] === nonTerminals[i]) {
                // 存在左递归
                needHandleIndex.push(j);
            }
        }
        if (needHandleIndex.length) {
            const newNonTerminalTocken = lexer.getNewNonTerminal(nonTerminals[i]);
            const newGrammers: string[][] = [];
            const newNonTerminalGrammers: string[][] = [];

            for (let j = gI!.length - 1; j >= 0; j--) {
                if (needHandleIndex.indexOf(j) !== -1) continue;
                // EmptyCharacter作为首个符号 没有意义
                newGrammers.push([...(gI![j][0] === EmptyCharacter ? gI![j].slice(1) : gI![j]), newNonTerminalTocken]);
            }
            for (let index of needHandleIndex) {
                newNonTerminalGrammers.push([...gI![index].slice(1), newNonTerminalTocken])
            }
            newNonTerminalGrammers.push([EmptyCharacter]);
            nonTerminals2DerivationMap.set(nonTerminals[i], [...newGrammers, ...(needHandleIndex.length ? [] : gI!)]);
            nonTerminals2DerivationMap.set(newNonTerminalTocken, newNonTerminalGrammers);
        }
        log.log("[nonTerminals2DerivationMap in process]", nonTerminals2DerivationMap, gI);
    }
    for (let nonTerminal of nonTerminals2DerivationMap.keys()) {
        const derivation: string = nonTerminals2DerivationMap.get(nonTerminal)!.map(derivation => {
            return derivation.join(" ");
        }).join(" | ");
        result.push(`${nonTerminal} -> ${derivation}`);
    }
    return result;
}


