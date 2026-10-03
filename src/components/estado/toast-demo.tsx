'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function ToastDemo() {
  return (
    <Button variant="secondary" onClick={() => toast.success('Cambios guardados')}>
      Mostrar toast
    </Button>
  )
}
