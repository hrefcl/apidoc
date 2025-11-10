import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Configuración del generador de PDF
 */
export interface PdfConfig {
  pageSize?: 'A4' | 'Letter'
  orientation?: 'portrait' | 'landscape'
  includeIndex?: boolean
  includeCover?: boolean
  logo?: boolean
  margin?: number
  quality?: number
  fileName?: string
}

/**
 * Información de progreso de generación
 */
export interface PdfProgress {
  stage: 'preparing' | 'cover' | 'index' | 'content' | 'finalizing' | 'done'
  current: number
  total: number
  currentSection?: string
  message: string
  percentage: number
}

/**
 * Callback de progreso
 */
export type ProgressCallback = (progress: PdfProgress) => void

/**
 * Generador de PDF para documentación APIDoc
 */
export class PdfGenerator {
  private config: Required<PdfConfig>
  private pdf: jsPDF | null = null
  private currentY = 0
  private pageHeight = 0
  private pageWidth = 0
  private margin = 20
  private sectionPages: Map<string, number> = new Map() // Mapa de sección -> número de página
  private endpointPositions: Map<string, { page: number; y: number }> = new Map() // Mapa de endpoint ID -> {página, posición Y}

  constructor(config: PdfConfig = {}) {
    this.config = {
      pageSize: config.pageSize || 'A4',
      orientation: config.orientation || 'portrait',
      includeIndex: config.includeIndex !== false,
      includeCover: config.includeCover !== false,
      logo: config.logo !== false,
      margin: config.margin || 20,
      quality: config.quality || 2,
      fileName: config.fileName || 'api-documentation.pdf'
    }
    this.margin = this.config.margin
  }

  /**
   * Generar PDF completo
   */
  async generate(onProgress?: ProgressCallback): Promise<Blob> {
    try {
      // Inicializar PDF
      this.pdf = new jsPDF({
        orientation: this.config.orientation,
        unit: 'mm',
        format: this.config.pageSize
      })

      this.pageHeight = this.pdf.internal.pageSize.getHeight()
      this.pageWidth = this.pdf.internal.pageSize.getWidth()
      this.currentY = this.margin

      // 1. Preparación
      this.reportProgress(onProgress, {
        stage: 'preparing',
        current: 0,
        total: 100,
        message: 'Preparando generación de PDF...',
        percentage: 0
      })

      // Obtener datos de la documentación
      const docData = this.getDocumentationData()
      const sections = this.getSections()

      let currentStep = 0
      const totalSteps = 1 + (this.config.includeCover ? 1 : 0) + (this.config.includeIndex ? 1 : 0) + sections.length

      // 2. Generar portada
      if (this.config.includeCover) {
        currentStep++
        this.reportProgress(onProgress, {
          stage: 'cover',
          current: currentStep,
          total: totalSteps,
          message: 'Generando portada...',
          percentage: Math.round((currentStep / totalSteps) * 100)
        })
        await this.generateCover(docData)
      }

      // 3. Generar índice PRIMERO (para saber cuántas páginas ocupa)
      let indexPageCount = 0
      if (this.config.includeIndex) {
        currentStep++
        this.reportProgress(onProgress, {
          stage: 'index',
          current: currentStep,
          total: totalSteps,
          message: 'Generando índice...',
          percentage: Math.round((currentStep / totalSteps) * 100)
        })

        const pageBeforeIndex = this.pdf.getNumberOfPages()
        await this.generateIndexPlaceholder(sections)
        const pageAfterIndex = this.pdf.getNumberOfPages()
        indexPageCount = pageAfterIndex - pageBeforeIndex
      }

      // 4. Generar contenido de cada sección
      for (const section of sections) {
        currentStep++
        this.reportProgress(onProgress, {
          stage: 'content',
          current: currentStep,
          total: totalSteps,
          currentSection: section.title,
          message: `Procesando sección: ${section.title}`,
          percentage: Math.round((currentStep / totalSteps) * 100)
        })

        // Guardar el número de página donde comienza esta sección
        this.sectionPages.set(section.id, this.pdf.getNumberOfPages() + 1)
        await this.generateSection(section)
      }

      // 5. Actualizar el índice con los números de página correctos
      if (this.config.includeIndex) {
        const coverPages = this.config.includeCover ? 1 : 0
        const indexStartPage = coverPages + 1
        await this.updateIndexWithPageNumbers(sections, indexStartPage, indexPageCount)
      }

      // 5. Finalizar
      this.reportProgress(onProgress, {
        stage: 'finalizing',
        current: totalSteps,
        total: totalSteps,
        message: 'Finalizando PDF...',
        percentage: 95
      })

      // Agregar numeración de páginas
      this.addPageNumbers()

      // 6. Completado
      this.reportProgress(onProgress, {
        stage: 'done',
        current: totalSteps,
        total: totalSteps,
        message: '¡PDF generado exitosamente!',
        percentage: 100
      })

      return this.pdf.output('blob')
    } catch (error) {
      console.error('Error generando PDF:', error)
      throw error
    }
  }

