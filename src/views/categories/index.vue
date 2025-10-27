<script setup>
import BaseButton from '@/components/BaseButton.vue'
import Default from '@/layouts/Default.vue'
import { onMounted, reactive, ref } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { string } from '@/utils/string.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const categoryStore = useCategoryStore()

const categories = ref([])

const form = reactive({
  name: '',
  slug: '',
  description: '',
  is_active: true,
})

const submit = async () => {
  await categoryStore.store(form, { router, toast })
  await loadCategories()
}

const loadCategories = async (page = 1) => {
  const response = await categoryStore.all(page)
  categories.value = response.data
}

const deleteCategory = async (category) => {
  if (confirm('Are you sure you went to deleted this category?')) {
    await categoryStore.delete(category)
  }
  await loadCategories()
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <Default>
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card col-span-2">
        <div class="card__header">
          <h3 class="card__title">All Categories</h3>
        </div>
        <div class="card__body">
          <table>
            <thead>
              <th>ID</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Active</th>
            </thead>
            <tbody>
              <tr v-for="(category, index) in categories">
                <td>{{ index + 1 }}</td>
                <td>{{ category.name }}</td>
                <td>{{ category.slug }}</td>
                <td>{{ string(category.description) }}</td>
                <td>
                  <button
                    type="button"
                    @click.prevent="deleteCategory(category.id)"
                    class="badge badge__danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card__header">
          <h3 class="card__title">Add Categories</h3>
        </div>
        <div class="card__body">
          <form @submit.prevent="submit">
            <div class="form__group">
              <label class="form__label">Name</label>
              <input
                type="text"
                v-model="form.name"
                class="form__control"
                placeholder="Enter name"
              />
            </div>
            <div class="form__group">
              <label class="form__label">Slug</label>
              <input
                type="text"
                v-model="form.slug"
                class="form__control"
                placeholder="Enter slug"
              />
            </div>
            <div class="form__group">
              <label class="form__label">Description</label>
              <input
                type="text"
                v-model="form.description"
                class="form__control"
                placeholder="Enter description"
              />
            </div>
            <div class="form__group">
              <label class="form__label">Active</label>
              <select v-model="form.is_active" class="form__select w-full">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </div>
            <div class="mt-6">
              <BaseButton :loading="categoryStore.loading" class="w-full">Submit</BaseButton>
            </div>
          </form>
        </div>
      </div>
    </section>
  </Default>
</template>

<style scoped></style>
