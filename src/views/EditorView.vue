<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
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

// ---------- CV COMPARTIDO (SEGURO) ----------
const cvData = ref(
  props.initialData
    ? JSON.parse(JSON.stringify(props.initialData))
    : {}
)

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      cvData.value = JSON.parse(JSON.stringify(val))
    }
  },
  { immediate: true }
)

// ---------- SETTINGS COMPARTIDOS ----------
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

// ---------- RESIZE COLUMNA ----------
const leftWidth = ref(40)
const isResizing = ref(false)

let startX = 0
let startLeftWidth = 40

const onMouseDown = (e: MouseEvent) => {
  isResizing.value = true
  startX = e.clientX
  startLeftWidth = leftWidth.value
  document.body.style.userSelect = 'none'
}

const onMouseMove = (e: MouseEvent) => {
  if (!isResizing.value) return

  const deltaX = e.clientX - startX
  const containerWidth = window.innerWidth
  const deltaPercent = (deltaX / containerWidth) * 100

  let newLeft = startLeftWidth + deltaPercent
  newLeft = Math.max(25, Math.min(65, newLeft))

  leftWidth.value = newLeft
}

const onMouseUp = () => {
  if (!isResizing.value) return

  isResizing.value = false
  document.body.style.userSelect = ''
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})

// ---------- ACCIONES ----------
const handleSave = () => {
  emit('save', cvData.value)
}

const handleExportJSON = () => {
  const dataStr = JSON.stringify(cvData.value, null, 2)

  const blob = new Blob([dataStr, '\n'], {
    type: 'application/json'
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url

  a.download = `${(cvData.value.fileName || 'CV')
    .replace(/\s+/g, '_')}.json`

  a.click()

  URL.revokeObjectURL(url)
}

const handleImportJSON = (file: File) => {
  const reader = new FileReader()

  reader.onload = () => {
    try {
      const json = JSON.parse(reader.result as string)

      cvData.value = json

      if (!cvData.value.fileName) {
        cvData.value.fileName = 'Nuevo_CV'
      }
    } catch {
      alert(
        props.currentLang === 'es'
          ? 'Archivo inválido'
          : 'Invalid file'
      )
    }
  }

  reader.readAsText(file)
}

const handlePrintPDF = () => {
  window.print()
}

const handleBack = () => {
  emit('back')
}
</script>

<template>
  <div
    class="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-gray-100 dark:bg-gray-900"
  >
    <!-- IZQUIERDA: EDITOR -->
    <div
      class="h-full print:hidden"
      :style="{ width: leftWidth + '%' }"
    >
      <ResumeEditor
        :initial-data="cvData"
        :current-lang="currentLang"
        @save="handleSave"
        @back="handleBack"
      />
    </div>

    <!-- DIVISOR -->
    <div
      class="hidden lg:block w-[4px] cursor-col-resize bg-gray-300 dark:bg-gray-700 hover:bg-postula-blue transition-colors print:hidden"
      @mousedown="onMouseDown"
    ></div>

    <!-- DERECHA -->
    <div
      class="flex-1 flex flex-col lg:flex-row h-full bg-gray-200 dark:bg-gray-900/40"
    >
      <!-- PREVIEW -->
      <div
        class="w-full lg:w-2/3 flex justify-center items-start overflow-y-auto p-4 md:p-6 bg-gray-200 dark:bg-gray-900/40 print:bg-white print:p-0"
      >
        <div
          class="transform scale-[0.7] md:scale-[0.85] xl:scale-100 origin-top transition-transform duration-300 print:scale-100 print:transform-none"
        >
          <ResumePreview
            :cv-data="cvData"
            :settings="settings"
            :current-lang="currentLang"
          />
        </div>
      </div>

      <!-- EDITFILE -->
      <div
        class="w-full lg:w-1/3 h-full bg-white dark:bg-gray-800 print:hidden"
      >
        <EditFile
          :cv-data="cvData"
          :settings="settings"
          :current-lang="currentLang"

          @update:settings="val => {
            if (settings.value) settings.value = val
          }"

          @update:fileName="val => {
            if (cvData.value) cvData.value.fileName = val
          }"

          @save="handleSave"
          @exportJSON="handleExportJSON"
          @importJSON="handleImportJSON"
          @printPDF="handlePrintPDF"
        />
      </div>
    </div>
  </div>
</template>
