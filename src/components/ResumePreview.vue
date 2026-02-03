<script setup lang="ts">
import { computed } from 'vue'
import { Phone, Mail, Linkedin, MapPin, Github } from 'lucide-vue-next'
import { translations } from '../utils/translations'

const props = defineProps<{
  cvData: any
  settings: {
    paperSize?: 'A4' | 'Letter'
    lineSpacing: number
    fontFamily: string
    fontSize: number
    paragraphSpacing: number
    marginTop: number
    marginBottom: number
    marginLeft: number
    marginRight: number
    themeColor: string
    pageBackground?: string
  }
  currentLang: 'es' | 'en'
}>()

// @ts-ignore
const t = (key: string) => translations[props.currentLang]?.[key] || key

const pageStyle = computed(() => {
  const width = props.settings.paperSize === 'Letter' ? '216mm' : '210mm'
  const height = props.settings.paperSize === 'Letter' ? '279mm' : '297mm'

  return {
    '--line-spacing': props.settings.lineSpacing || 1.4,
    '--paragraph-spacing': props.settings.paragraphSpacing + 'px',
    '--margin-top': props.settings.marginTop + 'px',
    '--margin-bottom': props.settings.marginBottom + 'px',
    '--margin-left': props.settings.marginLeft + 'px',
    '--margin-right': props.settings.marginRight + 'px',
    '--theme-color': props.settings.themeColor || '#000000',
    '--page-background': props.settings.pageBackground || '#ffffff',
    'font-family': props.settings.fontFamily || 'Times New Roman, serif',
    'font-size': props.settings.fontSize + 'pt',
    width,
    'min-height': height
  }
})
</script>

<template>
  <div id="resume-preview">
    <div class="resume-page" :style="pageStyle">
      <!-- CABECERA -->
      <header class="resume-header mb-5">
        <h1 class="uppercase tracking-wider">
          {{ cvData.name }}
        </h1>

        <div class="contact-info">
          <span v-if="cvData.location" class="info-item">
            <MapPin size="12" /> {{ cvData.location }}
          </span>
          <span v-if="cvData.phone" class="info-item">
            <Phone size="12" /> {{ cvData.phone }}
          </span>
          <span v-if="cvData.email" class="info-item">
            <Mail size="12" /> {{ cvData.email }}
          </span>
          <span v-if="cvData.linkedin" class="info-item">
            <Linkedin size="12" />
            <a :href="cvData.linkedin" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </span>
          <span v-if="cvData.github" class="info-item">
            <Github size="12" />
            <a :href="cvData.github" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </span>
        </div>
      </header>

      <!-- RESUMEN -->
      <section v-if="cvData.summary" class="mb-4 section-block">
        <p class="text-justify leading-relaxed">
          {{ cvData.summary }}
        </p>
      </section>

      <!-- EXPERIENCIA -->
      <section
        v-if="cvData.experience && cvData.experience.length"
        class="mb-4 section-block"
      >
        <h2>{{ t('cv_experienceTitle') }}</h2>
        <div
          v-for="(job, index) in cvData.experience"
          :key="index"
          class="mb-4"
        >
          <div class="flex justify-between font-bold">
            <span>{{ job.company }}</span>
            <span>{{ job.location }}</span>
          </div>
          <div class="flex justify-between italic mb-1">
            <span>{{ job.role }}</span>
            <span>{{ job.date }}</span>
          </div>

          <ul
            v-if="Array.isArray(job.description)"
            class="list-disc ml-5 mt-1"
          >
            <li
              v-for="(desc, i) in job.description"
              :key="i"
              class="text-justify"
            >
              {{ desc }}
            </li>
          </ul>
          <p v-else class="text-justify">
            {{ job.description }}
          </p>
        </div>
      </section>

      <!-- PROYECTOS -->
      <section
        v-if="cvData.projects && cvData.projects.length"
        class="mb-4 section-block"
      >
        <h2>{{ t('cv_projectsTitle') }}</h2>
        <div v-for="(proj, index) in cvData.projects" :key="index" class="mb-3">
          <div class="font-bold">
            {{ proj.name }}
          </div>
          <p class="text-justify text-sm mb-1">
            {{ proj.description }}
          </p>
          <p class="italic text-sm text-gray-700">
            <strong>{{ t('cv_technologies') }}:</strong> {{ proj.tech }}
          </p>
        </div>
      </section>

      <!-- EDUCACIÓN -->
      <section
        v-if="cvData.education && cvData.education.length"
        class="mb-4 section-block"
      >
        <h2>{{ t('cv_educationTitle') }}</h2>
        <div v-for="(edu, index) in cvData.education" :key="index" class="mb-2">
          <div class="flex justify-between font-bold">
            <span>{{ edu.school }}</span>
            <span>{{ edu.location }}</span>
          </div>
          <div class="flex justify-between italic">
            <span>{{ edu.degree }}</span>
            <span>{{ edu.date }}</span>
          </div>
        </div>
      </section>

      <!-- CERTIFICACIONES -->
      <section
        v-if="cvData.certifications && cvData.certifications.length"
        class="mb-4 section-block"
      >
        <h2>{{ t('cv_certificationsTitle') }}</h2>
        <ul class="list-disc ml-5">
          <li v-for="(cert, index) in cvData.certifications" :key="index">
            {{ cert }}
          </li>
        </ul>
      </section>

      <!-- HABILIDADES -->
      <section v-if="cvData.skills" class="mb-4 section-block">
        <h2>{{ t('cv_skillsTitle') }}</h2>

        <div v-if="typeof cvData.skills === 'object'" class="space-y-1">
          <p v-if="cvData.skills.frontend" class="mb-1">
            <strong>{{ t('skillsFrontend') }}:</strong>
            {{ cvData.skills.frontend }}
          </p>
          <p v-if="cvData.skills.backend" class="mb-1">
            <strong>{{ t('skillsBackend') }}:</strong>
            {{ cvData.skills.backend }}
          </p>
          <p v-if="cvData.skills.db" class="mb-1">
            <strong>{{ t('skillsDB') }}:</strong>
            {{ cvData.skills.db }}
          </p>
          <p v-if="cvData.skills.tools" class="mb-1">
            <strong>{{ t('skillsTools') }}:</strong>
            {{ cvData.skills.tools }}
          </p>
          <p v-if="cvData.skills.languages" class="mb-1">
            <strong>{{ t('skillsLanguages') }}:</strong>
            {{ cvData.skills.languages }}
          </p>
          <p v-if="cvData.skills.other" class="mb-1">
            <strong>{{ t('skillsOther') }}:</strong>
            {{ cvData.skills.other }}
          </p>
        </div>

        <p v-else class="text-justify">
          {{ cvData.skills }}
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
#resume-preview {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

