import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: () => import('@/views/HomePage.vue'),
        props: true
    },
    {
        path: '/report',
        name: 'ReportPage',
        component: () => import('@/views/ReportPage.vue'),
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top
        return { top: 0 }
    },
    routes,
});

export default router;
