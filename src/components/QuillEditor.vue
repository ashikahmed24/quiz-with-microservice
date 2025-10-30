<script setup>
import { ref, onMounted, watch } from 'vue'
import Quill from 'quill'
import katex from 'katex'
import 'quill/dist/quill.snow.css'
import 'katex/dist/katex.min.css'

const editorRef = ref(null)
const quillInstance = ref(null)
const content = ref('')
const renderedContent = ref('')

// Function to render KaTeX formulas
function renderMath(content) {
  // Split by $$...$$ (display) or $...$ (inline)
  const parts = content.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g)
  let html = ''
  parts.forEach((part) => {
    if (part.startsWith('$$')) {
      const formula = part.replace(/^\$\$|\$\$$/g, '')
      html += `<div>${katex.renderToString(formula, { throwOnError: false, displayMode: true })}</div>`
    } else if (part.startsWith('$')) {
      const formula = part.replace(/^\$|\$$/g, '')
      html += katex.renderToString(formula, { throwOnError: false, displayMode: false })
    } else {
      html += part
    }
  })
  return html
}

onMounted(() => {
  quillInstance.value = new Quill(editorRef.value, {
    theme: 'snow',
    modules: {
      formula: true,
      toolbar: [
        ['bold', 'italic', 'underline'],
        ['formula', 'code-block'],
      ],
    },
  })

  // Update content on text-change
  quillInstance.value.on('text-change', () => {
    content.value = quillInstance.value.getText()
    renderedContent.value = renderMath(content.value)
  })
})
</script>

<template>
  <div class="editor-container">
    <div ref="editorRef" id="editor" class="h-64 border"></div>
    <div class="mt-4">
      <h3>Rendered Content:</h3>
      <div v-html="renderedContent"></div>
    </div>
  </div>
</template>

<style scoped></style>
