import { Tocken } from "@/types/type";
import { EmptyCharacter, EndingCharacter } from "@/utils/const";
import { Lexer } from "..";
import { AdditiveExpression, Arguments, Assign, BlockBody, E, Function, FunctionArgumentDefinition, MultiplicativeExpression, PrimaryExpression, Print, S, GlobalDefinition, UnaryExpression, VarDecl, Variable, Return, FunctionCall, IfStmt, CompareExpression, ForStmt, Break, Continue } from "./types";

let global = false;
const terminals: Array<[string, RegExp]> = [
    ["/", /^\//],
    ["++", /^\+\+/], //todo!
    ["+=", /^\+\=/], //todo!
    ["-=", /^\-\=/], //todo!
    ["*=", /^\*\=/], //todo!
    ["-", /^-/],
    ["+", /^\+/],
    ["*", /^\*/],
    ["%", /^\%/],
    ["(", /^\(/],
    [")", /^\)/],
    ["===", /^===/],
    ["==", /^==/],
    ["=", /^=/],
    [",", /^,/],
    [";", /^;/],
    ["{", /^{/],
    ["}", /^}/],
    [":", /^:/],
    [">=", /^\>\=/],
    ["<=", /^\<\=/],
    [">", /^\>/],
    ["<", /^\</],
    ["!=", /^\!\=/],
    ["if", /^if/],
    ["for", /^for/],
    ["break", /^break/],
    ["continue", /^continue/],
    ["else", /^else/],
    ["global", /^global/],
    ["return", /^return/],
    ["BasicType", /^int/],
    ["print", /^print/],
    ["string", /^"[^"]*"/],
    ["function", /^function/],
    ["integer", /^(([1-9][0-9]*)|([0-9]))/],
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
                    switch (this.lexer.nextNotEmpty(2).tocken) {
                        case "+=":
                        case "-=":
                        case "*=":
                        case "=":
                            res.push(this.parse_Assign());
                            break;
                        case "(":
                            res.push(this.parse_FunctionCall());
                            break;
                    }
                    break;
                case "print":
                    res.push(this.parse_Print());
                    break;
                case "return":
                    res.push(this.parse_Return());
                    break;
                case "if":
                    res.push(this.parse_IfStmt());
                    break;
                case "for":
                    res.push(this.parse_ForStmt());
                    break;
                case "break":
                    res.push(this.parse_Break());
                    break;
                case "continue":
                    res.push(this.parse_Continue());
                    break;
                default:
                    this.expect("}", "parse_BlockBody");
                    return res;
            }
        }
    }
    parse_Break(): Break {
        this.expect("break", "parse_Break");
        this.expect(";", "parse_Break");
        return new Break();
    }
    parse_Continue(): Continue {
        this.expect("continue", "parse_Break");
        this.expect(";", "parse_Break");
        return new Continue();
    }
    parse_Return(): Return {
        this.expect("return", "parse_Return");
        let e = this.parse_E();
        this.expect(";", "parse_Return");
        return new Return({
            e
        });
    }
    parse_ForStmt(): ForStmt {
        this.expect("for", "parse_ForStmt");
        this.expect("(", "parse_ForStmt");
        let varDecl, expr, assign, block;
        if (!this.predict(";")) {
            varDecl = this.parse_VarDecl();
            this.expect(";", "parse_ForStmt");
        }
        if (!this.predict(";")) {
            expr = this.parse_E();
            this.expect(";", "parse_ForStmt");
        }
        if (!this.predict(")")) {
            assign = this.parse_Assign(false);
            this.expect(")", "parse_ForStmt");
        }
        block = this.parse_BlockBody();
        return new ForStmt({
            varDecl,
            expr,
            assign,
            block
        })
    }
    parse_IfStmt(): IfStmt {
        this.expect("if", "parse_IFStmt");
        this.expect("(", "parse_IFStmt");
        let expr = this.parse_E();
        this.expect(")", "parse_IFStmt");
        let block1 = this.parse_BlockBody();
        let tocken = this.lexer.nextNotEmptyTerminal();
        if (tocken.tocken === "else") {
            this.lexer.popNotEmptyTerminal();
            tocken = this.lexer.nextNotEmptyTerminal();
            if (tocken.tocken === "{") {
                return new IfStmt({
                    expr,
                    block1,
                    block2: this.parse_BlockBody(),
                })
            } else if (tocken.tocken === "if") {
                // if
                return new IfStmt({
                    expr,
                    block1,
                    block2: this.parse_IfStmt(),
                })
            }
            throw new Error("[parse_IFStmt]")
        } else {
            return new IfStmt({
                expr,
                block1
            })
        }
    }
    parse_FunctionCall(): FunctionCall {
        let functionNameTocken = this.expect("identifier", "parse_FunctionCall");
        this.expect("(", "parse_FunctionCall");
        let in_arguments = this.parse_Arguments();
        this.expect(")", "parse_FunctionCall");
        this.expect(";", "parse_FunctionCall")
        return new FunctionCall({
            functionName: functionNameTocken.origin,
            in_arguments
        })
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
            decls: [],
            global: global,
        })
        let identifier, expr;
        identifier = this.expect("identifier", "parse_VarDecl");
        if (this.predict("=")) {
            expr = this.parse_E();
        }
        varDecl.decls.push({
            identifier: identifier.origin,
            expr
        })
        while (true) {
            let tocken = this.lexer.nextNotEmptyTerminal();
            if (tocken.tocken !== ",") {
                break;
            }
            this.lexer.popNotEmptyTerminal();
            identifier = this.expect("identifier", "parse_VarDecl");
            if (this.predict("=")) {
                expr = this.parse_E();
                varDecl.decls.push({
                    identifier: identifier.origin,
                    expr
                })
            } else {
                varDecl.decls.push({
                    identifier: identifier.origin,
                });
            }
        }
        return varDecl;
    }
    parse_Assign(needSemicolon = true): Assign {
        let identifierTocken = this.expect("identifier", "parse_Assign");
        let optTocken = this.lexer.popNotEmptyTerminal();
        switch (optTocken.tocken) {
            case "=": {
                const expr = this.parse_E();
                if (needSemicolon) {
                    this.expect(";", "parse_Assign");
                }
                return new Assign({
                    identifier: identifierTocken.origin,
                    expr: expr
                })
            }
            case "+=": {
                let exprR = this.parse_E();
                const expr = new AdditiveExpression({
                    e1: new PrimaryExpression({ identifier: identifierTocken.origin }),
                    e2: new PrimaryExpression({ e1: exprR }),
                    opt: "+",
                })
                if (needSemicolon) {
                    this.expect(";", "parse_Assign");
                }
                return new Assign({
                    identifier: identifierTocken.origin,
                    expr: expr
                })
            }
            case "-=": {
                let exprR = this.parse_E();
                const expr = new AdditiveExpression({
                    e1: new PrimaryExpression({ identifier: identifierTocken.origin }),
                    e2: new PrimaryExpression({ e1: exprR }),
                    opt: "-",
                })
                if (needSemicolon) {
                    this.expect(";", "parse_Assign");
                }
                return new Assign({
                    identifier: identifierTocken.origin,
                    expr: expr
                })
            }
            case "*=": {
                let exprR = this.parse_E();
                const expr = new MultiplicativeExpression({
                    e1: new PrimaryExpression({ identifier: identifierTocken.origin }),
                    e2: new PrimaryExpression({ e1: exprR }),
                    opt: "*",
                })
                if (needSemicolon) {
                    this.expect(";", "parse_Assign");
                }
                return new Assign({
                    identifier: identifierTocken.origin,
                    expr: expr
                })
            }
            default:
                throw new Error("[parse_Assign]");
        }

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
            vals: []
        })
        let tocken = this.lexer.nextNotEmptyTerminal();
        if (tocken.tocken === "string") {
            res.vals.push(tocken.origin);
            this.lexer.popNotEmptyTerminal();
        } else {
            let e1 = this.parse_E();
            res.vals.push(e1);
        }
        while (true) {
            let tocken = this.lexer.nextNotEmptyTerminal();
            if (tocken.tocken !== ",") break;
            this.expect(",", "parse_Arguments");
            tocken = this.lexer.nextNotEmptyTerminal();
            if (tocken.tocken === "string") {
                res.vals.push(tocken.origin);
                this.lexer.popNotEmptyTerminal();
            } else {
                let e1 = this.parse_E();
                res.vals.push(e1);
            }
        }
        return res;
    }
    parse_E(): E {
        return this.parse_CompareExpression();
    }
    parse_CompareExpression(): CompareExpression {
        let e1 = this.parse_AdditiveExpression();
        let tocken = this.lexer.nextNotEmptyTerminal();
        let opt = tocken.tocken;
        if (!["===", "==", "!=", ">", ">=", "<", "<="].includes(opt)) {
            return new CompareExpression({
                e1
            })
        }
        let e = new CompareExpression({
            e1
        })
        while (["===", "==", "!=", ">", ">=", "<", "<="].includes(opt)) {
            this.lexer.popNotEmptyTerminal();
            e.e2 = this.parse_AdditiveExpression();
            e.opt = opt;
            e = new CompareExpression({
                e1: e,
            })
            opt = this.lexer.nextNotEmptyTerminal().tocken;
        }
        return e;
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
        switch (tocken.tocken) {
            case "-":
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
                switch (this.lexer.nextNotEmpty(2).tocken) {
                    case "(":
                        const functionCall = this.parse_FunctionCall();
                        functionCall.needPushToStack = true;
                        return new PrimaryExpression({
                            functionCall,
                        });
                    default:
                        return new PrimaryExpression({
                            identifier: tocken.origin
                        })
                }
            case "integer":
                return new PrimaryExpression({
                    val: tocken.origin
                })
            case "(":
                let e1 = this.parse_E();
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
            return tocken;
        }
        return null;
    }
}