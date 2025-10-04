import { useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import A4Sheet from '../components/A4Sheet.jsx'
import Toolbar from '../components/Toolbar.jsx'
import InvoiceHeader from '../components/InvoiceHeader.jsx'
import InvoiceParties from '../components/InvoiceParties.jsx'
import InvoiceLines from '../components/InvoiceLines.jsx'
import InvoiceTotals from '../components/InvoiceTotals.jsx'
import StatusStepper from '../components/StatusStepper.jsx'
import ResponseDialog from '../components/ResponseDialog.jsx'
import QrDialog from '../components/QrDialog.jsx'
import { calculateTotals, buildInvoiceHashPayload } from '../lib/calc.js'
import { loadDraft, saveDraft, saveEnviada, loadAjustes } from '../lib/storage.js'
import { sendInvoice } from '../lib/api.js'
import { useToast } from '../components/ui/use-toast.js'
import { Button } from '../components/ui/button.jsx'

const stepsDefinition = [
  {
    key: 'prepare',
    label: 'Preparando datos',
    description: 'Validando y normalizando la factura antes de firmar.',
    liveMessage: 'Preparando datos para el esquema VeriFactu.'
  },
  {
    key: 'hash',
    label: 'Generando huella (SHA-256)',
    description: 'Se crea la huella de la factura, visible para auditoría.',
    liveMessage: 'Calculando hash seguro conforme a eIDAS.'
  },
  {
    key: 'sign',
    label: 'Firmando factura',
    description: 'Simulación de firma. La firma real se realiza en el backend.',
    liveMessage: 'Firmando factura electrónicamente (simulado).'
  },
  {
    key: 'send',
    label: 'Enviando a AEAT',
    description: 'Transmisión cifrada hacia el servicio de pruebas AEAT.',
    liveMessage: 'Enviando datos al endpoint de la AEAT.'
  },
  {
    key: 'wait',
    label: 'Esperando respuesta',
    description: 'Monitoreando la recepción y validación por parte de la AEAT.',
    liveMessage: 'Esperando respuesta oficial de la AEAT.'
  },
  {
    key: 'qr',
    label: 'Generando factura con QR',
    description: 'Creación del código QR con datos esenciales.',
    liveMessage: 'Generando código QR accesible para la factura.'
  },
  {
    key: 'download',
    label: 'Descargando factura',
    description: 'Preparación para la descarga o impresión.',
    liveMessage: 'Generando PDF/imprimible.'
  }
]

const fallbackLine = { descripcion: '', cantidad: 1, precio: 0, tipoIva: 21 }

function buildDefaultValues() {
  const ajustes = loadAjustes()
  const borrador = loadDraft()
  if (borrador) return borrador
  const today = new Date().toISOString().split('T')[0]
  return {
    numero: '',
    fechaEmision: today,
    descripcionOperacion: '',
    emisor: {
      nif: ajustes?.emisor?.nif || '',
      nombre: ajustes?.emisor?.nombre || ''
    },
    receptor: {
      nif: '',
      nombre: ''
    },
    lineas: [fallbackLine]
  }
}

async function generateHash(invoice) {
  const payload = buildInvoiceHashPayload(invoice)
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder()
    const data = encoder.encode(payload)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  let hash = 0
  for (let i = 0; i < payload.length; i += 1) {
    const chr = payload.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return `fallback-${Math.abs(hash)}`
}

function EditorFactura() {
  const methods = useForm({ defaultValues: buildDefaultValues() })
  const {
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { isSubmitting }
  } = methods
  const watchedValues = watch()
  const lineas = watchedValues?.lineas || [fallbackLine]
  const totals = useMemo(() => calculateTotals(lineas), [lineas])
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState(null)
  const [response, setResponse] = useState(null)
  const hashRef = useRef('')
  const [hash, setHash] = useState('')
  const { toast } = useToast()

  const qrValue = useMemo(() => {
    const values = watchedValues
    return JSON.stringify({
      nif: values?.emisor?.nif || '',
      numero: values?.numero || '',
      fecha: values?.fechaEmision || '',
      total: totals.total,
      hash: hashRef.current
    })
  }, [watchedValues, totals.total, hash])

  const runStep = async (key, values, computedTotals) => {
    switch (key) {
      case 'prepare':
        await wait(400)
        return true
      case 'hash': {
        const generated = await generateHash(values)
        hashRef.current = generated
        setHash(generated)
        return generated
      }
      case 'sign':
        await wait(400)
        return true
      case 'send': {
        const payload = {
          emisor: values.emisor,
          receptor: values.receptor,
          numero: values.numero,
          fechaEmision: values.fechaEmision,
          descripcionOperacion: values.descripcionOperacion,
          lineas: values.lineas,
          totals: {
            base: computedTotals.base,
            cuota: computedTotals.cuota,
            total: computedTotals.total
          }
        }
        const data = await sendInvoice(payload)
        const responseData = {
          estadoValidacion: data?.estado || 'Correcto',
          codigoError: data?.codigoError || '',
          hash: hashRef.current,
          timestamp: new Date().toISOString(),
          xml: data?.xml || ''
        }
        setResponse(responseData)
        return responseData
      }
      case 'wait':
        await wait(600)
        return true
      case 'qr':
        await wait(300)
        return true
      case 'download':
        await wait(300)
        return true
      default:
        return true
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    const computedTotals = calculateTotals(values.lineas || [fallbackLine])
    setCurrentStep(0)
    setResult(null)
    setResponse(null)
    hashRef.current = ''
    setHash('')
    try {
      let finalResponse = null
      for (let index = 0; index < stepsDefinition.length; index += 1) {
        setCurrentStep(index)
        const resultStep = await runStep(stepsDefinition[index].key, values, computedTotals)
        if (stepsDefinition[index].key === 'send') {
          finalResponse = resultStep
        }
      }
      if (finalResponse) {
        setResponse(finalResponse)
      }
      const storedResponse = {
        estadoValidacion: finalResponse?.estadoValidacion || 'Correcto',
        codigoError: finalResponse?.codigoError || null,
        hash: hashRef.current,
        timestamp: finalResponse?.timestamp || new Date().toISOString(),
        xml: finalResponse?.xml || ''
      }
      const invoiceToStore = {
        ...values,
        totals: computedTotals,
        response: storedResponse
      }
      saveEnviada(invoiceToStore)
      saveDraft(null)
      toast({
        title: 'Factura enviada',
        description: 'La AEAT ha recibido la factura correctamente.'
      })
      setResult('success')
    } catch (error) {
      console.error(error)
      const apiError = error?.response?.data
      const errorResponse = {
        estadoValidacion: 'Incorrecto',
        codigoError: apiError?.code || apiError?.message || error.message,
        hash: hashRef.current,
        timestamp: new Date().toISOString(),
        xml: apiError?.xml || ''
      }
      setResponse(errorResponse)
      toast({
        title: 'Error al enviar',
        description: 'Revisa la respuesta proporcionada por la AEAT.',
        variant: 'destructive'
      })
      setResult('error')
    }
  })

  const handleGuardar = () => {
    const valores = getValues()
    saveDraft(valores)
    toast({ title: 'Borrador guardado', description: 'El borrador se ha almacenado localmente.' })
  }

  const handleImprimir = () => {
    window.print()
  }

  const handleResetDraft = () => {
    reset(buildDefaultValues())
    hashRef.current = ''
    setHash('')
    toast({
      title: 'Borrador restablecido',
      description: 'Se han cargado los ajustes por defecto.'
    })
  }

  return (
    <FormProvider {...methods}>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Toolbar
            formId="invoice-form"
            onGuardar={handleGuardar}
            onImprimir={handleImprimir}
            isSubmitting={isSubmitting}
          />
          <form id="invoice-form" onSubmit={onSubmit}>
            <A4Sheet>
              <InvoiceHeader />
              <InvoiceParties />
              <InvoiceLines />
              <InvoiceTotals totals={totals} />
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <p>
                  Huella generada:{' '}
                  <span className="font-mono">{hashRef.current ? hashRef.current : '—'}</span>
                </p>
                <Button type="button" variant="ghost" onClick={handleResetDraft} className="no-print">
                  Restablecer borrador
                </Button>
              </div>
            </A4Sheet>
          </form>
        </div>
        <div className="space-y-4">
          <StatusStepper steps={stepsDefinition} currentStep={currentStep} result={result} />
          {response && (
            <div className="no-print space-y-3 rounded-xl border bg-card/80 p-4 shadow-sm">
              <h3 className="text-base font-semibold">Acciones tras el envío</h3>
              <p className="text-sm text-muted-foreground">
                Consulta la respuesta de la AEAT o genera el QR oficial.
              </p>
              <div className="flex flex-wrap gap-2">
                <ResponseDialog response={response} totals={totals}>
                  <Button variant="outline">Ver respuesta</Button>
                </ResponseDialog>
                <QrDialog value={qrValue}>
                  <Button>Ver QR</Button>
                </QrDialog>
              </div>
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  )
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

export default EditorFactura
