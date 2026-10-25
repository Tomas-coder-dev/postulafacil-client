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
  location: 'Lima, Peru',
  linkedin: 'https://www.linkedin.com/in/fabricio-aylas/',
  github: '',
  summary:
    'Desarrollador Full Stack. Experiencia en apps Android e iOS en producción (Flutter), APIs y microservicios (Node.js, TypeScript, Laravel y .NET) y productos web (Vue.js y Angular), en biometría, KYC, OCR, visión por computadora, sistemas empresariales y CRM. Despliegues en Google Cloud Run, Google Play y App Store. Egresado de Diseño y Desarrollo de Software (TECSUP), con grado de bachiller, y estudiante de Ingeniería de Software (USIL).',
  experience: [
    {
      company: 'Belity — Belleza a domicilio',
      role: 'Desarrollador Full Stack Mobile',
      date: 'Oct 2026 - Actualidad',
      location: 'Lima, Perú · Presencial',
      description: [
        'Biometría y KYC: validación facial y prueba de vida con AWS Rekognition (CompareFaces y Face Liveness).',
        'IA y visión computacional: integración de Grok para clasificar imágenes y evaluar su calidad visual, agilizando el onboarding de profesionales.',
        'OCR y validación documental: lectura de DNI, cédulas y pasaportes (MRZ/ICAO) con Google ML Kit, incluida la validación de documentos en PDF.',
        'Backend y cloud: microservicios en Node.js, TypeScript y Express, desplegados en Google Cloud Run con Docker e integrados con Laravel.',
        'Desarrollo móvil y releases: mantenimiento de la app Flutter (GetX y Firebase) y publicación de versiones en Google Play Console y App Store Connect.'
      ]
    },
    {
      company: 'Firefly One',
      role: 'Desarrollador Full Stack',
      date: 'Jul 2026 - Sept 2026',
      location: 'Lima, Perú',
      description: [
        'Desarrollo y modernización de sistemas empresariales críticos para el sector asegurador, garantizando alta disponibilidad y escalabilidad mediante arquitecturas frontend y backend robustas.',
        'Construcción de soluciones Full Stack utilizando Vue.js y Laravel, optimizando el rendimiento de la aplicación y asegurando una integración eficiente y segura de APIs REST.',
        'Implementación de flujos de trabajo colaborativos y revisión exhaustiva de código (Pull Requests) con Git y GitHub, elevando la calidad y mantenibilidad del software.',
        'Gestión eficiente del ciclo de vida del desarrollo bajo metodologías ágiles, colaborando con equipos multidisciplinarios mediante Jira para cumplir con los objetivos estratégicos del negocio.'
      ]
    },
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
      company: 'Cimark Comunicación Corporativa S.A.C.',
      role: 'Desarrollador Full Stack',
      date: 'Feb 2024 - Ene 2025',
      location: 'Lima, Perú',
      description: [
        'Diseño y mejora de interfaces web enfocadas en experiencia de usuario (UX/UI).',
        'Propuesta e implementación de mejoras visuales y funcionales basadas en análisis de otras plataformas.',
        'Adaptación de diseños a distintos dispositivos (responsive design).',
        'Optimización de navegación, estructura y usabilidad del sitio web.',
        'Colaboración con equipo interno para alinear diseño con objetivos del negocio.',
        'Análisis de sitios web del sector para proponer mejoras competitivas.'
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
      name: 'ULenguage — Traducción cultural quechua',
      description: 'App móvil para turistas en Cusco que traduce entre quechua, español e inglés. Reconoce texto desde una foto, traduce en el momento y explica el contexto cultural con inteligencia artificial. Incluye la aplicación, el backend, las APIs y la base de datos.',
      tech: 'Flutter, Dart, Node.js, Express.js, MongoDB, JWT, Google Vision API, Gemini AI, Google Translate API, Tesseract.js, Swagger'
    },
    {
      name: 'SaveBot — Respaldo de imágenes por Telegram',
      description: 'Plataforma web conectada a un bot de Telegram para respaldar y enviar imágenes. El usuario carga los archivos en la web y el bot se encarga de distribuirlos.',
      tech: 'JavaScript, Node.js, Telegram Bot API, APIs REST, HTML, CSS, Git'
    },
    {
      name: 'PostulaFácil — Editor de currículums',
      description: 'Aplicación web para crear, editar y exportar currículums en el navegador, con vista previa en tiempo real y los datos guardados en el dispositivo.',
      tech: 'Vue.js 3, TypeScript, TailwindCSS, JSON, PDF'
    }
  ],
  education: [
    { school: 'Universidad San Ignacio de Loyola (USIL)', degree: 'Ingeniería de Software', date: '2026 – Actualidad', location: 'Lima, Perú' },
    { school: 'TECSUP', degree: 'Diseño y Desarrollo de Software — Egresado, grado de bachiller', date: '2023 – 2025', location: 'Lima, Perú' }
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
    mobile: 'Flutter, Dart, GetX, Firebase, Kotlin',
    tools: 'Linux, Git, GitHub, Docker, Postman, Swagger',
    cloudAi: 'AWS Rekognition, Google ML Kit, Grok, Google Cloud Run, Google Gemini AI, Google Vision API, OCR, Telegram Bot API',
    languages: ''
  },
  fileName: 'CV_Principal_Fabricio',
  meta: { settings: { ...defaultSettings }, contentRevision: 3 }
}

