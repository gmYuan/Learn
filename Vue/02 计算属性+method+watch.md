# 计算属性 + method + watch

目录:

1 [预读文档](#1)

2 [为什么要有计算属性 + 怎样使用计算属性](#2)

3 [计算属性 和 method的区别是什么](#3)

4 [为什么要有watch + 怎样使用watch](#4)



## <span id="1">1 预读文档 </span>

1 [官方文档_计算属性和侦听器](https://cn.vuejs.org/v2/guide/computed.html)

阅读原因: 直接参考文档


## <span id="2">2 为什么要有计算属性 + 怎样使用计算属性 </span>

1 Q: 为什么要有计算属性

A:
S1 通常创建的数据，要经过一系列处理步骤，之后再显示到页面上才比较合理

S2 如果在 插值文本(即`{{}}`)中直接进行 相关逻辑处理，会让模板过重，而且当有多处需要使用时，会很难维护

S3 因此，引入了computed(计算属性)，用于对数据进行处理，处理完毕后可以直接像数据属性一样，直接通过模板语法进行调用


2 Q: 怎样使用计算属性

A:
S1 基本使用方法是:

```js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // 定义的一个计算属性
    reversedMessage() {
      return this.message.split('').reverse().join('')
    }
  }
})

//html中直接使用即可:
 <p>翻转结果是: {{ reversedMessage }}</p>
```

关于计算属性更多的使用方法(包括getter和setter)，参见: [计算属性 代码示例](https://github.com/gmYuan/my_learn/blob/master/Vue/code/02%20%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7.html)


## <span id="3">3 计算属性 和 method的区别是什么 </span>

1 Q: 计算属性 和 method 的区别是什么

A:
S1 在插值文本中的调用方法不同: `{{计算属性名称}}` VS `{{方法名称()}}`

S2 计算属性具有缓存，只要其依赖的数据未发生变化，哪怕其他数据变化导致页面重新渲染了，它也不会再次执行

而方法，只要页面重新渲染，就会再次执行


## <span id="4">4 为什么要有watch + 怎样使用watch </span>

1 Q: 为什么要有watch

A:
S1 watch可以让我们更加精细的检测某个数据是否变化，只要检测的数据发生了变化，就会自动调用对应的回调函数

S2 另一方面来说，watch同样具有缓存性，只要检测的数据未发生变化，它就不会重新执行


2 Q: 怎样使用watch

A:
S1 基本使用方法如下:

```js
var vm = new Vue({
  el: '#app',
  data: {
    name: 'yc'
  },
  watch: {
    name: function(newValue, oldValue){
     var info = newVlaue + oldValue
     alert(info)
    }
  }
```
