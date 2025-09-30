import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDocsStore = defineStore('docs', () => {
  const docs = ref([])
  const categories = ref({})
  const currentDoc = ref(null)
  const navigation = ref(null)
  const meta = ref(null)
  const settings = ref({})
  const apiIndex = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Cargar índice de documentos
  const loadDocs = async () => {
    loading.value = true
    error.value = null

    try {
      // Cargar índice
      const response = await fetch('/data/_index.json')
      const data = await response.json()
      docs.value = data.files || []
      categories.value = data.categories || {}

      // Cargar navegación
      await loadNavigation()

      // Cargar metadata
      await loadMeta()

      // Cargar índice de API
      await loadApiIndex()

      // Organizar documentos por categoría
      organizeDocs()
    } catch (e) {
      error.value = 'Error al cargar documentos: ' + e.message
      console.error('Error loading docs:', e)
    } finally {
      loading.value = false
    }
  }

  // Cargar navegación
  const loadNavigation = async () => {
    try {
      const response = await fetch('/data/cat.navigation.json')
      navigation.value = await response.json()
    } catch (e) {
      console.warn('Navigation file not found')
    }
  }

  // Cargar metadata
  const loadMeta = async () => {
    try {
      const response = await fetch('/data/cat.meta.json')
      meta.value = await response.json()
    } catch (e) {
      console.warn('Meta file not found')
    }
  }

  // Cargar índice de API
  const loadApiIndex = async () => {
    try {
      const response = await fetch('/data/cat.api.index.json')
      apiIndex.value = await response.json()
    } catch (e) {
      console.warn('API index file not found')
    }
  }

  // Cargar configuración desde apidoc.json (settings)
  const loadSettings = async () => {
    try {
      // En producción esto vendría del backend
      // Por ahora usamos la navegación para inferir settings
      if (navigation.value?.groups) {
        navigation.value.groups.forEach(group => {
          settings.value[group.id] = {
            title: group.title,
            icon: group.icon
          }
        })
      }
    } catch (e) {
      console.warn('Settings not found')
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
      // Extraer category y slug del path (ej: "cat.api/users-get-getuserprofile")
      const [category, slug] = path.split('/')
      console.log('[loadDoc] Loading:', { path, category, slug })

      // Si es un endpoint de API, buscar en el índice
      if (category === 'cat.api' && apiIndex.value) {
        console.log('[loadDoc] Searching in API index for:', slug)
        const endpoint = apiIndex.value.endpoints.find(e => e.id === slug)
        console.log('[loadDoc] Found endpoint:', endpoint)

        if (endpoint && endpoint.shard) {
          console.log('[loadDoc] Loading shard:', endpoint.shard)
          // Cargar el archivo del grupo (ej: "cat.api/users.json")
          const response = await fetch(`/data/${endpoint.shard}`)
          const groupData = await response.json()
          console.log('[loadDoc] Group data loaded, endpoints:', groupData.endpoints?.length)

          // Buscar el endpoint específico dentro del grupo
          const endpointData = groupData.endpoints?.find(e => e.id === slug)
          console.log('[loadDoc] Found endpoint in group:', endpointData ? 'YES' : 'NO')

          if (endpointData) {
            // Devolver el endpoint individual envuelto en la estructura del grupo
            currentDoc.value = {
              ...groupData,
              endpoints: [endpointData]
            }
            console.log('[loadDoc] Returning endpoint data:', currentDoc.value)
            return currentDoc.value
          }
        } else {
          console.warn('[loadDoc] Endpoint not found in index or no shard')
        }
      } else {
        console.log('[loadDoc] Not an API doc or no API index:', {
          isApi: category === 'cat.api',
          hasIndex: !!apiIndex.value
        })
      }

      // Fallback: intentar cargar como archivo individual
      console.log('[loadDoc] Trying fallback: /data/' + path + '.json')
      const response = await fetch(`/data/${path}.json`)
      if (!response.ok) {
        throw new Error(`Documento no encontrado: ${path}`)
      }
      const data = await response.json()
      currentDoc.value = data
      return data
    } catch (e) {
      error.value = 'Error al cargar documento: ' + e.message
      console.error('[loadDoc] Error:', e)
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

  // Obtener navegación lateral basada en cat.navigation.json
  const getSidebarNav = computed(() => {
    const nav = []

    if (!navigation.value?.groups) {
      return buildFallbackNav()
    }

    // API Groups
    const apiGroups = navigation.value.groups.map(group => ({
      title: formatGroupTitle(group.id, group.title),
      icon: mapFontAwesomeIcon(group.icon),
      items: group.endpoints.map(endpoint => ({
        title: formatEndpointTitle(endpoint),
        path: `/api/${endpoint}`,
        slug: endpoint,
        category: 'cat.api',
        icon: 'plug'
      }))
    }))

    // cat.docs section - EXCLUIR archivos group.* y tsdoc.*
    const docFiles = docs.value.filter(d =>
      d.directory === 'cat.docs' &&
      !d.filename.startsWith('group.') &&
      !d.filename.startsWith('tsdoc.')
    )
    if (docFiles.length > 0) {
      nav.push({
        title: 'Documentación',
        icon: 'BookOpen',
        items: docFiles.map(doc => ({
          title: doc.title || formatFileName(doc.filename),
          path: `/docs/${doc.filename.replace('.json', '')}`,
          slug: doc.filename.replace('.json', ''),
          category: 'cat.docs',
          icon: 'book-open'
        }))
      })
    }

    // Agregar grupos de API
    nav.push(...apiGroups)

    // cat.tsdoc section
    const tsFiles = docs.value.filter(d => d.directory === 'cat.tsdoc')
    if (tsFiles.length > 0) {
      nav.push({
        title: 'TypeScript',
        icon: 'Code',
        items: tsFiles.map(doc => ({
          title: doc.title || formatFileName(doc.filename),
          path: `/tsdoc/${doc.filename.replace('.json', '')}`,
          slug: doc.filename.replace('.json', ''),
          category: 'cat.tsdoc',
          icon: 'code'
        }))
      })
    }

    return nav
  })

  // Fallback navigation si no hay cat.navigation.json
  const buildFallbackNav = () => {
    const nav = []

    Object.keys(categories.value).forEach(category => {
      const categoryDocs = categories.value[category]

      // Validar que sea un array
      if (!Array.isArray(categoryDocs)) {
        console.warn(`Category ${category} is not an array:`, categoryDocs)
        return
      }

      nav.push({
        title: getCategoryTitle(category),
        items: categoryDocs.map(doc => ({
          title: doc.title,
          path: doc.relativePath,
          icon: getDocIcon(doc)
        }))
      })
    })

    return nav
  }

  // Formatear título de grupo (aplicar settings si existen)
  const formatGroupTitle = (groupId, defaultTitle) => {
    // Aquí deberíamos usar settings desde apidoc.json
    // Por ahora usamos el título del navigation o formateamos el ID
    return defaultTitle.replace(/_/g, ' ')
  }

  // Formatear título de endpoint
  const formatEndpointTitle = (endpoint) => {
    // Extraer la última parte después del último guión
    const parts = endpoint.split('-')
    const title = parts[parts.length - 1]

    // Capitalizar y agregar espacios
    return title
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  // Formatear nombre de archivo
  const formatFileName = (filename) => {
    return filename
      .replace('.json', '')
      .replace(/-/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  // Mapear iconos de Font Awesome a componentes Lucide
  const mapFontAwesomeIcon = (faIcon) => {
    const iconMap = {
      'fa-user': 'User',
      'fa-users': 'Users',
      'fa-building': 'Building',
      'fa-cog': 'Settings',
      'fa-cogs': 'Settings',
      'fa-map-marker-alt': 'MapPin',
      'fa-tags': 'Tags',
      'fa-folder': 'Folder',
      'fa-file': 'FileText',
      'fa-code': 'Code',
      'fa-book': 'BookOpen'
    }

    return iconMap[faIcon] || 'FileText'
  }

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
    navigation,
    meta,
    settings,
    apiIndex,
    loading,
    error,
    loadDocs,
    loadDoc,
    searchDocs,
    getSidebarNav
  }
})