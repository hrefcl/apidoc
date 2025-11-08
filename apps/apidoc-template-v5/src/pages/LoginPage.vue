<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Animated background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Language Selector - Fixed position top right INLINE -->
    <div class="fixed top-6 right-6 z-[9999]">
      <div class="relative">
        <button
          @click="isLangOpen = !isLangOpen"
          class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <span class="text-2xl">🌐</span>
          <span class="text-gray-900 dark:text-gray-100">{{ currentLang.toUpperCase() }}</span>
          <svg class="w-4 h-4 text-gray-500" :class="{ 'rotate-180': isLangOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          v-if="isLangOpen"
          class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-50"
        >
          <button
            v-for="lang in ['es', 'en', 'zh', 'pt', 'fr', 'de', 'ja']"
            :key="lang"
            @click="changeLang(lang)"
            class="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
            :class="currentLang === lang ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-gray-700 dark:text-gray-300'"
          >
            <span>{{ langNames[lang] }}</span>
            <span v-if="currentLang === lang" class="text-indigo-600 dark:text-indigo-400">✓</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Login card -->
    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Logo and header -->
      <div class="text-center">
        <div class="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 flex items-center justify-center shadow-2xl shadow-indigo-500/50 dark:shadow-indigo-900/50 transform hover:scale-110 transition-transform duration-300">
          <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
          {{ $t('login.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ $t('login.subtitle') }}
        </p>
      </div>

      <!-- Form card -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Email input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('login.email') }}
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="email"
                v-model="credentials.email"
                :name="loginConfig?.value_form?.email || 'email'"
                type="email"
                autocomplete="email"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 hover:border-indigo-400 dark:hover:border-indigo-500"
                :placeholder="$t('login.email')"
              />
            </div>
          </div>

          <!-- Password input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('login.password') }}
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="credentials.password"
                :name="loginConfig?.value_form?.password || 'password'"
                type="password"
                autocomplete="current-password"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 hover:border-indigo-400 dark:hover:border-indigo-500"
                :placeholder="$t('login.password')"
              />
            </div>
          </div>

          <!-- Error message -->
          <div v-if="error" class="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 animate-shake">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800 dark:text-red-300">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 dark:hover:from-indigo-600 dark:hover:via-purple-600 dark:hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg v-if="!loading" class="h-5 w-5 text-white/80 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span class="relative">{{ loading ? $t('login.loading') : $t('login.submit') }}</span>
            </button>
          </div>

          <!-- Footer info -->
          <div class="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p>{{ $t('login.security.encryption') }}</p>
            <p class="mt-1 flex items-center justify-center gap-1">
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              {{ $t('login.security.endToEnd') }}
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDocsStore } from '@/stores/docs'
import { validateJWT, extractEncryptionKey } from '@/utils/jwt'
import { authenticateLocally } from '@/utils/localAuth'
import { decryptAdmitedList } from '@/utils/decrypt'

const router = useRouter()
const docsStore = useDocsStore()
const { t: $t, locale } = useI18n()

// Language selector state
const isLangOpen = ref(false)
const currentLang = computed(() => locale.value)
const langNames = {
  es: 'Español',
  en: 'English',
  zh: '中文',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語'
}

const changeLang = (lang) => {
  locale.value = lang
  localStorage.setItem('apidoc-locale', lang)
  document.documentElement.lang = lang
  isLangOpen.value = false
}

const credentials = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const loginConfig = computed(() => {
  if (typeof window !== 'undefined' && window.__APICAT_DATA__?.meta?.login) {
    return window.__APICAT_DATA__.meta.login
  }
  return null
})

