import PropTypes from 'prop-types'
import { Button } from './ui/button.jsx'

function Toolbar({ onGuardar, onEnviar, onImprimir, isSubmitting, formId }) {
  const handleEnviarClick = (event) => {
    if (!formId && onEnviar) {
      onEnviar(event)
    }
  }

  const enviarType = formId ? 'submit' : 'button'

  return (
    <div className="no-print flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card/80 p-4 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">Acciones</h2>
        <p className="text-sm text-muted-foreground">
          Guarda, envía o imprime la factura respetando el flujo VeriFactu.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={onGuardar} aria-label="Guardar borrador de factura">
          Guardar
        </Button>
        <Button
          type={enviarType}
          form={formId}
          onClick={handleEnviarClick}
          disabled={isSubmitting}
          aria-label="Enviar factura a la AEAT"
        >
          {isSubmitting ? 'Enviando…' : 'Enviar factura'}
        </Button>
        <Button type="button" variant="secondary" onClick={onImprimir} aria-label="Imprimir factura">
          Imprimir
        </Button>
      </div>
    </div>
  )
}

Toolbar.propTypes = {
  onGuardar: PropTypes.func,
  onEnviar: PropTypes.func,
  onImprimir: PropTypes.func,
  isSubmitting: PropTypes.bool,
  formId: PropTypes.string
}

export default Toolbar
