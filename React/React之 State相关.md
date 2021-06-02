# React之 State相关

Q1 setState是异步还是同步的
A:
S1 setState是异步的，只是在某些特殊语句下 会表现成同步

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
S1 setState的执行流程是：分发 --> 获取组件实例 + 设置组件的 state队列 + 用batchingStrategy 任务锁机制管理更新
![setState流程图](https://gitee.com/ygming/blog-img/raw/master/img/setState1.png)

S2 Transaction机制： 创建一个黑盒，该黑盒能够向任意任务注入钩子，分别在任务执行的不同阶段执行钩子
![transaction事务图](https://gitee.com/ygming/blog-img/raw/master/img/setState2.png)
![批量更新策略流程图](https://gitee.com/ygming/blog-img/raw/master/img/setState3.png)

S3 默认情况下，isBatchingUpdates这个变量，在 React的生命周期函数以及合成事件执行前，已经被 React 悄悄修改为了 true；
     这时我们所做的 setState 操作自然不会立即生效。 当函数执行完毕后，事务的 close方法会再把 isBatchingUpdates 改为 false

S4 isBatchingUpdate是在同步代码中变化的，而 setTimeout 的逻辑是异步执行的；
    当 this.setState 调用真正发生的时候，isBatchingUpdates 早已经被重置为了 false，这就使得当前场景下的 setState 具备了立刻发起同步更新的能力；

S5 综上，在 React钩子函数 及 合成事件中，它表现为异步；而在 setTimeout/ DOM原生事件中，它都表现为同步  

```js
// S1.1  setState的作用是 一个分发器：根据入参的不同，分发到不同的功能函数
ReactComponent.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
}

// S1.2 将 新的state 放进 组件的状态队列里 + 用 enqueueUpdate 来处理将要 更新的实例对象
enqueueSetState: function (publicInstance, partialState) {
  // 根据this拿到对应的组件实例
  var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');
  // 这个 queue 对应的就是一个组件实例的 state数组
  var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
  queue.push(partialState);

  //  enqueueUpdate 用来处理当前的组件实例
  enqueueUpdate(internalInstance);
}

// S1.3  使用batchingStrategy对象  管理批量更新
function enqueueUpdate(component) {
  ensureInjected();
  // 注意这一句是关键，isBatchingUpdates标识着 当前是否处于 批量创建/更新组件的阶段
  if (!batchingStrategy.isBatchingUpdates) {
    // 若当前没有处于批量创建/更新组件的阶段，则立即更新组件
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }

  // 否则，先把组件塞入 dirtyComponents 队列里，让它“再等等”
  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}

// S2 batchingStrategy锁管理器：任务锁机制 + Transaction（事务）机制
var ReactDefaultBatchingStrategy = {
  // 全局唯一的锁标识
  isBatchingUpdates: false,

  // 发起更新动作的方法
  batchedUpdates: function(callback, a, b, c, d, e) {
    // 缓存锁变量
    var alreadyBatchingStrategy = ReactDefaultBatchingStrategy. isBatchingUpdates
    // 把锁“锁上”
    ReactDefaultBatchingStrategy. isBatchingUpdates = true

    if (alreadyBatchingStrategy) {
      callback(a, b, c, d, e)
    } else {
      // 启动事务，将 callback 放进事务里执行
      transaction.perform(callback, null, a, b, c, d, e)
    }
  }
}

// S2 Transaction 首先会将目标函数用 wrapper（一组 initialize 及 close 方法称为一个 wrapper） 封装起来，同时需要使用 Transaction 类暴露的 perform 方法去执行它
// 在 anyMethod 执行之前，perform 会先执行所有 wrapper 的 initialize 方法，执行完后，再执行所有 wrapper 的 close 方法
var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function () {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  }
};

var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
};

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];


// S3 ReactEventListener.js
dispatchEvent: function (topLevelType, nativeEvent) {
  ...
  try {
    // 处理事件
    ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
  } finally {
    TopLevelCallbackBookKeeping.release(bookKeeping);
  }
}

// S4
reduce = () => {
  // 进来先锁上
  isBatchingUpdates = true
  setTimeout(() => {
    console.log('reduce setState前的count', this.state.count)
    this.setState({
      count: this.state.count - 1
    });
    console.log('reduce setState后的count', this.state.count)
  },0);
  // 执行完函数再放开
  isBatchingUpdates = false
}
```

-------



## 参考文档

01 [React深入浅出 之第11章](/)
