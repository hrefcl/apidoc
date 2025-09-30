import { useI18n as vueUseI18n } from 'vue-i18n'
import { setLocale, getLocale, getAvailableLocales } from '../i18n'

/**
 * Composable para usar i18n con helpers adicionales
 */
export function useI18n() {
  const { t, locale, availableLocales } = vueUseI18n()

  /**
   * Cambiar idioma
   * @param {string} newLocale - Nuevo idioma (es, en)
   */
  const changeLocale = (newLocale) => {
    setLocale(newLocale)
  }

  /**
   * Obtener idioma actual
   * @returns {string} Idioma actual
   */
  const currentLocale = () => {
    return getLocale()
  }

  /**
   * Obtener idiomas disponibles
   * @returns {Array<string>} Array de idiomas disponibles
   */
  const locales = () => {
    return getAvailableLocales()
  }

  /**
   * Verificar si es el idioma actual
   * @param {string} checkLocale - Idioma a verificar
   * @returns {boolean} True si es el idioma actual
   */
  const isCurrentLocale = (checkLocale) => {
    return locale.value === checkLocale
  }

  return {
    t, // Función de traducción
    locale, // Reactive locale
    availableLocales, // Locales disponibles
    changeLocale, // Cambiar idioma
    currentLocale, // Obtener idioma actual
    locales, // Obtener lista de idiomas
    isCurrentLocale // Verificar si es idioma actual
  }
}