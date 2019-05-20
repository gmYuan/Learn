# is + ref 特性

目录:

1 [预读文档](#1)

2 [is特性](#2)

3 [ref特性](#3)



## <span id="1">1 预读文档 </span>

1.1 [官方文档_ 组件基础](https://cn.vuejs.org/v2/guide/components.html)

1.2 [官方文档_ API](https://cn.vuejs.org/v2/api/#ref)

阅读原因: 直接参考文档

2 [code_ is+ref特性](https://github.com/gmYuan/my_learn/blob/master/Vue/code/06%20is%2Bref%E7%89%B9%E6%80%A7.html)

阅读原因: 示例代码文件


## <span id="2">2 is特性 </span>

1 Q: 为什么要引入 is特性

A:
S1 有些html元素(如 table/select/ul)，严格规定了其内部元素，这就会导致自定义组件在其内部渲染会有问题

S2 当组件之间需要进行动态 Tab切换时,也需要使用is特性


2 Q: 如何使用 is特性

A:
S1 举例代码:

```html
<table border="1">
  <tbody>
    <tr is="my-row"></tr>
    <tr is="my-row"></tr>
  </tbody>
</table>
```


## <span id="3">3 ref特性 </span>

1 Q: 为什么要引入 ref特性

A:
S1 ref特性可以用来获取 某个DOM元素/子组件实例，从而可以获取DOM元素/组件的相关信息数据

S2 相关引用信息 将会注册在父组件的 $refs对象上

S3 需要注意的是，ref不是响应式的，所以不能在模板/计算属性中使用它


2 Q: 如何使用 ref特性

A:
S1 定义子组件相关信息，在父组件中使用子组件: `<one-num @change-num="getNum" ref="one"></one-num>`

S2 子组件实例的ref信息，都可在父组件的 $refs中读取到，从而获取该子组件的所有信息

具体代码，可参考 [is+ref特性— 例2](https://github.com/gmYuan/my_learn/blob/master/Vue/code/06%20is%2Bref%E7%89%B9%E6%80%A7.html)