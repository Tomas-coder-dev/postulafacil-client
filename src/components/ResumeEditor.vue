<script setup lang="ts">
import { computed } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import { translations } from '../utils/translations'

const props = defineProps<{
  cvData: any
  currentLang: 'es' | 'en'
}>()

const emit = defineEmits<{
  (e: 'update:cvData', value: any): void
  (e: 'save'): void
  (e: 'back'): void
}>()

// @ts-ignore
const t = (key: string) => translations[props.currentLang]?.[key] || key

const cvDataLocal = computed({
  get: () => props.cvData,
  set: (val: any) => emit('update:cvData', val)
})

const ensureArrays = () => {
  const cv = cvDataLocal.value
  if (!cv) return

  const next = { ...cv }
  if (!Array.isArray(next.experience)) next.experience = []
  if (!Array.isArray(next.projects)) next.projects = []
  if (!Array.isArray(next.education)) next.education = []
  if (!Array.isArray(next.certifications)) next.certifications = []
  cvDataLocal.value = next
}

const ensureSkillsObject = () => {
  const cv = cvDataLocal.value
  if (!cv) return

  const s = cv.skills
  const invalid = !s || typeof s !== 'object' || Array.isArray(s)

  const nextSkills = invalid
    ? { frontend: '', backend: '', db: '', tools: '', languages: '' }
    : {
        frontend: s.frontend ?? '',
        backend: s.backend ?? '',
        db: s.db ?? '',
        tools: s.tools ?? '',
        languages: s.languages ?? ''
      }

  // Reasignación completa para forzar reactividad y evitar “no hace nada”
  cvDataLocal.value = {
    ...cv,
    skills: nextSkills
  }
}

const skillsReady = computed(() => {
  const s = cvDataLocal.value?.skills
  return !!(s && typeof s === 'object' && !Array.isArray(s))
})

const addCertification = () => {
  ensureArrays()
  const cv = cvDataLocal.value
  cvDataLocal.value = { ...cv, certifications: [...cv.certifications, ''] }
}

const addExperience = () => {
  ensureArrays()
  const cv = cvDataLocal.value
  cvDataLocal.value = {
    ...cv,
    experience: [
      ...cv.experience,
      { company: '', role: '', date: '', location: '', description: '' }
    ]
  }
}

const addProject = () => {
  ensureArrays()
  const cv = cvDataLocal.value
  cvDataLocal.value = {
    ...cv,
    projects: [...cv.projects, { name: '', description: '', tech: '' }]
  }
}

