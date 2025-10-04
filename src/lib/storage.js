const STORAGE_KEYS = {
  borrador: 'verifactu:borrador',
  enviadas: 'verifactu:enviadas',
  ajustes: 'verifactu:ajustes'
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback
  } catch (error) {
    console.warn('No se pudo parsear el valor de localStorage', error)
    return fallback
  }
}

export function loadDraft() {
  if (typeof window === 'undefined') return null
  return safeParse(localStorage.getItem(STORAGE_KEYS.borrador), null)
}

export function saveDraft(data) {
  if (typeof window === 'undefined') return
  if (data === null) {
    localStorage.removeItem(STORAGE_KEYS.borrador)
    return
  }
  localStorage.setItem(STORAGE_KEYS.borrador, JSON.stringify(data))
}

export function loadEnviadas() {
  if (typeof window === 'undefined') return []
  return safeParse(localStorage.getItem(STORAGE_KEYS.enviadas), [])
}

export function saveEnviada(factura) {
  if (typeof window === 'undefined') return
  const actuales = loadEnviadas()
  localeset(STORAGE_KEYS.enviadas, [...actuales, factura])
}

function localeset(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function setEnviadas(facturas) {
  if (typeof window === 'undefined') return
  localeset(STORAGE_KEYS.enviadas, facturas)
}

export function loadAjustes() {
  if (typeof window === 'undefined') return {}
  return safeParse(localStorage.getItem(STORAGE_KEYS.ajustes), {})
}

export function saveAjustes(data) {
  if (typeof window === 'undefined') return
  localeset(STORAGE_KEYS.ajustes, data)
}
