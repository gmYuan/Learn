# React之 JSX

Q1 JSX本质是什么
A：
  - JSX 用来创建 React元素
  - JSX的本质是 React.createElement()的语法糖
  - 使用JSX的原因是，直接使用 React.createElement()不便于读写，而JSX结构层次更加清晰

```js
//JSX
<ul className="list">
  <li key="1">1</li>
  <li key="2">2</li>
</ul>

// 编译后的结果
React.createElement('ul', {
  className: 'list'
}, 
React.createElement('li', { key: '1' }, 1),
React.createElement('li', { key: '2' }, 2)
)
```
-----

Q2 React.createElement(type, config, children)做了什么
A：
  - 数据格式的 转化层/适配器，把传入的数据参数经过封装后，返回一个ReactElement对象

具体的细节内容，大致有以下几步
  - 创建 key/ref/self/source值：从config对象中 依次读取 key/ref/self/source

  - 创建 props对象属性值：       筛选config中的某些属性，作为props内的属性
  - 创建props.children属性值：  根据 children长度，构造出 children Array/对象
  - 创建defaultProps值：          根据 是否有defaultProps，赋值 props内的属性值

  - 返回一个ReactElement对象： 传入参数(type, key, ref, self, source, ReactCurrentOwner.current, props)

用图表示为
![React.createElement流程图](https://gitee.com/ygming/blog-img/raw/master/img/createElement.png)

![React.createElement作用示意](https://gitee.com/ygming/blog-img/raw/master/img/createElement2.png)


具体源码为
```js
export function createElement(type, config, children) {
  // propName 变量 用于储存后面需要用到的元素属性名
  let propName; 
  // props 变量用于储存元素属性的键值对集合
  const props = {}; 
  // key、ref、self、source 均为 React 元素的属性，此处不必深究
  let key = null;
  let ref = null; 
  let self = null; 
  let source = null; 

  // config 对象中存储的是元素的属性
  if (config != null) { 
    //S1  进来之后做的第一件事，是依次对 ref、key、self 和 source 属性赋值
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    // 此处将 key 值字符串化
    if (hasValidKey(config)) {
      key = '' + config.key; 
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    //S2 接着就是要把 config 里面的属性都一个一个挪到 props 这个之前声明好的对象里面
    for (propName in config) {
      if (
        // 筛选出可以提进 props 对象里的属性
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName) 
      ) {
        props[propName] = config[propName]; 
      }
    }
  }
  //S3 childrenLength 指的是当前元素的子元素的个数，减去的 2 是 type 和 config 两个参数占用的长度
  const childrenLength = arguments.length - 2; 
  // 如果抛去type和config，就只剩下一个参数，一般意味着文本节点出现了
  if (childrenLength === 1) { 
    // 直接把这个参数的值赋给props.children
    props.children = children; 
    // 处理嵌套多个子元素的情况
  } else if (childrenLength > 1) { 
    // 声明一个子元素数组
    const childArray = Array(childrenLength); 
    // 把子元素推进数组里
    for (let i = 0; i < childrenLength; i++) { 
      childArray[i] = arguments[i + 2];
    }
    // 最后把这个数组赋值给props.children
    props.children = childArray; 
  } 

  //S4 处理 defaultProps
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) { 
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  //S5 最后返回 一个ReactElement对象，传入刚才处理过的参数
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
```
-----

Q3 ReactElement(type, key, ref, self, source, props)做了什么
A: 
  - 根据传入参数，返回了一个 JS对象而已
  - 该对象是一个 "树结构"对象， 其children属性值 是含有同样属性的JS对象
  - 通过这个JS对象，可以模拟表示 一个DOM节点

所以，JSX的工作流程是：
  JSX ==> React.createElement(type, config, children) ==> ReactElement(type..) ==> {xxx: yyy}

```js
const AppJSX = (<div className="App">
  <h1 className="title">I am the title</h1>
  <p className="content">I am the content</p>
</div>)

console.log(AppJSX)
```
其结果为
![ReactElement流程图](https://gitee.com/ygming/blog-img/raw/master/img/reactElement.png)


具体源码为
```js
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // REACT_ELEMENT_TYPE是一个常量，用来标识该对象是一个ReactElement
    $$typeof: REACT_ELEMENT_TYPE,

    // 内置属性赋值
    type: type,
    key: key,
    ref: ref,
    props: props,
    // 记录创造该元素的组件
    _owner: owner,
  };

  // 这里是一些针对 __DEV__ 环境下的处理.....
  if (__DEV__) {
    ......
  }
  return element
}
```



## 参考文档

01 [深入浅出React-第01章](/)
