import PropTypes from 'prop-types'
import { formatCurrency } from '../lib/calc.js'

function InvoiceTotals({ totals }) {
  const ivaEntries = Object.entries(totals.ivaBreakdown || {})
  return (
    <section className="rounded-lg border bg-muted/30 p-4" aria-labelledby="totales-heading">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 id="totales-heading" className="text-lg font-semibold">
            Totales
          </h2>
          <p className="text-sm text-muted-foreground">
            Actualizado automáticamente según las líneas de la factura.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Base imponible</dt>
            <dd className="font-semibold">{formatCurrency(totals.base)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">IVA</dt>
            <dd className="font-semibold">{formatCurrency(totals.cuota)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">Total factura</dt>
            <dd className="text-2xl font-bold">{formatCurrency(totals.total)}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-muted-foreground">Desglose por tipo de IVA</h3>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {ivaEntries.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin IVA aplicado.</p>
          )}
          {ivaEntries.map(([tipo, detalle]) => (
            <div key={tipo} className="rounded-md bg-white p-3 text-sm shadow-sm">
              <p className="font-semibold">IVA {tipo}%</p>
              <p>Base: {formatCurrency(detalle.base)}</p>
              <p>Cuota: {formatCurrency(detalle.cuota)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

InvoiceTotals.propTypes = {
  totals: PropTypes.shape({
    base: PropTypes.number,
    cuota: PropTypes.number,
    total: PropTypes.number,
    ivaBreakdown: PropTypes.object
  })
}

export default InvoiceTotals
