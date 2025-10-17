<script setup>
import { reactive, ref } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import { useAuthStore } from "@/stores/auth.js";
import BaseInput from "@/components/BaseInput.vue";

const authStore = useAuthStore();

const form = reactive({
    phone: "",
});


const forgotPassword = async () => {
    await authStore.forgot(form);
};
</script>

<template>
    <main class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <!-- Main Card -->
        <div class="w-full max-w-5xl bg-white rounded-lg grid grid-cols-1 md:grid-cols-2">

            <!-- Left Section -->
            <div class="flex flex-col justify-center items-center p-10">
                <img src="/auth.jpg" alt="Illustration" class="mb-6">
                <h2 class="text-2xl font-bold text-center mb-3">Show your skills be an innovator</h2>
                <p class="text-gray-500 text-center">
                    Seize the moment and help shape the future by starting a career in blockchain now
                </p>
                <div class="flex justify-center mt-6 space-x-2">
                    <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span class="w-2 h-2 bg-gray-300 rounded-full"></span>
                    <span class="w-2 h-2 bg-gray-300 rounded-full"></span>
                    <span class="w-2 h-2 bg-gray-300 rounded-full"></span>
                </div>
            </div>

            <!-- Right Section -->
            <div class="p-10">
                <h2 class="text-2xl font-bold mb-2">Sign In</h2>
                <p class="text-gray-500 mb-6">Welcome back, you've been missed!</p>

                <!-- Form -->
                <form @submit.prevent="forgotPassword">
                    <BaseInput v-model="form.phone" label="Phone" placeholder="Enter your phone" />
                    <BaseButton :loading="false" class="w-full">Submit</BaseButton>
                </form>

                <p class="text-sm text-center text-gray-600 mt-6">
                    Don’t have an account yet?
                    <RouterLink :to="{ name: 'login' }" class="text-blue-600 hover:underline">Login</RouterLink>
                </p>
            </div>
        </div>
    </main>
</template>

<style scoped>
input,
button {
    transition: all 0.2s ease-in-out;
}
</style>