  /**
   * Generar portada del PDF - DISEÑO PROFESIONAL
   */
  private async generateCover(docData: any): Promise<void> {
    if (!this.pdf) return

    const pageWidth = this.pageWidth
    const pageHeight = this.pageHeight

    // === DISEÑO MINIMALISTA Y PROFESIONAL ===

    // Banda superior elegante
    this.pdf.setFillColor(45, 55, 72) // Gris oscuro profesional
    this.pdf.rect(0, 0, pageWidth, 60, 'F')

    // Logo/Marca pequeño y discreto
    this.pdf.setTextColor(255, 255, 255)
    this.pdf.setFontSize(9)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.text('API DOCUMENTATION', this.margin, 15)

    // Línea decorativa delgada
    this.pdf.setDrawColor(59, 130, 246)
    this.pdf.setLineWidth(0.5)
    this.pdf.line(this.margin, 20, pageWidth - this.margin, 20)

    // Título principal - centrado verticalmente
    const centerY = pageHeight / 2 - 20

    this.pdf.setTextColor(45, 55, 72)
    this.pdf.setFontSize(36)
    this.pdf.setFont('helvetica', 'bold')
    const title = docData.name || 'API Documentation'
    this.pdf.text(title, pageWidth / 2, centerY, { align: 'center' })

    // Descripción
    if (docData.description) {
      this.pdf.setFontSize(12)
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.setTextColor(100, 100, 100)
      const descLines = this.pdf.splitTextToSize(docData.description, pageWidth - 80)
      this.pdf.text(descLines, pageWidth / 2, centerY + 15, { align: 'center' })
    }

    // Versión en badge elegante
    if (docData.version) {
      const badgeY = centerY + 35
      const badgeWidth = 60
      const badgeHeight = 12
      const badgeX = (pageWidth - badgeWidth) / 2

      // Fondo del badge
      this.pdf.setFillColor(59, 130, 246)
      this.pdf.roundedRect(badgeX, badgeY - 8, badgeWidth, badgeHeight, 2, 2, 'F')

      // Texto del badge
      this.pdf.setTextColor(255, 255, 255)
      this.pdf.setFontSize(10)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(`Version ${docData.version}`, pageWidth / 2, badgeY, { align: 'center' })
    }

    // Footer discreto
    this.pdf.setFontSize(9)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.setTextColor(120, 120, 120)

    const date = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    this.pdf.text(`Generado el ${date}`, pageWidth / 2, pageHeight - 30, { align: 'center' })

    // Powered by muy discreto
    this.pdf.setFontSize(7)
    this.pdf.setTextColor(160, 160, 160)
    this.pdf.text('APIDoc v5.0', pageWidth / 2, pageHeight - 20, { align: 'center' })

    // Nueva página para contenido
    this.pdf.addPage()
    this.currentY = this.margin
  }

