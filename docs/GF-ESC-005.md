# GF-ESC-005: Protocolo de Escalación Técnica Ghostfish

## 1. Propósito
Garantizar la rotación rápida de las unidades y evitar cuellos de botella en las estaciones de diagnóstico ante fallas complejas ("Hard Debug") o retrasos mayores al tiempo objetivo (Takt Time).

## 2. Cadena de Escalación Obligatoria
Ante cualquier duda de diagnóstico o si una unidad supera 45 minutos en la estación, el técnico debe seguir estrictamente la siguiente jerarquía:

1.  **Técnico Asignado:** Realiza el diagnóstico básico, mediciones iniciales de voltajes y consulta la base de datos.
2.  **Debug Technician (Técnico de Debug):** Especialista en seguimiento de señales lógicas e interpretación de logs.
3.  **Hard Debug Technician:** Técnico senior enfocado en fallas físicas de múltiples capas y osciloscopio avanzado.
4.  **FA Technician (Análisis de Falla):** Experto en rayos X, microscopía y soldabilidad.
5.  **Leader (Líder de Línea):** Coordina los recursos y prioridades de retrabajo.
6.  **FA & BPY Engineers (Ingenieros de Análisis de Fallas e Ingeniería de Procesos):** Deciden baja definitiva de unidades o cambios de diseño.
