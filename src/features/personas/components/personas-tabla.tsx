import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ETIQUETA_ROL, type RolNegocio } from '@/features/personas/schemas/persona'
import type { PersonaListado } from '@/features/personas/queries/personas'

export function PersonasTabla({ personas }: { personas: PersonaListado[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Persona</TableHead>
            <TableHead>Cédula</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Roles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personas.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">
                <Link href={`/personas/${p.id}`} className="hover:underline">
                  {p.apellidos}, {p.nombres}
                </Link>
              </TableCell>
              <TableCell className="tabular-nums">{p.ci ?? '—'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{p.email ?? p.telefono ?? '—'}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {(p.persona_roles ?? []).map((r) => (
                    <Badge key={r.rol_negocio} variant="secondary">
                      {ETIQUETA_ROL[r.rol_negocio as RolNegocio] ?? r.rol_negocio}
                    </Badge>
                  ))}
                  {(p.persona_roles ?? []).length === 0 ? (
                    <span className="text-xs text-muted-foreground">—</span>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {personas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-sm text-muted-foreground">
                No hay personas que coincidan con la búsqueda.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  )
}
