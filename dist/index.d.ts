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
    getPredictTableProgressive(firstSet?: GrammerSet, followSet?: GrammerSet): IterableIterator<Rule | Process<PredictTable>>;
}

declare function getTockFromSimpleGrammers(inGrammers: Array<string>): {
    nonTerminals: Array<string>;
    terminals: Array<[string, RegExp]>;
};
declare function unionGrammers(grammers: Array<string>): Array<string>;
declare function liftUpCommonTocken(grammers: Array<string>, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): Array<string>;
declare function clearRightRecursion(grammers: Array<string>, nonTerminals?: Array<string>, terminals?: Array<[string, RegExp]>): Array<string>;

export { LL1Parser, Lexer, clearRightRecursion, getTockFromSimpleGrammers, liftUpCommonTocken, unionGrammers };