/* La hoja A4 se configura con variables CSS provenientes de settings */
.resume-page {
  background-color: var(--page-background, #ffffff);
  color: black;
  padding-top: var(--margin-top, 40px);
  padding-bottom: var(--margin-bottom, 40px);
  padding-left: var(--margin-left, 50px);
  padding-right: var(--margin-right, 50px);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  line-height: var(--line-spacing, 1.4);
  margin: 0 auto;
}

/* Nombre */
h1 {
  font-size: 24pt;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 5px;
  line-height: 1.2;
}

/* Títulos de secciones: usan themeColor */
h2 {
  font-size: 14pt;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1px solid var(--theme-color, #000000);
  color: var(--theme-color, #000000);
  margin-top: 15pt;
  margin-bottom: 6pt;
  padding-bottom: 2px;
}

/* Bloques de sección: separación controlada por settings */
.section-block {
  margin-bottom: var(--paragraph-spacing, 8px);
}

/* Texto general */
.resume-page p,
.resume-page li,
.resume-page span {
  font-size: 11pt;
}

/* Contacto */
.contact-info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.95em;
  margin-top: 5px;
}
.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
.info-item:not(:last-child)::after {
  content: '|';
  margin-left: 8px;
  color: #999;
}

/* Listas */
.resume-page ul {
  padding-left: 1.2rem;
  margin-top: 2px;
  margin-bottom: 2px;
}

/* Links */
a {
  color: inherit;
  text-decoration: none;
}

/* IMPRESIÓN: hoja blanca sin fondo gris ni sombras */
@media print {
  body {
    margin: 0;
    padding: 0;
    background: white !important;
  }
  #app {
    margin: 0;
    padding: 0;
    background: white !important;
  }
  #resume-preview {
    background: white !important;
    justify-content: center;
    align-items: flex-start;
  }
  .resume-page {
    background-color: #ffffff !important;
    box-shadow: none !important;
    margin: 0 auto;
    page-break-after: always;
  }
}
</style>