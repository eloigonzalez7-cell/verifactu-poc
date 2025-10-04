import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from './components/ui/toaster.jsx'
import { cn } from './lib/utils.js'

function App() {
  const location = useLocation()

  useEffect(() => {
    const main = document.querySelector('main')
    if (main) {
      main.focus()
    }
  }, [location])

  const navItems = [
    { to: '/', label: 'Editor de factura' },
    { to: '/enviadas', label: 'Enviadas' },
    { to: '/ajustes', label: 'Ajustes' }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="no-print border-b bg-card">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">VeriFactu POC</h1>
            <p className="text-sm text-muted-foreground">
              Generación y envío accesible de facturas VeriFactu
            </p>
          </div>
          <nav aria-label="Principal">
            <ul className="flex items-center gap-4 text-sm font-medium">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    className={cn(
                      'rounded-full px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      location.pathname === item.to
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                    to={item.to}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main
        tabIndex={-1}
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8 focus-visible:outline-none"
      >
        <Outlet />
      </main>
      <footer className="no-print border-t bg-card py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VeriFactu POC. Cumple WCAG 2.1 AA, ISO 9001 y eIDAS.
      </footer>
      <Toaster />
    </div>
  )
}

export default App
