import generateFllowSet from "@/followSet";
import Lexer from "@/lexer";
import generateFirstSet from "@/firstSet";
import log, { nullLogChannel } from "@/utils/log";
const testCases: Array<{
    nonTerminalSymbol: Array<string>,
    terminalsSet: Array<[string, RegExp]>,
    grammers: Array<string>,
    firstSetAnswer: GrammerSet,
    followSetAnswer: GrammerSet,
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
        }
    ]


test("first set test", () => {
    log.logTo(nullLogChannel);
    for (let i = 0; i < testCases.length; i++) {
        if (i > 0) log.logTo(console);
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
        })
        const firstSet = generateFirstSet(lexer, testCase.grammers);
        log.log("[firstSet]", firstSet);
        expect(firstSet).toEqual(testCase.firstSetAnswer);
        const followSet = generateFllowSet(lexer, testCase.grammers, firstSet);
        log.log("[followSet]", followSet, testCase.followSetAnswer);
        expect(followSet).toEqual(testCase.followSetAnswer);
    }

})