export const fabricioCV_en = {
  name: 'Fabricio Aylas Moreno',
  email: 'aylasmorenof@gmail.com',
  phone: '+51 912 404 450',
  location: 'Lima, Peru',
  linkedin: 'https://www.linkedin.com/in/fabricio-aylas/',
  github: '',
  summary: 'Full Stack developer. Experience shipping Android and iOS apps (Flutter), APIs and microservices (Node.js, TypeScript, Laravel, and .NET), and web products (Vue.js and Angular), across biometrics, KYC, OCR, computer vision, enterprise systems, and CRM. Deployments on Google Cloud Run, Google Play, and the App Store. Software Design and Development graduate (TECSUP), with a bachelor\'s degree, and a Software Engineering student (USIL).',
  experience: [
    {
      company: 'Belity — Belleza a domicilio',
      role: 'Full Stack Mobile Developer',
      date: 'Oct 2026 - Present',
      location: 'Lima, Peru · On-site',
      description: [
        'Biometrics and KYC: face matching and liveness checks with AWS Rekognition (CompareFaces and Face Liveness).',
        'AI and computer vision: Grok integration to classify images and score visual quality, speeding up professional onboarding.',
        'OCR and document validation: reading of national IDs and passports (MRZ/ICAO) with Google ML Kit, including PDF document checks.',
        'Backend and cloud: microservices in Node.js, TypeScript, and Express, deployed on Google Cloud Run with Docker and integrated with Laravel.',
        'Mobile development and releases: maintenance of the Flutter app (GetX and Firebase) and publishing in Google Play Console and App Store Connect.'
      ]
    },
    {
      company: 'Firefly One',
      role: 'Full Stack Developer',
      date: 'Jul 2026 - Sept 2026',
      location: 'Lima, Peru',
      description: [
        'Development and modernization of critical enterprise systems for the insurance sector, ensuring high availability and scalability through robust frontend and backend architectures.',
        'Built Full Stack solutions using Vue.js and Laravel, optimizing application performance and ensuring efficient and secure REST API integration.',
        'Implemented collaborative workflows and comprehensive code reviews (Pull Requests) with Git and GitHub, elevating software quality and maintainability.',
        'Efficiently managed the development lifecycle under agile methodologies, collaborating with multidisciplinary teams using Jira to meet strategic business objectives.'
      ]
    },
    {
      company: 'Syncra Connect — Enterprise CRM (Unilene Project)',
      role: 'Full Stack Developer',
      date: 'Feb 2026 - Jun 2026',
      location: 'Lima, Peru',
      description: [
        'Development and maintenance of features for an enterprise CRM.',
        'Implementation and consumption of REST APIs using .NET.',
        'Developed frontend interfaces and components using Angular.',
        'Participated in the development of mobile features using Flutter.',
        'Created and maintained queries and procedures in SQL Server.',
        'Resolved issues and optimized existing features.',
        'Collaborative work using Git and version control.'
      ]
    },
    {
      company: 'Cimark Comunicación Corporativa S.A.C.',
      role: 'Full Stack Developer',
      date: 'Feb 2024 - Jan 2025',
      location: 'Lima, Peru',
      description: [
        'Designed and improved web interfaces focused on user experience (UX/UI).',
        'Proposed and implemented visual and functional improvements based on the analysis of other platforms.',
        'Adapted designs to different devices (responsive design).',
        'Optimized navigation, structure, and usability of the website.',
        'Collaborated with the internal team to align design with business objectives.',
        'Analyzed sector websites to propose competitive improvements.'
      ]
    },
    {
      company: 'TECSUP',
      role: 'Full Stack Developer',
      date: 'May 2025 - Sept 2025',
      location: 'Lima, Peru',
      description: [
        'Developed a web chemical inventory system for an academic laboratory.',
        'Implemented the backend using Laravel and managed data with SQLite.',
        'Developed CRUD features, automated reports, and inventory control.',
        'Worked under agile methodology and created technical system documentation.'
      ]
    }
  ],
  projects: [
    {
      name: 'ULenguage — Quechua cultural translation',
      description: 'Mobile app for tourists in Cusco that translates between Quechua, Spanish, and English. It reads text from a photo, translates it on the spot, and explains the cultural context with AI. Includes the app, backend, APIs, and database.',
      tech: 'Flutter, Dart, Node.js, Express.js, MongoDB, JWT, Google Vision API, Gemini AI, Google Translate API, Tesseract.js, Swagger'
    },
    {
      name: 'SaveBot — Image backup via Telegram',
      description: 'Web platform connected to a Telegram bot for backing up and sending images. Users upload files on the web and the bot handles distribution.',
      tech: 'JavaScript, Node.js, Telegram Bot API, REST APIs, HTML, CSS, Git'
    },
    {
      name: 'PostulaFácil — Resume editor',
      description: 'Web app to create, edit, and export resumes in the browser, with a live preview and data stored on the device.',
      tech: 'Vue.js 3, TypeScript, TailwindCSS, JSON, PDF'
    }
  ],
  education: [
    { school: 'Universidad San Ignacio de Loyola (USIL)', degree: 'Software Engineering', date: '2026 – Present', location: 'Lima, Peru' },
    { school: 'TECSUP', degree: 'Software Design and Development — Graduate, bachelor\'s degree', date: '2023 – 2025', location: 'Lima, Peru' }
  ],
  certifications: [
    'Scrum Fundamentals Certified – SCRUMstudy',
    'Cybersecurity Fundamentals – Cisco',
    'Hackathon Becas BCP 2025 – Participant',
    'Hackathon TECSUP 2024 – Selected team',
    'Training Camp CPC – UTEC'
  ],
  skills: {
    frontend: 'HTML, CSS, Bootstrap, TailwindCSS, JavaScript, TypeScript, React, Angular, Vue.js, Next.js',
    backend: 'Node.js, Express.js, PHP, C#, .NET, Laravel, REST APIs, JWT, Swagger',
    db: 'MySQL, PostgreSQL, SQL Server, MongoDB, SQLite',
    mobile: 'Flutter, Dart, GetX, Firebase, Kotlin',
    tools: 'Linux, Git, GitHub, Docker, Postman, Swagger',
    cloudAi: 'AWS Rekognition, Google ML Kit, Grok, Google Cloud Run, Google Gemini AI, Google Vision API, OCR, Telegram Bot API',
    languages: 'Spanish (Native), English'
  },
  fileName: 'CV_Main_Fabricio_EN',
  meta: { settings: { ...defaultSettings }, contentRevision: 3 }
}

