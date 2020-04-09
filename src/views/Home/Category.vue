<template>
  <div>
    <!-- 面包屑导航组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        stripe
        max-height="520"
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.flag === 1" style="color: rgb(32, 178, 170);"></i>
          <i class="el-icon-error" v-else-if="scope.row.flag === 0" style="color: red"></i>
        </template>
        <!-- 等级 -->
        <template slot="level" slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.cindex === 1">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cindex === 2">二级</el-tag>
          <el-tag type="warning" size="mini" v-else-if="scope.row.cindex === 3">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCateClick(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delCateClick(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[8, 10, 12, 16]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        hide-on-single-page
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="432px" @close="addCateClosed">
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cate_name">
          <el-input v-model="addCateForm.cate_name" placeholder="必填项"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <div class="block">
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged"
              style="width:272px"
              clearable
              placeholder="若不选则默认添加一级分类"
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button type="primary" @click="addCate">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" @close="editCateClosed">
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="editCateForm.cate_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button type="primary" @click="editCate">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from "../../network/request";
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 分页查询
      queryInfo: {
        pagenum: 1,
        pagesize: 8
      },
      // 总数据条数
      total: 0,
      // 为tree-table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "category_name"
        },
        {
          label: "是否有效",
          // 表示当前列定义为模版列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "isok"
        },
        {
          label: "等级",
          // 表示当前列定义为模版列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "level"
        },
        {
          label: "操作",
          // 表示当前列定义为模版列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "opt"
        }
      ],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加分类的数据
      addCateForm: {
        // 将要添加的分类的名称
        cate_name: "",
        // 分类的父id
        cate_rid: 0,
        // 分类的等级
        cate_cindex: 1
      },
      // 添加分类的验证规则
      addCateFormRules: {
        cate_name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "id",
        label: "category_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      },
      // 选中父级的id数组
      selectedKeys: [],
      // 修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改分类对象
      editCateForm: {
        cate_name: ""
      }
    };
  },
  created() {
    this.getCateList();
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
    async getCateList() {
      const loading = this.$loading({
        lock: true,
        target: ".el-table",
        background: "rgba(0, 0, 0, 0.01)",
        body: true
      });
      await this.setTimeout();
      const { data: res } = await request({
        url: "/categories/getlist",
        method: "get",
        params: this.queryInfo
      });
      console.log(res.data);
      if (res.meta.code !== 200)
        return this.$message.error("获取分类列表失败！");
      this.cateList = res.data.first;
      this.total = res.data.total;
      loading.close();
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagepage改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 添加对话框的显示
    showAddDialog() {
      // 先获取父级分类列表
      this.getParentCateList();
      this.addDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await request({
        url: "/categories/getrid",
        method: "get"
      });
      if (res.meta.code !== 200)
        return this.$message.error("获取分类列表失败！");
      this.parentCateList = res.data;
    },
    // 级联选择器数据改变
    parentCateChanged() {
      // 等于0 代表没有选父级分类
      if (this.selectedKeys.length === 0) {
        this.addCateForm.cate_rid = 0;
        this.addCateForm.cate_cindex = 1;
      } else if (this.selectedKeys.length === 1) {
        this.addCateForm.cate_rid = this.selectedKeys[0];
        this.addCateForm.cate_cindex = 2;
      } else if (this.selectedKeys.length === 2) {
        this.addCateForm.cate_rid = this.selectedKeys[1];
        this.addCateForm.cate_cindex = 3;
      }
    },
    // 添加分类的确定键
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await request({
          url: "/categories/add",
          method: "post",
          data: this.addCateForm
        });
        if (res.meta.code !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        this.getCateList();
        this.addDialogVisible = false;
      });
    },
    // 监听添加对话框的关闭事件
    addCateClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cate_cindex = 1;
      this.addCateForm.cate_rid = 0;
    },
    // 点击修改
    editCateClick(data) {
      this.editCateForm.cate_name = data.category_name;
      this.editDialogVisible = true;
      this.editCateForm.id = data.id;
      this.editCateForm.cindex = data.cindex;
    },
    // 监听修改对话框的关闭事件
    editCateClosed() {
        this.$refs.editCateFormRef.resetFields();
    },
    //  点击修改后的确定
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await request({
          url: "/categories/edit",
          method: "post",
          data: this.editCateForm
        });
        if (res.meta.code !== 200) {
          return this.$message.error("修改分类失败");
        }
        this.$message.success(res.meta.msg);
        this.getCateList()
        this.editDialogVisible = false;
      });
    },
    // 删除分类
    async delCateClick(data) {
        const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          cancelButtonClass: 'btn-cancel'
      }).catch(err => err)
      // 如果用户确认删除，返回值为字符串 confirm
      // 如果用户取消删除，返回值为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消了删除')
      const { data: res } = await request({
        url: `/categories/del`,
        method: "post",
        data: {
            id: data.id,
            cindex: data.cindex
        }
      });
      if (res.meta.code !== 200) return this.$message.error("删除失败")
      this.$message.success(res.meta.msg)
      this.getCateList()
    }
  }
};
</script>

<style lang="scss" scoped>
.zk-table {
  margin-top: 15px;
}
</style>