  /**
   * Generar índice placeholder (sin números de página)
   */
  private async generateIndexPlaceholder(sections: any[]): Promise<void> {
    if (!this.pdf) return

    this.currentY = this.margin

    // Título del índice con línea decorativa
    this.pdf.setTextColor(45, 55, 72)
    this.pdf.setFontSize(28)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('Índice', this.margin, this.currentY)
    this.currentY += 3

    // Línea decorativa bajo el título
    this.pdf.setDrawColor(59, 130, 246)
    this.pdf.setLineWidth(0.8)
    this.pdf.line(this.margin, this.currentY, this.margin + 40, this.currentY)
    this.currentY += 12

    for (const section of sections) {
      // Verificar si necesitamos nueva página
      if (this.currentY > this.pageHeight - this.margin - 30) {
        this.pdf.addPage()
        this.currentY = this.margin
      }

      // Sección principal con fondo sutil
      const sectionBoxWidth = this.pageWidth - (this.margin * 2)
      this.pdf.setFillColor(245, 247, 250)
      this.pdf.roundedRect(this.margin, this.currentY - 5, sectionBoxWidth, 10, 1, 1, 'F')

      // Texto de la sección
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.setFontSize(14)
      this.pdf.setTextColor(45, 55, 72)
      this.pdf.text(section.title, this.margin + 4, this.currentY)

      // Placeholder para número de página
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.setFontSize(12)
      this.pdf.setTextColor(100, 100, 100)
      this.pdf.text('--', this.pageWidth - this.margin - 10, this.currentY, { align: 'right' })

      this.currentY += 10

      // Obtener endpoints para esta sección
      const endpoints = this.getEndpointsForSection(section.id)

      if (endpoints && endpoints.length > 0) {
        this.pdf.setFont('helvetica', 'normal')
        this.pdf.setFontSize(10)
        this.pdf.setTextColor(80, 80, 80)

        for (const endpoint of endpoints.slice(0, 30)) {
          if (this.currentY > this.pageHeight - this.margin - 10) {
            this.pdf.addPage()
            this.currentY = this.margin
          }

          // Punto decorativo
          this.pdf.setFillColor(59, 130, 246)
          this.pdf.circle(this.margin + 9, this.currentY - 1.5, 0.8, 'F')

          // Título del endpoint
          const itemText = endpoint.title || 'Sin título'
          this.pdf.text(itemText, this.margin + 13, this.currentY)
          this.currentY += 5.5
        }
      }

      this.currentY += 4
    }
  }

