export type TockenType = string;
export type Position = {
  line: number;
  column: number;
};
export type Tocken = {
  tocken: Terminal;
  origin: string;
  position?: Position;
  Options?: Array<any>;
};
export type NonTerminal = string;
export type Terminal = string;
export type Grammer = {
  nonTerminal: NonTerminal,
  derivations: Array<Array<NonTerminal | Terminal>>
};
export type Grammers = Array<Grammer>;
export type GrammerSetLine = {
  tocken: NonTerminal | Terminal;
  terminals: Set<Terminal>;
  isTerminal?: boolean;
};
export type GrammerSet = Array<GrammerSetLine>;

export type PredictLine = {
  nonTerminal: string;
  terminal2Derivation: Map<Terminal, Grammer> | Record<string, any>;
};
export type PredictTable = Array<PredictLine>;

export type PredictProcessLine = {
  parseStack: Array<Terminal | NonTerminal>,
  remainingInput: string,
  parseAction: string,
}


export type Rule = Array<string>;
export type Process<T> = {
  ruleIndex: number;
  result: T;
}

export type LRStateNodeItem = {
  nonTerminal: NonTerminal;
  derivation: string[];
  matchPoint: number; // such * A ==> 0    A * b  ===> 1
}
export type LRStateNode = {
  id: number;
  items: LRStateNodeItem[];
  edges: {
    tocken: NonTerminal | Terminal;
    next: LRStateNode;
  }[]
}

export type LRStateNodeForShow = {
  id: number;
  items: string[];
  edges: {
    tocken: NonTerminal | Terminal;
    next: LRStateNodeForShow;
  }[]
}


