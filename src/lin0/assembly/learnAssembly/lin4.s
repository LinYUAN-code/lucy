# lin0 assembly code
    .data
    .text
    .global _main
_main:
    pushq    %rbp
    movq    %rsp, %rbp
    subq    $16, %rsp
    leaq    L.str.0(%rip), %rdi
    xorb    %al, %al
    callq    _printf
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
    movq    -8(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    leaq    L.str.2(%rip), %rdi
    xorb    %al, %al
    callq    _printf
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
    movq    -8(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    leaq    L.str.3(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $2, -8(%rbp)
    movq    $1, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $6, %ah
    and    $1, %ah
    shr    $8, %ax
    xor    $1, %al
    movq    %rax, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    leaq    L.str.4(%rip), %rdi
    xorb    %al, %al
    callq    _printf
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
    xor    $1, %al
    movq    %rax, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    leaq    L.str.5(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $2, -8(%rbp)
    movq    $1, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $7, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    leaq    L.str.6(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $1, -8(%rbp)
    movq    $1, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $7, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    leaq    L.str.7(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $0, -8(%rbp)
    movq    $1, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $7, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -8(%rbp)
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $6, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -16(%rbp)
    movq    -16(%rbp), %r11
    movq    -8(%rbp), %r10
    xor    %r11, %r10
    movq    %r10, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    leaq    L.str.8(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $1, -8(%rbp)
    movq    $1, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $7, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -8(%rbp)
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $6, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -16(%rbp)
    movq    -16(%rbp), %r11
    movq    -8(%rbp), %r10
    xor    %r11, %r10
    movq    %r10, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    leaq    L.str.9(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $2, -8(%rbp)
    movq    $1, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $7, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -8(%rbp)
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $6, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -16(%rbp)
    movq    -16(%rbp), %r11
    movq    -8(%rbp), %r10
    xor    $1, %r11
    xor    $1, %r10
    and    %r11, %r10
    movq    %r10, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    leaq    L.str.10(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $0, -8(%rbp)
    movq    $1, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $7, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -8(%rbp)
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $6, %ah
    and    $1, %ah
    shr    $8, %ax
    movq    %rax, -16(%rbp)
    movq    -16(%rbp), %r11
    movq    -8(%rbp), %r10
    xor    $1, %r11
    xor    $1, %r10
    and    %r11, %r10
    movq    %r10, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    leaq    L.str.11(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $7, -8(%rbp)
    movq    $1, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $7, %ah
    and    $1, %ah
    shr    $8, %ax
    xor    $1, %al
    movq    %rax, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    leaq    L.str.12(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $1, -8(%rbp)
    movq    $1, -16(%rbp)
    movq    -16(%rbp), %r10
    movq    -8(%rbp), %r11
    xorq    %rax, %rax
    cmp    %r11, %r10
    LAHF    
    shr    $7, %ah
    and    $1, %ah
    shr    $8, %ax
    xor    $1, %al
    movq    %rax, -8(%rbp)
    movq    -8(%rbp), %rsi
    leaq    L.str.1(%rip), %rdi
    xorb    %al, %al
    callq    _printf
    movq    $0, -8(%rbp)
    movq    -8(%rbp), %rax
    addq    $16, %rsp
    popq    %rbp
    retq    
    .section	__TEXT, __cstring
L.str.0:    .asciz "1==1: "
L.str.1:    .asciz "%d\n"
L.str.2:    .asciz "2==1: "
L.str.3:    .asciz "1!=2: "
L.str.4:    .asciz "1!=1: "
L.str.5:    .asciz "1<2: "
L.str.6:    .asciz "1<1: "
L.str.7:    .asciz "1<=0: "
L.str.8:    .asciz "1<=1: "
L.str.9:    .asciz "1>2: "
L.str.10:    .asciz "1>0: "
L.str.11:    .asciz "1>=7: "
L.str.12:    .asciz "1>=1: "
