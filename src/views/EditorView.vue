<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import ResumeEditor from '../components/ResumeEditor.vue'
import ResumePreview from '../components/ResumePreview.vue'
import EditFile from '../components/EditFile.vue'

import * as mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'

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

/** ---------- Responsive tabs ---------- */
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

/** ---------- PDF PERFECTO (sin popup, usando print del mismo documento) ---------- */
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

const ensurePrintStyles = () => {
  const id = 'pf-print-style'
  if (document.getElementById(id)) return

  const style = document.createElement('style')
  style.id = id
  style.textContent = `
@media print {
  @page { size: A4; margin: 0; } /* se ajusta dinámico en runtime con data-attr */
  html, body { background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* ocultar toda la app */
  body > *:not(#pf-print-root) { display: none !important; }

  /* mostrar solo el print root */
  #pf-print-root { display: block !important; }

  /* hoja */
  #pf-print-root .resume-page {
    box-shadow: none !important;
    margin: 0 auto !important;
    transform: none !important;
  }

  /* evitar cortes feos en bloques */
  header, section { break-inside: avoid; page-break-inside: avoid; }
  ul, li { break-inside: avoid; page-break-inside: avoid; }
}
`
  document.head.appendChild(style)
}

const handleExportPDF = async () => {
  await nextTick()

  const pageEl =
    document.querySelector<HTMLElement>('#resume-preview-content.resume-page') ??
    document.querySelector<HTMLElement>('#resume-preview-content .resume-page') ??
    document.querySelector<HTMLElement>('.resume-page')

  if (!pageEl) {
    alert(props.currentLang === 'es' ? 'No se encontró la hoja del CV.' : 'CV page not found.')
    return
  }

  ensurePrintStyles()

  // root para impresión dentro del mismo documento (sin popup)
  let root = document.getElementById('pf-print-root') as HTMLDivElement | null
  if (!root) {
    root = document.createElement('div')
    root.id = 'pf-print-root'
    root.style.display = 'none'
    document.body.appendChild(root)
  }

  // limpiar e insertar clon
  root.innerHTML = ''
  const clone = pageEl.cloneNode(true) as HTMLElement
  clone.removeAttribute('id') // evitar duplicados
  clone.style.boxShadow = 'none'
  clone.style.transform = 'none'
  root.appendChild(clone)

  // Ajustar tamaño de página según settings
  const isLetter = settings.value.paperSize === 'Letter'
  const pageSize = isLetter ? 'Letter' : 'A4'
  const pageWidth = isLetter ? '216mm' : '210mm'
  const pageHeight = isLetter ? '279mm' : '297mm'

  // Inyectar estilo runtime para asegurar 1:1
  const runtimeId = 'pf-print-runtime-style'
  const existing = document.getElementById(runtimeId)
  if (existing) existing.remove()

  const runtime = document.createElement('style')
  runtime.id = runtimeId
  runtime.textContent = `
@media print {
  @page { size: ${pageSize}; margin: 0; }
  #pf-print-root .resume-page {
    width: ${pageWidth} !important;
    min-height: ${pageHeight} !important;
    background: ${settings.value.pageBackground || '#ffffff'} !important;

    font-family: ${settings.value.fontFamily} !important;
    font-size: ${settings.value.fontSize}pt !important;
    line-height: ${settings.value.lineSpacing} !important;

    padding-top: ${settings.value.marginTop}px !important;
    padding-right: ${settings.value.marginRight}px !important;
    padding-bottom: ${settings.value.marginBottom}px !important;
    padding-left: ${settings.value.marginLeft}px !important;

    box-sizing: border-box !important;
  }

  /* Colores de títulos */
  #pf-print-root .section-title {
    color: ${settings.value.themeColor} !important;
    border-bottom-color: ${settings.value.themeColor} !important;
  }
  #pf-print-root header {
    border-bottom-color: ${settings.value.themeColor} !important;
  }
}
`
  document.head.appendChild(runtime)

  await waitFonts()
  await waitTwoFrames()

  // mostrar root solo para imprimir
  root.style.display = 'block'

  const cleanup = () => {
    root!.style.display = 'none'
    // no borramos el root, solo lo ocultamos para siguientes exports
  }

  // algunos navegadores soportan afterprint
  window.addEventListener('afterprint', cleanup, { once: true })

  // disparar impresión (user: Guardar como PDF)
  window.print()

  // fallback: si afterprint no corre, ocultar luego de un rato
  setTimeout(() => cleanup(), 1500)
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