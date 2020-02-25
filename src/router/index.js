import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [ // 定义路由规则
  {
    path: '/',
    redirect: '/login' // 主页重定向
  },
  {
    path: '/login', component: () => import ('@/views/Login.vue')  // 登录组件
  },
  {
    path: '/home', component: () => import ('@/views/Home.vue'), // 主页组件
    redirect: '/welcome',
    children: [
      {
        path: '/welcome', component: () => import ('@/views/Home/Welcome.vue') //欢迎页组件
      },
      {
        path: '/users', component: () => import ('@/views/Home/Users.vue') //用户列表组件
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/**
 * @param 
 * to 将要访问的路径
 * from 从哪个路径跳转而来
 * next 是一个函数，表示放行 next('/login') 强制跳转到/login页面
 */
// 为路由对象，添加 beforeEach 导航守卫
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 从 sessionStorage 中获取保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
