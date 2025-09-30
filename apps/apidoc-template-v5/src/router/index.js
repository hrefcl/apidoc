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