as demo.s -o demo.o
ld demo.o -o demo -L /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/lib -lSystem
echo $? # 查看程序返回值

lldb
lldb ./lin4
breakpoint set --file lin4.s --line 17
run
opt:
register read [register name] :) rflags for 标志位寄存器
1.continue
2.nexti

ref https://lldb.llvm.org/use/tutorial.html
