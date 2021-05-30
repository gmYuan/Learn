# React之 虚拟DOM

Q1 什么是 虚拟DOM
A:
S1 一个模拟表示 DOM结构的 JS对象
S2 本质上，它是 JS数据 到 真实DOM之间 的映射中间层

![虚拟DOM表示](https://gitee.com/ygming/blog-img/raw/master/img/xnDOM1.png)

-------
Q2 为什么要使用虚拟DOM，它一定比 操作真实DOM快么
A:
S1 虚拟DOM的引入，实现了“数据驱动视图”的理念，开发者不再需要直接使用不方便的DOM操作
S2 虚拟DOM 的 diff算法 + patch差量更新，保证了一定的性能
S3 虚拟DOM可以使 JS代码具有跨平台渲染的能力

S4 但是，虚拟DOM不一定比真实DOM快，当数据内容全部发生变化时，虚拟DOM反而更耗时

具体见下图
![虚拟DOM构建流程](https://gitee.com/ygming/blog-img/raw/master/img/xnDom2.png)
![虚拟DOM构建比较](https://gitee.com/ygming/blog-img/raw/master/img/xnDom3.png)
![虚拟DOM跨平台示意](https://gitee.com/ygming/blog-img/raw/master/img/xnDom4.png)

--------
Q3 简单介绍一下 Diff算法过程
A:
S1 同层节点对比：每次比较都是按同层进行递归比较的，如果发生 跨层级的节点移动，则直接删除新建节点；
S2 同层比较时，优先比较 新旧节点类型是否相同，相同则继续进行下层比较，不同则 删除+新建；
S3 对于叶子节点，利用key标识叶子节点内容是否发生了变化，从而高效复用节点内容；如果key不是一个稳定标识(如key)，那么每次新增/删除内容key就会发生变化，从而导致节点重建

![diff同层比较](https://gitee.com/ygming/blog-img/raw/master/img/xnDom5.png)
![diff中key的作用](https://gitee.com/ygming/blog-img/raw/master/img/xnDom6.png)

--------
Q4



## 参考文档

01 [深入浅出Reac09~10](/)