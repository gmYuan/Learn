# this、apply、bind等详解

## 一 前言

this是JS里的基本知识点，所以最近学习了this的相关知识，在此过程中也学习了call、apply、bind等相关知识点


## 二 什么是this

1 每个函数在被调用时，都会产生一个执行上下文，其中有3个属性:
  变量对象(Variable object，VO)  + 作用域链(Scope chain)  + this

2 this可以理解为是一个指针，它指向一个对象。
  换句话说，每次调用一个函数时，在函数内部 都会有一个this指针，`指向调用函数的对象`

3 this的作用

从面向对象的角度，我们可以把函数看做是一个动作，对象看做是对象的执行者。比如:
“穿黑衣的小明 吃火锅”:  小明是一个对象，黑衣是小明的一个特征/属性，吃火锅是动作
```js
function eating(){
  console.log(this.name + '吃火锅')

  var person1 = {
    name: '小明',
    color: 'black',
    eat: eating
  }
}

person1.eat()  //这里this指向person1对象
```

当我们想创建“漂亮的小红 吃火锅时”，利用this，我们就可以方便的 复用“吃火锅”函数，即:
```js
var person2 = {
  name: '小红',
  looking: 'beautiful',
  eat: eating
}

person2.eat()    //这里this指向person2对象
```

所以，this的作用主要是:
  1 实现函数复用
  2 实现对象继承（本质仍然是函数封装复用）
  
从上面例子，我们可以知道this的指向对象是不固定的，那么问题来了
我们应该如何 确定this的 指向对象呢？

