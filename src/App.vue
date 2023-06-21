<script setup>
import { RouterLink, RouterView } from 'vue-router';

import { useAuthStore } from '@/stores';

const authStore = useAuthStore();

const pagePermitted = {
  access: checkRoles("access"),
  settings: checkRoles("settings"),
  messenger: checkRoles("messenger"),
};

/**
 * Checks if roles are permitted - wraps fetch to handle an api with authentication 
 *
 * @params {String} page page requesting access for
 * @returns {Bool} true iff roles are contained in those allowed by page
 */
function checkRoles(page) {
  const authorizedRoles = {
    access: ["admin"],
    settings: ["admin"],
    messenger: ["messenger", "admin"],
  };
  if (!authStore.user || !authStore.user.roles) {
    return false
  } 
  return authorizedRoles[page].some(rdx => authStore.user.roles.includes(rdx));
}

</script>

<template>
    <div class="app-container bg-light">
        <nav v-show="authStore.user" class="navbar navbar-expand navbar-dark bg-dark">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <RouterLink to="/" class="nav-item nav-link">Home</RouterLink>
            </li>
            <li v-show="pagePermitted.settings" class="nav-item">
              <RouterLink to="/settings" class="nav-item nav-link">Settings</RouterLink>
            </li>
            <li v-show="pagePermitted.messenger" class="nav-item">
              <RouterLink to="/messenger" class="nav-item nav-link">Messenger</RouterLink>
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

