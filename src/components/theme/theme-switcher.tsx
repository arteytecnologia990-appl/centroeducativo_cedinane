'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, SunMoon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ESTILOS, type EstiloId } from '@/lib/tema/estilos'
import { useEstilo } from '@/lib/tema/estilo-provider'
import { sincronizarPreferencia } from '@/lib/tema/preferencias'
import { PaletaEstilo } from './paleta-estilo'

const MODOS = [
  { value: 'light', label: 'Claro', Icon: Sun },
  { value: 'dark', label: 'Oscuro', Icon: Moon },
  { value: 'system', label: 'Sistema', Icon: SunMoon },
] as const

export function ThemeSwitcher() {
  const { estilo, setEstilo } = useEstilo()
  const { theme, setTheme } = useTheme()

  function cambiarEstilo(valor: string) {
    const nuevo = valor as EstiloId
    setEstilo(nuevo)
    void sincronizarPreferencia(nuevo, theme ?? 'system')
  }

  function cambiarModo(valor: string) {
    setTheme(valor)
    void sincronizarPreferencia(estilo, valor)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Cambiar estilo y tema"
        className="inline-flex size-9 items-center justify-center gap-2 rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Sun className="size-4 dark:hidden" />
        <Moon className="size-4 hidden dark:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Estilo</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={estilo} onValueChange={cambiarEstilo}>
            {ESTILOS.map((e) => (
              <DropdownMenuRadioItem key={e.id} value={e.id}>
                <PaletaEstilo id={e.id} className="mr-1" />
                {e.nombre}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Modo</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme ?? 'system'} onValueChange={cambiarModo}>
            {MODOS.map(({ value, label, Icon }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                <Icon className="mr-1 size-4" />
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
