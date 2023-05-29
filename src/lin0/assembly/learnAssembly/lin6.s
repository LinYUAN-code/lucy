# lin0 assembly code
    .data
    .text
    .global _main
_main:
    pushq    %rbp
    movq    %rsp, %rbp
    subq    $48, %rsp
    movq    $3, -40(%rbp)
    movq    $5, -48(%rbp)
    movq    -48(%rbp), %r10
    movq    -40(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $6, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -40(%rbp)
    movq    -40(%rbp), %r10
    cmp    $0, %r10
    je    LBB.1
    movq    $0, -8(%rbp)
    movq    $1, -40(%rbp)
    movq    -40(%rbp), %r9
    movq    %r9, -8(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, -40(%rbp)
    movq    -40(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    jmp    LBB.0
LBB.1:
    nop    
    movq    $1, -40(%rbp)
    movq    $2, -48(%rbp)
    movq    -48(%rbp), %r10
    movq    -40(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $6, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -40(%rbp)
    movq    -40(%rbp), %r10
    cmp    $0, %r10
    je    LBB.3
    movq    $0, -16(%rbp)
    movq    $2, -40(%rbp)
    movq    -40(%rbp), %r9
    movq    %r9, -16(%rbp)
    movq    -16(%rbp), %r9
    movq    %r9, -40(%rbp)
    movq    -40(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    jmp    LBB.2
LBB.3:
    nop    
    movq    $1, -40(%rbp)
    movq    $1, -48(%rbp)
    movq    -48(%rbp), %r10
    movq    -40(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $6, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -40(%rbp)
    movq    -40(%rbp), %r10
    cmp    $0, %r10
    je    LBB.5
    movq    $0, -24(%rbp)
    movq    $3, -40(%rbp)
    movq    -40(%rbp), %r9
    movq    %r9, -24(%rbp)
    movq    -24(%rbp), %r9
    movq    %r9, -40(%rbp)
    movq    -40(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    jmp    LBB.4
LBB.5:
    nop    
    movq    $0, -32(%rbp)
    movq    $4, -40(%rbp)
    movq    -40(%rbp), %r9
    movq    %r9, -32(%rbp)
    movq    -32(%rbp), %r9
    movq    %r9, -40(%rbp)
    movq    -40(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
LBB.4:
    nop    
LBB.2:
    nop    
LBB.0:
    nop    
    movq    $0, -40(%rbp)
    movq    -40(%rbp), %rax
    addq    $48, %rsp
    popq    %rbp
    retq    
    .section	__TEXT, __cstring
L.str.0:    .asciz "%d\n"
