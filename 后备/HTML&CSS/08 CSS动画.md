# CSS动画

目录

1 [预读文档](#1)

2 [transition 和 animation 属性的区别](#2)

 

## <span id="1"> 1 预读文档 </span>

阅读文档

1 [CSS动画简介](http://www.ruanyifeng.com/blog/2014/02/css_transition_and_animation.html)

阅读原因: CSS动画介绍入门

2 [MDN— 使用transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)

阅读原因: 语法含义实例介绍都很易懂

3 [MDN— 使用animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations/Using_CSS_animations)

阅读原因: 动画属性值含义举例介绍

4 [CSS动画：animation、transition、transform、translate傻傻分不清](https://juejin.im/post/5b137e6e51882513ac201dfb)

阅读原因: transition 和 animation的介绍


## <span id="2"> 2 transition 和 animation 属性的区别 </span>


1 Q: transition 和 animation 有什么区别

A: 

S1 语法不同 
  
transition的属性值有4个，分别表示: 需要添加过渡效果的属性 / 过渡效果时长 / 过渡效果函数 / 过渡延迟时间

animation的属性值有8个，分别表示: 

  定义的动画效果名称 / 动画时长 / 动画效果函数 / 动画延迟时间 / 动画重复次数 
  
  动画结束后再次运行的方向 / 动画结束后的静止模式 / 动画的暂停和继续


S2 transition需要事件触发，而animation只要定义动画名 即可在元素上应用

S3 transition是一次性的，不能重复发生(除非一再触发),而 animation可以设置无限触发

S4 transition只能定义开始状态和结束状态，不能定义中间状态，而 animation可以定义多个中间状态

  
