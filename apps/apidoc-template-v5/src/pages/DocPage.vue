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
        <h1 class="mb-4">{{ doc.title || doc.name || 'Documentación' }}</h1>

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

    <!-- Right Sidebar - Table of Contents -->
    <TableOfContents
      v-if="isApiDoc && doc && tocSections.length > 0"
      :sections="tocSections"
      :versions="tocVersions"
      :selectedVersion="tocSelectedVersion"
      @select-version="handleVersionSelect"
      @compare-versions="handleCompareVersions"
      class="w-64 flex-shrink-0"
    />
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
import TableOfContents from '@/components/TableOfContents.vue'
import VersionComparator from '@/components/VersionComparator.vue'

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
const tocVersions = ref([])
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

// Breadcrumbs con traducción
const breadcrumbs = computed(() => {
  const crumbs = [
    { label: t('nav.home'), path: '/' }
  ]

  if (props.category) {
    const categoryLabel = getCategoryLabel(props.category)
    crumbs.push({ label: categoryLabel, path: `/docs/${props.category}` })
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
    'cat.tsdoc': 'TypeScript'
  }
  return labels[category] || category.replace('cat.', '')
}

const getDocLabel = () => {
  if (doc.value?.endpoints && doc.value.endpoints.length > 0) {
    const endpoint = doc.value.endpoints[0]
    return endpoint.title || endpoint.name || props.doc
  }
  return doc.value?.title || doc.value?.name || props.doc
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
  tocVersions.value = data.versions.map(v => v.version)
  tocSelectedVersion.value = data.selectedVersion
  allVersionsData.value = data.versions // Store full version data for comparison
}

// Handle version selection
const handleVersionSelect = (version) => {
  console.log('Version selected:', version)
  tocSelectedVersion.value = version
  // ApiContent will react to the change via :externalSelectedVersion prop
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