import generateFllowSet, { generateFllowSetProgressive } from "@/followSet";
import Lexer from "@/lexer";
import generateFirstSet, { generateFirstSetProgressive } from "@/firstSet";
import log, { nullLogChannel } from "@/utils/log";
import { EmptyCharacter, EndingCharacter } from "@/utils/const";
import generatorPredictTable, { checkPredickTableIsValid, generatePredictTableProgressive, predict } from "@/LL1/predictTable";
import { transferString2Grammers } from "@/utils";
import LL1Parser from "@/LL1/parser";
import { GrammerSet, PredictTable, Process, Rule } from "@/types/type";
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
        const firstSet1 = generateFirstSet(lexer, testCase.grammers);
        const followSet1 = generateFllowSet(lexer, testCase.grammers, firstSet1);
        const predictTable1 = generatorPredictTable(lexer, testCase.grammers, firstSet1, followSet1);
        let firstSet2: Process<GrammerSet> | Rule = [];
        for (firstSet2 of generateFirstSetProgressive(lexer, testCase.grammers)) {
            log.log(firstSet2);
        }
        let followSet2: Process<GrammerSet> | Rule = [];
        for (followSet2 of generateFllowSetProgressive(lexer, testCase.grammers)) {
            log.log(followSet2);
        }
        log.logTo(console);
        let predictTable2: Process<PredictTable> | Rule = [];
        for (predictTable2 of generatePredictTableProgressive(lexer, testCase.grammers, firstSet1, followSet1)) {
            log.log(predictTable2)
        }
        expect(firstSet1).toEqual((firstSet2 as Process<GrammerSet>).result);
        expect(followSet1).toEqual((followSet2 as Process<GrammerSet>).result);
        expect(predictTable1).toEqual((predictTable2 as Process<PredictTable>).result);
    }
})


