# React之 Fiber原理


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