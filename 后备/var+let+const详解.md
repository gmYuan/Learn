# var、let和const详解

## 一 前言

最近在学习ES6的相关知识，其中let/const关键字应该是比较基础的一个知识点了。

## 二  var关键字

1 作用域
用var声明的变量，其作用域是当前的执行上下文 `(函数/全局)`
而非声明变量（无var 创建的变量），其作用域 是全局
```js
function x() {
  y = 1;        // 在严格模式（strict mode）下会抛出ReferenceError异常
  var z = 2;
}

x();
console.log(y);   // 打印"1" , 因为y是非声明变量，因此是一个全局变量
console.log(z);   // 抛出ReferenceError，因为z所属作用域为x函数
```

2 创建变量时间
用var声明的  简单类型变量，在声明时就会被创建 + 变量值初始化为undefined
而 非声明变量（无var创建的变量），只有在 执行赋值操作时才会被创建
```js
console.log(a);                   // 抛出ReferenceError，因为非声明变量，只有赋值才会创建
console.log('still going...');   // 永不执行，因为上一句报错了
```

3 是否可被配置（删除）
声明变量是它所在上下文环境的不可配置属性
而 非声明变量是可配置的（如可以被删除）

4 变量提升
用var关键字声明的变量，JS在编译阶段，会将其`声明语句`置于所在作用域的顶部 处理

5易错点：

(1) 同时用var 创建2个变量，逗号可理解为 `分句+复制var 声明`
```js
var a,b         //合法，相当于 var a = undefined, var b = undefined

var a=0, b=0   //合法，相当于var a = undefined, var b = undefined  +  a=0 & b=0

var x = y, y ='A'  
          //undefinedA， 相当于var a = undefined, var b = undefined  +  x=y的默认值(此时为undefined) +  y='A'

var a,b = a = 'A'      //合法，相当于：var a = undefined, var b = undefined + 从右到左执行赋值

```

(2)同时初始化变量，没有逗号则 不会有类似`分句+复制var声明`的效果
```js
var x = 0;
function f(){
  var x = y = 1;      // 相当于var x + 从右到左执行赋值，所以y是非声明变量/全局变量
}

f();
console.log(x, y);   // 0, 1
```

(3) 嵌套函数内赋值非声明变量， 逐向外层寻找直到全局，有就覆盖赋值，无则新建全局
```js
var x = 0;  
console.log(typeof z);    // undefined，因为z还不存在

function a() {
  var y = 2;     console.log(x, y);   // 0  2

  function b() {
    x = 3;        // 全局变量x被赋值为3，不生成全局变量。
    y = 4;        // 已存在的外部函数的y变量被赋值为4，不生成新的全局变量
    z = 5;        // 创建新的全局变量z
  }

  b();
  console.log(x, y, z);   // 3 4 5
}

a();                      // 调用a时同时调用了b。
console.log(x, z);       // 3 5
console.log(typeof y);   // undefined，因为y是a函数的local变量
```

## 三 let/const关键字

1 用let/const声明的变量，具有块级作用域的限制
```js
{
  let a = 10;
  var b = 20;
}

a   // ReferenceError: a is not defined
b   // 1
```

2 用let/const声明的变量，存在 暂时性死区（TDZ）+ 没有 变量声明提升的 机制

S1 TDZ, 可以理解为:
  在代码块内（函数/{…}花括号内），只要一个变量还没被初始化，它就不可被读取/赋值
  只有执行到 初始化变量的那一行代码，变量才从死区中释放，从而可被使用

S2 TDZ也会影响到typeof的判断结果（在let之前，typeof永远不会报错）

S3 TDZ的实质，是提升了变量的创建+暂存在死区内，且不提升初始化和赋值操作
  代码块内 用let /const声明的变量，在执行到 初始化语句之前都无法访问

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
let x;

//例3
var x = x;  //不报错
let x = x;  // ReferenceError: x is not defined， let声明的变量在初始化执行完前不可访问
```

3 用let/const声明的变量，不可被重复声明：
  (1) let 不能在`同一作用域内` 重复声明一个已有标识符
  (2)在嵌套的作用域内，使用let声明一个同名新变量 是可以的

```js
//例1
var count = 30;
if (condition){
   let count = 40     //合法，因为同名变量不在同一作用域内
}

//例2
function func(arg) {
  let arg;          // 报错，不可重复声明
}

function func(arg) {
  {
    let arg;      // 不报错，不在同一作用域
  }
}
```

4 用let/const定义的全局变量，不会作为属性 被添加到全局对象window/node上
```js
var a = 1;
window.a   // 1, 如果在 Node的REPL环境，可以写成 global.a /  this.a

let b = 1;
window.b    // undefined
```

5 用const声明的变量会被认为是常量，所以：
  (1) 所有的const变量都需要 在声明时进行初始化，
  (2) 们的值在被设置完成后，就不允许再被赋值(更改)
  (3) const 阻止的 是对变量地址addr的修改，而不阻止 对成员值进行修改

```js
//例1
const age = 18;   //正确
const count       //报错，声明时未初始化
age = 19         //报错，不可再次赋值

//例2
const person = {
 age = 18;
}
person.age = 19      //正确，不阻止对象的内部值进行修改
person = {age: 20}   //报错，修改了person指向的对象地址addr，重写了对象指向
```

## 四 块级作用域

1 ES 6 引入了块级作用域，块级作用域存在于：
  (1)函数内部
  (2){…}块中

2 在for循环中定义的变量仅内部可用，一旦循环结束，该变量在任意位置都不可访问
```js
for (let i =0; i < 10 ; i++){
  console.log(i)
}

console.log(i)  // i在此处无法访问，用var则在此处可访问
```

3 循环中的函数计数，可用let在每次迭代时创建一个新绑定，替换以前的 IIFE+闭包
```js
var a = []
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6]();  //10,因为调用时调用栈是 fn1匿名函数——全局作用域

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

ES6的解决原理是：
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

Babel提供的转化方法则是闭包：
```js
var a = [];
var _loop = function _loop(i) {
  a[i] = function () {
    console.log(i);
  };
};

for (var i = 0; i < 10; i++) {
    _loop(i);
}

funcs[0](); // 0
```

4在循环内使用const，特点是：更改值时会报错

5 类似的还有for…in循环
```js
var funcs = [], object = {a: 1, b: 1, c: 1};
for (var key in object) {
  funcs.push(function(){
    console.log(key)
  });
}

funcs[0]()  //'c', 如果是let则为'a'
```

6 最佳实践:
在默认情况下使用const ，仅当明确变量值需要被更改的情况下才使用 let

## 五 参考文档

[01 MDN的 var关键字](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var)

[02 阮一峰—let 和 const 命令](http://es6.ruanyifeng.com/#docs/let)
[02 方应杭—理解 let](https://zhuanlan.zhihu.com/p/28140450)
[02 读懂let才能少踩坑](https://juejin.im/post/5ad9d151f265da0b8c248610)

[02 ES6系列之 let 和 const](https://github.com/mqyqingfeng/Blog/issues/82)
[02 深入理解ES6 P10~20](https://book.douban.com/subject/27072230/)
