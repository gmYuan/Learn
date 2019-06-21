# border-radius详解

## 一 目录

目录

1 [预读文档](#1)

2 [知识详解](#2)

  - [2.1 制作圆弧](#2.1)

  - [2.2 Node.prototype.parentElement](#2.2)


## <span id="1">一  预读文档</span>

1 阅读文档有:

01 [border-radius 详解](http://www.cnblogs.com/lhb25/archive/2013/01/30/css3-border-radius.html)

阅读原因: 非常全面的语法查阅参考

02 [MDN— border-radius](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius)

阅读原因: 对上文语法的补充 + 部分实现效果的直观示例

03 [你可能不知道的 border-radius](http://vince.xin/article/5acc329a6b78214ab8ac58b4)

阅读原因: 常见效果示例，直观可参考



## <span id="2">二  知识详解</span>

### <span id="2.1"> 2.1 制作圆弧 </span>

1 Q: 如何制作一个圆弧

A: border-raius + transform:rotate

S1 border边框 + 单个方向的border-xxx-xxx-radius(半径值不同) + 其他方向圆角为none

S2 transform:rotate 进行旋转


2 Q: 如何制作一个椭圆

A: 4个方向的border-radius + 不同水平/垂直方向的半径值即可

S1 语法为 `border-radius: 40px / 100px`


以上实际代码可参考 [画一个皮卡丘](https://github.com/gmYuan/WorkCode/blob/master/08%20%E7%94%A8CSS%E5%88%B6%E4%BD%9C%E4%B8%8D%E8%A7%84%E5%88%99%E5%9B%BE%E5%BD%A2-%E7%9A%AE%E5%8D%A1%E4%B8%98/js/main.js)


