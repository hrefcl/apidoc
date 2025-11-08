<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-4">
        <component :is="categoryIcon" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {{ categoryTitle }}
        </h1>
      </div>
      <p class="text-lg text-muted-foreground">{{ categoryDescription }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- Content Grid -->
    <div v-else-if="items.length > 0">
      <!-- Section with subgroups (like API) -->
      <div v-if="hasSubgroups" class="space-y-8">
        <div v-for="subgroup in subgroups" :key="subgroup.title" class="space-y-4">
          <div class="flex items-center gap-2 border-b border-border pb-2">
            <component :is="getIcon(subgroup.icon)" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 class="text-2xl font-semibold">{{ subgroup.title }}</h2>
            <span class="text-sm text-muted-foreground ml-2">({{ subgroup.items.length }})</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <router-link
              v-for="item in subgroup.items"
              :key="item.path"
              :to="item.path"
              class="group bg-card border border-border rounded-lg p-4 hover:border-primary-500 hover:shadow-lg transition-all"
            >
              <div class="flex items-start gap-3">
                <component :is="getIcon(item.icon)" class="w-5 h-5 text-muted-foreground group-hover:text-primary-600 transition-colors flex-shrink-0 mt-0.5" />
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-foreground group-hover:text-primary-600 transition-colors truncate">
                    {{ item.title }}
                  </h3>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Section without subgroups (direct items) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
          v-for="item in items"
          :key="item.path"
          :to="item.path"
          class="group bg-card border border-border rounded-lg p-5 hover:border-primary-500 hover:shadow-lg transition-all"
        >
          <div class="flex items-start gap-3">
            <component :is="getIcon(item.icon)" class="w-6 h-6 text-muted-foreground group-hover:text-primary-600 transition-colors flex-shrink-0 mt-0.5" />
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-medium text-foreground group-hover:text-primary-600 transition-colors">
                {{ item.title }}
              </h3>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <FileQuestion class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 class="text-lg font-semibold mb-2">No hay contenido disponible</h3>
      <p class="text-muted-foreground mb-6">Esta sección aún no tiene documentos.</p>
      <router-link to="/" class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
        <Home class="w-4 h-4" />
        Volver al inicio
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDocsStore } from '@/stores/docs'
import { useI18n } from 'vue-i18n'
import {
  BookOpen, Plug, Code, Users, FileQuestion, Home,
  FileText, User, Building, Settings, MapPin, Tags, Folder
} from 'lucide-vue-next'

const { t } = useI18n()

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const docsStore = useDocsStore()
const loading = ref(true)

// Category metadata
const categoryMetadata = {
  docs: {
    title: 'Documentación',
    description: 'Documentación general y guías del proyecto',
    icon: BookOpen
  },
  api: {
    title: 'API Reference',
    description: 'Referencia completa de todos los endpoints de la API',
    icon: Plug
  },
  tsdoc: {
    title: 'TypeScript Documentation',
    description: 'Documentación de tipos, interfaces y módulos TypeScript',
    icon: Code
  },
  model: {
    title: 'Models',
    description: 'Modelos de datos y esquemas de base de datos',
    icon: Users
  }
}

const categoryTitle = computed(() => categoryMetadata[props.category]?.title || 'Documentación')
const categoryDescription = computed(() => categoryMetadata[props.category]?.description || '')
const categoryIcon = computed(() => categoryMetadata[props.category]?.icon || BookOpen)

// Get section data
const sectionData = computed(() => {
  const sectionTitles = {
    'docs': 'Documentación',
    'api': 'API Reference',
    'tsdoc': 'TypeScript Docs',
    'model': 'Models'
  }

  return docsStore.getSidebarNav.find(s => s.title === sectionTitles[props.category])
})

const hasSubgroups = computed(() => {
  return sectionData.value?.subgroups && sectionData.value.subgroups.length > 0
})

const subgroups = computed(() => {
  return sectionData.value?.subgroups || []
})

const items = computed(() => {
  if (hasSubgroups.value) {
    // Flatten all items from subgroups
    return subgroups.value.flatMap(subgroup => subgroup.items)
  }
  return sectionData.value?.items || []
})

const getIcon = (iconName) => {
  const icons = {
    'plug': Plug,
    'book-open': BookOpen,
    'code': Code,
    'users': Users,
    'user': User,
    'building': Building,
    'settings': Settings,
    'map-pin': MapPin,
    'tags': Tags,
    'folder': Folder,
    'file-text': FileText,
    'User': User,
    'Users': Users,
    'Building': Building,
    'Settings': Settings,
    'MapPin': MapPin,
    'Tags': Tags,
    'Folder': Folder,
    'FileText': FileText,
    'Code': Code,
    'BookOpen': BookOpen,
    'Plug': Plug
  }
  return icons[iconName] || FileText
}

onMounted(async () => {
  loading.value = true
  if (!docsStore.navigation) {
    await docsStore.loadDocs()
  }
  loading.value = false
})
</script>
