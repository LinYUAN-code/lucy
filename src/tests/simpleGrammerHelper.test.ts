import { getTockFromSimpleGrammers, liftUpCommonTocken, unionGrammers } from "@/simpleGrammerHelper"
import log, { nullLogChannel } from "@/utils/log";
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

test("simple set test", () => {
    let grammers = [
        "S  =>  AB",
        "S  =>  Ca | ε",
        "S =>  AACB' | AAdd",
        "C  =>  b",
        "C => ε"
    ]
    log.logTo(nullLogChannel);
    grammers = unionGrammers(grammers);
    console.log(grammers);
    grammers = liftUpCommonTocken(grammers);
    console.log(grammers);
})