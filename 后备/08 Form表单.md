# Form表单

## 目录

1 [预读文档](#1)

2 [知识详解](#2)

  - [2.1 基本表单结构](#2.1)


## <span id="1">一  预读文档</span>

1 阅读文档有:

01.1 [MDN— 创建第一个表单](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Forms/Your_first_HTML_form)

01.2 [MND— 构造HTML表单](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Forms/How_to_structure_an_HTML_form)

阅读原因: 表单 语法介绍参考


## <span id="2">二  知识详解</span>

### <span id="2.1"> 2.1 基本表单结构 </span>

1 Q: 表单基本结构是什么

A: 常见的表单元素结构见下:

```html
<form action="/handling-url" method="get/post">     /* action属性:处理表单数据的 服务器文件路径Url  */

    <div>
        <label for="name">Name:</label>              /* for属性:管理label文本和输入框id  */
        <input type="text" id="name" name="user">
    </div>

    可以简写为:
    <label>Name: <input type="text" name="user"></label>  /* name属性: 为传输数据提供辨识名称 */

    <button type="submit">Send your message</button>
    <input type="submit" value="提交">                   //定义input的默认值，必须使用 value属性

    两者之间的区别是:

    S1：在<form>下，如果没有type, <button>按钮会自动升级为 submit的按钮

    S2: type=button就是应该普通按钮，不能够提交

    S3：type=submit 是唯一可以提交表单的按钮

    S4: input是没有子元素的,button可以有子元素，即input元素只允许纯文本作为其标签，而button元素允许完整的HTML内容
</form>
```








