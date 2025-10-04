import { useFormContext } from 'react-hook-form'
import { Input } from './ui/input.jsx'

function InvoiceParties() {
  const { register } = useFormContext()

  const partyFields = [
    { prefix: 'emisor', label: 'Emisor' },
    { prefix: 'receptor', label: 'Receptor' }
  ]

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {partyFields.map((party) => (
        <article key={party.prefix} className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {party.label}
          </h3>
          <div className="mt-3 space-y-3">
            <label className="flex flex-col text-sm font-medium">
              NIF
              <Input {...register(`${party.prefix}.nif`, { required: 'Requerido' })} />
            </label>
            <label className="flex flex-col text-sm font-medium">
              Nombre o razón social
              <Input {...register(`${party.prefix}.nombre`, { required: 'Requerido' })} />
            </label>
          </div>
        </article>
      ))}
    </section>
  )
}

export default InvoiceParties
