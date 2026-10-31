'use client'

import { useState } from 'react'
import { Building2, Check, EllipsisVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { crearCargo, editarCargo, eliminarCargo, moverCargo } from '@/features/cargos/cargos'

type Cargo = { id: string; nombre: string; descripcion: string | null; programa_id: string | null; activo: boolean }
type Programa = { id: string; nombre: string }

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export function CargosKanban({ cargos, programas }: { cargos: Cargo[]; programas: Programa[] }) {
  const [menu, setMenu] = useState<string | null>(null)
  const [editando, setEditando] = useState<Cargo | null>(null)

  const columnas = [
    ...programas.map((p) => ({ id: p.id, nombre: p.nombre, cargos: cargos.filter((c) => c.programa_id === p.id) })),
    { id: '', nombre: 'Sin programa', cargos: cargos.filter((c) => !c.programa_id) },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {columnas.map((col) => (
        <section
          key={col.id || 'sin'}
          className="flex flex-col rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm backdrop-blur-sm"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-lg bg-primary/10 p-1.5 text-primary">
              <Building2 className="size-4" />
            </span>
            <h2 className="truncate font-heading text-sm font-semibold text-foreground">{col.nombre}</h2>
            <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
              {col.cargos.length}
            </span>
          </div>

          <div className="flex-1 space-y-2">
            {col.cargos.map((c) => (
              <article
                key={c.id}
                className="relative rounded-xl border border-border/60 bg-background/60 p-3 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium text-foreground">{c.nombre}</h3>
                    {c.descripcion ? (
                      <p className="truncate text-xs text-muted-foreground">{c.descripcion}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    aria-label="Acciones"
                    onClick={() => setMenu(menu === c.id ? null : c.id)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <EllipsisVertical className="size-4" />
                  </button>
                </div>

                <span
                  className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    c.activo ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {c.activo ? 'Activo' : 'Borrador'}
                </span>

                {menu === c.id ? (
                  <div className="absolute right-2 top-10 z-20 w-56 rounded-xl border border-border bg-popover p-1 shadow-xl">
                    <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Mover a
                    </p>
                    {columnas
                      .filter((x) => x.id !== (c.programa_id ?? ''))
                      .map((x) => (
                        <form key={x.id || 'sin'} action={moverCargo}>
                          <input type="hidden" name="id" value={c.id} />
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
                    <hr className="my-1 border-border" />
                    <button
                      type="button"
                      onClick={() => {
                        setEditando(c)
                        setMenu(null)
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-foreground hover:bg-accent"
                    >
                      <Pencil className="size-3.5" /> Editar
                    </button>
                    <form action={eliminarCargo}>
                      <input type="hidden" name="id" value={c.id} />
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
            ))}

            {col.cargos.length === 0 ? (
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
      ))}

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
