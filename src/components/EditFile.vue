<script setup lang="ts">
import { computed } from 'vue'
import {
  Save,
  FileJson,
  Printer,
  Upload,
  Type,
  FileText,
  Palette,
  Monitor,
  SlidersHorizontal,
  Download,
  FilePenLine
} from 'lucide-vue-next'
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

// Nombre de archivo derivado del cvData
const fileName = computed({
  get: () => props.cvData?.fileName || 'Nuevo_CV',
  set: (val: string) => emit('update:fileName', val)
})

// Actualiza el objeto settings completo con la clave cambiada
const updateSetting = (key: keyof typeof props.settings, value: any) => {
  emit('update:settings', { ...props.settings, [key]: value })
}

// Importar JSON
const handleImportChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files.length) return
  emit('importJSON', input.files[0])
  input.value = ''
}

// Presets de color de títulos
const themeColors = [
  '#000000', // negro
  '#1F2937', // gris oscuro
  '#0F766E', // teal
  '#2563EB', // azul
  '#7C2D12', // marrón
  '#B91C1C'  // rojo
]
</script>

<template>
  <div
    class="w-full flex flex-col border-l border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-full print:hidden"
  >
    <!-- PANEL SUPERIOR: ARCHIVO -->
    <div class="border-b border-gray-200 dark:border-gray-700 p-4 space-y-4">
      <div class="flex items-center justify-between mb-1">
        <div
          class="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
        >
          <Download size="14" />
          <span>{{ t('fileSection') }}</span>
        </div>
      </div>

      <div class="space-y-3 text-sm">
        <!-- Nombre de archivo -->
        <div class="flex items-center gap-2">
          <FilePenLine size="16" class="text-gray-500" />
          <input
            v-model="fileName"
            class="flex-1 bg-transparent border-b border-dashed border-gray-300 dark:border-gray-600 text-xs px-1 py-0.5 outline-none text-gray-800 dark:text-gray-100"
            :placeholder="t('fileNameLabel')"
          />
        </div>

        <!-- Guardar -->
        <button
          @click="emit('save')"
          class="w-full inline-flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs text-gray-700 dark:text-gray-200"
        >
          <span class="inline-flex items-center gap-2">
            <Save size="14" />
            <span>{{ t('fileSave') }}</span>
          </span>
        </button>

        <!-- Exportar PDF -->
        <button
          @click="emit('printPDF')"
          class="w-full inline-flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs text-gray-700 dark:text-gray-200"
        >
          <span class="inline-flex items-center gap-2">
            <Printer size="14" />
            <span>{{ t('fileExportPDF') }}</span>
          </span>
        </button>

        <!-- Exportar JSON -->
        <button
          @click="emit('exportJSON')"
          class="w-full inline-flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs text-gray-700 dark:text-gray-200"
        >
          <span class="inline-flex items-center gap-2">
            <FileJson size="14" />
            <span>{{ t('fileExportJSON') }}</span>
          </span>
        </button>

        <!-- Importar JSON -->
        <label
          class="w-full inline-flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs text-gray-700 dark:text-gray-200 cursor-pointer"
        >
          <span class="inline-flex items-center gap-2">
            <Upload size="14" />
            <span>{{ t('fileImportJSON') }}</span>
          </span>
          <input
            type="file"
            accept="application/json"
            class="hidden"
            @change="handleImportChange"
          />
        </label>
      </div>
    </div>

    <!-- PANEL INFERIOR: AJUSTES -->
    <div
      class="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-white dark:bg-gray-800 custom-scrollbar"
    >
      <!-- Tamaño de página -->
      <div class="space-y-1">
        <div
          class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide"
        >
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

      <!-- COLORES DE TEMA -->
      <div class="space-y-2">
        <div
          class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide"
        >
          <Palette size="14" />
          <span>{{ currentLang === 'es' ? 'Color de tema' : 'Theme color' }}</span>
        </div>

        <!-- Color de títulos -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[10px] text-gray-400 mr-1">
            {{ currentLang === 'es' ? 'Títulos' : 'Headings' }}
          </span>
          <button
            v-for="color in themeColors"
            :key="color"
            class="w-5 h-5 rounded-full border"
            :class="color === props.settings.themeColor ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'"
            :style="{ backgroundColor: color }"
            @click="updateSetting('themeColor', color)"
          ></button>
          <input
            :value="props.settings.themeColor"
            type="color"
            class="w-8 h-6 border border-gray-300 dark:border-gray-700 rounded cursor-pointer"
            @input="updateSetting('themeColor', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <!-- Fondo de hoja -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[10px] text-gray-400 mr-1">
            {{ currentLang === 'es' ? 'Fondo' : 'Background' }}
          </span>
          <button
            v-for="color in ['#ffffff', '#F9FAFB', '#FEF3C7', '#E0F2FE', '#FCE7F3', '#E5E7EB']"
            :key="color"
            class="w-5 h-5 rounded-full border"
            :class="color === props.settings.pageBackground ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'"
            :style="{ backgroundColor: color }"
            @click="updateSetting('pageBackground', color)"
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
        <div
          class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide"
        >
          <Type size="14" />
          <span>{{ t('fontFamily') }}</span>
        </div>
        <select
          :value="props.settings.fontFamily"
          @change="updateSetting('fontFamily', ($event.target as HTMLSelectElement).value)"
          class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs text-gray-800 dark:text-gray-100 mb-1"
        >
          <option value="Times New Roman, serif">Times New Roman</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Garamond, serif">Garamond</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Helvetica, sans-serif">Helvetica</option>
        </select>
      </div>

      <!-- Tamaño de fuente -->
      <div class="space-y-1">
        <div class="flex items-center justify-between">
          <div
            class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide"
          >
            <Type size="14" />
            <span>{{ t('fontSize') }}</span>
          </div>
          <span class="text-[10px] text-gray-400">
            {{ props.settings.fontSize }}pt
          </span>
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
        <div
          class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide"
        >
          <SlidersHorizontal size="14" />
          <span>{{ t('margins') }}</span>
        </div>

        <!-- Arriba y abajo -->
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

        <!-- Izquierda y derecha -->
        <div class="space-y-1 mt-1">
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

      <!-- Espaciado entre párrafos -->
      <div class="space-y-1">
        <div class="flex items-center justify-between">
          <div
            class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide"
          >
            <FileText size="14" />
            <span>{{ t('paragraphSpacing') }}</span>
          </div>
          <span class="text-[10px] text-gray-400">
            {{ props.settings.paragraphSpacing }}px
          </span>
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
          <div
            class="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide"
          >
            <Monitor size="14" />
            <span>{{ t('lineSpacing') }}</span>
          </div>
          <span class="text-[10px] text-gray-400">
            {{ props.settings.lineSpacing.toFixed(2) }}
          </span>
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
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
</style>