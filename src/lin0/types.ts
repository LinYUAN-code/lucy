/* eslint-disable quotes */


export type S = Array<Stmt>;
export type Stmt = VarDecl | Assign | Print;
export class VarDecl {
    type: string;
    identifiers: string[];
    constructor({ type, identifiers }: {
        type: string;
        identifiers: string[];
    }) {
        this.identifiers = identifiers;
        this.type = type;
    }
    public execute(ctx: Context) {
        for (let x of this.identifiers) {
            ctx.arriableTable.set(x, 0);
        }
    }
    public toAssembly(stringLiteralsMap: Map<string, string>): string {
        let ans = "";
        return ans;
    }
    public getStringLiterals(): string[] {
        return [];
    }
}
export class Assign {
    identifier: string;
    expr: E;
    constructor({ identifier, expr }: {
        identifier: string;
        expr: E;
    }) {
        this.identifier = identifier;
        this.expr = expr;
    }
    public execute(ctx: Context) {
        ctx.arriableTable.set(this.identifier, this.expr.getValue(ctx));
    }
    public toAssembly(stringLiteralsMap: Map<string, string>): string {
        let ans = "";
        return ans;
    }
    public getStringLiterals(): string[] {
        return [];
    }
}

export class Arguments {
    val: Array<string | E>
    constructor({ val }: {
        val: Array<string | E>
    }) {
        this.val = val;
    }
    public getValue(ctx: Context): Array<any> {
        return this.val.map(val => {
            if (typeof val === "string") {
                return val;
            }
            return val.getValue(ctx);
        })
    }
    public toAssembly(): string {
        let ans = "";
        return ans;
    }
}

export class Print {
    arguments: Arguments;
    constructor({ inArguments }: {
        inArguments: Arguments;
    }) {
        this.arguments = inArguments;
    }
    public execute(ctx: Context) {
        console.log(...this.arguments.getValue(ctx))
    }
    public toAssembly(stringLiteralsMap: Map<string, string>): string {
        let ans = "    pushq    %rbp\n";
        for (let argument of this.arguments.val) {
            if (typeof argument === "string") {
                // 字符串
                ans +=
                    `    leaq    ${stringLiteralsMap.get(argument.replaceAll("\n", "\\n"))!}(%rip), %rdi 
    xorb %al, %al
    callq   _printf\n`
            } else if ((argument as any) instanceof AdditiveExpression) {
                // 表达式 TODO!
                ans +=

                    `    leaq    ${stringLiteralsMap.get(`\"%d\\n\"`)!}(%rip), %rdi 
    movq    $100, %rsi
    xorb %al, %al
    callq   _printf\n`;
            }
        }
        ans += "    popq    %rbp\n"
        return ans;
    }
    public getStringLiterals(): string[] {
        let ans = [];
        for (let argument of this.arguments.val) {
            if (typeof argument === "string") {
                ans.push(argument);
            }
        }
        return ans;
    }
}

export type E = AdditiveExpression;

export class AdditiveExpression {
    e1: MultiplicativeExpression;
    e2?: MultiplicativeExpression;
    opt?: string;
    constructor({ e1, e2, opt }: {
        e1: MultiplicativeExpression;
        e2?: MultiplicativeExpression;
        opt?: string;
    }) {
        this.e1 = e1;
        this.e2 = e2;
        this.opt = opt;
    }
    public getValue(ctx: Context): number {
        if (this.e2) {
            switch (this.opt) {
                case "+":
                    return this.e1.getValue(ctx) + this.e2.getValue(ctx);
                case "-":
                    return this.e1.getValue(ctx) - this.e2.getValue(ctx);
            }
            throw new Error("[AdditiveExpression] getValue")
        }
        return this.e1.getValue(ctx);
    }
    public getAssembly(): string {
        throw new Error("");
    }
}

export class MultiplicativeExpression {
    e1: UnaryExpression;
    e2?: UnaryExpression;
    opt?: string;
    constructor({ e1, e2, opt }: {
        e1: UnaryExpression;
        e2?: UnaryExpression;
        opt?: string;
    }) {
        this.e1 = e1;
        this.e2 = e2;
        this.opt = opt;
    }
    public getValue(ctx: Context): number {
        if (this.e2) {
            switch (this.opt) {
                case "*":
                    return this.e1.getValue(ctx) * this.e2.getValue(ctx);
                case "/":
                    return this.e1.getValue(ctx) / this.e2.getValue(ctx);
            }
            throw new Error("[MultiplicativeExpression] getValue")
        }
        return this.e1.getValue(ctx);
    }
}

export class UnaryExpression {
    e1: PrimaryExpression;
    opt?: string;
    constructor({ e1, opt }: {
        e1: PrimaryExpression;
        opt?: string;
    }) {
        this.e1 = e1;
        this.opt = opt;
    }
    public getValue(ctx: Context): number {
        if (this.opt) {
            switch (this.opt) {
                case "-":
                    return this.e1.getValue(ctx) * this.e1.getValue(ctx);
            }
            throw new Error("[UnaryExpression] getValue")
        }
        return this.e1.getValue(ctx);
    }
}

export class PrimaryExpression {
    e1?: AdditiveExpression;
    val?: number;
    identifier?: string;
    constructor({ e1, val, identifier }: {
        e1?: AdditiveExpression;
        val?: string;
        identifier?: string;
    }) {
        this.e1 = e1;
        this.val = Number(val);
        this.identifier = identifier;
    }
    public getValue(ctx: Context): number {
        if (this.e1) {
            return this.e1.getValue(ctx);
        }
        if (this.val) {
            return this.val;
        }
        if (this.identifier) {
            if (!ctx.arriableTable.has(this.identifier)) {
                throw new Error(`[PrimaryExpression] getValue identifier not exists identifier: ${this.identifier}`);
            }
            return ctx.arriableTable.get(this.identifier);
        }
        throw new Error("[PrimaryExpression] getValue")
    }
}


export class Context {
    arriableTable: Map<string, any>;
    constructor() {
        this.arriableTable = new Map();
    }
}