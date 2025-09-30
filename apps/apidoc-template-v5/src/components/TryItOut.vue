<template>
  <div class="try-it-out my-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <div class="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('api.tryIt', 'Enviar una petición de ejemplo') }}</h3>
    </div>

    <div class="p-6 space-y-4">
      <!-- URL Field -->
      <div class="flex gap-2">
        <select
          v-model="endpoint.method"
          disabled
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md font-medium"
        >
          <option>{{ endpoint.method }}</option>
        </select>
        <input
          type="url"
          v-model="currentUrl"
          readonly
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <button
          @click="sendRequest"
          :disabled="loading"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors text-sm"
        >
          {{ loading ? 'Enviando...' : 'Enviar' }}
        </button>
      </div>

      <!-- Tabs Navigation -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex -mb-px space-x-1" aria-label="Tabs">
          <button
            v-if="parameters.length > 0"
            @click="activeTab = 'params'"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'params'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            ]"
          >
            Params
            <span v-if="parameters.length > 0" class="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
              {{ parameters.length }}
            </span>
          </button>

          <button
            v-if="['POST', 'PUT', 'PATCH'].includes(endpoint.method)"
            @click="activeTab = 'body'"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'body'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            ]"
          >
            Body
          </button>

          <button
            v-if="headers.length > 0"
            @click="activeTab = 'headers'"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'headers'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            ]"
          >
            Headers
            <span v-if="headers.length > 0" class="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
              {{ headers.length }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="min-h-[300px]">
        <!-- Params Tab -->
        <div v-if="activeTab === 'params' && parameters.length > 0" class="space-y-2">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="text-left py-2 px-2 w-8"></th>
                  <th class="text-left py-2 px-2 w-8"></th>
                  <th class="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Nombre del parámetro</th>
                  <th class="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300 w-24">Tipo</th>
                  <th class="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Valor</th>
                  <th class="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Descripción</th>
                  <th class="text-left py-2 px-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(param, index) in editableParams"
                  :key="index"
                  class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <!-- Checkbox -->
                  <td class="py-2 px-2">
                    <input
                      type="checkbox"
                      v-model="param.enabled"
                      class="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    >
                  </td>
                  <!-- Drag Handle -->
                  <td class="py-2 px-2">
                    <GripVertical class="w-4 h-4 text-gray-400 cursor-move" />
                  </td>
                  <!-- Name -->
                  <td class="py-2 px-3">
                    <div class="flex items-center gap-2">
                      <input
                        type="text"
                        :value="param.field"
                        disabled
                        class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 w-full"
                      >
                      <span v-if="param.required" class="text-red-500 text-xs">*</span>
                    </div>
                  </td>
                  <!-- Type -->
                  <td class="py-2 px-3">
                    <select
                      :value="param.type"
                      disabled
                      class="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 w-full"
                    >
                      <option>{{ param.type }}</option>
                    </select>
                  </td>
                  <!-- Value -->
                  <td class="py-2 px-3">
                    <input
                      type="text"
                      v-model="formData.parameters[param.field]"
                      :placeholder="param.defaultValue || `Enter ${param.field}`"
                      :disabled="!param.enabled"
                      class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500"
                    >
                  </td>
                  <!-- Description -->
                  <td class="py-2 px-3">
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs" :title="param.description">
                      {{ param.description || '-' }}
                    </div>
                  </td>
                  <!-- Actions -->
                  <td class="py-2 px-2">
                    <button
                      @click="removeParam(index)"
                      class="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            @click="addParam"
            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-2"
          >
            + Agregar parámetro
          </button>
        </div>

        <!-- Body Tab -->
        <div v-if="activeTab === 'body' && ['POST', 'PUT', 'PATCH'].includes(endpoint.method)">
          <div class="mb-3 flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Formato:</label>
            <select
              v-model="bodyFormat"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="json">JSON</option>
              <option value="raw">Raw</option>
            </select>
          </div>
          <textarea
            v-model="formData.body"
            rows="12"
            placeholder='{"key": "value"}'
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Headers Tab -->
        <div v-if="activeTab === 'headers' && headers.length > 0" class="space-y-2">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="text-left py-2 px-2 w-8"></th>
                  <th class="text-left py-2 px-2 w-8"></th>
                  <th class="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Header</th>
                  <th class="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300 w-24">Tipo</th>
                  <th class="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Valor</th>
                  <th class="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Descripción</th>
                  <th class="text-left py-2 px-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(header, index) in editableHeaders"
                  :key="index"
                  class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <!-- Checkbox -->
                  <td class="py-2 px-2">
                    <input
                      type="checkbox"
                      v-model="header.enabled"
                      class="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    >
                  </td>
                  <!-- Drag Handle -->
                  <td class="py-2 px-2">
                    <GripVertical class="w-4 h-4 text-gray-400 cursor-move" />
                  </td>
                  <!-- Name -->
                  <td class="py-2 px-3">
                    <div class="flex items-center gap-2">
                      <input
                        type="text"
                        :value="header.field"
                        disabled
                        class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 w-full"
                      >
                      <span v-if="header.required" class="text-red-500 text-xs">*</span>
                    </div>
                  </td>
                  <!-- Type -->
                  <td class="py-2 px-3">
                    <select
                      :value="header.type"
                      disabled
                      class="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 w-full"
                    >
                      <option>{{ header.type }}</option>
                    </select>
                  </td>
                  <!-- Value -->
                  <td class="py-2 px-3">
                    <input
                      type="text"
                      v-model="formData.headers[header.field]"
                      :placeholder="header.defaultValue || `Enter ${header.field}`"
                      :disabled="!header.enabled"
                      class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500"
                    >
                  </td>
                  <!-- Description -->
                  <td class="py-2 px-3">
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs" :title="header.description">
                      {{ header.description || '-' }}
                    </div>
                  </td>
                  <!-- Actions -->
                  <td class="py-2 px-2">
                    <button
                      @click="removeHeader(index)"
                      class="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            @click="addHeader"
            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-2"
          >
            + Agregar header
          </button>
        </div>
      </div>

      <!-- Response -->
      <div v-if="response" class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <div class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-3">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Respuesta</h3>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  getStatusClass(response.status)
                ]"
              >
                {{ response.status }} {{ response.statusText }}
              </span>
            </div>
            <button
              @click="copyResponse"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              :title="copied ? 'Copiado!' : 'Copiar'"
            >
              <Check v-if="copied" class="w-5 h-5 text-green-600" />
              <Copy v-else class="w-5 h-5" />
            </button>
          </div>
          <pre class="bg-gray-800 dark:bg-gray-950 text-gray-100 p-4 overflow-x-auto text-sm"><code class="language-json">{{ formatResponse(response.data) }}</code></pre>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Copy, Check, X, GripVertical } from 'lucide-vue-next'
