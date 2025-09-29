<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Dashboard</h1>
        <p class="text-muted-foreground mt-1">Bienvenido a APIcat - Gestión de APIs Local</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Total APIs</p>
            <p class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">{{ stats.totalApis }}</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Plug class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Documentos</p>
            <p class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">{{ stats.totalDocs }}</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
            <BookOpen class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Pruebas</p>
            <p class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mt-2">{{ stats.totalTests }}</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <TestTube2 class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Historial</p>
            <p class="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mt-2">{{ stats.totalHistory }}</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30">
            <History class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-card border border-border rounded-lg p-6">
      <h2 class="text-lg font-semibold text-foreground mb-4">Actividad Reciente</h2>
      <div class="space-y-4">
        <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start gap-4 py-3 border-b border-border last:border-0">
          <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
            <component :is="activity.icon" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-foreground">{{ activity.title }}</p>
            <p class="text-xs text-muted-foreground mt-1">{{ activity.description }}</p>
          </div>
          <span class="text-xs text-muted-foreground flex-shrink-0">{{ activity.time }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <button @click="navigateTo('/apis')" class="relative bg-card border border-border rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 text-left group overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Plug class="relative w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
        <h3 class="relative text-lg font-semibold text-foreground mb-2">Explorar APIs</h3>
        <p class="relative text-sm text-muted-foreground">Navega y gestiona tus endpoints</p>
      </button>

      <button @click="navigateTo('/tests')" class="relative bg-card border border-border rounded-lg p-6 hover:border-purple-500/50 transition-all duration-300 text-left group overflow-hidden hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <TestTube2 class="relative w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
        <h3 class="relative text-lg font-semibold text-foreground mb-2">Ejecutar Pruebas</h3>
        <p class="relative text-sm text-muted-foreground">Prueba tus APIs localmente</p>
      </button>

      <button @click="navigateTo('/docs')" class="relative bg-card border border-border rounded-lg p-6 hover:border-indigo-500/50 transition-all duration-300 text-left group overflow-hidden hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <BookOpen class="relative w-8 h-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
        <h3 class="relative text-lg font-semibold text-foreground mb-2">Ver Documentos</h3>
        <p class="relative text-sm text-muted-foreground">Accede a la documentación</p>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plug, BookOpen, TestTube2, History, FileText, CheckCircle, AlertCircle } from 'lucide-vue-next'

const router = useRouter()

const stats = ref({
  totalApis: 48,
  totalDocs: 22,
  totalTests: 14,
  totalHistory: 156
})

const recentActivity = ref([
  {
    id: 1,
    icon: FileText,
    title: 'Nuevo documento generado',
    description: 'cat.docs/introduction.json',
    time: 'Hace 2 min'
  },
  {
    id: 2,
    icon: CheckCircle,
    title: 'Prueba exitosa',
    description: 'GET /api/users - 200 OK',
    time: 'Hace 15 min'
  },
  {
    id: 3,
    icon: Plug,
    title: 'API actualizada',
    description: 'cat.api/authentication.json',
    time: 'Hace 1 hora'
  },
  {
    id: 4,
    icon: AlertCircle,
    title: 'Advertencia de esquema',
    description: 'Revisar tipos en user.schema.ts',
    time: 'Hace 2 horas'
  }
])

const navigateTo = (path) => {
  router.push(path)
}
</script>