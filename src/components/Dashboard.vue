<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Trash2, FileText, Upload, Download } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useCvStore } from '../store/cvStore'
import ResumePreview from './ResumePreview.vue'
import { translations } from '../utils/translations'
import html2pdf from 'html2pdf.js'

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

  // Desactivar scale/opacity para la captura de html2pdf
  pageEl.style.opacity = '1'
  pageEl.style.transform = 'none'
  pageEl.style.boxShadow = 'none'

  const opt = {
    margin: 0,
    filename: `${(cv.fileName || 'CV_Export').replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: cvSettings.paperSize === 'Letter' ? 'letter' : 'a4', orientation: 'portrait' as const }
  }

  try {
    await html2pdf().set(opt).from(pageEl).save()
  } catch (error) {
    alert(currentLang.value === 'es' ? 'Error al generar el PDF' : 'Error generating PDF')
  } finally {
    printingIndex.value = null
  }
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
        class="group relative bg-white dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-200/60 dark:border-gray-700/50 flex flex-col min-h-[420px]"
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
          class="relative flex-1 overflow-hidden bg-gray-100/50 dark:bg-gray-900/40 cursor-pointer"
          @click="store.editCv(index)"
        >
          <div class="absolute top-4 left-1/2 -translate-x-1/2 origin-top transform scale-[0.35] shadow-xl rounded-sm overflow-hidden pointer-events-none select-none bg-white">
            <ResumePreview
              :cv-data="cv"
              :settings="thumbnailSettings"
              :current-lang="currentLang"
              :export-mode="false"
            />
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-black/10 to-transparent transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
            <span class="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-xl transform translate-y-6 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              {{ t('edit', currentLang) }}
            </span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800/80 p-5 border-t border-gray-100 dark:border-gray-700/50 flex justify-between items-center z-10 relative">
          <div class="flex-1 min-w-0 pr-3">
            <h3 class="font-bold text-gray-900 dark:text-gray-100 truncate text-base" :title="cv.fileName || cv.name">
              {{ cv.fileName || cv.name || 'CV Sin Título' }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5 font-medium">
              <FileText :size="12" /> {{ t('edited', currentLang) }}
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