# React之 组件通信

Q1 组件通信方法有哪些
A：
  - parentA 通信 childB / B 通信 A：通过props 传递值/ 回调函数
  - 多层嵌套组件通信：通过 context
  - 无嵌套关系的组件通信：发布/订阅模式 ==> 会带来逻辑混乱，加入流程约束 ==> Redux

Q2 context的使用方法是什么

A：
```js
//S1 Context对象 会返回一个 Provider React组件
comContext = React.createContext(defaultValue)

<comContext.Provider value={xxx}>
  <B value={xxx} />
</comContext>

class C extends React.Component {
  //S2 contextType属性值为 一个由 React.createContext() 创建的 Context 对象
  static contextType = comContext

 //S3 xxx值为 Prover中的 value值
  const xxx = this.context
}
```

## 参考文档

01 [深入React技术栈](/)
02 [React官方文档- Context](https://zh-hans.reactjs.org/docs/context.html)