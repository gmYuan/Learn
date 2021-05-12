# React之 生命周期

Q1 React 15版本中有那些生命周期函数，分别有什么作用
A:
挂载阶段
S1 constructor
  - new class时自动触发， 一般用于 初始化 state值
  
S2 componentWillMount
  - 一般用于 数据获取/定时器设置，但是不建议这么做，原因见下文

S3 render
  - 生成虚拟 DOM

S4 componentDidMount
  - 一般用于 配合ref 获取DOM

更新阶段
S1 componentWillReceiveProps(nextProps)
  - 父组件state/props发生变化时就会被 调用

S2 shouldComponentUpdate(nextProps, nextState)
  - 一般用于 控制组件是否重渲染 re-render
  - 本质是 子组合内的props未更新时，不会因为其他props的更新触发 重新渲染
  - 是一种 性能优化的 方式

S3 componentWillUpdate(nextProps, nextState)
  - 组件更新渲染前调用

S4 render
- 生成新的虚拟 DOM + 执行Diff算法定位出 新旧虚拟DOM的差异

S5 componentDidUpdate(preProps, preState)
  - 组件重新渲染生成DOM后 调用

卸载阶段
S1 componentWillUnmount
  - 组件被销毁/key值发生变化时，会销毁该组件
  - 一般用于 清理数据，如定时器/轮询事件等

用图表示为
![React15 生命周期](https://gitee.com/ygming/blog-img/raw/master/img/lifeCircle.png)

------
Q2 React 16版本的生命周期有哪些，分别有什么作用
A:
挂载阶段
S1 constructor
S2 componentWillMount ==> static getDerivedStateFromProps(props, state)
  - 组件 初始化/更新时会被调用

S3 render：生成虚拟 DOM
S4 componentDidMount


更新阶段
S1 componentWillReceiveProps(nextProps)  ==> static getDerivedStateFromProps(props, state)
  - 用它 替换掉 componentWillReceiveProps，它仅有一个用途：使用 props 来派生/更新 state
  - 是一个静态方法，因此在这个方法内部 访问不到this
  - props表示当前组件接收到的来自父组件的props，state表示当前组件 自身的state
  - 它需要返回一个对象a，该派生对象被添加到state中，即 this.state =  { ...this.state, a }


S2 shouldComponentUpdate(prevProps, nextState)
S3 render：生成新的虚拟 DOM + 执行Diff算法定位出 新旧虚拟DOM的差异

S4 componentWillUpdate(nextProps, nextState) ==>  getSnapshotBeforeUpdate(prevProps, prevState)
  - 它的 执行时机是在 render方法之后，真实 DOM 更新之前；而componentWillUpdate在render()之前执行
  - 它的 返回值 会作为第三个参数给到componentDidUpdate
  - 在这个阶段，我们可以同时获取到 更新前的真实DOM 和 更新前后的state&props信息

S5 componentDidUpdate(preProps, preState, valueFromSnapshot)
  - valueFromSnapshot可以接收到 getSnapshotBeforeUpdate的返回值

卸载阶段
S1 componentWillUnmount

用图表示为：
![React16 生命周期](https://gitee.com/ygming/blog-img/raw/master/img/lifeCircle2.png)

-----

Q3 React 16版本的生命周期 为什么要发生这些变动
A:
S1 
  - React 16引入了重要的更新==> Fiber架构，它会使原本同步的渲染过程 变成异步的
  
  - 同步渲染的递归调用栈是非常深的，只有最底层的调用返回了，整个渲染过程才会开始逐层返回，同步渲染一旦开始，便会牢牢抓住主线程不放，直到递归彻底完成。在这个过程中，浏览器没有办法处理任何渲染之外的事情，会进入一种无法处理用户交互的状态。因此若渲染时间稍微长一点，页面就会面临卡顿甚至卡死的风险。
  - 而 Fiber 会将一个大的更新任务拆解为许多个小任务。每当执行完一个小任务时，渲染线程都会把主线程交回去，看看有没有优先级更高的工作要处理，确保不会出现其他任务被“饿死”的情况，进而避免同步渲染带来的卡顿。在这个过程中，渲染线程不再“一去不回头”，而是可以被打断的，这就是所谓的“异步渲染”

  - 根据“能否被打断”这一标准，React 16 的生命周期被划分为了 render 和 commit 两个阶段，而 commit 阶段又被细分为了 pre-commit 和 commit

S2 
  - render阶段：纯净且没有副作用，可能会被 React 暂停/终止/重新启动
  - pre-commit阶段：可以读取 DOM
  - commit阶段：可以使用 DOM，运行副作用，安排更新
  
总的来说，render 阶段在执行过程中允许被打断，而 commit 阶段则总是同步执行的
为什么这样设计？简单来说，由于 render 阶段的操作对用户来说其实是“不可见”的，所以就算打断再重启，对用户来说也是零感知。而 commit 阶段的操作则涉及真实 DOM 的渲染，所以这个过程必须用同步渲染来求稳。

S3
  - 在 Fiber 机制下，render 阶段是允许暂停/终止/重启的。当一个任务执行到一半被打断后，下一次渲染线程抢回主动权时，这个任务被重启的形式是“重复执行一遍整个任务”而非“接着上次执行到的那行代码往下走”。这就导致 render 阶段的生命周期都是有可能被重复执行的。

  - React 16 废弃的生命周期 (componentWillMount/componentWillUpdate/componentWillReceiveProps) 都处于 render 阶段，都可能重复被执行，存在风险（风险举例见下）
  
  - 在这些生命周期内 可以做的事情，完全可以转移到其他生命周期 (componentDidxxx)里

风险举例：
  - 假如在 componentWillxxx 里发起了一个付款请求。由于 render 阶段里的生命周期都可以重复执行，在 componentWillxxx 被打断 + 重启多次后，就会发出多个付款请求。
  
  - 在 componentWillReceiveProps 里操作DOM（比如说删除符合某个特征的元素），那么 componentWillReceiveProps 若是执行了两次，可能就会一口气删掉两个符合该特征的元素

## 参考文档

01 [深入浅出React-第02～03节](/)