# lin0 assembly code
    .data
    .text
    .global _main
_main:
    pushq    %rbp
    movq    %rsp, %rbp
    subq    $16, %rsp
    movq    $0, -8(%rbp)
    movq    -8(%rbp), %rax
    addq    $16, %rsp
    popq    %rbp
    retq    
    .section	__TEXT, __cstring
