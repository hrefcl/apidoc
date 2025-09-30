<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[10vh]"
        @click.self="close"
      >
        <div class="bg-card border border-border rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
          <!-- Search Input -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search class="w-5 h-5 text-muted-foreground" />
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Buscar en la documentación..."
              class="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              @keydown.esc="close"
              @keydown.down.prevent="selectNext"
              @keydown.up.prevent="selectPrevious"
              @keydown.enter="navigateToSelected"
            >
            <kbd class="px-2 py-1 text-xs bg-muted rounded text-muted-foreground">ESC</kbd>
          </div>

          <!-- Results -->
          <div class="max-h-96 overflow-y-auto">
            <div v-if="searchQuery && filteredResults.length === 0" class="p-8 text-center text-muted-foreground">
              <FileQuestion class="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No se encontraron resultados para "{{ searchQuery }}"</p>
            </div>

            <div v-else-if="filteredResults.length > 0" class="py-2">
              <div
                v-for="(result, index) in filteredResults"
                :key="result.path"
                @click="navigateTo(result.path)"
                @mouseenter="selectedIndex = index"
                :class="[
                  'px-4 py-3 cursor-pointer transition-colors flex items-center gap-3',
                  selectedIndex === index
                    ? 'bg-primary-100 dark:bg-primary-900'
                    : 'hover:bg-muted'
                ]"
              >
                <component :is="getIcon(result.icon)" class="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-foreground truncate">{{ result.title }}</div>
                  <div class="text-sm text-muted-foreground truncate">{{ result.category }}</div>
                </div>
                <ArrowRight class="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </div>

            <div v-else class="p-8 text-center text-muted-foreground">
              <p>Escribe para buscar en la documentación</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-background rounded">↑</kbd>
                <kbd class="px-1.5 py-0.5 bg-background rounded">↓</kbd>
                Navegar
              </span>
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-background rounded">↵</kbd>
                Seleccionar
              </span>
            </div>
            <div>{{ filteredResults.length }} resultado{{ filteredResults.length !== 1 ? 's' : '' }}</div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useDocsStore } from '@/stores/docs'
import { Search, ArrowRight, FileQuestion, FileText, Plug, BookOpen, Code, User, Users, Building, Settings, MapPin, Tags, Folder } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const docsStore = useDocsStore()

const searchQuery = ref('')
const selectedIndex = ref(0)
const searchInput = ref(null)

// Watch para focus cuando se abre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      searchInput.value?.focus()
    })
    selectedIndex.value = 0
    searchQuery.value = ''
  }
})

// Obtener todos los documentos de la navegación
const allDocuments = computed(() => {
  const docs = []
  const nav = docsStore.getSidebarNav || []

  nav.forEach(section => {
    section.items?.forEach(item => {
      docs.push({
        title: item.title,
        path: item.path,
        category: section.title,
        icon: item.icon || section.icon || 'file-text'
      })
    })
  })

  return docs
})

// Filtrar resultados
const filteredResults = computed(() => {
  if (!searchQuery.value) return []

  const query = searchQuery.value.toLowerCase()
  return allDocuments.value.filter(doc => {
    return doc.title.toLowerCase().includes(query) ||
           doc.category.toLowerCase().includes(query)
  }).slice(0, 10) // Limitar a 10 resultados
})

const selectNext = () => {
  if (selectedIndex.value < filteredResults.value.length - 1) {
    selectedIndex.value++
  }
}

const selectPrevious = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
  }
}

const navigateToSelected = () => {
  if (filteredResults.value[selectedIndex.value]) {
    navigateTo(filteredResults.value[selectedIndex.value].path)
  }
}

const navigateTo = (path) => {
  router.push(path)
  close()
}

const close = () => {
  emit('close')
}

const getIcon = (iconName) => {
  const icons = {
    'plug': Plug,
    'Plug': Plug,
    'book-open': BookOpen,
    'BookOpen': BookOpen,
    'code': Code,
    'Code': Code,
    'file-text': FileText,
    'FileText': FileText,
    'user': User,
    'User': User,
    'users': Users,
    'Users': Users,
    'building': Building,
    'Building': Building,
    'settings': Settings,
    'Settings': Settings,
    'map-pin': MapPin,
    'MapPin': MapPin,
    'tags': Tags,
    'Tags': Tags,
    'folder': Folder,
    'Folder': Folder
  }
  return icons[iconName] || FileText
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
