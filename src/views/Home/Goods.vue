<template>
  <div>
    <!-- 面包屑导航组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入商品" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe height="473">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品ID" prop="product_id"></el-table-column>
        <el-table-column label="商品名称" prop="detail_name"></el-table-column>
        <el-table-column label="现价(元)" prop="new_price"></el-table-column>
        <el-table-column label="原价(元)" prop="old_price"></el-table-column>
        <el-table-column label="库存(件)" prop="commodity_stocks"></el-table-column>
        <el-table-column label="上架时间">
            <template v-slot="scope">
                {{ scope.row.create_time | timeFormat }}
            </template>
        </el-table-column>
        
        <!-- 操作 -->
        <el-table-column label="操作" width="120">
        <template slot-scope="">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[8, 20, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        hide-on-single-page
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { request } from "@/network/request";
export default {
  data() {
    return {
      // 商品列表
      goodsList: [],
      // 分页查询
      queryInfo: {
        pagenum: 1,
        pagesize: 8
      },
      // 数据总条数
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 封装一个等待函数，模拟网络请求时间
    setTimeout() {
      return new Promise((res, rej) => {
        setTimeout(() => {
          res();
        }, 500);
      });
    },
    // 获取权限列表
    async getGoodsList() {
      const loading = this.$loading({
        lock: true,
        target: ".el-table",
        background: "rgba(0, 0, 0, 0.01)",
        body: true
      });
      await this.setTimeout();
      const { data: res } = await request({
        url: "/goods/getlist",
        method: "get",
        params: this.queryInfo
      });
      if (res.meta.code !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      console.log(res.data);
      this.goodsList = res.data.list;
      this.total = res.data.total
      loading.close();
    },
    // 监听pagesize的改动
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList(); 
    },
    // 监听页码值的改动
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList(); 
    },
  }
};
</script>

<style lang="scss" scoped>
</style>