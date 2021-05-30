# React之 State相关

Q1 setState是异步还是同步的
A:
S1 setState是异步的，只是在某些特殊语句下会表现成同步

S2.1 每次调用setState，都会在在 微任务队列中，入队一个setState任务；
S2.2 当同步语句都执行完成后，React会对 已有setState任务进行合并，形成批量更新 + 执行一次重渲染(re-render)流程
S2.3 之所以是 批量更新，就是为了避免 在短时间内触发多次重渲染流程

```js
this.setState({
  count: this.state.count + 1    ===>    入队，[count+1的任务]
})

this.setState({
  count: this.state.count + 1    ===>    入队，[count+1的任务，count+1的任务]
});

this.setState({
  count: this.state.count + 1    ===>    入队, [count+1的任务，count+1的任务, count+1的任务]
});

↓
合并 state，[count+1的任务]
↓
执行 count+1的任务

// 多次 +1 最终只有一次生效，是因为在同一个方法中多次 setState的合并动作不是单纯地将更新累加
// 对于相同属性的设置，React 只会为其保留最后一次的更新
```

-----
Q2 为什么在 setTimeout中的 setState语句，会表现出是 同步的形式
A:
S1




## 参考文档

01 [React深入浅出 之第11章](/)
