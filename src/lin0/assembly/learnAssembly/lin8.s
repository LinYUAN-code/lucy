# lin0 assembly code
    .data
    .text
    .global _main
_main:
    pushq    %rbp
    movq    %rsp, %rbp
    subq    $64, %rsp
    movq    $10, -32(%rbp)
    movq    -32(%rbp), %r10
    movq    %r10, -8(%rbp)
    movq    $20, -32(%rbp)
    movq    -32(%rbp), %r10
    movq    %r10, -16(%rbp)
    movq    $99, -32(%rbp)
    movq    -32(%rbp), %r10
    movq    %r10, -24(%rbp)
    movq    $1, -32(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, -40(%rbp)
    movq    -40(%rbp), %r10
    movq    -32(%rbp), %r11
    subq    %r11, %r10
    movq    %r10, -32(%rbp)
    movq    -32(%rbp), %r9
    movq    %r9, -8(%rbp)
    movq    $2, -32(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, -40(%rbp)
    movq    -40(%rbp), %r10
    movq    -32(%rbp), %r11
    addq    %r11, %r10
    movq    %r10, -32(%rbp)
    movq    -32(%rbp), %r9
    movq    %r9, -8(%rbp)
    movq    $9, -32(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, -40(%rbp)
    movq    -40(%rbp), %r10
    movq    -32(%rbp), %r11
    imulq    %r11, %r10
    movq    %r10, -32(%rbp)
    movq    -32(%rbp), %r9
    movq    %r9, -8(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, -32(%rbp)
    movq    -32(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    -16(%rbp), %r9
    movq    %r9, -32(%rbp)
    movq    -32(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    -24(%rbp), %r9
    movq    %r9, -32(%rbp)
    movq    -32(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $0, -32(%rbp)
    movq    -32(%rbp), %rax
    addq    $64, %rsp
    popq    %rbp
    retq    
    .section	__TEXT, __cstring
L.str.0:    .asciz "%d\n"
