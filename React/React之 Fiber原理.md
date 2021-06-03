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

----
Q4.1  ReactDom.render的调用流程是什么
A：
S1 大致分为三个阶段：初始化阶段/ render阶段/ commit阶段

![ReactDom.render调用流程](https://gitee.com/ygming/blog-img/raw/master/img/reactDom1.png)

S2 scheduleUpdateOnFiber的作用是 调度更新；
    commitRoot则  开启 真实DOM的渲染过程(commit 阶段) 

------
Q4.2 ReactDom.render的 初始化阶段，具体流程是什么
A：

根本目标：完成 Fiber树中【基本实体】的创建

具体过程是：

S1 调用legacyRenderSubtreeIntoContainer（后继 待渲染子树 载入容器）
            |
S1.1 root = container._reactRootContainer = legacyCreateRootFromDomContainer() 
            |  （从真实DOM容器中 创建 后继根节点）
            |
S1.2 fiberRoot = root._internalRoot
            | 是一个 FiberRootNode实例 ==> 其中包含一个 current 属性
            | current对象：一个 FiberNode实例+是一个 Fiber节点，而且是当前Fiber树头节点     
            | 我们一般以 rootFiber指代 current 对象 
            |
            |  fiberRoot的关联对象 是真实 DOM的容器节点
            |  而 rootFiber 则作为  虚拟DOM的根节点
            |  这两个节点，是 后续整棵Fiber树 构建的起点
            |
S2 调用unbatchedUpdates(  () => updateContainer(...args, fiberRoot)  )
            |
S3 主要是 执行了传入的回调函数 updateContainer(ele, container, parentCom, callback)
            | 
S3.1  lane = requestUpdateLane(current$1)： 请求当前 Fiber节点的 lane(优先级)
           |
S3.2  update = createUpdate(eventTime, lane)：结合 lane，创建当前 Fiber节点的update对象
        enqueueUpdate(current$1, update)：        把这个 update对象入队
          |
S3.3 scheduleUpdateOnFiber(current$1, lane, eventTime)：调度当前节点 (rootFiber)
          |
S4  scheduleUpdateOnFiber 调用performSyncWorkOnRoot  (执行根节点的同步任务)
         |  performSyncWorkOnRoot 是 render 阶段的起点，render阶段 完成了 Fiber 树的构建
         |  在异步渲染的模式下，render阶段是一个可打断的异步过程
         |  但是在 ReactDOM.render触发的首次渲染中，它是个同步过程
         |
S5  React 16/17小版本中，React都有3 种启动方式
  - legacy 模式：同步的 ReactDOM.render(<App />, rootNode)
  - blocking 模式：过渡模式 ReactDOM.createBlockingRoot(rootNode).render(<App />)
  - concurrent 模式：异步的ReactDOM.createRoot(rootNode).render(<App />)

所以，目前的Fiber架构 是一种同时兼容了同步渲染与异步渲染 的设计

![legacyRenderSubtreeIntoContainer流程图](https://gitee.com/ygming/blog-img/raw/master/img/reactDom2.png)

![root对象 介绍](https://gitee.com/ygming/blog-img/raw/master/img/reactDom3.png)
![current对象 介绍](https://gitee.com/ygming/blog-img/raw/master/img/reactDom4.png)
![fiberRoot 和 rootFiber关系](https://gitee.com/ygming/blog-img/raw/master/img/reactDom5.png)

```js
//S1 reactDom.render中调用了 legacyRenderSubtreeIntoContainer
return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);


// S1.2 legacyRenderSubtreeIntoContainer具体实现
function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  // container 对应的是我们传入的真实 DOM 对象
  var root = container._reactRootContainer;
  // 初始化 fiberRoot 对象
  var fiberRoot;

  // DOM对象本身不存在 _reactRootContainer 属性，因此 root 为空
  if (!root) {
    // 若 root 为空，则初始化 _reactRootContainer，并将其值赋值给 root
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
    // legacyCreateRootFromDOMContainer 创建出的对象会有一个 _internalRoot 属性，将其赋值给 fiberRoot
    fiberRoot = root._internalRoot;

    // 这里处理的是 ReactDOM.render 入参中的回调函数，你了解即可
    if (typeof callback === 'function') {
      var originalCallback = callback;
      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    } // Initial mount should not be batched.

    // 进入 unbatchedUpdates 方法
    unbatchedUpdates(function () {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });

  } else {
    // else 逻辑处理的是非首次渲染的情况（即更新），其逻辑除了跳过了初始化工作，与楼上基本一致
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      var _originalCallback = callback;
      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);
        _originalCallback.call(instance);
      };
    } // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }

  return getPublicRootInstance(fiberRoot);
}


// S2 unbatchedUpdates具体实现
function unbatchedUpdates(fn, a) {
  // 这里是对上下文的处理，不必纠结
  var prevExecutionContext = executionContext;
  executionContext &= ~BatchedContext;
  executionContext |= LegacyUnbatchedContext;
  try {
    // 重点在这里，直接调用了传入的回调函数 fn，对应当前链路中的 updateContainer方法
    return fn(a);
  } finally {
    // finally 逻辑里是对回调队列的处理，此处不用太关注
    executionContext = prevExecutionContext;
    if (executionContext === NoContext) {
      // Flush the immediate callbacks that were scheduled during this batch
      resetRenderTimer();
      flushSyncCallbackQueue();
    }
  }
}


// S3 updateContainer具体实现
function updateContainer(element, container, parentComponent, callback) {
  ......
  // 这是一个 event 相关的入参，此处不必关注
  var eventTime = requestEventTime();
  ......

  // 这是一个比较关键的入参，lane 表示优先级
  var lane = requestUpdateLane(current$1);
  // 结合 lane（优先级）信息，创建 update 对象，一个 update 对象意味着一个更新
  var update = createUpdate(eventTime, lane); 
  // update 的 payload 对应的是一个 React 元素
  update.payload = {
    element: element
  };

  // 处理 callback，这个 callback 其实就是我们调用 ReactDOM.render 时传入的 callback
  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    {
      if (typeof callback !== 'function') {
        error('render(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callback);
      }
    }
    update.callback = callback;
  }

  // 将 update 入队
  enqueueUpdate(current$1, update);
  // 调度 fiberRoot 
  scheduleUpdateOnFiber(current$1, lane, eventTime);
  // 返回当前节点（fiberRoot）的优先级
  return lane;
}
```

------
Q4.3 ReactDom.render的 render阶段，具体流程是什么






## 参考文档

01 [React 深入浅出第12章～第13章](/)