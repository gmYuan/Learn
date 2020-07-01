module.exports = {
  title: 'Ygm的博客',
  description: '前端学习',

  base: '/my_learn/',

  themeConfig: {
    sidebar: [
      {
        title: 'HTML&CSS',
        collapsable: false,
        children: [
          '/HTML/'
        ]
      },

      {
        title: 'JS',
        path: "/JS/",
        children: [

          '/JS/JS基础之 数据类型相关',

          // '/JS/JS基础之 垃圾回收详解',
          
         
         
          // '/JS/JS基础之 判断数据类型',
          // '/JS/JS基础之 垃圾回收详解',

          // '/JS/JS基础之 数组去重',

          // '/JS/JS基础之 原型与原型链',
          // '/JS/JS基础之 instanceof模拟实现',


          // '/JS/面向对象之 call+apply模拟实现',
          // '/JS/面向对象之 bind模拟实现',
          // '/JS/面向对象之 对象继承方式',

          // '/JS/DOM之 DOM事件机制',


          // '/JS/ES6之 promise详解',


          // '/JS/模块化之 模块化详解',
        ]
      },

      {
        title: '性能',
        path: "/Performance/",
        children: [
          '/Performance/性能之 防抖和节流',
        
        ]
      },



      {
        title: '浏览器',
        path: "/Browser/",
        children: [
          '/Browser/浏览器之 storage详解'
        ]
      },


      {
        title: 'Vue',
        path: "/Vue/",

        children: [
          '/Vue/Vue之 响应式原理详解',
          '/Vue/Vue之 组件通信详解',
          '/Vue/Vue之 虚拟DOM详解',
          
        ]
      },

      {
        title: 'React',
        path: "/React/",

        children: [
          '/React/React之 官方文档小结',
          
        ]
      },




      {
        title: 'Webpack',
        path: "/Webpack/",

        children: [
          '/Webpack/Webpack之 基础使用',
          '/Webpack/Webpack之 性能优化',
         
          
          // 原理探究
          // 实践参考
          // babel原理深入
        ]
      },

      {
        title: '设计模式',
        path: "/Pattern/",

        children: [
          '/Pattern/Pattern之 原型模式',

          
          '/Pattern/Pattern之 工厂模式',
          '/Pattern/Pattern之 单例模式',
          '/Pattern/Pattern之 适配器模式',
          '/Pattern/Pattern之 装饰器模式',
        ]
      },




      {
        title: '计算机网络',
        path: "/Network/",

        children: [
          '/Network/网络之 TCP&IP详解',

          '/Network/网络之 跨域方法',
          '/Network/网络之 HTTP状态详解',
          '/Network/网络之 浏览器缓存详解',
          '/Network/网络之 HTTP2详解',

        ]
      },



    ]
  }
}