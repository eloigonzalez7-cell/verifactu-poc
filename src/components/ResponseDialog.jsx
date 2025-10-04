import PropTypes from 'prop-types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from './ui/dialog.jsx'
import { Button } from './ui/button.jsx'
import { formatCurrency } from '../lib/calc.js'

function ResponseDialog({ response, totals, children }) {
  const { estadoValidacion, codigoError, hash, timestamp, xml } = response || {}
  const safeHash = hash && hash.length > 0 ? hash : '—'
  const safeTotals = {
    base: totals?.base ?? 0,
    cuota: totals?.cuota ?? 0,
    total: totals?.total ?? 0
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Respuesta de la AEAT</DialogTitle>
          <DialogDescription>
            Información conforme a eIDAS/ETSI. Se muestra la huella utilizada y el estado del envío.
          </DialogDescription>
        </DialogHeader>
        <section className="space-y-4 text-sm">
          <div className="grid gap-2">
            <p>
              <span className="font-semibold">Estado de validación:</span> {estadoValidacion || 'Desconocido'}
            </p>
            {codigoError && (
              <p>
                <span className="font-semibold">Código de error:</span> {codigoError}
              </p>
            )}
            <p>
              <span className="font-semibold">Huella aplicada (SHA-256):</span>
              <code className="mt-1 block break-all rounded bg-muted p-2 text-xs">{safeHash}</code>
            </p>
            <p>
              <span className="font-semibold">Marca de tiempo:</span> {timestamp || '—'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Resumen económico</h3>
            <ul className="mt-2 space-y-1">
              <li>Base: {formatCurrency(safeTotals.base)}</li>
              <li>IVA: {formatCurrency(safeTotals.cuota)}</li>
              <li>Total: {formatCurrency(safeTotals.total)}</li>
            </ul>
          </div>
          {xml && (
            <details className="rounded border">
              <summary className="cursor-pointer px-3 py-2 font-semibold">Ver XML</summary>
              <pre className="max-h-72 overflow-auto bg-black/90 p-3 text-xs text-green-200">{xml}</pre>
            </details>
          )}
        </section>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

ResponseDialog.propTypes = {
  response: PropTypes.shape({
    estadoValidacion: PropTypes.string,
    codigoError: PropTypes.string,
    hash: PropTypes.string,
    timestamp: PropTypes.string,
    xml: PropTypes.string
  }),
  totals: PropTypes.shape({
    base: PropTypes.number,
    cuota: PropTypes.number,
    total: PropTypes.number
  }),
  children: PropTypes.node.isRequired
}

export default ResponseDialog