import { useDocsStore } from '@/stores/docs'

const { t } = useI18n()
const docsStore = useDocsStore()

const props = defineProps({
  endpoint: {
    type: Object,
    required: true
  }
})

const loading = ref(false)
const response = ref(null)
const error = ref(null)
const copied = ref(false)
const activeTab = ref('params')
const bodyFormat = ref('json')

const formData = reactive({
  headers: {},
  parameters: {},
  body: ''
})

// Editable params/headers with enabled state
const editableParams = ref([])
const editableHeaders = ref([])

// Extract headers from endpoint (handle both new array format and old nested format)
const headers = computed(() => {
  if (Array.isArray(props.endpoint.header)) {
    return props.endpoint.header
  }
  if (props.endpoint.header?.fields?.Header) {
    return props.endpoint.header.fields.Header
  }
  return []
})

// Extract parameters from endpoint (handle both new array format and old nested format)
const parameters = computed(() => {
  if (Array.isArray(props.endpoint.parameters)) {
    return props.endpoint.parameters
  }
  if (props.endpoint.parameter?.fields?.Parameter) {
    return props.endpoint.parameter.fields.Parameter
  }
  return []
})

// Build current URL with baseUrl from project metadata
const currentUrl = computed(() => {
  // Priority: endpoint.sampleUrl > meta.sampleUrl > meta.url > fallback
  const baseUrl = props.endpoint.sampleUrl
    || docsStore.meta?.sampleUrl
    || docsStore.meta?.url
    || 'https://api.example.com'

  return baseUrl + props.endpoint.url
})

