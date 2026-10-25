<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Copy, Trash2, FileText, Upload, Download } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useCvStore } from '../store/cvStore'
import ResumePreview from './ResumePreview.vue'
import html2pdf from 'html2pdf.js'

const store = useCvStore()
const { cvList } = storeToRefs(store)
const { t } = useI18n()

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
const downloadFor = ref<number | null>(null)
const pendingDelete = ref<number | null>(null)

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
        alert(t('jsonInvalid'))
      }
    }
    reader.readAsText(file)
  } else {
    alert(t('dashboardJsonOnly'))
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
    alert(t('pdfMissing'))
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
    alert(t('pdfError'))
  } finally {
    printingIndex.value = null
  }
}

const toggleDownload = (index: number) => {
  pendingDelete.value = null
  downloadFor.value = downloadFor.value === index ? null : index
}

const confirmDelete = (index: number) => {
  store.deleteCV(index)
  pendingDelete.value = null
  downloadFor.value = null
}
</script>

<template>
  <div class="px-6 py-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {{ t('dashboardTitle') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          {{ t('dashboardSubtitle') }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="triggerImport"
          class="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
          type="button"
        >
          <Upload :size="18" />
          <span>{{ t('import') }}</span>
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
          {{ t('createNew') }}
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
              :export-mode="false"
            />
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-black/10 to-transparent transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
            <span class="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-xl transform translate-y-6 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              {{ t('edit') }}
            </span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800/80 p-5 border-t border-gray-100 dark:border-gray-700/50 flex justify-between items-center z-10 relative">
          <div class="flex-1 min-w-0 pr-3">
            <h3 class="font-bold text-gray-900 dark:text-gray-100 truncate text-base" :title="cv.fileName || cv.name">
              {{ cv.fileName || cv.name || t('untitledCv') }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5 font-medium">
              <FileText :size="12" /> {{ t('edited') }}
            </p>
          </div>

          <div v-if="pendingDelete === index" class="flex items-center gap-2" @click.stop>
            <button
              @click.stop="confirmDelete(index)"
              class="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded"
              type="button"
            >
              {{ t('delete') }}
            </button>
            <button
              @click.stop="pendingDelete = null"
              class="px-2 py-1 text-xs font-bold text-gray-600 dark:text-gray-200"
              type="button"
            >
              {{ t('cancel') }}
            </button>
          </div>

          <div v-else class="flex items-center gap-1">
            <div class="relative">
              <button
                @click.stop="toggleDownload(index)"
                class="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition"
                :title="t('downloadPdf')"
                type="button"
              >
                <Download :size="16" />
              </button>
              <div
                v-if="downloadFor === index"
                class="absolute bottom-8 right-0 z-20 w-36 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
              >
                <button
                  @click.stop="exportCvPdf(cv, index); downloadFor = null"
                  class="block w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                  type="button"
                >
                  {{ t('downloadPdf') }}
                </button>
                <button
                  @click.stop="exportCvJson(cv); downloadFor = null"
                  class="block w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                  type="button"
                >
                  {{ t('downloadJson') }}
                </button>
              </div>
            </div>

            <button
              @click.stop="store.duplicateCV(index)"
              class="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition"
              :title="t('duplicate')"
              type="button"
            >
              <Copy :size="16" />
            </button>

            <button
              @click.stop="pendingDelete = index; downloadFor = null"
              class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
              :title="t('delete')"
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