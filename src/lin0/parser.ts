import { Tocken } from "@/types/type";
import { EmptyCharacter, EndingCharacter } from "@/utils/const";
import { Lexer } from "..";
import { AdditiveExpression, Arguments, Assign, E, MultiplicativeExpression, PrimaryExpression, Print, S, Stmt, UnaryExpression, VarDecl } from "./types";

const terminals: Array<[string, RegExp]> = [
    ["-", /^-/],
    ["/", /^\//],
    ["+", /^\+/],
    ["*", /^\*/],
    ["(", /^\(/],
    [")", /^\)/],
    ["=", /^=/],
    [",", /^,/],
    [";", /^;/],
    ["int", /^int/],
    ["print", /^print/],
    ["string", /^"[^"]*"/],
    ["integer", /^(([1-9]*[0-9])|([0-9]))/],
    ["identifier", /^[_a-zA-Z][a-zA-Z0-9]*/],
    ["whiteSpace", /^\s/],
]

export default class Parser {
    public lexer: Lexer;
    constructor() {
        this.lexer = new Lexer(terminals, [])
    }
    parse(input: string) {
        this.lexer.setSource(input);
        return this.parse_S();
    }
    parse_S(): S {
        if (this.lexer.nextNotEmptyTerminal().tocken === EndingCharacter) {
            return [];
        }
        let res: S = [];
        while (this.lexer.remainString().length) {
            const tocken = this.lexer.nextNotEmptyTerminal();
            if (tocken.tocken === EndingCharacter) {
                break;
            }
            try {
                const stmt = this.parse_Stmt();
                res.push(stmt);
            } catch (e) {
                console.log(e);
                break;
            }
        }
        return res;
    }
    parse_Stmt(): Stmt {
        const tocken = this.lexer.nextNotEmptyTerminal();
        switch (tocken.tocken) {
            case "int":
                const stmt = this.parse_VarDecl();
                this.expect(";", "parse_Stmt");
                return stmt;
            case "identifier":
                return this.parse_Assign();
            case "print":
                return this.parse_Print();
        }
        throw new Error("[parse_Stmt]");
    }
    parse_VarDecl(): VarDecl {
        this.expect("int", "[parse_VarDecl]");
        let varDecl: VarDecl = new VarDecl({
            type: "int",
            identifiers: []
        })
        const tocken = this.expect("identifier", "parse_VarDecl");
        varDecl.identifiers.push(tocken.origin);
        while (true) {
            let tocken = this.lexer.nextNotEmptyTerminal();
            if (tocken.tocken !== ",") {
                break;
            }
            this.lexer.popNotEmptyTerminal();
            tocken = this.expect("identifier", "parse_VarDecl");
            varDecl.identifiers.push(tocken.origin);
        }
        return varDecl;
    }
    parse_Assign(): Assign {
        let tocken = this.expect("identifier", "parse_Assign");
        this.expect("=", "parse_Assign");
        const expr = this.parse_E();
        this.expect(";", "parse_Assign");
        return new Assign({
            identifier: tocken.origin,
            expr: expr
        })
    }
    parse_Print(): Print {
        this.expect("print", "parse_Print");
        this.expect("(", "parse_Print");
        const argus = this.parse_Arguments();
        this.expect(")", "parse_Print");
        this.expect(";", "parse_Print");
        return new Print({
            inArguments: argus
        })
    }
    parse_Arguments(): Arguments {
        let res: Arguments = new Arguments({
            val: []
        })
        let tocken = this.lexer.nextNotEmptyTerminal();
        if (tocken.tocken === "string") {
            res.val.push(tocken.origin);
            this.lexer.popNotEmptyTerminal();
        } else {
            let e1 = this.parse_E();
            res.val.push(e1);
        }
        while (true) {
            let tocken = this.lexer.nextNotEmptyTerminal();
            if (tocken.tocken !== ",") break;
            this.expect(",", "parse_Arguments");
            tocken = this.lexer.nextNotEmptyTerminal();
            if (tocken.tocken === "string") {
                res.val.push(tocken.origin);
                this.lexer.popNotEmptyTerminal();
            } else {
                let e1 = this.parse_E();
                res.val.push(e1);
            }
        }
        return res;
    }
    parse_E(): E {
        return this.parse_AdditiveExpression();
    }
    parse_AdditiveExpression(): AdditiveExpression {
        let e1 = this.parse_MultiplicativeExpression();
        let tocken = this.lexer.nextNotEmptyTerminal();
        const opt = tocken.tocken;
        if (!["+", "-"].includes(opt)) {
            return new AdditiveExpression({
                e1
            })
        }
        this.lexer.popNotEmptyTerminal();
        let e2 = this.parse_MultiplicativeExpression();
        return new AdditiveExpression({
            e1,
            e2,
            opt
        })
    }
    parse_MultiplicativeExpression(): MultiplicativeExpression {
        let e1 = this.parse_UnaryExpression();
        let tocken = this.lexer.nextNotEmptyTerminal();
        const opt = tocken.tocken;
        if (!["*", "/"].includes(opt)) {
            return new MultiplicativeExpression({
                e1
            })
        }
        this.lexer.popNotEmptyTerminal();
        let e2 = this.parse_UnaryExpression();
        return new MultiplicativeExpression({
            e1,
            e2,
            opt
        })
    }
    parse_UnaryExpression(): UnaryExpression {
        let tocken = this.lexer.nextNotEmptyTerminal();
        if (tocken.tocken === "-") {
            this.lexer.popNotEmptyTerminal();
            let e1 = this.parse_PrimaryExpression();
            return new UnaryExpression({
                e1,
                opt: "-"
            })
        }
        return new UnaryExpression({
            e1: this.parse_PrimaryExpression()
        })
    }
    parse_PrimaryExpression(): PrimaryExpression {
        let tocken = this.lexer.popNotEmptyTerminal();
        switch (tocken.tocken) {
            case "identifier":
                return new PrimaryExpression({
                    identifier: tocken.origin
                })
            case "integer":
                return new PrimaryExpression({
                    val: tocken.origin
                })
            case "(":
                let e1 = this.parse_AdditiveExpression();
                this.expect(")", "parse_PrimaryExpression")
                return new PrimaryExpression({
                    e1
                })
        }

        throw new Error("[parse_PrimaryExpression]")
    }

    expect(_tocken: string, error: string): Tocken {
        const tocken = this.lexer.popNotEmptyTerminal();
        if (tocken.tocken !== _tocken) {
            throw new Error(`[${error}] expect: ${_tocken} get: ${tocken.tocken}`);
        }
        return tocken;
    }
}