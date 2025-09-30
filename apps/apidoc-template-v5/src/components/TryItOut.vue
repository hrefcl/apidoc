<template>
  <div class="try-it-out my-6 border border-border rounded-lg overflow-hidden">
    <div class="bg-muted/50 px-6 py-3 border-b border-border flex items-center justify-between">
      <h4 class="text-lg font-semibold">{{ t('api.tryIt') }}</h4>
      <button
        @click="isExpanded = !isExpanded"
        class="p-2 hover:bg-muted rounded transition-colors"
      >
        <ChevronDown :class="['w-4 h-4 transition-transform', isExpanded ? 'rotate-180' : '']" />
      </button>
    </div>

    <Transition name="expand">
      <div v-if="isExpanded" class="p-6 space-y-4">
        <!-- Headers -->
        <div v-if="endpoint.header?.fields?.Header && endpoint.header.fields.Header.length > 0">
          <h5 class="text-sm font-semibold mb-2">{{ t('api.headers') }}</h5>
          <div class="space-y-2">
            <div v-for="(header, index) in endpoint.header.fields.Header" :key="index" class="flex gap-2">
              <input
                v-model="formData.headers[header.field]"
                type="text"
                :placeholder="header.field"
                class="flex-1 px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span class="text-xs text-muted-foreground self-center whitespace-nowrap">{{ header.type }}</span>
            </div>
          </div>
        </div>

        <!-- Parameters -->
        <div v-if="endpoint.parameter?.fields?.Parameter && endpoint.parameter.fields.Parameter.length > 0">
          <h5 class="text-sm font-semibold mb-2">{{ t('api.parameters') }}</h5>
          <div class="space-y-2">
            <div v-for="(param, index) in endpoint.parameter.fields.Parameter" :key="index" class="flex gap-2">
              <input
                v-model="formData.parameters[param.field]"
                :type="getInputType(param.type)"
                :placeholder="`${param.field} ${param.optional === false ? '*' : ''}`"
                :required="param.optional === false"
                class="flex-1 px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span class="text-xs text-muted-foreground self-center whitespace-nowrap">{{ param.type }}</span>
            </div>
          </div>
        </div>

        <!-- Body (for POST/PUT/PATCH) -->
        <div v-if="['POST', 'PUT', 'PATCH'].includes(endpoint.method)">
          <h5 class="text-sm font-semibold mb-2">{{ t('api.body') }}</h5>
          <textarea
            v-model="formData.body"
            rows="6"
            placeholder='{"key": "value"}'
            class="w-full px-3 py-2 bg-background border border-border rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 pt-2">
          <button
            @click="sendRequest"
            :disabled="loading"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded transition-colors flex items-center gap-2"
          >
            <Send class="w-4 h-4" />
            <span>{{ loading ? t('common.loading') : 'Send' }}</span>
          </button>
          <button
            @click="clearForm"
            class="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded transition-colors"
          >
            Clear
          </button>
        </div>

        <!-- Response -->
        <div v-if="response" class="mt-6">
          <div class="flex items-center justify-between mb-2">
            <h5 class="text-sm font-semibold flex items-center gap-2">
              {{ t('api.response') }}
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  getStatusClass(response.status)
                ]"
              >
                {{ response.status }} {{ response.statusText }}
              </span>
            </h5>
            <button
              @click="copyResponse"
              class="p-2 rounded hover:bg-muted transition-colors"
              :title="copied ? t('common.copied') : t('common.copy')"
            >
              <Check v-if="copied" class="w-4 h-4 text-green-600" />
              <Copy v-else class="w-4 h-4" />
            </button>
          </div>
          <pre class="border border-border rounded-lg p-4 overflow-x-auto text-sm" style="background-color: hsl(var(--muted) / 0.3);"><code>{{ formatResponse(response.data) }}</code></pre>
        </div>

        <!-- Error -->
        <div v-if="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown, Send, Copy, Check } from 'lucide-vue-next'

const { t } = useI18n()

const props = defineProps({
  endpoint: {
    type: Object,
    required: true
  }
})

const isExpanded = ref(false)
const loading = ref(false)
const response = ref(null)
const error = ref(null)
const copied = ref(false)

const formData = reactive({
  headers: {},
  parameters: {},
  body: ''
})

const getInputType = (type) => {
  const typeMap = {
    'Number': 'number',
    'Boolean': 'checkbox',
    'Email': 'email'
  }
  return typeMap[type] || 'text'
}

const buildUrl = () => {
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

  return url
}

const sendRequest = async () => {
  loading.value = true
  error.value = null
  response.value = null

  try {
    const url = buildUrl()
    const options = {
      method: props.endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        ...formData.headers
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
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
  } else if (status >= 400 && status < 500) {
    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
  } else if (status >= 500) {
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  }
  return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
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