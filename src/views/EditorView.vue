<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useCvStore } from '../store/cvStore'
import ResumeEditor from '../components/ResumeEditor.vue'
import ResumePreview from '../components/ResumePreview.vue'
import EditFile from '../components/EditFile.vue'
import { defaultSettings } from '../utils/cvDefaults'

import * as mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import html2pdf from 'html2pdf.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const store = useCvStore()
const { currentCv } = storeToRefs(store)
const { t } = useI18n()

const cvData = ref<any>({})
const settings = ref({
  ...defaultSettings,
  paperSize: defaultSettings.paperSize as 'A4' | 'Letter'
})
const hasUnsavedChanges = ref(false)
const lastSavedSnapshot = ref('')
const past = ref<string[]>([])
const future = ref<string[]>([])
const MAX_HISTORY = 50

let syncingFromCv = false
let applyingHistory = false
let currentSnapshot = ''
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

const snapshot = () => JSON.stringify({ cvData: cvData.value, settings: settings.value })

const restoreSnapshot = (raw: string) => {
  const parsed = JSON.parse(raw)
  syncingFromCv = true
  applyingHistory = true
  cvData.value = parsed.cvData
  settings.value = parsed.settings
  currentSnapshot = raw
  queueMicrotask(() => {
    syncingFromCv = false
    applyingHistory = false
  })
}

const markDirty = () => {
  hasUnsavedChanges.value = snapshot() !== lastSavedSnapshot.value
  if (hasUnsavedChanges.value) scheduleAutoSave()
  else if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
    autoSaveTimer = null
  }
}

const undo = () => {
  if (past.value.length === 0) return
  future.value.push(snapshot())
  restoreSnapshot(past.value.pop()!)
  markDirty()
}

const redo = () => {
  if (future.value.length === 0) return
  past.value.push(snapshot())
  restoreSnapshot(future.value.pop()!)
  markDirty()
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
    handleSave()
  }, 2000)
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
    lastSavedSnapshot.value = snapshot()
    currentSnapshot = lastSavedSnapshot.value
    hasUnsavedChanges.value = false
    past.value = []
    future.value = []
    queueMicrotask(() => { syncingFromCv = false })
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
    if (syncingFromCv || applyingHistory) return
    const current = snapshot()
    if (!currentSnapshot) {
      currentSnapshot = current
      return
    }
    if (current === currentSnapshot) return
    past.value.push(currentSnapshot)
    if (past.value.length > MAX_HISTORY) past.value.shift()
    future.value = []
    currentSnapshot = current
    hasUnsavedChanges.value = current !== lastSavedSnapshot.value
    scheduleAutoSave()
  },
  { deep: true }
)

const handleSave = () => {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  store.saveCV(JSON.parse(JSON.stringify(cvData.value)))
  lastSavedSnapshot.value = snapshot()
  hasUnsavedChanges.value = false
}

const handleBack = () => {
  handleSave()
  store.enterApp()
}

type MobileTab = 'editor' | 'preview' | 'design'
const mobileTab = ref<MobileTab>('preview')

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

const flushOnLeave = () => {
  handleSave()
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('beforeunload', flushOnLeave)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScale)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('beforeunload', flushOnLeave)
  flushOnLeave()
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
    alert(t('cvPageMissing'))
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
    alert(t('pdfError'))
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
        alert(t('jsonInvalid'))
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
        alert(t('docxError'))
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
        alert(t('pdfReadError'))
      }
    }
    reader.readAsArrayBuffer(file)
    return
  }

  alert(t('unsupportedFormat'))
}
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-[calc(100vh-64px)]">

    <div v-if="hasUnsavedChanges" class="print:hidden bg-amber-500 text-white text-xs text-center py-1 px-4 flex items-center justify-center gap-2">
      <span>{{ t('unsavedBanner') }}</span>
      <button @click="handleSave" class="underline font-bold hover:text-amber-100 transition" type="button">
        {{ t('saveNow') }}
      </button>
    </div>

    <div class="lg:hidden sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 py-2 print:hidden">
      <div class="grid grid-cols-3 gap-2">
        <button
          type="button"
          class="px-3 py-2 rounded text-xs font-semibold border"
          :class="mobileTab === 'editor' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'"
          @click="mobileTab = 'editor'"
        >{{ t('tabEditor') }}</button>

        <button
          type="button"
          class="px-3 py-2 rounded text-xs font-semibold border"
          :class="mobileTab === 'preview' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'"
          @click="mobileTab = 'preview'"
        >{{ t('tabPreview') }}</button>

        <button
          type="button"
          class="px-3 py-2 rounded text-xs font-semibold border"
          :class="mobileTab === 'design' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'"
          @click="mobileTab = 'design'"
        >{{ t('tabDesign') }}</button>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row lg:h-[calc(100vh-64px)] overflow-hidden">
      <div class="lg:w-2/5 lg:overflow-y-auto print:hidden" :class="mobileTab === 'editor' ? 'block' : 'hidden lg:block'">
        <ResumeEditor v-model:cvData="cvData" @save="handleSave" @back="handleBack" />
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
            <ResumePreview :cv-data="cvData" :settings="settings" :export-mode="true" />
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
          @save="handleSave"
          @exportJSON="handleExportJSON"
          @importJSON="handleImportFile"
          @printPDF="handleExportPDF"
        />
      </div>
    </div>
  </div>
</template>