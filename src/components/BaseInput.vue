<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  error: [String, Array],
  required: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`,
  },
})

const emits = defineEmits(['update:modelValue'])

// Local computed to make prop writable via v-model
const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})
</script>

<template>
  <div class="mb-4">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      v-model="localValue"
      :class="[
        'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
        error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300',
      ]"
    />
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error[0] ?? error }}</p>
  </div>
</template>

<style scoped></style>
