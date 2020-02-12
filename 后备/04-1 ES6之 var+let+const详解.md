# ES6之 var + let + const详解

目录:

1 [预读文档](#1)

2 [声明变量 和 非声明变量](#2)

3 [let 和 var](#3)

4 [let 和 const](#4)

5 [let的常见使用场景](#5)


## <span id="1"> 1 预读文档 </span>

1 [MDN的 var关键字](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var)

阅读原因: 介绍了 声明变量和未声明变量之间的区别，以及易错点


2 [深入理解ES6 P10~20](https://book.douban.com/subject/27072230/)

3 [阮一峰—let 和 const 命令](http://es6.ruanyifeng.com/#docs/let)

4 [方应杭—理解 let](https://zhuanlan.zhihu.com/p/28140450)

阅读原因: 介绍了 let/const/var 相关知识点


## <span id="2"> 2 声明变量 和 非声明变量 </span>

1 Q: 声明变量 和 非声明变量 的区别是什么

A: 

S1 作用域不同:  

用var声明的变量，其作用域是当前执行上下文 `(函数/全局)`, 而非声明变量（无var 创建的变量），其作用域 是全局

```js
function x() {
  y = 1;       
  var z = 2;
}

x();
console.log(y);   // 打印"1" , 因为y是非声明变量，因此是一个全局变量
console.log(z);   // 抛出ReferenceError，因为z所属作用域为x函数
```

S2 创建变量的时间不同: 

用var声明的  简单类型变量，在声明时就会被创建 + 变量值初始化为undefined, 而 非声明变量（无var创建的变量），只有在 执行赋值操作时才会被创建

```js
console.log(a);                   // 抛出ReferenceError，因为非声明变量，只有赋值才会创建
console.log('still going...');   // 永不执行，因为上一句报错了
```


2 Q: 写出下面 var声明变量的结果

S1  

```js

// 例1
var x = y, y = 'A'
console.log(x + y)       // undefinedA, var变量提升 &  x= y默认值(此时为undefined) &  y='A'

// 例2
var a,b = a = 'A'      //合法, var变量提升 & 从右到左执行赋值语句

// 例3
var x = 0
function f(){
  var x = y = 1;      // 相当于var x + 从右到左执行赋值，所以y是 非声明变量/全局变量
}

f()
console.log(x, y)    // 0, 1
```

S2 嵌套函数内赋值非声明变量， 逐向外层寻找直到全局，有就覆盖赋值，无则新建全局

```js
var x = 0;  
console.log(typeof z)    // undefined，因为z还不存在

function a() {
  var y = 2     
  console.log(x, y)      // 0  2

  function b() {
    x = 3;         // 全局变量x被赋值为3，不生成新的全局变量
    y = 4;         // 已存在的外部函数的y变量被赋值为4，不生成新的全局变量
    z = 5;         // 创建新的全局变量z
  }

  b()
  console.log(x, y, z)    // 3 4 5
}

a()                     // 调用a时同时调用了b
console.log(x, z);       // 3 5
console.log(typeof y);   // undefined，因为y是a函数的local变量
```


## <span id="3"> 3 let 和 var </span>

1 Q: let 和 var 的区别有哪些

A: 

S1 具有块级作用域: let/const声明的变量，具有块级作用域的限制， 而var声明的变量则没有

```js
{
  let a = 10;
  var b = 20;
}

a   // ReferenceError: a is not defined
b   // 1
```

S2 不会变量声明提升: let/const声明的变量，不会进行变量声明提升, 而var声明的变量会有

```js

// var
console.log(foo)    // 输出undefined
var foo = 2

// let
console.log(bar)   // 报错ReferenceError
let bar = 2
```

S3 禁止重复声明: 用let/const声明的变量，不可被重复声明, 而var声明的变量可以被重复声明

```js

//例1
var count = 30

if (condition){
   let count = 40     //合法，因为同名变量不在同一作用域内
}

//例2
function func(arg) {
  let arg           // 报错，不可重复声明
}

// 例3
function func(arg) {
  {
    let arg       // 不报错，不在同一作用域
  }
}
```

S4 存在暂时性死区: let/const声明的变量，存在暂时性死区, 而var声明的变量则不存在

TDZ, 可以理解为: let声明 提升了变量的创建+暂存在死区内，且不提升初始化和赋值操作，所以在执行到 初始化语句之前都无法访问

```js 

//例1
if (true) {
                  // TDZ开始
  tmp = 'abc';         // ReferenceError
  console.log(tmp);    // ReferenceError

  let tmp;       // TDZ结束，初始化值为undefined
  console.log(tmp);    // undefined

  tmp = 123;          // 赋值语句
  console.log(tmp);    // 123
}

//例2
typeof x;   //报错，ReferenceError
let x

//例3
var x = x    //不报错
let x = x   // ReferenceError: x is not defined， let声明的变量在初始化执行完前不可访问
```


S5 不绑定到 全局作用域

```JS
var value = 1
console.log(window.value)      // 1

let value = 1
console.log(window.value)     // undefined
```


## <span id="4"> 4 let 和 const </span>

1 Q: let 和 const 的区别有哪些

S1 const变量 需要在声明时就进行初始化, 而let则不一定

```js
const maxItems = 30   // 有效的常量

const name           // 语法错误：未进行初始化
```

S2 const声明的变量 不能被重复赋值, 而let则不一定

```js
const maxItems = 5

maxItems = 6      // 抛出错误
```

PS: const声明一个对象时，只要指向的地址未发生变化，那么修改里面的成员值是合法的

```js

const person = {
  name: "Nicholas"
}

person.name = "Greg"  // 正常

person = {           // 抛出错误
  name: "Greg"
}
```


## <span id="5"> 5 let的常见使用场景 </span>

1 Q: let + for循环情况

A: S1 for循环中, let定义的变量仅在内部可用，一旦循环结束，该变量在任意位置都不可访问

```js
for (let i =0; i < 10 ; i++){
  console.log(i)
}

console.log(i)  // i在此处无法访问，用var则在此处可访问
```

S2 循环中的函数计数，可用let在每次迭代时创建一个新绑定，替换以前的 IIFE

```js
var a = []
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i)
  }
}
a[6]()            //10,因为调用时调用栈是 fn1匿名函数——全局作用域


// ES5解决方法
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = !function(arg){
  return function(){
      console.log(arg)
    }
  }(i)
}

//a[6]()    //6


//ES6解决方法
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6]();  //6,因为 每一次循环的i其实都是一个新的变量
```

ES6的解决原理是: 
  (1) 在 for (…) 的圆括号内，建立一个隐藏的作用域
  (2) 每次迭代循环时都创建一个新变量，并以之前迭代中 同名变量的值将其初始化, 即：

```js
//伪代码
(let i = 0) {
  funcs[0] = function() {
    console.log(i)
    };
  }

(let i = 1) {
  funcs[1] = function() {
    console.log(i)
  };
}

(let i = 2) {
  funcs[2] = function() {
    console.log(i)
  };
};
```
