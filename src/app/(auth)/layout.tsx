import { Logo } from '@/components/auth/logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh bg-background">
      {/* Panel de marca (escritorio) */}
      <aside className="hidden w-1/2 flex-col justify-between border-r border-border bg-card p-10 lg:flex">
        <Logo />
        <div className="space-y-3">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Gestión integral del centro, en un solo lugar.
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Personas, horarios, asistencia y horas pagables. Simple, seguro y pensado para el día a día.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">Centro Educativo y Terapéutico · Paraguay</p>
      </aside>

      {/* Panel del formulario */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
