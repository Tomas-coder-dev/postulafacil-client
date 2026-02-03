<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NavBar from './components/NavBar.vue' // <--- Asegúrate de actualizar este con LangSwitch
import Dashboard from './components/Dashboard.vue'
import Editor from './components/Editor.vue' // <--- Usará ResumePreview dentro

// --- ESTADO ---
const darkMode = ref(true)
const currentLang = ref<'es' | 'en'>('es')
const currentView = ref('dashboard')
const selectedCvIndex = ref<number | null>(null)
const cvList = ref<any[]>([])

// TUS DATOS REALES (Fabricio)
const fabricioCV = {
  name: "Fabricio Aylas Moreno",
  title: "Desarrollador Full Stack Junior",
  email: "aylasmorenof@gmail.com",
  phone: "+51 912 404 450",
  location: "Lima, Peru",
  linkedin: "https://www.linkedin.com/in/fabricio-aylas",
  summary: "Egresado de Diseño y Desarrollo de Software (TECSUP), con experiencia en desarrollo web y móvil full stack adquirida a través de proyectos aplicados, prácticas profesionales y hackathons.",
  education: [
    { school: "Tecsup", degree: "Diseño y Desarrollo de Software", date: "2023 – 2025", location: "Lima, Peru" }
  ],
  experience: [
    {
      company: "CIMARK.PE",
      role: "Pasante de Desarrollo Web",
      date: "Feb 2025 - May 2025",
      description: "Rediseño y mejora de páginas web existentes, proponiendo soluciones enfocadas en usabilidad.\nDesarrollo de interfaces frontend modernas utilizando HTML, CSS, Bootstrap, React y Next.js.",
      location: "Lima, Peru"
    },
    {
      company: "Tecsup",
      role: "Desarrollador FullStack",
      date: "Mar 2025 - Abr 2025",
      description: "Desarrollo de un sistema web de inventario químico.\nImplementación del backend utilizando Laravel y gestión de datos con SQLite.",
      location: "Lima, Peru"
    }
  ],
  skills: "Frontend: HTML, CSS, Bootstrap, JavaScript, React, Angular, Next.js\nBackend: Node.js, PHP, C#, .NET, Laravel\nBases de datos: MySQL, PostgreSQL, SQL Server"
}

// --- LOGICA ---
onMounted(() => {
  const savedCvs = localStorage.getItem('myCvs')
  if (savedCvs) {
    cvList.value = JSON.parse(savedCvs)
  } else {
    // Carga inicial si no hay nada
    cvList.value = [{ ...fabricioCV, title: "CV Principal (Fabricio)" }]
  }
})

const toggleTheme = () => {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark')
}

// Funciones CRUD (Copiar lógica de respuestas anteriores)
const duplicateCV = (idx: number) => { /* ... */ }
const deleteCV = (idx: number) => { /* ... */ }
// ... etc
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <NavBar 
      :dark-mode="darkMode" 
      :current-lang="currentLang"
      @toggle-theme="toggleTheme"
      @toggle-lang="currentLang = currentLang === 'es' ? 'en' : 'es'"
      @go-home="currentView = 'dashboard'"
    />

    <Dashboard 
      v-if="currentView === 'dashboard'"
      :cv-list="cvList"
      :current-lang="currentLang"
      @edit-cv="(idx) => { selectedCvIndex = idx; currentView = 'editor' }"
      @create-new="/* logic */"
      @duplicate-cv="duplicateCV"
      @delete-cv="deleteCV"
    />
    
    <Editor 
       v-else 
       :initial-data="cvList[selectedCvIndex]"
       @back="currentView = 'dashboard'"
    />
  </div>
</template>