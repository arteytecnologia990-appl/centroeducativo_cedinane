import json

import openpyxl

wb = openpyxl.load_workbook("docs/COLABORADORES.xlsx", data_only=True)
nombre = "Datos del Personal"
ws = wb[nombre]

# detectar fila de encabezado: la que tenga más celdas de texto no vacías (filas 1..5)
mejor_fila, mejor_conteo = 1, -1
for r in range(1, min(6, ws.max_row) + 1):
    conteo = 0
    for c in range(1, ws.max_column + 1):
        v = ws.cell(row=r, column=c).value
        if isinstance(v, str) and v.strip():
            conteo += 1
    if conteo > mejor_conteo:
        mejor_fila, mejor_conteo = r, conteo

headers = []
for c in range(1, ws.max_column + 1):
    v = ws.cell(row=mejor_fila, column=c).value
    headers.append(str(v).strip() if v is not None else "")

filas = []
for r in range(mejor_fila + 1, ws.max_row + 1):
    vals = [ws.cell(row=r, column=c).value for c in range(1, ws.max_column + 1)]
    if all(v in (None, "") for v in vals):
        continue
    fila = {}
    for i, h in enumerate(headers):
        fila[h or f"col_{i + 1}"] = vals[i] if i < len(vals) else None
    filas.append(fila)

resultado = {
    "hoja": nombre,
    "dimensiones": ws.dimensions,
    "fila_encabezado": mejor_fila,
    "columnas": headers,
    "cantidad_filas_datos": len(filas),
    "filas": filas,
}

with open("docs/_inspect_datos.json", "w", encoding="utf-8") as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2, default=str)

print("OK: docs/_inspect_datos.json")
print("Encabezado en fila", mejor_fila, "| columnas:", len(headers), "| filas de datos:", len(filas))
