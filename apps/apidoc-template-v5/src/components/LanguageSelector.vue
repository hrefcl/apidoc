<template>
  <div class="language-selector">
    <button
      @click="toggleDropdown"
      class="language-button"
      aria-label="Idioma / Language"
    >
      <span class="language-icon">🌐</span>
      <span class="language-text">{{ locale.toUpperCase() }}</span>
      <ChevronDown
        :class="['chevron', { 'rotate': isOpen }]"
        :size="16"
      />
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="language-dropdown">
        <button
          v-for="lang in availableLocales"
          :key="lang"
          @click="selectLanguage(lang)"
          class="language-option"
          :class="{ active: locale === lang }"
        >
          <span class="language-flag">{{ getFlag(lang) }}</span>
          <span class="language-name">{{ getLanguageName(lang) }}</span>
          <Check v-if="locale === lang" :size="16" class="check-icon" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown, Check } from 'lucide-vue-next'

const { t, locale, availableLocales } = useI18n()

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('apidoc-locale', lang)
  document.documentElement.lang = lang
  isOpen.value = false
}

const getFlag = (lang) => {
  const flags = {
    es: '🇪🇸',
    en: '🇬🇧',
    zh: '🇨🇳',
    pt: '🇧🇷',
    fr: '🇫🇷',
    de: '🇩🇪',
    ja: '🇯🇵'
  }
  return flags[lang] || '🌐'
}

const getLanguageName = (lang) => {
  const names = {
    es: 'Español',
    en: 'English',
    zh: '中文',
    pt: 'Português',
    fr: 'Français',
    de: 'Deutsch',
    ja: '日本語'
  }
  return names[lang] || lang
}

// Cerrar dropdown al hacer click fuera
const closeDropdown = (e) => {
  if (!e.target.closest('.language-selector')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.language-selector {
  position: relative;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: oklch(var(--muted) / 0.5);
  border: 1px solid oklch(var(--border));
  border-radius: 0.5rem;
  color: oklch(var(--foreground));
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.language-button:hover {
  background: oklch(var(--muted));
  border-color: oklch(var(--primary) / 0.5);
}

.language-icon {
  font-size: 1.125rem;
}

.language-text {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.chevron {
  transition: transform 0.2s;
}

.chevron.rotate {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 160px;
  background: oklch(var(--background));
  border: 1px solid oklch(var(--border));
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px oklch(0 0 0 / 0.1);
  overflow: hidden;
  z-index: 50;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: oklch(var(--foreground));
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
}

.language-option:hover {
  background: oklch(var(--muted));
}

.language-option.active {
  background: oklch(var(--primary) / 0.1);
  color: oklch(var(--primary));
  font-weight: 500;
}

.language-flag {
  font-size: 1.25rem;
}

.language-name {
  flex: 1;
}

.check-icon {
  color: oklch(var(--primary));
}

/* Animación dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>