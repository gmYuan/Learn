# 面向对象之 instanceof模拟实现

目录:

1 [预读文档](#1)

2 [instanceof 本质和实现](#2)

3 [instanceof 再次理解原型链](#3)


## <span id="1">1 预读文档 </span>

1 [instanceof原理](https://juejin.im/post/5cb3e7e0e51d456e896349d3)

2 [关于instanceof和原型链](https://juejin.im/post/5d2addffe51d455c8838e208)

阅读原因: 直接参考文档


## <span id="2"> 2 instanceof 本质 和 实现 </span>

1 Q: instanceof的实现原理是什么

A: 

S1 instaceof的实现原理，是递归查找原型链的过程

```js
obj1 instanceof Fn

// 不断查找obj.__proto__.__proto__......, 只有其中有一环指向Fn.prototype, 则为true
```

2 Q: 手写出instanceof的实现代码

```js
mockInstanceof = function(left, right) {  // left表示左侧对象(实例)，right表示右侧函数对象参数
  let src = left.__proto__
  let target = right.prototype

  while(true) {
    if (src === null) {     // 原型链对象遍历到顶层时
      return false 
    }
    if (src === target) {   // 与显式对象严格相等时
      return true
    }

    src = src.__proto__      // 递归遍历原型链
  }
}

```


## <span id="3"> 3 instanceof 再次理解原型链 </span>

1 Q: 原型链的递归值分别是哪些, 或者说，原型链的完整流程是什么 

A: 3句话来理解下图即可

S1 (实例)对象 都有__proto__属性

S2 构造函数对象 同时具有 __proto__属性 和 prototype属性

S3 __proto__可以近似理解为 父子关系

最后以一张经典图结束

![原型链经典图](https://user-gold-cdn.xitu.io/2019/7/14/16bef984f537cf1f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
