<script setup lang="ts">
import { ref, watch } from 'vue'
import ResumeEditor from '../components/ResumeEditor.vue'
import ResumePreview from '../components/ResumePreview.vue'
import EditFile from '../components/EditFile.vue'

// @ts-ignore
import html2pdf from 'html2pdf.js'
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

const handleSave = () => emit('save', cvData.value)
const handleBack = () => emit('back')

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
  const src = document.getElementById('resume-preview-content')
  if (!src) return

  const clone = src.cloneNode(true) as HTMLElement
  clone.style.transform = 'none'
  clone.style.background = '#ffffff'
  clone.style.boxShadow = 'none'

  const wrapper = document.createElement('div')
  wrapper.style.background = '#ffffff'
  wrapper.style.padding = '0'
  wrapper.style.margin = '0'
  wrapper.appendChild(clone)

  const opt = {
    margin: 0,
    filename: `${(cvData.value.fileName || 'CV').replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: settings.value.paperSize === 'Letter' ? 'letter' : 'a4', orientation: 'portrait' }
  }

  // @ts-ignore
  await html2pdf().set(opt).from(wrapper).save()
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
  <div class="flex h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 overflow-hidden">
    <div class="w-2/5 overflow-y-auto print:hidden">
      <ResumeEditor
        v-model:cvData="cvData"
        :current-lang="currentLang"
        @save="handleSave"
        @back="handleBack"
      />
    </div>

    <div class="flex-1 flex justify-center p-4 overflow-y-auto bg-gray-200 dark:bg-gray-900/40">
      <div class="transform scale-[0.7] md:scale-[0.85] xl:scale-100 origin-top">
        <ResumePreview :cv-data="cvData" :settings="settings" :current-lang="currentLang" :export-mode="true" />
      </div>
    </div>

    <div class="w-1/4 bg-white dark:bg-gray-800 print:hidden overflow-y-auto border-l border-gray-300 dark:border-gray-700">
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
</template>