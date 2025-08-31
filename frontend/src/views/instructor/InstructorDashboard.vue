<template>
  <div class="flex min-h-screen" style="background-color: #10231d;">
    <!-- Sidebar -->
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
            class="flex items-center px-4 py-3 text-white bg-primary-500 rounded-lg transition-colors"
            active-class="bg-primary-500"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
            </svg>
            Dashboard
          </router-link>

          <router-link
            to="/instructor/workshops"
            class="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-green-700 rounded-lg transition-colors"
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
      <header class="bg-dark-green-800 border-b border-dark-green-600 px-8 py-4">
        <h1 class="text-3xl font-bold text-white">Dashboard</h1>
      </header>

      <!-- Dashboard Content -->
      <main class="p-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <span class="ml-3 text-gray-400">Loading dashboard...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="card mb-6">
          <div class="bg-red-900/50 border border-red-700 rounded-lg p-4">
            <p class="text-red-300">{{ error }}</p>
            <button @click="fetchDashboardData" class="btn-primary mt-3 text-sm">Retry</button>
          </div>
        </div>

        <!-- Dashboard Content -->
        <div v-else>
          <!-- Stats Cards Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Total Enrollments -->
            <div class="card">
              <div class="border border-dark-green-600 rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-400 mb-2">Total Enrollments</h3>
                <p class="text-4xl font-bold text-white">{{ stats.totalEnrollments }}</p>
              </div>
            </div>

            <!-- Average Student Progress -->
            <div class="card">
              <div class="border border-dark-green-600 rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-400 mb-2">Average Student Progress</h3>
                <p class="text-4xl font-bold text-white">{{ Math.round(stats.averageProgress) }}%</p>
              </div>
            </div>
          </div>

          <!-- Upcoming Workshops Table -->
          <div class="card mb-8">
            <div class="border border-dark-green-600 rounded-lg p-6">
              <h3 class="text-xl font-semibold text-white mb-6">Upcoming Workshops</h3>
              
              <div v-if="workshops.length === 0" class="text-center py-8">
                <p class="text-gray-400 mb-4">No workshops created yet</p>
                <router-link to="/instructor/workshops/create" class="btn-primary inline-block">
                  Create Your First Workshop
                </router-link>
              </div>

              <div v-else class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-dark-green-600">
                      <th class="text-left py-3 px-4 text-gray-400 font-medium">Workshop</th>
                      <th class="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                      <th class="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                      <th class="text-left py-3 px-4 text-gray-400 font-medium">Students</th>
                      <th class="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="workshop in workshops" :key="workshop._id" class="border-b border-dark-green-700">
                      <td class="py-4 px-4 text-white font-medium">{{ workshop.title }}</td>
                      <td class="py-4 px-4 text-gray-300">{{ new Date(workshop.date).toISOString().split('T')[0] }}</td>
                      <td class="py-4 px-4 text-gray-300">{{ new Date(workshop.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</td>
                      <td class="py-4 px-4 text-gray-300">{{ stats.totalEnrollments }}</td>
                      <td class="py-4 px-4">
                        <span class="px-3 py-1 bg-primary-500 text-white text-sm rounded-full">
                          Scheduled
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Student Analytics -->
          <div class="card">
            <div class="border border-dark-green-600 rounded-lg p-6">
              <h3 class="text-xl font-semibold text-white mb-6">Student Analytics</h3>
              
              <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h4 class="text-lg font-medium text-white">Student Progress</h4>
                    <p class="text-sm text-gray-400">
                      Last 30 Days 
                      <span class="text-primary-400 ml-2">+{{ Math.round(stats.averageProgress / 4) }}%</span>
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-3xl font-bold text-white">{{ Math.round(stats.averageProgress) }}%</p>
                  </div>
                </div>

                <!-- Simple Progress Chart (bars) -->
                <div class="flex items-end justify-between h-24 space-x-2">
                  <div class="flex flex-col items-center space-y-2 flex-1">
                    <div class="w-full bg-primary-500 rounded-t" :style="`height: ${Math.max(20, Math.round(stats.averageProgress * 0.5))}%`"></div>
                    <span class="text-xs text-gray-400">Week 1</span>
                  </div>
                  <div class="flex flex-col items-center space-y-2 flex-1">
                    <div class="w-full bg-primary-500 rounded-t" :style="`height: ${Math.max(30, Math.round(stats.averageProgress * 0.8))}%`"></div>
                    <span class="text-xs text-gray-400">Week 2</span>
                  </div>
                  <div class="flex flex-col items-center space-y-2 flex-1">
                    <div class="w-full bg-primary-500 rounded-t" :style="`height: ${Math.max(15, Math.round(stats.averageProgress * 0.3))}%`"></div>
                    <span class="text-xs text-gray-400">Week 3</span>
                  </div>
                  <div class="flex flex-col items-center space-y-2 flex-1">
                    <div class="w-full bg-primary-500 rounded-t" :style="`height: ${Math.max(25, Math.round(stats.averageProgress * 0.9))}%`"></div>
                    <span class="text-xs text-gray-400">Week 4</span>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { instructorAPI } from '@/services/api'

const router = useRouter()
const auth = useAuthStore()

const stats = ref({ totalEnrollments: 0, averageProgress: 0 })
const workshops = ref([])
const loading = ref(false)
const error = ref(null)

// FIX: Use storeToRefs for reactive user data
const { user } = storeToRefs(auth)

async function fetchDashboardData() {
  loading.value = true
  error.value = null
  
  try {
    const [statsResponse, workshopsResponse] = await Promise.all([
      instructorAPI.getDashboardStats(),
      instructorAPI.getWorkshops()
    ])
    
    stats.value = statsResponse.data
    workshops.value = workshopsResponse.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load dashboard data'
  } finally {
    loading.value = false
  }
}

function logout() {
  auth.logout()
  router.push('/')
}

onMounted(() => {
  fetchDashboardData()
})
</script>
