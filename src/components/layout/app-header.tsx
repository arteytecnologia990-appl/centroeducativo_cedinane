import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { SedeSelector } from './sede-selector'

/** Cabecera: selector de sede + conmutador de estilo/modo. */
export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <div className="flex-1">
        <SedeSelector />
      </div>
      <ThemeSwitcher />
    </header>
  )
}
