import Interpreter from "@/lin0/interpreter";
import fs from "fs";
import path from "path"
test("first set test", () => {
    const interpreter = new Interpreter();
    // interpreter.run(`
    //     int a, b, c, d;
    //     a = 1 + 2 * ( 2 + 2 );
    //     c = 5;
    //     d = 10;
    //     b = c + d;

    //     print("hello world",a,b,c,d);
    // `)
    // // [print] "hello world" 9 15 5 10
    // interpreter.run(`
    //     a = a * 9;
    //     c = c + 5;
    //     print(a,c,10-a+c);
    // `)
    // // [print] 81 10 -61

    const div_mod_test = interpreter.toAssembly(`
        print(10 / 5);
        print(10 % 5);
        print(3 % 2);
    `)

    console.log(div_mod_test);

    const s = interpreter.toAssembly(`
        int a, b, c, d;
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
    `)
    fs.writeFileSync(path.join(__dirname, "../lin0/assembly/learnAssembly/lin0.s"), s);

    console.log(s);
})