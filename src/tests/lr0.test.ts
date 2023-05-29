import { LL1Parser } from "@/LL1";
import { LRParser } from "@/LR0/LRState";
import { getTockFromSimpleGrammers } from "@/simpleGrammerHelper";
import { LRStateNode } from "@/types/type";
import log, { nullLogChannel } from "@/utils/log";

test("LR0", () => {
    // let grammers = [
    //     "S =>  AB",
    //     "A => a",
    //     "B => S | b",
    // ]
    // log.logTo(nullLogChannel);
    // const lRParser = new LRParser();
    // const { nonTerminals, terminals } = getTockFromSimpleGrammers(grammers);
    // lRParser.generateState(grammers,"S",nonTerminals,terminals);
    // const stateNode = lRParser.stateGraph;
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
    const predictTable = lRParser.generateLR0PredictTable();
    console.log(predictTable)
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
    // console.log(predictResult[Symbol])
    log.log(predictResult);
    // console.log(predictResult)
})

test("SLR2",() => {
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
    const predictResult = lRParser.predictInputWithAST("id * id + id",predictTable);
    // console.log(predictResult[predictResult.length-1].symbols);
    const stack=predictResult[predictResult.length-1].symbols;
    const node=stack[0];
    // while(stack.length!=0){
    //     const lrnode=stack[stack.length-1];
    //     if(lrnode?.children)
    // }
    log.log(predictResult);
})