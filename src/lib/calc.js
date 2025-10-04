export function calculateLineTotals(lineas = []) {
  return lineas.map((linea) => {
    const cantidad = Number(linea.cantidad) || 0
    const precio = Number(linea.precio) || 0
    const tipoIva = Number(linea.tipoIva) || 0
    const base = cantidad * precio
    const cuota = base * (tipoIva / 100)
    const total = base + cuota
    return {
      ...linea,
      base,
      cuota,
      total
    }
  })
}

export function calculateTotals(lineas = []) {
  const totales = calculateLineTotals(lineas)
  const base = totales.reduce((acc, linea) => acc + linea.base, 0)
  const cuota = totales.reduce((acc, linea) => acc + linea.cuota, 0)
  const total = totales.reduce((acc, linea) => acc + linea.total, 0)

  const ivaBreakdown = totales.reduce((acc, linea) => {
    const key = linea.tipoIva || 0
    const current = acc[key] || { base: 0, cuota: 0 }
    return {
      ...acc,
      [key]: {
        base: current.base + linea.base,
        cuota: current.cuota + linea.cuota
      }
    }
  }, {})

  return {
    base,
    cuota,
    total,
    ivaBreakdown
  }
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value || 0)
}

export function buildInvoiceHashPayload(invoice) {
  const { emisor = {}, receptor = {}, numero = '', fechaEmision = '', descripcionOperacion = '', lineas = [] } = invoice || {}
  const payload = [
    emisor.nif,
    emisor.nombre,
    receptor.nif,
    receptor.nombre,
    numero,
    fechaEmision,
    descripcionOperacion,
    ...lineas.map((linea) => `${linea.descripcion}|${linea.cantidad}|${linea.precio}|${linea.tipoIva}`)
  ].join('#')
  return payload
}
