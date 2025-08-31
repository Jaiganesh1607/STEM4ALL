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
          <router-link to="/instructor" class="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-green-700 rounded-lg transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
            </svg>
            Dashboard
          </router-link>

          <router-link to="/instructor/workshops" class="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-green-700 rounded-lg transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            Workshops
          </router-link>

          <router-link to="/instructor/students" class="flex items-center px-4 py-3 text-white bg-primary-500 rounded-lg transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
            </svg>
            Students
          </router-link>

          <router-link to="/instructor/settings" class="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-green-700 rounded-lg transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Settings
          </router-link>

          <router-link to="/instructor/help" class="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-green-700 rounded-lg transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Help
          </router-link>
        </nav>

        <!-- User Profile -->
        <div class="px-4 py-4 border-t border-dark-green-600">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">{{ user?.name?.charAt(0) || 'U' }}</span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-white">{{ user?.name }}</p>
              <p class="text-xs text-gray-400">{{ user?.email }}</p>
            </div>
          </div>
          <button @click="logout" class="w-full btn-secondary text-sm">Logout</button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <header class="bg-dark-green-800 border-b border-dark-green-600 px-8 py-4">
        <h1 class="text-3xl font-bold text-white">Student Analytics</h1>
      </header>

      <main class="p-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <span class="ml-3 text-gray-400">Loading analytics...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="card mb-6">
          <div class="bg-red-900/50 border border-red-700 rounded-lg p-4">
            <p class="text-red-300">{{ error }}</p>
            <button @click="fetchAnalytics" class="btn-primary mt-3 text-sm">Retry</button>
          </div>
        </div>

        <!-- Analytics Dashboard -->
        <div v-else>
          <!-- Summary Stats -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Students -->
            <div class="card">
              <div class="border border-dark-green-600 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-400">Total Students</p>
                    <p class="text-2xl font-bold text-white">{{ students.length }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Active Students -->
            <div class="card">
              <div class="border border-dark-green-600 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-400">Active Students</p>
                    <p class="text-2xl font-bold text-white">{{ activeStudents }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Avg Quiz Score -->
            <div class="card">
              <div class="border border-dark-green-600 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-400">Avg Quiz Score</p>
                    <p class="text-2xl font-bold text-white">{{ avgQuizScore }}%</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Completion Rate -->
            <div class="card">
              <div class="border border-dark-green-600 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-400">Completion Rate</p>
                    <p class="text-2xl font-bold text-white">{{ completionRate }}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Charts (Simple Bars) -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Progress Over Time -->
            <div class="card">
              <div class="border border-dark-green-600 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Progress Over Time</h3>
                <div class="space-y-4">
                  <div v-for="(week, index) in weeklyProgress" :key="index" class="flex items-center">
                    <span class="text-gray-400 text-sm w-16">{{ week.label }}</span>
                    <div class="flex-1 bg-dark-green-700 rounded-full h-4 mx-4">
                      <div class="bg-primary-500 h-4 rounded-full transition-all" :style="`width: ${week.value}%`"></div>
                    </div>
                    <span class="text-white text-sm font-medium">{{ week.value }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quiz Scores Distribution -->
            <div class="card">
              <div class="border border-dark-green-600 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Quiz Scores Distribution</h3>
                <div class="space-y-4">
                  <div v-for="score in scoreDistribution" :key="score.range" class="flex items-center justify-between">
                    <span class="text-gray-300 text-sm">{{ score.range }}</span>
                    <div class="flex items-center space-x-3">
                      <div class="w-32 bg-dark-green-700 rounded-full h-3">
                        <div class="h-3 rounded-full transition-all" :class="score.color" :style="`width: ${score.percentage}%`"></div>
                      </div>
                      <span class="text-white text-sm w-8">{{ score.count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Students List -->
          <div class="card">
            <div class="border border-dark-green-600 rounded-lg p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-white">Student Performance</h3>
                <div class="flex items-center space-x-4">
                  <!-- Search -->
                  <div class="relative">
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search students..."
                      class="input-field w-64 pl-10"
                    />
                    <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>

                  <!-- Filter Dropdown -->
                  <div class="relative">
                    <select v-model="statusFilter" class="input-field w-32">
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <!-- Export Button -->
                  <button @click="exportData" class="btn-secondary text-sm">
                    Export CSV
                  </button>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="filteredStudents.length === 0 && !searchQuery && !statusFilter" class="text-center py-12">
                <svg class="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                </svg>
                <h3 class="text-xl font-semibold text-white mb-2">No student activity yet</h3>
                <p class="text-gray-400">Students will appear here once they start taking quizzes</p>
              </div>

              <!-- Students Table -->
              <div v-else-if="filteredStudents.length > 0" class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-dark-green-600">
                      <th @click="sortBy('name')" class="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white">
                        Student
                        <svg v-if="sortKey === 'name'" class="inline w-3 h-3 ml-1" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M6 9l-3-3h6z"/>
                        </svg>
                      </th>
                      <th class="text-left py-3 px-4 text-gray-400 font-medium">Workshop</th>
                      <th @click="sortBy('progress')" class="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white">
                        Progress
                        <svg v-if="sortKey === 'progress'" class="inline w-3 h-3 ml-1" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M6 9l-3-3h6z"/>
                        </svg>
                      </th>
                      <th @click="sortBy('quizScore')" class="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white">
                        Quiz Score
                        <svg v-if="sortKey === 'quizScore'" class="inline w-3 h-3 ml-1" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M6 9l-3-3h6z"/>
                        </svg>
                      </th>
                      <th class="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th class="text-left py-3 px-4 text-gray-400 font-medium">Last Activity</th>
                      <th class="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="student in paginatedStudents" :key="student.id" class="border-b border-dark-green-700 hover:bg-dark-green-700">
                      <td class="py-4 px-4">
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                            <span class="text-white text-sm font-medium">{{ student.name.charAt(0) }}</span>
                          </div>
                          <div>
                            <p class="text-white font-medium">{{ student.name }}</p>
                            <p class="text-gray-400 text-sm">{{ student.email }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 px-4 text-gray-300">{{ student.workshop }}</td>
                      <td class="py-4 px-4">
                        <div class="flex items-center">
                          <div class="flex-1 bg-dark-green-700 rounded-full h-2 mr-3 max-w-[100px]">
                            <div class="bg-primary-500 h-2 rounded-full transition-all" :style="`width: ${student.progress}%`"></div>
                          </div>
                          <span class="text-gray-300 text-sm">{{ student.progress }}%</span>
                        </div>
                      </td>
                      <td class="py-4 px-4">
                        <span class="text-gray-300" :class="getScoreColor(student.quizScore)">{{ student.quizScore }}%</span>
                      </td>
                      <td class="py-4 px-4">
                        <span class="px-3 py-1 text-xs rounded-full" :class="getStatusClass(student.status)">{{ student.status }}</span>
                      </td>
                      <td class="py-4 px-4 text-gray-400 text-sm">{{ student.lastActivity }}</td>
                      <td class="py-4 px-4">
                        <div class="flex space-x-2">
                          <button @click="viewStudentDetails(student)" class="text-primary-400 hover:text-primary-300 text-sm">
                            View
                          </button>
                          <button @click="sendMessage(student)" class="text-blue-400 hover:text-blue-300 text-sm">
                            Message
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="flex items-center justify-between mt-6">
                  <div class="text-sm text-gray-400">
                    Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredStudents.length) }} of {{ filteredStudents.length }} students
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="currentPage = Math.max(1, currentPage - 1)"
                      :disabled="currentPage === 1"
                      class="px-3 py-1 text-sm rounded border border-dark-green-600 text-gray-400 hover:text-white disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span v-for="page in visiblePages" :key="page">
                      <button
                        v-if="page !== '...'"
                        @click="currentPage = page"
                        :class="currentPage === page ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'"
                        class="px-3 py-1 text-sm rounded border border-dark-green-600"
                      >
                        {{ page }}
                      </button>
                      <span v-else class="px-3 py-1 text-sm text-gray-400">...</span>
                    </span>
                    <button
                      @click="currentPage = Math.min(totalPages, currentPage + 1)"
                      :disabled="currentPage === totalPages"
                      class="px-3 py-1 text-sm rounded border border-dark-green-600 text-gray-400 hover:text-white disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              <!-- No Search Results -->
              <div v-else class="text-center py-8">
                <p class="text-gray-400">No students found matching your criteria</p>
                <button @click="clearFilters" class="btn-secondary mt-3 text-sm">Clear Filters</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { instructorAPI } from '@/services/api'

const router = useRouter()
const auth = useAuthStore()

// State
const students = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const sortKey = ref('name')
const sortOrder = ref('asc')
const currentPage = ref(1)
const pageSize = 10

// Mock data with more students for demonstration
const mockStudents = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    workshop: 'Robotics Fundamentals',
    progress: 85,
    quizScore: 92,
    status: 'Active',
    lastActivity: '2 hours ago'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    workshop: 'Robotics Fundamentals',
    progress: 65,
    quizScore: 78,
    status: 'In Progress',
    lastActivity: '1 day ago'
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol@example.com',
    workshop: 'Robotics Fundamentals',
    progress: 100,
    quizScore: 96,
    status: 'Completed',
    lastActivity: '3 days ago'
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david@example.com',
    workshop: 'Robotics Fundamentals',
    progress: 45,
    quizScore: 68,
    status: 'In Progress',
    lastActivity: '5 hours ago'
  },
  {
    id: 5,
    name: 'Emma Brown',
    email: 'emma@example.com',
    workshop: 'Robotics Fundamentals',
    progress: 90,
    quizScore: 88,
    status: 'Active',
    lastActivity: '1 hour ago'
  }
]

const weeklyProgress = ref([
  { label: 'Week 1', value: 25 },
  { label: 'Week 2', value: 45 },
  { label: 'Week 3', value: 65 },
  { label: 'Week 4', value: 85 }
])

const scoreDistribution = ref([
  { range: '90-100%', count: 2, color: 'bg-primary-500', percentage: 40 },
  { range: '80-89%', count: 1, color: 'bg-blue-500', percentage: 20 },
  { range: '70-79%', count: 1, color: 'bg-yellow-500', percentage: 20 },
  { range: '60-69%', count: 1, color: 'bg-orange-500', percentage: 20 },
  { range: '<60%', count: 0, color: 'bg-red-500', percentage: 0 }
])

// FIX: Use storeToRefs for reactive user data
const { user } = storeToRefs(auth)

// Computed properties
const filteredStudents = computed(() => {
  let filtered = students.value

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(student =>
      student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(student => student.status === statusFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    let aValue = a[sortKey.value]
    let bValue = b[sortKey.value]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (sortOrder.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  return filtered
})

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredStudents.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / pageSize))

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

const activeStudents = computed(() => 
  students.value.filter(s => s.status === 'Active' || s.status === 'In Progress').length
)

const avgQuizScore = computed(() => {
  if (students.value.length === 0) return 0
  const total = students.value.reduce((sum, s) => sum + s.quizScore, 0)
  return Math.round(total / students.value.length)
})

const completionRate = computed(() => {
  if (students.value.length === 0) return 0
  const completed = students.value.filter(s => s.status === 'Completed').length
  return Math.round((completed / students.value.length) * 100)
})

// Methods
async function fetchAnalytics() {
  loading.value = true
  error.value = null
  
  try {
    // For demo purposes, use mock data
    // In production, replace with: const response = await instructorAPI.getStudents()
    students.value = mockStudents
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load analytics'
  } finally {
    loading.value = false
  }
}

function sortBy(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  currentPage.value = 1
}

function getStatusClass(status) {
  switch (status) {
    case 'Active':
      return 'bg-green-500 text-white'
    case 'In Progress':
      return 'bg-yellow-500 text-white'
    case 'Completed':
      return 'bg-primary-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

function getScoreColor(score) {
  if (score >= 90) return 'text-green-400'
  if (score >= 80) return 'text-blue-400'
  if (score >= 70) return 'text-yellow-400'
  if (score >= 60) return 'text-orange-400'
  return 'text-red-400'
}

function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

function exportData() {
  const csvContent = [
    ['Name', 'Email', 'Workshop', 'Progress', 'Quiz Score', 'Status', 'Last Activity'],
    ...filteredStudents.value.map(student => [
      student.name,
      student.email,
      student.workshop,
      `${student.progress}%`,
      `${student.quizScore}%`,
      student.status,
      student.lastActivity
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'student-analytics.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

function viewStudentDetails(student) {
  // Implement student detail view
  alert(`Viewing details for ${student.name}`)
}

function sendMessage(student) {
  // Implement messaging functionality
  alert(`Sending message to ${student.name}`)
}

function logout() {
  auth.logout()
  router.push('/')
}

onMounted(() => {
  fetchAnalytics()
})
</script>
