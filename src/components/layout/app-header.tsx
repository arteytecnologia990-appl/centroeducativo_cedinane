import { logout } from '@/lib/auth/actions'
import { LogOut } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { Button } from '@/components/ui/button'
import { SedeSelector } from './sede-selector'

/** Cabecera: selector de sede + cierre de sesión + conmutador de estilo/modo. */
export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <div className="flex-1">
        <SedeSelector />
      </div>
      <form action={logout}>
        <Button type="submit" variant="ghost" size="icon" aria-label="Cerrar sesión">
          <LogOut className="size-4" />
        </Button>
      </form>
      <ThemeSwitcher />
    </header>
  )
}
