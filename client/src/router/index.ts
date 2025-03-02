import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import FriendsActivity from '../pages/FriendsActivity.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/friends-activity', component: FriendsActivity },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
