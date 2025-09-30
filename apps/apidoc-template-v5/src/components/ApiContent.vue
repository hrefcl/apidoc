<template>
  <div class="space-y-8">
    <!-- Group Header if endpoints exist -->
    <div v-if="data.group && data.endpoints" class="mb-8">
      <h2 class="text-3xl font-bold mb-2">{{ data.group }}</h2>
      <p v-if="data.endpoints.length" class="text-muted-foreground">
        {{ data.endpoints.length }} {{ data.endpoints.length === 1 ? t('api.endpoint') : t('api.endpoints') }}
      </p>
    </div>

    <!-- Endpoints List -->
    <div v-if="data.endpoints && data.endpoints.length > 0" class="space-y-6">
      <div v-for="(endpointGroup, index) in groupedEndpoints" :key="endpointGroup.key"
           class="border border-border rounded-lg overflow-hidden bg-card">
        <!-- Endpoint Header - Collapsible -->
        <div class="opblock-summary cursor-pointer p-4 hover:bg-muted/50 transition-colors" @click="toggleCollapse(endpointGroup.key)">
          <div class="flex items-center gap-3">
            <span :class="getMethodClass(endpointGroup.endpoint.method)"
                  class="px-3 py-1 rounded font-mono text-xs font-bold uppercase">
              {{ endpointGroup.endpoint.method }}
            </span>
            <span class="font-mono text-sm text-foreground flex-1">{{ endpointGroup.endpoint.url }}</span>
            <span class="text-sm text-muted-foreground">{{ endpointGroup.endpoint.title || endpointGroup.endpoint.name }}</span>
          </div>
        </div>

        <!-- Collapsible Content -->
        <div v-show="!collapsedSections[endpointGroup.key]" class="opblock-content">
          <!-- Request Information Section -->
          <div class="opblock-section border-b border-border p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-semibold">Request</h3>

              <!-- Version Selector Dropdown -->
              <div v-if="endpointGroup.versions.length > 1" class="relative" ref="versionDropdownRef">
                <button
                  @click="toggleVersionDropdown(endpointGroup.key)"
                  class="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded text-sm font-medium transition-colors"
                >
                  <span class="font-bold">{{ endpointGroup.selectedVersion }}</span>
                  <ChevronDown class="w-4 h-4" />
                </button>
                <Transition name="dropdown">
                  <div
                    v-if="activeVersionDropdown === endpointGroup.key"
                    class="absolute right-0 mt-2 min-w-[200px] bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    <h6 class="px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
                      comparar cambios con:
                    </h6>
                    <button
                      v-for="version in endpointGroup.versions"
                      :key="version"
                      @click="selectVersion(endpointGroup.key, version)"
                      class="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                      :class="version === endpointGroup.selectedVersion ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-medium' : 'text-foreground'"
                    >
                      v{{ version }}
                    </button>
                  </div>
                </Transition>
              </div>
              <!-- Single version badge -->
              <span v-else-if="endpointGroup.endpoint.version" class="px-3 py-2 bg-muted text-muted-foreground text-sm rounded font-bold">
                {{ endpointGroup.endpoint.version }}
              </span>
            </div>

            <!-- Method + URL Section -->
            <div class="bg-muted/30 rounded-lg p-4 mb-4">
              <div class="flex items-center gap-3 mb-3">
                <span :class="getMethodClass(endpointGroup.endpoint.method)"
                      class="px-3 py-1 rounded font-mono text-sm font-bold uppercase">
                  {{ endpointGroup.endpoint.method }}
                </span>
                <div class="flex-1 bg-background border border-border rounded px-3 py-2 font-mono text-sm">
                  <span class="text-foreground font-semibold">{{ endpointGroup.endpoint.url }}</span>
                </div>
                <button
                  @click="copyUrl(endpointGroup.endpoint.url)"
                  class="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-2"
                  :title="t('common.copy') + ' URL'"
                >
                  <Copy class="w-4 h-4" />
                  {{ t('common.copy') }}
                </button>
              </div>

              <!-- Permissions -->
              <div v-if="endpointGroup.endpoint.permission" class="text-sm">
                <span class="text-muted-foreground font-medium">Permissions:</span>
                <span
                  v-for="(perm, index) in getPermissions(endpointGroup.endpoint)"
                  :key="index"
                  class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                >
                  {{ perm.name }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div v-if="endpointGroup.endpoint.description" v-html="endpointGroup.endpoint.description"
                 class="text-muted-foreground mb-4 prose prose-sm dark:prose-invert max-w-none"></div>
          </div>

        <!-- Endpoint Body -->
        <div class="p-6 space-y-6">
          <!-- Headers Table -->
          <div v-if="endpointGroup.endpoint.header?.fields?.Header || endpointGroup.endpoint.headers" id="section-headers">
            <ParametersTable
              :parameters="endpointGroup.endpoint.header?.fields?.Header || endpointGroup.endpoint.headers"
              :title="t('api.headers')"
            />
          </div>

          <!-- Parameters Table -->
          <div v-if="endpointGroup.endpoint.parameter?.fields?.Parameter || endpointGroup.endpoint.parameters" id="section-parameters">
            <ParametersTable
              :parameters="endpointGroup.endpoint.parameter?.fields?.Parameter || endpointGroup.endpoint.parameters"
              :title="t('api.parameters')"
            />
          </div>

          <!-- Request Examples with Tabs -->
          <div v-if="endpointGroup.endpoint.examples && endpointGroup.endpoint.examples.length > 0" id="section-examples">
            <h4 class="text-lg font-semibold mb-3">{{ t('api.examples') }}</h4>
            <CodeTabs :examples="endpointGroup.endpoint.examples" />
          </div>

          <!-- Success Response -->
          <div v-if="endpointGroup.endpoint.success" id="section-success">
            <ResponseTable
              :title="t('api.success')"
              :fields="getSuccessFields(endpointGroup.endpoint.success)"
              :example="getSuccessExample(endpointGroup.endpoint.success)"
              :statusCode="endpointGroup.endpoint.success.statusCode || '200'"
            />
          </div>

          <!-- Error Response -->
          <div v-if="endpointGroup.endpoint.error" id="section-error">
            <!-- Group errors by their 'group' field -->
            <template v-if="endpointGroup.endpoint.error.fields && Array.isArray(endpointGroup.endpoint.error.fields)">
              <div v-for="(groupFields, groupName) in groupErrorsByGroup(endpointGroup.endpoint.error.fields)" :key="groupName" class="mb-4">
                <ResponseTable
                  :title="groupName"
                  :fields="groupFields"
                  :example="groupName === Object.keys(groupErrorsByGroup(endpointGroup.endpoint.error.fields))[0] ? getErrorExample(endpointGroup.endpoint.error) : null"
                  :statusCode="getStatusCodeFromGroup(groupName) || '400'"
                />
              </div>
            </template>
            <!-- Fallback for old format or no grouped fields -->
            <ResponseTable
              v-else
              :title="t('api.error')"
              :fields="getErrorFields(endpointGroup.endpoint.error)"
              :example="getErrorExample(endpointGroup.endpoint.error)"
              :statusCode="endpointGroup.endpoint.error.statusCode || '400'"
            />
          </div>

          <!-- Try It Out -->
          <div id="section-try-it-out">
            <TryItOut :endpoint="endpointGroup.endpoint" />
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-- Legacy single endpoint format (backward compatibility) -->
    <div v-else>
      <!-- API Metadata -->
      <div v-if="data.group || data.type" class="flex flex-wrap gap-2">
        <span v-if="data.group" class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
          {{ data.group }}
        </span>
        <span v-if="data.type" class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
          {{ data.type }}
        </span>
      </div>

      <!-- Description -->
      <div v-if="data.description" v-html="renderMarkdown(data.description)"></div>

      <!-- Parameters -->
      <div v-if="data.parameter && data.parameter.fields && Object.keys(data.parameter.fields).length > 0" class="not-prose">
        <h2 class="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{{ t('api.parameters') }}</h2>
        <div v-for="(params, groupName) in data.parameter.fields" :key="groupName" class="mb-6">
          <h3 v-if="groupName !== 'Parameter'" class="text-lg font-medium mb-3">{{ groupName }}</h3>
          <div class="bg-card border border-border rounded-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-muted">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('common.name') }}</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('common.type') }}</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('api.description') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(param, index) in params" :key="index" class="border-t border-border">
                  <td class="px-4 py-3 font-mono text-sm">
                    {{ param.field }}
                    <span v-if="!param.optional" class="text-red-600 dark:text-red-400 ml-1">*</span>
                  </td>
                  <td class="px-4 py-3">
                    <code class="text-xs bg-muted px-2 py-1 rounded">{{ param.type }}</code>
                  </td>
                  <td class="px-4 py-3 text-sm text-muted-foreground">
                    {{ param.description }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Success Response -->
      <div v-if="data.success && data.success.fields && Object.keys(data.success.fields).length > 0" class="not-prose">
        <h2 class="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{{ t('api.success') }}</h2>
        <div v-for="(responses, groupName) in data.success.fields" :key="groupName" class="mb-6">
          <h3 v-if="groupName !== 'Success 200'" class="text-lg font-medium mb-3">{{ groupName }}</h3>
          <div class="bg-card border border-border rounded-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-muted">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('common.name') }}</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('common.type') }}</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('api.description') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(field, index) in responses" :key="index" class="border-t border-border">
                  <td class="px-4 py-3 font-mono text-sm">{{ field.field }}</td>
                  <td class="px-4 py-3">
                    <code class="text-xs bg-muted px-2 py-1 rounded">{{ field.type }}</code>
                  </td>
                  <td class="px-4 py-3 text-sm text-muted-foreground">
                    {{ field.description }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Examples -->
      <div v-if="data.examples && data.examples.length > 0" class="not-prose">
        <h2 class="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{{ t('api.examples') }}</h2>
        <div v-for="(example, index) in data.examples" :key="index" class="mb-6">
          <h3 class="text-lg font-medium mb-3">{{ example.title }}</h3>
          <pre class="bg-card border border-border rounded-lg p-4 overflow-x-auto"><code class="text-sm">{{ example.content }}</code></pre>
        </div>
      </div>

      <!-- Error Response -->
      <div v-if="data.error && data.error.fields && Object.keys(data.error.fields).length > 0" class="not-prose">
        <h2 class="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{{ t('api.error') }}</h2>
        <div v-for="(errors, groupName) in data.error.fields" :key="groupName" class="mb-6">
          <h3 class="text-lg font-medium mb-3">{{ groupName }}</h3>
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-red-100 dark:bg-red-900/40">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('common.name') }}</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('common.type') }}</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('api.description') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(field, index) in errors" :key="index" class="border-t border-red-200 dark:border-red-800">
                  <td class="px-4 py-3 font-mono text-sm">{{ field.field }}</td>
                  <td class="px-4 py-3">
                    <code class="text-xs bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded">{{ field.type }}</code>
                  </td>
                  <td class="px-4 py-3 text-sm">
                    {{ field.description }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown, Check, Copy } from 'lucide-vue-next'
import CodeTabs from './CodeTabs.vue'
import ParametersTable from './ParametersTable.vue'
import ResponseTable from './ResponseTable.vue'
import TryItOut from './TryItOut.vue'

const { t } = useI18n()

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  externalSelectedVersion: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['sections-ready', 'versions-ready'])

