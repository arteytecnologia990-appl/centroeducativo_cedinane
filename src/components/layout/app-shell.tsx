import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

/** Carcasa de la aplicación: sidebar fijo + cabecera fija + contenido con scroll. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-20 md:px-6 md:pb-8">{children}</main>
      </div>
    </div>
  )
}
