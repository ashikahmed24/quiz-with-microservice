<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  required: { type: Boolean, default: false },
  id: String,
  name: String,
  placeholder: String,
  options: { type: Array, default: () => [] },
  error: [String, Array],
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const computedPlaceholder = computed(() => props.placeholder || `Select ${props.label}`)
</script>

<template>
  <div class="mb-4">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <select :id="id" :name="name" :value="modelValue" :disabled="disabled"
      @change="emit('update:modelValue', $event.target.value)"
      class="w-full px-4 py-2 text-sm rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      :class="error ? 'border-red-500 ring-red-100' : 'border-gray-300'">
      <option disabled value="">{{ computedPlaceholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <p v-if="error" class="text-red-500 text-xs">
      {{ error[0] }}
    </p>
  </div>
</template>
