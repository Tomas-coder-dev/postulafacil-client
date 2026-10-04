<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCvStore } from '../store/cvStore'
import ResumeEditor from '../components/ResumeEditor.vue'
import ResumePreview from '../components/ResumePreview.vue'
import EditFile from '../components/EditFile.vue'

import * as mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'
import html2pdf from 'html2pdf.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`

const store = useCvStore()
const { currentLang, currentCv } = storeToRefs(store)

const defaultSettings = {
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
}

const cvData = ref<any>({})
const settings = ref({ ...defaultSettings })
const hasUnsavedChanges = ref(false)
const lastSavedSnapshot = ref('')
const undoStack = ref<string[]>([])
const redoStack = ref<string[]>([])
const MAX_HISTORY = 50

let syncingFromCv = false
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

const snapshot = () => JSON.stringify({ cvData: cvData.value, settings: settings.value })

const pushUndo = () => {
  const current = snapshot()
  if (undoStack.value[undoStack.value.length - 1] === current) return
  undoStack.value.push(current)
  if (undoStack.value.length > MAX_HISTORY) undoStack.value.shift()
  redoStack.value = []
}

const undo = () => {
  if (undoStack.value.length === 0) return
  const current = snapshot()
  redoStack.value.push(current)
  const prev = undoStack.value.pop()!
  const parsed = JSON.parse(prev)
  syncingFromCv = true
  cvData.value = parsed.cvData
  settings.value = parsed.settings
  queueMicrotask(() => { syncingFromCv = false })
}

const redo = () => {
  if (redoStack.value.length === 0) return
  const current = snapshot()
  undoStack.value.push(current)
  const next = redoStack.value.pop()!
  const parsed = JSON.parse(next)
  syncingFromCv = true
  cvData.value = parsed.cvData
  settings.value = parsed.settings
  queueMicrotask(() => { syncingFromCv = false })
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault()
    undo()
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
    e.preventDefault()
    redo()
  }
}

const scheduleAutoSave = () => {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  autoSaveTimer = setTimeout(() => {
    store.saveCV(JSON.parse(JSON.stringify(cvData.value)))
    lastSavedSnapshot.value = snapshot()
    hasUnsavedChanges.value = false
  }, 60000)
}

watch(
  currentCv,
  (val) => {
    if (!val) return
    cvData.value = JSON.parse(JSON.stringify(val))
    if (!cvData.value.meta) cvData.value.meta = {}
    if (!cvData.value.meta.settings) cvData.value.meta.settings = { ...defaultSettings }
    syncingFromCv = true
    settings.value = { ...defaultSettings, ...cvData.value.meta.settings }
    queueMicrotask(() => { syncingFromCv = false })
    lastSavedSnapshot.value = snapshot()
    hasUnsavedChanges.value = false
    undoStack.value = []
    redoStack.value = []
  },
  { immediate: true }
)

watch(
  settings,
  (val) => {
    if (!cvData.value) return
    if (syncingFromCv) return
    if (!cvData.value.meta) cvData.value.meta = {}
    cvData.value.meta.settings = { ...val }
  },
  { deep: true }
)

watch(
  [cvData, settings],
  () => {
    if (syncingFromCv) return
    const current = snapshot()
    if (current !== lastSavedSnapshot.value) {
      hasUnsavedChanges.value = true
      pushUndo()
      scheduleAutoSave()
    }
  },
  { deep: true }
)

const handleSave = () => {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  store.saveCV(JSON.parse(JSON.stringify(cvData.value)))
  lastSavedSnapshot.value = snapshot()
  hasUnsavedChanges.value = false
}

const handleBack = () => store.enterApp()

type MobileTab = 'editor' | 'preview' | 'design'
const mobileTab = ref<MobileTab>('preview')

const tabLabel = computed(() => {
  if (currentLang.value === 'es') return { editor: 'Editor', preview: 'Vista', design: 'Diseño' }
  return { editor: 'Editor', preview: 'Preview', design: 'Design' }
})

const previewContainer = ref<HTMLElement | null>(null)
const previewScale = ref(1)
const previewHeight = ref(0)

const updateScale = () => {
  const container = previewContainer.value
  const page = document.querySelector('.resume-page') as HTMLElement | null
  if (!container || !page) return
  const available = container.clientWidth - 32
  const actualWidth = page.offsetWidth
  const actualHeight = page.offsetHeight
  const scale = available < actualWidth ? available / actualWidth : 1
  previewScale.value = scale
  previewHeight.value = actualHeight * scale
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScale)
  window.removeEventListener('keydown', handleKeydown)
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
})

watch(mobileTab, async () => {
  await nextTick()
  updateScale()
})

