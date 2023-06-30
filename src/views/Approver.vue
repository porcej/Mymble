<script setup>
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

</script>

<template>
    <div>
        <h1> Please stand by this will be coming soon to a computer screen near you!</h1>
        <p>In the intrim, please use the approval checkbox in the <RouterLink to="/messenger">Messenger</RouterLink> panel.</p>
    </div>
</template>