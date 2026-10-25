import { logout } from '@/lib/auth/actions'
import { LogOut } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { Button } from '@/components/ui/button'
import { SedeSelector } from './sede-selector'
import { Saludo } from './saludo'

/** Cabecera fija: saludo con fecha/hora + selector de sede + cierre de sesión + estilo. */
export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <div className="min-w-0 flex-1">
        <Saludo />
      </div>
      <SedeSelector />
      <form action={logout}>
        <Button type="submit" variant="ghost" size="icon" aria-label="Cerrar sesión">
          <LogOut className="size-4" />
        </Button>
      </form>
      <ThemeSwitcher />
    </header>
  )
}
