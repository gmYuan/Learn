# React之 性能优化

Q1 React有哪些 性能优化方法
A：
  核心目标是：尽可能减少对 DOM的修改
  - pureRender

Q2 什么是 pureRender
A：
  - pure指的是 纯函数：相同输入返回相同输出 + 不依赖于外部状态，也不会对外部状态有任何影响
  - pureRender：尽可能让组件只依赖 props和state，从而通过 shouldComponentUpdate 节省render
  - pureRender 需要注意，对于引用类型/子定义子组件，可能会由于每次触发都产生了新对象，导致SCU的结果一直为true，解决方法是  使用变量缓存/状态提升

Q3 如何实现pureRender
A：
  - shouldComponentUpdate(nextProps, nextState)
  - Immutable
  - React.PureComponent：浅比较 props/state


Q4 什么是Immutable
A：
  - 一种特殊封装的对象，特点是 纯函数 + 结构共享
  - 它的优点是：限制入参不可变，减少复杂度 + 结构共享，节省内存 + 函数式编程
  - 缺点是：容易和原生JS对象混淆 ==> 使用TS / 自定义变量类型前缀/ Immutable.fromJS
  
```js
import {map} from 'immutable'
let a = map({
  name: 'test',
  hobby: ['1', '2']
})

let b = a.set('name', 'test2')
a === b  // false
a.get('hobby') === b.get('hobby') // true，共享未发生变化的 内存地址
```

Q5 Immutable如何实现 pureRender
A:
  - Immutable.is 通过比较 两个对象的hashCode / ValueOf(JS原生对象)，而不是深遍历/===，来判断2个对象是否相等
  - 之所以能用 hashCode判断，是因为 Immutable对象 是通过trie数据结构存储的


## 参考文档

01 [深入React技术栈](/)
02 [React官方文档- 性能优化](https://zh-hans.reactjs.org/docs/optimizing-performance.html#examples)