  /**
   * Actualizar índice con números de página y enlaces
   */
  private async updateIndexWithPageNumbers(sections: any[], indexStartPage: number, indexPageCount: number): Promise<void> {
    if (!this.pdf) return

    let currentIndexPage = indexStartPage
    this.pdf.setPage(currentIndexPage)
    this.currentY = this.margin + 15 // Debe coincidir con generateIndexPlaceholder (margin + 3 + 12)

    for (const section of sections) {
      // Verificar si necesitamos cambiar de página
      if (this.currentY > this.pageHeight - this.margin - 30) {
        currentIndexPage++
        this.pdf.setPage(currentIndexPage)
        this.currentY = this.margin
      }

      // Obtener número de página de esta sección
      const pageNumber = this.sectionPages.get(section.id) || 0

      // Actualizar número de página (sobrescribir el placeholder)
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.setFontSize(12)
      this.pdf.setTextColor(100, 100, 100)

      // Borrar área del número anterior (dibujar rectángulo blanco)
      this.pdf.setFillColor(255, 255, 255)
      this.pdf.rect(this.pageWidth - this.margin - 20, this.currentY - 5, 20, 7, 'F')

      // Guardar posición Y donde está la línea (el título YA está escrito por generateIndexPlaceholder)
      const lineY = this.currentY

      // Calcular ancho del título (sin escribirlo de nuevo, ya existe)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.setFontSize(14)
      const sectionText = section.title
      const sectionTextWidth = this.pdf.getTextWidth(sectionText)

      // Sobrescribir el "--" placeholder con el número de página real
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.setFontSize(12)
      this.pdf.setTextColor(100, 100, 100)
      const pageNumText = `${pageNumber}`
      const pageNumX = this.pageWidth - this.margin - 10
      const pageNumWidth = this.pdf.getTextWidth(pageNumText)

      // Escribir el número de página (sobrescribe el "--")
      this.pdf.text(pageNumText, pageNumX, lineY, { align: 'right' })

      // Crear área de enlace sobre el título de la sección
      // La caja gris se dibujó en generateIndexPlaceholder en (lineY - 5) con altura 10
      const linkBoxY = lineY - 5
      this.pdf.link(this.margin + 4, linkBoxY, sectionTextWidth, 10, { pageNumber: pageNumber })

      // Crear enlace sobre el número de página
      this.pdf.link(pageNumX - pageNumWidth, linkBoxY, pageNumWidth, 10, { pageNumber: pageNumber })

      this.currentY += 10

      // Obtener endpoints
      const endpoints = this.getEndpointsForSection(section.id)

      if (endpoints && endpoints.length > 0) {
        this.pdf.setFont('helvetica', 'normal')
        this.pdf.setFontSize(10)

        for (const endpoint of endpoints.slice(0, 30)) {
          if (this.currentY > this.pageHeight - this.margin - 10) {
            currentIndexPage++
            this.pdf.setPage(currentIndexPage)
            this.currentY = this.margin
          }

          // Obtener posición exacta del endpoint (página y coordenada Y)
          const endpointId = `${endpoint.group}_${endpoint.name}_${endpoint.version || '1.0.0'}`
          const endpointPos = this.endpointPositions.get(endpointId)

          const itemText = endpoint.title || 'Sin título'
          const itemTextWidth = this.pdf.getTextWidth(itemText)

          // Crear enlace que va a la posición EXACTA del endpoint (no solo el inicio de página)
          if (endpointPos) {
            // Link con coordenada Y específica usando goTo
            this.pdf.link(this.margin + 13, this.currentY - 3, itemTextWidth, 6, {
              pageNumber: endpointPos.page
            })
          } else {
            // Fallback: ir al inicio de la sección si no encontramos posición exacta
            this.pdf.link(this.margin + 13, this.currentY - 3, itemTextWidth, 6, {
              pageNumber: pageNumber
            })
          }

          this.currentY += 5.5
        }
      }

      this.currentY += 4
    }
  }

  /**
   * Generar sección de contenido usando datos de __APICAT_DATA__
   */
  private async generateSection(section: any): Promise<void> {
    if (!this.pdf) return

    // Título de sección
    this.pdf.setTextColor(59, 130, 246)
    this.pdf.setFontSize(20)
    this.pdf.setFont('helvetica', 'bold')

    // Nueva página para cada sección
    if (this.currentY > this.margin) {
      this.pdf.addPage()
      this.currentY = this.margin
    }

    this.pdf.text(section.title, this.margin, this.currentY)
    this.currentY += 10

    // Obtener endpoints de esta sección desde __APICAT_DATA__
    const endpoints = this.getEndpointsForSection(section.id)

    if (endpoints.length > 0) {
      for (const endpoint of endpoints) {
        this.addEndpointToPdf(endpoint)
      }
    } else {
      // No hay endpoints, solo texto informativo
      this.pdf.setTextColor(100, 100, 100)
      this.pdf.setFontSize(10)
      this.pdf.setFont('helvetica', 'italic')
      this.pdf.text(`No hay endpoints en esta sección`, this.margin + 5, this.currentY)
      this.currentY += 8
    }
  }

