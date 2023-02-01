import generateFllowSet from "@/followSet";
import Lexer from "@/lexer";
import generateFirstSet from "@/firstSet";
import log, { nullLogChannel } from "@/utils/log";
import { EmptyCharacter, EndingCharacter } from "@/utils/const";
import generatorPredictTable, { checkPredickTableIsValid, predict } from "@/LL0/predictTable";
import { transferString2Grammers } from "@/utils";
const testCases: Array<{
    nonTerminalSymbol: Array<string>,
    terminalsSet: Array<[string, RegExp]>,
    grammers: Array<string>,
    firstSetAnswer: GrammerSet,
    followSetAnswer: GrammerSet,
    predictTable?: any,
}> = [
        {
            nonTerminalSymbol: [
                "A", "B'", "B", "C", "S"
            ],
            terminalsSet: [
                [EmptyCharacter, /^ε/],
                ["a", /^a/],
                ["b", /^b/],
                ["c", /^c/]
            ],
            grammers: [
                "S  =>  AB",
                "A  =>  Ca | ε",
                "B  =>  cB'",
                "B' =>  aACB' | ε",
                "C  =>  b | ε"
            ],
            firstSetAnswer: [
                {
                    tocken: "C",
                    terminals: new Set(["b", "ε"]),
                },
                {
                    tocken: "B'",
                    terminals: new Set(["a", "ε"])
                },
                {
                    tocken: "B",
                    terminals: new Set(["c"])
                },
                {
                    tocken: "A",
                    terminals: new Set(["b", "a", "ε"])
                },
                {
                    tocken: "S",
                    terminals: new Set(["b", "a", "c"])
                }
            ],
            followSetAnswer: [
                {
                    tocken: "C",
                    terminals: new Set(["a", "$"])
                },
                {
                    tocken: "B'",
                    terminals: new Set(["$"])
                },
                {
                    tocken: "B",
                    terminals: new Set(["$"])
                },
                {
                    tocken: "A",
                    terminals: new Set(["b", "a", "c", "$"])
                },
                {
                    tocken: "S",
                    terminals: new Set(["$"])
                }
            ]
        },
        {
            nonTerminalSymbol: [
                "E'", "E", "T'", "T", "F"
            ],
            terminalsSet: [
                [EmptyCharacter, /^ε/],
                ["int", /^(0|[1-9][0-9]*)/],
                ["+", /^\+/],
                ["*", /^\*/],
                ["(", /^\(/],
                [")", /^\)/],
            ],
            grammers: [
                "E  =>  T E'",
                "E' =>  + T E' | ε",
                "T  =>  F T'",
                "T' =>  * F T' | ε",
                "F  => ( E ) | int"
            ],
            firstSetAnswer: [
                {
                    tocken: "E",
                    terminals: new Set(["(", "int"]),
                },
                {
                    tocken: "T",
                    terminals: new Set(["(", "int"])
                },
                {
                    tocken: "F",
                    terminals: new Set(["(", "int"])
                },
                {
                    tocken: "T'",
                    terminals: new Set(["*", EmptyCharacter])
                },
                {
                    tocken: "E'",
                    terminals: new Set(["+", EmptyCharacter])
                }
            ],
            followSetAnswer: [
                {
                    tocken: "E",
                    terminals: new Set([")", "$"])
                },
                {
                    tocken: "E'",
                    terminals: new Set([")", "$"])
                },
                {
                    tocken: "T",
                    terminals: new Set(["+", "$", ")"])
                },
                {
                    tocken: "T'",
                    terminals: new Set(["+", "$", ")"])
                },
                {
                    tocken: "F",
                    terminals: new Set(["*", "+", "$", ")"])
                }
            ],
            predictTable: [
                {
                    "nonTerminal": "E'",
                    "terminal2Derivation": {
                        "+": { "nonTerminal": "E'", "derivations": [["+", "T", "E'"]] },
                        "$": { "nonTerminal": "E'", "derivations": [["ε"]] },
                        ")": { "nonTerminal": "E'", "derivations": [["ε"]] }
                    }
                },
                {
                    "nonTerminal": "E",
                    "terminal2Derivation": {
                        "(": { "nonTerminal": "E", "derivations": [["T", "E'"]] },
                        "int": { "nonTerminal": "E", "derivations": [["T", "E'"]] }
                    }
                },
                {
                    "nonTerminal": "T'",
                    "terminal2Derivation": {
                        "*": { "nonTerminal": "T'", "derivations": [["*", "F", "T'"]] },
                        "$": { "nonTerminal": "T'", "derivations": [["ε"]] },
                        ")": { "nonTerminal": "T'", "derivations": [["ε"]] },
                        "+": { "nonTerminal": "T'", "derivations": [["ε"]] }
                    }
                },
                {
                    "nonTerminal": "T",
                    "terminal2Derivation": {
                        "(": { "nonTerminal": "T", "derivations": [["F", "T'"]] },
                        "int": { "nonTerminal": "T", "derivations": [["F", "T'"]] }
                    }
                },
                {
                    "nonTerminal": "F",
                    "terminal2Derivation": {
                        "(": { "nonTerminal": "F", "derivations": [["(", "E", ")"]] },
                        "int": { "nonTerminal": "F", "derivations": [["int"]] }
                    }
                }
            ]

        }
    ]


test("first set test", () => {
    log.logTo(nullLogChannel);
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const lexer = new Lexer(testCase.terminalsSet, testCase.nonTerminalSymbol);
        [testCase.firstSetAnswer, testCase.followSetAnswer].forEach(grammerSet => {
            grammerSet.sort((a, b) => {
                if (a.tocken < b.tocken) {
                    return -1;
                } else {
                    return 1;
                }
            })
            grammerSet.forEach(setLine => {
                setLine.terminals = new Set(Array.from(setLine.terminals).sort((a, b) => {
                    if (a < b) {
                        return -1;
                    } else {
                        return 1;
                    }
                }))
            })
        })
        const firstSet = generateFirstSet(lexer, testCase.grammers);
        log.log("[firstSet]", firstSet, testCase.firstSetAnswer);
        expect(firstSet).toEqual(testCase.firstSetAnswer);
        const followSet = generateFllowSet(lexer, testCase.grammers, firstSet);
        log.log("[followSet]", followSet, testCase.followSetAnswer);
        expect(followSet).toEqual(testCase.followSetAnswer);
        if (testCase.predictTable) {
            const predictTable = generatorPredictTable(lexer, transferString2Grammers(lexer, testCase.grammers), firstSet, followSet);
            expect(checkPredickTableIsValid(lexer, predictTable)).toBe(true);
            for (let tableLine of testCase.predictTable) {
                tableLine.terminal2Derivation = new Map(Object.entries(tableLine.terminal2Derivation));
            }
            log.log(predictTable, "\n------------------\n", testCase.predictTable);
            expect(predictTable).toEqual(testCase.predictTable);

            const predictResult = predict(lexer, predictTable, "11 + 22 * 33", "E");
            log.log(predictResult);
        }
    }

})


