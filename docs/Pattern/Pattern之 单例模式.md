# Pattern之 单例模式

### 目录

1 [预读文档](#1)

2 [实现方法](#3)

3 [示例代码](#4)


## <span id="1"> 一 预读文档 </span>

01 [暂无](/)

阅读原因: 直接参考文档


## <span id="2"> 二 实现方法 </span>

Q1:  什么是单例模式，有什么作用

A: 

![t8dLZD.png](https://s1.ax1x.com/2020/06/01/t8dLZD.png)

## <span id="2"> 二 示例代码 </span>

```JS
A.getInstance = (function(){
  let instance
  return () => {
    if (!instance) {
      instance = new A()
    }
    return instance
  }
})()
```