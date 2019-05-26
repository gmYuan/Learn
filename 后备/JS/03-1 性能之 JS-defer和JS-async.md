# 性能之 JS-defer 和 JS-async

目录:

1 [预读文档](#1)

2 [JS-defer 和 JS-async](#2)



## <span id="1">1 预读文档 </span>

1 [彻底搞懂 async & defer](https://github.com/xiaoyu2er/blog/issues/8)

阅读原因: 文字介绍和总结很好

2 [defer和async的区别](https://segmentfault.com/q/1010000000640869)

阅读原因: 图像生动



## <span id="2"> 2 JS-defer 和 JS-async </span>

1 Q: JS-defer 和 JS-async的区别

A:

S1 普通JS引入:   

&emsp;&emsp; 立刻下载，堵塞HTML的解析 + 下载完成后立刻执行，仍然堵塞HTML的解析


S2 JS-defer引入: 
 
&emsp;&emsp;并行下载，不堵塞HTML的解析 + 下载完成后，会等到HTML解析后，HTML渲染前执行JS;

&emsp;&emsp;多个JS-defer时 理论上会按写入属性执行JS，但实际并不严格按序执行

&emsp;&emsp;所以最佳实践是 只引入一个JS-defer文件

                  
S3 JS-async引入: 

&emsp;&emsp;并行下载，不堵塞HTML的解析 + 下载完成后，立刻执行JS文件

&emsp;&emsp;多个JS-async时 按下载好的顺序执行JS

&emsp;&emsp;所以最佳实践是 对于无任何依赖的JS文件使用 JS-async


S4 具体可参考下图:

![图形对比介绍](https://image-static.segmentfault.com/28/4a/284aec5bb7f16b3ef4e7482110c5ddbb_articlex)






