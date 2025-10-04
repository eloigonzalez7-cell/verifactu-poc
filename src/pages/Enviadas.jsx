import { useEffect, useState } from 'react'
import { loadEnviadas } from '../lib/storage.js'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.jsx'
import ResponseDialog from '../components/ResponseDialog.jsx'
import QrDialog from '../components/QrDialog.jsx'
import { Button } from '../components/ui/button.jsx'
import { formatCurrency } from '../lib/calc.js'

function Enviadas() {
  const [facturas, setFacturas] = useState([])

  useEffect(() => {
    setFacturas(loadEnviadas())
  }, [])

  if (!facturas.length) {
    return (
      <section className="rounded-xl border bg-card/80 p-6 text-center shadow-sm">
        <h2 className="text-lg font-semibold">Aún no has enviado facturas</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Las facturas enviadas aparecerán aquí con acceso rápido a la respuesta de la AEAT y al código QR.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold">Facturas enviadas</h2>
        <p className="text-sm text-muted-foreground">
          Histórico almacenado localmente. Consulta estados, descargas y metadatos de firma.
        </p>
      </header>
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº factura</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado AEAT</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facturas.map((factura, index) => (
              <TableRow key={`${factura.numero}-${index}`}>
                <TableCell className="font-semibold">{factura.numero}</TableCell>
                <TableCell>{factura.fechaEmision}</TableCell>
                <TableCell>{formatCurrency(factura?.totals?.total || 0)}</TableCell>
                <TableCell>{factura?.response?.estadoValidacion || '—'}</TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <ResponseDialog response={factura.response} totals={factura.totals}>
                      <Button size="sm" variant="outline">
                        Ver respuesta
                      </Button>
                    </ResponseDialog>
                    <QrDialog
                      value={JSON.stringify({
                        nif: factura.emisor?.nif,
                        numero: factura.numero,
                        fecha: factura.fechaEmision,
                        total: factura?.totals?.total,
                        hash: factura?.response?.hash
                      })}
                    >
                      <Button size="sm">Ver QR</Button>
                    </QrDialog>
                    {factura?.response?.xml && (
                      <a
                        href={`data:application/xml;charset=utf-8,${encodeURIComponent(factura.response.xml)}`}
                        download={`factura-${factura.numero}.xml`}
                        className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        Descargar XML
                      </a>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

export default Enviadas
