/* eslint-disable quotes */

import { al, Assembly, CompileContext, I, INS, r10, r11, rax, rbp, rbx, rdi, rdx, rsi, rsp } from "./assembly";


export type S = Array<GlobalDefinition>;
export type GlobalDefinition = VarDecl | Function;

export class BlockBody {
    body: Array<VarDecl | Assign | Print | Return | BlockBody>;
    constructor({ body }: {
        body: Array<VarDecl | Assign | Print | Return>;
    }) {
        this.body = body;
    }
    forEach(fn: (_: VarDecl | Assign | Print | Return | BlockBody) => void) {
        return this.body.forEach(fn);
    }
    push(stmt: VarDecl | Assign | Print | Return | BlockBody) {
        this.body.push(stmt);
    }
    setupCompileContext(assembly: Assembly, root: boolean = false) {
        if (root) {
            assembly.setupCompileContext();
        }
        assembly.getCompileContext().enterBlock();
        this.body.filter(stmt => {
            if (stmt instanceof BlockBody || stmt instanceof VarDecl) return true;
            return false;
        }).forEach(stmt => {
            stmt = stmt as (BlockBody | VarDecl);
            stmt.setupCompileContext(assembly);
        })
        assembly.getCompileContext().leaveBlock();
    }
    toAssembly(assembly: Assembly): INS[] {
        assembly.getCompileContext().enterBlock();
        let ins: INS[] = [];
        for (let stmt of this.body) {
            if (stmt instanceof Return) {
                // return 之后的语句不执行
                ins.push(...stmt.toAssembly(assembly));
                break;
            }
            ins.push(...stmt.toAssembly(assembly));
        }
        assembly.getCompileContext().leaveBlock();
        return ins;
    }
}

export class Function {
    functionName: string;
    blockBody: BlockBody;
    argumentDefinition: FunctionArgumentDefinition;
    returnType: string;
    global?: boolean;
    constructor({ functionName, blockBody, argumentDefinition, returnType, global }: {
        blockBody: BlockBody;
        argumentDefinition: FunctionArgumentDefinition;
        returnType: string;
        functionName: string;
        global?: boolean;
    }) {
        this.functionName = functionName;
        this.blockBody = blockBody;
        this.argumentDefinition = argumentDefinition;
        this.returnType = returnType;
        this.global = (functionName === "main") ? true : false;
    }
    public execute(ctx: Context) {
    }
    public toAssembly(assembly: Assembly): INS[] {
        const ins: INS[] = [];
        // 初始化编译环境：变量声明在栈中的位置
        this.blockBody.setupCompileContext(assembly, true);
        ins.push(...this.blockBody.toAssembly(assembly));
        assembly.appendFunction(this.functionName, ins, assembly.getCompileContext().slotSum, this.global);
        assembly.removeCompileContext();
        return [];
    }
    public getStringLiterals(): string[] {
        return [];
    }
}
export class Variable {
    type: string;
    identifier: string;
    constructor({ type, identifier }: {
        type: string;
        identifier: string;
    }) {
        this.identifier = identifier;
        this.type = type;
    }
}
export class FunctionArgumentDefinition {
    variables: Variable[];
    constructor({ variables = [] }: {
        variables?: Variable[];
    }) {
        this.variables = variables;
    }
    public execute(ctx: Context) {

    }
    public toAssembly(stringLiteralsMap: Map<string, string>): string {
        let ans = "";
        return ans;
    }
    public getStringLiterals(): string[] {
        return [];
    }
}


