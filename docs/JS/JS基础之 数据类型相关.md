## JS基础之 数据类型相关


### <span id="1">一  预读文档</span>

01 [JS高级程序设计](/))

02 [你真的掌握变量和类型了吗](https://juejin.im/post/5cec1bcff265da1b8f1aa08f)

03 [JS隐式转换踩坑合集](https://juejin.im/post/5bc5c752f265da0a9a399a62)

04 [浅谈 instanceof 和 typeof 的实现原理](https://juejin.im/post/5b0b9b9051882515773ae714)

预读原因: 直接参考文档


### <span id="2"> 二 类型种类 </span>

Q1: JS有哪些数据类型

A: 

S1 基本数据类型: Number/ Boolean/ String/ Null/ Undefined/ Symbol/ BigInt

S2 引用类型: Object


Q2:  浮点数计算精度问题   0.1 + 0.2 !==0.3 的原因 + 解决方法

A:  

S1 计算机在进行计算时，都要把数据转化成 2进制，计算完成后 再把结果转化为 10进制
S2 0.1 和 0.2 转化为2进制 都是 以1100无限循环的小数
S3 JS遵循 IEEE 754标准, 用 1位符号位 + 11位指数位 + 52位尾数位保存数据, 所以52位后的数组会进行"四舍五入"
S4 所以 0.1 和 0.2的 二进制由于发生了进位，导致了计算结果产生了 精度误差


Q3: 基本类型 和 引用类型 的区别是什么

A: 

S1 基本类型在内存中使用 `栈存储`, 存储的是`变量的值`  + 引用类型在内存中使用 `堆存储`, 存储的是`变量的地址`

S2 赋值操作时:  基本类型  按值传递 互相独立 +  引用类型 按引用传递  指向同一个内存地址,会互相影响

S3 比较是否相等, 基本类型是比较 变量值是否相等 + 引用类型是比较 对象的内存地址是否一样

S4 基本类型 和  引用类型 作为函数参数传入时, 都是 `按值传递的`

```js
let obj = { name: '' } 
let age = 12

function test(num, obj) {   // 分别传入基本类型值 和  引用类型堆地址
  num++
  obj.name = 'ygm'
  obj = new Object()         // 内部的obj指向了一个 新的堆地址
  obj.name = 'change name'
}

test(age, obj)

console.log(age)             // 12
console.log(obj.name)     //  'ygm'  而不是 'change name'
```


Q4: null  和 undefined 的区别是什么

A:
```js

// S1  用Number()转换成数字时, null ==> 0  +  undefined  ==> NaN
console.log( Number(null) )               // 0
console.log( Number(undefined) )       //  NaN

// S2 null表示 变量即将指向一个对象  +  undefiend表示变量未赋值
let obj = null                  // 可以使用
let name = undefined     // 没有必要
```


### <span id="3"> 三 类型判断 </span>

Q1: 有哪些方法可以判断 一个变量的数据类型

A: 

S1 typeof:  number/ boolean/ string/ null==>object/ undefined/  function

S2 instanceOf:    a.__proto__.__proto__....... ===  b.prototype

S3 Object.prototype.toString.call(xxxx)
```js
function type(val) {
  return Object.prototype.toString.call(val).toLowerCase().split(' ')[1].slice(0,-1)
}

// test case
let str = "123"
type(str)             // "string"
```


Q2: 如何判断变量是否是 数组类型

A
```js
function fn() {
  // S1 通过Array.isArray()
  console.log(Array.isArray(arguments))   //false   因为arguments是类数组，不是数组
  console.log(Array.isArray([1,2,3,4]))      //true
    
  // S2 通过instanceof
  console.log(arguments instanceof Array)    //fasle
  console.log([1,2,3,4] instanceof Array)       //true
    
  // S3 通过Objdect.prototype.toString.call()方法
  console.log(Object.prototype.toString.call(arguments))   // [object Arguments]
  console.log(Object.prototype.toString.call([1,2,3,4]))      // [object Array]
  
  // S4 通过constructor，如果xx是数组，那么 xx.constructor === Array
  console.log(arguments.constructor === Array) //false
  arguments.constructor = Array
  console.log(arguments.constructor === Array); //true
```


Q3: typeof null 结果为object 的原因是什么

A:
S1 JS 最初版本使用32 位存储数据，为了性能 使用低位的1-3位  存储变量的类型: 
- 000：对象
- 010：浮点数
- 100：字符串
- 110：布尔
-    1：整数
- null：所有机器码均为0
- undefined：用 −2^30 整数来表示

S2 null 全都是用0表示的，所以将它错误的判断为 object


Q4: instanceof的模拟实现

A:
S1 instaceof的实现原理，是递归查找原型链的过程

```js
// 不断查找obj.__proto__.__proto__......, 只有其中有一环指向Fn.prototype, 则为true
obj1 instanceof Fn

// 模拟实现
mockInstanceof = function(left, right) {  // left表示左侧对象(实例)，right表示右侧函数对象参数
  let src = left.__proto__
  let target = right.prototype

  while(true) {
    if (src === null) {     // 原型链对象遍历到顶层时
      return false 
    }
    if (src === target) {   // 与显式对象严格相等时
      return true
    }

    src = src.__proto__      // 递归遍历原型链
  }
}
```


### <span id="4"> 四 类型转换 </span>

Q1: JS中转化成 Number类型  的规则是什么

A: 

S1 Number(xxxx: any) / 一元加操作符

```js
const c = console.log

c( Number(true) )               // true: 1 + false: 0
c( Number(null) )               //  0
c( Number(undefined) )      //  NaN

c( Number('') )                  // 空字符串:  0
c( Number('234dd') )         // 非纯数字的字符串:  NaN
c( Number('-0023.45') )    // -23.45             
c( Number('0xf') )             // 支持16进制表示:  15

c( Number({valueOf() {return 23}}) )    //对象:  obj.valueOf/obj.toString:   23
```

S2 parseInt(xxx: string, 2/8/10/16进制)

```js
const c = console.log

c( parseInt(true) )                   // 任意非字符串类型  NaN

c( parseInt('') )                     // 空字符串:  NaN
c( parseInt('dd234') )           // 开头不是数字的 字符串:  NaN  
c( parseInt('-0023.45dd') )   // 开头是数字的 字符串:    -23

c( parseInt('0xf') )               // 支持16进制表示:  15
```

S3 parseFloat(xxx: string)

```js
const c = console.log

c( parseFloat(true) )                   // 任意非字符串类型  NaN

c( parseFloat('') )                     // 空字符串:  NaN
c( parseFloat('dd234') )           // 开头不是数字的 字符串:  NaN  
c( parseFloat('-0023.45dd') )   // 开头是数字的 字符串:    -23.45

c( parseFloat('0xf') )               // 不支持16进制表示:  0
```


Q2: JS中转化成 Boolean类型  的规则是什么

A: 

S1 除了5个falsy值转化为false (0 或者 NaN/ false/ 空字符串/ null/ undefined )，其他值都转化为 true


Q3: JS中转化成 String  的规则是什么

A: 

S1 xxx.toString()
S2 null/undefined没有toString ==>  String()


Q4:  加法操作符+ 隐式转化规则是什么

A:

有String/toString() 转 String ==>  有Number转 Number
```js
123 + 'abc' = '123abc'                // S1 字符串 + 其他类型，一律转化 字符串拼接

123 + {} = '123[object Object]'    // S2 Number + 引用类型, 转化为 字符串拼接

123 + null = 123                      // S3  Number + 非字符串的基本类型, 转化为数字相加
123 + true = 124
```


Q5.1:  == 和 === 有什么区别

A:  == 两侧数据类型不相同时, 会发生隐式类型转化, 而 === 则不会

有Number/ValueOf 转 Number

```js
//  S1  null == undefined结果是true，除此之外，null、undefined和其他任何类型的 比较值都为false   

// S2  String和Number比较，先将String转换为Number类型
// S3  Boolean和其他任何类型比较，Boolean首先被转换为Number类型

// S4 原始类型和引用类型做比较时，对象类型会依照 ToPrimitive规则  转换为原始类型

null == undefined   // true
null == false         // false
undefined == ''    // false

123 == '123'    // true
'' == 0           // true

true == 1                    // true

'[object Object]' == {}    // true
'1,2,3' == [1, 2, 3]          // true,   [1,2,3].toString() = '1, 2, 3'

// 即判断 !Boolean([]) ==> false转化为Number(false) ==> 0  ==>  [] 和 0 进行比较  ===> 
//      [].toString() = ''  ===>  ' '  和 0  比较  ===>   0 和 0 比较  ===> 值为true
[] == ![]                       // true  


//  false转化为0  +  [null].toString() 为 ' ', 所以就是比较  0 和  ‘ ’
[null] == false               // true
[undefined] == false     // true
```


Q5.2 如何让 a == 1 && a == 2 && a == 3 成立

```js
const a = {
  value: 1,
  valueOf() {
    return this.value++
  }
}
```





