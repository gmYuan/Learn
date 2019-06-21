
## MVC的含义

1 MVC是一种代码结构的组织形式，它可以使代码结构更清晰，功能之间互相解耦，从而便于调试和维护

2 MVC中

M指的是 数据Model,通过它来执行对数据库中的数据进行查找修改等操作；

V指的是 需要操作的视图容器view，是用户可以感知操作的部分；

C指的是 逻辑控制部分Controller，它用于操作M和V

3 一个典型的MVC交互过程是

S1 Model 和服务器交互，将得到的数据交给 Controller

S2 Controller 把数据填入 View，并监听 View

S3 用户操作 View，如点击按钮，Controller 就会接受到点击事件;

   Controller 这时会去调用 Model;

   Model 会与服务器交互，得到数据后返回给 Controller;

   Controller 得到数据就去更新 View


## 实现MVC模式的思维步骤：

S1 找出要操作的html元素，并定义命名为view(技巧是某一块html段中的最外层标记)

S2 第一版的 controller: 把所有操作JS的代码放在一个函数内

S3 第二版的 controller
  (1)把所有操作JS的代码放在一个对象内
  (2)对象内有:
      view: 所有方法中用到的变量值
      init: 初始化变量值+调用方法
      bindEvents: 凡是事件监听，都可以单独抽取出来，成为属性

  (3)通过this+函数参数 传递值
  (4)调用init函数 初始化

关于改变this指向的方法:
  箭头函数 / bind() / self = this

具体代码，可参考:
[引入MVC示例](https://github.com/gmYuan/resume/blob/v2.0/smoothly-nav.js)