export class VarDecl {
    type: string;
    identifiers: string[];
    global?: boolean;
    constructor({ type, identifiers, global }: {
        type: string;
        identifiers: string[];
        global?: boolean;
    }) {
        this.identifiers = identifiers;
        this.type = type;
        this.global = global;
    }
    public execute(ctx: Context) {
        for (let x of this.identifiers) {
            ctx.arriableTable.set(x, 0);
        }
    }
    public toAssembly(assembly: Assembly): INS[] {
        if (!this.global) {
            const compileContext = assembly.getCompileContext();
            let ans: INS[] = [];
            for (let identifier of this.identifiers) {
                ans.push(I('movq', '$0', compileContext.getVariablePos(identifier))); // 默认初始化为 0
            }
            return ans;
        } else {
            // 全局变量
            let type = "";
            switch (this.type) {
                case "int":
                    type = "quad";
                    break;
            }
            for (let identifier of this.identifiers) {
                assembly.appendGlobalData(identifier, type, "0x0");
            }
            return [];
        }
    }
    setupCompileContext(assembly: Assembly) {
        const compileContext = assembly.getCompileContext();
        let size = 0;
        switch (this.type) {
            case "int":
                size = 8;
        }
        for (let identifier of this.identifiers) {
            compileContext.findVariable(identifier, size);
        }
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
    public toAssembly(assembly: Assembly): INS[] {
        let ans: INS[] = [];
        const stackState = {
            num: 0,
        }
        const compileContext = assembly.getCompileContext();
        ans.push(...this.expr.getTOSCAAssembly(stackState, compileContext));
        ans.push(I('popq', compileContext.getVariablePos(this.identifier)));
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
    public toAssembly(assembly: Assembly): INS[] {
        let ans: INS[] = [];
        for (let argument of this.arguments.val) {
            ans.push(I('pushq', rbp));

            if (typeof argument === "string") {
                // 字符串
                ans.push(I('leaq', assembly.getStringLiteralPos(argument), rdi));
                ans.push(I('xorb', al, al));
                ans.push(I('callq', '_printf'));

            } else if ((argument as any) instanceof AdditiveExpression) {
                // 表达式 TODO!
                const stackState = {
                    num: 0,
                }
                const compileContext = assembly.getCompileContext();
                ans.push(...argument.getTOSCAAssembly(stackState, compileContext));
                ans.push(I('popq', rsi));
                ans.push(I('leaq', assembly.getStringLiteralPos('"%d\n"'), rdi));
                ans.push(I('xorb', al, al));
                ans.push(I('callq', '_printf'));
            }
            ans.push(I('popq', rbp));
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

export class Return {
    e: E;
    constructor({ e }: {
        e: E;
    }) {
        this.e = e;
    }

    public toAssembly(assembly: Assembly): INS[] {
        let ans: INS[] = [];
        const compileContext = assembly.getCompileContext();
        ans.push(...this.e.getTOSCAAssembly({ num: 0 }, compileContext));
        ans.push(I('popq', rax));
        ans.push(I('retq'));
        return ans;
    }
    public getStringLiterals(): string[] {
        let ans: string[] = [];
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
    public getTOSCAAssembly(stackState: { num: number }, compileContext: CompileContext): INS[] {
        let ans: INS[] = [];
        if (this.e2) {
            ans.push(...this.e2.getTOSCAAssembly(stackState, compileContext));
            ans.push(...this.e1.getTOSCAAssembly(stackState, compileContext));
            if (stackState.num < 2) {
                throw new Error("[AdditiveExpression] getTOSCAAssembly error");
            }
            stackState.num -= 1;
            ans.push(I("popq", "r10"));
            ans.push(I("popq", "r11"));
            switch (this.opt) {
                case "+":
                    ans.push(I("addq", r11, r10));
                    break;
                case "-":
                    ans.push(I('subq', r11, r10));
                    break;
            }
            ans.push(I('pushq', r10));
        } else {
            ans.push(...this.e1.getTOSCAAssembly(stackState, compileContext));
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
    public getTOSCAAssembly(stackState: { num: number }, compileContext: CompileContext): INS[] {
        let ans: INS[] = [];
        if (this.e2) {
            ans.push(...this.e2.getTOSCAAssembly(stackState, compileContext));
            ans.push(...this.e1.getTOSCAAssembly(stackState, compileContext));
            if (stackState.num < 2) {
                throw new Error("[MultiplicativeExpression] getTOSCAAssembly error");
            }
            stackState.num -= 1;
            ans.push(I("popq", "r10"));
            ans.push(I("popq", "r11"));
            switch (this.opt) {
                case "*":
                    ans.push(I('imulq', r11, r10));
                    ans.push(I('pushq', r10));
                    break;
                case "/":
                    ans.push(I('pushq', rdx));
                    ans.push(I('movq', r10, rax));
                    ans.push(I('cqto'));
                    ans.push(I('idivq', r11));
                    ans.push(I('popq', rdx));
                    ans.push(I('pushq', rax));
                    break;
                case "%":
                    ans.push(I('pushq', rdx));
                    ans.push(I('movq', r10, rax));
                    ans.push(I('cqto'));
                    ans.push(I('idivq', r11));
                    ans.push(I('movq', rdx, r11));
                    ans.push(I('popq', rdx));
                    ans.push(I('pushq', r11));

                    break;
            }
        } else {
            ans.push(...this.e1.getTOSCAAssembly(stackState, compileContext));
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
    public getTOSCAAssembly(stackState: { num: number }, compileContext: CompileContext): INS[] {
        let ans: INS[] = this.e1.getTOSCAAssembly(stackState, compileContext);
        if (this.opt) {
            switch (this.opt) {
                case "-":
                    ans.push(I('popq', r11));
                    ans.push(I('xorq', r10, r10));
                    ans.push(I('subq', r11, r10));
                    ans.push(I('pushq', r10));;
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
    public getTOSCAAssembly(stackState: { num: number }, compileContext: CompileContext): INS[] {
        let ans: INS[] = [];
        if (this.e1) {
            ans.push(...this.e1.getTOSCAAssembly(stackState, compileContext));
        } else if (!isNaN(this.val as any)) {
            stackState.num++;
            ans.push(I('pushq', `$${this.val}`));
        } else if (this.identifier) {
            stackState.num++;
            ans.push(I('pushq', compileContext.getVariablePos(this.identifier)));
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

