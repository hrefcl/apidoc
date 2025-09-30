<template>
  <div class="space-y-6">
    <!-- Raw JSON Display (for debugging) -->
    <div v-if="showDebug" class="bg-muted p-4 rounded-lg">
      <details>
        <summary class="cursor-pointer font-semibold mb-2">Debug: Raw JSON</summary>
        <pre class="text-xs overflow-x-auto">{{ JSON.stringify(data, null, 2) }}</pre>
      </details>
    </div>

    <!-- Content Sections -->
    <div v-for="(value, key) in filteredData" :key="key" class="mb-6">
      <!-- Section Title -->
      <h2 v-if="!isMetaKey(key)" class="text-2xl font-semibold mb-4 capitalize bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {{ formatKey(key) }}
      </h2>

      <!-- String Content -->
      <div v-if="typeof value === 'string'" v-html="renderContent(value)"></div>

      <!-- Array Content -->
      <ul v-else-if="Array.isArray(value)" class="space-y-2">
        <li v-for="(item, index) in value" :key="index">
          <span v-if="typeof item === 'string'">{{ item }}</span>
          <div v-else class="bg-card border border-border rounded-lg p-4">
            <pre class="text-sm">{{ JSON.stringify(item, null, 2) }}</pre>
          </div>
        </li>
      </ul>

      <!-- Object Content -->
      <div v-else-if="typeof value === 'object' && value !== null" class="bg-card border border-border rounded-lg p-6">
        <pre class="text-sm overflow-x-auto">{{ JSON.stringify(value, null, 2) }}</pre>
      </div>

      <!-- Primitive Content -->
      <div v-else>
        {{ value }}
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="Object.keys(filteredData).length === 0" class="text-center py-8 text-muted-foreground">
      <p>No hay contenido disponible para mostrar.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  showDebug: {
    type: Boolean,
    default: false
  }
})

// Filtrar keys de metadata que no queremos mostrar
const metaKeys = ['name', 'title', 'version', 'description', 'type', 'filename', 'relativePath']

const isMetaKey = (key) => metaKeys.includes(key)

const filteredData = computed(() => {
  const filtered = {}
  Object.keys(props.data).forEach(key => {
    if (!isMetaKey(key)) {
      filtered[key] = props.data[key]
    }
  })
  return filtered
})

const formatKey = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
}

const renderContent = (text) => {
  if (!text) return ''

  // Simple markdown-like rendering
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
    .replace(/\n/g, '<br>')
}
</script>