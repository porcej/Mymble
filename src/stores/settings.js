/**
 * Settings Store - Stores application setting information
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

/** Store for Settings */
export const useSettingsStore = defineStore({
    id: "settings",

    /**
     * Initializes the settings
     * 
     */
    state: () => ({
        settings: {}
    }),
    actions: {
        /**
         * Fetches all settings from the API
         *
         */
        async getAll() {
            this.settings = { loading: true };
            fetchApi.get(`${baseUrl}/settings`)
                .then(settings => this.settings = settings)
                .catch(error => this.settings = { error })
        },

        /**
         * Updates the server for setting settingId
         *
         */
         async updateSetting(settingId) {
            const setting = this.settings.find(st => st.systemSettingId== settingId);
            const response = await fetchApi.put(`${baseUrl}/settings/${settingId}`, setting);
            this.getAll();
            return response;
        },

        /**
         * Deletes setting with settingId
         *
         */
         async deleteSetting(settingId) {
            const response = await fetchApi.delete(`${baseUrl}/settings/${settingId}`);
            this.getAll();
            return response;
        },

        /**
         * adds a new setting with settingId
         *
         */
         async addSetting(setting) {
            const nset = (({ field, value, settingTypeId }) => ({ field, value, settingTypeId }))(setting);
            const response = await fetchApi.post(`${baseUrl}/settings`, nset);
            this.getAll();
            return response;
        },
    },
});

/** Store for Setting Types */
export const useSettingTypesStore = defineStore({
    id: "settingTypes",

    /**
     * Initializes the setting types store
     * 
     */
    state: () => ({
        settingTypes: {}
    }),
    actions: {
        /**
         * Fetches all setting types from the API
         *
         */
        async getAll() {
            this.settingTypes = { loading: true };
            fetchApi.get(`${baseUrl}/settingTypes`)
                .then(settingTypes => this.settingTypes = settingTypes)
                .catch(error => this.settingTypes = { error })
        },        
    },
});