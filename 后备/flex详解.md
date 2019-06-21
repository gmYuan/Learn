# flex布局


目录

1 [预读文档](#1)

2 [flex的常见属性](#2)

3 [flex-grow/shrink/basis 注意点有哪些](#3)

4 [width/height 与 justify-content](#4)


## <span id="1">1  预读文档</span>

01[一劳永逸的搞定 flex 布局](https://juejin.im/post/58e3a5a0a0bb9f0069fc16bb)

阅读原因: flex语法介绍参考 


02 [flex属性之flex-grow、flex-shrink、flex-basis详解](https://github.com/kaola-fed/blog/issues/117)

阅读原因: 对以上flex语法的补充,介绍了flex的难点属性，参考文档也非常好


03 [Flexbox布局演示站](https://juejin.im/post/5accd54a5188252b0b201fc9)

阅读原因: 一个flex相关效果的直观演示工具



## <span id="2">2 flex的常见属性 </span>

1 Q: flex的常见属性有哪些，分别有什么作用 

A: flex有以下属性

S1 flex-wrap:         设置 子容器是否可以换行
 
S2 flex-direction:    设置 主轴的方向， 交叉轴的方向则根据主轴方向默认确定

S3 flex-flow:         以上2个的缩写属性


S4 justify-content:   设置 子容器在主轴方向上的 显示位置

S5 align-items:       设置 子容器在交叉轴方向上的 显示位置

S6 align-content:     子容器多行排列时，设置 行与行之间的对齐方式


S7 order:             单独改变 子容器的显示顺序

S8 align-self:        单独设置 子容器 在交叉轴方向上的 位置



S9 flex-basis:        不伸缩情况下 子容器的原始尺寸,主轴为横向时 表宽度，主轴为纵向时 表高度

S10 flex-grow:        父容器空间多余时，子容器 弹性伸展的比例

S11 flex-shrink:      父容器空间不足时，子容器 弹性收缩的比例

S12 flex:             以上3个的缩写属性



## <span id="3">3 flex-grow/shrink/basis 注意点 </span>

1 Q: flex-grow/shrink/basis 有什么 注意点

A: S1 当flex-basis设置为0%时，这个子容器的 设置的width会重置为0

S2 flex-grow 每一项分配的新增宽度 为: (flex-grow / 所有flex-grow的总和) * 父容器的 多余值

S3 当width重置为0 + flex-grow分配的宽度小于 < 原本内容content时， 宽度取值为 content



## <span id="4">4  width/height 与 justify-content </span>

1 Q: 为什么 纵向主轴后，设置justify-content: space-around 纵向均匀排列无效 

A: 

S1 父容器需要设置 高度之后，justify-content 才会生效

S2 所以可以给父容器设置一个 `min-height`值

具体可参考  [如何设置flex两行之间的间距](https://segmentfault.com/q/1010000009817671)
