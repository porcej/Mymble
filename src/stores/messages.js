/**
 * Messages - Stores application messaging information
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

/** Store for Messages */
export const useMessagesStore = defineStore({
    id: "messages",

    /**
     * Initializes the 
     * 
     */
    state: () => ({
        messages: {}
    }),
    actions: {
        /**
         * Fetches all messages from the API
         *
         */
        async getAll() {
            this.messages = { loading: true };
            fetchApi.get(`${baseUrl}/messages`)
                .then(messages => this.messages = messages)
                .catch(error => this.messages = { error })
        },

        /**
         * Updates the server 
         *
         */
         async updateMessage(messageId) {
            const message = this.messages.find(m => m.messageId == messageId);
            const response = await fetchApi.put(`${baseUrl}/messages/${messageId}`, message);
            this.getAll();
            return response;
        },

        /**
         * Updates the local message content
         *
         */
        updateMessageContent(messageId, content) {
            const message = this.messages.find(m => m.messageId == messageId);
            message.content = content;
        },

        /**
         * Deletes message with messageId
         *
         */
         async deleteMessage(messageId) {
            const response = await fetchApi.delete(`${baseUrl}/messages/${messageId}`);
            this.getAll();
            return response;
        },

        /**
         * adds a new message with messageId
         *
         */
         async addMessage(message) {
            const nset = (({ title, messageTypeId, approved, active, emergent, content }) => ({ title, messageTypeId, approved, active, emergent, content }))(message);
            const response = await fetchApi.post(`${baseUrl}/messages`, nset);
            this.getAll();
            return response;
        },
    },
});

/** Store for Message Types */
export const useMessageTypesStore = defineStore({
    id: "messageTypes",

    /**
     * Initializes the message types store
     * 
     */
    state: () => ({
        messageTypes: {}
    }),
    actions: {
        /**
         * Fetches all message types from the API
         *
         */
        async getAll() {
            this.messageTypes = { loading: true };
            fetchApi.get(`${baseUrl}/messageTypes`)
                .then(messageTypes => this.messageTypes = messageTypes)
                .catch(error => this.messageTypes = { error })
        },        
    },
});

/** Store for Campaigns */
export const useCampaignsStore = defineStore({
    id: "campaigns",

    /**
     * Initializes the 
     * 
     */
    state: () => ({
        campaigns: {}
    }),
    actions: {
        /**
         * Fetches all campaigns from the API
         *
         */
        async getAll() {
            this.campaigns = { loading: true };
            fetchApi.get(`${baseUrl}/campaigns`)
                .then(campaigns => this.campaigns = campaigns)
                .catch(error => this.campaigns = { error })
        },

        /**
         * Updates the server 
         *
         */
         async updateCampaign(campaignId) {
            const campaign = this.campaigns.find(st => st.systemCampaignId== campaignId);
            const response = await fetchApi.put(`${baseUrl}/campaigns/${campaignId}`, campaign);
            this.getAll();
            return response;
        },

        /**
         * Deletes campaign with campaignId
         *
         */
         async deleteCampaign(campaignId) {
            const response = await fetchApi.delete(`${baseUrl}/campaigns/${campaignId}`);
            this.getAll();
            return response;
        },

        /**
         * adds a new campaign with campaignId
         *
         */
         async addCampaign(campaign) {
            const nset = (({ field, value, campaignTypeId }) => ({ field, value, campaignTypeId }))(campaign);
            const response = await fetchApi.post(`${baseUrl}/campaigns`, nset);
            this.getAll();
            return response;
        },
    },
});