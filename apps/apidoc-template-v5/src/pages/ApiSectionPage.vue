<template>
  <div class="api-section-page">
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="error" class="p-8 bg-red-50 border border-red-200 rounded-lg">
      <h2 class="text-xl font-bold text-red-800 mb-2">Error</h2>
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else-if="sectionData" class="section-content">
      <!-- Custom Markdown Section -->
      <div v-if="sectionData.customMarkdown" class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border border-blue-200 dark:border-blue-700 rounded-lg">
        <div class="flex items-center gap-3 mb-4">
          <i :class="['text-2xl text-blue-600 dark:text-blue-400', sectionData.customMarkdown.icon]"></i>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">{{ sectionData.customMarkdown.title }}</h1>
        </div>
        <div class="prose dark:prose-invert max-w-none custom-markdown" v-html="sectionData.customMarkdown.html"></div>
      </div>

      <!-- Default Section Header -->
      <div v-else class="mb-8 p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ section }} API</h1>
        <p class="text-gray-600 dark:text-gray-400">Documentación de endpoints para {{ section }}</p>
      </div>

      <!-- Endpoints List -->
      <div class="endpoints-list">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Endpoints Disponibles</h2>
        <div class="space-y-3">
          <button
            v-for="endpoint in endpoints"
            :key="endpoint.id"
            @click="navigateToEndpoint(endpoint.id)"
            class="w-full text-left p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div class="flex items-center gap-3 mb-2">
              <span
                :class="[
                  'px-3 py-1 text-sm font-semibold rounded uppercase',
                  getMethodClass(endpoint.method)
                ]"
              >
                {{ endpoint.method }}
              </span>
              <span class="text-gray-700 dark:text-gray-300 font-mono text-sm">{{ endpoint.url }}</span>
            </div>
            <p class="text-gray-800 dark:text-gray-200 font-medium">{{ endpoint.title }}</p>
            <div v-if="endpoint.description" class="text-gray-600 dark:text-gray-400 text-sm mt-1" v-html="endpoint.description"></div>
            <div v-if="endpoint.version" class="mt-2">
              <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                v{{ endpoint.version }}
              </span>
            </div>
          </button>
        </div>

        <div v-if="endpoints.length === 0 && !loading" class="text-center py-12 text-gray-500 dark:text-gray-400">
          No hay endpoints disponibles en esta sección.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocsStore } from '@/stores/docs'

const route = useRoute()
const router = useRouter()
const docsStore = useDocsStore()

const section = computed(() => route.params.section)
const loading = ref(true)
const error = ref(null)
const sectionData = ref(null)
const endpoints = ref([])

const getMethodClass = (method) => {
  const classes = {
    GET: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    POST: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    PUT: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    PATCH: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
    DELETE: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    PUBLISH: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    SUBSCRIBE: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
  }
  return classes[method] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
}

const navigateToEndpoint = (endpointId) => {
  router.push(`/api/${endpointId}`)
}

const loadSectionData = async () => {
  try {
    loading.value = true
    error.value = null
    sectionData.value = null
    endpoints.value = []

    console.log('[ApiSectionPage] Loading section:', section.value)

    // Ensure docs store is initialized
    if (!docsStore.navigation || !docsStore.apiIndex) {
      console.log('[ApiSectionPage] Store not initialized, loading docs...')
      await docsStore.loadDocs()
    }

    // 1. Load section custom markdown from cat.docs/group.{section}.json
    const groupFile = `cat.docs/group.${section.value.toLowerCase()}`
    try {
      const response = await fetch(`/data/${groupFile}.json`)
      if (response.ok) {
        const groupData = await response.json()
        sectionData.value = groupData
        console.log('[ApiSectionPage] Custom markdown loaded:', groupData.customMarkdown?.title)
      }
    } catch (e) {
      console.warn('[ApiSectionPage] No custom markdown for section:', section.value)
    }

    // 2. Load endpoints for this section from navigation
    if (docsStore.navigation?.groups) {
      const group = docsStore.navigation.groups.find(g => g.id === section.value)
      console.log('[ApiSectionPage] Group found:', group?.id, 'endpoints:', group?.endpoints?.length)

      if (group && group.endpoints) {
        // 3. Load endpoint details from API index
        if (docsStore.apiIndex?.endpoints) {
          const endpointDetails = []
          for (const endpointId of group.endpoints) {
            const endpointInfo = docsStore.apiIndex.endpoints.find(e => e.id === endpointId)
            if (endpointInfo) {
              // Load the shard to get full endpoint data
              try {
                const shardResponse = await fetch(`/data/${endpointInfo.shard}`)
                if (shardResponse.ok) {
                  const shardData = await shardResponse.json()
                  const fullEndpoint = shardData.endpoints?.find(e => e.id === endpointId)
                  if (fullEndpoint) {
                    endpointDetails.push(fullEndpoint)
                  }
                }
              } catch (e) {
                console.warn('[ApiSectionPage] Error loading endpoint:', endpointId, e)
              }
            }
          }
          endpoints.value = endpointDetails
          console.log('[ApiSectionPage] Loaded endpoints:', endpointDetails.length)
        } else {
          console.warn('[ApiSectionPage] API index not available')
        }
      } else {
        console.warn('[ApiSectionPage] Group not found in navigation')
      }
    } else {
      console.warn('[ApiSectionPage] Navigation not available')
    }

    // If no custom markdown, create default
    if (!sectionData.value) {
      sectionData.value = {
        group: section.value,
        type: 'group-documentation'
      }
    }
  } catch (e) {
    console.error('[ApiSectionPage] Error loading section:', e)
    error.value = `No se pudo cargar la sección ${section.value}`
  } finally {
    loading.value = false
  }
}

// Watch for route changes
watch(() => route.params.section, (newSection, oldSection) => {
  console.log('[ApiSectionPage] Section changed:', oldSection, '->', newSection)
  if (newSection && newSection !== oldSection) {
    loadSectionData()
  }
})

onMounted(() => {
  console.log('[ApiSectionPage] Component mounted, section:', section.value)
  loadSectionData()
})
</script>

<style scoped>
.custom-markdown :deep(h2) {
  @apply text-2xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3;
}

.custom-markdown :deep(h3) {
  @apply text-xl font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-2;
}

.custom-markdown :deep(p) {
  @apply text-gray-600 dark:text-gray-300 mb-3 leading-relaxed;
}

.custom-markdown :deep(ul) {
  @apply list-disc list-inside mb-3 space-y-1;
}

.custom-markdown :deep(li) {
  @apply text-gray-600 dark:text-gray-300;
}

.custom-markdown :deep(strong) {
  @apply font-semibold text-gray-800 dark:text-gray-100;
}

.custom-markdown :deep(code) {
  @apply px-2 py-1 bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 rounded text-sm font-mono;
}

.custom-markdown :deep(pre) {
  @apply mb-4 rounded-lg overflow-x-auto border-0;
}

.custom-markdown :deep(pre.hljs) {
  @apply p-4;
  background: #1a1b26 !important;
}

.custom-markdown :deep(pre code) {
  @apply bg-transparent p-0;
}

.custom-markdown :deep(code:not(pre code)) {
  @apply text-red-500 dark:text-red-400;
}

.custom-markdown :deep(table) {
  @apply w-full border-collapse mb-4;
}

.custom-markdown :deep(th) {
  @apply bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600;
}

.custom-markdown :deep(td) {
  @apply px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300;
}

.custom-markdown :deep(blockquote) {
  @apply border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 my-4;
}
</style>
