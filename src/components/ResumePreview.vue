<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Phone, Mail, Linkedin, MapPin, Github } from 'lucide-vue-next'

const props = defineProps<{
  cvData: any
  settings: any
  exportMode?: boolean
}>()

const { t } = useI18n()

const pageStyle = computed<Record<string, string | number>>(() => {
  const width = props.settings.paperSize === 'Letter' ? '216mm' : '210mm'
  const height = props.settings.paperSize === 'Letter' ? '279mm' : '297mm'

  return {
    '--line-spacing': props.settings.lineSpacing,
    '--paragraph-spacing': `${props.settings.paragraphSpacing}px`,
    '--margin-top': `${props.settings.marginTop}px`,
    '--margin-bottom': `${props.settings.marginBottom}px`,
    '--margin-left': `${props.settings.marginLeft}px`,
    '--margin-right': `${props.settings.marginRight}px`,
    '--theme-color': props.settings.themeColor,
    '--page-background': props.settings.pageBackground || '#ffffff',
    fontFamily: props.settings.fontFamily,
    fontSize: `${props.settings.fontSize}pt`,
    minHeight: height,
    width
  }
})

const contentId = computed(() => (props.exportMode ? 'resume-preview-content' : undefined))

const linkLabel = (value: string) => {
  const raw = String(value || '').trim()
  if (!raw) return ''
  try {
    const url = new URL(raw.includes('://') ? raw : `https://${raw}`)
    const host = url.hostname.replace(/^www\./, '')
    return `${host}${url.pathname.replace(/\/$/, '')}`
  } catch {
    return raw
  }
}

const fixedSkillLabelKeys: Record<string, string> = {
  frontend: 'skillsFrontend',
  backend: 'skillsBackend',
  db: 'skillsDB',
  mobile: 'skillsMobile',
  tools: 'skillsTools',
  cloudAi: 'skillsCloudAi',
  languages: 'skillsLanguages'
}

