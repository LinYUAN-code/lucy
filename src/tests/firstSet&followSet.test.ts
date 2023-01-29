import generateFllowSet from "@/followSet";
import Lexer from "@/lexer";
import generateFirstSet from "@/firstSet";
import log from "@/utils/log";
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
                    terminals: new Set(["b", "a", "ε", "$"])
                },
                {
                    tocken: "S",
                    terminals: new Set(["$"])
                }
            ]
        }
    ]


test("first set test", () => {
    for (let testCase of testCases) {
        const lexer = new Lexer(testCase.terminalsSet, testCase.nonTerminalSymbol);
        const firstSet = generateFirstSet(lexer, testCase.grammers).sort((a, b) => {
            if (a.tocken < b.tocken) {
                return -1;
            } else {
                return 1;
            }
        });
        expect(firstSet).toEqual(testCase.firstSetAnswer.sort((a, b) => {
            if (a.tocken < b.tocken) {
                return -1;
            } else {
                return 1;
            }
        }));
        // const followSet = generateFllowSet(lexer, testCase.grammers);
        // expect(followSet).toBe(testCase.followSetAnswer);
    }

})


