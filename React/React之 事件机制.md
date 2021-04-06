# React之 事件机制

## 事件机制

Q1: React的事件机制是什么

A
S1 React通过 JS对象 --> 事件监听 --> 合成事件层(synthetic Event)，来模拟实现了DOM事件
  
S2  React事件 抹平了 浏览器事件的 兼容性差异

实现步骤为：

S1 事件委派
  - 组件最外层--> 事件监听处理中心--> 管理内部 每个元素的监听事件 和 处理回调

S2 绑定this
  - bind(this,xxx)
  - 箭头函数

Q2：React的事件机制 和 DOM原生事件的区别

A：
  - 事件阶段不同：
    原生事件分为 事件捕获-目标元素-事件冒泡的阶段，而React的事件只实现了捕获阶段，原因是
    IE9以下不支持 捕获阶段，且React阻止冒泡抹平了IE9的语法差异，只需使用e.preventDefault()

  - 实现的事件类型 不同：React事件是 DOM原生事件的子类型，未实现 resize/window等事件 
  - 事件回调的 绑定方式不同：原生DOM可以通过addEventListener()等来绑定，React只能通过onXXX
  - 事件对象不同：低版本IE要通过window.event获取事件对象，而React事件通过event即可


## 受控组件 与 非受控组件

Q1：什么是受控组件 和 非受控组件，有什么区别

A：

  - 受控组件：通过state/props 控制组件value 的表单，称为 受控组件
  - 非受控组件：没有 value props，一般通过 操作DOM来设置表单值，称为 非受控组件

区别
  - 受控组件一般有 porps --> onChange --> setState --> render这一套流程，非受控组件 则没有
  - 受控组件 是数据驱动，非受控组件则需要手动操作DOM


## 参考文档

01 [深入React技术栈](/)
02 [React官方文档- 表单](https://zh-hans.reactjs.org/docs/forms.html)