<template>
  <div class="max-w-7xl mx-auto px-6 py-12">
    <!-- Hero Section with Company Logo -->
    <div class="text-center mb-16">
      <!-- Company Logo (if available from meta) -->
      <div v-if="companyLogo" class="inline-flex items-center justify-center mb-6">
        <img :src="companyLogo" :alt="companyName" class="h-20 w-auto" />
      </div>
      <div v-else class="inline-flex items-center justify-center w-20 h-20 mb-6">
        <div class="absolute w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-2xl blur-xl opacity-60"></div>
        <div class="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <Sparkles class="w-12 h-12 text-white" />
        </div>
      </div>

      <h1 class="text-5xl font-bold mb-4">
        <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {{ companyName }}
        </span>
      </h1>

      <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        {{ companyDescription }}
      </p>

      <div class="flex items-center justify-center gap-4">
        <router-link
          to="/api"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 font-medium"
        >
          <Plug class="w-5 h-5" />
          Explorar API
        </router-link>

        <router-link
          to="/docs"
          class="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-lg hover:bg-muted transition-colors font-medium"
        >
          <BookOpen class="w-5 h-5" />
          Documentación
        </router-link>
      </div>
    </div>

    <!-- API Statistics Dashboard -->
    <div class="mb-16">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
        <BarChart3 class="w-6 h-6 text-primary-600 dark:text-primary-400" />
        Estadísticas de la API
      </h2>

      <!-- Main Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-6">
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-medium text-blue-700 dark:text-blue-300">Total Endpoints</div>
            <Plug class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {{ apiStats.totalEndpoints }}
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-6">
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-medium text-green-700 dark:text-green-300">Grupos API</div>
            <FolderTree class="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div class="text-3xl font-bold text-green-900 dark:text-green-100">
            {{ apiStats.totalGroups }}
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-6">
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-medium text-purple-700 dark:text-purple-300">Modelos</div>
            <Database class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="text-3xl font-bold text-purple-900 dark:text-purple-100">
            {{ apiStats.totalModels }}
          </div>
        </div>

        <div class="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-6">
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-medium text-orange-700 dark:text-orange-300">TypeScript</div>
            <Code class="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div class="text-3xl font-bold text-orange-900 dark:text-orange-100">
            {{ apiStats.totalTSDocs }}
          </div>
        </div>
      </div>

      <!-- HTTP Methods Breakdown -->
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <div class="bg-card border border-border rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            Endpoints por Método HTTP
          </h3>
          <div class="space-y-3">
            <div v-for="(count, method) in apiStats.byMethod" :key="method" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span :class="getMethodClass(method)" class="px-2 py-1 rounded text-xs font-mono font-semibold">
                  {{ method }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex-1 h-2 bg-muted rounded-full overflow-hidden" style="width: 200px">
                  <div
                    :class="getMethodBgClass(method)"
                    class="h-full rounded-full transition-all"
                    :style="{ width: `${(count / apiStats.totalEndpoints) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-semibold w-8 text-right">{{ count }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-card border border-border rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <Layers class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            Grupos de API
          </h3>
          <div class="space-y-2">
            <router-link
              v-for="group in apiStats.groups"
              :key="group.id"
              :to="`/api#${group.id}`"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
            >
              <div class="flex items-center gap-3">
                <component :is="getGroupIcon(group.icon)" class="w-4 h-4 text-muted-foreground group-hover:text-primary-600" />
                <span class="font-medium text-sm">{{ group.title }}</span>
              </div>
              <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {{ group.count }} endpoints
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Content Section (from markdown) -->
    <div v-if="customContent" class="mb-16">
      <div class="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-8">
        <div class="prose prose-lg dark:prose-invert max-w-none" v-html="customContent"></div>
      </div>
    </div>

    <!-- Quick Access -->
    <div class="bg-card border border-border rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
        <Zap class="w-6 h-6 text-primary-600 dark:text-primary-400" />
        Acceso Rápido
      </h2>
      <div class="grid md:grid-cols-4 gap-4">
        <router-link
          to="/api"
          class="flex flex-col items-center gap-3 p-6 rounded-lg hover:bg-muted transition-colors group"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plug class="w-6 h-6 text-white" />
          </div>
          <div class="text-center">
            <h3 class="font-semibold mb-1">API Reference</h3>
            <p class="text-xs text-muted-foreground">{{ apiStats.totalEndpoints }} endpoints</p>
          </div>
        </router-link>

        <router-link
          to="/docs"
          class="flex flex-col items-center gap-3 p-6 rounded-lg hover:bg-muted transition-colors group"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen class="w-6 h-6 text-white" />
          </div>
          <div class="text-center">
            <h3 class="font-semibold mb-1">Documentación</h3>
            <p class="text-xs text-muted-foreground">Guías y tutoriales</p>
          </div>
        </router-link>

        <router-link
          to="/tsdoc"
          class="flex flex-col items-center gap-3 p-6 rounded-lg hover:bg-muted transition-colors group"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Code class="w-6 h-6 text-white" />
          </div>
          <div class="text-center">
            <h3 class="font-semibold mb-1">TypeScript</h3>
            <p class="text-xs text-muted-foreground">{{ apiStats.totalTSDocs }} documentos</p>
          </div>
        </router-link>

        <router-link
          to="/model"
          class="flex flex-col items-center gap-3 p-6 rounded-lg hover:bg-muted transition-colors group"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Database class="w-6 h-6 text-white" />
          </div>
          <div class="text-center">
            <h3 class="font-semibold mb-1">Modelos</h3>
            <p class="text-xs text-muted-foreground">{{ apiStats.totalModels }} modelos</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDocsStore } from '@/stores/docs'
import { marked } from 'marked'
import {
  Sparkles, BookOpen, Plug, Code, Database, Zap,
  BarChart3, Activity, Layers, FolderTree,
  User, Users, Building, Settings, MapPin, Tags, Folder, FileText
} from 'lucide-vue-next'

const docsStore = useDocsStore()
const customContent = ref(null)

// Company info from meta
const companyName = computed(() => {
  return docsStore.meta?.name || docsStore.meta?.title || 'API Documentation'
})

const companyDescription = computed(() => {
  return docsStore.meta?.description || 'Documentación completa de la API'
})

const companyLogo = computed(() => {
  // Buscar logo en meta o settings
  return docsStore.meta?.logo || null
})

// API Statistics
const apiStats = computed(() => {
  const stats = {
    totalEndpoints: 0,
    totalGroups: 0,
    totalModels: 0,
    totalTSDocs: 0,
    byMethod: {
      GET: 0,
      POST: 0,
      PUT: 0,
      PATCH: 0,
      DELETE: 0
    },
    groups: []
  }

  // Count from apiIndex
  if (docsStore.apiIndex?.endpoints) {
    stats.totalEndpoints = docsStore.apiIndex.endpoints.length

    // Count by method
    docsStore.apiIndex.endpoints.forEach(endpoint => {
      const method = endpoint.method?.toUpperCase() || 'GET'
      if (stats.byMethod[method] !== undefined) {
        stats.byMethod[method]++
      }
    })
  }

  // Count groups from navigation
  if (docsStore.navigation?.groups) {
    stats.totalGroups = docsStore.navigation.groups.length
    stats.groups = docsStore.navigation.groups.map(group => ({
      id: group.id,
      title: group.title || group.id,
      icon: group.icon || 'fa-folder',
      count: group.endpoints?.length || 0
    }))
  }

  // Count models
  stats.totalModels = docsStore.docs.filter(d => d.directory === 'cat.model').length

  // Count TypeScript docs
  stats.totalTSDocs = docsStore.docs.filter(d => d.directory === 'cat.tsdoc').length

  return stats
})

// HTTP Method styling
const getMethodClass = (method) => {
  const classes = {
    GET: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    POST: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    PUT: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
    PATCH: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    DELETE: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
  }
  return classes[method] || 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
}

const getMethodBgClass = (method) => {
  const classes = {
    GET: 'bg-blue-500',
    POST: 'bg-green-500',
    PUT: 'bg-orange-500',
    PATCH: 'bg-purple-500',
    DELETE: 'bg-red-500'
  }
  return classes[method] || 'bg-gray-500'
}

const getGroupIcon = (iconName) => {
  const icons = {
    'fa-user': User,
    'fa-users': Users,
    'fa-building': Building,
    'fa-cog': Settings,
    'fa-cogs': Settings,
    'fa-map-marker-alt': MapPin,
    'fa-tags': Tags,
    'fa-folder': Folder,
    'fa-file': FileText
  }
  return icons[iconName] || Folder
}

// Load custom markdown content
const loadCustomContent = async () => {
  try {
    // Intentar cargar home.md personalizado
    const response = await fetch('/data/home.md')
    if (response.ok) {
      const markdown = await response.text()
      customContent.value = marked(markdown)
    }
  } catch (e) {
    console.log('No custom home content found')
  }
}

onMounted(async () => {
  if (!docsStore.docs.length) {
    await docsStore.loadDocs()
  }
  await loadCustomContent()
})
</script>