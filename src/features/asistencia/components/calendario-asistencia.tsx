'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronLeft, ChevronRight, Download, Eraser, Loader2, X } from 'lucide-react'
import { guardarCalendario } from '@/features/asistencia/actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Persona = { id: string; nombres: string; apellidos: string }
type Estado = 'presente' | 'ausente'

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const claseSelect =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export function CalendarioAsistencia({
  personas,
  personaId,
  mes,
  inicial,
  horariosPorDia,
  feriados,
}: {
  personas: Persona[]
  personaId: string
  mes: string
  inicial: Record<string, Estado>
  horariosPorDia: Record<number, { inicio: string; fin: string }>
  feriados: Record<string, string>
}) {
  const router = useRouter()
  const [estados, setEstados] = useState<Record<string, Estado>>(inicial)
  const [pending, setPending] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const [anio, mesNum] = mes.split('-').map(Number)
  const totalDias = new Date(anio, mesNum, 0).getDate()
  const offset = (new Date(anio, mesNum - 1, 1).getDay() + 6) % 7
  const dias = Array.from({ length: totalDias }, (_, i) => i + 1)
  const tieneHorario = Object.keys(horariosPorDia).length > 0

  const fechaDe = (dia: number) => `${anio}-${String(mesNum).padStart(2, '0')}-${String(dia).padStart(2, '0')}`

  function irA(nuevoMes: string) {
    router.push(`/dashboard/asistencia/calendario?persona_id=${personaId}&mes=${nuevoMes}`)
  }

  function cambiarPersona(id: string) {
    // Recordar la última persona elegida para que al volver aparezca la misma.
    document.cookie = `calendario_persona=${id}; path=/; max-age=31536000; samesite=lax`
    router.push(`/dashboard/asistencia/calendario?persona_id=${id}&mes=${mes}`)
  }

  function moverMes(delta: number) {
    const d = new Date(anio, mesNum - 1 + delta, 1)
    irA(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  function toggle(dia: number) {
    const f = fechaDe(dia)
    setEstados((prev) => {
      const actual = prev[f]
      if (actual === undefined) return { ...prev, [f]: 'presente' }
      if (actual === 'presente') return { ...prev, [f]: 'ausente' }
      const copia = { ...prev }
      delete copia[f]
      return copia
    })
    setMsg(null)
  }

  function marcarTodos(estado: Estado | null) {
    if (estado === null) {
      setEstados({})
      return
    }
    const nuevo: Record<string, Estado> = {}
    for (const d of dias) nuevo[fechaDe(d)] = estado
    setEstados(nuevo)
  }

  async function guardar() {
    setPending(true)
    setMsg(null)
    const marcas = dias.map((d) => ({ fecha: fechaDe(d), estado: estados[fechaDe(d)] ?? null }))
    const fd = new FormData()
    fd.set('persona_id', personaId)
    fd.set('marcas', JSON.stringify(marcas))
    const r = await guardarCalendario(fd)
    if (r?.error) {
      setMsg(r.error)
    } else if ((r?.sinHorario ?? 0) > 0) {
      setMsg(`Guardado. ${r!.sinHorario} día(s) sin horario asignado: se marcaron sin hora.`)
    } else {
      setMsg('Guardado ✓')
    }
    setPending(false)
    if (!r?.error) router.refresh()
  }

  function exportarCSV() {
    const persona = personas.find((p) => p.id === personaId)
    const lineas = ['Fecha,Dia,Estado']
    for (const d of dias) {
      const f = fechaDe(d)
      const fecha = new Date(anio, mesNum - 1, d)
      const dia = DIAS[(fecha.getDay() + 6) % 7]
      lineas.push(`${f},${dia},${estados[f] ?? ''}`)
    }
    const blob = new Blob([lineas.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `asistencia-${persona?.apellidos ?? 'persona'}-${mes}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const presentes = Object.values(estados).filter((e) => e === 'presente').length
  const ausentes = Object.values(estados).filter((e) => e === 'ausente').length
  const totalMarcados = presentes + ausentes
  const pct = totalMarcados > 0 ? Math.round((presentes / totalMarcados) * 100) : 0

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-56 flex-1 space-y-1.5">
          <Label htmlFor="persona">Persona</Label>
          <select
            id="persona"
            value={personaId}
            onChange={(e) => cambiarPersona(e.target.value)}
            className={claseSelect}
          >
            {personas.length === 0 ? <option value="">Sin personas</option> : null}
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombres} {p.apellidos}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-1">
          <Button type="button" variant="outline" className="size-8 px-0" onClick={() => moverMes(-1)} aria-label="Mes anterior">
            <ChevronLeft className="size-4" />
          </Button>
          <input
            type="month"
            value={mes}
            onChange={(e) => irA(e.target.value)}
            className={claseSelect}
          />
          <Button type="button" variant="outline" className="size-8 px-0" onClick={() => moverMes(1)} aria-label="Mes siguiente">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => marcarTodos('presente')}>
          <Check className="mr-1 size-4 text-success" /> Todo asistió
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => marcarTodos('ausente')}>
          <X className="mr-1 size-4 text-destructive" /> Todo faltó
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => marcarTodos(null)}>
          <Eraser className="mr-1 size-4" /> Limpiar mes
        </Button>
      </div>

      {!tieneHorario ? (
        <div role="alert" className="rounded-md bg-warning-soft px-3 py-2 text-sm text-warning">
          Esta persona <strong>no tiene horario asignado</strong>. Las asistencias se marcarán sin hora.
          Cargá su horario en <strong>Horarios</strong>.
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border border-border p-3">
          <div className="text-xs text-muted-foreground">Asistencias</div>
          <div className="text-2xl font-semibold text-success">{presentes}</div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="text-xs text-muted-foreground">Ausencias</div>
          <div className="text-2xl font-semibold text-destructive">{ausentes}</div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="text-xs text-muted-foreground">% Asistencia</div>
          <div className="text-2xl font-semibold">{pct}%</div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-3">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {DIAS.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`vacio-${i}`} />
          ))}
          {dias.map((dia) => {
            const estado = estados[fechaDe(dia)]
            const iso = ((new Date(anio, mesNum - 1, dia).getDay() + 6) % 7) + 1
            const span = horariosPorDia[iso]
            const feriado = feriados[fechaDe(dia)]
            return (
              <button
                key={dia}
                type="button"
                onClick={() => toggle(dia)}
                aria-label={`Día ${dia}: ${estado ?? 'sin marcar'}${span ? `, horario ${span.inicio.slice(0, 5)} a ${span.fin.slice(0, 5)}` : ', sin horario'}${feriado ? `, feriado: ${feriado}` : ''}`}
                title={`${span ? `Horario: ${span.inicio.slice(0, 5)} a ${span.fin.slice(0, 5)}` : 'Sin horario asignado'}${feriado ? ` · FERIADO: ${feriado}` : ''}`}
                className={cn(
                  'flex h-12 flex-col items-center justify-center rounded-md text-sm font-medium leading-tight transition-colors',
                  estado === 'presente' && 'bg-success text-white',
                  estado === 'ausente' && 'bg-destructive text-white',
                  !estado && 'bg-muted text-muted-foreground hover:bg-accent',
                  feriado && 'ring-2 ring-warning'
                )}
              >
                <span>{dia}</span>
                {span ? <span className="text-[9px] opacity-80">{span.inicio.slice(0, 5)}</span> : null}
              </button>
            )
          })}
        </div>
        {Object.keys(feriados).length > 0 ? (
          <p className="mt-2 text-xs text-warning">
            Feriados del mes:{' '}
            {Object.entries(feriados)
              .map(([f, nombre]) => `${f.slice(8)}/${f.slice(5, 7)} ${nombre}`)
              .join(' · ')}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={guardar} disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" /> Guardando…
            </>
          ) : (
            'Guardar'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={exportarCSV}>
          <Download className="mr-1 size-4" /> Exportar CSV
        </Button>
        {msg ? <span className="text-sm text-muted-foreground">{msg}</span> : null}
      </div>
    </div>
  )
}
