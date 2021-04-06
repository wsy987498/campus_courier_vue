import Vue from 'vue';

// import vue-router
import Router from 'vue-router';

//登录页面
const Login = () =>
    import( /* webpackChunkName: "Login" */ '../views/Login.vue')

//404页面
const Notfound = () =>
    import( /* webpackChunkName: "404" */ '../views/404.vue')

//Home
const Home = () =>
    import( /* webpackChunkName: "Home" */ '../views/Home.vue')

//Analysis
const Analysis = () =>
    import( /* webpackChunkName: "Analysis" */ '../views/analysis/Analysis.vue')


//userlist
const userlist = () =>
    import( /* webpackChunkName: "userlist" */ '../views/user/userlist.vue')

//expresslist
const expresslistfinish = () =>
    import( /* webpackChunkName: "userlist" */ '../views/express/expresslistfinish.vue')

const expresslist = () =>
    import( /* webpackChunkName: "userlist" */ '../views/express/expresslist.vue')
const expresslist_isReceving = () =>
    import( /* webpackChunkName: "userlist" */ '../views/express/expresslist_isReceving.vue')
const expresslist_isDeliving = () =>
    import( /* webpackChunkName: "userlist" */ '../views/express/expresslist_isDeliving.vue')


//Updatepwd
const Updatepwd = () =>
    import( /* webpackChunkName: "Updatepwd" */ '../views/setting/Updatepwd.vue')



// use vue-router
Vue.use(Router);

// 3、实例化并且配置
const router = new Router({
    mode: 'history',
    routes: [{
        path: '/',
        redirect: '/login' //重定向
    }, {
        name: 'login', //登录页面
        path: '/login',
        component: Login

    }, {
        name: 'home', //welcome
        path: '/home',
        component: Home,
        redirect: '/analysis', //重定向
        children: [{
            name: 'analysis', //analysis页面
            path: '/analysis',
            component: Analysis
        }, {
            name: 'userlist', //userlist页面
            path: '/userlist',
            component: userlist
        }, {
            name: 'updatepwd', //updatepwd页面
            path: '/updatepwd',
            component: Updatepwd
        }, {
            name: 'expresslistfinish',
            path: '/expresslistfinish',
            component: expresslistfinish
        },
        {
            name: 'expresslist',
            path: '/expresslist',
            component: expresslist
        },
        {
            name: 'expresslist_isReceving',
            path: '/expresslist_isReceving',
            component: expresslist_isReceving
        },
        {
            name: 'expresslist_isDeliving',
            path: '/expresslist_isDeliving',
            component: expresslist_isDeliving
        }
        ]
    },
    {
        name: '404', //welcome
        path: '*',
        component: Notfound,
    }

    ]
});

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    const token = window.sessionStorage.getItem('token');
    //如果没有token登录状态，后面的api接口是不允许访问的
    if (!token) return next('/login');
    next();
});

export default router;