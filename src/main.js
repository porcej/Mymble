/**
 * Admin Console
 * @Mymble
 * @author joe@kt3i.com
 * @version 0.0.1
 * @license MIT
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia';

import './style.css'
import App from './App.vue'

const app = createApp(App);

app.use(createPinia());
// app.use(router);

app.mount('#app');

createApp(App).mount('#app')
