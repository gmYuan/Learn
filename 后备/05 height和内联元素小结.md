# height + lne-height + vertical-align详解

## 一 前言

主要分为两部分，第一部分介绍正常流下 height属性的相关注意点(脱离文档流的情况以后再说)
第二部分是重点，介绍内联元素的相关知识(覆盖大部分基础内容)。

## 二 height属性

1 含义
S1 width和heigth定义的是元素框里 内容区content的范围(默认情况下);
S2 对行内非替换元素不生效;
S3 min-height 和 max-height 属性会覆盖 height


2 常见取值
s1 length: px/em,其中 em是相对该元素的font-size(字体大小)
s2 百分比
    包含块显式设置了height:  该元素高度定义为 其包含块高度height 的百分比;
    包含块 没有显式设置height:  该元素的百分比高度会 强制重置为 height:auto;

S3 auto: 也是默认值，具体情况见下文


3 块级元素垂直方向基本原理 和 auto情况讨论
s1 垂直方向基本原理
(1) 可以对任何块级元素显式设置height值
    height > 内容所需高度 : 和产生padding-bottom的效果类似;
    height < 内容所需高度 : 产生滚动条/超出范围 (由overflow属性决定)

(2) 正常流中, 块级元素框的垂直部分总和(padding+height+margin) = 父元素的内容区height
    简单来说，就是 子元素的盒模型总高度默认等于 其父元素的内容区高度;

S2 auto情况讨论

接下来讨论height是auto的情况
(1) 块级元素垂直方向 只有height和 margin-top/margin-bottom 可以取auto;

(2) margin-top/margin-bottom:auto
    浏览器会强制重置为0 ，即没有上下外边距;
    注意，在元素脱离文档流时，该情况不适用（详见以后文章）

(3) 正常流+块级元素height:auto
    当子元素是内联元素时， 其高度会包含 它所有内联内容的行盒(line-box);

    当子元素是 块级元素+无padding和border + 有margin时:
         高度包含的是 最高块的border ~~ 最低块的border ，即 子元素的margin会超出父元素height

    当子元素是 块级元素+有padding/border + 有margin时:
         高度包含的是 最高块的margin ~~ 最低块的margin ，即 子元素的margin不会超出父元素height

S3 其他注意点
(1) 垂直外边距重叠
    垂直方向 + 相邻块元素之间，它们的外边距 会发生合并;
    解决方法: 在元素的 包含块上设置 padding/border即可;

(2) 负外边距
    外边距合并情况:
        1个正值一个负值: 正值 - |负值|;
        2个都是正值/负值: 取绝对值更大的 那一个;

    视觉效果: 元素被向上/向下拉，元素之间会发生覆盖/重叠


## 三 内联元素相关知识

1 行内元素基本术语和原理(很重要)
S1 匿名文本: 没有包含在 行内元素里的 文本字符;

S2 em框: 即字符模具框， 可以粗略看做，和font-size相等;

S3 内容区(类似于块级元素的内容框):
    非替换+ 行内元素: 可粗略看做是 em框/font-size的大小范围;
    替换+ 行内元素: 固有高度+ 可选的border/padding/margin

S4 行间距: line-height - font-size的差值，`只能用于非替换元素`

S5 行内框:
    非替换+ 行内元素: 等于 line-height值 (高度上完全不受 上下padding/border/margin影响)
    替换元素: 等于内容区高度，和line-height无关 (高度上受 上下padding/border/margin影响)

S6 行框(line-box):
    某一行的整体框，范围是 最低行内框的底部 ~~ 最高行内框的顶部

S7 再总结一下 确定一行行内元素总高度(line-box)的步骤:
(1) 生成 各个行内元素的行内框高度:
    非替换元素: line-height;
    替换元素: height+上下margin/border/padding值

(2) 把各元素相对于行的基线对齐:
    非替换元素: 明确自身行内元素/匿名文本 的基线位置 + 明确一整行的基线位置 ——把他们对齐;
    替换元素: 把行内框的底部，放到 整行的基线位置

(3) 对于指定了 vertical-align的元素，确定其垂直偏移量(行内框上移/下移的距离);

(4) 根据各个行内框位置，生成行框


2 关于line-height
S1 它定义了文本行基线之间的`最小距离`;
   所有元素都可以设置line-height, 而且它是一个继承属性:
        块级元素 line-height继承的是自己计算的绝对值，通常会有问题,
        可以设置为缩放因子 解决(line-height值 = 自己的 font-size * 缩放因子)

S2 常见取值是:
    noraml: 浏览器默认通常是字体的1.2倍，但是不绝对;
    em/百分数: 相对于 该元素本身的font-size值计算;
    指定一个数: 缩放因子，推荐使用

S3 line-height只对 行内元素/行内内容 有效;
   对块级元素设置line-height，实际影响的是 块级元素内部的行内元素生效，对其本身是无效的;

S4 可以在块级元素上设置line-height，从而让其内部的文本内容继承行高值


3 行内+非替换元素的细节
S1 font-size确定了 内容区/em框的高度;

S2 line-height决定了 行间框的高度
    当line-height小于 font-size时， 内容区高度>行间框的高度，导致内容会超出该行框的范围

S3 影响行框高度的因素:
      毫无疑问，首先是 line-height(决定了行内框的高度);
      其次是各个字体 font-family(决定了文字的默认基线位置，因为要对齐行基线，从而影响 行内框的移动)
      最后是 vertical-align的某些值(sub/super/百分数/具体数值)

S4 行内非替换元素的 上下border/paddin不影响行内元素的 line-height;
   上下margin则明确规定，不可使用在 行内非替换元素;
   但是,border/padding是会影响到布局显示效果的，当设置背景色时，覆盖范围可能会超过行内框高度


4 关于vertical-align
S1 它的含义是: 某个行内元素的行内框 和 包含该元素的行框/内容区，两者之间的垂直对齐方式
   只能适用于 行内元素(不能影响块级元素中内容的对齐)，且不能继承

S2 常见取值是:
    baseline: 默认值，该非替换行内元素的基线 和 行框的基线对齐
                     如果是替换元素， 则是该元素的底部 和 行框的基线对齐

    sub/super: 元素行内框的基线/底部 相对于 行框的基线降低/升高

    百分数: 该元素的基线/替换元素的底部 相对于 行框的基线降低/升高 一个指定的量;
           指定的量 `相对于该元素的 line-height值`计算;

    top/bottom: 元素 行内框(而非基线)的顶部/底部  和 该元素所在的行框顶部/底部 对齐
    text-top/text-bottom: 元素的行内框顶部/底部 和 父元素内容区的文本框顶部/底部 对齐

 
5 行内替换元素
S1 行内框范围是 等于内容区高度(height + padding/border/margin)，和line-height无关

S2 但行内替换元素也是有 line-height的，因为 vertical-align的百分数值相对于 line-height计算
   即，垂直对齐vertical-align和 图像本身的height是无关的

S3 负外边距会减小 替换元素的行内框

S4 由于行内替换元素是底部和行框基线对齐，所以导致图像底部会有空隙
   常见的解决方法是:
        方法1:图像设为 block;
        方法2:修改 vertical-align

## 四 正常流垂直方向高度总结

1 块元素: 由height+padidng+border+margin决定;
2 内联非替换元素: 由 行框高度决定，
                行框高度又主要由line-height+font-family+vertical-align决定

3 内联替换元素: 由height+padidng+border+margin决定，
               同时又受到vertical-align影响

## 五 参考文档

&emsp;&emsp;[1 CSS权威指南;](https://book.douban.com/subject/2308234/)
&emsp;&emsp;[2 MDN的height属性;](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height)
