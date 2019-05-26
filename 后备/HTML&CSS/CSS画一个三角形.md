# CSS画一个三角形

目录

1 [预读文档](#1)



2 [实现CSS三角形](#2)

 

## <span id="1"> 一 预读文档 </span>

01 [CSS实现 空心三角指示箭头](https://juejin.im/post/59c9e9276fb9a00a616f4842)

阅读原因: 介绍了如何实现CSS三角形



## <span id="2"> 2 实现CSS三角形 </span>

1 Q: 如何用CSS画一个 三角形

A: 

S1 设置宽高为0

S2 分别设置 border-left + border-right + border-top + border-bottom的值和颜色

S3 设置其他方向的颜色为 transparent

S4 具体代码:

```JS
.triangle {
  width: 0px;
  height: 0px;
  
  border-left: 10px solid blue;
  border-top: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid transparent;
}
```

