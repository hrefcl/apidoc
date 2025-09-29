import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '../pages/IndexPage.vue'
import DocViewer from '../pages/DocViewer.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: IndexPage
  },
  {
    path: '/doc/:filename',
    name: 'doc',
    component: DocViewer,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
