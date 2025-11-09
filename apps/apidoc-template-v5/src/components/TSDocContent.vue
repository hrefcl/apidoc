<template>
  <div class="tsdoc-container max-w-7xl mx-auto px-4 py-8">
    <!-- Module Header -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3 mb-3">
        <Package class="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ data.module }}
        </h1>
      </div>
      <p v-if="data.description" class="text-lg text-gray-600 dark:text-gray-300">
        {{ data.description }}
      </p>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
      <button
        v-for="type in symbolTypes"
        :key="type"
        @click="activeTab = type"
        :class="[
          'px-4 py-2 font-medium transition-colors relative',
          activeTab === type
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        ]"
      >
        {{ type }}
        <span
          v-if="getSymbolsByType(type).length > 0"
          class="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800"
        >
          {{ getSymbolsByType(type).length }}
        </span>
        <div
          v-if="activeTab === type"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
        ></div>
      </button>
    </div>

    <!-- Symbols List -->
    <div class="space-y-6">
      <div
        v-for="symbol in filteredSymbols"
        :key="symbol.name"
        :id="symbol.name"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Symbol Header -->
        <div class="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <component
                  :is="getIconForType(symbol.type)"
                  class="w-5 h-5 text-blue-600 dark:text-blue-400"
                />
                <h3 class="text-xl font-mono font-semibold text-gray-900 dark:text-white">
                  {{ symbol.name }}
                </h3>
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded',
                    getTypeColor(symbol.type)
                  ]"
                >
                  {{ symbol.type }}
                </span>
              </div>

              <!-- Function Signature -->
              <div v-if="symbol.type === 'function'" class="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
                <span class="text-blue-600 dark:text-blue-400">{{ symbol.name }}</span>(<span
                  v-for="(param, idx) in symbol.parameters"
                  :key="param.name"
                >
                  <span class="text-gray-600 dark:text-gray-400">{{ param.name }}</span>:
                  <span class="text-purple-600 dark:text-purple-400">{{ param.type }}</span><span v-if="idx < symbol.parameters.length - 1">, </span>
                </span>): <span class="text-green-600 dark:text-green-400">{{ symbol.returnType || 'void' }}</span>
              </div>
            </div>

            <!-- Source Link -->
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FileCode class="w-4 h-4" />
              <span>{{ symbol.file }}:{{ symbol.line }}</span>
            </div>
          </div>
        </div>

        <!-- Symbol Body -->
        <div class="px-6 py-4">
          <!-- Description -->
          <div v-if="symbol.documentation?.summary" class="mb-4">
            <p class="text-gray-700 dark:text-gray-300">{{ symbol.documentation.summary }}</p>
          </div>

          <!-- Parameters Table (for functions) -->
          <div v-if="symbol.parameters && symbol.parameters.length > 0" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <List class="w-4 h-4" />
              {{ t('docs.parameters') }}
            </h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('common.name') }}</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('common.type') }}</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('common.optional') }}</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('api.description') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="param in symbol.parameters" :key="param.name">
                    <td class="px-4 py-2 font-mono text-sm text-gray-900 dark:text-white">{{ param.name }}</td>
                    <td class="px-4 py-2 font-mono text-sm text-purple-600 dark:text-purple-400">{{ param.type }}</td>
                    <td class="px-4 py-2 text-sm">
                      <span v-if="param.optional" class="text-orange-600 dark:text-orange-400">{{ t('common.optional') }}</span>
                      <span v-else class="text-green-600 dark:text-green-400">{{ t('common.required') }}</span>
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {{ getParamDescription(symbol, param.name) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Properties Table (for interfaces, types, classes) -->
          <div v-if="symbol.properties && symbol.properties.length > 0" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <List class="w-4 h-4" />
              {{ t('docs.properties') }}
            </h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('common.name') }}</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('common.type') }}</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('common.optional') }}</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('api.description') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="property in symbol.properties" :key="property.name">
                    <td class="px-4 py-2 font-mono text-sm text-gray-900 dark:text-white">{{ property.name }}</td>
                    <td class="px-4 py-2 font-mono text-sm text-purple-600 dark:text-purple-400">{{ property.type }}</td>
                    <td class="px-4 py-2 text-sm">
                      <span v-if="property.optional" class="text-orange-600 dark:text-orange-400">optional</span>
                      <span v-else class="text-green-600 dark:text-green-400">required</span>
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {{ property.documentation?.summary || '' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Return Type -->
          <div v-if="symbol.returnType && symbol.type === 'function'" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <ArrowRight class="w-4 h-4" />
              {{ t('docs.returns') }}
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
              <code class="text-green-600 dark:text-green-400 font-mono">{{ symbol.returnType }}</code>
              <p v-if="getReturnDescription(symbol)" class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {{ getReturnDescription(symbol) }}
              </p>
            </div>
          </div>

          <!-- Documentation Tags -->
          <div v-if="symbol.documentation?.tags && symbol.documentation.tags.length > 0" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen class="w-4 h-4" />
              {{ t('docs.documentation') }}
            </h4>
            <div class="space-y-2">
              <div
                v-for="tag in symbol.documentation.tags"
                :key="tag.name + tag.text"
                class="flex gap-3"
              >
                <span class="px-2 py-1 text-xs font-mono bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                  @{{ tag.name }}
                </span>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ tag.text }}</span>
              </div>
            </div>
          </div>

          <!-- Example Code -->
          <div v-if="getExampleCode(symbol)" class="mt-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Code class="w-4 h-4" />
              {{ t('docs.example') }}
            </h4>
            <pre class="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg p-4 overflow-x-auto"><code>{{ getExampleCode(symbol) }}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredSymbols.length === 0" class="text-center py-12">
      <Package class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">{{ t('docs.noSymbolsFound') }} {{ activeTab }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Package, FileCode, List, ArrowRight, BookOpen, Code } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface TSDocSymbol {
  name: string
  type: string
  file: string
  line: number
  parameters?: Array<{
    name: string
    type: string
    optional: boolean
  }>
  properties?: Array<{
    name: string
    type: string
    optional: boolean
    documentation?: {
      summary?: string
      tags?: Array<{
        name: string
        text: string
      }>
    }
  }>
  returnType?: string
  documentation?: {
    summary?: string
    tags?: Array<{
      name: string
      text: string
    }>
  }
}

