# 类型判断之 typeof 和 instanceof

目录:

1 [预读文档](#1)

2 [typeof 能否正确判断JS数据类型](#2)

3 [instanceof 能否正确判断JS数据类型](#3)

4 [instanceof 的实现原理是什么](#4)

5 [实现一个函数，可以正确判断 JS数据类型](#5)



## <span id="1">1 预读文档 </span>

1 [JS专题之 类型判断(上)](https://github.com/mqyqingfeng/Blog/issues/28)

阅读原因: 实现了一个可以判断数据类型的函数

2 [JS专题之 类型判断(下)](https://github.com/mqyqingfeng/Blog/issues/30)

阅读原因: 补充了对空对象、Window对象等 特殊数据类型的判断,不太重要



## <span id="2"> 2 typeof 能否正确判断JS数据类型 </span>

1 Q: typeof 能否正确判断JS数据类型

A: 

S1 typeof能正确判断 基本数据类型，但null除外，typeof null 会返回 "object"

S2 typeof不能判断 引用类型，但function除外，typeof function 会返回 "function"



## <span id="3"> 3 instanceof 能否正确判断JS数据类型 </span>

1 Q: instanceof 能否正确判断JS数据类型

A: 

S1 instanceof 不能正确判断JS数据类型

S2 因为 instanceof只能判断引用类型， 不能判断出基本数据类型:

```js
2 instanceof Number // false

```


## <span id="4"> 4 instanceof 的实现原理是什么 </span>

1 Q: instanceof 的实现原理是什么

A:

S1 instanceof的原理是通过原型链来判断的

S2 假设 A instanceof B,那么会一直通过原型链，查找A.__proto__.proto__....，一直查找到

Object.prototype.__proto__(null), 只要其中有等于 B.prototype的对象，就会返回true

S3 用代码实现instanceof:

```js
function instance_of(L, R){     // L表示左侧对象(实例)，R表示右侧对象参数
  let src = L.__proto__         // 获取左侧的隐式原型
  let target = R.prototype      // 获取右侧的显式原型对象
  
  while(true){
    if (src === null){          // 原型链对象遍历到顶层时
      return false
    }
    if (src === target){        // 与显式对象严格相等时
      return true
    }
    src = src.__proto__         // 递归遍历原型链
  }
}

```


## <span id="5"> 5 实现一个函数，可以正确判断 JS数据类型 </span>

1 Q: 实现一个函数，可以正确判断 JS数据类型

A: 

S1 通过Object.prototype.toString()方法，可以判断JS中 大多数数据类型，返回的值形如`[object Array]`

S2 利用正则，获取类型的字符串

S3 全部转为小写的字符串形式

```js
function detectType(val){
  return Object.prototype.toString.call(val).match(/\w+\s(\w+)/)[1].toLowerCase()  
}

let arr = []
console.log(detectType(arr))    //array
```

