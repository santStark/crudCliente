import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/listPais',
    name: 'listPais',
    component: () => import(/* webpackChunkName: "about" */ '../views/ListPais.vue')
  },
  {
    path: '/pais/:id',
    name: 'pais',
    component: () => import(/* webpackChunkName: "about" */ '../views/Pais.vue')
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