const activeVersionDropdown = ref(null)
const versionDropdownRef = ref(null)
const selectedVersions = reactive({})
const collapsedSections = reactive({})

// Group endpoints by method+path to handle multiple versions
const groupedEndpoints = computed(() => {
  if (!props.data.endpoints || props.data.endpoints.length === 0) return []

  const groups = new Map()

  props.data.endpoints.forEach(endpoint => {
    const key = `${endpoint.method}-${endpoint.url}`

    if (!groups.has(key)) {
      // Si el endpoint tiene un array de versiones (nuevo formato APIcat), usarlas
      const hasVersionsArray = endpoint.versions && Array.isArray(endpoint.versions) && endpoint.versions.length > 0

      console.log('🔍 Processing endpoint:', endpoint.name, 'has versions array?', hasVersionsArray, 'versions:', endpoint.versions?.length)

      if (hasVersionsArray) {
        // Usar el array de versiones del endpoint
        groups.set(key, {
          key,
          versions: endpoint.versions.map(v => v.version),
          endpoints: endpoint.versions
        })
      } else {
        // Formato antiguo: un endpoint = una versión
        groups.set(key, {
          key,
          versions: [endpoint.version],
          endpoints: [endpoint]
        })
      }
    } else {
      // Si ya existe el grupo, agregar esta versión (formato antiguo)
      const group = groups.get(key)
      if (!group.versions.includes(endpoint.version)) {
        group.versions.push(endpoint.version)
        group.endpoints.push(endpoint)
      }
    }
  })

  // Convert to array and select latest version by default
  return Array.from(groups.values()).map(group => {
    // Sort versions descending (latest first)
    group.versions.sort((a, b) => {
      const aParts = a.split('.').map(Number)
      const bParts = b.split('.').map(Number)
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aNum = aParts[i] || 0
        const bNum = bParts[i] || 0
        if (aNum !== bNum) return bNum - aNum
      }
      return 0
    })

    console.log('🔍 Group versions after sort:', group.versions)

    // Get selected version from external prop, internal state, or default to latest
    const selectedVersion = props.externalSelectedVersion || selectedVersions[group.key] || group.versions[0]
    const endpoint = group.endpoints.find(e => e.version === selectedVersion) || group.endpoints[0]

    console.log('🔍 Selected version:', selectedVersion, 'endpoint:', endpoint?.name)

    return {
      ...group,
      selectedVersion,
      endpoint
    }
  })
})

