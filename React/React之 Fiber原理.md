# React之 Fiber原理

Q1 为什么要引入Fiber架构
A:
S1 浏览器是多线程，其中 JS线程和GUI渲染线程是互斥的，
因为 JS线程可以操作 DOM，如果 渲染线程和 JS线程可以 同时工作，那么渲染结果必然是难以预测的；

S2 主流浏览器刷新频率为60Hz，即每（1000ms / 60Hz）16.6ms浏览器刷新一次，
在每16.6ms时间内，浏览器需要完成  JS脚本执行 -->  样式布局 ---> 样式绘制 的过程，
当JS执行时间过长，超出了16.6ms，这次刷新 就没有时间  执行样式布局和样式绘制，
所以当 JS执行时间过长，页面就会掉帧，形成所谓的 卡顿；

S3 而 Stack Reconciler的一个无解问题，就是JS对 主线程的 超时占用

S4.1 栈协调 机制下的 Diff算法，是一个同步递归的  深度优先遍历树  的过程
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
S1 Fiber架构让 React的渲染流程，变得具有优先级，同时可以被中断+恢复执行；
S2 React渲染过程被中断 --> 控制权交回浏览器 --> 执行高优先级的任务 --> 空闲后再恢复渲染
               |
        S2.1 让出机制：时间切片(主动让出) ，即 申请JS执行时长，到时就让出；下一帧继续执行
        S2.2 如何知道“到时”了：requestIdleCallback / Scheduler(到时通知 + 优先级设置)

S3 一个大致的 异步更新流程为：
setState 更新组件
    |
更新任务入队 updateQueue.push(updateTask)
    |
请求浏览器调度requestIdleCallback(performWork, {timeout}) / Scheduler
    |
performWork(剩余执行时间)：循环取出updateQueue中的任务调用workLoop + 再次请求浏览器调度
    |
workLoop：从更新队列(updateQueue)中 弹出更新任务来执行
    | 每执行完一个'执行单元'，就检查一下剩余时间是否充足，如果充足就进行执行下一个执行单元，
    | 反之则停止执行，保存现场，等下一次有执行权时恢复
    |
performUnitOfWork
    |
...........
    |
当Scheduler将任务交给Reconciler后，Reconciler会为变化的虚拟DOM打上代表 增/删/更新的标记
    |         标记类似于 export const Update = 0b0000000000100;
    |
只有当所有组件都完成Reconciler的工作，才会统一交给Renderer  
    |
Renderer根据Reconciler为虚拟DOM打的标记，同步执行对应的DOM操作      


```js
//performWork 伪代码
//1 会拿到一个Deadline，表示剩余时间
function performWork(deadline) {
  // 2 循环取出updateQueue中的任务
  while (updateQueue.length > 0 && deadline.timeRemaining() > ENOUGH_TIME) {
    workLoop(deadline);
  }
  // 3️ 如果在本次执行中，未能将所有任务执行完毕，那就再请求浏览器调度
  if (updateQueue.length > 0) {
    requestIdleCallback(performWork);
  }
}

//workLoop伪代码 
// 保存当前的处理现场
let nextUnitOfWork: Fiber | undefined // 保存下一个需要处理的工作单元
let topWork: Fiber | undefined        // 保存第一个工作单元
function workLoop(deadline: IdleDeadline) {
  // updateQueue中获取下一个或者恢复上一次中断的执行单元
  if (nextUnitOfWork == null) {
    nextUnitOfWork = topWork = getNextUnitOfWork();
  }

  //  每执行完一个执行单元，检查一次剩余时间
  // 如果被中断，下一次执行还是从 nextUnitOfWork 开始处理
  while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork, topWork);
  }

  // 提交工作
  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
}
```

