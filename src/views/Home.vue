<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div class="logo">
        <img src="@/assets/mi_logo.png" alt />
        <span>小米商城后台管理系统</span>
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar
            size="small"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
          <span style="margin-left:6px;">{{profileInfo}}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-s-promotion" @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '60px' : '200px'">
        <!-- 折叠与展开 -->
        <div class="toggle-button" @click="toggleCollapse">
          <i :class="isCollapse ? 'iconfont icon-jiantou' : 'iconfont icon-xiazai6'"></i>
        </div>
        <el-menu
          background-color="#f2f2f2"
          active-text-color="#ff6700"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="String(item.id)" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.path]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="`/${String(subItem.path)}`"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
        <div class="wrap1"></div>
        <img src="../assets/home-office-4980353.jpg" alt />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { request } from "@/network/request";
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 图标库
      iconObj: {
        users: "iconfont icon-users",
        rights: "iconfont icon-lifangtilitiduomiantifangkuai2",
        goods: "iconfont icon-gouwu",
        orders: "iconfont icon-dingdan",
        reports: "iconfont icon-tongji"
      },
      // 折叠与展开
      isCollapse: false,
      // 用户头像的箭头的方向
      icon_flag: true,
      profileInfo: ""
    };
  },
  created() {
    this.getMenuList(), this.getUsername();
  },
  methods: {
    // 展示个人中心
    showProfile() {
      this.icon_flag = !this.icon_flag;
    },
    // 点击退出
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取用户名信息
    async getUsername() {
      const { data: res } = await request({
        url: "/getusername",
        method: "get"
      });
      // 错误弹出提示消息
      if (res.meta.code !== 200) return this.$message.error("获取用户信息失败");
      this.profileInfo = res.data;
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await request({
        url: "/menus",
        method: "get"
      });
      // 错误弹出提示消息
      if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style lang="scss" scoped>
.home_container {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ff6700;
    .logo {
      display: flex;
      align-items: center;
      font-size: 20px;
      color: #fff;
      img {
        width: 60px;
        padding-right: 40px;
      }
    }
    .el-dropdown-link {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #fff;
        cursor: pointer;
    }
  }
  .el-container {
    .el-aside {
      background-color: #f2f2f2;
      .toggle-button {
        height: 56px;
        text-align: center;
        line-height: 56px;
        cursor: pointer;
      }
      .el-menu {
        // 去掉边框线
        border-right: none;
      }
    }
    .el-main {
      position: relative;
      overflow: hidden;
      .wrap1 {
        z-index: -1;
        left: 0;
        top: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
      }
      img {
        top: 0;
        left: 0;
        z-index: -2;
        position: absolute;
        width: 100%;
        filter: blur(4px);
      }
    }
  }
}
// 图标
.iconfont {
  margin-right: 10px;
}
</style>