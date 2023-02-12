# 一个超级简单的解释型语言-lin0

todo!

- [x] 完成 parser
- [x] 完成 解释过程
- [ ] 编译成 three-address code
- [ ] turn three-address code into AT&T x86_64 assembly
- [ ] turn AT&T x86_64 assembly into excutable file in mac
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
T_Int: "int"

S => Stmt | S Stmt
Stmt => VarDecl ';' | Assign | Print
VarDecl => T_Int T_Identifier | VarDecl ',' T_Identifier
Assign => T_Identifier '=' E ';'
Print => T_Print '(' Arguments ')' ';'
Arguments => Arguments ',' E | Arguments ',' T_StringConstant ｜ E ｜ T_StringConstant
(E =>
E '+' E
| E '-' E
| E '\*' E
| E '/' E
| '-' E
| T_IntConstant
| T_Identifier
| '(' E ')') ===> 一般表达式是编译器里面的比较难 parse 的地方 为了更好的进行递归下降分析 按下面进行了分层解析
E => AdditiveExpression
AdditiveExpression =>
MultiplicativeExpression |
MultiplicativeExpression + MultiplicativeExpression |
MultiplicativeExpression - MultiplicativeExpression

MultiplicativeExpression =>
UnaryExpression
UnaryExpression \* UnaryExpression |
UnaryExpression / UnaryExpression |

UnaryExpression =>
PrimaryExpression |
-PrimaryExpression

PrimaryExpression =>
T_IntConstant |
T_Identifier |
( AdditiveExpression )

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
