/**
 * Configuration Vite.
 * - Alias "@" -> /src pour des imports lisibles et stables.
 * - Le mode ("mock" par défaut, "http" pour les vraies API) est lu depuis
 *   les fichiers .env (voir .env.example).
 */
import { copyFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/** Copie index.html → 404.html pour que les routes Vue fonctionnent sur GitHub Pages. */
function githubPagesSpa() {
  return {
    name: 'github-pages-spa',
    closeBundle() {
      const dist = resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist')
      try {
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
        writeFileSync(resolve(dist, '.nojekyll'), '')
      } catch {
        /* dist/index.html n'existe pas (ex. vite preview sans build) */
      }
    }
  }
}

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [vue(), githubPagesSpa()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Les tokens SCSS (mixins, breakpoints) sont injectés dans chaque <style lang="scss">
        additionalData: `@use "@/assets/styles/tokens" as *;`
      }
    }
  },
  server: { port: 5173, host: true },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Sépare les librairies lourdes (cartographie) du code applicatif
        manualChunks: { geo: ['d3-geo', 'topojson-client'] }
      }
    }
  }
})
