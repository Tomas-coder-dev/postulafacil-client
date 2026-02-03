<script setup lang="ts">
import { computed } from 'vue'
import { Save, FileJson, Printer, Upload, Palette, Download, FilePenLine, Type, FileText, Monitor, SlidersHorizontal } from 'lucide-vue-next'
import { translations } from '../utils/translations'

type PaperSize = 'A4' | 'Letter'

const props = defineProps<{
  cvData: any
  settings: {
    paperSize: PaperSize
    lineSpacing: number
    fontFamily: string
    fontSize: number
    paragraphSpacing: number
    marginTop: number
    marginBottom: number
    marginLeft: number
    marginRight: number
    themeColor: string
    pageBackground: string
  }
  fileName: string
  currentLang: 'es' | 'en'
}>()

const emit = defineEmits<{
  (e: 'update:settings', value: any): void
  (e: 'update:fileName', value: string): void
  (e: 'save'): void
  (e: 'exportJSON'): void
  (e: 'importJSON', file: File): void
  (e: 'printPDF'): void
}>()

// @ts-ignore
const t = (key: string) => translations[props.currentLang]?.[key] || key

const localFileName = computed({
  get: () => props.fileName || props.cvData?.fileName || 'Nuevo_CV',
  set: (val: string) => emit('update:fileName', val)
})

const updateSetting = (key: keyof typeof props.settings, value: any) => {
  emit('update:settings', { ...props.settings, [key]: value })
}

const handleImportChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.length) emit('importJSON', input.files[0])
  input.value = ''
}

const themeColors = ['#000000', '#1F2937', '#0F766E', '#2563EB', '#7C2D12', '#B91C1C']
const bgColors = ['#ffffff', '#F9FAFB', '#FEF3C7', '#E0F2FE', '#FCE7F3', '#E5E7EB']
</script>

