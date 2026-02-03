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
    'Egresado de Diseño y Desarrollo de Software (TECSUP), con experiencia en desarrollo web y móvil full stack adquirida a través de proyectos aplicados, prácticas profesionales y hackathons. Interesado en la creación de soluciones tecnológicas eficientes, con enfoque en calidad, escalabilidad y trabajo colaborativo.\n\nBusco desarrollarme como Desarrollador Full Stack Junior, aportando compromiso, aprendizaje continuo y buenas prácticas de desarrollo.\n\nNivel de inglés: Intermedio (B1–B2).',
  experience: [
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
      role: 'Desarrollador FullStack',
      date: 'Mar 2025 - Abr 2025',
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
      name: 'TecLunch',
      description: 'Sistema de Reservas de Comedor. Desarrollo de aplicación web y móvil para gestión de reservas y pagos.',
      tech: 'React, Django, Spring Boot, MySQL, Kotlin (móvil)'
    },
    {
      name: 'Mejora de Plataforma Web CEDITEC',
      description: 'Rediseño de la interfaz UX/UI y optimización de funcionalidades de la biblioteca digital.',
      tech: 'Laravel, MySQL, TailwindCSS'
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
    frontend: 'HTML, CSS, Bootstrap, JavaScript, React, Angular, Next.js',
    backend: 'Node.js, PHP, C#, .NET, Laravel',
    db: 'MySQL, PostgreSQL, SQL Server, MongoDB',
    tools: 'Linux, Git, GitHub',
    languages: 'Español (Nativo), Inglés (Intermedio B1–B2)'
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
      typeof d === 'string' && d.trim() ? d.split('\n').map((x) => x.trim()).filter(Boolean) :
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
    cv.skills = { frontend: '', backend: '', db: '', tools: '', languages: '' }
  } else {
    cv.skills.frontend ??= ''
    cv.skills.backend ??= ''
    cv.skills.db ??= ''
    cv.skills.tools ??= ''
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
  // Evita crash si llega algo raro
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