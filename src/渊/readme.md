# 渊

    编译原理全流程Demo -- 中文语言

T_StringConstant:
T_Identifier: ([\_a-zA-Z][_a-za-z0-9]\*)
T_Print: "print"
T_IntConstant:
T_Int: "int"

S => Stmt | S Stmt
Stmt => VarDecl | Assign | Print
VarDecl => T_Int T_Identifier | VarDecl ',' T_Identifier
Assign => T_Identifier '=' E ';'
Print => T_Print '(' T_StringConstant Actuals ')' ';'
Actuals => EmptyCharacter | Actuals ',' E
E =>
E '+' E
| E '-' E
| E '\*' E
| E '/' E
| '-' E
| T_IntConstant
| T_Identifier
| '(' E ')'
