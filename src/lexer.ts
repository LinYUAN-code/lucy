import { NonTerminal, Terminal, Tocken } from "./types/type";
import { safeRegCharacter } from "./utils";
import { EndingCharacter } from "./utils/const";
import log from "./utils/log";

export default class Lexer {
  public nonTerminals: Array<string>;
  public terminals: Array<[string, RegExp]>;
  currentLine: number = 0;
  currentColumn: number = 0;
  source: string = "";
  constructor(terminals: Array<[string, RegExp]>, nonTerminals: Array<string>) {
    // 输入所有的终结符号集合
    this.nonTerminals = [...nonTerminals];
    this.terminals = [...terminals];
  }
  public setSource(source: string) {
    this.source = source;
    this.currentLine = 0;
    this.currentColumn = 0;
  }
  public remainString(): string {
    return this.source.slice(this.currentColumn);
  }
  public next(): Tocken {
    if (this.currentColumn === this.source.length) {
      return {
        tocken: EndingCharacter,
        origin: EndingCharacter
      };
    }
    for (let terminal of this.terminals) {
      const matchResult = this.source.slice(this.currentColumn).match(terminal[1]);
      if (matchResult) {
        return {
          tocken: terminal[0],
          origin: matchResult[0]
        }
      }
    }
    throw new Error(`[lexer next]: match next Terminal error \n sourecInput: ${this.source}\n remainString: ${this.source.slice(this.currentColumn)}`);
  }
  public pop(): Tocken {
    try {
      const tocken: Tocken = this.next();
      this.currentColumn += tocken.origin.length;
      return tocken;
    } catch (e) {
      throw e;
    }
  }
  public isTerminal(str: string) {
    let isTerminal = true;
    this.nonTerminals.some(v => {
      if (v === str) {
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
    let countTime = 0;
    const MAX_EXCUTE = 50000;
    const inStr = str;
    while (str.length) {
      for (let nonTerminal of this.nonTerminals) {
        const matchResult = str.match(new RegExp("^" + nonTerminal))
        if (matchResult) {
          terminals.push(nonTerminal);
          str = str.slice(matchResult[0].length);
          break;
        }
      }
      for (let terminal of this.terminals) {
        const matchResult = str.match(new RegExp("^" + safeRegCharacter(terminal[0])))
        if (matchResult) {
          terminals.push(terminal[0]);
          str = str.slice(matchResult[0].length);
          break;
        }
      }
      countTime++;
      if (countTime > MAX_EXCUTE) {
        throw new Error(`[splitDerivation] error: excute over MAX_EXCUTE str: ${inStr}  remaining str: ${str} `);
      }
    }
    return terminals;
  }
  /*
    生成提公因子 以及 消除左递归使用的非终结符
  */
  public getNewNonTerminal(nonTerminal: string): string {
    let tmp = nonTerminal;
    while (true) {
      tmp += "'";
      if (this.nonTerminals.indexOf(tmp) === -1) {
        this.nonTerminals.unshift(tmp);
        return tmp;
      }
    }
  }
}