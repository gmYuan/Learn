# ES6之 字符串扩展详解

## 一 前言

最近学习了《深入理解ES6》第2章的相关知识，所以对其做一个小结。


## 二 字符串扩展

### 2.1  模板字符串

1 基本语法: 
S1 形如 `字符串内容，无需对引号转义`

S2 如果大括号中的值不是字符串，将按照一般的规则转为字符串

S3 如果模板字符串中的变量没有声明，将报错


2 多行字符串
S1 传统方法: + 和 \n 换行符拼接

S2 模板字符串方法: 自动保持 换行和缩进书写效果

```js
let message = `Multiline
string`;

console.log(message);       // "Multiline
                            // string"

console.log(message.length); // 16
```


3 产生替换位
S1 语法: `${任意 JS表达式}`

S2 实例

```js
// 例1
let count = 10,
    price = 0.25,
    message = `${count} items cost $${(count * price).toFixed(2)}.`;

console.log(message); // "10 items cost $2.50."

//例2，替换位可以嵌套使用
let name = "Nicholas",
    message = `Hello, ${
         `my name is ${ name }`
    }.`

console.log(message);    // "Hello, my name is Nicholas."
```


4 标签模板
S1 标签模板语法: 标签名(即函数名)+模板字符串

S2 标签/函数的参数自动处理: 
  (1) 第一个参数是 除了替换位以外的所有 字符串 数组集合;
  (2) 第二个参数是 替换位处理后的 字符串数组集合

S3 第一个参数: 首尾必然有(空)字符串，且每个替换位后会有一个字符串
              所以，其数量必然= 替换位数量 + 1 

S4 内置标签模板String.raw, 可以保留模板字符串原始形式内容
   注意: \的原始形式表示为\\

S5 String.raw的功能 模拟代码：
   literals数组有一个raw属性，它是一个保留原始字符形式的 数组                    

```js
// 例1 标签模板含义和特点
function passthru(literals, ...substitutions) {  //S2
	let result = ""
	for (let i = 0, i < substitutions.length, i++) {    //S3
		result += literals[i]
		result += substitutions[i]
	}
	result += literals[literals.length - 1]       //S3

	return result
}

let price = 0.25,
    amount = 10,
    all = passchru`${amount} items are $${price * amount.tofixed(2).}`;                          //S1 

console.log(all)  // "10 items are $2.50."
```

```js
// 例2 标签模板保留原始信息
let message1 = `two lines\nstrings`,
    message2 = String.raw`two lines\nstrings`        //S4 

console.log(message1);    // "two lines
                          //  strings" 

console.log(message2)     // "two lines\\nstrings"
```

```js
// 例3 String.raw的模拟实现

function raw(literals, ...substitutions) {
	let result = ""
	for (let i = 0 , i < substitutions.length,i++) {
		result += lirerals.raw[i]                     //S5
		result += substitutions[i]
	}

	result += literals.raw[literals.length - 1]
	return result
}

let message = raw`Multiline\nstring`;
console.log(message);         // "Multiline\\nstring"
console.log(message.length);  // 17
```








## 参考文档

[01 深入理解ES6第2章](https://book.douban.com/subject/27072230/)


[02 冴羽 ES6系列之模板字符串](https://github.com/mqyqingfeng/Blog/issues/84)
[03 阮一峰 字符串的扩展](http://es6.ruanyifeng.com/#docs/string)

