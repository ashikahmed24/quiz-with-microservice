<script setup>
import { ref, watch, nextTick } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// Props
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  display: {
    type: Boolean,
    default: false, // inline = false
  },
})

// Rendered HTML
const html = ref('')

// Custom macros for full LaTeX / physics-style support
const macros = {
  '\\dv': '\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}', // derivative
  '\\pdv': '\\frac{\\partial #1}{\\partial #2}', // partial derivative
  '\\eval': '\\left. #1 \\right\\rvert_{#2}', // evaluation bar
  '\\qty': '\\left( #1 \\right)', // parentheses wrapper
  '\\abs': '\\left| #1 \\right|', // absolute value
  '\\norm': '\\left\\lVert #1 \\right\\rVert', // norm
  '\\vect': '\\mathbf{#1}', // bold vector
  '\\mat': '\\mathbf{#1}', // matrix bold
}

// Renderer Function
function renderMath(input) {
  if (!input) return ''
  const parts = input.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g)
  let output = ''

  parts.forEach((part) => {
    if (!part.trim()) return

    // Display mode ($$...$$)
    if (part.startsWith('$$')) {
      const formula = part.replace(/^\$\$|\$\$$/g, '')
      output += `<div style="margin: 0.5em 0;">${katex.renderToString(formula, {
        throwOnError: false,
        displayMode: true,
        macros,
      })}</div>`
    }

    // Inline mode ($...$)
    else if (part.startsWith('$')) {
      const formula = part.replace(/^\$|\$$/g, '')
      output += `<span style="display: inline-block;">${katex.renderToString(formula, {
        throwOnError: false,
        displayMode: false,
        macros,
      })}</span>`
    }

    // Normal text
    else {
      output += part
    }
  })

  return output
}

// Reactive update
watch(
  () => props.content,
  async (val) => {
    await nextTick()
    html.value = renderMath(val)
  },
  { immediate: true },
)
</script>

<template>
  <div v-html="html"></div>
</template>
