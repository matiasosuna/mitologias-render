# Gasto de Modal del mes en la cuenta de las claves MODAL_TOKEN_* (Myths: "familia" = renders, "osuna-devs" = voz; tope propio USD 29 c/u).
# Imprime el gasto en USD. Uso (Actions): python scripts/modal-gasto.py  → "12.34"
import datetime as d

import modal.billing as b

hoy = d.datetime.now(d.timezone.utc)
print(f"{sum(float(x['cost']) for x in b.workspace_billing_report(start=d.datetime(hoy.year, hoy.month, 1, tzinfo=d.timezone.utc))):.2f}")