const addEducation = () => {
  ensureArrays()
  const cv = cvDataLocal.value
  cvDataLocal.value = {
    ...cv,
    education: [...cv.education, { school: '', degree: '', date: '', location: '' }]
  }
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden font-sans bg-white dark:bg-gray-800 transition-colors duration-300">
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
      <div class="flex items-center gap-2">
        <button
          @click="$emit('back')"
          class="text-xs text-gray-500 hover:text-postula-blue flex items-center gap-1 font-semibold"
        >
          ‹ {{ t('back') }}
        </button>
        <span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
          {{ t('editorTag') }}
        </span>
      </div>
      <button @click="$emit('save')" class="text-xs font-semibold text-postula-blue hover:underline">
        {{ t('save') }}
      </button>
    </div>

    <div class="p-4 md:p-6 overflow-y-auto flex-1 space-y-8 custom-scrollbar bg-white dark:bg-gray-800">
      <section class="space-y-4">
        <h3 class="section-header">{{ t('personalInfo') }}</h3>

        <div>
          <label class="label">{{ t('nameFull') }}</label>
          <input v-model="cvDataLocal.name" class="input-field" />
        </div>

        <div>
          <label class="label">{{ t('summaryLabel') }}</label>
          <textarea v-model="cvDataLocal.summary" rows="4" class="input-field"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Email</label>
            <input v-model="cvDataLocal.email" class="input-field" />
          </div>
          <div>
            <label class="label">{{ t('phoneLabel') }}</label>
            <input v-model="cvDataLocal.phone" class="input-field" />
          </div>
          <div>
            <label class="label">{{ t('locationLabel') }}</label>
            <input v-model="cvDataLocal.location" class="input-field" />
          </div>
          <div>
            <label class="label">{{ t('linkedinLabel') }}</label>
            <input v-model="cvDataLocal.linkedin" class="input-field" />
          </div>
          <div>
            <label class="label">{{ t('githubLabel') }}</label>
            <input v-model="cvDataLocal.github" class="input-field" />
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1">
          <h3 class="section-header !border-0 !mb-0">{{ t('experience') }}</h3>
          <button @click="addExperience" class="add-btn">+ {{ t('addExperience') }}</button>
        </div>

        <div v-for="(job, index) in (cvDataLocal.experience || [])" :key="index" class="card-item">
          <div class="flex justify-between mb-2 gap-2">
            <input v-model="job.company" class="font-bold bg-transparent w-full outline-none text-gray-800 dark:text-white placeholder-gray-400" :placeholder="t('companyPlaceholder')" />
            <button @click="cvDataLocal.experience.splice(index, 1)" class="del-btn"><Trash2 size="14" /></button>
          </div>

          <div class="grid grid-cols-2 gap-2 mb-2">
            <input v-model="job.role" class="input-sm" :placeholder="t('rolePlaceholder')" />
            <input v-model="job.date" class="input-sm" :placeholder="t('datePlaceholder')" />
          </div>

          <div class="grid grid-cols-1 gap-2 mb-2">
            <input v-model="job.location" class="input-sm" :placeholder="t('jobLocationPlaceholder')" />
          </div>

          <textarea v-model="job.description" rows="3" class="input-sm w-full border rounded p-1 bg-white dark:bg-gray-900" :placeholder="t('jobDescriptionPlaceholder')"></textarea>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1">
          <h3 class="section-header !border-0 !mb-0">{{ t('projects') }}</h3>
          <button @click="addProject" class="add-btn">+ {{ t('addProject') }}</button>
        </div>

        <div v-for="(proj, index) in (cvDataLocal.projects || [])" :key="index" class="card-item">
          <div class="flex justify-between mb-1 gap-2">
            <input v-model="proj.name" class="font-bold bg-transparent w-full outline-none text-gray-800 dark:text-white" :placeholder="t('projectNamePlaceholder')" />
            <button @click="cvDataLocal.projects.splice(index, 1)" class="del-btn"><Trash2 size="14" /></button>
          </div>

          <textarea v-model="proj.description" rows="2" class="input-sm w-full mb-2 bg-white dark:bg-gray-900" :placeholder="t('projectDescriptionPlaceholder')"></textarea>

          <input v-model="proj.tech" class="input-sm w-full" :placeholder="t('projectTechPlaceholder')" />
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1">
          <h3 class="section-header !border-0 !mb-0">{{ t('education') }}</h3>
          <button @click="addEducation" class="add-btn">+ {{ t('addEducation') }}</button>
        </div>

        <div v-for="(edu, index) in (cvDataLocal.education || [])" :key="index" class="card-item grid grid-cols-2 gap-2">
          <input v-model="edu.school" class="input-sm font-bold col-span-2" :placeholder="t('educationInstitutionPlaceholder')" />
          <input v-model="edu.degree" class="input-sm" :placeholder="t('educationDegreePlaceholder')" />
          <input v-model="edu.date" class="input-sm" :placeholder="t('educationDatePlaceholder')" />
          <input v-model="edu.location" class="input-sm col-span-2" :placeholder="t('educationLocationPlaceholder')" />
          <div class="col-span-2 flex justify-end">
            <button @click="cvDataLocal.education.splice(index, 1)" class="del-btn"><Trash2 size="14" /></button>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1">
          <h3 class="section-header !border-0 !mb-0">{{ t('cv_certificationsTitle') }}</h3>
          <button @click="addCertification" class="add-btn">
            + {{ props.currentLang === 'es' ? 'Agregar certificación' : 'Add certification' }}
          </button>
        </div>

        <div v-for="(cert, index) in (cvDataLocal.certifications || [])" :key="index" class="flex gap-2 items-center">
          <input v-model="cvDataLocal.certifications[index]" class="input-field flex-1" />
          <button @click="cvDataLocal.certifications.splice(index, 1)" class="del-btn self-center"><Trash2 size="14" /></button>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="section-header !border-b-0 !mb-0">{{ t('skills') }}</h3>
          <button @click="ensureSkillsObject" class="add-btn">
            {{ props.currentLang === 'es' ? '+ Agregar habilidades' : '+ Add skills' }}
          </button>
        </div>

        <div v-if="skillsReady" class="space-y-3">
          <div>
            <label class="label">{{ t('skillsFrontend') }}</label>
            <input v-model="cvDataLocal.skills.frontend" class="input-field" />
          </div>
          <div>
            <label class="label">{{ t('skillsBackend') }}</label>
            <input v-model="cvDataLocal.skills.backend" class="input-field" />
          </div>
          <div>
            <label class="label">{{ t('skillsDB') }}</label>
            <input v-model="cvDataLocal.skills.db" class="input-field" />
          </div>
          <div>
            <label class="label">{{ t('skillsTools') }}</label>
            <input v-model="cvDataLocal.skills.tools" class="input-field" />
          </div>
          <div>
            <label class="label">{{ t('skillsLanguages') }}</label>
            <input v-model="cvDataLocal.skills.languages" class="input-field" />
          </div>
        </div>

        <div v-else class="text-xs text-gray-500">
          {{ props.currentLang === 'es'
            ? 'Aún no hay habilidades. Presiona "+ Agregar habilidades".'
            : 'No skills yet. Click "+ Add skills".' }}
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.section-header { @apply text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2; }
.label { @apply block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-500 mb-1; }
.input-field { @apply w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded p-2 text-sm text-gray-900 dark:text-gray-100 focus:border-postula-blue focus:ring-1 focus:ring-postula-blue outline-none transition; }
.input-sm { @apply bg-transparent border-b border-gray-300 dark:border-gray-600 text-xs py-1 px-1 outline-none focus:border-postula-blue text-gray-700 dark:text-gray-200 placeholder-gray-400; }
.card-item { @apply bg-gray-50 dark:bg-gray-700/30 p-3 rounded border border-gray-200 dark:border-gray-700; }
.add-btn { @apply text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline; }
.del-btn { @apply text-red-400 hover:text-red-600 p-1; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
</style>