  /**
   * Agregar endpoint al PDF - LAYOUT JERÁRQUICO MEJORADO
   */
  private addEndpointToPdf(endpoint: any): void {
    if (!this.pdf) return

    // Verificar espacio en página
    if (this.currentY > this.pageHeight - 60) {
      this.pdf.addPage()
      this.currentY = this.margin
    }

    // Guardar posición exacta de este endpoint para links del índice
    const endpointId = `${endpoint.group}_${endpoint.name}_${endpoint.version || '1.0.0'}`
    const currentPage = this.pdf.getCurrentPageInfo().pageNumber
    const currentYPos = this.currentY

    this.endpointPositions.set(endpointId, {
      page: currentPage,
      y: currentYPos
    })

    // Crear un marcador invisible en esta posición exacta
    // Esto servirá como "anchor" para los links del índice
    // No hay un método directo en jsPDF, pero podemos simular con un espacio en blanco muy pequeño
    // La posición exacta ya está guardada en endpointPositions

    const maxWidth = this.pageWidth - (this.margin * 2)
    const indent = 8 // Sangría para contenido

    // === TÍTULO DEL ENDPOINT ===
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.setFontSize(15)
    this.pdf.setTextColor(45, 55, 72)
    const titleLines = this.pdf.splitTextToSize(endpoint.title, maxWidth - indent)
    this.pdf.text(titleLines, this.margin + indent, this.currentY)
    this.currentY += titleLines.length * 6 + 2

    // === DESCRIPCIÓN (con sangría) ===
    if (endpoint.description) {
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.setFontSize(10)
      this.pdf.setTextColor(90, 90, 90)
      const desc = this.stripHtml(endpoint.description)
      const descLines = this.pdf.splitTextToSize(desc, maxWidth - indent)
      this.pdf.text(descLines, this.margin + indent, this.currentY)
      this.currentY += descLines.length * 5 + 4
    }

    // === VERSIÓN (si existe) ===
    if (endpoint.version) {
      this.pdf.setFontSize(9)
      this.pdf.setTextColor(120, 120, 120)
      this.pdf.setFont('helvetica', 'italic')
      this.pdf.text(`(versión ${endpoint.version})`, this.margin + indent, this.currentY)
      this.currentY += 6
    }

    this.currentY += 4

    // === Método y URL (sin texto "URL:") ===
    const methodColors: Record<string, number[]> = {
      GET: [59, 130, 246],     // Azul
      POST: [34, 197, 94],     // Verde
      PUT: [251, 146, 60],     // Naranja
      DELETE: [239, 68, 68],   // Rojo
      PATCH: [168, 85, 247],   // Púrpura
      PUBLISH: [236, 72, 153], // Rosa
      SUBSCRIBE: [14, 165, 233] // Cyan
    }

    const method = endpoint.method || endpoint.type || 'GET'
    const color = methodColors[method] || [100, 100, 100]

    // Badge del método
    this.pdf.setFillColor(color[0], color[1], color[2])
    this.pdf.setTextColor(255, 255, 255)
    this.pdf.roundedRect(this.margin + indent, this.currentY - 4, 20, 7, 1, 1, 'F')
    this.pdf.setFontSize(9)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(method, this.margin + indent + 10, this.currentY, { align: 'center' })

    // URL
    this.pdf.setTextColor(0, 0, 0)
    this.pdf.setFontSize(10)
    this.pdf.setFont('courier', 'normal')
    const url = endpoint.url || endpoint.topic || ''
    this.pdf.text(url, this.margin + indent + 23, this.currentY)
    this.currentY += 10

    // Línea separadora sutil
    this.pdf.setDrawColor(220, 220, 220)
    this.pdf.setLineWidth(0.3)
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    this.currentY += 6

    // Tabla de Parámetros
    const params = endpoint.parameters || endpoint.parameter?.fields?.Parameter || []
    if (params.length > 0) {
      this.addTableSection('Parámetros', params, ['Nombre', 'Tipo', 'Descripción', 'Requerido'])
      this.currentY += 2
    }

    // Tabla de Success Response
    if (endpoint.success?.fields) {
      const successFields = Object.values(endpoint.success.fields).flat() as any[]
      if (successFields.length > 0) {
        this.addTableSection(`Respuesta Exitosa (${endpoint.success.statusCode || '200'})`, successFields, ['Campo', 'Tipo', 'Descripción'])
        this.currentY += 2
      }
    }

    // Ejemplos de Success
    if (endpoint.success?.examples && endpoint.success.examples.length > 0) {
      this.addExampleSection('Ejemplo de Respuesta', endpoint.success.examples[0].content)
    }

    this.currentY += 10 // Espacio entre endpoints
  }

