import { LR1Parser } from "@/LR1/LR1State";
import { getTockFromSimpleGrammers } from "@/simpleGrammerHelper";
import log, { nullLogChannel } from "@/utils/log";

test("LR1", () => {
    let grammers = [
        "S -> AB",
        "A -> a",
        "B -> S | b",
    ]
    log.logTo(nullLogChannel);
    const lRParser = new LR1Parser();
    const { nonTerminals, terminals } = getTockFromSimpleGrammers(grammers);
    lRParser.generateState(grammers,"S",nonTerminals,terminals);
    const stateNode = lRParser.stateGraph;
    console.log(stateNode);
    const predictTable = lRParser.generateLR1PredictTable();
    log.log(stateNode,predictTable);
    const predictResult = lRParser.predictInput("a b",predictTable);
    log.log(predictResult);
})

test("LALR ", () => {
    let grammers = [
        "S -> B B",
        "B -> a B | b",
    ]
    log.logTo(nullLogChannel);
    const lRParser = new LR1Parser();
    const { nonTerminals, terminals } = getTockFromSimpleGrammers(grammers);
    lRParser.generateState(grammers,"S",nonTerminals,terminals);
    const stateNode = lRParser.stateGraph;
    console.log(stateNode);
    const predictTable = lRParser.generateLALRPredictTable();
    log.log(stateNode,predictTable);
    const predictResult = lRParser.predictInput("a b b",predictTable);
    log.log(predictResult);
})