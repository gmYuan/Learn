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
        title: '浏览器',
        path: "/Browser/",
        children: [
          '/Browser/浏览器之 storage详解'
        ]
      },


      {
        title: '计算机网络',
        path: "/Network/",

        children: [
          '/Network/网络之 HTTP状态详解',

          '/Network/网络之 浏览器缓存详解',
         
          '/Network/网络之 HTTP2详解',
        ]
      },



    ]
  }
}