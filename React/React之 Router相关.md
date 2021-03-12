# 性能之 防抖和节流

## 防抖部分

1 什么是防抖(debounce)：
触发事件N秒后 才执行响应回调，N秒内每次重新触发，则都重新开始计时


2 实现思路:
S1 事件触发N秒后执行回调==>  return 函数(事件绑定的 必然要是一个会自动执行的 回调函数) + setTimeout
S2 N秒内重复触发事件时，则重新计时 ==>  每次计时都是同一个timer闭包 + clearTimeout ==> 这样才能确保上一次的timer会被清空
S3 修复 e/this/回调函数返回值 丢失问题 ==>  rest参数 + apply + retrn结果

S4 立即执行版 ==> 不存在timer时才 执行响应fn + 定时设置timer N秒后不存在 ==> 这样每次不满N秒后触发时，由于timer一直存在则不会执行回调


3 代码实现：
```js
function debounce(fn, wait, immediate) {
  let timer 

  //S1 retrun 函数 + setTimeout， 注意如果此处是箭头函数，则this指向的是全局对象而非 e.target对象
  return function(...args) {
    const ctx = this

   // S2 期间内重复触发，则重新计时: 闭包 + clearTimeout
    if(timer) clearTimeout(timer);

   // S4 立即执行版
    if (immediate) {
      let callNow = !timer
      timer = setTimeout( () => {
        timer = null
      }, wait)
      if (callNow) {
        return fn.apply(ctx, args)
      }
    // S3 非立即执行版
    } else {
      timer = setTimeout( () => {
        return fn.apply(ctx, args)
      } ,wait)
    }
  }
  
}
```


##  节流部分

1 什么是节流(throttle)
 每次触发事件后 固定N秒后执行一次回调

2 实现思路

S1  时间戳/顾头不顾尾版:  now - pre > wait时  ==>  执行回调 + pre = now
S2 定时器/顾尾不顾头版:  不存在timer时 ==> 执行fn + timer重置为null
S3 头尾合并法:  时间戳版 (更新pre + 执行函数 + 清除定时器版干扰) + 定时器版(更新timer + 执行函数 + 清除时间戳版干扰)
S4 首尾执行控制法: 对首尾执行 各种新增一个前提条件


3 代码实现：
```js
function throttle(fn, wait, options={leading: true, tailing: true}) {
  let pre = 0
  let timer
  return function(...args) {
    const ctx = this
    // S1 时间戳法:  清除定时器版干扰 + 更新pre + 执行函数
    let now = +new Date()
    if (!pre && options.leading === false) { pre = now }
    let remaining = wait - (now - pre)
    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      pre = now
      fn.apply(ctx, args)
      console.log('时间戳版执行了')
    //S2 定时器版:  清除时间戳版干扰 + 更新timer为null + 执行函数  
    } else if (!timer && options.tailing === true) {
      timer = setTimeout( () => {
        pre = options.leading === false ? 0 : +new Date()
        timer = null
        fn.apply(ctx, args)
        console.log('定时器版执行了')
      }, remaining);
    }

  }
}
```

## 参考文档

01 [JS专题之 跟着underscore学防抖](https://github.com/mqyqingfeng/Blog/issues/22)

02 [JS专题之 跟着underscore学节流](https://github.com/mqyqingfeng/Blog/issues/26)