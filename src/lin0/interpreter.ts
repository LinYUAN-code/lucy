/* eslint-disable quotes */
import Parser from "./parser";
import { Context, S, GlobalDefinition, VarDecl, Function } from "./types";
import { Assembly, INS } from "./assembly";

export default class Interpreter {
    public context: Context;
    public parser: Parser;
    constructor() {
        this.context = new Context();
        this.parser = new Parser();
    }
    parse(code: string): S {
        return this.parser.parse(code);
    }
    run(code: string) {
        const stmts = this.parser.parse(code);
        for (let stmt of stmts) {
            stmt.execute(this.context);
        }
    }
    toAssembly(code: string) {
        let globalDefinitions = this.parser.parse(code);
        let assembly = new Assembly();
        globalDefinitions.forEach(definition => {
            definition.toAssembly(assembly);
        })
        return assembly.toString();
    }
}