as demo.s -o demo.o
ld demo.o -o demo -L /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/lib -lSystem
echo $? # 查看程序返回值
