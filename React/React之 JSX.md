# React之 JSX

Q1 JSX是什么


--------------------------
Q1 JSX本质是什么
A：
  - JSX 用来创建 React元素
  - JSX的本质是 React.createElement()的语法糖么
  - 使用JSX的原因是，直接使用 React.createElement()不便于读写，而JSX结构更加清晰

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