import Link from 'next/link'
import {
  Banknote,
  CalendarRange,
  ClipboardCheck,
  GraduationCap,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type NavItem = { href: string; label: string; Icon: LucideIcon }

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Inicio', Icon: GraduationCap },
  { href: '/dashboard/personas', label: 'Personas', Icon: Users },
  { href: '/dashboard/horarios', label: 'Horarios', Icon: CalendarRange },
  { href: '/dashboard/asistencia', label: 'Asistencia', Icon: ClipboardCheck },
  { href: '/dashboard/horas-pagables', label: 'Horas pagables', Icon: Banknote },
  { href: '/dashboard/configuracion', label: 'Configuración', Icon: Settings },
  { href: '/dashboard/seguridad', label: 'Seguridad', Icon: ShieldCheck },
]

/**
 * Navegación lateral: columna en escritorio, barra horizontal inferior en móvil.
 */
export function AppSidebar() {
  return (
    <>
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4 font-heading font-semibold text-foreground">
          Centro Educativo
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card md:hidden">
        {NAV.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </nav>
    </>
  )
}
