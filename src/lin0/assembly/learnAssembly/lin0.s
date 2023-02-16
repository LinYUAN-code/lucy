# lin0 assembly code
    .data
a:  .quad   0x0
b:  .quad   0x0
c:  .quad   0x0
d:  .quad   0x0

    .text
    .global _main
_main:
    pushq    %rbp
    leaq    L_.str.0(%rip), %rdi 
    xorb %al, %al
    callq   _printf
    popq    %rbp
    pushq    %rbp
    leaq    L_.str.1(%rip), %rdi 
    movq    $100, %rsi
    xorb %al, %al
    callq   _printf
    popq    %rbp
    retq
    .section	__TEXT, __cstring
L_.str.0:
    .asciz "hello world\n"
L_.str.1:
    .asciz "%d\n"

