import { createRouter, createWebHashHistory } from 'vue-router'
import DocsLayout from '@/layouts/DocsLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import DocPage from '@/pages/DocPage.vue'
import CategoryIndexPage from '@/pages/CategoryIndexPage.vue'
import ApiSectionPage from '@/pages/ApiSectionPage.vue'

export const routes = [
  {
    path: '/',
    component: DocsLayout,
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

export default router