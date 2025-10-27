<script setup>
import Default from '@/layouts/Default.vue'
import { useUserStore } from '@/stores/user'
import DateFormat from '@/utils/DateFormat'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()

const users = ref([])

const loadUsers = async (page = 1) => {
  const response = await userStore.all(page)
  users.value = response.data
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Users</h3>
      </div>
      <div class="card__body">
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Joined At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users">
                <td>
                  <a href="#" class="flex max-lg:justify-end items-center gap-3">
                    <img
                      src="https://ui-avatars.com/api/?name=Benjamin Goveya"
                      class="rounded-full h-10 w-10"
                      :alt="user.name"
                    />
                    <div>
                      <h4 class="font-medium">
                        {{ user.name }}
                      </h4>
                      <span class="text-xs">@benjamin-goveya</span>
                    </div>
                  </a>
                </td>
                <td>{{ user.phone ?? 'N/A' }}</td>
                <td>{{ user.email ?? 'N/A' }}</td>
                <td>{{ DateFormat(user.created_at) }}</td>
                <td>
                  <button type="button" class="badge badge__primary">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped></style>
