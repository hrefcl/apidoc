<template>
  <div class="flex h-screen bg-background overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-card border-r border-border flex flex-col">
      <!-- Logo/Brand -->
      <div class="h-16 flex items-center px-6 border-b border-border">
        <div class="flex items-center gap-3">
          <div class="relative w-10 h-10 flex items-center justify-center">
            <!-- Gradient background -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-lg"></div>
            <!-- Icon -->
            <Sparkles class="relative w-6 h-6 text-white" />
          </div>
          <div class="flex flex-col">
            <h1 class="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">APIcat</h1>
            <span class="text-xs text-muted-foreground">API Documentation</span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <router-link
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="isActive(item.path) 
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- User Section -->
      <div class="px-3 py-4 border-t border-border">
        <div class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Usuario</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">Local Mode</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="h-16 bg-card border-b border-border flex items-center justify-between px-6">
        <!-- Breadcrumb / Title -->
        <div>
          <h2 class="text-lg font-semibold text-foreground">{{ currentPageTitle }}</h2>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <!-- Search -->
          <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
            <Search class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <!-- Theme Toggle -->
          <button @click="toggleTheme" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
            <Moon v-if="!isDark" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <Sun v-else class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <!-- Notifications -->
          <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md relative">
            <Bell class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Home, Plug, TestTube2, BookOpen, History, Settings, Search, Bell, Moon, Sun, Sparkles } from 'lucide-vue-next'

const route = useRoute()
const isDark = ref(false)

const navigation = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/apis', label: 'APIs', icon: Plug },
  { path: '/tests', label: 'Pruebas', icon: TestTube2 },
  { path: '/docs', label: 'Documentos', icon: BookOpen },
  { path: '/history', label: 'Historial', icon: History },
  { path: '/settings', label: 'Ajustes', icon: Settings },
]

const currentPageTitle = computed(() => {
  const item = navigation.find(n => n.path === route.path)
  return item ? item.label : 'APIcat'
})

const isActive = (path) => {
  return route.path === path
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})
</script>
