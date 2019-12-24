# Vue源码分析之 响应式基本原理

## 目录

1 [预读文档](#1)

2 [Object.defineProperty()](#2)

3 [实现代码](#3)


## <span id="1">一 预读文档 </span>

1 [Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

阅读原因: Object.defineProperty部分 参考文档

2 [响应式系统的基本原理](https://github.com/answershuto/VueDemo)

阅读原因: 实现代部分 参考文档


## <span id="2"> 二 Object.defineProperty() </span>


1 Q: 什么是防抖(debounce)

A:

S1 当用户的操作会引起 频繁的JS计算/网络请求等时，就要对其事件响应回调进行频率限制，以保证性能

S2 防抖的限制原理类似于  每次法师读大过程中再次放大, 就会重新进行施法计时


2 Q: 实现防抖的难点

A: 

S1 如何重新进行施法计时: `清除之前已有的的回调计时 + 进行新的回调计时`


3 Q: 如何实现防抖

A: 防抖分为 非立即执行版 和 立即执行版, 代码见下: 

```js
// 1 非立即执行版
function deounce(func, wait) {
  var timer
  return function() {
    var self = this, args = arguments  // 绑定因异步延时 丢失的this 和 event对象

    clearTimeout(timer)
    timer = setTimeout(function() {
      func.apply(self, args)
    }, wait)
  }
}


// 2 立即执行版: 一开始立即执行 + 之后每次防抖
function debounce(fn, wait, immediate) {
  var timer
  return function() {
    var self = this, args = arguments

    clearTimeout(timer)
    
    if (immediate) {
      timer = setTimeout(function(){  // S1 不断清除timer + 后续实质为节流
        timer = null
      }, wait)
      if (!timer) { fn.apply(self, args) }
        
    } else {  // 非立即执行时，执行原逻辑
      timer = setTimeout(function(){
        fn.apply(self, args)
      }, wait)
    }
  }
}

```


## <span id="3">三 节流 </span>


1 Q: 什么是节流(throttle)

A: 

S1 一段时间内不管触发多少次事件，都只按固定的频率响应对应回调

S2 防抖的核心是 `不满足就重置`, 节流的核心是 `不满足就忽略`


2 Q: 如何实现节流

A:

S1 方法1: 时间戳法, 代码见下

```js
function throttle(fn, wait) {
  let previos = 0
  let self, args
  return function() {
    self = this, args = arguments

    let now = +new Date()
    if (now - previous >= wait) {
      fn.apply(self, args)
      previous = now
    }
  }
}
```

S2 方法2: 定时器法, 代码见下

```js
function throttle(fn, wait) {
  let timer, self, args

  return function() {
    timer = setTimeout(function(){
      timer = null
    }, wait)
    
    if (!timer) {fn.apply(self, args)}
  }
}
```

S3 最终综合版本见下

```js
function throttle(fn, wait) {
  let timeout
  let previous = 0

  return function () {
    var context = this, args = arguments
    var curr = +new Date()
 
    clearTimeout(timeout) //总是干掉事件回调
 
    if(curr - previous >= wait){ 
      fn.apply(context, args) 
      previous = curr
    } else {
      timeout = setTimeout(function(){  //让方法在脱离事件后也能执行一次
        fn.apply(context, args) 
      }, wait)
    }
  }
}
```