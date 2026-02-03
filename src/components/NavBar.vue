<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
import LangSwitch from './LangSwitch.vue' 

defineProps<{ darkMode: boolean, currentLang: string }>()
const emit = defineEmits(['toggleTheme', 'toggleLang', 'goHome'])
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 md:px-8 transition-colors duration-300 shadow-sm z-50 relative sticky top-0">
    
    <div @click="emit('goHome')" class="flex items-center gap-2 cursor-pointer group select-none">
      <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition">P</div>
      <span class="text-xl font-bold text-gray-800 dark:text-white tracking-tight">Postula<span class="text-postula-blue">Fácil</span></span>
    </div>

    <div class="flex items-center gap-4">
      
      <LangSwitch 
        :current-lang="currentLang" 
        @toggle="emit('toggleLang')" 
      />

      <ThemeToggle 
        :is-dark="darkMode" 
        @toggle="emit('toggleTheme')" 
      />
    </div>
  </nav>
</template>