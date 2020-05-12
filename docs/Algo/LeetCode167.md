# LeetCode167

## 题目描述

给定一个已按照升序排列 的有序数组，找到两个数使得它们相加之和等于目标数。

函数应该返回这两个下标值 index1 和 index2，其中 index1 必须小于 index2。

说明:

返回的下标值（index1 和 index2）不是从零开始的。
你可以假设每个输入只对应唯一的答案，而且你不可以重复使用相同的元素。
示例:

```JS
输入: numbers = [2, 7, 11, 15], target = 9
输出: [1,2]
解释: 2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。
```

## 参考文档

[01 双指针实现](https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/solution/shuang-zhi-zhen-by-fejwong/)


## 思维技巧

![双指针思想](https://s1.ax1x.com/2020/05/12/YU1n8H.md.png)


## 代码实现

```js
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
  let head = 0, tail = numbers.length-1
  while (head < tail) {
      let addValue = numbers[head] + numbers[tail]
      if (addValue === target) return [head+1, tail+1]
      // 和比目标值小时，增大最小值 + 和比目标值大时，减小最大值
      addValue < target ? head++ : tail--
  }

  return
}
```