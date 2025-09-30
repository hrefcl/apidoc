<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
    <div class="bg-background border border-border rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-border">
        <div class="flex items-center gap-3">
          <GitCompare class="w-6 h-6 text-primary-600" />
          <h2 class="text-2xl font-bold">{{ t('api.compareVersions', 'Comparar versiones') }}</h2>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Version Selectors -->
      <div class="p-6 border-b border-border bg-muted/30">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('api.version') }} 1</label>
            <select
              v-model="selectedVersion1"
              class="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option v-for="v in sortedVersions" :key="v.version" :value="v.version">
                v{{ v.version }} {{ v.isLatest ? `(${t('api.latest', 'Latest')})` : '' }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('api.version') }} 2</label>
            <select
              v-model="selectedVersion2"
              class="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option v-for="v in sortedVersions" :key="v.version" :value="v.version">
                v{{ v.version }} {{ v.isLatest ? `(${t('api.latest', 'Latest')})` : '' }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Comparison Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="version1Data && version2Data" class="grid grid-cols-2 gap-6">
          <!-- Version 1 -->
          <div class="space-y-6">
            <div class="sticky top-0 bg-background pb-2 border-b border-border">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm">
                  v{{ version1Data.version }}
                </span>
                {{ version1Data.title }}
              </h3>
            </div>

            <!-- Basic Info -->
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span :class="getMethodClass(version1Data.method)" class="px-2 py-1 rounded text-xs font-mono font-bold">
                  {{ version1Data.method }}
                </span>
                <code class="text-sm">{{ version1Data.url }}</code>
              </div>
              <div v-if="version1Data.description" v-html="version1Data.description" class="text-sm text-muted-foreground"></div>
            </div>

            <!-- Parameters -->
            <ComparisonSection
              :title="t('api.parameters')"
              :items="getParameters(version1Data)"
              :otherItems="getParameters(version2Data)"
            />

            <!-- Headers -->
            <ComparisonSection
              :title="t('api.headers')"
              :items="getHeaders(version1Data)"
              :otherItems="getHeaders(version2Data)"
            />

            <!-- Success Response -->
            <ComparisonSection
              v-if="version1Data.success"
              :title="t('api.success')"
              :items="getSuccessFields(version1Data.success)"
              :otherItems="getSuccessFields(version2Data.success)"
            />

            <!-- Error Response -->
            <ComparisonSection
              v-if="version1Data.error"
              :title="t('api.error')"
              :items="getErrorFields(version1Data.error)"
              :otherItems="getErrorFields(version2Data.error)"
            />
          </div>

          <!-- Version 2 -->
          <div class="space-y-6">
            <div class="sticky top-0 bg-background pb-2 border-b border-border">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-sm">
                  v{{ version2Data.version }}
                </span>
                {{ version2Data.title }}
              </h3>
            </div>

            <!-- Basic Info -->
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span :class="getMethodClass(version2Data.method)" class="px-2 py-1 rounded text-xs font-mono font-bold">
                  {{ version2Data.method }}
                </span>
                <code class="text-sm">{{ version2Data.url }}</code>
              </div>
              <div v-if="version2Data.description" v-html="version2Data.description" class="text-sm text-muted-foreground"></div>
            </div>

            <!-- Parameters -->
            <ComparisonSection
              :title="t('api.parameters')"
              :items="getParameters(version2Data)"
              :otherItems="getParameters(version1Data)"
            />

            <!-- Headers -->
            <ComparisonSection
              :title="t('api.headers')"
              :items="getHeaders(version2Data)"
              :otherItems="getHeaders(version1Data)"
            />

            <!-- Success Response -->
            <ComparisonSection
              v-if="version2Data.success"
              :title="t('api.success')"
              :items="getSuccessFields(version2Data.success)"
              :otherItems="getSuccessFields(version1Data.success)"
            />

            <!-- Error Response -->
            <ComparisonSection
              v-if="version2Data.error"
              :title="t('api.error')"
              :items="getErrorFields(version2Data.error)"
              :otherItems="getErrorFields(version1Data.error)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { GitCompare, X } from 'lucide-vue-next'
import ComparisonSection from './ComparisonSection.vue'

const { t } = useI18n()

const props = defineProps({
  versions: {
    type: Array,
    required: true
  }
})

defineEmits(['close'])

// Sort versions descending (latest first)
const sortedVersions = computed(() => {
  return [...props.versions].sort((a, b) => {
    const aParts = a.version.split('.').map(Number)
    const bParts = b.version.split('.').map(Number)
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aNum = aParts[i] || 0
      const bNum = bParts[i] || 0
      if (aNum !== bNum) return bNum - aNum
    }
    return 0
  })
})

// Default to latest two versions
const selectedVersion1 = ref(sortedVersions.value[0]?.version || '')
const selectedVersion2 = ref(sortedVersions.value[1]?.version || sortedVersions.value[0]?.version || '')

const version1Data = computed(() => {
  return props.versions.find(v => v.version === selectedVersion1.value)
})

const version2Data = computed(() => {
  return props.versions.find(v => v.version === selectedVersion2.value)
})

// Helper functions
const getParameters = (versionData) => {
  if (!versionData) return []
  if (versionData.parameter?.fields?.Parameter) {
    return versionData.parameter.fields.Parameter
  }
  return versionData.parameters || []
}

const getHeaders = (versionData) => {
  if (!versionData) return []
  if (versionData.header?.fields?.Header) {
    return versionData.header.fields.Header
  }
  return versionData.headers || []
}

const getSuccessFields = (success) => {
  if (!success || !success.fields) return []
  const firstKey = Object.keys(success.fields)[0]
  return success.fields[firstKey] || []
}

const getErrorFields = (error) => {
  if (!error || !error.fields) return []
  const firstKey = Object.keys(error.fields)[0]
  return error.fields[firstKey] || []
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
</script>

<style scoped>
/* Custom scrollbar for comparison content */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--muted)) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted));
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--muted-foreground));
}
</style>