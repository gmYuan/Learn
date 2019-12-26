# Vue源码分析之 响应式基本原理

## 目录

1 [预读文档](#1)

2 [实现代码](#3)


## <span id="1">一 预读文档 </span>

1 [Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

阅读原因: Object.defineProperty部分 参考文档

2 [响应式系统的基本原理](https://github.com/answershuto/VueDemo)

阅读原因: 实现代部分 参考文档


## <span id="2"> 二 实现代码 </span>

1 Q: 什么是响应式数据

A: 当数据值发送变化时， 视图层会对其响应，匹配更新成新的值 + 重新渲染页面，这就是响应式数据

2 Q: 如何实现 响应式数据

A: 

```js

// S1 使用示例

let o = new Vue({
  data: {
    test: "I am test."
  }
})
o._data.test = "hello,test."


// S2 获取到 options里 data属性所有数据, 遍历监听 data里所有属性的key + value
class Vue {
  constructor(options) {
    this._data = options.data
    observer(this._data)
  }
}

function observer(value) {   // value 即 data
  if (!value || (typeof value !== 'object')) {
    return
  }

  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key] )
  })
}


// S3 使用Object.defineProperty 设置存取描述符属性对象, 来获取data里属性值的最新状态 + 更新视图
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumberable: true,
    get() {
      return val
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal
      cb(newVal)   // 触发视图更新
    }
  })
}

function cb(val) {
   /* 渲染视图 */
   console.log("视图更新啦～", val);
}
```

以上即是Vue的响应式原理, 响应式系统的另一部分——依赖收集 会在之后的博文中介绍。
