<template>
  <div v-if="parameters && parameters.length > 0" class="parameters-table my-6">
    <h3 class="text-lg font-semibold mb-3">{{ title || t('api.parameters') }}</h3>
    <div class="overflow-x-auto rounded-lg border border-border">
      <table class="w-full">
        <thead class="bg-muted/50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('common.name') }}</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('common.type') }}</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('api.description') }}</th>
            <th class="px-4 py-3 text-center text-sm font-semibold w-24">{{ t('common.required') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="(param, index) in parameters" :key="index" class="hover:bg-muted/30 transition-colors">
            <td class="px-4 py-3">
              <code class="text-sm font-mono text-primary-600 dark:text-primary-400">{{ param.field }}</code>
              <div v-if="param.defaultValue" class="text-xs text-muted-foreground mt-1">
                {{ t('common.default') }}: <code class="text-xs">{{ param.defaultValue }}</code>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                {{ param.type }}
              </span>
              <div v-if="param.size" class="text-xs text-muted-foreground mt-1">
                {{ param.size }}
              </div>
            </td>
            <td class="px-4 py-3 text-sm" v-html="param.description"></td>
            <td class="px-4 py-3 text-center">
              <span
                v-if="param.optional === false"
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
              >
                {{ t('common.required') }}
              </span>
              <span
                v-else
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                {{ t('common.optional') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  parameters: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
.parameters-table table {
  @apply text-foreground;
}

.parameters-table th {
  @apply text-foreground;
}

.parameters-table td {
  @apply text-foreground;
}
</style>