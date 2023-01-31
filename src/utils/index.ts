import Lexer from "@/lexer";
import log from "./log";

export function transferString2Grammers(lexer: Lexer, grammers: Array<string>): Grammers {
    return grammers.map(grammer => {
        return grammer.replaceAll(/\s/g, "");
    }).map(grammer => {
        const arr = grammer.split(/(=>)|(->)/).filter(v => v !== "=>" && v !== "->" && v);
        const derivations = arr[1].split("|").filter(v => v && v !== "|").map(derivation => {
            return lexer.splitDerivation(derivation);
        })
        return {
            nonTerminal: arr[0],
            derivations: derivations,
        }
    });

}

export function isSetIncludes(a: Set<unknown>, b: Set<unknown>): boolean {
    for (let item of b.keys()) {
        if (!a.has(item)) {
            return false;
        }
    }
    return true;
}

export function safeRegCharacter(char: string): string {
    switch (char) {
        case "+":
        case "*":
        case "(":
        case ")":
            return `\\${char}`;
        default:
            return char;
    }
}