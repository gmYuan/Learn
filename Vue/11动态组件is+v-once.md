# 动态组件is+v-once

目录:

1 [预读文档](#1)

2 [为什么要引入 动态组件](#2)

3 [为什么要引入 v-once](#3)


## <span id="1">1 预读文档 </span>

1.1 [官方文档_ 动态组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html)

1.2 [官方文档_API_ v-once指令](https://cn.vuejs.org/v2/api/#v-once)

阅读原因: 直接参考文档

2 [动态组件is + v-once]()

阅读原因: 示例代码文件


## <span id="2">2 为什么要引入 动态组件 </span>

1 Q: 为什么要引入 动态组件，动态组件的常见使用场景有哪些

A1:
S1 在A组件中，可能需要切换显示 B/C组件， 这时候除了通过v-if+data实现，还可以使用:is动态组件


A2 动态组件的使用场景有:
S1 tab切换显示不同组件内容


以上具体代码，参见预读文档


## <span id="3">3 为什么要引入 v-once </span>

1 Q: 为什么要引入 v-once，使用场景有哪些

A1:
S1 当我们希望 元素/组件的内容，只渲染一次就不再变化后，就可以使用v-once

S2 虽然在组件中使用会提高性能，但是不建议经常使用它


A2:
S1 不会变化的 纯文本内容

