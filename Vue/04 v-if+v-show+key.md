# 样式绑定

目录:

1 [预读文档](#1)

2 [v-if使用方法](#2)

3 [key作用和使用](#3)

4 [v-if和v-show关系](#4)


## <span id="1">1 预读文档 </span>

1 [官方文档_ 条件渲染](https://cn.vuejs.org/v2/guide/conditional.html)

阅读原因: 直接参考文档


## <span id="2">2 v-if使用方法 </span>

1 Q: v-if使用方法

A:
S1 参见代码示例: 

[vue-if+v-show+key](https://github.com/gmYuan/my_learn/blob/master/Vue/code/04%20v-if%2Bv-show%2Bkey.html)


2 Q: v-if使用的注意点是什么

A:
S1 v-if要定义在块级元素上，否则会覆盖

S2 可以配合使用key, 重新渲染元素


## <span id="3">3 key作用和使用 </span>

1 Q: 为什么要引入key

A:
S1 Vue会尽可能的复用未改变的元素，以提高渲染的效率

S2 但是当输入框之类的表单信息被复用后，填入的信息就不会改变了

S3 key的作用就是 告诉vue，该元素每次都需要重新渲染，而不是复用上次渲染的结果


2 Q: 如何使用key

A:
S1 在不需要复用的组件部分，添加key属性即可

```html
<div>
  <h4>  key </h4>
  <div class="gram"> 语法: key="任意名称" </div>

  <div v-if="content === 'name'">
    <label>输入姓名:</label>
    <input type="text" placeholder="请输入姓名" key="name">
  </div>

  <div v-else-if="content === 'pwd'">
    <label>输入密码:</label>
    <input type="text" placeholder="请输入密码" key="password">
  </div>

  <input type="button" value="点击切换内容" @click="changetype">

</div>
```


## <span id="4">4 v-if和v-show关系 </span>

1 Q: v-if和v-show的区别是什么

A:
S1 v-if: 为flase时是直接从DOM结构中删除, 为true时会重新填写元素到DOM结构中

S2 v-show: 为false时相当于样式中增加了 `display: none`,元素只是不显示了，但仍然存在在DOM结构中

S3 v-show适合频繁切换显示/隐藏 的操作+初始性能消耗较大; v-if适合很少切换的场景