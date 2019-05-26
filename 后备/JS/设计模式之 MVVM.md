# 设计模式之 MVVM


目录:

1 [预读文档](#1)

2 [什么是MVVM](#2)


## <span id="1">1 预读文档 </span>

1 [简述MVVM](https://zhuanlan.zhihu.com/p/46075461)

阅读原因: MVVM概念简介



## <span id="2">2 什么是MVVM </span>

1 Q: 简述MVVM

A: 
S1 MVVM是一种设计模式，把代码分为 Model、View、ViewModel3个部分，以实现代码间的低耦合

S2 View是视图部分，主要功能是 页面的基本内容和样式

S3 Model是数据部分，主要功能是 数据的获取 和 增删改查

S4 ViewModel是 同步View和Model的中介对象，主要功能是 实现主要的业务逻辑代码

S5.1 这3部分中，最重要的是ViewModel层，它通过双向绑定的把View层和Model层联系起来

S5.2 通过ViewModel层，View/Model的变化会自动同步到Model/View层，而不用我们手动修改对应变化

S5.3 MVVM通过Observer，使我们不用再手动操作DOM，简化了开发流程
