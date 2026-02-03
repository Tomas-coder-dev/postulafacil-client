<script setup lang="ts">
import { Rocket, Shield, Lock, Zap, LayoutTemplate, FileJson, CheckCircle2, Bot } from 'lucide-vue-next';

defineProps<{ currentLang: string }>()
const emit = defineEmits(['start'])

// Textos (Español e Inglés)
const texts = {
  es: {
    title: "Crea tu CV Inteligente en",
    subtitle: "PostulaFácil es una herramienta Open Source gratuita que potencia tu currículum con Inteligencia Artificial, manteniendo tus datos 100% privados.",
    cta: "Crear Mi Curriculum",
    features: "Características",
    col1Title: "Potencia e Inteligencia",
    col2Title: "Privacidad Primero",
    list1: [
      { text: "Gestión de múltiples CVs", icon: LayoutTemplate },
      { text: "Optimización con IA (ATS)", icon: Bot }, // IA Feature
      { text: "Vista previa en tiempo real", icon: Zap },
      { text: "Exportar a PDF profesional", icon: FileJson },
      { text: "Totalmente personalizable", icon: CheckCircle2 },
    ],
    list2: [
      { text: "Open source y gratuito", icon: Rocket },
      { text: "Datos guardados localmente", icon: Shield },
      { text: "Sin registro ni login", icon: Lock },
      { text: "Sin rastreo de usuarios", icon: CheckCircle2 },
      { text: "Sin publicidad", icon: CheckCircle2 },
    ]
  },
  en: {
    title: "Write your AI Resume in",
    subtitle: "PostulaFácil is a free, open-source tool that powers up your resume with Artificial Intelligence, while keeping your data 100% private.",
    cta: "Create My Resume",
    features: "Features",
    col1Title: "Simple and Powerful",
    col2Title: "Privacy First",
    list1: [
      { text: "Manage multiple resumes", icon: LayoutTemplate },
      { text: "AI Optimization (ATS)", icon: Bot }, // IA Feature
      { text: "Real-time preview", icon: Zap },
      { text: "Export to PDF", icon: FileJson },
      { text: "Fully customizable", icon: CheckCircle2 },
    ],
    list2: [
      { text: "Open source and free", icon: Rocket },
      { text: "All data saved locally", icon: Shield },
      { text: "No login needed", icon: Lock },
      { text: "No user tracking", icon: CheckCircle2 },
      { text: "No ads", icon: CheckCircle2 },
    ]
  }
}

const t = (key: string) => {
  // @ts-ignore
  return texts[props.currentLang]?.[key] || key
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
    
    <div class="text-center max-w-4xl mx-auto mt-12 md:mt-0">
      <h1 class="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white mb-6 tracking-tight leading-tight">
        {{ currentLang === 'es' ? texts.es.title : texts.en.title }} 
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Markdown</span>!
      </h1>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
        {{ currentLang === 'es' ? texts.es.subtitle : texts.en.subtitle }}
      </p>

      <button @click="emit('start')" 
              class="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded shadow-lg hover:-translate-y-1 transition-all text-lg flex items-center gap-2 mx-auto">
        {{ currentLang === 'es' ? texts.es.cta : texts.en.cta }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mt-20 max-w-5xl mx-auto pb-20 w-full">
      
      <div>
        <h3 class="text-xl font-bold text-orange-600 dark:text-orange-500 mb-6 flex items-center gap-2">
           <Zap class="w-5 h-5" />
           {{ currentLang === 'es' ? texts.es.col1Title : texts.en.col1Title }}
        </h3>
        <ul class="space-y-4">
          <li v-for="(item, idx) in (currentLang === 'es' ? texts.es.list1 : texts.en.list1)" :key="idx" class="flex items-center gap-3 text-gray-700 dark:text-gray-300">
             <component :is="item.icon" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
             <span>{{ item.text }}</span>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-bold text-blue-600 dark:text-blue-500 mb-6 flex items-center gap-2">
           <Shield class="w-5 h-5" />
           {{ currentLang === 'es' ? texts.es.col2Title : texts.en.col2Title }}
        </h3>
        <ul class="space-y-4">
          <li v-for="(item, idx) in (currentLang === 'es' ? texts.es.list2 : texts.en.list2)" :key="idx" class="flex items-center gap-3 text-gray-700 dark:text-gray-300">
             <component :is="item.icon" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
             <span>{{ item.text }}</span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>