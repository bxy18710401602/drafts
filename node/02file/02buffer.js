var bin = new Buffer([0x68, 0x65, 0x6c, 0x6c, 0x6f])
console.log(bin[0])
var str = bin.toString('utf-8')
console.log(str, '字符串')
var bin = new Buffer('hello', 'utf-8')
console.log(bin, '二进制数据')
// 字符串是只读的，而buffer更像是可以做指针操作的C语言数组，.slice方法返回的Buffer的修改会作用于原buffer
var dup = new Buffer(bin.length)
bin.copy(dup)
dup[0] = 0x48
var sub = bin.slice(2)
sub[0] = 0x65

console.log(bin, 'bin')
console.log(dup, 'dup')
console.log(sub, 'sub')