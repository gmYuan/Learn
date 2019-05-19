# 样式绑定

目录:

1 [预读文档](#1)

2 [v-for基本使用方法](#2)

3 [v-for + key使用](#3)

4 [v-for的更新与监测](#4)


## <span id="1">1 预读文档 </span>

1 [官方文档_ 列表渲染](https://cn.vuejs.org/v2/guide/list.html)

阅读原因: 直接参考文档

2 [code_ v-for指令](https://github.com/gmYuan/my_learn/blob/master/Vue/code/05%20v-for%E6%8C%87%E4%BB%A4.html)

阅读原因: 示例代码文件


## <span id="2">2 v-for基本使用方法 </span>

1 Q: 如何使用v-for

A:
S1 参见代码示例:

[vue-for指令](https://github.com/gmYuan/my_learn/blob/master/Vue/code/05%20v-for%E6%8C%87%E4%BB%A4.html)


## <span id="3">3 v-for + key使用 </span>

1 Q: 为什么要在使用v-for时，同时使用key

A:
S1 Vue会尽可能的复用未改变的元素，以提高渲染的效率 (虚拟DOM的一个特点)

S1.2 当列表被渲染后，如果不绑定key属性，就默认复用，这样当数组内数据的值/位置 发生变化时，页面上显示并不会随之改变

S3.1 key的作用就是 告诉vue，该元素每次都需要重新渲染，而不是复用上次渲染的结果

S3.2 实际开发中，一般会把key和后台返回数据中的数据库id相绑定


2 Q: 如何使用v-for + key

A:
S1 在不需要复用的组件部分，添加key属性即可

```html
<div>
  <h4> v-for 数据重用和重新排序 </h4>

  <ul>
    <li
      v-for="item of person"
      :key="item.id"
    >
      {{item.name}}--{{item.age}}
    </li>
  </ul>
</div>
```


## <span id="4">4 v-for的更新与监测 </span>

1 Q: v-for不能检测哪些变化,如何解决它

A:
S1 直接通过下标修改数组值，不会检测数据修改

S2 直接通过length修改数组长度，vue不会检测修改


S3 解决方法是: vue.set / splice方法，具体代码参见 [v-for 例5](https://github.com/gmYuan/my_learn/blob/master/Vue/code/05%20v-for%E6%8C%87%E4%BB%A4.html)


2 v-for还有哪些使用方法:

A:
S1 v-for + 计算属性/方法 (结果返回的是 过滤/排序数组)

S2 一段范围的整数取值

S3 v-for + `<template>占位元素`

S4 组件的 v-for使用

具体代码示例，可以参考官方文档