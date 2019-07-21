# script defer和async区别

目录:

1 [预读文档](#1)

2 [什么是闭包](#2)

3 [闭包的实质](#3)

4 [闭包的作用](#4)

5 [闭包的问题](#5)


## <span id="1"> 1 预读文档 </span>

1 [JavaScript深入之执行上下文栈](https://github.com/mqyqingfeng/Blog/issues/4)

2 [JavaScript深入之变量对象](https://github.com/mqyqingfeng/Blog/issues/5)

3 [JavaScript深入之作用域链](https://github.com/mqyqingfeng/Blog/issues/6)

4 [JavaScript深入之执行上下文](https://github.com/mqyqingfeng/Blog/issues/8)

5 [JavaScript深入之闭包](https://github.com/mqyqingfeng/Blog/issues/9)

阅读原因: 详细介绍了闭包相关的知识点


https://segmentfault.com/q/1010000000640869





## <span id="2"> 2 defer 和 async区别 </span>

1 script: 停止HTML渲染 + 立刻下载script + 立刻执行script + 继续HTML渲染

2 