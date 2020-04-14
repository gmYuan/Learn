# JS基础之 数据类型相关

目录

1 [预读文档](#1)

2 [JS类型](#2)


### <span id="1">一  预读文档</span>

01 [JavaScript数据类型知识你真的懂吗](https://juejin.im/post/5d030e03518825361817032f)

阅读原因: 直接参考文档


## <span id="2">二 JS类型 </span>

Q1: JS有哪些数据类型

A:

```JS
// 7种 基本类型
Number: 整数/浮点数 + 一些特殊值（-Infinity、+Infinity、NaN）

String: 字符串

Boolean: 布尔值

Null

Undefined

Symbol

BigInt


// 1种 引用类型
Object: 包括 Array/Function/Date/Math/RegExp
```

</hr>

Q2: 基本类型 和 引用类型 的区别是什么

A:

- 基本类型：

- 引用类型：


```js
function test(person) {
  person.age = 26
  person = {
    name: 'hzj',
    age: 18
  }
  return person
}
const p1 = {
  name: 'fyq',
  age: 19
}
const p2 = test(p1)
console.log(p1) // -> ?
console.log(p2) // -> ?


```






Q: 有哪些数据类型，布尔值会转化为 false

A: 5个falsy值：

```js
Boolean(undefined)  // false
Boolean(null)       // false
Boolean(NaN)        // false
Boolean(0)          // false
Boolean('')         // false

Boolean({})                  // true
Boolean([])                 // true
Boolean(new Boolean(false)) // true
```