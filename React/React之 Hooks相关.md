# React之 Hooks相关

Q1 函数式组件 和 类组件 的区别
A：
  类组件：通过继承 React.Component声明的 React组件
  函数组件/无状态组件：以函数 声明的React组件

表面上，两者之间的区别有：
  - 类组件需要继承 class，函数组件不需要；
  - 类组件可以获取到 实例化后的this，而函数组件没有this；
  - 类组件可以访问生命周期方法，函数组件不能；
  - 类组件中可以定义并维护 state（状态），而函数组件不可以；

类组件的功能 “大而全”，函数式组件则 灵活轻量
更重要的区别是，函数式组件捕获了 组件渲染(render) 时 所传入的值，而类组件获取的 一直是最新的props值

```js
场景：当前user是A，点击按钮5s后显示user值，过程中user值变成了B

结果：
  class组件：5s后显示的值是B;
  function组件：5s后显示的值 还是A

原因：
  class组件内：组件渲染时传入A ==> 定时任务入队 ==> state变成B==> props值变成B ==> 定时器读取props
  function组件内：props传入A ==> 定时任务入队读取props.A ==> props变成B==> 页面渲染，但是定时任务读取的参数已经固定
```

-------
Q2 什么是React-Hooks，有哪些常用的 Hooks
A：
S1 通过 对函数式组件注入一些内置钩子，从而使函数式组件功能 更加通用
   
S2 常用的Hooks有：
  - useState: 为函数组件 引入状态；
  - useEffect(callBack, [])：为函数组件 引入副作用操作

-----
Q3 相对类组件，React-Hooks有哪些优点
A:
  - 不再依赖难以理解的 this；
  - 不再把所有副作用都写在同一个生命周期里，业务逻辑拆分更加合理
  - 自定义组件 使得组件复用更加容易

-----
Q4 hooks为什么不能在 循环/条件/嵌套函数中调用
A:
S1 首次渲染时，会按序创建hook链表：hook1.next --> hook2.next --> hook3.next .....
S2 更新state中的某个值，对比后存在差异
S3 触发页面重新渲染--> 按链表顺序把值返回给 useState的调用
S4 所以当 hook1/hook2不调用时，本来时hook1的更新值就会被hook3的state接收

![hooks要保持渲染顺序一致](https://gitee.com/ygming/blog-img/raw/master/img/hooks_3.png)

------
Q5 React-hooks的实现原理
A:
- Hooks的底层结构，是一个有序链表；
- Hooks的执行流程，同样分为 首次渲染和更新2个阶段，下面以useState为例

![首次渲染 流程](https://gitee.com/ygming/blog-img/raw/master/img/hooks_1.png)
![更新渲染 流程](https://gitee.com/ygming/blog-img/raw/master/img/hooks_2.png)
  
- 首次渲染 执行流程：useState() --> 调用resolveDispatcher返回dispatcher --> 调用dispatcher.useState --> 调用 mountState --> 返回目标数组( [state, useState] )
- 更新阶段 执行流程：useState() --> 调用resolveDispatcher返回dispatcher --> 调用dispatcher.useState --> 调用 updateState --> 调用updateReducer --> 返回目标数组( [state, useState] )

- mountState作用是：把新的hook对象加入到链表尾部 + 创建 hook.queue/hook.memoizedState/dispath
- updateState/updateReducer作用是：按序遍历之前的链表，取出对应数据进行渲染

具体代码见下
```js
// mounState逻辑
function mountState(initialState) {
  //S1  将 新的hook对象 追加进链表尾部
  var hook = mountWorkInProgressHook();
  // initialState 可以是一个回调，若是回调，则取回调执行后的值
  if (typeof initialState === 'function') {
    initialState = initialState();
  }
  // 创建 当前hook对象的更新队列，这一步主要是为了能够依序保留 dispatch
  const queue = hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  }
  // 将 initialState 作为一个“记忆值”存下来
  hook.memoizedState = hook.baseState = initialState;

  // dispatch 是由上下文中一个叫 dispatchAction 的方法创建的，这里不必纠结这个方法具体做了什么
  var dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue);

  // 返回目标数组，dispatch 其实就是示例中常常见到的 setXXX这个函数
  return [hook.memoizedState, dispatch]
}

// mountWorkInProgressHook源码
function mountWorkInProgressHook() {
  // 注意，单个 hook 是以对象的形式存在的
  var hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };

  if (workInProgressHook === null) {
    // 这行代码每个 React 版本不太一样，但做的都是同一件事：将 hook 作为链表的头节点处理
    firstWorkInProgressHook = workInProgressHook = hook;
  } else {
    // 若链表不为空，则将 hook 追加到链表尾部
    workInProgressHook = workInProgressHook.next = hook;
  }
  // 返回当前的 hook
  return workInProgressHook;
}
```

-----


## 参考文档

01 [深入浅出React-第06～08章](/)
