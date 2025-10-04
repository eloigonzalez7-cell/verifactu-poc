import { createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import EditorFactura from './pages/EditorFactura.jsx'
import Enviadas from './pages/Enviadas.jsx'
import Ajustes from './pages/Ajustes.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <EditorFactura /> },
      { path: 'enviadas', element: <Enviadas /> },
      { path: 'ajustes', element: <Ajustes /> }
    ]
  }
])
