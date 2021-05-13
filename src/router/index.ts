import {
    createRouter,
    createWebHashHistory,
    RouteRecordRaw
} from 'vue-router'
import Home from '@/views/Home.vue'
const routerHash = createWebHashHistory()
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        meta: { isTabBar: true },
    },
    {
        path: '/demo',
        name: 'demo',
        component: () => import('@/views/Demo.vue'),
    },
]
const router = createRouter({
    history: routerHash,
    routes
})

export default router