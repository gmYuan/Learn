# Promise小结

## 一 前言

今天学习了Promise的相关知识，所以对其做一下小结。

## 二 Promise的作用

1 在介绍Promise之前，先得知道为什么要引入Promise,这就涉及到AJAX回调函数的缺点

AJAX使用回调函数的缺点有：
  1.实现接口的参数形式不一致，必须查看对应库的文档才知道对应要传入的参数名称

而使用Promise，其优点有:
  1.可省略回调函数名
  2.可以多次进行回调操作

## 三 使用Promise

1 传入url、method等
2 调用`then`方法，传入成功和失败的回调函数
3 可以多次调用then方法
具体代码，可参考
[AJAX中使用then方法](https://github.com/gmYuan/node-Ajax/blob/master/main.js)

如果用自己封装的AJAX实现Promise，那么具体代码见
[封装的AJAX中使用Promise](https://github.com/gmYuan/node-Ajax/blob/master/main.js)

## 四 自己实现Promise


