# background相关属性

目录

1 [预读文档](#1)

2 [backgound-position属性](#2)

3 [background-size属性](#3)


## <span id="1"> 1 预读文档 </span>

阅读文档

1 [CSS-理解百分比的background-position](https://github.com/riskers/blog/issues/9)

阅读原因: background-position属性 百分比含义介绍

2 [MDN— background-size属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)

阅读原因: background-size属性含义介绍



## <span id="2"> 2 backgound-position属性 </span>

1 Q: background-position属性 取值为百分比时的含义

A: S0 核心: 值为 `(容器宽度-图片宽度) * 百分比`

S1 取值为百分比时，计算公式是 (容器宽度-图片宽度) * 百分比

S2 举例如下:

容器宽度400px, 图片宽度100px, 当background-position-x为10%时:

意味着 背景图片左上角位于容器左上角 (400-100)*10% = 30px处，

也就是说背景图片的(0, 0) 坐标需要与容器(30px,0)坐标重合



## <span id="3"> 3 background-size属性 </span>

1 Q: bg-size的含义是什么

A: 设置背景图片的 宽度和高度，默认为auto

S1 值是百分比: 指定背景图片 相对背景区的百分比, 背景区由background-origin设置,默认为padding

S2 值是contain: 以背景容器宽高 较小的值，按比例缩放背景图片

S3 值是cover:   以背景容器宽高 较大的值，按比例缩放背景图片







