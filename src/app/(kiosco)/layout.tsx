export default function KioscoLayout({ children }: { children: React.ReactNode }) {
  // El kiosco es público y usa el estilo/modo de la sede (no la preferencia personal).
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">{children}</div>
  )
}
