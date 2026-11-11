import { redirect } from 'next/navigation'

// Facturación quedó fusionada dentro de Ingresos (XML + cobros + saldos).
export default function FacturacionPage() {
  redirect('/dashboard/ingresos')
}
