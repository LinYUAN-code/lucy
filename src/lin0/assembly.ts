
type Data = {
    name: string;
    type: string;
    val: string;
}
type StringLiteral = {
    name: string;
    val: string;
}
type Function = {
    methodName: string;
    methodBody: INS[];
    global: boolean;
    stackSize: number;
}
// 栈区域分配
/*
    0. rbp
    1. 局部变量区域 slotSum
    2. 操作数栈区域 optStackSize

    attention: (1. + 2.) % 16  === 0
*/
export class CompileContext {
    variableTable: Map<string, number>;
    blockDeep: number;
    slotSum: number; //局部变量的大小
    optStackSize: number; //计算栈的大小
    optStackNum: number;
    tmpOptSize: number;
    constructor() {
        this.blockDeep = 0;
        this.slotSum = 0;
        this.optStackNum = 0;
        this.optStackSize = 0;
        this.tmpOptSize = 0;
        this.variableTable = new Map();
    }
    countOptPush(byte: number) {
        this.tmpOptSize += byte;
        this.optStackSize = Math.max(this.tmpOptSize, this.optStackSize);
    }
    countOptPop(byte: number) {
        this.tmpOptSize -= byte;
    }
    optPush(val: string): INS[] {
        this.optStackNum += 8;
        // 注意movq 不能操作内存到内存
        let ans = [];
        // 注意movq 不能操作内存到内存
        if (/\([^)]*\)/.exec(val)) {
            ans.push(I("movq", val, r9));
            ans.push(I("movq", r9, `-${this.slotSum + this.optStackNum}(%rbp)`));
        } else {
            ans.push(I("movq", val, `-${this.slotSum + this.optStackNum}(%rbp)`));
        }
        return ans;
    }
    optPop(target: string): INS[] {
        if (this.optStackNum <= 0) {
            throw new Error("[optPop] optStackNum is empty");
        }
        let ans = [];
        // 注意movq 不能操作内存到内存
        if (/\([^)]*\)/.exec(target)) {
            ans.push(I("movq", `-${this.slotSum + this.optStackNum}(%rbp)`, r9));
            ans.push(I("movq", r9, target));
        } else {
            ans.push(I("movq", `-${this.slotSum + this.optStackNum}(%rbp)`, target));
        }
        this.optStackNum -= 8;
        return ans;
    }
    enterBlock() {
        this.blockDeep++;
    }
    leaveBlock() {
        this.blockDeep--;
    }
    findVariable(identifier: string, size: number) {
        this.slotSum += size;
        this.variableTable.set(`${identifier}.${this.blockDeep}`, this.slotSum);
    }
    getVariablePos(identifier: string): string {
        // 逐级查找
        for (let i = this.blockDeep; i >= 0; i--) {
            const key = `${identifier}.${i}`;
            if (this.variableTable.has(key)) {
                return `-${this.variableTable.get(key)!}(%rbp)`;
            }
        }
        return `${identifier}(%rip)`;
    }
    getStackSize() {
        if ((this.slotSum + this.optStackSize) % 16) {
            return this.slotSum + this.optStackSize + 8;
        }
        return this.slotSum + this.optStackSize;
    }
}

