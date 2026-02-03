<script setup lang="ts">
import { Copy, Trash2, Download, FileText } from 'lucide-vue-next';
import { translations } from '../utils/translations'; // Importamos textos

defineProps<{ cvList: any[], currentLang: 'es' | 'en' }>()
const emit = defineEmits(['createNew', 'editCv', 'deleteCv', 'duplicateCv', 'importCv'])

// Helper para texto corto
const t = (key: string, lang: 'es' | 'en') => translations[lang][key] || key
</script>

<template>
  <div class="p-8 md:p-12 max-w-7xl mx-auto min-h-[calc(100vh-64px)] font-sans">
    
    <div class="flex justify-between items-end mb-10">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">{{ t('dashboardTitle', currentLang) }}</h1>
        <p class="text-gray-500 dark:text-gray-400">{{ t('dashboardSubtitle', currentLang) }}</p>
      </div>
      <button @click="emit('importCv')" class="hidden md:flex items-center gap-2 bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded hover:scale-105 transition shadow-lg border border-gray-600">
        <Download size="16" /> {{ t('import', currentLang) }}
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      
      <div @click="emit('createNew')" 
           class="group cursor-pointer bg-gray-100 dark:bg-gray-800/40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center h-[380px] hover:border-postula-blue hover:bg-blue-50 dark:hover:bg-gray-800 transition duration-300">
        <div class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl text-gray-400 group-hover:text-postula-blue group-hover:scale-110 transition shadow-inner">
          +
        </div>
        <span class="mt-4 font-bold text-gray-500 dark:text-gray-400 group-hover:text-postula-blue">{{ t('createNew', currentLang) }}</span>
      </div>

      <div v-for="(cv, index) in cvList" :key="index" 
           class="relative group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 h-[380px] flex flex-col transition-all duration-300 overflow-hidden">
        
        <div class="flex-1 bg-gray-200 dark:bg-gray-900 relative overflow-hidden cursor-pointer" @click="emit('editCv', index)">
          <div class="absolute top-4 left-1/2 transform -translate-x-1/2 scale-[0.35] origin-top w-[210mm] h-[297mm] bg-white text-black p-10 shadow-xl pointer-events-none">
            <h1 class="text-4xl font-serif font-bold text-center border-b pb-4 mb-4">{{ cv.name }}</h1>
            <p class="text-center text-xl italic text-blue-600 mb-6">{{ cv.title }}</p>
            <div class="text-sm space-y-4 text-justify">
               <p>{{ cv.summary }}</p>
               <div class="h-1 bg-gray-300 w-full mt-10"></div>
               <div class="h-1 bg-gray-300 w-3/4"></div>
            </div>
          </div>

          <div class="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
             
             <button @click.stop="emit('duplicateCv', index)" :title="t('duplicate', currentLang)"
                     class="w-10 h-10 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition z-20">
                <Copy size="18" />
             </button>
             
             <button @click.stop="emit('deleteCv', index)" :title="t('delete', currentLang)"
                     class="w-10 h-10 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center hover:bg-red-600 hover:scale-110 transition z-20">
                <Trash2 size="18" />
             </button>
          </div>

          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center pointer-events-none">
             <div class="bg-white text-black px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition duration-300 shadow-xl">
                {{ t('edit', currentLang) }}
             </div>
          </div>
        </div>

        <div class="p-4 bg-white dark:bg-gray-800 z-10 border-t dark:border-gray-700">
          <h3 class="font-bold text-lg text-gray-800 dark:text-white truncate">{{ cv.title }}</h3>
          <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
             <FileText size="12"/> {{ t('edited', currentLang) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>