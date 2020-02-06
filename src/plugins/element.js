import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css'; //引入 element-ui 样式表

import { 
    Button,
    Form,
    FormItem,
    Input,
    Message
} from 'element-ui'

Vue.prototype.$message = Message; // 将弹框组件挂载到Vue的原型对象上
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
