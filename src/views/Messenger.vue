<script setup>
import { reactive, computed } from "vue";
import { storeToRefs } from 'pinia';

import { useAuthStore, useSettingsStore, useSettingTypesStore } from '@/stores';


const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

const messagesStore = useMessagesStore();
const { messages } = storeToRefs(messagesStore);

const messageTypesStore = useMessageTypesStore();
const { messageTypes } = storeToRefs(messageTypesStore);


const campaignsStore = useCampaignsStore();
const { campaigns } = storeToRefs(campaignsStore);

const newMessage = reactive({});
const newCampaign = reactive({});

messagesStore.getAll();
messageTypesStore.getAll();
campaignsStore.getAll();

function handleSettingTypeChange(setting) {
    // Handle the case where we are changing to the same typeid
    if (setting.settingTypeId == setting.settingType.settingTypeId) return;

    const st = settingTypes.value.find(st => st.settingTypeId == setting.settingTypeId);
    setting.settingType = st;;
};


function updateSetting(settingId) {
    settingsStore.updateSetting(settingId)
        .catch(error => setErrors({ apiError: error }));
}

function deleteSetting(settingId) {
    settingsStore.deleteSetting(settingId)
        .catch(error => setErrors({ apiError: error }));
}

function addSetting() {
    settingsStore.addSetting(newSetting)
        .catch(error => setErrors({ apiError: error }));
    newSetting.field = "";
    newSetting.value = "";
    newSetting.settingType.inputControlType = "text";
    newSetting.settingTypeId = 1;
}

function setErrors(msg) {
    console.warn(msg);
}


</script>

<template>
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
                    <th>Setting</th>
                    <th>Value</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody v-if="settings.length">
                <tr v-for="setting in settings" :key="setting.systemSettingId" :data-setting="settings.systemSettingId">
                    <td>
                        <input
                            type="text"
                            class="form-control"
                            :id="`setting-field-${setting.systemSettingId}`"
                            :placeholder="setting.field"
                            v-model="setting.field"
                        >
                    </td>
                    <td>
                        <input
                            :type="setting.settingType.inputControlType"
                            class="form-control"
                            :id="`setting-value-${setting.systemSettingId}`"
                            v-model="setting.value"
                        >
                    </td>
                    <td>
                        <select 
                            :id="`setting-type-${setting.systemSettingId}`"
                            :name="`setting-type-${setting.systemSettingId, setting.systemSettingId}`"
                            class="form-control"
                            @change="handleSettingTypeChange(setting)"
                            v-model="setting.settingTypeId"
                        >
                            <option 
                                v-for="settingType in settingTypes"
                                :key="settingType.settingTypeId"
                                :value="settingType.settingTypeId"
                                :selected="setting.settingTypeId == settingType.settingTypeId"
                            >
                                {{ settingType.name }}
                            </option>
                        </select>
                    </td>
                    <td>
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <button 
                                class="btn btn-outline-warning"
                                 @click="updateSetting(setting.systemSettingId)"
                            >
                                <i class="fas fa-floppy-disk">UP</i>
                            </button>
                            <button 
                                class="btn btn-outline-danger" 
                                 @click="deleteSetting(setting.systemSettingId)"
                            >
                                <i class="fas fa-trash-alt"></i>
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
                            id="new-setting-field"
                            placeholder="Field"
                            v-model="newSetting.field"
                        >
                    </td>
                    <td>
                        <input
                            :type="newSetting.settingType.inputControlType"
                            class="form-control"
                            id="new-setting-value"
                            placeholder="Value"
                            v-model="newSetting.value"
                        >
                    </td>
                    <td>
                        <select 
                            id="new-setting-type"
                            name="new-setting-type"
                            class="form-control"
                            @change="handleSettingTypeChange(newSetting)"
                            v-model="newSetting.settingTypeId"
                        >
                            <option 
                                v-for="settingType in settingTypes"
                                :key="settingType.settingTypeId"
                                :value="settingType.settingTypeId"
                                :selected="newSetting.settingTypeId == settingType.settingTypeId"
                            >
                                {{ settingType.name }}
                            </option>
                        </select>
                    </td>
                    <td>
                        <button 
                            class="btn btn-outline-success"
                             @click="addSetting()"
                        >
                            <i class="fas fa-plus-circle"></i>
                        </button>
                    </td>
                </tr>
            </tfoot>
        </table>
        <div
            v-if="settings.loading || settingTypes.loading"
            class="spinner-border spinner-border-sm"
        >
        </div>
        <div
            v-if="settings.error" class="text-danger"
        >
            Error loading settings: {{settings.error}}
        </div>
        <div
            v-if="settingTypes.error" class="text-danger"
        >
            Error loading setting types: {{settingTypes.error}}
        </div>
    </div>
</template>
