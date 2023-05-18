/**
 * Access Store - Stores user and role information
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

/** Store for Access Control Users */
export const useUsersStore = defineStore({
    id: 'users',

    /**
     * Initializes the user store
     * 
     */
    state: () => ({
        users: {}
    }),
    actions: {
        /**
         * Fetches all users from the API
         *
         */
        async getAll() {
            this.users = { loading: true };
            fetchApi.get(`${baseUrl}/users`)
                .then(users => this.users = users)
                .catch(error => this.users = { error })
        },
    },
});

/** Store for Access Control Roles */
export const useRolesStore = defineStore({
    id: 'roless',

    /**
     * Initializes the store
     * 
     */
    state: () => ({
        roles: {}
    }),
    actions: {
        /**
         * Fetches all users from the API
         *
         */
        async getAll() {
            this.roless = { loading: true };
            fetchApi.get(`${baseUrl}/roles`)
                .then(roles => this.roles = roles)
                .catch(error => this.roles = { error })
        },
    },
});