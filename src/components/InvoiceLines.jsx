import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from './ui/button.jsx'
import { Input } from './ui/input.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table.jsx'

const ivaOptions = [
  { value: 4, label: '4 %' },
  { value: 10, label: '10 %' },
  { value: 21, label: '21 %' }
]

function InvoiceLines() {
  const { control, register } = useFormContext()
  const { fields, append, remove } = useFieldArray({ control, name: 'lineas' })

  return (
    <section aria-labelledby="lineas-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="lineas-heading" className="text-lg font-semibold">
            Líneas de factura
          </h2>
          <p className="text-sm text-muted-foreground">
            Añade conceptos con cantidad, precio e IVA. Los totales se calculan al instante.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({ descripcion: '', cantidad: 1, precio: 0, tipoIva: 21 })
          }
          aria-label="Añadir una nueva línea de factura"
        >
          Añadir línea
        </Button>
      </div>
      <Table className="text-xs md:text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead className="w-24">Cantidad</TableHead>
            <TableHead className="w-28">Precio</TableHead>
            <TableHead className="w-24">IVA</TableHead>
            <TableHead className="w-16 text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <Input
                  {...register(`lineas.${index}.descripcion`, { required: 'Requerido' })}
                  placeholder="Descripción del servicio"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  {...register(`lineas.${index}.cantidad`, { valueAsNumber: true, min: 0 })}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  {...register(`lineas.${index}.precio`, { valueAsNumber: true, min: 0 })}
                />
              </TableCell>
              <TableCell>
                <Controller
                  control={control}
                  name={`lineas.${index}.tipoIva`}
                  render={({ field }) => (
                    <select
                      className="h-10 w-full rounded-md border border-input bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={field.value ?? 21}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                    >
                      {ivaOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </TableCell>
              <TableCell className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                  aria-label={`Eliminar línea ${index + 1}`}
                  disabled={fields.length === 1}
                >
                  ✕
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}

export default InvoiceLines
