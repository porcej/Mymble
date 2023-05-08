<script setup>
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

// const usersStore = useUsersStore();
// const { users } = storeToRefs(usersStore);

// usersStore.getAll();
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
console.log(authUser.token);
console.log(parseJwt(authUser.token));




</script>

<template>
    <div>
        <h1>Hi {{authUser.username }}!</h1>
        <p>You're logged in with Vue 3 + Pinia & JWT!!</p>
        <h3>Users from secure api end point:</h3>
    </div>
</template>
