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
type Grammer = string;
type Grammers = Array<Grammer>;
type GrammerSetLine = {
  nonTerminal: NonTerminal;
  terminals: Array<Terminal>;
};
type grammerSet = Array<GrammerSetLine>;

type PredictLine = {
  nonTerminal: string;
  grammer: string;
  tocken: Tocken;
};
type PredictTable = Array<PredictLine>;
