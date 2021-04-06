import Vue from 'vue'
import App from './App.vue'
import router from './router'
import qs from 'qs'
// 导入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// use 全局样式
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// use element ui 
import './plugins/element.js'

//use axios 
import axios from 'axios'

//使用echarts
import echarts from 'echarts'
require('echarts/map/js/china')
Vue.prototype.$echarts = echarts

//配置请求的根路径
// axios.defaults.baseURL = 'http://localhost:9000/admin/' //本地环境
axios.defaults.baseURL = 'http://39.108.117.83/admin/' //上线地址
axios.interceptors.request.use(config => {
    NProgress.start();
    config.headers.Authorization = window.sessionStorage.getItem('token');
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if (config.method === 'post') {
        config.data = qs.stringify({
            ...config.data
        })
    }
    return config;
})
axios.interceptors.response.use(config => {
    NProgress.done();
    return config;
})
//将axios挂载到vue原型上 便于通过this.$axios 发起请求
Vue.prototype.$axios = axios


Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')