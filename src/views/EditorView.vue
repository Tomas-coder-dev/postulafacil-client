<script setup lang="ts">
import { ref, watch } from 'vue'
import ResumeEditor from '../components/ResumeEditor.vue'
import ResumePreview from '../components/ResumePreview.vue'
import EditFile from '../components/EditFile.vue'

const props = defineProps<{
  initialData: any
  currentLang: 'es' | 'en'
}>()

const emit = defineEmits<{
  (e: 'save', payload: any): void
  (e: 'back'): void
}>()

/* === ESTADO ÚNICO (sin copias internas en el editor) === */
const cvData = ref<any>({})

watch(
  () => props.initialData,
  (val) => {
    if (val) cvData.value = val
  },
  { immediate: true }
)

/* === SETTINGS === */
const settings = ref({
  paperSize: 'A4' as 'A4' | 'Letter',
  lineSpacing: 1.3,
  fontFamily: 'Times New Roman, serif',
  fontSize: 11,
  paragraphSpacing: 8,
  marginTop: 40,
  marginBottom: 40,
  marginLeft: 50,
  marginRight: 50,
  themeColor: '#000000',
  pageBackground: '#ffffff'
})

/* === ACCIONES === */
const handleSave = () => emit('save', cvData.value)
const handleBack = () => emit('back')

const handleExportJSON = () => {
  const blob = new Blob([JSON.stringify(cvData.value, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(cvData.value.fileName || 'CV').replace(/\s+/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const handleImportJSON = (file: File) => {
  const reader = new FileReader()
  reader.onload = () => {
    try {
      cvData.value = JSON.parse(reader.result as string)
      if (!cvData.value.fileName) cvData.value.fileName = 'Nuevo_CV'
    } catch {
      alert(props.currentLang === 'es' ? 'Archivo inválido' : 'Invalid file')
    }
  }
  reader.readAsText(file)
}

const handlePrintPDF = () => window.print()
</script>

<template>
  <div class="flex h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 overflow-hidden">
    <!-- EDITOR -->
    <div class="w-2/5 overflow-y-auto print:hidden">
      <ResumeEditor
        v-model:cvData="cvData"
        :current-lang="currentLang"
        @save="handleSave"
        @back="handleBack"
      />
    </div>

    <!-- PREVIEW -->
    <div class="flex-1 flex justify-center p-4 overflow-y-auto bg-gray-200 dark:bg-gray-900/40">
      <div class="transform scale-[0.7] md:scale-[0.85] xl:scale-100 origin-top">
        <ResumePreview
          :cv-data="cvData"
          :settings="settings"
          :current-lang="currentLang"
        />
      </div>
    </div>

    <!-- SETTINGS -->
    <div class="w-1/4 bg-white dark:bg-gray-800 print:hidden overflow-y-auto">
      <EditFile
        v-model:settings="settings"
        v-model:fileName="cvData.fileName"
        :cv-data="cvData"
        :current-lang="currentLang"
        @save="handleSave"
        @exportJSON="handleExportJSON"
        @importJSON="handleImportJSON"
        @printPDF="handlePrintPDF"
      />
    </div>
  </div>
</template>