import { clearRightRecursion, getTockFromSimpleGrammers, liftUpCommonTocken, unionGrammers } from "@/simpleGrammerHelper"
import log, { nullLogChannel } from "@/utils/log";
import { LL1Parser } from "..";

test("unionGrammers", () => {
    let grammers = [
        "S  ->  A B | a | b",
        "S  ->  A B | a | b",
        "S  ->  A B | a | b",
        "A  ->  a",
        "B  ->  b",
    ]
    grammers = unionGrammers(grammers);
    console.log(grammers);
    grammers = liftUpCommonTocken(grammers);
    console.log(grammers);
    grammers = clearRightRecursion(grammers);
    console.log(grammers);
})


test("first set test", () => {
    const grammers = [
        "S  ->  AB",
        "A  ->  Ca | ε",
        "B  ->  cB'",
        "B' ->  aACB' | ε",
        "C  ->  b | ε"
    ]
    log.logTo(nullLogChannel);
    const { nonTerminals, terminals } = getTockFromSimpleGrammers(grammers);
    log.log(nonTerminals, terminals);
    const ll1Parser = new LL1Parser(terminals, nonTerminals, grammers);
    const firstSet = ll1Parser.getFirstSet();
    const followSet = ll1Parser.getFollowSet(firstSet);
    const predictTable = ll1Parser.getPredictTable(firstSet, followSet);
})

test("simple set test", () => {
    let grammers = [
        "S  ->  AB",
        "S  ->  SCa | h",
        "S ->  AACB | AAdd",
        "C  ->  b",
        "C -> l",
        "A -> a",
        "B -> b",
        "C -> c",
    ]
    // log.logTo(nullLogChannel);
    grammers = unionGrammers(grammers);
    log.log(grammers);
    grammers = liftUpCommonTocken(grammers);
    log.log(grammers);
    grammers = clearRightRecursion(grammers);
    log.log(grammers);
})

test("clearRightRecursion test", () => {
    let grammers = [
        "S  ->  Aa | b",
        "A -> Ac | Sd | ε",
    ]
    log.logTo(nullLogChannel);
    grammers = unionGrammers(grammers);
    log.log(grammers);
    grammers = liftUpCommonTocken(grammers);
    log.log(grammers);
    grammers = clearRightRecursion(grammers);
    log.log(grammers);
})