# React之 Redux相关

Q1 Redux的整体流程是什么
A：
  - 一个集中管理共享数据的 数据仓库：store = createStore(Reducer, initState, middleApply)
  - 可以触发更新数据的 动作申请：store.dispatch(action = {type: xxx, payload: yyy})
  - 根据不同动作类型 ==> 更新并返回新数据的分发处理器：reducer(state, action) => newState对象，reducer是纯函数
  - Redux是单向数据流
-----





Q1 React有哪些 组件抽象的方法
A：
  - Mixin
  - HOC

Q2 mixin存在的问题
A：
  - 引入了组件的外部依赖，mixin内部引入了新的state和props
  - mixin存在第三方 命名冲突的问题

Q3 HOC的原理
A：
  - 接收一个React.component A，返回一个增强的 React.component B 的函数
  - 即 const HOC = (wrapper, params) =>newCom

Q4 如何实现HOC
A:
```js
//方法1 属性代理： 操作传入A里的 props
//  作用1： 控制props的增改查内容  
//  作用2： 设置state，抽离组件状态 
//  作用3： 增强传入组件 的DOM结构/样式
const HOC = (wrappedCom) => {
  return class extends React.component {
    constructor(props) {
      super(props)
      ......
    }
    ......
    render() {
      return <wrappedCom {...this.props} data={xxx} />
    }
  }
}


//方法2 反向继承：返回的组件B 继承于 传入的A
// 作用1: 劫持渲染：可以控制 渲染内容/返回结果
const HOC = (wrappedCom) => {
  return class extends wrappedCom {
    render() {
       return super.render()
    }
  }
}
```






## 参考文档

01 [深入React技术栈](/)
02 [React官方文档- 高阶组件](https://zh-hans.reactjs.org/docs/higher-order-components.html)