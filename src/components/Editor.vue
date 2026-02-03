<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

// Recibe el CV que vamos a editar
const props = defineProps<{ 
  initialData: any 
}>()

const emit = defineEmits(['save', 'back'])

// Clonamos la data para editarla sin romper el original hasta guardar
const cvData = ref({ ...props.initialData })

// Ajustes visuales locales
const settings = ref({
  lineSpacing: 1.5,
  themeColor: '#377BB5'
})

// Función guardar cambios hacia arriba
const saveChanges = () => {
  emit('save', cvData.value)
}

// Auto-guardado cada 2 segundos (Opcional)
watch(cvData, () => {
  // Podrías emitir un evento 'update' silencioso aquí
}, { deep: true })
</script>

<template>
  <div class="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
    
    <div class="w-full md:w-1/3 flex flex-col border-r border-gray-700 bg-gray-800 h-full">
       <div class="p-4 border-b border-gray-700 flex justify-between">
          <button @click="emit('back')" class="text-gray-400 hover:text-white flex items-center gap-1">
            ← Volver
          </button>
          <button @click="saveChanges" class="bg-green-600 text-white px-4 py-1 rounded text-sm">
            Guardar
          </button>
       </div>
       
       <div class="p-6 overflow-y-auto flex-1">
          <div class="space-y-4 mb-8">
            <label class="block text-xs mb-1 text-gray-400">Nombre Completo</label>
            <input v-model="cvData.name" class="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
            </div>
       </div>
    </div>

    <div class="hidden md:flex flex-1 bg-gray-600 p-8 overflow-y-auto justify-center">
       <div class="resume-page shadow-2xl" :style="{ '--line-spacing': settings.lineSpacing, '--theme-color': settings.themeColor }">
          <header class="text-center mb-6 border-b pb-4" :style="{ borderColor: settings.themeColor }">
            <h1 class="text-3xl font-serif font-bold text-black mb-1">{{ cvData.name }}</h1>
             </header>
       </div>
    </div>

  </div>
</template>