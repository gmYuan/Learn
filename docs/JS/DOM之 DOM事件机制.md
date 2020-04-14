# DOM之 DOM事件机制

目录:

1 [预读文档](#1)

2 [事件及事件流](#1)

3 [事件处理程序](#2)
  
4 [事件委托](#4)


## <span id="1">1 预读文档 </span>

01 [JS事件](https://github.com/amandakelake/blog/issues/38)

02 [DOM事件机制](https://juejin.im/post/5bd2e5f8e51d4524640e1304)

阅读原因: 直接参考文档


## <span id="2"> 2 事件及事件流 </span>

Q1: 什么是 事件

A:

S1 事件可以理解为 用户/浏览器 自身执行的 某种动作

S2 比如，点击按钮、提交表单、加载页面等 都是事件


Q2 什么是 DOM事件模型

A:

S1 `事件捕获`: 由外至内，触发顺序是 从不太具体的节点(document)，向下传播到最具体的节点(div)

S3 `冒泡阶段`: 由内至外，即事件由最具体的元素(div)接收，然后逐级 向上传播到不具体的节点（document）


Q3: 什么是 事件流

A: 

S1 页面中节点 接收事件的顺序

> 想象 一张纸上有一组同心圆，如果把手指放在圆心上，那么手指指向的不是一个圆，而是纸上的所有圆

> 同理，如果用户单击了某个按钮，那么单击事件不仅仅发生在按钮上
> 在单击按钮的同时，同时单击了按钮的容器元素，甚至可以看作是 单击了整个页面


S2 事件流包括三个阶段：捕获阶段、目标阶段、冒泡阶段

> 第一阶段：从window对象传导到目标节点（上层传到底层），称为“捕获阶段”（capture phase）

> 第二阶段：在目标节点上触发，称为“目标阶段”（target phase）

> 第三阶段：从目标节点传导回window对象（底层传回上层），称为“冒泡阶段”（bubbling phase）

> 这种三阶段的传播模型，使得同一个事件会在多个节点上触发

可见下图
![事件流模型图](https://user-images.githubusercontent.com/25027560/38007715-4cc457d0-327d-11e8-9fb3-667fa75fc38c.png)

举例见下:

```js
<div>
  <p>点击</p>
</div>


// 设置触发阶段 + 回调函数
var phases = {
  1: 'capture',
  2: 'target',
  3: 'bubble'
}

var div = document.querySelector('div');
var p = document.querySelector('p');

div.addEventListener('click', callback, true)
p.addEventListener('click', callback, true)

div.addEventListener('click', callback, false)   // 第三个参数的不同，按序绑定2个监听函数
p.addEventListener('click', callback, false)     // 同上

function callback(event) {
  var tag = event.currentTarget.tagName;
  var phase = phases[event.eventPhase];
  console.log("Tag: '" + tag + "'. EventPhase: '" + phase + "'");
}

// 点击输出的结果, click事件被触发了四次

// Tag: 'DIV'. EventPhase: 'capture'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'DIV'. EventPhase: 'bubble'

```


## <span id="3"> 3 事件处理程序 </span>

Q1: 什么是 事件处理程序

A:

S1 触发事件后，会 自动执行的 回调函数

S2 事件处理程序有3种类型:

- HTML元素 定义事件回调: 只支持冒泡阶段触发 + 自动传入 event事件对象 + this执指向DOM元素

```
<input type="button" value="Click" onclick="alert(this.value)"> // this指向 事件的目标元素

// 输出 "Click"

// 缺点: 触发事件时，回调函数可能还未加载完成(回调函数被定义在页面最底部时) + html和JS代码 过度耦合
```

- DOM0级: `btn.onclick = cb`: 同上 + 删除方法: `xxx.onclick = null`

缺点: 一个事件只能定义一个回调函数，如果定义两次onclick属性，`后一次定义会覆盖前一次`


- DOM2级: `btn.addEventListener('click', cb, true/flase)`: 可以添加多个回调


Q2: 事件处理程序的 this值

A:

S1 所有事件的回调函数，其内部this都指向 `注册事件回调的 DOM元素`

S2 在事件处理程序内部，`this值= event.currentTarget`, 指向注册事件回调的元素;
  
而`event.target`则指向当前阶段 实际真正触发事件的元素 (它有可能 未注册 回调函数)


```js
//例1
var btn = document.getElementById("myBtn")
btn.onclick = function(event){
  alert(event.currentTarget === this); //true
  alert(event.target === this);        //true， 由于click事件的目标是按钮，因此这三个值是相等的
}

//例2
document.body.onclick = function(event){
  alert(event.currentTarget === document.body)  //true
  alert(this === document.body);                //true，因为事件处理程序 是注册到这个元素上的

  alert(event.target === document.getElementById("myBtn"));
    // true，target元素等于按钮元素，因为它是click事件真正的目标
    // 由于按钮上并没有注册事件处理程序，click 事件就冒泡到了document.body ，在那里事件才得到了处理
}
```


## <span id="4"> 4 事件委托 </span>

Q1: 什么是 事件委托

A: 

S1 利用事件冒泡的机制，在 父级容器统一定义 子元素的事件监听函数

S2 事件委托 利用了事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件

```js
// 例1
<ul id="myLinks">
  <li id="goSomewhere">Go somewhere</li>
  <li id="doSomething">Do something</li>
  <li id="sayHi">Say hi</li>
</ul>

// 传统方法
var item1 = document.getElementById("goSomewhere");
var item2 = document.getElementById("doSomething");
var item3 = document.getElementById("sayHi");

EventUtil.addHandler(item1, "click", function(event){
  location.href = "http://www.wrox.com";
})

EventUtil.addHandler(item2, "click", function(event){
  document.title = "I changed the document's title";
})

EventUtil.addHandler(item3, "click", function(event){
  alert("hi");
})

// 事件委托方法，只为 ul元素添加了一个 onclick事件处理程序
var list = document.getElementById("myLinks")

EventUtil.addHandler(list, "click", function(event){
  event = EventUtil.getEvent(event);
  var target = EventUtil.getTarget(event);
  switch(target.id){
    case "doSomething":
      document.title = "I changed the document's title";
      break

    case "goSomewhere":
      location.href = "http://www.wrox.com";
      break;

    case "sayHi":
      alert("hi");
      break
   }
})
```


S3 事件委托有以下优点

- 只要定义一个监听函数，就能处理多个子节点的事件，而不用在每个子节点上定义监听函数，占用的内存更少

- 动态的添加DOM元素，不需要因为元素的改动 而修改事件绑定

- document对象很快就可以访问，可以在页面生命周期的任何时点上为它添加事件处理程序


S4 其他注意点

A1 `event.stopPropagation()`: 停止事件的 向上(冒泡)/ 向下(捕获) 传播;

A2 `event.stopImmediatePropagation()`: 停止执行 同级事件的 其他监听回调;

A3 `event.preventDefault()`: 阻止事件触发后的 默认行为

```js

// 例1  事件传播到 p 元素后，就不再向下传播了
p.addEventListener('click', function (event) {
  event.stopPropagation();
}, true)

// 事件冒泡到 p 元素后，就不再向上冒泡了
p.addEventListener('click', function (event) {
  event.stopPropagation();
}, false)


// 例3 stopImmediatePropagation
p.addEventListener('click', function (event) {
  event.stopImmediatePropagation();
  console.log(1);
});

p.addEventListener('click', function(event) {
  // 不会被触发
  console.log(2)
})
```