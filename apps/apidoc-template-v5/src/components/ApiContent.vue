<template>
  <div class="space-y-8">
    <!-- API Metadata -->
    <div v-if="data.group || data.type" class="flex flex-wrap gap-2">
      <span v-if="data.group" class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
        {{ data.group }}
      </span>
      <span v-if="data.type" class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
        {{ data.type }}
      </span>
    </div>

    <!-- Description -->
    <div v-if="data.description" v-html="renderMarkdown(data.description)"></div>

    <!-- Parameters -->
    <div v-if="data.parameter && data.parameter.fields && Object.keys(data.parameter.fields).length > 0" class="not-prose">
      <h2 class="text-2xl font-semibold mb-4">Parámetros</h2>
      <div v-for="(params, groupName) in data.parameter.fields" :key="groupName" class="mb-6">
        <h3 v-if="groupName !== 'Parameter'" class="text-lg font-medium mb-3">{{ groupName }}</h3>
        <div class="bg-card border border-border rounded-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-muted">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(param, index) in params" :key="index" class="border-t border-border">
                <td class="px-4 py-3 font-mono text-sm">
                  {{ param.field }}
                  <span v-if="!param.optional" class="text-red-600 dark:text-red-400 ml-1">*</span>
                </td>
                <td class="px-4 py-3">
                  <code class="text-xs bg-muted px-2 py-1 rounded">{{ param.type }}</code>
                </td>
                <td class="px-4 py-3 text-sm text-muted-foreground">
                  {{ param.description }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Success Response -->
    <div v-if="data.success && data.success.fields && Object.keys(data.success.fields).length > 0" class="not-prose">
      <h2 class="text-2xl font-semibold mb-4">Respuesta Exitosa</h2>
      <div v-for="(responses, groupName) in data.success.fields" :key="groupName" class="mb-6">
        <h3 v-if="groupName !== 'Success 200'" class="text-lg font-medium mb-3">{{ groupName }}</h3>
        <div class="bg-card border border-border rounded-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-muted">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold">Campo</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, index) in responses" :key="index" class="border-t border-border">
                <td class="px-4 py-3 font-mono text-sm">{{ field.field }}</td>
                <td class="px-4 py-3">
                  <code class="text-xs bg-muted px-2 py-1 rounded">{{ field.type }}</code>
                </td>
                <td class="px-4 py-3 text-sm text-muted-foreground">
                  {{ field.description }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Examples -->
    <div v-if="data.examples && data.examples.length > 0" class="not-prose">
      <h2 class="text-2xl font-semibold mb-4">Ejemplos</h2>
      <div v-for="(example, index) in data.examples" :key="index" class="mb-6">
        <h3 class="text-lg font-medium mb-3">{{ example.title }}</h3>
        <pre class="bg-card border border-border rounded-lg p-4 overflow-x-auto"><code class="text-sm">{{ example.content }}</code></pre>
      </div>
    </div>

    <!-- Error Response -->
    <div v-if="data.error && data.error.fields && Object.keys(data.error.fields).length > 0" class="not-prose">
      <h2 class="text-2xl font-semibold mb-4">Errores</h2>
      <div v-for="(errors, groupName) in data.error.fields" :key="groupName" class="mb-6">
        <h3 class="text-lg font-medium mb-3">{{ groupName }}</h3>
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-red-100 dark:bg-red-900/40">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold">Campo</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, index) in errors" :key="index" class="border-t border-red-200 dark:border-red-800">
                <td class="px-4 py-3 font-mono text-sm">{{ field.field }}</td>
                <td class="px-4 py-3">
                  <code class="text-xs bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded">{{ field.type }}</code>
                </td>
                <td class="px-4 py-3 text-sm">
                  {{ field.description }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const renderMarkdown = (text) => {
  if (!text) return ''
  // Simple markdown rendering - puedes usar markdown-it aquí si lo necesitas
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
}
</script>