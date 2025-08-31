<template>
  <div class="flex min-h-screen" style="background-color: #10231d;">
    <!-- Sidebar (same as other pages) -->
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
        <div class="flex items-center space-x-4">
          <router-link to="/instructor/workshops" class="text-gray-300 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </router-link>
          <h1 class="text-3xl font-bold text-white">Create Workshop</h1>
        </div>
      </header>

      <!-- Form Content -->
      <main class="p-8 max-w-4xl mx-auto">
        <!-- Success Message -->
        <div v-if="successMessage" class="mb-6 rounded-lg bg-green-900/50 border border-green-700 p-4">
          <p class="text-green-300">{{ successMessage }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 rounded-lg bg-red-900/50 border border-red-700 p-4">
          <p class="text-red-300">{{ error }}</p>
        </div>

        <!-- Workshop Form -->
        <form @submit.prevent="createWorkshop" class="space-y-8">
          <!-- Basic Information -->
          <div class="card">
            <div class="border border-dark-green-600 rounded-lg p-6">
              <h2 class="text-xl font-semibold text-white mb-6">Basic Information</h2>
              
              <div class="grid grid-cols-1 gap-6">
                <!-- Workshop Title -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Workshop Title *
                  </label>
                  <input
                    v-model="form.title"
                    type="text"
                    required
                    class="input-field"
                    placeholder="e.g., Introduction to Robotics"
                  />
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    v-model="form.description"
                    required
                    rows="4"
                    class="input-field resize-none"
                    placeholder="Provide a detailed description of what students will learn in this workshop..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule Information -->
          <div class="card">
            <div class="border border-dark-green-600 rounded-lg p-6">
              <h2 class="text-xl font-semibold text-white mb-6">Schedule</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Workshop Date *
                  </label>
                  <input
                    v-model="form.date"
                    type="date"
                    required
                    class="input-field"
                    :min="today"
                  />
                </div>

                <!-- Time -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Workshop Time *
                  </label>
                  <input
                    v-model="form.time"
                    type="time"
                    required
                    class="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Links & Resources -->
          <div class="card">
            <div class="border border-dark-green-600 rounded-lg p-6">
              <h2 class="text-xl font-semibold text-white mb-6">Links & Resources</h2>
              
              <div class="grid grid-cols-1 gap-6">
                <!-- Video Link -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Video Conference Link *
                  </label>
                  <input
                    v-model="form.videoLink"
                    type="url"
                    required
                    class="input-field"
                    placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                  />
                  <p class="text-xs text-gray-400 mt-1">
                    Zoom, Google Meet, or any other video conferencing platform
                  </p>
                </div>

                <!-- Resource Link -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Resource Link
                    <span class="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    v-model="form.resourceLink"
                    type="url"
                    class="input-field"
                    placeholder="https://drive.google.com/folder/... or https://github.com/..."
                  />
                  <p class="text-xs text-gray-400 mt-1">
                    Google Drive folder, GitHub repository, or other learning materials
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex items-center justify-between pt-6">
            <router-link
              to="/instructor/workshops"
              class="btn-secondary"
            >
              Cancel
            </router-link>

            <div class="flex space-x-4">
              <button
                type="button"
                @click="saveDraft"
                :disabled="loading"
                class="btn-secondary"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary"
              >
                <span v-if="loading">Creating...</span>
                <span v-else>Create Workshop</span>
              </button>
            </div>
          </div>
        </form>

        <!-- Preview Section -->
        <div v-if="form.title || form.description" class="mt-12">
          <div class="card">
            <div class="border border-dark-green-600 rounded-lg p-6">
              <h2 class="text-xl font-semibold text-white mb-6">Preview</h2>
              
              <div class="bg-dark-green-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-3">
                  {{ form.title || 'Workshop Title' }}
                </h3>
                <p class="text-gray-300 mb-4">
                  {{ form.description || 'Workshop description will appear here...' }}
                </p>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div class="flex items-center text-gray-300">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {{ form.date || 'Date not set' }}
                  </div>
                  <div class="flex items-center text-gray-300">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ form.time || 'Time not set' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { instructorAPI } from '@/services/api'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  title: '',
  description: '',
  date: '',
  time: '',
  videoLink: '',
  resourceLink: ''
})

const loading = ref(false)
const error = ref(null)
const successMessage = ref(null)

// FIX: Use storeToRefs for reactive user data
const { user } = storeToRefs(auth)

// Get today's date for min date validation
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

async function createWorkshop() {
  loading.value = true
  error.value = null
  successMessage.value = null
  
  try {
    // Combine date and time into ISO string
    const dateTime = new Date(`${form.value.date}T${form.value.time}`).toISOString()
    
    const workshopData = {
      title: form.value.title,
      description: form.value.description,
      date: dateTime,
      videoLink: form.value.videoLink,
      resourceLink: form.value.resourceLink || undefined
    }
    
    const response = await instructorAPI.createWorkshop(workshopData)
    
    successMessage.value = 'Workshop created successfully!'
    
    // Reset form
    form.value = {
      title: '',
      description: '',
      date: '',
      time: '',
      videoLink: '',
      resourceLink: ''
    }
    
    // Redirect to workshops list after 2 seconds
    setTimeout(() => {
      router.push('/instructor/workshops')
    }, 2000)
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create workshop'
  } finally {
    loading.value = false
  }
}

async function saveDraft() {
  // For now, just show a message
  alert('Draft functionality coming soon!')
}

function logout() {
  auth.logout()
  router.push('/')
}
</script>
