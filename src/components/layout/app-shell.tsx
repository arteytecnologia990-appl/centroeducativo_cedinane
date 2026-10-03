import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

/** Carcasa de la aplicación: sidebar + cabecera + contenido. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 px-4 py-6 pb-20 md:px-6 md:pb-8">{children}</main>
      </div>
    </div>
  )
}
