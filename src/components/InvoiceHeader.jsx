import { useFormContext } from 'react-hook-form'
import { Input } from './ui/input.jsx'

function InvoiceHeader() {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  return (
    <header className="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2 md:gap-6">
      <div className="space-y-2">
        <label className="flex flex-col text-sm font-semibold">
          Número de factura
          <Input
            {...register('numero', { required: 'Introduce el número de factura' })}
            aria-invalid={Boolean(errors.numero)}
            aria-describedby={errors.numero ? 'numero-error' : undefined}
          />
        </label>
        {errors.numero && (
          <p id="numero-error" className="text-sm text-red-600">
            {errors.numero.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="flex flex-col text-sm font-semibold">
          Fecha de emisión
          <Input
            type="date"
            {...register('fechaEmision', { required: 'Selecciona una fecha válida' })}
            aria-invalid={Boolean(errors.fechaEmision)}
            aria-describedby={errors.fechaEmision ? 'fecha-error' : undefined}
          />
        </label>
        {errors.fechaEmision && (
          <p id="fecha-error" className="text-sm text-red-600">
            {errors.fechaEmision.message}
          </p>
        )}
      </div>
      <div className="md:col-span-2">
        <label className="flex flex-col text-sm font-semibold">
          Descripción de la operación
          <textarea
            className="mt-1 min-h-[90px] w-full rounded-md border border-input bg-white p-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...register('descripcionOperacion', {
              required: 'Describe brevemente la operación'
            })}
            aria-invalid={Boolean(errors.descripcionOperacion)}
            aria-describedby={errors.descripcionOperacion ? 'desc-error' : undefined}
          />
        </label>
        {errors.descripcionOperacion && (
          <p id="desc-error" className="text-sm text-red-600">
            {errors.descripcionOperacion.message}
          </p>
        )}
      </div>
    </header>
  )
}

export default InvoiceHeader
