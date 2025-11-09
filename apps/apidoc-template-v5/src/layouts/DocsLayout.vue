<template>
  <div class="min-h-screen flex flex-col bg-background">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div class="container mx-auto flex h-16 items-center justify-between px-6">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div class="relative w-10 h-10 flex items-center justify-center">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-lg"></div>
            <Sparkles class="relative w-6 h-6 text-white" />
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              APIDoc
            </span>
            <span class="text-xs text-muted-foreground">v5.0</span>
          </div>
        </router-link>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-6">
          <router-link to="/" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {{ t('nav.home') }}
          </router-link>
          <router-link
            v-if="hasDocsSection"
            to="/docs"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {{ t('nav.docs') }}
          </router-link>
          <router-link
            v-if="hasApiSection"
            to="/api"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {{ t('nav.api') }}
          </router-link>
          <router-link
            v-if="hasTSDocSection"
            to="/tsdoc"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {{ t('nav.typescript') }}
          </router-link>
          <router-link
            v-if="hasModelsSection"
            to="/model"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {{ t('nav.models') }}
          </router-link>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <!-- Search -->
          <button @click="toggleSearch" class="p-2 hover:bg-muted rounded-lg transition-colors">
            <Search class="w-5 h-5 text-muted-foreground" />
          </button>

          <!-- UI Language Selector -->
          <LanguageSelector />

          <!-- Theme Toggle -->
          <button @click="toggleTheme" class="p-2 hover:bg-muted rounded-lg transition-colors">
            <Moon v-if="!isDark" class="w-5 h-5 text-muted-foreground" />
            <Sun v-else class="w-5 h-5 text-muted-foreground" />
          </button>

          <!-- GitHub -->
          <a
            v-if="githubUrl"
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 hover:bg-muted rounded-lg transition-colors"
            :title="t('nav.viewOnGithub')"
          >
            <Github class="w-5 h-5 text-muted-foreground" />
          </a>
        </div>
      </div>
    </header>

    <!-- Search Modal -->
    <SearchModal :isOpen="searchOpen" @close="searchOpen = false" />

    <!-- Main Content -->
    <div class="container mx-auto flex-1 flex">
      <!-- Sidebar -->
      <aside class="hidden lg:block w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 pr-6 border-r border-border">
        <!-- Expand/Collapse All Controls -->
        <div class="flex items-center justify-between mb-4 px-2">
          <button
            @click="expandAll"
            class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            {{ t('nav.expandAll') }}
          </button>
          <button
            @click="collapseAll"
            class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            {{ t('nav.collapseAll') }}
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="section in navigation" :key="section.title">
            <!-- Section Header - Collapsible -->
            <button
              @click="toggleSection(section.title)"
              class="flex items-center justify-between w-full gap-2 mb-2 hover:bg-muted/50 rounded-lg p-2 transition-colors"
            >
              <div class="flex items-center gap-2">
                <component :is="getIcon(section.icon)" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h4 class="text-sm font-semibold text-foreground">{{ section.title }}</h4>
              </div>
              <ChevronDown
                class="w-4 h-4 text-muted-foreground transition-transform"
                :class="{ 'rotate-180': collapsedSections[section.title] }"
              />
            </button>

            <!-- Section Content -->
            <div v-show="!collapsedSections[section.title]">
              <!-- Section with subgroups (como API Reference) -->
              <div v-if="section.subgroups" class="space-y-3 ml-2">
                <div v-for="subgroup in section.subgroups" :key="subgroup.title">
                  <!-- Subgroup Header - Clickable + Collapsible -->
                  <div class="flex items-center gap-1 mb-1">
                    <!-- Link to section if sectionPath exists -->
                    <router-link
                      v-if="subgroup.sectionPath"
                      :to="subgroup.sectionPath"
                      @click="closeMobileMenu"
                      class="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary px-1.5 py-1 rounded flex-1 transition-colors"
                    >
                      <component :is="getIcon(subgroup.icon)" class="w-3 h-3" />
                      <span>{{ subgroup.title }}</span>
                    </router-link>
                    <!-- Just text if no sectionPath -->
                    <div v-else class="flex items-center gap-2 text-xs font-medium text-muted-foreground px-1.5 py-1 flex-1">
                      <component :is="getIcon(subgroup.icon)" class="w-3 h-3" />
                      <span>{{ subgroup.title }}</span>
                    </div>
                    <!-- Collapse toggle button -->
                    <button
                      @click="toggleSubgroup(section.title, subgroup.title)"
                      class="hover:bg-muted/30 rounded p-1 transition-colors"
                    >
                      <ChevronDown
                        class="w-3 h-3 text-muted-foreground transition-transform"
                        :class="{ 'rotate-180': collapsedSubgroups[`${section.title}::${subgroup.title}`] }"
                      />
                    </button>
                  </div>

                  <!-- Subgroup Items -->
                  <ul
                    v-show="!collapsedSubgroups[`${section.title}::${subgroup.title}`]"
                    class="space-y-1 ml-4"
                  >
                    <li v-for="item in subgroup.items" :key="item.path">
                      <router-link
                        :to="item.path"
                        class="block py-1.5 px-2 text-xs rounded-lg transition-colors"
                        :class="isActive(item.path)
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
                      >
                        <span class="truncate">{{ item.title }}</span>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Section with direct items (como Docs, TypeScript, Models) -->
              <ul v-else class="space-y-1 ml-2">
                <li v-for="item in section.items" :key="item.path">
                  <router-link
                    :to="item.path"
                    class="block py-2 px-3 text-sm rounded-lg transition-colors"
                    :class="isActive(item.path)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
                  >
                    <div class="flex items-center gap-2">
                      <component :is="getIcon(item.icon)" class="w-4 h-4" />
                      <span class="truncate">{{ item.title }}</span>
                    </div>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      <!-- Content -->
      <main class="flex-1 py-6 lg:px-8">
        <router-view />
      </main>
    </div>

    <!-- Mobile Menu Toggle -->
    <button @click="toggleMobileMenu" class="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white z-40">
      <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
      <X v-else class="w-6 h-6" />
    </button>

    <!-- Mobile Menu -->
    <Transition name="slide-up">
      <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 top-16 bg-card z-30 overflow-y-auto">
        <div class="p-6">
          <div v-for="section in navigation" :key="section.title" class="mb-6">
            <!-- Section Header -->
            <div class="flex items-center gap-2 mb-3">
              <component :is="getIcon(section.icon)" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <h4 class="text-sm font-semibold text-foreground">{{ section.title }}</h4>
            </div>

            <!-- Section with subgroups -->
            <div v-if="section.subgroups" class="space-y-4">
              <div v-for="subgroup in section.subgroups" :key="subgroup.title" class="ml-2">
                <div class="flex items-center gap-2 mb-2 text-xs font-medium text-muted-foreground">
                  <component :is="getIcon(subgroup.icon)" class="w-3 h-3" />
                  <span>{{ subgroup.title }}</span>
                </div>
                <ul class="space-y-1 ml-2">
                  <li v-for="item in subgroup.items" :key="item.path">
                    <router-link
                      :to="item.path"
                      @click="closeMobileMenu"
                      class="block py-1.5 px-2 text-xs rounded-lg transition-colors"
                      :class="isActive(item.path)
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
                    >
                      <span class="truncate">{{ item.title }}</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Section with direct items -->
            <ul v-else class="space-y-1">
              <li v-for="item in section.items" :key="item.path">
                <router-link
                  :to="item.path"
                  @click="closeMobileMenu"
                  class="block py-2 px-3 text-sm rounded-lg transition-colors"
                  :class="isActive(item.path)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
                >
                  <div class="flex items-center gap-2">
                    <component :is="getIcon(item.icon)" class="w-4 h-4" />
                    <span>{{ item.title }}</span>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDocsStore } from '@/stores/docs'
