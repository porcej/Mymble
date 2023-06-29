/**
 * Admin Console
 * @Mymble
 * @author joe@kt3i.com
 * @version 0.0.1
 * @license MIT
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia';

import './assets/base.css';

import App from './App.vue'
import { router } from './router';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */
import { faTrashAlt, faPlusCircle, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

/* Import Quill Editor */
import { QuillEditor } from '@vueup/vue-quill';

/* Import Quill Editor Theme */
import '@vueup/vue-quill/dist/vue-quill.snow.css';

/* add icons to the library */
library.add(faTrashAlt, faPlusCircle, faFloppyDisk);

/* Configure Quill Editor */
const globalOptions = {
  debug: 'info',
  // modules: {
  //   toolbar: ['bold', 'italic', 'underline']
  // },
  contentType: "html",
  placeholder: 'Compose an epic message...',
  readOnly: false,
  theme: 'snow'
}
// set default globalOptions prop
QuillEditor.props.globalOptions.default = () => globalOptions;
const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(createPinia());
app.use(router);

app.mount('#app');
