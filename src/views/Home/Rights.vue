<template>
    <div>
        <!-- 面包屑导航组件 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="权限名称" prop="rightsName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.rid === 0" type="success">一级</el-tag>
                        <el-tag v-else-if="scope.row.rid === 1">二级</el-tag>
                        <el-tag type="warning" v-else-if="scope.row.rid === 2">三级</el-tag>  
                    </template>
                </el-table-column>
            </el-table>          
        </el-card>
    </div>
</template>

<script>
    import { request } from "@/network/request";
    export default {
        data() {
            return {
                // 权限列表
                rightsList: []
            }
        },
        created() {
            this.getRightsList()
        },
        methods: {
            // 封装一个等待函数，模拟网络请求时间
            setTimeout() {
              return new Promise((res, rej) => {
                setTimeout(() => {
                  res()
                },500)
              })
            },
            // 获取权限列表
            async getRightsList() {
                const loading = this.$loading({
                    lock: true,
                    target: '.el-table',
                    background: 'rgba(0, 0, 0, 0.01)',
                    body: true
                });
                await this.setTimeout()
                const { data: res } = await request({
                  url: "/rights",
                  method: "get",
                });
                if (res.meta.code !== 200) {
                  return this.$message.error("获取用户列表失败！");
                }
                this.rightsList = res.data;
                loading.close()
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>