# lin0 assembly code
    .data
a:  .quad   0x0
b:  .quad   0x0
    .text
_helloWorld:
    pushq    %rbp
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    popq    %rbp
    pushq    %rbp
    pushq    b(%rip)
    pushq    a(%rip)
    popq    %r10
    popq    %r11
    addq    %r11, %r10
    pushq    %r10
    popq    %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    popq    %rbp
    .global _main
_main:
    pushq    %rbp
    leaq    L.str.2(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    popq    %rbp
    pushq    $0
    popq    %rax
    retq    
    .section	__TEXT, __cstring
L.str.0:    .asciz "hello World\n"
L.str.1:    .asciz "%d\n"
L.str.2:    .asciz "main\n"
