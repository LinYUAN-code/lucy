
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
}

export const INS_SPACE = "    ";
export class Assembly {
    globalData: Data[];
    functions: Function[];
    headers: string;
    stringLiteralsMap: Map<string, string>;
    stringLiteralIndex: number;
    stringLiteralPrefix: string;
    constructor() {
        this.globalData = [];
        this.functions = [];
        this.stringLiteralsMap = new Map();
        this.headers = "# lin0 assembly code\n";
        this.stringLiteralIndex = 0;
        this.stringLiteralPrefix = "L.str.";
    }
    appendGlobalData(name: string, type: string, val: string) {
        this.globalData.push({
            name,
            type,
            val
        });
    }
    appendFunction(methodName: string, methodBody: INS[], global: boolean = false) {
        this.functions.push({
            methodName,
            methodBody,
            global
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
        for (let ins of method.methodBody) {
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
    "r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15", "al"
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
export const al = "al";


export class INS {
    ins: string;
    o1?: string;
    o2?: string;
    o3?: string;
    constructor({ ins, o1, o2, o3 }: {
        ins: string;
        o1?: string;
        o2?: string;
        o3?: string;
    }) {
        this.ins = ins;
        this.o1 = o1 ? SAFE_NAME(o1) : "";
        this.o2 = o2 ? SAFE_NAME(o2) : "";
        this.o3 = o3 ? SAFE_NAME(o3) : "";
    }
    toRealInstrument(): string {
        let ans = `${INS_SPACE}${this.ins}${INS_SPACE}`;
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


export function SAFE_NAME(name: string): string {
    if (REGISTERS.includes(name)) {
        name = `%${name}`;
    }
    return name;
}