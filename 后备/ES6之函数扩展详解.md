# ES6之 函数扩展详解

## 前言

最近学习了《深入理解ES3》第2章的相关知识，所以对其部分内容做一个小结。

文章目录:

1 [函数参数默认值](#1)

  - [ES5中 模拟参数默认值](#1.1)

  - [ES6中 参数默认值](#1.2)

  - [参数默认值 与 arguments对象](#1.3)

  - [参数默认值表达式](#1.4)

  - [参数默认值的　暂时性死区](#1.5)


2 [箭头函数](#2)

  - [箭头函数 特点](#2.1)

  - [箭头函数 语法](#2.2)

  - [实际使用](#2.3)

3 [xxx](#3)




## <span id="1"> 一 函数参数默认值 </span>

### <span id="1.1"> 1.1 ES5中 模拟参数默认值 <span>

1 模拟方法1: 或运算

```js
function makeRequest(url, timeout, callback) {
  timeout = timeout || 2000;
  callback = callback || function() {};

  // 函数的剩余部分
}
```

S1 原理

&emsp;&emsp;或运算符 在左侧的值为假值（falsy）时，总会返回右侧的操作数；

&emsp;&emsp;函数的具名参数在未被明确提供时是undefined；

S2 缺点
  
&emsp;&emsp;传入值为0时，因为0是假值，就会导致timeout的值被替换为2000 


2 模拟方法2: typeof类型判断

```js
function makeRequest(url, timeout, callback) {
  timeout = (typeof timeout !== "undefined")? timeout : 2000;
  callback = (typeof callback !== "udnefined")? callback : function(){}

  // 函数的剩余部分
}
```

缺点: 代码过多


### <span id="1.2"> 1.2 ES6中的参数默认值 <span>

1 语法形式

```js

function makeRequest(url, timeout = 2000, callback = function() {}) {

  // 函数的剩余部分
}

// 实际调用 timeout传入null，此时它不使用默认值
makeRequest("/foo", null, function(body) {doSomething(body)} )
```

2 特点

S1 设置了默认值的参数 是可选传入的

S2 默认值 自动使用场景: 未传入实参 / 传入实参值为 undefined
  注意: null值 是有效参数, 不会使用 timeout默认值


### <span id="1.3"> 1.3 参数默认值 与 arguments对象 <span>

1 在 ES5 + 非严格模式下，arguments对象会反映出 具名参数的变化

  换言之，arguments类数组对象 直接存储了实参变量

```js
fucntion mixArgs(first, second){
  console.log(first === arguments[0]);
  console.log(second === arguments[1]);

  first = "c";
  second = "d";
  console.log(first === arguments[0]);
  console.log(second === arguments[1]);
}

mixArgs("a", "b");

// 输出结果，相当于  arguments = {first, second, ......}
  true
  true
  true
  true
```

2 在 ES5 + 严格模式下，arguments对象 不会反映 具名参数的变化 ,可以理解为arguemnts存储的是实参变量副本

```js
fucntion mixArgs(first, second){
  "use strict";

  console.log(first === arguments[0]);
  console.log(second === arguments[1]);

  first = "c";
  second = "d";
  console.log(first === arguments[0]);
  console.log(second === arguments[1]);
}

mixArgs("a", "b");

// 输出结果，相当于  arguments = {first', second', ......}
  true
  true
  false
  false
```

3 ES6模式下，arguments值为实际传入内容，而不是默认参数值
  
  arguments对象  始终反映初始调用值 的状态

```js
// 非严格模式
function mixArgs(first, second = "b") {
  console.log(arguments.length);
  console.log(first === arguments[0]);
  console.log(second === arguments[1]);

  first = "c";
  second = "d"
  console.log(first === arguments[0]);
  console.log(second === arguments[1]);
}

mixArgs("a");  //实际调用

// 输出结果
1       //arguments的值只有一个传入的实参 first=a
true
false   // second=默认值b,arguments[1]=未传入实参默认的undefined

false  // arguments对象不会随变化而改变，是其副本
false
```


### <span id="1.4"> 1.4 参数默认值表达式 <span>

1 只要可以生成值，都可以作为默认参数，如，表达式、函数等

  利用函数，可以实现很多效果，如:

```js

// 例1 递增参数
let value = 5;

function getValue() {
  return value++;
}

function add(first, second = getValue()) {
  return first + second;
}

console.log(add(1, 1)); // 2

console.log(add(1));    // 6，函数调用后 全局变量value值为6
console.log(add(1));    // 7


// 例2 将前面的参数作为后面参数的默认值
function add(first, second = first) {
  return first + second;
}

console.log(add(1, 1));  // 2

console.log(add(1));    // 2

```

2 以上例2需要注意的是，前面的参数是 不能引用后面的参数,
  原因是 参数默认值的暂时性死区


### <span id="1.5"> 1.5 参数默认值的　暂时性死区 <span>

1 函数参数只有在函数被调用时，才会被初始化；

　参数变量在初始化之前，因为ＴDZ的原因　无法被引用

举例如下

```js
function add(first = second, second) {
  return first + second;
}

console.log(add(1, 1));           // 2

console.log(add(undefined, 1));  // 抛出错误
```

因为在对first进行初始化时,second 还未被初始化；

second位于暂时性死区内，对second的引用 就会报错

2 每次函数调用时都会创建一个新的 参数对象

```js
function append(value, array = []) {
  array.push(value);
  return array;
}

append(1);   //[1]
append(2);   //[2], not [1, 2]
```

3 因为参数变量和函数体内变量处于不同作用域，所以不能再次声明参数

```js
function foo(x = 5) {
  let x = 1;    // error
  const x = 2;  // error
}
```

以上内容可参考:

[01 深入理解ES6 第3章](https://github.com/xianshenglu/document/blob/master/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3ES6-%E4%B8%AD-%E9%9D%9E%E6%89%AB%E6%8F%8F%E7%89%88.pdf)

[02 MDN—— 默认参数值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Default_parameters)

[03 阮一峰—— 函数扩展](http://es6.ruanyifeng.com/#docs/function#%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0%E7%9A%84%E9%BB%98%E8%AE%A4%E5%80%BC)


## <span id="2"> 二 箭头函数 </span>

### <span id="2.1"> 2.1 箭头函数特点 <span>

1 特点

S1 没有 this/super/arguments对象，也没有 new.target绑定，它们的值 由外层最近的 + 非箭头函数 决定

S2 没有 [[Construct]]方法，因此不能当作构造函数，使用 new 调用箭头函数会报错

S3 没有prototype属性， 既然不能使用new，那么箭头函数也就 不需要原型
 
S4 箭头函数必须依赖于 具名参数/剩余参数 来访问函数的参数,且它不允许 重复的具名参数

S5 箭头函数也有 name属性，规则与其他函数相同


### <span id="2.2"> 2.2 箭头函数语法 <span>

1 语法

S1 如果函数没有任何参数，在声明时就要 使用一对空括号

```js
var getName = () => "Nicholas"

// 基本等价于
var getName = function() {
  return "Nicholas"
}
```

S2 当用一对花括号 包住函数体时，必须明确定义一个返回值(return xxx)

S3 箭头函数返回一个对象字面量，必须将该字面量包裹在圆括号内

```js

var getTempItem = id => ({ id: id, name: "Temp" })

// 基本等价于
var getTempItem = function(id) {

  return {
    id: id,
    name: "Temp"
  }
}
```

2 创建立即调用函数表达式

```js
let person = ((name) => {

  return {
    getName: function() {
      return name;
    }
  }

})("klay")

console.log(person.getName());   // "klay"
```

### <span id="2.3"> 2.3 实际用法 <span>

1 没有this绑定，适合用于 对象方法/回调函数

S1 箭头函数没有this，所以要通过 查找作用域链来确定 this的值

S2 如果箭头函数被包含在一个非箭头函数内，那么this值就会与该函数的相等; 否则 this值就会是全局对象

S3 由于箭头函数的this值由包含它的函数决定，因此不能使用call/apply/bind方法 来改变其this值


2 适合使用数组方法

3 箭头函数不太适用的情况有：定义对象方法 / 原型方法 / 构造函数 / 事件回调函数

以上参考

[01 深入理解ES6 第3章](https://github.com/xianshenglu/document/blob/master/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3ES6-%E4%B8%AD-%E9%9D%9E%E6%89%AB%E6%8F%8F%E7%89%88.pdf)

[02 冴羽—— ES6系列之 箭头函数](https://github.com/mqyqingfeng/Blog/issues/85)

[03 阮一峰—— ES6入门 函数的扩展](http://es6.ruanyifeng.com/#docs/function#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0)

[04 掘金—— 什么时候不能使用箭头函数](https://juejin.im/post/58fda157570c350058e6afb8)

[05 掘金—— 不要滥用箭头函数](http://jingsam.github.io/2016/12/08/things-you-should-know-about-arrow-functions.html)