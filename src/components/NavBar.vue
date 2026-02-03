<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue' // <--- Importamos el switch

defineProps<{ darkMode: boolean, currentLang: string }>()
const emit = defineEmits(['toggleTheme', 'toggleLang', 'goHome'])
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 md:px-8 transition-colors duration-300">
    <div @click="emit('goHome')" class="flex items-center gap-2 cursor-pointer group select-none">
      <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition">P</div>
      <span class="text-xl font-bold text-gray-800 dark:text-white tracking-tight">Postula<span class="text-postula-blue">Fácil</span></span>
    </div>

    <div class="flex items-center gap-4">
      <button @click="emit('toggleLang')" class="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-postula-blue transition">
        {{ currentLang === 'es' ? 'ES' : 'EN' }}
      </button>

      <ThemeToggle :isDark="darkMode" @toggle="emit('toggleTheme')" />
    </div>
  </nav>
</template>