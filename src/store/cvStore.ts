import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fabricioCV, fabricioCV_en, normalizeCv } from '../utils/cvDefaults'

export const useCvStore = defineStore(
  'cv',
  () => {
    // State
    const darkMode = ref(true)
    const currentLang = ref<'es' | 'en'>('es')
    const currentView = ref<'landing' | 'dashboard' | 'editor'>('landing')
    const selectedCvIndex = ref<number | null>(null)
    const cvList = ref<any[]>([])

    // Getters
    const currentCv = computed(() => {
      if (selectedCvIndex.value !== null && cvList.value[selectedCvIndex.value]) {
        return cvList.value[selectedCvIndex.value]
      }
      return null
    })

    // Actions
    const initializeStore = () => {
      document.documentElement.classList.toggle('dark', darkMode.value)
      
      // Load default if empty (usually it's auto-populated by persistedstate)
      if (!cvList.value || cvList.value.length === 0) {
        cvList.value = [normalizeCv({ ...fabricioCV })]
      } else {
        // Ensure normalization for existing loaded items
        cvList.value = cvList.value.map(normalizeCv)
      }
    }

    const goHome = () => {
      currentView.value = 'landing'
      selectedCvIndex.value = null
    }

    const enterApp = () => {
      currentView.value = 'dashboard'
    }

    const toggleTheme = () => {
      darkMode.value = !darkMode.value
      document.documentElement.classList.toggle('dark', darkMode.value)
    }

    const toggleLang = () => {
      currentLang.value = currentLang.value === 'es' ? 'en' : 'es'
    }

    const editCv = (idx: number) => {
      if (typeof idx !== 'number' || idx < 0 || idx >= cvList.value.length) return
      selectedCvIndex.value = idx
      currentView.value = 'editor'
    }

    const createNewCV = () => {
      const baseCV = currentLang.value === 'en' ? fabricioCV_en : fabricioCV
      const newCV = normalizeCv({
        ...JSON.parse(JSON.stringify(baseCV)),
        fileName: currentLang.value === 'en' ? `New_CV_${cvList.value.length + 1}` : `Nuevo_CV_${cvList.value.length + 1}`
      })
      cvList.value.push(newCV)
      editCv(cvList.value.length - 1)
    }

    const duplicateCV = (index: number) => {
      const copy = normalizeCv(JSON.parse(JSON.stringify(cvList.value[index])))
      copy.fileName = (copy.fileName || 'CV') + '_copia'
      cvList.value.splice(index + 1, 0, copy)
    }

    const deleteCV = (index: number) => {
      const confirmMsg = currentLang.value === 'es' ? '¿Borrar?' : 'Delete?'
      if (confirm(confirmMsg)) {
        cvList.value.splice(index, 1)
        if (selectedCvIndex.value === index) {
          selectedCvIndex.value = null
          currentView.value = 'dashboard'
        }
      }
    }

    const saveCV = (updatedData: any) => {
      if (selectedCvIndex.value !== null) {
        cvList.value[selectedCvIndex.value] = normalizeCv(updatedData)
      }
    }

    const importCv = (data: any) => {
      const imported = normalizeCv(data)
      imported.fileName = imported.fileName || `Import_${cvList.value.length + 1}`
      cvList.value.push(imported)
    }

    return {
      darkMode,
      currentLang,
      currentView,
      selectedCvIndex,
      cvList,
      currentCv,
      initializeStore,
      goHome,
      enterApp,
      toggleTheme,
      toggleLang,
      editCv,
      createNewCV,
      duplicateCV,
      deleteCV,
      saveCV,
      importCv
    }
  },
  {
    persist: true
  }
)