// Initialize form data with default values and editable arrays
watch(() => props.endpoint, (newEndpoint) => {
  // Initialize editable params
  editableParams.value = parameters.value.map(param => ({
    ...param,
    enabled: true
  }))

  // Initialize editable headers
  editableHeaders.value = headers.value.map(header => ({
    ...header,
    enabled: true
  }))

  // Initialize headers with default values
  headers.value.forEach(header => {
    if (header.defaultValue && !formData.headers[header.field]) {
      formData.headers[header.field] = header.defaultValue
    }
  })

  // Initialize parameters with default values
  parameters.value.forEach(param => {
    if (param.defaultValue && !formData.parameters[param.field]) {
      formData.parameters[param.field] = param.defaultValue
    }
  })

  // Set default active tab
  if (parameters.value.length > 0) {
    activeTab.value = 'params'
  } else if (headers.value.length > 0) {
    activeTab.value = 'headers'
  } else if (['POST', 'PUT', 'PATCH'].includes(props.endpoint.method)) {
    activeTab.value = 'body'
  }
}, { immediate: true })

// Add/Remove functions
const addParam = () => {
  editableParams.value.push({
    field: '',
    type: 'String',
    description: '',
    required: false,
    enabled: true
  })
}

const removeParam = (index) => {
  const param = editableParams.value[index]
  if (param.field && formData.parameters[param.field]) {
    delete formData.parameters[param.field]
  }
  editableParams.value.splice(index, 1)
}

const addHeader = () => {
  editableHeaders.value.push({
    field: '',
    type: 'String',
    description: '',
    required: false,
    enabled: true
  })
}

const removeHeader = (index) => {
  const header = editableHeaders.value[index]
  if (header.field && formData.headers[header.field]) {
    delete formData.headers[header.field]
  }
  editableHeaders.value.splice(index, 1)
}

const getInputType = (type) => {
  const typeMap = {
    'Number': 'number',
    'Boolean': 'checkbox',
    'Email': 'email'
  }
  return typeMap[type] || 'text'
}

const buildUrl = () => {
  const baseUrl = docsStore.meta?.sampleUrl || docsStore.meta?.url || 'https://api.example.com'
  let url = props.endpoint.url

  // Replace path parameters
  Object.entries(formData.parameters).forEach(([key, value]) => {
    if (value) {
      url = url.replace(`:${key}`, value)
      url = url.replace(`{${key}}`, value)
    }
  })

  // Add query parameters
  const queryParams = Object.entries(formData.parameters)
    .filter(([key, value]) => value && !url.includes(`:${key}`) && !url.includes(`{${key}}`))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)

  if (queryParams.length > 0) {
    url += (url.includes('?') ? '&' : '?') + queryParams.join('&')
  }

  return baseUrl + url
}

const sendRequest = async () => {
  loading.value = true
  error.value = null
  response.value = null

  try {
    const url = buildUrl()

    // Only include enabled headers
    const enabledHeaders = {}
    editableHeaders.value.forEach(header => {
      if (header.enabled && header.field && formData.headers[header.field]) {
        enabledHeaders[header.field] = formData.headers[header.field]
      }
    })

    const options = {
      method: props.endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        ...enabledHeaders
      }
    }

    if (['POST', 'PUT', 'PATCH'].includes(props.endpoint.method) && formData.body) {
      try {
        options.body = JSON.stringify(JSON.parse(formData.body))
      } catch (e) {
        options.body = formData.body
      }
    }

    const res = await fetch(url, options)
    const contentType = res.headers.get('content-type')
    let data

    if (contentType?.includes('application/json')) {
      data = await res.json()
    } else {
      data = await res.text()
    }

    response.value = {
      status: res.status,
      statusText: res.statusText,
      data
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const clearForm = () => {
  formData.headers = {}
  formData.parameters = {}
  formData.body = ''
  response.value = null
  error.value = null
}

const formatResponse = (data) => {
  if (typeof data === 'string') {
    try {
      return JSON.stringify(JSON.parse(data), null, 2)
    } catch (e) {
      return data
    }
  }
  return JSON.stringify(data, null, 2)
}

const copyResponse = async () => {
  try {
    await navigator.clipboard.writeText(formatResponse(response.value.data))
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const getStatusClass = (status) => {
  if (status >= 200 && status < 300) {
    return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
  } else if (status >= 400 && status < 500) {
    return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
  } else if (status >= 500) {
    return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
  }
  return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 2000px;
  opacity: 1;
}
</style>