export const INS_SPACE = "    ";
export class Assembly {
    globalData: Data[];
    functions: Function[];
    headers: string;
    stringLiteralsMap: Map<string, string>;
    stringLiteralIndex: number;
    stringLiteralPrefix: string;
    compileContext?: CompileContext;
    jumpTagPrefix: string;
    jumpTagIndex: number;
    constructor() {
        this.globalData = [];
        this.functions = [];
        this.stringLiteralsMap = new Map();
        this.headers = "# lin0 assembly code\n";
        this.stringLiteralIndex = 0;
        this.stringLiteralPrefix = "L.str.";
        this.jumpTagIndex = 0;
        this.jumpTagPrefix = "LBB.";
    }
    setupCompileContext() {
        this.compileContext = new CompileContext();
    }
    removeCompileContext() {
        this.compileContext = undefined;
    }
    getNewJumpTag(): string {
        return `${this.jumpTagPrefix}${this.jumpTagIndex++}`;
    }
    getCompileContext(): CompileContext {
        if (!this.compileContext) {
            throw new Error("[getCompileContext]");
        }
        return this.compileContext;
    }
    appendGlobalData(name: string, type: string, val: string) {
        this.globalData.push({
            name,
            type,
            val
        });
    }
    appendFunction(methodName: string, methodBody: INS[], stackSize: number, global: boolean = false) {
        this.functions.push({
            methodName,
            methodBody,
            stackSize,
            global,
        })
    }
    appendStringLiteral(val: string) {
        this.stringLiteralsMap.set(val, `${this.stringLiteralPrefix}${this.stringLiteralIndex++}`);
    }
    getGlobalVariablePos(identifier: string) {
        return `${identifier}(%rip)\n`;
    }
    getStringLiteralPos(val: string) {
        // 不存在的话加入
        val = val.replaceAll("\n", "\\n");
        if (!this.stringLiteralsMap.has(val)) {
            this.stringLiteralsMap.set(val, `${this.stringLiteralPrefix}${this.stringLiteralIndex++}`);
        }
        return `${this.stringLiteralsMap.get(val.replaceAll("\n", "\\n"))}(%rip)`;
    }
    getGlobalDataDefinition(): string {
        let ans = `${INS_SPACE}.data\n`;
        for (let data of this.globalData) {
            ans += `${data.name}:  .${data.type}   ${data.val}\n`;
        }
        return ans;
    }
    getFunctionAssembly(method: Function): string {
        let ans = "";
        if (method.global) {
            ans += `${INS_SPACE}.global _${method.methodName}\n`;
        }
        ans += `_${method.methodName}:\n`;
        ans += I("pushq", rbp).toRealInstrument();
        ans += I("movq", rsp, rbp).toRealInstrument();
        ans += I("subq", `$${method.stackSize}`, rsp).toRealInstrument();
        for (let ins of method.methodBody) {
            if (ins.ins === "retq") {
                ans += I("addq", `$${method.stackSize}`, rsp).toRealInstrument();
                ans += I("popq", rbp).toRealInstrument();
            }
            ans += ins.toRealInstrument();
        }
        return ans;
    }
    toString(): string {
        let ans = "";
        ans += this.headers;
        ans += this.getGlobalDataDefinition();
        ans += `${INS_SPACE}.text\n`;
        for (let method of this.functions) {
            ans += this.getFunctionAssembly(method);
        }
        ans += `${INS_SPACE}.section	__TEXT, __cstring\n`;
        for (let c_string of this.stringLiteralsMap.keys()) {
            ans += `${this.stringLiteralsMap.get(c_string)}:${INS_SPACE}.asciz ${c_string}\n`;
        }
        return ans;
    }
    toFile(filePath: string) {
        const asm = this.toString();
    }
}


const REGISTERS = [
    "rax", "rbx", "rcx", "rdx", "rdi", "rsi", "rbp", "rsp",
    "r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15", "al", "ah", "ax", "spl"
]

export const rax = "rax";
export const rbx = "rbx";
export const rcx = "rcx";
export const rdx = "rdx";
export const rdi = "rdi";
export const rsi = "rsi";
export const rbp = "rbp";
export const rsp = "rsp";
export const r8 = "r8";
export const r9 = "r9";
export const r10 = "r10";
export const r11 = "r11";
export const r12 = "r12";
export const r13 = "r13";
export const r14 = "r14";
export const r15 = "r15";
export const al = "al"; //rax 寄存器的低八位
export const ah = "ah";
export const ax = "ax"; //rax 低16位
export const spl = "spl"; //rsp 寄存器的低八位
export const ecx = "ecx"; //rcx 寄存器的低32位


export class INS {
    label?: string;
    ins: string;
    o1?: string;
    o2?: string;
    o3?: string;
    constructor({ ins, o1, o2, o3, label }: {
        ins: string;
        o1?: string;
        o2?: string;
        o3?: string;
        label?: string;
    }) {
        this.ins = ins;
        this.o1 = o1 ? SAFE_NAME(o1) : "";
        this.o2 = o2 ? SAFE_NAME(o2) : "";
        this.o3 = o3 ? SAFE_NAME(o3) : "";
        this.label = label;
    }
    toRealInstrument(): string {
        let ans = "";
        if (this.label) {
            ans += `${this.label}:\n`;
        }
        ans += `${INS_SPACE}${this.ins}${INS_SPACE}`;
        this.o1 ? ans += `${this.o1}, ` : 0;
        this.o2 ? ans += `${this.o2}, ` : 0;
        this.o3 ? ans += `${this.o3}, ` : 0;
        if (this.o1) {
            ans = ans.slice(0, ans.length - 2);
        }
        return ans + "\n";
    }
}
export function I(ins: string, o1?: string, o2?: string, o3?: string): INS {
    return new INS({
        ins,
        o1,
        o2,
        o3
    })
}
export function TagI(label: string, ins: string, o1?: string, o2?: string, o3?: string): INS {
    return new INS({
        label,
        ins,
        o1,
        o2,
        o3
    })
}



export function SAFE_NAME(name: string): string {
    if (REGISTERS.includes(name)) {
        name = `%${name}`;
    }
    return name;
}