![Fiber更新流程图](https://user-gold-cdn.xitu.io/2019/10/21/16deed1711f281b3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

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
Q4 Fiber指的是什么
A:
S1 从架构层，React16的Reconciler 是基于Fiber节点实现，被称为Fiber Reconciler
S2 从 静态的数据结构层，每个Fiber节点对应一个React element，保存了该组件的类型/对应的DOM节点
S3 从 动态的工作单元层，每个Fiber节点保存了本次更新中该组件改变的状态 / 要执行的工作(增删改...)

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;         // Fiber对应组件的类型 Function/Class/Host...
  this.key = key;
  this.elementType = null;
  this.type = null;     //对FC指函数本身，对ClassCom指class，对HostComponent指DOM的tagName
  this.stateNode = null;   // Fiber对应的真实DOM节点

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;      // 指向父级Fiber节点
  this.child = null;        // 指向子Fiber节点
  this.sibling = null;     // 指向右边第一个兄弟Fiber节点

  this.index = 0;
  this.ref = null;

  // 作为动态的工作单元的属性
      // 保存本次更新造成的状态改变相关信息
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;
      // 保存本次更新会造成的DOM操作
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

Fiber节点可以保存对应的DOM节点 --> Fiber节点构成的Fiber树 就对应DOM树

------
Q5 如何更新DOM
A：
为了避免更新时页面出现白屏/闪烁，React 使用了"双缓存"来进行更新页面DOM

S1 React中最多会同时存在两棵Fiber树：
  current Fiber树 (页面当前显示)  +  workInProgress Fiber(正在内存中构建)

S2 当workInProgress Fiber树构建完成 交给Renderer渲染在页面上后，应用根节点的current指针指向workInProgress Fiber树，此时workInProgress Fiber树就变为current Fiber树

S3 每次状态更新，都会产生新的workInProgress Fiber树，通过current与workInProgress的替换，完成DOM更新

具体流程示意图，参见 [双缓存介绍](https://react.iamkasong.com/process/doubleBuffer.html#%E4%BB%80%E4%B9%88%E6%98%AF-%E5%8F%8C%E7%BC%93%E5%AD%98)

------------







------
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

A：
S1   rootFiber节点
           |
S2  prepareFreshStack：重置一个新的堆栈环境
           |
S3  createWorkInProgress
           |
S3.1  workInProgress =  createFiber(current.tag, ....) 
           |    createFiber(current相关) ==> return new FiberNode(tag, props, key, mode)
           |    WIP.alternate = current  +  current.alternate = WIP
           |    综上，WIP是一个fiber节点，而且是 current节点(即 rootFiber)的副本；
           |
      即 fiberRoot.current属性：
                                  rootFiber对象  <-- alter --> workInProgress对象
           |
S4  workLoopSync：当WIP不为空时，就循环调用 performUnitOfWork(wIP)
           |
S5  performUnitOfWork：创建/更新Fiber节点   
          |     在循环过程中，每一个被创建出来的 新Fiber节点，
          |     都会一个一个挂载为 最初那个workInProgress节点的  后代节点，
          |     形成所谓的 workInProgress树；
          |     相应地，current指针 所指向的根节点所在的那棵树，叫做 current树
          |
S6  beginWork：创建新的 Fiber节点
          |  beginWork的入参是 一对用alternate连接起来的  workInProgress和current 节点；
          |  beginWork的核心逻辑是 根据 fiber节点(workInProgress) tag属性的不同，
          |  调用不同的节点创建函数；
          |  rootFiber/workInProgress的tag都是 3，是 HostRoot 所对应的值，
          |  因此第一个 beginWork将进入 updateHostRoot的逻辑；  
          |
S7 updateHostXXX：调用 reconcileChildren方法，生成当前节点的子节点
         |
S8 reconcileChildren：逻辑分发：mountChildFibers / reconcileChildFibers
         |     var reconcileChildFibers = ChildReconciler(true)
         |     var mountChildFibers = ChildReconciler(false);
         |    它们都是 ChildReconciler这个函数的返回值，仅仅存在入参上的区别
         |
S9.1 reconcileChildFibers
         |
S9.2 ChildReconciler
        |  关键的入参shouldTrackSideEffects，意为“是否需要追踪副作用”，
        |  因此 reconcileChildFibers 和 mountChildFibers 的不同，在于对副作用的处理不同，
        |  存在副作用的话，就会给 Fiber节点打上一个 “flags”的标记；
        |  flag 是在真实DOM渲染时，告诉渲染器：我这里需要新增 DOM节点
        |
        |  ChildReconciler 中定义了大量如 placeXXX/deleteXXX/updateXXX/ reconcileXXX
        |  等这样的函数，这些函数覆盖了对 Fiber节点的 创建/增加/删除/修改等动作，将直接或间接地
        |  被 reconcileChildFibers 所调用；
        |
        |  ChildReconciler 的返回值是一个名为 reconcileChildFibers 的函数，
        |  这个函数是一个逻辑分发器，它将根据入参的不同，执行不同的 Fiber 节点操作，最终返回不同
        |  的目标 Fiber节点
        |     




图示部分逻辑如下
![current结构图](https://gitee.com/ygming/blog-img/raw/master/img/Fiber6.png)
![WIP与rootFiber关系](https://gitee.com/ygming/blog-img/raw/master/img/fiber7.png)



具体代码为
```js
//A1  createWorkInProgress具体实现
//current 传入的是即是 现有树结构中的 rootFiber对象
function createWorkInProgress(current, pendingProps) {
  var workInProgress = current.alternate;
  // ReactDOM.render 触发的首屏渲染将进入这个逻辑
  if (workInProgress === null) {
    //S1 这是需要你关注的第一个点，workInProgress 是 createFiber 方法的返回值
    workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode);
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    //S2 这是需要你关注的第二个点，workInProgress 的 alternate 将指向 current
    workInProgress.alternate = current;
    //S3 这是需要你关注的第三个点，current 的 alternate 将反过来指向 workInProgress
    current.alternate = workInProgress;
  } else {
    // else 的逻辑此处先不用关注
  }
  // 以下省略大量 workInProgress 对象的属性处理逻辑
  // 返回 workInProgress 节点
  return workInProgress;
}

//A2  createFiber代码实现
var createFiber = function (tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode);
}

//A3 beginWork的代码实现
function beginWork(current, workInProgress, renderLanes) {
  ......
  //  current 节点不为空的情况下，会加一道辨识，看看是否有更新逻辑要处理
  if (current !== null) {
    // 获取新旧 props
    var oldProps = current.memoizedProps;
    var newProps = workInProgress.pendingProps;

    // 若 props 更新或者上下文改变，则认为需要"接受更新"
    if (oldProps !== newProps || hasContextChanged() || (
     workInProgress.type !== current.type )) {
      // 打个更新标志
      didReceiveUpdate = true;
    } else if (xxx) {
      // 不需要更新的情况 A
      return A
    } else {
      if (需要更新的情况 B) {
        didReceiveUpdate = true;
      } else {
        // 不需要更新的其他情况，这里我们的首次渲染就将执行到这一行的逻辑
        didReceiveUpdate = false;
      }
    }
  } else {
    didReceiveUpdate = false;
  } 
  ......

  // 这个 switch 是 beginWork中的核心逻辑，原有的代码量相当大
  switch (workInProgress.tag) {
    ......
    // 这里省略掉大量形如"case: xxx"的逻辑
    // 根节点将进入这个逻辑
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes)

    // dom 标签对应的节点将进入这个逻辑
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes)
      
    // 文本节点将进入这个逻辑
    case HostText:
      return updateHostText(current, workInProgress)
    ...... 
    // 这里省略掉大量形如"case: xxx"的逻辑
  }

  // 这里是错误兜底，处理 switch 匹配不上的情况
  {
    {
      throw Error(
        "Unknown unit of work tag (" +
          workInProgress.tag +
          "). This error is likely caused by a bug in React. Please file an issue."
      )
    }
  }
}

// A4 reconcileChildren具体实现
function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  // 判断 current 是否为 null
  if (current === null) {
    // 若 current 为 null，则进入 mountChildFibers 的逻辑
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
  } else {
    // 若 current 不为 null，则进入 reconcileChildFibers 的逻辑
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
  }
}

// ChildReconciler具体实现
function ChildReconciler(shouldTrackSideEffects) {
  // 删除节点的逻辑
  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) {
      // Noop.
      return;
    } 
    // 以下执行删除逻辑
  }
  ......
  // 单个节点的插入逻辑
  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.flags = Placement;
    }
    return newFiber;
  }

  // 插入节点的逻辑
  function placeChild(newFiber, lastPlacedIndex, newIndex) {
    newFiber.index = newIndex;
    if (!shouldTrackSideEffects) {
      // Noop.
      return lastPlacedIndex;
    }
    // 以下执行插入逻辑
  }
  ......
  // 此处省略一系列 updateXXX 的函数，它们用于处理 Fiber 节点的更新

  // 处理不止一个子节点的情况
  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
    ......
  }

  // 此处省略一堆 reconcileXXXXX 形式的函数，它们负责处理具体的 reconcile 逻辑
  function reconcileChildFibers(returnFiber, currentFirstChild, newChild, lanes) {
    // 这是一个逻辑分发器，它读取入参后，会经过一系列的条件判断，调用上方所定义的负责具体节点操作的函数
  }

  // 将总的 reconcileChildFibers 函数返回
  return reconcileChildFibers;
}




```









## 参考文档

01 [React 深入浅出第12章～第13章](/)