
# window对象 小结

## window对象 属性的 文档元素

S1 html元素具有id属性 + `window对象的已有属性里没有与其同名的属性(前提条件)`
S2 window对象会新增一个属性：
    属性名为id名 + 属性值就是 表示那个html文档元素的 HtmlElement对象

S3 也就是说，这个id属性会成为全局变量，同理还有name属性

S4 需要注意的是，元素ID作为全局变量的 隐式应用是 浏览器的历史遗留问题，并不推荐实际使用

可以参考:
  [1 javascript权威指南 P352](https://book.douban.com/subject/1232061/)
  [2 原生JS中可以直接使用ID名称来获取元素](https://segmentfault.com/q/1010000003689321)



  