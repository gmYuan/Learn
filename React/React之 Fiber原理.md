# React之 Fiber原理

Q1 为什么要引入Fiber架构
A:
S1 浏览器是多线程，其中 JS线程和渲染线程是互斥的，当其中一个线程执行时，另一个线程只能挂起等待；
因为 JS线程是可以操作 DOM 的，如果 渲染线程和 JS线程可以 同时工作，那么渲染结果必然是难以预测的

S2 在这样的机制下，若 JS线程长时间地占用了主线程，那么渲染层面的更新就 不得不长时间地等待，造成所谓的“卡顿”

S3 而 Stack Reconciler的一个无解问题，就是JS对 主线程的 超时占用问题

S4.1 栈调和机制下的 Diff算法，是一个同步递归的  深度优先遍历树  的过程
S4.2 这个递归过程是同步的，不可以被打断；当处理相对庞大的虚拟 DOM 树时，JS线程将长时间地霸占主线程，进而导致我们上文中所描述的渲染卡顿/卡死、交互长时间无响应等问题


```js
// 若 A 组件发生了更新，那么栈调和的工作过程是这样的：
// - 对比第 1 层的两个 A，确认节点可复用，继续 Diff 其子组件
// - Diff 到 B 的时候，对比前后的两个 B 节点，发现可复用，于是继续 Diff 其子节点 D、E
// - 待 B树最深层的 Diff 完成、逐层回溯后，再进入 C 节点的 Diff 逻辑......
// - 调和器会重复“父组件调用子组件”的过程，直到最深的一层节点更新完毕，才慢慢向上返回
```

![栈调和的问题](https://gitee.com/ygming/blog-img/raw/master/img/fiber1.png)

------
Q2 Fiber是如何解决同步渲染问题的
A：
S1 Fiber架构通过引入"增量/渐变渲染"来解决这一问题，他的特点是 优先级 + 可中断 + 可恢复

S2 大致渲染流程是：
一个庞大的更新任务 --> 分解并创建成一个个工作单元 --> 
其中一个任务单元A --> Scheduler(调度器)分配优先级 --> 任务A进入 Reconciler层执行--> 
进入任务B 且 优先级更高 --> Reconciler层 中断任务A + 执行完B任务 --> 
新一轮调度开始，继续恢复执行任务A

![Fiber架构流程图](https://gitee.com/ygming/blog-img/raw/master/img/fiber2.png)

-------
Q3 Fiber对 React的 生命周期 有什么影响

A: 
S1 生命周期大致被分为 render/pre-commit/commit 三个阶段，Fiber机制主要影响的是 render阶段

S2 工作单元/任务的 中断与重新执行，会造成以下几个生命周期钩子可能会被 重复执行：
- componentWillMount
- componentWillUpdate
- shouldComponentUpdate
- componentWillReceiveProps
为了避免风险，直接导致了 componenteWillXXX被官方建议 废弃使用

![React生命周期图](https://gitee.com/ygming/blog-img/raw/master/img/fiber3.png)
![React生命周期与Fiber关系](https://gitee.com/ygming/blog-img/raw/master/img/fiber4.png)




## 参考文档

01 [React 深入浅出第12章](/)