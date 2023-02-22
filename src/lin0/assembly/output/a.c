#include <stdio.h>

extern int hello(int a,int b) {
    if(a==10) {
        a = 1;
    } else {
        a = 2;
    }
    printf("%d\n",a+b);
    return 0;
}
// TODO: 普通数字也要算入栈的大小 因为可能在计算表达式的途中进行函数调用.
int main() {
    int a = 10;
    int b = 20;
    hello(a,b);
    if(a==10) {
        a = 1;
    } else {
        a = 2;
    }
    printf("%d %d %d %d %d\n",a+b,10+39*b+213*a,20,30,40);
    return 0;
}

