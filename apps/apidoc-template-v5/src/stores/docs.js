import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDocsStore = defineStore('docs', () => {
  const docs = ref([])
  const categories = ref({})
  const currentDoc = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Cargar índice de documentos
  const loadDocs = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/data/_index.json')
      const data = await response.json()

      docs.value = data.files || []
      categories.value = data.categories || {}

      // Organizar documentos por categoría
      organizeDocs()
    } catch (e) {
      error.value = 'Error al cargar documentos: ' + e.message
      console.error('Error loading docs:', e)
    } finally {
      loading.value = false
    }
  }

  // Organizar documentos por categoría
  const organizeDocs = () => {
    const organized = {}

    docs.value.forEach(doc => {
      const category = doc.directory || 'root'
      if (!organized[category]) {
        organized[category] = []
      }
      organized[category].push(doc)
    })

    categories.value = organized
  }

  // Cargar un documento específico
  const loadDoc = async (path) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`/data/${path}`)
      const data = await response.json()
      currentDoc.value = data
      return data
    } catch (e) {
      error.value = 'Error al cargar documento: ' + e.message
      console.error('Error loading doc:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  // Buscar documentos
  const searchDocs = (query) => {
    if (!query) return docs.value

    const lowerQuery = query.toLowerCase()
    return docs.value.filter(doc =>
      doc.title?.toLowerCase().includes(lowerQuery) ||
      doc.filename?.toLowerCase().includes(lowerQuery)
    )
  }

  // Obtener navegación lateral
  const getSidebarNav = computed(() => {
    const nav = []

    Object.keys(categories.value).forEach(category => {
      nav.push({
        title: getCategoryTitle(category),
        items: categories.value[category].map(doc => ({
          title: doc.title,
          path: doc.relativePath,
          icon: getDocIcon(doc)
        }))
      })
    })

    return nav
  })

  // Obtener título de categoría
  const getCategoryTitle = (category) => {
    const titles = {
      'root': 'General',
      'cat.api': 'API',
      'cat.docs': 'Documentación',
      'cat.tsdoc': 'TypeScript'
    }
    return titles[category] || category.replace('cat.', '')
  }

  // Obtener icono según tipo de documento
  const getDocIcon = (doc) => {
    if (doc.directory === 'cat.api') return 'plug'
    if (doc.directory === 'cat.docs') return 'book-open'
    if (doc.directory === 'cat.tsdoc') return 'code'
    return 'file-text'
  }

  return {
    docs,
    categories,
    currentDoc,
    loading,
    error,
    loadDocs,
    loadDoc,
    searchDocs,
    getSidebarNav
  }
})