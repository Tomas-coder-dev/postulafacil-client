<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n'
import { useCvStore } from './store/cvStore'
import NavBar from './components/NavBar.vue'
import Dashboard from './components/Dashboard.vue'
import EditorView from './views/EditorView.vue'
import Landing from './components/Landing.vue'

const store = useCvStore()
const { currentView } = storeToRefs(store)
const { t } = useI18n()

useHead({
  title: computed(() => `PostulaFácil - ${t('landingTitle')} Markdown!`),
  meta: [
    {
      name: 'description',
      content: computed(() => t('landingSubtitle'))
    }
  ]
})

onMounted(() => {
  store.initializeStore()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
    <NavBar class="print:hidden" />

    <Landing v-if="currentView === 'landing'" class="print:hidden" />

    <Dashboard
      v-else-if="currentView === 'dashboard'"
      class="print:hidden"
    />

    <EditorView
      v-else-if="currentView === 'editor'"
    />
  </div>
</template>