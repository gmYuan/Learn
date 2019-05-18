# Vue的生命周期

目录:

1 [预读文档](#1)

2 [什么是 Vue的生命周期](#2)



## <span id="1">1 预读文档 </span>

1 [图示Vue生命周期](https://segmentfault.com/a/1190000008010666)

阅读原因: 代码实例举例，浅显易懂


## <span id="2">2 什么是 Vue的生命周期 </span>

1 Q: 什么是 Vue的生命周期

A:
S1 每个vue实例/组件，从产生到销毁的时间和对应的状态，就是生命周期，一般可以分为 创建—挂载—更新—销毁 4个阶段


2 Q: Vue的生命周期一般有哪几个阶段

A:
S1 `beforeCreate`: 组件还未进行任何操作，view和model均未监测

S1.2 Vue内部之后 完成对数据的监测操作(observer Data) +  初始化vue的内部事件(init event)


S2 `created`: 完成了对data的监测，但还未对View的el进行监测

S2.1 在此阶段，可以进行AJAX请求相关操作，因为此时已经完成了对Model层的监测 + 未监测View层，数据和视图隔离了相对纯净

S2.2 Vue内部之后 把 template和数据 渲染成 html内容


S3 `beforeMount`: 初始化 挂载的DOM元素，此时$el已存在，但内部还是占位符内容

S3.1 Vue内部之后 把转化生成的HTML内容，真正渲染到页面上


S4 `mounted`: 此时页面已生成HTML内容，可以访问DOM中各个元素

S4.1 在此阶段，可以进行DOM相关操作，因为此时DOM内容已经都生成了


S5 `beforeUpdate`: 当数据发生改变前，提供控制钩子

S5.1 此处获取的数据是更新后的数据，但是获取页面中的DOM元素是更新之前的


S6 `updated`: 当数据变化完成后，提供控制钩子

S6.1 组件的 数据和DOM都被更新，所以可以执行依赖于DOM的操作


S7 `beforeDestory`: 组件被销毁之前 提供控制钩子，此时实例仍然 完全可用

S8 `destory`: 组件销毁的控制钩子，清除所有对vue实例的操作

具体示例代码，参见: [Vue生命周期示例](https://github.com/gmYuan/my_learn/blob/master/Vue/code/01%20Vue%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.html)