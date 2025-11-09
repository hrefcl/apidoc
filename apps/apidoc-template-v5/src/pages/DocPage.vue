<template>
  <div class="flex gap-8">
    <!-- Main Content -->
    <div class="flex-1 min-w-0 max-w-4xl">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">Error al cargar documento</h3>
        <p class="text-red-700 dark:text-red-300">{{ error }}</p>
      </div>

      <!-- Document Content -->
      <article v-else-if="doc" class="prose prose-lg">
        <!-- Breadcrumbs -->
        <div class="flex items-center gap-2 text-sm text-muted-foreground mb-6 not-prose">
          <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <router-link
              v-if="crumb.path"
              :to="crumb.path"
              class="hover:text-foreground transition-colors"
            >
              {{ crumb.label }}
            </router-link>
            <span v-else class="text-foreground font-medium">{{ crumb.label }}</span>
            <ChevronRight v-if="index < breadcrumbs.length - 1" class="w-4 h-4" />
          </template>
        </div>

        <!-- Title -->
        <h1 class="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{{ pageTitle }}</h1>

        <!-- Metadata -->
        <div v-if="doc.version || doc.description" class="flex flex-wrap gap-4 mb-8 not-prose">
          <div v-if="doc.version" class="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 rounded-full text-sm">
            <span class="font-medium text-primary-700 dark:text-primary-300">v{{ doc.version }}</span>
          </div>
          <div v-if="doc.description" class="text-muted-foreground">
            {{ doc.description }}
          </div>
        </div>

        <!-- API Content -->
        <div v-if="isApiDoc">
          <ApiContent
            :data="doc"
            :externalSelectedVersion="tocSelectedVersion"
            @sections-ready="handleSectionsReady"
            @versions-ready="handleVersionsReady"
          />
        </div>

        <!-- TSDoc Content -->
        <div v-else-if="isTSDocContent">
          <TSDocContent :data="doc" />
        </div>

        <!-- Model Content -->
        <div v-else-if="isModelContent">
          <ModelContent :data="doc" />
        </div>

        <!-- Generic Content -->
        <div v-else>
          <GenericContent :data="doc" />
        </div>

        <!-- Footer Navigation -->
        <div class="flex items-center justify-between pt-8 mt-12 border-t border-border not-prose">
          <router-link v-if="prevDoc" :to="prevDoc.path" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <ChevronLeft class="w-4 h-4" />
            <div>
              <div class="text-xs text-muted-foreground">Anterior</div>
              <div class="font-medium">{{ prevDoc.title }}</div>
            </div>
          </router-link>
          <div v-else></div>

          <router-link v-if="nextDoc" :to="nextDoc.path" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <div class="text-right">
              <div class="text-xs text-muted-foreground">Siguiente</div>
              <div class="font-medium">{{ nextDoc.title }}</div>
            </div>
            <ChevronRight class="w-4 h-4" />
          </router-link>
        </div>
      </article>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <FileQuestion class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 class="text-lg font-semibold mb-2">Documento no encontrado</h3>
        <p class="text-muted-foreground mb-6">El documento que buscas no existe o ha sido movido.</p>
        <router-link to="/" class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Home class="w-4 h-4" />
          Volver al inicio
        </router-link>
      </div>
    </div>

    <!-- Right Sidebar -->
    <div v-if="isApiDoc && doc" class="w-64 flex-shrink-0 space-y-6">
      <!-- Version & Language Selector -->
      <VersionSelector
        v-if="tocVersions && tocVersions.length > 0"
        :versions="tocVersions"
        :currentVersion="tocSelectedVersion"
        :currentLanguage="docsStore.currentLanguage"
        @version-change="handleVersionSelect"
        @language-change="handleLanguageChange"
        @compare="handleCompareVersions"
      />

      <!-- Table of Contents -->
      <TableOfContents
        v-if="tocSections.length > 0"
        :sections="tocSections"
        :versions="tocVersionStrings"
        :selectedVersion="tocSelectedVersion"
        @select-version="handleVersionSelect"
        @compare-versions="handleCompareVersions"
      />
    </div>
  </div>

  <!-- Version Comparator Modal -->
  <VersionComparator
    v-if="showVersionComparator"
    :versions="allVersionsData"
    @close="closeVersionComparator"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDocsStore } from '@/stores/docs'
