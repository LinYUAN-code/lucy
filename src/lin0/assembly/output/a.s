	.section	__TEXT,__text,regular,pure_instructions
	.build_version macos, 13, 0	sdk_version 13, 1
	.globl	_hello                          ## -- Begin function hello
	.p2align	4, 0x90
_hello:                                 ## @hello
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$16, %rsp
	movl	%edi, -4(%rbp)
	movl	%esi, -8(%rbp)
	cmpl	$10, -4(%rbp)
	jne	LBB0_2
## %bb.1:
	movl	$1, -4(%rbp)
	jmp	LBB0_3
LBB0_2:
	movl	$2, -4(%rbp)
LBB0_3:
	movl	-4(%rbp), %esi
	addl	-8(%rbp), %esi
	leaq	L_.str(%rip), %rdi
	movb	$0, %al
	callq	_printf
	xorl	%eax, %eax
	addq	$16, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.globl	_main                           ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$16, %rsp
	movl	$0, -4(%rbp)
	movl	$10, -8(%rbp)
	movl	$20, -12(%rbp)
	movl	-8(%rbp), %edi
	movl	-12(%rbp), %esi
	callq	_hello
	cmpl	$10, -8(%rbp)
	jne	LBB1_2
## %bb.1:
	movl	$1, -8(%rbp)
	jmp	LBB1_3
LBB1_2:
	movl	$2, -8(%rbp)
LBB1_3:
	movl	-8(%rbp), %esi
	addl	-12(%rbp), %esi
	imull	$39, -12(%rbp), %edx
	addl	$10, %edx
	imull	$213, -8(%rbp), %eax
	addl	%eax, %edx
	leaq	L_.str.1(%rip), %rdi
	movl	$20, %ecx
	movl	$30, %r8d
	movl	$40, %r9d
	movb	$0, %al
	callq	_printf
	xorl	%eax, %eax
	addq	$16, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.section	__TEXT,__cstring,cstring_literals
L_.str:                                 ## @.str
	.asciz	"%d\n"

L_.str.1:                               ## @.str.1
	.asciz	"%d %d %d %d %d\n"

.subsections_via_symbols
