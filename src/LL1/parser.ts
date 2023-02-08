import generateFirstSet, { generateFirstSetProgressive } from "@/firstSet";
import generateFllowSet, { generateFllowSetProgressive } from "@/followSet";
import Lexer from "@/lexer";
import { GrammerSet, PredictProcessLine, PredictTable, Process, Rule } from "@/types/type";
import generatorPredictTable, { checkPredickTableIsValid, generatePredictTableProgressive, predict } from "./predictTable";

export default class LL1Parser {
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
    if (!firstSet) {
      firstSet = this.getFirstSet();
    }
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
  getFirstSetProgressive(): IterableIterator<Rule | Process<GrammerSet>> {
    return generateFirstSetProgressive(this.lexer, this.textGrammers);
  }
  getFollowSetProgressive(firstSet?: GrammerSet): IterableIterator<Rule | Process<GrammerSet>> {
    if (!firstSet) {
      firstSet = this.getFirstSet();
    }
    return generateFllowSetProgressive(this.lexer, this.textGrammers, firstSet);
  }
  getPredictTableProgressive(firstSet?: GrammerSet, followSet?: GrammerSet): IterableIterator<Rule | Process<PredictTable>> {
    if (!firstSet) {
      firstSet = this.getFirstSet();
    }
    if (!followSet) {
      followSet = this.getFollowSet(firstSet);
    }
    return generatePredictTableProgressive(this.lexer, this.textGrammers, firstSet, followSet);
  }
}
