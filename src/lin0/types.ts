/* eslint-disable quotes */

import { ah, al, Assembly, ax, CompileContext, I, INS, r10, r11, r8, r9, rax, rbp, rbx, rcx, rdi, rdx, rsi, rsp, TagI } from "./assembly";

export const ParamRegisters = [rdi, rsi, rdx, rcx, r8, r9];
export type S = Array<GlobalDefinition>;
export type GlobalDefinition = VarDecl | Function;
export const NumberSIZE = 8;

type BlockStmt = VarDecl | Assign | Print | Return | BlockBody | FunctionCall | IfStmt | ForStmt | Break | Continue;
type StringLiteral = string;
export type E = CompareExpression;


export class Continue {
    public toAssembly(assembly: Assembly): INS[] {
        const ins: INS[] = [];
        ins.push(I('jmp', assembly.getCompileContext().getLoopExtData().continueTag));
        return ins;
    }
    setupCompileContext(assembly: Assembly) {
    }
}

export class Break {
    public toAssembly(assembly: Assembly): INS[] {
        const ins: INS[] = [];
        ins.push(I('jmp', assembly.getCompileContext().getLoopExtData().breakTag));
        return ins;
    }
    setupCompileContext(assembly: Assembly) {
    }
}

export class ForStmt {
    varDecl?: VarDecl;
    expr?: E;
    assign?: Assign;
    block: BlockBody;
    constructor({ varDecl, expr, assign, block }: {
        varDecl?: VarDecl;
        expr?: E;
        assign?: Assign;
        block: BlockBody;
    }) {
        this.varDecl = varDecl;
        this.expr = expr;
        this.assign = assign;
        this.block = block;
    }
    public toAssembly(assembly: Assembly): INS[] {
        const ins: INS[] = [];
        const compileContext = assembly.getCompileContext();
        compileContext.enterBlock();
        const checkTag = assembly.getNewJumpTag();
        const outterTag = assembly.getNewJumpTag();
        const stepTag = assembly.getNewJumpTag();
        ins.push(...(this.varDecl?.toAssembly(assembly) || []));
        ins.push(TagI(checkTag, "nop"));
        ins.push(...(this.expr?.getTOSCAAssembly(assembly) || []));
        ins.push(...compileContext.optPop(r10));
        ins.push(I('cmp', '$0', r10));
        ins.push(I('je', outterTag));
        compileContext.setLoopExtData({
            breakTag: outterTag,
            continueTag: stepTag
        });
        ins.push(...this.block.toAssembly(assembly));
        compileContext.setLoopExtData();
        ins.push(TagI(stepTag, "nop"));
        ins.push(...(this.assign?.toAssembly(assembly) || []));
        ins.push(I("jmp", checkTag));
        ins.push(TagI(outterTag, "nop"));
        compileContext.leaveBlock();
        return ins;
    }
    setupCompileContext(assembly: Assembly) {
        const compileContext = assembly.getCompileContext();
        compileContext.enterBlock();
        this.varDecl?.setupCompileContext(assembly);
        this.expr?.setupCompileContext(assembly);
        this.block.setupCompileContext(assembly);
        this.assign?.setupCompileContext(assembly);
        compileContext.leaveBlock();
    }
}
export class IfStmt {
    expr: E;
    block1: BlockBody;
    block2?: BlockBody | IfStmt;
    constructor({ expr, block1, block2 }: {
        expr: E;
        block1: BlockBody;
        block2?: BlockBody | IfStmt;
    }) {
        this.expr = expr;
        this.block1 = block1;
        this.block2 = block2;
    }
    public toAssembly(assembly: Assembly): INS[] {
        const ins: INS[] = [];
        const compileContext = assembly.getCompileContext();
        ins.push(...this.expr.getTOSCAAssembly(assembly));
        ins.push(...compileContext.optPop(r10))
        ins.push(I('cmp', '$0', r10));
        const outerTag = assembly.getNewJumpTag();
        const tag1 = assembly.getNewJumpTag();
        if (this.block2) {
            ins.push(I('je', tag1));   // 等于0那么跳转
        } else {
            ins.push(I('je', outerTag));
        }
        ins.push(...this.block1.toAssembly(assembly));
        ins.push(I('jmp', outerTag));
        if (this.block2) {
            ins.push(TagI(tag1, 'nop'));
            ins.push(...this.block2.toAssembly(assembly));
        }
        ins.push(TagI(outerTag, 'nop'));
        return ins;
    }
    setupCompileContext(assembly: Assembly) {
        const compileContext = assembly.getCompileContext();
        this.expr.setupCompileContext(assembly);
        compileContext.countOptPop(NumberSIZE);
        this.block1.setupCompileContext(assembly);
        this.block2?.setupCompileContext(assembly);
    }
}
export class BlockBody {
    body: Array<BlockStmt>;
    constructor({ body }: {
        body: Array<BlockStmt>;
    }) {
        this.body = body;
    }
    forEach(fn: (_: BlockStmt) => void) {
        return this.body.forEach(fn);
    }
    push(stmt: BlockStmt) {
        this.body.push(stmt);
    }
    setupCompileContext(assembly: Assembly) {
        assembly.getCompileContext().enterBlock();
        this.body.forEach(stmt => {
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

export class FunctionCall {
    functionName: string;
    arguments: Arguments;
    needPushToStack?: boolean;
    constructor({ functionName, in_arguments, needPushToStack }: {
        functionName: string;
        in_arguments: Arguments;
        needPushToStack?: boolean;
    }) {
        this.functionName = functionName;
        this.arguments = in_arguments;
        this.needPushToStack = needPushToStack;
    }
    public toAssembly(assembly: Assembly): INS[] {
        const ins: INS[] = [];
        const compileContext = assembly.getCompileContext();
        compileContext.enterBlock();
        // 传入参数
        ins.push(...this.arguments.toAssembly(assembly));
        // 函数调用
        ins.push(I('callq', this.functionName[0] === '_' ? this.functionName : `_${this.functionName}`));
        // 返回值
        if (this.needPushToStack) {
            ins.push(...compileContext.optPush(rax));
        }
        compileContext.leaveBlock();
        return ins;
    }
    setupCompileContext(assembly: Assembly) {
        const compileContext = assembly.getCompileContext();
        compileContext.enterBlock();
        this.arguments.setupCompileContext(assembly);
        if (this.needPushToStack) {
            // TODO! 函数返回值不是8byte的时候
            compileContext.countOptPush(NumberSIZE);
        }
        compileContext.leaveBlock();
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
        this.setupCompileContext(assembly);
        assembly.getCompileContext().resetBlockId();
        // 参数入栈
        ins.push(...this.argumentDefinition.toAssembly(assembly));
        // 函数体执行
        ins.push(...this.blockBody.toAssembly(assembly));
        assembly.appendFunction(this.functionName, ins, assembly.getCompileContext().getStackSize(), this.global);
        assembly.removeCompileContext();
        return [];
    }
    setupCompileContext(assembly: Assembly) {
        assembly.setupCompileContext();
        this.argumentDefinition.setupCompileContext(assembly);
        this.blockBody.setupCompileContext(assembly);
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
    getSize(): number {
        switch (this.type) {
            case "int":
                return 8;
        }
        throw new Error("[Variable getSize] unknow type");
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
    public toAssembly(assembly: Assembly): INS[] {
        let ans: INS[] = [];
        // %rdi, %rsi, %rdx, %rcx, %r8, %r9 用来传 function 的前 6 个参数 再多的参数用stack来传递
        // TODO! 支持6个以上的参数
        const compileContext = assembly.getCompileContext();
        for (let i = 0; i < this.variables.length && i < 6; i++) {
            ans.push(I('movq', ParamRegisters[i], compileContext.getVariablePos(this.variables[i].identifier)));
        }
        return ans;
    }
    public getStringLiterals(): string[] {
        return [];
    }
    setupCompileContext(assembly: Assembly) {
        const compileContext = assembly.getCompileContext();
        for (let variable of this.variables) {
            compileContext.findVariable(variable.identifier, variable.getSize());
        }
    }
}


export class VarDecl {
    type: string;
    decls: {
        identifier: string;
        expr?: E;
    }[];
    global?: boolean;
    constructor({ type, global, decls }: {
        type: string;
        decls: {
            identifier: string;
            expr?: E;
        }[];
        global?: boolean;
    }) {
        this.type = type;
        this.global = global;
        this.decls = decls;
    }
    public execute(ctx: Context) {
        for (let x of this.decls) {
            ctx.arriableTable.set(x.identifier, 0);
        }
    }
    public toAssembly(assembly: Assembly): INS[] {
        if (!this.global) {
            const compileContext = assembly.getCompileContext();
            let ans: INS[] = [];

            for (let decl of this.decls) {
                if (decl.expr) {
                    ans.push(...decl.expr.getTOSCAAssembly(assembly));
                    ans.push(...compileContext.optPop(r10));
                    ans.push(I('movq', r10, compileContext.getVariablePos(decl.identifier)));
                } else {
                    ans.push(I('movq', '$0', compileContext.getVariablePos(decl.identifier)));
                }
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
            for (let decl of this.decls) {
                assembly.appendGlobalData(decl.identifier, type, "0x0");
            }
            // TODO! 全局变量参数初始化
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
        for (let decl of this.decls) {
            decl.expr?.setupCompileContext(assembly);
            compileContext.findVariable(decl.identifier, size);
        }
    }
}
export class Assign {
    identifier: string;
    expr: E | AdditiveExpression | MultiplicativeExpression;
    constructor({ identifier, expr }: {
        identifier: string;
        expr: E | AdditiveExpression | MultiplicativeExpression;
    }) {
        this.identifier = identifier;
        this.expr = expr;
    }
    public execute(ctx: Context) {
        ctx.arriableTable.set(this.identifier, this.expr.getValue(ctx));
    }
    public toAssembly(assembly: Assembly): INS[] {
        let ans: INS[] = [];
        const compileContext = assembly.getCompileContext();
        ans.push(...this.expr.getTOSCAAssembly(assembly));
        ans.push(...compileContext.optPop(compileContext.getVariablePos(this.identifier)));
        return ans;
    }
    public getStringLiterals(): string[] {
        return [];
    }
    setupCompileContext(assembly: Assembly) {
        const compileContext = assembly.getCompileContext();
        this.expr.setupCompileContext(assembly);
        compileContext.countOptPop(NumberSIZE);
    }
}

export class Arguments {
    vals: Array<StringLiteral | E>
    constructor({ vals }: {
        vals: Array<string | E>
    }) {
        this.vals = vals;
    }
    public getValue(ctx: Context): Array<any> {
        return this.vals.map(val => {
            if (typeof val === "string") {
                return val;
            }
            return val.getValue(ctx);
        })
    }
    public toAssembly(assembly: Assembly): INS[] {
        let ans: INS[] = [];
        const compileContext = assembly.getCompileContext();
        // TODO! 支持6个以上的参数
        for (let i = 0; i < this.vals.length && i < 6; i++) {
            const val = this.vals[i];
            if (typeof val === 'string') {
                ans.push(I('leaq', assembly.getStringLiteralPos(val), ParamRegisters[i]));
            } else {
                ans.push(...val.getTOSCAAssembly(assembly));
                ans.push(...compileContext.optPop(ParamRegisters[i]))
            }
        }
        return ans;
    }
    setupCompileContext(assembly: Assembly) {
        const compileContext = assembly.getCompileContext();
        for (let argument of this.vals) {
            if (argument instanceof CompareExpression) {
                argument.setupCompileContext(assembly);
                compileContext.countOptPop(NumberSIZE);
            }
        }
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
        const compileContext = assembly.getCompileContext();
        for (let argument of this.arguments.vals) {
            if (typeof argument === "string") {
                // 字符串
                ans.push(I('leaq', assembly.getStringLiteralPos(argument), rdi));
                ans.push(I('xorb', al, al));
                ans.push(I('callq', '_printf'));

            } else if ((argument as any) instanceof CompareExpression) {
                ans.push(...argument.getTOSCAAssembly(assembly));
                ans.push(...compileContext.optPop(rsi));
                ans.push(I('leaq', assembly.getStringLiteralPos('"%d\n"'), rdi));
                ans.push(I('xorb', al, al));
                ans.push(I('callq', '_printf'));
            }
        }
        return ans;
    }
    public getStringLiterals(): string[] {
        let ans = [];
        for (let argument of this.arguments.vals) {
            if (typeof argument === "string") {
                ans.push(argument);
            }
        }
        return ans;
    }
    setupCompileContext(assembly: Assembly) {
        this.arguments.setupCompileContext(assembly);
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
        ans.push(...this.e.getTOSCAAssembly(assembly));
        ans.push(...compileContext.optPop(rax));
        ans.push(I('retq'));
        return ans;
    }
    public getStringLiterals(): string[] {
        let ans: string[] = [];
        return ans;
    }
    setupCompileContext(assembly: Assembly) {
        const compileContext = assembly.getCompileContext();
        this.e.setupCompileContext(assembly);
        compileContext.countOptPop(NumberSIZE);
    }
}



export class CompareExpression {
    e1: CompareExpression | AdditiveExpression;
    e2?: AdditiveExpression;
    opt?: string;
    constructor({ e1, e2, opt }: {
        e1: CompareExpression | AdditiveExpression;
        e2?: AdditiveExpression;
        opt?: string;
    }) {
        this.e1 = e1;
        this.e2 = e2;
        this.opt = opt;
    }
    public getValue(ctx: Context): number {
        throw new Error("[EqualityExpression] getValue");
    }
    public getAssembly(): string {
        throw new Error("");
    }
    public getTOSCAAssembly(assembly: Assembly): INS[] {
        let ans: INS[] = [];
        const compileContext = assembly.getCompileContext();
        if (this.e2) {
            ans.push(...this.e2.getTOSCAAssembly(assembly));
            ans.push(...this.e1.getTOSCAAssembly(assembly));
            ans.push(...compileContext.optPop(r10));
            ans.push(...compileContext.optPop(r11));
            // ["===", "==", "!=",">", ">=", "<", "<="]
            switch (this.opt) {
                case "==":
                // TODO!: 完善类型系统之后去做 like 比较
                case "===":
                    // 严格比较
                    ans.push(I("xorq", rax, rax));
                    ans.push(I("cmp", r11, r10));
                    ans.push(I("LAHF")); // 将标志位寄存器的低八位 移入 AH
                    ans.push(I("shr", '$6', ah));
                    ans.push(I("and", '$1', ah));
                    ans.push(I("shr", '$8', ax));
                    ans.push(...compileContext.optPush(rax));
                    break;
                case ">":
                    ans.push(I("xorq", rax, rax));
                    ans.push(I("cmp", r11, r10));
                    ans.push(I("LAHF")); // 将标志位寄存器的低八位 移入 AH
                    ans.push(I("shr", '$7', ah));
                    ans.push(I("and", '$1', ah));
                    ans.push(I("shr", '$8', ax));
                    ans.push(...compileContext.optPush(rax));

                    ans.push(I("xorq", rax, rax));
                    ans.push(I("cmp", r11, r10));
                    ans.push(I("LAHF")); // 将标志位寄存器的低八位 移入 AH
                    ans.push(I("shr", '$6', ah));
                    ans.push(I("and", '$1', ah));
                    ans.push(I("shr", '$8', ax));
                    ans.push(...compileContext.optPush(rax));

                    ans.push(...compileContext.optPop(r11));
                    ans.push(...compileContext.optPop(r10));
                    ans.push(I("xor", '$1', r11));
                    ans.push(I("xor", '$1', r10));
                    ans.push(I("and", r11, r10));
                    ans.push(...compileContext.optPush(r10));
                    break;
                case ">=":
                    ans.push(I("xorq", rax, rax));
                    ans.push(I("cmp", r11, r10));
                    ans.push(I("LAHF")); // 将标志位寄存器的低八位 移入 AH
                    ans.push(I("shr", '$7', ah));
                    ans.push(I("and", '$1', ah));
                    ans.push(I("shr", '$8', ax));
                    ans.push(I("xor", '$1', al));
                    ans.push(...compileContext.optPush(rax));
                    break;
                case "<":
                    ans.push(I("xorq", rax, rax));
                    ans.push(I("cmp", r11, r10));
                    ans.push(I("LAHF")); // 将标志位寄存器的低八位 移入 AH
                    ans.push(I("shr", '$7', ah));
                    ans.push(I("and", '$1', ah));
                    ans.push(I("shr", '$8', ax));
                    ans.push(...compileContext.optPush(rax));
                    break;
                case "<=":
                    ans.push(I("xorq", rax, rax));
                    ans.push(I("cmp", r11, r10));
                    ans.push(I("LAHF")); // 将标志位寄存器的低八位 移入 AH
                    ans.push(I("shr", '$7', ah));
                    ans.push(I("and", '$1', ah));
                    ans.push(I("shr", '$8', ax));
                    ans.push(...compileContext.optPush(rax));

                    ans.push(I("xorq", rax, rax));
                    ans.push(I("cmp", r11, r10));
                    ans.push(I("LAHF")); // 将标志位寄存器的低八位 移入 AH
                    ans.push(I("shr", '$6', ah));
                    ans.push(I("and", '$1', ah));
                    ans.push(I("shr", '$8', ax));
                    ans.push(...compileContext.optPush(rax));

                    ans.push(...compileContext.optPop(r11));
                    ans.push(...compileContext.optPop(r10));
                    ans.push(I("xor", r11, r10));
                    ans.push(...compileContext.optPush(r10));
                    break;
                case "!=":
                    // 严格比较
                    ans.push(I("xorq", rax, rax));
                    ans.push(I("cmp", r11, r10));
                    ans.push(I("LAHF")); // 将标志位寄存器的低八位 移入 AH
                    ans.push(I("shr", '$6', ah));
                    ans.push(I("and", '$1', ah));
                    ans.push(I("shr", '$8', ax));
                    ans.push(I("xor", '$1', al));
                    ans.push(...compileContext.optPush(rax));
                    break;
            }
        } else {
            ans.push(...this.e1.getTOSCAAssembly(assembly));
        }
        return ans;
    }
    setupCompileContext(assembly: Assembly) {
        const compileContext = assembly.getCompileContext();
        if (this.e2) {
            this.e2.setupCompileContext(assembly);
            this.e1.setupCompileContext(assembly);
            compileContext.countOptPop(NumberSIZE);
        } else {
            this.e1.setupCompileContext(assembly);
        }
    }
}
export class AdditiveExpression {
    e1: AdditiveExpression | MultiplicativeExpression | PrimaryExpression;
    e2?: MultiplicativeExpression | PrimaryExpression;
    opt?: string;
    constructor({ e1, e2, opt }: {
        e1: AdditiveExpression | MultiplicativeExpression | PrimaryExpression;
        e2?: MultiplicativeExpression | PrimaryExpression;
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
    public getTOSCAAssembly(assembly: Assembly): INS[] {
        let ans: INS[] = [];
        const compileContext = assembly.getCompileContext();
        if (this.e2) {
            ans.push(...this.e2.getTOSCAAssembly(assembly));
            ans.push(...this.e1.getTOSCAAssembly(assembly));
            ans.push(...compileContext.optPop(r10));
            ans.push(...compileContext.optPop(r11));
            switch (this.opt) {
                case "+":
                    ans.push(I("addq", r11, r10));
                    break;
                case "-":
                    ans.push(I('subq', r11, r10));
                    break;
            }
            ans.push(...compileContext.optPush(r10));
        } else {
            ans.push(...this.e1.getTOSCAAssembly(assembly));
        }
        return ans;
    }
    setupCompileContext(assembly: Assembly) {
        const compileContext = assembly.getCompileContext();
        if (this.e2) {
            this.e2.setupCompileContext(assembly);
            this.e1.setupCompileContext(assembly);
            compileContext.countOptPop(NumberSIZE);
        } else {
            this.e1.setupCompileContext(assembly);
        }
    }
}

export class MultiplicativeExpression {
    e1: MultiplicativeExpression | UnaryExpression | PrimaryExpression;
    e2?: UnaryExpression | PrimaryExpression;
    opt?: string;
    constructor({ e1, e2, opt }: {
        e1: MultiplicativeExpression | UnaryExpression | PrimaryExpression;
        e2?: UnaryExpression | PrimaryExpression;
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
    public getTOSCAAssembly(assembly: Assembly): INS[] {
        const compileContext = assembly.getCompileContext();
        let ans: INS[] = [];
        if (this.e2) {
            ans.push(...this.e2.getTOSCAAssembly(assembly));
            ans.push(...this.e1.getTOSCAAssembly(assembly));
            ans.push(...compileContext.optPop(r10));
            ans.push(...compileContext.optPop(r11));
            switch (this.opt) {
                case "*":
                    ans.push(I('imulq', r11, r10));
                    ans.push(...compileContext.optPush(r10));
                    break;
                case "/":
                    ans.push(...compileContext.optPush(rdx));
                    ans.push(I('movq', r10, rax));
                    ans.push(I('cqto'));
                    ans.push(I('idivq', r11));
                    ans.push(...compileContext.optPop(rdx));
                    ans.push(...compileContext.optPush(rax));
                    break;
                case "%":
                    ans.push(...compileContext.optPush(rdx));
                    ans.push(I('movq', r10, rax));
                    ans.push(I('cqto'));
                    ans.push(I('idivq', r11));
                    ans.push(I('movq', rdx, r11));
                    ans.push(...compileContext.optPop(rdx));
                    ans.push(...compileContext.optPush(r11));
                    break;
            }
        } else {
            ans.push(...this.e1.getTOSCAAssembly(assembly));
        }
        return ans;
    }
    setupCompileContext(assembly: Assembly) {
        const compileContext = assembly.getCompileContext();
        if (this.e2) {
            this.e2.setupCompileContext(assembly);
            this.e1.setupCompileContext(assembly);
            compileContext.countOptPop(NumberSIZE);
        } else {
            this.e1.setupCompileContext(assembly);
        }
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
    public getTOSCAAssembly(assembly: Assembly): INS[] {
        let ans: INS[] = this.e1.getTOSCAAssembly(assembly);
        const compileContext = assembly.getCompileContext();
        if (this.opt) {
            switch (this.opt) {
                case "-":
                    ans.push(...compileContext.optPop(r11));
                    ans.push(I('xorq', r10, r10));
                    ans.push(I('subq', r11, r10));
                    ans.push(...compileContext.optPush(r10));
                    break;
            }
        }
        return ans
    }
    setupCompileContext(assembly: Assembly) {
        this.e1.setupCompileContext(assembly);
    }
}

export class PrimaryExpression {
    e1?: E;
    val?: number;
    identifier?: string;
    functionCall?: FunctionCall;
    constructor({ e1, val, identifier, functionCall }: {
        e1?: E;
        val?: string;
        identifier?: string;
        functionCall?: FunctionCall;
    }) {
        this.e1 = e1;
        this.val = Number(val);
        this.identifier = identifier;
        this.functionCall = functionCall;
    }
    public getValue(ctx: Context): number {
        if (this.e1) {
            return this.e1.getValue(ctx);
        }
        if (!isNaN(this.val as any)) {
            return this.val!;
        }
        if (this.identifier) {
            if (!ctx.arriableTable.has(this.identifier)) {
                throw new Error(`[PrimaryExpression] getValue identifier not exists identifier: ${this.identifier}`);
            }
            return ctx.arriableTable.get(this.identifier);
        }
        throw new Error("[PrimaryExpression] getValue")
    }
    public getTOSCAAssembly(assembly: Assembly): INS[] {
        const compileContext = assembly.getCompileContext();
        let ans: INS[] = [];
        if (this.e1) {
            ans.push(...this.e1.getTOSCAAssembly(assembly));
        } else if (!isNaN(this.val as any)) {
            ans.push(...compileContext.optPush(`$${this.val}`));
        } else if (this.identifier) {
            ans.push(...compileContext.optPush(compileContext.getVariablePos(this.identifier)));
        } else if (this.functionCall) {
            ans.push(...this.functionCall.toAssembly(assembly));
        }
        return ans;
    }
    setupCompileContext(assembly: Assembly) {
        const compileContext = assembly.getCompileContext();
        if (this.e1) {
            this.e1.setupCompileContext(assembly);
        } else if (!isNaN(this.val as any)) {
            compileContext.countOptPush(NumberSIZE);
        } else if (this.identifier) {
            // TODO! 根据变量类型统计
            compileContext.countOptPush(NumberSIZE);
        } else if (this.functionCall) {
            this.functionCall.setupCompileContext(assembly);
        }
    }
}


export class Context {
    arriableTable: Map<string, any>;
    constructor() {
        this.arriableTable = new Map();
    }
}

