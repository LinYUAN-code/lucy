import { getDerivationFirstSetWithMap } from "@/firstSet";
import Lexer from "@/lexer";
import { AstNode, Grammer, GrammerSet, GrammerSetLine, NonTerminal, PredictLine, PredictProcessLine, PredictTable, Process, Rule, Terminal } from "@/types/type";
import { transferString2Grammers } from "@/utils";
import { EmptyCharacter, EndingCharacter } from "@/utils/const";
import log from "@/utils/log";

export default function generatorPredictTable(
    lexer: Lexer,
    inGrammers: Array<string>,
    firstSet: GrammerSet,
    followSet: GrammerSet,
): PredictTable {
    /*
    对语法中的每条产生式： A -> u ：
      (1)对 First(u) 中的所有终结符 a （不含 ε ），置 M[A, a] = “A -> u” ；
      (2)若 First(u) 含 ε ，则对 Follow(A) 中的所有符号 a （可含 $ ），置 M[A, a] = “A -> u” 
  */
    const grammers = transferString2Grammers(lexer, inGrammers);
    const predictTable: PredictTable = [];
    const nonTerminal2TableRowMap = new Map<NonTerminal, PredictLine>();
    lexer.nonTerminals.forEach(nonTerminal => {
        const tableLine = {
            nonTerminal: nonTerminal,
            terminal2Derivation: new Map<Terminal, Grammer>(),
        };
        nonTerminal2TableRowMap.set(nonTerminal, tableLine);
        predictTable.push(tableLine);
    })
    const nonTerminal2FirstSetMap = new Map<NonTerminal, GrammerSetLine>();
    const nonTerminal2FollowSetLine = new Map<NonTerminal, GrammerSetLine>();
    for (let setLine of followSet) {
        nonTerminal2FollowSetLine.set(setLine.tocken, setLine);
    }
    for (let setLine of firstSet) {
        nonTerminal2FirstSetMap.set(setLine.tocken, setLine);
    }
    grammers.forEach(grammer => {
        for (let derivation of grammer.derivations) {
            const derivationFirstSet = getDerivationFirstSetWithMap(lexer, derivation, nonTerminal2FirstSetMap);
            const tableLine = nonTerminal2TableRowMap.get(grammer.nonTerminal);
            log.log(derivationFirstSet);
            // (1)对 First(u) 中的所有终结符 a （不含 ε ），置 M[A, a] = “A -> u” ；
            let hasSet: Map<string,boolean> = new Map();
            for (let terminal of derivationFirstSet.terminals) {
                if (terminal === EmptyCharacter) continue;
                let cellGrammer: Grammer | undefined = tableLine?.terminal2Derivation.get(terminal);
                hasSet.set(terminal,true);
                if (!cellGrammer) {
                    cellGrammer = {
                        nonTerminal: grammer.nonTerminal,
                        derivations: []
                    };
                    tableLine?.terminal2Derivation.set(terminal, cellGrammer);
                }
                cellGrammer.derivations.push(derivation);
            }
            // (2)若 First(u) 含 ε ，则对 Follow(A) 中的所有符号 a （可含 $ ），置 M[A, a] = “A -> u” 
            if (derivationFirstSet.terminals.has(EmptyCharacter)) {
                for (let terminal of nonTerminal2FollowSetLine.get(grammer.nonTerminal)!.terminals) {
                    if(hasSet.has(terminal))continue;
                    let cellGrammer: Grammer | undefined = tableLine?.terminal2Derivation.get(terminal);
                    if (!cellGrammer) {
                        cellGrammer = {
                            nonTerminal: grammer.nonTerminal,
                            derivations: []
                        };
                        tableLine?.terminal2Derivation.set(terminal, cellGrammer);
                    }
                    cellGrammer.derivations.push(derivation);
                }
            }
        }
    })
    return predictTable;
}


