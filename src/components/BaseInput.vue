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
  <div class="form__group">
    <label v-if="label" :for="id" class="form__label">
      {{ label }} <span v-if="required" class="text-danger">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      v-model="localValue"
      class="form__control"
    />
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error[0] ?? error }}</p>
  </div>
</template>

<style scoped></style>