const isLocalAuth = computed(() => {
  // Local auth is enabled if there's an encrypted "_admited" object or legacy "admited" array
  return !!(loginConfig.value?._admited || (loginConfig.value?.admited && Array.isArray(loginConfig.value.admited)))
})

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const config = loginConfig.value
    if (!config) {
      throw new Error('Login configuration not found')
    }

    // MODE 1: LOCAL AUTHENTICATION (no server required)
    if (isLocalAuth.value) {
      console.log('🔐 Local authentication mode')

      let admitedList
      let encryptionKey = null

      // Get encryption key - reconstruct from obfuscated segments
      if (config._obf && config._kv) {
        // Reconstruct key from obfuscated segments
        try {
          encryptionKey = eval(`(function(){${config._obf}return ${config._kv};})()`)
          console.log('🔑 Key reconstructed from obfuscated segments')
        } catch (e) {
          console.error('❌ Failed to reconstruct key:', e)
          error.value = 'Authentication configuration error'
          return
        }
      } else {
        // Legacy: direct key
        encryptionKey = config._k || config.encryptionKey
      }

      // Check if we have encrypted admited list (secure mode)
      if (config._admited) {
        console.log('🔓 Decrypting admited list...')

        if (!encryptionKey) {
          error.value = 'Encryption key not found'
          console.error('❌ No encryption key available for decryption')
          return
        }

        try {
          // Decrypt the admited list
          admitedList = await decryptAdmitedList(config._admited, encryptionKey)
        } catch (decryptError) {
          error.value = 'Failed to decrypt authentication data'
          console.error('❌ Decryption failed:', decryptError)
          return
        }
      }
      // Legacy mode: plain text admited list (less secure)
      else if (config.admited && Array.isArray(config.admited)) {
        console.warn('⚠️  Using legacy plain text admited list (not encrypted)')
        admitedList = config.admited
      } else {
        error.value = 'Local authentication not properly configured'
        console.error('❌ No admited list found')
        return
      }

      // Authenticate with decrypted admited list
      const result = await authenticateLocally(
        credentials.value.email,
        credentials.value.password,
        admitedList,
        encryptionKey
      )

      if (!result.success) {
        error.value = result.error || 'Invalid credentials'
        console.error('❌ Local auth failed:', result.error)
        return
      }

      console.log('✅ Local authentication successful')
      console.log('👤 User:', result.user)

      // Store JWT token
      docsStore.setAuthToken(result.token)

      // Store encryption key if available
      if (result.encryptionKey) {
        docsStore.setEncryptionKey(result.encryptionKey)
      }

      // Redirect to home or originally requested page
      const redirectTo = router.currentRoute.value.query.redirect || '/'
      await router.push(redirectTo)
      return
    }

    // MODE 2: SERVER AUTHENTICATION (with JWT)
    if (!config.urlAuth) {
      throw new Error('Server URL not configured')
    }

    // Build request body using configured field names
    const emailField = config.value_form?.email || 'email'
    const passwordField = config.value_form?.password || 'password'

    const requestBody = {
      [emailField]: credentials.value.email,
      [passwordField]: credentials.value.password
    }

    console.log('🔐 Server authentication mode')
    console.log('📡 Attempting login to:', config.urlAuth)
    console.log('📝 Request body fields:', Object.keys(requestBody))

    const response = await fetch(config.urlAuth, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('📡 Response status:', response.status)

    // Check if response status matches configured success/error codes
    const successCode = config.response_success || 200
    const errorCode = config.response_error || 401

    if (response.status === successCode) {
      const data = await response.json()
      console.log('✅ Login successful')

      // Extract JWT token from response
      const token = data.token ||
                   data.access_token ||
                   data.jwt ||
                   data.data?.token ||
                   data.data?.access_token ||
                   data.data?.jwt

      if (token) {
        console.log('🔑 JWT token received from server')

        // Validate JWT structure
        const validation = validateJWT(token)
        if (!validation.valid) {
          throw new Error(`Invalid JWT token: ${validation.error}`)
        }

        console.log('✅ JWT token valid. Expires:', new Date(validation.payload.exp * 1000).toLocaleString())

        // Store JWT token
        docsStore.setAuthToken(token)

        // Try to extract encryption key from JWT payload
        const keyFromJWT = extractEncryptionKey(validation.payload)
        if (keyFromJWT) {
          console.log('🔑 Encryption key extracted from JWT')
          docsStore.setEncryptionKey(keyFromJWT)
        }
        // Or from response if encryptionKeyFromServer is true
        else if (config.encryptionKeyFromServer) {
          const encryptionKey = data.encryptionKey ||
                               data.encryption_key ||
                               data.key ||
                               data.data?.encryptionKey ||
                               data.data?.encryption_key ||
                               data.data?.key

          if (encryptionKey) {
            console.log('🔑 Encryption key received from server response')
            docsStore.setEncryptionKey(encryptionKey)
          } else {
            console.warn('⚠️  encryptionKeyFromServer is true but no key found in response')
          }
        }
      } else {
        console.warn('⚠️  No JWT token in server response, falling back to boolean auth')
        // Fallback to simple boolean authentication
        docsStore.setAuthenticated(true)

        // Extract encryption key if available
        if (config.encryptionKeyFromServer) {
          const encryptionKey = data.encryptionKey ||
                               data.encryption_key ||
                               data.key ||
                               data.data?.encryptionKey ||
                               data.data?.encryption_key ||
                               data.data?.key

          if (encryptionKey) {
            console.log('🔑 Encryption key received from server')
            docsStore.setEncryptionKey(encryptionKey)
          }
        }
      }

      // Redirect to home or originally requested page
      const redirectTo = router.currentRoute.value.query.redirect || '/'
      await router.push(redirectTo)
    } else if (response.status === errorCode) {
      const data = await response.json()
      error.value = data.message || 'Invalid credentials'
      console.error('❌ Login failed:', error.value)
    } else {
      error.value = `Unexpected response status: ${response.status}`
      console.error('❌ Unexpected response:', response.status)
    }
  } catch (err) {
    console.error('❌ Login error:', err)
    error.value = err.message || 'An error occurred during login'
  } finally {
    loading.value = false
  }
}
</script>
