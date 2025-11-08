<template>
  <div class="code-tabs-container">
    <!-- Tabs Header -->
    <div class="flex items-center gap-2 border-b border-border bg-muted/50 rounded-t-lg overflow-hidden">
      <button
        v-for="(example, index) in examples"
        :key="index"
        @click="activeTab = index"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors relative',
          activeTab === index
            ? 'text-primary-600 dark:text-primary-400 bg-background'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        ]"
      >
        {{ getTabLabel(example.type || example.title) }}
        <div
          v-if="activeTab === index"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
        ></div>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="relative">
      <div
        v-for="(example, index) in examples"
        :key="index"
        v-show="activeTab === index"
        class="code-content"
      >
        <div class="absolute top-3 right-3 z-10">
          <button
            @click="copyCode(example.content)"
            class="p-2 rounded-lg bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            :title="copied ? t('common.copied') : t('common.copy')"
          >
            <Check v-if="copied" class="w-4 h-4 text-green-600" />
            <Copy v-else class="w-4 h-4" />
          </button>
        </div>
        <pre class="!mt-0 !rounded-t-none"><code>{{ example.content }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Copy, Check } from 'lucide-vue-next'

const { t } = useI18n()

const props = defineProps({
  examples: {
    type: Array,
    required: true
  }
})

const activeTab = ref(0)
const copied = ref(false)

const getTabLabel = (type) => {
  const labels = {
    'curl': 'cURL',
    'bash': 'Bash',
    'sh': 'Shell',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'go': 'Go',
    'php': 'PHP',
    'ruby': 'Ruby',
    'rust': 'Rust',
    'request': 'Request',
    'response': 'Response'
  }
  return labels[type?.toLowerCase()] || type || 'Example'
}

const copyCode = async (content) => {
  try {
    await navigator.clipboard.writeText(content)
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
.code-tabs-container {
  @apply rounded-lg overflow-hidden border border-border my-4;
}

.code-content {
  @apply relative;
}

.code-content pre {
  @apply m-0 rounded-none;
  background-color: hsl(var(--muted) / 0.3);
}

.code-content code {
  @apply text-sm;
}
</style>