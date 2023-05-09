<script setup>
import { storeToRefs } from 'pinia';

import { useAuthStore, useUsersStore, useRolesStore } from '@/stores';

const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

const rolesStore = useRolesStore();
const { roles } = storeToRefs(rolesStore);

usersStore.getAll();
rolesStore.getAll();

console.log("Users:", users);
console.log("Roles:" , roles);


</script>

<template>
    <div id="user-table" class="table-wrapper">
        <div class="table-title">
            <div class="row">
                <div class="col-sm-6">
                    <h2>Access Control</h2>
                </div>
                <div class="col-sm-6">
                </div>
            </div>
        </div>
        <table class="table table-striped table-hover">
            <thead>
                <tr v-if="roles.length">
                    <th>User</th>
                    <th
                        v-for="(role, rdx) in roles"
                        :key="rdx" class="text-center"
                    >
                        {{role}}
                    </th>
                    <th> </th>
                </tr>
                <tr v-else>
                    <th>User</th>
                    <th> </th>
                </tr>
            </thead>
            <tbody v-if="users.length">
                <tr v-for="user in users" :key="user.username" :data-user="user.username">
                    <td>
                        <input
                            type="text"
                            class="form-control"
                            :id="`user-${user.username}`"
                            :placeholder="user.username"
                            v-model="user.username"
                        >
                    </td>
                    <td v-for="(role, rdx) in roles" :key="rdx" class="text-center">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`role-${user.username}-${role}`"
                            :value="role"
                            v-model="user.roles"
                        >
                    </td>
                    <td>
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <button class="btn btn-outline-warning" data-toggle="modal" data-target="#editStationModal" data-station-name="{{ station.name }}"><i class="fas fa-pen"></i></button>
                            <button class="btn btn-outline-danger" data-toggle="modal" data-target="#deleteStationModal" data-station-name="{{ station.name }}"><i class="fas fa-trash-alt"></i></button>
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
                                id="new_username"
                                name="name"
                                placeholder="New Username"
                                required
                            >
                        </td>
                        <td v-for="(role, rdx) in roles" :key="rdx" class="text-center">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                :id="`new-user-role-${role}`"
                                :value="role"
                            >
                        </td>
                        <td><button class="btn btn-outline-success" id="new_user"><i class="fas fa-plus-circle"></i></button></td>

                </tr>
            </tfoot>
        </table>
        <div v-if="users.loading || roles.loading" class="spinner-border spinner-border-sm"></div>
        <div v-if="users.error" class="text-danger">Error loading users: {{users.error}}</div>
        <div v-if="roles.error" class="text-danger">Error loading roles: {{roles.error}}</div>
    </div>
</template>
