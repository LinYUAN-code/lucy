# lin0 assembly code
    .data
    .text
    .global _main
_main:
    pushq    %rbp
    pushq    $5
    pushq    $10
    popq    %r10
    popq    %r11
    pushq    %rdx
    movq    %r10, %rax
    cqto    
    idivq    %r11
    popq    %rdx
    pushq    %rax
    popq    %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    popq    %rbp
    pushq    %rbp
    pushq    $5
    pushq    $10
    popq    %r10
    popq    %r11
    pushq    %rdx
    movq    %r10, %rax
    cqto    
    idivq    %r11
    movq    %rdx, %r11
    popq    %rdx
    pushq    %r11
    popq    %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    popq    %rbp
    pushq    %rbp
    pushq    $2
    pushq    $3
    popq    %r10
    popq    %r11
    pushq    %rdx
    movq    %r10, %rax
    cqto    
    idivq    %r11
    movq    %rdx, %r11
    popq    %rdx
    pushq    %r11
    popq    %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    popq    %rbp
    pushq    $0
    popq    %rax
    retq    
    .section	__TEXT, __cstring
L.str.0:    .asciz "%d\n"