export function checkPredickTableIsValid(lexer: Lexer, table: PredictTable): boolean {
    // 每一Cell最多只能有一个推导式 
    for (let terminal of lexer.terminals) {
        const tocken = terminal[0];
        table.forEach(tableLine => {
            const t2d = tableLine.terminal2Derivation.get(tocken);
            if (t2d) {
                if (t2d.derivations.length > 1) {
                    return false;
                }
            }
        })
    }
    return true;
}

export function predict(lexer: Lexer, table: PredictTable, _input: string, parseStartNonTerminal: NonTerminal): Array<PredictProcessLine> {
    let input = _input.replaceAll(/\s/g, "");
    const predictProcess: Array<PredictProcessLine> = [];
    let astIdx = 1;
    const astNode: AstNode = {
        id: 0,
        text: parseStartNonTerminal,
        check: false,
    };
    const astStack = [astNode];
    let currentState: PredictProcessLine = {
        parseStack: [EndingCharacter, parseStartNonTerminal],
        remainingInput: _input,
        parseAction: "",
    }
    lexer.setSource(input);
    const nonTerminal2TableRowMap = new Map<NonTerminal, PredictLine>();
    table.forEach(tableLine => {
        nonTerminal2TableRowMap.set(tableLine.nonTerminal, tableLine);
    })
    try {
        while (true) {
            // 取出栈顶元素
            const tocken = currentState.parseStack[currentState.parseStack.length - 1];
            if (lexer.isTerminal(tocken)) {
                const terminal = lexer.next();
                if (tocken === terminal.tocken) {
                    // match success
                    currentState.parseAction = `match ${terminal.tocken}${terminal.tocken===terminal.origin?"":": "+terminal.origin}`
                    predictProcess.push(currentState);
                    currentState = JSON.parse(JSON.stringify(currentState));
                    lexer.pop();
                    currentState.parseAction = "";
                    currentState.remainingInput = lexer.remainString();
                    currentState.parseStack.pop();
                    if (currentState.parseStack.length === 0) {
                        break;
                    }
                    const astNode = astStack.pop()!;
                    if(!astNode.children) {
                        astNode.children = [];
                    }
                    astNode.children.push({
                        id: astIdx++,
                        text: terminal.origin,
                        check: false,
                    })
                } else {
                    throw new Error(`[预测错误] 非终结符匹配错误: ${tocken} stack: ${currentState.parseStack} 剩余字符串: ${lexer.remainString()}`);
                    // throw new Error(`[predict error] terminal match error tocken: ${tocken} stack: ${currentState.parseStack} remainingInput: ${lexer.remainString()}`);
                }
                continue;
            }
        
            const terminal = lexer.next();
            const tableLine: PredictLine = nonTerminal2TableRowMap.get(tocken)!;
            const grammer: Grammer = tableLine!.terminal2Derivation.get(terminal.tocken);
            if (grammer?.derivations?.length !== 1) {
                throw new Error(`[预测错误] 分析输入错误  终结符: ${terminal}   剩余字符串: ${lexer.remainString()} 文法: ${grammer} `);
                // throw new Error(`[predict error] parse input fail \n terminal: ${terminal} \n  remainingInput: ${lexer.remainString()} \n grammer: ${grammer} `);
            }
            currentState.parseAction = `Predict ${grammer.nonTerminal} -> ${grammer.derivations[0].join(" ")}`;
            log.log("[predict State]", currentState);
            predictProcess.push(currentState);
            currentState = JSON.parse(JSON.stringify(currentState));
            currentState.parseStack.pop();
            const astNode = astStack.pop()!;
            const derivation = grammer.derivations[0].filter(char => char !== EmptyCharacter);
            if(!astNode.children) {
                astNode.children = [];
            }
            for(let tocken of derivation) {
                astNode.children.push({
                    id: astIdx++,
                    text: tocken,
                    check: false,
                })
            }
            astStack.push(...[...astNode.children].reverse());
            currentState.parseStack.push(...derivation.reverse());
            currentState.parseAction = "";
            currentState.remainingInput = lexer.remainString();
        }
    } catch(e: any) {
        currentState.parseAction = e.toString();
        predictProcess.push(currentState);
    }
    (predictProcess as any).astNode = astNode
    return predictProcess;
}

