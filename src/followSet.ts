import generateFirstSet from "./firstSet";
import Lexer from "./lexer";
import { transferString2Grammers } from "./utils";
import { EmptyCharacter, EndingCharacter } from "./utils/const";
import log from "./utils/log";


export default function generateFllowSet(lexer: Lexer, inGrammers: Array<string>, firstSet?: GrammerSet): GrammerSet {
    log.log("[generateFllowSet start]");
    if (!firstSet) {
        firstSet = generateFirstSet(lexer, inGrammers);
    } else {
        firstSet = Array.from(firstSet);
    }
    const grammers = transferString2Grammers(lexer, inGrammers);
    log.log("[grammers after transferString2Grammers]", grammers);
    /*
        1. 将$放到FOLLOW(S)中
    */
    const followSet: GrammerSet = new Array(...grammers.map(grammer => {
        return {
            tocken: grammer.nonTerminal,
            terminals: new Set<Terminal>([EndingCharacter]),
        }
    }));
    const grammerMap = new Map<string, string[][]>();
    grammers.forEach(grammer => {
        grammerMap.set(grammer.nonTerminal, grammer.derivations);
    })
    followSet.push(...lexer.terminals.map(terminal => {
        return {
            tocken: terminal[0],
            terminals: new Set([EndingCharacter]),
            isTerminal: true
        }
    }))

    const followSetMap = new Map<string, GrammerSetLine>();
    for (let setLine of followSet) {
        followSetMap.set(setLine.tocken, setLine);
    }

    firstSet.push(...lexer.terminals.map(terminal => {
        return {
            tocken: terminal[0],
            terminals: new Set([terminal[0]]),
            isTerminal: true
        }
    }))
    const firstSetMap = new Map<string, GrammerSetLine>();
    for (let setLine of firstSet) {
        firstSetMap.set(setLine.tocken, setLine);
    }
    // 循环下面步骤 直到没有变化为止
    while (true) {
        let hasChange = false;
        /* 
            2.如果存在一个产生式A => aBb ， 那么FIRST(b) 中除ε 之外的所有符号都在FOLLOW(B)中。
            attention: A => aBCd 那么把first(Cd)加入到Follow(B)中去
        */
        grammers.forEach(grammer => {
            for (let derivation of grammer.derivations) {
                for (let i = derivation.length - 2; i >= 0; i--) {
                    const setLine = followSetMap.get(derivation[i]);
                    for (let j = i + 1; j < derivation.length; j++) {
                        const terminals = firstSetMap.get(derivation[j])!.terminals;
                        for (let terminal of terminals) {
                            if (terminal === EmptyCharacter) continue;
                            if (setLine?.terminals.has(terminal)) continue;
                            hasChange = true;
                            setLine?.terminals.add(terminal);
                        }
                        if (!terminals.has(EmptyCharacter)) break;
                    }

                }
            }
        })

        /*
            3.如果存在一个产生式 A => aB ， 或存在产生式 A => aBb 且FIRST(b) 包含 ε ，那么FOLLOW(A)中的所有符号都在FOLLOW(B)中。
        */
        grammers.forEach(grammer => {
            const pSetLine = followSetMap.get(grammer.nonTerminal);
            for (let derivation of grammer.derivations) {
                for (let i = derivation.length - 1; i >= 0; i--) {
                    const tocken = derivation[i];
                    const setLine = followSetMap.get(tocken);
                    for (let terminal of pSetLine!.terminals) {
                        if (terminal === EmptyCharacter) continue;
                        if (setLine?.terminals.has(terminal)) continue;
                        hasChange = true;
                        setLine?.terminals.add(terminal);
                    }
                    if (!firstSetMap.get(tocken)!.terminals.has(EmptyCharacter)) break;
                }
            }
        })
        if (!hasChange) break;
    }
    return followSet.filter(v => !v.isTerminal).sort((a, b) => {
        if (a.tocken < b.tocken) {
            return -1;
        } else {
            return 1;
        }
    }).map(setLine => {
        setLine.terminals = new Set(Array.from(setLine.terminals).sort((a, b) => {
            if (a < b) {
                return -1;
            } else {
                return 1;
            }
        }))
        return setLine;
    });
}
