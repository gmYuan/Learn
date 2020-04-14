# JS基础之 判断数据类型

目录:

1 [预读文档](#1)

2 [实现 类型判断函数](#3)

3 [判断变量是否是 数组类型](#2)


## <span id="1">1 预读文档 </span>

1 [JS专题之 类型判断(上)](https://github.com/mqyqingfeng/Blog/issues/28)

阅读原因: 直接参考文档


## <span id="2"> 2 实现 类型判断函数 </span>

1 Q: 写一个函数，可以实现变量的 类型判断

A:

S1 判断基本类型, 可以使用 typeof操作符: `String/Number/Boolean/undefined` + function + object(null)

S2 判断引用类型, 可以使用 Object.prototype.toString操作符:  返回形式例为`[object Date]`

S3 具体思路为: 生成类型映射对象 + 兼容IE6单独判断null/undefined + 根据typeof/object.pty.toString()返回对应数据类型


代码实现如下:

```js
function type(val) {
  return Object.prototype.toString.call(val).toLowerCase().split(' ')[1].slice(0,-1)
}

// test case
let str = "123"
type(str)             // "string"
```

具体一点的实现方法为:

```js
let typeObjMap = {}
"String Number Boolean Null Undefined Array Function Object Error Date RegExp".split(" ").map((item) => {
  typeObjMap['[object ' + item + ']'] = item.toLowerCase()
})

console.log(typeObjMap)

function getVariableType(o) {
  if (o == null) {
    return '' + o
  }
  let result = (typeof o === 'object' || typeof o === 'function' ? typeObjMap[Object.prototype.toString.call(o)] || 'object' : typeof o)
  return result
}

// test case
let arr = [1, 2]
getVariableType(arr)  // array
```


## <span id="3"> 3 判断变量是否是 数组类型 </span>

1 Q: 如何判断变量是否是数组类型

A:

S1 通过Array.isArray()方法

S2 通过instanceof

S3 通过Objdect.prototype.toString.call()方法

S4 通过constructor，如果xx是数组，那么 xx.constructor === Array

```js
function fn() {
  console.log(Array.isArray(arguments))   //false 因为arguments是类数组，不是数组
  console.log(Array.isArray([1,2,3,4]))   //true

  console.log(arguments instanceof Array) //fasle
  console.log([1,2,3,4] instanceof Array) //true

  console.log(Object.prototype.toString.call(arguments)) //[object Arguments]
  console.log(Object.prototype.toString.call([1,2,3,4])) //[object Array]

  console.log(arguments.constructor === Array) //false
  arguments.constructor = Array
  console.log(arguments.constructor === Array); //true
```
