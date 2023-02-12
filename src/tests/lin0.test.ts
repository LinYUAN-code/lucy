import Interpreter from "@/lin0/interpreter";

test("first set test", () => {
    const interpreter = new Interpreter();
    interpreter.run(`
        int a, b, c, d;
        a = 1 + 2 * ( 2 + 2 );
        c = 5;
        d = 10;
        b = c + d;

        print("hello world",a,b,c,d);
    `)
    // [print] "hello world" 9 15 5 10
    interpreter.run(`
        a = a * 9;
        c = c + 5;
        print(a,c);
    `)
    // [print] 81 10
})