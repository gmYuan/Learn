# Pattern之 装饰器模式

### 目录

1 [预读文档](#1)

2 [实现方法](#3)

3 [示例代码](#4)


## <span id="1"> 一 预读文档 </span>

01 [暂无](/)

阅读原因: 直接参考文档


## <span id="2"> 二 实现方法 </span>

Q1:  什么是装饰器模式，有什么作用

A: 

![装饰器模式](https://s1.ax1x.com/2020/06/01/t8o37Q.png)


## <span id="2"> 二 示例代码 </span>

1 装饰器模式 示例:

```js
class Circle {
    draw() {
        console.log('画一个圆')
    }
}

class Decorator {
    constructor(circle){
        this.circle =  circle
    }
    draw() {  // 扩展原属性/方法
       this.circle.draw()
       this.setRedBorder(circle)
    }
    setRedBorder(circle) {
        console.log('设置红色边框')
    }
}
```

2 ES6 装饰器语法示例:

```js
// 装饰类 示例
@mixins(Foo)
class Myclass{}

class Foo = {
    foo() {
        alert('foo')
    }
}

function mixins(...list){
    return function (target) {
        Object.assign(target.prototype, ...list)
    }
}

// 装饰 类的属性 示例
class Person {
    constructor(){
        this.first = 'a'
        this.last = 'b'
    }

   @readonly
    name() {
        return `${this.first} - ${this.last}`
    }
}

function readonly(target, name, descriptor) {
    descriptor.writable = false
    return descriptor
}
```