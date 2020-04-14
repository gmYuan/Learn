# JS基础之 数组去重

目录

1 [预读文档](#1)

2 [实现方式](#2)

3 [其他去重相关](#3)


## <span id="1">一  预读文档</span>

01 [阮一峰— Array对象](https://wangdoc.com/javascript/stdlib/array.html)

02 [JavaScript专题之 数组去重](https://github.com/mqyqingfeng/Blog/issues/27)

03 [数组去重12种方案](https://juejin.im/post/5db4572ff265da4d2a4312c3)

阅读原因: 直接参考文档

04 [js字符串去重和数组去重](https://www.jianshu.com/p/3f279c32c576)

05 [JS怎么实现多维数组去重的问题](https://www.zhihu.com/question/46398598)

阅读原因: 第3部分参考文档


## <span id="2">二 实现方式 </span>

Q1: 有哪些方法可以实现 数组去重

A1 双重循环

```js
var array = [1, 2, 1, '1', '1']

function unique(arr) {
  var res = []
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < res.length; j++) {
      if (arr[i] === res[j]) {
        break   // break会 直接退出内层循环，导致 j< res.length
      }
    } // 内层循环

    if (j === res.length){
      res.push(arr[i])
    }

  }  // 外层循环
  return res
}

// 过程分析:
// S1 i=0: j=0, res.length = 0  => 内循环不执行 + 执行push操作, res=[1]
// S2 i=1:
    // j=0, res.length = 1  => 执行内循环 + arr[1] (2)  不等于res[0] (1), 不会触发break
    // j=1, res.length = 1  =>  res=[1,2]

// S3 i=2:
    // j=0, res.length = 2  => 执行内循环 + arr[2] (1)  等于res[0] (1), 触发break
    // 此时 j < res.length ,所以也就不会push到res中

// S4 i=3....
```

A2 外层arr forEach循环 + 内层res IndexOf

```js
let array = [1, 2, 1, "1", "1"]

function unique(arr){
  let res = []
  arr.forEach(member => {
    if (res.indexOf(member) === -1) {
      res.push(member)
    }
  })
  return res
}

console.log(unique(array))  // [1, 2, "1"]

// filter + indexOf
let array = [1, 2, 1, "1", "1"]

function unique(arr){
  let res = arr.filter( (item, index, arrself) => {
    return arr.indexOf(item) === index
  })
  return res
}

console.log(unique(array))
```

A3 浅拷贝+sort数组 + forEach外层拷贝数组遍历

```js
var array = [1, 2, 1, "1", "1"]

function unique(arr){
  let res = []
  let sortArr = arr.concat().sort()  //S1 浅拷贝原数组 + 排序
  sortArr.forEach( (member,index,arrSelf) => {
    if (!index || member !== arrSelf[index-1]){  // 如果是第一个元素/ 相邻的元素不相同
      res.push(member)
    }
  })
  return res
}

console.log(unique(array))  // [1, "1", 2]


// sort排序 + filter
let array = [1, 2, 1, "1", "1"]

function unique(arr){
  let res = arr.concat().sort().filter( (member, index, arrself) => {
    return !index || member !== arrself[index-1]
  })
  return res
}

console.log(unique(array))
```


A4  filter + object键值对方法

```JS
function unique(arr){
  var res = {}
  return arr.filter( (member) => {
    //S1 利用对象方法hasOwnProperty判断 是否已存在原数组值， 存在则返回false以排除重复成员
    //S2 key需要添加 typeof的信息，来区分 string 和 number类型
    //S3 用JSON.stringify 配合typeof,来识别对象是否重复
    return res.hasOwnProperty(typeof member + JSON.stringify(member)) ? false :
    res[typeof member + JSON.stringify(member)] = true
  })
}

console.log(unique(array))  // [1, 2, "1", NaN, {value:1}, {value:2}]
```


A5 new Set() + ...扩展运算符

```js
var array = [1, 2, 1, "1", "1", NaN, {value: 1}, {value: 1}, {value: 2}, NaN]

function unique(arr){
  return [...new Set(arr)]
}

console.log(unique(array))  // [1, 2, "1", NaN, {value: 1}, {value: 1}, {value: 2}]

// 也就是
var res = (arr) => [...new Set(arr)]
```


## <span id="3">三 其他去重相关 </span>

Q1: 有哪些方法可以实现 字符串去重

A:

S1 for循环字符串 + indexOf/search

```js
function removeRepeatStr(str){
  let newStr = ''
  for(let i=0; i<str.len; i++){
    if(newStr.indexOf(str[i]) == -1){
      newStr = newStr + str[i]
    }
  }
  return newStr
}
```

S2 filter + indexOf + join

```js
[].filter.call(str, (item,index,arr)=>
  arr.indexOf(item) === index).join('')
```

Q1: 有哪些方法可以实现 二维数组去重

A:

S1 对象 + Object.values

```js
function unique(arr) {
  let res = {}

  arr.map(item => {
    item.sort((a, b) => a - b);
    res[item] = item;
  })
  return Object.values(res);
}

let matrix = [[1, 2, 3], [2, 3, 4], [1, 2, 3], [5, 6, 7]];
console.log(unique(matrix))
```

S2 对象 + obj.hasOwnProperty

```js
function removeRepeat=function(arr){
  let obj = {}
  
  for(var i=0; i<arr.length; i++){
    // 判断当前项是否遍历过，是则删除，否存入obj以作对照
    if(obj.hasOwnProperty(arr[i])){
      arr.splice(i,1)
      i++;
    }
    obj[arr[i]]=i
  }

  return arr
}
```