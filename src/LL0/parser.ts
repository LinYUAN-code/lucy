import generateFirstSet from "@/firstSet";
import generateFllowSet from "@/followSet";
import Lexer from "@/lexer";
import generatorPredictTable, { checkPredickTableIsValid, predict } from "./predictTable";

export default class LL0Parser {
  public lexer: Lexer;
  public textGrammers: Array<string>;
  constructor(terminals: Array<[string, RegExp]>, nonTerminals: Array<string>, inGrammers: Array<string>) {
    this.lexer = new Lexer(terminals, nonTerminals);
    this.textGrammers = inGrammers;
  }
  getFirstSet(): GrammerSet {
    return generateFirstSet(this.lexer, this.textGrammers);
  }
  getFollowSet(firstSet?: GrammerSet): GrammerSet {
    return generateFllowSet(this.lexer, this.textGrammers, firstSet);
  }
  getPredictTable(firstSet?: GrammerSet, followSet?: GrammerSet): PredictTable {
    if (!firstSet) {
      firstSet = this.getFirstSet();
    }
    if (!followSet) {
      followSet = this.getFollowSet(firstSet);
    }
    return generatorPredictTable(this.lexer, this.textGrammers, firstSet, followSet);
  }
  getPredictProcess(input: string, parseStartNonTerminal: string, predictTable?: PredictTable): Array<PredictProcessLine> {
    if (!predictTable) {
      predictTable = generatorPredictTable(this.lexer, this.textGrammers, this.getFirstSet(), this.getFollowSet());
    }
    return predict(this.lexer, predictTable, input, parseStartNonTerminal);
  }
  checkPredickTableIsValid(predictTable: PredictTable): boolean {
    return checkPredickTableIsValid(this.lexer, predictTable);
  }
  checkIsLL0(): boolean {
    return checkPredickTableIsValid(this.lexer, this.getPredictTable());
  }
}
