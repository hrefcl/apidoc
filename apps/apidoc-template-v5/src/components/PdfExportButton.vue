<template>
  <!-- Botón de exportación PDF -->
  <button
    @click="startPdfGeneration"
    :disabled="isGenerating"
    class="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    :title="t('pdf.exportToPdf')"
  >
    <FileDown v-if="!isGenerating" class="w-5 h-5 text-muted-foreground" />
    <Loader2 v-else class="w-5 h-5 text-muted-foreground animate-spin" />
  </button>

  <!-- Modal de progreso -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div
          class="bg-card rounded-lg shadow-2xl max-w-md w-full border border-border overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div class="flex items-center gap-3 text-white">
              <FileDown class="w-6 h-6" />
              <div class="flex-1">
                <h3 class="text-lg font-bold">
                  {{ isGenerating ? t('pdf.generating') : isDone ? t('pdf.completed') : t('pdf.error') }}
                </h3>
                <p class="text-sm text-white/80">
                  {{ progress.message }}
                </p>
              </div>
              <button
                v-if="!isGenerating"
                @click="closeModal"
                class="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-6 space-y-4">
            <!-- Barra de progreso -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">{{ getStageLabel(progress.stage) }}</span>
                <span class="font-semibold text-foreground">{{ progress.percentage }}%</span>
              </div>
              <div class="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
                  :style="{ width: progress.percentage + '%' }"
                ></div>
              </div>
              <div class="flex items-center justify-between text-xs text-muted-foreground">
                <span>{{ progress.current }} / {{ progress.total }}</span>
                <span v-if="progress.currentSection">{{ progress.currentSection }}</span>
              </div>
            </div>

            <!-- Animación de carga -->
            <div v-if="isGenerating" class="flex items-center justify-center py-4">
              <Loader2 class="w-8 h-8 text-primary animate-spin" />
            </div>

            <!-- Mensaje de éxito -->
            <div v-if="isDone" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <CheckCircle2 class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-green-900 dark:text-green-100">
                    {{ t('pdf.successMessage') }}
                  </p>
                  <p class="text-xs text-green-700 dark:text-green-300 mt-1">
                    {{ fileName }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Mensaje de error -->
            <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <AlertCircle class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-red-900 dark:text-red-100">
                    {{ t('pdf.errorMessage') }}
                  </p>
                  <p class="text-xs text-red-700 dark:text-red-300 mt-1">
                    {{ error }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                v-if="!isGenerating"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {{ t('pdf.close') }}
              </button>
              <button
                v-if="isDone"
                @click="downloadAgain"
                class="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Download class="w-4 h-4 inline-block mr-2" />
                {{ t('pdf.downloadAgain') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDocsStore } from '@/stores/docs'
import { PdfGenerator, type PdfProgress, type PdfConfig } from '@/utils/pdf-generator'
import {
  FileDown,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Download
} from 'lucide-vue-next'

const { t } = useI18n()
const docsStore = useDocsStore()

// Props
interface Props {
  config?: PdfConfig
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({})
})

// Estado
const isGenerating = ref(false)
const isDone = ref(false)
const showModal = ref(false)
const error = ref<string | null>(null)
const generatedBlob = ref<Blob | null>(null)

const progress = ref<PdfProgress>({
  stage: 'preparing',
  current: 0,
  total: 100,
  message: 'Preparando...',
  percentage: 0
})

// Nombre del archivo
const fileName = computed(() => {
  const meta = docsStore.meta
  const name = meta?.name || 'api-documentation'
  const version = meta?.version || ''
  const sanitized = name.toLowerCase().replace(/\s+/g, '-')
  return version ? `${sanitized}-v${version}.pdf` : `${sanitized}.pdf`
})

// Labels de etapas
const getStageLabel = (stage: string): string => {
  const labels: Record<string, string> = {
    preparing: t('pdf.stages.preparing'),
    cover: t('pdf.stages.cover'),
    index: t('pdf.stages.index'),
    content: t('pdf.stages.content'),
    finalizing: t('pdf.stages.finalizing'),
    done: t('pdf.stages.done')
  }
  return labels[stage] || stage
}

// Iniciar generación de PDF
const startPdfGeneration = async () => {
  if (isGenerating.value) return

  try {
    isGenerating.value = true
    isDone.value = false
    error.value = null
    showModal.value = true

    // Configuración del PDF
    const pdfConfig: PdfConfig = {
      ...props.config,
      fileName: fileName.value
    }

    // Crear generador
    const generator = new PdfGenerator(pdfConfig)

    // Generar PDF con callback de progreso
    const blob = await generator.generate((prog) => {
      progress.value = prog
    })

    // Guardar blob para descarga posterior
    generatedBlob.value = blob

    // Descargar automáticamente
    await PdfGenerator.downloadPdf(blob, fileName.value)

    isDone.value = true
  } catch (err) {
    console.error('Error al generar PDF:', err)
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    isGenerating.value = false
  }
}

// Descargar nuevamente
const downloadAgain = async () => {
  if (generatedBlob.value) {
    await PdfGenerator.downloadPdf(generatedBlob.value, fileName.value)
  }
}

// Cerrar modal
const closeModal = () => {
  if (!isGenerating.value) {
    showModal.value = false
    setTimeout(() => {
      isDone.value = false
      error.value = null
      generatedBlob.value = null
    }, 300)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