  /**
   * Agregar sección de tabla
   */
  private addTableSection(title: string, data: any[], headers: string[]): void {
    if (!this.pdf) return

    // Verificar espacio
    if (this.currentY > this.pageHeight - 40) {
      this.pdf.addPage()
      this.currentY = this.margin
    }

    // Título de la tabla
    this.pdf.setFontSize(10)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.setTextColor(0, 0, 0)
    this.pdf.text(title, this.margin + 2, this.currentY)
    this.currentY += 5

    // Header de la tabla
    const colWidths = this.calculateColumnWidths(headers.length)
    const rowHeight = 7
    let x = this.margin

    // Fondo del header
    this.pdf.setFillColor(230, 230, 230)
    this.pdf.rect(x, this.currentY - 5, this.pageWidth - (this.margin * 2), rowHeight, 'F')

    // Textos del header
    this.pdf.setFontSize(8)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.setTextColor(60, 60, 60)

    headers.forEach((header, i) => {
      this.pdf!.text(header, x + 2, this.currentY, { maxWidth: colWidths[i] - 4 })
      x += colWidths[i]
    })
    this.currentY += rowHeight

    // Filas de datos
    this.pdf.setFont('helvetica', 'normal')

    for (const row of data.slice(0, 20)) { // Max 20 rows
      if (this.currentY > this.pageHeight - this.margin - 10) {
        this.pdf.addPage()
        this.currentY = this.margin
      }

      x = this.margin
      const rowData = this.extractRowData(row, headers.length)

      // Alternar color de fondo
      const index = data.indexOf(row)
      if (index % 2 === 0) {
        this.pdf.setFillColor(250, 250, 250)
        this.pdf.rect(x, this.currentY - 5, this.pageWidth - (this.margin * 2), rowHeight, 'F')
      }

      this.pdf.setTextColor(0, 0, 0)
      this.pdf.setFontSize(7)

      rowData.forEach((cell, i) => {
        const cellText = this.pdf!.splitTextToSize(cell, colWidths[i] - 4)
        this.pdf!.text(cellText[0] || '', x + 2, this.currentY, { maxWidth: colWidths[i] - 4 })
        x += colWidths[i]
      })

      this.currentY += rowHeight
    }

    this.currentY += 3
  }

  /**
   * Agregar sección de ejemplo de código
   */
  private addExampleSection(title: string, content: string): void {
    if (!this.pdf) return

    if (this.currentY > this.pageHeight - 40) {
      this.pdf.addPage()
      this.currentY = this.margin
    }

    // Título
    this.pdf.setFontSize(10)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.setTextColor(0, 0, 0)
    this.pdf.text(title, this.margin + 2, this.currentY)
    this.currentY += 5

    // Caja de código
    const maxWidth = this.pageWidth - (this.margin * 2) - 4
    const lines = content.split('\n').slice(0, 15) // Max 15 líneas

    // Fondo gris
    const boxHeight = (lines.length * 4) + 6
    this.pdf.setFillColor(245, 245, 245)
    this.pdf.roundedRect(this.margin, this.currentY - 3, this.pageWidth - (this.margin * 2), boxHeight, 2, 2, 'F')

    // Texto del código
    this.pdf.setFont('courier', 'normal')
    this.pdf.setFontSize(7)
    this.pdf.setTextColor(40, 40, 40)

    for (const line of lines) {
      if (this.currentY > this.pageHeight - this.margin - 10) {
        this.pdf.addPage()
        this.currentY = this.margin
      }

      const trimmedLine = line.substring(0, 100) // Max 100 chars por línea
      this.pdf.text(trimmedLine, this.margin + 3, this.currentY)
      this.currentY += 4
    }

    this.currentY += 5
  }

