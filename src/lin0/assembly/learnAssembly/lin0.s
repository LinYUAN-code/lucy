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
    movq    %rsp, %rbp
    subq    $32, %rsp
    movq    $2, -8(%rbp)
    movq    $2, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    addq    %r11, %r10
    movq    %r10, -8(%rbp)
    movq    $2, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    imulq    %r11, %r10
    movq    %r10, -8(%rbp)
    movq    $1, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    addq    %r11, %r10
    movq    %r10, -8(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, a(%rip)
    movq    $5, -8(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, b(%rip)
    movq    $10, -8(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, c(%rip)
    movq    d(%rip), %r9
    movq    %r9, -8(%rbp)
    movq    c(%rip), %r9
    movq    %r9, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    addq    %r11, %r10
    movq    %r10, -8(%rbp)
    movq    -8(%rbp), %r9
    movq    %r9, d(%rip)
    movq    $5, -8(%rbp)
    movq    c(%rip), %r9
    movq    %r9, -16(%rbp)
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
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    a(%rip), %r9
    movq    %r9, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    a(%rip), %r9
    movq    %r9, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    b(%rip), %r9
    movq    %r9, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    c(%rip), %r9
    movq    %r9, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    d(%rip), %r9
    movq    %r9, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $4, -8(%rbp)
    movq    $10, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    imulq    %r11, %r10
    movq    %r10, -8(%rbp)
    movq    $5, -16(%rbp)
    movq    a(%rip), %r9
    movq    %r9, -24(%rbp)
    movq    -24(%rbp), %r10
    movq    -16(%rbp), %r11
    subq    %r11, %r10
    movq    %r10, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    addq    %r11, %r10
    movq    %r10, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $2, -8(%rbp)
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
    movq    $0, -8(%rbp)
    movq    -8(%rbp), %rax
    addq    $32, %rsp
    popq    %rbp
    retq    
    .section	__TEXT, __cstring
L.str.0:    .asciz "%d\n"
L.str.1:    .asciz "hello world\n"
