<script setup>
import { onMounted, ref, watch } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import 'katex/dist/katex.min.css'
import katex from 'katex'

// ✅ Enable KaTeX globally so Quill can render formulas
window.katex = katex

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Write something...' },
  readOnly: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])
const editor = ref(null)
let quillInstance = null

onMounted(() => {
  quillInstance = new Quill(editor.value, {
    theme: 'snow',
    placeholder: props.placeholder,
    readOnly: props.readOnly,
    modules: {
      formula: true, // ✅ enable math formula support
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
        [{ script: 'sub' }, { script: 'super' }],
        ['clean'],
      ],
    },
  })

  // ✅ Set initial content (HTML)
  quillInstance.root.innerHTML = props.modelValue || ''

  // ✅ Emit HTML whenever content changes
  quillInstance.on('text-change', () => {
    const html = quillInstance.root.innerHTML
    emit('update:modelValue', html)
  })
})

// ✅ Sync external modelValue updates
watch(
  () => props.modelValue,
  (val) => {
    if (quillInstance && val !== quillInstance.root.innerHTML) {
      quillInstance.root.innerHTML = val || ''
    }
  },
)
</script>

<template>
  <div class="quill-editor">
    <div ref="editor"></div>
  </div>
</template>

<style scoped>
.quill-editor :deep(.ql-editor) {
  min-height: 50px;
}
</style>
