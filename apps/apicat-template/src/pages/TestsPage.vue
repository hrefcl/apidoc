<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-foreground">Pruebas</h1>
      <button class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2">
        <Play class="w-4 h-4" />
        Ejecutar Todas
      </button>
    </div>

    <div class="bg-card border border-border rounded-lg p-6">
      <p class="text-muted-foreground">Sección de pruebas - En desarrollo</p>
    </div>
  </div>
</template>

<script setup>
import { Play } from 'lucide-vue-next'
</script>