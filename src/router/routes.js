export default [
    {
        path: '/',
        name: 'home',
        components : {
            default: () => import('@/view/home/home'),
        },
        meta : {
            showName: ''
        },
        children : [
            {
                name     : 'NoDataIndex',
                path     : 'NoDataIndex',
                component: () => import('@/view/noData'),
            },
            {
              name : 'CreatePerson',
              path : 'CreatePerson',
              component : () => import('@/view/noData/create/CreatePerson')
            },
            {
              name : 'CreateMerchant',
              path : 'CreateMerchant',
              components :
              {
                    default : () => import('@/view/noData/create/CreateMerchant')
              } ,
            //   children : [
            //     {
            //         name : 'CreateLegal',
            //         path : 'CreateLegal',
            //         component : () => import('@/view/noData/create/CreateLegal')
            //     }
            //   ]
            },
            {
              name : 'CheckList',
              path : 'CheckList',
              components: {
                default : () => import('@/view/CheckPending/CheckList.vue')
              }
            },
            {
                name : 'UserDetail',
                path : 'UserDetail',
                component : () => import('@/view/CheckPending/checkUser/UserDetail')
            },
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
    },
    {
        path: '*',
        name: 'home',
        components : {
            default: () => import('@/view/home/home')
        },
    },
]