<template>
  <div class="flex flex-col h-full bg-white dark:bg-gray-800 custom-scrollbar overflow-y-auto">
    <!-- ARCHIVO -->
    <div class="p-5 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500 mb-4">
        <Download size="14" /> {{ t('fileSection') }}
      </div>

      <div class="space-y-3">
        <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
          <FilePenLine size="14" class="text-gray-500" />
          <input
            v-model="localFileName"
            class="bg-transparent text-sm w-full outline-none text-gray-800 dark:text-white font-semibold"
            :placeholder="t('fileNameLabel')"
          />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button @click="$emit('save')" class="btn-action"><Save size="14" /> {{ t('save') }}</button>
          <button @click="$emit('printPDF')" class="btn-action"><Printer size="14" /> PDF</button>
          <button @click="$emit('exportJSON')" class="btn-action"><FileJson size="14" /> JSON</button>

          <label class="btn-action cursor-pointer">
            <Upload size="14" /> {{ t('import') }}
            <input type="file" accept=".json,.pdf,.docx" class="hidden" @change="handleImportChange" />
          </label>
        </div>
      </div>
    </div>

    <!-- DISEÑO -->
    <div class="p-5 space-y-6">
      <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
        <Palette size="14" /> {{ props.currentLang === 'es' ? 'Diseño' : 'Design' }}
      </div>

      <!-- Tamaño de página -->
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide text-[11px]">
          <FileText size="14" />
          <span>{{ t('paperSize') }}</span>
        </div>
        <select
          :value="props.settings.paperSize"
          @change="updateSetting('paperSize', ($event.target as HTMLSelectElement).value)"
          class="w-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs text-gray-800 dark:text-gray-100"
        >
          <option value="A4">{{ t('paperA4') }}</option>
          <option value="Letter">{{ t('paperLetter') }}</option>
        </select>
      </div>

      <!-- Colores -->
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide text-[11px]">
          <Palette size="14" />
          <span>{{ props.currentLang === 'es' ? 'Colores' : 'Colors' }}</span>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[10px] text-gray-400 mr-1">{{ props.currentLang === 'es' ? 'Títulos' : 'Headings' }}</span>
          <button
            v-for="c in themeColors"
            :key="c"
            class="w-5 h-5 rounded-full border"
            :class="c === props.settings.themeColor ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'"
            :style="{ backgroundColor: c }"
            @click="updateSetting('themeColor', c)"
          ></button>
          <input
            :value="props.settings.themeColor"
            type="color"
            class="w-8 h-6 border border-gray-300 dark:border-gray-700 rounded cursor-pointer"
            @input="updateSetting('themeColor', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[10px] text-gray-400 mr-1">{{ props.currentLang === 'es' ? 'Fondo hoja' : 'Page background' }}</span>
          <button
            v-for="c in bgColors"
            :key="c"
            class="w-5 h-5 rounded-full border"
            :class="c === props.settings.pageBackground ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'"
            :style="{ backgroundColor: c }"
            @click="updateSetting('pageBackground', c)"
          ></button>
          <input
            :value="props.settings.pageBackground"
            type="color"
            class="w-8 h-6 border border-gray-300 dark:border-gray-700 rounded cursor-pointer"
            @input="updateSetting('pageBackground', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>

      <!-- Tipografía -->
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide text-[11px]">
          <Type size="14" />
          <span>{{ t('fontFamily') }}</span>
        </div>
        <select
          :value="props.settings.fontFamily"
          @change="updateSetting('fontFamily', ($event.target as HTMLSelectElement).value)"
          class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs text-gray-800 dark:text-gray-100"
        >
          <option value="Times New Roman, serif">Times New Roman</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Garamond, serif">Garamond</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Helvetica, sans-serif">Helvetica</option>
        </select>
      </div>

      <!-- Tamaño fuente -->
      <div class="space-y-1">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide text-[11px]">
            <Type size="14" />
            <span>{{ t('fontSize') }}</span>
          </div>
          <span class="text-[10px] text-gray-400">{{ props.settings.fontSize }}pt</span>
        </div>
        <input
          type="range"
          min="9"
          max="16"
          step="1"
          :value="props.settings.fontSize"
          @input="updateSetting('fontSize', Number(($event.target as HTMLInputElement).value))"
          class="w-full accent-orange-400"
        />
      </div>

      <!-- Márgenes -->
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide text-[11px]">
          <SlidersHorizontal size="14" />
          <span>{{ t('margins') }}</span>
        </div>

        <div class="space-y-1">
          <div class="flex justify-between text-[10px] text-gray-400">
            <span>{{ t('marginsTopBottom') }}</span>
            <span>{{ props.settings.marginTop }}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="2"
            :value="props.settings.marginTop"
            @input="updateSetting('marginTop', Number(($event.target as HTMLInputElement).value))"
            class="w-full accent-orange-400"
          />
          <input
            type="range"
            min="0"
            max="80"
            step="2"
            :value="props.settings.marginBottom"
            @input="updateSetting('marginBottom', Number(($event.target as HTMLInputElement).value))"
            class="w-full accent-orange-400 mt-1"
          />
        </div>

        <div class="space-y-1 mt-2">
          <div class="flex justify-between text-[10px] text-gray-400">
            <span>{{ t('marginsLeftRight') }}</span>
            <span>{{ props.settings.marginLeft }}px</span>
          </div>
          <input
            type="range"
            min="20"
            max="80"
            step="2"
            :value="props.settings.marginLeft"
            @input="updateSetting('marginLeft', Number(($event.target as HTMLInputElement).value))"
            class="w-full accent-orange-400"
          />
          <input
            type="range"
            min="20"
            max="80"
            step="2"
            :value="props.settings.marginRight"
            @input="updateSetting('marginRight', Number(($event.target as HTMLInputElement).value))"
            class="w-full accent-orange-400 mt-1"
          />
        </div>
      </div>

      <!-- Párrafos -->
      <div class="space-y-1">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide text-[11px]">
            <FileText size="14" />
            <span>{{ t('paragraphSpacing') }}</span>
          </div>
          <span class="text-[10px] text-gray-400">{{ props.settings.paragraphSpacing }}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="32"
          step="2"
          :value="props.settings.paragraphSpacing"
          @input="updateSetting('paragraphSpacing', Number(($event.target as HTMLInputElement).value))"
          class="w-full accent-orange-400"
        />
      </div>

      <!-- Interlineado -->
      <div class="space-y-1">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide text-[11px]">
            <Monitor size="14" />
            <span>{{ t('lineSpacing') }}</span>
          </div>
          <span class="text-[10px] text-gray-400">{{ props.settings.lineSpacing.toFixed(2) }}</span>
        </div>
        <input
          type="range"
          min="1"
          max="2"
          step="0.05"
          :value="props.settings.lineSpacing"
          @input="updateSetting('lineSpacing', Number(($event.target as HTMLInputElement).value))"
          class="w-full accent-orange-400"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-action {
  @apply w-full inline-flex items-center justify-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs text-gray-700 dark:text-gray-200 transition border border-gray-200 dark:border-gray-600 font-semibold;
}
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
</style>