interface TSDocData {
  module: string
  description?: string
  symbols: TSDocSymbol[]
}

const props = defineProps<{
  data: TSDocData
}>()

const activeTab = ref('all')

const symbolTypes = computed(() => {
  const types = ['all', ...new Set(props.data.symbols.map(s => s.type))]
  return types
})

const filteredSymbols = computed(() => {
  if (activeTab.value === 'all') {
    return props.data.symbols
  }
  return props.data.symbols.filter(s => s.type === activeTab.value)
})

const getSymbolsByType = (type: string) => {
  if (type === 'all') {
    return props.data.symbols
  }
  return props.data.symbols.filter(s => s.type === type)
}

const getIconForType = (type: string) => {
  const icons: Record<string, any> = {
    function: Code,
    class: Package,
    interface: List,
    type: BookOpen,
    variable: FileCode
  }
  return icons[type] || FileCode
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    function: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    class: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    interface: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    type: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
    variable: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
  }
  return colors[type] || 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
}

const getParamDescription = (symbol: TSDocSymbol, paramName: string) => {
  const paramTag = symbol.documentation?.tags?.find(
    tag => tag.name === 'param' && tag.text.includes(paramName)
  )
  if (paramTag) {
    return paramTag.text.replace(paramName, '').replace(/^[\s-]+/, '')
  }
  return ''
}

const getReturnDescription = (symbol: TSDocSymbol) => {
  const returnTag = symbol.documentation?.tags?.find(tag => tag.name === 'returns')
  return returnTag?.text || ''
}

const getExampleCode = (symbol: TSDocSymbol) => {
  const exampleTag = symbol.documentation?.tags?.find(tag => tag.name === 'example')
  return exampleTag?.text || ''
}
</script>

<style scoped>
.tsdoc-container {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

pre code {
  font-family: 'Fira Code', 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

table {
  font-size: 0.875rem;
}
</style>
