# exit.s    
    .section    __TEXT, __text  # 选中代码段 可以缩写为.text 
    .globl  _main # 向linker 暴露 _main 符号 一般来说，定义的标签只能在同一个汇编文件中使用，如果一个汇编文件想使用另一个汇编文件定义的标签，需要另一个汇编文件用.globl声明标签是全局可见的，比如说.globl _main.
_main:
    movq    $0, %rax
    retq