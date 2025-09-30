<template>
  <div class="toc-sidebar sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto">
    <!-- Version Selector para endpoints con múltiples versiones -->
    <div v-if="hasMultipleVersions" class="mb-6 p-4 border border-border rounded-lg bg-card">
      <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
        <GitBranch class="w-4 h-4" />
        {{ t('api.versions') }}
      </h3>
      <div class="space-y-2">
        <button
          v-for="version in versions"
          :key="version"
          @click="$emit('select-version', version)"
          :class="[
            'w-full px-3 py-2 rounded text-sm text-left transition-colors flex items-center justify-between',
            selectedVersion === version
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
              : 'hover:bg-muted text-foreground'
          ]"
        >
          <span>v{{ version }}</span>
          <Check v-if="selectedVersion === version" class="w-4 h-4" />
        </button>
      </div>

      <!-- Comparar versiones -->
      <div v-if="versions.length > 1" class="mt-4 pt-4 border-t border-border">
        <button
          @click="$emit('compare-versions')"
          class="w-full px-3 py-2 bg-muted hover:bg-muted/80 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <GitCompare class="w-4 h-4" />
          {{ t('api.compareVersions', 'Comparar versiones') }}
        </button>
      </div>
    </div>

    <!-- Table of Contents -->
    <div class="space-y-1">
      <h3 class="text-sm font-semibold mb-3 px-2">{{ t('common.tableOfContents', 'Contenido') }}</h3>
      <nav class="space-y-1">
        <a
          v-for="section in sections"
          :key="section.id"
          :href="`#${section.id}`"
          @click.prevent="scrollToSection(section.id)"
          :class="[
            'block px-2 py-1.5 text-sm rounded transition-colors',
            activeSection === section.id
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          ]"
        >
          {{ section.title }}
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check, GitBranch, GitCompare } from 'lucide-vue-next'

const { t } = useI18n()

const props = defineProps({
  versions: {
    type: Array,
    default: () => []
  },
  selectedVersion: {
    type: String,
    default: null
  },
  sections: {
    type: Array,
    default: () => []
  }
})

defineEmits(['select-version', 'compare-versions'])

const activeSection = ref('')

const hasMultipleVersions = computed(() => props.versions.length > 1)

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100 // Offset for sticky header
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// Observar qué sección está visible
let observer = null

onMounted(() => {
  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -80% 0px',
    threshold: 0
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, observerOptions)

  // Observar todas las secciones
  props.sections.forEach((section) => {
    const element = document.getElementById(section.id)
    if (element) {
      observer.observe(element)
    }
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.toc-sidebar {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--muted)) transparent;
}

.toc-sidebar::-webkit-scrollbar {
  width: 6px;
}

.toc-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.toc-sidebar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted));
  border-radius: 3px;
}

.toc-sidebar::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--muted-foreground));
}
</style>