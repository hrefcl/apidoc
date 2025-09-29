import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDocsStore = defineStore('docs', () => {
  // State
  const jsonFiles = ref([])
  const organizedDocs = ref({})
  const categories = ref({})
  const currentDoc = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const allDocs = computed(() => jsonFiles.value)
  const docCount = computed(() => jsonFiles.value.length)
  const docsByCategory = computed(() => organizedDocs.value)

  // Actions
  async function loadAvailableDocs() {
    loading.value = true
    error.value = null

    try {
      // Intentar cargar el índice generado dinámicamente
      const response = await fetch('/data/_index.json')

      if (response.ok) {
        const index = await response.json()
        jsonFiles.value = index.files || []
        organizedDocs.value = index.organized || {}
        categories.value = index.categories || {}
        console.log(`✅ Cargados ${index.total} archivos JSON desde índice`)
        console.log(`📊 Categorías:`, index.categories)
      } else {
        // Fallback: si no existe el índice, mostrar mensaje
        console.warn('⚠️  No se encontró _index.json. Ejecuta: npm run dev:apicat-template')
        jsonFiles.value = []
        organizedDocs.value = {}
        categories.value = {}
        error.value = 'No hay archivos JSON disponibles. Ejecuta "npm run dev:apicat-template" primero.'
      }

    } catch (e) {
      error.value = `Error cargando documentos: ${e.message}`
      console.error('Error loading docs:', e)
      jsonFiles.value = []
    } finally {
      loading.value = false
    }
  }

  async function loadDoc(filename) {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`/data/${filename}`)
      if (!response.ok) throw new Error(`Failed to load ${filename}`)
      
      const data = await response.json()
      currentDoc.value = {
        filename,
        data,
        encrypted: filename.includes('.encrypted')
      }
      
      return data
    } catch (e) {
      error.value = e.message
      console.error('Error loading document:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    jsonFiles,
    organizedDocs,
    categories,
    currentDoc,
    loading,
    error,
    // Getters
    allDocs,
    docCount,
    docsByCategory,
    // Actions
    loadAvailableDocs,
    loadDoc
  }
})