import { ChevronRight, ChevronLeft, FileQuestion, Home } from 'lucide-vue-next'
import ApiContent from '@/components/ApiContent.vue'
import GenericContent from '@/components/GenericContent.vue'
import TSDocContent from '@/components/TSDocContent.vue'
import ModelContent from '@/components/ModelContent.vue'
import TableOfContents from '@/components/TableOfContents.vue'
import VersionComparator from '@/components/VersionComparator.vue'
import VersionSelector from '@/components/VersionSelector.vue'

const route = useRoute()
const docsStore = useDocsStore()
const { t } = useI18n()

const props = defineProps({
  category: String,
  doc: String
})

const doc = ref(null)
const loading = ref(false)
const error = ref(null)

// TOC state
const tocSections = ref([])
const tocVersions = ref([])  // Array of version OBJECTS for VersionSelector
const tocVersionStrings = ref([])  // Array of version STRINGS for TableOfContents
const tocSelectedVersion = ref(null)

// Version comparison state
const showVersionComparator = ref(false)
const allVersionsData = ref([])

// Cargar documento
const loadDocument = async () => {
  if (!props.category || !props.doc) {
    console.log('No category or doc provided')
    return
  }

  loading.value = true
  error.value = null
  doc.value = null // Reset doc

  // CRITICAL: Reset TOC state when loading new document
  tocSections.value = []
  tocVersions.value = []
  tocSelectedVersion.value = null
  allVersionsData.value = []
  showVersionComparator.value = false

  console.log('[DocPage] 🔄 Reset TOC state for new document')

  try {
    // Asegurarse de que los documentos estén cargados
    if (!docsStore.apiIndex && props.category === 'cat.api') {
      console.log('API index not loaded, loading docs first...')
      await docsStore.loadDocs()
    }

    const path = `${props.category}/${props.doc}`
    console.log('[DocPage] Loading document:', path)
    const data = await docsStore.loadDoc(path)
    console.log('[DocPage] Document loaded:', data)

    if (!data) {
      throw new Error('Documento no encontrado')
    }

    doc.value = data
  } catch (e) {
    console.error('[DocPage] Error loading document:', e)
    error.value = e.message || 'Error al cargar documento'
  } finally {
    loading.value = false
  }
}

// Detectar si es documento API
const isApiDoc = computed(() => {
  return props.category === 'cat.api' || doc.value?.type === 'api'
})

// Detectar si es contenido TSDoc
const isTSDocContent = computed(() => {
  return props.category === 'cat.tsdoc' && doc.value?.symbols
})

// Detectar si es contenido Model
const isModelContent = computed(() => {
  return props.category === 'cat.model' || doc.value?.models
})

// Título de la página con formateo especial para modelos
const pageTitle = computed(() => {
  if (doc.value?.title) return doc.value.title
  if (doc.value?.name) return doc.value.name

  // Para modelos, formatear el nombre del documento
  if (isModelContent.value && props.doc) {
    return formatModelName(props.doc)
  }

  return getDefaultTitle()
})

// Breadcrumbs con traducción
const breadcrumbs = computed(() => {
  const crumbs = [
    { label: t('nav.home'), path: '/' }
  ]

  if (props.category) {
    const categoryLabel = getCategoryLabel(props.category)
    const categoryPath = getCategoryPath(props.category)
    crumbs.push({ label: categoryLabel, path: categoryPath })
  }

  // Para endpoints de API, agregar el grupo/sección
  if (isApiDoc.value && doc.value?.endpoints && doc.value.endpoints.length > 0) {
    const endpoint = doc.value.endpoints[0]

    // Extraer el grupo del ID del endpoint (ej: "users-delete-deleteuser" -> "Users")
    if (endpoint.id) {
      const groupName = extractGroupFromEndpointId(endpoint.id)
      if (groupName) {
        crumbs.push({
          label: groupName,
          path: `/api/section/${groupName}`
        })
      }
    }
  }

  if (doc.value) {
    const docLabel = getDocLabel()
    crumbs.push({ label: docLabel, path: null })
  }

  return crumbs
})

