import html2pdf from 'html2pdf.js'

export function safeFileName(name: string, extension: string) {
  const ext = extension.startsWith('.') ? extension : `.${extension}`
  const base = String(name || 'CV')
    .replace(/[\\/:*?"<>|]+/g, ' ')
    .trim()
    .replace(/\s+/g, '_') || 'CV'
  return base.toLowerCase().endsWith(ext) ? base : `${base}${ext}`
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

export function downloadJson(filename: string, data: unknown) {
  downloadBlob(
    safeFileName(filename, '.json'),
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  )
}

export async function downloadResumePdf(source: HTMLElement, filename: string, paperSize: string) {
  const host = document.createElement('div')
  host.setAttribute('data-pdf-host', 'true')
  host.style.cssText = [
    'position:fixed',
    'left:0',
    'top:0',
    'z-index:2147483646',
    'background:#ffffff',
    'pointer-events:none'
  ].join(';')

  const clone = source.cloneNode(true) as HTMLElement
  clone.removeAttribute('id')
  clone.style.transform = 'none'
  clone.style.boxShadow = 'none'
  clone.style.margin = '0'
  clone.style.opacity = '1'
  host.appendChild(clone)
  document.body.appendChild(host)

  const opt = {
    margin: 0,
    filename: safeFileName(filename, '.pdf'),
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: {
      unit: 'mm',
      format: paperSize === 'Letter' ? 'letter' : 'a4',
      orientation: 'portrait' as const
    },
    pagebreak: { mode: ['css', 'legacy'], avoid: ['.keep'] }
  }

  try {
    await html2pdf().set(opt as Parameters<ReturnType<typeof html2pdf>['set']>[0]).from(clone).save()
  } finally {
    host.remove()
  }
}
