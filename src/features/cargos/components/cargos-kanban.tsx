'use client'

import { useState, useTransition } from 'react'
import {
  Building2,
  Check,
  ChevronRight,
  EllipsisVertical,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { crearCargo, editarCargo, eliminarCargo, moverCargo, toggleCargo } from '@/features/cargos/cargos'

type Cargo = {
  id: string
  nombre: string
  descripcion: string | null
  programa_id: string | null
  parent_id: string | null
  orden: number
  activo: boolean
}
type Programa = { id: string; nombre: string }

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export function CargosKanban({ cargos, programas }: { cargos: Cargo[]; programas: Programa[] }) {
  const [menu, setMenu] = useState<string | null>(null)
  const [editando, setEditando] = useState<Cargo | null>(null)
  const [sobre, setSobre] = useState<string | null>(null)
  const [arrastrando, setArrastrando] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const columnas = [
    ...programas.map((p) => ({ id: p.id, nombre: p.nombre })),
    { id: '', nombre: 'Sin programa' },
  ]

  const raices = (programaId: string) =>
    cargos.filter(
      (c) =>
        (c.programa_id ?? '') === programaId &&
        (!c.parent_id || !cargos.some((p) => p.id === c.parent_id))
    )
  const hijosDe = (parentId: string) => cargos.filter((c) => c.parent_id === parentId)

  function soltar(e: React.DragEvent, programaId: string, parentId: string | null) {
    e.preventDefault()
    e.stopPropagation()
    setSobre(null)
    setArrastrando(null)
    const id = e.dataTransfer.getData('text/plain')
    if (!id || id === parentId) return
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', id)
      fd.set('programa_id', programaId)
      fd.set('parent_id', parentId ?? '')
      await moverCargo(fd)
    })
  }

  function alternarActivo(cargo: Cargo) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', cargo.id)
      await toggleCargo(fd)
    })
  }

  function Nodo({ cargo, nivel }: { cargo: Cargo; nivel: number }) {
    const hijos = hijosDe(cargo.id)
    return (
      <div className="space-y-2">
        <article
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', cargo.id)
            e.dataTransfer.effectAllowed = 'move'
            setArrastrando(cargo.id)
          }}
          onDragEnd={() => setArrastrando(null)}
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setSobre(`nodo-${cargo.id}`)
          }}
          onDragLeave={() => setSobre((s) => (s === `nodo-${cargo.id}` ? null : s))}
          onDrop={(e) => soltar(e, cargo.programa_id ?? '', cargo.id)}
          className={`group relative cursor-grab rounded-xl border bg-background/60 p-3 transition-all active:cursor-grabbing ${
            sobre === `nodo-${cargo.id}` ? 'border-primary/70 bg-primary/10' : 'border-border/60 hover:border-primary/40'
          } ${arrastrando === cargo.id ? 'opacity-40' : ''}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-start gap-1.5">
              <GripVertical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/50" />
              <div className="min-w-0">
                <h3 className="truncate text-sm font-medium text-foreground">{cargo.nombre}</h3>
                {cargo.descripcion ? (
                  <p className="truncate text-xs text-muted-foreground">{cargo.descripcion}</p>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              aria-label="Acciones"
              onClick={() => setMenu(menu === cargo.id ? null : cargo.id)}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <EllipsisVertical className="size-4" />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              title={cargo.activo ? 'Clic para inactivar' : 'Clic para activar'}
              onClick={() => alternarActivo(cargo)}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                cargo.activo
                  ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
              }`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {cargo.activo ? 'Activo' : 'Inactivo'}
            </button>
            {hijos.length > 0 ? (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                <ChevronRight className="size-3" />
                {hijos.length}
              </span>
            ) : null}
            {nivel > 0 ? <span className="text-[10px] text-muted-foreground">Nivel {nivel + 1}</span> : null}
          </div>

          {menu === cargo.id ? (
            <div className="absolute right-2 top-10 z-30 w-56 rounded-xl border border-border bg-popover p-1 shadow-xl">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Mover a
              </p>
              {columnas
                .filter((x) => x.id !== (cargo.programa_id ?? ''))
                .map((x) => (
                  <form key={x.id || 'sin'} action={moverCargo}>
                    <input type="hidden" name="id" value={cargo.id} />
                    <input type="hidden" name="programa_id" value={x.id} />
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-foreground hover:bg-accent"
                    >
                      {x.id === '' ? <Check className="size-3.5" /> : <Building2 className="size-3.5" />}
                      {x.nombre}
                    </button>
                  </form>
                ))}
              {cargo.parent_id ? (
                <form action={moverCargo}>
                  <input type="hidden" name="id" value={cargo.id} />
                  <input type="hidden" name="programa_id" value={cargo.programa_id ?? ''} />
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-foreground hover:bg-accent"
                  >
                    <ChevronRight className="size-3.5 -rotate-90" /> Subir a raíz
                  </button>
                </form>
              ) : null}
              <hr className="my-1 border-border" />
              <button
                type="button"
                onClick={() => {
                  setEditando(cargo)
                  setMenu(null)
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-foreground hover:bg-accent"
              >
                <Pencil className="size-3.5" /> Editar
              </button>
              <form action={eliminarCargo}>
                <input type="hidden" name="id" value={cargo.id} />
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-3.5" /> Eliminar
                </button>
              </form>
            </div>
          ) : null}
        </article>

        {hijos.length > 0 ? (
          <div className="ml-4 space-y-2 border-l border-border/60 pl-2">
            {hijos.map((h) => (
              <Nodo key={h.id} cargo={h} nivel={nivel + 1} />
            ))}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {columnas.map((col) => {
        const roots = raices(col.id)
        return (
          <section
            key={col.id || 'sin'}
            onDragOver={(e) => {
              e.preventDefault()
              setSobre(col.id)
            }}
            onDragLeave={() => setSobre((s) => (s === col.id ? null : s))}
            onDrop={(e) => soltar(e, col.id, null)}
            className={`flex flex-col rounded-2xl border bg-card/70 p-4 shadow-sm backdrop-blur-sm transition-colors ${
              sobre === col.id ? 'border-primary/60 bg-primary/5' : 'border-border/60'
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-lg bg-primary/10 p-1.5 text-primary">
                <Building2 className="size-4" />
              </span>
              <h2 className="truncate font-heading text-sm font-semibold text-foreground">{col.nombre}</h2>
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                {cargos.filter((c) => (c.programa_id ?? '') === col.id).length}
              </span>
            </div>

            <div className="flex-1 space-y-2">
              {roots.map((c) => (
                <Nodo key={c.id} cargo={c} nivel={0} />
              ))}
              {roots.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border/70 py-5 text-center text-xs text-muted-foreground">
                  Sin cargos todavía.
                </p>
              ) : null}
            </div>

            <form action={crearCargo} className="mt-3">
              <input type="hidden" name="programa_id" value={col.id} />
              <label className="flex h-8 items-center gap-1.5 rounded-lg border border-dashed border-border/70 px-2.5 text-xs text-muted-foreground transition-colors focus-within:border-primary hover:border-primary/50 hover:text-primary">
                <Plus className="size-3.5" />
                <input
                  name="nombre"
                  required
                  placeholder="Agregar cargo…"
                  className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                />
              </label>
            </form>
          </section>
        )
      })}

      {editando ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setEditando(null)}
        >
          <form
            action={editarCargo}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm space-y-3 rounded-2xl border border-border bg-card p-4 shadow-2xl"
          >
            <input type="hidden" name="id" value={editando.id} />
            <h3 className="font-heading font-semibold text-foreground">Editar cargo</h3>
            <input name="nombre" defaultValue={editando.nombre} required className={claseInput} />
            <input
              name="descripcion"
              defaultValue={editando.descripcion ?? ''}
              placeholder="Descripción"
              className={claseInput}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditando(null)}
                className="inline-flex h-8 items-center justify-center rounded-md border border-input px-3 text-sm text-muted-foreground hover:bg-accent"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
