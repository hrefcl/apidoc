<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <header class="mb-12 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          📚 APIcat Documentation
        </h1>
        <p class="text-lg text-gray-600 mb-6">
          Vue 3 + Vite + SSG - Modular JSON Documentation
        </p>

        <!-- Stats Header -->
        <div v-if="!docsStore.loading && !docsStore.error" class="flex justify-center gap-6 text-sm">
          <div class="bg-white rounded-lg px-4 py-2 shadow-sm">
            <span class="font-semibold text-gray-700">Total:</span>
            <span class="ml-2 text-blue-600 font-bold">{{ docsStore.docCount }}</span>
          </div>
          <div v-for="(count, category) in docsStore.categories" :key="category"
               class="bg-white rounded-lg px-4 py-2 shadow-sm">
            <span class="font-semibold text-gray-700">{{ getCategoryIcon(category) }} {{ category }}:</span>
            <span class="ml-2 text-blue-600 font-bold">{{ count }}</span>
          </div>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="docsStore.loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando documentación...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="docsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-600">❌ {{ docsStore.error }}</p>
      </div>

      <!-- Organized by Categories -->
      <div v-else class="space-y-12">
        <!-- Each Category Section -->
        <template v-for="(docs, category) in docsStore.docsByCategory" :key="category">
          <section v-if="docs.length > 0">
          <!-- Category Header -->
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>{{ getCategoryIcon(category) }}</span>
              <span>{{ getCategoryTitle(category) }}</span>
              <span class="text-sm font-normal text-gray-500">({{ docs.length }} archivos)</span>
            </h2>
            <p class="text-gray-600 mt-2">{{ getCategoryDescription(category) }}</p>
          </div>

          <!-- Category Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <router-link
              v-for="doc in docs"
              :key="doc.relativePath"
              :to="{ name: 'doc', params: { filename: doc.relativePath } }"
              class="block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-4 border border-gray-200 hover:border-blue-400"
            >
              <!-- Icon -->
              <div class="flex items-center justify-center w-12 h-12 rounded-full mb-3 mx-auto"
                   :class="doc.encrypted ? 'bg-red-100' : 'bg-blue-50'">
                <span class="text-2xl">{{ doc.encrypted ? '🔒' : '📄' }}</span>
              </div>

              <!-- Title -->
              <h3 class="text-base font-semibold text-gray-900 mb-1 text-center truncate">
                {{ doc.title }}
              </h3>

              <!-- Size -->
              <p class="text-xs text-gray-500 text-center mb-2">
                {{ formatSize(doc.size) }}
              </p>

              <!-- Path Badge -->
              <div class="flex justify-center">
                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-mono text-gray-600 bg-gray-100">
                  {{ doc.filename }}
                </span>
              </div>
            </router-link>
          </div>
        </section>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDocsStore } from '@/stores/docs'

const docsStore = useDocsStore()

// Formatear tamaño de archivo
const formatSize = (bytes) => {
  if (!bytes) return 'N/A'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(2)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

// Obtener icono por categoría
const getCategoryIcon = (category) => {
  const icons = {
    'root': '📄',
    'cat.api': '🔌',
    'cat.docs': '📝',
    'cat.tsdoc': '📚'
  }
  return icons[category] || '📁'
}

// Obtener título de categoría
const getCategoryTitle = (category) => {
  const titles = {
    'root': 'Archivos Raíz',
    'cat.api': 'API Endpoints',
    'cat.docs': 'Documentación',
    'cat.tsdoc': 'TypeScript Documentation'
  }
  return titles[category] || category
}

// Obtener descripción de categoría
const getCategoryDescription = (category) => {
  const descriptions = {
    'root': 'Archivos principales de configuración y metadatos',
    'cat.api': 'Documentación modular de endpoints API organizados por grupo',
    'cat.docs': 'Documentación de grupos y componentes del sistema',
    'cat.tsdoc': 'Documentación TypeScript generada automáticamente'
  }
  return descriptions[category] || ''
}

onMounted(() => {
  docsStore.loadAvailableDocs()
})
</script>
