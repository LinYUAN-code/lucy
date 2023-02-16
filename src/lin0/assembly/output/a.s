	.section	__TEXT,__text,regular,pure_instructions
	.build_version macos, 13, 0	sdk_version 13, 1
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
	movl	_a(%rip), %eax
	addl	_b(%rip), %eax
	imull	_b(%rip), %eax
	movl	%eax, _a(%rip)
	movl	_a(%rip), %esi
	addl	_b(%rip), %esi
	imull	_b(%rip), %esi
	leaq	L_.str(%rip), %rdi
	movb	$0, %al
	callq	_printf
	xorl	%eax, %eax
	addq	$16, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.section	__DATA,__data
	.globl	_a                              ## @a
	.p2align	2
_a:
	.long	1                               ## 0x1

	.globl	_b                              ## @b
	.p2align	2
_b:
	.long	10                              ## 0xa

	.section	__TEXT,__cstring,cstring_literals
L_.str:                                 ## @.str
	.asciz	"hello world %d"

.subsections_via_symbols
