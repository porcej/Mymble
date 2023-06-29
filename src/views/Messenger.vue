<script setup>
import { reactive, computed } from "vue";
import { storeToRefs } from 'pinia';

import { useAuthStore, useMessagesStore, useMessageTypesStore, useCampaignsStore } from '@/stores';
import MessageForm from "@/components/MessageForm.vue";

const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

const messagesStore = useMessagesStore();
const { messages } = storeToRefs(messagesStore);

const messageTypesStore = useMessageTypesStore();
const { messageTypes } = storeToRefs(messageTypesStore);


const campaignsStore = useCampaignsStore();
const { campaigns } = storeToRefs(campaignsStore);

// const newMessage = reactive({});

const newMessage = reactive({ 
        "title": "",
        "messageType": {
            "messageTypeId": 1,
            name:"full-page"
        },
        "approved": false,
        "active": false,
        "emergent": false,
        "content": ""
});

// const newCampaign = reactive({});




messagesStore.getAll();
messageTypesStore.getAll();
// campaignsStore.getAll();

function handleMessageTypeChange(message) {
    // Handle the case where we are changing to the same typeid
    if (message.messageTypeId == message.messageType.messageTypeId) return;

    const st = messageTypes.value.find(st => st.messageTypeId == message.messageTypeId);
    message.messageType = st;
};


function updateMessage(messageId) {
    messagesStore.updateMessage(messageId)
        .catch(error => setErrors({ apiError: error }));
}

function deleteMessage(messageId) {
    messagesStore.deleteMessage(messageId)
        .catch(error => setErrors({ apiError: error }));
}

function addMessage() {
    messagesStore.addMessage(newMessage)
        .catch(error => setErrors({ apiError: error }));
    newMessage.title = "";
    newMessage.messageTypeId = 1;
    newMessage.approved = false;
    newMessage.active = false;
    newMessage.emergent = false;
    newMessage.content = "";
}

function setErrors(msg) {
    console.warn(msg);
}

const formData = "";
const selectedMessage = "";

</script>

<template>
    <message-form></message-form>
    <div id="user-table" class="table-wrapper">
        <div class="table-title">
            <div class="row">
                <div class="col-sm-6">
                    <h2>Dashboard Settings</h2>
                </div>
                <div class="col-sm-6">
                </div>
            </div>
        </div>
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Approval</th>
                    <th>Active</th>
                    <th>Emergent</th>
                    <th>Content</th>
               <!-- <th>Campaigns</th> -->
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody v-if="messages.length">
                <tr
                    v-for="message in messages"
                    :key="message.messageId"
                    :data-message="message.messageId"
                >
                    <td>
                        <input
                            type="text"
                            class="form-control"
                            id="`message-title-${message.messageId}`"
                            :placeholder="`${message.title}`"
                            v-model="message.title"
                        >
                    </td>
                    <td>
                        <select 
                            :id="`message-type-${message.messageId}`"
                            :name="`message-type-${message.messageId}`"
                            class="form-control"
                            @change="handleMessageTypeChange(message)"
                            v-model="message.messageTypeId"
                        >
                            <option 
                                v-for="messageType in messageTypes"
                                :key="messageType.messageTypeId"
                                :value="messageType.messageTypeId"
                                :selected="message.messageTypeId == messageType.messageTypeId"
                            >
                                {{ messageType.name }}
                            </option>
                        </select>
                    </td>
                    <td>
                        <input
                            type="checkbox"
                            v-model="message.approved"
                            :id="`message-approved-${message.messageId}`"
                        >
                    </td>
                    <td>
                        <input
                            type="checkbox"
                            v-model="message.active"
                            :id="`message-active-${message.messageId}`"
                        >
                    </td>
                    <td>
                        <input
                            type="checkbox"
                            v-model="message.emergent"
                            :id="`message-emergent-${message.messageId}`"
                        >
                    </td>
                    <td>
                        <button 
                            class="btn btn-outline-success"
                            @click=""
                        >
                            Edit
                        </button>
                        <input
                            type="hidden"
                            :id="`message-content-${message.messageId}`"
                            v-model="message.content"
                        >
                    </td>
                     <td>
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <button 
                                class="btn btn-outline-warning"
                                 @click="updateMessage(message.messageId)"
                            >
                                <font-awesome-icon icon="fa-solid fa-floppy-disk" />
                            </button>
                            <button 
                                class="btn btn-outline-danger" 
                                 @click="deleteMessage(message.messageId)"
                            >
                                <font-awesome-icon icon="fa-solid fa-trash-alt" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>
                        <input
                            type="text"
                            class="form-control"
                            id="new-message-title"
                            placeholder="Title"
                            v-model="newMessage.title"
                        >
                    </td>
                    <td>
                        <select 
                            id="message-type-new"
                            name="message-type-new"
                            class="form-control"
                            @change="handleMessageTypeChange(newMessage)"
                            v-model="newMessage.messageTypeId"
                        >
                            <option 
                                v-for="messageType in messageTypes"
                                :key="messageType.messageTypeId"
                                :value="messageType.messageTypeId"
                                :selected="newMessage.messageTypeId == messageType.messageTypeId"
                            >
                                {{ messageType.name }}
                            </option>
                        </select>
                    </td>
                    <td>
                        <input
                            type="checkbox"
                            v-model="newMessage.approved"
                            id="message-approved-new"
                        >
                    </td>
                    <td>
                        <input
                            type="checkbox"
                            v-model="newMessage.active"
                            id="message-active-new"
                        >
                    </td>
                    <td>
                        <input
                            type="checkbox"
                            v-model="newMessage.emergent"
                            id="message-emergent-new"
                        >
                    </td>
                    <td>
                        <button 
                            class="btn btn-outline-success"
                            @click=""
                        >
                            Edit
                        </button>
                        <input
                            type="hidden"
                            id="message-content-new"
                            v-model="newMessage.content"
                        >
                    </td>
                    <td>
                        <button 
                            class="btn btn-outline-success"
                             @click="addMessage()"
                        >
                            <font-awesome-icon icon="fa-solid fa-plus-circle" />
                        </button>
                    </td>
                </tr>
            </tfoot>
        </table>
        <div
            v-if="messages.loading || messageTypes.loading"
            class="spinner-border spinner-border-sm"
        >
        </div>
        <div
            v-if="messages.error" class="text-danger"
        >
            Error loading messages: {{messages.error}}
        </div>
        <div
            v-if="messageTypes.error" class="text-danger"
        >
            Error loading message types: {{messageTypes.error}}
        </div>
    </div>
</template>
