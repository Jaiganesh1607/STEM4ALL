<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: #10231d;">
    <div class="w-full max-w-2xl">
      <!-- Logo/Title -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">STEM4All</h1>
        <p class="text-gray-400">Access your learning dashboard</p>
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
            <input 
              v-model="password" 
              type="password" 
              class="input-field" 
              placeholder="Enter your password" 
              required 
            />
          </div>

          <!-- Instructor note -->
          <div v-if="mode === 'register' && role === 'instructor'" class="rounded-lg bg-yellow-900/50 border border-yellow-700 p-3">
            <p class="text-sm text-yellow-300">
              📝 Instructor accounts require admin approval after registration.
            </p>
          </div>

          <button 
            type="submit"
            :disabled="loading" 
            class="btn-primary w-full text-lg py-4 mt-6"
          >
            <span v-if="mode === 'login' && !loading">Login as {{ capitalize(role) }}</span>
            <span v-else-if="mode === 'register' && !loading">Create {{ capitalize(role) }} Account</span>
            <span v-else>Processing...</span>
          </button>
        </form>
      </div>

      <!-- Footer -->
      <p class="mt-6 text-center text-sm text-gray-500">
        Selected role: <span class="font-semibold text-primary-400">{{ capitalize(role) }}</span>
      </p>
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
const role = ref('instructor')
const mode = ref('login')
const name = ref('')
const email = ref('')
const password = ref('')

const { loading, error, user } = storeToRefs(auth)

console.log('Reactive state:', { loading: loading.value, error: error.value, user: user.value })

function capitalize(s) { 
  return s.charAt(0).toUpperCase() + s.slice(1) 
}

async function onSubmit() {
  console.log('🔥 FORM SUBMITTED!')
  console.log('Form data:', { 
    mode: mode.value, 
    role: role.value, 
    email: email.value,
    password: password.value ? '***' : 'empty'
  })
  
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
        
        if (auth.user?.role === 'instructor' && auth.user?.approved) {
          console.log('🎯 Redirecting to /instructor')
          await router.push('/instructor')
        } else if (auth.user?.role === 'admin') {
          console.log('🎯 Redirecting admin to /instructor')
          await router.push('/instructor')
        } else if (auth.user?.role === 'student') {
          console.log('🎯 Redirecting student to /instructor')
          await router.push('/instructor')
        } else {
          console.log('❌ User not approved:', { role: auth.user?.role, approved: auth.user?.approved })
          alert('Your account is not approved yet. Please contact an administrator.')
        }
      } else {
        console.log('❌ Login failed:', result.error)
      }
    } else {
      // Register mode
      console.log('📞 Calling auth.register...')
      
      const result = await auth.register({
        name: name.value, 
        email: email.value, 
        password: password.value, 
        role: role.value
      })
      
      console.log('✅ Register result:', result)
      
      if (result.success) {
        if (role.value === 'instructor' && !auth.user?.approved) {
          console.log('🔔 Instructor registered, needs approval')
          alert('Instructor account created! Please wait for admin approval before logging in.')
        } else {
          console.log('🎯 Registration successful, redirecting...')
          await router.push('/instructor')
        }
      }
    }
  } catch (err) {
    console.error('💥 Form submission error:', err)
    alert('An unexpected error occurred. Please try again.')
  }
}
</script>
