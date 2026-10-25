export const defaultSettings = {
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

export const fabricioCV = {
  name: 'Fabricio Aylas Moreno',
  email: 'aylasmorenof@gmail.com',
  phone: '+51 912 404 450',
  location: 'Lima, Perú',
  linkedin: 'https://www.linkedin.com/in/fabricio-aylas/',
  github: '',
  headline: 'Desarrollador Full Stack',
  summary:
    'Desarrollador Full Stack con experiencia en el desarrollo y mantenimiento de aplicaciones web y móviles, APIs REST, microservicios e integraciones con inteligencia artificial. He participado en soluciones de biometría y verificación de identidad, reconocimiento óptico de caracteres (OCR), visión computacional y plataformas empresariales.\n\nTrabajo con tecnologías como Flutter, Vue.js, Angular, Node.js, TypeScript, Laravel y .NET, integrando servicios cloud, bases de datos y herramientas de control de versiones. Cuento con experiencia en despliegues en Google Cloud Run y publicación de aplicaciones en Google Play y App Store. Egresado de Diseño y Desarrollo de Software por TECSUP y estudiante de Ingeniería de Software en USIL.',
  experience: [
    {
      company: 'Belity — Plataforma de belleza a domicilio',
      role: 'Desarrollador Full Stack Mobile',
      date: 'Octubre 2026 – Actualidad',
      location: 'Lima, Perú',
      description: [
        'Implementación de procesos de verificación de identidad mediante AWS Rekognition, incluyendo comparación facial y prueba de vida (Face Liveness).',
        'Integración de servicios de inteligencia artificial con Grok para la clasificación y evaluación de calidad de imágenes durante el registro de profesionales.',
        'Desarrollo de funcionalidades de OCR y validación documental para DNI, cédulas, pasaportes y documentos PDF mediante Google ML Kit.',
        'Desarrollo e integración de microservicios con Node.js, TypeScript y Express, desplegados en Google Cloud Run mediante Docker y conectados con Laravel.',
        'Mantenimiento y evolución de la aplicación móvil en Flutter, utilizando GetX y Firebase, y gestión de publicaciones en Google Play Console y App Store Connect.'
      ]
    },
    {
      company: 'Firefly One',
      role: 'Desarrollador Full Stack',
      date: 'Julio 2026 – Septiembre 2026',
      location: 'Lima, Perú',
      description: [
        'Desarrollo y modernización de sistemas empresariales para el sector asegurador mediante Vue.js y Laravel.',
        'Implementación y consumo de APIs REST, con énfasis en la integración entre frontend y backend, la seguridad y el rendimiento.',
        'Gestión de código mediante Git y GitHub, participando en Pull Requests y revisiones de código para mejorar la mantenibilidad.',
        'Seguimiento de tareas y coordinación con equipos multidisciplinarios mediante Jira y metodologías ágiles.'
      ]
    },
    {
      company: 'Syncra Connect — CRM empresarial (Proyecto Unilene)',
      role: 'Desarrollador Full Stack',
      date: 'Febrero 2026 – Junio 2026',
      location: 'Lima, Perú',
      description: [
        'Desarrollo y mantenimiento de funcionalidades para un CRM empresarial.',
        'Implementación y consumo de APIs REST con .NET y desarrollo de interfaces con Angular.',
        'Participación en el desarrollo de funcionalidades móviles utilizando Flutter.',
        'Creación y optimización de consultas y procedimientos almacenados en SQL Server.',
        'Corrección de incidencias, mantenimiento de funcionalidades existentes y control de versiones con Git.'
      ]
    },
    {
      company: 'TECSUP',
      role: 'Desarrollador Full Stack — Proyecto académico',
      date: 'Mayo 2025 – Septiembre 2025',
      location: 'Lima, Perú',
      description: [
        'Desarrollo de un sistema web para la gestión de inventario químico de un laboratorio académico.',
        'Implementación de operaciones CRUD, control de existencias y generación de reportes automatizados.',
        'Desarrollo del backend con Laravel y gestión de datos mediante SQLite.',
        'Documentación técnica y desarrollo iterativo bajo una metodología ágil.'
      ]
    },
    {
      company: 'Cimark Comunicación Corporativa S.A.C.',
      role: 'Desarrollador Full Stack',
      date: 'Febrero 2024 – Enero 2025',
      location: 'Lima, Perú',
      description: [
        'Desarrollo y mejora de interfaces web con enfoque en experiencia de usuario (UX/UI) y diseño adaptable.',
        'Implementación de mejoras visuales y funcionales a partir del análisis de plataformas del sector.',
        'Optimización de la navegación, estructura y usabilidad de sitios web.',
        'Colaboración con el equipo interno para alinear las soluciones de interfaz con los objetivos del negocio.'
      ]
    }
  ],
  projects: [
    {
      name: 'ULenguage — Aplicación de traducción cultural quechua',
      description: 'Aplicación móvil orientada a turistas en Cusco que facilita la traducción entre quechua, español e inglés. Incorpora reconocimiento de texto desde imágenes, traducción y asistencia con inteligencia artificial para contextualizar expresiones culturales.',
      tech: 'Flutter, Dart, Node.js, Express.js, MongoDB, JWT, Google Vision API, Gemini AI, Google Translate API, Tesseract.js y Swagger'
    },
    {
      name: 'SaveBot — Plataforma de respaldo de imágenes mediante Telegram',
      description: 'Aplicación web integrada con un bot de Telegram para gestionar y distribuir imágenes a través de una interfaz web y servicios de mensajería.',
      tech: 'JavaScript, Node.js, Telegram Bot API, APIs REST, HTML, CSS y Git'
    },
    {
      name: 'PostulaFácil — Editor web de currículums',
      description: 'Aplicación web para crear, editar y exportar currículums, con vista previa en tiempo real y almacenamiento local de la información del usuario.',
      tech: 'Vue.js 3, TypeScript, Tailwind CSS, JSON y generación de PDF'
    }
  ],
  education: [
    { school: 'Universidad San Ignacio de Loyola (USIL)', degree: 'Ingeniería de Software', date: '2026 – Actualidad', location: 'Lima, Perú' },
    { school: 'TECSUP', degree: 'Diseño y Desarrollo de Software — Egresado · Grado de bachiller', date: '2023 – 2025', location: 'Lima, Perú' }
  ],
  certifications: [
    'Scrum Fundamentals Certified — SCRUMstudy',
    'Fundamentos de Ciberseguridad — Cisco',
    'Participante — Hackathon Becas BCP 2025',
    'Equipo seleccionado — Hackathon TECSUP 2024',
    'Training Camp CPC — UTEC'
  ],
  skills: {
    frontend: 'Vue.js, Angular, React, Next.js, JavaScript, TypeScript, HTML5, CSS3, Bootstrap y Tailwind CSS',
    backend: 'Node.js, Express.js, PHP, Laravel, C#, .NET, APIs REST, JWT y Swagger',
    mobile: 'Flutter, Dart, GetX, Firebase y Kotlin',
    db: 'SQL Server, MySQL, PostgreSQL, MongoDB y SQLite',
    cloudAi: 'Google Cloud Run, Docker, AWS Rekognition, Google ML Kit, Google Vision API, Google Gemini AI, Grok, OCR y Telegram Bot API',
    tools: 'Git, GitHub, Linux, Postman y Jira',
    languages: ''
  },
  fileName: 'CV_Principal_Fabricio',
  meta: { settings: { ...defaultSettings }, contentRevision: 9 }
}

export const fabricioCV_en = {
  name: 'Fabricio Aylas Moreno',
  email: 'aylasmorenof@gmail.com',
  phone: '+51 912 404 450',
  location: 'Lima, Peru',
  linkedin: 'https://www.linkedin.com/in/fabricio-aylas/',
  github: '',
  headline: 'Full Stack Developer',
  summary: 'Full Stack developer with experience building and maintaining web and mobile applications, REST APIs, microservices, and artificial intelligence integrations. I have contributed to biometrics and identity verification, optical character recognition (OCR), computer vision, and enterprise platforms.\n\nI work with Flutter, Vue.js, Angular, Node.js, TypeScript, Laravel, and .NET, integrating cloud services, databases, and version control. I deploy on Google Cloud Run and publish applications on Google Play and the App Store. Software Design and Development graduate from TECSUP, and a Software Engineering student at USIL.',
  experience: [
    {
      company: 'Belity — At-home beauty platform',
      role: 'Full Stack Mobile Developer',
      date: 'October 2026 – Present',
      location: 'Lima, Peru',
      description: [
        'Implemented identity verification with AWS Rekognition, including face comparison and liveness checks (Face Liveness).',
        'Integrated Grok to classify images and assess visual quality during professional onboarding.',
        'Built OCR and document validation for national IDs, passports, and PDF documents with Google ML Kit.',
        'Built and integrated microservices in Node.js, TypeScript, and Express, deployed on Google Cloud Run with Docker and connected to Laravel.',
        'Maintained and evolved the Flutter mobile app (GetX and Firebase), and managed releases in Google Play Console and App Store Connect.'
      ]
    },
    {
      company: 'Firefly One',
      role: 'Full Stack Developer',
      date: 'July 2026 – September 2026',
      location: 'Lima, Peru',
      description: [
        'Developed and modernized enterprise systems for the insurance sector with Vue.js and Laravel.',
        'Implemented and consumed REST APIs, with attention to frontend–backend integration, security, and performance.',
        'Managed code with Git and GitHub, including pull requests and code reviews to improve maintainability.',
        'Tracked work and coordinated with multidisciplinary teams using Jira and agile methods.'
      ]
    },
    {
      company: 'Syncra Connect — Enterprise CRM (Unilene Project)',
      role: 'Full Stack Developer',
      date: 'February 2026 – June 2026',
      location: 'Lima, Peru',
      description: [
        'Developed and maintained features for an enterprise CRM.',
        'Implemented and consumed REST APIs with .NET and built interfaces with Angular.',
        'Contributed to mobile features with Flutter.',
        'Created and optimized SQL Server queries and stored procedures.',
        'Fixed incidents, maintained existing features, and used Git for version control.'
      ]
    },
    {
      company: 'TECSUP',
      role: 'Full Stack Developer — Academic project',
      date: 'May 2025 – September 2025',
      location: 'Lima, Peru',
      description: [
        'Built a web system to manage chemical inventory for an academic laboratory.',
        'Implemented CRUD operations, stock control, and automated reports.',
        'Developed the backend with Laravel and stored data in SQLite.',
        'Wrote technical documentation and worked iteratively under an agile method.'
      ]
    },
    {
      company: 'Cimark Comunicación Corporativa S.A.C.',
      role: 'Full Stack Developer',
      date: 'February 2024 – January 2025',
      location: 'Lima, Peru',
      description: [
        'Built and improved web interfaces focused on user experience (UX/UI) and responsive layout.',
        'Implemented visual and functional improvements based on analysis of platforms in the sector.',
        'Improved site navigation, structure, and usability.',
        'Worked with the internal team to align interface work with business goals.'
      ]
    }
  ],
  projects: [
    {
      name: 'ULenguage — Quechua cultural translation app',
      description: 'Mobile app for tourists in Cusco that translates between Quechua, Spanish, and English. It recognizes text from images, translates it, and uses artificial intelligence to explain cultural expressions.',
      tech: 'Flutter, Dart, Node.js, Express.js, MongoDB, JWT, Google Vision API, Gemini AI, Google Translate API, Tesseract.js, and Swagger'
    },
    {
      name: 'SaveBot — Image backup platform via Telegram',
      description: 'Web application integrated with a Telegram bot to manage and distribute images through a web interface and messaging services.',
      tech: 'JavaScript, Node.js, Telegram Bot API, REST APIs, HTML, CSS, and Git'
    },
    {
      name: 'PostulaFácil — Web resume editor',
      description: 'Web application to create, edit, and export resumes, with a live preview and local storage of the user\'s information.',
      tech: 'Vue.js 3, TypeScript, Tailwind CSS, JSON, and PDF generation'
    }
  ],
  education: [
    { school: 'Universidad San Ignacio de Loyola (USIL)', degree: 'Software Engineering', date: '2026 – Present', location: 'Lima, Peru' },
    { school: 'TECSUP', degree: 'Software Design and Development — Graduate · Bachelor\'s degree', date: '2023 – 2025', location: 'Lima, Peru' }
  ],
  certifications: [
    'Scrum Fundamentals Certified — SCRUMstudy',
    'Cybersecurity Fundamentals — Cisco',
    'Participant — Hackathon Becas BCP 2025',
    'Selected team — Hackathon TECSUP 2024',
    'Training Camp CPC — UTEC'
  ],
  skills: {
    frontend: 'Vue.js, Angular, React, Next.js, JavaScript, TypeScript, HTML5, CSS3, Bootstrap, and Tailwind CSS',
    backend: 'Node.js, Express.js, PHP, Laravel, C#, .NET, REST APIs, JWT, and Swagger',
    mobile: 'Flutter, Dart, GetX, Firebase, and Kotlin',
    db: 'SQL Server, MySQL, PostgreSQL, MongoDB, and SQLite',
    cloudAi: 'Google Cloud Run, Docker, AWS Rekognition, Google ML Kit, Google Vision API, Google Gemini AI, Grok, OCR, and Telegram Bot API',
    tools: 'Git, GitHub, Linux, Postman, and Jira',
    languages: 'Spanish (Native), English'
  },
  fileName: 'CV_Main_Fabricio_EN',
  meta: { settings: { ...defaultSettings }, contentRevision: 9 }
}

export const normalizeCv = (cv: any) => {
  if (!cv || typeof cv !== 'object') cv = {}
  if ('title' in cv) delete cv.title

  cv.name ??= ''
  cv.headline ??= ''
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

export const PROFILE_REVISION = 9

export function createEmptyCv(fileName: string) {
  return normalizeCv({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    headline: '',
    summary: '',
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    skills: {},
    fileName,
    meta: { settings: { ...defaultSettings }, contentRevision: PROFILE_REVISION }
  })
}

export function applyProfileRevision(cv: any) {
  if (!cv || cv.name !== 'Fabricio Aylas Moreno') return cv
  const summary = String(cv.summary || '')
  const staleSummary =
    summary.startsWith('Desarrollador Full Stack, con experiencia') ||
    summary.startsWith('Desarrollador Full Stack. Experiencia en apps') ||
    summary.startsWith('Full Stack developer, with experience') ||
    summary.startsWith('Full Stack developer. Experience shipping')
  if ((cv.meta?.contentRevision ?? 0) >= PROFILE_REVISION && !staleSummary) return cv

  const belityRole = String(
    cv.experience?.find((e: any) => String(e?.company || '').includes('Belity'))?.role || ''
  )
  const isEn =
    String(cv.fileName || '').includes('_EN') ||
    String(cv.summary || '').startsWith('Software Design') ||
    belityRole.includes('Developer')

  const base = isEn ? fabricioCV_en : fabricioCV
  cv.headline = base.headline
  cv.location = base.location
  cv.summary = base.summary
  cv.experience = JSON.parse(JSON.stringify(base.experience))
  cv.projects = JSON.parse(JSON.stringify(base.projects))
  cv.education = JSON.parse(JSON.stringify(base.education))
  cv.certifications = JSON.parse(JSON.stringify(base.certifications))
  cv.skills = JSON.parse(JSON.stringify(base.skills))

  if (!cv.meta) cv.meta = {}
  cv.meta.contentRevision = PROFILE_REVISION
  return cv
}
