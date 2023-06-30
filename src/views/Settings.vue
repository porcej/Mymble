/**
 * System Settings Editing Interface (SSEI)
 * @Mymble
 * @author joe@kt3i.com
 * @version 0.0.1
 * @license MIT
 */

<script setup>
import { reactive} from "vue";
import { storeToRefs } from 'pinia';

import { useAuthStore, useSettingsStore, useSettingTypesStore } from '@/stores';

const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);

const settingTypesStore = useSettingTypesStore();
const { settingTypes } = storeToRefs(settingTypesStore);

// Boilerplate for a new setting
const newSetting = reactive({ 
        "field": "",
        "value": "",
        "settingType": {
            "settingTypeId": 1,
            "name": "text",
            "inputControlType": "text"
        },
        "settingTypeId": 1
});

settingsStore.getAll();
settingTypesStore.getAll();


/**
 * Updates a setting type based on drop down value
 *
 * @params {Object} setting - object reference to be updated
 */
function handleSettingTypeChange(setting) {
    // Handle the case where we are changing to the same typeid
    if (setting.settingTypeId == setting.settingType.settingTypeId) return;

    const st = settingTypes.value.find(st => st.settingTypeId == setting.settingTypeId);
    setting.settingType = st;;
};

/**
 * Calls the settingStore's update setting and handles errors
 *
 * @params {Number} messageId
 */
function updateSetting(settingId) {
    settingsStore.updateSetting(settingId)
        .catch(error => setErrors({ apiError: error }));
}

/**
 * Calls the settingStore's delete settomg and handles errors
 *
 * @params {Number} messageId
 */
function deleteSetting(settingId) {
    settingsStore.deleteSetting(settingId)
        .catch(error => setErrors({ apiError: error }));
}

/**
 * Adds a mew setting by calling the settingStore, handles errors, and 
 * resets new setting to the default boilerplate
 *
 */
function addSetting() {
    settingsStore.addSetting(newSetting)
        .catch(error => setErrors({ apiError: error }));
    newSetting.field = "";
    newSetting.value = "";
    newSetting.settingType.inputControlType = "text";
    newSetting.settingTypeId = 1;
}

/**
 * Reports error messages to the console
 *
 * @params {String} msg - Error Message to report
 */
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
                    <p class="text-warning">Warning, changes to theses settings may prevent access or causes deteramental perfornace.  Be careful. </p>
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
                                <font-awesome-icon icon="fa-solid fa-floppy-disk" />
                            </button>
                            <button 
                                class="btn btn-outline-danger" 
                                 @click="deleteSetting(setting.systemSettingId)"
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
                            <font-awesome-icon icon="fa-solid fa-plus-circle" />
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
