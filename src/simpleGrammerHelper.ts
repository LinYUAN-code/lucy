import Lexer from "./lexer";
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
    A -> a
    A -> c
    ===>
    A -> a | c

    并且会简单去重
*/
export function unionGrammers(grammers: Array<string>): Array<string> {
    let unionMap = new Map<string, Array<string>>();
    const result: Array<string> = [];
    grammers.forEach(grammer => {
        grammer = grammer.replaceAll(/\s/g, "");
        const arr = grammer.split(/(=>)|(->)/).filter(v => v !== "=>" && v !== "->" && v);
        const nonTerminal = arr[0];
        const derivation = arr[1];
        if (unionMap.has(nonTerminal)) {
            const derivations = unionMap.get(nonTerminal);
            derivations?.push(derivation);
            unionMap.set(nonTerminal, derivations!);
        } else {
            unionMap.set(nonTerminal, [derivation]);
        }
    })
    for (let nonTerminal of unionMap.keys()) {
        const derivations = [...new Set(unionMap.get(nonTerminal)!)];
        result.push(`${nonTerminal} => ${derivations.join("|")}`.split("|").join(" | "));
    }
    log.log(result);
    return result;
}

/*
    提左公共因子 TODO! 
    A => Ba | Bb 
    A => BA'
    A' => a | b 
*/
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
                    newDerivation.push(tocken + firstTocken2DerivationsMap.get(tocken)![0]);
                    continue;
                }
                const derivations = firstTocken2DerivationsMap.get(tocken);
                // 可以提取公因子
                const newUnTerminal = lexer.getNewNonTerminal(nonTerminal);
                newDerivation.push(tocken + newUnTerminal);
                newAddGrammers.push(newUnTerminal + " => " + derivations?.map(v => v.join("")).join(" | "));
            }
            return nonTerminal + " => " + newDerivation.join(" | ");
        });
        const newResult = [...tmpResult, ...newAddGrammers];
        console.log("[com]", result, newResult);
        if (result.length === newResult.length) {
            break;
        }
        result = newResult;
    }
    return result;
}

/*
    消除左递归 TODO!
    直接左递归-间接左递归
    要求： 输入文法不含有EmptyCharater 和 环
*/
export function clearRightRecursion(grammers: Array<string>, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): Array<string> {
    const result: Array<string> = [];
    if (!nonTerminals || !terminals) {
        const tockenAnaRes = getTockFromSimpleGrammers(grammers);
        nonTerminals = tockenAnaRes.nonTerminals;
        terminals = tockenAnaRes.terminals;
    }
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
    let lexer = new Lexer(terminals, nonTerminals);
    for (let i = 0; i < nonTerminals.length; i++) {
        // 替换产生式
        for (let j = 0; j < i; j++) {

        }
        // 消除左递归
    }

    return result;
}


