#!/usr/bin/env node

/**
 * Script para embedear datos JSON en los archivos HTML generados por SSG
 * Este script lee todos los JSONs del directorio public/data y los embebe
 * como window.__APICAT_DATA__ en cada HTML generado
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, '../dist')
const dataPath = path.join(__dirname, '../public/data')

console.log('📦 Embebiendo datos JSON en HTMLs...')

// Función para leer todos los JSONs
function loadAllJSONs() {
  const data = {}

  try {
    // Leer todos los archivos JSON del directorio data
    const jsonFiles = fs.readdirSync(dataPath).filter(f => f.endsWith('.json'))

    jsonFiles.forEach(file => {
      const filePath = path.join(dataPath, file)
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

      // Usar el nombre del archivo sin .json como clave
      // cat.json → cat, cat.navigation.json → navigation, etc.
      const key = file.replace('cat.', '').replace('.json', '')

      if (file.startsWith('cat.') && file !== 'cat.json') {
        // Archivos cat.*.json → key directo
        data[key] = content
      } else if (file === 'cat.json') {
        // cat.json → 'cat'
        data.cat = content
      } else if (file.includes('/')) {
        // Archivos en subdirectorios (ej: cat.api/users.json)
        const parts = file.split('/')
        const category = parts[0].replace('cat.', '')
        const name = parts[parts.length - 1].replace('.json', '')

        if (!data[category]) data[category] = {}
        data[category][name] = content
      }
    })

    // Leer subdirectorios (cat.api/, cat.tsdoc/, etc.)
    const subdirs = fs.readdirSync(dataPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())

    subdirs.forEach(dir => {
      const subdirPath = path.join(dataPath, dir.name)
      const subdirFiles = fs.readdirSync(subdirPath).filter(f => f.endsWith('.json'))

      // cat.api → api
      const category = dir.name.replace('cat.', '')
      if (!data[category]) data[category] = {}

      subdirFiles.forEach(file => {
        const filePath = path.join(subdirPath, file)
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        const key = file.replace('.json', '')
        data[category][key] = content
      })
    })

  } catch (error) {
    console.error('❌ Error leyendo JSONs:', error.message)
  }

  return data
}

// Función para embedear datos en un HTML
function embedDataInHTML(htmlPath, data) {
  try {
    let html = fs.readFileSync(htmlPath, 'utf-8')

    // Crear el script tag con los datos
    const dataScript = `<script>
window.__APICAT_DATA__ = ${JSON.stringify(data, null, 0)};
</script>
`

    // Insertar ANTES del primer <script> para evitar conflictos con JS inline
    const scriptMatch = html.match(/<script[^>]*>/)
    if (scriptMatch) {
      const scriptIndex = html.indexOf(scriptMatch[0])
      html = html.slice(0, scriptIndex) + dataScript + html.slice(scriptIndex)
    } else {
      // Fallback: insertar antes de </head>
      html = html.replace('</head>', `${dataScript}</head>`)
    }

    // Escribir el HTML modificado
    fs.writeFileSync(htmlPath, html, 'utf-8')

    const fileSize = (fs.statSync(htmlPath).size / 1024).toFixed(2)
    console.log(`  ✅ ${path.basename(htmlPath)} (${fileSize} KB)`)
  } catch (error) {
    console.error(`  ❌ Error embebiendo en ${htmlPath}:`, error.message)
  }
}

// Main
async function main() {
  // Cargar todos los JSONs
  console.log('\n📂 Leyendo archivos JSON...')
  const allData = loadAllJSONs()

  const dataSize = (JSON.stringify(allData).length / 1024).toFixed(2)
  console.log(`✅ Datos cargados: ${dataSize} KB`)
  console.log(`📊 Categorías: ${Object.keys(allData).join(', ')}`)

  // Encontrar todos los HTMLs en dist
  console.log('\n🔍 Buscando archivos HTML...')
  const htmlFiles = await glob('**/*.html', { cwd: distPath })

  console.log(`✅ Encontrados ${htmlFiles.length} archivos HTML`)

  // Embedear datos en cada HTML
  console.log('\n💉 Embebiendo datos...')
  htmlFiles.forEach(file => {
    const htmlPath = path.join(distPath, file)
    embedDataInHTML(htmlPath, allData)
  })

  console.log('\n✅ Proceso completado!')
}

main().catch(error => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