const toggleVersionDropdown = (key) => {
  activeVersionDropdown.value = activeVersionDropdown.value === key ? null : key
}

const selectVersion = (key, version) => {
  selectedVersions[key] = version
  activeVersionDropdown.value = null
}

const toggleCollapse = (key) => {
  collapsedSections[key] = !collapsedSections[key]
}

const copyUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    // TODO: Show toast notification
  } catch (err) {
    console.error('Failed to copy URL:', err)
  }
}

const getPermissions = (endpoint) => {
  if (!endpoint.permission) return []
  // Si es un array
  if (Array.isArray(endpoint.permission)) {
    return endpoint.permission
  }
  // Si es un objeto con name
  if (endpoint.permission.name) {
    return [endpoint.permission]
  }
  return []
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (versionDropdownRef.value && versionDropdownRef.value.$el && !versionDropdownRef.value.$el.contains(event.target)) {
    activeVersionDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Helper functions for getting fields from success/error
const getSuccessFields = (success) => {
  if (!success.fields) return []
  // Handle new array format
  if (Array.isArray(success.fields)) {
    return success.fields
  }
  // Handle old object format
  const firstKey = Object.keys(success.fields)[0]
  return success.fields[firstKey] || []
}

const getSuccessExample = (success) => {
  if (!success.examples || success.examples.length === 0) return null
  return success.examples[0].content
}

const getErrorFields = (error) => {
  if (!error.fields) return []
  // Handle new array format
  if (Array.isArray(error.fields)) {
    return error.fields
  }
  // Handle old object format
  const firstKey = Object.keys(error.fields)[0]
  return error.fields[firstKey] || []
}

const getErrorExample = (error) => {
  if (!error.examples || error.examples.length === 0) return null
  return error.examples[0].content
}

// Group error fields by their 'group' property
const groupErrorsByGroup = (fields) => {
  if (!fields || !Array.isArray(fields)) return {}

  const grouped = {}
  fields.forEach(field => {
    const group = field.group || 'Error 4xx'
    if (!grouped[group]) {
      grouped[group] = []
    }
    grouped[group].push(field)
  })

  return grouped
}

// Extract status code from group name (e.g., "500 Internal Server Error" -> "500")
const getStatusCodeFromGroup = (groupName) => {
  if (!groupName) return null
  const match = groupName.match(/^(\d{3})/)
  return match ? match[1] : (groupName.includes('4') ? '400' : '500')
}

const getMethodClass = (method) => {
  const classes = {
    'GET': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    'POST': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    'PUT': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    'PATCH': 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
    'DELETE': 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
  }
  return classes[method] || 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
}

const renderMarkdown = (text) => {
  if (!text) return ''
  // Simple markdown rendering
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
}

// Emit sections and versions when component is mounted
onMounted(() => {
  // Generate sections array for TOC
  const sections = []

  if (groupedEndpoints.value.length > 0) {
    const endpoint = groupedEndpoints.value[0].endpoint

    if (endpoint.header?.fields?.Header || endpoint.headers) {
      sections.push({ id: 'section-headers', title: t('api.headers') })
    }
    if (endpoint.parameter?.fields?.Parameter || endpoint.parameters) {
      sections.push({ id: 'section-parameters', title: t('api.parameters') })
    }
    if (endpoint.examples && endpoint.examples.length > 0) {
      sections.push({ id: 'section-examples', title: t('api.examples') })
    }
    if (endpoint.success?.fields) {
      sections.push({ id: 'section-success', title: t('api.success') })
    }
    if (endpoint.error?.fields) {
      sections.push({ id: 'section-error', title: t('api.error') })
    }
    sections.push({ id: 'section-try-it-out', title: t('api.tryIt') })

    emit('sections-ready', sections)

    // Emit versions if available
    console.log('🔍 DEBUG: Checking for versions...')
    console.log('🔍 DEBUG: groupedEndpoints.value[0]:', groupedEndpoints.value[0])

    if (groupedEndpoints.value[0]) {
      console.log('🔍 DEBUG: First endpoint has versions?', groupedEndpoints.value[0].versions)
      console.log('🔍 DEBUG: Versions length:', groupedEndpoints.value[0].versions?.length)

      if (groupedEndpoints.value[0].versions && groupedEndpoints.value[0].versions.length > 1) {
        console.log('✅ DEBUG: Emitting versions-ready event with:', {
          versions: groupedEndpoints.value[0].versions,
          endpoints: groupedEndpoints.value[0].endpoints,
          selectedVersion: groupedEndpoints.value[0].selectedVersion
        })
        emit('versions-ready', {
          versions: groupedEndpoints.value[0].versions, // Array de strings: ['3.0.0', '2.0.0', '1.0.0']
          endpoints: groupedEndpoints.value[0].endpoints, // Array de objetos completos para el comparador
          selectedVersion: groupedEndpoints.value[0].selectedVersion
        })
      } else {
        console.log('❌ DEBUG: Versions not found or length <= 1')
      }
    } else {
      console.log('❌ DEBUG: No first endpoint in groupedEndpoints')
    }
  }
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>