# Sass基础知识详解

## 一 前言

最近写项目的时候使用到了Sass预处理器，所以对其知识做一个小结。
其实这篇博文价值不大，因为是官方文档内容的子集，所以只是便于我自己个人来参考。


## 二 快速入门

1 安装和使用node-sass
S1 参考官方文档即可：[node-sass 官网](https://github.com/sass/node-sass)


2 变量
S1 声明变量
  (1) 任何可作为css属性值的内容，都可以用作sass的变量值： `$basic-border: 1px solid black;`
  (2) 当变量定义在css规则块内，那么该变量只能在此规则块内使用。 类似于ES6的作用域规则
  (3) 变量可使用 中划线/下划线，两者指向一致

S2 使用变量
  (1) 在CSS赋值语句中使用
 （2) 在其他变量中引用


3 选择器嵌套写法
S1 可用于后代选择器：
```scss
#content {
  background-color: #f5f5f5;
  aside { background-color: #eee }
}

//编译为
#content { background-color: #f5f5f5 }
#content aside { background-color: #eee }   //后代选择器
```

S2 父选择器 标识符&
  (1) & 的编译规则是直接替换，而非逐层添加(成后代选择器)
  (2) 它可用于伪类 / 在父选择器之前 添加选择器

S3 可用于群组选择器:
```scss
//例1，内部是群组选择器
.container {
  h1, h2, h3 {margin-bottom: .8em}
}
编译为：
.container h1, .container h2, .container h3 { margin-bottom: .8em }

//例2，外部是群组选择器
nav, aside {
  a {color: blue}
}
编译为:
nav a, aside a {color: blue}
```

S4 子组合选择器 和 同层组合选择器：>、+和~
  (1)子组合选择器: >
  (2)同层相邻组合选择器: +
  (3)同层全体组合选择器: ~

```scss
article {
  ~ article { border-top: 1px dashed #ccc }
  > section { background: #eee }
  dl > {
    dt { color: #333 }
    dd { color: #555 }
  }
  nav + & { margin-top: 0 }
}

编译为
article ~ article { border-top: 1px dashed #ccc }
article > footer { background: #eee }
article dl > dt { color: #333 }
article dl > dd { color: #555 }
nav + article { margin-top: 0 }
```

S5 嵌套属性
  （1）规则是 把属性名从中划线-的地方断开,换成：和 语句块
   (2) 举例:
 ```scss
nav {
  border: {
  style: solid;
  width: 1px;
  color: #ccc;
  }
}

//编译为
nav {
  border-style: solid;
  border-width: 1px;
  border-color: #ccc;
}
 ```


 4 导入SASS文件
 S1 sass的@import规则在生成css文件时就把相关文件导入进来
 > 这意味着所有相关的样式 被归纳到了 同一个css文件中，而无需发起额外的下载请求

 S2 sass局部文件 以下划线开头, 这样在编译时就不会单独编译该文件输出css，而只把这个文件用作导入
    如 `@import "xxx";`

S3 一般情况下，反复声明一个变量，后声明的变量值会覆盖前面
>  !default用于变量，含义是：如果这个变量被声明赋值了，那就用它声明的值，否则就用这个默认值
```scss
$fancybox-width: 400px !default;
.fancybox {
width: $fancybox-width;
}
```

S4  嵌套导入: 在css规则内导入局部文件
```scss
.blue-theme {@import "blue-theme"}
```

S5 原生CSS导入: 可以把原始的css文件改名为.scss后缀，就可直接导入了



## 参考文档

[01 Sass官方文档](https://www.sasscss.com/getting-started/)