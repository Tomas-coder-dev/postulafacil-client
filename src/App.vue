<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCvStore } from './store/cvStore'
import NavBar from './components/NavBar.vue'
import Dashboard from './components/Dashboard.vue'
import EditorView from './views/EditorView.vue'
import Landing from './components/Landing.vue'

const store = useCvStore()
const { currentView } = storeToRefs(store)

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