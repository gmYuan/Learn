# Vue之 虚拟DOM详解

### 目录

1 [预读文档](#1)

2 [虚拟DOM介绍](#2)

3 [Vnode 相关](#3)

4 [patch 辅助函数介绍](#4)

5 [patch 实现流程](#5)


## <span id="1">一 预读文档 </span>

01 [深入浅出Vue 第5章~第7章](/)

02 [Diff - 源码版之 Diff流程](https://juejin.im/post/5da12cb55188251572680204)

03 [数据状态更新时的差异 diff 及 patch 机制](https://juejin.im/book/5a36661851882538e2259c0f/section/5a3bb17ff265da432529796a)

阅读原因: 直接参考文档

04 [深入剖析：Vue核心之虚拟DOM](https://juejin.im/post/5d36cc575188257aea108a74)

阅读原因: 后备阅读文档，好像很详细的样子


## <span id="2"> 二 虚拟DOM介绍 </span>

Q1: 什么是 虚拟DOM

A:

S1 由多个vnode 构成的`虚拟节点树`;

S2 根据 虚拟节点树， 可以渲染出DOM结构 和 页面内容;

S3 当状态值发生变化时， 就先对比 `新旧 虚拟节点树`, 只渲染不同的部分 即可


Q2 为什么要引入 虚拟DOM

A:

S1 虚拟DOM 可以通过对比 `新旧 虚拟节点树`，最大程度的 减少对DOM的修改

Q3 虚拟DOM的执行流程是什么

A:

S1 状态数据  --(使用在)--> Vue模板  --(编译生成)--> render函数  --(执行生成)--> 虚拟节点树(Vnode)

S2 vnode -->  newVnode和oldVnode进行 Diff对比(即`patch过程`) -- (create)--> 真实DOM -> 生成视图

![8LZxw4.md.png](https://s1.ax1x.com/2020/03/24/8LZxw4.md.png)


## <span id="3"> 三 Vnode 相关 </span>

Q1: 什么是 Vnode

A:

S1 Vnode是 节点描述对象，`本质上是一个对象`，可以通过这个对象 来描述如何创建 真是DOM节点

S2 可以通过 Vnode类，创建`不同类型的 vnode实例`， 这些类型对应 真实DOM的 节点类型

```js
class Vnode{
  constructor(tag, data, children, text, elm ....) {
    this.tag = tag                     // vnode 节点类型
    this.data = data                   // vnode 节点属性值
    this.children = this.children      // vnode 子节点
    this.text = text                   // vnode 文本内容
    this.elm = this.elm                // vnode 对应的 真实DOM元素
    .....
    .....
  }
}
```

S3 Vnode节点的作用: 可以通过对比 新旧Vnode节点内容， 只更新变化内容的 DOM结构


Q2: Vnode的类型有哪些

A:

S1 `注释节点`：有效属性为 text + isComment

```js
// 使用示例
<!-- 注释节点 -- >

// 代码实现
function createEmptyVnode(text) {
  const node = new Vode()
  node.text = text
  node.isComment = true
  return node
}

{text: '注释节点', isComment: true}
```

S2 文本节点： 有效属性为 text

```js
// 代码实现
function createTextVnode(val) {
  const node = new Vode()
  node.text = text
  return node
}

{text: '文本节点'}
```

S3 元素节点： 有效属性为 tag(节点名称) + data(节点数据) + children + context(当前组件的Vue实例)

```js
<template>
  <span class="demo" v-show="isShow">
    This is a span.
  </span>
</template>

{
  tag: 'span',
  data: {
    /* 指令集合数组 */
    directives: [
      {
        /* v-show指令 */
        rawName: 'v-show',
        expression: 'isShow',
        name: 'show',
        value: true
      }
    ],

    /* 静态class */
    staticClass: 'demo'
  },

  text: undefined,

  children: [
    /* 子节点是一个文本VNode节点 */
    {
      tag: undefined,
      data: undefined,
      text: 'This is a span.',
      children: undefined
    }
  ]
}
```

S4 克隆节点： 有效属性为 isCloned, 其他属性同 被克隆节点即可

> 主要作用是 优化静态节点 和 插槽节点(slot node)

```js

// 代码实现
function cloneVnode(vnode, deep) {
  const cloned = new Vue(vnode.tag, vnode.data, vnode.children .....)
  ......
  cloned.isComment = vnode.isComment
  cloned.isCloned = true
  if (deep && vnode.children) {
    cloned.children = cloneVNodes(vnode.children)
  }
  return cloned
}
```


## <span id="4"> 4 patch 辅助函数介绍 </span>

DOM操作 相关

```js
//S1 insert: 插入节点
function insert(parent, elm, ref) {
  if (parent) {
    // S1.1 有参考兄弟节点，插在兄弟节点 前面
    if (ref) {
      if (ref.parentNode === parent) {
        parent.insertBefore(elm, ref)
      }
    // S1.2 没有参考兄弟节点，直接插入父节点的 子节点末尾  
    } else {
      parent.appendChild(elm);
    }
  }
}

//S2 创建节点
function createElm(vnode, parentElm, refElm) {  
  var children = vnode.children
  var tag = vnode.tag

  // S2.1 tag属性: 创建元素节点 + 遍历&递归 创建子元素节点 + 插入节点
  if (tag) {
    vnode.elm = document.createElement(tag)
  
    //遍历&递归 创建子元素节点
    createChildren(vnode, children)

    //插入 DOM节点
    insert(parentElm, vnode.elm, refElm)

  // S2.2 无tag属性: 创建文本节点
  } else {
    vnode.elm = document.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}

//S3 创建子元素节点
function createChildren(vnode, children) {

  //S3.1 如果子节点是数组，则遍历执行 createElm 逐个处理
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; ++i) {
      createElm(children[i], vnode.elm, null);
    }

  //S3.2 如果子节点的 text属性有数据，表示这个vnode 是个文本节点
  } else if ( typeof vnode.text=== 'string' ||
    typeof vnode.text=== 'number' || typeof vnode.text=== 'boolean') {
  
    vnode.elm.appendChild( document.createTextNode(vnode.text) )
  }
}

// S4 批量新增节点
function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    createElm(vnodes[startIdx], parentElm, refElm);
  }
}

// S5 批量删除节点
function removeVnodes(vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (isDef(ch)) {
      removeNode(ch.elm)  // 跨平台的 删除单个节点，parent.removeChild(child)
    }
  }
}
```

服务Diff工具函数

```js
// S1 生成 key与index索引 对应的 一个map表
function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i, key
  var map = {}

  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (key) {
      map[key] = i;
    }
  }
  return map
}

// 使用示例
[
  {tag:"div",  key: "key_1"},
  {tag:"strong", key:"key_2"},
  {tag:"span",  key:"key_4"}
]
// 转化为
{
  "key_1":0,
  "key_2":1,
  "key_4":2
}

//S1.2 作用是：判断 新子节点数组中的某个newVnode 是否和 旧子节点数组中某个vnode相同


//S2 sameVnode: 判断两个节点 是否相同
function sameVnode(a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    !!a.data === !!b.data &&
    sameInputType(a, b)
  )
}

function sameInputType(a, b) {
  if (a.tag !== 'input') return true
  var i;
  var types = ['text','number','password','search','email','tel','url']
  var typeA = (i = a.data) && (i = i.attrs) && i.type
  var typeB = (i = b.data) && (i = i.attrs) && i.type

  // input 的类型一样，或者都属于基本input类型
  return (
    typeA === typeB ||
    types.indexOf(typeA)>-1 &&
    types.indexOf(typeB)>-1
  )
}
```


## <span id="5"> 5 patch 实现流程 </span>


Q1: 什么是 patch

A: 通过对比 新旧vnode，对DOM节点进行 `新增/删除/更新操作`，从而 把vnode树 渲染成真实DOM


Q2: patch整体流程是 什么

A:

![GVQa9S.md.png](https://s1.ax1x.com/2020/03/29/GVQa9S.md.png)

![GVQE01.md.png](https://s1.ax1x.com/2020/03/29/GVQE01.md.png)

```
S1 new Vue() => new Watcher(cb)
  cb => vm._update(vnode) + vnode = vm._render()生成
  vm_update => vm__patch__(oldVnode, vnode, parentElm, refElm)

S2 patch(oldVnode, vnode, parentElm, refElm): 判断是否是 sameVnode
  S2.1 同层对比，复杂度为 O(n) + 修改的是真实DOM
  S2.2 无oldVnode: 新增节点 createElm
  S2.3 有oldVnode: 是sameVnode => patchVnode / 不是sameVnode: createElm新节点 + removeVnodes旧节点


S3 patchVonde(oldVnode, vnode)：判断vnode具体类型
  S3.1 判断vnode === oldVnode: T则 return
  S3.2 判断vnode 和 oldVnode是否是 静态节点: T则直接return
  S3.3 判断vode 是否是 文本节点(有text属性)， T则用setTextContent替换真实DOM节点内容

  S3.4 无text属性说明是一个元素节点，分类讨论：
    S3.4.1 vnode和oldVnode都有子节点：子节点不相同时，则 updateChildren;
    S3.4.2 只有vnode有子节点(oldVnode无Children)：清除oldVnode的文本内容(如果是文本节点) + 把Vnode子节点加入到Dom中;
    S3.4.3 只有oldVnode有子节点(vnode无子节点): 清除文本内容(文本节点) + 清除DOM子节点


S4 updateChildren(parentElm, oldCh, newCh)流程: 循环遍历逐个比较 新子节点和旧子节点
  S4.1 分别对 新旧vnode 设置 首尾Idx
  S4.2 while循环: 4个 Idx会 向中间靠拢
  S4.3 首尾头 逐对组合 进行对比

  S4.4 单个新子节点 在 旧子节点数组中 查找位置
    S4.4.1 生成旧子节点数组以 vnode.key 为key 的 map 表
    S4.4.2 拿到新子节点数组中 一个子项，判断它的key 是否在上面的map中
    S4.4.3 不存在，则新建DOM
    S4.4.4 存在，继续判断是否 sameVnode

  S4.5 处理剩余的 新子节点/旧子节点
```

代码表示为:

```js

/*  S1 new Vue() => new Watcher(cb)
    cb => vm._update(vnode) + vnode = vm._render()生成
    vm_update => vm__patch__(oldVnode, vnode, parentElm, refElm)
*/

function Vue() {
  ......

  new Watcher(function() {
    vm._update(vm._render())  //Watcher绑定的回调，在页面更新时 会被调用
  })
  ......
}

// vm.patch: 旧Vnode树 和 vm._render生成的新Vnode树 比较
Vue.prototype._update = function(vnode) {  
  var vm = this
  var prevEl = vm.$el
  var prevVnode = vm._vnode
  vm._vnode = vnode   //保存 当前和上一次的 vnode对象结果

  if (!prevVnode) {
    //vm.el 保存的是DOM节点
    vm.$el = vm.__patch__(
      vm.$el, vnode,
      vm.$options._parentElm,
      vm.$options._refElm
    )
  } else {
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
}

/* S2 patch流程:
  S2.1 无oldVnode: 新增节点 addVnodes
  S2.2 有oldVnode: 是sameVnode => patchVnode + 不是sameVnode: createElm新节点 + removeVnodes旧节点
*/
function createPatchFunction() {  
  return function patch(oldVnode, vnode, parentElm, refElm) {

    // 没有旧节点，直接生成新节点
    if (!oldVnode) {
      addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
    } else {

      // 是一样 Vnode
      if (sameVnode(oldVnode, vnode)) {
        // 比较存在的根节点
        patchVnode(oldVnode, vnode)
      } else {
        // 销毁旧节点
        removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1)
        // 创建新节点
        addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
      }
    }
    return vnode.elm
  }
}

/* S3 patchVnode流程:
  S3.1 判断vnode === oldVnode: T则 return
  S3.2 判断vnode 和 oldVnode是否是 静态节点: T则直接return
  S3.3 判断vode 是否是 文本节点(有text属性)， T则用setTextContent替换真实DOM节点内容

  S3.4 无text属性说明是一个元素节点，分类讨论：
    S3.4.1 vnode和oldVnode都有子节点：子节点不相同时，则 updateChildren;
    S3.4.2 只有vnode有子节点(oldVnode无Children)：清除oldVnode的文本内容(如果是文本节点) + 把Vnode子节点加入到Dom中;
    S3.4.3 只有oldVnode有子节点(vnode无子节点): 清除文本内容(文本节点) + 清除DOM子节点
*/

function patchVnode (oldVnode, vnode) {
  if (oldVnode === vnode) {return;}

  if (vnode.isStatic && oldVnode.isStatic && vnode.key === oldVnode.key) {
    vnode.elm = oldVnode.elm;
    vnode.componentInstance = oldVnode.componentInstance;
    return;
  }

  const elm = vnode.elm = oldVnode.elm;
  const oldCh = oldVnode.children;
  const ch = vnode.children;

  if (vnode.text) {
    nodeOps.setTextContent(elm, vnode.text);

  } else {  // 节点类型是 属性节点

    if (oldCh && ch && (oldCh !== ch)) {
      updateChildren(elm, oldCh, ch);

    } else if (ch) {
      if (oldVnode.text) nodeOps.setTextContent(elm, '');
      addVnodes(elm, null, ch, 0, ch.length - 1);
    } else if (oldCh) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    } else if (oldVnode.text) {
      nodeOps.setTextContent(elm, '')
    }
  }
}

/* S4 updateChildren流程: 循环遍历逐个比较 新子节点和旧子节点
   S4.1 分别对 新旧vnode 设置 首尾Idx
   S4.2 while循环: 4个 Idx会 向中间靠拢
   S4.3 首尾头 逐对组合 进行对比

   S4.4 单个新子节点 在 旧子节点数组中 查找位置
    S4.4.1 生成旧子节点数组以 vnode.key 为key 的 map 表
    S4.4.2 拿到新子节点数组中 一个子项，判断它的key 是否在上面的map中
    S4.4.3 不存在，则新建DOM
    S4.4.4 存在，继续判断是否 sameVnode

  S4.5 处理剩余的 新子节点/旧子节点
*/

function updateChildren (parentElm, oldCh, newCh) {
  let oldStartIdx = 0
  let oldEndIdx = oldCh.length - 1

  let newStartIdx = 0
  let newEndIdx = newCh.length - 1
  
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]

  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]

  let oldKeyToIdx, idxInOld, elmToMove, refElm
  // S4.2
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {

    if (!oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (!oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIdx]

    //S4.3 新头 和 旧头 比较
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 继续处理这两个相同节点的子节点，或者更新文本
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]

    // 新尾 和 旧尾 比较
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]

    // 新尾 和  旧头 比较
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode)
  
      // oldStartVnode 放到 oldEndVnode后面的节点
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]

    // 新头 和 旧尾 比较
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode)

      // 把 oldEndVnode DOM 放到 当前oldStartVnode.elm的前面
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]

    //S4.4 单个新子节点 在 旧子节点数组中 查找位置
    } else {
      // oldKeyToIdx是一个 把Vnode的key和index转换的 map
      if (!oldKeyToIdx) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      }
      // 使用 newStartVnode 去 OldMap 中寻找 相同节点，默认key存在
      idxInOld = oldKeyToIdx[newStartVnode.key]

      if (!idxInOld) {
        //新孩子中，存在一个新节点: 把newStartVnode插入oldStartVnode的前面
        createElm(newStartVnode, parentElm,oldStartVnode.elm)
        newStartVnode = newCh[++newStartIdx]

      //找到 oldCh 中 和 newStartVnode 一样的节点
      } else {
        elmToMove = oldCh[idxInOld]
        if (sameVnode(elmToMove, newStartVnode)) {

          patchVnode(elmToMove, newStartVnode)
          oldCh[idxInOld] = undefined  // 删除这个 index

          // 把 vnodeToMove 移动到  oldStartVnode前面
          parentElm.insertBefore(vnodeToMove.elm,  oldStartVnode.elm)
          newStartVnode = newCh[++newStartIdx]

        // same key but different element. treat as new element
        } else {
          createElm(newStartVnode, parentElm, oldStartVnode.elm)
          newStartVnode = newCh[++newStartIdx]
        }
      }

    }
  }

  // S5 旧子节点遍历完毕，新子节点可能有剩
  if (oldStartIdx > oldEndIdx) {
    refElm = (newCh[newEndIdx + 1]) ? newCh[newEndIdx + 1].elm : null
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx)

  // 说明新节点比对完了，老节点可能还有，需要删除剩余的老节点
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
  }
}
```

