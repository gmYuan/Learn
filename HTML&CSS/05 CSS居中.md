# CSS居中

目录

1 [预读文档](#1)

2 [水平居中](#2)

3 [垂直居中](#3)

4 [绝对居中](#4)


## <span id="1"> 1 预读文档 </span>

阅读文档

1 [CSS实现水平垂直居中的10种方式](https://juejin.im/post/5b9a4477f265da0ad82bf921)

阅读原因: 绝对居中的方式介绍


2 [16种方法实现水平居中垂直居中](https://juejin.im/post/58f818bbb123db006233ab2a)

阅读原因: 水平和垂直居中的方法介绍


## <span id="2"> 2 水平居中 </span>

1 Q: 内联元素 如何水平居中

A: 给其父元素设置 `text-align:center` 


2 Q: 块级元素 如何水平居中

A: 

S1 方法1: 固定宽度 + `margin: 0 auto`

S2 方法2: flex + justify-content 

S3 方法3: 固定宽度 + 绝对定位 + margin-left负值 

S4 方法4: 绝对定位 + `transform:translate(-50%,0)`


## <span id="3"> 3 垂直居中 </span>

1 Q: 父元素高度确定的单行文本 如何垂直居中

A: S1 设置其 line-height 等于 父元素高度


2 Q: 元素高度确定的多行文本 如何垂直居中

A: 

S1 方法1: 父元素设置 display:table-cell + vertical-align:middle

S2 方法2: 利用内容自适应 + padding即可


3 Q: inline-block类型元素 如何垂直对齐

A: 

S1.1 设置该元素 vertical-align: middle

S1.2 设置该元素的 父元素的::afer伪元素，设置height100% + vertical-align + inline-block

S3 代码见下

```css
.parent {
  width: 200px;
  height: 100px;
  // border: 1px solid red;
}

.child {
  // outline: 1px solid green;
  display: inline-block;
  vertical-align: middle;
}

.parent::after{
  content: '';
  display: inline-block;
  vertical-align: middle;
  height: 100%;
  // outline: 1px solid blue;
}
```

4 Q: 块级元素如何垂直居中

A: 

S1 方法1: flex + algn-items

S2 方法2: 绝对定位 + transform

S3 方法3: 绝对定位 + 负margin-top



## <span id="4"> 4 绝对居中 </span>

1 Q: 绝对居中的实现方法

A: 

S1.1 父元素: 相对定位 + 固定宽高

S1.2 子元素: 绝对定位 + 固定宽高 + 负margin-top/left

S3 代码见下

```html
<div class="parent">
    <div class="child">123123</div>
</div>

```

```css
.parent {
  border: 1px solid red;
  width: 300px;
  height: 300px;

  position: relative;    // A1 相对定位
}

.child {
  width: 100px;
  height: 100px;
  background: green; 

  position: absolute;   // A2.1 绝对定位
  top: 50%;
  left: 50%;
  margin-top: -50px;    // A2.2 负margin
  margin-left: -50px;

}

```
或者

```css
.child {
  width: 100px;
  height: 100px;
  background: green; 

  position: absolute; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);   
}
```


S2 方法2:

S2.1 父元素设置 table-cell + text-align + vertical-align

S2.2 子元素设置 inline-block即可

```css
.parent {
  border: 1px solid red;
  width: 300px;
  height: 300px;
  
  display: table-cell;
  text-align: center;
  vertical-align: middle;  
}

.child {
  display: inline-block;
}
```

S3 方法3: flex布局

```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

```