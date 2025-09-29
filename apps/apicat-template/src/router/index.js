import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import ApisPage from '../pages/ApisPage.vue'
import TestsPage from '../pages/TestsPage.vue'
import DocsPage from '../pages/DocsPage.vue'
import HistoryPage from '../pages/HistoryPage.vue'
import SettingsPage from '../pages/SettingsPage.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardPage
  },
  {
    path: '/apis',
    name: 'apis',
    component: ApisPage
  },
  {
    path: '/tests',
    name: 'tests',
    component: TestsPage
  },
  {
    path: '/docs',
    name: 'docs',
    component: DocsPage
  },
  {
    path: '/history',
    name: 'history',
    component: HistoryPage
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
