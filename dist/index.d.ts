type Position = {
    line: number;
    column: number;
};
type Tocken = {
    tocken: Terminal;
    origin: string;
    position?: Position;
    Options?: Array<any>;
};
type NonTerminal = string;
type Terminal = string;
type Grammer = {
    nonTerminal: NonTerminal;
    derivations: Array<Array<NonTerminal | Terminal>>;
};
type GrammerSetLine = {
    tocken: NonTerminal | Terminal;
    terminals: Set<Terminal>;
    isTerminal?: boolean;
};
type GrammerSet = Array<GrammerSetLine>;
type PredictLine = {
    nonTerminal: string;
    terminal2Derivation: Map<Terminal, Grammer> | Record<string, any>;
};
type PredictTable = Array<PredictLine>;
type PredictProcessLine = {
    parseStack: Array<Terminal | NonTerminal>;
    remainingInput: string;
    parseAction: string;
};
type Rule = Array<string>;
type Process<T> = {
    ruleIndex: number;
    result: T;
};
type LRStateNodeItem = {
    nonTerminal: NonTerminal;
    derivation: string[];
    matchPoint: number;
    lookAheadTocken?: string[];
};
type LRStateNode = {
    id: number;
    items: LRStateNodeItem[];
    edges: {
        tocken: NonTerminal | Terminal;
        next: LRStateNode;
    }[];
    acc?: boolean;
};
type LRStateNodeForShow = {
    id: number;
    items: string[];
    edges: {
        tocken: NonTerminal | Terminal;
        next: LRStateNodeForShow;
    }[];
    acc?: boolean;
};
type LRPredictTableLine = {
    id: number;
    action: Map<Terminal, (number | string[] | string)[]>;
    goto: Map<NonTerminal, (number | string[] | string)[]>;
};
type LRPredictTable = Array<LRPredictTableLine>;
type LRPredictLine = {
    stack: number[];
    symbols: string[];
    input: string[];
    move?: string;
};
type LRPredictResultTable = Array<LRPredictLine>;

declare class Lexer {
    nonTerminals: Array<string>;
    terminals: Array<[string, RegExp]>;
    currentLine: number;
    currentColumn: number;
    source: string;
    constructor(terminals: Array<[string, RegExp]>, nonTerminals: Array<string>);
    setSource(source: string): void;
    remainString(): string;
    next(): Tocken;
    pop(): Tocken;
    nextNotEmptyTerminal(): Tocken;
    nextNotEmpty(step: number): Tocken;
    popNotEmptyTerminal(): Tocken;
    isTerminal(str: string): boolean;
    splitDerivation(str: string): Array<NonTerminal | Terminal>;
    getNewNonTerminal(nonTerminal: string): string;
}

declare class LL1Parser {
    lexer: Lexer;
    textGrammers: Array<string>;
    constructor(terminals: Array<[string, RegExp]>, nonTerminals: Array<string>, inGrammers: Array<string>);
    getFirstSet(): GrammerSet;
    getFollowSet(firstSet?: GrammerSet): GrammerSet;
    getPredictTable(firstSet?: GrammerSet, followSet?: GrammerSet): PredictTable;
    getPredictProcess(input: string, parseStartNonTerminal: string, predictTable?: PredictTable): Array<PredictProcessLine>;
    checkPredickTableIsValid(predictTable: PredictTable): boolean;
    checkIsLL0(): boolean;
    getFirstSetProgressive(): IterableIterator<Rule | Process<GrammerSet>>;
    getFollowSetProgressive(firstSet?: GrammerSet): IterableIterator<Rule | Process<GrammerSet>>;
    getPredictProcessProgressive(input: string, parseStartNonTerminal: string, predictTable?: PredictTable): IterableIterator<Array<PredictProcessLine>>;
    getPredictTableProgressive(firstSet?: GrammerSet, followSet?: GrammerSet): IterableIterator<Rule | Process<PredictTable>>;
}

declare function getTockFromSimpleGrammers(inGrammers: Array<string>): {
    nonTerminals: Array<string>;
    terminals: Array<[string, RegExp]>;
};
declare function checkNeedunionGrammers(grammers: Array<string>): boolean;
declare function unionGrammers(grammers: Array<string>, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): Array<string>;
declare function checkNeedliftUpCommonTocken(grammers: Array<string>, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): boolean;
declare function liftUpCommonTocken(grammers: Array<string>, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): Array<string>;
declare function checkNeedClearRightRecursion(grammers: Array<string>, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): boolean;
declare function clearRightRecursion(grammers: Array<string>, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): Array<string>;

declare class LRParser {
    initialStateNode: LRStateNode | null;
    allStateNodesMap?: Map<string, LRStateNode>;
    lexer?: Lexer;
    grammers?: string[];
    constructor();
    generateState(grammers: string[], parseStartNonTerminal: string, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): void;
    generateStateProgressive(grammers: string[], parseStartNonTerminal: string, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): IterableIterator<undefined>;
    predictInput(input: string, predictTable: LRPredictTable): LRPredictResultTable;
    generateLR0PredictTable(): LRPredictTable;
    generateSLR1PredictTable(): LRPredictTable;
    get stateGraph(): LRStateNodeForShow;
}

declare class LR1Parser {
    initialStateNode: LRStateNode | null;
    allStateNodesMap?: Map<string, LRStateNode>;
    lexer?: Lexer;
    grammers?: string[];
    firstSet?: GrammerSet;
    constructor();
    generateState(grammers: string[], parseStartNonTerminal: string, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): void;
    predictInput(input: string, predictTable: LRPredictTable): LRPredictResultTable;
    mergeNewNode(node: LRStateNode, addNode: LRStateNode): void;
    generateLALRPredictTable(): LRPredictTable;
    generateLR1PredictTable(): LRPredictTable;
    get stateGraph(): LRStateNodeForShow;
}

export { LL1Parser, LR1Parser, LRParser, Lexer, checkNeedClearRightRecursion, checkNeedliftUpCommonTocken, checkNeedunionGrammers, clearRightRecursion, getTockFromSimpleGrammers, liftUpCommonTocken, unionGrammers };