const handleExportJSON = () => {
  const blob = new Blob([JSON.stringify(cvData.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(cvData.value.fileName || 'CV').replace(/\s+/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const handleExportPDF = async () => {
  await nextTick()

  const pageEl =
    document.querySelector<HTMLElement>('#resume-preview-content.resume-page') ??
    document.querySelector<HTMLElement>('#resume-preview-content .resume-page') ??
    document.querySelector<HTMLElement>('.resume-page')

  if (!pageEl) {
    alert(currentLang.value === 'es' ? 'No se encontró la hoja del CV.' : 'CV page not found.')
    return
  }

  // Save styles to restore later
  const originalTransform = pageEl.style.transform
  const originalBoxShadow = pageEl.style.boxShadow
  pageEl.style.transform = 'none'
  pageEl.style.boxShadow = 'none'

  const opt = {
    margin: 0,
    filename: `${(cvData.value.fileName || 'CV').replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: settings.value.paperSize === 'Letter' ? 'letter' : 'a4', orientation: 'portrait' as const }
  }

  try {
    await html2pdf().set(opt).from(pageEl).save()
  } catch (error) {
    alert(currentLang.value === 'es' ? 'Error al generar el PDF' : 'Error generating PDF')
  } finally {
    // Restore styles
    pageEl.style.transform = originalTransform
    pageEl.style.boxShadow = originalBoxShadow
  }
}

const handleImportFile = async (file: File) => {
  if (!file) return
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'json') {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string)
        cvData.value = json
        if (!cvData.value.fileName) cvData.value.fileName = file.name.replace(/\.json$/i, '')
        if (!cvData.value.meta) cvData.value.meta = {}
        if (!cvData.value.meta.settings) cvData.value.meta.settings = { ...defaultSettings }
        syncingFromCv = true
        settings.value = { ...defaultSettings, ...cvData.value.meta.settings }
        queueMicrotask(() => { syncingFromCv = false })
      } catch {
        alert(currentLang.value === 'es' ? 'JSON inválido' : 'Invalid JSON')
      }
    }
    reader.readAsText(file)
    return
  }

  if (ext === 'docx') {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer
        const result = await mammoth.extractRawText({ arrayBuffer })
        cvData.value.summary = (result.value || '').trim()
      } catch {
        alert(currentLang.value === 'es' ? 'Error al leer DOCX' : 'DOCX read error')
      }
    }
    reader.readAsArrayBuffer(file)
    return
  }

  if (ext === 'pdf') {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const typedarray = new Uint8Array(reader.result as ArrayBuffer)
        const pdf = await pdfjsLib.getDocument(typedarray).promise
        let fullText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = (textContent.items as any[]).map((it) => it.str).join(' ')
          fullText += pageText + '\n'
        }
        cvData.value.summary = fullText.trim()
      } catch {
        alert(currentLang.value === 'es' ? 'Error al leer PDF' : 'PDF read error')
      }
    }
    reader.readAsArrayBuffer(file)
    return
  }

  alert(currentLang.value === 'es' ? 'Formato no soportado (.json, .docx, .pdf)' : 'Unsupported format (.json, .docx, .pdf)')
}
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-[calc(100vh-64px)]">

    <div v-if="hasUnsavedChanges" class="print:hidden bg-amber-500 text-white text-xs text-center py-1 px-4 flex items-center justify-center gap-2">
      <span>{{ currentLang === 'es' ? 'Cambios sin guardar — guardando automáticamente...' : 'Unsaved changes — autosaving...' }}</span>
      <button @click="handleSave" class="underline font-bold hover:text-amber-100 transition" type="button">
        {{ currentLang === 'es' ? 'Guardar ahora' : 'Save now' }}
      </button>
    </div>

    <div class="lg:hidden sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 py-2 print:hidden">
      <div class="grid grid-cols-3 gap-2">
        <button
          type="button"
          class="px-3 py-2 rounded text-xs font-semibold border"
          :class="mobileTab === 'editor' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'"
          @click="mobileTab = 'editor'"
        >{{ tabLabel.editor }}</button>

        <button
          type="button"
          class="px-3 py-2 rounded text-xs font-semibold border"
          :class="mobileTab === 'preview' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'"
          @click="mobileTab = 'preview'"
        >{{ tabLabel.preview }}</button>

        <button
          type="button"
          class="px-3 py-2 rounded text-xs font-semibold border"
          :class="mobileTab === 'design' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'"
          @click="mobileTab = 'design'"
        >{{ tabLabel.design }}</button>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row lg:h-[calc(100vh-64px)] overflow-hidden">
      <div class="lg:w-2/5 lg:overflow-y-auto print:hidden" :class="mobileTab === 'editor' ? 'block' : 'hidden lg:block'">
        <ResumeEditor v-model:cvData="cvData" :current-lang="currentLang" @save="handleSave" @back="handleBack" />
      </div>

      <div
        ref="previewContainer"
        class="flex-1 flex justify-center p-3 sm:p-4 overflow-y-auto bg-gray-200 dark:bg-gray-900/40"
        :class="mobileTab === 'preview' ? 'block' : 'hidden lg:flex'"
      >
        <div class="w-full flex justify-center">
          <div
            class="origin-top transition-transform duration-200"
            :style="{
              transform: `scale(${previewScale})`,
              transformOrigin: 'top center',
              height: previewHeight > 0 ? `${previewHeight}px` : 'auto'
            }"
          >
            <ResumePreview :cv-data="cvData" :settings="settings" :current-lang="currentLang" :export-mode="true" />
          </div>
        </div>
      </div>

      <div
        class="lg:w-1/4 bg-white dark:bg-gray-800 print:hidden lg:overflow-y-auto border-l border-gray-300 dark:border-gray-700"
        :class="mobileTab === 'design' ? 'block' : 'hidden lg:block'"
      >
        <EditFile
          v-model:settings="settings"
          v-model:fileName="cvData.fileName"
          :cv-data="cvData"
          :current-lang="currentLang"
          @save="handleSave"
          @exportJSON="handleExportJSON"
          @importJSON="handleImportFile"
          @printPDF="handleExportPDF"
        />
      </div>
    </div>
  </div>
</template>