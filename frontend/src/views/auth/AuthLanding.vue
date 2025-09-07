<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: #10231d;">
    <div class="w-full max-w-2xl">
      <!-- Logo/Title -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">STEM4All</h1>
        <p class="text-gray-400">Access your comprehensive learning platform</p>
      </div>

      <!-- Role Tabs -->
      <div class="flex justify-center mb-6">
        <nav class="inline-flex rounded-lg bg-dark-green-800 border border-dark-green-600 p-1">
          <button
            v-for="r in roles"
            :key="r"
            @click="role = r"
            class="px-6 py-2 text-sm font-medium rounded-md transition-colors"
            :class="role === r
              ? 'bg-primary-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-dark-green-700'"
          >
            {{ capitalize(r) }}
          </button>
        </nav>
      </div>

      <!-- Form Card -->
      <div class="card">
        <!-- Toggle Login / Sign Up -->
        <div class="flex items-center justify-center gap-6 mb-6">
          <button
            @click="mode = 'login'"
            class="text-lg font-medium transition-colors"
            :class="mode === 'login' ? 'text-primary-400' : 'text-gray-500 hover:text-gray-300'"
          >
            Login
          </button>
          <div class="w-px h-6 bg-dark-green-600"></div>
          <button
            @click="mode = 'register'"
            class="text-lg font-medium transition-colors"
            :class="mode === 'register' ? 'text-primary-400' : 'text-gray-500 hover:text-gray-300'"
          >
            Sign Up
          </button>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mb-4 rounded-lg bg-green-900/50 border border-green-700 p-3 text-sm text-green-300">
          {{ successMessage }}
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 rounded-lg bg-red-900/50 border border-red-700 p-3 text-sm text-red-300">
          {{ error }}
        </div>

        <form @submit.prevent="onSubmit" class="space-y-4">
          <div v-if="mode === 'register'">
            <label class="block text-sm font-medium text-gray-300 mb-2">Full name</label>
            <input 
              v-model="name" 
              type="text" 
              class="input-field" 
              placeholder="Enter your full name" 
              :required="mode === 'register'" 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input 
              v-model="email" 
              type="email" 
              class="input-field" 
              placeholder="Enter your email" 
              required 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div class="relative">
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                class="input-field pr-12" 
                placeholder="Enter your password" 
                required 
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
              >
                <svg v-if="!showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.122-3.122L12 12m0 0l3.878 3.878m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Password Requirements (for registration) -->
          <div v-if="mode === 'register' && password" class="text-xs text-gray-400 space-y-1">
            <p :class="password.length >= 6 ? 'text-green-400' : 'text-gray-400'">
              ✓ At least 6 characters
            </p>
          </div>

          <!-- Role-specific additional fields -->
          <div v-if="mode === 'register' && role === 'instructor'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Institution/Organization</label>
              <input 
                v-model="institution" 
                type="text" 
                class="input-field" 
                placeholder="Enter your institution name" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Bio/Expertise</label>
              <textarea 
                v-model="bio" 
                class="input-field resize-none" 
                rows="3"
                placeholder="Brief description of your expertise and teaching background"
              ></textarea>
            </div>
          </div>

          <!-- Instructor note -->
          <div v-if="mode === 'register' && role === 'instructor'" class="rounded-lg bg-yellow-900/50 border border-yellow-700 p-3">
            <p class="text-sm text-yellow-300">
              📝 Instructor accounts require admin approval after registration. You'll receive an email confirmation once approved.
            </p>
          </div>

          <!-- Student welcome note -->
          <div v-if="mode === 'register' && role === 'student'" class="rounded-lg bg-blue-900/50 border border-blue-700 p-3">
            <p class="text-sm text-blue-300">
              🎓 Join thousands of students learning STEM concepts through interactive workshops and quizzes!
            </p>
          </div>

          <!-- Admin note -->
          <div v-if="mode === 'register' && role === 'admin'" class="rounded-lg bg-purple-900/50 border border-purple-700 p-3">
            <p class="text-sm text-purple-300">
              🔐 Admin account creation requires special authorization. Please contact the system administrator.
            </p>
          </div>

          <button 
            type="submit"
            :disabled="loading || (mode === 'register' && role === 'admin')" 
            class="btn-primary w-full text-lg py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else-if="mode === 'login'">Login as {{ capitalize(role) }}</span>
            <span v-else-if="mode === 'register' && role !== 'admin'">Create {{ capitalize(role) }} Account</span>
            <span v-else>Contact Administrator</span>
          </button>
        </form>
      </div>

      <!-- Features Preview -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div class="p-4 rounded-lg bg-dark-green-800/50 border border-dark-green-600">
          <div class="text-2xl mb-2">🎓</div>
          <h3 class="text-sm font-medium text-white mb-1">Interactive Learning</h3>
          <p class="text-xs text-gray-400">Hands-on workshops and quizzes</p>
        </div>
        <div class="p-4 rounded-lg bg-dark-green-800/50 border border-dark-green-600">
          <div class="text-2xl mb-2">📊</div>
          <h3 class="text-sm font-medium text-white mb-1">Progress Tracking</h3>
          <p class="text-xs text-gray-400">Monitor your learning journey</p>
        </div>
        <div class="p-4 rounded-lg bg-dark-green-800/50 border border-dark-green-600">
          <div class="text-2xl mb-2">🏆</div>
          <h3 class="text-sm font-medium text-white mb-1">Certificates</h3>
          <p class="text-xs text-gray-400">Earn recognition for achievements</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          Selected role: <span class="font-semibold text-primary-400">{{ capitalize(role) }}</span>
        </p>
        <p class="text-xs text-gray-600 mt-2">
          Having trouble? <button @click="showHelp = !showHelp" class="text-primary-400 hover:text-primary-300 underline">Get help</button>
        </p>
      </div>

      <!-- Help Modal/Section -->
      <div v-if="showHelp" class="mt-4 card">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-white">Need Help?</h3>
          <button @click="showHelp = false" class="text-gray-400 hover:text-white">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-3 text-sm text-gray-300">
          <div>
            <h4 class="font-medium text-white mb-1">For Students:</h4>
            <p>Register with your email to access workshops, take quizzes, and track your progress.</p>
          </div>
          <div>
            <h4 class="font-medium text-white mb-1">For Instructors:</h4>
            <p>Create an account to design workshops, manage students, and view analytics. Admin approval required.</p>
          </div>
          <div>
            <h4 class="font-medium text-white mb-1">For Admins:</h4>
            <p>Contact the system administrator for admin account creation and platform management access.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const auth = useAuthStore()

