# link和@import的区别

目录

1 [预读文档](#1)

2 [link 与 @import 的区别](#2)


## <span id="1"> 1 预读文档 </span>

阅读文档

1 [你真的理解@import和link引入样式的区别吗](https://juejin.im/post/5ab36d99f265da23866fccd1)

阅读原因: 知识点介绍的较为全面


## <span id="2"> 2 link 与 @import 的区别 </span>

1 Q: link 与 @import 的区别是什么

A: 

S1 功能范围不同

S1.1 link是html提供的语法，除了可以引入CSS，还可以用来引入RSS等

S1.2 @import是CSS提供的语法，只可以用来引入CSS文件


S2 加载顺序不同

S2.1 浏览器遇到link标签时，就会同步去加载CSS文件

S2.2 而只有在 页面加载完成后，浏览器才会去下载 @import引入的CSS文件


S3 兼容性不同

S3.1 link标签无兼容性问题

S3.2 而@import是CSS 2.1被引入的，因此只支持IE5+的


S4 JS可控性不同

S4.1 link可以通过JS动态创建

S4.2 @import则不能通过JS创建




