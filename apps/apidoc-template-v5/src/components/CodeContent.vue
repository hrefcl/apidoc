<template>
  <div class="code-container max-w-7xl mx-auto px-4 py-8">
    <!-- Module Header -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3 mb-3">
        <Braces class="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ data.group || 'Code Documentation' }}
        </h1>
        <span v-if="data.lang"
              class="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
          {{ getLangLabel(data.lang) }}
        </span>
      </div>
      <p v-if="data.description" class="text-lg text-gray-600 dark:text-gray-300">
        {{ data.description }}
      </p>
    </div>

    <!-- Language Filter (if multiple languages) -->
    <div v-if="availableLanguages.length > 1" class="flex gap-2 mb-4 flex-wrap">
      <button
        v-for="lang in availableLanguages"
        :key="lang"
        @click="selectedLang = lang"
        :class="[
          'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
          selectedLang === lang
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        ]"
      >
        {{ getLangLabel(lang) }}
      </button>
    </div>

    <!-- Navigation Tabs by Type -->
    <div class="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
      <button
        v-for="type in elementTypes"
        :key="type"
        @click="activeTab = type"
        :class="[
          'px-4 py-2 font-medium transition-colors relative whitespace-nowrap',
          activeTab === type
            ? 'text-indigo-600 dark:text-indigo-400'
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
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
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
                  class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
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
                <!-- Access Modifier -->
                <span v-if="element.access"
                      class="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  {{ element.access }}
                </span>
                <!-- Static Badge -->
                <span v-if="element.isStatic"
                      class="px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  static
                </span>
                <!-- Async Badge -->
                <span v-if="element.isAsync"
                      class="px-2 py-1 text-xs font-medium rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                  async
                </span>
                <!-- Language Badge -->
                <span v-if="element.lang"
                      class="px-2 py-1 text-xs font-medium rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                  {{ element.lang }}
                </span>
                <!-- Platforms -->
                <div v-if="element.platforms && element.platforms.length > 0" class="flex gap-1">
                  <span
                    v-for="platform in element.platforms"
                    :key="platform"
                    class="px-2 py-0.5 text-xs font-medium rounded bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300"
                  >
                    {{ platform }}
                  </span>
                </div>
              </div>

              <!-- Annotations -->
              <div v-if="element.annotations && element.annotations.length > 0" class="mb-2 flex flex-wrap gap-1">
                <span v-for="annotation in element.annotations" :key="annotation"
                      class="font-mono text-xs px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                  {{ annotation }}
                </span>
              </div>

              <!-- Signature -->
              <div v-if="element.signature"
                   class="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
                {{ element.signature }}
              </div>

              <!-- Auto-generated Signature for functions/methods -->
              <div v-else-if="element.type === 'function' || element.type === 'method'"
                   class="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
                <span v-if="element.isAsync" class="text-purple-600 dark:text-purple-400">async </span>
                <span v-if="element.isStatic" class="text-blue-600 dark:text-blue-400">static </span>
                <span class="text-green-600 dark:text-green-400">{{ getReturnType(element) }}</span>
                <span class="text-indigo-600 dark:text-indigo-400 ml-1">{{ element.name }}</span>
                <span v-if="element.generics && element.generics.length > 0" class="text-orange-600 dark:text-orange-400">&lt;{{ element.generics.map(g => g.name).join(', ') }}&gt;</span>(<span
                  v-for="(param, idx) in element.parameters"
                  :key="param.field"
                >
                  <span class="text-purple-600 dark:text-purple-400">{{ param.type }}</span>
                  <span class="text-gray-600 dark:text-gray-400 ml-1">{{ param.field }}</span><span v-if="idx < element.parameters.length - 1">, </span>
                </span>)
              </div>

              <!-- Class/Interface Signature -->
              <div v-else-if="element.type === 'class' || element.type === 'interface' || element.type === 'protocol'"
                   class="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
                <span v-if="element.access" class="text-gray-500 dark:text-gray-400">{{ element.access }} </span>
                <span class="text-purple-600 dark:text-purple-400">{{ element.type }}</span>
                <span class="text-indigo-600 dark:text-indigo-400 ml-2">{{ element.name }}</span>
                <span v-if="element.generics && element.generics.length > 0" class="text-orange-600 dark:text-orange-400">&lt;{{ element.generics.map(g => g.name + (g.constraint ? ': ' + g.constraint : '')).join(', ') }}&gt;</span>
              </div>

              <!-- Struct/Enum Signature -->
              <div v-else-if="element.type === 'struct' || element.type === 'enum'"
                   class="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
                <span class="text-purple-600 dark:text-purple-400">{{ element.type }}</span>
                <span class="text-indigo-600 dark:text-indigo-400 ml-2">{{ element.name }}</span>
              </div>

              <!-- Property/Constant Signature -->
              <div v-else-if="element.type === 'property' || element.type === 'constant'"
                   class="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
                <span v-if="element.access" class="text-gray-500 dark:text-gray-400">{{ element.access }} </span>
                <span v-if="element.isStatic" class="text-blue-600 dark:text-blue-400">static </span>
                <span v-if="element.type === 'constant'" class="text-orange-600 dark:text-orange-400">const </span>
                <span class="text-indigo-600 dark:text-indigo-400">{{ element.name }}</span>
                <span v-if="getReturnType(element) !== 'any'" class="text-gray-500 dark:text-gray-400">: </span>
                <span v-if="getReturnType(element) !== 'any'" class="text-green-600 dark:text-green-400">{{ getReturnType(element) }}</span>
              </div>
            </div>

            <!-- Version and File Info -->
            <div class="flex flex-col items-end gap-1 text-sm text-gray-500 dark:text-gray-400">
              <div v-if="element.version" class="flex items-center gap-2">
                <Tag class="w-4 h-4" />
                <span>v{{ formatVersion(element.version) }}</span>
              </div>
              <div v-if="element.filename" class="flex items-center gap-2 text-xs">
                <FileCode class="w-3 h-3" />
                <span class="font-mono">{{ element.filename }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Element Body -->
        <div class="px-6 py-4">
          <!-- Deprecated Warning -->
          <div v-if="element.deprecated"
               class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle class="w-4 h-4" />
              <span class="font-medium">Deprecated</span>
            </div>
            <p v-if="element.deprecated.message" class="mt-1 text-sm text-red-600 dark:text-red-300">
              {{ element.deprecated.message }}
            </p>
          </div>

          <!-- Description -->
          <div v-if="element.description" class="mb-4">
            <p class="text-gray-700 dark:text-gray-300" v-html="element.description"></p>
          </div>

          <!-- Generic Type Parameters -->
          <div v-if="element.generics && element.generics.length > 0" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Hash class="w-4 h-4" />
              Type Parameters
            </h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('common.name') }}</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Constraint</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('api.description') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="generic in element.generics" :key="generic.name">
                    <td class="px-4 py-2 font-mono text-sm text-orange-600 dark:text-orange-400">{{ generic.name }}</td>
                    <td class="px-4 py-2 font-mono text-sm text-purple-600 dark:text-purple-400">{{ generic.constraint || '-' }}</td>
                    <td class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{{ generic.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                    <td class="px-4 py-2 font-mono text-sm text-gray-900 dark:text-white">
                      {{ param.field }}
                      <span v-if="param.optional" class="text-gray-400">?</span>
                      <span v-if="param.defaultValue" class="text-gray-400 ml-1">= {{ param.defaultValue }}</span>
                    </td>
                    <td class="px-4 py-2 font-mono text-sm text-purple-600 dark:text-purple-400">{{ param.type }}</td>
                    <td class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{{ param.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Return Value -->
          <div v-if="element.returns" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <ArrowRight class="w-4 h-4" />
              {{ t('docs.returns') }}
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
              <div class="flex items-start gap-2">
                <code class="text-green-600 dark:text-green-400 font-mono">{{ element.returns.type }}</code>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ element.returns.description }}</p>
              </div>
            </div>
          </div>

          <!-- Throws/Exceptions -->
          <div v-if="element.throws && element.throws.length > 0" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle class="w-4 h-4 text-red-500" />
              Throws
            </h4>
            <div class="space-y-2">
              <div v-for="exc in element.throws" :key="exc.type"
                   class="flex gap-3 bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                <code class="text-red-600 dark:text-red-400 font-mono text-sm">{{ exc.type }}</code>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ exc.description }}</span>
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
              <a v-for="ref in element.see" :key="ref.reference"
                 :href="isUrl(ref.reference) ? ref.reference : `#${ref.reference}`"
                 :target="isUrl(ref.reference) ? '_blank' : undefined"
                 class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {{ ref.reference }}
                <span v-if="ref.description" class="text-gray-500 ml-1">- {{ ref.description }}</span>
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
              <pre class="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg p-4 overflow-x-auto"><code>{{ example.code || example.content }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredElements.length === 0" class="text-center py-12">
      <Braces class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">No elements found for {{ activeTab }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Braces, Code, List, ArrowRight, Tag, ExternalLink, Clock, AlertTriangle,
  Hash, Box, CircuitBoard, Settings, Shield, Zap, Package, FileCode, Layers
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface CodeParameter {
  field: string
  type: string
  description: string
  optional?: boolean
  defaultValue?: string
}

interface CodeReturn {
  type: string
  description: string
}

interface CodeThrows {
  type: string
  description: string
}

interface CodeGeneric {
  name: string
  constraint?: string
  description: string
}

interface CodeExample {
  title: string
  code?: string
  content?: string
  type?: string
}

interface CodeSee {
  reference: string
  description?: string
}

interface CodeDeprecated {
  deprecated: boolean
  message?: string
}

interface CodeElement {
  id: string
  group: string
  name: string
  title: string
  type: string // function, class, method, interface, protocol, struct, enum, extension, property, constant, module
  lang?: string // kotlin, swift, java, python, go, rust, csharp, etc.
  description?: string
  version?: string
  since?: string
  signature?: string
  access?: string // public, private, protected, internal
  isStatic?: boolean
  isAsync?: boolean
  platforms?: string[]
  generics?: CodeGeneric[]
  annotations?: string[]
  parameters?: CodeParameter[]
  returns?: CodeReturn
  throws?: CodeThrows[]
  examples?: CodeExample[]
  see?: CodeSee[]
  deprecated?: CodeDeprecated
}

interface CodeData {
  group?: string
  lang?: string
  description?: string
  elements: CodeElement[]
}

const props = defineProps<{
  data: CodeData
}>()

const activeTab = ref('all')
const selectedLang = ref('all')

// Get unique languages
const availableLanguages = computed(() => {
  const langs = new Set(['all'])
  props.data.elements?.forEach(e => {
    if (e.lang) langs.add(e.lang)
  })
  return Array.from(langs)
})

const elementTypes = computed(() => {
  const types = ['all', ...new Set(props.data.elements?.map(e => e.type) || [])]
  return types
})

const filteredElements = computed(() => {
  if (!props.data.elements) return []

  let elements = props.data.elements

  // Filter by language
  if (selectedLang.value !== 'all') {
    elements = elements.filter(e => e.lang === selectedLang.value)
  }

  // Filter by type
  if (activeTab.value !== 'all') {
    elements = elements.filter(e => e.type === activeTab.value)
  }

  return elements
})

const getElementsByType = (type: string) => {
  if (!props.data.elements) return []

  let elements = props.data.elements

  // Apply language filter
  if (selectedLang.value !== 'all') {
    elements = elements.filter(e => e.lang === selectedLang.value)
  }

  if (type === 'all') {
    return elements
  }
  return elements.filter(e => e.type === type)
}

const getIconForType = (type: string) => {
  const icons: Record<string, any> = {
    all: Braces,
    function: Code,
    method: Code,
    class: Box,
    interface: Layers,
    protocol: Shield,
    struct: Package,
    enum: Hash,
    extension: CircuitBoard,
    property: Settings,
    constant: Tag,
    module: FileCode,
    async: Zap
  }
  return icons[type] || Code
}

const translateType = (type: string) => {
  const labels: Record<string, string> = {
    all: 'All',
    function: 'Functions',
    method: 'Methods',
    class: 'Classes',
    interface: 'Interfaces',
    protocol: 'Protocols',
    struct: 'Structs',
    enum: 'Enums',
    extension: 'Extensions',
    property: 'Properties',
    constant: 'Constants',
    module: 'Modules'
  }
  return labels[type] || type.charAt(0).toUpperCase() + type.slice(1)
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    function: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
    method: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    class: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    interface: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300',
    protocol: 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300',
    struct: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    enum: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
    extension: 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300',
    property: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    constant: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    module: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
  }
  return colors[type] || 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
}

const getLangLabel = (lang: string) => {
  const labels: Record<string, string> = {
    all: 'All Languages',
    kotlin: 'Kotlin',
    swift: 'Swift',
    java: 'Java',
    python: 'Python',
    go: 'Go',
    rust: 'Rust',
    csharp: 'C#',
    cpp: 'C++',
    c: 'C',
    ruby: 'Ruby',
    php: 'PHP',
    dart: 'Dart',
    scala: 'Scala',
    lua: 'Lua',
    elixir: 'Elixir',
    haskell: 'Haskell',
    objectivec: 'Objective-C',
    r: 'R',
    julia: 'Julia',
    clojure: 'Clojure',
    groovy: 'Groovy',
    v: 'V',
    zig: 'Zig',
    nim: 'Nim',
    typescript: 'TypeScript',
    javascript: 'JavaScript'
  }
  return labels[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)
}

const getReturnType = (element: CodeElement) => {
  if (element.returns) {
    return element.returns.type
  }
  return 'void'
}

const isUrl = (str: string) => {
  return str.startsWith('http://') || str.startsWith('https://')
}

const formatVersion = (version: any) => {
  if (!version) return ''
  // Handle case where version is an object {version: "..."}
  if (typeof version === 'object' && version.version) {
    return version.version
  }
  return String(version)
}
</script>

<style scoped>
.code-container {
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
