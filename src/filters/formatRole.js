import Vue from 'vue'

Vue.filter('roleFormat', value => {
    if (value === 0) {
        return '用户'
    } else if (value === 1) {
        return '管理员'
    } else if (value === 2) {
        return '超级管理员'
    }
})
