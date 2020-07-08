## Pattern之 单例模式


### <span id="1"> 一 预读文档 </span>

01 [JS设计模式与开发实战](/)

阅读原因: 直接参考文档


### <span id="2"> 二 实现方法 </span>

Q1:  什么是单例模式

A:  通过某种方法， 从而创建出一个  `唯一的 + 全局可访问的  对象`


### <span id="3"> 三 示例代码 </span>

Q1: 如何实现 单例模式

A:
```JS
A.getInstance = (function(){
  let instance
  return () => {
    if (!instance) {
      instance = new A()
    }
    return instance
  }
})()
```

Q2：如何实现 通用的  惰性单例模式

A:
```js
const getSingle = function(fn){
  let result
  return function() {
    return result || (result = fn.apply(this, arguments))
  }
}


// 使用示例
let createSingleIframe = getSingle( function(){
  let iframe = document.createElement ( 'iframe' )
  document.body.appendChild( iframe )
  return iframe
})

document.getElementById( 'loginBtn' ).onclick = function(){
  let loginLayer = createSingleIframe()
  loginLayer.src = 'http://baidu.com'
}
```