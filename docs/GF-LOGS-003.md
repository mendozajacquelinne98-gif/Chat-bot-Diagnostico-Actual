# GF-LOGS-003: Análisis de Secuencia de Potencia Primaria y ADM1266

## 1. Filtrado de Logs (Radix & Carrot)
*   Utilizar la herramienta **Radix** para identificar síntomas generales de falla y filtrar los logs de la plataforma **Carrot**.
*   Filtrar específicamente por palabras clave de estado para fallas de ASIC:
    *   `CM_DONE` (Secuencia completada con éxito).
    *   `CM_ERROR` (Indica falla de comunicación o alimentación en el módulo ASIC).

## 2. ADM1266 Blackbox Dump
Cuando ocurran fallas de encendido intermitentes o completas en la etapa de potencia:
1. Extraer el volcado de caja negra (**Blackbox dump**) del secuenciador ADM1266 utilizando el software de diagnóstico.
2. Analizar los voltajes registrados en:
    *   `level0` (Secuencia de voltajes primarios de entrada).
    *   `level1-sequencer-gfcX` (Secuencia de voltajes secundarios dirigidos a los ASIC).

## 3. Señal Escondida
*   **Importante:** En todos los diagnósticos de secuencia de encendido primaria, verifique siempre la señal `FAN_HSWAP_PGOOD` (línea de 54V de los ventiladores).
*   *Nota técnica:* Esta señal a menudo **se omite** en los archivos estándar de secuencia de encendido, pero un fallo en ella bloquea por completo la secuencia de los reguladores.
