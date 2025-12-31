<template>
  <div class="iot-container max-w-7xl mx-auto px-4 py-8">
    <!-- Module Header -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3 mb-3">
        <Cpu class="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ data.group || 'IoT Documentation' }}
        </h1>
      </div>
      <p v-if="data.description" class="text-lg text-gray-600 dark:text-gray-300">
        {{ data.description }}
      </p>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
      <button
        v-for="type in elementTypes"
        :key="type"
        @click="activeTab = type"
        :class="[
          'px-4 py-2 font-medium transition-colors relative whitespace-nowrap',
          activeTab === type
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        ]"
      >
        <span class="flex items-center gap-2">
          <component :is="getIconForType(type)" class="w-4 h-4" />
          {{ translateType(type) }}
        </span>
        <span
          v-if="getElementsByType(type).length > 0"
          class="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800"
        >
          {{ getElementsByType(type).length }}
        </span>
        <div
          v-if="activeTab === type"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400"
        ></div>
      </button>
    </div>

    <!-- Elements List -->
    <div class="space-y-6">
      <div
        v-for="element in filteredElements"
        :key="element.id"
        :id="element.id"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Element Header -->
        <div class="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2 flex-wrap">
                <component
                  :is="getIconForType(element.type)"
                  class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                />
                <h3 class="text-xl font-mono font-semibold text-gray-900 dark:text-white">
                  {{ element.name }}
                </h3>
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded',
                    getTypeColor(element.type)
                  ]"
                >
                  {{ element.type }}
                </span>
                <!-- Platforms -->
                <div v-if="element.platforms && element.platforms.length > 0" class="flex gap-1">
                  <span
                    v-for="platform in element.platforms"
                    :key="platform"
                    class="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  >
                    {{ platform }}
                  </span>
                </div>
              </div>

              <!-- Function Signature -->
              <div v-if="element.type === 'function' || element.type === 'isr' || element.type === 'callback'"
                   class="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
                <span class="text-green-600 dark:text-green-400">{{ getReturnType(element) }}</span>
                <span class="text-emerald-600 dark:text-emerald-400 ml-1">{{ element.name }}</span>(<span
                  v-for="(param, idx) in element.parameters"
                  :key="param.field"
                >
                  <span class="text-purple-600 dark:text-purple-400">{{ param.type }}</span>
                  <span class="text-gray-600 dark:text-gray-400 ml-1">{{ param.field }}</span><span v-if="idx < element.parameters.length - 1">, </span>
                </span>)
              </div>

              <!-- Macro/Define Signature -->
              <div v-else-if="element.type === 'macro' || element.type === 'define'"
                   class="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
                <span class="text-orange-600 dark:text-orange-400">#define</span>
                <span class="text-emerald-600 dark:text-emerald-400 ml-2">{{ element.name }}</span>
                <span v-if="element.parameters && element.parameters.length > 0">(<span
                  v-for="(param, idx) in element.parameters"
                  :key="param.field"
                >{{ param.field }}<span v-if="idx < element.parameters.length - 1">, </span></span>)</span>
              </div>

              <!-- Struct Signature -->
              <div v-else-if="element.type === 'struct'"
                   class="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
                <span class="text-purple-600 dark:text-purple-400">struct</span>
                <span class="text-emerald-600 dark:text-emerald-400 ml-2">{{ element.name }}</span>
              </div>

              <!-- Enum Signature -->
              <div v-else-if="element.type === 'enum'"
                   class="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
                <span class="text-purple-600 dark:text-purple-400">enum</span>
                <span class="text-emerald-600 dark:text-emerald-400 ml-2">{{ element.name }}</span>
              </div>
            </div>

            <!-- Version Badge -->
            <div v-if="element.version" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Tag class="w-4 h-4" />
              <span>v{{ element.version }}</span>
            </div>
          </div>
        </div>

        <!-- Element Body -->
        <div class="px-6 py-4">
          <!-- Description -->
          <div v-if="element.description" class="mb-4">
            <p class="text-gray-700 dark:text-gray-300" v-html="element.description"></p>
          </div>

          <!-- Parameters Table -->
          <div v-if="element.parameters && element.parameters.length > 0" class="mb-4">
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
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('api.description') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="param in element.parameters" :key="param.field">
                    <td class="px-4 py-2 font-mono text-sm text-gray-900 dark:text-white">{{ param.field }}</td>
                    <td class="px-4 py-2 font-mono text-sm text-purple-600 dark:text-purple-400">{{ param.type }}</td>
                    <td class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{{ param.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Return Value -->
          <div v-if="element.returns && element.returns.length > 0" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <ArrowRight class="w-4 h-4" />
              {{ t('docs.returns') }}
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
              <div v-for="ret in element.returns" :key="ret.type" class="flex items-start gap-2">
                <code class="text-green-600 dark:text-green-400 font-mono">{{ ret.type }}</code>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ ret.description }}</p>
              </div>
            </div>
          </div>

          <!-- Errors -->
          <div v-if="element.errors && element.errors.length > 0" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle class="w-4 h-4 text-red-500" />
              Errors
            </h4>
            <div class="space-y-2">
              <div v-for="error in element.errors" :key="error.field"
                   class="flex gap-3 bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                <code class="text-red-600 dark:text-red-400 font-mono text-sm">{{ error.type }}</code>
                <span class="font-mono text-sm text-gray-900 dark:text-white">{{ error.field }}</span>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ error.description }}</span>
              </div>
            </div>
          </div>

          <!-- See Also -->
          <div v-if="element.see && element.see.length > 0" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <ExternalLink class="w-4 h-4" />
              See Also
            </h4>
            <div class="flex flex-wrap gap-2">
              <a v-for="ref in element.see" :key="ref"
                 :href="`#${ref}`"
                 class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {{ ref }}
              </a>
            </div>
          </div>

          <!-- Since Version -->
          <div v-if="element.since" class="mb-4">
            <span class="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">
              <Clock class="w-3 h-3" />
              Since v{{ element.since }}
            </span>
          </div>

          <!-- Examples -->
          <div v-if="element.examples && element.examples.length > 0" class="mt-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Code class="w-4 h-4" />
              {{ t('docs.example') }}
            </h4>
            <div v-for="example in element.examples" :key="example.title" class="mb-3">
              <div v-if="example.title" class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ example.title }}</div>
              <pre class="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg p-4 overflow-x-auto"><code>{{ example.content }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredElements.length === 0" class="text-center py-12">
      <Cpu class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">No elements found for {{ activeTab }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Cpu, Code, List, ArrowRight, Tag, ExternalLink, Clock, AlertTriangle,
  Zap, Box, Hash, Binary, CircuitBoard, Settings
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface IoTParameter {
  field: string
  type: string
  description: string
  optional?: boolean
  defaultValue?: string
}

interface IoTReturn {
  type: string
  description: string
}

interface IoTError {
  type: string
  field: string
  description: string
  group?: string
}

interface IoTExample {
  title: string
  content: string
  type?: string
}

interface IoTElement {
  id: string
  group: string
  name: string
  title: string
  type: string
  description?: string
  version?: string
  since?: string
  platforms?: string[]
  parameters?: IoTParameter[]
  returns?: IoTReturn[]
  errors?: IoTError[]
  examples?: IoTExample[]
  see?: string[]
}

interface IoTData {
  group?: string
  description?: string
  elements: IoTElement[]
}

const props = defineProps<{
  data: IoTData
}>()

const activeTab = ref('all')

const elementTypes = computed(() => {
  const types = ['all', ...new Set(props.data.elements?.map(e => e.type) || [])]
  return types
})

const filteredElements = computed(() => {
  if (!props.data.elements) return []
  if (activeTab.value === 'all') {
    return props.data.elements
  }
  return props.data.elements.filter(e => e.type === activeTab.value)
})

const getElementsByType = (type: string) => {
  if (!props.data.elements) return []
  if (type === 'all') {
    return props.data.elements
  }
  return props.data.elements.filter(e => e.type === type)
}

const getIconForType = (type: string) => {
  const icons: Record<string, any> = {
    all: Cpu,
    function: Code,
    isr: Zap,
    callback: CircuitBoard,
    struct: Box,
    enum: Hash,
    macro: Settings,
    define: Hash,
    typedef: Binary,
    const: Tag,
    variable: Binary,
    class: Box
  }
  return icons[type] || Code
}

const translateType = (type: string) => {
  const labels: Record<string, string> = {
    all: 'All',
    function: 'Functions',
    isr: 'ISRs',
    callback: 'Callbacks',
    struct: 'Structs',
    enum: 'Enums',
    macro: 'Macros',
    define: 'Defines',
    typedef: 'Typedefs',
    const: 'Constants',
    variable: 'Variables',
    class: 'Classes'
  }
  return labels[type] || type
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    function: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
    isr: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    callback: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    struct: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    enum: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
    macro: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    define: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    typedef: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300',
    const: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300',
    variable: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300',
    class: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
  }
  return colors[type] || 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
}

const getReturnType = (element: IoTElement) => {
  if (element.returns && element.returns.length > 0) {
    return element.returns[0].type
  }
  return 'void'
}
</script>

<style scoped>
.iot-container {
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
