<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
      :class="{ 'bg-muted': isOpen }"
    >
      <Globe class="w-4 h-4 text-muted-foreground" />
      <span class="text-foreground">{{ currentLanguageName }}</span>
      <ChevronDown class="w-4 h-4 text-muted-foreground transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
      >
        <button
          v-for="lang in availableLocales"
          :key="lang"
          @click="changeLanguage(lang)"
          class="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between"
          :class="locale === lang ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-medium' : 'text-foreground'"
        >
          <span>{{ getLanguageName(lang) }}</span>
          <Check v-if="locale === lang" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Globe, ChevronDown, Check } from 'lucide-vue-next'

const { locale, availableLocales } = useI18n()
const isOpen = ref(false)
const dropdownRef = ref(null)

const languageNames = {
  es: 'Español',
  en: 'English'
}

const getLanguageName = (lang) => languageNames[lang] || lang.toUpperCase()

const currentLanguageName = computed(() => getLanguageName(locale.value))

const changeLanguage = (lang) => {
  console.log('Changing language to:', lang)
  locale.value = lang
  localStorage.setItem('apidoc-locale', lang)
  document.documentElement.lang = lang
  isOpen.value = false
  console.log('Language changed to:', locale.value)
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
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