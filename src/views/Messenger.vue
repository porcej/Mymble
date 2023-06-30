/**
 * Message Authoring &mp; Editing Interface (MAEI)
 * @Mymble
 * @author joe@kt3i.com
 * @version 0.0.1
 * @license MIT
 */

<script setup>
import Quill from 'quill';
import { reactive } from "vue";
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

// Holds a new message before adding it to the server
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

// Holds information relavant to the message content editor
const editor = reactive({ 
        "title": "",
        "show": false,
        "content": "",
        "messageId": 0,
});

messagesStore.getAll();
messageTypesStore.getAll();
campaignsStore.getAll();

/**
 * Updates a message type based on drop down value
 *
 * @params {Object} message - object reference to be updated
 */
function handleMessageTypeChange(message) {
    // Handle the case where we are changing to the same typeid
    if (message.messageTypeId == message.messageType.messageTypeId) return;

    const mt = messageTypes.value.find(
        mt => mt.messageTypeId == message.messageTypeId
    );
    message.messageType = mt;
};

/**
 * Calls the messageStore's update message and handles errors
 *
 * @params {Number} messageId
 */
function updateMessage(messageId) {
    messagesStore.updateMessage(messageId)
        .catch(error => setErrors({ apiError: error }));
}

/**
 * Calls the messageStore's delete message and handles errors
 *
 * @params {Number} messageId
 */
function deleteMessage(messageId) {
    messagesStore.deleteMessage(messageId)
        .catch(error => setErrors({ apiError: error }));
}

/**
 * Calls the messageStore's add new message and handles errors
 * resets newMessage to default values
 *
 * @params {Object} newMessage
 */
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

/**
 * Displays errors to the console
 *
 * @params {Object} newMessage
 */
function setErrors(msg) {
    console.warn(msg);
}

/**
 * Calls the content Editor modal and passes information to said modal
 *
 * @params {String} title - to be displayed in modal heading
 * @params {String} content - current content to pre-populate editor
 * @params {Number} id - Message id that is being edited
 */
function editContent(title="", content="", id=0) {
    if (title === "") {
        title = "New Message"
    }
    editor.title = title;
    editor.content = content;
    editor.messageId = id;
    console.debug(`Showing Modal for ${title} (${id}):`, content);
    editor.show = true;
}

/**
 * Saves content from editor to message and closes the modal
 *
 * @params {String} content - most recent version of the content
 */
function updateContent(content) {
    if (editor.messageId == 0) {
        newMessage.content = content;
    } else {
        messagesStore.updateMessageContent(editor.messageId, content);
    }
    closeEditor();
}

/**
 * Closes the content editor modal and resets to default values
 */
function closeEditor() {
    // Return Editor Values to their default
    editor.show = false;
    editor.messageId = 0;
    editor.title = "";
    editor.content = "";
}

</script>

<template>
    <transition name="modal">
        <message-form
            v-on:save-message-content="updateContent"
            v-if="editor.show"
            :title="editor.title"
            :content="editor.content"
            @close-message-content="closeEditor"
        >
        </message-form>
    </transition>
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
                            @click="editContent(title=message.title, content=message.content, id=message.messageId)"
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
                            @click="editContent(title=newMessage.title, content=newMessage.content, id=0)"
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
