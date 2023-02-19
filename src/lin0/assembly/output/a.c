#include <stdio.h>

extern int hello() {
    return 0;
}
// TODO: 普通数字也要算入栈的大小 因为可能在计算表达式的途中进行函数调用.
int main() {
    int a = 10;
    int b = 20;
    hello();
    b = 20;
    return 0+324+99+321;
}

