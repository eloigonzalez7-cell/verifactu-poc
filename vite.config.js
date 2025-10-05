import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detecta entorno
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  base: isProduction ? '/verifactu-poc/' : '/', // ✅ usa /verifactu-poc solo en producción
})