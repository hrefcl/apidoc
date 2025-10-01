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
  const modelIndex = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Cargar índice de documentos
  const loadDocs = async () => {
    loading.value = true
    error.value = null

    try {
      // Cargar índice principal (cat.json)
      const response = await fetch('/data/cat.json')
      const catData = await response.json()

      // Procesar estructura APIcat v5
      const allDocs = []

      // Procesar docs (header, footer, groups, tsdoc)
      if (catData.docs) {
        Object.entries(catData.docs).forEach(([key, path]) => {
          allDocs.push({
            filename: path.split('/').pop(),
            directory: 'cat.docs',
            path: path,
            key: key,
            title: formatFileName(path.split('/').pop())
          })
        })
      }

      // Procesar tsdoc
      if (catData.tsdoc && Array.isArray(catData.tsdoc)) {
        catData.tsdoc.forEach(path => {
          if (path.startsWith('cat.tsdoc/')) {
            allDocs.push({
              filename: path.split('/').pop(),
              directory: 'cat.tsdoc',
              path: path,
              title: formatFileName(path.split('/').pop())
            })
          }
        })
      }

      // Procesar models
      if (catData.models?.shards) {
        catData.models.shards.forEach(path => {
          allDocs.push({
            filename: path.split('/').pop(),
            directory: 'cat.model',
            path: path,
            title: formatFileName(path.split('/').pop())
          })
        })
      }

      docs.value = allDocs

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

  // Cargar índice de modelos
  const loadModelIndex = async () => {
    try {
      const response = await fetch('/data/cat.model.index.json')
      modelIndex.value = await response.json()
    } catch (e) {
      console.warn('Model index file not found')
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
            // Si el endpoint tiene múltiples versiones, incluir todas las versiones
            // Las versiones están en el campo "versions" del endpoint
            console.log('[loadDoc] Endpoint has versions?', endpointData.versions?.length || 0)
            console.log('[loadDoc] Endpoint hasMultipleVersions?', endpointData.hasMultipleVersions)

            // Devolver el endpoint individual envuelto en la estructura del grupo
            currentDoc.value = {
              ...groupData,
              endpoints: [endpointData] // El endpoint ya contiene todas las versiones en su propiedad "versions"
            }
            console.log('[loadDoc] Returning endpoint data:', currentDoc.value)
            console.log('[loadDoc] Endpoint versions array:', endpointData.versions)
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
        isSection: true,
        items: docFiles.map(doc => {
          // Si es header o footer, usar metadata de meta.value
          if (doc.filename === 'header.json' && meta.value?.header) {
            return {
              title: meta.value.header.title || doc.title,
              path: `/docs/${doc.filename.replace('.json', '')}`,
              slug: doc.filename.replace('.json', ''),
              category: 'cat.docs',
              icon: mapFontAwesomeIcon(meta.value.header.icon) || 'home'
            }
          }
          if (doc.filename === 'footer.json' && meta.value?.footer) {
            return {
              title: meta.value.footer.title || doc.title,
              path: `/docs/${doc.filename.replace('.json', '')}`,
              slug: doc.filename.replace('.json', ''),
              category: 'cat.docs',
              icon: mapFontAwesomeIcon(meta.value.footer.icon) || 'lightbulb'
            }
          }
          // Archivos normales
          return {
            title: doc.title || formatFileName(doc.filename),
            path: `/docs/${doc.filename.replace('.json', '')}`,
            slug: doc.filename.replace('.json', ''),
            category: 'cat.docs',
            icon: 'book-open'
          }
        })
      })
    }

    // API Reference - Gran grupo con subgrupos internos respetando el orden
    if (navigation.value.groups && navigation.value.groups.length > 0) {
      const apiGroups = navigation.value.groups
        .filter(group => group.endpoints && group.endpoints.length > 0)
        .map(group => ({
          groupId: group.id,
          title: formatGroupTitle(group.id, group.title),
          icon: mapFontAwesomeIcon(group.icon),
          endpoints: group.endpoints
        }))

      // Respetar el orden definido en navigation.value.order
      const orderedGroups = navigation.value.order
        ? navigation.value.order
            .map(groupId => apiGroups.find(g => g.groupId === groupId))
            .filter(Boolean)
        : apiGroups

      nav.push({
        title: 'API Reference',
        icon: 'Plug',
        isSection: true,
        subgroups: orderedGroups.map(group => ({
          title: group.title,
          icon: group.icon,
          sectionPath: `/api/section/${group.groupId}`,
          items: group.endpoints.map(endpoint => ({
            title: formatEndpointTitle(endpoint),
            path: `/api/${endpoint}`,
            slug: endpoint,
            category: 'cat.api',
            icon: 'plug'
          }))
        }))
      })
    }

    // cat.tsdoc section
    const tsFiles = docs.value.filter(d => d.directory === 'cat.tsdoc')
    if (tsFiles.length > 0) {
      nav.push({
        title: 'TypeScript Docs',
        icon: 'Code',
        isSection: true,
        items: tsFiles.map(doc => ({
          title: doc.title || formatFileName(doc.filename),
          path: `/tsdoc/${doc.filename.replace('.json', '')}`,
          slug: doc.filename.replace('.json', ''),
          category: 'cat.tsdoc',
          icon: 'code'
        }))
      })
    }

    // cat.model section
    const modelFiles = docs.value.filter(d => d.directory === 'cat.model')
    if (modelFiles.length > 0) {
      nav.push({
        title: 'Models',
        icon: 'Users',
        isSection: true,
        items: modelFiles.map(doc => ({
          title: doc.title || formatFileName(doc.filename),
          path: `/model/${doc.filename.replace('.json', '')}`,
          slug: doc.filename.replace('.json', ''),
          category: 'cat.model',
          icon: 'users'
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