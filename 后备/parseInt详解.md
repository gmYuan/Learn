# parseInt详解

## 一 前言

最近学习了parseInt的相关知识点，所以做一个小结。

## 二 数据类型之 Number类型

1 10进制/8进制/16进制的值写法(0/0x)

2 浮点数会尽可能自动转化为整数；
  浮点数的科学计数法表示；
  浮点数的精确度  (浮点数计算误差)

3 数值范围:  Number.MIN_VALUE / Number.MAX_VALUE / isFinite()函数

4 NaN： 操作返回也为NaN / 必不相等 / isNaN()函数

5 数值转化
S1 Number()函数： 适用于任何数据类型 + 转换规则

S2 parseInt()函数:
	用于字符串；
	忽略空格 + 首字符非数字/负号，则返回NaN + 解析至非数字字符；
	可以识别不同进制格式 + 第2个参数就是`转化时使用的基数`;

	PS: 对于 含有科学计数法e的字符串解析，不同浏览器处理结果可能不一致

S3 parseFloat()函数：
	小数点有效 + 忽略前置0 + 只解析10进制 + 可以返回整数，其他和parseInt类似










## 参考文档

[01 JS高级程序设计 第3.4.5](https://book.douban.com/subject/10546125/);
[02 MDN—— paeseInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)