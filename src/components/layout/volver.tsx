import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/** Flecha "Volver" para navegar un paso atrás. */
export function Volver({ href, label = 'Volver' }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  )
}