const getCategoryLabel = (category) => {
  const labels = {
    'cat.api': t('nav.api'),
    'cat.docs': t('nav.docs'),
    'cat.tsdoc': 'TypeScript Docs',
    'cat.model': 'Models'
  }
  return labels[category] || category.replace('cat.', '')
}

const getCategoryPath = (category) => {
  const paths = {
    'cat.api': '/api',
    'cat.docs': '/docs',
    'cat.tsdoc': '/tsdoc',
    'cat.model': '/model'
  }
  return paths[category] || `/docs/${category}`
}

const getDefaultTitle = () => {
  if (isApiDoc.value) return 'APIs'
  if (isTSDocContent.value) return 'TypeScript Docs'
  if (isModelContent.value) return 'Models'
  return 'Documentación'
}

const extractGroupFromEndpointId = (endpointId) => {
  // El formato del ID es: "groupname-method-name"
  // Ej: "users-delete-deleteuser" -> "Users"
  // Ej: "files-management-post-uploadavatar" -> "Files_Management"

  if (!endpointId) return null

  // Buscar el endpoint en el apiIndex para obtener su grupo
  if (docsStore.apiIndex?.endpoints) {
    const endpointInfo = docsStore.apiIndex.endpoints.find(e => e.id === endpointId)
    if (endpointInfo?.group) {
      return endpointInfo.group
    }
  }

  // Fallback: extraer del ID
  const parts = endpointId.split('-')
  if (parts.length > 0) {
    // Capitalizar primera parte
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
  }

  return null
}

const getDocLabel = () => {
  if (doc.value?.endpoints && doc.value.endpoints.length > 0) {
    const endpoint = doc.value.endpoints[0]
    return endpoint.title || endpoint.name || props.doc
  }

  // Para modelos, convertir user_management -> User Management
  if (isModelContent.value && props.doc) {
    return formatModelName(props.doc)
  }

  return doc.value?.title || doc.value?.name || props.doc
}

// Helper para formatear nombres de modelos: user_management -> User Management
const formatModelName = (name) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Navegación prev/next
const prevDoc = computed(() => {
  // TODO: Implementar lógica de documento anterior
  return null
})

const nextDoc = computed(() => {
  // TODO: Implementar lógica de documento siguiente
  return null
})

// Handle sections from ApiContent
const handleSectionsReady = (sections) => {
  tocSections.value = sections
}

// Handle versions from ApiContent
const handleVersionsReady = (data) => {
  console.log('📥 DEBUG DocPage: Received versions-ready event:', data)

  // data.versions = array of version OBJECTS for VersionSelector
  // data.versionStrings = array of version STRINGS for TableOfContents
  // data.endpoints = array of full endpoint objects for VersionComparator
  tocVersions.value = data.versions || []  // Objects for VersionSelector
  tocVersionStrings.value = data.versionStrings || []  // Strings for TableOfContents
  tocSelectedVersion.value = data.selectedVersion
  allVersionsData.value = data.endpoints || []

  console.log('📥 DEBUG DocPage: tocVersions (objects):', tocVersions.value)
  console.log('📥 DEBUG DocPage: tocVersionStrings (strings):', tocVersionStrings.value)
  console.log('📥 DEBUG DocPage: tocSelectedVersion:', tocSelectedVersion.value)
}

// Handle version selection
const handleVersionSelect = (version) => {
  console.log('Version selected:', version)
  tocSelectedVersion.value = version
  // ApiContent will react to the change via :externalSelectedVersion prop
}

// Handle language change from VersionSelector
const handleLanguageChange = ({ version, language }) => {
  console.log('🌍 DocPage: Language changed to', language, 'for version', version)
  // Language is already changed by VersionSelector calling docsStore.setLanguage()
  // Just update version if needed
  if (version && version !== tocSelectedVersion.value) {
    tocSelectedVersion.value = version
  }
}

// Handle compare versions
const handleCompareVersions = () => {
  showVersionComparator.value = true
}

const closeVersionComparator = () => {
  showVersionComparator.value = false
}

// Cargar cuando cambie la ruta
watch(() => [props.category, props.doc], () => {
  console.log('[DocPage] Route changed:', props.category, props.doc)
  loadDocument()
}, { immediate: false })

onMounted(async () => {
  console.log('[DocPage] Component mounted')
  await loadDocument()
})
</script>