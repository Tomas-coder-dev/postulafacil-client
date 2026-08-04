<script setup lang="ts">
import { ref, computed } from 'vue'
import { Trash2, ChevronUp, ChevronDown, GripVertical } from 'lucide-vue-next'
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

const t = (key: string) => (translations as any)[props.currentLang]?.[key] || key

const unwrap = (v: any) => (v && typeof v === 'object' && 'value' in v ? v.value : v)

const cvDataLocal = computed({
  get: () => unwrap(props.cvData),
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

const moveItem = (arr: any[], from: number, to: number) => {
  if (to < 0 || to >= arr.length) return arr
  const next = [...arr]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

const moveExperience = (index: number, dir: -1 | 1) => {
  ensureArrays()
  cvDataLocal.value = { ...cvDataLocal.value, experience: moveItem(cvDataLocal.value.experience, index, index + dir) }
}
const moveProject = (index: number, dir: -1 | 1) => {
  ensureArrays()
  cvDataLocal.value = { ...cvDataLocal.value, projects: moveItem(cvDataLocal.value.projects, index, index + dir) }
}
const moveEducation = (index: number, dir: -1 | 1) => {
  ensureArrays()
  cvDataLocal.value = { ...cvDataLocal.value, education: moveItem(cvDataLocal.value.education, index, index + dir) }
}
const moveCertification = (index: number, dir: -1 | 1) => {
  ensureArrays()
  cvDataLocal.value = { ...cvDataLocal.value, certifications: moveItem(cvDataLocal.value.certifications, index, index + dir) }
}

const dragSection = ref<string | null>(null)
const dragFrom = ref<number | null>(null)
const dragOver = ref<number | null>(null)

const onDragStart = (section: string, index: number) => {
  dragSection.value = section
  dragFrom.value = index
}

const onDragOver = (e: DragEvent, index: number) => {
  e.preventDefault()
  dragOver.value = index
}

const onDrop = (section: string) => {
  if (dragFrom.value === null || dragOver.value === null || dragFrom.value === dragOver.value) {
    dragSection.value = null
    dragFrom.value = null
    dragOver.value = null
    return
  }
  ensureArrays()
  const cv = cvDataLocal.value
  cvDataLocal.value = { ...cv, [section]: moveItem([...cv[section]], dragFrom.value, dragOver.value) }
  dragSection.value = null
  dragFrom.value = null
  dragOver.value = null
}

const onDragEnd = () => {
  dragSection.value = null
  dragFrom.value = null
  dragOver.value = null
}

const fixedSkillKeys = ['frontend', 'backend', 'db', 'mobile', 'tools', 'cloudAi', 'languages'] as const

const ensureSkillsObject = () => {
  const cv = cvDataLocal.value
  if (!cv) return
  const s = cv.skills
  const invalid = !s || typeof s !== 'object' || Array.isArray(s)
  const base: Record<string, string> = invalid ? {} : { ...s }
  if ('other' in base) delete (base as any).other
  base.frontend ??= ''
  base.backend ??= ''
  base.db ??= ''
  base.mobile ??= ''
  base.tools ??= ''
  base.cloudAi ??= ''
  base.languages ??= ''
  cvDataLocal.value = { ...cv, skills: base }
}

const skillsReady = computed(() => {
  const s = cvDataLocal.value?.skills
  return !!(s && typeof s === 'object' && !Array.isArray(s))
})

type SkillEntry = { id: string; key: string }

const extraSkillEntries = computed<SkillEntry[]>(() => {
  if (!skillsReady.value) return []
  const skills = cvDataLocal.value.skills as Record<string, string>
  return Object.keys(skills)
    .filter((k) => !(fixedSkillKeys as readonly string[]).includes(k))
    .map((k) => ({ id: k, key: k }))
})

const generateUniqueKey = (skills: Record<string, any>) => {
  let base = props.currentLang === 'es' ? 'nueva_habilidad' : 'new_skill'
  base = base.toLowerCase().replace(/\s+/g, '_')
  if (skills[base] === undefined) return base
  let i = 2
  while (skills[`${base}_${i}`] !== undefined) i++
  return `${base}_${i}`
}

const handleAddSkillsButton = () => {
  ensureSkillsObject()
  if (!skillsReady.value) return
  const cv = cvDataLocal.value
  const skills = { ...(cv.skills as Record<string, string>) }
  const newKey = generateUniqueKey(skills)
  skills[newKey] = ''
  cvDataLocal.value = { ...cv, skills }
  queueMicrotask(() => {
    const el = document.querySelector<HTMLInputElement>(`[data-skill-key="${newKey}"]`)
    el?.focus()
    el?.select()
  })
}

const deleteExtraSkill = (key: string) => {
  ensureSkillsObject()
  const cv = cvDataLocal.value
  if (!cv?.skills) return
  if ((fixedSkillKeys as readonly string[]).includes(key)) return
  const nextSkills = { ...(cv.skills as Record<string, string>) }
  delete nextSkills[key]
  cvDataLocal.value = { ...cv, skills: nextSkills }
}

const renameExtraSkillKey = (oldKey: string, newKeyRaw: string) => {
  ensureSkillsObject()
  const cv = cvDataLocal.value
  if (!cv?.skills) return
  const skills = { ...(cv.skills as Record<string, string>) }
  if (!skills[oldKey] && skills[oldKey] !== '') return
  const newKey = newKeyRaw.trim().toLowerCase().replace(/\s+/g, '_')
  if (!newKey) return
  if ((fixedSkillKeys as readonly string[]).includes(newKey)) {
    alert(props.currentLang === 'es' ? 'Ese nombre está reservado (campo fijo).' : 'That name is reserved (fixed field).')
    return
  }
  if (newKey !== oldKey && skills[newKey] !== undefined) {
    alert(props.currentLang === 'es' ? 'Ya existe una habilidad con ese nombre.' : 'A skill with that name already exists.')
    return
  }
  const value = skills[oldKey]
  delete skills[oldKey]
  skills[newKey] = value
  cvDataLocal.value = { ...cv, skills }
}

const addCertification = () => { ensureArrays(); cvDataLocal.value = { ...cvDataLocal.value, certifications: [...cvDataLocal.value.certifications, ''] } }
const addExperience = () => { ensureArrays(); cvDataLocal.value = { ...cvDataLocal.value, experience: [...cvDataLocal.value.experience, { company: '', role: '', date: '', location: '', description: '' }] } }
const addProject = () => { ensureArrays(); cvDataLocal.value = { ...cvDataLocal.value, projects: [...cvDataLocal.value.projects, { name: '', description: '', tech: '' }] } }
const addEducation = () => { ensureArrays(); cvDataLocal.value = { ...cvDataLocal.value, education: [...cvDataLocal.value.education, { school: '', degree: '', date: '', location: '' }] } }
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden font-sans bg-white dark:bg-gray-800 transition-colors duration-300">
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
      <div class="flex items-center gap-2">
        <button @click="$emit('back')" class="text-xs text-gray-500 hover:text-postula-blue flex items-center gap-1 font-semibold" type="button">
          ‹ {{ t('back') }}
        </button>
        <span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
          {{ t('editorTag') }}
        </span>
      </div>
      <button @click="$emit('save')" class="text-xs font-semibold text-postula-blue hover:underline" type="button">
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
          <button @click="addExperience" class="add-btn" type="button">+ {{ t('addExperience') }}</button>
        </div>
        <TransitionGroup name="list" tag="div" class="flex flex-col gap-4 relative">
          <div
            v-for="(job, index) in (cvDataLocal.experience || [])"
            :key="job"
            class="card-item transition-all"
            :class="{
              'opacity-40': dragSection === 'experience' && dragFrom === Number(index),
              'ring-2 ring-blue-400': dragSection === 'experience' && dragOver === Number(index) && dragFrom !== Number(index)
            }"
            draggable="true"
            @dragstart="onDragStart('experience', Number(index))"
            @dragover="onDragOver($event, Number(index))"
            @drop="onDrop('experience')"
            @dragend="onDragEnd"
          >
            <div class="flex items-start gap-2 mb-2">
              <div class="flex flex-col items-center gap-0.5 pt-0.5">
                <span class="grip-handle cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-400"><GripVertical :size="14" /></span>
                <button @click="moveExperience(Number(index), -1)" :disabled="Number(index) === 0" class="move-btn" type="button"><ChevronUp :size="13" /></button>
                <button @click="moveExperience(Number(index), 1)" :disabled="Number(index) === cvDataLocal.experience.length - 1" class="move-btn" type="button"><ChevronDown :size="13" /></button>
              </div>
              <input v-model="job.company" class="font-bold bg-transparent w-full outline-none text-gray-800 dark:text-white placeholder-gray-400" :placeholder="t('companyPlaceholder')" />
              <button @click="cvDataLocal.experience.splice(Number(index), 1)" class="del-btn" type="button"><Trash2 :size="14" /></button>
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
        </TransitionGroup>
      </section>

      <section class="space-y-4">
        <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1">
          <h3 class="section-header !border-0 !mb-0">{{ t('projects') }}</h3>
          <button @click="addProject" class="add-btn" type="button">+ {{ t('addProject') }}</button>
        </div>
        <TransitionGroup name="list" tag="div" class="flex flex-col gap-4 relative">
          <div
            v-for="(proj, index) in (cvDataLocal.projects || [])"
            :key="proj"
            class="card-item transition-all"
            :class="{
              'opacity-40': dragSection === 'projects' && dragFrom === Number(index),
              'ring-2 ring-blue-400': dragSection === 'projects' && dragOver === Number(index) && dragFrom !== Number(index)
            }"
            draggable="true"
            @dragstart="onDragStart('projects', Number(index))"
            @dragover="onDragOver($event, Number(index))"
            @drop="onDrop('projects')"
            @dragend="onDragEnd"
          >
            <div class="flex items-start gap-2 mb-1">
              <div class="flex flex-col items-center gap-0.5 pt-0.5">
                <span class="grip-handle cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-400"><GripVertical :size="14" /></span>
                <button @click="moveProject(Number(index), -1)" :disabled="Number(index) === 0" class="move-btn" type="button"><ChevronUp :size="13" /></button>
                <button @click="moveProject(Number(index), 1)" :disabled="Number(index) === cvDataLocal.projects.length - 1" class="move-btn" type="button"><ChevronDown :size="13" /></button>
              </div>
              <input v-model="proj.name" class="font-bold bg-transparent w-full outline-none text-gray-800 dark:text-white" :placeholder="t('projectNamePlaceholder')" />
              <button @click="cvDataLocal.projects.splice(Number(index), 1)" class="del-btn" type="button"><Trash2 :size="14" /></button>
            </div>
            <textarea v-model="proj.description" rows="2" class="input-sm w-full mb-2 bg-white dark:bg-gray-900" :placeholder="t('projectDescriptionPlaceholder')"></textarea>
            <input v-model="proj.tech" class="input-sm w-full" :placeholder="t('projectTechPlaceholder')" />
          </div>
        </TransitionGroup>
      </section>

      <section class="space-y-4">
        <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1">
          <h3 class="section-header !border-0 !mb-0">{{ t('education') }}</h3>
          <button @click="addEducation" class="add-btn" type="button">+ {{ t('addEducation') }}</button>
        </div>
        <TransitionGroup name="list" tag="div" class="flex flex-col gap-4 relative">
          <div
            v-for="(edu, index) in (cvDataLocal.education || [])"
            :key="edu"
            class="card-item transition-all"
            :class="{
              'opacity-40': dragSection === 'education' && dragFrom === Number(index),
              'ring-2 ring-blue-400': dragSection === 'education' && dragOver === Number(index) && dragFrom !== Number(index)
            }"
            draggable="true"
            @dragstart="onDragStart('education', Number(index))"
            @dragover="onDragOver($event, Number(index))"
            @drop="onDrop('education')"
            @dragend="onDragEnd"
          >
            <div class="flex items-center gap-2 mb-2">
              <div class="flex flex-col items-center gap-0.5">
                <span class="grip-handle cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-400"><GripVertical :size="14" /></span>
                <button @click="moveEducation(Number(index), -1)" :disabled="Number(index) === 0" class="move-btn" type="button"><ChevronUp :size="13" /></button>
                <button @click="moveEducation(Number(index), 1)" :disabled="Number(index) === cvDataLocal.education.length - 1" class="move-btn" type="button"><ChevronDown :size="13" /></button>
              </div>
              <input v-model="edu.school" class="input-sm font-bold w-full" :placeholder="t('educationInstitutionPlaceholder')" />
              <button @click="cvDataLocal.education.splice(Number(index), 1)" class="del-btn" type="button"><Trash2 :size="14" /></button>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="edu.degree" class="input-sm" :placeholder="t('educationDegreePlaceholder')" />
              <input v-model="edu.date" class="input-sm" :placeholder="t('educationDatePlaceholder')" />
              <input v-model="edu.location" class="input-sm col-span-2" :placeholder="t('educationLocationPlaceholder')" />
            </div>
          </div>
        </TransitionGroup>
      </section>

      <section class="space-y-4">
        <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1">
          <h3 class="section-header !border-0 !mb-0">{{ t('cv_certificationsTitle') }}</h3>
          <button @click="addCertification" class="add-btn" type="button">
            + {{ props.currentLang === 'es' ? 'Agregar certificación' : 'Add certification' }}
          </button>
        </div>
        <TransitionGroup name="list" tag="div" class="flex flex-col gap-2 relative">
          <div
            v-for="(cert, index) in (cvDataLocal.certifications || [])"
            :key="cert + index"
            class="flex gap-2 items-center transition-all bg-white dark:bg-gray-800"
            :class="{
              'opacity-40': dragSection === 'certifications' && dragFrom === Number(index),
              'ring-2 ring-blue-400 rounded': dragSection === 'certifications' && dragOver === Number(index) && dragFrom !== Number(index)
            }"
            draggable="true"
            @dragstart="onDragStart('certifications', Number(index))"
            @dragover="onDragOver($event, Number(index))"
            @drop="onDrop('certifications')"
            @dragend="onDragEnd"
          >
            <div class="flex flex-col items-center gap-0.5">
              <span class="grip-handle cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-400"><GripVertical :size="14" /></span>
              <button @click="moveCertification(Number(index), -1)" :disabled="Number(index) === 0" class="move-btn" type="button"><ChevronUp :size="13" /></button>
              <button @click="moveCertification(Number(index), 1)" :disabled="Number(index) === cvDataLocal.certifications.length - 1" class="move-btn" type="button"><ChevronDown :size="13" /></button>
            </div>
            <input v-model="cvDataLocal.certifications[Number(index)]" class="input-field flex-1" />
            <button @click="cvDataLocal.certifications.splice(Number(index), 1)" class="del-btn self-center" type="button"><Trash2 :size="14" /></button>
          </div>
        </TransitionGroup>
      </section>

      <section class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="section-header !border-b-0 !mb-0">{{ t('skills') }}</h3>
          <button @click="handleAddSkillsButton" class="add-btn" type="button">
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
            <label class="label">{{ t('skillsMobile') }}</label>
            <input v-model="cvDataLocal.skills.mobile" class="input-field" />
          </div>
          <div>
            <label class="label">{{ t('skillsTools') }}</label>
            <input v-model="cvDataLocal.skills.tools" class="input-field" />
          </div>
          <div>
            <label class="label">{{ t('skillsCloudAi') }}</label>
            <input v-model="cvDataLocal.skills.cloudAi" class="input-field" />
          </div>
          <div>
            <label class="label">{{ t('skillsLanguages') }}</label>
            <input v-model="cvDataLocal.skills.languages" class="input-field" />
          </div>
          <div v-if="extraSkillEntries.length" class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
            <div class="text-[10px] uppercase font-bold text-gray-500">
              {{ props.currentLang === 'es' ? 'Habilidades personalizadas' : 'Custom skills' }}
            </div>
            <div v-for="entry in extraSkillEntries" :key="entry.id" class="card-item">
              <div class="flex gap-2 items-center mb-2">
                <input
                  class="input-field"
                  :value="entry.key"
                  @change="renameExtraSkillKey(entry.key, ($event.target as HTMLInputElement).value)"
                  :data-skill-key="entry.key"
                  :placeholder="props.currentLang === 'es' ? 'Nombre (ej: APIs)' : 'Name (e.g. APIs)'"
                />
                <button class="del-btn" type="button" @click="deleteExtraSkill(entry.key)"><Trash2 :size="14" /></button>
              </div>
              <textarea
                v-model="cvDataLocal.skills[entry.key]"
                rows="2"
                class="input-field"
                :placeholder="props.currentLang === 'es' ? 'Contenido (ej: JWT, OAuth...)' : 'Content (e.g. JWT, OAuth...)'"
              ></textarea>
            </div>
          </div>
        </div>
        <div v-else class="text-xs text-gray-500">
          {{ props.currentLang === 'es' ? 'Aún no hay habilidades. Presiona "+ Agregar habilidades".' : 'No skills yet. Click "+ Add skills".' }}
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
.move-btn { @apply text-gray-400 hover:text-blue-400 disabled:opacity-20 disabled:cursor-not-allowed p-0.5 transition-colors; }
.grip-handle { @apply flex items-center justify-center; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }

/* TransitionGroup Styles */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
.list-leave-active {
  position: absolute;
  width: calc(100% - 2px);
  z-index: 10;
}
</style>