# GF-HW-006: Mejores Prácticas de Rework y Seguridad ESD

## 1. Seguridad ESD (Electrostatic Discharge)
*   **Mandatorio:** El uso de pulsera antiestática con resistencia integrada de **1 MOhm** en todo momento dentro del área de diagnóstico.
*   **Verificación:** La pulsera debe ser probada al inicio del turno en la estación de verificación ESD.

## 2. Inspección AXI (Automated X-Ray Inspection)
*   Para diagnosticar soldadura defectuosa oculta bajo los encapsulados BGA de los ASIC o VPWR, se debe utilizar el sistema de rayos X **SCP (Solo para unidades Ghostfish)**.
*   El SCP genera imágenes de alta calidad para analizar vacíos (voids), puentes o soldadura abierta.

## 3. Retrabajo (Rework) de Componentes
*   Todas las operaciones de desoldado y soldado deben apegarse estrictamente a la norma **IPC-7711/7721**.
*   **Método Bridge Fill:** Para la remoción y soldadura de componentes lógicos de tipo *Gull Wing* (alas de gaviota, como memorias o compuertas lógicas de varios pines), utilice el método de puente de soldadura y malla desoldadora.
