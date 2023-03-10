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
        int c;
        function helloWorld(int a,int b): int {
            c = c + 1;
            print("hello World\n",a+b,c);
            return 0;
        }
        function main(): int {
            int a;
            int b;
            a = 10;
            b = 20;
            helloWorld(a,b);
            print("main\n");
            print(a);
            print(b);
            return 0;
        }
    `)
    console.log(asm);
    fs.writeFileSync(path.join(__dirname, "../lin0/assembly/learnAssembly/lin2.s"), asm);

})

test("test assembly3", () => {
    const interpreter = new Interpreter();
    const asm = interpreter.toAssembly(`
        function helloWorld(int a,int b): int {
            print("hello World\n",a+b);
            return 0;
        }
        function main(): int {
            int a;
            int b;
            int c;
            c = 99 + 1;
            a = 10;
            b = 20;
            helloWorld(a,b);
            print(c);
            _printf("lrj %d\n",100);
            return 0;
        }
    `)
    console.log(asm);
    fs.writeFileSync(path.join(__dirname, "../lin0/assembly/learnAssembly/lin3.s"), asm);

})


test("test assembly4", () => {
    const interpreter = new Interpreter();
    const asm = interpreter.toAssembly(`
        function main(): int {
            print("1==1: ",1==1);
            print("2==1: ",2==1);

            print("1!=2: ",1!=2);
            print("1!=1: ",1!=1);

            print("1<2: ",1<2);
            print("1<1: ",1<1);   
            print("1<=0: ",1<=0);
            print("1<=1: ",1<=1);  

            print("1>2: ",1>2);
            print("1>0: ",1>0);   
            print("1>=7: ",1>=7);
            print("1>=1: ",1>=1); 
            return 0;
        }
    `)
    console.log(asm);
    fs.writeFileSync(path.join(__dirname, "../lin0/assembly/learnAssembly/lin4.s"), asm);

})

test("test assembly5", () => {
    const interpreter = new Interpreter();
    const asm = interpreter.toAssembly(`
        function main(): int {
            if(5==3) {
                print("work\n");
            } else if(2==1) {
                print("play1\n");
            } else if(1==1) {
                print("play2\n");
            } else {
                print("play3\n");
            }
            return 0;
        }
    `)
    console.log(asm);
    fs.writeFileSync(path.join(__dirname, "../lin0/assembly/learnAssembly/lin5.s"), asm);
})

test("test assembly6", () => {
    const interpreter = new Interpreter();
    const asm = interpreter.toAssembly(`
        function main(): int {
            if(5==3) {
                int a;
                a = 1;
                print(a);
            } else if(2==1) {
                int a;
                a = 2;
                print(a);
            } else if(1==1) {
                int a;
                a = 3;
                print(a);
            } else {
                int a;
                a = 4;
                print(a);
            }
            return 0;
        }
    `)
    console.log(asm);
    fs.writeFileSync(path.join(__dirname, "../lin0/assembly/learnAssembly/lin6.s"), asm);
})

test("test assembly7", () => {
    const interpreter = new Interpreter();
    const asm = interpreter.toAssembly(`
        function main(): int {
            for(int a = 0; a < 10; a = a + 1) {
                if(a==2) {
                    continue;
                }
                print(a);
                if(a==5) {
                    break;
                }
            }
            return 0;
        }
    `)
    console.log(asm);
    fs.writeFileSync(path.join(__dirname, "../lin0/assembly/learnAssembly/lin7.s"), asm);
})

test("test assembly8", () => {
    const interpreter = new Interpreter();
    const asm = interpreter.toAssembly(`
        function main(): int {
            int a = 10, b = 20, c = 99;
            a -= 1;
            a += 2;
            a *= 9;
            print(a,b,c);
            return 0;
        }
    `)
    console.log(asm);
    fs.writeFileSync(path.join(__dirname, "../lin0/assembly/learnAssembly/lin8.s"), asm);
})