import json
from collections import Counter

data = json.load(open("docs/_inspect_datos.json", encoding="utf-8"))
filas = data["filas"]
cols = data["columnas"]


def distintos(col):
    c = Counter(str(f.get(col, "")).strip() for f in filas)
    return dict(sorted(c.items(), key=lambda kv: -kv[1]))


resumen = {
    "total": len(filas),
    "distintos": {
        c: distintos(c)
        for c in ["Cargo", "Sector", "Programa", "Turno", "Formación académica"]
    },
    "vacios": {
        c: sum(1 for f in filas if str(f.get(c) or "").strip() == "")
        for c in cols
    },
    "sin_ci": [f.get("Nombre y Apellidos:") for f in filas if not str(f.get("Número de C.I") or "").strip()],
    "con_registro": sum(1 for f in filas if str(f.get("Registro ó Matricula") or "").strip()),
    "documentos": {
        "CI": sum(1 for f in filas if str(f.get("CI") or "").strip().upper() == "X"),
        "CV": sum(1 for f in filas if str(f.get("CV") or "").strip().upper() == "X"),
        "CD": sum(1 for f in filas if str(f.get("CD") or "").strip().upper() == "X"),
    },
}

json.dump(resumen, open("docs/_resumen_datos.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("OK")
