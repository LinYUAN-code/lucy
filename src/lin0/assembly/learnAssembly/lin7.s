# lin0 assembly code
    .data
    .text
    .global _main
_main:
    pushq    %rbp
    movq    %rsp, %rbp
    subq    $48, %rsp
    movq    $0, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    %r10, -8(%rbp)
LBB.0:
    nop    
    movq    $10, -16(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, -24(%rbp)
    movq    -24(%rbp), %r10
    movq    -16(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $7, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -16(%rbp)
    movq    -16(%rbp), %r10
    cmp    $0, %r10
    je    LBB.1
    movq    $2, -16(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, -24(%rbp)
    movq    -24(%rbp), %r10
    movq    -16(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $6, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -16(%rbp)
    movq    -16(%rbp), %r10
    cmp    $0, %r10
    je    LBB.3
    jmp    LBB.2
    jmp    LBB.3
LBB.3:
    nop    
    movq    -8(%rbp), %r9
    movq    %r9, -16(%rbp)
    movq    -16(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $5, -16(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, -24(%rbp)
    movq    -24(%rbp), %r10
    movq    -16(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $6, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -16(%rbp)
    movq    -16(%rbp), %r10
    cmp    $0, %r10
    je    LBB.5
    jmp    LBB.1
    jmp    LBB.5
LBB.5:
    nop    
LBB.2:
    nop    
    movq    $1, -16(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, -24(%rbp)
    movq    -24(%rbp), %r10
    movq    -16(%rbp), %r11
    addq    %r11, %r10
    movq    %r10, -16(%rbp)
    movq    -16(%rbp), %r9
    movq    %r9, -8(%rbp)
    jmp    LBB.0
LBB.1:
    nop    
    movq    $0, -16(%rbp)
    movq    -16(%rbp), %rax
    addq    $48, %rsp
    popq    %rbp
    retq    
    .section	__TEXT, __cstring
L.str.0:    .asciz "%d\n"
