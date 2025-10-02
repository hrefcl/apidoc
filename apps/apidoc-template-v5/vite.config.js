import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    viteSingleFile({ removeViteModuleLoader: true })
  ],
  base: './', // Use relative paths for assets (required for file:// protocol)
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // Inline everything for file:// protocol
    cssCodeSplit: false,
    assetsInlineLimit: 100000000, // Inline everything
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true
      }
    }
  },
  server: {
    port: 5176
  }
})