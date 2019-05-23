# transtion的appear+type+duration和animition

目录:

1 [预读文档](#1)

2 [transtion + animition的效果配置](#2)


## <span id="1">1 预读文档 </span>

1 [官方文档_ 进入/离开&列表过渡](https://cn.vuejs.org/v2/guide/transitions.html)

阅读原因: 直接参考文档

2 [transtion的appear+type+duration和animition](https://github.com/gmYuan/my_learn/blob/master/Vue/code/13%20transtion%E7%9A%84appear%2Btype%2Bduration%E5%92%8Canimition.html)

阅读原因: 示例代码文件


## <span id="2">2 transtion + animition的效果配置 </span>

1 Q: 为什么要引入 transtion + animition

A1:
S1 让元素/组件的 切换效果体验更好，效果更佳丰富


2 Q: 怎么配置transtion + animition

A:
S1 引入animition库

S2 同时使用 transition + animition

S3 定义/引用 transition + animition效果

S4 设置相效果配置: 

&emsp;&emsp;S4.1 页面初始渲染时就使用 动画效果: appear + appear-active-class 

&emsp;&emsp;S4.2 规定使用哪种效果定义的时长: type

&emsp;&emsp;S4.3 更加细化的自定义进入/离开的时长: duration

具体代码，可参考预读文档