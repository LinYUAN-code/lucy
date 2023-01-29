type TockenType = string;
type Position = {
  line: number;
  column: number;
};
type Tocken = {
  tockenType: TockenType;
  origin: string;
  position?: Position;
  Options?: Array<any>;
};
type NonTerminal = string;
type Terminal = string;
type Grammer = {
  nonTerminal: NonTerminal,
  derivations: Array<Array<NonTerminal | Terminal>>
};
type Grammers = Array<Grammer>;
type GrammerSetLine = {
  tocken: NonTerminal | Terminal;
  terminals: Set<Terminal>;
  isTerminal?: boolean;
};
type GrammerSet = Array<GrammerSetLine>;

type PredictLine = {
  nonTerminal: string;
  grammer: string;
  tocken: Tocken;
};
type PredictTable = Array<PredictLine>;
