import { safeRegCharacter } from "./utils";
import log from "./utils/log";

export default class Lexer {
  public nonTerminals: Array<string>;
  public terminals: Array<[string, RegExp]>;
  currentLine: number = 0;
  currentColumn: number = 0;
  source: string = "";
  constructor(terminals: Array<[string, RegExp]>, nonTerminals: Array<string>) {
    // 输入所有的终结符号集合
    this.nonTerminals = nonTerminals;
    this.terminals = terminals;
  }
  public setSource(source: string) {
    this.source = source;
    this.currentColumn = 0;
    this.currentColumn = 0;
  }
  public next(): Tocken {
    return {
      tockenType: "1",
      origin: "1",
    };
  }
  public isTerminal(str: string) {
    let isTerminal = true;
    this.nonTerminals.some(v => {
      if (v[0] === str) {
        isTerminal = false;
        return true;
      }
      return false;
    })
    return isTerminal;
  }
  // 切割推导式
  public splitDerivation(str: string): Array<NonTerminal | Terminal> {
    const terminals: string[] = [];
    while (str.length) {
      for (let nonTerminal of this.nonTerminals) {
        const matchResult = str.match(new RegExp("^" + nonTerminal))
        if (matchResult) {
          terminals.push(nonTerminal);
          str = str.slice(matchResult[0].length);
        }
      }
      for (let terminal of this.terminals) {
        const matchResult = str.match(new RegExp("^" + safeRegCharacter(terminal[0])))
        if (matchResult) {
          terminals.push(terminal[0]);
          str = str.slice(matchResult[0].length);
        }
      }
    }
    log.log(terminals);
    return terminals;
  }
}