import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'; // 引入element的配置文件
import './global_css/normalize.css' // 引入样式重置文件
import './global_css/global.css' // 引入全局样式表
import './assets/icons/iconfont.css' // 引入图标库
import './filters/formatRole' // 引入角色过滤器
import './filters/formatTime' // 引入时间过滤器
import treeTable from 'vue-table-with-tree-grid' // 引入分级表格组件

Vue.config.productionTip = false

// 全局注册分级表格组件
Vue.component('tree-table', treeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
