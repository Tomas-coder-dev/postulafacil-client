<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import Dashboard from './components/Dashboard.vue'
import EditorView from './views/EditorView.vue'
import Landing from './components/Landing.vue'

const darkMode = ref(true)
const currentLang = ref<'es' | 'en'>('es')
const currentView = ref<'landing' | 'dashboard' | 'editor'>('landing')
const selectedCvIndex = ref<number | null>(null)
const cvList = ref<any[]>([])

const defaultSettings = {
  paperSize: 'A4',
  lineSpacing: 1.3,
  fontFamily: 'Times New Roman, serif',
  fontSize: 11,
  paragraphSpacing: 8,
  marginTop: 40,
  marginBottom: 40,
  marginLeft: 50,
  marginRight: 50,
  themeColor: '#000000',
  pageBackground: '#ffffff'
}

const fabricioCV = {
  name: 'Fabricio Aylas Moreno',
  email: 'aylasmorenof@gmail.com',
  phone: '+51 912 404 450',
  location: 'Lima, Peru',
  linkedin: 'https://www.linkedin.com/in/fabricio-aylas/',
  github: '',
  summary:
    'Egresado de Diseño y Desarrollo de Software (TECSUP), con experiencia en desarrollo Full Stack mediante proyectos empresariales y construcción de soluciones web y móviles. Experiencia en desarrollo de APIs REST, integración de bases de datos, aplicaciones móviles y servicios externos. Enfocado en crear soluciones escalables, mantenibles y orientadas a mejorar procesos mediante buenas prácticas de desarrollo.',
  experience: [
    {
      company: 'Syncra Connect — CRM Empresarial (Proyecto Unilene)',
      role: 'Desarrollador Full Stack',
      date: 'Feb 2026 - Jun 2026',
      location: 'Lima, Peru',
      description: [
        'Desarrollo y mantenimiento de funcionalidades para CRM empresarial.',
        'Implementación y consumo de APIs REST utilizando .NET.',
        'Desarrollo de interfaces y componentes frontend utilizando Angular.',
        'Participación en desarrollo de funcionalidades móviles utilizando Flutter.',
        'Creación y mantenimiento de consultas y procedimientos en SQL Server.',
        'Corrección de incidencias y optimización de funcionalidades existentes.',
        'Trabajo colaborativo mediante Git y control de versiones.'
      ]
    },
    {
      company: 'CIMARK.PE',
      role: 'Pasante de Desarrollo Web',
      date: 'Feb 2025 - May 2025',
      location: 'Lima, Peru',
      description: [
        'Rediseño y mejora de páginas web existentes, proponiendo soluciones enfocadas en usabilidad y experiencia de usuario (UI/UX).',
        'Desarrollo de interfaces frontend modernas utilizando HTML, CSS, Bootstrap, React y Next.js.',
        'Implementación de diseño responsivo y optimización visual para distintos dispositivos.',
        'Soporte en funcionalidades backend y consumo de APIs para integración de datos.'
      ]
    },
    {
      company: 'TECSUP',
      role: 'Desarrollador Full Stack',
      date: 'May 2025 - Sept 2025',
      location: 'Lima, Peru',
      description: [
        'Desarrollo de un sistema web de inventario químico para laboratorio académico.',
        'Implementación del backend utilizando Laravel y gestión de datos con SQLite.',
        'Desarrollo de funcionalidades CRUD, reportes automatizados y control de inventarios.',
        'Trabajo bajo metodología ágil y elaboración de documentación técnica del sistema.'
      ]
    }
  ],
  projects: [
    {
      name: 'ULenguage — Aplicación móvil inteligente de traducción cultural Quechua',
      description: 'Aplicación móvil orientada a turistas en Cusco para traducción quechua-español-inglés. Permite reconocer texto mediante imágenes, realizar traducciones automáticas y generar explicaciones culturales utilizando inteligencia artificial. Desarrollo de solución completa incluyendo aplicación móvil, backend, APIs y gestión de datos.',
      tech: 'Flutter, Dart, Node.js, Express.js, MongoDB, JWT, Google Vision API, Gemini AI, Google Translate API, Tesseract.js, Swagger'
    },
    {
      name: 'SaveBot — Plataforma de respaldo multimedia mediante Telegram',
      description: 'Aplicación web integrada con un bot de Telegram para automatizar el respaldo y envío de imágenes. Permite cargar archivos desde una plataforma web y gestionar su distribución mediante integración con Telegram Bot API.',
      tech: 'JavaScript, Node.js, Telegram Bot API, APIs REST, HTML, CSS, Git'
    },
    {
      name: 'PostulaFácil — Plataforma Inteligente para Creación y Gestión de CVs',
      description: 'Aplicación web para creación, edición y administración de currículums con enfoque en privacidad y personalización.',
      tech: 'Vue.js 3, TypeScript, Composition API, TailwindCSS, JSON, PDF Export'
    }
  ],
  education: [
    { school: 'Tecsup', degree: 'Diseño y Desarrollo de Software', date: '2023 – 2025', location: 'Lima, Peru' }
  ],
  certifications: [
    'Scrum Fundamentals Certified – SCRUMstudy',
    'Fundamentos de Ciberseguridad – Cisco',
    'Hackathon Becas BCP 2025 – Participante',
    'Hackathon TECSUP 2024 – Equipo seleccionado',
    'Training Camp CPC – UTEC'
  ],
  skills: {
    frontend: 'HTML, CSS, Bootstrap, TailwindCSS, JavaScript, TypeScript, React, Angular, Vue.js, Next.js',
    backend: 'Node.js, Express.js, PHP, C#, .NET, Laravel, APIs REST, JWT, Swagger',
    db: 'MySQL, PostgreSQL, SQL Server, MongoDB, SQLite',
    mobile: 'Flutter, Dart, Kotlin',
    tools: 'Linux, Git, GitHub, Postman, Swagger',
    cloudAi: 'Google Gemini AI, Google Vision API, OCR, Telegram Bot API',
    languages: ''
  },
  fileName: 'CV_Principal_Fabricio',
  meta: { settings: { ...defaultSettings } }
}

