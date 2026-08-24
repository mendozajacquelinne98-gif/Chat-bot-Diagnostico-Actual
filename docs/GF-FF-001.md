# GF-FF-001: Reglas de Reemplazo ASIC y VPWR (Sistema FF)

## 1. Contexto de Ingeniería
En la etapa de potencia de las unidades Ghostfish (GF), se implementa un diseño de alimentación simétrica mediante controladores **Vertical Power (VPWR)** y circuitos **ASIC**. Para mantener la integridad térmica y perfiles eléctricos estables requeridos por el cliente, es mandatorio aplicar las reglas de espejo del Sistema FF.

## 2. Reglas Mandatorias de Reemplazo
Al realizar reparaciones de hardware en el taller de diagnóstico, el técnico y el sistema FF deben cumplir estrictamente:

*   **Baja de ASIC:** Si se da de baja o reemplaza una localidad de ASIC, el sistema FF cargará automáticamente los dos **Vertical Power (VPWR)** asociados a esa localidad. Esto es un requerimiento contractual del cliente para garantizar la entrega de potencia balanceada.
*   **Baja de Vertical Power:** Si un VPWR falla, se deben dar de baja **ambos VPWR** de la localidad debido a restricciones de perfiles, incluso si el defecto físico se presenta solo en uno de ellos.
*   **Efecto Espejo Automático:** La carga o modificación de ambos VPWR en el sistema disparará automáticamente la carga/reemplazo del **ASIC espejo** correspondiente.

## 3. Procedimiento en Sistema FF
1. Al declarar una falla en un VPWR, ingrese el ID de componente en el sistema de rastreo.
2. Confirme que el sistema marque automáticamente el segundo VPWR en estado "Pending Mirror Rework".
3. Confirme que el ASIC asociado se añada a la lista de reemplazo obligatorio.
