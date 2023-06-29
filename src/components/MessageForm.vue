<template>
  <div>
    <div ref="editor" class="quill-editor"></div>
    <button @click="submit">Save</button>
  </div>
</template>

<script>
import Quill from 'quill';
import { ref } from 'vue'

export default {
  mounted() {
    this.quill = new Quill(this.$refs.editor, {
      theme: 'snow', // 'snow' for a light theme, 'bubble' for a bubble theme
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // Text styling options
          [{ header: 1 }, { header: 2 }], // Headers
          [{ list: 'ordered' }, { list: 'bullet' }], // Lists
          [{ align: [] }], // Text alignment
          ['link', 'image'], // Links and images
          ['clean'], // Remove formatting
        ],
      },
      placeholder: 'Write your message here...',
    });
  },
  methods: {
    submit() {
      const message = this.quill.root.innerHTML;
      this.quill.root.innerHTML = "";
      this.$emit('save-message-content', message);
      console.log('saved message:', message);
    },
  },
};
</script>

<style>
.quill-editor {
  height: 300px;
}
</style>