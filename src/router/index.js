import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/form',
      name: 'form',
      component: ()=> import('../views/FormView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: ()=> import('../views/LoginView.vue')
    },
    {
      path: '/scheduler',
      name: 'Scheduler',
      component: ()=> import('../views/SchedulerView.vue')
    },
    {
      path: '/appointments',
      name: 'Appointments',
      component: ()=> import('../views/AppointmentsView.vue')
    },
    {
      path: '/form-builder',
      name: 'FormBuilder',
      component: ()=> import('../views/FormBuilderView.vue')
    },
    {
      path: '/preferences',
      name: 'Preferences',
      component: ()=> import('../views/PreferencesView.vue')
    },
  ]
})

export default router
