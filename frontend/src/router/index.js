import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'AuthLanding',
    component: () => import('@/views/auth/AuthLanding.vue')
  },
  {
    path: '/instructor',
    name: 'InstructorDashboard',
    component: () => import('@/views/instructor/InstructorDashboard.vue'),
    meta: { requiresAuth: true, requiresInstructor: true }
  },
  {
    path: '/instructor/workshops',
    name: 'WorkshopsList',
    component: () => import('@/views/instructor/WorkshopsList.vue'),
    meta: { requiresAuth: true, requiresInstructor: true }
  },
  {
    path: '/instructor/workshops/create',
    name: 'CreateWorkshop',
    component: () => import('@/views/instructor/CreateWorkshop.vue'),
    meta: { requiresAuth: true, requiresInstructor: true }
  },
  {
    path: '/instructor/students',
    name: 'StudentsAnalytics',
    component: () => import('@/views/instructor/StudentsAnalytics.vue'),
    meta: { requiresAuth: true, requiresInstructor: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  console.log('🛡️ Router Guard - Navigation to:', to.fullPath)
  console.log('🛡️ Auth state:', { 
    isAuthenticated: auth.isAuthenticated, 
    isInstructor: auth.isInstructor,
    user: auth.user 
  })
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    console.log('❌ Not authenticated - redirecting to /')
    return next('/')
  }
  
  if (to.meta.requiresInstructor && !auth.isInstructor) {
    console.log('❌ Not instructor - redirecting to /')
    return next('/')
  }
  
  console.log('✅ Router guard passed')
  next()
})

export default router
