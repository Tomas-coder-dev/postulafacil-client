<script setup lang="ts">
import { computed } from 'vue'
import { Phone, Mail, Linkedin, MapPin, Github } from 'lucide-vue-next'
import { translations } from '../utils/translations'

const props = defineProps<{
  cvData: any
  settings: any
  currentLang: 'es' | 'en'
  exportMode?: boolean
}>()

// @ts-ignore
const t = (key: string) => (translations as any)[props.currentLang]?.[key] || key

const pageStyle = computed(() => {
  const width = props.settings.paperSize === 'Letter' ? '216mm' : '210mm'
  const height = props.settings.paperSize === 'Letter' ? '279mm' : '297mm'

  return {
    '--line-spacing': props.settings.lineSpacing,
    '--paragraph-spacing': props.settings.paragraphSpacing + 'px',
    '--margin-top': props.settings.marginTop + 'px',
    '--margin-bottom': props.settings.marginBottom + 'px',
    '--margin-left': props.settings.marginLeft + 'px',
    '--margin-right': props.settings.marginRight + 'px',
    '--theme-color': props.settings.themeColor,
    '--page-background': props.settings.pageBackground || '#ffffff',
    'font-family': props.settings.fontFamily,
    'font-size': props.settings.fontSize + 'pt',
    'min-height': height,
    width
  }
})

const contentId = computed(() => (props.exportMode ? 'resume-preview-content' : undefined))

const skillsEntries = computed(() => {
  const s = props.cvData?.skills
  if (!s || typeof s !== 'object' || Array.isArray(s)) return []
  return Object.entries(s).filter(([k, v]) => k !== 'other' && !!v)
})
</script>

<template>
  <div id="resume-preview">
    <div :id="contentId" class="resume-page" :style="pageStyle">
      <header class="mb-6 text-center border-b pb-4" :style="{ borderColor: props.settings.themeColor }">
        <h1 class="uppercase tracking-wider font-bold mb-2 leading-none text-black">
          {{ cvData.name }}
        </h1>

        <div class="flex justify-center flex-wrap gap-x-4 gap-y-1 text-gray-700 contact-info">
          <span v-if="cvData.location" class="flex items-center gap-1"><MapPin size="12" /> {{ cvData.location }}</span>
          <span v-if="cvData.phone" class="flex items-center gap-1"><Phone size="12" /> {{ cvData.phone }}</span>
          <span v-if="cvData.email" class="flex items-center gap-1"><Mail size="12" /> {{ cvData.email }}</span>
          <span v-if="cvData.linkedin" class="flex items-center gap-1"><Linkedin size="12" /> LinkedIn</span>
          <span v-if="cvData.github" class="flex items-center gap-1"><Github size="12" /> GitHub</span>
        </div>
      </header>

      <section v-if="cvData.summary" class="section-block">
        <p class="text-justify leading-relaxed whitespace-pre-line">{{ cvData.summary }}</p>
      </section>

      <section v-if="cvData.experience?.length" class="section-block">
        <h2 class="section-title">{{ t('cv_experienceTitle') || 'Experiencia' }}</h2>
        <div v-for="(job, i) in cvData.experience" :key="i" class="mb-4">
          <div class="flex justify-between font-bold">
            <span>{{ job.company }}</span>
            <span>{{ job.location }}</span>
          </div>
          <div class="flex justify-between italic mb-1">
            <span>{{ job.role }}</span>
            <span>{{ job.date }}</span>
          </div>

          <ul v-if="Array.isArray(job.description)" class="list-disc ml-5">
            <li v-for="(desc, j) in job.description" :key="j" class="text-justify">{{ desc }}</li>
          </ul>
          <p v-else class="text-justify whitespace-pre-line">{{ job.description }}</p>
        </div>
      </section>

      <section v-if="cvData.projects?.length" class="section-block">
        <h2 class="section-title">{{ t('cv_projectsTitle') || 'Proyectos Relevantes' }}</h2>

        <div v-for="(proj, i) in cvData.projects" :key="i" class="mb-4">
          <div class="font-bold">{{ proj.name }}</div>
          <p class="text-justify">{{ proj.description }}</p>
          <p v-if="proj.tech" class="mt-1">
            <strong>{{ t('cv_technologies') || 'Tecnologías' }}:</strong> {{ proj.tech }}
          </p>
        </div>
      </section>

      <section v-if="cvData.education?.length" class="section-block">
        <h2 class="section-title">{{ t('cv_educationTitle') || 'Educación' }}</h2>
        <div v-for="(edu, i) in cvData.education" :key="i" class="mb-2">
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

      <section v-if="cvData.certifications?.length" class="section-block">
        <h2 class="section-title">{{ t('cv_certificationsTitle') || 'Certificaciones y actividades' }}</h2>
        <ul class="list-disc ml-5">
          <li v-for="(cert, i) in cvData.certifications" :key="i">{{ cert }}</li>
        </ul>
      </section>

      <section v-if="skillsEntries.length" class="section-block">
        <h2 class="section-title">{{ t('cv_skillsTitle') || 'Skills adicionales' }}</h2>
        <p v-for="([key, val], idx) in skillsEntries" :key="idx" class="mb-1">
          <strong class="capitalize">{{ key }}:</strong> {{ val }}
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
#resume-preview { display: flex; justify-content: center; width: 100%; }

.resume-page {
  background-color: var(--page-background, #ffffff);
  margin: 0 auto;
  padding-top: var(--margin-top);
  padding-right: var(--margin-right);
  padding-bottom: var(--margin-bottom);
  padding-left: var(--margin-left);
  color: black;
  box-shadow: 0 0 15px rgba(0,0,0,0.15);
  box-sizing: border-box;
  line-height: var(--line-spacing, 1.4);
}

h1 { font-size: 24pt; }

.section-title {
  font-size: 1.15em;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--theme-color);
  border-bottom: 1.5px solid var(--theme-color);
  margin-bottom: 8px;
  padding-bottom: 2px;
}

.section-block { margin-bottom: var(--paragraph-spacing); }

@media print { .resume-page { box-shadow: none !important; } }
</style>