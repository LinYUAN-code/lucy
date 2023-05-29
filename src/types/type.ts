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
  nonTerminal: NonTerminal,  // 文法左侧的非终结符号
  derivations: Array<Array<NonTerminal | Terminal>> // 文法右侧的产生式分割成数组
};
export type Grammers = Array<Grammer>;
export type GrammerSetLine = {
  tocken: NonTerminal | Terminal; // 符号
  terminals: Set<Terminal>; // 符号所对应的终结符集合
  isTerminal?: boolean;
};
export type GrammerSet = Array<GrammerSetLine>;

export type PredictLine = {
  nonTerminal: string; // 该行所对应的非终结符
  terminal2Derivation: Map<Terminal, Grammer> | Record<string, any>;// 该终结符遇到下一个字符对应的文法动作
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
  nonTerminal: NonTerminal; // 非终结符
  derivation: string[]; // 产生式
  matchPoint: number; // 匹配点的位置 示例: · A ==> 0    A · b  ===> 1
  lookAheadTocken?: string[]; // 向前看符号
}
export type LRStateNode = {
  id: number; // 状态节点id
  items: LRStateNodeItem[]; // 项集
  edges: {  // GOTO边
    tocken: NonTerminal | Terminal;
    next: LRStateNode;
  }[];
  acc?: boolean; //表示是否是接受状态
}

export type LRStateNodeForShow = {
  id: number;
  items: string[];
  edges: {
    tocken: NonTerminal | Terminal;
    next: LRStateNodeForShow;
  }[];
  acc?: boolean; //表示是否是接受状态
}


export type LRPredictTableLine = {
  id: number;
  action: Map<Terminal, (number | string[] | string)[]>;
  goto: Map<NonTerminal,(number | string[] | string)[]>;
};
export type LRPredictTable = Array<LRPredictTableLine>


export type LRPredictLine = {
  stack: number[];
  symbols: string[];
  input: string[];
  move?: string;
}
export type LRPredictResultTable = Array<LRPredictLine>;


export type AstNode = {
  id: any; // 节点唯一id 辅助前端展示使用
  text: string; // 节点文本
  children?: AstNode[]; // 子节点
  check?: boolean; // 辅助前端展示使用
}