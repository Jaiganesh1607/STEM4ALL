<template>
  <div class="flex min-h-screen" style="background-color: #10231d;">
    <!-- Sidebar (same as dashboard) -->
    <div class="w-64 bg-dark-green-800 border-r border-dark-green-600">
      <div class="flex flex-col h-full">
        <!-- Logo/Brand -->
        <div class="px-6 py-6 border-b border-dark-green-600">
          <h1 class="text-xl font-bold text-white">STEM4All</h1>
          <p class="text-sm text-gray-400 mt-1">Instructor</p>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <router-link
            to="/instructor"
            class="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-green-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
            </svg>
            Dashboard
          </router-link>

          <router-link
            to="/instructor/workshops"
            class="flex items-center px-4 py-3 text-white bg-primary-500 rounded-lg transition-colors"
            active-class="bg-primary-500"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            Workshops
          </router-link>

          <router-link
            to="/instructor/students"
            class="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-green-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
            </svg>
            Students
          </router-link>

          <router-link
            to="/instructor/settings"
            class="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-green-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Settings
          </router-link>

          <router-link
            to="/instructor/help"
            class="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-green-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Help
          </router-link>
        </nav>

        <!-- User Profile / Logout -->
        <div class="px-4 py-4 border-t border-dark-green-600">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{ user?.name?.charAt(0) || 'U' }}
              </span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-white">{{ user?.name }}</p>
              <p class="text-xs text-gray-400">{{ user?.email }}</p>
            </div>
          </div>
          <button @click="logout" class="w-full btn-secondary text-sm">
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 overflow-auto">
      <!-- Top Header -->
      <header class="bg-dark-green-800 border-b border-dark-green-600 px-8 py-4 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-white">Workshops</h1>
        <router-link to="/instructor/workshops/create" class="btn-primary">
          + Create Workshop
        </router-link>
      </header>

      <!-- Workshops Content -->
      <main class="p-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <span class="ml-3 text-gray-400">Loading workshops...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="card mb-6">
          <div class="bg-red-900/50 border border-red-700 rounded-lg p-4">
            <p class="text-red-300">{{ error }}</p>
            <button @click="fetchWorkshops" class="btn-primary mt-3 text-sm">Retry</button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="workshops.length === 0" class="text-center py-16">
          <div class="mb-8">
            <svg class="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            <h3 class="text-xl font-semibold text-white mb-2">No workshops yet</h3>
            <p class="text-gray-400 mb-6">Create your first workshop to start teaching students</p>
            <router-link to="/instructor/workshops/create" class="btn-primary">
              Create Your First Workshop
            </router-link>
          </div>
        </div>

        <!-- Workshops Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="workshop in workshops"
            :key="workshop._id"
            class="card hover:border-primary-500 transition-colors cursor-pointer"
          >
            <div class="border border-dark-green-600 rounded-lg p-6 h-full flex flex-col">
              <!-- Workshop Header -->
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {{ workshop.title }}
                </h3>
                <p class="text-gray-400 text-sm line-clamp-3">
                  {{ workshop.description }}
                </p>
              </div>

              <!-- Workshop Details -->
              <div class="space-y-2 mb-6 flex-1">
                <div class="flex items-center text-sm text-gray-300">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {{ formatDate(workshop.date) }}
                </div>
                <div class="flex items-center text-sm text-gray-300">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ formatTime(workshop.date) }}
                </div>
                <div class="flex items-center text-sm text-gray-300">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  <a :href="workshop.videoLink" target="_blank" class="text-primary-400 hover:text-primary-300">
                    Video Link
                  </a>
                </div>
                <div v-if="workshop.resourceLink" class="flex items-center text-sm text-gray-300">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <a :href="workshop.resourceLink" target="_blank" class="text-primary-400 hover:text-primary-300">
                    Resources
                  </a>
                </div>
              </div>

              <!-- Workshop Status -->
              <div class="mb-4">
                <span
                  class="px-3 py-1 text-xs rounded-full"
                  :class="getStatusClass(workshop.date)"
                >
                  {{ getStatus(workshop.date) }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-2">
                <router-link
                  :to="`/instructor/workshops/${workshop._id}/edit`"
                  class="flex-1 btn-secondary text-center text-sm py-2"
                >
                  Edit
                </router-link>
                <router-link
                  :to="`/instructor/workshops/${workshop._id}/quiz`"
                  class="flex-1 btn-primary text-center text-sm py-2"
                >
                  Quiz
                </router-link>
                <button
                  @click="deleteWorkshop(workshop._id)"
                  class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                  title="Delete Workshop"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Workshop Count -->
        <div v-if="workshops.length > 0" class="mt-8 text-center">
          <p class="text-gray-400">
            Showing {{ workshops.length }} workshop{{ workshops.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { instructorAPI } from '@/services/api'

const router = useRouter()
const auth = useAuthStore()

const workshops = ref([])
const loading = ref(false)
const error = ref(null)

// FIX: Use storeToRefs for reactive user data
const { user } = storeToRefs(auth)

async function fetchWorkshops() {
  loading.value = true
  error.value = null
  
  try {
    const response = await instructorAPI.getWorkshops()
    workshops.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load workshops'
  } finally {
    loading.value = false
  }
}

async function deleteWorkshop(workshopId) {
  if (!confirm('Are you sure you want to delete this workshop?')) return
  
  try {
    await instructorAPI.deleteWorkshop(workshopId)
    workshops.value = workshops.value.filter(w => w._id !== workshopId)
  } catch (err) {
    alert('Failed to delete workshop: ' + (err.response?.data?.message || err.message))
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatus(dateString) {
  const now = new Date()
  const workshopDate = new Date(dateString)
  
  if (workshopDate > now) {
    return 'Scheduled'
  } else {
    return 'Completed'
  }
}

function getStatusClass(dateString) {
  const status = getStatus(dateString)
  return status === 'Scheduled' 
    ? 'bg-primary-500 text-white' 
    : 'bg-gray-600 text-gray-200'
}

function logout() {
  auth.logout()
  router.push('/')
}

onMounted(() => {
  fetchWorkshops()
})
</script>
