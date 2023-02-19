# lin0 assembly code
    .data
a:  .quad   0x0
b:  .quad   0x0
c:  .quad   0x0
d:  .quad   0x0
    .text
    .global _main
_main:
    pushq    $2
    pushq    $2
    popq    %r10
    popq    %r11
    addq    %r11, %r10
    pushq    %r10
    pushq    $2
    popq    %r10
    popq    %r11
    imulq    %r11, %r10
    pushq    %r10
    pushq    $1
    popq    %r10
    popq    %r11
    addq    %r11, %r10
    pushq    %r10
    popq    a(%rip)
    pushq    $5
    popq    b(%rip)
    pushq    $10
    popq    c(%rip)
    pushq    d(%rip)
    pushq    c(%rip)
    popq    %r10
    popq    %r11
    addq    %r11, %r10
    pushq    %r10
    popq    d(%rip)
    pushq    %rbp
    pushq    $5
    pushq    c(%rip)
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
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    popq    %rbp
    pushq    %rbp
    pushq    a(%rip)
    popq    %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    popq    %rbp
    pushq    %rbp
    pushq    a(%rip)
    popq    %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    popq    %rbp
    pushq    %rbp
    pushq    b(%rip)
    popq    %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    popq    %rbp
    pushq    %rbp
    pushq    c(%rip)
    popq    %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    popq    %rbp
    pushq    %rbp
    pushq    d(%rip)
    popq    %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    popq    %rbp
    pushq    %rbp
    pushq    $4
    pushq    $10
    popq    %r10
    popq    %r11
    imulq    %r11, %r10
    pushq    %r10
    pushq    $5
    pushq    a(%rip)
    popq    %r10
    popq    %r11
    subq    %r11, %r10
    pushq    %r10
    popq    %r10
    popq    %r11
    addq    %r11, %r10
    pushq    %r10
    popq    %rsi
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    popq    %rbp
    pushq    %rbp
    pushq    $2
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
    pushq    $0
    popq    %rax
    retq    
    .section	__TEXT, __cstring
L.str.0:    .asciz "%d\n"
L.str.1:    .asciz "hello world\n"
