<script setup>
import Default from '@/layouts/Default.vue'
import { onMounted, reactive, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { useQuizStore } from '@/stores/quiz'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()

const quizStore = useQuizStore()
const toast = useToast()
const router = useRouter()

const categories = ref([])

const form = reactive({
  title: '',
  description: '',
  total_marks: '',
  passing_marks: '',
  duration: '',
  category_id: '',
  shuffle: false,
  allow_blank: false,
  negative_marking: false,
  email_notify: false,
  published: true,
  start_time: '',
  end_time: '',
})

const submit = () => {
  quizStore.store(form, { toast, router })
}

const loadCategories = async () => {
  const response = await categoryStore.search('')
  categories.value = response.data
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <Default>
    <div class="flex flex-wrap items-start gap-6">
      <div class="grow">
        <div class="card">
          <div class="card__header">
            <h3 class="card__title">Add Quiz</h3>
          </div>

          <div class="card__body space-y-4">
            <div class="form__group">
              <label class="form__label">Title</label>
              <input type="text" v-model="form.title" class="form__control" />
            </div>

            <div class="form__group">
              <label class="form__label">Description</label>
              <textarea v-model="form.description" class="form__control" rows="3"></textarea>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div class="form__group">
                <label class="form__label">Total Marks</label>
                <input type="number" v-model.number="form.total_marks" class="form__control" />
              </div>
              <div class="form__group">
                <label class="form__label">Passing Marks</label>
                <input type="number" v-model.number="form.passing_marks" class="form__control" />
              </div>
              <div class="form__group">
                <label class="form__label">Duration (min)</label>
                <input type="number" v-model.number="form.duration" class="form__control" />
              </div>
            </div>

            <!-- Date & Time -->
            <div class="grid grid-cols-2 gap-4">
              <div class="form__group">
                <label class="form__label">Start Time</label>
                <input type="datetime-local" v-model="form.start_time" class="form__control" />
              </div>
              <div class="form__group">
                <label class="form__label">End Time</label>
                <input type="datetime-local" v-model="form.end_time" class="form__control" />
              </div>
            </div>

            <div class="pt-4">
              <BaseButton @click="submit" :loading="quizStore.loading">Submit</BaseButton>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-none w-auto">
        <div class="card">
          <div class="card__header">
            <h3 class="card__title">Settings</h3>
          </div>

          <div class="card__body">
            <div class="form__group mb-4">
              <label class="form__label">Categories</label>
              <select v-model="form.category_id" class="form__select w-full">
                <option value="" disabled>Select categories</option>
                <option :value="category.id" v-for="category in categories" :key="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-2">
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="form.shuffle" class="form-checkbox" />
                Shuffle Questions
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="form.allow_blank" class="form-checkbox" />
                Allow Blank Answers
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="form.negative_marking" class="form-checkbox" />
                Negative Marking
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="form.email_notify" class="form-checkbox" />
                Email Notification
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="form.is_active" class="form-checkbox" />
                Active
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped></style>
