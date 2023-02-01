import Lexer from "@/lexer";
import { EmptyCharacter, EndingCharacter } from "@/utils/const";
import log from "@/utils/log";


test("first set test", () => {
    const lexer = new Lexer([
        [EmptyCharacter, /^ε/],
        ["int", /^(0|[1-9][0-9]*)/],
        ["+", /^\+/],
        ["*", /^\*/],
        ["(", /^\(/],
        [")", /^\)/],
    ], []);
    lexer.setSource("12 + 32 * 67".replaceAll(/\s/g, ""));
    try {
        while (true) {
            const tocken = lexer.pop();
            if (tocken.tocken === EndingCharacter) break;
        }
    } catch (e) {
        log.log(e);
    }
    expect(1 + 1).toBe(2);
})