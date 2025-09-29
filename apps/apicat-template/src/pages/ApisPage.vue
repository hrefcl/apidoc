<template>
  <div class="flex h-full gap-6">
    <!-- Left Sidebar - API Tree -->
    <div class="w-80 bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      <div class="p-4 border-b border-border">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar APIs..."
            class="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div class="space-y-2">
          <div v-for="folder in apiFolders" :key="folder.name" class="space-y-1">
            <button
              @click="folder.expanded = !folder.expanded"
              class="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
            >
              <ChevronRight class="w-4 h-4 transition-transform" :class="{ 'rotate-90': folder.expanded }" />
              <Folder class="w-4 h-4 text-primary-600" />
              <span class="text-sm font-medium text-foreground">{{ folder.name }}</span>
              <span class="ml-auto text-xs text-muted-foreground">{{ folder.apis.length }}</span>
            </button>

            <div v-if="folder.expanded" class="ml-6 space-y-1">
              <button
                v-for="api in folder.apis"
                :key="api.id"
                @click="selectApi(api)"
                class="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
                :class="{ 'bg-primary-100 dark:bg-primary-900': selectedApi?.id === api.id }"
              >
                <span class="text-xs font-mono px-2 py-0.5 rounded" :class="getMethodClass(api.method)">
                  {{ api.method }}
                </span>
                <span class="text-sm text-foreground truncate">{{ api.path }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content - API Details -->
    <div class="flex-1 bg-card border border-border rounded-lg overflow-hidden">
      <div v-if="selectedApi" class="h-full flex flex-col">
        <!-- API Header -->
        <div class="p-6 border-b border-border">
          <div class="flex items-start gap-4">
            <span class="text-sm font-mono px-3 py-1.5 rounded" :class="getMethodClass(selectedApi.method)">
              {{ selectedApi.method }}
            </span>
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-foreground">{{ selectedApi.path }}</h2>
              <p class="text-sm text-muted-foreground mt-1">{{ selectedApi.description }}</p>
            </div>
          </div>
        </div>

        <!-- API Tabs -->
        <div class="border-b border-border">
          <div class="flex gap-4 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-4 py-3 text-sm font-medium transition-colors relative"
              :class="activeTab === tab.id ? 'text-primary-600' : 'text-muted-foreground hover:text-foreground'"
            >
              {{ tab.label }}
              <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <div>
              <h3 class="text-sm font-semibold text-foreground mb-3">URL</h3>
              <div class="bg-muted rounded-md p-3 font-mono text-sm">
                {{ selectedApi.fullUrl }}
              </div>
            </div>

            <div v-if="selectedApi.parameters?.length">
              <h3 class="text-sm font-semibold text-foreground mb-3">Parámetros</h3>
              <div class="border border-border rounded-lg overflow-hidden">
                <table class="w-full">
                  <thead class="bg-muted">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-foreground">Nombre</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-foreground">Tipo</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-foreground">Requerido</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-foreground">Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="param in selectedApi.parameters" :key="param.name" class="border-t border-border">
                      <td class="px-4 py-3 text-sm font-mono text-foreground">{{ param.name }}</td>
                      <td class="px-4 py-3 text-sm text-muted-foreground">{{ param.type }}</td>
                      <td class="px-4 py-3 text-sm">
                        <span v-if="param.required" class="text-red-600 dark:text-red-400">*</span>
                        <span v-else class="text-muted-foreground">-</span>
                      </td>
                      <td class="px-4 py-3 text-sm text-muted-foreground">{{ param.description }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'request'" class="space-y-6">
            <div class="bg-muted rounded-lg p-4">
              <h3 class="text-sm font-semibold text-foreground mb-3">Ejemplo de Request</h3>
              <pre class="text-sm"><code>{{ selectedApi.requestExample }}</code></pre>
            </div>
          </div>

          <div v-else-if="activeTab === 'response'" class="space-y-6">
            <div class="bg-muted rounded-lg p-4">
              <h3 class="text-sm font-semibold text-foreground mb-3">Ejemplo de Response</h3>
              <pre class="text-sm"><code>{{ selectedApi.responseExample }}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="h-full flex items-center justify-center">
        <div class="text-center">
          <Plug class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-foreground mb-2">Selecciona una API</h3>
          <p class="text-sm text-muted-foreground">Elige un endpoint del árbol para ver sus detalles</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, ChevronRight, Folder, Plug } from 'lucide-vue-next'

const activeTab = ref('overview')
const selectedApi = ref(null)

const tabs = [
  { id: 'overview', label: 'Descripción' },
  { id: 'request', label: 'Request' },
  { id: 'response', label: 'Response' },
  { id: 'test', label: 'Prueba' }
]

const apiFolders = ref([
  {
    name: 'Authentication',
    expanded: true,
    apis: [
      {
        id: 1,
        method: 'POST',
        path: '/auth/login',
        description: 'Autenticar usuario',
        fullUrl: 'http://localhost:3000/api/auth/login',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'Email del usuario' },
          { name: 'password', type: 'string', required: true, description: 'Contraseña' }
        ],
        requestExample: '{\n  "email": "user@example.com",\n  "password": "password123"\n}',
        responseExample: '{\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n  "user": {\n    "id": 1,\n    "email": "user@example.com"\n  }\n}'
      },
      {
        id: 2,
        method: 'POST',
        path: '/auth/register',
        description: 'Registrar nuevo usuario',
        fullUrl: 'http://localhost:3000/api/auth/register',
        parameters: [],
        requestExample: '{}',
        responseExample: '{}'
      }
    ]
  },
  {
    name: 'Users',
    expanded: false,
    apis: [
      {
        id: 3,
        method: 'GET',
        path: '/users',
        description: 'Listar usuarios',
        fullUrl: 'http://localhost:3000/api/users',
        parameters: [],
        requestExample: '',
        responseExample: '[]'
      },
      {
        id: 4,
        method: 'GET',
        path: '/users/:id',
        description: 'Obtener usuario por ID',
        fullUrl: 'http://localhost:3000/api/users/:id',
        parameters: [],
        requestExample: '',
        responseExample: '{}'
      },
      {
        id: 5,
        method: 'PUT',
        path: '/users/:id',
        description: 'Actualizar usuario',
        fullUrl: 'http://localhost:3000/api/users/:id',
        parameters: [],
        requestExample: '{}',
        responseExample: '{}'
      },
      {
        id: 6,
        method: 'DELETE',
        path: '/users/:id',
        description: 'Eliminar usuario',
        fullUrl: 'http://localhost:3000/api/users/:id',
        parameters: [],
        requestExample: '',
        responseExample: '{}'
      }
    ]
  }
])

const getMethodClass = (method) => {
  const classes = {
    'GET': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    'POST': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    'PUT': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    'DELETE': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    'PATCH': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
  }
  return classes[method] || 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
}

const selectApi = (api) => {
  selectedApi.value = api
  activeTab.value = 'overview'
}
</script>