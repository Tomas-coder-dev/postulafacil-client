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
    'Egresado de Diseño y Desarrollo de Software (TECSUP), con grado de bachiller obtenido y título técnico en proceso de emisión, y estudiante de Ingeniería de Software (USIL). Desarrollador Full Stack con experiencia en desarrollo web y móvil, construcción de APIs REST, integración de bases de datos y servicios externos. Experiencia en desarrollo y mantenimiento de aplicaciones Android e iOS en producción, implementación de funcionalidades bajo arquitectura de microservicios, mejoras UI/UX y despliegue en tiendas de aplicaciones. Enfocado en construir soluciones escalables y mantenibles, optimizar procesos y mejorar la experiencia de usuario mediante buenas prácticas de desarrollo.',
  experience: [
    {
      company: 'Belity — Belleza a domicilio',
      role: 'Desarrollador Full Stack Mobile',
      date: 'Oct 2026 - Actualidad',
      location: 'Lima, Perú',
      description: [
        'Desarrollo y mantenimiento de la aplicación móvil Belity, plataforma de servicios de belleza a domicilio.',
        'Desarrollo de funcionalidades móviles escalables utilizando Flutter para Android e iOS, participando en el ciclo completo de desarrollo y despliegue a producción.',
        'Implementación de nuevas funcionalidades, mejoras de UI/UX y optimización de la experiencia de usuario.',
        'Desarrollo y mantenimiento de integraciones bajo arquitectura de microservicios utilizando Laravel y Node.js para ampliar las funcionalidades de la plataforma.',
        'Gestión de versiones y publicación de actualizaciones en Google Play y App Store.',
        'Uso de herramientas de desarrollo asistido por IA (Cursor) para acelerar tareas de desarrollo, refactorización y resolución de incidencias.'
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
      name: 'ULenguage — Aplicación móvil inteligente de traducción cultural Quechua',
      description: 'Aplicación móvil orientada a turistas en Cusco para traducción quechua-español-inglés. Permite reconocer texto mediante imágenes, realizar traducciones automáticas y generar explicaciones culturales utilizando inteligencia artificial. Desarrollo de solución completa incluyendo aplicación móvil, backend, APIs y gestión de datos.',
      tech: 'Flutter, Dart, Node.js, Express.js, MongoDB, JWT, Google Vision API, Gemini AI, Google Translate API, Tesseract.js, Swagger'
    },
    {
      name: 'SaveBot — Plataforma de respaldo multimedia mediante Telegram',
      description: 'Aplicación web integrada con un bot de Telegram para automatizar el respaldo y envío de imágenes. Permite cargar archivos desde una plataforma web y gestionar su distribución mediante integración con Telegram Bot API.',
      tech: 'JavaScript, Node.js, Telegram Bot API, APIs REST, HTML, CSS, Git'
    },
    {
      name: 'PostulaFácil — Plataforma Inteligente para Creación y Gestión de CVs',
      description: 'Aplicación web para creación, edición y administración de currículums con enfoque en privacidad y personalización.',
      tech: 'Vue.js 3, TypeScript, Composition API, TailwindCSS, JSON, PDF Export'
    }
  ],
  education: [
    { school: 'Universidad San Ignacio de Loyola (USIL)', degree: 'Ingeniería de Software', date: '2026 – Actualidad', location: 'Lima, Perú' },
    { school: 'TECSUP', degree: 'Diseño y Desarrollo de Software - Egresado | Grado de bachiller obtenido; Título técnico en proceso', date: '2023 – 2025', location: 'Lima, Perú' }
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
    mobile: 'Flutter, Dart, Kotlin',
    tools: 'Linux, Git, GitHub, Postman, Swagger',
    cloudAi: 'Google Gemini AI, Google Vision API, OCR, Telegram Bot API',
    languages: ''
  },
  fileName: 'CV_Principal_Fabricio',
  meta: { settings: { ...defaultSettings } }
}

export const fabricioCV_en = {
  name: 'Fabricio Aylas Moreno',
  email: 'aylasmorenof@gmail.com',
  phone: '+51 912 404 450',
  location: 'Lima, Peru',
  linkedin: 'https://www.linkedin.com/in/fabricio-aylas/',
  github: '',
  summary: 'Software Design and Development graduate (TECSUP), with a bachelor\'s degree obtained and technical title in process, and Software Engineering student (USIL). Full Stack Developer with experience in web and mobile development, building REST APIs, database integration, and external services. Experienced in developing and maintaining Android and iOS apps in production, implementing features under a microservices architecture, UI/UX improvements, and app store deployment. Focused on building scalable and maintainable solutions, optimizing processes, and improving user experience through best development practices.',
  experience: [
    {
      company: 'Belity — Belleza a domicilio',
      role: 'Full Stack Mobile Developer',
      date: 'Oct 2026 - Present',
      location: 'Lima, Peru',
      description: [
        'Development and maintenance of the Belity mobile application, an at-home beauty services platform.',
        'Developed scalable mobile solutions using Flutter for Android and iOS, participating in the full cycle from development to production deployment.',
        'Implementation of new features, UI/UX improvements, and optimization of user experience.',
        'Development and maintenance of integrations under a microservices architecture using Laravel and Node.js to expand platform functionalities.',
        'Managed versioning and publishing updates on Google Play and the App Store.',
        'Used AI-assisted development tools (Cursor) to accelerate development, refactoring, and issue resolution tasks.'
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
      name: 'ULenguage — Intelligent Quechua cultural translation mobile app',
      description: 'Mobile application aimed at tourists in Cusco for Quechua-Spanish-English translation. Allows text recognition via images, automatic translations, and cultural explanations using artificial intelligence. Developed a complete solution including a mobile app, backend, APIs, and data management.',
      tech: 'Flutter, Dart, Node.js, Express.js, MongoDB, JWT, Google Vision API, Gemini AI, Google Translate API, Tesseract.js, Swagger'
    },
    {
      name: 'SaveBot — Multimedia backup platform via Telegram',
      description: 'Web application integrated with a Telegram bot to automate the backup and sending of images. Allows uploading files from a web platform and managing their distribution via Telegram Bot API integration.',
      tech: 'JavaScript, Node.js, Telegram Bot API, REST APIs, HTML, CSS, Git'
    },
    {
      name: 'PostulaFácil — Intelligent Platform for CV Creation and Management',
      description: 'Web application for creating, editing, and managing resumes with a focus on privacy and customization.',
      tech: 'Vue.js 3, TypeScript, Composition API, TailwindCSS, JSON, PDF Export'
    }
  ],
  education: [
    { school: 'Universidad San Ignacio de Loyola (USIL)', degree: 'Software Engineering', date: '2026 – Present', location: 'Lima, Peru' },
    { school: 'TECSUP', degree: 'Software Design and Development - Graduate | Bachelor\'s Degree obtained; Technical Title in process', date: '2023 – 2025', location: 'Lima, Peru' }
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
    mobile: 'Flutter, Dart, Kotlin',
    tools: 'Linux, Git, GitHub, Postman, Swagger',
    cloudAi: 'Google Gemini AI, Google Vision API, OCR, Telegram Bot API',
    languages: 'Spanish (Native), English'
  },
  fileName: 'CV_Main_Fabricio_EN',
  meta: { settings: { ...defaultSettings } }
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
