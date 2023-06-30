<template>
  <div class="modal-mask w-100">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Editing {{ title }}</h3>
      </div>
      <div class="modal-body">
        <div class="w-100">
          <div ref="editor" class="quill-editor"></div>
        </div>
      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="clear">Close</button>
          <button type="button" class="btn btn-primary" @click="submit">Save changes</button>
      </div>
    </div>
  </div>
</template>

<script>
import Quill from 'quill';
import { ref } from 'vue'

export default {
  props: {
    // Initiallize Editor Content
    content: {
      type: String,
      default: "",
    },

    // Page Title
    title: {
      type: String,
      default: "",
    },

  },
  mounted() {
    this.quill = new Quill(this.$refs.editor, {
      theme: 'snow', // 'snow' for a light theme, 'bubble' for a bubble theme
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                       

          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction
          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],
          // ['link', 'image'], // Links and images
          ['clean'], // Remove formatting          
        ],
      },
      placeholder: 'Write your message here...',
    });
    this.quill.root.innerHTML = this.content;
  },
  methods: {
    submit() {
      const message = this.quill.root.innerHTML;
      this.quill.root.innerHTML = "";
      this.$emit('save-message-content', message);
      console.debug('saved message:', message);
    },
    clear() {
      this.quill.root.innerHTML = "";
      console.debug("Message content cleared");
      this.$emit('close-message-content');
    }
  },
};
</script>

<style>
.quill-editor {
   min-height: 300px;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-content {
  vertical-align: middle;
}


.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>