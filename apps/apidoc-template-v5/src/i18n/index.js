import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'
import ptBR from './locales/pt-BR.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import ja from './locales/ja.json'

// Lista de idiomas soportados
const supportedLocales = ['es', 'en', 'zh', 'pt', 'fr', 'de', 'ja']

// Detectar idioma del navegador o usar español por defecto
const getBrowserLocale = () => {
  // SSR guard: navigator no existe en SSR
  if (typeof navigator === 'undefined') return 'es'

  const browserLocale = navigator.language || navigator.userLanguage
  const locale = browserLocale.split('-')[0] // 'es-ES' -> 'es', 'zh-CN' -> 'zh'

  // Verificar si el idioma está soportado
  return supportedLocales.includes(locale) ? locale : 'es'
}

// Cargar idioma guardado en localStorage o usar el del navegador
const getSavedLocale = () => {
  // SSR guard: localStorage no existe en SSR
  if (typeof localStorage === 'undefined') return 'es'

  return localStorage.getItem('apidoc-locale') || getBrowserLocale()
}

// Crear instancia de i18n
const i18n = createI18n({
  legacy: false, // Usar Composition API
  locale: getSavedLocale(),
  fallbackLocale: 'es',
  messages: {
    es,
    en,
    zh: zhCN,
    pt: ptBR,
    fr,
    de,
    ja
  },
  // Opciones globales
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false
})

// Función helper para cambiar idioma
export const setLocale = (locale) => {
  if (i18n.global.availableLocales.includes(locale)) {
    i18n.global.locale.value = locale

    // SSR guards
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('apidoc-locale', locale)
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }
}

// Función helper para obtener idioma actual
export const getLocale = () => {
  return i18n.global.locale.value
}

// Función helper para obtener idiomas disponibles
export const getAvailableLocales = () => {
  return i18n.global.availableLocales
}

export default i18n