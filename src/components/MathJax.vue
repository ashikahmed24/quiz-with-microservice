<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

// Props
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})

const container = ref(null)

// Render MathJax
const renderMath = async () => {
  if (!window.MathJax) return
  await nextTick() // ensure DOM is updated
  MathJax.typesetPromise([container.value])
}

onMounted(() => {
  if (!window.MathJax) {
    // Load MathJax v4 for TeX only
    const script = document.createElement('script')
    script.defer = true
    script.id = 'MathJax-script'
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js'
    script.onload = renderMath
    document.head.appendChild(script)
  } else {
    renderMath()
  }
})

// Watch for content updates
watch(
  () => props.content,
  () => {
    renderMath()
  },
)
</script>

<template>
  <div ref="container" v-html="content"></div>
</template>
