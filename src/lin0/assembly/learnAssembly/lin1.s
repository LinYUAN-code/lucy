# lin0 assembly code
    .data
    .text
    .global _main
_main:
    pushq    %rbp
    movq    %rsp, %rbp
    subq    $16, %rsp
    movq    $5, -8(%rbp)
    movq    $10, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    movq    %rdx, -8(%rbp)
    movq    %r10, %rax
    cqto    
    idivq    %r11
    movq    -8(%rbp), %rdx
    movq    %rax, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $5, -8(%rbp)
    movq    $10, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    movq    %rdx, -8(%rbp)
    movq    %r10, %rax
    cqto    
    idivq    %r11
    movq    %rdx, %r11
    movq    -8(%rbp), %rdx
    movq    %r11, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $2, -8(%rbp)
    movq    $3, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    movq    %rdx, -8(%rbp)
    movq    %r10, %rax
    cqto    
    idivq    %r11
    movq    %rdx, %r11
    movq    -8(%rbp), %rdx
    movq    %r11, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $0, -8(%rbp)
    movq    -8(%rbp), %rax
    addq    $16, %rsp
    popq    %rbp
    retq    
    .section	__TEXT, __cstring
L.str.0:    .asciz "%d\n"
