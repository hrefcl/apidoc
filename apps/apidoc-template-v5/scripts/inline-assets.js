#!/usr/bin/env node

/**
 * Script para inlinear todos los assets (CSS y JS) en los HTMLs generados
 * Esto es necesario para que funcione con file:// protocol
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, '../dist')

console.log('🎨 Inlineando CSS y JS en HTMLs...')

async function inlineAssets() {
  // Encontrar todos los HTMLs
  const htmlFiles = await glob('**/*.html', { cwd: distPath })
  console.log(`✅ Encontrados ${htmlFiles.length} archivos HTML`)

  for (const htmlFile of htmlFiles) {
    const htmlPath = path.join(distPath, htmlFile)
    let html = fs.readFileSync(htmlPath, 'utf-8')
    let modified = false

    // Inline CSS files (usando matchAll para evitar loops infinitos)
    const cssMatches = [...html.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/g)]
    for (const cssMatch of cssMatches) {
      const cssHref = cssMatch[1]
      const cssPath = path.join(distPath, cssHref)

      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8')
        const styleTag = `<style>${cssContent}</style>`
        html = html.replace(cssMatch[0], styleTag)
        modified = true
        console.log(`  📄 ${htmlFile}: Inlineado CSS ${cssHref}`)
      }
    }

    // Inline JS files (usando matchAll para evitar loops infinitos)
    const jsMatches = [...html.matchAll(/<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/g)]
    for (const jsMatch of jsMatches) {
      const jsSrc = jsMatch[1]
      const jsPath = path.join(distPath, jsSrc)

      if (fs.existsSync(jsPath)) {
        const jsContent = fs.readFileSync(jsPath, 'utf-8')
        // Mantener los atributos del script original (type, async, etc)
        const scriptAttrs = jsMatch[0].match(/<script([^>]*)src=/)?.[1] || ''
        const scriptTag = `<script${scriptAttrs}>${jsContent}</script>`
        html = html.replace(jsMatch[0], scriptTag)
        modified = true
        console.log(`  📄 ${htmlFile}: Inlineado JS ${jsSrc}`)
      }
    }

    // Guardar HTML modificado
    if (modified) {
      fs.writeFileSync(htmlPath, html, 'utf-8')
      const fileSize = (fs.statSync(htmlPath).size / 1024).toFixed(2)
      console.log(`  ✅ ${htmlFile} (${fileSize} KB)`)
    }
  }

  console.log('\n🧹 Limpiando archivos de assets...')

  // Eliminar carpeta assets ya que todo está inline
  const assetsPath = path.join(distPath, 'assets')
  if (fs.existsSync(assetsPath)) {
    fs.rmSync(assetsPath, { recursive: true, force: true })
    console.log('  ✅ Carpeta assets eliminada')
  }

  console.log('\n✅ Proceso de inline completado!')
}

inlineAssets().catch(error => {
  console.error('❌ Error:', error)
  process.exit(1)
})
