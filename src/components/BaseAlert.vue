<script setup>
import { ref, computed, watchEffect } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "info", // success | error | warning | info
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Number,
    default: 3000, // 3 seconds
  },
});

const visible = ref(true);

const typeClasses = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-green-50 text-green-800 border-green-300";
    case "error":
      return "bg-red-50 text-red-800 border-red-300";
    case "warning":
      return "bg-yellow-50 text-yellow-800 border-yellow-300";
    default:
      return "bg-blue-50 text-blue-800 border-blue-300";
  }
});

const icon = computed(() => {
  switch (props.type) {
    case "success":
      return 'x';
    case "error":
      return 'x';
    case "warning":
      return 'x';
    default:
      return 'x';
  }
});

const close = () => (visible.value = false);

if (props.autoClose) {
  setTimeout(() => (visible.value = false), props.duration);
}
</script>


<template>
  <transition name="fade">
    <div
      
      :class="[
        'flex items-start gap-3 p-4 rounded-lg shadow-md text-sm border',
        typeClasses,
      ]"
    >
      <component :is="icon" class="w-5 h-5 mt-0.5" />
      <div class="flex-grow">
        <p v-if="message" class="mt-0.5">{{ message }}</p>
      </div>
      <button @click="close" class="text-gray-500 hover:text-gray-700">
        ✕
      </button>
    </div>
  </transition>
</template>



<style scoped>

</style>
