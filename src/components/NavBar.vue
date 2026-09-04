<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCvStore } from '../store/cvStore'
import ThemeToggle from './ThemeToggle.vue'
import LangSwitch from './LangSwitch.vue'

const store = useCvStore()
const { darkMode, currentLang } = storeToRefs(store)

const deferredPrompt = ref<any>(null)
const showInstall = ref(false)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    showInstall.value = true
  })
  window.addEventListener('appinstalled', () => {
    showInstall.value = false
    deferredPrompt.value = null
  })
})

const installApp = async () => {
  if (!deferredPrompt.value) return
  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  if (outcome === 'accepted') {
    showInstall.value = false
    deferredPrompt.value = null
  }
}
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 md:px-8 transition-colors duration-300 shadow-sm z-50 relative sticky top-0">

    <div @click="store.goHome()" class="flex items-center gap-2 cursor-pointer group select-none">
      <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition">P</div>
      <span class="text-xl font-bold text-gray-800 dark:text-white tracking-tight">Postula<span class="text-postula-blue">Fácil</span></span>
    </div>

    <div class="flex items-center gap-4">

      <button
        v-if="showInstall"
        @click="installApp"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-sm"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        {{ currentLang === 'es' ? 'Instalar app' : 'Install app' }}
      </button>

      <LangSwitch
        :current-lang="currentLang"
        @toggle="store.toggleLang()"
      />

      <ThemeToggle
        :is-dark="darkMode"
        @toggle="store.toggleTheme()"
      />
    </div>
  </nav>
</template>