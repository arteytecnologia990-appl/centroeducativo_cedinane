'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  Banknote,
  CalendarRange,
  ChevronDown,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Landmark,
  Monitor,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Item = { href: string; label: string; Icon: LucideIcon; pronto?: boolean }
type Grupo = { id: string; label: string; items: Item[] }

const GRUPOS: Grupo[] = [
  {
    id: 'inicio',
    label: 'Inicio',
    items: [{ href: '/dashboard', label: 'Panel', Icon: GraduationCap }],
  },
  {
    id: 'personas',
    label: 'Personas',
    items: [{ href: '/dashboard/personas', label: 'Personas', Icon: Users }],
  },
  {
    id: 'talento',
    label: 'Talento Humano',
    items: [
      { href: '/dashboard/horarios', label: 'Horarios', Icon: CalendarRange },
      { href: '/dashboard/asistencia', label: 'Asistencia', Icon: ClipboardCheck },
      { href: '/kiosco-asistencia', label: 'Kiosco', Icon: Monitor },
      { href: '/dashboard/horas-pagables', label: 'Horas pagables', Icon: Banknote },
    ],
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    items: [
      { href: '/dashboard/clientes', label: 'Ingresos', Icon: Wallet, pronto: true },
      { href: '/dashboard/caja', label: 'Caja', Icon: Landmark, pronto: true },
      { href: '/dashboard/egresos', label: 'Egresos', Icon: Receipt, pronto: true },
      { href: '/dashboard/facturacion', label: 'Facturación', Icon: FileText, pronto: true },
    ],
  },
  {
    id: 'sistema',
    label: 'Sistema',
    items: [
      { href: '/dashboard/configuracion', label: 'Configuración', Icon: Settings, pronto: true },
      { href: '/dashboard/seguridad', label: 'Seguridad', Icon: ShieldCheck, pronto: true },
      { href: '/dashboard/auditoria', label: 'Auditoría', Icon: ScrollText, pronto: true },
    ],
  },
]

const MOVIL: Item[] = [
  { href: '/dashboard', label: 'Inicio', Icon: GraduationCap },
  { href: '/dashboard/personas', label: 'Personas', Icon: Users },
  { href: '/dashboard/horarios', label: 'Horarios', Icon: CalendarRange },
  { href: '/dashboard/asistencia', label: 'Asistencia', Icon: ClipboardCheck },
  { href: '/kiosco-asistencia', label: 'Kiosco', Icon: Monitor },
]

function esActivo(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function ItemLink({ item, activo }: { item: Item; activo: boolean }) {
  if (item.pronto) {
    return (
      <span className="flex cursor-not-allowed items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground/60">
        <item.Icon className="size-4" />
        {item.label}
        <span className="ml-auto rounded bg-muted px-1 py-0.5 text-[10px] font-medium uppercase tracking-wide">
          Pronto
        </span>
      </span>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        activo
          ? 'bg-accent font-medium text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <item.Icon className="size-4" />
      {item.label}
    </Link>
  )
}

/** Sidebar agrupado por áreas (colapsable) + barra inferior en móvil. */
export function AppSidebar() {
  const pathname = usePathname()

  const grupoActivo = useMemo(
    () => GRUPOS.find((g) => g.items.some((i) => !i.pronto && esActivo(pathname, i.href)))?.id,
    [pathname]
  )

  const [abiertos, setAbiertos] = useState<string[]>(() =>
    GRUPOS.filter((g) => g.items.length > 1 && g.id === grupoActivo).map((g) => g.id)
  )

  function toggle(id: string) {
    setAbiertos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <>
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4 font-heading font-semibold text-foreground">
          Centro Educativo
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {GRUPOS.map((grupo) => {
            if (grupo.items.length === 1) {
              const item = grupo.items[0]
              return <ItemLink key={item.href} item={item} activo={esActivo(pathname, item.href)} />
            }

            const abierto = abiertos.includes(grupo.id)
            return (
              <div key={grupo.id} className="pt-1">
                <button
                  type="button"
                  onClick={() => toggle(grupo.id)}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                >
                  {grupo.label}
                  <ChevronDown className={cn('size-3.5 transition-transform', !abierto && '-rotate-90')} />
                </button>
                {abierto ? (
                  <div className="space-y-0.5 pb-1 pl-2">
                    {grupo.items.map((item) => (
                      <ItemLink key={item.href} item={item} activo={esActivo(pathname, item.href)} />
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card md:hidden">
        {MOVIL.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors',
              esActivo(pathname, href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </nav>
    </>
  )
}
