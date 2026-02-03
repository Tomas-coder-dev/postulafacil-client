<script setup lang="ts">
import { Copy, Trash2, FileText, Upload } from 'lucide-vue-next'
import { translations } from '../utils/translations'

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

// Helper traducción
// @ts-ignore
const t = (key: string, lang: 'es' | 'en') => translations[lang]?.[key] || key

// Import JSON
const triggerImport = () => {
  document.getElementById('file-upload')?.click()
}

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string)
      emit('importCv', json)
    } catch {
      alert(
        props.currentLang === 'es'
          ? 'Error: El archivo no es un JSON válido.'
          : 'Error: File is not valid JSON.'
      )
    }
  }
  reader.readAsText(file)
}

// Helpers para texto corto
const firstItems = (arr: any[] | undefined, limit: number) =>
  Array.isArray(arr) ? arr.slice(0, limit) : []

const shortText = (text: string | undefined, max = 220) => {
  if (!text) return ''
  if (text.length <= max) return text
  return text.slice(0, max) + '…'
}
</script>

<template>
  <div
    class="px-4 sm:px-6 lg:px-10 xl:px-12 py-6 lg:py-10 max-w-7xl mx-auto min-h-[calc(100vh-64px)] font-sans"
  >
    <!-- HEADER -->
    <div
      class="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 mb-8 md:mb-10"
    >
      <div class="flex-1">
        <h1
          class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1"
        >
          {{ t('dashboardTitle', currentLang) }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          {{ t('dashboardSubtitle', currentLang) }}
        </p>
      </div>

      <div class="flex items-center gap-3 self-stretch md:self-auto">
        <button
          @click="triggerImport"
          class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded hover:scale-105 transition shadow-lg border border-gray-600 text-sm"
        >
          <Upload size="16" />
          <span>{{ t('import', currentLang) }}</span>
        </button>
        <input
          id="file-upload"
          type="file"
          accept=".json"
          class="hidden"
          @change="handleFileUpload"
        />
      </div>
    </div>

    <!-- GRID DE CVS -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
    >
      <!-- CARD NUEVO CV -->
      <div
        @click="emit('createNew')"
        class="group cursor-pointer bg-gray-100 dark:bg-gray-800/40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center h-[340px] sm:h-[360px] lg:h-[380px] hover:border-postula-blue hover:bg-blue-50 dark:hover:bg-gray-800 transition duration-300"
      >
        <div
          class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl text-gray-400 group-hover:text-postula-blue group-hover:scale-110 transition shadow-inner"
        >
          +
        </div>
        <span
          class="mt-4 font-bold text-gray-500 dark:text-gray-400 group-hover:text-postula-blue text-sm sm:text-base text-center px-4"
        >
          {{ t('createNew', currentLang) }}
        </span>
      </div>

      <!-- CARDS DE CVS EXISTENTES -->
      <div
        v-for="(cv, index) in cvList"
        :key="index"
        class="relative group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 h-[340px] sm:h-[360px] lg:h-[380px] flex flex-col transition-all duration-300 overflow-hidden"
      >
        <!-- PREVIEW MINIATURA -->
        <div
          class="flex-1 bg-gray-200 dark:bg-gray-900 relative overflow-hidden cursor-pointer"
          @click="emit('editCv', index)"
        >
          <!-- Mini-hoja que refleja mejor el contenido -->
          <div
            class="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 origin-top bg-white text-black shadow-xl pointer-events-none select-none rounded-sm w-[190px] h-[270px] lg:w-[210mm] lg:h-[297mm] scale-[0.8] sm:scale-[0.85] lg:scale-[0.35]"
          >
            <div class="h-full px-3 py-3 sm:p-4 lg:p-8 text-[9px] sm:text-[10px]">
              <!-- NOMBRE -->
              <h2
                class="text-[13px] sm:text-[14px] lg:text-3xl font-serif font-bold text-center border-b pb-1 lg:pb-3 mb-1 lg:mb-3"
              >
                {{ cv.name || 'Sin nombre' }}
              </h2>

              <!-- TÍTULO PROFESIONAL -->
              <p
                v-if="cv.title"
                class="text-center italic text-blue-700 text-[9px] sm:text-[10px] lg:text-base mb-1 lg:mb-2"
              >
                {{ cv.title }}
              </p>

              <div class="text-[8px] sm:text-[9px] space-y-1.5 lg:space-y-2.5">
                <!-- RESUMEN -->
                <p class="line-clamp-3 text-justify">
                  {{ shortText(cv.summary, 180) }}
                </p>

                <!-- EXPERIENCIA -->
                <div v-if="cv.experience && cv.experience.length">
                  <p class="font-bold uppercase tracking-tight mt-1">
                    {{ currentLang === 'es' ? 'Experiencia' : 'Experience' }}
                  </p>
                  <div
                    v-for="(job, jIdx) in firstItems(cv.experience, 2)"
                    :key="jIdx"
                    class="mt-0.5"
                  >
                    <p class="font-semibold">
                      {{ job.company }}
                    </p>
                    <p class="italic">
                      {{ job.role }}
                    </p>
                    <p class="line-clamp-2 text-justify">
                      {{ shortText(job.description, 90) }}
                    </p>
                  </div>
                </div>

                <!-- PROYECTOS -->
                <div v-if="cv.projects && cv.projects.length">
                  <p class="font-bold uppercase tracking-tight mt-1">
                    {{ currentLang === 'es' ? 'Proyectos' : 'Projects' }}
                  </p>
                  <div
                    v-for="(proj, pIdx) in firstItems(cv.projects, 1)"
                    :key="pIdx"
                    class="mt-0.5"
                  >
                    <p class="font-semibold">
                      {{ proj.name }}
                    </p>
                    <p class="line-clamp-2 text-justify">
                      {{ shortText(proj.description, 80) }}
                    </p>
                  </div>
                </div>

                <!-- EDUCACIÓN -->
                <div v-if="cv.education && cv.education.length">
                  <p class="font-bold uppercase tracking-tight mt-1">
                    {{ currentLang === 'es' ? 'Educación' : 'Education' }}
                  </p>
                  <div
                    v-for="(edu, eIdx) in firstItems(cv.education, 1)"
                    :key="eIdx"
                    class="mt-0.5"
                  >
                    <p class="font-semibold">
                      {{ edu.school }}
                    </p>
                    <p class="italic">
                      {{ edu.degree }}
                    </p>
                  </div>
                </div>

                <!-- SKILLS cortas -->
                <div v-if="cv.skills && typeof cv.skills === 'object'">
                  <p class="font-bold uppercase tracking-tight mt-1">
                    {{ currentLang === 'es' ? 'Habilidades' : 'Skills' }}
                  </p>
                  <p v-if="cv.skills.frontend" class="line-clamp-1">
                    <strong>FE:</strong> {{ shortText(cv.skills.frontend, 50) }}
                  </p>
                  <p v-if="cv.skills.backend" class="line-clamp-1">
                    <strong>BE:</strong> {{ shortText(cv.skills.backend, 50) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones duplicar / borrar -->
          <div
            class="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-3 group-hover:translate-x-0"
          >
            <button
              @click.stop="emit('duplicateCv', index)"
              :title="t('duplicate', currentLang)"
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition z-20"
            >
              <Copy size="16" />
            </button>
            <button
              @click.stop="emit('deleteCv', index)"
              :title="t('delete', currentLang)"
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center hover:bg-red-600 hover:scale-110 transition z-20"
            >
              <Trash2 size="16" />
            </button>
          </div>

          <!-- Overlay EDIT -->
          <div
            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center pointer-events-none"
          >
            <div
              class="bg-white text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition duration-300 shadow-xl text-xs sm:text-sm"
            >
              {{ t('edit', currentLang) }}
            </div>
          </div>
        </div>

        <!-- FOOTER CARD -->
        <div
          class="p-3 sm:p-4 bg-white dark:bg-gray-800 z-10 border-t dark:border-gray-700"
        >
          <h3
            class="font-bold text-sm sm:text-base text-gray-800 dark:text-white truncate"
          >
            {{ cv.title || cv.name || t('edit', currentLang) }}
          </h3>
          <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <FileText size="12" />
            <span>{{ t('edited', currentLang) }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>