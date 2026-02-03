<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import Dashboard from './components/Dashboard.vue'
import EditorView from './views/EditorView.vue'
import Landing from './components/Landing.vue'

// --- ESTADO GLOBAL ---
const darkMode = ref(true)
const currentLang = ref<'es' | 'en'>('es')
const currentView = ref<'landing' | 'dashboard' | 'editor'>('landing')
const selectedCvIndex = ref<number | null>(null)
const cvList = ref<any[]>([])

// --- DATOS POR DEFECTO ---
const fabricioCV = {
  name: 'Fabricio Aylas Moreno',
  title: 'Desarrollador Full Stack Junior',
  email: 'aylasmorenof@gmail.com',
  phone: '+51 912 404 450',
  location: 'Lima, Peru',
  linkedin: 'https://www.linkedin.com/in/fabricio-aylas',
  github: '',
  summary:
    'Egresado de Diseño y Desarrollo de Software (TECSUP), con experiencia en desarrollo web y móvil full stack adquirida a través de proyectos aplicados, prácticas profesionales y hackathons. Interesado en la creación de soluciones tecnológicas eficientes, con enfoque en calidad, escalabilidad y trabajo colaborativo. Busco desarrollarme como Desarrollador Full Stack Junior, aportando compromiso, aprendizaje continuo y buenas prácticas de desarrollo.',

  education: [
    {
      school: 'Tecsup',
      degree: 'Diseño y Desarrollo de Software',
      date: '2023 – 2025',
      location: 'Lima, Peru'
    }
  ],

  experience: [
    {
      company: 'CIMARK.PE',
      role: 'Pasante de Desarrollo Web',
      date: 'Feb 2025 - May 2025',
      location: 'Lima, Peru',
      description: [
        'Rediseño y mejora de páginas web existentes.',
        'Desarrollo frontend con React y Next.js.',
        'Diseño responsivo.',
        'Soporte backend.'
      ]
    },
    {
      company: 'TECSUP',
      role: 'Desarrollador FullStack',
      date: 'Mar 2025 - Abr 2025',
      location: 'Lima, Peru',
      description: [
        'Sistema de inventario químico.',
        'Laravel + SQLite.',
        'CRUD y reportes.',
        'Metodología ágil.'
      ]
    }
  ],

  projects: [
    {
      name: 'TecLunch',
      description: 'Sistema de reservas.',
      tech: 'React, Django'
    },
    {
      name: 'CEDITEC',
      description: 'Rediseño web.',
      tech: 'Laravel, MySQL'
    }
  ],

  certifications: [
    'Scrum Fundamentals',
    'Cisco Security',
    'Hackathon BCP',
    'Hackathon TECSUP'
  ],

  skills: {
    frontend: 'HTML, CSS, JS, React',
    backend: 'Node, PHP, Laravel',
    db: 'MySQL, PostgreSQL',
    tools: 'Git, Linux, AWS',
    languages: 'Español, Inglés',
    other: ''
  },

  fileName: 'CV_Principal_Fabricio'
}

// --- LOCAL STORAGE ---
const saveToLocal = () => {
  localStorage.setItem('myCvs', JSON.stringify(cvList.value))
}

// --- CICLO DE VIDA ---
onMounted(() => {
  // Tema
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'dark' || !savedTheme) {
    darkMode.value = true
    document.documentElement.classList.add('dark')
  } else {
    darkMode.value = false
    document.documentElement.classList.remove('dark')
  }

  // CVs
  const savedCvs = localStorage.getItem('myCvs')

  if (savedCvs) {
    cvList.value = JSON.parse(savedCvs)
  } else {
    cvList.value = [{ ...fabricioCV }]
    saveToLocal()
  }
})

// --- FUNCIONES ---
const goHome = () => {
  currentView.value = 'landing'
  selectedCvIndex.value = null
}

const enterApp = () => {
  currentView.value = 'dashboard'
}

const toggleTheme = () => {
  darkMode.value = !darkMode.value

  document.documentElement.classList.toggle('dark')

  localStorage.setItem(
    'theme',
    darkMode.value ? 'dark' : 'light'
  )
}

const createNewCV = () => {
  const newCV = {
    ...fabricioCV,
    title: `Nuevo CV ${cvList.value.length + 1}`,
    fileName: `Nuevo_CV_${cvList.value.length + 1}`
  }

  cvList.value.push(newCV)

  saveToLocal()

  selectedCvIndex.value = cvList.value.length - 1
  currentView.value = 'editor'
}

const duplicateCV = (index: number) => {
  const copy = JSON.parse(
    JSON.stringify(cvList.value[index])
  )

  copy.title += ' (Copia)'
  copy.fileName += '_copia'

  cvList.value.splice(index + 1, 0, copy)

  saveToLocal()
}

const deleteCV = (index: number) => {
  if (
    confirm(
      currentLang.value === 'es'
        ? '¿Borrar?'
        : 'Delete?'
    )
  ) {
    cvList.value.splice(index, 1)
    saveToLocal()
  }
}

const saveCV = (updatedData: any) => {
  if (selectedCvIndex.value !== null) {
    cvList.value[selectedCvIndex.value] =
      updatedData

    saveToLocal()

    alert(
      currentLang.value === 'es'
        ? 'Guardado correctamente'
        : 'Saved'
    )
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans"
  >
    <NavBar
      :dark-mode="darkMode"
      :current-lang="currentLang"
      @toggle-theme="toggleTheme"
      @toggle-lang="
        currentLang =
          currentLang === 'es' ? 'en' : 'es'
      "
      @go-home="goHome"
    />

    <!-- LANDING -->
    <Landing
      v-if="currentView === 'landing'"
      :current-lang="currentLang"
      @start="enterApp"
    />

    <!-- DASHBOARD -->
    <Dashboard
      v-else-if="currentView === 'dashboard'"
      :cv-list="cvList"
      :current-lang="currentLang"
      @create-new="createNewCV"
      @edit-cv="
        (idx) => {
          selectedCvIndex = idx
          currentView = 'editor'
        }
      "
      @duplicate-cv="duplicateCV"
      @delete-cv="deleteCV"
    />

    <!-- EDITOR -->
    <EditorView
      v-else-if="
        currentView === 'editor' &&
        selectedCvIndex !== null
      "
      :initial-data="cvList[selectedCvIndex]"
      :current-lang="currentLang"
      @save="saveCV"
      @back="currentView = 'dashboard'"
    />
  </div>
</template>
