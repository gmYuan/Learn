# React之 生命周期

## 生命周期

Q1 React中有那些生命周期函数，分别有什么作用

A:

挂载阶段
S1 constructor
  - new class时自动触发， 一般用于 初始化 state值
  
S2 componentWillMount
  - 一般用于 数据获取/定时器设置

S3 render
  - 生成虚拟 DOM

S4 componentDidMount
  - 一般用于 配合ref 获取DOM


更新阶段
S1 componentWillReceiveProps(nextProps)
  - 父组件state/props发生变化时被 调用

S2 shouldComponentUpdate(nextProps, nextState)
  - 一般用于 控制组件是否重渲染
  - 本质是 子组合内的props未更新时，不会因为其他props的更新触发 重新渲染
  - 是一种 性能优化的 方式

S3 componentWillUpdate(nextProps, nextState)
  - 组件更新渲染前调用
  - 不能执行 setState()方法，原因 

S4 render
- 生成新的虚拟 DOM + 执行Diff算法定位出 新旧虚拟DOM的差异

S5 componentDidUpdate()(preProps, preState)
  - 组件重新渲染生成DOM后 调用


卸载阶段
S1 componentWillUnmount
  - 组件被销毁/key值发生变化时，会销毁该组件
  - 一般用于 清理数据，如定时器/轮询事件等



## refs

Q1： refs是什么，有什么作用

A
- refs是组件上一种特殊的props，它指向 组件A被创建后 生成的组件实例a
- 通过ref，可以调用 组件的实例方法；可以获取 组件的内部DOM
- 创建方法为：<A ref={(ref) => this.xxx = ref } />



## 参考文档

01 [深入浅出React-第02节](/)