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
                v-model="config.broker.host"
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
                v-model.number="config.broker.port"
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
              v-model="config.broker.protocol"
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

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Client ID
            </label>
            <input
              v-model="config.authentication.clientId"
              type="text"
              :placeholder="`mqtt-client-${Date.now()}`"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Usuario
              </label>
              <input
                v-model="config.authentication.username"
                type="text"
                placeholder="usuario"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                v-model="config.authentication.password"
                type="password"
                placeholder="••••••••"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
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
              v-model="config.ssl.enabled"
              type="checkbox"
              id="ssl-enabled"
              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            >
            <label for="ssl-enabled" class="text-sm text-gray-700 dark:text-gray-300">
              Habilitar SSL/TLS
            </label>
          </div>

          <div v-if="config.ssl.enabled" class="space-y-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <input
                v-model="config.ssl.rejectUnauthorized"
                type="checkbox"
                id="reject-unauthorized"
                class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              >
              <label for="reject-unauthorized" class="text-sm text-gray-700 dark:text-gray-300">
                Verificar certificados (rejectUnauthorized)
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Certificado CA (opcional)
              </label>
              <textarea
                v-model="config.ssl.ca"
                rows="3"
                placeholder="-----BEGIN CERTIFICATE-----"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Certificado del Cliente (opcional)
              </label>
              <textarea
                v-model="config.ssl.cert"
                rows="3"
                placeholder="-----BEGIN CERTIFICATE-----"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clave Privada del Cliente (opcional)
              </label>
              <textarea
                v-model="config.ssl.key"
                rows="3"
                placeholder="-----BEGIN PRIVATE KEY-----"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500"
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
            v-if="endpointMethod === 'SUBSCRIBE' || endpointMethod === 'INLINE'"
            @click="subscribe"
            :disabled="!connected || subscribed"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-md transition-colors text-sm flex items-center gap-2"
          >
            <Bell class="w-4 h-4" />
            {{ subscribed ? 'Suscrito' : 'Suscribirse' }}
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDocsStore } from '@/stores/docs'
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

// Configuration
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

// Test data
const testTopic = ref('')
const testQos = ref(1)
const testPayload = ref('')

// MQTT client (will be initialized when mqtt.js is installed)
let mqttClient = null

const isConfigured = computed(() => {
  return config.value.broker.host && config.value.broker.port
})

const endpointMethod = computed(() => {
  return props.endpoint.method?.toUpperCase()
})

onMounted(() => {
  loadFromMeta()
  testTopic.value = props.endpoint.topic || ''
  testQos.value = props.endpoint.qos || 1
})

const loadFromMeta = () => {
  const meta = docsStore.meta
  if (meta?.mqtt) {
    config.value = JSON.parse(JSON.stringify(meta.mqtt))
    // Generate client ID if not provided
    if (!config.value.authentication.clientId) {
      config.value.authentication.clientId = `mqtt-client-${Date.now()}`
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
    // TODO: Implement mqtt.js client connection
    // This requires installing mqtt package: npm install mqtt
    connectionStatus.value = '⚠️ Cliente MQTT no implementado. Instala: npm install mqtt'

    // Simulated connection for demo
    setTimeout(() => {
      connected.value = true
      connecting.value = false
      connectionStatus.value = 'Conectado exitosamente'
    }, 1000)
  } catch (err) {
    connecting.value = false
    connectionStatus.value = `Error: ${err.message}`
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
  if (!connected.value) return

  try {
    const payload = JSON.parse(testPayload.value)
    // TODO: mqttClient.publish(testTopic.value, JSON.stringify(payload), { qos: testQos.value })

    messages.value.unshift({
      topic: testTopic.value,
      payload: JSON.stringify(payload, null, 2),
      timestamp: new Date().toLocaleTimeString(),
      type: 'publish'
    })

    connectionStatus.value = 'Mensaje publicado'
  } catch (err) {
    connectionStatus.value = `Error al publicar: ${err.message}`
  }
}

const subscribe = async () => {
  if (!connected.value) return

  try {
    // TODO: mqttClient.subscribe(testTopic.value, { qos: testQos.value })
    subscribed.value = true
    connectionStatus.value = `Suscrito a: ${testTopic.value}`
  } catch (err) {
    connectionStatus.value = `Error al suscribirse: ${err.message}`
  }
}

const clearMessages = () => {
  messages.value = []
}

const getStatusClass = () => {
  if (connectionStatus.value.includes('Error')) {
    return 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
  }
  if (connected.value) {
    return 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
  }
  return 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
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
