<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import ResumeEditor from '../components/ResumeEditor.vue'
import ResumePreview from '../components/ResumePreview.vue'
import EditFile from '../components/EditFile.vue'

import * as mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`

const props = defineProps<{
  initialData: any
  currentLang: 'es' | 'en'
}>()

const emit = defineEmits<{
  (e: 'save', payload: any): void
  (e: 'back'): void
}>()

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

let syncingFromCv = false

watch(
  () => props.initialData,
  (val) => {
    if (!val) return
    cvData.value = val

    if (!cvData.value.meta) cvData.value.meta = {}
    if (!cvData.value.meta.settings) cvData.value.meta.settings = { ...defaultSettings }

    syncingFromCv = true
    settings.value = { ...defaultSettings, ...cvData.value.meta.settings }
    queueMicrotask(() => {
      syncingFromCv = false
    })
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

const handleSave = () => emit('save', cvData.value)
const handleBack = () => emit('back')

/** ---------- Responsive tabs (mobile/tablet) ---------- */
type MobileTab = 'editor' | 'preview' | 'design'
const mobileTab = ref<MobileTab>('preview')

const tabLabel = computed(() => {
  if (props.currentLang === 'es') return { editor: 'Editor', preview: 'Vista', design: 'Diseño' }
  return { editor: 'Editor', preview: 'Preview', design: 'Design' }
})

/** ---------- Export JSON ---------- */
const handleExportJSON = () => {
  const blob = new Blob([JSON.stringify(cvData.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(cvData.value.fileName || 'CV').replace(/\s+/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/** ---------- Export helpers ---------- */
const waitTwoFrames = async () => {
  await new Promise<void>((r) => requestAnimationFrame(() => r()))
  await new Promise<void>((r) => requestAnimationFrame(() => r()))
}

const waitFonts = async () => {
  // @ts-ignore
  if (document.fonts?.ready) {
    // @ts-ignore
    await document.fonts.ready
  }
}

const buildSandbox = () => {
  const sandbox = document.createElement('div')
  sandbox.id = 'pdf-export-sandbox'
  sandbox.style.position = 'fixed'
  sandbox.style.left = '-99999px'
  sandbox.style.top = '0'
  sandbox.style.background = '#ffffff'
  sandbox.style.padding = '0'
  sandbox.style.margin = '0'
  sandbox.style.zIndex = '-1'
  sandbox.style.pointerEvents = 'none'
  return sandbox
}

/**
 * Export PDF SIN blanco y multipágina alineada:
 * - Captura desde un clon con tamaño fijo (px)
 * - NO usa foreignObjectRendering (evita canvas vacío)
 * - Divide por slices (cada página desde 0,0)
 */
const handleExportPDF = async () => {
  const pageEl =
    document.querySelector<HTMLElement>('#resume-preview-content.resume-page') ??
    document.querySelector<HTMLElement>('#resume-preview-content .resume-page') ??
    document.querySelector<HTMLElement>('.resume-page')

  if (!pageEl) {
    alert(props.currentLang === 'es' ? 'No se encontró la hoja del CV.' : 'CV page not found.')
    return
  }

  const isLetter = settings.value.paperSize === 'Letter'
  const pdfFormat = isLetter ? 'letter' : 'a4'

  // Tamaño fijo en px (independiente del viewport)
  const targetWidthPx = isLetter ? 850 : 794

  // Clonar hoja
  const clone = pageEl.cloneNode(true) as HTMLElement
  clone.style.transform = 'none'
  clone.style.boxShadow = 'none'
  clone.style.margin = '0'
  clone.style.background = '#ffffff'
  clone.style.overflow = 'visible'
  clone.style.width = `${targetWidthPx}px`
  clone.style.maxWidth = `${targetWidthPx}px`
  clone.style.paddingBottom = '60px' // buffer contra cortes feos

  const sandbox = buildSandbox()
  sandbox.appendChild(clone)
  document.body.appendChild(sandbox)

  try {
    await waitFonts()
    await waitTwoFrames()

    // Medidas reales ya renderizadas
    const exportWidth = clone.scrollWidth
    const exportHeight = clone.scrollHeight

    const canvas = await html2canvas(clone, {
      backgroundColor: '#ffffff',
      useCORS: true,
      scale: 2,
      scrollX: 0,
      scrollY: 0,
      width: exportWidth,
      height: exportHeight,
      windowWidth: exportWidth,
      windowHeight: exportHeight
    })

    // Si aún así queda blanco, lo detectamos
    const ctxTest = canvas.getContext('2d')
    const pixel = ctxTest?.getImageData(0, 0, 1, 1).data
    const isBlank = pixel ? pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255 && pixel[3] === 255 : false
    if (isBlank && exportHeight > 50) {
      alert(
        props.currentLang === 'es'
          ? 'La captura salió en blanco. Revisa si hay extensiones (dark reader) o estilos globales con filter/transform.'
          : 'Capture is blank. Check extensions (dark reader) or global CSS filter/transform.'
      )
      return
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: pdfFormat
    })

    const pdfW = pdf.internal.pageSize.getWidth()
    const pdfH = pdf.internal.pageSize.getHeight()

    // Altura en px equivalente a 1 página, basado en ratio PDF
    const pageHeightPx = Math.floor((canvas.width * pdfH) / pdfW)
    const pageCount = Math.ceil(canvas.height / pageHeightPx)

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
      const sliceCanvas = document.createElement('canvas')
      const sliceCtx = sliceCanvas.getContext('2d')

      const sliceY = pageIndex * pageHeightPx
      const sliceH = Math.min(pageHeightPx, canvas.height - sliceY)

      sliceCanvas.width = canvas.width
      sliceCanvas.height = sliceH

      if (!sliceCtx) continue
      sliceCtx.fillStyle = '#ffffff'
      sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)

      sliceCtx.drawImage(canvas, 0, sliceY, canvas.width, sliceH, 0, 0, canvas.width, sliceH)

      const imgData = sliceCanvas.toDataURL('image/jpeg', 0.98)

      if (pageIndex > 0) pdf.addPage()

      const imgWmm = pdfW
      const imgHmm = (sliceH * imgWmm) / canvas.width
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWmm, imgHmm, undefined, 'FAST')
    }

    pdf.save(`${(cvData.value.fileName || 'CV').replace(/\s+/g, '_')}.pdf`)
  } finally {
    document.body.removeChild(sandbox)
  }
}

/** ---------- Import ---------- */
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
        queueMicrotask(() => {
          syncingFromCv = false
        })
      } catch {
        alert(props.currentLang === 'es' ? 'JSON inválido' : 'Invalid JSON')
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
        alert(props.currentLang === 'es' ? 'Error al leer DOCX' : 'DOCX read error')
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
        // @ts-ignore
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
        alert(props.currentLang === 'es' ? 'Error al leer PDF' : 'PDF read error')
      }
    }
    reader.readAsArrayBuffer(file)
    return
  }

  alert(props.currentLang === 'es' ? 'Formato no soportado (.json, .docx, .pdf)' : 'Unsupported format (.json, .docx, .pdf)')
}
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-[calc(100vh-64px)]">
    <div class="lg:hidden sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 py-2 print:hidden">
      <div class="grid grid-cols-3 gap-2">
        <button
          type="button"
          class="px-3 py-2 rounded text-xs font-semibold border"
          :class="mobileTab === 'editor'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'"
          @click="mobileTab = 'editor'"
        >
          {{ tabLabel.editor }}
        </button>

        <button
          type="button"
          class="px-3 py-2 rounded text-xs font-semibold border"
          :class="mobileTab === 'preview'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'"
          @click="mobileTab = 'preview'"
        >
          {{ tabLabel.preview }}
        </button>

        <button
          type="button"
          class="px-3 py-2 rounded text-xs font-semibold border"
          :class="mobileTab === 'design'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'"
          @click="mobileTab = 'design'"
        >
          {{ tabLabel.design }}
        </button>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row lg:h-[calc(100vh-64px)] overflow-hidden">
      <div class="lg:w-2/5 lg:overflow-y-auto print:hidden" :class="mobileTab === 'editor' ? 'block' : 'hidden lg:block'">
        <ResumeEditor v-model:cvData="cvData" :current-lang="currentLang" @save="handleSave" @back="handleBack" />
      </div>

      <div
        class="flex-1 flex justify-center p-3 sm:p-4 overflow-y-auto bg-gray-200 dark:bg-gray-900/40"
        :class="mobileTab === 'preview' ? 'block' : 'hidden lg:flex'"
      >
        <div class="w-full flex justify-center">
          <div class="transform lg:scale-100 scale-[0.92] sm:scale-100 origin-top">
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