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
                component: () => import('@/view/noData'),
                children : [
                  {
                    name : 'CreatePerson',
                    path : 'CreatePerson',
                    component : () => import('@/view/noData/create/CreatePerson')
                  },
                  {
                    name : 'CreateMerchant',
                    path : 'CreateMerchant',
                    component : () => import('@/view/noData/create/CreateMerchant')
                  },
                  {
                    name : 'CreateLegal',
                    path : 'CreateLegal',
                    component : () => import('@/view/noData/create/CreateLegal')
                  }
                ]
            },
            {
              name : 'CheckList',
              path : 'CheckList',
              components: {
                default : () => import('@/view/CheckPending/CheckList.vue')
              }
            },
            // {
            //     name : 'MyOrg',
            //     path : 'MyOrg',
            //     component : () => import('@/view/myOrg/MyOrg')
            // }
            {
                name     : 'userReview',
                path     : 'userReview',
                component: () => import('@/view/userReview/userReview')
            },
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
]
