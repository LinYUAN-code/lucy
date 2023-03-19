import { LRStateMachine } from "@/LR0/LRState";
import log, { nullLogChannel } from "@/utils/log";

test("LRStateMachine", () => {
    let grammers = [
        "E  =>  E + T | T",
        "T => T * F | F",
        "F => (E) | id",
    ]
    // log.logTo(nullLogChannel);
    const lRStateMachine = new LRStateMachine();
    lRStateMachine.generateState(grammers,"E",["E","T","F"],[["+",/^\+/],["*",/^\*/],["(",/^\(/],[")",/^\)/],["id",/^id/]]);
    const stateNode = lRStateMachine.stateGraph;
    
})