import { getTockFromSimpleGrammers } from "@/simpleGrammerHelper"
import { LL1Parser } from "..";


test("first set test", () => {
    const grammers = [
        "S  =>  AB",
        "A  =>  Ca | ε",
        "B  =>  cB'",
        "B' =>  aACB' | ε",
        "C  =>  b | ε"
    ]
    const { nonTerminals, terminals } = getTockFromSimpleGrammers(grammers);
    console.log(nonTerminals, terminals);
    const ll1Parser = new LL1Parser(terminals, nonTerminals, grammers);
    const firstSet = ll1Parser.getFirstSet();
    const followSet = ll1Parser.getFollowSet(firstSet);
    const predictTable = ll1Parser.getPredictTable(firstSet, followSet);
})