  /**
   * Calcular anchos de columnas
   */
  private calculateColumnWidths(numCols: number): number[] {
    const totalWidth = this.pageWidth - (this.margin * 2)

    if (numCols === 3) {
      return [totalWidth * 0.25, totalWidth * 0.2, totalWidth * 0.55]
    } else if (numCols === 4) {
      return [totalWidth * 0.25, totalWidth * 0.15, totalWidth * 0.45, totalWidth * 0.15]
    }

    const colWidth = totalWidth / numCols
    return Array(numCols).fill(colWidth)
  }

  /**
   * Extraer datos de fila para tabla
   */
  private extractRowData(row: any, numCols: number): string[] {
    const field = row.field || row.name || ''
    const type = row.type || ''
    const desc = this.stripHtml(row.description || '')
    const required = row.required ? 'Sí' : 'No'

    if (numCols === 4) {
      return [field, type, desc, required]
    } else if (numCols === 3) {
      return [field, type, desc]
    }

    return [field, desc]
  }

  /**
   * Obtener endpoints de una sección desde api.{group}.endpoints
   */
  private getEndpointsForSection(sectionId: string): any[] {
    if (typeof window === 'undefined' || !window.__APICAT_DATA__?.api) {
      return []
    }

    const api = window.__APICAT_DATA__.api

    // Buscar el grupo que coincida con el sectionId
    // La estructura es: api.users.endpoints, api.company.endpoints, etc.
    const groupKey = sectionId.toLowerCase()

    if (api[groupKey] && api[groupKey].endpoints) {
      return api[groupKey].endpoints
    }

    // Fallback: buscar en todos los grupos
    const allEndpoints: any[] = []
    Object.keys(api).forEach(key => {
      if (api[key]?.endpoints && Array.isArray(api[key].endpoints)) {
        const groupEndpoints = api[key].endpoints.filter((ep: any) =>
          ep.group?.toLowerCase() === sectionId.toLowerCase()
        )
        allEndpoints.push(...groupEndpoints)
      }
    })

    return allEndpoints
  }

  /**
   * Eliminar tags HTML de texto
   */
  private stripHtml(html: string): string {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  /**
   * Agregar numeración de páginas
   */
  private addPageNumbers(): void {
    if (!this.pdf) return

    const totalPages = this.pdf.getNumberOfPages()

    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i)
      this.pdf.setFontSize(9)
      this.pdf.setTextColor(150, 150, 150)
      this.pdf.setFont('helvetica', 'normal')

      const pageText = `Página ${i} de ${totalPages}`
      this.pdf.text(
        pageText,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      )
    }
  }

  /**
   * Obtener datos de documentación del store
   */
  private getDocumentationData(): any {
    if (typeof window !== 'undefined' && window.__APICAT_DATA__) {
      return {
        name: window.__APICAT_DATA__.meta?.name || 'API Documentation',
        description: window.__APICAT_DATA__.meta?.description || '',
        version: window.__APICAT_DATA__.meta?.version || '1.0.0'
      }
    }
    return {
      name: 'API Documentation',
      description: '',
      version: '1.0.0'
    }
  }

  /**
   * Obtener secciones de navegación desde navigation.groups
   */
  private getSections(): any[] {
    if (typeof window !== 'undefined' && window.__APICAT_DATA__?.navigation?.groups) {
      const groups = window.__APICAT_DATA__.navigation.groups

      return groups.map((group: any) => ({
        id: group.id || group.title,
        title: group.title,
        icon: group.icon,
        endpoints: group.endpoints || []
      }))
    }
    return []
  }

  /**
   * Reportar progreso
   */
  private reportProgress(callback: ProgressCallback | undefined, progress: PdfProgress): void {
    if (callback) {
      callback(progress)
    }
  }

  /**
   * Descargar PDF generado
   */
  static async downloadPdf(blob: Blob, fileName: string): Promise<void> {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Type declarations para window
 */
declare global {
  interface Window {
    __APICAT_DATA__?: {
      meta?: {
        name?: string
        description?: string
        version?: string
      }
      navigation?: {
        sections?: any[]
      }
    }
  }
}
