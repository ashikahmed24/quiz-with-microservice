<script setup>
import IconClose from "@/components/icons/IconClose.vue";

const props = defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: '' },
})

const emit = defineEmits(['close'])
</script>

<template>
  <div v-if="show" class="fixed flex items-center justify-center inset-0 bg-transparent z-50 overflow-y-auto">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg relative">
      <div class="flex justify-between items-center border-b border-border p-4">
        <h2 class="text-dark text-lg font-semibold">{{ title }}</h2>
        <button @click="$emit('close')" class="bg-danger text-white p-0.5 rounded-full hover:text-opacity-90 cursor-pointer">
          <IconClose class="size-4"/>
        </button>
      </div>
      <div class="space-y-4 p-4">
        <slot />
      </div>
      <div class="flex justify-end gap-2 p-4">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
