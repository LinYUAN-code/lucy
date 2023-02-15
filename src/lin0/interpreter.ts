import Parser from "./parser";
import parser from "./parser";
import { Context, Stmt, VarDecl } from "./types";


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
    toAssembly(code: string) {
        let stmts = this.parser.parse(code);
        const varDecls: VarDecl[] = [];
        for (let stmt of stmts) {
            if (stmt instanceof VarDecl) {
                varDecls.push(stmt);
            }
        }
        stmts = stmts.filter(stmt => !(stmt instanceof VarDecl));

        let ans =
            `# lin0 assembly code
    .data
${this.getDataDefinitionAssembly(varDecls)}
    .text
    .global _main
_main:
${this.getExecuteAssembly(stmts)}
`;
        return ans;
    }
    getDataDefinitionAssembly(varDecls: VarDecl[]): string {
        let ans = "";
        for (let varDecl of varDecls) {
            for (let identifier of varDecl.identifiers) {
                ans += `${identifier}:  .quad   0x0\n`;
            }
        }
        return ans;
    }
    getExecuteAssembly(stmts: Stmt[]): string {
        let ans = "";
        const stringLiteralsMap = new Map<string, string>();
        let stringLiteralIndex = 0;
        for (let stmt of stmts) {
            const stringLiterals = stmt.getStringLiterals();
            for (let literal of stringLiterals) {
                if (!stringLiteralsMap.has(literal)) {
                    stringLiteralsMap.set(literal, `L_.str.${stringLiteralIndex}`);
                }
            }
        }
        for (let stmt of stmts) {
            ans += stmt.toAssembly(stringLiteralsMap);
        }
        for (let literal of stringLiteralsMap.keys()) {
            ans += "    .section	__TEXT, __cstring\n";
            ans += `${stringLiteralsMap.get(literal)}:
    .asciz ${literal}`;
        }
        return ans;
    }
}