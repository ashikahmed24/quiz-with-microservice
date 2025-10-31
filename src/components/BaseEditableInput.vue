<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }, // v-model
  placeholder: { type: String, default: '' }, // fallback text
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const isFocused = ref(false)
const inputRef = ref(null)

const onFocus = () => {
  isFocused.value = true
  emit('focus')
}

const onBlur = () => {
  isFocused.value = false
  emit('blur')
}

const onInput = (val) => {
  emit('update:modelValue', val)
}

// Auto-focus when input opens
watch(isFocused, (val) => {
  if (val) nextTick(() => inputRef.value?.focus())
})
</script>

<template>
  <div class="w-full bg-gray-100 p-2 rounded">
    <!-- Input mode -->
    <div v-if="isFocused">
      <input
        ref="inputRef"
        type="text"
        :value="modelValue"
        @input="onInput($event.target.value)"
        @blur="onBlur"
        :placeholder="placeholder"
        class="form__control"
      />
    </div>

    <!-- Preview mode -->
    <div class="cursor-text w-full px-2 py-1 transition" @click="onFocus">
      <RenderMath :content="modelValue" />
    </div>
  </div>
</template>
