<script setup lang="ts">
import { Copy, Trash2, FileText, Upload, Download } from 'lucide-vue-next'
import ResumePreview from './ResumePreview.vue'
import { translations } from '../utils/translations'

// @ts-ignore
import html2pdf from 'html2pdf.js'

const props = defineProps<{
  cvList: any[]
  currentLang: 'es' | 'en'
}>()

const emit = defineEmits<{
  (e: 'createNew'): void
  (e: 'editCv', index: number): void
  (e: 'deleteCv', index: number): void
  (e: 'duplicateCv', index: number): void
  (e: 'importCv', data: any): void
}>()

const thumbnailSettings = {
  paperSize: 'A4',
  lineSpacing: 1.2,
  fontFamily: 'Times New Roman, serif',
  fontSize: 10,
  paragraphSpacing: 5,
  marginTop: 30,
  marginBottom: 30,
  marginLeft: 30,
  marginRight: 30,
  themeColor: '#000000',
  pageBackground: '#ffffff'
}

// @ts-ignore
const t = (key: string, lang: 'es' | 'en') => translations[lang]?.[key] || key

const triggerImport = () => {
  document.getElementById('dashboard-file-upload')?.click()
}

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.type === 'application/json' || file.name.toLowerCase().endsWith('.json')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        emit('importCv', json)
      } catch {
        alert(props.currentLang === 'es' ? 'JSON inválido.' : 'Invalid JSON.')
      }
    }
    reader.readAsText(file)
  } else {
    alert(
      props.currentLang === 'es'
        ? 'En el Dashboard solo se importa JSON completo. Para PDF/DOCX usa Import dentro del editor.'
        : 'Dashboard imports full JSON only. For PDF/DOCX use Import inside the editor.'
    )
  }

  ;(event.target as HTMLInputElement).value = ''
}

const exportCvJson = (cv: any) => {
  const dataStr = JSON.stringify(cv, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${(cv.fileName || 'CV_Export').replace(/\s+/g, '_')}.json`
  a.click()

  URL.revokeObjectURL(url)
}

const exportCvPdf = async (cv: any) => {
  const temp = document.createElement('div')
  temp.style.background = '#ffffff'
  temp.style.padding = '0'
  temp.style.margin = '0'

  temp.innerHTML = `
    <div style="width:210mm; min-height:297mm; background:#fff; padding:20mm; font-family: Times New Roman, serif;">
      <h1 style="text-align:center; font-size:24pt; margin:0;">${cv.name || ''}</h1>
      <p style="text-align:center; margin:6px 0 16px 0;">
        ${(cv.email || '')}${cv.phone ? ' | ' + cv.phone : ''}
      </p>
      <p style="white-space:pre-line;">${cv.summary || ''}</p>
    </div>
  `

  const opt = {
    margin: 0,
    filename: `${(cv.fileName || 'CV').replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  // @ts-ignore
  await html2pdf().set(opt).from(temp).save()
}

const handleDownload = async (cv: any) => {
  const isPdf = confirm(
    props.currentLang === 'es'
      ? '¿Descargar PDF?\n(Aceptar = PDF | Cancelar = JSON)'
      : 'Download PDF?\n(OK = PDF | Cancel = JSON)'
  )

  if (isPdf) await exportCvPdf(cv)
  else exportCvJson(cv)
}
</script>

<template>
  <div class="px-6 py-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {{ t('dashboardTitle', currentLang) }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          {{ t('dashboardSubtitle', currentLang) }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="triggerImport"
          class="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
          type="button"
        >
          <Upload :size="18" />
          <span>{{ t('import', currentLang) }}</span>
        </button>

        <input
          id="dashboard-file-upload"
          type="file"
          accept=".json,application/json"
          class="hidden"
          @change="handleFileUpload"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div
        @click="emit('createNew')"
        class="group cursor-pointer min-h-[420px] bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800/80 transition duration-300"
      >
        <div class="w-16 h-16 rounded-full bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition shadow-sm">
          +
        </div>
        <span class="font-bold text-gray-600 dark:text-gray-300 group-hover:text-blue-600">
          {{ t('createNew', currentLang) }}
        </span>
      </div>

      <div
        v-for="(cv, index) in cvList"
        :key="index"
        class="group relative bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col min-h-[420px]"
      >
        <div
          class="relative flex-1 overflow-hidden bg-gray-200 dark:bg-gray-800 cursor-pointer"
          @click="emit('editCv', index)"
        >
          <div class="absolute top-4 left-1/2 -translate-x-1/2 origin-top transform scale-[0.35] shadow-lg pointer-events-none select-none bg-white">
            <ResumePreview
              :cv-data="cv"
              :settings="thumbnailSettings"
              :current-lang="currentLang"
              :export-mode="false"
            />
          </div>

          <div class="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-5 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition duration-300">
              {{ t('edit', currentLang) }}
            </span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center z-10 relative">
          <div class="flex-1 min-w-0 pr-2">
            <h3 class="font-bold text-gray-800 dark:text-white truncate text-sm" :title="cv.fileName || cv.name">
              {{ cv.fileName || cv.name || 'CV Sin Título' }}
            </h3>
            <p class="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <FileText :size="10" /> {{ t('edited', currentLang) }}
            </p>
          </div>

          <div class="flex items-center gap-1">
            <button
              @click.stop="handleDownload(cv)"
              class="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition"
              :title="currentLang === 'es' ? 'Descargar (PDF o JSON)' : 'Download (PDF or JSON)'"
              type="button"
            >
              <Download :size="16" />
            </button>

            <button
              @click.stop="emit('duplicateCv', index)"
              class="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition"
              :title="currentLang === 'es' ? 'Duplicar' : 'Duplicate'"
              type="button"
            >
              <Copy :size="16" />
            </button>

            <button
              @click.stop="emit('deleteCv', index)"
              class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
              :title="currentLang === 'es' ? 'Eliminar' : 'Delete'"
              type="button"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>