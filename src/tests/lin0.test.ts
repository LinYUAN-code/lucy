import Interpreter from "@/lin0/interpreter";
import fs from "fs";
import path from "path"
test("test interpreter0", () => {
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
        print(a,c,10-a+c);
    `)
    // [print] 81 10 -61
})

test("test assembly0", () => {
    const interpreter = new Interpreter();

    const s = interpreter.toAssembly(`
        int a, b, c, d;
        function main(): int {
            a = 1 + 2 * ( 2 + 2 );
            b = 5;
            c = 10;
            d = c + d;
    
            print(c / 5);
            print("hello world\n",a);
            print(a);
            print(b);
            print(c);
            print(d);
            print(a - 5 + 10 * 4);
            print(10/2);
            return 0;
        }
    `)
    fs.writeFileSync(path.join(__dirname, "../lin0/assembly/learnAssembly/lin0.s"), s);

    console.log(s);
})

test("test assembly1", () => {
    const interpreter = new Interpreter();
    const div_mod_test = interpreter.toAssembly(`
        function main(): int {
            print(10 / 5);
            print(10 % 5);
            print(3 % 2);
            return 0;
        }
    `)

    console.log(div_mod_test);
    fs.writeFileSync(path.join(__dirname, "../lin0/assembly/learnAssembly/lin1.s"), div_mod_test);
})


test("test assembly2", () => {
    const interpreter = new Interpreter();
    const asm = interpreter.toAssembly(`
        int a;
        int b;
        function helloWorld(): int {
            print("hello World\n",a+b);
        }
        function main(): int {
            int a;
            int b;
            a = 10;
            b = 20;
            print("main\n");
            print(a);
            print(b);
            return 0;
        }
    `)
    console.log(asm);
    fs.writeFileSync(path.join(__dirname, "../lin0/assembly/learnAssembly/lin2.s"), asm);

})