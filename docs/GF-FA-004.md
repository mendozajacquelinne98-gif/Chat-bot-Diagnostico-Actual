# GF-FA-004: Árbol de Decisión para Fallas Desconocidas

## 1. Protocolo ante Síntoma No Identificado
Si al ingresar la unidad de PCBA al área de pruebas se presenta un código de error del tipo `unexpected-exception` sin detalles claros en el sistema de pruebas automático:

1.  **Filtrar Log Principal:** Buscar la cadena de texto exacta `"Get IST Product Info from SFCS"`.
2.  **Comparación de Tablas de Componentes:** Extraer las tablas de identificadores de hardware desde:
    *   **TRAY** (Tablas FLG).
    *   **PCBA** (Tablas GFB).
    *   **SCP** (Tablas GFS).
3.  **Comparar vs. Unidad Golden:** Contrastar estas tablas contra los registros de una unidad de referencia (**Golden Unit**).
4.  **Identificar Discrepancias:** Buscar componentes no casados o duplicados (ejemplo típico: componentes de enfriamiento de proveedores alternos, como **BOYD** frente a **COOLER MASTER**).
5.  **Acción Correctiva:** Si se detectan errores de ruta, ID duplicado o componentes mal casados, detener la prueba y reportar inmediatamente con el **Ingeniero de Análisis de Fallas (FA)**.
