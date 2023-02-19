import { Tocken } from "@/types/type";
import { EmptyCharacter, EndingCharacter } from "@/utils/const";
import { Lexer } from "..";
import { AdditiveExpression, Arguments, Assign, BlockBody, E, Function, FunctionArgumentDefinition, MultiplicativeExpression, PrimaryExpression, Print, S, GlobalDefinition, UnaryExpression, VarDecl, Variable, Return } from "./types";

let global = false;
const terminals: Array<[string, RegExp]> = [
    ["-", /^-/],
    ["/", /^\//],
    ["+", /^\+/],
    ["*", /^\*/],
    ["%", /^\%/],
    ["(", /^\(/],
    [")", /^\)/],
    ["=", /^=/],
    [",", /^,/],
    [";", /^;/],
    ["{", /^{/],
    ["}", /^}/],
    [":", /^:/],
    ["global", /^global/],
    ["return", /^return/],
    ["BasicType", /^int/],
    ["print", /^print/],
    ["string", /^"[^"]*"/],
    ["function", /^function/],
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
                const stmt = this.parse_GlobalDefinition();
                res.push(stmt);
            } catch (e) {
                console.log(e);
                break;
            }
        }
        return res;
    }
    parse_GlobalDefinition(): GlobalDefinition {
        const tocken = this.lexer.nextNotEmptyTerminal();
        switch (tocken.tocken) {
            case "BasicType":
                global = true;
                const stmt = this.parse_VarDecl();
                global = false;
                this.expect(";", "parse_Stmt");
                return stmt;
            case "function":
                return this.parse_Function();
        }
        throw new Error("[parse_Stmt]");
    }
    parse_BlockBody(): BlockBody {
        this.expect("{", "parse_BlockBody");
        let res: BlockBody = new BlockBody({ body: [] });
        while (true) {
            const tocken = this.lexer.nextNotEmptyTerminal();
            switch (tocken.tocken) {
                case "BasicType":
                    const stmt = this.parse_VarDecl();
                    this.expect(";", "parse_Stmt");
                    res.push(stmt);
                    break;
                case "identifier":
                    res.push(this.parse_Assign());
                    break;
                case "print":
                    res.push(this.parse_Print());
                    break;
                case "return":
                    res.push(this.parse_Return());
                    break;
                default:
                    this.expect("}", "parse_BlockBody");
                    return res;
            }
        }
    }
    parse_Return(): Return {
        this.expect("return", "parse_Return");
        let e = this.parse_E();
        this.expect(";", "parse_Return");
        return new Return({
            e
        });
    }
    parse_FunctionArgumentDefinition(): FunctionArgumentDefinition {
        let tocken = this.lexer.nextNotEmptyTerminal();
        let argumentDefinition = new FunctionArgumentDefinition({});
        if (tocken.tocken !== "BasicType") {
            return argumentDefinition;
        }
        while (true) {
            const typeTocken = this.expect("BasicType", "parse_FunctionArgumentDefinition");
            tocken = this.expect("identifier", "parse_FunctionArgumentDefinition");
            argumentDefinition.variables.push(new Variable({
                type: typeTocken.origin,
                identifier: tocken.origin
            }));
            tocken = this.lexer.nextNotEmptyTerminal();
            if (tocken.tocken !== ",") {
                break;
            }
            this.lexer.popNotEmptyTerminal();
        }
        return argumentDefinition;
    }
    parse_Function(): Function {
        this.expect("function", "parse_Function");
        let global = false;
        if (this.predict("global")) {
            global = true;
        }
        let functionNameTocken = this.expect("identifier", "parse_Function");
        this.expect("(", "parse_Function");
        let argumentDefinition = this.parse_FunctionArgumentDefinition();
        this.expect(")", "parse_Function");
        this.expect(":", "parse_Function");
        let returnTypeTocken = this.expect("BasicType", "parse_Function");
        let blockBody = this.parse_BlockBody();
        return new Function({
            functionName: functionNameTocken.origin,
            blockBody,
            argumentDefinition,
            returnType: returnTypeTocken.origin,
            global
        })
    }
    parse_VarDecl(): VarDecl {
        let tocken = this.expect("BasicType", "[parse_VarDecl]");
        let varDecl: VarDecl = new VarDecl({
            type: tocken.origin,
            identifiers: [],
            global: global,
        })
        tocken = this.expect("identifier", "parse_VarDecl");
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
        let opt = tocken.tocken;
        if (!["+", "-"].includes(opt)) {
            return new AdditiveExpression({
                e1
            })
        }
        let e = new AdditiveExpression({
            e1
        })
        while (["+", "-"].includes(opt)) {
            this.lexer.popNotEmptyTerminal();
            e.e2 = this.parse_MultiplicativeExpression();
            e.opt = opt;
            e = new AdditiveExpression({
                e1: e,
            })
            opt = this.lexer.nextNotEmptyTerminal().tocken;
        }
        return e;

    }
    parse_MultiplicativeExpression(): MultiplicativeExpression {
        let e1 = this.parse_UnaryExpression();
        let tocken = this.lexer.nextNotEmptyTerminal();
        let opt = tocken.tocken;
        if (!["*", "/", "%"].includes(opt)) {
            return new MultiplicativeExpression({
                e1
            })
        }
        let e = new MultiplicativeExpression({
            e1
        })
        while (["*", "/", "%"].includes(opt)) {
            this.lexer.popNotEmptyTerminal();
            e.e2 = this.parse_UnaryExpression();
            e.opt = opt;
            e = new MultiplicativeExpression({
                e1: e,
            })
            opt = this.lexer.nextNotEmptyTerminal().tocken;
        }
        return e;
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
    predict(_tocken: string): Tocken | null {
        const tocken = this.lexer.nextNotEmptyTerminal();
        if (tocken.tocken === _tocken) {
            this.lexer.popNotEmptyTerminal();
        }
        return null;
    }
}