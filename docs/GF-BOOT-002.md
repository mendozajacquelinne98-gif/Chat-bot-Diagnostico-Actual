# GF-BOOT-002: Diagnóstico de Secuencia de Arranque y gBMC (Ping Fail)

## 1. Síntoma de Error
*   **Código de Error:** `ping-gbmc-from-host-tray-fail`
*   **Comportamiento:** La unidad no responde al ping desde el host-tray, indicando que el gBMC (gigabit Baseboard Management Controller) no ha arrancado o su firmware está colgado.

## 2. Componentes Clave de la Cadena SPI
Para diagnosticar la falla de arranque, se debe verificar la cadena de memoria flash y controladores:
*   **U71 (Dauntless / BIOS):** Copia el firmware inicial.
*   **U19 (gBMC):** Microcontrolador del sistema de administración.
*   **U144 (Intermediario SPI / Mux):** Rutea la comunicación de datos SPI.
*   **XSKT1 (Memoria Flash Externa):** Almacena el firmware de booteo.

## 3. Secuencia de Validación Obligatoria
1.  **Firmware Copy (U71):** Confirmar que el controlador U71 copie exitosamente el firmware de la memoria física XSKT1 al **Lado B** interno del sistema.
2.  **Scratch Register Check:** Conectar la sonda I2C/SPI y verificar el **Scratch Register** para asegurar que el firmware sea detectado sin errores de firmas digitales.
3.  **Reset Signal:** Validar la liberación de la señal de reset `TITAN0_GOOD` (debe medir 1.8V en el punto de prueba TP_T0_GOOD). Si está en 0V, el U71 no ha liberado el reset.
