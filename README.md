# VeriFactu POC Frontend

Aplicación SPA construida con React + Vite que permite crear, firmar y enviar facturas VeriFactu al backend de pruebas de la AEAT siguiendo los requisitos de accesibilidad (WCAG 2.1 AA), calidad (ISO 9001) y eIDAS/ETSI.

## Características principales

- Editor visual con hoja A4 responsive, sombra realista y controles accesibles.
- Formulario dinámico gestionado con **React Hook Form** y `useFieldArray` para las líneas de factura.
- Cálculo automático de totales, desglose de IVA y generación de huella SHA-256 en el cliente.
- Flujo de envío con estados visibles, loaders accesibles y barra de progreso coloreada según resultado.
- Integración con **Axios** (`src/lib/api.js`) utilizando `VITE_API_BASE_URL` como base.
- Respuestas de la AEAT en diálogo accesible con hash, estado, código de error y XML.
- Generación de código QR con los metadatos clave de la factura.
- Historial local de facturas enviadas y módulo de ajustes persistidos en `localStorage`.
- Componentes UI basados en **TailwindCSS** y patrones de **shadcn/ui** (Button, Input, Table, Dialog, Toast, Progress).
- Preparada para impresión (`window.print()` y estilos `@media print`).

## Requisitos

- Node.js >= 18
- npm >= 9

No es necesario acceso a Internet para ejecutar el proyecto; las dependencias están declaradas en `package.json`.

## Puesta en marcha

```bash
npm install
npm run dev
```

La aplicación se sirve en `http://localhost:5173` por defecto.

## Configuración de entorno

Crea un archivo `.env` en la raíz del proyecto con la URL del backend AEAT de pruebas:

```env
VITE_API_BASE_URL=https://tu-backend-verifactu.test
```

## Estructura relevante

```
src/
  components/
    A4Sheet.jsx            # Contenedor visual con proporciones A4
    Toolbar.jsx            # Botonera para guardar, enviar e imprimir
    InvoiceHeader.jsx      # Datos generales de la factura
    InvoiceParties.jsx     # Datos del emisor y receptor
    InvoiceLines.jsx       # Tabla dinámica de líneas con IVA
    InvoiceTotals.jsx      # Resumen de totales e IVA
    StatusStepper.jsx      # Seguimiento accesible del flujo de envío
    ResponseDialog.jsx     # Diálogo accesible con respuesta de la AEAT
    QrDialog.jsx           # Diálogo con QR generado
    AccessibleAlert.jsx    # Mensajes accesibles aria-live
    ui/                    # Componentes base shadcn (Button, Input, Table, Dialog, Toast, Progress)
  lib/
    api.js                 # Cliente Axios y utilidades de API
    calc.js                # Cálculos económicos y payload hash
    storage.js             # Persistencia en localStorage
  pages/
    EditorFactura.jsx      # Editor principal y lógica de envío
    Enviadas.jsx           # Historial de facturas enviadas
    Ajustes.jsx            # Configuración de valores por defecto
  App.jsx                  # Layout principal con navegación
  routes.jsx               # Definición de rutas con React Router
  main.jsx                 # Punto de entrada ReactDOM
```

## Tests y calidad

Actualmente no se incluyen tests automatizados. Se recomienda añadir pruebas de integración o unitarias con Vitest/Testing Library para garantizar el cumplimiento continuo de los requisitos.

## Licencia

MIT
