# script defer和async区别

目录:

1 [预读文档](#1)

2 [defer和async区别](#2)


## <span id="1"> 1 预读文档 </span>

1 [defer和async的区别](https://segmentfault.com/q/1010000000640869)

阅读原因: 最佳参考文档


## <span id="2"> 2 defer 和 async 区别 </span>

1 script: 读取到script文件时: 停止HTML渲染 + 立刻下载script + 立刻执行script + 继续HTML渲染

2 script async: 在HTML渲染时并行下载JS文件 + 下载好后立刻执行JS文件 + 执行完成后继续HTML渲染

3 script defer: 在HTML渲染时并行下载JS文件 + 完成所有HTML渲染后，才会执行JS文件

4 最后，一图胜千言:

![script defer 和 script async](https://image-static.segmentfault.com/28/4a/284aec5bb7f16b3ef4e7482110c5ddbb_articlex)