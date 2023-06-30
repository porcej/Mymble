<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { reactive, computed } from "vue";

import { useAuthStore } from '@/stores';

const authStore = useAuthStore();

const authorizedRoles = {
  access: ["admin"],
  settings: ["admin"],
  messenger: ["author"],
  approver: ["approver"],
};

/**
 * Computed method to determine if a user is authorized to view Settings Page
 *
 * @returns {Bool} true iff roles are contained in those allowed by page
 */
const showSettings = computed(() => {
  if (authStore.user && authStore.user.roles) {
    return authorizedRoles["settings"].some(rdx => authStore.user.roles.includes(rdx));
  }
  return false;
});

/**
 * Computed method to determine if a user is authorized to view Messenger Page
 *
 * @returns {Bool} true iff roles are contained in those allowed by page
 */
const showMessenger = computed(() => {
  if (authStore.user && authStore.user.roles) {
    return authorizedRoles["messenger"].some(rdx => authStore.user.roles.includes(rdx));
  }
  return false;
});

/**
 * Computed method to determine if a user is authorized to view Approver Page
 *
 * @returns {Bool} true iff roles are contained in those allowed by page
 */
const showApprover = computed(() => {
  if (authStore.user && authStore.user.roles) {
    return authorizedRoles["approver"].some(rdx => authStore.user.roles.includes(rdx));
  }
  return false;
});

</script>

<template>
    <div class="app-container bg-light">
        <nav v-show="authStore.user" class="navbar navbar-expand navbar-dark bg-dark">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <RouterLink to="/" class="nav-item nav-link">Home</RouterLink>
            </li>
            <li v-show="showSettings" class="nav-item">
              <RouterLink to="/settings" class="nav-item nav-link">Settings</RouterLink>
            </li>
            <li v-show="showMessenger" class="nav-item">
              <RouterLink to="/messenger" class="nav-item nav-link">Messenger</RouterLink>
            </li>
            <li v-show="showApprover" class="nav-item">
              <RouterLink to="/approver" class="nav-item nav-link">Messege Approval</RouterLink>
            </li>
          </ul>
          <a @click="authStore.logout()" class="nav-item nav-link">Logout <i class="bi bi-box-arrow-right"></i></a>
        </nav>
        <div class="container pt-4 pb-4">
            <RouterView />
        </div>
    </div>
</template>

<style>
@import '@/assets/base.css';
</style>


