import Lexer from "./lexer";
import { transferString2Grammers } from "./utils"
import { EmptyCharacter } from "./utils/const";
import log from "./utils/log";

export default function generateFirstSet(lexer: Lexer, inGrammers: Array<string>): GrammerSet {
    log.log("[generateFirstSet start]");
    const grammers = transferString2Grammers(lexer, inGrammers);
    log.log("[grammers after transferString2Grammers]", grammers);
    const firstSet: GrammerSet = new Array(...grammers.map(grammer => {
        return {
            tocken: grammer.nonTerminal,
            terminals: new Set<Terminal>(),
        }
    }));
    const grammerMap = new Map<string, string[][]>();
    grammers.forEach(grammer => {
        grammerMap.set(grammer.nonTerminal, grammer.derivations);
    })
    /* 
        如果X式一个终结符号，那么FIRST(X) = X 
    */
    firstSet.push(...lexer.terminals.map(terminal => {
        return {
            tocken: terminal[0],
            terminals: new Set([terminal[0]]),
            isTerminal: true
        }
    }))
    /* 
        如果 X => ε 是一个产生式，那么将e加人到 FIRST（X)中。
    */
    firstSet.forEach(setLine => {
        if (setLine.isTerminal) return;
        for (let derivation of grammerMap.get(setLine.tocken)!) {
            if (derivation.length === 1 && derivation[0] === EmptyCharacter && !setLine.terminals.has(EmptyCharacter)) {
                setLine.terminals.add(EmptyCharacter);
            }
        }
    })
    const firstSetMap = new Map<string, GrammerSetLine>();
    for (let setLine of firstSet) {
        firstSetMap.set(setLine.tocken, setLine);
    }
    // 循环下面步骤 直到没有变化为止
    while (true) {
        let hasChange = false;
        /* 
            A => B0B1B2B3
            i = 0
            FIRST(Bi) - EmptyCharacter 加入到 FIRST(A)中
            如果FIRST(B1)不含有EmptyCharacter退出循环
            
            若B0-B3均含有EmptyCharacter 将EmptyCharacter加入到FIRST(A)中
        */
        firstSet.forEach(setLine => {
            if (setLine.isTerminal) return;
            for (let derivation of grammerMap.get(setLine.tocken)!) {
                for (let i = 0; i < derivation.length; i++) {
                    const tocken = derivation[i];
                    if (lexer.isTerminal(tocken)) {
                        if (!setLine.terminals.has(tocken)) {
                            log.log(tocken);
                            hasChange = true;
                            setLine.terminals.add(tocken);
                        }
                        if (tocken !== EmptyCharacter) {
                            break;
                        }
                    } else {
                        const nextSetLine = firstSetMap.get(tocken)!;
                        nextSetLine.terminals.forEach(terminal => {
                            if (terminal !== EmptyCharacter) {
                                if (!setLine.terminals.has(terminal)) {
                                    hasChange = true;
                                    setLine.terminals.add(terminal)
                                }
                            }
                        });
                        if (!nextSetLine.terminals.has(EmptyCharacter)) {
                            break;
                        }
                    }
                    if (i === derivation.length - 1) {
                        setLine.terminals.add(EmptyCharacter);
                    }
                }
            }
        })
        if (!hasChange) break;
    }
    return firstSet.filter(v => !v.isTerminal).sort((a, b) => {
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




export function getDerivationFirstSet(lexer: Lexer, derivation: string[], firstSetMap: Map<NonTerminal, GrammerSetLine>): GrammerSetLine {
    const terminals = new Set<Terminal>();
    for (let i = 0; i < derivation.length; i++) {
        const tocken = derivation[i];
        if (lexer.isTerminal(tocken)) {
            if (tocken !== EmptyCharacter) {
                terminals.add(tocken);
                break;
            }
        } else {
            firstSetMap.get(tocken)?.terminals.forEach(terminal => {
                terminals.add(terminal);
            })
            if (!firstSetMap.get(tocken)!.terminals.has(EmptyCharacter)) {
                break;
            }
        }
        if (i === derivation.length - 1) {
            terminals.add(EmptyCharacter);
        }
    }
    return {
        tocken: derivation.join(""),
        terminals,
    }
}

export function* generateFirstSetProgressive(lexer: Lexer, inGrammers: Array<string>): IterableIterator<Rule | Process<GrammerSet>> {
    yield [
        "1. 如果X式一个终结符号，那么FIRST(X) = X ",
        "2. 如果 X => ε 是一个产生式，那么将e加人到 FIRST（X)中。",
        `3. A => B0B1B2B3
            i = 0
            FIRST(Bi) - EmptyCharacter 加入到 FIRST(A)中
            如果FIRST(B1)不含有EmptyCharacter退出循环
            若B0 - B3均含有EmptyCharacter 将EmptyCharacter加入到FIRST(A)中
        `,
        "4. 去除所有终结符号的表项",
    ]
    log.log("[generateFirstSet start]");
    const grammers = transferString2Grammers(lexer, inGrammers);
    log.log("[grammers after transferString2Grammers]", grammers);
    const firstSet: GrammerSet = new Array(...grammers.map(grammer => {
        return {
            tocken: grammer.nonTerminal,
            terminals: new Set<Terminal>(),
        }
    }));
    const grammerMap = new Map<string, string[][]>();
    grammers.forEach(grammer => {
        grammerMap.set(grammer.nonTerminal, grammer.derivations);
    })
    /* 
        如果X式一个终结符号，那么FIRST(X) = X 
    */
    firstSet.push(...lexer.terminals.map(terminal => {
        return {
            tocken: terminal[0],
            terminals: new Set([terminal[0]]),
            isTerminal: true
        }
    }))
    yield {
        ruleIndex: 0,
        result: firstSet
    };
    /* 
        如果 X => ε 是一个产生式，那么将e加人到 FIRST（X)中。
    */
    firstSet.forEach(setLine => {
        if (setLine.isTerminal) return;
        for (let derivation of grammerMap.get(setLine.tocken)!) {
            if (derivation.length === 1 && derivation[0] === EmptyCharacter && !setLine.terminals.has(EmptyCharacter)) {
                setLine.terminals.add(EmptyCharacter);
            }
        }
    })
    yield {
        ruleIndex: 1,
        result: firstSet
    };
    const firstSetMap = new Map<string, GrammerSetLine>();
    for (let setLine of firstSet) {
        firstSetMap.set(setLine.tocken, setLine);
    }
    // 循环下面步骤 直到没有变化为止
    while (true) {
        let hasChange = false;
        /* 
            A => B0B1B2B3
            i = 0
            FIRST(Bi) - EmptyCharacter 加入到 FIRST(A)中
            如果FIRST(B1)不含有EmptyCharacter退出循环
            
            若B0-B3均含有EmptyCharacter 将EmptyCharacter加入到FIRST(A)中
        */
        firstSet.forEach(setLine => {
            if (setLine.isTerminal) return;
            for (let derivation of grammerMap.get(setLine.tocken)!) {
                for (let i = 0; i < derivation.length; i++) {
                    const tocken = derivation[i];
                    if (lexer.isTerminal(tocken)) {
                        if (!setLine.terminals.has(tocken)) {
                            log.log(tocken);
                            hasChange = true;
                            setLine.terminals.add(tocken);
                        }
                        if (tocken !== EmptyCharacter) {
                            break;
                        }
                    } else {
                        const nextSetLine = firstSetMap.get(tocken)!;
                        nextSetLine.terminals.forEach(terminal => {
                            if (terminal !== EmptyCharacter) {
                                if (!setLine.terminals.has(terminal)) {
                                    hasChange = true;
                                    setLine.terminals.add(terminal)
                                }
                            }
                        });
                        if (!nextSetLine.terminals.has(EmptyCharacter)) {
                            break;
                        }
                    }
                    if (i === derivation.length - 1) {
                        setLine.terminals.add(EmptyCharacter);
                    }
                }
            }
        })
        if (!hasChange) break;
        yield {
            ruleIndex: 2,
            result: firstSet
        };
    }
    yield {
        ruleIndex: 3,
        result: firstSet.filter(v => !v.isTerminal).sort((a, b) => {
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
        })
    }
}