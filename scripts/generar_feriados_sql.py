import datetime

def easter(y):
    a = y % 19
    b = y // 100
    c = y % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = ((h + l - 7 * m + 114) % 31) + 1
    return datetime.date(y, month, day)

# Traslados oficiales 2026 reportados (La Nación 02/01/2026)
MOVES_2026 = {
    "03-01": "03-02",
    "06-20": "06-22",
    "09-29": "09-28",
}

def fila(fecha, nombre, original, movilidad, estado, nota):
    f = fecha.isoformat()
    o = original.isoformat()
    n = "null" if nota is None else "'" + nota.replace("'", "''") + "'"
    return f"  ('{f}','{nombre}','nacional','PY','{o}','{movilidad}','Ley 7544/2025','{estado}',{n})"

rows = []

for anio in range(2026, 2031):
    # Fijos (no trasladables)
    fijos = [
        (f"{anio}-01-01", "Año Nuevo"),
        (f"{anio}-05-01", "Día de los Trabajadores"),
        (f"{anio}-05-14", "Día de la Independencia Nacional"),
        (f"{anio}-05-15", "Día de la Independencia Nacional"),
        (f"{anio}-08-15", "Fundación de Asunción"),
        (f"{anio}-12-08", "Virgen de Caacupé"),
        (f"{anio}-12-25", "Navidad"),
    ]
    for f, nombre in fijos:
        d = datetime.date.fromisoformat(f)
        rows.append(fila(d, nombre, d, "fijo", "verificado", None))

    # Semana Santa
    pascua = easter(anio)
    jue = pascua - datetime.timedelta(days=3)
    vie = pascua - datetime.timedelta(days=2)
    rows.append(fila(jue, "Jueves Santo", jue, "fijo", "verificado", None))
    rows.append(fila(vie, "Viernes Santo", vie, "fijo", "verificado", None))

    # Móviles (originales)
    moviles = [
        (f"{anio}-03-01", "Día de los Héroes de la Patria"),
        (f"{anio}-06-12", "Día de la Paz del Chaco"),
        (f"{anio}-06-20", "Día de la Jura de la Constitución Nacional"),
        (f"{anio}-09-29", "Día de la Batalla de Boquerón"),
    ]
    for f, nombre in moviles:
        original = datetime.date.fromisoformat(f)
        efectiva = original
        nota = "Traslado a lunes pendiente de decreto" if anio > 2026 else None
        if anio == 2026:
            clave = f"{anio}-{f[5:]}"
            if f[5:] in MOVES_2026:
                efectiva = datetime.date.fromisoformat(f"{anio}-{MOVES_2026[f[5:]]}")
                nota = "Traslado 2026 reportado; verificar decreto"
        rows.append(fila(efectiva, nombre, original, "movil", "pendiente", nota))

sql = """-- Feriados nacionales Paraguay 2026-2030 (Ley 7544/2025)

alter table public.feriados add column if not exists pais text not null default 'PY';
alter table public.feriados add column if not exists fecha_original date;
alter table public.feriados add column if not exists movilidad text not null default 'fijo';
alter table public.feriados add column if not exists norma text;
alter table public.feriados add column if not exists estado_validacion text not null default 'pendiente';
alter table public.feriados add column if not exists updated_at timestamptz not null default now();

alter table public.feriados drop constraint if exists feriados_movilidad_check;
alter table public.feriados add constraint feriados_movilidad_check check (movilidad in ('fijo','movil'));

alter table public.feriados drop constraint if exists feriados_estado_check;
alter table public.feriados add constraint feriados_estado_check check (estado_validacion in ('pendiente','verificado','revisar'));

-- Backfill de registros existentes
update public.feriados set fecha_original = coalesce(trasladado_de, fecha) where fecha_original is null;
update public.feriados set norma = 'Ley 7544/2025' where norma is null;
update public.feriados set estado_validacion = case when validado then 'verificado' else 'pendiente' end where estado_validacion = 'pendiente';
update public.feriados set movilidad = 'movil'
  where nombre ilike '%Héroes%' or nombre ilike '%Paz del Chaco%'
     or nombre ilike '%Constitución%' or nombre ilike '%Boquerón%';

-- San Blas no figura en la Ley 7544/2025
delete from public.feriados where fecha = '2026-02-03' and nombre = 'San Blas';

-- Carga idempotente 2026-2030
insert into public.feriados
  (fecha, nombre, tipo, pais, fecha_original, movilidad, norma, estado_validacion, nota)
values
"""

sql += ",\n".join(rows)
sql += """

on conflict (fecha) do nothing;

-- Los fijos quedan verificados
update public.feriados set estado_validacion = 'verificado' where movilidad = 'fijo';
"""

with open("supabase/migrations/20261020200000_feriados_2026_2030.sql", "w", encoding="utf-8") as f:
    f.write(sql)

print("filas:", len(rows))
print(sql[:800])
