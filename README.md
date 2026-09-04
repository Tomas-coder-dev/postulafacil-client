<div align="center">
  <img src="public/favicon.ico" alt="PostulaFácil Logo" width="100" />
  <h1>PostulaFácil</h1>
  <p><strong>Plataforma web para la creación, edición y gestión de currículums profesionales de forma rápida, personalizada y 100% privada.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Pinia-FFE156?style=for-the-badge&logo=vue.js&logoColor=black" alt="Pinia" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
  </p>
</div>

---

## ✨ Características

- 🚀 **Editor en tiempo real**: Visualiza los cambios de tu CV al instante mientras los escribes.
- 🧠 **Gestión de Estado Moderna**: Arquitectura escalable y centralizada utilizando **Pinia**.
- 🤖 **Optimización para IA y ATS**: Estructura optimizada para superar filtros automáticos de selección de personal.
- 🎨 **Alta Personalización**:
  - Paleta de colores temáticos
  - Múltiples tipografías profesionales
  - Control de márgenes, interlineado y espaciado
  - Tamaños de página adaptables (A4, Carta)
- 📄 **Exportación Profesional**: Generación de PDFs limpios y consistentes.
- 🔄 **Respaldos e Importación**: Soporte para guardar, importar y exportar CVs en formato `JSON`, así como lectura de `PDF` y `DOCX`.
- 🌓 **Modo Oscuro/Claro**: Interfaz adaptable a tus preferencias visuales.
- 🌍 **Soporte Multilenguaje**: Disponible en Español e Inglés (i18n nativo).
- 📱 **Progressive Web App (PWA)**: Instalable en dispositivos móviles y de escritorio para usar sin conexión.

## 🛡️ Privacidad Primero (Privacy-First)

PostulaFácil fue construido bajo la premisa de que tu información profesional es tuya.

- **Almacenamiento Local**: Todos los datos y currículums se guardan localmente en tu navegador mediante `LocalStorage`.
- **Sin Bases de Datos Externas**: Ninguna información personal abandona tu dispositivo.
- **Sin Registro**: No se requiere creación de cuentas ni autenticación.
- **Sin Rastreo ni Publicidad**: Una experiencia libre de cookies de seguimiento y anuncios.

## 🛠️ Stack Tecnológico

| Tecnología | Descripción |
|------------|-------------|
| **Vue.js 3** | Framework progresivo con Composition API |
| **Pinia** | Store oficial de Vue para gestión global de estado |
| **TypeScript** | Tipado estático robusto y seguro |
| **TailwindCSS** | Framework CSS utility-first para diseño rápido y responsive |
| **Vite** | Herramienta de compilación ultrarrápida |
| **Lucide Vue Next** | Colección de íconos SVG minimalistas |

## 🚀 Instalación y Uso Local

Sigue estos pasos para correr el proyecto en tu entorno local:

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Tomas-coder-dev/postulafacil-client.git
   cd postulafacil-client
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Levantar el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   *La aplicación estará disponible en `http://localhost:5173`*

4. **Construir para producción**
   ```bash
   npm run build
   ```

## 📂 Estructura del Proyecto

```text
src/
├── components/       # Componentes de UI reutilizables (NavBar, Dashboard, ResumeEditor, etc.)
├── store/            # Gestión global del estado
│   └── cvStore.ts    # Store principal de Pinia
├── utils/            # Utilidades, constantes y traducciones
│   ├── cvDefaults.ts # Configuraciones por defecto y plantillas
│   └── translations.ts # Diccionario i18n
├── views/            # Vistas principales de la aplicación
│   └── EditorView.vue
├── App.vue           # Componente raíz y enrutador de vistas
└── main.ts           # Punto de entrada de la aplicación
```
