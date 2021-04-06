# React之 虚拟DOM

Q1 什么是 虚拟DOM
Q2 虚拟DOM 有什么作用，为什么要使用它
Q3 如何实现 虚拟DOM
Q4 虚拟DOM的优点有哪些，缺点有哪些，如何优化 缺点


Q5 为什么 ReactNode 有多种类型？


--------------------------
Q1 什么是 虚拟DOM
A：
  - 一些特殊的JS对象，这些对象用来模拟表示不同类型的 DOM元素，所以称为 虚拟DOM
  - 一般一个虚拟DOM 具有这些属性：tagName/ properties/ children/ key
  - 在React中，把表示DOM元素的 对象也叫做 节点(ReactNode)

```js
{
  tagName: 'div',   // 标签名称
  properties: {      // 属性
    style: {}
  },
  children: [],       // 子节点
  key: 1，            // 唯一标识
}
```
-----------------------------
react中有多种节点类型
```ts
type ReactNodeList = ReactNode | ReactEmpty

type ReactEmpty = null | undefined | boolean
type ReactNode = ReactElement | ReactFragment | ReactText

type ReactElement = ReactComponentElement | ReactDOMElement
type ReactFragment = Array<ReactNode | ReactEmpty>
type ReactText = string | number

type ReactDOMElement = { 
  type : string, 
  props : {
    children : ReactNodeList
    className : string, 
    ...
  }
  key : string boolean | number | null, 
  ref : string | null
}

type ReactComponentElement<TProps> = { 
  type : ReactClass<TProps>
  props : TProps, 
  key : string boolean | number | null, 
  ref : string | null
}
```

--------------------------
React构建过程

JSX ==> React.createElement







## 参考文档

01 [深入React技术栈](/)
02 [React官方文档- 性能优化](https://zh-hans.reactjs.org/docs/optimizing-performance.html#examples)