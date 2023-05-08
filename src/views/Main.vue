<script setup>
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

</script>

<template>
    <div>
        <h1>Welcome {{ authUser?.username }}!</h1>
        <p>You're logged into the secure console for this dashboarding app.</p>
        <h3>Please enjoy your stay.</h3>
    </div>
</template>
