
<!--预读文档: [饿了么官方文档_Pagination分页](https://element.eleme.cn/2.6/#/zh-CN/component/pagination) -->

<template>
  <div>
    <ul>
      <!-- S1 页面内容渲染部分，调试好页面高度等,省略-->
      ......

      <!-- S2 ele分页组件部分 -->
       <el-pagination
         background
         layout="prev, pager, next"

         :total="sysTotal"  <!-- S2.1 所有的数据量,用于告诉ele总共有几个数据   :total/:page-size => 分页器的Index数量 -->
         :page-size="4"

         :current-page="sysCurrentPage"    <!-- S1.1 当前的分页器所在的页数Index,用于传入给@current-change的回调参数 -->
         @current-change="sysChangePage"   <!-- S1.2 sysChangePage默认传入的参数就是:current-page -->
         v-if="systemList.length"
         class="xxx"
       >
       </el-pagination>
    </ul>

    </div>
</template>

<script>

export default {
  name: "Vue+ele实现分页",
  data() {
    return {
      systemList: [],       // S3 从后台获取的列表项数据,用于页面内容渲染
      sysTotal: 0,          // S2 获取到数据总数量
      sysCurrentPage: 1,    // S1 当前页数索引,默认是1, 用于获取 分页Index的对应内容
    }
  },

  methods:{
    //获取系统消息
    getSystem() {
      this.request(this.apis.getApiByKey('NOTICE_API'), {
        type: 0,
        pageIndex: this.sysCurrentPage,   // 传入当前的分页索引
        pageSize: '4'                     // 传入每页的显示数据条数,服务器根据这个返回每次请求的数量
      }).then(res => {
        this.sysTotal = res.totalCount
        this.systemList = res.list
      })
    },

    // 点击分页切换的响应回调
    sysChangePage(currentPage) {          // 把点击的页数Index作为参数传入
      this.sysCurrentPage = currentPage
      this.getSystem()
    },

  },  //对应methods

  mounted() {
    this.getSystem()      //默认自动调用
  }
}
</script>
