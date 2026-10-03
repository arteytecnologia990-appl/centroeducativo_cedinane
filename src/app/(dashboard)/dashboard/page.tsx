import { Banknote, Clock, Users } from 'lucide-react'
import { IndicadorCard } from '@/components/indicador/indicador-card'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Panel</h1>
        <p className="text-sm text-muted-foreground">Resumen del día.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <IndicadorCard titulo="Presentes ahora" valor="18 de 24" detalle="75% de asistencia" Icon={Users} />
        <IndicadorCard titulo="Atrasos hoy" valor="3" detalle="máximo 20 minutos" Icon={Clock} />
        <IndicadorCard titulo="Horas pagables" valor="Gs. 8.450.000" detalle="semana en curso" Icon={Banknote} />
      </div>
    </div>
  )
}
