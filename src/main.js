import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'; // 引入element的配置文件
import './global_css/normalize.css' // 引入样式重置文件
import './global_css/global.css' // 引入全局样式表
import './assets/icons/iconfont.css' // 引入图标库
import './filters/formatRole' // 引入过滤器

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
