import { createRouter, createWebHashHistory } from 'vue-router'
import DocsLayout from '@/layouts/DocsLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import DocPage from '@/pages/DocPage.vue'
import CategoryIndexPage from '@/pages/CategoryIndexPage.vue'
import ApiSectionPage from '@/pages/ApiSectionPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import { useDocsStore } from '@/stores/docs'

export const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: DocsLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage
      },
      // Category index pages
      {
        path: 'docs',
        name: 'docs-index',
        component: CategoryIndexPage,
        props: { category: 'docs' }
      },
      {
        path: 'api',
        name: 'api-index',
        component: CategoryIndexPage,
        props: { category: 'api' }
      },
      {
        path: 'tsdoc',
        name: 'tsdoc-index',
        component: CategoryIndexPage,
        props: { category: 'tsdoc' }
      },
      {
        path: 'model',
        name: 'model-index',
        component: CategoryIndexPage,
        props: { category: 'model' }
      },
      {
        path: 'iot',
        name: 'iot-index',
        component: CategoryIndexPage,
        props: { category: 'iot' }
      },
      {
        path: 'code',
        name: 'code-index',
        component: CategoryIndexPage,
        props: { category: 'code' }
      },
      // API Section page
      {
        path: 'api/section/:section',
        name: 'api-section',
        component: ApiSectionPage
      },
      // Document pages
      {
        path: 'api/:doc',
        name: 'api',
        component: DocPage,
        props: route => ({ category: 'cat.api', doc: route.params.doc })
      },
      {
        path: 'docs/:doc',
        name: 'docs',
        component: DocPage,
        props: route => ({ category: 'cat.docs', doc: route.params.doc })
      },
      {
        path: 'tsdoc/:doc',
        name: 'tsdoc',
        component: DocPage,
        props: route => ({ category: 'cat.tsdoc', doc: route.params.doc })
      },
      {
        path: 'model/:doc',
        name: 'model',
        component: DocPage,
        props: route => ({ category: 'cat.model', doc: route.params.doc })
      },
      {
        path: 'iot/:doc',
        name: 'iot',
        component: DocPage,
        props: route => ({ category: 'cat.iot', doc: route.params.doc })
      },
      {
        path: 'code/:doc',
        name: 'code',
        component: DocPage,
        props: route => ({ category: 'cat.code', doc: route.params.doc })
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
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

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const docsStore = useDocsStore()

  // Initialize auth state from sessionStorage on first navigation
  if (!docsStore.isAuthenticated) {
    docsStore.initAuth()
  }

  // Check if route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

  // Check if login is required for this documentation
  const loginRequired = docsStore.requiresLogin

  // If login is not required at all, allow access
  if (!loginRequired) {
    next()
    return
  }

  // If login is required and route needs auth
  if (requiresAuth && !docsStore.isAuthenticated) {
    // Redirect to login, save attempted path
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else if (to.name === 'login' && docsStore.isAuthenticated) {
    // If already authenticated and trying to access login, redirect to home
    next({ name: 'home' })
  } else {
    // Allow navigation
    next()
  }
})

export default router