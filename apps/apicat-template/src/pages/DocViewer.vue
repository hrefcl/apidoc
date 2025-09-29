<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Back Button -->
      <div class="mb-6">
        <router-link
          to="/"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Volver al índice
        </router-link>
      </div>

      <!-- Header -->
      <header class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ currentTitle }}
            </h1>
            <p class="text-sm text-gray-500 font-mono">{{ filename }}</p>
          </div>
          <div>
            <span
              v-if="isEncrypted"
              class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800"
            >
              🔒 Encrypted
            </span>
            <span
              v-else
              class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800"
            >
              📄 Plain JSON
            </span>
          </div>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="docsStore.loading" class="bg-white rounded-lg shadow-md p-12 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando documento...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="docsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <p class="text-red-600">❌ Error: {{ docsStore.error }}</p>
      </div>

      <!-- JSON Content -->
      <div v-else-if="docsStore.currentDoc" class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Tabs -->
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              @click="activeTab = 'formatted'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'formatted'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              📋 Formatted JSON
            </button>
            <button
              @click="activeTab = 'raw'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'raw'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              🔤 Raw JSON
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Formatted View -->
          <div v-if="activeTab === 'formatted'" class="overflow-x-auto">
            <pre><code v-html="highlightedJson" class="hljs language-json"></code></pre>
          </div>

          <!-- Raw View -->
          <div v-else class="overflow-x-auto">
            <pre class="bg-gray-50 p-4 rounded-lg"><code class="text-sm font-mono text-gray-800">{{ rawJson }}</code></pre>
          </div>
        </div>

        <!-- Footer Stats -->
        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div class="flex justify-between text-sm text-gray-600">
            <span>Tamaño: {{ jsonSize }} caracteres</span>
            <span v-if="isEncrypted">⚠️ Este archivo está encriptado</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDocsStore } from '@/stores/docs'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github-dark.css'

// Register JSON language
hljs.registerLanguage('json', json)

const route = useRoute()
const docsStore = useDocsStore()
const activeTab = ref('formatted')

const props = defineProps({
  filename: {
    type: String,
    required: true
  }
})

const currentTitle = computed(() => {
  return props.filename.replace('.encrypted.json', '').replace('cat.', '')
})

const isEncrypted = computed(() => {
  return props.filename.includes('.encrypted')
})

const rawJson = computed(() => {
  if (!docsStore.currentDoc) return ''
  return JSON.stringify(docsStore.currentDoc.data, null, 2)
})

const highlightedJson = computed(() => {
  if (!rawJson.value) return ''
  return hljs.highlight(rawJson.value, { language: 'json' }).value
})

const jsonSize = computed(() => {
  return rawJson.value.length.toLocaleString()
})

watch(() => props.filename, (newFilename) => {
  if (newFilename) {
    docsStore.loadDoc(newFilename)
  }
}, { immediate: true })
</script>
