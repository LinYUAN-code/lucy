import { LL1Parser } from "@/LL1";
import { LRParser } from "@/LR0/LRState";
import { getTockFromSimpleGrammers } from "@/simpleGrammerHelper";
import log, { nullLogChannel } from "@/utils/log";

test("LR0", () => {
    let grammers = [
        "S =>  AB",
        "A => a",
        "B => S | b",
    ]
    log.logTo(nullLogChannel);
    const lRParser = new LRParser();
    const { nonTerminals, terminals } = getTockFromSimpleGrammers(grammers);
    lRParser.generateState(grammers,"S",nonTerminals,terminals);
    const stateNode = lRParser.stateGraph;
    const predictTable = lRParser.generateLR0PredictTable();
    log.log(stateNode,predictTable);
})

test("SLR1 ", () => {
    let grammers = [
        "E  =>  E + T | T",
        "T => T * F | F",
        "F => (E) | id",
    ]
    // log.logTo(nullLogChannel);
    const lRParser = new LRParser();
    const nonTerminals = ["E","T","F"];
    const terminals: [string,RegExp][] = [["+",/^\+/],["*",/^\*/],["(",/^\(/],[")",/^\)/],["id",/^id/]];
    lRParser.generateState(grammers,"E",nonTerminals,terminals);
    const stateNode = lRParser.stateGraph;
    const predictTable = lRParser.generateSLR1PredictTable();
    log.log(stateNode,predictTable);
    const predictResult = lRParser.predictInput("id * id + id",predictTable);
    log.log(predictResult);
})