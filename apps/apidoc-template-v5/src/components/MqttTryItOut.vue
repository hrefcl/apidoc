<template>
  <div class="mqtt-try-it-out my-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <div class="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Wifi class="w-5 h-5" />
        {{ t('mqtt.tryIt', 'Probar Conexión MQTT') }}
      </h3>
    </div>

    <div class="p-6 space-y-6">
      <!-- Connection Status -->
      <div v-if="connectionStatus" class="px-4 py-3 rounded-lg" :class="getStatusClass()">
        <div class="flex items-center gap-2">
          <component :is="getStatusIcon()" class="w-5 h-5" />
          <span class="font-medium">{{ connectionStatus }}</span>
        </div>
      </div>

      <!-- Tabs for Configuration / Test -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex -mb-px space-x-1">
          <button
            @click="activeTab = 'config'"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'config'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            ]"
          >
            <Settings class="w-4 h-4 inline-block mr-2" />
            Configuración
          </button>
          <button
            @click="activeTab = 'test'"
            :disabled="!isConfigured"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'test'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
              !isConfigured && 'opacity-50 cursor-not-allowed'
            ]"
          >
            <Play class="w-4 h-4 inline-block mr-2" />
            Probar
          </button>
        </nav>
      </div>

      <!-- Configuration Tab -->
      <div v-if="activeTab === 'config'" class="space-y-4">
        <!-- Preconfigured Disclaimer -->
        <div v-if="isPreconfigured" class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <CheckCircle class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div class="flex-1">
              <h5 class="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Configuración Preestablecida
              </h5>
              <p class="text-sm text-blue-800 dark:text-blue-200">
                Esta conexión MQTT ya está configurada con credenciales seguras.
                La información sensible como contraseñas y claves privadas está oculta por seguridad.
                Puedes probar la conexión directamente en la pestaña "Probar".
              </p>
            </div>
          </div>
        </div>

        <!-- Broker Settings -->
        <div class="space-y-4">
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Server class="w-4 h-4" />
            Broker MQTT
          </h4>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Host
              </label>
              <input
                v-model="displayConfig.broker.host"
                type="text"
                placeholder="mqtt.example.com"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Puerto
              </label>
              <input
                v-model.number="displayConfig.broker.port"
                type="number"
                placeholder="8883"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Protocolo
            </label>
            <select
              v-model="displayConfig.broker.protocol"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="ws">WebSocket (ws://)</option>
              <option value="wss">WebSocket Seguro (wss://)</option>
              <option value="mqtt">MQTT (mqtt://)</option>
              <option value="mqtts">MQTT Seguro (mqtts://)</option>
            </select>
          </div>
        </div>

        <!-- Authentication -->
        <div class="space-y-4">
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Key class="w-4 h-4" />
            Autenticación
          </h4>

          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
            <strong>Nota:</strong> Para brokers como AWS IoT, la autenticación se realiza mediante certificados SSL/TLS.
            Usuario y contraseña son opcionales si usas autenticación por certificados.
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Client ID (requerido)
            </label>
            <input
              v-model="displayConfig.authentication.clientId"
              type="text"
              :placeholder="`mqtt-client-${Date.now()}`"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Usuario (opcional)
              </label>
              <input
                v-model="displayConfig.authentication.username"
                type="text"
                :placeholder="isPreconfigured ? '••••••••' : 'usuario'"
                :disabled="isPreconfigured"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña (opcional)
              </label>
              <input
                v-model="displayConfig.authentication.password"
                type="password"
                :placeholder="isPreconfigured ? '••••••••' : 'Ingrese contraseña'"
                :disabled="isPreconfigured"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
            </div>
          </div>
        </div>

        <!-- SSL/TLS -->
        <div class="space-y-4">
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Shield class="w-4 h-4" />
            SSL/TLS
          </h4>

          <div class="flex items-center gap-2">
            <input
              v-model="displayConfig.ssl.enabled"
              type="checkbox"
              id="ssl-enabled"
              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            >
            <label for="ssl-enabled" class="text-sm text-gray-700 dark:text-gray-300">
              Habilitar SSL/TLS
            </label>
          </div>

          <div v-if="displayConfig.ssl.enabled" class="space-y-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <input
                v-model="displayConfig.ssl.rejectUnauthorized"
                type="checkbox"
                id="reject-unauthorized"
                class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              >
              <label for="reject-unauthorized" class="text-sm text-gray-700 dark:text-gray-300">
                Verificar certificados (rejectUnauthorized)
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                CA File (Root Certificate)
                <span v-if="isPreconfigured && config.ssl.ca" class="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                  Configurado
                </span>
              </label>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Ej: AmazonRootCA1.pem, rootCA.crt
              </div>
              <textarea
                v-model="displayConfig.ssl.ca"
                rows="3"
                :placeholder="isPreconfigured && config.ssl.ca ? '••••••••••••••••••••••••' : '-----BEGIN CERTIFICATE-----'"
                :disabled="isPreconfigured && config.ssl.ca"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                Client Certificate File
                <span v-if="isPreconfigured && config.ssl.cert" class="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                  Configurado
                </span>
              </label>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Ej: certificate.pem.crt, device-cert.pem
              </div>
              <textarea
                v-model="displayConfig.ssl.cert"
                rows="3"
                :placeholder="isPreconfigured && config.ssl.cert ? '••••••••••••••••••••••••' : '-----BEGIN CERTIFICATE-----'"
                :disabled="isPreconfigured && config.ssl.cert"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                Client Key File (Private Key)
                <span v-if="isPreconfigured && config.ssl.key" class="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                  Configurado
                </span>
              </label>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Ej: private.pem.key, device-private-key.pem
              </div>
              <textarea
                v-model="displayConfig.ssl.key"
                rows="3"
                :placeholder="isPreconfigured && config.ssl.key ? '••••••••••••••••••••••••' : '-----BEGIN PRIVATE KEY-----'"
                :disabled="isPreconfigured && config.ssl.key"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            @click="loadFromMeta"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            Cargar desde configuración
          </button>
          <button
            @click="saveConfig"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
          >
            Guardar configuración
          </button>
        </div>
      </div>

      <!-- Test Tab -->
      <div v-if="activeTab === 'test'" class="space-y-4">
        <!-- Topic and QoS -->
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Topic
            </label>
            <input
              v-model="testTopic"
              type="text"
              :placeholder="endpoint.topic || 'v1/tenant/devices/device-id/telemetry'"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-mono focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              QoS
            </label>
            <select
              v-model.number="testQos"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option :value="0">0 - At most once</option>
              <option :value="1">1 - At least once</option>
              <option :value="2">2 - Exactly once</option>
            </select>
          </div>
        </div>

        <!-- Message Payload -->
        <div v-if="endpointMethod === 'PUBLISH' || endpointMethod === 'INLINE'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payload (JSON)
          </label>
          <textarea
            v-model="testPayload"
            rows="8"
            placeholder='{"ts": "2025-09-30T10:00:00Z", "metrics": {"temp": 22.5}}'
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3">
          <button
            v-if="!connected"
            @click="connect"
            :disabled="connecting"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-md transition-colors text-sm flex items-center gap-2"
          >
            <Wifi class="w-4 h-4" />
            {{ connecting ? 'Conectando...' : 'Conectar' }}
          </button>
          <button
            v-else
            @click="disconnect"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm flex items-center gap-2"
          >
            <WifiOff class="w-4 h-4" />
            Desconectar
          </button>

          <button
            v-if="endpointMethod === 'PUBLISH' || endpointMethod === 'INLINE'"
            @click="publish"
            :disabled="!connected"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors text-sm flex items-center gap-2"
          >
            <Send class="w-4 h-4" />
            Publicar
          </button>

          <button
            v-if="(endpointMethod === 'SUBSCRIBE' || endpointMethod === 'INLINE') && !subscribed"
            @click="subscribe"
            :disabled="!connected"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-md transition-colors text-sm flex items-center gap-2"
          >
            <Bell class="w-4 h-4" />
            Suscribirse
          </button>

          <button
            v-if="(endpointMethod === 'SUBSCRIBE' || endpointMethod === 'INLINE') && subscribed"
            @click="unsubscribe"
            :disabled="!connected"
            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-md transition-colors text-sm flex items-center gap-2"
          >
            <Bell class="w-4 h-4" />
            Desuscribirse
          </button>
        </div>

        <!-- Messages Log -->
        <div v-if="messages.length > 0" class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div class="flex justify-between items-center mb-3">
            <h4 class="font-semibold text-gray-900 dark:text-gray-100">Mensajes Recibidos</h4>
            <button
              @click="clearMessages"
              class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Limpiar
            </button>
          </div>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <span class="text-xs font-mono text-gray-600 dark:text-gray-400">{{ msg.topic }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-500">{{ msg.timestamp }}</span>
              </div>
              <pre class="text-xs font-mono text-gray-900 dark:text-gray-100 overflow-x-auto">{{ msg.payload }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDocsStore } from '@/stores/docs'
import mqtt from 'mqtt'
import {
  Wifi, WifiOff, Settings, Play, Server, Key, Shield, Send, Bell,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-vue-next'

const { t } = useI18n()
const docsStore = useDocsStore()

const props = defineProps({
  endpoint: {
    type: Object,
    required: true
  }
})

const activeTab = ref('config')
const connected = ref(false)
const connecting = ref(false)
const subscribed = ref(false)
const connectionStatus = ref('')
const messages = ref([])

// Configuration (real values, hidden from user)
const config = ref({
  broker: {
    host: '',
    port: 8883,
    protocol: 'wss'
  },
  authentication: {
    username: '',
    password: '',
    clientId: ''
  },
  ssl: {
    enabled: true,
    rejectUnauthorized: true,
    ca: '',
    cert: '',
    key: ''
  }
})

// Display configuration (masked values for sensitive data)
const displayConfig = ref({
  broker: {
    host: '',
    port: 8883,
    protocol: 'wss'
  },
  authentication: {
    username: '',
    password: '',
    clientId: ''
  },
  ssl: {
    enabled: true,
    rejectUnauthorized: true,
    ca: '',
    cert: '',
    key: ''
  }
})

// Track if config comes from preconfigured settings
const isPreconfigured = ref(false)

// Test data
const testTopic = ref('')
const testQos = ref(1)
const testPayload = ref('')

// MQTT client (will be initialized when mqtt.js is installed)
let mqttClient = null

const isConfigured = computed(() => {
  return config.value.broker.host && config.value.broker.port
})

// Sync displayConfig changes back to config (for non-sensitive fields)
watch(displayConfig, (newVal) => {
  // Sync broker settings (not sensitive)
  config.value.broker = { ...newVal.broker }

  // Sync SSL settings (non-sensitive)
  config.value.ssl.enabled = newVal.ssl.enabled
  config.value.ssl.rejectUnauthorized = newVal.ssl.rejectUnauthorized

  // Sync clientId (not sensitive)
  config.value.authentication.clientId = newVal.authentication.clientId

  // Only sync sensitive fields if they were actually changed (not empty)
  if (!isPreconfigured.value) {
    config.value.authentication.username = newVal.authentication.username
    config.value.authentication.password = newVal.authentication.password
    config.value.ssl.ca = newVal.ssl.ca
    config.value.ssl.cert = newVal.ssl.cert
    config.value.ssl.key = newVal.ssl.key
  }
}, { deep: true })

const endpointMethod = computed(() => {
  return props.endpoint.method?.toUpperCase()
})

onMounted(() => {
  loadFromMeta()
  testTopic.value = props.endpoint.topic || ''
  testQos.value = props.endpoint.qos || 1
})

onUnmounted(() => {
  // Clean up MQTT connection when component is destroyed
  if (mqttClient) {
    mqttClient.end(true) // Force close
    mqttClient = null
  }
})

const loadFromMeta = () => {
  const meta = docsStore.meta
  if (meta?.mqtt) {
    // Store real config (with sensitive data)
    config.value = JSON.parse(JSON.stringify(meta.mqtt))

    // Mark as preconfigured if it has sensitive data
    isPreconfigured.value = !!(
      config.value.authentication.username ||
      config.value.authentication.password ||
      config.value.ssl.ca ||
      config.value.ssl.cert ||
      config.value.ssl.key
    )

    // Generate client ID if not provided
    if (!config.value.authentication.clientId) {
      config.value.authentication.clientId = `mqtt-client-${Date.now()}`
    }

    // Create display config (mask sensitive data)
    displayConfig.value = {
      broker: { ...config.value.broker },
      authentication: {
        username: isPreconfigured.value ? '' : config.value.authentication.username,
        password: isPreconfigured.value ? '' : config.value.authentication.password,
        clientId: config.value.authentication.clientId
      },
      ssl: {
        enabled: config.value.ssl.enabled,
        rejectUnauthorized: config.value.ssl.rejectUnauthorized,
        ca: isPreconfigured.value && config.value.ssl.ca ? '' : config.value.ssl.ca,
        cert: isPreconfigured.value && config.value.ssl.cert ? '' : config.value.ssl.cert,
        key: isPreconfigured.value && config.value.ssl.key ? '' : config.value.ssl.key
      }
    }
  }
}

const saveConfig = () => {
  // Save to localStorage for persistence
  localStorage.setItem('mqtt-config', JSON.stringify(config.value))
  connectionStatus.value = 'Configuración guardada'
  setTimeout(() => {
    connectionStatus.value = ''
  }, 3000)
}

const connect = async () => {
  connecting.value = true
  connectionStatus.value = 'Conectando al broker MQTT...'

  try {
    // Build broker URL
    const protocol = config.value.broker.protocol
    const host = config.value.broker.host
    const port = config.value.broker.port
    const brokerUrl = `${protocol}://${host}:${port}`

    // Build connection options
    const options = {
      clientId: config.value.authentication.clientId,
      clean: config.value.options?.clean ?? true,
      connectTimeout: config.value.options?.connectTimeout ?? 30000,
      reconnectPeriod: config.value.options?.reconnectPeriod ?? 1000,
      keepalive: config.value.options?.keepalive ?? 60
    }

    // Add authentication if provided
    if (config.value.authentication.username) {
      options.username = config.value.authentication.username
    }
    if (config.value.authentication.password) {
      options.password = config.value.authentication.password
    }

    // Add SSL/TLS options if enabled
    if (config.value.ssl.enabled) {
      options.rejectUnauthorized = config.value.ssl.rejectUnauthorized

      if (config.value.ssl.ca) {
        options.ca = config.value.ssl.ca
      }
      if (config.value.ssl.cert) {
        options.cert = config.value.ssl.cert
      }
      if (config.value.ssl.key) {
        options.key = config.value.ssl.key
      }
    }

    // Create MQTT client
    mqttClient = mqtt.connect(brokerUrl, options)

    // Handle connection events
    mqttClient.on('connect', () => {
      connected.value = true
      connecting.value = false
      connectionStatus.value = `✅ Conectado a ${host}:${port}`
    })

    mqttClient.on('error', (err) => {
      connecting.value = false
      connected.value = false
      connectionStatus.value = `❌ Error: ${err.message}`
      if (mqttClient) {
        mqttClient.end()
        mqttClient = null
      }
    })

    mqttClient.on('offline', () => {
      connectionStatus.value = '⚠️ Cliente desconectado (offline)'
    })

    mqttClient.on('reconnect', () => {
      connectionStatus.value = '🔄 Reconectando...'
    })

    mqttClient.on('message', (topic, message) => {
      try {
        const payload = message.toString()
        messages.value.unshift({
          topic: topic,
          payload: payload,
          timestamp: new Date().toLocaleTimeString(),
          type: 'received'
        })

        // Keep only last 50 messages
        if (messages.value.length > 50) {
          messages.value = messages.value.slice(0, 50)
        }
      } catch (err) {
        console.error('Error processing message:', err)
      }
    })

  } catch (err) {
    connecting.value = false
    connected.value = false
    connectionStatus.value = `❌ Error: ${err.message}`
  }
}

const disconnect = () => {
  if (mqttClient) {
    mqttClient.end()
    mqttClient = null
  }
  connected.value = false
  subscribed.value = false
  connectionStatus.value = 'Desconectado'
}

const publish = async () => {
  if (!connected.value || !mqttClient) {
    connectionStatus.value = '⚠️ No hay conexión activa'
    return
  }

  try {
    // Validate JSON payload
    let payload = testPayload.value
    try {
      const parsed = JSON.parse(testPayload.value)
      payload = JSON.stringify(parsed)
    } catch (e) {
      // If not valid JSON, send as plain text
      payload = testPayload.value
    }

    // Publish message
    mqttClient.publish(testTopic.value, payload, { qos: testQos.value }, (err) => {
      if (err) {
        connectionStatus.value = `❌ Error al publicar: ${err.message}`
      } else {
        // Add to message log
        messages.value.unshift({
          topic: testTopic.value,
          payload: payload,
          timestamp: new Date().toLocaleTimeString(),
          type: 'publish',
          qos: testQos.value
        })

        // Keep only last 50 messages
        if (messages.value.length > 50) {
          messages.value = messages.value.slice(0, 50)
        }

        connectionStatus.value = `✅ Mensaje publicado en ${testTopic.value} (QoS ${testQos.value})`
      }
    })
  } catch (err) {
    connectionStatus.value = `❌ Error al publicar: ${err.message}`
  }
}

const subscribe = async () => {
  if (!connected.value || !mqttClient) {
    connectionStatus.value = '⚠️ No hay conexión activa'
    return
  }

  if (subscribed.value) {
    connectionStatus.value = '⚠️ Ya estás suscrito a este topic'
    return
  }

  try {
    mqttClient.subscribe(testTopic.value, { qos: testQos.value }, (err, granted) => {
      if (err) {
        connectionStatus.value = `❌ Error al suscribirse: ${err.message}`
      } else {
        subscribed.value = true
        const grantedQos = granted && granted[0] ? granted[0].qos : testQos.value
        connectionStatus.value = `✅ Suscrito a: ${testTopic.value} (QoS ${grantedQos})`

        // Add subscription to message log
        messages.value.unshift({
          topic: testTopic.value,
          payload: '--- Suscripción iniciada ---',
          timestamp: new Date().toLocaleTimeString(),
          type: 'subscribe',
          qos: grantedQos
        })
      }
    })
  } catch (err) {
    connectionStatus.value = `❌ Error al suscribirse: ${err.message}`
  }
}

const unsubscribe = async () => {
  if (!connected.value || !mqttClient || !subscribed.value) {
    return
  }

  try {
    mqttClient.unsubscribe(testTopic.value, (err) => {
      if (err) {
        connectionStatus.value = `❌ Error al desuscribirse: ${err.message}`
      } else {
        subscribed.value = false
        connectionStatus.value = `✅ Desuscrito de: ${testTopic.value}`

        // Add unsubscription to message log
        messages.value.unshift({
          topic: testTopic.value,
          payload: '--- Suscripción finalizada ---',
          timestamp: new Date().toLocaleTimeString(),
          type: 'unsubscribe'
        })
      }
    })
  } catch (err) {
    connectionStatus.value = `❌ Error al desuscribirse: ${err.message}`
  }
}

const clearMessages = () => {
  messages.value = []
}

const getStatusClass = () => {
  if (connectionStatus.value.includes('Error')) {
    return 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
  }
  if (connected.value) {
    return 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
  }
  return 'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
}

const getStatusIcon = () => {
  if (connectionStatus.value.includes('Error')) return XCircle
  if (connected.value) return CheckCircle
  return AlertCircle
}

onUnmounted(() => {
  if (mqttClient) {
    mqttClient.end()
  }
})
</script>
