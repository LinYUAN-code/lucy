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
        let ans = '';
        const stackState = {
            num: 0,
        }
        ans += this.expr.getTOSCAAssembly(stackState);
        ans += `    popq    ${this.identifier}(%rip)\n`;
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
        let ans = "";
        for (let argument of this.arguments.val) {
            ans += "    pushq    %rbp\n";

            if (typeof argument === "string") {
                // 字符串
                ans +=
                    `    leaq    ${stringLiteralsMap.get(argument.replaceAll("\n", "\\n"))!}(%rip), %rdi 
    xorb    %al, %al
    callq   _printf\n`
            } else if ((argument as any) instanceof AdditiveExpression) {
                // 表达式 TODO!
                const stackState = {
                    num: 0,
                }
                ans += argument.getTOSCAAssembly(stackState);
                ans += '    popq    %rsi\n';
                ans +=
                    `    leaq    ${stringLiteralsMap.get(`\"%d\\n\"`)!}(%rip), %rdi 
    xorb    %al, %al
    callq   _printf\n`;
            }
            ans += "    popq    %rbp\n"

        }
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
    e1: AdditiveExpression | MultiplicativeExpression;
    e2?: MultiplicativeExpression;
    opt?: string;
    constructor({ e1, e2, opt }: {
        e1: AdditiveExpression | MultiplicativeExpression;
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
    public getTOSCAAssembly(stackState: { num: number }): string {
        let ans = '';
        if (this.e2) {
            ans += this.e2.getTOSCAAssembly(stackState);
            ans += this.e1.getTOSCAAssembly(stackState);
            if (stackState.num < 2) {
                throw new Error("[AdditiveExpression] getTOSCAAssembly error");
            }
            stackState.num -= 1;
            ans += `    popq    %r10\n`;
            ans += `    popq    %r11\n`;
            switch (this.opt) {
                case "+":
                    ans += `    addq    %r11, %r10\n`;
                    break;
                case "-":
                    // 减法变化为加一个负数
                    ans += `    subq    %r11, %r10\n`;
                    break;
            }
            ans += `    pushq   %r10\n`;
        } else {
            ans += this.e1.getTOSCAAssembly(stackState);
        }
        return ans;
    }
    public getAllIdentifiers(): string[] {
        const arr1 = this.e1.getAllIdentifiers();
        if (this.e2) {
            arr1.push(...this.e2.getAllIdentifiers());
        }
        return arr1;
    }
}

export class MultiplicativeExpression {
    e1: MultiplicativeExpression | UnaryExpression;
    e2?: UnaryExpression;
    opt?: string;
    constructor({ e1, e2, opt }: {
        e1: MultiplicativeExpression | UnaryExpression;
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
    public getTOSCAAssembly(stackState: { num: number }): string {
        let ans = '';
        if (this.e2) {
            ans += this.e2.getTOSCAAssembly(stackState);
            ans += this.e1.getTOSCAAssembly(stackState);
            if (stackState.num < 2) {
                throw new Error("[MultiplicativeExpression] getTOSCAAssembly error");
            }
            stackState.num -= 1;
            ans += `    popq    %r10\n`;
            ans += `    popq    %r11\n`;
            switch (this.opt) {
                case "*":
                    ans += `    imulq    %r11, %r10\n`;
                    ans += `    pushq   %r10\n`;
                    break;
                case "/":
                    ans += `    pushq   %rdx\n`;
                    ans += `    movq    %r10, %rax\n`;
                    ans += `    cqto\n`;    // cqto 会扩展 rax => rdx:rax
                    ans += `    idivq    %r11\n`;  // 商会放在rax 余数放在rdx
                    ans += `    popq    %rdx\n`;
                    ans += `    pushq   %rax\n`;
                    break;
                case "%":
                    ans += `    pushq   %rdx\n`;
                    ans += `    movq    %r10, %rax\n`;
                    ans += `    cqto\n`;    // cqto 会扩展 rax => rdx:rax
                    ans += `    idivq    %r11\n`;  // 商会放在rax 余数放在rdx
                    ans += `    movq   %rdx, %r11\n`;
                    ans += `    popq    %rdx\n`;
                    ans += `    pushq   %r11\n`;
                    break;
            }
        } else {
            ans += this.e1.getTOSCAAssembly(stackState);
        }
        return ans;
    }
    public getAllIdentifiers(): string[] {
        const arr1 = this.e1.getAllIdentifiers();
        if (this.e2) {
            arr1.push(...this.e2.getAllIdentifiers());
        }
        return arr1;
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
    public getTOSCAAssembly(stackState: { num: number }): string {
        let ans = this.e1.getTOSCAAssembly(stackState);
        if (this.opt) {
            switch (this.opt) {
                case "-":
                    ans += `    popq    %r11\n`;
                    ans += `    xorq    %r10, %r10\n`;
                    ans += `    subq    %r11, %r10\n`;
                    ans += `    pushq   %r10\n`;
                    break;
            }
        }
        return ans
    }
    public getAllIdentifiers(): string[] {
        return this.e1.getAllIdentifiers();
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
    public getTOSCAAssembly(stackState: { num: number }): string {
        let ans = '';
        if (this.e1) {
            ans += this.e1.getTOSCAAssembly(stackState);
        } else if (this.val) {
            stackState.num++;
            ans += `    pushq    $${this.val}\n`
        } else if (this.identifier) {
            stackState.num++;
            ans += `    pushq    ${this.identifier}(%rip)\n`;
        }
        return ans;
    }
    public getAllIdentifiers(): string[] {
        if (this.e1) {
            return this.e1.getAllIdentifiers();
        }
        if (this.identifier) {
            return [this.identifier];
        }
        return [];
    }
}


export class Context {
    arriableTable: Map<string, any>;
    constructor() {
        this.arriableTable = new Map();
    }
}