console.log('🚀 AuthLanding.vue loaded')
console.log('Auth store:', auth)

const roles = ['admin', 'instructor', 'student']
const role = ref('student') // Default to student for better UX
const mode = ref('login')
const name = ref('')
const email = ref('')
const password = ref('')
const institution = ref('')
const bio = ref('')
const showPassword = ref(false)
const showHelp = ref(false)
const successMessage = ref('')

const { loading, error, user } = storeToRefs(auth)

console.log('Reactive state:', { loading: loading.value, error: error.value, user: user.value })

function capitalize(s) { 
  return s.charAt(0).toUpperCase() + s.slice(1) 
}

function clearMessages() {
  successMessage.value = ''
  auth.clearError()
}

async function onSubmit() {
  console.log('🔥 FORM SUBMITTED!')
  console.log('Form data:', { 
    mode: mode.value, 
    role: role.value, 
    email: email.value,
    password: password.value ? '***' : 'empty'
  })
  
  clearMessages()
  
  try {
    if (mode.value === 'login') {
      console.log('📞 Calling auth.login...')
      
      const result = await auth.login({ 
        email: email.value, 
        password: password.value, 
        role: role.value 
      })
      
      console.log('✅ Login result:', result)
      console.log('Auth user after login:', auth.user)
      
      if (result.success) {
        console.log('🎉 Login successful, attempting redirect...')
        
        // Clear form
        email.value = ''
        password.value = ''
        
        // Navigate based on role and approval status
        if (auth.user?.role === 'admin') {
          console.log('🎯 Redirecting admin to /admin')
          await router.push('/admin')
        } else if (auth.user?.role === 'instructor' && auth.user?.approved) {
          console.log('🎯 Redirecting instructor to /instructor')
          await router.push('/instructor')
        } else if (auth.user?.role === 'instructor' && !auth.user?.approved) {
          console.log('❌ Instructor not approved')
          successMessage.value = 'Your instructor account is pending approval. Please contact an administrator.'
          await auth.logout()
        } else if (auth.user?.role === 'student') {
          console.log('🎯 Redirecting student to /student')
          await router.push('/student')
        } else {
          console.log('❌ Unknown user state:', { role: auth.user?.role, approved: auth.user?.approved })
          successMessage.value = 'Login successful! Redirecting...'
        }
      } else {
        console.log('❌ Login failed:', result.error)
      }
    } else {
      // Register mode
      console.log('📞 Calling auth.register...')
      
      // Prevent admin registration through UI
      if (role.value === 'admin') {
        error.value = 'Admin accounts cannot be created through this interface. Please contact the system administrator.'
        return
      }
      
      const registerData = {
        name: name.value, 
        email: email.value, 
        password: password.value, 
        role: role.value
      }
      
      // Add instructor-specific fields
      if (role.value === 'instructor') {
        registerData.institution = institution.value
        registerData.bio = bio.value
      }
      
      const result = await auth.register(registerData)
      
      console.log('✅ Register result:', result)
      
      if (result.success) {
        // Clear form
        name.value = ''
        email.value = ''
        password.value = ''
        institution.value = ''
        bio.value = ''
        
        if (role.value === 'instructor') {
          console.log('🔔 Instructor registered, needs approval')
          successMessage.value = 'Instructor account created successfully! Please wait for admin approval before logging in. You will receive an email confirmation once approved.'
          mode.value = 'login' // Switch to login mode
        } else if (role.value === 'student') {
          console.log('🎯 Student registration successful, redirecting...')
          successMessage.value = 'Account created successfully! Redirecting to dashboard...'
          setTimeout(async () => {
            await router.push('/student')
          }, 1500)
        }
      }
    }
  } catch (err) {
    console.error('💥 Form submission error:', err)
    error.value = 'An unexpected error occurred. Please try again.'
  }
}

// Watch for role changes to clear form
import { watch } from 'vue'
watch(role, () => {
  clearMessages()
  // Clear instructor-specific fields when switching away from instructor
  if (role.value !== 'instructor') {
    institution.value = ''
    bio.value = ''
  }
})

// Watch for mode changes to clear messages
watch(mode, () => {
  clearMessages()
})
</script>
