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
          <el-input
            placeholder="请输入用户名"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            @input="changeInput"
          >
            <el-button slot="append" icon="el-icon-search" @click="getLikeUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe height="473">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色">
          <template v-slot="scope">{{ scope.row.rid | roleFormat }}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.user_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="changeRoleById(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="432px" @close='addDialogClosed'>
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="userFormRules"
        ref="addFormRef"
        label-width="70px"
        hide-required-asterisk>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密　码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮　箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角　色" prop="rid">
           <el-radio-group v-model="addForm.rid" class="radio_group">
            <el-radio border label="用　户"></el-radio>
            <el-radio border label="管理员"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" >
        <el-button type="primary" @click="addUser">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="432px" @close='editDialogClosed'>
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="userFormRules"
        ref="editFormRef"
        label-width="70px"
        hide-required-asterisk>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮　箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" >
        <el-button type="primary" @click="editUser">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

     <!-- 分配权限的对话框 -->
    <el-dialog title="分配角色" :visible.sync="changeRoleDialog" width="432px" @close='changeRolesClosed'>
      <!-- 内容主体区域 -->
      <el-form
        :model="changeRoleForm"
        label-width="120px"
        hide-required-asterisk>
        <el-form-item label="当前用户名">
          {{ changeRoleForm.username }}
        </el-form-item>
        <el-form-item label="当前的角色">
          {{ changeRoleForm.rid | roleFormat }}
        </el-form-item>
        <el-form-item label="分配新角色">
          <el-select v-model="currentRole" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" >
        <el-button type="primary" @click="changeRid">确 定</el-button>
        <el-button @click="changeRoleDialog = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { request } from "@/network/request";
export default {
  data() {
    // 自定义手机号验证方式
    const checkPhone = (rule, value, callback) => {
        const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8
      },
      // 用户列表数据
      userList: [],
      // 用户列表数
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        mobile: '',
        email: '',
        rid: '用　户'
      },
      // 修改用户的表单数据
      editForm: {},
      // 分配角色的表单数据
      changeRoleForm: {},
      // 添加表单的验证规则对象
      userFormRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度应为3-10个字符',trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度应为6-15个字符',trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: checkPhone, message: '请输入正确的手机号',trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 控制分配角色对话框的显示与隐藏
      changeRoleDialog: false,
      // 分配角色选择器
      roles: [{
          value: 0,
          label: '用户'
        }, {
          value: 1,
          label: '管理员'
      }],
      // 选择器的value
      currentRole: '',
      // 当前分配的角色
      resetRole:''
    };
  },
  created() {
    this.getUserList();
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
    // 请求用户列表数据
    async getUserList() {
      const loading = this.$loading({
          lock: true,
          target: '.el-table',
          background: 'rgba(0, 0, 0, 0.01)',
          body: true
      });
      await this.setTimeout()
      const { data: res } = await request({
        url: "/users",
        method: "get",
        params: this.queryInfo
      });
      if (res.meta.code !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      loading.close()
    },
    // 监听pagesize的改动
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList(); 
    },
    // 监听页码值的改动
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList(); 
    },
    // 模糊搜索用户
    getLikeUser() {
      this.queryInfo.pagenum = 1;
      this.getUserList(); 
    },
    // 输入框值为空时，获取全部数据
    changeInput(value) {
      if (value === "") {
        this.getUserList();
      }
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听分配角色对话框的关闭事件
    changeRolesClosed() {
      this.currentRole = ''
      this.changeRoleForm.rid = this.resetRole
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async vaild => {
        if (!vaild) return this.$message.error("请输入正确的信息")
        // 可以发起添加用户的网络请求
        const { data: res } = await request({
          url: "/users",
          method: "post",
          data: this.addForm
        });
        if (res.meta.code !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg)
        // 关闭弹出框
        this.addDialogVisible = false
        // 重新获取页面数据
        this.getUserList()
      })
    },
    // 点击修改按钮，显示修改用户对话框
    async showEditDialog(id) {
      // 向后台发送请求根据id拿到该条数据
      const { data: res } = await request({
         url: "/edit",
         method: "get",
         params: {id}
      });
      if (res.meta.code !== 201) return this.$message.error(res.meta.msg);
      this.editForm = res.data
      // 显示修改用户对话框
      this.editDialogVisible = true
    },
    // 发送已经修改好的用户信息
    editUser() {
      this.$refs.editFormRef.validate(async vaild => {
        if (!vaild) return this.$message.error("请输入正确的修改信息")
        // 发起修改信息的网络请求
        const { data: res } = await request({
          url: "/edit",
          method: "post",
          data: this.editForm
        });
        if (res.meta.code !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg)
        // 重新请求数据
        this.getUserList()
        // 关闭弹出框
        this.editDialogVisible = false
      })
    },
    // 发送删除用户的请求
    async removeUserById(id) {
      // 发送验证用户权限的请求
      const { data: vaild } = await request({
        url: `/verify/${id}`,
        method: 'get',
      });
      // 权限不够或者是当前用户
      if (vaild.meta.code !== 200) return this.$message.error(vaild.meta.msg)
      // 弹框询问是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          cancelButtonClass: 'btn-cancel'
      }).catch(err => err)
      // 如果用户确认删除，返回值为字符串 confirm
      // 如果用户取消删除，返回值为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消了删除')
      const { data: res } = await request({
        url: `/del/${id}`,
        method: "get",
      });
      if (res.meta.code !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    // 显示分配权限
    async changeRoleById(data) {
      // 发送验证用户权限的请求
      const { data: vaild } = await request({
        url: `/verify/${data.id}`,
        method: 'get',
      });
      // 权限不够或者是当前用户
      if (vaild.meta.code !== 200) return this.$message.error(vaild.meta.msg)
      this.changeRoleForm = data
      this.resetRole = data.rid
      this.changeRoleDialog = true
    },
    // 分配权限
    async changeRid() {
      this.changeRoleForm.rid = this.currentRole
      const { data: res } = await request({
        url: `/role`,
        method: "get",
        params: this.changeRoleForm
      });
      if (res.meta.code !== 201) {
        this.changeRoleDialog = false;
        return this.$message.error(res.meta.msg);
      }
        this.$message.success(res.meta.msg)
        // 重新请求数据
        this.getUserList()
        // 关闭弹出框
        this.changeRoleDialog = false
    }
  }
};
</script>

<style lang="scss" scoped>
.radio_group {
  display: flex;
  justify-content: space-around;
  padding: 0 60px
}
</style>