const saveToLocal = () => localStorage.setItem('myCvs', JSON.stringify(cvList.value))

const normalizeCv = (cv: any) => {
  if (!cv || typeof cv !== 'object') cv = {}
  if ('title' in cv) delete cv.title

  cv.name ??= ''
  cv.email ??= ''
  cv.phone ??= ''
  cv.location ??= ''
  cv.linkedin ??= ''
  cv.github ??= ''
  cv.summary ??= ''
  cv.fileName ??= cv.name ? String(cv.name) : 'CV'

  if (!Array.isArray(cv.education)) cv.education = []
  if (!Array.isArray(cv.experience)) cv.experience = []
  if (!Array.isArray(cv.projects)) cv.projects = []
  if (!Array.isArray(cv.certifications)) cv.certifications = []

  cv.education = cv.education.map((e: any) => ({
    school: e?.school ?? '',
    degree: e?.degree ?? '',
    date: e?.date ?? '',
    location: e?.location ?? ''
  }))

  cv.projects = cv.projects.map((p: any) => ({
    name: p?.name ?? '',
    description: p?.description ?? '',
    tech: p?.tech ?? ''
  }))

  cv.certifications = cv.certifications.map((c: any) => String(c ?? ''))

  cv.experience = cv.experience.map((j: any) => {
    const d = j?.description
    const descArr =
      Array.isArray(d) ? d :
      typeof d === 'string' && d.trim() ? d.split('\n').map((x: string) => x.trim()).filter(Boolean) :
      []
    return {
      company: j?.company ?? '',
      role: j?.role ?? '',
      date: j?.date ?? '',
      location: j?.location ?? '',
      description: descArr
    }
  })

  const s = cv.skills
  const invalidSkills = !s || typeof s !== 'object' || Array.isArray(s)
  if (invalidSkills) {
    cv.skills = { frontend: '', backend: '', db: '', mobile: '', tools: '', cloudAi: '', languages: '' }
  } else {
    cv.skills.frontend ??= ''
    cv.skills.backend ??= ''
    cv.skills.db ??= ''
    cv.skills.mobile ??= ''
    cv.skills.tools ??= ''
    cv.skills.cloudAi ??= ''
    cv.skills.languages ??= ''
    if ('other' in cv.skills) delete cv.skills.other
  }

  if (!cv.meta) cv.meta = {}
  if (!cv.meta.settings) cv.meta.settings = { ...defaultSettings }
  cv.meta.settings = { ...defaultSettings, ...cv.meta.settings }

  return cv
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  darkMode.value = savedTheme === 'dark' || !savedTheme
  document.documentElement.classList.toggle('dark', darkMode.value)

  const savedCvs = localStorage.getItem('myCvs')
  if (savedCvs) {
    try {
      const parsed = JSON.parse(savedCvs)
      cvList.value = Array.isArray(parsed) ? parsed.map(normalizeCv) : [normalizeCv({ ...fabricioCV })]
    } catch {
      cvList.value = [normalizeCv({ ...fabricioCV })]
    }
  } else {
    cvList.value = [normalizeCv({ ...fabricioCV })]
  }
  saveToLocal()
})

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
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
}

