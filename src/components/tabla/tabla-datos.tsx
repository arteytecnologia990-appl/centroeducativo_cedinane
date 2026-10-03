'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge, type EstadoAsistencia } from '@/components/estado/status-badge'

type Fila = { nombre: string; ci: string; hora: string; estado: EstadoAsistencia; minutos?: number }

const FILAS: Fila[] = [
  { nombre: 'Laura Benítez', ci: '3.456.789', hora: '07:58', estado: 'a_tiempo' },
  { nombre: 'Marcos Rojas', ci: '4.123.456', hora: '08:12', estado: 'atraso', minutos: 12 },
  { nombre: 'Ana Giménez', ci: '2.987.654', hora: '07:59', estado: 'a_tiempo' },
  { nombre: 'Jorge Duarte', ci: '5.210.111', hora: '—', estado: 'sin_marcar' },
  { nombre: 'Carla Ayala', ci: '1.654.320', hora: '08:00', estado: 'turno_completo' },
  { nombre: 'Diego Insfrán', ci: '6.789.012', hora: '08:20', estado: 'atraso', minutos: 20 },
]

/** Tabla de datos con buscador, paginación (demo) y badges de estado. */
export function TablaDatos() {
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(0)
  const POR_PAGINA = 5

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return FILAS
    return FILAS.filter(
      (f) => f.nombre.toLowerCase().includes(q) || f.ci.replaceAll('.', '').includes(q.replaceAll('.', ''))
    )
  }, [busqueda])

  const visibles = filtradas.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA)

  return (
    <div className="space-y-3">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value)
            setPagina(0)
          }}
          placeholder="Buscar por nombre o cédula"
          className="pl-8"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Persona</TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead>Marcación</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibles.map((f) => (
              <TableRow key={f.ci}>
                <TableCell className="font-medium">{f.nombre}</TableCell>
                <TableCell className="tabular-nums">{f.ci}</TableCell>
                <TableCell className="tabular-nums">{f.hora}</TableCell>
                <TableCell>
                  <StatusBadge estado={f.estado} minutos={f.minutos} />
                </TableCell>
              </TableRow>
            ))}
            {visibles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-sm text-muted-foreground">
                  Sin resultados para la búsqueda.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground tabular-nums">
          Mostrando {visibles.length} de {filtradas.length}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={pagina === 0} onClick={() => setPagina((p) => p - 1)}>
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={(pagina + 1) * POR_PAGINA >= filtradas.length}
            onClick={() => setPagina((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
