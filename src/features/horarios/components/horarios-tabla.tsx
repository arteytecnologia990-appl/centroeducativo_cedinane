import { DIAS } from '@/features/horarios/schemas'
import type { Horario, PersonaOpcion } from '@/features/horarios/queries'
import { eliminarHorario } from '@/features/horarios/actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

function etiquetaDia(dia: number) {
  return DIAS.find((d) => Number(d.valor) === dia)?.etiqueta ?? `Día ${dia}`
}

function hora(valor: string) {
  return valor.slice(0, 5)
}

export function HorariosTabla({
  horarios,
  personas,
  mostrarPersona,
}: {
  horarios: Horario[]
  personas: PersonaOpcion[]
  mostrarPersona: boolean
}) {
  const nombre = new Map(personas.map((p) => [p.id, `${p.apellidos}, ${p.nombres}`]))

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            {mostrarPersona ? <TableHead>Persona</TableHead> : null}
            <TableHead>Día</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Actividad</TableHead>
            <TableHead>Aula</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {horarios.map((h) => (
            <TableRow key={h.id}>
              {mostrarPersona ? <TableCell className="font-medium">{nombre.get(h.persona_id) ?? '—'}</TableCell> : null}
              <TableCell>{etiquetaDia(h.dia_semana)}</TableCell>
              <TableCell className="tabular-nums">
                {hora(h.hora_inicio)}–{hora(h.hora_fin)}
              </TableCell>
              <TableCell>{h.actividad ?? '—'}</TableCell>
              <TableCell>{h.aula ?? '—'}</TableCell>
              <TableCell>
                <form action={eliminarHorario}>
                  <input type="hidden" name="id" value={h.id} />
                  <button
                    type="submit"
                    className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                  >
                    Eliminar
                  </button>
                </form>
              </TableCell>
            </TableRow>
          ))}
          {horarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={mostrarPersona ? 6 : 5} className="h-24 text-center text-sm text-muted-foreground">
                No hay horarios cargados.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  )
}
