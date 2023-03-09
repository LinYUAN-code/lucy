# lin0 assembly code
    .data
    .text
    .global _main
_main:
    pushq    %rbp
    movq    %rsp, %rbp
    subq    $16, %rsp
    movq    $3, -8(%rbp)
    movq    $5, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $6, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -8(%rbp)
    movq    -8(%rbp), %r10
    cmp    $0, %r10
    je    LBB.1
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    jmp    LBB.0
LBB.1:
    nop    
    movq    $1, -8(%rbp)
    movq    $2, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $6, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -8(%rbp)
    movq    -8(%rbp), %r10
    cmp    $0, %r10
    je    LBB.3
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    jmp    LBB.2
LBB.3:
    nop    
    movq    $1, -8(%rbp)
    movq    $1, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $6, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -8(%rbp)
    movq    -8(%rbp), %r10
    cmp    $0, %r10
    je    LBB.5
    leaq    L.str.2(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    jmp    LBB.4
LBB.5:
    nop    
    leaq    L.str.3(%rip), %rdi
    xorb    %al, %al
    callq    _printf
LBB.4:
    nop    
LBB.2:
    nop    
LBB.0:
    nop    
    movq    $0, -8(%rbp)
    movq    -8(%rbp), %rax
    addq    $16, %rsp
    popq    %rbp
    retq    
    .section	__TEXT, __cstring
L.str.0:    .asciz "work\n"
L.str.1:    .asciz "play1\n"
L.str.2:    .asciz "play2\n"
L.str.3:    .asciz "play3\n"
