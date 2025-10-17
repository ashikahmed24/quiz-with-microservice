<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

defineProps({
    tabs: {
        type: Array,
        required: true
    }
})
</script>

<template>
    <TabGroup>
        <!-- Tab headers -->
        <TabList class="flex flex-wrap items-center gap-2">
            <Tab v-for="(tab, index) in tabs" :key="index" v-slot="{ selected }" as="template">
                <button class="px-4 py-2 text-sm font-medium focus:outline-none cursor-pointer rounded" :class="selected
                    ? 'bg-primary text-white'
                    : 'bg-white text-body hover:bg-primary-hover hover:text-primary'">
                    {{ tab.label }}
                </button>
            </Tab>
        </TabList>

        <!-- Tab panels -->
        <TabPanels class="mt-2 w-full">
            <TabPanel v-for="(tab, index) in tabs" :key="index" class="w-full">
                <slot :name="tab.slot" />
            </TabPanel>
        </TabPanels>
    </TabGroup>
</template>
