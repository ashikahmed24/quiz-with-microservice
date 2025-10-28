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
                    <img :src="user.avatar_url" class="rounded-full h-10 w-10" :alt="user.name" />
                    <div>
                      <h4 class="font-medium">
                        {{ user.name }}
                      </h4>
                      <span class="text-xs">@{{ user.name }}</span>
                    </div>
                  </a>
                </td>
                <td>{{ user.phone ?? 'N/A' }}</td>
                <td>{{ user.email ?? 'N/A' }}</td>
                <td>{{ user.created_at.human }}</td>
                <td>
                  <button type="button" class="badge badge__primary">View</button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="mt-8">
            <Pagination
              :total-items="users?.meta?.total ?? 0"
              :current-page="users?.meta?.current_page ?? 1"
              :items-per-page="users?.meta?.per_page ?? 10"
              :pages-to-show="1"
              @page-change="loadUsers"
              visible-always
            />
          </div>
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped></style>
