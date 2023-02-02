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
*/
export function unionGrammers(grammers: Array<string>): Array<string> {
    let unionMap = new Map<string, Array<string>>();
    const result: Array<string> = [];
    grammers.forEach(grammer => {
        const arr = grammer.split(/(=>)|(->)/).filter(v => v !== "=>" && v !== "->" && v);
        const nonTerminal = arr[0];
        const derivation = arr[0];
        if (unionMap.has(nonTerminal)) {
            const derivations = unionMap.get(nonTerminal);
            derivations?.push(derivation);
            unionMap.set(nonTerminal, derivations!);
        } else {
            unionMap.set(nonTerminal, [derivation]);
        }
    })
    for (let nonTerminal of unionMap.keys()) {
        result.push(`${nonTerminal} => ${unionMap.get(nonTerminal)?.join(" | ")}`);
    }
    log.log(result);
    return result;
}

/*
    提左公共因子 TODO! 
*/
export function liftUpCommonTocken(grammers: Array<string>): Array<string> {
    const result: Array<string> = [];
    return result;
}

/*
    消除左递归 TODO!
    直接左递归-间接左递归
*/
export function clearRightRecursion(grammers: Array<string>): Array<string> {
    const result: Array<string> = [];
    return result;
}


