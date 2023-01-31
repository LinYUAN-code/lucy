import generateFllowSet from "@/followSet";
import Lexer from "@/lexer";
import generateFirstSet from "@/firstSet";
import log, { nullLogChannel } from "@/utils/log";
import { EmptyCharacter } from "@/utils/const";
import generatorPredictTable from "@/LL0/predictTable";
import { transferString2Grammers } from "@/utils";
const testCases: Array<{
    nonTerminalSymbol: Array<string>,
    terminalsSet: Array<[string, RegExp]>,
    grammers: Array<string>,
    firstSetAnswer: GrammerSet,
    followSetAnswer: GrammerSet,
    predictTable?: PredictTable,
}> = [
        {
            nonTerminalSymbol: [
                "A", "B'", "B", "C", "S"
            ],
            terminalsSet: [
                ["ε", /ε/],
                ["a", /a/],
                ["b", /b/],
                ["c", /c/]
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
                [EmptyCharacter, /ε/],
                ["int", /123/],
                ["+", /\+/],
                ["*", /\*/],
                ["(", /\(/],
                [")", /\)/],
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
            predictTable: []
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
            log.logTo(console);
            const predictTable = generatorPredictTable(lexer, transferString2Grammers(lexer, testCase.grammers), firstSet, followSet);
            log.log(predictTable);
            for (let x of predictTable) {
                for (let terminal of x.terminal2Derivation.keys()) {
                    log.log(terminal, " ", x.terminal2Derivation.get(terminal));
                }
            }
        }
    }

})


