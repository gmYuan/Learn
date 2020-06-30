# Pattern之 适配器模式

### 目录

1 [预读文档](#1)

2 [实现方法](#3)

3 [示例代码](#4)


## <span id="1"> 一 预读文档 </span>

01 [暂无](/)

阅读原因: 直接参考文档


## <span id="2"> 二 实现方法 </span>

Q1:  什么是适配器模式，有什么作用

A: 

![适配器模式](https://s1.ax1x.com/2020/06/01/t8hzfP.png)


## <span id="2"> 二 示例代码 </span>

代码见下:

```js
class Adaptee {
    oldRequest() {
        rerurn `旧接口`
    }
}

class Target {
    constructor(){
        this.adaptee =  new Adaptee()
    }
    newRequest() {
        let info = thus.adaptee.oldRequest()
        return `适配后的 扩展内容--  ${info}`
    }
}
```