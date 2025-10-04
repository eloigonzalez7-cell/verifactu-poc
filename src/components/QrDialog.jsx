import PropTypes from 'prop-types'
import { QRCodeSVG } from 'qrcode.react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from './ui/dialog.jsx'
import { Button } from './ui/button.jsx'

function QrDialog({ value, children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Factura VeriFactu</DialogTitle>
          <DialogDescription>
            Escanea el código QR para verificar los metadatos esenciales de la factura.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <QRCodeSVG value={value} size={256} includeMargin className="rounded bg-white p-4" />
          <p className="text-center text-sm text-muted-foreground">
            El QR incluye NIF del emisor, número de factura, fecha, total y la huella generada.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

QrDialog.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default QrDialog
