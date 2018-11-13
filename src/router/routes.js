export default [
    {
        path: '/',
        name: 'home',
        // component: () => import('@/view/home/home')
        components : {
            default: () => import('@/view/home/home'),
            // NoDataIndex : () => import('@/view/noData')
            // MyOrg : () => import('@/view/myOrg/MyOrg'),
            // CommonHeader : () => import('@/view/home/namedRoutes/header')
        },
        meta : {
            // NoDataIndex : true,
            // contentShow : true,
            // contentName : 'NoDataIndex'
            showName: ''
        },
        children : [
            {
                name     : 'NoDataIndex',
                path     : 'NoDataIndex',
                component: () => import('@/view/noData')
            },
            // {
            //     name : 'MyOrg',
            //     path : 'MyOrg',
            //     component : () => import('@/view/myOrg/MyOrg')
            // }
        ]
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title     : 'Login - 登录',
            hideInMenu: true
        },
        component: () => import('@/view/login/login')
        // components : {
        //     default : () => import('@/view/login/login'),
        //     home : () => import('@/view/home/home')
        // }
    },
    {
        path: '/abc',
        name: 'abc',
        meta: {
            title     : 'Login - 登录',
            hideInMenu: true
        },
        component: () => import('@/view/login/abc')
        // components : {
        //     default : () => import('@/view/login/login'),
        //     home : () => import('@/view/home/home')
        // }
    }
]
