<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ cvData: any, settings: any }>()

// Estilos dinámicos para configuración
const pageStyle = computed(() => ({
  '--line-spacing': props.settings.lineSpacing,
  'font-family': props.settings.fontFamily || 'Times New Roman, serif',
  'font-size': '11pt'
}))
</script>

<template>
  <div id="resume-preview">
    <div class="resume-page" :style="pageStyle">
      
      <header class="resume-header mb-6">
        <h1 class="uppercase tracking-wider">{{ cvData.name }}</h1>
        <div class="text-center text-sm mt-2 flex flex-wrap justify-center gap-3 resume-header-item">
           <span v-if="cvData.phone">{{ cvData.phone }}</span>
           <span v-if="cvData.email">{{ cvData.email }}</span>
           <span v-if="cvData.linkedin"><a :href="cvData.linkedin" class="text-blue-700 underline">LinkedIn</a></span>
           <span v-if="cvData.location">{{ cvData.location }}</span>
        </div>
        <p v-if="cvData.title" class="text-center font-bold italic mt-2 text-blue-800">{{ cvData.title }}</p>
      </header>

      <section v-if="cvData.summary" class="mb-4">
        <p class="text-justify leading-relaxed">{{ cvData.summary }}</p>
      </section>

      <section v-if="cvData.experience.length > 0" class="mb-4">
        <h2>Experiencia Profesional</h2>
        <div v-for="(job, index) in cvData.experience" :key="index" class="mb-3">
          <div class="flex justify-between font-bold">
            <span>{{ job.company }}</span>
            <span>{{ job.location || 'Remote' }}</span>
          </div>
          <div class="flex justify-between italic mb-1">
             <span>{{ job.role }}</span>
             <span>{{ job.date }}</span>
          </div>
          <p class="whitespace-pre-line text-justify pl-2 border-l-2 border-gray-200">{{ job.description }}</p>
        </div>
      </section>

      <section v-if="cvData.education.length > 0" class="mb-4">
        <h2>Educación</h2>
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

      <section v-if="cvData.skills" class="mb-4">
        <h2>Habilidades</h2>
        <p class="text-justify">{{ cvData.skills }}</p>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* AQUÍ PEGÓ TU CSS "BACKBONE" EXACTO 
   (Ajustado ligeramente para que funcione dentro de Vue Scope)
*/
#resume-preview {
  display: flex;
  justify-content: center;
  background: transparent;
}
.resume-page {
  background-color: white;
  color: black;
  width: 210mm;
  min-height: 297mm;
  padding: 40px 50px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  line-height: var(--line-spacing, 1.5);
}

h1 { font-size: 2.2em; font-weight: bold; margin-bottom: 5px; line-height: 1; }
h2 { 
  font-size: 1.1em; 
  font-weight: bold; 
  text-transform: uppercase; 
  border-bottom: 1px solid black; 
  margin-top: 15px; 
  margin-bottom: 8px; 
  padding-bottom: 2px;
}
.resume-header-item span:not(:last-child)::after {
  content: " | ";
  margin: 0 5px;
  color: #ccc;
}
</style>