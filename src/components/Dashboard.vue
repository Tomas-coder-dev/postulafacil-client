<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Trash2, FileText, Upload, Download } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useCvStore } from '../store/cvStore'
import ResumePreview from './ResumePreview.vue'
import { translations } from '../utils/translations'

const store = useCvStore()
const { cvList, currentLang } = storeToRefs(store)

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

const printingIndex = ref<number | null>(null)

const t = (key: string, lang: 'es' | 'en') => (translations[lang] as Record<string, string>)?.[key] || key

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
        store.importCv(json)
      } catch {
        alert(currentLang.value === 'es' ? 'JSON inválido.' : 'Invalid JSON.')
      }
    }
    reader.readAsText(file)
  } else {
    alert(
      currentLang.value === 'es'
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

const exportCvPdf = async (cv: any, index: number) => {
  const cvSettings = cv.meta?.settings ?? thumbnailSettings

  // Mostrar el ResumePreview a tamaño real temporalmente para capturarlo
  printingIndex.value = index

  await new Promise(r => setTimeout(r, 300))

  const pageEl = document.querySelector<HTMLElement>(`#print-source-${index} .resume-page`)

  if (!pageEl) {
    printingIndex.value = null
    alert(currentLang.value === 'es' ? 'No se pudo generar el PDF.' : 'Could not generate PDF.')
    return
  }

  // Reutilizar el mismo mecanismo que el editor
  const id = 'pf-print-style'
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
@media print {
  @page { size: A4; margin: 0; }
  html, body { background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body > *:not(#pf-print-root) { display: none !important; }
  #pf-print-root { display: block !important; }
  #pf-print-root .resume-page { box-shadow: none !important; margin: 0 auto !important; transform: none !important; }
  header, section, ul, li { break-inside: avoid; page-break-inside: avoid; }
}
`
    document.head.appendChild(style)
  }

  let root = document.getElementById('pf-print-root') as HTMLDivElement | null
  if (!root) {
    root = document.createElement('div')
    root.id = 'pf-print-root'
    root.style.display = 'none'
    document.body.appendChild(root)
  }

  root.innerHTML = ''
  const clone = pageEl.cloneNode(true) as HTMLElement
  clone.removeAttribute('id')
  clone.style.boxShadow = 'none'
  clone.style.transform = 'none'
  root.appendChild(clone)

  const isLetter = cvSettings.paperSize === 'Letter'
  const pageSize = isLetter ? 'Letter' : 'A4'
  const pageWidth = isLetter ? '216mm' : '210mm'
  const pageHeight = isLetter ? '279mm' : '297mm'

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
    background: ${cvSettings.pageBackground || '#ffffff'} !important;
    font-family: ${cvSettings.fontFamily} !important;
    font-size: ${cvSettings.fontSize}pt !important;
    line-height: ${cvSettings.lineSpacing} !important;
    padding-top: ${cvSettings.marginTop}px !important;
    padding-right: ${cvSettings.marginRight}px !important;
    padding-bottom: ${cvSettings.marginBottom}px !important;
    padding-left: ${cvSettings.marginLeft}px !important;
    box-sizing: border-box !important;
  }
  #pf-print-root .section-title {
    color: ${cvSettings.themeColor} !important;
    border-bottom-color: ${cvSettings.themeColor} !important;
  }
  #pf-print-root header {
    border-bottom-color: ${cvSettings.themeColor} !important;
  }
}
`
  document.head.appendChild(runtime)

  root.style.display = 'block'

  const cleanup = () => {
    root!.style.display = 'none'
    printingIndex.value = null
  }

  window.addEventListener('afterprint', cleanup, { once: true })
  window.print()
  setTimeout(() => cleanup(), 1500)
}

const handleDownload = async (cv: any, index: number) => {
  const isPdf = confirm(
    currentLang.value === 'es'
      ? '¿Descargar PDF?\n(Aceptar = PDF | Cancelar = JSON)'
      : 'Download PDF?\n(OK = PDF | Cancel = JSON)'
  )

  if (isPdf) await exportCvPdf(cv, index)
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
        @click="store.createNewCV()"
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
        <!-- ResumePreview a tamaño real, oculto, para capturar al imprimir -->
        <div
          :id="`print-source-${index}`"
          class="fixed left-[-9999px] top-0 pointer-events-none"
          :style="printingIndex === index ? 'opacity:1' : 'opacity:0'"
        >
          <ResumePreview
            :cv-data="cv"
            :settings="cv.meta?.settings ?? thumbnailSettings"
            :current-lang="currentLang"
            :export-mode="false"
          />
        </div>

        <div
          class="relative flex-1 overflow-hidden bg-gray-200 dark:bg-gray-800 cursor-pointer"
          @click="store.editCv(index)"
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
              @click.stop="handleDownload(cv, index)"
              class="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition"
              :title="currentLang === 'es' ? 'Descargar (PDF o JSON)' : 'Download (PDF or JSON)'"
              type="button"
            >
              <Download :size="16" />
            </button>

            <button
              @click.stop="store.duplicateCV(index)"
              class="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition"
              :title="currentLang === 'es' ? 'Duplicar' : 'Duplicate'"
              type="button"
            >
              <Copy :size="16" />
            </button>

            <button
              @click.stop="store.deleteCV(index)"
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