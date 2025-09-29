import { createRouter, createWebHistory } from 'vue-router'
import DocsLayout from '@/layouts/DocsLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import DocPage from '@/pages/DocPage.vue'

const routes = [
  {
    path: '/',
    component: DocsLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage
      },
      {
        path: 'docs/:category/:doc',
        name: 'doc',
        component: DocPage,
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0 }
    }
  }
})

export default router