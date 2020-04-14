# Vue之 响应式原理详解

### 目录

1 [预读文档](#1)

2 [响应式 流程](#2)

3 [实现代码](#3)


## <span id="1">一 预读文档 </span>

01 [0 到 1 掌握：Vue 核心之数据双向绑定](https://juejin.im/post/5d421bcf6fb9a06af23853f1)

02 [深入浅出Vue 第2章](/)

阅读原因: 直接参考文档

03 [深入源码学习Vue响应式原理](https://juejin.im/post/5dc0ea64e51d455818621891)

直接参考文档: 源码执行流程的 学习思路可以学习一下


## <span id="2"> 二 响应式 流程 </span>

Q1: 什么是响应式系统

A:

S1 视图层的显示内容 是根据 数据对象生成的 => 当数据对象值发生变化时，视图层也会重新渲染页面

S2 响应式系统的关键是：

- A1 如何监听到 数据对象值发生了改变(如 data.A)

- A2.1 数据对象data.A的 所有依赖 保存到哪里

- A2.2 如何 把data.A的所有依赖 加入到保存位置中

- A3 如何通知所有依赖， data.A的值发生了变化， 从而更新该依赖视图


即`变化侦测 + 依赖收集 + 依赖更新`



Q2: 如何监听到 数据对象值发生了改变

A:

S1 Vue 2.0通过 `Object.defineProprty`来实现 变化侦测 (getter&setter)

S2 对于 嵌套的数据对象，需要通过递归 实现深度检测

即 `Oberver类: 递归监测 所有属性对象值`



Q3: 数据对象data.A的 所有依赖 保存到哪里

A: 

S1 数据对象 和 依赖 的关系是一对多的，所以可以通过 `观察者模式/发布-订阅模式`, 创建Dep类

S2 Dep类 相对于一个 中介平台, 他可以 保存所有订阅者/发送通知给 所有订阅者

即 `Dep类: addSub() + notify()`



Q4: 如何 把data.A的所有依赖 添入到保存位置中

A:

S1 在Watch实例化时，就 把该依赖实例存入到一个全局对象Dep.target中 + 读取data.A的值

S2 读取data.A值时候，就会自动触发getter函数，此时存入该依赖实例(即Dep.target)



Q5: 如何通知所有依赖， data.A的值发生了变化， 从而更新该依赖视图

A:

S1 当data.A赋值时，就会触发 setter值，此时可以 通知所有订阅者 值发生了变化


综上过程如图示：

[![8s0klQ.md.png](https://s1.ax1x.com/2020/03/19/8s0klQ.md.png)](https://imgchr.com/i/8s0klQ)



Q5: 用 Object.defineProperty实现的 响应式系统  存在什么问题么

A:

S1 无法追踪到 如 `this.obj.name`这样的 新增属性的 变化;

S2 类似的，无法 追踪到 `delete this.obj.name`这样的 删除属性的 变化

即 `只能追踪属性值的修改，无法追踪属性值的 新增/删除`



## <span id="3"> 三 实现代码 </span>

Q1 如何用代码实现 Object类型的 响应式数据

A: 代码见下

```js
let o = new Vue({
  data: {
    test: "I am test."
  }
})

class Vue {
  constructor(options) {
    this._data = options.data
    new Observer(this._data)

    new Watcher()
  }
}

class Observer {   // S1 获取到所有 非数组数据, 把它们都设置为 被观测对象
  constructor(value) {
    this.value = value

    if (!Array.isArray(value)) {  // 非数组为 对象时
      this.walk(value)
    }
  }

  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    })
  }
}

function defineReactive(data, key, val) {
  if (typeof val === 'object') {  // 递归监测 子元素嵌套对象
    new Observer(val)
  }

  let dep = new Dep()    // S2.2 每个被监测数据对象，都有一个 管理依赖中心 Class Dep

  Object.defineProperty(data, key, {   // 2.1 监听数据变化
    enumerable: true,
    configurable: true,

    getter() {
      dep.depend()    // S2.3 在依赖组件实例A 读取数据值时 加入A到 Dep中
      return val
    },

    setter(newVal) {
      if (val === newVal) return;
      val = newVal
      dep.notify()  // S2.4 在数据值更新时 发送通知给 所有依赖组件
    }

  })
}

class Dep {   // 订阅管理中心
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  depend() {    // 新增订阅者
    if (window.DepTarget) {
      this.addSub(window.DepTarget)
    }
  }

  notify() {      // 通知 订阅者更新
    this.subs.forEach(sub => {
      sub.update()
    })
  }

  removeSub() { }
}

class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    this.getter = parsePath(expOrFn)  //执行this.getter(), 即可获取例如 data.a.b的值
    this.cb = cb
    this.value = this.get()
  }

  get() {
    window.DepTarget = this
    let value = this.getter.call(this.vm, this.vm)  // 执行this.getter()，触发读取属性值的 getter操作
    window.DepTarget = undefined
    return value
  }

  update() {
    const oldValue = this.value
    this.value = thi.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
}
```