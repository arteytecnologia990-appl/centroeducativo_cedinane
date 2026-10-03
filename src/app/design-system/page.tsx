import { Banknote, Clock, Users } from 'lucide-react'
import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { IndicadorCard } from '@/components/indicador/indicador-card'
import { TablaDatos } from '@/components/tabla/tabla-datos'
import { GrillaSemanal } from '@/components/horarios/grilla-semanal'
import { Kiosco } from '@/components/kiosco/kiosco'
import { EmptyState } from '@/components/estado/empty-state'
import { ErrorState } from '@/components/estado/error-state'
import { StatusBadge } from '@/components/estado/status-badge'
import { ToastDemo } from '@/components/estado/toast-demo'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ESTILOS, type EstiloId } from '@/lib/tema/estilos'

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading text-lg font-semibold text-foreground">{titulo}</h2>
      {children}
    </section>
  )
}

function CeldaEstilo({ estilo, oscuro }: { estilo: EstiloId; oscuro: boolean }) {
  return (
    <div data-estilo={estilo} className={oscuro ? 'dark' : undefined}>
      <div className="rounded-lg border border-border bg-background p-3 text-foreground">
        <div className="mb-2 text-xs font-medium text-muted-foreground">
          {estilo.toUpperCase()} · {oscuro ? 'Oscuro' : 'Claro'}
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button size="sm">Guardar cambios</Button>
            <Button size="sm" variant="outline">
              Cancelar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-transparent bg-success-soft text-success">
              A tiempo
            </Badge>
            <Badge variant="outline" className="border-transparent bg-warning-soft text-warning">
              Atraso
            </Badge>
          </div>
          <div className="rounded-md bg-card p-2 text-sm shadow-card">Superficie (card)</div>
        </div>
      </div>
    </div>
  )
}

export default function DesignSystemPage() {
  return (
    <div className="flex min-h-svh bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 space-y-10 px-4 py-6 pb-20 md:px-6 md:pb-8">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Sistema de diseño</h1>
            <p className="text-sm text-muted-foreground">
              Matriz 4×2 (estilo × modo). Cada celda es independiente del tema global.
            </p>
          </div>

          <Seccion titulo="Matriz 4×2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ESTILOS.map((e) => (
                <div key={e.id} className="space-y-3">
                  <CeldaEstilo estilo={e.id} oscuro={false} />
                  <CeldaEstilo estilo={e.id} oscuro />
                </div>
              ))}
            </div>
          </Seccion>

          <Seccion titulo="Indicadores">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <IndicadorCard titulo="Presentes ahora" valor="18 de 24" detalle="75% de asistencia" Icon={Users} />
              <IndicadorCard titulo="Atrasos hoy" valor="3" detalle="máximo 20 minutos" Icon={Clock} />
              <IndicadorCard titulo="Horas pagables" valor="Gs. 8.450.000" detalle="semana en curso" Icon={Banknote} />
            </div>
          </Seccion>

          <Seccion titulo="Tabla y badges">
            <div className="mb-3 flex flex-wrap gap-2">
              <StatusBadge estado="a_tiempo" />
              <StatusBadge estado="atraso" minutos={12} />
              <StatusBadge estado="turno_completo" />
              <StatusBadge estado="sin_marcar" />
            </div>
            <TablaDatos />
          </Seccion>

          <Seccion titulo="Formularios, diálogos y toasts">
            <div className="grid max-w-xl gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" placeholder="Nombre y apellido" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input id="fecha" type="date" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hora">Hora</Label>
                  <Input id="hora" type="time" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="activo">Registro activo</Label>
                <Switch id="activo" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button>Guardar cambios</Button>
                <Button variant="outline">Cancelar</Button>
                <ToastDemo />
              </div>
            </div>
          </Seccion>

          <Seccion titulo="Grilla semanal por hora">
            <GrillaSemanal />
          </Seccion>

          <Seccion titulo="Kiosco de marcación">
            <div className="max-w-md rounded-xl border border-border p-4">
              <Kiosco />
            </div>
          </Seccion>

          <Seccion titulo="Estados vacío y error">
            <div className="grid gap-3 md:grid-cols-2">
              <EmptyState
                titulo="Todavía no hay personas"
                descripcion="Cargá la primera persona para empezar a gestionar la asistencia."
                accion={<Button size="sm">Cargar persona</Button>}
              />
              <ErrorState
                titulo="No se pudo cargar la asistencia"
                descripcion="Revisá tu conexión y volvé a intentar. Si sigue, avisá a administración."
                accion={
                  <Button size="sm" variant="outline">
                    Reintentar
                  </Button>
                }
              />
            </div>
          </Seccion>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
