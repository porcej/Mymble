/**
 * Auth Store - Stores information for the logged on user
 * 
 * @Mymble
 * @author joe@kt3i.com
 * @version 0.0.1
 * @license MIT
 */

import { defineStore } from 'pinia';
import { fetchApi } from '@/helpers';
import { router} from '@/router';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


export const useAuthStore = defineStore({
    id: 'auth',

    /**
     * Initializes the Authenticated user from Local Storage
     *
     */
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null
    }),
    actions: {

        /**
         * Attempts to login the user
         *
         */
        async login(username, password) {
            const user = await fetchApi.post(`${baseUrl}/auth`, { username, password });

            const parsed_token = parseJwt(user.token);
            user.roles = parsed_token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            // update pinia state
            this.user = user;

            // store user details and jwt in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            // redirect to previous url or default to home page
            router.push(this.returnUrl || '/');
        },

        /**
         * Attempts to logout the current user
         *
         */
        logout() {
            router.push({ path: '/login'});
            this.user = null;
            localStorage.removeItem('user');
        }
    }
});