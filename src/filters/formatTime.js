import Vue from 'vue'
import moment from 'moment' // 时间格式化插件

Vue.filter('timeFormat', (dataStr, pattern = "YYYY-MM-DD HH:mm:ss") => {
    return moment(dataStr).format(pattern)
})