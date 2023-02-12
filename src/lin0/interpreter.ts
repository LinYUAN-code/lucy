import Parser from "./parser";
import parser from "./parser";
import { Context } from "./types";


export default class Interpreter {
    public context: Context;
    public parser: Parser;
    constructor() {
        this.context = new Context();
        this.parser = new Parser();
    }
    run(code: string) {
        const stmts = this.parser.parse(code);
        for (let stmt of stmts) {
            stmt.execute(this.context);
        }
    }
}