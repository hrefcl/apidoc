import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { decryptObject, isEncrypted } from '../utils/encryption'

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

  // Authentication state
  const isAuthenticated = ref(false)
  const authToken = ref(null) // JWT token

  // i18n state (Multi-language support)
  const currentLanguage = ref(null) // Current selected language (ISO 639-1 code: 'es', 'en', 'zh', etc.)
  const availableLanguages = ref([]) // List of available languages across all endpoints
  const i18nConfig = ref(null) // i18n configuration from apidoc.json

  // SECURITY: Encryption key is NEVER stored in sessionStorage or memory
  // It's only used temporarily during decryption and then discarded

  /**
   * Get encryption key from meta if login is active
   * SECURITY: Key is reconstructed from obfuscated segments ONLY when needed
   * @returns {string|null}
   */
  const getEncryptionKey = () => {
    // Try reconstructing obfuscated key from HTML
    if (typeof window !== 'undefined' && window.__APICAT_DATA__?.meta?.login) {
      const login = window.__APICAT_DATA__.meta.login
      if (login.active) {
        // New obfuscated format: reconstruct from segments
        if (login._obf && login._kv) {
          try {
            // Execute obfuscation code to reconstruct key
            // This evaluates the code that contains the segments and decoys
            const reconstructedKey = eval(`(function(){${login._obf}return ${login._kv};})()`)
            return reconstructedKey
          } catch (error) {
            console.error('Failed to reconstruct encryption key:', error)
            return null
          }
        }
        // Legacy format: direct key (for backward compatibility)
        else if (login._k) {
          return login._k
        }
      }
    }
    return null
  }

  /**
   * Set authentication status (for non-JWT authentication)
   * @param {boolean} value
   */
  const setAuthenticated = (value) => {
    isAuthenticated.value = value
    if (value) {
      // Store in sessionStorage to persist across page reloads
      sessionStorage.setItem('apicat_authenticated', 'true')
    } else {
      sessionStorage.removeItem('apicat_authenticated')
      authToken.value = null
    }
  }

  /**
   * Set JWT authentication token
   * @param {string} token - JWT token string
   */
  const setAuthToken = (token) => {
    authToken.value = token
    isAuthenticated.value = true
    // Store in sessionStorage to persist across page reloads
    sessionStorage.setItem('apicat_auth_token', token)
    sessionStorage.setItem('apicat_authenticated', 'true')
  }

  /**
   * DEPRECATED: This function is removed for security reasons
   * Encryption keys should NEVER be stored in sessionStorage or memory
   * @deprecated
   */
  const setEncryptionKey = (key) => {
    // SECURITY: Do NOT store encryption keys
    console.warn('⚠️  setEncryptionKey is deprecated for security reasons. Keys are not stored.')
  }

  /**
   * Check if login is required
   * @returns {boolean}
   */
  const requiresLogin = computed(() => {
    if (typeof window !== 'undefined' && window.__APICAT_DATA__?.meta?.login) {
      return window.__APICAT_DATA__.meta.login.active === true
    }
    return false
  })

  /**
   * Initialize authentication state from sessionStorage
   */
  const initAuth = () => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('apicat_auth_token')
      const authenticated = sessionStorage.getItem('apicat_authenticated') === 'true'

      // If we have a JWT token, validate it
      if (token) {
        // Import validateJWT dynamically to avoid circular dependencies
        import('../utils/jwt').then(({ validateJWT }) => {
          const validation = validateJWT(token)

          if (validation.valid) {
            console.log('✅ Restored valid JWT session')
            authToken.value = token
            isAuthenticated.value = true

            // Calculate time until expiration
            const timeUntil = (validation.payload.exp * 1000) - Date.now()
            const minutesUntil = Math.round(timeUntil / 1000 / 60)
            console.log(`🕐 Session expires in ${minutesUntil} minutes`)

            // Set up auto-logout when token expires
            if (timeUntil > 0) {
              setTimeout(() => {
                console.warn('⏰ JWT token expired, logging out')
                logout()
              }, timeUntil)
            }
          } else {
            console.warn('⚠️  Stored JWT token is invalid:', validation.error)
            logout()
          }
        })
      }
      // Fallback to simple boolean authentication
      else if (authenticated) {
        isAuthenticated.value = true
      }

      // SECURITY: Encryption key is NOT stored - reconstructed from obfuscated segments when needed
    }
  }

  /**
   * Logout - clear authentication state
   */
  const logout = () => {
    setAuthenticated(false)
    authToken.value = null
    // SECURITY: Encryption key is NOT stored in memory
    sessionStorage.removeItem('apicat_auth_token')
    sessionStorage.removeItem('apicat_authenticated')
  }

  /**
   * Helper para cargar datos - usa datos embebidos en SSG o fetch en runtime
   * @param {string} path - Ruta del archivo JSON (ej: '/data/cat.json')
   * @param {string} key - Clave en window.__APICAT_DATA__ (ej: 'cat' o 'api.users')
   */
  const loadData = async (path, key = null) => {
    let data = null

    // Si hay clave, buscar en datos embebidos
    if (key && typeof window !== 'undefined' && window.__APICAT_DATA__) {
      // Primero intentar la clave literal completa (ej: 'api.index', 'model.index')
      if (window.__APICAT_DATA__[key]) {
        console.log(`[loadData] Found data for key: ${key} (literal)`)
        data = window.__APICAT_DATA__[key]
      } else {
        // Si no existe como literal, intentar como clave anidada (ej: 'api.users' → api['users'])
        const keys = key.split('.')
        let tempData = window.__APICAT_DATA__
        for (const k of keys) {
          if (tempData && tempData[k]) {
            tempData = tempData[k]
          } else {
            tempData = null
            break
          }
        }
        if (tempData) {
          console.log(`[loadData] Found data for key: ${key} (nested)`)
          data = tempData
        } else {
          console.warn(`[loadData] Key not found: ${key}`)
        }
      }
    }

    // Fallback: usar fetch si no se encontraron datos embebidos
    if (!data) {
      console.log(`[loadData] Falling back to fetch for: ${path}`)
      const response = await fetch(path)
      data = await response.json()
    }

    // Desencriptar si es necesario
    if (data && isEncrypted(data)) {
      const encryptionKey = getEncryptionKey()
      if (encryptionKey) {
        console.log(`[loadData] 🔓 Decrypting data for key: ${key}`)
        try {
          data = await decryptObject(data, encryptionKey)
          console.log(`[loadData] ✅ Decryption successful for key: ${key}`)
        } catch (error) {
          console.error(`[loadData] ❌ Decryption failed for key: ${key}`, error)
          throw new Error(`Failed to decrypt ${key}: ${error.message}`)
        }
      } else {
        console.error(`[loadData] ❌ Data is encrypted but no encryption key available`)
        throw new Error('Encrypted data requires authentication')
      }
    }

    return data
  }

  // Cargar índice de documentos
  const loadDocs = async () => {
    loading.value = true
    error.value = null

    try {
      // Cargar índice principal (cat.json)
      const catData = await loadData('/data/cat.json', 'cat')

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

      // Inicializar sistema i18n
      initI18n()
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
      navigation.value = await loadData('/data/cat.navigation.json', 'navigation')
    } catch (e) {
      console.warn('Navigation file not found')
    }
  }

  // Cargar metadata
  const loadMeta = async () => {
    try {
      meta.value = await loadData('/data/cat.meta.json', 'meta')
    } catch (e) {
      console.warn('Meta file not found')
    }
  }

  // Cargar índice de API
  const loadApiIndex = async () => {
    try {
      console.log('[loadApiIndex] Loading API index with key: api.index')
      apiIndex.value = await loadData('/data/cat.api.index.json', 'api.index')
      console.log('[loadApiIndex] API index loaded:', apiIndex.value ? 'SUCCESS' : 'FAILED')
    } catch (e) {
      console.error('[loadApiIndex] Error loading API index:', e)
    }
  }

  // Cargar índice de modelos
  const loadModelIndex = async () => {
    try {
      modelIndex.value = await loadData('/data/cat.model.index.json', 'model.index')
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
      // console.log('[loadDoc] Loading:', { path, category, slug })

      // Si es un endpoint de API, buscar en el índice
      if (category === 'cat.api' && apiIndex.value) {
        // console.log('[loadDoc] Searching in API index for:', slug)
        const endpoint = apiIndex.value.endpoints.find(e => e.id === slug)
        // console.log('[loadDoc] Found endpoint:', endpoint)

        if (endpoint && endpoint.shard) {
          // console.log('[loadDoc] Loading shard:', endpoint.shard)
          // Cargar el archivo del grupo (ej: "cat.api/users.json")
          // Convertir cat.api/users.json → api.users
          const shardKey = endpoint.shard
            .replace('cat.', '')  // cat.api/users.json → api/users.json
            .replace('.json', '') // api/users.json → api/users
            .replace('/', '.')     // api/users → api.users
          const groupData = await loadData(`/data/${endpoint.shard}`, shardKey)
          // console.log('[loadDoc] Group data loaded, endpoints:', groupData.endpoints?.length)

          // Buscar el endpoint específico dentro del grupo
          const endpointData = groupData.endpoints?.find(e => e.id === slug)
          // console.log('[loadDoc] Found endpoint in group:', endpointData ? 'YES' : 'NO')

          if (endpointData) {
            // Si el endpoint tiene múltiples versiones, incluir todas las versiones
            // Las versiones están en el campo "versions" del endpoint
            // console.log('[loadDoc] Endpoint has versions?', endpointData.versions?.length || 0)
            // console.log('[loadDoc] Endpoint hasMultipleVersions?', endpointData.hasMultipleVersions)

            // Devolver el endpoint individual envuelto en la estructura del grupo
            currentDoc.value = {
              ...groupData,
              endpoints: [endpointData] // El endpoint ya contiene todas las versiones en su propiedad "versions"
            }
            // console.log('[loadDoc] Returning endpoint data:', currentDoc.value)
            // console.log('[loadDoc] Endpoint versions array:', endpointData.versions)
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
      // console.log('[loadDoc] Trying fallback: /data/' + path + '.json')
      // Convertir cat.docs/header → docs.header
      const dataKey = path.replace('cat.', '').replace('/', '.')
      const data = await loadData(`/data/${path}.json`, dataKey)
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
        title: '__nav.documentation__', // Marker for i18n translation in components
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
          items: group.endpoints.map(endpoint => {
            // Buscar el summary del endpoint en el índice de API
            // Filtrar por idioma actual
            const currentLang = currentLanguage.value

            const endpointData = apiIndex.value?.endpoints?.find(e =>
              e.id === endpoint &&
              (!currentLang || e.lang === currentLang)
            )
            const endpointTitle = endpointData?.summary || formatEndpointTitle(endpoint)

            return {
              title: endpointTitle,
              path: `/api/${endpoint}`,
              slug: endpoint,
              category: 'cat.api',
              icon: 'plug'
            }
          })
        }))
      })
    }

    // cat.tsdoc section
    const tsFiles = docs.value.filter(d => d.directory === 'cat.tsdoc')
    if (tsFiles.length > 0) {
      nav.push({
        title: '__tsdoc.title__', // Marker for i18n translation in components
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
      .replace(/_/g, ' ') // Reemplazar guiones bajos con espacios
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizar cada palabra
      .join(' ')
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

  // ==================== i18n Functions ====================

  /**
   * Initialize i18n system from meta configuration
   * Detects available languages and sets default language
   */
  const initI18n = () => {
    if (typeof window === 'undefined') return

    // Get i18n config from meta
    const i18n = window.__APICAT_DATA__?.meta?.i18n
    if (i18n && i18n.enabled) {
      i18nConfig.value = i18n

      // Detect available languages from all endpoints
      const langsSet = new Set()
      const apiData = window.__APICAT_DATA__?.api || {}

      Object.values(apiData).forEach(group => {
        if (group.endpoints) {
          group.endpoints.forEach(endpoint => {
            if (endpoint.languages) {
              Object.keys(endpoint.languages).forEach(lang => langsSet.add(lang))
            }
          })
        }
      })

      availableLanguages.value = Array.from(langsSet).sort()

      // Set default language from config or first available or browser language
      const browserLang = navigator.language.split('-')[0] // 'en-US' -> 'en'
      const defaultLang = i18n.defaultLang
        || (availableLanguages.value.includes(browserLang) ? browserLang : null)
        || availableLanguages.value[0]
        || 'en'

      // Check if language was saved in localStorage
      const savedLang = localStorage.getItem('apicat_language')
      if (savedLang && availableLanguages.value.includes(savedLang)) {
        currentLanguage.value = savedLang
      } else {
        currentLanguage.value = defaultLang
      }

      console.log('📚 i18n initialized:', {
        available: availableLanguages.value,
        current: currentLanguage.value,
        config: i18nConfig.value
      })
    }
  }

  /**
   * Change current language
   * @param {string} lang - ISO 639-1 language code (e.g., 'es', 'en', 'zh')
   */
  const setLanguage = (lang) => {
    // Don't validate against availableLanguages because different versions
    // may have different languages available. Just set it and let
    // getLocalizedEndpoint handle fallbacks.

    currentLanguage.value = lang
    localStorage.setItem('apicat_language', lang)
  }

  /**
   * Get localized content for an endpoint
   * Falls back to default language or first available if requested language not found
   * @param {object} endpoint - Endpoint object with languages property
   * @returns {object} - Localized endpoint content
   */
  const getLocalizedEndpoint = (endpoint) => {
    if (!endpoint) return null

    // If no languages object, return endpoint as-is (language-neutral)
    if (!endpoint.languages) {
      return endpoint
    }

    const requestedLang = currentLanguage.value
    const defaultLang = i18nConfig.value?.defaultLang
    const fallbackToDefault = i18nConfig.value?.fallbackToDefault !== false

    // Try requested language first in ROOT endpoint
    let langData = endpoint.languages[requestedLang]

    // If not found in root, check if it exists in ANY version
    if (!langData && endpoint.versions && Array.isArray(endpoint.versions)) {
      for (const versionObj of endpoint.versions) {
        if (versionObj.languages && versionObj.languages[requestedLang]) {
          langData = versionObj.languages[requestedLang]
          break
        }
      }
    }

    if (langData) {

      // CRITICAL: Localize ALL versions in the versions array too
      let localizedVersions = endpoint.versions
      if (endpoint.versions && Array.isArray(endpoint.versions)) {
        localizedVersions = endpoint.versions.map(versionObj => {
          if (versionObj.languages && versionObj.languages[requestedLang]) {
            return {
              ...versionObj,
              ...versionObj.languages[requestedLang],
              // Preserve structure
              languages: versionObj.languages
            }
          }
          return versionObj
        })
      }

      const result = {
        ...endpoint,
        ...langData,
        // CRITICAL: Use localized versions array (must come AFTER spread to override)
        versions: localizedVersions,
        hasMultipleVersions: endpoint.hasMultipleVersions,
        versionCount: endpoint.versionCount,
        latestVersion: endpoint.latestVersion,
        _currentLang: requestedLang,
        _availableLangs: Object.keys(endpoint.languages)
      }
      return result
    }

    // Fallback to default language
    if (fallbackToDefault && defaultLang && endpoint.languages[defaultLang]) {
      console.warn(`Content not available in "${requestedLang}", using default "${defaultLang}"`)
      return {
        ...endpoint,
        ...endpoint.languages[defaultLang],
        // CRITICAL: Preserve versions array from original endpoint
        versions: endpoint.versions,
        hasMultipleVersions: endpoint.hasMultipleVersions,
        versionCount: endpoint.versionCount,
        latestVersion: endpoint.latestVersion,
        _currentLang: defaultLang,
        _availableLangs: Object.keys(endpoint.languages),
        _isFallback: true
      }
    }

    // Fallback to first available language
    const firstAvailable = Object.keys(endpoint.languages)[0]
    if (firstAvailable) {
      console.warn(`Content not available in "${requestedLang}", using "${firstAvailable}"`)
      return {
        ...endpoint,
        ...endpoint.languages[firstAvailable],
        // CRITICAL: Preserve versions array from original endpoint
        versions: endpoint.versions,
        hasMultipleVersions: endpoint.hasMultipleVersions,
        versionCount: endpoint.versionCount,
        latestVersion: endpoint.latestVersion,
        _currentLang: firstAvailable,
        _availableLangs: Object.keys(endpoint.languages),
        _isFallback: true
      }
    }

    // No languages available, return original endpoint
    return endpoint
  }

  /**
   * Check if i18n is enabled
   * @returns {boolean}
   */
  const i18nEnabled = computed(() => {
    return i18nConfig.value?.enabled === true && availableLanguages.value.length > 0
  })

  /**
   * Check if language selector should be shown
   * @returns {boolean}
   */
  const showLanguageSelector = computed(() => {
    return i18nEnabled.value && availableLanguages.value.length > 1
  })

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
    getSidebarNav,
    // Authentication
    isAuthenticated,
    authToken,
    requiresLogin,
    setAuthenticated,
    setAuthToken,
    setEncryptionKey,
    initAuth,
    logout,
    // i18n
    currentLanguage,
    availableLanguages,
    i18nConfig,
    i18nEnabled,
    showLanguageSelector,
    initI18n,
    setLanguage,
    getLocalizedEndpoint
  }
})