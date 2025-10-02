/**
 * SSG Routes Generator
 * Este archivo genera todas las rutas dinámicas para vite-ssg
 * leyendo los archivos JSON en tiempo de build
 */

/**
 * Genera todas las rutas estáticas basadas en los archivos JSON del directorio public/data
 * @param {object} context - El contexto de vite-ssg
 * @returns {Promise<string[]>} Array de rutas a generar
 */
export async function generateRoutes(context) {
  const routes = []
  const fs = await import('fs')
  const path = await import('path')
  const { fileURLToPath } = await import('url')

  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const publicDataPath = path.join(__dirname, '../public/data')

  // Rutas estáticas
  routes.push('/')
  routes.push('/docs')
  routes.push('/api')
  routes.push('/tsdoc')
  routes.push('/model')

  try {
    // Leer cat.json para obtener la estructura
    const catJsonPath = path.join(publicDataPath, 'cat.json')

    if (!fs.existsSync(catJsonPath)) {
      console.warn('⚠️  cat.json no encontrado, generando solo rutas estáticas')
      return routes
    }

    const catData = JSON.parse(fs.readFileSync(catJsonPath, 'utf-8'))

    // Generar rutas para docs
    if (catData.docs) {
      Object.entries(catData.docs).forEach(([key, filePath]) => {
        const filename = filePath.split('/').pop().replace('.json', '')
        routes.push(`/docs/${filename}`)
      })
    }

    // Generar rutas para tsdoc
    if (catData.tsdoc && Array.isArray(catData.tsdoc)) {
      catData.tsdoc.forEach(filePath => {
        const filename = filePath.split('/').pop().replace('.json', '')
        routes.push(`/tsdoc/${filename}`)
      })
    }

    // Generar rutas para model
    if (catData.model && Array.isArray(catData.model)) {
      catData.model.forEach(filePath => {
        const filename = filePath.split('/').pop().replace('.json', '')
        routes.push(`/model/${filename}`)
      })
    }

    // Generar rutas para API
    const navigationPath = path.join(publicDataPath, 'cat.navigation.json')
    if (fs.existsSync(navigationPath)) {
      const navData = JSON.parse(fs.readFileSync(navigationPath, 'utf-8'))

      if (navData.groups && Array.isArray(navData.groups)) {
        navData.groups.forEach(group => {
          // Ruta de sección
          routes.push(`/api/section/${group.id}`)

          // Rutas de endpoints individuales
          if (group.endpoints && Array.isArray(group.endpoints)) {
            group.endpoints.forEach(endpointId => {
              routes.push(`/api/${endpointId}`)
            })
          }
        })
      }
    }

  } catch (error) {
    console.error('❌ Error generando rutas SSG:', error.message)
  }

  console.log(`✅ SSG: Generando ${routes.length} rutas estáticas`)
  return routes
}