export const normalizeCv = (cv: any) => {
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

export const PROFILE_REVISION = 3

export function createEmptyCv(fileName: string) {
  return normalizeCv({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
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

const OLD_MOBILE = 'Flutter, Dart, Kotlin'
const OLD_TOOLS = 'Linux, Git, GitHub, Postman, Swagger'
const OLD_CLOUD = 'Google Gemini AI, Google Vision API, OCR, Telegram Bot API'

export function applyProfileRevision(cv: any) {
  if (!cv || cv.name !== 'Fabricio Aylas Moreno') return cv
  if ((cv.meta?.contentRevision ?? 0) >= PROFILE_REVISION) return cv

  const belityRole = String(
    cv.experience?.find((e: any) => String(e?.company || '').includes('Belity'))?.role || ''
  )
  const isEn =
    String(cv.fileName || '').includes('_EN') ||
    String(cv.summary || '').startsWith('Software Design') ||
    belityRole.includes('Developer')

  const base = isEn ? fabricioCV_en : fabricioCV
  cv.summary = base.summary
  cv.projects = JSON.parse(JSON.stringify(base.projects))

  if (Array.isArray(cv.education)) {
    const baseTecsup = base.education.find((e: any) => String(e?.school || '').includes('TECSUP'))
    const localTecsup = cv.education.find((e: any) => String(e?.school || '').includes('TECSUP'))
    if (baseTecsup && localTecsup) localTecsup.degree = baseTecsup.degree
  }

  const belity = JSON.parse(JSON.stringify(base.experience[0]))
  if (!Array.isArray(cv.experience)) cv.experience = []
  const idx = cv.experience.findIndex((e: any) => String(e?.company || '').includes('Belity'))
  if (idx >= 0) cv.experience[idx] = belity
  else cv.experience.unshift(belity)

  if (cv.skills && typeof cv.skills === 'object' && !Array.isArray(cv.skills)) {
    if (cv.skills.mobile === OLD_MOBILE) cv.skills.mobile = base.skills.mobile
    if (cv.skills.tools === OLD_TOOLS) cv.skills.tools = base.skills.tools
    if (cv.skills.cloudAi === OLD_CLOUD) cv.skills.cloudAi = base.skills.cloudAi
  }

  if (!cv.meta) cv.meta = {}
  cv.meta.contentRevision = PROFILE_REVISION
  return cv
}
