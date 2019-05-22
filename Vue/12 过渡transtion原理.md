# 过渡transtion原理

目录:

1 [预读文档](#1)

2 [为什么要引入 过渡效果transtion](#2)

3 [过渡效果的 实现原理是什么](#3)


## <span id="1">1 预读文档 </span>

1 [官方文档_ 进入/离开&列表过渡](https://cn.vuejs.org/v2/guide/transitions.html)

阅读原因: 直接参考文档

2 [过渡transtion原理](https://github.com/gmYuan/my_learn/blob/master/Vue/code/12%20%E8%BF%87%E6%B8%A1transtion%E5%8E%9F%E7%90%86.html)

阅读原因: 示例代码文件


## <span id="2">2 为什么要引入 过渡效果transtion </span>

1 Q: 为什么要引入 过渡效果transtion，动态组件的常见使用场景有哪些

A1:
S1 为了实现Vue内部组件/元素的 动画效果


A2 过渡效果的使用场景有:
S1 内容的显示和隐藏切换 动效:  v-if / v-show / 动态组件


## <span id="3">3 过渡效果的 实现原理是什么 </span>

1 Q: 过渡效果的 实现原理是什么

A1:
S1 transtion组件包裹了 要添加过渡效果的元素/组件内容

S2 定义进入过渡的时间段 及其效果:

&emsp;&emsp;S2.1 进入过渡的开始状态: 添加 v-enter + v-enter-active类

&emsp;&emsp;S2.2 进入过渡时的状态(第2帧效果): 添加 v-enter-to + v-enter-active类, 去除v-enter

&emsp;&emsp;S2.3 进入过渡的结束状态(最后1帧效果): 去除 v-enter-to + v-enter-active类

S3 定义结束过渡的时间段 及其效果:

&emsp;&emsp;S3.1 结束过渡的开始状态: 添加 v-leave + v-leave-active类

&emsp;&emsp;S3.2 结束过渡时的状态(第2帧效果): 添加 v-leave-to + v-leave-active类, 去除v-leave

&emsp;&emsp;S3.3 结束过渡的结束状态(最后1帧效果): 去除 v-leave-to + v-leave-active类


S4 可以简单理解为: `leave是从显示到隐藏的过程动画，enter是从隐藏到显示的过程动画`


具体代码，可参考预读文档