import { useI18n } from 'vue-i18n'
import LanguageSelector from '@/components/LanguageSelectorSimple.vue'
import SearchModal from '@/components/SearchModal.vue'
import {
  Sparkles, Search, Moon, Sun, Github, Menu, X,
  FileText, Plug, BookOpen, Code, User, Users, Building,
  Settings, MapPin, Tags, Folder, ChevronDown
} from 'lucide-vue-next'
import { reactive } from 'vue'

const { t } = useI18n()
const route = useRoute()
const docsStore = useDocsStore()

const isDark = ref(false)
const mobileMenuOpen = ref(false)
const searchOpen = ref(false)
const collapsedSections = reactive({})
const collapsedSubgroups = reactive({})

// Detectar qué secciones existen
const hasDocsSection = computed(() => {
  return navigation.value.some(section => section.title === 'Documentación')
})

const hasApiSection = computed(() => {
  return navigation.value.some(section => section.title === 'API Reference')
})

const hasTSDocSection = computed(() => {
  return navigation.value.some(section => section.title === 'TypeScript Docs')
})

const hasModelsSection = computed(() => {
  return navigation.value.some(section => section.title === 'Models')
})

// Cargar documentos al montar
onMounted(async () => {
  await docsStore.loadDocs()

  // Detectar tema
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
})

// Navegación basada en documentos cargados
const navigation = computed(() => {
  return docsStore.getSidebarNav || []
})

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

const toggleSearch = () => {
  searchOpen.value = !searchOpen.value
}

// Collapse/Expand functionality
const toggleSection = (sectionTitle) => {
  collapsedSections[sectionTitle] = !collapsedSections[sectionTitle]
}

const toggleSubgroup = (sectionTitle, subgroupTitle) => {
  const key = `${sectionTitle}::${subgroupTitle}`
  collapsedSubgroups[key] = !collapsedSubgroups[key]
}

const expandAll = () => {
  // Expandir todas las secciones
  Object.keys(collapsedSections).forEach(key => {
    collapsedSections[key] = false
  })
  // Expandir todos los subgrupos
  Object.keys(collapsedSubgroups).forEach(key => {
    collapsedSubgroups[key] = false
  })
}

const collapseAll = () => {
  // Contraer todas las secciones
  navigation.value.forEach(section => {
    collapsedSections[section.title] = true

    // Contraer todos los subgrupos de esta sección
    if (section.subgroups) {
      section.subgroups.forEach(subgroup => {
        const key = `${section.title}::${subgroup.title}`
        collapsedSubgroups[key] = true
      })
    }
  })
}

// Computed para obtener URL de GitHub desde meta
const githubUrl = computed(() => {
  const meta = docsStore.meta
  if (!meta) return null

  // Extraer URL del repositorio de diferentes formatos
  if (meta.repository?.url) {
    // Limpiar formato git+ y .git
    let url = meta.repository.url
    url = url.replace('git+', '')
    url = url.replace('.git', '')
    return url
  }

  // Fallback a homepage si contiene github.com
  if (meta.homepage?.includes('github.com')) {
    return meta.homepage
  }

  return null
})

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const isActive = (path) => {
  return route.path === path
}

const getIcon = (iconName) => {
  const icons = {
    'plug': Plug,
    'Plug': Plug,
    'book-open': BookOpen,
    'BookOpen': BookOpen,
    'code': Code,
    'Code': Code,
    'file-text': FileText,
    'FileText': FileText,
    'User': User,
    'Users': Users,
    'Building': Building,
    'Settings': Settings,
    'MapPin': MapPin,
    'Tags': Tags,
    'Folder': Folder
  }
  return icons[iconName] || FileText
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>