const editCv = (idx: number) => {
  if (typeof idx !== 'number' || idx < 0 || idx >= cvList.value.length) return
  selectedCvIndex.value = idx
  currentView.value = 'editor'
}

const createNewCV = () => {
  const newCV = normalizeCv({
    ...JSON.parse(JSON.stringify(fabricioCV)),
    fileName: `Nuevo_CV_${cvList.value.length + 1}`
  })
  cvList.value.push(newCV)
  saveToLocal()
  editCv(cvList.value.length - 1)
}

const duplicateCV = (index: number) => {
  const copy = normalizeCv(JSON.parse(JSON.stringify(cvList.value[index])))
  copy.fileName = (copy.fileName || 'CV') + '_copia'
  cvList.value.splice(index + 1, 0, copy)
  saveToLocal()
}

const deleteCV = (index: number) => {
  if (confirm(currentLang.value === 'es' ? '¿Borrar?' : 'Delete?')) {
    cvList.value.splice(index, 1)
    saveToLocal()
    if (selectedCvIndex.value === index) {
      selectedCvIndex.value = null
      currentView.value = 'dashboard'
    }
  }
}

const saveCV = (updatedData: any) => {
  if (selectedCvIndex.value !== null) {
    cvList.value[selectedCvIndex.value] = normalizeCv(updatedData)
    saveToLocal()
    alert(currentLang.value === 'es' ? 'Guardado correctamente' : 'Saved')
  }
}

const importCv = (data: any) => {
  const imported = normalizeCv(data)
  imported.fileName = imported.fileName || `Import_${cvList.value.length + 1}`
  cvList.value.push(imported)
  saveToLocal()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
    <NavBar
      :dark-mode="darkMode"
      :current-lang="currentLang"
      @toggle-theme="toggleTheme"
      @toggle-lang="currentLang = currentLang === 'es' ? 'en' : 'es'"
      @go-home="goHome"
      class="print:hidden"
    />

    <Landing v-if="currentView === 'landing'" :current-lang="currentLang" @start="enterApp" class="print:hidden" />

    <Dashboard
      v-else-if="currentView === 'dashboard'"
      :cv-list="cvList"
      :current-lang="currentLang"
      @create-new="createNewCV"
      @edit-cv="editCv"
      @duplicate-cv="duplicateCV"
      @delete-cv="deleteCV"
      @import-cv="importCv"
      class="print:hidden"
    />

    <EditorView
      v-else-if="currentView === 'editor' && selectedCvIndex !== null"
      :initial-data="cvList[selectedCvIndex]"
      :current-lang="currentLang"
      @save="saveCV"
      @back="currentView = 'dashboard'"
    />
  </div>
</template>