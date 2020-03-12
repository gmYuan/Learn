# Vue源码分析之 响应式基本原理

## 目录

1 [预读文档](#1)

2 [实现代码](#3)


## <span id="1">一 预读文档 </span>

1 [响应式系统的基本原理](https://github.com/answershuto/VueDemo)

阅读原因: 实现代部分 参考文档


## <span id="2"> 二 实现代码 </span>

1 Q: 什么是响应式系统

A:

S1 通过数据对象 来自动生成 视图层的显示内容 => 当数据对象值发生变化时，视图层会重新渲染页面

S2 响应式系统的关键是，如何监听到数据对象的值发生了改变， 即 `变化侦测`


2 Q: 如何实现 响应式数据

A:

S1 获取到需要观测的 数据对象: options.data

S2 监听每个 数据对象的值 变化情况:  遍历 + Object.defineProperty

S3 当值发生变化时，调用视图重新渲染的 函数


```js

class Vue {
  constructor(options) {        // S1 获取到需要观测的 数据对象
    this._data = options.data
    observer(this._data)
  }
}


function observer(value) {   // value 即 options.data
  if (!value || (typeof value !== 'object')) {
    return
  }

  Object.keys(value).forEach(key => {    // S2.1 监听每个 数据对象的值 变化情况
    defineReactive(value, key, value[key] )
  })
}


function defineReactive(obj, key, val) {  // S2.2 通过defineProperty 自动监听当前对象 最新值
  Object.defineProperty(obj, key, {
    configurable: true,
    enumberable: true,
    get() {
      return val
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal
      cb(newVal)   //S3 当值发生变化时，调用视图重新渲染的 函数
    }
  })
}

function cb(val) {  //  渲染视图
   console.log("视图更新啦～", val);
}


let o = new Vue({
  data: {
    test: "I am test."
  }
})

o._data.test = "hello,test."

```