<template>
  <div v-if="(fields && fields.length > 0) || example || statusCode" class="response-table my-6">
    <div class="flex items-center gap-3 mb-3">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <span
        v-if="statusCode"
        :class="[
          'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
          getStatusClass(statusCode)
        ]"
      >
        {{ statusCode }}
      </span>
    </div>

    <!-- Fields Table (if exists) -->
    <div v-if="fields && fields.length > 0" class="overflow-x-auto rounded-lg border border-border">
      <table class="w-full">
        <thead class="bg-muted/50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('common.name') }}</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('common.type') }}</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">{{ t('api.description') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="(field, index) in fields" :key="index" class="hover:bg-muted/30 transition-colors">
            <td class="px-4 py-3">
              <code class="text-sm font-mono text-primary-600 dark:text-primary-400">{{ field.field }}</code>
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                {{ field.type }}
              </span>
              <div v-if="field.size" class="text-xs text-muted-foreground mt-1">
                {{ field.size }}
              </div>
            </td>
            <td class="px-4 py-3 text-sm" v-html="field.description"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Example Response -->
    <div v-if="example" :class="fields && fields.length > 0 ? 'mt-4' : ''">
      <h4 class="text-sm font-semibold mb-2">{{ t('api.examples') }}</h4>
      <div class="relative">
        <button
          @click="copyExample"
          class="absolute top-3 right-3 z-10 p-2 rounded-lg bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          :title="copied ? t('common.copied') : t('common.copy')"
        >
          <Check v-if="copied" class="w-4 h-4 text-green-600" />
          <Copy v-else class="w-4 h-4" />
        </button>
        <pre class="!mt-0 rounded-lg border border-border overflow-x-auto" style="background-color: hsl(var(--muted) / 0.3);"><code>{{ formatExample(example) }}</code></pre>
      </div>
    </div>

    <!-- No data message -->
    <div v-if="!fields || fields.length === 0 && !example" class="text-sm text-muted-foreground italic p-4 bg-muted/20 rounded-lg border border-border">
      {{ t('common.noContent') }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Copy, Check } from 'lucide-vue-next'

const { t } = useI18n()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  fields: {
    type: Array,
    default: () => []
  },
  example: {
    type: [String, Object],
    default: null
  },
  statusCode: {
    type: [String, Number],
    default: null
  }
})

const copied = ref(false)

const getStatusClass = (code) => {
  const codeNum = parseInt(code)
  if (codeNum >= 200 && codeNum < 300) {
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
  } else if (codeNum >= 400 && codeNum < 500) {
    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
  } else if (codeNum >= 500) {
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  }
  return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
}

const formatExample = (example) => {
  if (typeof example === 'string') {
    try {
      const parsed = JSON.parse(example)
      return JSON.stringify(parsed, null, 2)
    } catch (e) {
      return example
    }
  }
  return JSON.stringify(example, null, 2)
}

const copyExample = async () => {
  try {
    const text = formatExample(props.example)
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.response-table table {
  @apply text-foreground;
}

.response-table th {
  @apply text-foreground;
}

.response-table td {
  @apply text-foreground;
}

.response-table pre {
  @apply p-4;
  background-color: hsl(var(--muted) / 0.3);
}

.response-table code {
  @apply text-sm;
}
</style>