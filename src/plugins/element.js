import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css'; //引入 element-ui 样式表

import { 
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    Radio,
    RadioGroup,
    MessageBox,
    Loading,
    Select,
    Option,
    Tag,
    Popover,
    Cascader,
    Dropdown,
    DropdownItem,
    Avatar,
    DropdownMenu
} from 'element-ui'

Vue.prototype.$message = Message; // 将弹框组件挂载到Vue的原型对象上
Vue.prototype.$confirm = MessageBox.confirm; // 将弹框组件挂载到Vue的原型对象上
Vue.prototype.$loading = Loading.service; // 将加载组件挂载到Vue的原型对象上
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Popover)
Vue.use(Cascader)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(Avatar)
Vue.use(DropdownMenu)