export function* predictProgressive(lexer: Lexer, table: PredictTable, _input: string, parseStartNonTerminal: NonTerminal): IterableIterator<Array<PredictProcessLine>> {
    let input = _input.replaceAll(/\s/g, "");
    const predictProcess: Array<PredictProcessLine> = [];
    let astIdx = 1;
    const astNode: AstNode = {
        id: 0,
        text: parseStartNonTerminal,
        check: false,
    };
    (predictProcess as any).astNode = astNode
    const astStack = [astNode];
    let currentState: PredictProcessLine = {
        parseStack: [EndingCharacter, parseStartNonTerminal],
        remainingInput: _input,
        parseAction: "",
    }
    lexer.setSource(input);
    const nonTerminal2TableRowMap = new Map<NonTerminal, PredictLine>();
    table.forEach(tableLine => {
        nonTerminal2TableRowMap.set(tableLine.nonTerminal, tableLine);
    })
    yield predictProcess;
    try {
        while (true) {
            // 取出栈顶元素
            const tocken = currentState.parseStack[currentState.parseStack.length - 1];
            if (lexer.isTerminal(tocken)) {
                const terminal = lexer.next();
                if (tocken === terminal.tocken) {
                    // match success
                    currentState.parseAction = `match ${terminal.tocken}${terminal.tocken===terminal.origin?"":": "+terminal.origin}`
                    predictProcess.push(currentState);
                    currentState = JSON.parse(JSON.stringify(currentState));
                    lexer.pop();
                    currentState.parseAction = "";
                    currentState.remainingInput = lexer.remainString();
                    currentState.parseStack.pop();
                    if (currentState.parseStack.length === 0) {
                        break;
                    }
                    const astNode = astStack.pop()!;
                    if(!astNode.children) {
                        astNode.children = [];
                    }
                    astNode.children.push({
                        id: astIdx++,
                        text: terminal.origin,
                        check: false,
                    })
                } else {
                    throw new Error(`[预测错误] 非终结符匹配错误: ${tocken} stack: ${currentState.parseStack} 剩余字符串: ${lexer.remainString()}`);
                    // throw new Error(`[predict error] terminal match error tocken: ${tocken} stack: ${currentState.parseStack} remainingInput: ${lexer.remainString()}`);
                }
                yield predictProcess;
                continue;
            }
        
            const terminal = lexer.next();
            const tableLine: PredictLine = nonTerminal2TableRowMap.get(tocken)!;
            const grammer: Grammer = tableLine!.terminal2Derivation.get(terminal.tocken);
            if (grammer?.derivations?.length !== 1) {
                throw new Error(`[预测错误] 分析输入错误  终结符: ${terminal}   剩余字符串: ${lexer.remainString()} 文法: ${grammer} `);
                // throw new Error(`[predict error] parse input fail \n terminal: ${terminal} \n  remainingInput: ${lexer.remainString()} \n grammer: ${grammer} `);
            }
            currentState.parseAction = `Predict ${grammer.nonTerminal} -> ${grammer.derivations[0].join(" ")}`;
            log.log("[predict State]", currentState);
            predictProcess.push(currentState);
            currentState = JSON.parse(JSON.stringify(currentState));
            currentState.parseStack.pop();
            const astNode = astStack.pop()!;
            const derivation = grammer.derivations[0].filter(char => char !== EmptyCharacter);
            if(!astNode.children) {
                astNode.children = [];
            }
            for(let tocken of derivation) {
                astNode.children.push({
                    id: astIdx++,
                    text: tocken,
                    check: false,
                })
            }
            astStack.push(...[...astNode.children].reverse());
            currentState.parseStack.push(...derivation.reverse());
            currentState.parseAction = "";
            currentState.remainingInput = lexer.remainString();
            yield predictProcess;
        }
    } catch(e: any) {
        currentState.parseAction = e.toString();
        predictProcess.push(currentState);
    }
    (predictProcess as any).astNode = astNode
    return predictProcess;
}

