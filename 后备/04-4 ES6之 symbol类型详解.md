# ES6之 symbol类型详解

目录:

1 [预读文档](#1)

2 [symbol含义 与 作用](#2) 

3 [symbol常用语法 和 内部属性](#3)


## <span id="1"> 1 预读文档 </span>

1 [阮一峰ES6教程_symbol](http://es6.ruanyifeng.com/#docs/symbol)

阅读原因: 直接参考文档


## <span id="2"> 2 symbol含义 与 作用 </span>

1 Q: 什么是symbol

A: S1 ES6引入的一种新的数据类型 + 可以创建独一无二的值


2 Q: symbol有什么作用

A: symbol用作对象的key

S1 因为可以创建独一无二的值，所以可以解决 `对象属性同名冲突/覆盖问题`

S2 symbol用作对象的key: 因为用symbol作为对象的key,不会被 for..in/for..of/object.keys()遍历到，所以可以形成类似 `内部私有属性`的效果

代码分别见下:

```js
// 例1
const allCourseType = {
  English: Symbol()
};

function getCourse(courseType) {
  switch (courseType) {
    case allCourseType.English:
      console.log('这节是英语课')
      break
    ......  
  }
}

getCourse(allCourseType.English)

// 例2
let coin = Symbol('coin')

class Collection {
  constructor() {
    this[coin] = 0
  }

  add(item) {
    this[this[coin]] = item;
    this[coin]++;
  }

  static coinNum(instance) {
    return instance[size];
  }
}

let x = new Collection()
Collection.coinNum(x)     // 0

x.add('foo');
Collection.coinNum(x)     // 1

Object.keys(x)                    // ['0']
Object.getOwnPropertyNames(x)     // ['0']
Object.getOwnPropertySymbols(x)   // [Symbol(coin)]
```


## <span id="3"> 3 symbol常用语法 和 内部属性 </span>

1 Q: symbol常用语法有哪些

A: 具体见参考文档即可
