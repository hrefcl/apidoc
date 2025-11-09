<template>
  <div v-if="showLanguageSelector" class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium border border-border"
      :class="{ 'bg-muted': isOpen }"
      :title="t('apiLanguage.selectLanguage')"
    >
      <Languages class="w-4 h-4 text-muted-foreground" />
      <span class="text-foreground font-mono">{{ currentLanguage.toUpperCase() }}</span>
      <ChevronDown class="w-4 h-4 text-muted-foreground transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 min-w-[200px] bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
      >
        <div class="px-3 py-2 bg-muted/50 border-b border-border">
          <p class="text-xs font-medium text-muted-foreground">
            {{ t('apiLanguage.contentLanguage') }}
          </p>
        </div>
        <div class="max-h-[300px] overflow-y-auto">
          <button
            v-for="lang in availableLanguages"
            :key="lang"
            @click="changeLanguage(lang)"
            class="w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between gap-3"
            :class="currentLanguage === lang ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-medium' : 'text-foreground'"
          >
            <div class="flex items-center gap-2">
              <span class="text-lg">{{ getFlag(lang) }}</span>
              <div class="flex flex-col">
                <span class="font-medium">{{ getLanguageName(lang) }}</span>
                <span class="text-xs text-muted-foreground font-mono">{{ lang }}</span>
              </div>
            </div>
            <Check v-if="currentLanguage === lang" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDocsStore } from '@/stores/docs'
import { useI18n } from 'vue-i18n'
import { Languages, ChevronDown, Check } from 'lucide-vue-next'

const { t } = useI18n()
const docsStore = useDocsStore()
const isOpen = ref(false)
const dropdownRef = ref(null)

// Usar el store para obtener idioma actual y disponibles
const currentLanguage = computed(() => docsStore.currentLanguage || 'en')
const availableLanguages = computed(() => docsStore.availableLanguages || [])
const showLanguageSelector = computed(() => docsStore.showLanguageSelector)

// Nombres de idiomas completos
const languageNames = {
  es: 'Español',
  en: 'English',
  zh: '中文',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  it: 'Italiano',
  ru: 'Русский',
  ko: '한국어',
  ar: 'العربية',
  hi: 'हिन्दी'
}

// Banderas de países (usando códigos ISO 639-1)
const flags = {
  es: '🇪🇸',
  en: '🇬🇧',
  zh: '🇨🇳',
  pt: '🇧🇷',
  fr: '🇫🇷',
  de: '🇩🇪',
  ja: '🇯🇵',
  it: '🇮🇹',
  ru: '🇷🇺',
  ko: '🇰🇷',
  ar: '🇸🇦',
  hi: '🇮🇳'
}

const getLanguageName = (lang) => languageNames[lang] || lang.toUpperCase()
const getFlag = (lang) => flags[lang] || '🌐'

const changeLanguage = (lang) => {
  console.log('🌐 Changing API content language to:', lang)
  docsStore.setLanguage(lang)
  isOpen.value = false
}

// Cerrar dropdown al hacer click fuera
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  // Initialize i18n when component mounts (ensures __APICAT_DATA__ is available)
  if (typeof window !== 'undefined' && window.__APICAT_DATA__?.meta?.i18n?.enabled) {
    docsStore.initI18n()
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
