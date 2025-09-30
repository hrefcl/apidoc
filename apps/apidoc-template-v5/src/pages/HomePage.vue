<template>
  <div class="max-w-5xl mx-auto px-6 py-12">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center justify-center w-20 h-20 mb-6">
        <div class="absolute w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-2xl blur-xl opacity-60"></div>
        <div class="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <Sparkles class="w-12 h-12 text-white" />
        </div>
      </div>

      <h1 class="text-5xl font-bold mb-4">
        <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {{ t('home.title') }}
        </span>
      </h1>

      <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        {{ t('home.subtitle') }}
      </p>

      <div class="flex items-center justify-center gap-4">
        <router-link
          to="/docs/cat.api/authentication"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 font-medium"
        >
          <BookOpen class="w-5 h-5" />
          {{ t('home.viewDocs') }}
        </router-link>

        <a
          href="#"
          class="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-lg hover:bg-muted transition-colors font-medium"
        >
          <Github class="w-5 h-5" />
          {{ t('home.github') }}
        </a>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid md:grid-cols-3 gap-6 mb-16">
      <div class="relative group">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative bg-card border border-border rounded-xl p-6 hover:border-blue-500/50 transition-colors">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Zap class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-semibold mb-2">{{ t('home.features.fast.title') }}</h3>
          <p class="text-sm text-muted-foreground">
            {{ t('home.features.fast.description') }}
          </p>
        </div>
      </div>

      <div class="relative group">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative bg-card border border-border rounded-xl p-6 hover:border-purple-500/50 transition-colors">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
            <Palette class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-semibold mb-2">{{ t('home.features.beautiful.title') }}</h3>
          <p class="text-sm text-muted-foreground">
            {{ t('home.features.beautiful.description') }}
          </p>
        </div>
      </div>

      <div class="relative group">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative bg-card border border-border rounded-xl p-6 hover:border-indigo-500/50 transition-colors">
          <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <FileJson class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-semibold mb-2">{{ t('home.features.jsonBased.title') }}</h3>
          <p class="text-sm text-muted-foreground">
            {{ t('home.features.jsonBased.description') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid md:grid-cols-4 gap-6 mb-16">
      <div class="bg-card border border-border rounded-lg p-6 text-center">
        <div class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {{ stats.totalDocs }}
        </div>
        <div class="text-sm text-muted-foreground">{{ t('home.stats.docs') }}</div>
      </div>

      <div class="bg-card border border-border rounded-lg p-6 text-center">
        <div class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {{ stats.apiDocs }}
        </div>
        <div class="text-sm text-muted-foreground">{{ t('home.stats.apis') }}</div>
      </div>

      <div class="bg-card border border-border rounded-lg p-6 text-center">
        <div class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {{ stats.guides }}
        </div>
        <div class="text-sm text-muted-foreground">{{ t('home.stats.guides') }}</div>
      </div>

      <div class="bg-card border border-border rounded-lg p-6 text-center">
        <div class="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {{ stats.tsDocs }}
        </div>
        <div class="text-sm text-muted-foreground">{{ t('home.stats.typescript') }}</div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="bg-card border border-border rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">{{ t('home.quickLinks') }}</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <router-link
          v-for="link in quickLinks"
          :key="link.path"
          :to="link.path"
          class="flex items-start gap-4 p-4 rounded-lg hover:bg-muted transition-colors group"
        >
          <div :class="`w-10 h-10 ${link.gradient} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`">
            <component :is="link.icon" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="font-semibold mb-1">{{ link.title }}</h3>
            <p class="text-sm text-muted-foreground">{{ link.description }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDocsStore } from '@/stores/docs'
import { Sparkles, BookOpen, Github, Zap, Palette, FileJson, Plug, FileText, Code } from 'lucide-vue-next'

const { t } = useI18n()
const docsStore = useDocsStore()

const stats = computed(() => ({
  totalDocs: docsStore.docs.length,
  apiDocs: docsStore.docs.filter(d => d.directory === 'cat.api').length,
  guides: docsStore.docs.filter(d => d.directory === 'cat.docs').length,
  tsDocs: docsStore.docs.filter(d => d.directory === 'cat.tsdoc').length
}))

const quickLinks = computed(() => [
  {
    title: t('home.links.authentication.title'),
    description: t('home.links.authentication.description'),
    path: '/docs/cat.api/authentication',
    icon: Plug,
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    title: t('home.links.introduction.title'),
    description: t('home.links.introduction.description'),
    path: '/docs/cat.docs/introduction',
    icon: BookOpen,
    gradient: 'bg-gradient-to-br from-purple-500 to-purple-600'
  },
  {
    title: t('home.links.typescript.title'),
    description: t('home.links.typescript.description'),
    path: '/docs/cat.tsdoc/types',
    icon: Code,
    gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
  },
  {
    title: t('home.links.apiReference.title'),
    description: t('home.links.apiReference.description'),
    path: '/docs/cat.api/reference',
    icon: FileText,
    gradient: 'bg-gradient-to-br from-violet-500 to-violet-600'
  }
])
</script>