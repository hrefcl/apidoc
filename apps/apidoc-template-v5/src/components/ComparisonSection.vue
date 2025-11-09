<template>
  <div v-if="items.length > 0 || otherItems.length > 0" class="comparison-section">
    <h4 class="text-sm font-semibold mb-3">{{ title }}</h4>
    <div class="space-y-2">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="[
          'p-3 rounded-lg border',
          getItemStatus(item) === 'added' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
          getItemStatus(item) === 'removed' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
          getItemStatus(item) === 'modified' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
          'bg-card border-border'
        ]"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <code class="text-sm font-mono">{{ item.field }}</code>
              <span v-if="item.optional === false" class="text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                {{ t('common.required') }}
              </span>
              <span v-else class="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
                {{ t('common.optional') }}
              </span>
            </div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs px-2 py-0.5 bg-muted rounded font-mono">{{ item.type }}</span>
              <span v-if="item.defaultValue" class="text-xs text-muted-foreground">
                {{ t('common.default') }}: <code class="text-xs">{{ item.defaultValue }}</code>
              </span>
            </div>
            <div v-if="item.description" v-html="item.description" class="text-xs text-muted-foreground mt-1"></div>
          </div>
          <div class="flex-shrink-0">
            <Plus v-if="getItemStatus(item) === 'added'" class="w-4 h-4 text-green-600" />
            <Minus v-if="getItemStatus(item) === 'removed'" class="w-4 h-4 text-red-600" />
            <ArrowLeftRight v-if="getItemStatus(item) === 'modified'" class="w-4 h-4 text-yellow-600" />
          </div>
        </div>
      </div>

      <!-- Show removed items that exist in other version but not in this one -->
      <div
        v-for="(item, index) in removedItems"
        :key="`removed-${index}`"
        class="p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 opacity-60"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <code class="text-sm font-mono line-through">{{ item.field }}</code>
            </div>
            <div class="text-xs text-muted-foreground">{{ t('api.removedInVersion') }}</div>
          </div>
          <Minus class="w-4 h-4 text-red-600" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Plus, Minus, ArrowLeftRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  otherItems: {
    type: Array,
    default: () => []
  }
})

// Find items that exist in otherItems but not in items (removed)
const removedItems = computed(() => {
  return props.otherItems.filter(otherItem => {
    return !props.items.some(item => item.field === otherItem.field)
  })
})

// Determine if item is added, removed, or modified
const getItemStatus = (item) => {
  const otherItem = props.otherItems.find(i => i.field === item.field)

  if (!otherItem) {
    return 'added'
  }

  // Check if any properties are different
  const isDifferent =
    otherItem.type !== item.type ||
    otherItem.optional !== item.optional ||
    otherItem.defaultValue !== item.defaultValue ||
    otherItem.description !== item.description

  return isDifferent ? 'modified' : 'unchanged'
}
</script>

<style scoped>
.comparison-section :deep(p) {
  margin: 0;
}

.comparison-section :deep(code) {
  font-size: 0.75rem;
  background-color: hsl(var(--muted));
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}
</style>