export function* generatePredictTableProgressive(
    lexer: Lexer,
    inGrammers: Array<string>,
    firstSet: GrammerSet,
    followSet: GrammerSet,
): IterableIterator<Rule | Process<PredictTable>> {
    /*
    对语法中的每条产生式： A -> u ：
      (1)对 First(u) 中的所有终结符 a （不含 ε ），置 M[A, a] = A -> u
      (2)若 First(u) 含 ε ，则对 Follow(A) 中的所有符号 a （可含 $ ），置 M[A, a] = A -> u
  */
    yield [
        "1. 对 First(u) 中的所有终结符 a （不含 ε ），置 M[A, a] = A -> u",
        "2. 若 First(u) 含 ε ，则对 Follow(A) 中的所有符号 a （可含 $ ），置 M[A, a] = A -> u"
    ]
    const grammers = transferString2Grammers(lexer, inGrammers);
    const predictTable: PredictTable = [];
    const nonTerminal2TableRowMap = new Map<NonTerminal, PredictLine>();
    lexer.nonTerminals.forEach(nonTerminal => {
        const tableLine = {
            nonTerminal: nonTerminal,
            terminal2Derivation: new Map<Terminal, Grammer>(),
        };
        nonTerminal2TableRowMap.set(nonTerminal, tableLine);
        predictTable.push(tableLine);
    })
    const nonTerminal2FirstSetMap = new Map<NonTerminal, GrammerSetLine>();
    const nonTerminal2FollowSetLine = new Map<NonTerminal, GrammerSetLine>();
    for (let setLine of followSet) {
        nonTerminal2FollowSetLine.set(setLine.tocken, setLine);
    }
    for (let setLine of firstSet) {
        nonTerminal2FirstSetMap.set(setLine.tocken, setLine);
    }
    for (let grammer of grammers) {
        for (let derivation of grammer.derivations) {
            const derivationFirstSet = getDerivationFirstSetWithMap(lexer, derivation, nonTerminal2FirstSetMap);
            const tableLine = nonTerminal2TableRowMap.get(grammer.nonTerminal);
            log.log(derivationFirstSet);
            // (1)对 First(u) 中的所有终结符 a （不含 ε ），置 M[A, a] = “A -> u” ；
            for (let terminal of derivationFirstSet.terminals) {
                if (terminal === EmptyCharacter) continue;
                let cellGrammer: Grammer | undefined = tableLine?.terminal2Derivation.get(terminal);
                if (!cellGrammer) {
                    cellGrammer = {
                        nonTerminal: grammer.nonTerminal,
                        derivations: []
                    };
                    tableLine?.terminal2Derivation.set(terminal, cellGrammer);
                }
                cellGrammer.derivations.push(derivation);
                yield {
                    ruleIndex: 0,
                    result: predictTable
                }
            }
            // (2)若 First(u) 含 ε ，则对 Follow(A) 中的所有符号 a （可含 $ ），置 M[A, a] = “A -> u” 
            if (derivationFirstSet.terminals.has(EmptyCharacter)) {
                for (let terminal of nonTerminal2FollowSetLine.get(grammer.nonTerminal)!.terminals) {
                    let cellGrammer: Grammer | undefined = tableLine?.terminal2Derivation.get(terminal);
                    if (!cellGrammer) {
                        cellGrammer = {
                            nonTerminal: grammer.nonTerminal,
                            derivations: []
                        };
                        tableLine?.terminal2Derivation.set(terminal, cellGrammer);
                    }
                    cellGrammer.derivations.push(derivation);
                    yield {
                        ruleIndex: 1,
                        result: predictTable
                    }
                }
            }
        }
    }
}