const formatSkillLabel = (key: string) => {
  const translationKey = fixedSkillLabelKeys[key]
  if (translationKey) return t(translationKey)
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const skillsEntries = computed(() => {
  const s = props.cvData?.skills
  if (!s || typeof s !== 'object' || Array.isArray(s)) return []
  return Object.entries(s).filter(([k, v]) => k !== 'other' && !!v)
})
</script>

<template>
  <div id="resume-preview" class="w-full flex justify-center">
    <div class="resume-page-wrap">
      <div :id="contentId" class="resume-page" :style="pageStyle">
        <header class="resume-header text-center">
          <h1 class="resume-name">{{ cvData.name }}</h1>
          <p v-if="cvData.headline" class="resume-headline">{{ cvData.headline }}</p>
          <div class="contact-info">
            <span v-if="cvData.location" class="contact-item"><MapPin :size="11" /> {{ cvData.location }}</span>
            <span v-if="cvData.phone" class="contact-item"><Phone :size="11" /> {{ cvData.phone }}</span>
            <span v-if="cvData.email" class="contact-item"><Mail :size="11" /> {{ cvData.email }}</span>
            <span v-if="cvData.linkedin" class="contact-item"><Linkedin :size="11" /> {{ linkLabel(cvData.linkedin) }}</span>
            <span v-if="cvData.github" class="contact-item"><Github :size="11" /> {{ linkLabel(cvData.github) }}</span>
          </div>
        </header>

        <section v-if="cvData.summary" class="section-block">
          <h2 class="section-title">{{ t('cv_profileTitle') }}</h2>
          <p class="profile-text">{{ cvData.summary }}</p>
        </section>

        <section v-if="cvData.experience?.length" class="section-block">
          <h2 class="section-title">{{ t('cv_experienceTitle') || 'Experiencia' }}</h2>
          <div v-for="(job, i) in cvData.experience" :key="i" class="entry">
            <div class="entry-row font-bold">
              <span class="entry-main">{{ job.company }}</span>
              <span v-if="job.location" class="entry-aside">{{ job.location }}</span>
            </div>
            <div class="entry-row italic">
              <span class="entry-main">{{ job.role }}</span>
              <span v-if="job.date" class="entry-aside">{{ job.date }}</span>
            </div>

            <ul v-if="Array.isArray(job.description)" class="entry-list list-disc ml-5">
              <li v-for="(desc, j) in job.description" :key="j" class="text-justify">{{ desc }}</li>
            </ul>
            <p v-else class="text-justify whitespace-pre-line">{{ job.description }}</p>
          </div>
        </section>

        <section v-if="cvData.projects?.length" class="section-block">
          <h2 class="section-title">{{ t('cv_projectsTitle') || 'Proyectos Relevantes' }}</h2>
          <div v-for="(proj, i) in cvData.projects" :key="i" class="entry">
            <div class="font-bold entry-title">{{ proj.name }}</div>
            <p class="text-justify entry-body">{{ proj.description }}</p>
            <p v-if="proj.tech" class="entry-meta">
              <strong>{{ t('cv_technologies') || 'Tecnologías' }}:</strong> {{ proj.tech }}
            </p>
          </div>
        </section>

        <section v-if="cvData.education?.length" class="section-block">
          <h2 class="section-title">{{ t('cv_educationTitle') || 'Educación' }}</h2>
          <div v-for="(edu, i) in cvData.education" :key="i" class="entry">
            <div class="entry-row font-bold">
              <span class="entry-main">{{ edu.school }}</span>
              <span v-if="edu.location" class="entry-aside">{{ edu.location }}</span>
            </div>
            <div class="entry-row italic">
              <span class="entry-main">{{ edu.degree }}</span>
              <span v-if="edu.date" class="entry-aside">{{ edu.date }}</span>
            </div>
          </div>
        </section>

        <section v-if="cvData.certifications?.length" class="section-block">
          <h2 class="section-title">{{ t('cv_certificationsTitle') || 'Certificaciones' }}</h2>
          <ul class="list-disc ml-5">
            <li v-for="(cert, i) in cvData.certifications" :key="i">{{ cert }}</li>
          </ul>
        </section>

        <section v-if="skillsEntries.length" class="section-block">
          <h2 class="section-title">{{ t('cv_skillsTitle') || 'Skills adicionales' }}</h2>
          <p v-for="([key, val], idx) in skillsEntries" :key="idx" class="mb-1">
            <strong>{{ formatSkillLabel(key) }}:</strong> {{ val }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resume-page-wrap { width: fit-content; }

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

.resume-header {
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--theme-color);
}

.resume-name {
  font-size: 22pt;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1.15;
  margin: 0;
  color: #111;
}

.resume-headline {
  margin: 6px 0 8px;
  font-size: 11.5pt;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #222;
}

.contact-info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px 16px;
  font-size: 0.92em;
  color: #333;
}

.contact-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.profile-text {
  margin: 0;
  text-align: justify;
  white-space: pre-line;
  line-height: 1.45;
}

.section-title {
  font-size: 1.15em;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--theme-color);
  border-bottom: 1.5px solid var(--theme-color);
  margin-bottom: 12px;
  padding-bottom: 4px;
}

.section-block { margin-bottom: calc(var(--paragraph-spacing) + 10px); }

.entry { margin-bottom: 14px; }

.entry-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 20px;
}

.entry-main {
  flex: 1 1 auto;
  min-width: 0;
  padding-right: 12px;
}

.entry-aside {
  flex: 0 0 auto;
  margin-left: 16px;
  white-space: nowrap;
}

.entry-title { margin-bottom: 4px; }
.entry-body { margin-top: 2px; }
.entry-meta { margin-top: 6px; }

.entry-list { margin-top: 6px; }
.entry-list li + li { margin-top: 4px; }

@media print {
  .resume-page { box-shadow: none !important; }
}
</style>