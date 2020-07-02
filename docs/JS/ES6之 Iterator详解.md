## ES6之 Iterator详解


### <span id="1"> 1 预读文档 </span>

1 [这一次，彻底理解 ES6 Iterator](https://juejin.im/post/5dd3540df265da0c0a143f5d)

2 [Iterator 和 for...of 循环](http://es6.ruanyifeng.com/#docs/iterator)

阅读原因: 迭代器部分 参考文档


3 [ES6 系列之迭代器与 for of](https://github.com/mqyqingfeng/Blog/issues/90)

阅读原因: 实现 for...of源码 参考文档


### <span id="2"> 2 迭代器 </span>

1 Q: 什么是迭代器(Iterator)

A:

A1 迭代器: 具有next()方法的对象 + next()返回一个 具有value和done属性的 对象

```ts
interface Iterator {
  next(value?: any) : IterationResult,
}

interface IterationResult {
  value: any,
  done: boolean,
}
```

用代码模拟实现 迭代器:

```js
function createIterator(items) {
  let i = 0
  return {
    next() {
      let done = (i >= items.length)
      let value = (done ? undefined : items[i++])
      return {
        value,
        done
      }
    }
  }
}

let iterator = createIterator([1, 2, 3])
console.log(iterator.next())          // "{ value: 1, done: false }"
console.log(iterator.next())         // "{ value: 2, done: false }"
console.log(iterator.next())         // "{ value: 3, done: false }"
console.log(iterator.next())        // "{ value: undefined, done: true }"
// 之后的所有调用
console.log(iterator.next())       // "{ value: undefined, done: true }"
```


2 Q: 什么是可迭代对象(Iterable), 它有什么特点

A: 在JS中, 只要一个对象A部署了[symbol.itetaor]方法 + 该方法返回的是Iterator, 那么对象A就是一个 可迭代对象

用TS表示为
```ts
interface Iterable {
  [Symbol.iterator]() : Iterator,
}
interface Iterator {
  next(value?: any) : IterationResult,
}
interface IterationResult {
  value: any,
  done: boolean,
}
```

可迭代对象的特点是: 可以通过`for...of语法` 访问其对象的内部数据
```js
let iterableObj = {
  items: [100,200,300],

  [Symbol.iterator](){
    let self=this
    let i = 0
    return {
      next() {
        let done = (i >= self.items.length)
        let value = (!done ? self.items[i++] : undefined)
        return {
          done,
          value
        }
      }
    }
  }
}

//遍历
for(let item of iterableObj){
  console.log(item)       //100,200,300
}
```


3 Q: 有哪些语法操作会默认调用 迭代器next()方法

A: 解构赋值 / 扩展运算符 / for...of / Array.from() / yield* 等


4 Q: 迭代器对象除了next()方法，还能有哪些方法

A: 还可以有 `return()方法` + `throw方法`  ==>  `用于中断 迭代器`

retrun()方法在 遍历迭代器过程中 中止(break) / 报错(throw Error)时, 就会调用return方法 + return方法要返回一个对象

```js
function readFile(file) {
  [Symbol.iterator]() {

    return {
      next() {
        return {done: false}
      }
      // 迭代器对象的return方法
      return() {
        return {done: true}
      }
    }

  }
}
```


### <span id="3"> 3 for...of实现 </span>

1 Q: 模拟实现for...of的过程

A: S1 可迭代对象判断 + 回调函数判断

S2 自动调用 对象的迭代器方法 + 依次执行 next方法

```JS
function forOf(obj, cb) {
  let _iterator, _step

  if (typeof obj[Symbol.iterator] !== 'function') {
    throw new TypeError(obj + 'is not iterable')
  }
  if (typeof cb !== 'function') {
    throw new TypeError('cb must be callable')
  }

  _iterator = obj[Symbol.iterator]()
  _step = _iterator.next()

  while (!_step.done) {
    cb(_step.value)
    _step = _iterator.next()
  }
}
```