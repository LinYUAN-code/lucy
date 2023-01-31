import Lexer from "./lexer";
import { isSetIncludes, transferString2Grammers } from "./utils"
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
            如果叉是一个非终结符号，且8一子上⋯！是一个产生式，其中么三1，那么如果对于某个i,a在FIRST(Y.)中且e在所有的 FIRST(F)、FIRST（Y2）、•、FIRSTC¥.-1)中，就把。加人到
            FIRST(X)中。也就是说，V⋯V;一1三E。如果对于所有的j=1，2，⋯，后，E在FIRST（¥)中，那么将e加人到 FIRST(X)中。比如，FIRST（¥）中的所有符号一定在FIRST(8)中。
            如果丫，不能推导出e，那么我们就不会再向FIRST(X)中加人任何符号，但是期果上，三e，那么我们就加上
            FIRST（Y2），依此类推。 
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