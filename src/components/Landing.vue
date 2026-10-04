<script setup lang="ts">
import { Rocket, Shield, Lock, Zap, LayoutTemplate, FileJson, CheckCircle2, Bot } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useCvStore } from '../store/cvStore'
import { watchEffect } from 'vue'

const store = useCvStore()
const { t, locale } = useI18n()

// Sincronizar el locale de vue-i18n con el del store
watchEffect(() => {
  locale.value = store.currentLang
})

const list1 = [
  { text: 'landingL1_0', icon: LayoutTemplate },
  { text: 'landingL1_1', icon: Bot },
  { text: 'landingL1_2', icon: Zap },
  { text: 'landingL1_3', icon: FileJson },
  { text: 'landingL1_4', icon: CheckCircle2 }
]

const list2 = [
  { text: 'landingL2_0', icon: Rocket },
  { text: 'landingL2_1', icon: Shield },
  { text: 'landingL2_2', icon: Lock },
  { text: 'landingL2_3', icon: CheckCircle2 },
  { text: 'landingL2_4', icon: CheckCircle2 }
]
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
    <div class="text-center max-w-4xl mx-auto mt-12 md:mt-0">
      <h1 class="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white mb-6 tracking-tight leading-tight">
        {{ t('landingTitle') }}
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Markdown</span>!
      </h1>

      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
        {{ t('landingSubtitle') }}
      </p>

      <button
        @click="store.enterApp()"
        class="px-8 py-4 bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 focus:outline-none text-white font-bold rounded shadow-lg hover:-translate-y-1 transition-all text-lg flex items-center gap-2 mx-auto"
        type="button"
      >
        {{ t('landingCta') }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mt-20 max-w-5xl mx-auto pb-20 w-full">
      <div>
        <h3 class="text-xl font-bold text-orange-600 dark:text-orange-500 mb-6 flex items-center gap-2">
          <Zap class="w-5 h-5" />
          {{ t('landingCol1Title') }}
        </h3>

        <ul class="space-y-4">
          <li
            v-for="(item, idx) in list1"
            :key="idx"
            class="flex items-center gap-3 text-gray-700 dark:text-gray-300"
          >
            <component :is="item.icon" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <span>{{ t(item.text) }}</span>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-bold text-blue-600 dark:text-blue-500 mb-6 flex items-center gap-2">
          <Shield class="w-5 h-5" />
          {{ t('landingCol2Title') }}
        </h3>

        <ul class="space-y-4">
          <li
            v-for="(item, idx) in list2"
            :key="idx"
            class="flex items-center gap-3 text-gray-700 dark:text-gray-300"
          >
            <component :is="item.icon" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <span>{{ t(item.text) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>