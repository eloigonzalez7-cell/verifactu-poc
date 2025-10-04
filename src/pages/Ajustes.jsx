import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '../components/ui/input.jsx'
import { Button } from '../components/ui/button.jsx'
import { loadAjustes, saveAjustes } from '../lib/storage.js'
import { useToast } from '../components/ui/use-toast.js'

function Ajustes() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      emisor: {
        nif: '',
        nombre: ''
      },
      instalacion: '',
      versionSistema: ''
    }
  })
  const { toast } = useToast()

  useEffect(() => {
    reset(mapAjustesToForm(loadAjustes()))
  }, [reset])

  const onSubmit = handleSubmit((values) => {
    saveAjustes(values)
    toast({
      title: 'Ajustes guardados',
      description: 'Los datos por defecto se aplicarán en nuevas facturas.'
    })
  })

  return (
    <section className="max-w-2xl space-y-6 rounded-xl border bg-card/80 p-6 shadow-sm">
      <header>
        <h2 className="text-2xl font-semibold">Ajustes generales</h2>
        <p className="text-sm text-muted-foreground">
          Define los valores por defecto para acelerar la creación de facturas y cumplir con ISO 9001.
        </p>
      </header>
      <form className="space-y-6" onSubmit={onSubmit}>
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Datos del emisor por defecto
          </legend>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm font-medium">
              NIF
              <Input {...register('emisor.nif')} autoComplete="off" />
            </label>
            <label className="flex flex-col text-sm font-medium">
              Nombre o razón social
              <Input {...register('emisor.nombre')} autoComplete="off" />
            </label>
          </div>
        </fieldset>
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Información técnica
          </legend>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm font-medium">
              Identificador de instalación
              <Input {...register('instalacion')} placeholder="ES0001" />
            </label>
            <label className="flex flex-col text-sm font-medium">
              Versión del sistema
              <Input {...register('versionSistema')} placeholder="1.0.0" />
            </label>
          </div>
        </fieldset>
        <div className="flex items-center gap-2">
          <Button type="submit">Guardar ajustes</Button>
          <Button type="button" variant="ghost" onClick={() => reset(mapAjustesToForm(loadAjustes()))}>
            Restaurar guardados
          </Button>
        </div>
      </form>
    </section>
  )
}

function mapAjustesToForm(ajustes = {}) {
  return {
    emisor: {
      nif: ajustes?.emisor?.nif || '',
      nombre: ajustes?.emisor?.nombre || ''
    },
    instalacion: ajustes?.instalacion || '',
    versionSistema: ajustes?.versionSistema || ''
  }
}

export default Ajustes
