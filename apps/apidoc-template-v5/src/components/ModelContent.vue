<template>
  <div class="space-y-8">
    <!-- Models List -->
    <div v-for="model in data.models" :key="model.id" class="space-y-6">
      <!-- Model Header -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <Database class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 class="text-2xl font-bold text-foreground">{{ model.model.name }}</h2>
            </div>
            <div class="flex items-center gap-3 text-sm text-muted-foreground">
              <span v-if="model.model.tableName" class="inline-flex items-center gap-1">
                <Table class="w-4 h-4" />
                {{ model.model.tableName }}
              </span>
              <span v-if="model.version" class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-mono text-xs">
                v{{ model.version }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="model.description" v-html="model.description" class="text-muted-foreground prose prose-sm dark:prose-invert max-w-none"></div>
      </div>

      <!-- Attributes Section -->
      <div v-if="model.model.attributes && model.model.attributes.length > 0" class="space-y-4">
        <h3 class="text-xl font-semibold flex items-center gap-2">
          <List class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Attributes
        </h3>
        <div class="grid gap-3">
          <div
            v-for="(attr, index) in model.model.attributes"
            :key="index"
            class="bg-card border border-border rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <code class="text-base font-semibold text-foreground">{{ attr.name }}</code>
                  <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs font-mono">
                    {{ attr.type }}
                  </span>
                  <span v-if="!attr.optional" class="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-xs font-medium">
                    required
                  </span>
                  <span v-else class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                    optional
                  </span>
                </div>
                <div v-if="attr.decorators && attr.decorators.length > 0" class="flex flex-wrap gap-1.5">
                  <span
                    v-for="(decorator, dIndex) in attr.decorators"
                    :key="dIndex"
                    class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-xs font-mono"
                  >
                    <Sparkles class="w-3 h-3" />
                    @{{ decorator }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Relationships Section -->
      <div v-if="model.model.relationships && model.model.relationships.length > 0" class="space-y-4">
        <h3 class="text-xl font-semibold flex items-center gap-2">
          <Network class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Relationships
        </h3>
        <div class="grid gap-3">
          <div
            v-for="(rel, index) in model.model.relationships"
            :key="index"
            class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4"
          >
            <div class="flex items-center gap-3 mb-2">
              <code class="text-base font-semibold text-foreground">{{ rel.name }}</code>
              <span class="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs font-mono">
                {{ rel.type }}
              </span>
              <ArrowRight class="w-4 h-4 text-muted-foreground" />
              <code class="text-sm font-medium text-muted-foreground">{{ rel.targetModel }}</code>
            </div>
            <div v-if="rel.decorators && rel.decorators.length > 0" class="flex flex-wrap gap-1.5">
              <span
                v-for="(decorator, dIndex) in rel.decorators"
                :key="dIndex"
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full text-xs font-mono"
              >
                <Sparkles class="w-3 h-3" />
                @{{ decorator }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Hooks Section -->
      <div v-if="model.model.hooks && model.model.hooks.length > 0" class="space-y-4">
        <h3 class="text-xl font-semibold flex items-center gap-2">
          <Zap class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Lifecycle Hooks
        </h3>
        <div class="grid gap-3">
          <div
            v-for="(hook, index) in model.model.hooks"
            :key="index"
            class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
          >
            <div class="flex items-start gap-3 mb-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded text-xs font-mono">
                    <Sparkles class="w-3 h-3" />
                    @{{ hook.decorator }}
                  </span>
                  <ArrowRight class="w-4 h-4 text-muted-foreground" />
                  <code class="text-base font-semibold text-foreground">{{ hook.methodName }}()</code>
                </div>
                <p v-if="hook.description" class="text-sm text-muted-foreground">{{ hook.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Methods Section -->
      <div v-if="model.model.methods && model.model.methods.length > 0" class="space-y-4">
        <h3 class="text-xl font-semibold flex items-center gap-2">
          <Code class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Methods
        </h3>
        <div class="grid gap-3">
          <div
            v-for="(method, index) in model.model.methods"
            :key="index"
            class="bg-card border border-border rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
          >
            <div class="flex items-center gap-2 mb-2">
              <code class="text-base font-semibold text-foreground">{{ method.name }}()</code>
              <span v-if="method.returnType" class="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded text-xs font-mono">
                → {{ method.returnType }}
              </span>
            </div>
            <div v-if="method.decorators && method.decorators.length > 0" class="flex flex-wrap gap-1.5">
              <span
                v-for="(decorator, dIndex) in method.decorators"
                :key="dIndex"
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-mono"
              >
                <Sparkles class="w-3 h-3" />
                @{{ decorator }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Database, Table, List, Network, ArrowRight, Zap, Code, Sparkles } from 'lucide-vue-next'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>
