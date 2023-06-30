/**
 * SPA Router
 * 
 * @Mymble
 * @author joe@kt3i.com
 * @version 0.0.1
 * @license MIT
 */

import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores';
import { Main, Login } from '@/views';

// lazy-loaded
const Settings = () => import('@/views/Settings.vue');
const Messenger = () => import('@/views/Messenger.vue');
const Approver = () => import('@/views/Approver.vue');

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
        { path: '/', component: Main },
        { path: '/approver', component: Approver },
        { path: '/messenger', component: Messenger },
        { path: '/settings', component: Settings },
        { path: '/login', component: Login }
    ]
});

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();

    if (authRequired && !auth.user) {
        auth.returnUrl = to.fullPath;
        return '/login';
    }
});
export default router;