PS
以上内容，推荐参考:
[你不知道的JS]( https://book.douban.com/subject/26351021/)
[JS深入系列目录]( https://github.com/mqyqingfeng/Blog)


## 三 this的指向情况

情况1 全局环境: 无论是否在函数内部，this指向对象都必定是window
```js
this.b = 'test'
console.log(this.b === window.b)    //ture
```

情况2 简单函数调用: 非严格模式下this指向window，严格模式下this值为undefined
```js
function test(){
  console.log(this)
}

test()   //window
```
这种情况，本质可以转化成 `test.call(undefined)`

情况3 作为对象的方法调用: this指向调用该函数的对象
```js
var obj = {
  name: 'klay',
  getName: function(){
    console.log(this.name)
  }
}

obj.getName()    //klay
```
同样这种情况，本质可以转化成 `obj.getName.call(obj)`

这种 函数作为对象方法调用的情况，会有一些坑需要注意：

易错点1: 当对象A里包含对象B时，调用B里的方法，this指向的对象是B对象
```js
function naming(){
  console.log(this.name)
}

var obj1 = {
  name:'klay',
  getName: naming
  obj2:{
    name:'inner',
    getName: naming
  }
}

obj1.obj2.getName()    //inner
```
其实这种情况也很容易解释，当我们调用o.fn()时，其实可以看作是window.o.fn()的格式
这时this指向的对象是o而不是window，其原理是一样的

易错点2: 在数组中调用函数，此时this对象指向该数组
```js
function fn1(){
  console.log(this)
}

var arr = [fn1,fn2,fn3]

arr[0]()  //arr
```

这个其实也很好解释，数组的本质仍然是对象，所以按照对象理解就可以，近似于
```js
var arr = {
  0: fn1,
  1:fn2,
  2:fn3,
  length:3
}
```
所以，`arr[0]()`近似等价于 arr.0()

易错点3: 对象方法赋值给一个函数，此时调用函数时，this指向对象是window
```js
var name = 'outer'
var obj1 = {
  name:'klay',
  getName: function(){
    console.log(this.name)
  }
}

var outer = obj1.getName
outer()  //outer
```
当对象方法被赋值给一个函数A后，如果函数A被直接调用了，那么就相当于是简单函数调用的情况（上文的第2种情况），所以this指向window对象
这种情况如果衍生开来，就可以推出易错点4的情况

易错点4: 对象方法和运算符（布尔/算数/赋值等）一起使用，此时this对象指向全局对象
```js
var obj = {
  foo: function(){
    console.log(this)
  }
}
(obj.foo = obj.foo)()   //window
(flase || obj.foo)()    //window
(obj.foo, obj.foo)()    //window
```

关于这种情况，我只能大致理解（是规范定义的 规则决定的），推荐阅读以下两篇文章：
[JS深入系列之 从ECMAScript规范解读this](https://github.com/mqyqingfeng/Blog/issues/7)
[阮一峰教程 this关键字]( http://javascript.ruanyifeng.com/oop/this.html)

易错点5：对象里的函数A含有函数B，函数B执行时，B内部的this 指向window对象
```js
var obj1 = {
  f1: function(){
    console.log(this);
    var f2 = function(){
      console.log(this);
    }();
  }
}

obj1.f1()   //obj1   window


```
f2函数执行时，会新创建一个执行上下文对象，此时this就不会指向obj1了，而是指向window（因为在全局调用了）

常规的解决方法是： 使用一个内部变量that固定值外层this的值即可

易错点6: 在回调函数中使用this, 此时this经常会被修改成window对象/DOM元素等
```js
var a = 'global'
var obj1 = {
  a:2,
  foo: function(){
    console.log(this.a)
  }
}

function doFoo(fn){
  fn()
}

doFoo(obj1.foo)  //"global"
```
传入obj1.foo时，由于未执行方法，因此传入的参数可以看作是函数地址
当回调函数时，相当于在新建的函数上下文中执行了函数体，此时this自然就是指向全局对象this

类似的还有内置函数的回调，如`setTimeout()、foreach()、事件监听回调函数`等

易错点7: 原型链和 getter/setter中的 this，都指向调用方法的对象（具体见MDN）


情况4  函数调用时显式绑定指向对象(call、apply、bind)：此时this指向 传入对象
```js
function foo(){
  console.log(this.a)
}

var obj1 = {
  a:2
}

var bar = function(){
  foo.call(obj1)
}

bar()  //2
bar.call(window)  //2  因为bar函数内部 已经手动固定指向了obj1对象
```

情况5  使用new创建对象实例时，this指向新创建的对象实例
```js
function Foo(a){
  this.a = a
}

var bar = new Foo(2)
console.log(bar.a)     //2
```

以上5种情况的优先级分别是：
new构造函数 > 显式调用 > 默认对象调用 > 全局（函数）调用

情况6 使用箭头函数，其this 就是  外层函数调用时的this指向对象

箭头函数没有this, 它只会从自己的 上一层作用域链中 继承this
换言之，箭头函数的this值 `遵循词法作用域的查找规则（就像是一个普通变量）`
且，箭头函数的绑定无法被修改，见下例：

```js
function foo(){
  return (a)=>{
  console.log(this.a)   //箭头函数的this 继承自foo()第一次调用时的this指向对象
  }
}

var obj1 = {a:1};
var obj2 = {a:2};

var bar = foo.call(obj1)
bar.call(obj2)         //1,不是2!
```

关于箭头函数，以后会单独写一篇博文记录易错点。

情况7 作为事件回调函数，其this指向 触发该事件的DOM元素


## 四 call、apply、bind相关及实现

上文初步介绍了call、apply、bind的使用，这一部分单独介绍一下 各自的实现方式，基本是冴羽大神相关博客的笔(ban)记 (yun):
[JS深入之call和apply的模拟实现]( https://github.com/mqyqingfeng/Blog/issues/11)
[JS深入之bind的模拟实现]( https://github.com/mqyqingfeng/Blog/issues/12)


0 概念：
call()/apply(): 在指定 this和参数值的前提下，调用某个函数或方法
bind(): 创建一个新函数。
      当这个新函数被调用时，bind()的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

1 call的实现:

S1 确定this的指向 + 执行调用call的函数
```js
Function.prototype.call2 = function(context){
  context.fn = this   //this表示调用的函数
  context.fn()
  delete context.fn
}

//测试一下
var obj1 = {
  a:12
}

function bar(){
  console.log(this.a)
}

bar.call2(obj1)  //12
```
这一步的难点是理解 `context.fn = this`:
(1) 每个函数也是对象，所以可以具有属性/方法，即从形式上来说，可以是fnA.fnB()
(2) fnA.fnB()时，fnA是一个对象，所以this的指向满足上文的情况3，fnB里的this指向fnA

S2 可以向执行的函数对象 传入参数
```js
Function.prototype.call2 = function(context){
  context.fn = this;
  var args= [];
  for (var i =1, length = arugements.length ; i<length; i++){
    args.push('arguments[' + i + ']');   //结果为 ["arguments[1]", "arguments[2]"…]
  }

  eval('context.fn(' + args + ')' );  // 结果为context.fn(arguments[1], arguments[2], ...);
  delete context.fn
}

// 测试一下
var obj2 = {
    value: 12
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call2(obj2, 'kevin', 18);
// kevin
// 18
// 12
```

这一步的难点是理解 `eval('context.fn(' + args + ')' )`:
  (1)eval的作用类似于script标签，它把传入的字符串当做 JS语句执行
  (2)字符串+数组时，数组会调用tosting方法转化为字符串，效果类似于join(‘,’)

S3 this可以传入null + 函数可以有返回值，实现如下:
```js
Function.prototype.call2 = function(context){
  var context = context || window;
  context.fn = this;

  var args = [];
  for (var i = 1, length = arguments.length; i < length; i++){
    args.push('arguments[' + i + ']');
  }
  var result = eval('context.fn(' + args + ')');

  delete context.fn;
  return result;
}

// 测试一下
var value = 20;

var obj = {
    value: 10
}

function bar(name, age) {
  console.log(this.value);
  return {
      value: this.value,
      name: name,
      age: age
  }
}

bar.call2(null); // 20

console.log(bar.call2(obj, 'kevin', 18));
// 10
// Object {
//    value: 10,
//    name: 'kevin',
//    age: 18
// }

```

2 apply的模拟实现和call类似，具体代码见下：
```js
Function.prototype.apply = function (context, arr) {
  var context = Object(context) || window;
  context.fn = this;

  var result;
  if (!arr) {
      result = context.fn();
  } else {
      var args = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        args.push('arr[' + i + ']');
      }
      result = eval('context.fn(' + args + ')')
    }

  delete context.fn
  return result;
}
```

用ES6的写法是:
```js
Function.prototype.call2 = function(context,...args){
  var context = context || window;
  context.__fn__ = this;

  let result = context.__fn__(...args);
  delete context.__fn__;
  return result;
}
```

3 bind的模拟实现

S1 返回一个函数
```js
Function.prototype.bind2 = function(context){
  var self = this             //如果没有这一步直接使用this，那时this指向的是window
  return function(){            // bind()方法返回一个函数，所以有return
    return  self.apply(context)  //有return 是因为有可能self指向的函数对象有返回值,从而把返回的值传出来
  }
}

// 例子

var obj1 = {
      value: 1
};

function bar() {
  return this.value;
}

var bindFoo = bar.bind2(obj1);          //此时self=bar, context=obj1

console.log( bindFoo() ); // 1
```

S2 实现可以传入参数的功能
```js
Function.prototype.bind2(context){
  var self = this
  var args = Array.prototype.slice.call(arguments,1);   // 获取bind2函数从第二个参数到最后一个参数

  return function(){
    var bindArgs = Array.prototype.slice.call(arugments);
    return self.apply(context, args.concat(bindArgs));   //再次调用函数时，拼接 参数数组
  }
}
```

关于slice为什么可以把类数组对象转化成数组，可参考以下:
[关于用slice将类数组转换成数组的原理]( https://segmentfault.com/q/1010000006903928)

S3 实现 bind构造函数的效果

```js
Function.prototype.bind2 = function(context){
  var self = this;
  var agrs = Array.prototype.slice.call(arguments,1);

  var fBound = function(){
  var bindArgs = Array.prototype.slice.call(arguments);
  return self.apply(this instanceof fBound? this:context, args.concat(bindArgs));  
        //new调用时，this指向新建的对象；正常调用时，this指向context
  }
  
  fBound.prototype = this.prototype;    //返回的函数原型对象 指向 调用bind的函数原型
  return fBound
}

//测试例子
var value = 20
var ContextObj = {
  value: 10
}

function bar(name,age){
  this.habit = 'shopping';
  console.log(this.value);
  console.log(name);
  console.log(age);
}

bar.prototype .friend = 'yoyo';

var bindfoo= bar.bind2(ContextObj, 'klay');     //bindfoo指向的是 fBound函数体
var anotherObj = new bindfoo(18)    // undefined  klay   18
/* 根据new的过程，可得出：
  anotherObj指向创建的新对象，其__proto__指向bindfoo(fBound)的prototype，
  而fBound.prototype = this.prototype(调用bind的函数的 原型)，
  所以anotherObj既是fBound的实例，也是调用bind的函数对象的 实例
*/

console.log(anotherObj.habit)   //’shopping’
console.log(anotherObj.friend)   //’yoyo’
```

S4  构造函数效果的优化实现（不直接覆盖改写fBound的原型对象）
```js
Function.prototype.bind2 = function(context){
  var self = this;
  var args = Array.prototype.slice.call(arguments,1);

  var fNOP = function(){};         //创建一个空函数
  var fBound = function(){
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(this instanceof FNOP? this : context, args.concat(bindArgs))
  }

  FNOP.prototype = this.prototype;    //原型对象等于 调用bind的函数对象 的原型对象
  fBound.prototype = new FNOP();    //fBound.prototype.__proto__ = FNOP.prototype ，this = fBound.prototype
  return fBound
}
```

S5 最终实现代码（调用判断+线上兼容）
```js
Function.prototype.bind2 = function (context) {
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```

用ES6的实现方法见下:
```js
if (typeof Function.prototype.bind1 !== 'function'){
  Function.prototype.bind1 = function(context,...rest){     //扩展运算符
    if(typeof this !== 'function'){
      throw new TypeError('invalid invoked!')
    }

    var self = this;
    return function F(...args){
      if (this instanceof F){
        return new self(...rest,...args)                 //直接构造绑定函数的实例
      }
    return self.apply(context, rest.concat(args))       //一般调用时的情况
    }
  }
}
```

## 五 参考文档

[01 你不知道的JS P74~100](https://book.douban.com/subject/26351021/)
[02 MDN this关键词](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
[03 阮一峰教程 this关键字](http://javascript.ruanyifeng.com/oop/this.html)

[04 this 的值到底是什么？一次说清楚](https://zhuanlan.zhihu.com/p/23804247)
[05 JS深入系列之 从ECMAScript规范解读this](https://github.com/mqyqingfeng/Blog/issues/7)

[06 关于用slice将类数组转换成数组的原理](https://segmentfault.com/q/1010000006903928)
[07 this、apply、call、bind介绍](https://juejin.im/post/59bfe84351882531b730bac2)