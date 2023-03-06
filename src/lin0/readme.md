# 一个超级简单的解释型语言-lin0

todo!

- [x] 完成 parser
- [x] 完成 解释过程
- [skip] 编译成 three-address code
- [x] turn three-address code into AT&T x86_64 assembly
- [x] turn AT&T x86_64 assembly into excutable file in mac
- [ ] turn AT&T x86_64 assembly into excutable file in windows

refs:
https://www.zhihu.com/column/c_1132336120712765440

#### 语法:

##### 变量声明：

```cpp
// 变量声明后会直接初始化为 0
int a;
int b,c,d;
```

##### 表达式计算:

双目运算符: + - \* / ()

单目运算符: -

##### 特殊语句:

Print: 打印字符

##### 具体的词法和语法规则：

T_StringConstant: /^"[^"]\*"/
T_Identifier: /^(([1-9]\*[0-9])|([0-9]))/
T_Print: "print"
BasicType: "int"

S => GlobalDefinition | S GlobalDefinition
GlobalDefinition = VarDecl | Function
BlockStmt = VarDecl | Assign | Print | Return | BlockBody | FunctionCall

VarDecl => BasicType T_Identifier | VarDecl ',' T_Identifier
Assign => T_Identifier '=' E ';'
Print => T_Print '(' Arguments ')' ';'
Arguments => Arguments ',' E | Arguments ',' T_StringConstant ｜ E ｜ T_StringConstant

FunctionArgumentDefinition => EmptyCharater | BasicType identifier FunctionArgumentDefinition | , BasicType identifier FunctionArgumentDefinition

Function => function global(可选) identidier(FunctionArgumentDefinition): BasicType BlockBody

BlockBody => VarDecl ';' BlockBody | Assign BlockBody | Print BlockBody

FunctionCall => identifier( Arguments )

Return => return E

IfStmt => if (expr) BlockStmt | if (expr) BlockStmt else (BlockStmt | IfStmt)

(E =>
E '+' E
| E '-' E
| E '\*' E
| E '%' E
| E '/' E
| '-' E
| T_IntConstant
| T_Identifier
| '(' E ')') ===> 一般表达式是编译器里面的比较难 parse 的地方 为了更好的进行递归下降分析 按下面进行了分层解析
E => AdditiveExpression
AdditiveExpression =>
MultiplicativeExpression |
AdditiveExpression + MultiplicativeExpression |
AdditiveExpression - MultiplicativeExpression

MultiplicativeExpression =>
UnaryExpression
MultiplicativeExpression \* UnaryExpression |
MultiplicativeExpression / UnaryExpression |
MultiplicativeExpression % UnaryExpression |

UnaryExpression =>
PrimaryExpression |
-PrimaryExpression

PrimaryExpression =>
T_IntConstant |
T_Identifier |
( AdditiveExpression ) |
FunctionCall

VarDecl => T_Int T_Identifier | VarDecl ',' T_Identifier
=>
VarDecl => T_Int T_Identifier VarDecl'

VarDecl' => ',' T_Identifier VarDecl'

Arguments => Arguments ',' E | Arguments ',' T_StringConstant ｜ E ｜ T_StringConstant
=>
Arguments => E Arguments'｜ T_StringConstant Arguments'
Arguments' => ',' E Arguments' | ',' T_StringConstant Arguments'

E =>
E '+' E
| E '-' E
| E '\*' E
| E '/' E
| '-' E
| T_IntConstant
| T_Identifier
| '(' E ')'

=>

E =>
| '-' E E'
| T_IntConstant E'
| T_Identifier E'
| '(' E ')' E'

E' =>
'+' E E'
| '-' E E'
| '\*' E E'
| '/' E E'
| EmptyCharater

难点： 如何用汇编计算通用表达式
打算用 n-TOSCA 来实现--单寄存器缓存表达式栈 （n=0,r10 & r11 use for calculate ; n=1,rax use for stack top，r10 & r11 use for calculate）
ref：https://www.zhihu.com/question/29355187

ABI

x86-64 一共有 16 个 64-bit(8-byte)的寄存器。%rax, %rbx, %rcx, %rdx, %rdi, %rsi, %rbp, %rsp, %r8-r15. 其中%rax, %rcx, %rdx, %rdi, %rsi, %rsp, and %r8-r11 是 caller-save，就是他们不会跨函数保存。一般 rax 用来保存函数的返回值。如果返回值的大小超过 64bits，那就不用 rax 了，因为放不下，就通过 stack 来保存。

%rbx, %rbp, %r12-r15 叫 callee-save，就是他们可以跨函数保存。rsp 是栈指针，永远指向栈顶。 %rdi, %rsi, %rdx, %rcx, %r8, %r9 用来传 function 的前 6 个参数。参数再多了就也用 stack 了。

原文链接：https://blog.csdn.net/bassbian/article/details/128323989

为什么调用 \_printf 要 clear AL

https://www.dazhuanlan.com/babel1999/topics/975152

函数调用寄存器顺序
rdi, rsi, rdx, rcx, r8, r9，栈....

局部变量可以使用 rbp 来定位代码位置

```javascript
// ready for stack
const needSpace = Math.max(0, identifiers.length - 1);
if (needSpace) {
  // -8k(%rbp)
  ans += `    push %rbp
                movq    %rsp, %rbp
                subq    $8, %rsp`;
}
```

超级坑点：

进行库函数调用的时候栈需要进行 16 字节对齐！！！！！否则会 segmentFault
rsp 寄存器内的地址值加 8 得是 16 的倍数 -- 奇怪的设定增加了
