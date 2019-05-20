# prop验证 + 非prop特性

目录:

1 [预读文档](#1)

2 [prop验证](#2)

3 [非prop特性](#3)


## <span id="1">1 预读文档 </span>

1 [官方文档_ 深入了解组件_prop](https://cn.vuejs.org/v2/guide/components-props.html)

阅读原因: 直接参考文档

2 [prop验证 + 非prop特性](https://github.com/gmYuan/my_learn/blob/master/Vue/code/08%20prop%E9%AA%8C%E8%AF%81%2B%E9%9D%9Eprop%E7%89%B9%E6%80%A7.html)

阅读原因: 示例代码文件


## <span id="2">2 prop验证 </span>

1 Q: 为什么要引入 prop验证

A:
S1 可以进一步明确规定 父传子组件数据的 数据类型/是否必传/验证数据


2 Q: 如何实现 prop验证

A: 具体参见预读文档中的 代码示例



## <span id="3">3 非prop特性 </span>

1 Q: 为什么要引入 非prop特性

A:
S1 可以让 组件支持添加任意特性，这样就可以使用第3方组件提供的内置特性

S2 添加的特性，会添加到组件的根元素上


以上具体代码，参见预读文档中的 代码示例