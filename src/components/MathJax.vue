<script setup>
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { ref } from 'vue'

const content = ref(
  'লগারিদম সূত্র অনুযায়ী, $\\log_a(a^x) = x$ এবং সমীকরণ $\\frac{3x^2 + 4x + 1}{x}$',
)

function renderMathWithText(input) {
  // Split inline $...$ or display $$...$$
  const parts = input.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g)
  let html = ''
  parts.forEach((part) => {
    if (part.startsWith('$$')) {
      const formula = part.replace(/^\$\$|\$\$$/g, '')
      html += `<div>${katex.renderToString(formula, { throwOnError: false, displayMode: true })}</div>`
    } else if (part.startsWith('$')) {
      const formula = part.replace(/^\$|\$$/g, '')
      html += katex.renderToString(formula, { throwOnError: false, displayMode: false })
    } else {
      html += part // normal text
    }
  })
  return html
}
</script>

<template>
  <div v-html="renderMathWithText(content)"></div>
</template>
