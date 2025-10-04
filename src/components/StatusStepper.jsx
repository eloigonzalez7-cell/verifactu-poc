import PropTypes from 'prop-types'
import { Progress } from './ui/progress.jsx'
import AccessibleAlert from './AccessibleAlert.jsx'

function StatusStepper({ steps, currentStep, result }) {
  const percentage = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0
  const colorClass =
    result === 'error' ? 'bg-red-500' : result === 'success' ? 'bg-green-500' : 'bg-primary'

  return (
    <aside className="no-print w-full rounded-xl border bg-card/80 p-4 shadow-sm" aria-live="polite">
      <header className="mb-4">
        <h2 className="text-lg font-semibold">Estado del envío</h2>
        <p className="text-sm text-muted-foreground">
          Seguimiento técnico compatible con lectores de pantalla.
        </p>
      </header>
      <ol className="space-y-3" role="list">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          return (
            <li key={step.key} className="flex items-start gap-3">
              <span
                className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                  isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
                aria-hidden="true"
              >
                {isCompleted ? '✓' : index + 1}
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
                {isActive && <AccessibleAlert message={step.liveMessage} />}
              </div>
            </li>
          )
        })}
      </ol>
      <div className="mt-6">
        <Progress value={percentage} colorClass={colorClass} />
      </div>
      {result && (
        <div className="mt-4">
          <AccessibleAlert
            status={result === 'success' ? 'success' : 'error'}
            message={
              result === 'success'
                ? 'Factura enviada correctamente. Puedes revisar la respuesta de la AEAT.'
                : 'Ha ocurrido un error durante el envío. Revisa los detalles proporcionados.'
            }
          />
        </div>
      )}
    </aside>
  )
}

StatusStepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      liveMessage: PropTypes.string
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
  result: PropTypes.oneOf([null, 'success', 'error'])
}

export default StatusStepper
