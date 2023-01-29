export default class Lexer {
  public rules: Array<[string, RegExp]>;
  currentLine: number = 0;
  currentColumn: number = 0;
  source: string = "";
  constructor(rules: Array<[string, RegExp]>) {
    this.rules = rules;
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
}
