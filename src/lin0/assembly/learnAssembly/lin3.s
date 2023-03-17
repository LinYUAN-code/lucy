# lin0 assembly code
    .data
    .text
_helloWorld:
    pushq    %rbp
    movq    %rsp, %rbp
    subq    $32, %rsp
    movq    %rdi, -8(%rbp)
    movq    %rsi, -16(%rbp)
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    -16(%rbp), %r9
    movq    %r9, -24(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, -32(%rbp)
    movq    -32(%rbp), %r10
    movq    -24(%rbp), %r11
    addq    %r11, %r10
    movq    %r10, -24(%rbp)
    movq    -24(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $0, -24(%rbp)
    movq    -24(%rbp), %rax
    addq    $32, %rsp
    popq    %rbp
    retq    
    .global _main
_main:
    pushq    %rbp
    movq    %rsp, %rbp
    subq    $48, %rsp
    movq    $0, -8(%rbp)
    movq    $0, -16(%rbp)
    movq    $0, -24(%rbp)
    movq    $1, -32(%rbp)
    movq    $99, -40(%rbp)
    movq    -40(%rbp), %r10
    movq    -32(%rbp), %r11
    addq    %r11, %r10
    movq    %r10, -32(%rbp)
    movq    -32(%rbp), %r9
    movq    %r9, -24(%rbp)
    movq    $10, -32(%rbp)
    movq    -32(%rbp), %r9
    movq    %r9, -8(%rbp)
    movq    $20, -32(%rbp)
    movq    -32(%rbp), %r9
    movq    %r9, -16(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, -32(%rbp)
    movq    -32(%rbp), %rdi
    movq    -16(%rbp), %r9
    movq    %r9, -32(%rbp)
    movq    -32(%rbp), %rsi
    callq    _helloWorld
    movq    -24(%rbp), %r9
    movq    %r9, -32(%rbp)
    movq    -32(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    leaq    L.str.2(%rip), %rdi
    movq    $100, -32(%rbp)
    movq    -32(%rbp), %rsi
    callq    _printf
    movq    $0, -32(%rbp)
    movq    -32(%rbp), %rax
    addq    $48, %rsp
    popq    %rbp
    retq    
    .section	__TEXT, __cstring
L.str.0:    .asciz "hello World\n"
L.str.1:    .asciz "%d\n"
L.str.2:    .asciz "lrj %d\n"
