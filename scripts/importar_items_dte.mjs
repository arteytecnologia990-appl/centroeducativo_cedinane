// Carga los ítems (gCamItem) de los XML DTE a factura_items
import { createClient } from '@supabase/supabase-js'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const cfg = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((l) => /^\s*[A-Za-z_][A-Za-z0-9_]*=/.test(l))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const supabase = createClient(cfg.NEXT_PUBLIC_SUPABASE_URL, cfg.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const dir = resolve('.')
const xmls = readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.xml'))
console.log('XMLs encontrados:', xmls.length)

const get = (bloque, tag) => {
  const m = bloque.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))
  return m ? m[1].trim() : null
}

let totales = 0
for (const file of xmls) {
  const cdc = file.replace(/\.xml$/i, '')
  const xml = readFileSync(resolve(dir, file), 'utf8')
  const bloques = [...xml.matchAll(/<gCamItem>([\s\S]*?)<\/gCamItem>/g)].map((m) => m[1])
  const items = bloques.map((b, i) => ({
    factura_cdc: cdc,
    descripcion: get(b, 'dDesProSer') ?? '—',
    cantidad: Number(get(b, 'dCantProSer') ?? 0),
    precio_unitario: Number(get(b, 'dPUniProSer') ?? 0),
    base_gravada: Number(get(b, 'dBasGravIVA') ?? 0),
    iva: Number(get(b, 'dLiqIVAItem') ?? 0),
    orden: i + 1,
  }))

  const { error: errDel } = await supabase.from('factura_items').delete().eq('factura_cdc', cdc)
  if (errDel) console.log('  del:', errDel.message)

  if (items.length === 0) {
    console.log(`${cdc}: sin ítems`)
    continue
  }

  const { error } = await supabase.from('factura_items').insert(items)
  if (error) console.log(`  error ${cdc}:`, error.message)
  else {
    console.log(`${cdc}: ${items.length} ítem(s)`)
    totales += items.length
  }
}

console.log('Total ítems cargados:', totales)
