# PostulaFácil

Plataforma web para la creación, edición y gestión de currículums profesionales de forma rápida, personalizada y privada.



## Características

- Editor de CV en tiempo real con vista previa instantánea
- Optimización de CV para sistemas ATS
- Gestión de múltiples currículums
- Personalización de diseño:
  - Colores
  - Tipografías
  - Márgenes
  - Tamaño de página
- Exportación a PDF
- Importación y exportación de CVs en formato JSON
- Reordenamiento de secciones mediante drag and drop
- Modo oscuro y modo claro
- Multilenguaje Español / Inglés
- Diseño responsive
- Instalación como PWA


## Privacidad

- Los datos se almacenan localmente en el navegador
- No requiere registro ni autenticación
- No recopila información personal
- Sin seguimiento de usuarios
- Sin publicidad


## Tecnologías

| Área | Tecnología |
|------|------------|
| Framework | Vue.js 3 + Composition API |
| Lenguaje | TypeScript |
| Estilos | TailwindCSS |
| Iconos | Lucide Vue Next |
| Build | Vite |
| PDF | Window.print() |
| Almacenamiento | LocalStorage |

---

## Instalación


git clone https://github.com/Tomas-coder-dev/postulafacil-client.git

cd postulafacil

npm install

npm run dev


Para generar la versión de producción:


npm run build


## Estructura del proyecto


src/
├── components/
│   ├── NavBar.vue
│   ├── Landing.vue
│   ├── Dashboard.vue
│   ├── ResumeEditor.vue
│   ├── ResumePreview.vue
│   ├── EditFile.vue
│   ├── ThemeToggle.vue
│   └── LangSwitch.vue
│
├── views/
│   └── EditorView.vue
│
├── utils/
│   └── translations.ts
│
└── App.vue

