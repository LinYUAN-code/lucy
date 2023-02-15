# dataTest.s
	.data
a:	.quad	0x114514
	.data
b:  .quad   0x4

	.text
	.globl	_main
_main:
	movq	b(%rip), %rax
	retq