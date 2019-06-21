# CSS 居中+布局详解

## 一 前言

最近学习了CSS 居中和布局方式的相关知识，所以对其做一个小结。


## 二 常见居中

1 水平居中

S1 子元素块级元素+显式定宽: 
	(1) 方法1: 设置 margin: 0 auto;
	(2) 方法2: 绝对定位 + 一半宽度负margin/transform

S2 子元素块级元素+不定宽: 设置为inline-block + text-align:center;

S3 子元素多个块级元素: 同上 / flex布局

S4 子元素内联元素: 父元素设置 text-align:center;


2 垂直居中

S1 子元素单行内联: 设定父元素line-height = height 

S2 子元素多行内联: 父元素 display:table-cell + vertical-align:middle


S3 父元素 块元素&定高 + 子元素块元素: 设置子元素的margin-top/bottom 

S4 图文垂直居中: 图文都设置inline-block + 图片设置vertical-align:middle


3 绝对居中

S1 单行文本水平垂直居中: line-height + text-align:center

S2 块元素: 绝对定位 + transform / flex布局


## 三 常见布局

1 两列布局
S1 左侧定宽，右侧自适应宽度
  (1) inline-block方法: 了解即可;
  (2) float浮动 + clac()属性 (注意清除浮动)
  (3) flex布局


2 三列布局
S1 两侧定宽中间自适应
  (1) 方法1: 父元素宽度 + 左左右float + clac()属性;
  (2) 方法2: 父元素相对 + 子元素绝对定位
  (3) 圣杯布局: 
        中间元素在最前 + 宽度100%, 左右定宽;
        3个都float:lfet;
        左边margin-left: -100% + 右侧margin-left: -自身宽度;
        父容器左右padding = 子元素定宽值 + 子元素绝对定位

  (4) 双飞翼布局: 基本同上，不过步骤4变成中间元素外边距实现



## 参考文档

[01 七种实现左侧固定，右侧自适应两栏布局的方法](https://segmentfault.com/a/1190000010698609)

[02 CSS常见布局方式](https://juejin.im/post/599970f4518825243a78b9d5)

[03 CSS布局十八般武艺都在这里了](https://zhuanlan.zhihu.com/p/25565751)

[04 CSS布局解决方案](https://segmentfault.com/a/1190000013565024?utm_source=channel-hottest)