<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "submit",
  },
  loading: {
    type: Boolean,
    default: false
  },

  disabled: {
    type: Boolean,
    default: false
  },

});
</script>

<template>
  <button :disabled="disabled || loading" :type="type" :class="[
    (disabled || loading) ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
    'flex items-center justify-center px-4 py-2 rounded text-gray-100 bg-primary hover:opacity-90 focus:outline-none focus:ring-0'
  ]">
    <template v-if="loading">
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      Please wait...
    </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<style scoped></style>