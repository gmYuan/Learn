# Vue之 模板编译详解

### 目录

1 [预读文档](#1)

2 [模板编译 流程](#2)

3 [parse 流程](#3)


## <span id="1">一 预读文档 </span>

01 [深入浅出Vue 第8~11章](/)

阅读原因: 直接参考文档


## <span id="2"> 二 模板编译 流程 </span>

Q1: 模板编译 的流程 是什么

A:

- S1 parse(解析): 把template 转化为 AST

- S2 optimize(优化): 遍历AST，标记其中的 静态节点, 从而避免重新渲染

- S3 generate(生成): AST 转化为 代码字符串, 传入到render()中，从而生成 vnode


综上过程如图示：

![compile过程](https://s1.ax1x.com/2020/04/15/JiQl6O.md.png)


## <span id="3"> 三 parse 流程 </span>

Q1 什么是 AST

A:

- S1 用JS对象描述 节点, 对象的属性 表示节点中的 各种数据

- S2 节点之间通过 parent + children属性，形成一个树;

- S3 这样一个 `用对象描述的 节点树` 就是 AST

```js
// Vue模板内容
<div>
  <p>{{name}}</p>
</div>


//转化的 AST近似为

{
  tag: 'div',
  type: 1,
  static: false,
  attrsList: [],

  parent: undefined,
  children: [
    {
      tag: 'p',
      type: 1,
      static: false,
      attrsList: [],

      parent: {tag: 'div', ......}
      children: [{
        type: 2,
        static: false,

        text: "{{name}}",
        expression: "_s(name)"
      }]
    }

  ]
}
```

Q2 HTML解析器是什么，有什么作用

A:

- S1 解析HTML模板，过程中会触发钩子函数

- S2 在钩子函数中 创建 不同类型的 AST节点

- S3 创建 AST节点的 层级关系： 记录栈


```js
// HTML解析器的 流程示意代码
function cneateASTElement (tag, attrs, parent) {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    parent,

    children:[]
  }
}

// S1 + S2
parseHTML(template, {
  
  // A1 解析到 开始标签时，就会触发 => 创建 元素类型的节点 + 推入层次记录栈
  start(tag, attrs, unary) {  // 参数分别是 标签名称/标签属性/是否是 自闭合标签
    .....
    let element = createASTElement(tag, attrs, cunrentParent)
  }

  // A2 解析到 结束标签时，就会触发 => 弹出 层次记录栈
  end() {  
    .....
  }

  // A3 解析到 文本时，就会触发 => 构建 文本类型的节点
  chars(text) {
    .....
    let element = {type: 3, text}
  }

  // A4 解析到 注释时，就会触发 => 构建 注释类型的节点
  comment(text) {
    .....
    let element = {type: 3, text, isComment: true}
  }

})

// S3 创建 AST节点间的层次结构
<div>
  <hl> xxx </hl>
  <p> yyyy </p>
</div>

  stack               AST                        备注
  []               创建 div
  [div]            div => 创建h1               开始标签1：入栈div
  [div, h1]        div => h1 => 创建文本1       开始标签2：入栈h1
  [div]            div => h1 => 文本1          结束标签2：出栈h1

  [div, p]         div => h1 => 文本1          开始标签3：入栈p
                       => 创建p

  [div, p]         div => h1 => 文本1          开始标签3：入栈p
                       => p  => 创建文本2

  [div]            div => h1 => 文本1          结束标签3：出栈p
                       => p  => 文本2

  []               div => h1 => 文本1          结束标签1：出栈div
                       => p  => 文本2


空栈状态下: 入栈的第一个节点 是根节点

非空栈状态下: 当前栈的最后一个节点是 入栈节点的 父节点
```