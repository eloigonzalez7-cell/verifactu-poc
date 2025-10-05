import { createHashRouter } from 'react-router-dom'
import App from './App.jsx'
import EditorFactura from './pages/EditorFactura.jsx'
import Enviadas from './pages/Enviadas.jsx'
import Ajustes from './pages/Ajustes.jsx'

// Página de error genérica (simple y funcional)
const ErrorPage = () => (
  <div
    style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '2rem',
    }}
  >
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ Error inesperado</h1>
    <p>Ha ocurrido un problema al cargar esta página.</p>
    <a
      href="#/"
      style={{
        marginTop: '1rem',
        color: '#2563eb',
        textDecoration: 'underline',
      }}
    >
      Volver al inicio
    </a>
  </div>
)

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />, // ✅ evita el error feo por defecto
    children: [
      { index: true, element: <EditorFactura /> },
      { path: 'enviadas', element: <Enviadas /> },
      { path: 'ajustes', element: <Ajustes /> },
    ],
  },
])