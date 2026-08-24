/**
 * Base de Datos de Conocimiento Inicial y ConfiguraciÃ³n para el ChatBot Ghostfish
 * GENERADA AUTOMÃTICAMENTE por Update-KnowledgeBase.ps1 el 2026-08-06 17:16:48
 */

window.GF_DOCUMENTS = [
  {
    id: "GF_sn_found_verify_failed_Modificado",
    title: "GF sn found verify failed Modificado",
    category: "DocumentaciÃ³n Local / docs",
    lastUpdated: "2026-08-06",
    content: "Manual tÃ©cnico en formato PDF cargado en el sistema: GF sn_found_verify_failed_Modificado.pdf. Requiere conexiÃ³n al servidor Node.js backend para lectura completa del contenido binario.",
    photos: [

    ],
    keywords: ["found", "verify", "failed", "modificado", "local", "docs", "gf sn_found_verify_failed_modificado"]
  },
  {
    id: "GFBOOT002",
    title: "GF-BOOT-002",
    category: "DocumentaciÃ³n Local / docs",
    lastUpdated: "2026-08-06",
    content: "# GF-BOOT-002: Diagnóstico de Secuencia de Arranque y gBMC (Ping Fail)\n\n## 1. Síntoma de Error\n*   **Código de Error:** `ping-gbmc-from-host-tray-fail`\n*   **Comportamiento:** La unidad no responde al ping desde el host-tray, indicando que el gBMC (gigabit Baseboard Management Controller) no ha arrancado o su firmware está colgado.\n\n## 2. Componentes Clave de la Cadena SPI\nPara diagnosticar la falla de arranque, se debe verificar la cadena de memoria flash y controladores:\n*   **U71 (Dauntless / BIOS):** Copia el firmware inicial.\n*   **U19 (gBMC):** Microcontrolador del sistema de administración.\n*   **U144 (Intermediario SPI / Mux):** Rutea la comunicación de datos SPI.\n*   **XSKT1 (Memoria Flash Externa):** Almacena el firmware de booteo.\n\n## 3. Secuencia de Validación Obligatoria\n1.  **Firmware Copy (U71):** Confirmar que el controlador U71 copie exitosamente el firmware de la memoria física XSKT1 al **Lado B** interno del sistema.\n2.  **Scratch Register Check:** Conectar la sonda I2C/SPI y verificar el **Scratch Register** para asegurar que el firmware sea detectado sin errores de firmas digitales.\n3.  **Reset Signal:** Validar la liberación de la señal de reset `TITAN0_GOOD` (debe medir 1.8V en el punto de prueba TP_T0_GOOD). Si está en 0V, el U71 no ha liberado el reset.\n",
    photos: [

    ],
    keywords: ["boot", "002", "local", "docs", "gf-boot-002"]
  },
  {
    id: "GFESC005",
    title: "GF-ESC-005",
    category: "DocumentaciÃ³n Local / docs",
    lastUpdated: "2026-08-06",
    content: "# GF-ESC-005: Protocolo de Escalación Técnica Ghostfish\n\n## 1. Propósito\nGarantizar la rotación rápida de las unidades y evitar cuellos de botella en las estaciones de diagnóstico ante fallas complejas (\"Hard Debug\") o retrasos mayores al tiempo objetivo (Takt Time).\n\n## 2. Cadena de Escalación Obligatoria\nAnte cualquier duda de diagnóstico o si una unidad supera 45 minutos en la estación, el técnico debe seguir estrictamente la siguiente jerarquía:\n\n1.  **Técnico Asignado:** Realiza el diagnóstico básico, mediciones iniciales de voltajes y consulta la base de datos.\n2.  **Debug Technician (Técnico de Debug):** Especialista en seguimiento de señales lógicas e interpretación de logs.\n3.  **Hard Debug Technician:** Técnico senior enfocado en fallas físicas de múltiples capas y osciloscopio avanzado.\n4.  **FA Technician (Análisis de Falla):** Experto en rayos X, microscopía y soldabilidad.\n5.  **Leader (Líder de Línea):** Coordina los recursos y prioridades de retrabajo.\n6.  **FA & BPY Engineers (Ingenieros de Análisis de Fallas e Ingeniería de Procesos):** Deciden baja definitiva de unidades o cambios de diseño.\n",
    photos: [

    ],
    keywords: ["esc", "005", "local", "docs", "gf-esc-005"]
  },
  {
    id: "GFFA004",
    title: "GF-FA-004",
    category: "DocumentaciÃ³n Local / docs",
    lastUpdated: "2026-08-06",
    content: "# GF-FA-004: Árbol de Decisión para Fallas Desconocidas\n\n## 1. Protocolo ante Síntoma No Identificado\nSi al ingresar la unidad de PCBA al área de pruebas se presenta un código de error del tipo `unexpected-exception` sin detalles claros en el sistema de pruebas automático:\n\n1.  **Filtrar Log Principal:** Buscar la cadena de texto exacta `\"Get IST Product Info from SFCS\"`.\n2.  **Comparación de Tablas de Componentes:** Extraer las tablas de identificadores de hardware desde:\n    *   **TRAY** (Tablas FLG).\n    *   **PCBA** (Tablas GFB).\n    *   **SCP** (Tablas GFS).\n3.  **Comparar vs. Unidad Golden:** Contrastar estas tablas contra los registros de una unidad de referencia (**Golden Unit**).\n4.  **Identificar Discrepancias:** Buscar componentes no casados o duplicados (ejemplo típico: componentes de enfriamiento de proveedores alternos, como **BOYD** frente a **COOLER MASTER**).\n5.  **Acción Correctiva:** Si se detectan errores de ruta, ID duplicado o componentes mal casados, detener la prueba y reportar inmediatamente con el **Ingeniero de Análisis de Fallas (FA)**.\n",
    photos: [

    ],
    keywords: ["004", "local", "docs", "gf-fa-004"]
  },
  {
    id: "GFFF001",
    title: "GF-FF-001",
    category: "DocumentaciÃ³n Local / docs",
    lastUpdated: "2026-08-06",
    content: "# GF-FF-001: Reglas de Reemplazo ASIC y VPWR (Sistema FF)\n\n## 1. Contexto de Ingeniería\nEn la etapa de potencia de las unidades Ghostfish (GF), se implementa un diseño de alimentación simétrica mediante controladores **Vertical Power (VPWR)** y circuitos **ASIC**. Para mantener la integridad térmica y perfiles eléctricos estables requeridos por el cliente, es mandatorio aplicar las reglas de espejo del Sistema FF.\n\n## 2. Reglas Mandatorias de Reemplazo\nAl realizar reparaciones de hardware en el taller de diagnóstico, el técnico y el sistema FF deben cumplir estrictamente:\n\n*   **Baja de ASIC:** Si se da de baja o reemplaza una localidad de ASIC, el sistema FF cargará automáticamente los dos **Vertical Power (VPWR)** asociados a esa localidad. Esto es un requerimiento contractual del cliente para garantizar la entrega de potencia balanceada.\n*   **Baja de Vertical Power:** Si un VPWR falla, se deben dar de baja **ambos VPWR** de la localidad debido a restricciones de perfiles, incluso si el defecto físico se presenta solo en uno de ellos.\n*   **Efecto Espejo Automático:** La carga o modificación de ambos VPWR en el sistema disparará automáticamente la carga/reemplazo del **ASIC espejo** correspondiente.\n\n## 3. Procedimiento en Sistema FF\n1. Al declarar una falla en un VPWR, ingrese el ID de componente en el sistema de rastreo.\n2. Confirme que el sistema marque automáticamente el segundo VPWR en estado \"Pending Mirror Rework\".\n3. Confirme que el ASIC asociado se añada a la lista de reemplazo obligatorio.\n",
    photos: [

    ],
    keywords: ["001", "local", "docs", "gf-ff-001"]
  },
  {
    id: "GFHW006",
    title: "GF-HW-006",
    category: "DocumentaciÃ³n Local / docs",
    lastUpdated: "2026-08-06",
    content: "# GF-HW-006: Mejores Prácticas de Rework y Seguridad ESD\n\n## 1. Seguridad ESD (Electrostatic Discharge)\n*   **Mandatorio:** El uso de pulsera antiestática con resistencia integrada de **1 MOhm** en todo momento dentro del área de diagnóstico.\n*   **Verificación:** La pulsera debe ser probada al inicio del turno en la estación de verificación ESD.\n\n## 2. Inspección AXI (Automated X-Ray Inspection)\n*   Para diagnosticar soldadura defectuosa oculta bajo los encapsulados BGA de los ASIC o VPWR, se debe utilizar el sistema de rayos X **SCP (Solo para unidades Ghostfish)**.\n*   El SCP genera imágenes de alta calidad para analizar vacíos (voids), puentes o soldadura abierta.\n\n## 3. Retrabajo (Rework) de Componentes\n*   Todas las operaciones de desoldado y soldado deben apegarse estrictamente a la norma **IPC-7711/7721**.\n*   **Método Bridge Fill:** Para la remoción y soldadura de componentes lógicos de tipo *Gull Wing* (alas de gaviota, como memorias o compuertas lógicas de varios pines), utilice el método de puente de soldadura y malla desoldadora.\n",
    photos: [

    ],
    keywords: ["006", "local", "docs", "gf-hw-006"]
  },
  {
    id: "GFLOGS003",
    title: "GF-LOGS-003",
    category: "DocumentaciÃ³n Local / docs",
    lastUpdated: "2026-08-06",
    content: "# GF-LOGS-003: Análisis de Secuencia de Potencia Primaria y ADM1266\n\n## 1. Filtrado de Logs (Radix & Carrot)\n*   Utilizar la herramienta **Radix** para identificar síntomas generales de falla y filtrar los logs de la plataforma **Carrot**.\n*   Filtrar específicamente por palabras clave de estado para fallas de ASIC:\n    *   `CM_DONE` (Secuencia completada con éxito).\n    *   `CM_ERROR` (Indica falla de comunicación o alimentación en el módulo ASIC).\n\n## 2. ADM1266 Blackbox Dump\nCuando ocurran fallas de encendido intermitentes o completas en la etapa de potencia:\n1. Extraer el volcado de caja negra (**Blackbox dump**) del secuenciador ADM1266 utilizando el software de diagnóstico.\n2. Analizar los voltajes registrados en:\n    *   `level0` (Secuencia de voltajes primarios de entrada).\n    *   `level1-sequencer-gfcX` (Secuencia de voltajes secundarios dirigidos a los ASIC).\n\n## 3. Señal Escondida\n*   **Importante:** En todos los diagnósticos de secuencia de encendido primaria, verifique siempre la señal `FAN_HSWAP_PGOOD` (línea de 54V de los ventiladores).\n*   *Nota técnica:* Esta señal a menudo **se omite** en los archivos estándar de secuencia de encendido, pero un fallo en ella bloquea por completo la secuencia de los reguladores.\n",
    photos: [

    ],
    keywords: ["logs", "003", "local", "docs", "gf-logs-003"]
  },
  {
    id: "2_Arranque_Inicializacion",
    title: "2 Arranque Inicializacion",
    category: "DocumentaciÃ³n Local / ARRANQUE",
    lastUpdated: "2026-08-06",
    content: "2.- Arranque (Inicialización) Durante el arranque de la unidad y a diferencia del modelo anteriormente analizado (GLP), este se realiza en diversos pasos. En este apartado se enlistarán y analizarán cada uno de ellos. Inicialización. Durante el arranque de la unidad se podrá observar el encendido de diversos leds indicadores de diferentes procesos. Estos leds inician \"alarmados\" de color rojo. Esto es normal ya que posterior a ello, la unidad inicia de forma adecuada (siempre y cuando se haya insertado el conector de arranque en el CDFP0). [IMAGE_PLACEHOLDER_1] [IMAGE_PLACEHOLDER_2] Observando las imágenes, logramos observar que en este apartado, los led´s \"alarmados\" en rojo son correspondientes a la validación de los voltajes de cada uno de los GFCs (correspondientes a las ubicaciones LD14_X). [IMAGE_PLACEHOLDER_3] Además del encendido en rojo del led LD8 (correspondiente al BMC FAULT LED) y encendidos de color azul de los led LD9 y LD5 (correspondientes al estatus del booteo y al Heartbeat sucesivamente), se pueden observar el encendido en verde de los led LD10 (encargado de indicar el funcionamiento del HOTSWAP_A PGOOD), LD2 (encargado de indicar el funcionamiento del HOTSWAP_B PGOOD), LD6 (Indicador de la presencia del voltaje P12R0_0 PGOOD) y LD1 (Indicador de la presencia del voltaje P12R0_1 PGOOD). José Mercado.",
    photos: [
    {
      id: "2_Arranque_Inicializacion_img_1",
      url: "./images/extracted/2_Arranque_Inicializacion_img_1.jpeg",
      title: "Evidencia Visual 1 (2 Arranque Inicializacion)",
      description: "Imagen extraÃ­da del documento original: 2 Arranque Inicializacion.docx",
      type: "general",
      status: "general"
    },
    {
      id: "2_Arranque_Inicializacion_img_2",
      url: "./images/extracted/2_Arranque_Inicializacion_img_2.jpeg",
      title: "Evidencia Visual 2 (2 Arranque Inicializacion)",
      description: "Imagen extraÃ­da del documento original: 2 Arranque Inicializacion.docx",
      type: "general",
      status: "general"
    },
    {
      id: "2_Arranque_Inicializacion_img_3",
      url: "./images/extracted/2_Arranque_Inicializacion_img_3.jpeg",
      title: "Evidencia Visual 3 (2 Arranque Inicializacion)",
      description: "Imagen extraÃ­da del documento original: 2 Arranque Inicializacion.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["arranque", "inicializacion", "local", "docs", "2 arranque inicializacion"]
  },
  {
    id: "Arranque_encencido_modificado",
    title: "Arranque encencido modificado",
    category: "DocumentaciÃ³n Local / ARRANQUE",
    lastUpdated: "2026-08-06",
    content: "SINTOMAS:- No enciende la unidad- La tarjeta no responde al energizar- Solo se energiza la sección primaria- No se activan los canales secundarios- Falla en la secuencia de arranqueAREA:- Power- Arranque- Secuencia de encendidoKEYWORDS:- no power- no boot- CDFP- arranque- power sequence- no secondary rails- primary power onlyRESUMEN:El proceso de arranque depende de la correcta conexión del CDFP y de la secuencia de alimentación. Si el CDFP no está presente o la secuencia es incorrecta, únicamente se energizan los voltajes primarios y no se habilitan los canales secundarios.DIAGNOSTICO RAPIDO:- Si la unidad NO enciende: → Verificar conexión del CDFP de arranque → Validar alimentación en J1 o TRAY- Si solo hay voltajes primarios: → Confirmar que el CDFP esté insertado correctamente → Revisar secuencia de arranque- Si no hay voltajes secundarios: → Revisar habilitación de canales → Validar señales en U26_x- Si no hay respuesta al energizar: → Validar conexión física de alimentación → Revisar arnés y voltaje de entrada 1.- Encendido de la unidad SINTOMAS: - No enciende la unidad - Solo hay voltajes primarios - No activan canales secundarios - Falla en secuencia de arranque. AREA: - Power / Arranque / Secuencia . KEYWORDS: - no power - no boot - CDFP - power sequence - arranque - voltajes secundarios - primary only power - no secondary rails RESUMEN: La falla de arranque ocurre cuando el CDFP no está conectado o existe un problema en la secuencia de encendido, provocando que solo se energicen los voltajes primarios sin habilitar los secundarios. 1.- Encendido de la unidad Thursday, January 15, 2026 8:52 AM Encendido de la unidad o Arranque Consiste en colocar el CDFP negro (CDFP de arranque) en el conector CDFP0 y el arnés de alimentación ya sea en el conector J1 si la tarjeta esta desensamblada. [IMAGE_PLACEHOLDER_1] ó conectar el arnés de alimentación de 54 VDC en el conector trasero del TRAY si esta ensamblada. [IMAGE_PLACEHOLDER_2] CDFP Negro (De arranque) conectado . En el conector CDFP0 se debe de insertar el CDFP de arranque que será igual al mostrado en la siguiente fotografía [IMAGE_PLACEHOLDER_3] De no estar insertado, la secuencia de arranque se verá truncada, solo se energizará la sección primaria, no así el resto de las cuatro canales secundarios. *Forma correcta de insertar el CDFP de arranque. [IMAGE_PLACEHOLDER_4] [IMAGE_PLACEHOLDER_5] *De no contar con el CDFP de arranque podemos puentear P63.1 vs P63.2 para energizar la unidad. [IMAGE_PLACEHOLDER_6] Con la unidad desenergizada y el multímetro en modo Diodo mediremos en P63.1, posteriormente introducimos el CDFP de arranque y verificamos el incremento de voltaje leído en 2 mVDC, con esto se verifica la conexión del CDFP de arranque. [IMAGE_PLACEHOLDER_7] Unidad energizada sin el CDFP de arranque y sin puentear P63.1 vs P63.2 Unidad energizada sin el CDFP de arranque y puenteados P63.1 vs P63.2 [IMAGE_PLACEHOLDER_8] Voltajes primarios Los siguientes son los voltajes primarios [IMAGE_PLACEHOLDER_9] La siguiente es la secuencia de encendido de las fuentes Primarias [IMAGE_PLACEHOLDER_10] El SMD encargado de monitorear los voltajes primarios es el U1, por lo que en su periferia se encuentran las resistencias de 0 Ohms en las cuales se miden los voltajes que queremos verificar, en caso de estar por la cara de Botton, se podrá medir el voltaje directamente en la terminal correspondiente de U1. Esto cuando no se disponga de un Programador para realizar dicha verificación. [IMAGE_PLACEHOLDER_11] [IMAGE_PLACEHOLDER_12] [IMAGE_PLACEHOLDER_13] Voltajes secundarios Los siguientes son los voltajes secundarios donde se repetirán de forma idéntica para cada uno de los cuatro canales (0, 1, 2 y 3) [IMAGE_PLACEHOLDER_14] La siguiente es la secuencia de encendido de las fuentes Secundarias [IMAGE_PLACEHOLDER_15] Los SMD encargados de monitorear los voltajes secundarios son los U26_x (donde x va de 0, a 3), por lo que en su periferia se encuentran las resistencias de 0 Ohms en las cuales se miden los voltajes que queremos verificar, esto cuando no se disponga de un Programador para realizar dicha verificación. [IMAGE_PLACEHOLDER_16] [IMAGE_PLACEHOLDER_17] [IMAGE_PLACEHOLDER_18] Roberto Mar Agued Tabla de secuencias de voltajes primarios. [IMAGE_PLACEHOLDER_19] Canal 0 Secuencia Señal secuencial Nombre de señal Pin señal Enable Pin enable Resultado 2 MSTR to SLV PGOOD MSTR_ASIC_PGOOD U56_0.2 MSTR_ASIC_PGOOD_R U1.38 ASICSEQ_EN_0 3 VCORE_IBC_VOUT VCORE_IBC_VOUT_0 U1A_0.13 ASICSEQ_VCORE_EN_R_0 U26_0.32 3 VDD_1R8_OSC VDD_1R8_OSC_0 U29_0.2 ASICSEQ_VCORE_EN_R_0 U29_0.7 3 VDD_OSFP_3R3 VDD_OSFP_3R3 L20.2 MSTRSEQ_VDD_OSFP_3R3_EN_R U183.35 4 ASICSEQ_CLK_EN ASICSEQ_CLK_EN_L_0 R159_0 ASICSEQ_CLK_EN_L_R_0 U26_0.31 GFC_OSC_EN_0 5 VDD_0,1 VDD_0_0 C507_0.1 ASICSEQ_VDD_EN_R_0 U26_0.30 VDD_1_0 C520_0.1 ASICSEQ_VDD_EN_R_0 U26_0.30 5 VDDUC VDDUC_0 C595_0 ASICSEQ_VDDUC_EN_R_0 U26_0.29 5 VDD_TRVDD_0R75 VDD_TRVDD_0R75_0 L3_0.2 ASICSEQ_TRVDD_EN_R_0 U26_0.28 5 VDD_CH_0R75 VDD_CH_0R75_0 L15_0.2 ASICSEQ_VDDCH_EN_R_0 U26_0.34 6 VDD_GFC_VDDH_1R8 VDD_GFC_VDDH_1R8_0 L8_0.2 ASICSEQ_VDDH_EN_R_0 U26_0.58 7 VDD_AVDDH_1R5 VDD_AVDDH_1R5_0 U8_0.11 ASICSEQ_AVDDH_EN_R_0 U26_0.56 7 VDD_GFC_CORE_PLL_1R2 VDD_GFC_CORE_PLL_1R2_0 U7_0.11 ASICSEQ_CORE_PLL_EN_R_0 U26_0.57 8 VDD_HBM_VPP_1R8 VDD_HBM_VPP_1R8_0 L6_0.2 ASICSEQ_HBM_VPP_EN_R_0 U26_0.55 9 VDDQC_0 VDDQC_0_0 R136_0.1 ASICSEQ_VDDQC_EN_R_0 U26_0.54 9 VDDQC_1 VDDQC_1_0 R137_0.1 ASICSEQ_VDDQC_EN_R_0 U26_0.54 10 VDDQL_0 VDD_HBM_VDDQL_0_0 L1_0.2 ASICSEQ_VDDQL_EN_R_0 U26_0.53 10 VDDQL_1 VDD_HBM_VDDQL_1_0 L2_0.2 ASICSEQ_VDDQL_EN_R_0 U26_0.53 11 VDD_AVDD_PCIE_0R8 VDD_AVDD_PCIE_0R8_0 L5_0.2 ASICSEQ_AVDD_PCIE_EN_R_0 U26_0.52 12 VDD_RTVDDH_0R9 VDD_RTVDDH_0R9_0 L4_0.2 ASICSEQ_RTVDDH_EN_R_0 U26_0.51 12 VDD_PVDD_0R9 VDD_PVDD_0R9_0 U5_0.11 ASICSEQ_RTVDDH_EN_R_0 U26_0.51 13 VDD_PVDD_1R5 VDD_PVDD_1R5_0 U19_0.11 ASICSEQ_VDDH_PCIE_EN_R_0 U26_0.50 13 VDD_VDDH_PCIE_1R2 VDD_VDDH_PCIE_1R2_0 U9_0.11 ASICSEQ_VDDH_PCIE_EN_R_0 U26_0.50 14 ASIC_PWR_GOOD ASICSEQ0_PWR_GOOD_R U1.51 ASICSEQ1_PWR_GOOD_R U1.50 ASICSEQ2_PWR_GOOD_R U1.49 ASICSEQ3_PWR_GOOD_R U1.48 15 ASICSEQ_GFC_RST_L ASICSEQ_GFC_RST_L_R U26_0.48 16 GFC_LOAD_DONE GFC0_CM_DONE U74_0.4 Marcos Paz",
    photos: [
    {
      id: "Arranque_encencido_modificado_img_1",
      url: "./images/extracted/Arranque_encencido_modificado_img_1.jpeg",
      title: "Evidencia Visual 1 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_2",
      url: "./images/extracted/Arranque_encencido_modificado_img_2.jpeg",
      title: "Evidencia Visual 2 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_3",
      url: "./images/extracted/Arranque_encencido_modificado_img_3.jpeg",
      title: "Evidencia Visual 3 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_4",
      url: "./images/extracted/Arranque_encencido_modificado_img_4.png",
      title: "Evidencia Visual 4 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_5",
      url: "./images/extracted/Arranque_encencido_modificado_img_5.jpeg",
      title: "Evidencia Visual 5 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_6",
      url: "./images/extracted/Arranque_encencido_modificado_img_6.jpeg",
      title: "Evidencia Visual 6 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_7",
      url: "./images/extracted/Arranque_encencido_modificado_img_7.jpeg",
      title: "Evidencia Visual 7 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_8",
      url: "./images/extracted/Arranque_encencido_modificado_img_8.png",
      title: "Evidencia Visual 8 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_9",
      url: "./images/extracted/Arranque_encencido_modificado_img_9.png",
      title: "Evidencia Visual 9 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_10",
      url: "./images/extracted/Arranque_encencido_modificado_img_10.jpeg",
      title: "Evidencia Visual 10 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_11",
      url: "./images/extracted/Arranque_encencido_modificado_img_11.jpeg",
      title: "Evidencia Visual 11 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_12",
      url: "./images/extracted/Arranque_encencido_modificado_img_12.jpeg",
      title: "Evidencia Visual 12 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_13",
      url: "./images/extracted/Arranque_encencido_modificado_img_13.jpeg",
      title: "Evidencia Visual 13 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_14",
      url: "./images/extracted/Arranque_encencido_modificado_img_14.jpeg",
      title: "Evidencia Visual 14 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_15",
      url: "./images/extracted/Arranque_encencido_modificado_img_15.png",
      title: "Evidencia Visual 15 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_16",
      url: "./images/extracted/Arranque_encencido_modificado_img_16.jpeg",
      title: "Evidencia Visual 16 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_17",
      url: "./images/extracted/Arranque_encencido_modificado_img_17.jpeg",
      title: "Evidencia Visual 17 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_18",
      url: "./images/extracted/Arranque_encencido_modificado_img_18.png",
      title: "Evidencia Visual 18 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_encencido_modificado_img_19",
      url: "./images/extracted/Arranque_encencido_modificado_img_19.png",
      title: "Evidencia Visual 19 (Arranque encencido modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque encencido modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["arranque", "encencido", "modificado", "local", "docs", "arranque encencido modificado"]
  },
  {
    id: "Arranque_Inicializacion_Modificado",
    title: "Arranque Inicializacion Modificado",
    category: "DocumentaciÃ³n Local / ARRANQUE",
    lastUpdated: "2026-08-06",
    content: "Arranque_Inicializacion_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Arranque e Inicialización del SistemaUSO:Referencia para validar el proceso normal de arranque de una unidad GhostFish y el comportamiento esperado de LEDs e indicadores durante la inicialización.APLICA CUANDO:- La unidad no completa el arranque.- Existen dudas sobre el estado de los LEDs.- Se sospechan fallas de boot.- Se validan secuencias de encendido.- Se revisa el estado de GFC, BMC o PGOOD.AREA:ISTDEBUGBOOTPOWERINITIALIZATIONKEYWORDS:BootInitializationPGOODBMCHeartbeatCDFP0LD14_XLD8LD9LD5LD10LD2LD6LD1RESUMEN:Durante el arranque de la unidad se ejecutan múltiples etapas de inicialización. Al inicio varios LEDs pueden mostrarse en rojo (alarmados), condición considerada normal mientras la secuencia continúa correctamente y el conector de arranque se encuentre instalado en CDFP0. citeturn50search1USO RAPIDO:1. Verificar inserción de CDFP0.2. Energizar la unidad.3. Revisar LEDs de arranque.4. Confirmar estado Heartbeat.5. Confirmar señales PGOOD.6. Validar LEDs de los GFC.7. Confirmar finalización del boot.COMPORTAMIENTO NORMAL:- LEDs inicialmente en rojo.- Posterior transición a estados normales.- Activación de indicadores PGOOD.- Heartbeat activo.- Sistema continúa el arranque normalmente. citeturn50search1LEDS RELACIONADOS CON GFC:Los LEDs LD14_X están asociados a la validación de voltajes de los GFC durante el proceso de inicialización. citeturn50search1INDICADORES PRINCIPALES:- LD8 = BMC Fault LED.- LD9 = Estado de Boot.- LD5 = Heartbeat.- LD10 = HOTSWAP_A_PGOOD.- LD2 = HOTSWAP_B_PGOOD.- LD6 = P12R0_0_PGOOD.- LD1 = P12R0_1_PGOOD. citeturn50search1ESTADOS ESPERADOS:- LD8 rojo.- LD9 azul.- LD5 azul.- LD10 verde.- LD2 verde.- LD6 verde.- LD1 verde. citeturn50search1COMO CONFIRMAR:- Revisar secuencia visual de LEDs.- Confirmar señales PGOOD presentes.- Confirmar Heartbeat activo.- Verificar que el sistema continúe el proceso de boot.CAUSAS PROBABLES DE FALLA:- CDFP0 no instalado.- Ausencia de PGOOD.- Problemas de HOTSWAP.- Problemas de alimentación de 12V.- Falla de BMC.- Falla de inicialización de GFC.ACCION CORRECTIVA:- Verificar alimentación.- Revisar conectores de arranque.- Validar señales PGOOD.- Analizar la etapa específica donde se detiene el boot.RELACIONADO CON:- BMC- GFC- PGOOD- HOTSWAP- Power Sequencing- ASIC BootSALIDA ESPERADA:Confirmar que la unidad completa correctamente la secuencia de inicialización y que todos los indicadores muestran el estado esperado para un arranque exitoso. 2.- Arranque (Inicialización) Thursday, January 15, 2026 8:51 AM Durante el arranque de la unidad y a diferencia del modelo anteriormente analizado (GLP), este se realiza en diversos pasos. En este apartado se enlistarán y analizarán cada uno de ellos. Inicialización. Durante el arranque de la unidad se podrá observar el encendido de diversos leds indicadores de diferentes procesos. Estos leds inician \"alarmados\" de color rojo. Esto es normal ya que posterior a ello, la unidad inicia de forma adecuada (siempre y cuando se haya insertado el conector de arranque en el CDFP0). [IMAGE_PLACEHOLDER_1] [IMAGE_PLACEHOLDER_2] Observando las imágenes, logramos observar que en este apartado, los led´s \"alarmados\" en rojo son correspondientes a la validación de los voltajes de cada uno de los GFCs (correspondientes a las ubicaciones LD14_X). [IMAGE_PLACEHOLDER_3] Además del encendido en rojo del led LD8 (correspondiente al BMC FAULT LED) y encendidos de color azul de los led LD9 y LD5 (correspondientes al estatus del booteo y al Heartbeat sucesivamente), se pueden observar el encendido en verde de los led LD10 (encargado de indicar el funcionamiento del HOTSWAP_A PGOOD), LD2 (encargado de indicar el funcionamiento del HOTSWAP_B PGOOD), LD6 (Indicador de la presencia del voltaje P12R0_0 PGOOD) y LD1 (Indicador de la presencia del voltaje P12R0_1 PGOOD). José Mercado.",
    photos: [
    {
      id: "Arranque_Inicializacion_Modificado_img_1",
      url: "./images/extracted/Arranque_Inicializacion_Modificado_img_1.jpeg",
      title: "Evidencia Visual 1 (Arranque Inicializacion Modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque_Inicializacion_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_Inicializacion_Modificado_img_2",
      url: "./images/extracted/Arranque_Inicializacion_Modificado_img_2.jpeg",
      title: "Evidencia Visual 2 (Arranque Inicializacion Modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque_Inicializacion_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Arranque_Inicializacion_Modificado_img_3",
      url: "./images/extracted/Arranque_Inicializacion_Modificado_img_3.jpeg",
      title: "Evidencia Visual 3 (Arranque Inicializacion Modificado)",
      description: "Imagen extraÃ­da del documento original: Arranque_Inicializacion_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["arranque", "inicializacion", "modificado", "local", "docs", "arranque_inicializacion_modificado"]
  },
  {
    id: "Booteo_modificado",
    title: "Booteo modificado",
    category: "DocumentaciÃ³n Local / ARRANQUE",
    lastUpdated: "2026-08-06",
    content: "SINTOMAS:- No entra a booteo- LEDs no muestran patrón esperado- Heartbeat no parpadeaAREA:- Booteo / Inicialización finalKEYWORDS:- boot- leds status- heartbeat- BMC initRESUMEN:Etapa final donde la unidad entra en operación y LEDs confirman estado correcto.DIAGNOSTICO RAPIDO:- Si no hay LEDs esperados → falla en inicialización- Si heartbeat no parpadea → falla en booteo 2.3.- Booteo Booteo. Posterior al segundo estado de validación que realiza la tarjeta; esta ya no realiza ningún reinicio, sino que entra a estado de booteo en donde cada uno de los leds indicadores toma un color específico. [IMAGE_PLACEHOLDER_1] Como pueden observar los leds encargados de indicar el booteo de todos los GFCs se encienden de verde; mientras que, el led del Heartbeat (LD5) y el led del indicador del estatus del BMC (LD9) encienden en azul de forma uniforme. Todo esto ocurre mientras que los demás indicadores que ya se encontraban en verde no se apagan, a excepción de los leds indicadores de los ICI1 yICI4 (LD18_X y LD19_X) de cada uno de los GFCs. Durante este proceso los leds PCIE de los GFCs 2 y 3 (LD58 y LD61 consecutivamente) parpadean durante los próximos 3-5 minutos. Pasando este proceso se agregan los demás leds que faltaban de encender (el led LD60 del GFC1, el led LD57 del GFC0 y el led LD59 del BMC) indicando la buena inicialización del booteo. Además de esto el led LD5 (El led indicador del \"heartbreat\" de la unidad) parpadea; indicando así el buen booteo e inicialización de la unidad. José Mercado.",
    photos: [
    {
      id: "Booteo_modificado_img_1",
      url: "./images/extracted/Booteo_modificado_img_1.png",
      title: "Evidencia Visual 1 (Booteo modificado)",
      description: "Imagen extraÃ­da del documento original: Booteo_modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["booteo", "modificado", "local", "docs", "booteo_modificado"]
  },
  {
    id: "Guia_ADI_modificado",
    title: "Guia ADI modificado",
    category: "DocumentaciÃ³n Local / ARRANQUE",
    lastUpdated: "2026-08-06",
    content: "TIPO:Herramienta / diagnóstico avanzadoAPLICA CUANDO:- Se requiere analizar secuencia de voltajes- Fallas no detectadas visualmente- Se necesita validar Blackbox o registrosHERRAMIENTA:- ADI Power Studio- Programador ADMAREA:- Diagnóstico avanzado- Secuencia de encendidoKEYWORDS:- ADI- blackbox- build sequence- sequence wizard- rail status- power sequencing toolRESUMEN:Herramienta para analizar la secuencia de encendido, validar estados de voltaje y detectar en qué punto falla la secuencia mediante registros y condiciones lógicas.USO RAPIDO:- Ver estado de voltajes → Rail Status- Ver fallas → Blackbox- Ver orden → Sequence Wizard- Analizar lógica → Build Sequence Guía ADI Power Studio para detectar problema en la secuencia de encendido. (By Gerardo Santiago-Técnico en análisis de Fallas) TOC \\\\o \"1-9\" \\\\z \\\\u \\\\hADI Power Studio PAGEREF _Toc629168710 \\\\h2 Introducción PAGEREF _Toc1663663317 \\\\h3 Programación de ADM PAGEREF _Toc1401179063 \\\\h9 Cargado de archivos al dispositivo ADM PAGEREF _Toc1716869889 \\\\h13 Lectura de tiempo real de voltajes: PAGEREF _Toc768156117 \\\\h15 BLACKBOX: PAGEREF _Toc541595227 \\\\h17 Sequence Wizard: PAGEREF _Toc1992555895 \\\\h21 Build Sequence: PAGEREF _Toc518890687 \\\\h25 1. Enter Action PAGEREF _Toc534084216 \\\\h26 2. Loop Action PAGEREF _Toc1670850777 \\\\h27 Resolución de problemas de voltajes VLP y GLP. PAGEREF _Toc13350632 \\\\h28 Comprendiendo la Secuencia de Voltajes y su Relación con la Inicialización del Canal PAGEREF _Toc1070214921 \\\\h29 Aplicación del ADM1266 en la Supervisión y Secuenciación de Voltajes PAGEREF _Toc615547917 \\\\h30 Falla en voltaje de 12V PAGEREF _Toc347022837 \\\\h31 Método Práctico para Validar el Funcionamiento del Regulador PAGEREF _Toc144162933 \\\\h33 Acceso a Registros ADI y Análisis de Fallas en la Secuencia PAGEREF _Toc765802866 \\\\h35 Importancia de Revisar el Bloque Anterior en la Secuencia PAGEREF _Toc1232726121 \\\\h37 Truco Rápido para Diagnóstico de VCORE en GLP PAGEREF _Toc449019475 \\\\h37 Método: PAGEREF _Toc1163013831 \\\\h38 Nota Final PAGEREF _Toc1442032741 \\\\h40 ADI Power Studio Introducción Esta es una guía rápida para el uso del programa ADI Power Studio para programar y detectar errores en el encendido de los canales. Prime paso: Abrir la aplicación desde el menú de inicio. [IMAGE_PLACEHOLDER_1] Al dar clic en la aplicación no abrirá la siguiente ventana: [IMAGE_PLACEHOLDER_2] Debemos de conectar el programados al puesto USB de la computadora y validar si es reconocido el dispositivo. Podemos validar dando clic en el siguiente icono [IMAGE_PLACEHOLDER_3] [IMAGE_PLACEHOLDER_4] Nos deberá aparecer la siguiente ventana [IMAGE_PLACEHOLDER_5] En esta misma podemos visualizar si hay algún dispositivo conectado, en la ventana anterior observemos que está en blanco por lo cual o no tenemos el dispositivo conectado o no se reconoce el dispositivo, (Comunícate con tu Coordinador para que te apoye con la instalación, o puedes buscar el Driver en la carpeta de Box) Si se realiza correctamente la instalación deberíamos de obtener lo siguiente: [IMAGE_PLACEHOLDER_6] Ahora nos aparece el dispositivo programador, después será necesario hacer la alimentación de la unidad para empezar a tomar los datos. El programador cuenta con 3 pines, SDA, SCL y GND. Es necesario ubicar en nuestro esquemático como en el CAD como se debe posicionar cada pin. A continuación, un ejemplo de donde se ubican las líneas de SCL y SDA [IMAGE_PLACEHOLDER_7] [IMAGE_PLACEHOLDER_8] Al realizar la conexión nos debe aparecer la dirección del dispositivo [IMAGE_PLACEHOLDER_9] Programación de ADM Debemos de seleccionar la siguiente opción para abrir el archivo a cargar [IMAGE_PLACEHOLDER_10] Nos abrirá la siguiente ventana y continuando con el ejemplo anterior del U84 abrimos la siguiente carpeta [IMAGE_PLACEHOLDER_11] Al dar clic, podemos encontrar la carpeta vacía por lo cual será necesario cambiar el tipo de archivo que buscamos(.hex) [IMAGE_PLACEHOLDER_12] Al darle en open la ventana de software debe de cambiar por la siguiente [IMAGE_PLACEHOLDER_13] Las opciones que más ocuparemos será las seleccionadas [IMAGE_PLACEHOLDER_14] Cargado de archivos al dispositivo ADM Para realizar el cargado de archivos hacemos clic en el siguiente icono [IMAGE_PLACEHOLDER_15] [IMAGE_PLACEHOLDER_16] Nos saldrá una ventana y solo quedará dar clic en el botón ok para empezar la programación [IMAGE_PLACEHOLDER_17] En la parte inferior izquierda de la ventana nos aparecerá una barra de carga al llenarse se habrá acabado de programar el ADM [IMAGE_PLACEHOLDER_18] Lectura de tiempo real de voltajes: Al dar clic en Monitor y Rail Status podemos entrar en la opción de lecturas de voltajes [IMAGE_PLACEHOLDER_19] Para hacerla en tiempo real será necesario dar clic en el botón de Read Device(s) Status [IMAGE_PLACEHOLDER_20] [IMAGE_PLACEHOLDER_21] Y podemos observar una tabla con los voltajes y el estado como a continuación [IMAGE_PLACEHOLDER_22] [IMAGE_PLACEHOLDER_23] BLACKBOX: La opción de Blackbox nos permitirá tomar los registros que tiene el dispositivo ADM, esta opción es muy importante porque podremos observar el comportamiento de las líneas de voltaje en todos los encendidos y que problemas se han registrado. Pera ello damos clic en Monitor y después el Blackbox [IMAGE_PLACEHOLDER_24] No aparecerá la siguiente ventana [IMAGE_PLACEHOLDER_25] Para entrar al registro debemos de irnos en la parte que dice Blackbox Record y dar clic en el icono de Read records from hadware [IMAGE_PLACEHOLDER_26] [IMAGE_PLACEHOLDER_27] Nos aparecerá el número de registro la fecha ciclo de encendido y estado [IMAGE_PLACEHOLDER_28] Para eliminar los registros damos clic en Erase records Al dar clic en los registros se nos reflejara en las tablas las líneas de voltaje cuanta con algún problema en el siguiente ejemplo vemos alarmado el nodo BMC_L0SEQ_READY [IMAGE_PLACEHOLDER_29] [IMAGE_PLACEHOLDER_30] Sequence Wizard: En esta sección podemos observar los nodos que se activa y el orden de arranque, para ello solo con dar clic en Supply Order se ordenarán. [IMAGE_PLACEHOLDER_31] Continuando con el mismo ejemplo de componente se deberá ver de la siguiente manera [IMAGE_PLACEHOLDER_32] Si prestamos atencion hay números repetidos en la columna Supply Order, por ejemplo: El valor 3 aparece varias veces (FAN_HSWAP_PGOOD, VDD_PSX_0R95, VDD_STBY_1R8). El valor 4 también aparece varias veces. Esto no es un error, sino que indica que esas fuentes se encienden en paralelo dentro del mismo paso de secuencia. Es decir: Todas las fuentes con Supply Order = 3 se habilitan al mismo tiempo, después de que las fuentes con orden 2 hayan completado su secuencia. Luego, las fuentes con Supply Order = 4 se habilitan juntas, y así sucesivamente. En otras palabras: define grupos de encendido. Si el número se repite, significa que esas fuentes pertenecen al mismo grupo y se activan simultáneamente. Esto se usa para optimizar el tiempo de arranque y cumplir dependencias lógicas (por ejemplo, primero habilitar voltajes base, luego secundarios). “Podemos usar el esquemático para apoyarnos a localizar los nodos y las resistencias que conectan con los reguladores” [IMAGE_PLACEHOLDER_33] [IMAGE_PLACEHOLDER_34] Build Sequence: Para entrar en la opción de Build Sequences será necesario dar clic en Sequencing y después en Build Sequences . [IMAGE_PLACEHOLDER_35] En esta sección podemos encontrar mucha información que nos puede ser muy útil si sabemos manipularla, ya que nos permitirá cambiar las condiciones de encendido, como requisitos, el orden de encendido entre otras más configuraciones, esto solo con la intención de poder tomar mediciones de reguladores de voltaje para encontrar en que parte del encendido se pierda la secuencia o que provoca ello. “Se requiere tener mucha precaución ya que cambiar una condicional sin simular el funcionamiento puede generar sobrecalentamientos en reguladores de voltaje si esta se encuentra dañado, convirtiéndose es explosiones eléctricas que pueden dañar la PCB” [IMAGE_PLACEHOLDER_36] 1. Enter Action Esta sección indica qué acciones se ejecutan inmediatamente al entrar en este estado. Inicializar variables y señales: SET Timer@44 = 0 ms → Reinicia el temporizador. SET LSEQ_BMC_RST_L = LOW, SET LSEQ_HSWAP_RESTART = LOW, etc. → Configura señales de control en bajo. Configurar flags y habilitar/deshabilitar señales: SET LSEQ_LISEQ_SPARE_X = LOW → Señales de repuesto en bajo. SET GLC_LISEQ_APP_PERST_DET_L = HIGH → Señal de detección en alto. DISABLE VDD_PSX_0R95, VDD_PSX_1R8, ... → Deshabilita varias fuentes de alimentación. En resumen: La sección Enter Action prepara el sistema para este estado, asegurando que las señales y fuentes estén en la condición correcta antes de continuar. 2. Loop Action Esta sección define qué acciones se ejecutan repetidamente mientras el sistema permanece en este estado. IF (HSWAP_PGOOD_L0SEQ == OK) GOTO ST_VDD_12R0 → Si la señal HSWAP indica que está bien, pasa al siguiente estado (ST_VDD_12R0). IF (Timer@44 &gt; 50 ms) GOTO ST_PWR_FAULT_PW → Si el temporizador supera 50 ms sin que la condición anterior se cumpla, salta a un estado de fallo (ST_PWR_FAULT_PW). En resumen: La sección Loop Action monitorea condiciones y decide si: Avanza al siguiente estado. O entra en un estado de error si el tiempo límite se excede. Con esto nos podemos hacer una idea de cómo manipular la secuencia únicamente para detectar problemas en el encendido siempre y cuando se tenga la precaución necesaria y sobre todo no se tenga problemas de baja impedancia ya que esto puede dañar PCBA, Líneas o IC de voltajes. Resolución de problemas de voltajes VLP y GLP. En esta sección se presentará una metodología general para la localización de fallas utilizando ADI Power Studio. Es importante destacar que este procedimiento no garantiza la solución completa del problema, ya que será necesario observar, medir y validar las líneas de voltaje para confirmar si la hipótesis planteada es consistente y puede conducir a una solución efectiva. El objetivo principal es proporcionar al técnico bases sólidas que permitan justificar de manera eficiente cualquier reemplazo o prueba, minimizando riesgos que puedan comprometer la integridad de la PCB o dañar otros canales de la misma unidad. Para ello, esta segunda parte de la guía se enfocará inicialmente en los fundamentos para identificar la falla y, posteriormente, en diversas soluciones basadas en procedimientos previamente validados, que han demostrado ser efectivos para la localización de fallas. Comprendiendo la Secuencia de Voltajes y su Relación con la Inicialización del Canal Para entender correctamente el comportamiento del sistema, es fundamental diferenciar la secuencia de encendido de voltajes de la inicialización del canal. Una forma práctica de visualizarlo es considerar la secuencia de voltajes como una cadena de bloques: si cada bloque cumple su función, el voltaje será estable. Esta etapa es independiente de la inicialización del canal, aunque están relacionadas, ya que el canal solo se inicializa cuando la cadena de voltajes se ha completado. Este concepto es crítico para diagnosticar fallas en interfaces como JTAG o I²C, donde una interrupción en la secuencia puede impedir la correcta inicialización. Comprender esta relación permitirá identificar problemas de manera más precisa y evitar diagnósticos erróneos. En la primera parte del análisis, enfocada en GLP sobre el IC U84, se destacó la importancia de entender cómo se activa cada regulador y cómo esta secuencia impacta en el sistema. Para ello, una herramienta clave es ADI Power Studio, especialmente la función BlackBox, que permite registrar y analizar la secuencia de encendido, facilitando la identificación de irregularidades. Aplicación del ADM1266 en la Supervisión y Secuenciación de Voltajes Comprender este concepto no se limita a un solo modelo, ya que puede aplicarse tanto en plataformas VLP, GLP o cualquier producto que utilice un ADM, el cual funciona como un supervisor y secuenciador digital de alimentación (Power Sequencer and Monitor). Ahora bien, iniciemos con lo básico: sabemos que la unidad se alimenta con 54 V, pero ¿cómo se distribuyen estos voltajes? La mayoría de las fallas están relacionadas con problemas en las líneas principales: 54 V, 12 V, 5 V, 3.3 V y 1.8 V, por mencionar las más críticas. Surge entonces la pregunta: ¿cómo identificar qué voltaje está fallando? Para ello, debemos separar dos escenarios: ¿Es posible acceder a los registros de ADI con la unidad encendida? Si la respuesta es sí, aplicaremos un método que explicaré más adelante. Si la respuesta es no, entonces estamos ante un problema que requiere un enfoque diferente, el cual abordaré de manera clara y sencilla en esta sección. Falla en voltaje de 12V Cuando la línea de VDD_12R0 en GLP o alguna de la VDD_VLC_10R8 en VLP están caídas o es bajo el voltaje necesitamos asegura las fuentes principales en GLP el U81 y en VLP validar si es U18 o U21 o ambos, para ello es necesario entender la parte básica de un regular en palabras simples, podemos decir que un regulador de voltaje consta de: Voltaje de entrada (Vin) Debe ser mayor que el voltaje de salida deseado (en reguladores lineales) o adecuado para el rango de operación (en reguladores conmutados). Pin de habilitación (Enable / EN) Este pin debe estar en nivel lógico alto (o según especificación) para activar el regulador. Si está en bajo, el regulador permanece apagado. Referencia interna o externa El regulador compara la salida con una referencia para mantener el voltaje estable. Carga conectada (Output) El regulador entrega energía a la carga, que puede ser un circuito o dispositivo. Retroalimentación (Feedback) Permite al regulador ajustar la salida para mantener el voltaje correcto. Con ello ya tenemos lo necesario para empezar a trabajar con la mayoría de las fallas. Para mí el favorito es usando como ejemplo el U81 de GLP. Ya que podemos resumirlo de manera muy rápida y sencilla [IMAGE_PLACEHOLDER_37] Análisis Básico del Regulador: Entrada, Enable y Salida En la imagen se observan tres elementos clave: Entrada de 54 V Pin de habilitación (Enable) Salida de 12 V Con estos datos es posible realizar un diagnóstico inicial rápido. En términos simples: Si no hay entrada, no habrá salida. Si hay entrada, pero el Enable está desactivado, no habrá salida. Si hay Enable pero no hay entrada, tampoco habrá salida. Si ambos están presentes (entrada y Enable), por lógica debería existir salida. ¿Qué ocurre si no hay salida, aunque tengamos entrada y Enable activos? Este escenario indica que el regulador está recibiendo las condiciones básicas para operar, pero no está cumpliendo su función. Las causas más comunes pueden ser: Falla interna del regulador (circuito dañado). Protección activa (sobrevoltaje, sobre corriente o temperatura). Problemas en la retroalimentación (Feedback) que impiden regular el voltaje. Componentes externos defectuosos (condensadores, inductores en reguladores conmutados). Cortocircuito en la carga que provoca apagado por protección. Truco Rápido Método Práctico para Validar el Funcionamiento del Regulador Un procedimiento útil para determinar si un regulador está operativo consiste en realizar la siguiente prueba: Desconectar la unidad para evitar interferencias con otros circuitos. Inyectar un voltaje controlado (por ejemplo, 12 V) con bajo amperaje directamente en el nodo de salida del regulador. Observar el comportamiento del voltaje inyectado: Si el voltaje cae rápidamente, existe un componente en la línea que está provocando la caída (posible corto o fuga). Si el voltaje se mantiene estable, el regulador no está funcionando correctamente, ya que no hay consumo significativo ni regulación activa. “Este método no es una solución definitiva, pero permite identificar de manera rápida si el problema está en el regulador o en la carga asociada.” Este método permite determinar rápidamente si el problema está en el regulador o en el nodo. La misma técnica se aplicará en diferentes puntos del circuito para identificar la causa de la falla. Sin embargo, es fundamental conocer siempre dos aspectos antes de realizar cualquier diagnóstico: La configuración del pin Enable (si es Active HIGH o Active LOW). La presencia del voltaje de entrada en el regulador. Estos parámetros son la base para interpretar correctamente el comportamiento del regulador y evitar conclusiones erróneas. En el caso del U81. [IMAGE_PLACEHOLDER_38] Este circuito decide cuándo habilitar el regulador de 12 V. Funciona así: Hay tres cosas importantes: Entrada de 54 V, el pin Enable, y la salida de 12 V. La configuración actual es Active LOW, lo que significa que el regulador se activa cuando la señal de habilitación está en nivel bajo. ¿Quién controla esto? La señal HSWAP_PGOOD. Cuando indica que todo está bien (Power Good), activa el MOSFET Q27, y este pone el pin Enable en bajo. Resultado: el regulador se enciende y entrega los 12 V. Si la señal no cambia o el MOSFET no conmuta, el regulador no se habilita. Acceso a Registros ADI y Análisis de Fallas en la Secuencia Retomemos la pregunta inicial: ¿Es posible acceder a los registros de ADI con la unidad encendida? Cuando la respuesta es sí, el análisis se vuelve más complejo, pero sigue siendo sencillo si se aplica el método correctamente. Paso 1: Comprender BlackBox Antes de continuar, es fundamental entender la herramienta BlackBox de ADI Power Studio. Esta función permite registrar eventos y estados durante la secuencia de encendido, lo que facilita identificar en qué punto ocurre la falla. Si aún no lo has revisado, vuelve a la sección de esta guía dedicada a BlackBox. Paso 2: Analizar los Registros Una vez que comprendas BlackBox, revisa los registros para identificar qué voltaje está fallando. Por ejemplo: ST_FAN_HSWAP_PGOOD_VDD_PSX_0R95 ST_VDD_BMC_2R5_VDD_BMC_3R3 Estos nombres corresponden a estados dentro de la secuencia. Si detectas que falla en el nodo ST_VDD_BMC_2R5_VDD_BMC_3R3, el siguiente paso es ir a Build Sequences y analizar el código asociado. Paso 3: Revisar Build Sequences En Build Sequences, cada estado define: [IMAGE_PLACEHOLDER_39] Enter Action: Acciones al entrar en el estado (habilitación, temporizadores, señales). Loop Action: Condiciones que se evalúan mientras el estado está activo (verificación de Power Good, temporizadores, transición a otro estado o a error). Esto permite entender qué condiciones deben cumplirse para avanzar y por qué el sistema se detiene en ese punto. Importancia de Revisar el Bloque Anterior en la Secuencia Algo que siempre debes considerar es el estado anterior en la secuencia. Por ejemplo, si el nodo ST_VDD_BMC_2R5_VDD_BMC_3R3 presenta una falla, no significa necesariamente que el problema esté en ese bloque. Puede ocurrir que el paso anterior no se haya completado correctamente, lo que provoca que la falla se refleje en el nodo actual. En otras palabras: Si el bloque anterior falla, el siguiente estado no podrá activarse, y el error se manifestará en el punto donde la secuencia se detiene. Por ejemplo, si ST_FAN_HSWAP_PGOOD_VDD_PSX_0R95 no cumple sus condiciones, la falla podría aparecer en ST_VDD_BMC_2R5_VDD_BMC_3R3, aunque el origen real esté en el bloque previo. Por eso, analizar la dependencia entre estados en Build Sequences es clave para diagnosticar correctamente. Cada estado tiene condiciones que dependen del anterior, y entender esta relación evita reemplazos innecesarios o diagnósticos erróneos. Truco Rápido para Diagnóstico de VCORE en GLP Muchas de las fallas de voltaje en plataformas VLP y GLP están relacionadas con el nodo VCORE. Sin embargo, este método aplica únicamente para GLP. Cuando validamos los registros de BlackBox y confirmamos que el voltaje VCORE falla, debemos considerar que hay cuatro componentes involucrados según el canal: U21_X, U24_X, U25_X y U26_X. Este truco se enfoca en descartar o confirmar fallas en los reguladores U24_X y U25_X. Para ello: Procedimiento Descartar problemas de impedancia en el nodo antes de cualquier prueba. Medir la salida de los reguladores: Deben entregar aproximadamente 6.7 V. Si no es posible medir este voltaje directamente, aplicamos el siguiente método. Método: Inyectar 3 V con bajo amperaje en el nodo VCORE_IBC_PGOOD_SEQ: Esto simula el correcto funcionamiento del nodo, evitando que la cadena de encendido se interrumpa por el ADM. Usar cámara térmica para observar el comportamiento: [IMAGE_PLACEHOLDER_40] El regulador que no disipa calor está inactivo o fallando. El regulador que responde térmicamente está operativo. ¿Por qué funciona este método? El nodo VCORE_IBC_PGOOD_SEQ actúa como señal de validación para los reguladores. Al inyectar 3 V, simulamos que el nodo está en buen estado, lo que permite que la secuencia continúe sin bloquearse por el ADM. Esto nos da tiempo para identificar, mediante la respuesta térmica, cuál regulador está trabajando y cuál no. [IMAGE_PLACEHOLDER_41] Nota Final Lo que hemos visto hasta ahora representa solo una parte de las fallas relacionadas con la secuencia de voltajes en las unidades VLP y GLP. Aún queda mucho por documentar, incluyendo: Funcionamiento de las fases en VLP y GLP (módulos de potencia). Cómo opera el PWM sobre las fases en ambas plataformas. Métodos para descartar el regulador U26_X y validar su señal PWM. Cambios y ajustes en secuencias probadas en ADM para mantener voltajes habilitados durante pruebas. Diagnóstico avanzado de reguladores, incluyendo la validación y descarte de U13_X (otro PWM crítico). Todo esto lo estoy desarrollando porque he analizado la estructura del nuevo modelo y he detectado muchas similitudes con las arquitecturas actuales. Esta guía es solo una parte de un trabajo más amplio que estoy documentando y perfeccionando, con el objetivo de aportar herramientas prácticas y confiables para el diagnóstico. Espero que esta información sea útil y que sirva como base para seguir mejorando los procesos de análisis y reparación.",
    photos: [

    ],
    keywords: ["guia", "adi", "modificado", "local", "docs", "guia_adi_modificado"]
  },
  {
    id: "NOTA_Secuencia_modificado",
    title: "NOTA Secuencia modificado",
    category: "DocumentaciÃ³n Local / ARRANQUE",
    lastUpdated: "2026-08-06",
    content: "TIPO:Soporte técnico / referencia avanzadaAPLICA CUANDO:- Hay fallas en voltajes primarios- La secuencia no coincide con lo esperado- Se usan herramientas como ADI / BlackboxAREA:- Power- Secuencia primariaKEYWORDS:- secuencia primaria- FAN_HSWAP_PGOOD- voltajes escondidos- power sequence mismatch- validación ADIRESUMEN:Existen señales críticas que no aparecen en la secuencia estándar pero afectan directamente el arranque. Estas deben validarse en ADI Power Studio y Build Sequence.DIAGNOSTICO RAPIDO:- Si falla la secuencia primaria: → Validar FAN_HSWAP_PGOOD- Si el sistema va a FAIL_POWER: → Revisar condiciones previas en Build Sequence- Si todo parece correcto pero no arranca: → Revisar voltajes no listados en ADI NOTA Secuencia primaria Este apartado es para agregar información vital a lo ya mencionado en la secuencia primaria en la sección anterior. En ambos modelos, hay un par de voltajes que siempre pasan desapercibidos ya que no está incluido en ningún archivo de secuencia, pero sí viene mencionado en el ADI o el esquemático. Si la persona lectora no está familiarizada con el programa mencionado, con su uso o con la forma de visualizar la información descrita a continuación, puede consultar la guía elaborada por el compañero Gerardo Santiago. Dicho documento proporciona una explicación detallada y aclara cualquier duda relacionada con el contenido de este apartado. Guia para usó del programador y ADI Power Studio.docx Comenzaremos esta sección haciendo mención al primer voltaje \"escondido\" que se encuentra tanto en GLP como en GF. Se trata de la señal \"FAN_HSWAP_PGOOD\", es la bandera que recibe el secuenciador primario para saber que los ventiladores están recibiendo correctamente sus respectivos 54V así como su consumo de corriente esta correcta. [IMAGE_PLACEHOLDER_1] ¿Cómo afecta esta señal a la secuencia y por qué no viene incluida en ningún archivo? La respuesta rápida a lo segundo es: No lo sabemos. Pero esta omisión de la información sucede en ambos modelos, puede que incluso suceda desde VLP, el predecesor de GLP. En cuanto al cómo afecta a la secuencia, podemos validarlo en el apartado de \"Build sequence\" y \"Sequence wizard\" del ADI. El primero nos dejará verificar la secuencia de voltajes, o los que se mostrará su status en el \"Black box\": [IMAGE_PLACEHOLDER_2] Con esto, verificamos que ni siquiera en estos apartados encontramos el voltaje mencionado. Sin embargo, podremos hallarlo navegando en el \"Build sequence\", donde aparece como una condicional PREVIA para poder habilitar el inicio de la secuencia de voltajes primarios (ST_MECH_POWER), así como también en el paso siguiente (ST_PSX_POWER), aparece la condición de que si el pgood de dicha señal está en bajo (o que no esté presente), se deshabilitan los voltajes primarios (GOTO FAIL_POWER). [IMAGE_PLACEHOLDER_3] [IMAGE_PLACEHOLDER_4] Con esto confirmamos la importancia de validar esta señal siempre que tengamos un problema en los voltajes primarios antes de validar si la falla es algún voltaje de la secuencia que nos esté mostrando el blackbox. Recordemos que esta validación aplica también en GLP. Continuaremos con el siguiente voltaje \"escondido\". Esta vez, se trata de la señal \"TITAN0_RESET_L\" la cual podemos ver como el primer enable del U71, componente vital para el booteo del BMC.En este caso, este voltaje no nos afectará a la secuencia de voltajes como tal, sino al booteo de la unidad, algo a lo que tendrán como referencia en el Tema 2 de este bloque. Este voltaje solo viene mencionado en la secuencia, aunque está casi al final de la misma, lo que podría provocar una confusión, puesto que si seguimos las líneas punteadas, inicia al mismo tiempo que 3.3V como se aprecia en las imágenes a continuación: [IMAGE_PLACEHOLDER_5] [IMAGE_PLACEHOLDER_6] Es importante recordar que, ante cualquier falla durante el proceso de arranque, resulta fundamental verificar la habilitación del componente U71. Omitir esta validación puede originar problemas relacionados con la línea de 3.3 V o con la resistencia que realiza el puente correspondiente. Finalmente, para resumir el contenido de esta sección, hay voltajes que no están presentes u ordenados en la secuencia como deberían, por lo que al ordenarlos correctamente quedarían de la siguiente forma: [IMAGE_PLACEHOLDER_7] Los rieles de voltaje en azul significa que entran al mismo tiempo. Normalmente y durante el análisis en mesa de una unidad a diagnosticar el proceso de booteo no se ve completado, ya que este se interrumpe por la alta temperatura presentada en los GFC debido a la falta de refrigeración. Sin embargo y si tienes un poco de suerte, se podrá observar el booteo completo en ciertas unidades durante unos segundos; por lo que hay que estar atentos al proceso. Emanuel Domínguez",
    photos: [
    {
      id: "NOTA_Secuencia_modificado_img_1",
      url: "./images/extracted/NOTA_Secuencia_modificado_img_1.png",
      title: "Evidencia Visual 1 (NOTA Secuencia modificado)",
      description: "Imagen extraÃ­da del documento original: NOTA_Secuencia_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "NOTA_Secuencia_modificado_img_2",
      url: "./images/extracted/NOTA_Secuencia_modificado_img_2.png",
      title: "Evidencia Visual 2 (NOTA Secuencia modificado)",
      description: "Imagen extraÃ­da del documento original: NOTA_Secuencia_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "NOTA_Secuencia_modificado_img_3",
      url: "./images/extracted/NOTA_Secuencia_modificado_img_3.png",
      title: "Evidencia Visual 3 (NOTA Secuencia modificado)",
      description: "Imagen extraÃ­da del documento original: NOTA_Secuencia_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "NOTA_Secuencia_modificado_img_4",
      url: "./images/extracted/NOTA_Secuencia_modificado_img_4.png",
      title: "Evidencia Visual 4 (NOTA Secuencia modificado)",
      description: "Imagen extraÃ­da del documento original: NOTA_Secuencia_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "NOTA_Secuencia_modificado_img_5",
      url: "./images/extracted/NOTA_Secuencia_modificado_img_5.png",
      title: "Evidencia Visual 5 (NOTA Secuencia modificado)",
      description: "Imagen extraÃ­da del documento original: NOTA_Secuencia_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "NOTA_Secuencia_modificado_img_6",
      url: "./images/extracted/NOTA_Secuencia_modificado_img_6.png",
      title: "Evidencia Visual 6 (NOTA Secuencia modificado)",
      description: "Imagen extraÃ­da del documento original: NOTA_Secuencia_modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["nota", "secuencia", "modificado", "local", "docs", "nota_secuencia_modificado"]
  },
  {
    id: "Reinicio_modificado",
    title: "Reinicio modificado",
    category: "DocumentaciÃ³n Local / ARRANQUE",
    lastUpdated: "2026-08-06",
    content: "SINTOMAS:- La unidad reinicia después de iniciar- Proceso vuelve a inicioAREA:- Reinicio / SecuenciaKEYWORDS:- reset- restart- loop startupRESUMEN:Proceso normal donde la unidad reinicia después de validación antes de iniciar booteo.DIAGNOSTICO RAPIDO:- Si reinicia 1 vez → normal- Si reinicia en loop → revisar validación 2.2.- Reinicio Reinicio. Al observar los leds de color verde uno imaginaría que la unidad comenzaría el proceso de booteo; sin embargo antes de ello la unidad realiza un proceso de \"reinicio\" en donde se observa en los leds indicadores que la unidad vuelve al punto 1 de inicialización. Es algo completamente normal y se realiza posterior al apartado 2 de validación. [IMAGE_PLACEHOLDER_1] Pasando esté \"reinicio\" la unidad pasa nuevamente por los procesos 1 y 2.",
    photos: [
    {
      id: "Reinicio_modificado_img_1",
      url: "./images/extracted/Reinicio_modificado_img_1.png",
      title: "Evidencia Visual 1 (Reinicio modificado)",
      description: "Imagen extraÃ­da del documento original: Reinicio_modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["reinicio", "modificado", "local", "docs", "reinicio_modificado"]
  },
  {
    id: "Validacion_modificado",
    title: "Validacion modificado",
    category: "DocumentaciÃ³n Local / ARRANQUE",
    lastUpdated: "2026-08-06",
    content: "SINTOMAS:- La unidad no completa validación- LEDs no cambian a verde/azul- Fallas en inicialización de ASICAREA:- Validación / InicializaciónKEYWORDS:- validacion- leds status- init failure- ASIC bootRESUMEN:Durante esta etapa la unidad valida voltajes y estado de ASICs mediante LEDs.DIAGNOSTICO RAPIDO:- Si LEDs no cambian → revisar inicialización- Si ASIC no valida → revisar secuencia previa- Si LEDs anómalos → revisar estado de chips 2.1.- Validación Validación. Posterior a la energización e inicialización de la unidad, esta realiza diversas validaciones tanto de voltaje como el estatus del Booteo en diversas partes de la misma. Esto lo podemos observar en el estado de los leds, ya que estos cambian de color rojo a color verde (LD14_X) o azul (LD9 y LD5) y el apagado de algunos de los leds mencionados anteriormente (LD8). [IMAGE_PLACEHOLDER_1] Además, se encienden dos leds encargados de indicar el funcionamiento adecuado de los ICI1 e ICI4 de cada uno de los GFCs (LD18_X y LD19_X). [IMAGE_PLACEHOLDER_2] Así mismo y en observación, también podemos ver el encendido en naranja de 1 o 2 y en verde de 1 o 2 de los leds encargados de indicar el funcionamiento de los 3 chips internos de cada uno de los GFCs (LD20_X para Chiplet Boot, LD21_X para Main Die 1 boot y LD22_X para Main Die 0 boot). [IMAGE_PLACEHOLDER_3] Posterior a ello y validando la inicialización de los 4 ASICs (GFCs), la unidad cambia el estado de los leds mencionados a verde (caso de los Leds encargados de indicar el funcionamientos de los chips de cada GFC) y enciende otros dos leds nuevos (LD58 y LD61) en verde que parpadean durante unos segundos. José Mercado.",
    photos: [
    {
      id: "Validacion_modificado_img_1",
      url: "./images/extracted/Validacion_modificado_img_1.png",
      title: "Evidencia Visual 1 (Validacion modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_modificado_img_2",
      url: "./images/extracted/Validacion_modificado_img_2.png",
      title: "Evidencia Visual 2 (Validacion modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_modificado_img_3",
      url: "./images/extracted/Validacion_modificado_img_3.jpeg",
      title: "Evidencia Visual 3 (Validacion modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["validacion", "modificado", "local", "docs", "validacion_modificado"]
  },
  {
    id: "2_2_reinicio",
    title: "2 2 reinicio",
    category: "DocumentaciÃ³n Local / Originales Arranque",
    lastUpdated: "2026-08-06",
    content: "2.2.- Reinicio Reinicio. Al observar los leds de color verde uno imaginaría que la unidad comenzaría el proceso de booteo; sin embargo antes de ello la unidad realiza un proceso de \"reinicio\" en donde se observa en los leds indicadores que la unidad vuelve al punto 1 de inicialización. Es algo completamente normal y se realiza posterior al apartado 2 de validación. [IMAGE_PLACEHOLDER_1] Pasando esté \"reinicio\" la unidad pasa nuevamente por los procesos 1 y 2.",
    photos: [
    {
      id: "2_2_reinicio_img_1",
      url: "./images/extracted/2_2_reinicio_img_1.png",
      title: "Evidencia Visual 1 (2 2 reinicio)",
      description: "Imagen extraÃ­da del documento original: 2 2 reinicio.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["reinicio", "local", "docs", "2 2 reinicio"]
  },
  {
    id: "2_3_Booteo",
    title: "2 3 Booteo",
    category: "DocumentaciÃ³n Local / Originales Arranque",
    lastUpdated: "2026-08-06",
    content: "2.3.- Booteo Booteo. Posterior al segundo estado de validación que realiza la tarjeta; esta ya no realiza ningún reinicio, sino que entra a estado de booteo en donde cada uno de los leds indicadores toma un color específico. [IMAGE_PLACEHOLDER_1] Como pueden observar los leds encargados de indicar el booteo de todos los GFCs se encienden de verde; mientras que, el led del Heartbeat (LD5) y el led del indicador del estatus del BMC (LD9) encienden en azul de forma uniforme. Todo esto ocurre mientras que los demás indicadores que ya se encontraban en verde no se apagan, a excepción de los leds indicadores de los ICI1 yICI4 (LD18_X y LD19_X) de cada uno de los GFCs. Durante este proceso los leds PCIE de los GFCs 2 y 3 (LD58 y LD61 consecutivamente) parpadean durante los próximos 3-5 minutos. Pasando este proceso se agregan los demás leds que faltaban de encender (el led LD60 del GFC1, el led LD57 del GFC0 y el led LD59 del BMC) indicando la buena inicialización del booteo. Además de esto el led LD5 (El led indicador del \"heartbreat\" de la unidad) parpadea; indicando así el buen booteo e inicialización de la unidad. José Mercado.",
    photos: [
    {
      id: "2_3_Booteo_img_1",
      url: "./images/extracted/2_3_Booteo_img_1.png",
      title: "Evidencia Visual 1 (2 3 Booteo)",
      description: "Imagen extraÃ­da del documento original: 2 3 Booteo.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["booteo", "local", "docs", "2 3 booteo"]
  },
  {
    id: "21_Validacion",
    title: "2.1 Validacion",
    category: "DocumentaciÃ³n Local / Originales Arranque",
    lastUpdated: "2026-08-06",
    content: "2.1.- Validación Validación. Posterior a la energización e inicialización de la unidad, esta realiza diversas validaciones tanto de voltaje como el estatus del Booteo en diversas partes de la misma. Esto lo podemos observar en el estado de los leds, ya que estos cambian de color rojo a color verde (LD14_X) o azul (LD9 y LD5) y el apagado de algunos de los leds mencionados anteriormente (LD8). [IMAGE_PLACEHOLDER_1] Además, se encienden dos leds encargados de indicar el funcionamiento adecuado de los ICI1 e ICI4 de cada uno de los GFCs (LD18_X y LD19_X). [IMAGE_PLACEHOLDER_2] Así mismo y en observación, también podemos ver el encendido en naranja de 1 o 2 y en verde de 1 o 2 de los leds encargados de indicar el funcionamiento de los 3 chips internos de cada uno de los GFCs (LD20_X para Chiplet Boot, LD21_X para Main Die 1 boot y LD22_X para Main Die 0 boot). [IMAGE_PLACEHOLDER_3] Posterior a ello y validando la inicialización de los 4 ASICs (GFCs), la unidad cambia el estado de los leds mencionados a verde (caso de los Leds encargados de indicar el funcionamientos de los chips de cada GFC) y enciende otros dos leds nuevos (LD58 y LD61) en verde que parpadean durante unos segundos. José Mercado.",
    photos: [
    {
      id: "21_Validacion_img_1",
      url: "./images/extracted/21_Validacion_img_1.jpeg",
      title: "Evidencia Visual 1 (2.1 Validacion)",
      description: "Imagen extraÃ­da del documento original: 2.1 Validacion.docx",
      type: "general",
      status: "general"
    },
    {
      id: "21_Validacion_img_2",
      url: "./images/extracted/21_Validacion_img_2.png",
      title: "Evidencia Visual 2 (2.1 Validacion)",
      description: "Imagen extraÃ­da del documento original: 2.1 Validacion.docx",
      type: "general",
      status: "general"
    },
    {
      id: "21_Validacion_img_3",
      url: "./images/extracted/21_Validacion_img_3.png",
      title: "Evidencia Visual 3 (2.1 Validacion)",
      description: "Imagen extraÃ­da del documento original: 2.1 Validacion.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["2.1", "validacion", "local", "docs", "2.1 validacion"]
  },
  {
    id: "Guia_para_us_del_programador_y_ADI_Power_Studio",
    title: "Guia para usó del programador y ADI Power Studio",
    category: "DocumentaciÃ³n Local / Originales Arranque",
    lastUpdated: "2026-08-06",
    content: "Guía ADI Power Studio para detectar problema en la secuencia de encendido. (By Gerardo Santiago-Técnico en análisis de Fallas) TOC \\\\o \"1-9\" \\\\z \\\\u \\\\hADI Power StudioPAGEREF _Toc629168710 \\\\h2 IntroducciónPAGEREF _Toc1663663317 \\\\h3 Programación de ADMPAGEREF _Toc1401179063 \\\\h9 Cargado de archivos al dispositivo ADMPAGEREF _Toc1716869889 \\\\h13 Lectura de tiempo real de voltajes:PAGEREF _Toc768156117 \\\\h15 BLACKBOX:PAGEREF _Toc541595227 \\\\h17 Sequence Wizard:PAGEREF _Toc1992555895 \\\\h21 Build Sequence:PAGEREF _Toc518890687 \\\\h25 1. Enter ActionPAGEREF _Toc534084216 \\\\h26 2. Loop ActionPAGEREF _Toc1670850777 \\\\h27 Resolución de problemas de voltajes VLP y GLP.PAGEREF _Toc13350632 \\\\h28 Comprendiendo la Secuencia de Voltajes y su Relación con la Inicialización del CanalPAGEREF _Toc1070214921 \\\\h29 Aplicación del ADM1266 en la Supervisión y Secuenciación de VoltajesPAGEREF _Toc615547917 \\\\h30 Falla en voltaje de 12VPAGEREF _Toc347022837 \\\\h31 Método Práctico para Validar el Funcionamiento del ReguladorPAGEREF _Toc144162933 \\\\h33 Acceso a Registros ADI y Análisis de Fallas en la SecuenciaPAGEREF _Toc765802866 \\\\h35 Importancia de Revisar el Bloque Anterior en la SecuenciaPAGEREF _Toc1232726121 \\\\h37 Truco Rápido para Diagnóstico de VCORE en GLPPAGEREF _Toc449019475 \\\\h37 Método:PAGEREF _Toc1163013831 \\\\h38 Nota FinalPAGEREF _Toc1442032741 \\\\h40 ADI Power Studio Introducción Esta es una guía rápida para el uso del programa ADI Power Studio para programar y detectar errores en el encendido de los canales. Prime paso: Abrir la aplicación desde el menú de inicio. [IMAGE_PLACEHOLDER_1] Al dar clic en la aplicación no abrirá la siguiente ventana: [IMAGE_PLACEHOLDER_2] Debemos de conectar el programados al puesto USB de la computadora y validar si es reconocido el dispositivo. Podemos validar dando clic en el siguiente icono [IMAGE_PLACEHOLDER_3] [IMAGE_PLACEHOLDER_4] Nos deberá aparecer la siguiente ventana [IMAGE_PLACEHOLDER_5] En esta misma podemos visualizar si hay algún dispositivo conectado, en la ventana anterior observemos que está en blanco por lo cual o no tenemos el dispositivo conectado o no se reconoce el dispositivo, (Comunícate con tu Coordinador para que te apoye con la instalación, o puedes buscar el Driver en la carpeta de Box) Si se realiza correctamente la instalación deberíamos de obtener lo siguiente: [IMAGE_PLACEHOLDER_6] Ahora nos aparece el dispositivo programador, después será necesario hacer la alimentación de la unidad para empezar a tomar los datos. El programador cuenta con 3 pines, SDA, SCL y GND. Es necesario ubicar en nuestro esquemático como en el CAD como se debe posicionar cada pin. A continuación, un ejemplo de donde se ubican las líneas de SCL y SDA [IMAGE_PLACEHOLDER_7] [IMAGE_PLACEHOLDER_8] Al realizar la conexión nos debe aparecer la dirección del dispositivo [IMAGE_PLACEHOLDER_9] Programación de ADM Debemos de seleccionar la siguiente opción para abrir el archivo a cargar [IMAGE_PLACEHOLDER_10] Nos abrirá la siguiente ventana y continuando con el ejemplo anterior del U84 abrimos la siguiente carpeta [IMAGE_PLACEHOLDER_11] Al dar clic, podemos encontrar la carpeta vacía por lo cual será necesario cambiar el tipo de archivo que buscamos(.hex) [IMAGE_PLACEHOLDER_12] Al darle en open la ventana de software debe de cambiar por la siguiente [IMAGE_PLACEHOLDER_13] Las opciones que más ocuparemos será las seleccionadas [IMAGE_PLACEHOLDER_14] Cargado de archivos al dispositivo ADM Para realizar el cargado de archivos hacemos clic en el siguiente icono [IMAGE_PLACEHOLDER_15] [IMAGE_PLACEHOLDER_16] Nos saldrá una ventana y solo quedará dar clic en el botón ok para empezar la programación [IMAGE_PLACEHOLDER_17] En la parte inferior izquierda de la ventana nos aparecerá una barra de carga al llenarse se habrá acabado de programar el ADM [IMAGE_PLACEHOLDER_18] Lectura de tiempo real de voltajes: Al dar clic en Monitor y Rail Status podemos entrar en la opción de lecturas de voltajes [IMAGE_PLACEHOLDER_19] Para hacerla en tiempo real será necesario dar clic en el botón de Read Device(s) Status [IMAGE_PLACEHOLDER_20] [IMAGE_PLACEHOLDER_21] Y podemos observar una tabla con los voltajes y el estado como a continuación [IMAGE_PLACEHOLDER_22] [IMAGE_PLACEHOLDER_23] BLACKBOX: La opción de Blackbox nos permitirá tomar los registros que tiene el dispositivo ADM, esta opción es muy importante porque podremos observar el comportamiento de las líneas de voltaje en todos los encendidos y que problemas se han registrado. Pera ello damos clic en Monitor y después el Blackbox [IMAGE_PLACEHOLDER_24] No aparecerá la siguiente ventana [IMAGE_PLACEHOLDER_25] Para entrar al registro debemos de irnos en la parte que dice Blackbox Record y dar clic en el icono de Read records from hadware [IMAGE_PLACEHOLDER_26] [IMAGE_PLACEHOLDER_27] Nos aparecerá el número de registro la fecha ciclo de encendido y estado [IMAGE_PLACEHOLDER_28] Para eliminar los registros damos clic en Erase records Al dar clic en los registros se nos reflejara en las tablas las líneas de voltaje cuanta con algún problema en el siguiente ejemplo vemos alarmado el nodo BMC_L0SEQ_READY [IMAGE_PLACEHOLDER_29] [IMAGE_PLACEHOLDER_30] Sequence Wizard: En esta sección podemos observar los nodos que se activa y el orden de arranque, para ello solo con dar clic en Supply Order se ordenarán. [IMAGE_PLACEHOLDER_31] Continuando con el mismo ejemplo de componente se deberá ver de la siguiente manera [IMAGE_PLACEHOLDER_32] Si prestamos atencion hay números repetidos en la columna Supply Order, por ejemplo: El valor 3 aparece varias veces (FAN_HSWAP_PGOOD, VDD_PSX_0R95, VDD_STBY_1R8). El valor 4 también aparece varias veces. Esto no es un error, sino que indica que esas fuentes se encienden en paralelo dentro del mismo paso de secuencia. Es decir: Todas las fuentes con Supply Order = 3 se habilitan al mismo tiempo, después de que las fuentes con orden 2 hayan completado su secuencia. Luego, las fuentes con Supply Order = 4 se habilitan juntas, y así sucesivamente. En otras palabras: define grupos de encendido. Si el número se repite, significa que esas fuentes pertenecen al mismo grupo y se activan simultáneamente. Esto se usa para optimizar el tiempo de arranque y cumplir dependencias lógicas (por ejemplo, primero habilitar voltajes base, luego secundarios). “Podemos usar el esquemático para apoyarnos a localizar los nodos y las resistencias que conectan con los reguladores” [IMAGE_PLACEHOLDER_33] [IMAGE_PLACEHOLDER_34] Build Sequence: Para entrar en la opción de Build Sequences será necesario dar clic en Sequencing y después en Build Sequences . [IMAGE_PLACEHOLDER_35] En esta sección podemos encontrar mucha información que nos puede ser muy útil si sabemos manipularla, ya que nos permitirá cambiar las condiciones de encendido, como requisitos, el orden de encendido entre otras más configuraciones, esto solo con la intención de poder tomar mediciones de reguladores de voltaje para encontrar en que parte del encendido se pierda la secuencia o que provoca ello. “Se requiere tener mucha precaución ya que cambiar una condicional sin simular el funcionamiento puede generar sobrecalentamientos en reguladores de voltaje si esta se encuentra dañado, convirtiéndose es explosiones eléctricas que pueden dañar la PCB” [IMAGE_PLACEHOLDER_36] 1. Enter Action Esta sección indica qué acciones se ejecutan inmediatamente al entrar en este estado. Inicializar variables y señales: SET Timer@44 = 0 ms → Reinicia el temporizador. SET LSEQ_BMC_RST_L = LOW, SET LSEQ_HSWAP_RESTART = LOW, etc. → Configura señales de control en bajo. Configurar flags y habilitar/deshabilitar señales: SET LSEQ_LISEQ_SPARE_X = LOW → Señales de repuesto en bajo. SET GLC_LISEQ_APP_PERST_DET_L = HIGH → Señal de detección en alto. DISABLE VDD_PSX_0R95, VDD_PSX_1R8, ... → Deshabilita varias fuentes de alimentación. En resumen: La sección Enter Action prepara el sistema para este estado, asegurando que las señales y fuentes estén en la condición correcta antes de continuar. 2. Loop Action Esta sección define qué acciones se ejecutan repetidamente mientras el sistema permanece en este estado. IF (HSWAP_PGOOD_L0SEQ == OK) GOTO ST_VDD_12R0 → Si la señal HSWAP indica que está bien, pasa al siguiente estado (ST_VDD_12R0). IF (Timer@44 &gt; 50 ms) GOTO ST_PWR_FAULT_PW → Si el temporizador supera 50 ms sin que la condición anterior se cumpla, salta a un estado de fallo (ST_PWR_FAULT_PW). En resumen: La sección Loop Action monitorea condiciones y decide si: Avanza al siguiente estado. O entra en un estado de error si el tiempo límite se excede. Con esto nos podemos hacer una idea de cómo manipular la secuencia únicamente para detectar problemas en el encendido siempre y cuando se tenga la precaución necesaria y sobre todo no se tenga problemas de baja impedancia ya que esto puede dañar PCBA, Líneas o IC de voltajes. Resolución de problemas de voltajes VLP y GLP. En esta sección se presentará una metodología general para la localización de fallas utilizando ADI Power Studio. Es importante destacar que este procedimiento no garantiza la solución completa del problema, ya que será necesario observar, medir y validar las líneas de voltaje para confirmar si la hipótesis planteada es consistente y puede conducir a una solución efectiva. El objetivo principal es proporcionar al técnico bases sólidas que permitan justificar de manera eficiente cualquier reemplazo o prueba, minimizando riesgos que puedan comprometer la integridad de la PCB o dañar otros canales de la misma unidad. Para ello, esta segunda parte de la guía se enfocará inicialmente en los fundamentos para identificar la falla y, posteriormente, en diversas soluciones basadas en procedimientos previamente validados, que han demostrado ser efectivos para la localización de fallas. Comprendiendo la Secuencia de Voltajes y su Relación con la Inicialización del Canal Para entender correctamente el comportamiento del sistema, es fundamental diferenciar la secuencia de encendido de voltajes de la inicialización del canal. Una forma práctica de visualizarlo es considerar la secuencia de voltajes como una cadena de bloques: si cada bloque cumple su función, el voltaje será estable. Esta etapa es independiente de la inicialización del canal, aunque están relacionadas, ya que el canal solo se inicializa cuando la cadena de voltajes se ha completado. Este concepto es crítico para diagnosticar fallas en interfaces como JTAG o I²C, donde una interrupción en la secuencia puede impedir la correcta inicialización. Comprender esta relación permitirá identificar problemas de manera más precisa y evitar diagnósticos erróneos. En la primera parte del análisis, enfocada en GLP sobre el IC U84, se destacó la importancia de entender cómo se activa cada regulador y cómo esta secuencia impacta en el sistema. Para ello, una herramienta clave es ADI Power Studio, especialmente la función BlackBox, que permite registrar y analizar la secuencia de encendido, facilitando la identificación de irregularidades. Aplicación del ADM1266 en la Supervisión y Secuenciación de Voltajes Comprender este concepto no se limita a un solo modelo, ya que puede aplicarse tanto en plataformas VLP, GLP o cualquier producto que utilice un ADM, el cual funciona como un supervisor y secuenciador digital de alimentación (Power Sequencer and Monitor). Ahora bien, iniciemos con lo básico: sabemos que la unidad se alimenta con 54 V, pero ¿cómo se distribuyen estos voltajes? La mayoría de las fallas están relacionadas con problemas en las líneas principales: 54 V, 12 V, 5 V, 3.3 V y 1.8 V, por mencionar las más críticas. Surge entonces la pregunta: ¿cómo identificar qué voltaje está fallando? Para ello, debemos separar dos escenarios: ¿Es posible acceder a los registros de ADI con la unidad encendida? Si la respuesta es sí, aplicaremos un método que explicaré más adelante. Si la respuesta es no, entonces estamos ante un problema que requiere un enfoque diferente, el cual abordaré de manera clara y sencilla en esta sección. Falla en voltaje de 12V Cuando la línea de VDD_12R0 en GLP o alguna de la VDD_VLC_10R8 en VLP están caídas o es bajo el voltaje necesitamos asegura las fuentes principales en GLP el U81 y en VLP validar si es U18 o U21 o ambos, para ello es necesario entender la parte básica de un regular en palabras simples, podemos decir que un regulador de voltaje consta de: Voltaje de entrada (Vin) Debe ser mayor que el voltaje de salida deseado (en reguladores lineales) o adecuado para el rango de operación (en reguladores conmutados). Pin de habilitación (Enable / EN) Este pin debe estar en nivel lógico alto (o según especificación) para activar el regulador. Si está en bajo, el regulador permanece apagado. Referencia interna o externa El regulador compara la salida con una referencia para mantener el voltaje estable. Carga conectada (Output) El regulador entrega energía a la carga, que puede ser un circuito o dispositivo. Retroalimentación (Feedback) Permite al regulador ajustar la salida para mantener el voltaje correcto. Con ello ya tenemos lo necesario para empezar a trabajar con la mayoría de las fallas. Para mí el favorito es usando como ejemplo el U81 de GLP. Ya que podemos resumirlo de manera muy rápida y sencilla [IMAGE_PLACEHOLDER_37] Análisis Básico del Regulador: Entrada, Enable y Salida En la imagen se observan tres elementos clave: Entrada de 54 V Pin de habilitación (Enable) Salida de 12 V Con estos datos es posible realizar un diagnóstico inicial rápido. En términos simples: Si no hay entrada, no habrá salida. Si hay entrada, pero el Enable está desactivado, no habrá salida. Si hay Enable pero no hay entrada, tampoco habrá salida. Si ambos están presentes (entrada y Enable), por lógica debería existir salida. ¿Qué ocurre si no hay salida, aunque tengamos entrada y Enable activos? Este escenario indica que el regulador está recibiendo las condiciones básicas para operar, pero no está cumpliendo su función. Las causas más comunes pueden ser: Falla interna del regulador (circuito dañado). Protección activa (sobrevoltaje, sobre corriente o temperatura). Problemas en la retroalimentación (Feedback) que impiden regular el voltaje. Componentes externos defectuosos (condensadores, inductores en reguladores conmutados). Cortocircuito en la carga que provoca apagado por protección. Truco Rápido Método Práctico para Validar el Funcionamiento del Regulador Un procedimiento útil para determinar si un regulador está operativo consiste en realizar la siguiente prueba: Desconectar la unidad para evitar interferencias con otros circuitos. Inyectar un voltaje controlado (por ejemplo, 12 V) con bajo amperaje directamente en el nodo de salida del regulador. Observar el comportamiento del voltaje inyectado: Si el voltaje cae rápidamente, existe un componente en la línea que está provocando la caída (posible corto o fuga). Si el voltaje se mantiene estable, el regulador no está funcionando correctamente, ya que no hay consumo significativo ni regulación activa. “Este método no es una solución definitiva, pero permite identificar de manera rápida si el problema está en el regulador o en la carga asociada.” Este método permite determinar rápidamente si el problema está en el regulador o en el nodo. La misma técnica se aplicará en diferentes puntos del circuito para identificar la causa de la falla. Sin embargo, es fundamental conocer siempre dos aspectos antes de realizar cualquier diagnóstico: La configuración del pin Enable (si es Active HIGH o Active LOW). La presencia del voltaje de entrada en el regulador. Estos parámetros son la base para interpretar correctamente el comportamiento del regulador y evitar conclusiones erróneas. En el caso del U81. [IMAGE_PLACEHOLDER_38] Este circuito decide cuándo habilitar el regulador de 12 V. Funciona así: Hay tres cosas importantes: Entrada de 54 V, el pin Enable, y la salida de 12 V. La configuración actual es Active LOW, lo que significa que el regulador se activa cuando la señal de habilitación está en nivel bajo. ¿Quién controla esto? La señal HSWAP_PGOOD. Cuando indica que todo está bien (Power Good), activa el MOSFET Q27, y este pone el pin Enable en bajo. Resultado: el regulador se enciende y entrega los 12 V. Si la señal no cambia o el MOSFET no conmuta, el regulador no se habilita. Acceso a Registros ADI y Análisis de Fallas en la Secuencia Retomemos la pregunta inicial: ¿Es posible acceder a los registros de ADI con la unidad encendida? Cuando la respuesta es sí, el análisis se vuelve más complejo, pero sigue siendo sencillo si se aplica el método correctamente. Paso 1: Comprender BlackBox Antes de continuar, es fundamental entender la herramienta BlackBox de ADI Power Studio. Esta función permite registrar eventos y estados durante la secuencia de encendido, lo que facilita identificar en qué punto ocurre la falla. Si aún no lo has revisado, vuelve a la sección de esta guía dedicada a BlackBox. Paso 2: Analizar los Registros Una vez que comprendas BlackBox, revisa los registros para identificar qué voltaje está fallando. Por ejemplo: ST_FAN_HSWAP_PGOOD_VDD_PSX_0R95 ST_VDD_BMC_2R5_VDD_BMC_3R3 Estos nombres corresponden a estados dentro de la secuencia. Si detectas que falla en el nodo ST_VDD_BMC_2R5_VDD_BMC_3R3, el siguiente paso es ir a Build Sequences y analizar el código asociado. Paso 3: Revisar Build Sequences En Build Sequences, cada estado define: [IMAGE_PLACEHOLDER_39] Enter Action: Acciones al entrar en el estado (habilitación, temporizadores, señales). Loop Action: Condiciones que se evalúan mientras el estado está activo (verificación de Power Good, temporizadores, transición a otro estado o a error). Esto permite entender qué condiciones deben cumplirse para avanzar y por qué el sistema se detiene en ese punto. Importancia de Revisar el Bloque Anterior en la Secuencia Algo que siempre debes considerar es el estado anterior en la secuencia. Por ejemplo, si el nodo ST_VDD_BMC_2R5_VDD_BMC_3R3 presenta una falla, no significa necesariamente que el problema esté en ese bloque. Puede ocurrir que el paso anterior no se haya completado correctamente, lo que provoca que la falla se refleje en el nodo actual. En otras palabras: Si el bloque anterior falla, el siguiente estado no podrá activarse, y el error se manifestará en el punto donde la secuencia se detiene. Por ejemplo, si ST_FAN_HSWAP_PGOOD_VDD_PSX_0R95 no cumple sus condiciones, la falla podría aparecer en ST_VDD_BMC_2R5_VDD_BMC_3R3, aunque el origen real esté en el bloque previo. Por eso, analizar la dependencia entre estados en Build Sequences es clave para diagnosticar correctamente. Cada estado tiene condiciones que dependen del anterior, y entender esta relación evita reemplazos innecesarios o diagnósticos erróneos. Truco Rápido para Diagnóstico de VCORE en GLP Muchas de las fallas de voltaje en plataformas VLP y GLP están relacionadas con el nodo VCORE. Sin embargo, este método aplica únicamente para GLP. Cuando validamos los registros de BlackBox y confirmamos que el voltaje VCORE falla, debemos considerar que hay cuatro componentes involucrados según el canal: U21_X, U24_X, U25_X y U26_X. Este truco se enfoca en descartar o confirmar fallas en los reguladores U24_X y U25_X. Para ello: Procedimiento Descartar problemas de impedancia en el nodo antes de cualquier prueba. Medir la salida de los reguladores: Deben entregar aproximadamente 6.7 V. Si no es posible medir este voltaje directamente, aplicamos el siguiente método. Método: Inyectar 3 V con bajo amperaje en el nodo VCORE_IBC_PGOOD_SEQ: Esto simula el correcto funcionamiento del nodo, evitando que la cadena de encendido se interrumpa por el ADM. Usar cámara térmica para observar el comportamiento: [IMAGE_PLACEHOLDER_40] El regulador que no disipa calor está inactivo o fallando. El regulador que responde térmicamente está operativo. ¿Por qué funciona este método? El nodo VCORE_IBC_PGOOD_SEQ actúa como señal de validación para los reguladores. Al inyectar 3 V, simulamos que el nodo está en buen estado, lo que permite que la secuencia continúe sin bloquearse por el ADM. Esto nos da tiempo para identificar, mediante la respuesta térmica, cuál regulador está trabajando y cuál no. [IMAGE_PLACEHOLDER_41] Nota Final Lo que hemos visto hasta ahora representa solo una parte de las fallas relacionadas con la secuencia de voltajes en las unidades VLP y GLP. Aún queda mucho por documentar, incluyendo: Funcionamiento de las fases en VLP y GLP (módulos de potencia). Cómo opera el PWM sobre las fases en ambas plataformas. Métodos para descartar el regulador U26_X y validar su señal PWM. Cambios y ajustes en secuencias probadas en ADM para mantener voltajes habilitados durante pruebas. Diagnóstico avanzado de reguladores, incluyendo la validación y descarte de U13_X (otro PWM crítico). Todo esto lo estoy desarrollando porque he analizado la estructura del nuevo modelo y he detectado muchas similitudes con las arquitecturas actuales. Esta guía es solo una parte de un trabajo más amplio que estoy documentando y perfeccionando, con el objetivo de aportar herramientas prácticas y confiables para el diagnóstico. Espero que esta información sea útil y que sirva como base para seguir mejorando los procesos de análisis y reparación.",
    photos: [

    ],
    keywords: ["guia", "para", "usó", "del", "programador", "adi", "power", "studio", "local", "docs", "guia para usó del programador y adi power studio"]
  },
  {
    id: "NOTA_Secuencia_primaria",
    title: "NOTA Secuencia primaria",
    category: "DocumentaciÃ³n Local / Originales Arranque",
    lastUpdated: "2026-08-06",
    content: "NOTA Secuencia primaria Este apartado es para agregar información vital a lo ya mencionado en la secuencia primaria en la sección anterior. En ambos modelos, hay un par de voltajes que siempre pasan desapercibidos ya que no está incluido en ningún archivo de secuencia, pero sí viene mencionado en el ADI o el esquemático. Si la persona lectora no está familiarizada con el programa mencionado, con su uso o con la forma de visualizar la información descrita a continuación, puede consultar la guía elaborada por el compañero Gerardo Santiago. Dicho documento proporciona una explicación detallada y aclara cualquier duda relacionada con el contenido de este apartado. Guia para usó del programador y ADI Power Studio.docx Comenzaremos esta sección haciendo mención al primer voltaje \"escondido\" que se encuentra tanto en GLP como en GF. Se trata de la señal \"FAN_HSWAP_PGOOD\", es la bandera que recibe el secuenciador primario para saber que los ventiladores están recibiendo correctamente sus respectivos 54V así como su consumo de corriente esta correcta. [IMAGE_PLACEHOLDER_1] ¿Cómo afecta esta señal a la secuencia y por qué no viene incluida en ningún archivo? La respuesta rápida a lo segundo es: No lo sabemos. Pero esta omisión de la información sucede en ambos modelos, puede que incluso suceda desde VLP, el predecesor de GLP. En cuanto al cómo afecta a la secuencia, podemos validarlo en el apartado de \"Build sequence\" y \"Sequence wizard\" del ADI. El primero nos dejará verificar la secuencia de voltajes, o los que se mostrará su status en el \"Black box\": [IMAGE_PLACEHOLDER_2] Con esto, verificamos que ni siquiera en estos apartados encontramos el voltaje mencionado. Sin embargo, podremos hallarlo navegando en el \"Build sequence\", donde aparece como una condicional PREVIA para poder habilitar el inicio de la secuencia de voltajes primarios (ST_MECH_POWER), así como también en el paso siguiente (ST_PSX_POWER), aparece la condición de que si el pgood de dicha señal está en bajo (o que no esté presente), se deshabilitan los voltajes primarios (GOTO FAIL_POWER). [IMAGE_PLACEHOLDER_3] [IMAGE_PLACEHOLDER_4] Con esto confirmamos la importancia de validar esta señal siempre que tengamos un problema en los voltajes primarios antes de validar si la falla es algún voltaje de la secuencia que nos esté mostrando el blackbox. Recordemos que esta validación aplica también en GLP. Continuaremos con el siguiente voltaje \"escondido\". Esta vez, se trata de la señal \"TITAN0_RESET_L\" la cual podemos ver como el primer enable del U71, componente vital para el booteo del BMC.En este caso, este voltaje no nos afectará a la secuencia de voltajes como tal, sino al booteo de la unidad, algo a lo que tendrán como referencia en el Tema 2 de este bloque. Este voltaje solo viene mencionado en la secuencia, aunque está casi al final de la misma, lo que podría provocar una confusión, puesto que si seguimos las líneas punteadas, inicia al mismo tiempo que 3.3V como se aprecia en las imágenes a continuación: [IMAGE_PLACEHOLDER_5] [IMAGE_PLACEHOLDER_6] Es importante recordar que, ante cualquier falla durante el proceso de arranque, resulta fundamental verificar la habilitación del componente U71. Omitir esta validación puede originar problemas relacionados con la línea de 3.3 V o con la resistencia que realiza el puente correspondiente. Finalmente, para resumir el contenido de esta sección, hay voltajes que no están presentes u ordenados en la secuencia como deberían, por lo que al ordenarlos correctamente quedarían de la siguiente forma: [IMAGE_PLACEHOLDER_7] Los rieles de voltaje en azul significa que entran al mismo tiempo. Emanuel Domínguez",
    photos: [
    {
      id: "NOTA_Secuencia_primaria_img_1",
      url: "./images/extracted/NOTA_Secuencia_primaria_img_1.png",
      title: "Evidencia Visual 1 (NOTA Secuencia primaria)",
      description: "Imagen extraÃ­da del documento original: NOTA Secuencia primaria.docx",
      type: "general",
      status: "general"
    },
    {
      id: "NOTA_Secuencia_primaria_img_2",
      url: "./images/extracted/NOTA_Secuencia_primaria_img_2.png",
      title: "Evidencia Visual 2 (NOTA Secuencia primaria)",
      description: "Imagen extraÃ­da del documento original: NOTA Secuencia primaria.docx",
      type: "general",
      status: "general"
    },
    {
      id: "NOTA_Secuencia_primaria_img_3",
      url: "./images/extracted/NOTA_Secuencia_primaria_img_3.png",
      title: "Evidencia Visual 3 (NOTA Secuencia primaria)",
      description: "Imagen extraÃ­da del documento original: NOTA Secuencia primaria.docx",
      type: "general",
      status: "general"
    },
    {
      id: "NOTA_Secuencia_primaria_img_4",
      url: "./images/extracted/NOTA_Secuencia_primaria_img_4.png",
      title: "Evidencia Visual 4 (NOTA Secuencia primaria)",
      description: "Imagen extraÃ­da del documento original: NOTA Secuencia primaria.docx",
      type: "general",
      status: "general"
    },
    {
      id: "NOTA_Secuencia_primaria_img_5",
      url: "./images/extracted/NOTA_Secuencia_primaria_img_5.png",
      title: "Evidencia Visual 5 (NOTA Secuencia primaria)",
      description: "Imagen extraÃ­da del documento original: NOTA Secuencia primaria.docx",
      type: "general",
      status: "general"
    },
    {
      id: "NOTA_Secuencia_primaria_img_6",
      url: "./images/extracted/NOTA_Secuencia_primaria_img_6.png",
      title: "Evidencia Visual 6 (NOTA Secuencia primaria)",
      description: "Imagen extraÃ­da del documento original: NOTA Secuencia primaria.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["nota", "secuencia", "primaria", "local", "docs", "nota secuencia primaria"]
  },
  {
    id: "Desbloqueo_Modificado",
    title: "Desbloqueo Modificado",
    category: "DocumentaciÃ³n Local / GFC0_FW_UNBLOCK",
    lastUpdated: "2026-08-06",
    content: "Desbloqueo_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Procedimiento de Desbloqueo de ASIC / Recuperación de FirmwareUSO:Restaurar la detección de firmware en ASICs GFC cuando aparecen errores de firmware desconocido o GhostFish Process Crash.APLICA CUANDO:- GFC0_FW.- GhostFish Process Crash.- gfcX-fw-version FAILED.- The TpuStatusInterface is not set.- Unknown version detectado en list_firmware.sh.AREA:ISTDEBUGFIRMWAREASICGBMCKEYWORDS:gfc-fw-versionGhostFish Process Crashlist_firmware.shTpuStatusInterfacecom.google.tpu_managerdevice_startup_log.jsonFirmware RecoveryRESUMEN:Este procedimiento permite recuperar ASICs que aparecen bloqueados y no reportan correctamente la versión de firmware. El síntoma principal es que list_firmware.sh muestra 'Unknown version: fishlib service failure The TpuStatusInterface is not set'. citeturn49search1SINTOMAS:- gfc0-fw-version FAILED.- gfc1-fw-version FAILED.- gfc2-fw-version FAILED.- gfc3-fw-version FAILED.- Firmware desconocido.- The TpuStatusInterface is not set. citeturn49search1VALIDACION INICIAL:Revisar en Radix los síntomas de firmware y confirmar que todos los GFC muestran versión desconocida. citeturn49search1COMANDO DE VALIDACION:list_firmware.shCRITERIO DE FALLA:GFC_X = Unknown version: fishlib service failure The TpuStatusInterface is not set. citeturn49search1PROCEDIMIENTO DE DESBLOQUEO:1. Conectarse por SSH al equipo.2. Ejecutar:rm /etc/accel-oob/device_startup_log.json3. Reiniciar el servicio:systemctl restart com.google.tpu_manager4. Esperar aproximadamente 3 minutos.5. Ejecutar nuevamente list_firmware.sh. citeturn49search1CRITERIO DE RECUPERACION:Los ASIC deben reportar correctamente la versión de firmware, por ejemplo:- GFC_0 2026.8.4.0- GFC_1 2026.8.4.0- GFC_2 2026.8.4.0- GFC_3 2026.8.4.0 citeturn49search1COMO CONFIRMAR:- Ejecutar list_firmware.sh.- Validar que ningún GFC muestre Unknown version.- Confirmar que todas las versiones sean visibles.- Ejecutar nuevamente la prueba correspondiente. citeturn49search1CAUSAS PROBABLES:- Corrupción temporal del startup log.- Servicio TPU Manager sin inicialización correcta.- Estado inconsistente de firmware.ACCION CORRECTIVA:- Borrar device_startup_log.json.- Reiniciar TPU Manager.- Validar firmware nuevamente.- Continuar con pruebas funcionales.RELACIONADO CON:- GFC0_FW- GhostFish Process Crash- Firmware Validation- TPU Manager- GBMCSALIDA ESPERADA:Recuperar la detección correcta del firmware de todos los ASICs GFC sin necesidad de reemplazar hardware. Desbloqueo Monday, March 30, 2026 3:57 PM En esta entrada solo se abarca el proceso para desbloquear los Asics de las unidades que fallen de GFC0_FW o GhostFish Process Crash. Para más información de la falla dirigirse a la sección de \"modos de falla\" Se puede revisar en los síntomas de la falla si los ASICs se encuentra bloqueados al presentarse de esta forma en Radix [IMAGE_PLACEHOLDER_1] [IMAGE_PLACEHOLDER_2] [IMAGE_PLACEHOLDER_3] [IMAGE_PLACEHOLDER_4]",
    photos: [
    {
      id: "Desbloqueo_Modificado_img_1",
      url: "./images/extracted/Desbloqueo_Modificado_img_1.png",
      title: "Evidencia Visual 1 (Desbloqueo Modificado)",
      description: "Imagen extraÃ­da del documento original: Desbloqueo_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Desbloqueo_Modificado_img_2",
      url: "./images/extracted/Desbloqueo_Modificado_img_2.png",
      title: "Evidencia Visual 2 (Desbloqueo Modificado)",
      description: "Imagen extraÃ­da del documento original: Desbloqueo_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Desbloqueo_Modificado_img_3",
      url: "./images/extracted/Desbloqueo_Modificado_img_3.png",
      title: "Evidencia Visual 3 (Desbloqueo Modificado)",
      description: "Imagen extraÃ­da del documento original: Desbloqueo_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Desbloqueo_Modificado_img_4",
      url: "./images/extracted/Desbloqueo_Modificado_img_4.png",
      title: "Evidencia Visual 4 (Desbloqueo Modificado)",
      description: "Imagen extraÃ­da del documento original: Desbloqueo_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["desbloqueo", "modificado", "local", "docs", "desbloqueo_modificado"]
  },
  {
    id: "Allegro_Modificado",
    title: "Allegro Modificado",
    category: "DocumentaciÃ³n Local / Modificados",
    lastUpdated: "2026-08-06",
    content: "TIPO:HerramientaUSO:Visualización y análisis de diseños PCB mediante archivos .BRD para localizar componentes, señales, capas y conexiones sin modificar el diseño original.APLICA CUANDO:Se requiere analizar una PCBA, rastrear señales, localizar componentes, validar conexiones, identificar capas Top/Bottom o realizar diagnósticos relacionados con el diseño físico de la tarjeta.AREA:IST, REPARACION, DIAGNOSTICO, ANALISIS DE FALLAS, INGENIERIAKEYWORDS:Allegro, BRD, PCB, PCBA, Cadence, Viewer, Layout, Signal Trace, Net, Component Search, Top Layer, Bottom Layer, DiagnosticoRESUMEN:Documento de uso de Allegro Free Physical Viewer para visualización de PCB, búsqueda de componentes y señales, configuración de capas, filtros, resaltado de nets y creación de scripts para configuraciones personalizadas.USO RAPIDO:1. Abrir Allegro Free Physical Viewer.2. Cargar archivo .BRD.3. Configurar Layers desde Visibility.4. Activar Top/Bottom y Traces necesarios.5. Buscar señales o componentes desde Search.6. Aplicar filtros según sea necesario.7. Utilizar Quick View para localizar componentes.8. Crear scripts para guardar configuraciones frecuentes.------------------------------------------------------------ Allegro l programa a utilizar para el análisis de nuestra PCBA. En esta ocasión estamos utilizando Allegro Free Physical viewer el cual nos permite ver el diseño físico de la PCB, incluyendo capas, componentes y sus conexiones. Sin riesgo de modificaciones accidentales. [IMAGE_PLACEHOLDER_1] El programa debería encontrarse instalado previamente, al igual que el archivo .BRD ubicado en el escritorio. En caso de que alguno de estos elementos no esté disponible, se recomienda consultar el BOX correspondiente para obtenerlos. A continuación se presenta un resumen del uso básico del programa. Se recomienda que el usuario realice cada paso conforme lo va leyendo. Al abrir el archivo .BRD por primera vez, se mostrará la siguiente ventana: [IMAGE_PLACEHOLDER_2] En esta ventana se encuentran tres menús principales que facilitan el proceso de búsqueda, la gestión de propiedades y el control de visibilidad: Visibility, Search y Properties. Además, se muestra el área de trabajo donde se visualiza y analiza el diseño de la PCB. [IMAGE_PLACEHOLDER_3] Antes de comenzar, es necesario dirigirse al menú Visibility y abrir el submenú Layers. Dentro de este menú existen tres secciones principales: Layers, Nets y Display. Estos títulos aparecen cuando el usuario pasa el cursor sobre el ícono correspondiente, lo que permite identificar rápidamente cada categoría y acceder a sus opciones. [IMAGE_PLACEHOLDER_4] Se procede a desactivar todo lo que se muestra en la pantalla presionando el siguiente botón. [IMAGE_PLACEHOLDER_5] Una vez realizado lo anterior, se debe desplegar el menú Objects &amp; Areas y dejar seleccionadas las opciones indicadas a continuación. (Esta recomendación es solo para una visualización básica). [IMAGE_PLACEHOLDER_6] Hasta este momento, aún no se visualiza ningún elemento en el área de trabajo. Al presionar con clic izquierdo la casilla ALL, se mostrará el siguiente resultado: [IMAGE_PLACEHOLDER_7] [IMAGE_PLACEHOLDER_8] El programa puede volverse lento debido a que todas las capas, señales y componentes se encuentran activados. Teniendo esto en cuenta, es posible habilitar únicamente los parámetros necesarios según la tarea que se esté realizando, lo que mejora el rendimiento y facilita el trabajo dentro del área de visualización. [IMAGE_PLACEHOLDER_9] Lo anterior se divide en lo siguiente. [IMAGE_PLACEHOLDER_10] Siguiendo con la configuración, se debe deseleccionar la casilla ALL. Después, en la columna Pins, se deben seleccionar únicamente las casillas Top y Bottom. Finalmente, en la columna Traces, se debe activar nuevamente la casilla ALL. [IMAGE_PLACEHOLDER_11] [IMAGE_PLACEHOLDER_12] [IMAGE_PLACEHOLDER_13] El submenú Display permite controlar la orientación con la que se observa la PCB. Normalmente este se encuentra en la vista TOP, pero al seleccionar Bottom la vista se invierte y el área de trabajo muestra la placa desde la parte inferior. [IMAGE_PLACEHOLDER_14] Seleccionar la orientación correcta es esencial para evitar errores durante el análisis de la PCB. Cuando se revisan componentes o señales ubicados en TOP, es necesario trabajar en la vista TOP y activar la capa superior correspondiente. De la misma manera, para elementos situados en Bottom, se debe cambiar a la vista Bottom y habilitar su capa asociada. Además, este menú también permite elegir si los pads se muestran con relleno o sin él, lo cual puede mejorar la visibilidad dependiendo de las preferencias del usuario y del tipo de análisis que se esté realizando. [IMAGE_PLACEHOLDER_15] Hasta aquí, únicamente se ha configurado la visualización. Para poder desplazarse en el entorno de trabajo tenemos lo siguiente: Zoom: para acercarse o alejar, lo hacemos moviendo el scroll del mouse (rueda de desplazamiento). Desplazarse: Para desplazarse de izquierda a derecha o de arriba hacia abajo, se debe presionar el scroll del mouse y moverlo en la dirección deseada. O con las flechas del teclado ←↑→. Seleccionar: para seleccionar o deseleccionar con el clic izquierdo del mouse. Si presionamos el clic derecho también lo selecciona pero si lo hacemos con una señal nos aparece la opción de hacer que esta se vea en el menú del buscador. (solo se puede en las señales por el hecho de que no tenemos seleccionada la opción de components en el sub menú de propiedades). [IMAGE_PLACEHOLDER_16] Al hacerlo, la señal buscada se mostrará de la siguiente manera. [IMAGE_PLACEHOLDER_17] O si es un componente así: [IMAGE_PLACEHOLDER_18] El inconveniente es que, si se selecciona otra línea u objeto, el resaltado mostrado anteriormente desaparece.. La forma de mantener esto (solo con la señal) es usando el menú de Properties en el sub menú general y seleccionamos la casilla de colores podemos seleccionar un color para esa señal seleccionada. [IMAGE_PLACEHOLDER_19] A partir de este momento, si se selecciona otro elemento, la línea cuyo color fue modificado conservará dicha configuración, lo que permite desplazarse sin perder de vista la señal. [IMAGE_PLACEHOLDER_20] Para regresarla al color predeterminado basta con seleccionar la señal y en el menú de color seleccionar la casilla que se encuentra en el apartado de Presets. [IMAGE_PLACEHOLDER_21] Y así queda [IMAGE_PLACEHOLDER_22] Ahora para Buscar se puede usar el nombre del componente, señal, NP, etc. Aquí obtendrás todos los resultados donde es mencionad@ la señal o componente que estes buscando. Esto lo separa por grupos como se muestra en la imagen siguiente y además en el resultado te pone del lado izquierdo con una franja azul donde es mencionado lo que estas buscando: [IMAGE_PLACEHOLDER_23] Si se hace doble clic en algún dato de la tabla, el programa llevará al usuario a su ubicación y se seleccionara esto dependiendo del grupo en el que nos encontremos (Nota: las cosas de la tabla los podemos copiar con ctrl + C). [IMAGE_PLACEHOLDER_24] Asimismo, en la tabla de resultados se indica la capa en la que se encuentra el elemento seleccionado. [IMAGE_PLACEHOLDER_25] Hasta este punto, ya es posible utilizar Allegro de forma básica para ubicar señales o componentes. EXTRAS: VISTA RÁPIDA Si existe alguna dificultad para ubicar componentes, una alternativa es utilizar la vista rápida una vez identificada la capa (Top o Bottom) en la que se encuentra el componente. Esta se encuentra en el menú de Visibility en la pestaña desplegable de components. [IMAGE_PLACEHOLDER_26] Con esta opción es posible visualizar el nombre de los componentes y su contorno. [IMAGE_PLACEHOLDER_27] Nota importante: Es posible tener ambas capas activas; sin embargo, como recomendación, es preferible trabajar únicamente con la capa correspondiente a la vista seleccionada. En esta pestaña también pueden seleccionar lo que necesiten ver desde serigrafia, pines, contornos, textos y más ya queda usar lo que se adapte a las necesidades del usuario, o usar la vista rápida. FILTROS EN LA BÚSQUEDA: Si es necesario, se pueden filtrar los datos según el tipo de elemento que se esté buscando. Un ejemplo práctico es filtrar por número de parte y por capa. Para realizar estas búsquedas, es importante tener claro qué se desea localizar. en caso del Ejemplo: vamos a buscar cuantas resistencias como R134_0 tenemos en la pcb y cuantas se encuentran en TOP. Con las mismas características (tolerancia,NP,etc). [IMAGE_PLACEHOLDER_28] Para ello, primero se debe buscar el componente que se utilizará como referencia. [IMAGE_PLACEHOLDER_29] Se copia el número de parte y se realiza una búsqueda con él para identificar cuántos componentes comparten dicha referencia. [IMAGE_PLACEHOLDER_30] A continuación, se utilizará un filtro para mostrar únicamente los componentes ubicados en la capa Top. Pasamos el mouse por la columna Layer y nos aparece un símbolo. [IMAGE_PLACEHOLDER_31] Al hacer clic, aparecerá un menú con tres opciones que permiten aplicar el filtro a la columna correspondiente. Usaremos la tercer opción [IMAGE_PLACEHOLDER_32] Al seleccionarlo, se despliega un menú desde el cual se puede elegir la capa deseada. [IMAGE_PLACEHOLDER_33] Una vez seleccionado comienza a cargar y el sistema filtrará todos los elementos ubicados en la capa Top, independientemente de la búsqueda previa, para seguir con nuestro propósito solo es filtrar el número de parte que previamente habíamos copiado en la columna de part number. [IMAGE_PLACEHOLDER_34] Una vez hecho tendríamos el siguiente resultado. [IMAGE_PLACEHOLDER_35] Para eliminar los filtros, se puede regresar a la columna donde se aplicaron y desactivar la casilla, o bien presionar el botón Reset, que restablece todos los resultados. [IMAGE_PLACEHOLDER_36] Nota: Es posible seleccionar todos los componentes de la tabla presionando sobre la cabecera de la columna sin filtro (Part Number). Posteriormente, haciendo clic derecho y seleccionando Select on canvas, todos los componentes se resaltarán en el área de trabajo. Sin embargo, este resaltado desaparecerá al hacer clic en cualquier otra zona. [IMAGE_PLACEHOLDER_37] CREACIÓN DE VISTAS PERSONALIZADAS: Una vez hecha la configuración a gusto del usuario, nos daremos cuenta que si cerramos y abrimos de nuevo el .Brd la configuración que hicimos previamente no se guarda. Esto se debe a que el archivo fuente posee configuraciones predeterminadas, incluidas las asignaciones de color, las cuales se cargan cada vez que se abre el diseño. Para resolver esta situación, es posible crear un script dentro del mismo programa, lo cual permite automatizar la configuración inicial. Lo primero es abrir el programa. [IMAGE_PLACEHOLDER_38] Una vez abierto el programa nos vamos a ir al menú de File [IMAGE_PLACEHOLDER_39] Aquí nos vamos a seleccionar la opción de script. Y nos desplegara el menú siguiente [IMAGE_PLACEHOLDER_40] En este menú vamos a darle un nombre en este caso le daré el nombre ejemplo y seleccionamos la casilla de Macro record mode. Y después le damos a la opción de Record. [IMAGE_PLACEHOLDER_41] Una vez activada la grabación, el menú se cerrará. A partir de este momento, todas las acciones realizadas formarán parte del script. Entonces lo primero que hacemos es abrir nuestro .brd y esperar a que cargue completamente. Una vez cargado la recomendación es hacer los pasos de configuración básica. [IMAGE_PLACEHOLDER_42] Una vez hecha volvemos a abrir el menú de script y le damos clic a la opción de stop para terminar el script. [IMAGE_PLACEHOLDER_43] El script queda almacenado y puede localizarse utilizando la opción Browse, donde se abre un explorador de archivos. [IMAGE_PLACEHOLDER_44] Para ejecutarlo, basta con abrir el archivo del script y presionar la opción Replay. [IMAGE_PLACEHOLDER_45] El uso de scripts queda a criterio de cada usuario. German Escobar",
    photos: [
    {
      id: "Allegro_Modificado_img_1",
      url: "./images/extracted/Allegro_Modificado_img_1.png",
      title: "Evidencia Visual 1 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_2",
      url: "./images/extracted/Allegro_Modificado_img_2.png",
      title: "Evidencia Visual 2 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_3",
      url: "./images/extracted/Allegro_Modificado_img_3.png",
      title: "Evidencia Visual 3 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_4",
      url: "./images/extracted/Allegro_Modificado_img_4.png",
      title: "Evidencia Visual 4 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_5",
      url: "./images/extracted/Allegro_Modificado_img_5.png",
      title: "Evidencia Visual 5 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_6",
      url: "./images/extracted/Allegro_Modificado_img_6.png",
      title: "Evidencia Visual 6 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_7",
      url: "./images/extracted/Allegro_Modificado_img_7.png",
      title: "Evidencia Visual 7 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_8",
      url: "./images/extracted/Allegro_Modificado_img_8.png",
      title: "Evidencia Visual 8 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_9",
      url: "./images/extracted/Allegro_Modificado_img_9.png",
      title: "Evidencia Visual 9 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_10",
      url: "./images/extracted/Allegro_Modificado_img_10.png",
      title: "Evidencia Visual 10 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_11",
      url: "./images/extracted/Allegro_Modificado_img_11.png",
      title: "Evidencia Visual 11 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_12",
      url: "./images/extracted/Allegro_Modificado_img_12.png",
      title: "Evidencia Visual 12 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_13",
      url: "./images/extracted/Allegro_Modificado_img_13.png",
      title: "Evidencia Visual 13 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_14",
      url: "./images/extracted/Allegro_Modificado_img_14.png",
      title: "Evidencia Visual 14 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_15",
      url: "./images/extracted/Allegro_Modificado_img_15.png",
      title: "Evidencia Visual 15 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_16",
      url: "./images/extracted/Allegro_Modificado_img_16.png",
      title: "Evidencia Visual 16 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_17",
      url: "./images/extracted/Allegro_Modificado_img_17.png",
      title: "Evidencia Visual 17 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_18",
      url: "./images/extracted/Allegro_Modificado_img_18.png",
      title: "Evidencia Visual 18 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_19",
      url: "./images/extracted/Allegro_Modificado_img_19.png",
      title: "Evidencia Visual 19 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_20",
      url: "./images/extracted/Allegro_Modificado_img_20.png",
      title: "Evidencia Visual 20 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_21",
      url: "./images/extracted/Allegro_Modificado_img_21.png",
      title: "Evidencia Visual 21 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_22",
      url: "./images/extracted/Allegro_Modificado_img_22.png",
      title: "Evidencia Visual 22 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_23",
      url: "./images/extracted/Allegro_Modificado_img_23.png",
      title: "Evidencia Visual 23 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_24",
      url: "./images/extracted/Allegro_Modificado_img_24.png",
      title: "Evidencia Visual 24 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_25",
      url: "./images/extracted/Allegro_Modificado_img_25.png",
      title: "Evidencia Visual 25 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_26",
      url: "./images/extracted/Allegro_Modificado_img_26.png",
      title: "Evidencia Visual 26 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_27",
      url: "./images/extracted/Allegro_Modificado_img_27.png",
      title: "Evidencia Visual 27 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_28",
      url: "./images/extracted/Allegro_Modificado_img_28.png",
      title: "Evidencia Visual 28 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_29",
      url: "./images/extracted/Allegro_Modificado_img_29.png",
      title: "Evidencia Visual 29 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_30",
      url: "./images/extracted/Allegro_Modificado_img_30.png",
      title: "Evidencia Visual 30 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_31",
      url: "./images/extracted/Allegro_Modificado_img_31.png",
      title: "Evidencia Visual 31 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_32",
      url: "./images/extracted/Allegro_Modificado_img_32.png",
      title: "Evidencia Visual 32 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_33",
      url: "./images/extracted/Allegro_Modificado_img_33.png",
      title: "Evidencia Visual 33 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_34",
      url: "./images/extracted/Allegro_Modificado_img_34.png",
      title: "Evidencia Visual 34 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_35",
      url: "./images/extracted/Allegro_Modificado_img_35.png",
      title: "Evidencia Visual 35 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_36",
      url: "./images/extracted/Allegro_Modificado_img_36.png",
      title: "Evidencia Visual 36 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_37",
      url: "./images/extracted/Allegro_Modificado_img_37.png",
      title: "Evidencia Visual 37 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_38",
      url: "./images/extracted/Allegro_Modificado_img_38.png",
      title: "Evidencia Visual 38 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_39",
      url: "./images/extracted/Allegro_Modificado_img_39.png",
      title: "Evidencia Visual 39 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_40",
      url: "./images/extracted/Allegro_Modificado_img_40.png",
      title: "Evidencia Visual 40 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_41",
      url: "./images/extracted/Allegro_Modificado_img_41.png",
      title: "Evidencia Visual 41 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_42",
      url: "./images/extracted/Allegro_Modificado_img_42.png",
      title: "Evidencia Visual 42 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Allegro_Modificado_img_43",
      url: "./images/extracted/Allegro_Modificado_img_43.png",
      title: "Evidencia Visual 43 (Allegro Modificado)",
      description: "Imagen extraÃ­da del documento original: Allegro_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["allegro", "modificado", "local", "docs", "allegro_modificado"]
  },
  {
    id: "AXI_Modificado",
    title: "AXI Modificado",
    category: "DocumentaciÃ³n Local / Modificados",
    lastUpdated: "2026-08-06",
    content: "AXIComo sabemos, la herramienta del AXI es bastante útil para detectar defectos de soldadura en BGAs donde es complicado validar el estado de la misma.---INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:HerramientaUSO:Consulta y análisis de evidencia AXI (Automated X-Ray Inspection) para identificar defectos de soldadura, principalmente en BGAs, ASICs y SCPs.APLICA CUANDO:- Se requiere validar una falla relacionada con soldadura.- Existen sospechas de cortos, opens o defectos en BGAs.- Se necesita revisar evidencia de manufactura.- Se requiere analizar la calidad de soldadura del SCP o ASIC.AREA:SMTISTREPARACIONDIAGNOSTICOANALISIS DE FALLASINGENIERIAKEYWORDS:AXIVITREXX-RAYBGASCPASICSOLDERSHORTOPENPCBGLPGFRESUMEN:La herramienta AXI permite consultar imágenes de inspección por rayos X para validar la calidad de soldadura de componentes electrónicos y confirmar defectos detectados durante manufactura.USO RAPIDO:1. Iniciar sesión con usuario Debug.2. Seleccionar servidor.3. Ingresar fecha y serial.4. Ejecutar búsqueda.5. Seleccionar PCB, SCP o TRAY.6. Revisar defectos e imágenes.7. Documentar hallazgos.RELACIONADO CON:- Diagnóstico de BGAs- Calidad de soldadura- SCP Inspection- ASIC Inspection- Reparación de tarjetas- Validaciones ISTFALLAS QUE AYUDA A CONFIRMAR:- Short- Open- Puentes de soldadura- Head-in-Pillow- Void- Missing Solder- BGA DefectNIVEL:Básico - IntermedioHERRAMIENTA:VITREX AXISALIDA ESPERADA:Visualización de evidencia de rayos X para confirmar o descartar problemas de soldadura. AXI Thursday, January 15, 2026 11:42 AM Como sabemos, la herramienta del AXI es bastante útil para detectar defectos de soldadura en BGAs donde es complicado validar el estado de la misma. No hay muchos cambios en como consultar evidencia del AXI para ambos modelos de tarjeta. Para usarlo tenemos que iniciar sesión con el usuario genérico de Debug / Debug [IMAGE_PLACEHOLDER_1] Una vez iniciada la sesión, tenemos que seleccionar el único equipo disponible en la plataforma, además de ingresar la fecha y el serial que deseamos consultar como se ve en la imagen a continuación: [IMAGE_PLACEHOLDER_2] La diferencia en la consulta entre GLP y GF tiene que ver con el nivel de casado (Tema 2.1 de esta guía) que quieras consultar, ya que como vimos anteriormente, GLP solo cuenta con la PCB y el TRAY, mientras que en GF tenemos la PCB, el SCP y el TRAY. Generalmente solo vamos a necesitar consultar la PCB, pero en el caso de GF, el SCP va soldado al ASIC, por lo que también podría presentar defectos de soldabilidad. Según el nivel del serial que busquemos en el apartado de \"BOARD\" será el resultado que podremos visualizar. Al consultar la PCB (GLP y GF) podremos ver todos los componentes, desde resistencias, conectores pth, BGAs, etc [IMAGE_PLACEHOLDER_3] Al consultar el SCP (Solo GF) tendremos imágenes de la calidad de soldabilidad del mismo. [IMAGE_PLACEHOLDER_4] Emanuel Domínguez",
    photos: [
    {
      id: "AXI_Modificado_img_1",
      url: "./images/extracted/AXI_Modificado_img_1.png",
      title: "Evidencia Visual 1 (AXI Modificado)",
      description: "Imagen extraÃ­da del documento original: AXI_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "AXI_Modificado_img_2",
      url: "./images/extracted/AXI_Modificado_img_2.png",
      title: "Evidencia Visual 2 (AXI Modificado)",
      description: "Imagen extraÃ­da del documento original: AXI_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "AXI_Modificado_img_3",
      url: "./images/extracted/AXI_Modificado_img_3.png",
      title: "Evidencia Visual 3 (AXI Modificado)",
      description: "Imagen extraÃ­da del documento original: AXI_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "AXI_Modificado_img_4",
      url: "./images/extracted/AXI_Modificado_img_4.png",
      title: "Evidencia Visual 4 (AXI Modificado)",
      description: "Imagen extraÃ­da del documento original: AXI_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["axi", "modificado", "local", "docs", "axi_modificado"]
  },
  {
    id: "Engineering_Dashboard_modificado",
    title: "Engineering Dashboard modificado",
    category: "DocumentaciÃ³n Local / Modificados",
    lastUpdated: "2026-08-06",
    content: "TIPO:HerramientaUSO:Monitoreo y análisis de fallas y desempeño del proceso de manufacturaAPLICA CUANDO:- Identificar unidades falladas- Analizar tendencias de fallas- Dar seguimiento a debugAREA:- Diagnóstico- Data analysis- Debug trackingKEYWORDS:- engineering dashboard- fail units- debug tracker- analytics- trackingRESUMEN:Herramienta centralizada que permite visualizar el estado de las unidades, analizar fallas en tiempo real y dar seguimiento al proceso de diagnóstico.USO RAPIDO:- Revisar Fail Units para estado actual- Usar Fail Units Dates para tendencias- Registrar diagnósticos en Debug Tracker HYPERLINK \"http://10.106.254.60/startpage/index.php?Building=B29%20Philo\"Engineering Dashboard Wednesday, January 21, 2026 7:08 AM El dashboard en línea utilizado en el proyecto Philo cuenta con múltiples módulos de consulta. De estos, los más utilizados en el día a día son Fail Units, Fail Units Dates y Debug Tracker, ya que permiten identificar unidades falladas, analizar su comportamiento en el tiempo y llevar un control del avance del proceso de debug. [IMAGE_PLACEHOLDER_1] Estas opciones se encuentran en la lista, identificadas con el número 28.-Fail units, 29.-Fail units – Dates y en el 33.-Debug Tracker. [IMAGE_PLACEHOLDER_2] FAIL UNITS Esta opción permite observar las unidades que se encuentran en estado de falla al inicio de cada día y dar seguimiento a su evolución durante el transcurso del mismo, facilitando el monitoreo y control del proceso diario. Las unidades se clasifican por status, incluyendo: Pendientes de diagnóstico En proceso (reparación, ensamble o reprueba) Unidades con pase posterior al retrabajo [IMAGE_PLACEHOLDER_3] Además de la visualización de la información, el sistema permite la exportación de datos a Excel utilizando los filtros aplicados, mediante la selección del icono de Excel, facilitando así el análisis y la documentación externa. [IMAGE_PLACEHOLDER_4] FAIL UNITS – Dates Este módulo funciona de manera similar a Fail Units, con la diferencia de que permite seleccionar fechas específicas. Esta funcionalidad facilita un análisis más detallado del comportamiento de las unidades falladas en un periodo específico, lo que ayuda a identificar tendencias, variaciones diarias y posibles incrementos de fallas en fechas determinadas. [IMAGE_PLACEHOLDER_5] Debug Tracker. En este módulo se realiza el registro hora por hora de los diagnósticos efectuados a las unidades. Al igual que en los módulos anteriores, se cuenta con filtros para facilitar la consulta de la información. [IMAGE_PLACEHOLDER_6] A diferencia de las otras opciones, en Debug Tracker la información es registrada por el usuario, quien debe adjuntar la evidencia del diagnóstico, así como un comentario detallando los hallazgos obtenidos durante el análisis. Para hacer esto debemos iniciar sesión, al momento de hacerlo se nos muestra lo siguiente: [IMAGE_PLACEHOLDER_7] En el campo Board Serial Number se debe ingresar el número de serie de la PCBA. Una vez capturado el serial, el sistema habilita automáticamente los campos correspondientes para cargar las evidencias de la información que la PCBA tiene registrada en FlexFlow. Posteriormente, se debe agregar un comentario descriptivo con el detalle del diagnóstico realizado. Al finalizar, se selecciona la opción Submit, con lo cual la información queda guardada y la unidad queda registrada correctamente dentro del sistema. [IMAGE_PLACEHOLDER_8] Este registro permite contar con un historial de diagnósticos, el cual resulta de gran utilidad para la revisión de incidencias, el seguimiento de casos recurrentes y el análisis posterior de fallas. Adicionalmente, se genera una gráfica de eficiencia, en la cual se considera la cantidad de unidades que cuentan con un diagnóstico efectivo, las unidades empacadas y aquellas que permanecen pendientes de reparación o reprueba, proporcionando una visión clara del desempeño del proceso. [IMAGE_PLACEHOLDER_9]",
    photos: [
    {
      id: "Engineering_Dashboard_modificado_img_1",
      url: "./images/extracted/Engineering_Dashboard_modificado_img_1.png",
      title: "Evidencia Visual 1 (Engineering Dashboard modificado)",
      description: "Imagen extraÃ­da del documento original: Engineering_Dashboard_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Engineering_Dashboard_modificado_img_2",
      url: "./images/extracted/Engineering_Dashboard_modificado_img_2.png",
      title: "Evidencia Visual 2 (Engineering Dashboard modificado)",
      description: "Imagen extraÃ­da del documento original: Engineering_Dashboard_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Engineering_Dashboard_modificado_img_3",
      url: "./images/extracted/Engineering_Dashboard_modificado_img_3.png",
      title: "Evidencia Visual 3 (Engineering Dashboard modificado)",
      description: "Imagen extraÃ­da del documento original: Engineering_Dashboard_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Engineering_Dashboard_modificado_img_4",
      url: "./images/extracted/Engineering_Dashboard_modificado_img_4.png",
      title: "Evidencia Visual 4 (Engineering Dashboard modificado)",
      description: "Imagen extraÃ­da del documento original: Engineering_Dashboard_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Engineering_Dashboard_modificado_img_5",
      url: "./images/extracted/Engineering_Dashboard_modificado_img_5.png",
      title: "Evidencia Visual 5 (Engineering Dashboard modificado)",
      description: "Imagen extraÃ­da del documento original: Engineering_Dashboard_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Engineering_Dashboard_modificado_img_6",
      url: "./images/extracted/Engineering_Dashboard_modificado_img_6.png",
      title: "Evidencia Visual 6 (Engineering Dashboard modificado)",
      description: "Imagen extraÃ­da del documento original: Engineering_Dashboard_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Engineering_Dashboard_modificado_img_7",
      url: "./images/extracted/Engineering_Dashboard_modificado_img_7.png",
      title: "Evidencia Visual 7 (Engineering Dashboard modificado)",
      description: "Imagen extraÃ­da del documento original: Engineering_Dashboard_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Engineering_Dashboard_modificado_img_8",
      url: "./images/extracted/Engineering_Dashboard_modificado_img_8.png",
      title: "Evidencia Visual 8 (Engineering Dashboard modificado)",
      description: "Imagen extraÃ­da del documento original: Engineering_Dashboard_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Engineering_Dashboard_modificado_img_9",
      url: "./images/extracted/Engineering_Dashboard_modificado_img_9.png",
      title: "Evidencia Visual 9 (Engineering Dashboard modificado)",
      description: "Imagen extraÃ­da del documento original: Engineering_Dashboard_modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["engineering", "dashboard", "modificado", "local", "docs", "engineering_dashboard_modificado"]
  },
  {
    id: "Find_Parent_Component_Modificado",
    title: "Find Parent Component Modificado",
    category: "DocumentaciÃ³n Local / Modificados",
    lastUpdated: "2026-08-06",
    content: "Find Parent Component - Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Herramienta de DiagnósticoUSO:Consultar el historial de asociación (casado) de componentes como FAN, LED o PCBA con diferentes unidades o trays para identificar componentes recurrentemente asociados a fallas.APLICA CUANDO:- Existe sospecha de componente defectuoso.- Se requiere rastrear historial de un FAN, LED o PCBA.- Se detectan fallas repetitivas en varias unidades.- Se realiza análisis de causa raíz.AREA:REPARACIONDEBUGISTDIAGNOSTICOINGENIERIAKEYWORDS:Find Parent ComponentParent ComponentChild ComponentFANLEDPCBASerial NumberTraceabilityFailure AnalysisRoot CauseComponent HistoryRESUMEN:Esta herramienta permite rastrear el historial de un componente y verificar en cuántas unidades ha sido utilizado, facilitando la identificación de componentes que generan fallas recurrentes en diferentes productos.USO RAPIDO:1. Ingresar el serial del componente.2. Seleccionar View Report.3. Revisar Parent Serial Number.4. Identificar unidades relacionadas.5. Analizar cantidad de ocurrencias.6. Confirmar si existe patrón de falla repetitiva.RELACIONADO CON:- Análisis de causa raíz- Fallas de FAN- Fallas mecánicas- Trazabilidad de componentes- Reparación electrónica- Investigación de recurrenciasSALIDA ESPERADA:Lista de unidades donde el componente fue utilizado y evidencia para determinar si el componente está asociado a múltiples fallas. Find Parent Component Wednesday, April 22, 2026 4:04 PM Esta herramienta nos apoya a revisar el historial de un componente (FAN/LED/PCBA) ha sido casado con diferentes trays. Esto nos ayuda a revisar si este componente esta defectuoso Ponemos de ejemplo el serial FLG2617-00077, fallo de ping GBMc por un defecto en el FAN Y al revisar el FAN GFFNDV254700536 ya ha sido casado 4 veces provocando 4 fallas.",
    photos: [

    ],
    keywords: ["find", "parent", "component", "modificado", "local", "docs", "find_parent_component_modificado"]
  },
  {
    id: "ICT_Paperless_modificado",
    title: "ICT Paperless modificado",
    category: "DocumentaciÃ³n Local / Modificados",
    lastUpdated: "2026-08-06",
    content: "TIPO:HerramientaUSO:Consulta de logs de pruebas ICT para análisis de fallasAPLICA CUANDO:- Unidad falla en ICT- Se necesita revisar error específico- Análisis de cortos, opens o medicionesAREA:- Diagnóstico- ICT- DebugKEYWORDS:- ICT paperless- logs ICT- serial lookup- test failureRESUMEN:Herramienta que permite consultar el historial de pruebas ICT de una unidad mediante su número de serie, facilitando el análisis de fallas eléctricas.USO RAPIDO:- Ingresar serial de la unidad- Revisar log de falla- Identificar tipo de error (short/open/measurement) HYPERLINK \"https://gdlnt1503.americas.ad.flextronics.com/paperless/\"ICT Paperless Wednesday, January 21, 2026 7:08 AM Este recurso nos ayuda a consultar el log de la unidad proveniente (falladas) de ICT. Para acceder a esta información, es necesario ingresar el número de serie en la casilla indicada, tal como se muestra en la imagen siguiente. [IMAGE_PLACEHOLDER_1] Una vez ingresado el número de serie, el sistema muestra el historial completo correspondiente al serial escaneado, incluyendo los logs generados durante las pruebas de ICT [IMAGE_PLACEHOLDER_2]",
    photos: [
    {
      id: "ICT_Paperless_modificado_img_1",
      url: "./images/extracted/ICT_Paperless_modificado_img_1.png",
      title: "Evidencia Visual 1 (ICT Paperless modificado)",
      description: "Imagen extraÃ­da del documento original: ICT_Paperless_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ICT_Paperless_modificado_img_2",
      url: "./images/extracted/ICT_Paperless_modificado_img_2.png",
      title: "Evidencia Visual 2 (ICT Paperless modificado)",
      description: "Imagen extraÃ­da del documento original: ICT_Paperless_modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["ict", "paperless", "modificado", "local", "docs", "ict_paperless_modificado"]
  },
  {
    id: "IST_Monitor_Modificado",
    title: "IST Monitor Modificado",
    category: "DocumentaciÃ³n Local / Modificados",
    lastUpdated: "2026-08-06",
    content: "IST_Monitor_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Sistema de Monitoreo ISTUSO:Monitorear el estado de racks, estaciones de prueba y unidades que actualmente se encuentran ejecutando pruebas en IST.APLICA CUANDO:- Se requiere localizar una unidad.- Se desea revisar utilización de racks.- Se monitorea el estado de pruebas.- Se investigan fallas o unidades detenidas.AREA:ISTMONITORINGDEBUGTEST OPERATIONSKEYWORDS:IST MonitorRack SummaryUnit FinderCDFP CyclesUtilizationGhostFishRack InfoFailuresRESUMEN:IST Monitor proporciona una vista centralizada del estado operativo de los equipos de prueba y de las unidades conectadas. Permite supervisar ejecución de pruebas, utilización de racks, localización de unidades y métricos operativos del área. citeturn53search1SECCIONES PRINCIPALES:- Summary.- Racks Summary.- Failures.- Idle Units.- Unit Finder.- Units with Prompt.- CDFP Cycles.- Monitor.- Rack Info. citeturn53search1INDICADORES GENERALES:- Running.- Passed.- Failed.- Idle.- Total Racks.- Utilization.- Units Running &gt; 4 Hours.- Units to Pass in Next 2 Hours. citeturn53search1RACKS SUMMARY:Permite identificar racks activos por familia, POD y CDU mostrando estado del servidor, cantidad de unidades ejecutándose, aprobadas, falladas, abortadas e inactivas. citeturn53search1INFORMACION DE RACK:- Rack.- Server Status.- Running.- Passed.- Failed.- Aborted.- Idle.- Free Memory.- OT Utilization. citeturn53search1UNIT FINDER:Permite buscar cualquier unidad actualmente en prueba mediante número de serie. Muestra ubicación, estación, paso actual y tiempo acumulado de prueba. citeturn53search1DATOS MOSTRADOS EN UNIT FINDER:- Hostname.- Station ID.- Current Serial Number.- Current Status.- Current Step.- Current Process Elapsed Time.- Total Elapsed Time.- Previous Process Plan Result. citeturn53search1COMO CONFIRMAR:1. Ingresar a IST Monitor.2. Revisar Summary.3. Buscar unidad mediante Unit Finder.4. Validar rack y estación.5. Revisar paso actual de prueba.6. Confirmar estado operativo.BENEFICIOS:- Monitoreo centralizado.- Localización rápida de unidades.- Seguimiento de productividad.- Detección de racks ociosos.- Seguimiento de fallas.SALIDA ESPERADA:Identificar rápidamente el estado de cualquier unidad o rack dentro del entorno IST y facilitar la toma de decisiones operativas. IST Monitor Wednesday, January 21, 2026 7:31 AM Este recurso proporciona información sobre los equipos de prueba y sobre las unidades que se encuentran actualmente conectadas a ellos. Su función principal es ofrecer una vista general del estado operativo del entorno de prueba, permitiendo supervisar de forma centralizada el funcionamiento de cada unidad bajo evaluación. [IMAGE_PLACEHOLDER_1] Dentro de las varias opciones que tenemos: RACK SUMARY Este apartado nos sirve para identificar los racks activos divididos por familia, POD y CDU. [IMAGE_PLACEHOLDER_2] UNIT FINDER Nos sirve para buscar cualquier unidad que este conecta y en prueba. Indicándonos información útil sobre la unidad como rack y slot donde se está probando, el step de prueba por el que está cursando la unidad y el tiempo de prueba total que lleva. [IMAGE_PLACEHOLDER_3] German Escobar",
    photos: [
    {
      id: "IST_Monitor_Modificado_img_1",
      url: "./images/extracted/IST_Monitor_Modificado_img_1.png",
      title: "Evidencia Visual 1 (IST Monitor Modificado)",
      description: "Imagen extraÃ­da del documento original: IST_Monitor_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "IST_Monitor_Modificado_img_2",
      url: "./images/extracted/IST_Monitor_Modificado_img_2.png",
      title: "Evidencia Visual 2 (IST Monitor Modificado)",
      description: "Imagen extraÃ­da del documento original: IST_Monitor_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "IST_Monitor_Modificado_img_3",
      url: "./images/extracted/IST_Monitor_Modificado_img_3.png",
      title: "Evidencia Visual 3 (IST Monitor Modificado)",
      description: "Imagen extraÃ­da del documento original: IST_Monitor_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["ist", "monitor", "modificado", "local", "docs", "ist_monitor_modificado"]
  },
  {
    id: "OpenTestCloud_Radix_modificado",
    title: "OpenTestCloud Radix modificado",
    category: "DocumentaciÃ³n Local / Modificados",
    lastUpdated: "2026-08-06",
    content: "TIPO:HerramientaUSO:Análisis de pruebas funcionales e ISTAPLICA CUANDO:- Fallas en IST- Validación de pruebas funcionales- Investigación de síntomasAREA:- Diagnóstico- IST- DebugKEYWORDS:- radix- opentest- IST logs- symptom- debug logRESUMEN:Herramienta para consultar historial de pruebas funcionales, identificar síntomas de falla y analizar logs detallados para diagnóstico.USO RAPIDO:- Ingresar serial de unidad- Revisar status y symptom- Abrir detalle con lupa- Analizar logs (Debug / Carrot)==================================================CONTENIDO ORIGINAL==================================================",
    photos: [

    ],
    keywords: ["opentestcloud", "radix", "modificado", "local", "docs", "opentestcloud_radix_modificado"]
  },
  {
    id: "Rack_Modo_Debug_Modificado",
    title: "Rack Modo Debug Modificado",
    category: "DocumentaciÃ³n Local / Modificados",
    lastUpdated: "2026-08-06",
    content: "INFORMACIÓN BASE DEL SISTEMA EXPERTO TIPO:Procedimiento / HerramientaUSO:Ejecución de pruebas funcionales y de diagnóstico mediante Rack Modo Debug para unidades Ghostfish.APLICA CUANDO:- Se requiere ejecutar pruebas específicas sin correr IST completo.- Se necesita validar una reparación.- Se requiere diagnosticar una falla funcional.- Se necesita correr pruebas individuales o grupos de pruebas.- Se requiere utilizar DEBUG (SFC ON) o DEBUG (SFC OFF).AREA:ISTDEBUGREPARACIONDIAGNOSTICOINGENIERIAKEYWORDS:Rack DebugGhostfishISTDebug ModeSFC ONSFC OFFTest PickerTest PlansBFTRegressionRMARack ISTFunctional TestRESUMEN:El Rack Modo Debug permite ingresar unidades en modo de diagnóstico para ejecutar pruebas funcionales individuales o planes completos. El sistema permite configurar modos de ejecución, seleccionar pruebas específicas y validar reparaciones sin necesidad de ejecutar todo el flujo de IST.USO RAPIDO:1. Escanear la unidad en un slot disponible.2. Abrir Details.3. Activar Test Mode Enable.4. Seleccionar DEBUG (SFC ON) o DEBUG (SFC OFF).5. Configurar Izumi Host Tray Control.6. Seleccionar Continue on Fail o Stop on Fail.7. Elegir pruebas en Test Picker o planes completos en Test Plans.8. Ejecutar y analizar resultados.MODOS DISPONIBLES:DEBUG (SFC ON): Solicita información de la unidad y mantiene interacción con flujo SFC.DEBUG (SFC OFF): Permite correr pruebas sin validaciones SFC.RELACIONADO CON:- IST- BFT- Regression- RMA Incoming- Validación de reparación- Diagnóstico funcional- Análisis de fallasSALIDA ESPERADA:Resultados de pruebas funcionales, identificación de fallas y validación de la reparación realizada.Rack Modo Debug Friday, April 17, 2026 8:21 AM Esta es la pantalla inicial en la parte de los racks de debug, para ingresar una unidad escaneamos la unidad dependiendo del slot. La pantalla cuenta con 16 Slots como el rack de IST [IMAGE_PLACEHOLDER_1] Despues de ingresar la unidad se tornara de un color amarillo que indicará que esta esperando el modo en el cual ingresaremos la unidad. [IMAGE_PLACEHOLDER_2] Continuamos presionando el siguiente boton para desplegar las opciones de como queremos ingresar la unidad. [IMAGE_PLACEHOLDER_3] Nos desplegara el siguiente menu en el que tendremos que habilitar la opcion de Test mode Enable, marcandola. [IMAGE_PLACEHOLDER_4] Se nos desplegara el siguiente menu, donde las opciones que nos interesan para probar en modo debug son las siguientes. DEBUG(SFC ON): Esta opcion nos dejara probar en modo debug pero nos solicitara los datos de el chasis como MAC,Numero de parte y numero de empleado. *Nota(Este modo siempre tiene que usarse cuando la unidad nunca ha pasado por IST o tuvo otro pase de ICT antes y solo funciona si la unidad tiene flujo) DEBUG(SFC OFF): Este modo nos dejara ingresar unidades pero sin solicitarnos los datos de la unidad [IMAGE_PLACEHOLDER_5] Seleccionamos cualquiera de las 2 opciones y le damos continuar [IMAGE_PLACEHOLDER_6] Nos desplegara la siguiente pantalla y las 2 cosas a tener en cuenta son: [IMAGE_PLACEHOLDER_7] [IMAGE_PLACEHOLDER_8] La opcion de IZUMI HOST TRAY CONTROL siempre tiene que estar seleccionada. Y ya dependiendo si queremos que la unidad siga corriendo aunque falle seleccionamos el CONTINUE ON FAIL. O si queremos que la unidad falle en cuanto llegue al step, selecionamos el STOP ON FAIL. [IMAGE_PLACEHOLDER_9] Cuando Selecionamos en el menu la parte de TEST PICKER. Nos arroja un menu de opciones y son todas las pruebas funcionales que le podemos correr a la unidad. Esto nos ayuda si queremos correr una prueba en especifico. Ya que la prueba completa de IST dura 19 horas. Estas son las opciones que obligatoriamente tenemos que usar para correr unidades en modo debug, aparte de los steps que necesitemos agregar. [IMAGE_PLACEHOLDER_10] [IMAGE_PLACEHOLDER_11] Y cuando damos click en la parte de TEST PLANS. Esta opcion nos ayuda para saber si quieremos correr la prueba completa de IST(19horas) [IMAGE_PLACEHOLDER_12] E.",
    photos: [
    {
      id: "Rack_Modo_Debug_Modificado_img_1",
      url: "./images/extracted/Rack_Modo_Debug_Modificado_img_1.png",
      title: "Evidencia Visual 1 (Rack Modo Debug Modificado)",
      description: "Imagen extraÃ­da del documento original: Rack_Modo_Debug_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Rack_Modo_Debug_Modificado_img_2",
      url: "./images/extracted/Rack_Modo_Debug_Modificado_img_2.png",
      title: "Evidencia Visual 2 (Rack Modo Debug Modificado)",
      description: "Imagen extraÃ­da del documento original: Rack_Modo_Debug_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Rack_Modo_Debug_Modificado_img_3",
      url: "./images/extracted/Rack_Modo_Debug_Modificado_img_3.png",
      title: "Evidencia Visual 3 (Rack Modo Debug Modificado)",
      description: "Imagen extraÃ­da del documento original: Rack_Modo_Debug_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Rack_Modo_Debug_Modificado_img_4",
      url: "./images/extracted/Rack_Modo_Debug_Modificado_img_4.png",
      title: "Evidencia Visual 4 (Rack Modo Debug Modificado)",
      description: "Imagen extraÃ­da del documento original: Rack_Modo_Debug_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Rack_Modo_Debug_Modificado_img_5",
      url: "./images/extracted/Rack_Modo_Debug_Modificado_img_5.png",
      title: "Evidencia Visual 5 (Rack Modo Debug Modificado)",
      description: "Imagen extraÃ­da del documento original: Rack_Modo_Debug_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Rack_Modo_Debug_Modificado_img_6",
      url: "./images/extracted/Rack_Modo_Debug_Modificado_img_6.png",
      title: "Evidencia Visual 6 (Rack Modo Debug Modificado)",
      description: "Imagen extraÃ­da del documento original: Rack_Modo_Debug_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Rack_Modo_Debug_Modificado_img_7",
      url: "./images/extracted/Rack_Modo_Debug_Modificado_img_7.png",
      title: "Evidencia Visual 7 (Rack Modo Debug Modificado)",
      description: "Imagen extraÃ­da del documento original: Rack_Modo_Debug_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Rack_Modo_Debug_Modificado_img_8",
      url: "./images/extracted/Rack_Modo_Debug_Modificado_img_8.png",
      title: "Evidencia Visual 8 (Rack Modo Debug Modificado)",
      description: "Imagen extraÃ­da del documento original: Rack_Modo_Debug_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Rack_Modo_Debug_Modificado_img_9",
      url: "./images/extracted/Rack_Modo_Debug_Modificado_img_9.png",
      title: "Evidencia Visual 9 (Rack Modo Debug Modificado)",
      description: "Imagen extraÃ­da del documento original: Rack_Modo_Debug_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Rack_Modo_Debug_Modificado_img_10",
      url: "./images/extracted/Rack_Modo_Debug_Modificado_img_10.png",
      title: "Evidencia Visual 10 (Rack Modo Debug Modificado)",
      description: "Imagen extraÃ­da del documento original: Rack_Modo_Debug_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Rack_Modo_Debug_Modificado_img_11",
      url: "./images/extracted/Rack_Modo_Debug_Modificado_img_11.png",
      title: "Evidencia Visual 11 (Rack Modo Debug Modificado)",
      description: "Imagen extraÃ­da del documento original: Rack_Modo_Debug_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Rack_Modo_Debug_Modificado_img_12",
      url: "./images/extracted/Rack_Modo_Debug_Modificado_img_12.png",
      title: "Evidencia Visual 12 (Rack Modo Debug Modificado)",
      description: "Imagen extraÃ­da del documento original: Rack_Modo_Debug_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["rack", "modo", "debug", "modificado", "local", "docs", "rack_modo_debug_modificado"]
  },
  {
    id: "Validacion_unidades_modificado",
    title: "Validacion unidades modificado",
    category: "DocumentaciÃ³n Local / Modificados",
    lastUpdated: "2026-08-06",
    content: "TIPO:Herramienta / Caso de análisisUSO:Análisis estructurado de fallas en IST utilizando logs de RadixAPLICA CUANDO:- Fallas complejas en IST- Validación de síntomas en logs- Análisis de BMC, voltajes y PCIeAREA:- Diagnóstico- IST- Debug avanzadoKEYWORDS:- radix analysis- carrot log- BMC debug- PCIe debug- validation caseRESUMEN:Caso práctico de diagnóstico que muestra paso a paso cómo analizar una unidad fallada usando Radix, incluyendo revisión de síntomas, logs, secuencia de power y comunicación.USO RAPIDO:- Buscar serial en Radix- Revisar pestaña Symptoms- Validar logs (Carrot / Debug)- Confirmar estado BMC y voltajes- Revisar PCIe================================================== Validación unidades Thursday, January 22, 2026 8:37 AM En este apartado la intención es continuar mostrando el uso de radix, en este caso usando el serial FLG2549-00606 el cual corresponde a unidad que fallo por un tema con el script del equipo (gf-ga-1.0_PROD_dirty) teniendo conflictos con la versión del proveedor de uno de los componentes del enfriamiento liquido en este caso esperando BOYD cuando la unidad tiene COOLER MASTER. [IMAGE_PLACEHOLDER_1] La intención de esto es mostrar los pasos básicos que se siguieron en la identificación del problema los cuales nos sirven como un análisis sencillo de un modo de falla además de enunciar comandos del log que nos ayudan a identificar problemas en otros modos de falla. Lo primero es ingresar a la información de la prueba dirigiéndonos a la pestaña de Symptoms, acomodamos los síntomas de forma que se nos muestre el primer step donde fallo (para esto solo presionamos la flecha en la columna de index name) en el caso de este modo de falla solo se nos muestran dos síntomas. [IMAGE_PLACEHOLDER_2] En esta ventana nos interesa el nombre de la prueba en la que fallo así como el mensaje que nos da el mismo. En este caso el mensaje nos indica que tuvo un error en la lectura de la versión de la válvula en este caso esperando BOYD. [IMAGE_PLACEHOLDER_3] Sin embargo. Para saber más sobre el modo de fallo nos vamos a la pestaña de carrot log o a la de attachments para abrir el log completo de la prueba (carrot Log) [IMAGE_PLACEHOLDER_4] [IMAGE_PLACEHOLDER_5] Cualquiera de las dos formas nos dirige a la siguiente pestaña, aquí se nos mostrara todo el proceso de la prueba . [IMAGE_PLACEHOLDER_6] Aquí podemos ver y obtener información para determinar nuestro diagnóstico, para nuestro caso nos importa revisar la prueba de Valve UART Interface Test. Pero antes de eso es ideal revisar que no tengamos problemas de crasheo en el BMC, de booteo o problemas con los voltajes primarios o secundarios de tal manera que nos aseguremos que no tenemos intermitencias, que la unidad fue desconectada en la prueba o esta se apagó. Entonces, lo que hacemos es abrir el buscador con ctrl+F y pegamos el siguiente comando curl -s -X GET 'http://localhost:80/redfish/v1/Managers/bmc/ManagerDiagnosticData' [IMAGE_PLACEHOLDER_7] Este nos da información sobre el BMC de esta nos interesa el BootCount y CrashCount. [IMAGE_PLACEHOLDER_8] Estos datos nos pueden ir aumentando conforme la unidad se va probando (solo si en la prueba se corrio el step Get Connection Debug Info) indicándonos si la unidad tiene problemas con el booteo en el BMC. Se muestran dos partes del log donde se ve una unidad buena y otra con problemas. [IMAGE_PLACEHOLDER_9] Importante: si revisamos el serial FLG2541-01695 en la prueba que esta pasada estos datos se reiniciaron debido a que el BMC fue cambiado. Como en el caso de FLG2549-00606 no tenemos ningún problema con el BMC vamos a revisar el booteo de cada canal con el comando list_gfc_cm_state.sh [IMAGE_PLACEHOLDER_10] Este nos proporciona una tabla donde se nos da información sobre el booteo de cada GFC y si alguno tuvo algún error. En la siguiente imagen se muestra esta unidad y se da el ejemplo de una donde fallaron los 4 canales por problemas de memoria bloqueada. [IMAGE_PLACEHOLDER_11] Importante: El hecho de que la unidad FLG2549-00648 paso con el cambio de las 4 memorias no indica que sea así en todos los casos. Ya que tenemos que tener en cuenta los voltajes del canal ya que si alguno no está presente el canal no podrá bootear debido a que el canal estará apagado o alarmado. Si el canal está completamente alimentado el problema es en la comunicación para esto revisemos en el apartado de fallas Telemetry. Under-Voltage-on-Rail Para revisar los voltajes primarios tenemos: Got ADM1266 black box dump for level0-sequencer Para los secundarios. Donde solo cambia el número del gfc que queremos revisar (gfc0, gfc1, gfc2, gfc3) Got ADM1266 black box dump for level1-sequencer-gfcX. [IMAGE_PLACEHOLDER_12] Al buscar el comando en nuestro log nos muestra el resultado anterior donde al subir con el scroll en el log tenemos un resumen del monitoreo que hacen nuestros secuenciadores (U1 voltajes primarios) y (U26_0, U26_1, U26_2, U26_3 voltajes secundarios) durante la prueba IST. [IMAGE_PLACEHOLDER_13] Como podemos observar en la imagen anterior tenemos 3 apartados importantes. donde en el primero tenemos el nombre de la versión del secuenciador, un contador de los encendidos, el tiempo en el que se realizó el muestreo y el estado de la secuencia donde nos encontramos el cual nos es de utilidad para identificar donde tenemos el problema, de este se habla más cuando usamos el Adi power studio para leer el secuenciador y observar la secuencia tema que se desarrolla más en el apartado de sequence wizard Guia para usó del programador y ADI Power Studio.docx [IMAGE_PLACEHOLDER_14] En el segundo apartado tenemos los voltajes donde dependiendo del secuenciador serán los primarios o secundarios. [IMAGE_PLACEHOLDER_15] [IMAGE_PLACEHOLDER_16] A continuación se muestran ejemplos de los posibles problemas que podemos encontrar en este apartado como (Undervoltage, Overvoltage, dissable). Caso 1 Undervoltage: En este serial buscando en \"Got ADM1266 black box dump for level1-sequencer-glc0\" en el serial FLG2543-00304 [IMAGE_PLACEHOLDER_17] Caso 2 Overvoltage: En este otro caso buscando con el comando \"Got ADM1266 black box dump for level1-sequencer-glc2\" en el serial FLG2530-03200 [IMAGE_PLACEHOLDER_18] Caso 3 Dissable: En este otro caso donde se nos muestra que tenemos un voltaje deshabilitado INGRESAR EJEMPLO DE UN DESABILITADO En el tercer apartado tenemos las señales estas son de gran importancia ya que nos indican ciertos comportamientos de habilitación en la secuencia primaria como en la secuencia secundaria. [IMAGE_PLACEHOLDER_19] Una de las fallas más comunes y útiles de identificar son las señales de overtemp las cuales corresponden a los sensores de temperatura del GFC_X (U50_X) y sus respectivos VPWRs (U76_x). En la siguiente imagen se muestra un ejemplo de esto. [IMAGE_PLACEHOLDER_20] Para la unidad evaluada, no se detectan anomalías en los voltajes. Adicionalmente, es necesario verificar y descartar la existencia de problemas relacionados con la comunicación PCIe, tanto en In-band como en Out-of-band. PCIe In Band: Para esto utilizamos el comando gsys -k pcie list al momento de usarlo tenemos varias coincidencias debido a que la prueba se hace varias veces para la validación. Si nuestra unidad tiene problemas, tendremos el caso donde el GFC_X no está listado o esta listado pero no cumple con el ancho y/o velocidad del enlace. Caso donde el GFC_X no está listado en las imágenes siguientes se muestra la unidad evaluada y una unidad con problemas. [IMAGE_PLACEHOLDER_21] [IMAGE_PLACEHOLDER_22] Ingresar caso no listado Caso donde falla por velocidad y/o ancho del enlace: PCIe Out Band: Para esto usamos el comando lspci, de la misma forma que en el anterior tenemos varias coincidencias donde aqui identificaremos las siguientes direcciones para identificar los componentes involucrados aqui. Resumen comandos: [IMAGE_PLACEHOLDER_23]",
    photos: [
    {
      id: "Validacion_unidades_modificado_img_1",
      url: "./images/extracted/Validacion_unidades_modificado_img_1.png",
      title: "Evidencia Visual 1 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_2",
      url: "./images/extracted/Validacion_unidades_modificado_img_2.png",
      title: "Evidencia Visual 2 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_3",
      url: "./images/extracted/Validacion_unidades_modificado_img_3.png",
      title: "Evidencia Visual 3 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_4",
      url: "./images/extracted/Validacion_unidades_modificado_img_4.png",
      title: "Evidencia Visual 4 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_5",
      url: "./images/extracted/Validacion_unidades_modificado_img_5.png",
      title: "Evidencia Visual 5 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_6",
      url: "./images/extracted/Validacion_unidades_modificado_img_6.png",
      title: "Evidencia Visual 6 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_7",
      url: "./images/extracted/Validacion_unidades_modificado_img_7.png",
      title: "Evidencia Visual 7 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_8",
      url: "./images/extracted/Validacion_unidades_modificado_img_8.png",
      title: "Evidencia Visual 8 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_9",
      url: "./images/extracted/Validacion_unidades_modificado_img_9.png",
      title: "Evidencia Visual 9 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_10",
      url: "./images/extracted/Validacion_unidades_modificado_img_10.png",
      title: "Evidencia Visual 10 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_11",
      url: "./images/extracted/Validacion_unidades_modificado_img_11.png",
      title: "Evidencia Visual 11 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_12",
      url: "./images/extracted/Validacion_unidades_modificado_img_12.png",
      title: "Evidencia Visual 12 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_13",
      url: "./images/extracted/Validacion_unidades_modificado_img_13.png",
      title: "Evidencia Visual 13 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_14",
      url: "./images/extracted/Validacion_unidades_modificado_img_14.png",
      title: "Evidencia Visual 14 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_15",
      url: "./images/extracted/Validacion_unidades_modificado_img_15.png",
      title: "Evidencia Visual 15 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_16",
      url: "./images/extracted/Validacion_unidades_modificado_img_16.png",
      title: "Evidencia Visual 16 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_17",
      url: "./images/extracted/Validacion_unidades_modificado_img_17.png",
      title: "Evidencia Visual 17 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_18",
      url: "./images/extracted/Validacion_unidades_modificado_img_18.png",
      title: "Evidencia Visual 18 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_19",
      url: "./images/extracted/Validacion_unidades_modificado_img_19.png",
      title: "Evidencia Visual 19 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_20",
      url: "./images/extracted/Validacion_unidades_modificado_img_20.png",
      title: "Evidencia Visual 20 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_21",
      url: "./images/extracted/Validacion_unidades_modificado_img_21.png",
      title: "Evidencia Visual 21 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_22",
      url: "./images/extracted/Validacion_unidades_modificado_img_22.png",
      title: "Evidencia Visual 22 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Validacion_unidades_modificado_img_23",
      url: "./images/extracted/Validacion_unidades_modificado_img_23.png",
      title: "Evidencia Visual 23 (Validacion unidades modificado)",
      description: "Imagen extraÃ­da del documento original: Validacion_unidades_modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["validacion", "unidades", "modificado", "local", "docs", "validacion_unidades_modificado"]
  },
  {
    id: "Fallas_ASIC_Modificado",
    title: "Fallas ASIC Modificado",
    category: "DocumentaciÃ³n Local / Fallas de Asic",
    lastUpdated: "2026-08-06",
    content: "Fallas_ASIC_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Diagnóstico de ASIC / Boot / Power SequencingUSO:Diagnóstico de fallas relacionadas con ASIC, canales GFC, secuencia de arranque, canales sin boot y apagados inesperados.APLICA CUANDO:- Se sospecha falla de ASIC.- Existe pcie-data-mismatch.- Un canal GFC no bootea.- Un canal se apaga durante pruebas.- Existen errores de CM_DONE o CM_ERROR.AREA:ISTDEBUGASICPOWERBOOTKEYWORDS:ASICGFCCM_DONECM_ERRORADM1266BlackboxASICSEQGFC_OVERTEMP_LVR_VDDQL_PGOODPower SequencerRESUMEN:Antes de diagnosticar un ASIC como causa raíz, es obligatorio verificar que todos los canales GFC completen correctamente el proceso de boot y permanezcan energizados. El análisis principal se realiza mediante el comando list_gfc_cm_state.sh y los registros ADM1266 Blackbox. citeturn46search1USO RAPIDO:1. Revisar carrot log.2. Ejecutar análisis de list_gfc_cm_state.sh.3. Identificar canales sin boot.4. Revisar CM_DONE y CM_ERROR.5. Analizar ADM1266 level0.6. Analizar ADM1266 level1 del canal afectado.7. Confirmar voltajes y secuencia de arranque.8. Analizar el modo de falla específico.COMANDO PRINCIPAL:list_gfc_cm_state.shCRITERIO DE BOOT CORRECTO:- GFC0_CM_DONE = OK.- GFC1_CM_DONE = OK.- GFC2_CM_DONE = OK.- GFC3_CM_DONE = OK.- Sin errores de CM_ERROR. citeturn46search1INDICADOR DE CANAL SIN BOOT:- CM_DONE en ERROR.- CM_ERROR elevado.- Canal no completa inicialización. citeturn46search1ADM1266 LEVEL0:Utilizado para validar voltajes primarios y estado general del sistema.SEÑALES PRINCIPALES:- ASICSEQx_PGOOD- MSTR_ASIC_PGOOD- MSTR_ASIC_PERST_L- VALVE_FLT_L- FAN_HSWAP_PGOOD- BMC_SYS_PGOOD. citeturn46search1ADM1266 LEVEL1:Utilizado para validar voltajes secundarios del canal afectado.SEÑALES PRINCIPALES:- GFC_OVERTEMP_L- VR_VDDQL_PGOOD- ASICSEQ_PWR_GOOD- ASICSEQ_GFC_RST_L- ASICSEQ_CLK_EN_L- VPWR_OVERTEMP_L- ASICSEQ_PWR_FAULT_L. citeturn46search1COMO CONFIRMAR:- Confirmar boot de los 4 canales.- Confirmar ausencia de apagados.- Revisar Level0 Blackbox.- Revisar Level1 Blackbox.- Validar señales PGOOD.- Analizar el modo de falla reportado.CAUSAS PROBABLES:- Canal sin boot.- Problema de secuencia de energía.- Voltajes primarios incorrectos.- Voltajes secundarios incorrectos.- Protección térmica.- Problemas de reset o clock.- ASIC realmente defectuoso.ACCION CORRECTIVA:- Corregir primero problemas de boot.- Reparar fallas de alimentación.- Corregir señales PGOOD.- Resolver eventos térmicos.- Solo considerar reemplazo de ASIC después de completar el diagnóstico de secuencia y energía.RELACIONADO CON:- pcie-data-mismatch- under-voltage-on-rail- fish-firmware-missing- GFC Boot- ADM1266 Blackbox- Power SequencingSALIDA ESPERADA:Determinar si la falla es causada por el ASIC o por problemas de boot, energía, secuencia, reset o protección térmica antes de realizar un reemplazo innecesario del componente. Fallas de ASIC Saturday, January 17, 2026 1:50 PM Antes de determinar que es un asic es importante validar que nuestra unidad bootee correctamente , que ningún canal este sin bootear y a su vez que ningún canal se apague. Para esto podemos utilizar los comandos compartidos por nuestro compañero Emanuel Domínguez. Estos dentro del Carrot log list_gfc_cm_state.sh A continuación se muestra una unidad que bootea correctamente. [IMAGE_PLACEHOLDER_1] En la siguiente imagen se muestra un ejemplo de cómo es cuando algún canal no bootea, lo que nos indica que no directamente es el asic y requiere validacion. [IMAGE_PLACEHOLDER_2] Got ADM1266 black box dump for level0-sequencer Para revisar voltajes primarios [IMAGE_PLACEHOLDER_3] Got ADM1266 black box dump for level1-sequencer-gfcX Para revisar voltajes secundarios, (cambiar la x por el canal que necesitamos revisar) [IMAGE_PLACEHOLDER_4] Si esto se encuentra correcto, podemos proceder a revisar los logs del modo de falla. Ya que esto nos dice que la unidad bootea y esta no se apaga en ningún momento. German",
    photos: [
    {
      id: "Fallas_ASIC_Modificado_img_1",
      url: "./images/extracted/Fallas_ASIC_Modificado_img_1.png",
      title: "Evidencia Visual 1 (Fallas ASIC Modificado)",
      description: "Imagen extraÃ­da del documento original: Fallas_ASIC_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fallas_ASIC_Modificado_img_2",
      url: "./images/extracted/Fallas_ASIC_Modificado_img_2.png",
      title: "Evidencia Visual 2 (Fallas ASIC Modificado)",
      description: "Imagen extraÃ­da del documento original: Fallas_ASIC_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fallas_ASIC_Modificado_img_3",
      url: "./images/extracted/Fallas_ASIC_Modificado_img_3.png",
      title: "Evidencia Visual 3 (Fallas ASIC Modificado)",
      description: "Imagen extraÃ­da del documento original: Fallas_ASIC_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fallas_ASIC_Modificado_img_4",
      url: "./images/extracted/Fallas_ASIC_Modificado_img_4.png",
      title: "Evidencia Visual 4 (Fallas ASIC Modificado)",
      description: "Imagen extraÃ­da del documento original: Fallas_ASIC_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["fallas", "asic", "modificado", "local", "docs", "fallas_asic_modificado"]
  },
  {
    id: "Guia_Logs_Modificado",
    title: "Guia Logs Modificado",
    category: "DocumentaciÃ³n Local / Fallas de Asic",
    lastUpdated: "2026-08-06",
    content: "Guia_Logs_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Guía de Diagnóstico / Análisis de LogsUSO:Referencia para la revisión y análisis de logs relacionados con fallas de ASIC, secuencia de arranque, energía y canales GFC.APLICA CUANDO:- Se analiza un Carrot Log.- Existen fallas de ASIC.- Se requiere validar boot de canales.- Se requiere revisar eventos de energía.- Es necesario identificar la causa raíz de una falla.AREA:ISTDEBUGASICLOG ANALYSISKEYWORDS:Carrot LogASICGFCADM1266CM_DONECM_ERRORDebugBootPower SequencingRESUMEN:Esta guía sirve como referencia general para el análisis de logs utilizados en el diagnóstico de fallas de ASIC. La documentación indica que la guía GLP continúa siendo útil para la revisión de logs relacionados con fallas de ASIC y validación de eventos del sistema. Fuente: turn47search1USO RAPIDO:1. Abrir Carrot Log.2. Buscar síntomas reportados.3. Revisar eventos de boot.4. Revisar estados CM_DONE y CM_ERROR.5. Revisar ADM1266 Blackbox.6. Analizar el canal afectado.7. Confirmar causa raíz.VALIDACIONES PRINCIPALES:- Estado de boot.- Estado de energía.- Fallas térmicas.- Fallas de comunicación.- Eventos de protección.- Estado del ASIC.DOCUMENTOS RELACIONADOS:- Fallas ASIC.- ADM1266 Blackbox.- PCIe Data Mismatch.- Under Voltage On Rail.- Fish Firmware.SALIDA ESPERADA:Estandarizar el proceso de revisión de logs y facilitar la identificación de la causa raíz durante el proceso de debug. Guia Logs Saturday, January 17, 2026 2:09 PM Se tiene la siguiente guía de GLP la cual nos sigue siendo util para la revision de logs de fallas de ASICs GUIA",
    photos: [

    ],
    keywords: ["guia", "logs", "modificado", "local", "docs", "guia_logs_modificado"]
  },
  {
    id: "hbm_part_number_homogeneity_Modificado",
    title: "hbm part number homogeneity Modificado",
    category: "DocumentaciÃ³n Local / Fallas de Asic",
    lastUpdated: "2026-08-06",
    content: "hbm_part_number_homogeneity_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:HBM Part Number HomogeneityUSO:Diagnóstico de discrepancias en números de parte de memorias HBM3 instaladas en ASICs GFC.APLICA CUANDO:- Aparece la falla hbm-part-number-homogeneity.- Existen diferencias de PartNumber entre GFC.- Se requiere validar homogeneidad de memorias HBM.AREA:ISTDEBUGASICHBMMEMORIAKEYWORDS:HBM3PartNumberGFCSK HynixCapacityMiBOperatingSpeedMhzRedfishhbm-part-number-homogeneityRESUMEN:La falla indica una discrepancia en el número de parte reportado por módulos HBM. Se ha observado que las especificaciones técnicas permanecen iguales, pero algunos módulos presentan un PartNumber diferente al esperado. Fuente: turn48search1USO RAPIDO:1. Abrir Carrot Log.2. Buscar GFC_X_HBM0.3. Revisar CapacityMiB.4. Revisar OperatingSpeedMhz.5. Revisar PartNumber.6. Comparar contra otros GFC.7. Identificar módulos retrabajados.CRITERIO DE VALIDACION:- CapacityMiB = 24576.- OperatingSpeedMhz = 1800.- Manufacturer = SK Hynix.- MemoryDeviceType = HBM3.CRITERIO DE FALLA:PartNumber correcto esperado: 0.PartNumber sospechoso: cualquier valor diferente de 0.COMO CONFIRMAR:Consultar mediante Redfish:/redfish/v1/Systems/system/Memory/GFC_X_HBM0Comparar:- CapacityMiB- OperatingSpeedMhz- PartNumber- SerialNumberCAUSAS PROBABLES:- Módulo previamente retrabajado por cliente.- Diferencia de lote o reemplazo histórico.- Falta de homogeneidad entre módulos HBM.COMPONENTES RELACIONADOS:- HBM3.- ASIC GFC.- SK Hynix Memory.- Redfish Memory Inventory.ACCION CORRECTIVA:Cambiar los módulos cuyo PartNumber sea diferente de 0 conforme a los requerimientos del cliente para asegurar homogeneidad y uso de componentes considerados nuevos para producción.RELACIONADO CON:- ASIC Debug- Memory Validation- Redfish Inventory- HBM VerificationSALIDA ESPERADA:Confirmar que todos los módulos HBM instalados en producción reporten PartNumber 0 y mantengan especificaciones homogéneas entre todos los GFC. hbm-part-number-homogeneity Saturday, January 17, 2026 2:11 PM El log de falla muestra una discrepancia con los numeros de parte encontrados en los modulos de HBM de algunos GFC. En el caso de la unidad FLG2550-00020 esto llegó a afectar hasta a 3 GFCs. Para validar esto, dentro del carrot log filtramos el texto \"GFC_2_HBM0\" donde podemos ver los valores de capacidad (MB) y velocidad (MHz) de cada modulo HBM del ASIC. • “CapacityMiB”:24576 • “OperatingSpeedMHz”: 1800 • “PartNumber”: 0 [IMAGE_PLACEHOLDER_1] Si comparamos los resultados con cualquier otro ASIC, vemos que todas las especificaciones técnicas son exactamente las mismas, a diferencia del numero de parte. En los casos que hemos detectado, el numero de parte correcto debería ser \"0\" mientras que el erroneo será cualquiera diferente de \"0\". • “CapacityMiB”:24576 • “OperatingSpeedMHz”: 1800 • “PartNumber”: 1 [IMAGE_PLACEHOLDER_2] Aunque no parece una falla funcional como tal, los numero de partes que no sean 0, han sido retrabajados anteriormente por cliente, razón por la que es necesario cambiarlos, pues se espera que todas las unidades de produccion tengan componentes completamente nuevos para garantizar su calidad y funcionamiento. Emanuel Domínguez",
    photos: [
    {
      id: "hbm_part_number_homogeneity_Modificado_img_1",
      url: "./images/extracted/hbm_part_number_homogeneity_Modificado_img_1.png",
      title: "Evidencia Visual 1 (hbm part number homogeneity Modificado)",
      description: "Imagen extraÃ­da del documento original: hbm_part_number_homogeneity_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "hbm_part_number_homogeneity_Modificado_img_2",
      url: "./images/extracted/hbm_part_number_homogeneity_Modificado_img_2.png",
      title: "Evidencia Visual 2 (hbm part number homogeneity Modificado)",
      description: "Imagen extraÃ­da del documento original: hbm_part_number_homogeneity_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["hbm", "part", "number", "homogeneity", "modificado", "local", "docs", "hbm_part_number_homogeneity_modificado"]
  },
  {
    id: "Bobina_Desprendida_Modificado",
    title: "Bobina Desprendida Modificado",
    category: "DocumentaciÃ³n Local / ICT",
    lastUpdated: "2026-08-06",
    content: "Bobina_Desprendida_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de FallaUSO:Diagnóstico de fallas ocasionadas por desprendimiento de la bobina L25_3 y detección de circuitos abiertos asociados a la alimentación de relojes y canales de arranque.APLICA CUANDO:- La unidad falla en ICT con errores de Open.- Existe falla relacionada con la red VDD_3R3_BUF1_VDD_3.- Un canal no completa el boot.- El LED D0 permanece apagado mientras otros canales arrancan correctamente.- Se sospecha daño físico en componentes ubicados en Bottom.AREA:ICTISTREPARACIONDIAGNOSTICOANALISIS DE FALLASKEYWORDS:Bobina desprendidaL25_3ICTISTOpen CircuitVDD_3R3_BUF1_VDD_3D0Boot LEDGhostfishBottom SideAllegroChannel Boot FailureRESUMEN:Durante la liberación NPI se detectó una falla recurrente asociada al desprendimiento de la bobina L25_3. El síntoma principal es un circuito abierto detectado en ICT y, en algunos casos, un canal que no completa el boot en IST. La falla suele localizarse en la cara Bottom de la PCB.USO RAPIDO:1. Revisar log de ICT en busca de Open entre VDD_3R3_STBY y VDD_3R3_BUF1_VDD_3.2. Mapear la señal en Allegro.3. Verificar condición física de L25_3.4. En IST observar LEDs de boot.5. Si D0 permanece apagado mientras otros canales están en verde, considerar L25_3 como sospechosa.6. Validar condición de la bobina y componentes asociados.7. Reparar o reemplazar según criterio de ingeniería.SINTOMA PRINCIPAL:- Open detectado en ICT.- Canal D0 sin boot.- LED D0 apagado.CAUSA PROBABLE:- Bobina L25_3 desprendida.- Posible afectación de relojes alimentados por dicha bobina.COMO CONFIRMAR:- Revisar log ICT.- Analizar red en Allegro.- Inspección física del componente en Bottom.- Verificación de LEDs de boot durante IST.ACCION CORRECTIVA:- Inspeccionar L25_3.- Reparar o reemplazar la bobina.- Validar integridad de relojes asociados.- Repetir pruebas ICT e IST.RELACIONADO CON:- Allegro- ICT Shorts/Open Test- IST Debug- Fallas de arranque- Diagnóstico de canalesNOTA DE INGENIERIA:Actualmente la correlación principal se ha encontrado con la bobina L25_3 desprendida; sin embargo, también existe la posibilidad de que la condición esté asociada a los relojes alimentados por esta red y requiere validación adicional.SALIDA ESPERADA:Identificación de la causa raíz del Open y recuperación del canal afectado mediante reparación del circuito asociado. Bobina desprendida Durante el proceso de liberación de NPI se detectó un defecto recurrente durante el proceso en donde la bobina L25_3 (en la mayoría de los casos) se ve afectada. [IMAGE_PLACEHOLDER_1] Esto lo podemos detectar de dos maneras según sea la estación en la que haya fallado, porque si bien es mucho más común en ICT, también puede suceder en IST. Del lado de ICT es la forma sencilla, ya que fallará en la prueba de cortos mostrando el siguiente log: [IMAGE_PLACEHOLDER_2] Al mapear la señal en Allegro (si se requiere orientación sobre este procedimiento, puede consultarse la guía 2.4 en la sección de introducción), es posible observar que la bobina ubicada en la parte inferior (bottom) se encuentra desprendida de manera constante. Esta condición constituye la causa raíz del circuito abierto detectado durante la prueba ICT. [IMAGE_PLACEHOLDER_3] Ya que dicho componente se encuentra por bottom, para quienes ven IST es un poco más complicado, ya que la PCB al estar ensamblada, es prácticamente imposible validarla visualmente por abajo, así como tampoco hay ningún nodo o algún otro componente por la parte de top para realizar alguna medición y validar si la bobina está en su lugar. En este caso, podemos guiarnos con ayuda de los LEDs del status de booteo de cada canal. Por lo general, cuando esta bobina viene desprendida, el LED del D0 siempre se mantiene apagado, aun cuando los demás canales ya bootearon y se ponen de color verde, como se puede apreciar en la siguiente imagen: [IMAGE_PLACEHOLDER_4] [IMAGE_PLACEHOLDER_5] Aún no está 100% comprobado que siempre que este fenómeno suceda sea culpa de la bobina desprendida, también puede ser causado por los relojes a los que alimenta dicha bobina, pero por lo pronto, solo se ha encontrado el defecto de la bobina. Emanuel Domínguez",
    photos: [
    {
      id: "Bobina_Desprendida_Modificado_img_1",
      url: "./images/extracted/Bobina_Desprendida_Modificado_img_1.png",
      title: "Evidencia Visual 1 (Bobina Desprendida Modificado)",
      description: "Imagen extraÃ­da del documento original: Bobina_Desprendida_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Bobina_Desprendida_Modificado_img_2",
      url: "./images/extracted/Bobina_Desprendida_Modificado_img_2.png",
      title: "Evidencia Visual 2 (Bobina Desprendida Modificado)",
      description: "Imagen extraÃ­da del documento original: Bobina_Desprendida_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Bobina_Desprendida_Modificado_img_3",
      url: "./images/extracted/Bobina_Desprendida_Modificado_img_3.png",
      title: "Evidencia Visual 3 (Bobina Desprendida Modificado)",
      description: "Imagen extraÃ­da del documento original: Bobina_Desprendida_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Bobina_Desprendida_Modificado_img_4",
      url: "./images/extracted/Bobina_Desprendida_Modificado_img_4.png",
      title: "Evidencia Visual 4 (Bobina Desprendida Modificado)",
      description: "Imagen extraÃ­da del documento original: Bobina_Desprendida_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Bobina_Desprendida_Modificado_img_5",
      url: "./images/extracted/Bobina_Desprendida_Modificado_img_5.png",
      title: "Evidencia Visual 5 (Bobina Desprendida Modificado)",
      description: "Imagen extraÃ­da del documento original: Bobina_Desprendida_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["bobina", "desprendida", "modificado", "local", "docs", "bobina_desprendida_modificado"]
  },
  {
    id: "Boundary_Scan_Modificado",
    title: "Boundary Scan Modificado",
    category: "DocumentaciÃ³n Local / ICT",
    lastUpdated: "2026-08-06",
    content: "Boundary_Scan_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Herramienta / Procedimiento de DiagnósticoUSO:Diagnóstico de fallas relacionadas con Boundary Scan, cadenas JTAG principal y secundaria, validación de señales JTAG, bypass de dispositivos y análisis de comunicación entre gBMC, PSX y GFCs.APLICA CUANDO:- Existe una falla de JTAG o Boundary Scan.- ICT reporta problemas de comunicación en la cadena JTAG.- Se requiere aislar GFC, PSX o gBMC.- Se necesita validar señales TDI, TDO, TCK, TMS o TRST.- Se requiere utilizar el conector de bypass P6.AREA:ICTDEBUGDIAGNOSTICOINGENIERIABOUNDARY SCANKEYWORDS:Boundary ScanJTAGP10P6P36gBMCU19PSXGFC0GFC1GFC2GFC3Keysight x1149TDITDOTCKTMSTRSTBypassRESUMEN:Este documento describe la arquitectura de las cadenas JTAG principal y secundaria en Ghostfish, los conectores involucrados, señales críticas, modos de bypass y métodos de diagnóstico para localizar interrupciones o fallas de comunicación en Boundary Scan. Basado en la documentación del archivo original.REFERENCIA: turn18search1USO RAPIDO:1. Validar voltajes en modo diodo del conector P10.2. Revisar señales JTAG principales.3. Utilizar P6 para aislar componentes mediante bypass.4. Identificar dispositivo defectuoso en la cadena.5. Validar cadena secundaria por P36.6. Revisar señales generadas por U19.7. Confirmar operación JTAG mediante Keysight x1149.CONECTORES PRINCIPALES:- P10: JTAG Header principal.- P6: Bypass Header.- P36: GFC0 Secondary Debug.DISPOSITIVOS DE LA CADENA:- gBMC (U19)- PSX (U67)- GFC0- GFC1- GFC2- GFC3SEÑALES CRITICAS:- JTAG_BSEN- BMC_JTAG_CORST_L- JTAG_GFC_HDR_PRSNT_L- TDI- TDO- TCK- TMS- TRSTCOMO CONFIRMAR FALLAS:- Comparación de voltajes en modo diodo.- Validación de continuidad JTAG.- Uso de bypass para aislar dispositivos.- Monitoreo de pulsos TDO/TDI.- Prueba mediante Keysight x1149.ACCION CORRECTIVA:- Aislar componente defectuoso mediante bypass.- Reparar rutas JTAG afectadas.- Validar traductores de nivel.- Solicitar apoyo de Ingeniería de Pruebas para análisis avanzado.RELACIONADO CON:- ICT- Keysight 3070- Boundary Scan Analyzer- gBMC- PSX- GFC- Diagnóstico digitalSALIDA ESPERADA:Identificación del dispositivo o señal que interrumpe la cadena JTAG y recuperación de la funcionalidad de Boundary Scan. Boundary scan Thursday, January 22, 2026 8:21 PM El conector de la cadena principal de Jtag es el P10 que se menciona como JTAG Header en el esquemático, en la siguiente tabla se ponderan los valores de voltaje en modo diodo: [IMAGE_PLACEHOLDER_1] Otro conector a tener en cuenta es el conector P6 (Bypass Header) que tiene como función la de poner en Bypass a uno o varios de los seis componentes de la cadena principal, [IMAGE_PLACEHOLDER_2] Esto son gBMC (U19), PSX (U67), GF0, GF1, GF2, GF3. Para poner en Bypass a cualquiera de ellos, se deberá de hacer un corto circuito entre el terminal correspondiente y tierra, En la figura se muestra el Bypass del GFC1, por lo que si existiera un problema en dicho GFC1, al ponerlo en Bypass podríamos volver a correr la prueba de Jtag y la cadena estaría sin interrupciones, aunque tendría un componente menos de los declarados. [IMAGE_PLACEHOLDER_3] A la par de la cadena principal existe la cadena secundaria que es gobernada por gBCM (U19) en el conector P36 (GFC0 - SEC DEBUG) se tiene acceso a ella, en la siguiente tabla se ponderan los valores de voltaje en modo diodo: [IMAGE_PLACEHOLDER_4] Conector P36 Voltaje en Terminal Nombre modo Diodo 1 VDD_3R3_STBY 0.329 2 JTAG_BSEN 0.564 3 JTAG_HDR1_TRST_R_L 0 4 BMC_JTAG_CORST_L 0.557 5 JTAG_HDR1_TDI_R 0 6 JTAG_GFC_HDR_PRSNT_L 0.615 7 JTAG_HDR1_TMS_R 0 8 GND 0.558 9 JTAG_HDR1_TCK_R 0 10 GND 0.564 Los GFC1, GFC2 y GFC3 no tienen conector especifico, pero siguen siendo manejados por gBMC (U19) por medio del siguiente esquema: [IMAGE_PLACEHOLDER_5] La siguiente imagen es la sección del gBCM (U19) que maneja la cadena secundaria: [IMAGE_PLACEHOLDER_6] Aquí se observan las señales de la cadena principal en la sección superior y a los de la cadena secundaria en la inferior. La forma de conocer cuál de las cadenas está en operación es mediante las señales [IMAGE_PLACEHOLDER_7] JTAG_BSEN Señal que avisa al gBCM (U19) con un \"1\" que el controlador (Keysigth x1491) va a tomar contro del BOUNDARY SCAN BMC_JTAG_CORST_L cuando esta señal es \"0\" el controlador (Keysigth x1491) pone al gBCM (U19) en Reset para tener la certeza del estado en que se encuentra el gBCM JTAG_GFC_HDR_PRSNT_L donde U56 la traduce en JTAG_BYPASS_BMC_L_R y en TAG_BYPASS_PSX_L_R, por lo que deshabilita tanto al gBCM (U19) como al PSX (U67) Una opción de diagnóstico para probar las terminales TDI, TDO en la tarjeta es utilizar la secuencia de pulsos que genera U19.Y18 (JTAG_BMC_TDO_R) (estos pulsos se generan despues de 35 seg. De estar energizada la tarjeta) y que son trasladados de un voltaje de 3.3 VDC a un voltaje de 1.8 VDC por medio de U26, para con ellos pulsar las líneas de TDI/TDO de los GFC_x [IMAGE_PLACEHOLDER_8] En el caso de falla de Jtag, es conveniente solicitar apoyo al departamento de pruebas, para que ellos utilicen las utilerias del keysight x1149 boundary scan analyzer (El controlador de Jtag que utiliza el sistema 3070), el cual posee modos de auto configuración que permite configurar el controlador para que puedan realizarce la prueba de Jtag del ICT. Roberto Mar Agued",
    photos: [
    {
      id: "Boundary_Scan_Modificado_img_1",
      url: "./images/extracted/Boundary_Scan_Modificado_img_1.png",
      title: "Evidencia Visual 1 (Boundary Scan Modificado)",
      description: "Imagen extraÃ­da del documento original: Boundary_Scan_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Boundary_Scan_Modificado_img_2",
      url: "./images/extracted/Boundary_Scan_Modificado_img_2.png",
      title: "Evidencia Visual 2 (Boundary Scan Modificado)",
      description: "Imagen extraÃ­da del documento original: Boundary_Scan_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Boundary_Scan_Modificado_img_3",
      url: "./images/extracted/Boundary_Scan_Modificado_img_3.png",
      title: "Evidencia Visual 3 (Boundary Scan Modificado)",
      description: "Imagen extraÃ­da del documento original: Boundary_Scan_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Boundary_Scan_Modificado_img_4",
      url: "./images/extracted/Boundary_Scan_Modificado_img_4.png",
      title: "Evidencia Visual 4 (Boundary Scan Modificado)",
      description: "Imagen extraÃ­da del documento original: Boundary_Scan_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Boundary_Scan_Modificado_img_5",
      url: "./images/extracted/Boundary_Scan_Modificado_img_5.png",
      title: "Evidencia Visual 5 (Boundary Scan Modificado)",
      description: "Imagen extraÃ­da del documento original: Boundary_Scan_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Boundary_Scan_Modificado_img_6",
      url: "./images/extracted/Boundary_Scan_Modificado_img_6.png",
      title: "Evidencia Visual 6 (Boundary Scan Modificado)",
      description: "Imagen extraÃ­da del documento original: Boundary_Scan_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Boundary_Scan_Modificado_img_7",
      url: "./images/extracted/Boundary_Scan_Modificado_img_7.png",
      title: "Evidencia Visual 7 (Boundary Scan Modificado)",
      description: "Imagen extraÃ­da del documento original: Boundary_Scan_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Boundary_Scan_Modificado_img_8",
      url: "./images/extracted/Boundary_Scan_Modificado_img_8.png",
      title: "Evidencia Visual 8 (Boundary Scan Modificado)",
      description: "Imagen extraÃ­da del documento original: Boundary_Scan_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["boundary", "scan", "modificado", "local", "docs", "boundary_scan_modificado"]
  },
  {
    id: "Opens_en_GFC_y_VPWR_ICT_Modificado",
    title: "Opens en GFC y VPWR ICT Modificado",
    category: "DocumentaciÃ³n Local / ICT",
    lastUpdated: "2026-08-06",
    content: "Opens_en_GFC_y_VPWR_ICT_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de FallaUSO:Diagnóstico de Opens (circuitos abiertos) en GFC, VPWR, memorias, sockets y Power Modules detectados principalmente durante ICT.APLICA CUANDO:- ICT reporta un Open.- Existen discrepancias de resistencia contra unidad Golden.- Se sospecha falta de contacto eléctrico en componentes SMT.- Existen fallas relacionadas con GFC, VPWR, memorias o sockets.AREA:ICTREPARACIONDEBUGDIAGNOSTICOSMTKEYWORDS:OpenICTGFCVPWRU19U47_0SKT1Power ModuleAXIGolden UnitDiodoCircuito AbiertoRESUMEN:La mayoría de los Opens son detectados mediante ICT y se diagnostican mediante comparación con una unidad Golden o un circuito gemelo. El análisis puede apoyarse en inspección visual, AXI, mediciones de resistencia, modo diodo y validación de continuidad eléctrica.USO RAPIDO:1. Revisar log de ICT.2. Identificar nodo afectado.3. Comparar contra unidad Golden.4. Medir resistencia a GND o utilizar modo diodo.5. Realizar inspección visual del componente.6. Revisar evidencia AXI.7. Confirmar Open.8. Reparar y validar nuevamente.SINTOMAS:- Open reportado por ICT.- Contacto parcial de esferas BGA.- Terminales levantadas.- Soldadura insuficiente.- Power Module con escurrimiento de soldadura.CAUSAS PROBABLES:- Falta de contacto entre esfera y componente.- Soldadura insuficiente.- Componente elevado.- Socket mal asentado.- Defecto de ensamble SMT.HERRAMIENTAS:- ICT- AXI- Allegro- Multímetro- Fuente DC 0.7V- Unidad GoldenCOMO CONFIRMAR:- Comparación de resistencia o modo diodo.- Evidencia AXI.- Inspección microscópica.- Método de inyección de 0.7V usando diodos internos de protección.ACCION CORRECTIVA:- Reparar unión de soldadura.- Reemplazar componente si es necesario.- Corregir problema de ensamble.- Revalidar en ICT.RELACIONADO CON:- AXI- Allegro- ICT- Power Modules- GFC- VPWRSALIDA ESPERADA:Identificación precisa del punto abierto y recuperación de la continuidad eléctrica de la red afectada. Opens en GFC y VPWR (ICT) La mayoría de los Opens se encontraran al validar el log de falla de ICT (In-Cicuit-Test) la estrategia es por medio de comparación ya sea contra una unidad Golden y/o otro circuito gemelo del que requerimos diagnosticar. Esto es midiendo la resistencia a tierra entre GND (tierra) y el punto en cuestión, aunque en ocasiones es más rápido hacerlo en modo Diodo (punta rojas siempre a tierra) debido a que en este modo el multímetro nos proporciona una sola escala y mentalmente es más sencillo hacer comparaciones rápidas. Las siguientes son imágenes de SMD como el GFC_2, U19, socket SKT1, U47_0 y U1C_3 (Power Modules) [IMAGE_PLACEHOLDER_1] [IMAGE_PLACEHOLDER_2] Se Observa que las esferas de soldadura No tienen contacto físico con el componente U19 [IMAGE_PLACEHOLDER_3] Las esferas de soldadura están deformes y No tienen contacto físico completo con el componente U19 [IMAGE_PLACEHOLDER_4] La esfera de soldadura de la derecha casi No tienen contacto físico con el componente U19 [IMAGE_PLACEHOLDER_5] La terminal SKT1.9 escasamente toca la soldadura del Pad y el contacto eléctrico está comprometido [IMAGE_PLACEHOLDER_6] La memoria U47_0 esta elevada y puede presentar Opens en un extremo y cortos en el otro extremo. [IMAGE_PLACEHOLDER_7] U1C_3 (Power Modules) presenta escurrimiento de soldadura por lo que no se garantiza la unión eléctrica de su terminal (muela) con el cuerpo del Power Module [IMAGE_PLACEHOLDER_8] Para facilitar la captura de las imágenes, es aconsejable contar con un espejo al cual se le ha realizado un bisel de cuarenta y cinco grado, el bisel se logra mediante el uso de una piedra domestica de afilar cuchillos. Otros recursos con los que contamos son las imágenes de AXI, donde nos muestran las discrepancias durante su inspección. Aunque en algunos casos no son concluyentes, estas imágenes nos muestran defectos que son indicadores de proceso que pueden inclinar la balanza hacia uno los varios componentes que forman parte de una falla. [IMAGE_PLACEHOLDER_9] Otro recurso es el uso de los diodos de protección que forman parte de las terminales de entrada en muchos de los componentes electrónicos, en donde aplicando un voltaje de 0.7 VDC podemos determinar si circula una pequeña corriente por la terminal a diagnosticar. [IMAGE_PLACEHOLDER_10] El terminal \"A\" es el terminal que requerimos saber si presenta un Open a tierra, podemos ver que debido al Open (ejemplificado por el interruptor abierto) la lectura en el Voltímetro será de 0 VDC, mientras que de No existir el Open, sería igual a 0.7 VDC menos la caída de tensión del diodo interno. Roberto Mar Agued",
    photos: [
    {
      id: "Opens_en_GFC_y_VPWR_ICT_Modificado_img_1",
      url: "./images/extracted/Opens_en_GFC_y_VPWR_ICT_Modificado_img_1.png",
      title: "Evidencia Visual 1 (Opens en GFC y VPWR ICT Modificado)",
      description: "Imagen extraÃ­da del documento original: Opens_en_GFC_y_VPWR_ICT_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Opens_en_GFC_y_VPWR_ICT_Modificado_img_2",
      url: "./images/extracted/Opens_en_GFC_y_VPWR_ICT_Modificado_img_2.png",
      title: "Evidencia Visual 2 (Opens en GFC y VPWR ICT Modificado)",
      description: "Imagen extraÃ­da del documento original: Opens_en_GFC_y_VPWR_ICT_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Opens_en_GFC_y_VPWR_ICT_Modificado_img_3",
      url: "./images/extracted/Opens_en_GFC_y_VPWR_ICT_Modificado_img_3.png",
      title: "Evidencia Visual 3 (Opens en GFC y VPWR ICT Modificado)",
      description: "Imagen extraÃ­da del documento original: Opens_en_GFC_y_VPWR_ICT_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Opens_en_GFC_y_VPWR_ICT_Modificado_img_4",
      url: "./images/extracted/Opens_en_GFC_y_VPWR_ICT_Modificado_img_4.png",
      title: "Evidencia Visual 4 (Opens en GFC y VPWR ICT Modificado)",
      description: "Imagen extraÃ­da del documento original: Opens_en_GFC_y_VPWR_ICT_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Opens_en_GFC_y_VPWR_ICT_Modificado_img_5",
      url: "./images/extracted/Opens_en_GFC_y_VPWR_ICT_Modificado_img_5.png",
      title: "Evidencia Visual 5 (Opens en GFC y VPWR ICT Modificado)",
      description: "Imagen extraÃ­da del documento original: Opens_en_GFC_y_VPWR_ICT_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Opens_en_GFC_y_VPWR_ICT_Modificado_img_6",
      url: "./images/extracted/Opens_en_GFC_y_VPWR_ICT_Modificado_img_6.png",
      title: "Evidencia Visual 6 (Opens en GFC y VPWR ICT Modificado)",
      description: "Imagen extraÃ­da del documento original: Opens_en_GFC_y_VPWR_ICT_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Opens_en_GFC_y_VPWR_ICT_Modificado_img_7",
      url: "./images/extracted/Opens_en_GFC_y_VPWR_ICT_Modificado_img_7.png",
      title: "Evidencia Visual 7 (Opens en GFC y VPWR ICT Modificado)",
      description: "Imagen extraÃ­da del documento original: Opens_en_GFC_y_VPWR_ICT_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Opens_en_GFC_y_VPWR_ICT_Modificado_img_8",
      url: "./images/extracted/Opens_en_GFC_y_VPWR_ICT_Modificado_img_8.jpeg",
      title: "Evidencia Visual 8 (Opens en GFC y VPWR ICT Modificado)",
      description: "Imagen extraÃ­da del documento original: Opens_en_GFC_y_VPWR_ICT_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Opens_en_GFC_y_VPWR_ICT_Modificado_img_9",
      url: "./images/extracted/Opens_en_GFC_y_VPWR_ICT_Modificado_img_9.png",
      title: "Evidencia Visual 9 (Opens en GFC y VPWR ICT Modificado)",
      description: "Imagen extraÃ­da del documento original: Opens_en_GFC_y_VPWR_ICT_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Opens_en_GFC_y_VPWR_ICT_Modificado_img_10",
      url: "./images/extracted/Opens_en_GFC_y_VPWR_ICT_Modificado_img_10.png",
      title: "Evidencia Visual 10 (Opens en GFC y VPWR ICT Modificado)",
      description: "Imagen extraÃ­da del documento original: Opens_en_GFC_y_VPWR_ICT_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["opens", "gfc", "vpwr", "ict", "modificado", "local", "docs", "opens_en_gfc_y_vpwr_ict_modificado"]
  },
  {
    id: "Power_Modules_o_Qbrick_en_Corto_Modificado",
    title: "Power Modules o Qbrick en Corto Modificado",
    category: "DocumentaciÃ³n Local / ICT",
    lastUpdated: "2026-08-06",
    content: "Power_Modules_Qbrick_Corto_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de FallaUSO:Diagnóstico de cortocircuitos relacionados con Power Modules, Qbrick y redes de alimentación en tarjetas Ghostfish.APLICA CUANDO:- Existe una discrepancia de resistencia durante diagnóstico.- Se detecta un corto circuito en ICT, IST o reparación.- Se sospecha daño en Power Modules o Qbrick.- Existen errores de conexión, splash de soldadura o daño físico.AREA:ICTISTREPARACIONDEBUGANALISIS DE FALLASKEYWORDS:QbrickPower ModuleShort CircuitCorto CircuitoThermal CameraVoltage DropFour Wire MeasurementOhmmeterGNDSplash de SoldaduraBridgeDiagnosticoRESUMEN:Esta falla puede presentarse por daño físico, sobretemperatura, daño eléctrico, errores de conexión o defectos de retrabajo. El diagnóstico debe comenzar identificando la discrepancia reportada y aplicando la técnica adecuada según el nivel de resistencia encontrado.USO RAPIDO:1. Revisar log de falla.2. Identificar componente o red afectada.3. Medir resistencia de la discrepancia.4. Utilizar cámara térmica cuando sea posible.5. Realizar inspección visual.6. Aplicar mediciones de dos o cuatro puntas según el valor observado.7. Utilizar método de caída de tensión o tierra más positiva para localizar el corto.8. Confirmar causa raíz.SINTOMAS:- Corto circuito.- Sobreconsumo.- Lecturas de resistencia fuera de especificación.- Fallas funcionales asociadas a redes de alimentación.CAUSAS PROBABLES:- Power Module dañado.- Qbrick dañado.- Splash de soldadura.- Puentes de soldadura.- Error de conexión.- Daño por temperatura o impacto.- Defectos generados durante reparación.METODOS DE DIAGNOSTICO:- Cámara térmica.- Inspección visual.- Óhmetro de dos puntas (&gt;100 Ohm).- Medición Kelvin / cuatro puntas (&lt;10 Ohm).- Método de mayor caída de tensión.- Método de tierra más positiva.- Inyección de corriente controlada.PRECAUCIONES:- No exceder el voltaje nominal de la red.- Limitar la corriente inyectada.- Verificar reparaciones previas.- Evitar generar daños secundarios durante el diagnóstico.RELACIONADO CON:- Qbrick Test- Voltage Regulator Test- Power Rails- Diagnóstico eléctrico- Fallas de alimentación- Reparación electrónicaSALIDA ESPERADA:Localización precisa del componente o nodo responsable del corto circuito y eliminación de la causa raíz. Power modules o Qbrick en corto Saturday, January 17, 2026 8:11 PM Esta falla se presenta en todos los niveles de diagnóstico y puede ocurrir por daño físico (Golpes o sobre temperatura) como por daño eléctrico así como por error de conexión y/o Splash de soldadura. Aquí es importante partir del log de falla para identificar localmente el componente con medición discrepante, una vez localizada el área a diagnosticar medimos con el Óhmetro el valor de la discrepancia, dependiendo de ello podemos utilizar uno de los siguientes métodos Cuando la discrepancia permita el uso de la cámara térmica este será el método más rápido, ya que visualmente observaremos diferencias en los perfiles térmicos de los componentes Igualmente podemos realizar una inspección visual de la unidad para tratar de detectar daños físicos y/o errores de conexión (memoria flash invertida en el socket SKT1) Si la variación de la discrepancia permite utilizar el Óhmetro ya sea con medición a dos puntas (resistencia mayor a 100 Ohm) o menor de 10 Ohm medición a cuatro puntas, buscaremos mediante el apoyo del diagrama esquemático encontrar la lectura de resistencia más baja para detectar la causa raíz de la discrepancia. Cuando se tenga Cortos circuito con valor menor a un Ohm es aconsejable utilizar una fuente de corriente regulable, esto es para alimentar la discrepancia con un valor seguro de corriente y midiendo la caída de tensión podemos determinar la ruta de la corriente de corto circuito (Método de Mayor Caída de tensión). O también podemos medir el voltaje en los diferentes nodos de tierra (GND) para utilizar el Método de tierra más positiva, este último es el más efectivo debido a que la gran cantidad de componentes que tienen conexión a tierra permiten rastrear la discrepancia en la totalidad de la tarjeta. Cuando inyectemos corriente con una fuente controlada de corriente, esta se deberá conectar con el positivo al punto donde se presenta la discrepancia y el negativo a tierra o GND, debemos de tener en cuenta que la corriente que inyectamos sea menor a la corriente máxima que soportan las pistas por donde a de circular dicha corriente. Otro punto a considerar es regular el voltaje de dicha fuente de corriente a un valor igual o menor al voltaje nominal del Nodo a red en el que se encuentra la discrepancia, esto debido a que posterior a un retrabajo en la tarjeta, el calor que recibió pudo haber disminuido el dieléctrico de los capacitores electrolíticos por lo que se comportaran como cortos circuitos hasta que se regenere dicho dieléctrico por la acción de una corriente de voltaje de DC. Lo anterior viene a colación porque en muchos casos al estar buscando el corto circuito este se resuelve al aplicar la corriente de la fuente controlada, entonces el voltaje aplicado puede incrementarse de forma abrupta y si este voltaje de la fuente es mayor al valor nominal del voltaje la red donde se encontraba el corto circuito, podríamos generar un daño donde realmente no existía. Un punto a considerar de existir, es la última reparación hecha a la unidad, pues es frecuente que el error sea causado por la misma reparación ejem Splash de soldadura o puentes de soldadura en la reparación o cerca de ella. Roberto Mar Agued",
    photos: [

    ],
    keywords: ["power", "modules", "qbrick", "corto", "modificado", "local", "docs", "power_modules_o_qbrick_en_corto_modificado"]
  },
  {
    id: "Resistencias_Murata_ICT_Modificado",
    title: "Resistencias Murata ICT Modificado",
    category: "DocumentaciÃ³n Local / ICT",
    lastUpdated: "2026-08-06",
    content: "Resistencias_Murata_ICT_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de Falla / Falso RechazoUSO:Identificar fallas asociadas a resistencias Murata reportadas incorrectamente por el script de ICT debido a valores nominales mal configurados.APLICA CUANDO:- ICT reporta falla en resistencias Murata.- El valor medido coincide con el valor real del componente.- Existen múltiples fallas similares en varios canales.- Se sospecha un problema de programación del test y no un defecto físico.AREA:ICTDEBUGREPARACIONDIAGNOSTICOINGENIERIA DE PRUEBAKEYWORDS:MurataICTFalse FailFalse RejectR261R262Resistance TestNominal ValueICT ScriptTest ProgramRESUMEN:Este modo de falla está relacionado con una configuración incorrecta del programa de ICT. El sistema compara la medición contra un valor nominal erróneo, generando fallas falsas aunque las resistencias instaladas sean correctas.USO RAPIDO:1. Revisar el log de ICT.2. Identificar las resistencias reportadas.3. Comparar el valor medido contra el valor físico del BOM.4. Validar la resistencia con multímetro.5. Confirmar que el valor real sea correcto.6. Regresar la unidad a retest si no existe daño físico.SINTOMAS:- Falla simultánea en varios canales.- Valor medido aparentemente fuera de especificación.- Componentes físicamente correctos.- Mediciones repetibles y consistentes.CAUSA PROBABLE:- Valor nominal incorrecto dentro del script de ICT.- Programa basado en una revisión previa del diseño.- Configuración de límites incorrecta.COMO CONFIRMAR:- Verificar el valor marcado en el componente.- Revisar BOM o documentación de ingeniería.- Medir la resistencia directamente.- Comparar con unidad Golden.ACCION CORRECTIVA:- Confirmar valor real del componente.- Documentar falso rechazo.- Enviar la unidad a retest.- Escalar a Ingeniería de Prueba para corrección del script.EJEMPLO DOCUMENTADO:R261_xValor real observado: ~6.02kΩValor nominal configurado en ICT: 2.26kΩResultado: Falla falsa generada por configuración errónea.RELACIONADO CON:- ICT Paperless- Falsos Rechazos- Ingeniería de Prueba- Validación de Componentes- Golden UnitSALIDA ESPERADA:Confirmar que la unidad no presenta defecto físico y evitar reparaciones innecesarias causadas por errores del programa de prueba. Resistencias Murata (ICT) Saturday, January 17, 2026 2:18 PM Este modo de falla es un problema directamente del script de ICT, ya que falla varias resistencias de los cuatro canales debido a que, supuestamente, están midiendo un valor mayor al nominal, sin embargo, el valor que aparece en la medición, es el valor nominal correcto. El programa tiene mal declarado el valor nominal, o se basaron en un programa, versión o diseño anterior. En cualquiera que sea el caso, asegúrate de que las resistencias midan correctamente antes de regresar la unidad a retest. [IMAGE_PLACEHOLDER_1] Emanuel Domínguez",
    photos: [
    {
      id: "Resistencias_Murata_ICT_Modificado_img_1",
      url: "./images/extracted/Resistencias_Murata_ICT_Modificado_img_1.png",
      title: "Evidencia Visual 1 (Resistencias Murata ICT Modificado)",
      description: "Imagen extraÃ­da del documento original: Resistencias_Murata_ICT_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["resistencias", "murata", "ict", "modificado", "local", "docs", "resistencias_murata_ict_modificado"]
  },
  {
    id: "U19_GFC_3_CH_interconnect_dot6_Modificado",
    title: "U19 GFC 3 CH interconnect dot6 Modificado",
    category: "DocumentaciÃ³n Local / ICT",
    lastUpdated: "2026-08-06",
    content: "U19_GFC_3_CH_interconnect_dot6_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:ICT – Interconnect Dot6 / Open en GFC-CDFPUSO:Diagnóstico de fallas U19_GFC_3_CH:interconnect_dot6 relacionadas con opens o falsos contactos entre GFC y CDFP.APLICA CUANDO:- Aparece U19_GFC_3_CH:interconnect_dot6 en ICT.- Existen nodos GFC_TX_C_CDFP_RX afectados.- Se sospecha daño por inserción de CDFP.- Existen problemas de continuidad entre GFC y CDFP.AREA:ICTDEBUGGFCCDFPKEYWORDS:interconnect_dot6GFC_TX_C_CDFP_RXCDFPOpenHysteretic MatchC21_3U19ICTRESUMEN:La falla generalmente está asociada a opens o cortos en el camino de interconexión entre el GFC y el CDFP. Frecuentemente se origina por problemas de inserción del conector, terminales dañadas o falsos contactos. El log indica directamente el nodo y el capacitor de acoplamiento involucrado. citeturn56search1SINTOMAS:- Open (Hysteretic Match).- Nodos GFC_TX_C_CDFP_RX afectados.- Diferencias entre valores Expected y Actual.- Falla ICT U19_GFC_3_CH:interconnect_dot6. citeturn56search1USO RAPIDO:1. Identificar el nodo reportado.2. Localizar el capacitor indicado por el log.3. Inspeccionar físicamente el capacitor.4. Conectar y verificar el CDFP.5. Medir impedancias en ambos lados del capacitor.6. Mover ligeramente el CDFP para detectar falso contacto.7. Determinar si la falla proviene del lado GFC o del lado CDFP.COMO INTERPRETAR EL LOG:Ejemplo:GFC_TX_C_CDFP_RX_P_10__3 (GFC_3.GW53, C21_3.1, GFC_3.HC53)Esto indica que la señal afectada es GFC_TX_C_CDFP_RX_P_10 y que el punto principal de diagnóstico es el capacitor C21_3. citeturn56search1VALIDACION PRINCIPAL:Medir impedancia inversa en el capacitor asociado.PIN 1 (lado GFC):≈ 1.5 kΩPIN 2 (lado CDFP):≈ 24 kΩ a 25 kΩEstos valores son válidos para los canales documentados C1_X a C32_X. citeturn56search1CRITERIO DE DIAGNOSTICO:- Si el valor incorrecto aparece en el lado GFC, investigar el canal GFC.- Si el valor incorrecto aparece en el lado CDFP, investigar el conector CDFP.- Si la lectura cambia al mover el CDFP, sospechar falso contacto o terminal dañada. citeturn56search1CAUSAS PROBABLES:- Pin doblado en CDFP.- Falso contacto del CDFP.- Open en pista.- Capacitor dañado.- Corto ocasionado durante inserción.- Problemas mecánicos del conector. citeturn56search1ACCION CORRECTIVA:- Inspeccionar capacitor asociado.- Revisar condición física del CDFP.- Verificar continuidad de la señal.- Corregir terminales dañadas.- Sustituir componentes defectuosos cuando aplique.- Ejecutar nuevamente ICT.COMPONENTES RELACIONADOS:- U19- GFC- CDFP- C1_X a C32_X- Capacitores de acoplamiento 0.22uFSALIDA ESPERADA:Identificar si la falla se encuentra del lado GFC o del lado CDFP y restaurar la continuidad eléctrica para eliminar la falla interconnect_dot6. U19_GFC_3_CH:interconnect_dot6 Wednesday, January 14, 2026 2:24 PM En este bloque U19_GFC_3_CH:interconnect_dot6 del log de Falla. Este problema generalmente viene acompañado del nodo o nodos afectados donde las principales causas son un open o corto en alguno de los CDFPs debido al proceso de inserción del conector. En las imágenes siguientes se pueden ver logs donde el nodo nos indica las señales afectadas. [IMAGE_PLACEHOLDER_1] ¿Cómo la validamos? En este caso el log nos indica el canal y la señal afectada. además del capacitor que interconecta al GFC_X con el CDFP_X como se muestra a continuación: [IMAGE_PLACEHOLDER_2] Esto nos indica que el problema se encuentra en la señal GFC_TX_C_CDFP_RX_P_10__3 y el punto donde podemos medirlo es el capacitor C21_3. Esta forma de leerlo la podemos aplicar en otro caso como el de la primer imagen donde la señal con problemas es GFC_TX_C_CDFP_RX_P_0__2 entendiendo esto lo primero es revisar que el capacitor se encuentre físicamente bien, para después conectar el CDFP. [IMAGE_PLACEHOLDER_3] Al medir impedancia a la inversa en capacitor nos indicara si el problema está el lado del GFC_X o del CDFP_X las impedancias que estos tienen es de 1.5KΩ en el Pin1 señal que va al GFC y en el pin 2 entre 24KΩ y 25KΩ la señal que va al CDFP. Al medir podemos mover un poco el CDFP ya que puede no tener un pin doblado pero si estar haciendo un mal contacto. [IMAGE_PLACEHOLDER_4] Pin 2 capacitor al CDFP_2 [IMAGE_PLACEHOLDER_5] Pin 1 capacitor al GFC_2 [IMAGE_PLACEHOLDER_6] Estos están presentes en los 4 cdfps y sus impedancias a la inversa con el CDFP conectado son: [IMAGE_PLACEHOLDER_7] En la imagen siguiente se muestra un CDFP al momento de ser retirado. [IMAGE_PLACEHOLDER_8] German Escobar",
    photos: [
    {
      id: "U19_GFC_3_CH_interconnect_dot6_Modificado_img_1",
      url: "./images/extracted/U19_GFC_3_CH_interconnect_dot6_Modificado_img_1.png",
      title: "Evidencia Visual 1 (U19 GFC 3 CH interconnect dot6 Modificado)",
      description: "Imagen extraÃ­da del documento original: U19_GFC_3_CH_interconnect_dot6_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "U19_GFC_3_CH_interconnect_dot6_Modificado_img_2",
      url: "./images/extracted/U19_GFC_3_CH_interconnect_dot6_Modificado_img_2.png",
      title: "Evidencia Visual 2 (U19 GFC 3 CH interconnect dot6 Modificado)",
      description: "Imagen extraÃ­da del documento original: U19_GFC_3_CH_interconnect_dot6_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "U19_GFC_3_CH_interconnect_dot6_Modificado_img_3",
      url: "./images/extracted/U19_GFC_3_CH_interconnect_dot6_Modificado_img_3.jpeg",
      title: "Evidencia Visual 3 (U19 GFC 3 CH interconnect dot6 Modificado)",
      description: "Imagen extraÃ­da del documento original: U19_GFC_3_CH_interconnect_dot6_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "U19_GFC_3_CH_interconnect_dot6_Modificado_img_4",
      url: "./images/extracted/U19_GFC_3_CH_interconnect_dot6_Modificado_img_4.png",
      title: "Evidencia Visual 4 (U19 GFC 3 CH interconnect dot6 Modificado)",
      description: "Imagen extraÃ­da del documento original: U19_GFC_3_CH_interconnect_dot6_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "U19_GFC_3_CH_interconnect_dot6_Modificado_img_5",
      url: "./images/extracted/U19_GFC_3_CH_interconnect_dot6_Modificado_img_5.png",
      title: "Evidencia Visual 5 (U19 GFC 3 CH interconnect dot6 Modificado)",
      description: "Imagen extraÃ­da del documento original: U19_GFC_3_CH_interconnect_dot6_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "U19_GFC_3_CH_interconnect_dot6_Modificado_img_6",
      url: "./images/extracted/U19_GFC_3_CH_interconnect_dot6_Modificado_img_6.png",
      title: "Evidencia Visual 6 (U19 GFC 3 CH interconnect dot6 Modificado)",
      description: "Imagen extraÃ­da del documento original: U19_GFC_3_CH_interconnect_dot6_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "U19_GFC_3_CH_interconnect_dot6_Modificado_img_7",
      url: "./images/extracted/U19_GFC_3_CH_interconnect_dot6_Modificado_img_7.png",
      title: "Evidencia Visual 7 (U19 GFC 3 CH interconnect dot6 Modificado)",
      description: "Imagen extraÃ­da del documento original: U19_GFC_3_CH_interconnect_dot6_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "U19_GFC_3_CH_interconnect_dot6_Modificado_img_8",
      url: "./images/extracted/U19_GFC_3_CH_interconnect_dot6_Modificado_img_8.png",
      title: "Evidencia Visual 8 (U19 GFC 3 CH interconnect dot6 Modificado)",
      description: "Imagen extraÃ­da del documento original: U19_GFC_3_CH_interconnect_dot6_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["u19", "gfc", "interconnect", "dot6", "modificado", "local", "docs", "u19_gfc_3_ch_interconnect_dot6_modificado"]
  },
  {
    id: "U2_X_Modificado",
    title: "U2 X Modificado",
    category: "DocumentaciÃ³n Local / ICT",
    lastUpdated: "2026-08-06",
    content: "U2_X_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Componente Crítico / Procedimiento de DiagnósticoUSO:Diagnóstico, validación y análisis del regulador U2_x (TDA38740A) utilizado para generar la línea VDD_HBM_VDDQL_x en tarjetas Ghostfish.APLICA CUANDO:- Existe falla en VDD_HBM_VDDQL_x.- Se detectan problemas de arranque de GFC.- Existen alarmas de sobrecorriente.- Se sospecha daño en reguladores Infineon TDA38740A.- Se requiere validar configuración de resistencias strap.AREA:ICTISTDEBUGREPARACIONDIAGNOSTICOINGENIERIAKEYWORDS:U2_xTDA38740AInfineonBuck RegulatorVDD_HBM_VDDQLPGOODALERT_LPMBusOCPVR_HBMGFCPower RailRESUMEN:U2_x es un regulador síncrono Buck Infineon TDA38740A capaz de suministrar hasta 40A. Su correcta operación depende de la configuración de resistencias strap y de la presencia de voltajes específicos en sus señales de control, alimentación y monitoreo.IDENTIFICACION:- Fabricante: Infineon- Parte esperada: TDA387400020- Configuración requerida: VOUT_SCALE_LOOP = 1:1- Corriente nominal: 40ARESISTENCIAS DE CONFIGURACION:- R32_x = 5.62KΩ- R33_x = 0Ω- R34_x = 43.2KΩ- R35_x = 0ΩUSO RAPIDO:1. Realizar inspección visual.2. Confirmar número de parte.3. Verificar resistencia de salida.4. Validar valores en modo diodo.5. Verificar alimentación de 12V.6. Revisar señales PGOOD y ALERT_L.7. Confirmar salida VDD_HBM_VDDQL_x.PARAMETROS NORMALES:- Resistencia caliente: 2 a 4Ω.- Resistencia fría: 4.5 a 8Ω.- VIN esperado: 12VDC.- Salida VDD_HBM_VDDQL_x: 0.4VDC.SEÑALES CRITICAS:- PVIN- VIN- VCC- PGOOD- ALERT_L- BST- ADDR- ASICSEQ_VDDQL_ENCOMO CONFIRMAR FALLAS:- Revisar valores de modo diodo.- Verificar voltajes de operación.- Confirmar estado de PGOOD.- Confirmar estado de ALERT_L.- Comparar contra canal funcional.CAUSAS PROBABLES:- Regulador dañado.- Configuración incorrecta de resistencias.- Ausencia de 12V.- Protección OCP activada.- Falla térmica.- Sobrevoltaje o subtensión.ACCION CORRECTIVA:- Corregir componentes auxiliares.- Reemplazar U2_x cuando aplique.- Corregir resistencias strap.- Validar nuevamente la línea VDD_HBM_VDDQL_x.RELACIONADO CON:- GFC- PMBus- Reguladores Buck- Power Rails- Debug eléctrico- Diagnóstico de alimentaciónSALIDA ESPERADA:Identificar si la falla proviene del regulador U2_x, de sus señales de control o de la red de alimentación asociada. U2_X Friday, January 23, 2026 5:58 PM El U2_x donde x puede ser 0,1,2, 3 es un regulador de voltaje fabricado por infineon con matrícula TDA38740_PQFN37_22PIN y que el fabricante define como un regulador síncrono buck totalmente integrado y de alta eficiencia, capaz de entregar hasta 40 A, disponible en un paquete PQFN-37, que admite voltajes de salida programables, límites de corriente y frecuencias de conmutación mediante configuraciones de pin-strap o PMBus. La resistencia en su salida medida en R39_x varía entre 2 y 4 Ohms cuando la tarjeta está caliente y entre 4.5 y 8 Ohms cuando la tarjeta esta fría. La siguiente fotografía muestra al U2_1 y aquí debemos de tener en cuenta los siguientes parámetros [IMAGE_PLACEHOLDER_1] El número de parte debe ser TDA387400020, lo que nos asegura que tendrá VOUT_SCALE_LOOP set to 1:1 [IMAGE_PLACEHOLDER_2] Así mismo las resistencia R32_x, R33_x. R34_x y R35_x son las resistencias que configuran el funcionamiento del U2_x: R32_x debe ser de 5.62 Kohms y configura SM_ADDR/PROG SM_ADDR como 1 en el Offset de la selección de la dirección base R33_x debe ser de 0 Ohms por lo que selecciona una frecuencia de oscilación de 600 KHz y FCCM (Forced Continous Conduction Mode) R34_x debe ser de 43.2Kohms con lo que se fija la OCP(A) en 40 Amperes OCP (protección de sobre corriente) R35_x de ser de 0 Ohms y en nuestro caso fija en 0.4 VDC la BOOT-Up Voltage (V) (Voltaje de arranque) que es el voltaje en que debe operar nuestra línea de VDD_HBM_VDDQL_x Acciones en caso de falla: A.- Inspección visual del U2_x y sus circuitos auxiliares en cuestión B.- Posterior a la inspección visual mediremos los voltajes en modo diodo típicas en los siguientes puntos B.1- VDD_12R0_GFC a medirse en C74_x.1 (PVIN) y también en R990_x.2 (VIN) y debe ser 0.348 VDC en ambos casos B.2- VR_HBM_VDDQL_1_VCC este voltaje variara entre 0.487 y 0.488 VDC se medirá en la resistencia R36_x que siendo de 0 Ohms podrá ser en cualquier de sus terminales. B.3- VDD_HBM_VDDQL_1 a medirse en C56_x.1 y debe ser de entre 0.0019 VDC y 0.0034 VDC B.4- VR_HBM_VDDQL_1_PGOOD_x a medirse en R3_x.1 y debe ser entre 0.509 y 0.513 VDC B.5- VR_HBM_VDDQL_1_PHVX a medirse en R14_x.1 y debe ser 0.0020 y 0.0039 VDC B.6- VR_HBM_VDDQL_1_BST a medirse en C46_x.1 y debe ser entre 0.566 y 0569 VDC B.7- ASICSEQ_VDDQL_EN 0 a medirse en R30_x.2 y debe ser entre 0.615 y 0.618 VDC B.8- VR_HBM_VDDQL_1_ADDR a medirse en R32_x.2y debe ser 0.780 VDC B.9- VR_HBM_VDDQL_1_ALERT_L a medirse en R31_x.2 y debe ser entre 0.70 y 0.723 VDC C.- Voltajes a checar en caso de falla del VDD_HBM_VDDQL_x: C.1- VDD_12R0_GFC a medirse en C74_x.1 (PVIN) y también en R990_x.2 (VIN) y debe ser 12 VDC C.2- VR_HBM_VDDQL_1_VCC este voltaje variara entre 4.7 y 5.3 siendo 5.02 un voltaje típico, se medirá en la resistencia R36_x que siendo de 0 Ohms podrá ser en cualquier de sus terminales. C.3- VDD_HBM_VDDQL_1 a medirse en C56_x.1 y debe ser de 0.4 VDC +/- 0.002 VDC típicamente C.4- VR_HBM_VDDQL_1_PGOOD_x a medirse en R3_x.1 y debe ser de 3.3 VDC, aquí la forma de onda es importante, por favor checarlo en forma gráfica. C.5- VR_HBM_VDDQL_1_ALERT_L a medirse en R31_x.2 y debe ser un \"1\" esto es entre 3.28 y 3.31 VDC en nuestro caso. Esta señal se hará \"0\" para indicar límite de sobre corriente , protección contra sobrevoltaje y subtensión, y apagado por desbordamiento térmico Continuar mañana Roberto Mar Agued",
    photos: [
    {
      id: "U2_X_Modificado_img_1",
      url: "./images/extracted/U2_X_Modificado_img_1.jpeg",
      title: "Evidencia Visual 1 (U2 X Modificado)",
      description: "Imagen extraÃ­da del documento original: U2_X_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "U2_X_Modificado_img_2",
      url: "./images/extracted/U2_X_Modificado_img_2.png",
      title: "Evidencia Visual 2 (U2 X Modificado)",
      description: "Imagen extraÃ­da del documento original: U2_X_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["modificado", "local", "docs", "u2_x_modificado"]
  },
  {
    id: "U76_x_Tambien_Aplica_Para_U50_x_Modificado",
    title: "U76 x Tambien Aplica Para U50 x Modificado",
    category: "DocumentaciÃ³n Local / ICT",
    lastUpdated: "2026-08-06",
    content: "U76_x_Tambien_Aplica_Para_U50_x_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de Falla / Procedimiento de DiagnósticoUSO:Diagnóstico de fallas en U76_x y U50_x relacionadas con la red de monitoreo de temperatura VPWR2_TEMP_SNS_P y VPWR2_TEMP_SNS_N.APLICA CUANDO:- ICT reporta fallas u76_x_dx2_n_gnd o u76_x_dx2_p_gnd.- Las resistencias medidas son significativamente menores al valor nominal.- Existe sospecha de falla funcional en el circuito de sensado de temperatura.- Las mediciones contra una KGU parecen correctas pero la unidad sigue fallando.AREA:ICTDEBUGREPARACIONDIAGNOSTICOPOWERKEYWORDS:U76_xU50_xVPWR2_TEMP_SNS_PVPWR2_TEMP_SNS_NTemperature SensorICTKGUPower UpCDFPC715_1RESUMEN:Este modo de falla puede presentarse aun cuando las mediciones estáticas sean similares a una KGU. El diagnóstico requiere energizar la unidad y analizar la forma de onda entre las señales de sensado de temperatura. Una amplitud anormal o la ausencia del patrón característico observado en una KGU indican una falla funcional en la red de monitoreo.USO RAPIDO:1. Revisar log de ICT.2. Comparar las mediciones contra una KGU.3. Energizar la unidad sin el CDFP0 de Power-Up.4. Medir entre VPWR2_TEMP_SNS_P y VPWR2_TEMP_SNS_N.5. Comparar la forma de onda contra una unidad KGU.6. Evaluar amplitud y estabilidad.7. Considerar cambio de C715_1 para aislar la red.8. Confirmar la causa raíz.SINTOMAS:- Falla recurrente en ICT.- Resistencia medida muy inferior al nominal.- Forma de onda con amplitud excesiva.- Ausencia de la zona plana presente en una KGU.COMPONENTES INVOLUCRADOS:- U76_x- U50_x- C715_1- VPWR2_1- CDFP0 Power-UpCOMO CONFIRMAR:- Comparación directa contra KGU.- Análisis dinámico de la señal.- Evaluación de variaciones de temperatura.- Aislamiento mediante retiro de C715_1.ACCION CORRECTIVA:- Analizar la red de sensado de temperatura.- Sustituir componentes defectuosos.- Reemplazar C715_1 cuando sea requerido.- Validar nuevamente mediante ICT y comparación con KGU.RELACIONADO CON:- Diagnóstico analógico- VPWR- Monitoreo de temperatura- ICT Golden Unit- Power DiagnosticsSALIDA ESPERADA:Identificar si la anomalía proviene de U76_x, U50_x o de la red de monitoreo de temperatura asociada y restaurar el funcionamiento normal del circuito. U76_x Tambien aplica para U50_x Wednesday, March 18, 2026 8:43 PM La unidad presentaba consistentemente el siguiente log de falla : [IMAGE_PLACEHOLDER_1] Las mediciones contra una KGU eran completamente similares, por lo que se energizo la unidad, sin el CDFP0 de Power-Up y se encontró en U76_1 con falla eléctrica funcional entre U76_1.1 (VPWR2_TEMP_SNS_P) vs U76_1.2 U76_1.2 (VPWR2_TEMP_SNS_N) en las siguientes imágenes podemos ver un patrón distinto al de una KGU, donde la amplitud es mayor y no existe una parte plana que si se presenta en las KGU. [IMAGE_PLACEHOLDER_2] Unidad a diagnosticar [IMAGE_PLACEHOLDER_3] Unidad KGU [IMAGE_PLACEHOLDER_4] Unidad KGU de control Adicionalmente se solicita cambio de C715_1 para obviar dos de los tres elementos que conforman la red de lectura de temperatura, el tercero sería VPRW2_1. (Conectamos la tarjeta sin el CDFP_0 de Power-Up para que todos los GFC estén a la misma temperatura, de la forma de onda solo nos interesan las variaciones, por lo que dejamos correr la medición hasta que el multímetro solo ve los pequeños cambios) Roberto Mar Agued",
    photos: [
    {
      id: "U76_x_Tambien_Aplica_Para_U50_x_Modificado_img_1",
      url: "./images/extracted/U76_x_Tambien_Aplica_Para_U50_x_Modificado_img_1.png",
      title: "Evidencia Visual 1 (U76 x Tambien Aplica Para U50 x Modificado)",
      description: "Imagen extraÃ­da del documento original: U76_x_Tambien_Aplica_Para_U50_x_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "U76_x_Tambien_Aplica_Para_U50_x_Modificado_img_2",
      url: "./images/extracted/U76_x_Tambien_Aplica_Para_U50_x_Modificado_img_2.png",
      title: "Evidencia Visual 2 (U76 x Tambien Aplica Para U50 x Modificado)",
      description: "Imagen extraÃ­da del documento original: U76_x_Tambien_Aplica_Para_U50_x_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "U76_x_Tambien_Aplica_Para_U50_x_Modificado_img_3",
      url: "./images/extracted/U76_x_Tambien_Aplica_Para_U50_x_Modificado_img_3.png",
      title: "Evidencia Visual 3 (U76 x Tambien Aplica Para U50 x Modificado)",
      description: "Imagen extraÃ­da del documento original: U76_x_Tambien_Aplica_Para_U50_x_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "U76_x_Tambien_Aplica_Para_U50_x_Modificado_img_4",
      url: "./images/extracted/U76_x_Tambien_Aplica_Para_U50_x_Modificado_img_4.png",
      title: "Evidencia Visual 4 (U76 x Tambien Aplica Para U50 x Modificado)",
      description: "Imagen extraÃ­da del documento original: U76_x_Tambien_Aplica_Para_U50_x_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["u76", "tambien", "aplica", "para", "u50", "modificado", "local", "docs", "u76_x_tambien_aplica_para_u50_x_modificado"]
  },
  {
    id: "ICT_LITE_Modificado",
    title: "ICT LITE Modificado",
    category: "DocumentaciÃ³n Local / ICT LITE",
    lastUpdated: "2026-08-06",
    content: "ICT_LITE_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Proceso de Prueba / Herramienta de DiagnósticoUSO:Ejecutar pruebas ICT en unidades que tienen instalados los cuatro SCP y que no pueden ser evaluadas mediante la configuración estándar de producción.APLICA CUANDO:- La tarjeta tiene instalados los cuatro SCP.- Se requiere ejecutar ICT en una unidad completamente ensamblada.- No es posible utilizar la configuración estándar con enfriamiento por Chillers.- Se requiere validación previa a energizar la tarjeta.AREA:ICTTESTVALIDACIONDIAGNOSTICONPIKEYWORDS:ICT LiteICTSCP3070Golden UnitGolden ModeChillerTest FixtureElectrical TestGhostfishRESUMEN:ICT Lite es una versión reducida de la prueba ICT convencional. Fue desarrollada para validar tarjetas con los cuatro SCP instalados utilizando un equipo especializado. Debido a que no cuenta con el sistema de enfriamiento utilizado por los equipos estándar, la tarjeta no es energizada durante la prueba para evitar sobrecalentamiento.USO RAPIDO:1. Verificar que la unidad tenga los cuatro SCP instalados.2. Utilizar la estación ICT Lite habilitada.3. Ejecutar la prueba sin energizar la tarjeta.4. Analizar resultados eléctricos previos al encendido.5. Validar fallas encontradas o liberar la unidad.CARACTERISTICAS:- Versión reducida de ICT.- No energiza la tarjeta.- Evita riesgos de sobrecalentamiento.- Compatible con pruebas Golden.- Utiliza una mecánica de prueba similar al ICT estándar.VENTAJAS:- Permite probar unidades con SCP instalados.- Reduce riesgo térmico.- Facilita diagnósticos eléctricos preliminares.- Mantiene compatibilidad con metodologías ICT existentes.LIMITACIONES:- No valida comportamientos posteriores al encendido.- No ejecuta pruebas que requieran energización.- Cobertura menor que ICT completo.COMO CONFIRMAR:- Verificar que la prueba fue ejecutada en modo ICT Lite.- Corroborar que la tarjeta no fue energizada.- Revisar resultados obtenidos antes de la etapa de power-up.RELACIONADO CON:- ICT- Golden Unit- In-Circuit Test- Test 3070- SCP- Diagnóstico eléctricoSALIDA ESPERADA:Validación eléctrica segura de tarjetas con cuatro SCP instalados antes de aplicar energía al sistema.",
    photos: [

    ],
    keywords: ["ict", "lite", "modificado", "local", "docs", "ict_lite_modificado"]
  },
  {
    id: "Conector_LED_Modificado",
    title: "Conector LED Modificado",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "Conector_LED_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Referencia de Hardware / Conector LEDUSO:Diagnóstico y validación de los conectores LED0 y LED1 utilizados para indicación de estado del sistema Ghostfish.APLICA CUANDO:- Existen fallas relacionadas con LED Card.- Aparece ledcard-prsntX-gpio.- Se requiere validar continuidad del conector LED.- Existen daños físicos en la tarjeta de LEDs.AREA:DEBUGREPARACIONHARDWAREDIAGNOSTICOISTKEYWORDS:LED0LED1LED CardLED0_PRSNTLED1_PRSNTLED1_PRSNT_PUSYS_PWRGOOD_L_LEDSYS_ATTN_L_LEDVDD_3R3_STBYGFCRESUMEN:La unidad Ghostfish utiliza dos conectores de 30 pines denominados LED0 y LED1. Estos conectores proporcionan alimentación, tierra, señales de presencia y señales de estado provenientes de los GFC para la tarjeta de LEDs. citeturn34search1CONECTOR LED0:- 3 pines de VDD_3R3_STBY.- 3 pines GND.- Señal LED0_PRSNT.- Señales provenientes de GFC0 y GFC1.- Pines internos de presencia.- Pines no conectados según diseño. citeturn34search1CONECTOR LED1:- 3 pines de VDD_3R3_STBY.- 3 pines GND.- SYS_PWRGOOD_L_LED.- SYS_ATTN_L_LED.- Señales provenientes de GFC2 y GFC3.- LED1_PRSNT.- LED1_PRSNT_PU. citeturn34search1VALIDACIONES RECOMENDADAS:1. Inspección visual del conector.2. Verificación de continuidad.3. Medición en modo diodo.4. Verificación de alimentación 3.3V.5. Comparación contra unidad Golden.SEÑALES CRITICAS:- LED0_PRSNT- LED1_PRSNT- LED1_PRSNT_PU- SYS_PWRGOOD_L_LED- SYS_ATTN_L_LED- GFCx_PCIE_LINK_L_LED- GFCx_OSFP_PRSNT_L_LEDCAUSAS PROBABLES:- Conector dañado.- Open en líneas LED.- Falta de alimentación VDD_3R3_STBY.- Problemas de presencia LED Card.- Daño en tarjeta LED.COMO CONFIRMAR:- Medir pines en modo diodo.- Validar alimentación y tierras.- Revisar señales de presencia.- Comparar lecturas contra los valores de referencia documentados.LIMITACION:Actualmente el ensamble de la tarjeta de LEDs no es reparable. citeturn34search1RELACIONADO CON:- LED Card- ledcard-prsntX-gpio- GPIO Presence Detect- GFC Status LEDs- Hardware ValidationSALIDA ESPERADA:Confirmar la integridad eléctrica y funcional de los conectores LED0 y LED1 y determinar si la falla se origina en la tarjeta madre o en la tarjeta de LEDs. Conector LED Saturday, January 17, 2026 10:29 PM Como se mencionó en la sección \"1.7 Conector LED\", la unidad GF cuenta con dos conectores denominados LED0 y LED1, el siguiente diagrama muestra el LED0 [IMAGE_PLACEHOLDER_1] Igualmente este es el diagrama del LED1 [IMAGE_PLACEHOLDER_2] De los 30 pines de cada conector se observa en el conector de LED0 que tres corresponden a la alimentación VDD_3R3_STBY y tres a retorno de corriente (GND) uno más es de entrada LED0_PRSNT y de los restantes 20 pines corresponden a salidas que provienen de los GFC_0 y GFC_1. Dos son terminales no conectadas y ultimo pin restante es un pin interno que le informa a la tarjeta de LEDs que tiene conexión con la tarjeta madre. Mientras que en el conector de LED1 De los 30 pines del conector se observa en el conector de LED1 que tres corresponden a la alimentación VDD_3R3_STBY y tres a retorno de corriente (GND) uno más es de salida SYS_PWRGOOD_L_LED y otro más de salida que es SYS_ATTN_L_LED,los restantes 20 pines corresponden a salidas que provienen de los GFC_2 y GFC_3, existe una salida generada por la tarjeta del Display LED1_PRSNT y un último pin restante que es un pin interno que le informa a la tarjeta de LEDs que tiene conexión con la tarjeta madre (LED1_PRSNT_PU). La siguiente tabla muestra el voltaje en modo Diodo Terminal Voltaje en Terminal Voltaje en LED0 modo Diodo LED1 modo Diodo 30 0.117 30 0.529 29 0.117 29 1.134 28 0.117 28 0 27 0.718 27 0 26 0.648 26 0 25 0.72 25 Over flow 24 0.648 24 Over flow 23 0.721 23 0.722 22 0.667 22 0.65 21 0.718 21 0.722 20 0.649 20 0.65 19 0.81 19 0.72 18 0.651 18 0.653 17 0.598 17 0.72 16 0.65 16 0.65 15 0.593 15 0.822 14 0.65 14 0.651 13 0.595 13 0.719 12 0.665 12 0.646 11 0.598 11 0.719 10 0.651 10 0.647 9 0.821 9 0.718 8 0.651 8 0.675 7 0.567 7 0.719 6 0.624 6 0.647 5 0 5 0.821 4 0 4 0.649 3 0 3 0.117 2 1.134 2 0.117 1 0.529 1 0.117 Cabe hacer notar que en la actualidad el ensamble de la tarjeta de Leds No es reparable. Roberto Mar Agued",
    photos: [
    {
      id: "Conector_LED_Modificado_img_1",
      url: "./images/extracted/Conector_LED_Modificado_img_1.png",
      title: "Evidencia Visual 1 (Conector LED Modificado)",
      description: "Imagen extraÃ­da del documento original: Conector_LED_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Conector_LED_Modificado_img_2",
      url: "./images/extracted/Conector_LED_Modificado_img_2.png",
      title: "Evidencia Visual 2 (Conector LED Modificado)",
      description: "Imagen extraÃ­da del documento original: Conector_LED_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["conector", "led", "modificado", "local", "docs", "conector_led_modificado"]
  },
  {
    id: "Fan_X_duty_30_initial_speed_Modificado",
    title: "Fan X duty 30 initial speed Modificado",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "Fan_X_duty_30_initial_speed_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de Falla de Ventilador / Control PWMUSO:Diagnóstico de fallas fanX-duty-30-initial-speed relacionadas con velocidad insuficiente, falta de revoluciones o control PWM incorrecto de los ventiladores.APLICA CUANDO:- Aparece fanX-duty-30-initial-speed.- Algún FAN no alcanza las RPM esperadas.- Existen fallas en duty cycle de 30%, 50%, 70% o 100%.- Existen alarmas de velocidad o tachómetro.AREA:ISTDEBUGTHERMALFAN CONTROLREPARACIONKEYWORDS:fanX-duty-30-initial-speedFAN0FAN1FAN2FAN3PWMTACHU141U137MAX31790Fan ModuleMOLEX 43045-1628RESUMEN:Esta falla está asociada a la incapacidad de uno o varios ventiladores para alcanzar la velocidad requerida. La causa puede encontrarse en el módulo de ventiladores, conectores, señales PWM, señales TACH, circuitos de multiplexado o controladores de ventilador. citeturn38search1USO RAPIDO:1. Verificar qué FAN presenta la falla.2. Confirmar si el módulo completo gira.3. Inspeccionar el conector FAN0.4. Validar voltajes de entrada.5. Revisar señales PWM.6. Revisar señales TACH.7. Comparar contra una unidad Golden.8. Confirmar causa raíz.MODULO DE VENTILADORES:- FAN0- FAN1- FAN2- FAN3Ubicados de izquierda a derecha dentro del Fan Tray. citeturn38search1ESCENARIO 1:MODULO DESCONECTADOSINTOMAS:- Ninguno de los cuatro ventiladores gira.- Sin RPM al encender.VALIDAR:- Conector FAN0.- Ensamble del módulo.- Pines doblados o dañados.- Soldaduras del conector. citeturn38search1ESCENARIO 2:FALLA FUNCIONALVALIDACIONES ELECTRICAS:- Alimentación principal ≈ 54V.- Alimentación lógica ≈ 1.5V.- Señales PWM.- Señales TACH.SEÑALES CRITICAS:- FAN0_MUX_PWM- FAN1_MUX_PWM- FAN2_MUX_PWM- FAN3_MUX_PWM- FANx_TACH_RCOMPONENTES RELACIONADOS:- U141 PI3CH480LEX.- U137 MAX31790.- U19 BMC.- R1665.- R1666.- R1667.- R1668.- MOLEX 43045-1628. citeturn38search1VALIDACION PWM:Frecuencia esperada aproximada:25 kHz.Si la señal PWM es incorrecta:- Revisar U141.- Revisar U137.- Revisar U19.- Revisar resistencias de entrada. citeturn38search1VALIDACION TACH:Comparar la forma de onda de retorno proveniente del ventilador.Una diferencia significativa puede indicar:- Módulo defectuoso.- Pasivos dañados.- Problemas de lectura de RPM. citeturn38search1COMO CONFIRMAR:- Medir voltajes de entrada.- Revisar PWM con osciloscopio.- Revisar TACH con osciloscopio.- Validar selección de control mediante pin S de U141.- Comparar con unidad funcional.CAUSAS PROBABLES:- Módulo FAN defectuoso.- Conector FAN0 dañado.- Ausencia de PWM.- Señal TACH incorrecta.- U141 defectuoso.- U137 MAX31790 defectuoso.- U19 defectuoso.ACCION CORRECTIVA:- Reparar conector FAN0.- Sustituir módulo de ventiladores.- Reparar red PWM/TACH.- Sustituir U141 o U137 cuando aplique.- Validar operación en todos los duty cycles.RELACIONADO CON:- Thermal Management- Fan Tray- PWM Control- Tachometer Feedback- MAX31790- BMC Fan ControlSALIDA ESPERADA:Identificar el punto exacto donde se pierde el control o la retroalimentación del ventilador y restaurar la velocidad correcta del FAN afectado. Fan\"X\"-duty-30-initial-speed Friday, January 16, 2026 6:25 PM Al observar la unidad en modo \"Box\" nosotros podemos ver la presencia de un módulo con 4 ventiladores dentro de él. Este módulo casado con la unidad, muestra la separación de cada uno de los 4 ventiladores que tiene dentro de él. Dentro de la cara \"Top\" del módulo se muestra el nombre de cada uno de los ventiladores los cuales son FAN0, FAN1, FAN2 y FAN3 consecutivamente de izquierda a derecha. [IMAGE_PLACEHOLDER_1] Esta falla se refiere a la poca o nula capacidad de alguno de los ventiladores dentro del módulo a realizar las revoluciones adecuadas. Esto puede ser causado por diversos factores que serán presentados a continuación. Modulo de Ventiladores desconectado. Esta causa de falla solo es valida cuando ninguno de los 4 ventiladores dentro del módulo no realizan ninguna revolución al momento de encender la unidad. Esta situación ocurre cuando el conector FAN0 no está conectado de forma correcta al módulo de los ventiladores; tal es el ejemplo que se muestra a comunicación. [IMAGE_PLACEHOLDER_2] Esto se puede validar retirando el módulo de los ventiladores. ¿Cómo se hace? Sencillo, pedirle a desensamble que te retire e módulo de los ventiladores. Sin embargo y como dato curioso el módulo cuenta con dos pestillos (uno de cada lado) que, al momento de presionar simultáneamente los dos pestillos y jalar hacia arriba el módulo, este sale sin ninguna complicación. [IMAGE_PLACEHOLDER_3] [IMAGE_PLACEHOLDER_4] Ya retirado validar que el conector se encuentre bien ensamblado en su lugar adecuado como se muestra a continuación. [IMAGE_PLACEHOLDER_5] También puede presentarse el caso de que el conector FAN0 presente alguna anomalía tanto de soldadura como de daños físicos, por lo que vale la pena inspeccionarlo. Falla Funcional. Esta falla se puede presentar de forma funcional tanto del lado del módulo como de la PCB. Para validar esto, primero se deben realizar diversas mediciones y en base a ello tomar la decisión de qué componente cambiar. Pero antes, se debe explicar el funcionamiento de forma general, para entender que se está haciendo. Primeramente y observando el diagrama del circuito a diagnosticar, logramos observar que el conector FAN0 encargado de conectar el módulo de los ventiladores y la PCB tiene de entrada una señal PWM (o (Modulación por Ancho de Pulso por su siglas en inglés). [IMAGE_PLACEHOLDER_6] Esto significa que la señal indicadora de la activación y la velocidad de revoluciones (RPM´s) consisten de una señal de pulsos, la cual y dependiendo de su \"Duty Cycle\", el ventilador se revolucionará a cierta velocidad. (Tal es el ejemplo mostrado a continuación). [IMAGE_PLACEHOLDER_7] Pero antes de realizar validaciónes de PWM, primero se deben realizar mediciones de voltaje con multímetro donde te indique el esquemático. [IMAGE_PLACEHOLDER_8] Donde se pueden realizar ciertas mediciones directas del conector, desconectandolo un momento, ya que estas son mediciones de entrada. [IMAGE_PLACEHOLDER_9] Caso contrario con los voltajes de salida ya que no podrás desconectar el conector. Estas mediciones se deben realizar aqui. [IMAGE_PLACEHOLDER_10] Además de esto, se deben validar las entradas y salidas con osciloscopio para poder observar las señales PWM. En la entrada hacia el conector FAN0 (Las señales PWM marcadas en verde), el osciloscopio nos envía estas funciones. [IMAGE_PLACEHOLDER_11] Y las salidas que vienen de los ventiladores hacia la PCB (marcados en azul) son prácticamente las mismas. [IMAGE_PLACEHOLDER_12] Esto dicta que si hay alguna variación en estos datos y depende de donde se encuentra la variación podemos descartar ciertos componentes. Si la variación se presenta del lado de los puntos de prueba marcados en azul, se podría sospechar el cambiar el módulo de ventiladores o algun pasivo de la salida del conector (Tales como la R6, R8, D22, etc). Si la variación se presenta antes de entrar al conector FAN0 o sease, en los puntos de prueba marcados en verde (Señales PWM), la falla se vuelve un poco más complicada. En este caso primero seria validar el voltaje de 3.3V del componente U141 y validar componentes pasivos de entrada de voltaje (R1665, R1666, R1667 y R1668). [IMAGE_PLACEHOLDER_13] Validando esto, se debe medir el pin 1 (PIN S) del mismo componente mencionado Esto porque ese pin es encargado de dictar cual controlador utilizará para enviar las señales PWM al conector FAN0 [IMAGE_PLACEHOLDER_14] Si tu realizas la medición en el pin y logras ver un 1 lógico entonces el control lo tomará el U19 pero en cambio y normalmente si se presenta un 0 lógico el control lo toma el U137. Validnado esto y sabiendo cual es el componente que debe tomar el control, se realiza una medición de la señal PWM que debe verse así. [IMAGE_PLACEHOLDER_15] Si en algúno de los dos casos esa señal no se ve así (Ya sea con el 1 o 0 lógicos) debes sospechar del U137 o U19 todo dependiendo del que deba estar tomando el control en ese momento. Finalmente y en un hipotético caso en donde todo mida bien y la falla siga persistiendo, se debería sospechar del componente U137 o U19 respectivamente, ya que son los encargados de recibir la señal enviada del módulo de los ventiladores a la PCB. [IMAGE_PLACEHOLDER_16] Jose Mercado",
    photos: [
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_1",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_1.jpeg",
      title: "Evidencia Visual 1 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_2",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_2.png",
      title: "Evidencia Visual 2 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_3",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_3.png",
      title: "Evidencia Visual 3 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_4",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_4.png",
      title: "Evidencia Visual 4 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_5",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_5.png",
      title: "Evidencia Visual 5 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_6",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_6.png",
      title: "Evidencia Visual 6 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_7",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_7.jpeg",
      title: "Evidencia Visual 7 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_8",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_8.png",
      title: "Evidencia Visual 8 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_9",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_9.png",
      title: "Evidencia Visual 9 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_10",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_10.png",
      title: "Evidencia Visual 10 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_11",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_11.png",
      title: "Evidencia Visual 11 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_12",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_12.png",
      title: "Evidencia Visual 12 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_13",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_13.png",
      title: "Evidencia Visual 13 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_14",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_14.png",
      title: "Evidencia Visual 14 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_15",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_15.png",
      title: "Evidencia Visual 15 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Fan_X_duty_30_initial_speed_Modificado_img_16",
      url: "./images/extracted/Fan_X_duty_30_initial_speed_Modificado_img_16.png",
      title: "Evidencia Visual 16 (Fan X duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: Fan_X_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["fan", "duty", "initial", "speed", "modificado", "local", "docs", "fan_x_duty_30_initial_speed_modificado"]
  },
  {
    id: "ledcard_prsntX_gpio_Modificado",
    title: "ledcard prsntX gpio Modificado",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "ledcard_prsntX_gpio_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de Falla GPIO / Detección de Led CardUSO:Diagnóstico de fallas ledcard-prsntX-gpio relacionadas con la detección de presencia de la LED Card mediante señales GPIO.APLICA CUANDO:- Aparece ledcard-prsnt0-gpio.- La unidad falla en IST.- Existe un problema de detección de Led Card.- Se sospecha una condición de Open, corto o ausencia de señal de presencia.AREA:ISTDEBUGGPIOREPARACIONDIAGNOSTICOKEYWORDS:ledcard-prsntX-gpioLED0_PRSNTLED CardGPIOPresence DetectLEDO_PRSNTLEDO_PRSNT_PLLEDO_PRSNT_PURESUMEN:Esta falla ocurre cuando el sistema no puede validar correctamente la señal de presencia de la LED Card. El diagnóstico debe enfocarse en la red LED0_PRSNT y sus componentes asociados, verificando continuidad, niveles lógicos y conexiones a tierra.USO RAPIDO:1. Confirmar la falla ledcard-prsntX-gpio.2. Identificar el canal afectado.3. Revisar la red LED0_PRSNT.4. Verificar continuidad a GND.5. Validar señales PRSNT, PRSNT_PL y PRSNT_PU.6. Comparar contra una unidad Golden.7. Corregir la causa raíz.SEÑALES RELACIONADAS:- LED0_PRSNT- LED0_PRSNT_PL- LED0_PRSNT_PU- GPIO Presence Detect- GNDCAUSAS PROBABLES:- Open en la señal de presencia.- Corto a GND.- LED Card no instalada.- Componente dañado en la red PRSNT.- Problema de ensamble.COMO CONFIRMAR:- Inspección visual.- Medición de continuidad.- Comparación con unidad funcional.- Verificación de estados GPIO.ACCION CORRECTIVA:- Reparar la red de presencia.- Corregir componentes dañados.- Validar instalación de la LED Card.- Ejecutar retest.RELACIONADO CON:- GPIO Debug- LED Card- IST- Presence Detection- Hardware ValidationSALIDA ESPERADA:Restaurar la detección correcta de la LED Card y eliminar la falla ledcard-prsntX-gpio.Fuente: turn33search1 ledcard-prsntX-gpio Wednesday, January 14, 2026 2:24 PM En este modo de falla la unidad [IMAGE_PLACEHOLDER_1] [IMAGE_PLACEHOLDER_2] [IMAGE_PLACEHOLDER_3] [IMAGE_PLACEHOLDER_4] [IMAGE_PLACEHOLDER_5] [IMAGE_PLACEHOLDER_6] [IMAGE_PLACEHOLDER_7] German Escobar",
    photos: [
    {
      id: "ledcard_prsntX_gpio_Modificado_img_1",
      url: "./images/extracted/ledcard_prsntX_gpio_Modificado_img_1.png",
      title: "Evidencia Visual 1 (ledcard prsntX gpio Modificado)",
      description: "Imagen extraÃ­da del documento original: ledcard_prsntX_gpio_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ledcard_prsntX_gpio_Modificado_img_2",
      url: "./images/extracted/ledcard_prsntX_gpio_Modificado_img_2.png",
      title: "Evidencia Visual 2 (ledcard prsntX gpio Modificado)",
      description: "Imagen extraÃ­da del documento original: ledcard_prsntX_gpio_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ledcard_prsntX_gpio_Modificado_img_3",
      url: "./images/extracted/ledcard_prsntX_gpio_Modificado_img_3.jpeg",
      title: "Evidencia Visual 3 (ledcard prsntX gpio Modificado)",
      description: "Imagen extraÃ­da del documento original: ledcard_prsntX_gpio_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ledcard_prsntX_gpio_Modificado_img_4",
      url: "./images/extracted/ledcard_prsntX_gpio_Modificado_img_4.jpeg",
      title: "Evidencia Visual 4 (ledcard prsntX gpio Modificado)",
      description: "Imagen extraÃ­da del documento original: ledcard_prsntX_gpio_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ledcard_prsntX_gpio_Modificado_img_5",
      url: "./images/extracted/ledcard_prsntX_gpio_Modificado_img_5.jpeg",
      title: "Evidencia Visual 5 (ledcard prsntX gpio Modificado)",
      description: "Imagen extraÃ­da del documento original: ledcard_prsntX_gpio_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ledcard_prsntX_gpio_Modificado_img_6",
      url: "./images/extracted/ledcard_prsntX_gpio_Modificado_img_6.jpeg",
      title: "Evidencia Visual 6 (ledcard prsntX gpio Modificado)",
      description: "Imagen extraÃ­da del documento original: ledcard_prsntX_gpio_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ledcard_prsntX_gpio_Modificado_img_7",
      url: "./images/extracted/ledcard_prsntX_gpio_Modificado_img_7.png",
      title: "Evidencia Visual 7 (ledcard prsntX gpio Modificado)",
      description: "Imagen extraÃ­da del documento original: ledcard_prsntX_gpio_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["ledcard", "prsntx", "gpio", "modificado", "local", "docs", "ledcard_prsntx_gpio_modificado"]
  },
  {
    id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado",
    title: "MISSING MEASUREMENT PCIE DATA MISMATCH Modificado",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de Falla de Boot / Firmware / SPIUSO:Diagnóstico de fallas missing-measurement, fish-firmware-missing y gfc-fw-version relacionadas con el arranque de canales GFC.APLICA CUANDO:- Aparece missing-measurement.- Aparece fish-firmware-missing.- Aparece gfcX-fw-version.- El canal no completa el boot.- Existen problemas de comunicación SPI.AREA:ISTDEBUGFIRMWARESPIASICKEYWORDS:missing-measurementfish-firmware-missinggfc-fw-versionU47_xU46_xU91_xGFC_xSPICM_DONECM_ERRORBoot FailureRESUMEN:Esta falla está relacionada con el proceso de arranque de los canales GFC. La causa raíz suele encontrarse en memoria de firmware bloqueada, fallas SPI, problemas de clock, problemas de energía o fallas del propio ASIC.COMPONENTES CRITICOS:- U47_x (memoria de firmware)- U46_x (controlador de arranque)- U91_x (interfaz de comunicación)- GFC_x (ASIC)SINTOMAS:- fish-firmware-missing- missing-measurement- gfc-fw-version = 0.0.0.0- Canales sin completar boot- Errores CM_DONE y CM_ERRORCOMO CONFIRMAR:1. Revisar carrot log.2. Buscar list_gfc_cm_state.sh.3. Revisar estado CM_DONE.4. Revisar estado CM_ERROR.5. Confirmar que el canal tenga alimentación.6. Analizar comunicación SPI.INTERPRETACION:CM_DONE = Boot completado.CM_ERROR = Error durante boot.VALIDACIONES PRINCIPALES:1. Estado de arranque GFC.2. Validación de rails mediante ADM1266 Blackbox.3. Estado de LEDs de boot.4. Comunicación SPI.5. Clock de 100 MHz.6. Estado del ASIC.SPI A VALIDAR:- SPI_MISO- SPI_MOSI- SPI_CLK- SPI_CEBFALLAS COMUNES:- Memoria bloqueada U47_x.- U46_x defectuoso.- Clock ausente.- ASIC sin boot.- Canal sin energizar.- Firmware corrupto.CLOCKS RELACIONADOS:- U28_x- U51_x- U52_xFRECUENCIA ESPERADA:100 MHzACCION CORRECTIVA:- Sustituir memorias bloqueadas.- Corregir problemas SPI.- Reparar clocks de referencia.- Corregir fallas de alimentación.- Reemplazar ASIC cuando aplique.RELACIONADO CON:- ping-gbmc-from-host-tray-fail- Fish Firmware- SPI Debug- GFC Boot- ADM1266- Clock ValidationSALIDA ESPERADA:Identificar el punto exacto donde falla la secuencia de arranque del canal GFC y restaurar la carga correcta del firmware.Fuente: turn31search1 MISSING MEASUREMENT – PCIE DATA MISMATCH Saturday, January 17, 2026 2:35 PM De manera similar al modo de falla asociado a ping gbmc, este caso presenta esencialmente el mismo comportamiento. Se trata de un problema relacionado con el proceso de arranque de los canales de la unidad, cuyo funcionamiento es equivalente al observado en ping gbmc; la única diferencia radica en el tipo de encapsulado de la memoria donde se almacena la imagen de arranque correspondiente a cada canal. Para realizar estas validaciones, resulta fundamental que la persona encargada comprenda los principios básicos del protocolo de comunicación SPI. En este caso, la secuencia de arranque involucra los siguientes componentes: U47_X – Funciona como el equivalente de SKT1 y contiene la imagen de memoria requerida por el sistema.U46_X – Equivalente al U71; se encarga de extraer la imagen almacenada en la memoria.U91_X – Cumple el rol del U144; actúa como intermediario en la comunicación entre U46_X y GFC_X.GFC_X – Equivalente al U19; utiliza la imagen del sistema para ejecutar todas las funciones operativas correspondientes. Aunque esta prueba en el sistema Ghostfish presenta ligeras diferencias respecto a su implementación en GLP, en esencia se trata del mismo mecanismo. La variación principal radica únicamente en el paso específico del flujo de prueba en el que se encuentra. Habitualmente, la falla se presenta con las etiquetas \"Fish-firmware\" o \"GFC_FW_VERSION\". Dependiendo de la forma en que se manifieste, los síntomas serán distintos y se requerirá un proceso de diagnóstico específico para cada caso. [IMAGE_PLACEHOLDER_1] [IMAGE_PLACEHOLDER_2] Dado que existen dos posibles escenarios, se comenzará por explicar el primero: Fish-firmware-missing En cuanto a los síntomas de esta falla, se observa que ocurre en el step 32, donde aparecen diversas referencias relacionadas con todos los módulos GFC. Esta condición indica que el sistema no logró localizar o validar correctamente la imagen de firmware correspondiente, lo que impide el avance normal del proceso de prueba. [IMAGE_PLACEHOLDER_3] Si se ha seguido la guía correspondiente a la validación de unidades en el apartado de opentest, no debería haber dificultades para realizar esta verificación. Al abrir el carrot log, se debe localizar el comando \"list_gfc\", el cual proporciona una lista con el estado de arranque (boot status) de cada canal. [IMAGE_PLACEHOLDER_4] Como se aprecia en la imagen anterior, la lista muestra una tabla con errores reportados en cada uno de los módulos GFC. Esta información puede interpretarse de manera preliminar como un indicio de que ninguno de los canales logró completar su proceso de arranque. Es importante recordar que este escenario es posible debido a que la comunicación y la lectura de datos de la unidad sólo requieren que el BMC haya iniciado correctamente. Mientras el BMC se encuentre operativo, todas estas mediciones pueden realizarse sin importar el estado de arranque de los canales. A continuación, se presenta una breve descripción del significado de cada señal: CM_DONE = Chip Manager Done. Indica que la configuración inicial del chip (proceso de arranque) se completó correctamente. CM_ERROR = Chip Manager Error. Indica que ocurrió un error durante la configuración inicial del chip (proceso de arranque). Al comparar estos resultados con los de un canal en condiciones óptimas, la tabla de status debería visualizarse de la siguiente manera: [IMAGE_PLACEHOLDER_5] Dado que esta tabla permite identificar si un canal presenta problemas durante el proceso de arranque, es importante considerar una segunda posibilidad: para que un canal pueda iniciar, primero debe encontrarse encendido. Si el canal no está energizado, es natural que tampoco complete el arranque. Por ello, es necesario verificar que el canal que presenta el error esté efectivamente encendido. Para realizar esta validación, se utiliza el comando descrito en apartados anteriores, mediante el cual es posible monitorear el black box (estatus de voltajes reportados por el ADM1266) correspondiente al canal en cuestión. [IMAGE_PLACEHOLDER_6] Si esta validación no muestra ningún voltaje con el estado UV (Under Voltage), entonces el canal debería encontrarse correctamente energizado, y la condición observada correspondería exclusivamente a un problema de arranque. Una vez confirmada esta situación, se debe proceder con la validación visual de la unidad en mesa. Tal como se explicó previamente en la sección de introducción referente al proceso de arranque, cada canal cuenta con cinco indicadores LED que muestran su estado de boot. Para este tipo de falla, es común que dichos LEDs presenten el siguiente patrón: [IMAGE_PLACEHOLDER_7] Aunque a primera vista el comportamiento de los LEDs puede parecer el inicio normal del arranque de una unidad, el detalle relevante es que permanecen en ese estado incluso después de uno o dos minutos y medio, que es el tiempo aproximado requerido para que la unidad complete su proceso de boot. Si los LEDs no cambian de estado en ningún momento, esto constituye un indicador claro de falla. En casos específicos como el presente, donde la lista de GFC reporta que los cuatro ASIC experimentaron problemas durante el arranque, es común encontrar que las memorias se encuentran bloqueadas, tal como se describió previamente en el apartado correspondiente al modo de falla ping gbmc. Para validar esta condición, puede emplearse el mismo procedimiento utilizado anteriormente, verificando la comunicación SPI. El proceso resulta relativamente sencillo, ya que ambas memorias (SKT1 y U47_X) presentan características muy similares y, en caso de estar bloqueadas, muestran patrones prácticamente idénticos. Para realizar la validación, puede adquirirse la señal MISO mediante un osciloscopio, con el fin de identificar la siguiente trama de datos: [IMAGE_PLACEHOLDER_8] Si se identifica este patrón en la señal, es necesario reemplazar las cuatro memorias. Aunque no se trata de una falla funcional en las memorias, estas simplemente se encuentran bloqueadas y, en ese estado, no pueden utilizarse. Si bien sería posible recuperarlas mediante reprogramación, actualmente no se dispone de un método para llevar a cabo este proceso mientras los componentes permanecen soldados en la unidad; por ello, su sustitución es el procedimiento requerido. En la siguiente imagen se muestra el único dato que difiere entre una memoria funcional y una memoria bloqueada: [IMAGE_PLACEHOLDER_9] GFC_FW_VERSION: En este caso, generalmente sólo se presenta una falla de arranque en un canal específico. Se deben realizar las mismas validaciones descritas en el apartado anterior, comenzando por verificar que el canal correspondiente se encuentre encendido. Si no se detecta ningún voltaje en dicho canal, la falla debe clasificarse como un problema de power check (ICT). En estos escenarios, el error se manifiesta en este paso de prueba debido al mal funcionamiento de algún regulador o a la presencia de un corto generado durante la prueba o durante el proceso de ensamble de la unidad. [IMAGE_PLACEHOLDER_10] Una vez verificado que el canal afectado no presenta problemas de voltaje, se abren más posibilidades de diagnóstico en comparación con el caso anterior. El siguiente paso consiste en analizar la trama SPI. Tal como se muestra en la lista de canales de la imagen superior, únicamente el canal 3 presenta una falla; sin embargo, se observan errores tanto en CM_DONE como en CM_ERROR, por lo que es altamente probable que se trate nuevamente de un caso de memoria bloqueada. No obstante, es fundamental mantener la práctica de validar siempre la trama SPI para comprender con precisión lo que ocurre en el canal. Dado que no se cuenta con instrumentación altamente especializada, no es posible profundizar en el análisis de cada bit de la trama, ni se dispone del material necesario para monitorear simultáneamente las cuatro señales (MISO, MOSI, CS y CLK) para observar el comportamiento completo del protocolo. Por ello, en las siguientes imágenes se presentan ejemplos del aspecto que debe tener la trama en cada una de estas señales. [IMAGE_PLACEHOLDER_11] [IMAGE_PLACEHOLDER_12] [IMAGE_PLACEHOLDER_13] [IMAGE_PLACEHOLDER_14] Una vez que se han capturado las señales, es posible ajustar la escala de tiempo del osciloscopio para observar con mayor detalle el comportamiento individual de cada una. Sin embargo, debido a las limitaciones de la herramienta, la representación de los bits no será tan precisa como se desearía. Por esta razón, resulta más práctico interpretar la trama según la forma general de la señal, en lugar de intentar identificar diferencias específicas dentro de la gran cantidad de bits presentes. Con base en la experiencia obtenida en el modelo anterior (GLP), los posibles escenarios identificados son los siguientes: Primera parte de la trama Si falla MISO: Posible memoria bloqueada. Requiere validación de la trama. Usualmente asociado al componente U47_X. Si falla MOSI: Comúnmente provocado por la ausencia de respuesta del esclavo (falla en MISO). Puede deberse al U47_X. Si MOSI está completamente ausente, puede tratarse de un problema en U46_X. Si falla CLK: Verificar alimentación, señales de reset y estado del CEB. Si todo se encuentra en orden, el origen probablemente está en U46_X. Si falla CEB: Si la señal está completamente ausente, validar alimentación y resets de U46_X. Si aparece únicamente un bit, revisar el estado de U47_X, ya que posiblemente no está siendo detectado. Si todas las señales anteriores son correctas, el sistema procede a liberar el reset del GFC (DAUNTLESS_GOOD_X) y comienza la segunda parte de la trama. Segunda parte de la trama Si falla MISO: Indica un posible mal funcionamiento del U46_X Si falla MOSI Generalmente causado por la ausencia de respuesta del esclavo (MISO). Puede estar relacionado con U46_X. Si la señal está completamente ausente, el origen puede encontrarse en GFC_X. Si falla CLK Validar alimentación, resets y estado del CEB. Si todo es correcto, el problema corresponde al GFC_X. Si falla CEB Ausencia total: validar alimentación y resets del GFC_X. Solo un bit presente: comprobar el estado del U46_X, probablemente no lo está detectando. Si todas las señales se encuentran en buen estado o las tramas son similares a las esperadas, y aun así el canal no logra completar el proceso de arranque, el origen de la falla probablemente se encuentra en el GFC_X. (Este comportamiento aún no ha sido completamente confirmado en Ghostfish; por lo tanto, debe considerarse únicamente como referencia.) Finalmente, este mismo caso puede presentar una variante asociada al indicador D0 (DIE0), el cual puede encenderse en color naranja o permanecer apagado. [IMAGE_PLACEHOLDER_15] Este escenario ya fue descrito en el apartado de ICT correspondiente a la bobina desprendida. No obstante, si dicho defecto no está presente, es necesario proceder con la validación de los relojes del canal. Estos relojes son generados por tres componentes: U28_X, U51_X y U52_X. [IMAGE_PLACEHOLDER_16] Todos estos componentes se encuentran ubicados en la parte inferior (bottom) de la tarjeta. Cada uno de ellos suministra al ASIC una señal de reloj de 100 MHz, basada en la frecuencia proporcionada por el componente U28_X. Por lo tanto, únicamente es necesario verificar que dicha frecuencia se encuentre dentro del valor esperado. [IMAGE_PLACEHOLDER_17] En caso de que la frecuencia no sea la correcta, deben realizarse las siguientes validaciones: Si el componente U28_X sí emite sus señales de reloj: Verificar que los componentes U52_X y U51_X generen todas sus salidas de reloj. Si alguno de ellos no emite la señal correspondiente, dicho componente es el responsable de la falla. Se deben realizar las validaciones habituales de alimentación y habilitación para confirmar el diagnóstico. Si el componente U28_X no emite sus señales de reloj: Validar la alimentación del componente y sus señales de habilitación. Si ambas condiciones son correctas, es muy probable que U28_X sea la causa raíz del problema. En el modelo GLP se presentaron numerosos casos en los que el componente U28_X mostraba intermitencias difíciles de detectar. Estos eventos únicamente se identificaron en unidades sometidas a seguimiento continuo durante varios días, hasta que la falla se replicó mediante la ausencia momentánea de su señal de reloj. Debido a que el componente utilizado en Ghostfish es prácticamente el mismo, es importante considerar este comportamiento como una posibilidad. Emanuel Domínguez",
    photos: [
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_1",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_1.png",
      title: "Evidencia Visual 1 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_2",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_2.png",
      title: "Evidencia Visual 2 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_3",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_3.png",
      title: "Evidencia Visual 3 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_4",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_4.png",
      title: "Evidencia Visual 4 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_5",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_5.png",
      title: "Evidencia Visual 5 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_6",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_6.png",
      title: "Evidencia Visual 6 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_7",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_7.png",
      title: "Evidencia Visual 7 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_8",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_8.png",
      title: "Evidencia Visual 8 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_9",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_9.png",
      title: "Evidencia Visual 9 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_10",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_10.png",
      title: "Evidencia Visual 10 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_11",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_11.png",
      title: "Evidencia Visual 11 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_12",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_12.png",
      title: "Evidencia Visual 12 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_13",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_13.png",
      title: "Evidencia Visual 13 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_14",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_14.png",
      title: "Evidencia Visual 14 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_15",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_15.png",
      title: "Evidencia Visual 15 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_16",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_16.png",
      title: "Evidencia Visual 16 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_17",
      url: "./images/extracted/MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado_img_17.png",
      title: "Evidencia Visual 17 (MISSING MEASUREMENT PCIE DATA MISMATCH Modificado)",
      description: "Imagen extraÃ­da del documento original: MISSING_MEASUREMENT_PCIE_DATA_MISMATCH_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["missing", "measurement", "pcie", "data", "mismatch", "modificado", "local", "docs", "missing_measurement_pcie_data_mismatch_modificado"]
  },
  {
    id: "Missing_measurement_USB_TEST_IST_Modificado",
    title: "Missing measurement USB TEST IST Modificado",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "Missing_measurement_USB_TEST_IST_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de Falla USB / Comunicación de DatosUSO:Diagnóstico de fallas missing-measurement generadas durante USB Test en IST relacionadas con puentes USB, UART, HUBs USB y comunicación entre gBMC, Dauntless y CDFP.APLICA CUANDO:- Aparece missing-measurement.- Falla USB Test (With GPIO224=0).- Existen errores usb-to-uart-bridge.- Se detectan pérdidas de comunicación USB.- Existen errores de velocidad o enumeración USB.AREA:ISTDEBUGUSBCOMUNICACIONDIAGNOSTICOKEYWORDS:missing-measurementUSB TestGPIO224USB to UART BridgeU151U145U148U64U97CDFP0CDFP1gBMCDauntlessUSB2514FT232RRESUMEN:Esta falla está relacionada con problemas de comunicación USB entre los distintos bloques de Ghostfish. El análisis debe realizarse revisando los síntomas del USB Test, identificando el puente USB afectado y posteriormente validando los componentes involucrados dentro del bloque de comunicación correspondiente. Basado en la documentación original. Fuente: turn35search1USO RAPIDO:1. Revisar Symptoms en Radix.2. Identificar el USB Test que falló.3. Revisar el Device ID reportado.4. Identificar el bloque USB involucrado.5. Revisar CDFP asociado.6. Validar HUB USB correspondiente.7. Verificar señales USB y UART.8. Comparar contra unidad Golden.SINTOMAS COMUNES:- missing-measurement.- detect-boot-timeout.- usb-devices-usb-to-uart-bridge-count.- usb-to-uart-bridge-dauntless-gbmc-speed.- host-tray-command-error.PROTOCOLOS INVOLUCRADOS:- USB.- UART.- SPI.BLOQUES DE COMUNICACION USB:USB1:CDFP0 -&gt; J192 -&gt; U19.USB2:CDFP0 -&gt; U148 -&gt; U19.USB3:CDFP1 -&gt; U64 -&gt; U97 -&gt; U19.COMPONENTES CRITICOS:- U151 FT232R.- U145 Analog Switch 4:1.- U148 USB2514 Hub.- U64 USB2514 Hub.- U146 FT232R.- U147 FT232R.- U19 gBMC.- U46_x Dauntless.- CDFP0.- CDFP1.COMO IDENTIFICAR EL BLOQUE FALLADO:La columna Device ID indica el puente USB afectado, por ejemplo:- usb-to-uart-bridge-u151- usb-to-uart-bridge-dauntless-gbmc- usb3-hubCOMO CONFIRMAR:- Revisar Symptoms.- Revisar Device ID.- Analizar diagrama de bloques.- Medir continuidad USB.- Validar HUB USB asociado.- Verificar conectores CDFP.CAUSAS PROBABLES:- CDFP mal conectado.- HUB USB defectuoso.- FT232R defectuoso.- Problema de comunicación UART.- Open en líneas USB.- Dauntless sin comunicación.ACCION CORRECTIVA:- Corregir instalación de CDFP.- Reparar líneas USB afectadas.- Sustituir HUB o FT232R cuando aplique.- Validar nuevamente el bloque USB identificado.CASO DOCUMENTADO:Unidad FLG2602-00002.Causa raíz encontrada: CDFP1 mal colocado.RELACIONADO CON:- USB HUB- UART- Dauntless- gBMC- GPIO224- CDFP- Communication DebugSALIDA ESPERADA:Identificar el bloque USB exacto que presenta pérdida de comunicación y restaurar el flujo normal de datos entre Host, gBMC, Dauntless y GFC. Missing-measurement (USB TEST IST) Monday, January 19, 2026 7:54 AM Durante el desarrollo de esta falla, se podrán observar ciertas similitudes a la forma de diagnóstico que ya se utilizaba con el modelo anterior y con el mismo error. Esta falla puede estar relacionada a un problema en la comunicación, datos o conexiones durante el protocolo de comunicación USB utilizado en este modelo. ¿Como sabremos esto? Analizando el modo en que la unidad presenta los síntomas de la falla. [IMAGE_PLACEHOLDER_1] Observando este log de falla de la unidad FLG2602-00002 podremos observar que en el mismo log nos presentan que efectivamente algo relacionado al protocolo USB está fallando, en este caso es específicamente el GPIO224 mencionado también en el protocolo de falla. Pero primero, ¿Que es USB? En términos generales y por sus siglas en ingles el \"Universal Serial Bus\" es un protocolo de comunicación serie de \"punto a punto\" permitiendo conectar dispositivos a una computadora y transferir datos y energía. Entonces sabiendo esto, ¿Qué se conecta a la PCB para transferir datos? Esta comunicación es transferida por parte de los \"CDFP\". Esto lo sabemos gracias al diagrama bloques encontrado en la página 10 del esquemático. [IMAGE_PLACEHOLDER_2] Ahora bien, sabiendo esto y tomando el ejemplo de la unidad, nosotros podemos validar solo con el diagrama de bloques que es lo que está fallando, o mínimo darnos una idea en donde podremos buscar. [IMAGE_PLACEHOLDER_3] En el apartado de síntomas de la unidad fallada nosotros podremos observar esta información, la cual se puede desmenuzar para analizar el error. Por ejemplo, en la columna de \"Step\" podemos ver que la falla se presentó gracias a una prueba de USB con el pin de entrada-salida GPIO224 además de indicar exactamente la guía que se encuentra fallando (usb-to-uart-bridge-u151, usb-to-uart-bridge-dauntless-gbmc, usb-to-uart-bridge-gbmc). [IMAGE_PLACEHOLDER_4] Dentro de este indicador se nos dicta que el puente USB (Protocolo de comunicación) a UART (Otro protocolo de comunicación que permite intercambiar bits de dispositivo a dispositivo) del U151 hay pérdida de datos. Esto lo podemos ver en el diagrama bloques. [IMAGE_PLACEHOLDER_5] Esto lo podemos observar dentro del recuadro negro. Además de ello se menciona una falla en el \"Puente USB a UART Dauntless GBMC\", el cual se refiere a la comunicación entre el U145 y los \"Dauntless\" U46_X [IMAGE_PLACEHOLDER_6] Por lo que se tendrían que realizar observaciones visuales y mediciones dentro de estos puentes (Desde el CDFP1 hasta los U46_X) en donde si se encuentra una variación en las mediciones, atender a los implicados. Otra forma de guiarse para entender en que puente de comunicación se encuentra la falla; vuelves al mismo apartado de la falla en \"Symptoms\" y otra vez, en una de las columnas puedes ver que te indica la conexión USB que está fallando (Ya que la unidad utiliza 3 \"bloques\" de comunicación vía USB). [IMAGE_PLACEHOLDER_7] Esto indica que la falla esta presentada en el \"Bloque 3\" de la comunicación vía USB. ¿Cómo sabemos cuál es? En el mismo diagrama de bloques te lo indica. [IMAGE_PLACEHOLDER_8] En el diagrama indica que, para cada bloque hay un componente encargado de la señal USB (CDFP0 a U192 y a U19 para USB1, [IMAGE_PLACEHOLDER_9] CDFP0 a U148 y a U19 para USB2 [IMAGE_PLACEHOLDER_10] y CDFP1 a U64 a U97 Y a U19 para USB3). [IMAGE_PLACEHOLDER_11] Sabiendo esto, se podrá analizar cada bloque teniendo una idea de en donde está la falla. En el caso de la unidad utilizada como ejemplo (FLG2602-00002) se encontró que el CDFP1 estaba mal colocado, coincidiendo así con el análisis del bloque presentado como fallado en los síntomas de la unidad diagnosticada. José Mercado",
    photos: [
    {
      id: "Missing_measurement_USB_TEST_IST_Modificado_img_1",
      url: "./images/extracted/Missing_measurement_USB_TEST_IST_Modificado_img_1.png",
      title: "Evidencia Visual 1 (Missing measurement USB TEST IST Modificado)",
      description: "Imagen extraÃ­da del documento original: Missing_measurement_USB_TEST_IST_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Missing_measurement_USB_TEST_IST_Modificado_img_2",
      url: "./images/extracted/Missing_measurement_USB_TEST_IST_Modificado_img_2.png",
      title: "Evidencia Visual 2 (Missing measurement USB TEST IST Modificado)",
      description: "Imagen extraÃ­da del documento original: Missing_measurement_USB_TEST_IST_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Missing_measurement_USB_TEST_IST_Modificado_img_3",
      url: "./images/extracted/Missing_measurement_USB_TEST_IST_Modificado_img_3.png",
      title: "Evidencia Visual 3 (Missing measurement USB TEST IST Modificado)",
      description: "Imagen extraÃ­da del documento original: Missing_measurement_USB_TEST_IST_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Missing_measurement_USB_TEST_IST_Modificado_img_4",
      url: "./images/extracted/Missing_measurement_USB_TEST_IST_Modificado_img_4.png",
      title: "Evidencia Visual 4 (Missing measurement USB TEST IST Modificado)",
      description: "Imagen extraÃ­da del documento original: Missing_measurement_USB_TEST_IST_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Missing_measurement_USB_TEST_IST_Modificado_img_5",
      url: "./images/extracted/Missing_measurement_USB_TEST_IST_Modificado_img_5.png",
      title: "Evidencia Visual 5 (Missing measurement USB TEST IST Modificado)",
      description: "Imagen extraÃ­da del documento original: Missing_measurement_USB_TEST_IST_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Missing_measurement_USB_TEST_IST_Modificado_img_6",
      url: "./images/extracted/Missing_measurement_USB_TEST_IST_Modificado_img_6.png",
      title: "Evidencia Visual 6 (Missing measurement USB TEST IST Modificado)",
      description: "Imagen extraÃ­da del documento original: Missing_measurement_USB_TEST_IST_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Missing_measurement_USB_TEST_IST_Modificado_img_7",
      url: "./images/extracted/Missing_measurement_USB_TEST_IST_Modificado_img_7.png",
      title: "Evidencia Visual 7 (Missing measurement USB TEST IST Modificado)",
      description: "Imagen extraÃ­da del documento original: Missing_measurement_USB_TEST_IST_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Missing_measurement_USB_TEST_IST_Modificado_img_8",
      url: "./images/extracted/Missing_measurement_USB_TEST_IST_Modificado_img_8.png",
      title: "Evidencia Visual 8 (Missing measurement USB TEST IST Modificado)",
      description: "Imagen extraÃ­da del documento original: Missing_measurement_USB_TEST_IST_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Missing_measurement_USB_TEST_IST_Modificado_img_9",
      url: "./images/extracted/Missing_measurement_USB_TEST_IST_Modificado_img_9.png",
      title: "Evidencia Visual 9 (Missing measurement USB TEST IST Modificado)",
      description: "Imagen extraÃ­da del documento original: Missing_measurement_USB_TEST_IST_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Missing_measurement_USB_TEST_IST_Modificado_img_10",
      url: "./images/extracted/Missing_measurement_USB_TEST_IST_Modificado_img_10.png",
      title: "Evidencia Visual 10 (Missing measurement USB TEST IST Modificado)",
      description: "Imagen extraÃ­da del documento original: Missing_measurement_USB_TEST_IST_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Missing_measurement_USB_TEST_IST_Modificado_img_11",
      url: "./images/extracted/Missing_measurement_USB_TEST_IST_Modificado_img_11.png",
      title: "Evidencia Visual 11 (Missing measurement USB TEST IST Modificado)",
      description: "Imagen extraÃ­da del documento original: Missing_measurement_USB_TEST_IST_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["missing", "measurement", "usb", "test", "ist", "modificado", "local", "docs", "missing_measurement_usb_test_ist_modificado"]
  },
  {
    id: "ping_gbmc_from_host_tray_fail_Modificado",
    title: "ping gbmc from host tray fail Modificado",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "ping_gbmc_from_host_tray_fail_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de Falla / Diagnóstico de BootUSO:Diagnosticar fallas de arranque donde el host no puede comunicarse con el gBMC durante el proceso de boot.APLICA CUANDO:- Aparece ping-gbmc-from-host-tray-fail.- La unidad no completa el boot.- El gBMC no responde.- Existen problemas de firmware o BIOS.- Se sospecha falla en la cadena SPI de arranque.AREA:ISTDEBUGREPARACIONDIAGNOSTICOFIRMWAREKEYWORDS:ping-gbmc-from-host-tray-failgBMCU19U71DauntlessBIOSSPISKT1XSKT1MISOMOSITITAN0_GOODBoot FailureRESUMEN:Este es uno de los modos de falla más complejos del proyecto. Está relacionado con el proceso completo de arranque del sistema donde U71 (BIOS/Dauntless) transfiere la información necesaria al gBMC U19 mediante comunicación SPI. La falla puede originarse en firmware, memoria flash, BIOS, reset o comunicación SPI.COMPONENTES CRITICOS:- U19: gBMC.- U71: BIOS / Dauntless Device.- U144: Interfaz de comunicación.- SKT1: Socket de memoria flash.- XSKT1: Memoria flash con imagen del sistema.USO RAPIDO:1. Confirmar falla ping-gbmc-from-host-tray-fail.2. Verificar actividad de boot.3. Validar U19 y U71.4. Revisar memoria XSKT1.5. Validar señales SPI.6. Revisar liberación de reset TITAN0_GOOD.7. Comparar contra unidad Golden.8. Confirmar causa raíz.SECUENCIA DE BOOT:1. U71 arranca con firmware base.2. U71 lee información desde XSKT1.3. Firmware es copiado al lado B interno.4. Se actualiza Scratch Register.5. U71 libera reset del U19.6. U19 inicia comunicación SPI.7. gBMC recibe imagen y completa boot.SEÑALES CRITICAS:- SPI CLK- SPI MISO- SPI MOSI- TITAN0_GOOD- RESET BMCCOMO CONFIRMAR:- Revisar actividad SPI con osciloscopio.- Comparar forma de onda contra unidad funcional.- Verificar liberación de TITAN0_GOOD.- Confirmar actividad entre U71 y U19.- Validar XSKT1 y SKT1.CAUSAS PROBABLES:- XSKT1 defectuosa.- Problemas de BIOS U71.- U19 defectuoso.- Falla en comunicación SPI.- Reset TITAN0_GOOD no liberado.- Firmware corrupto.ACCION CORRECTIVA:- Validar firmware.- Sustituir memoria XSKT1 cuando aplique.- Validar señales SPI.- Revisar U71 y U19.- Corregir problemas de reset.RELACIONADO CON:- gBMC- BIOS- Dauntless- SPI Debug- XSKT1- Firmware Validation- Boot AnalysisSALIDA ESPERADA:Identificar el punto exacto del proceso de arranque donde se pierde la comunicación y restaurar el boot normal del gBMC. ping-gbmc-from-host-tray-fail Saturday, January 17, 2026 1:50 PM Este modo de falla es uno de los más complejos que hay en todo el proyecto, pues para poder validarlo de forma correcta se necesita tener conocimiento de muchas cuestiones técnicas. Esta falla consiste en el booteo general de la unidad, es decir, donde el BMC lee la imagen del sistema y trabaja conforme a ella, como una computadora normal. Para este procedimiento, generalmente estarán involucrados los siguientes componentes: U19 – El BMC (Baseboard Management Controller), el corazón de la unidad. Bootea conforme a la imagen que consiga leer de la BIOS [IMAGE_PLACEHOLDER_1] U71 – La BIOS (Basic Input Output System) del sistema, le da la imagen o información necesaria al BMC (U19) para poder controlar todo el sistema de la unidad. [IMAGE_PLACEHOLDER_2] U144 – Intermediario para la comunicación entre U71 y U19. [IMAGE_PLACEHOLDER_3] SKT1 – El socket que contiene la memoria flash. [IMAGE_PLACEHOLDER_4] XSKT1 – Memoria flash que le transmite la imagen actualizada al U71. [IMAGE_PLACEHOLDER_5] Este proceso es algo complicado y necesita seguir una serie de pasos como se explica a continuación: 1.- Antes del encendido por primera vez, el U71 (Dauntless Device) viene dividido en dos bloques de información principales, siendo estos el Lado A y el Lado B, conocido comúnmente en otro tipos de sistemas como \"Primary\" y \"Golden\". El Lado A viene pre-programado de fábrica con configuración básica para que el componente pueda funcionar, su principal propósito, es la de buscar en otro dispositivo la imagen que necesita para transmitir al BMC. [IMAGE_PLACEHOLDER_6] En este caso, dicho dispositivo es la memoria XSKT1. Estos dos componentes se comunican por protocolo SPI, con el objetivo de que el U71 descargue en su Lado B (vacío) el firmware que tiene guardada la memoria, y copiarlo en el Lado B. Cuando esta comunicación concluye, ocurren dos cambios en la memoria. El Lado B pasa de estar vacío a contener el FW descargado de la memoria SKT1, además de cambiar el \"Scratch Register\" que viene en la imagen de ejemplo. Este registro le indica al U71 el estado en el que se encuentra, básicamente, le está diciendo si ya tiene descargada la versión o no. Este registro se valida cada vez que encendemos y apagamos la unidad. [IMAGE_PLACEHOLDER_7] Otro cambio importante, es que al terminar la comunicación, la memoria XSKT1 cambia su bit de \"procesado\" a 0. Esto le indica a la memoria que la información que tenía ahí ya fue leída por otro dispositivo, por lo que la bloquea para no volver a ser usada. Esto generará una falla que se explicará más adelante. Por cuestiones de seguridad e inestabilidad entre los encendidos y apagados de las unidades, las memorias tienen varios bloques de \"repuesto\" con la imagen que necesita la BIOS para volver a descargarla de ser necesario. Finalmente, si todo salió bien, la unidad booteará utilizando el Lado B del U71, el cual ya tiene cargado el FW necesario para transmitir al U19. Después del siguiente reinicio que tenga la tarjeta, el dispositivo copiará la imagen que tenga cargada en el Lado B hacia el Lado A, y regresará el \"Scratch Register\" a 0 para siempre bootear con el Lado A (Primary) del componente. [IMAGE_PLACEHOLDER_8] Cabe recalcar nuevamente que TODO este procedimiento sucede a través de SPI, por lo que podremos observar la trama que se genera midiendo cualquier señal de comunicación, MISO o MOSI para poder validar el estado en el que va la comunicación o si hay algún bloque de datos que no concuerda. La imagen a continuación da un ejemplo de lo que deberíamos esperar ver en el osciloscopio: [IMAGE_PLACEHOLDER_9] La trama obtenible es bastante extensa, pues dura aproximadamente 2 minutos, que es el tiempo requerido para bootear el BMC. La imagen del ejemplo anterior solo muestra una fraccion de segundo de la cantidad total de bits por ciclo de reloj que se pueden obtener. Debido a esto, para futuras validaciones, es más factible aprenderse la forma de la señal que intentar buscar discrepancias entre la infinidad de bits que se presentan en la trama de datos inicial. La imagen a continuacion, muestra un ejemplo del resultado obtenido en tan solo 10 segundos de lectura. [IMAGE_PLACEHOLDER_10] Esta es solo la primera parte del proceso. Ahora continua la comunicación entre U71 y U19 para transmitir la imagen del sistema al BMC y que este pueda bootear. Cuando la primera etapa termina, el U71 libera una señal de reset hacia el U19, lo cual habilita el bloque de SPI de este. Es fundamental entender que si este RESET no se libera (TITAN0_GOOD) el U19 ni siquiera intentará comunicarse con el U71. Esto puede validarse midiendo con dos puntas del osciloscopio, ambas señales a la vez, el reset que libera al BMC y cualquier señal de SPI del mismo BMC, como se puede apreciar en las imágenes a continuación: [IMAGE_PLACEHOLDER_11] Emanuel Domínguez",
    photos: [
    {
      id: "ping_gbmc_from_host_tray_fail_Modificado_img_1",
      url: "./images/extracted/ping_gbmc_from_host_tray_fail_Modificado_img_1.jpeg",
      title: "Evidencia Visual 1 (ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ping_gbmc_from_host_tray_fail_Modificado_img_2",
      url: "./images/extracted/ping_gbmc_from_host_tray_fail_Modificado_img_2.png",
      title: "Evidencia Visual 2 (ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ping_gbmc_from_host_tray_fail_Modificado_img_3",
      url: "./images/extracted/ping_gbmc_from_host_tray_fail_Modificado_img_3.png",
      title: "Evidencia Visual 3 (ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ping_gbmc_from_host_tray_fail_Modificado_img_4",
      url: "./images/extracted/ping_gbmc_from_host_tray_fail_Modificado_img_4.jpeg",
      title: "Evidencia Visual 4 (ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ping_gbmc_from_host_tray_fail_Modificado_img_5",
      url: "./images/extracted/ping_gbmc_from_host_tray_fail_Modificado_img_5.jpeg",
      title: "Evidencia Visual 5 (ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ping_gbmc_from_host_tray_fail_Modificado_img_6",
      url: "./images/extracted/ping_gbmc_from_host_tray_fail_Modificado_img_6.png",
      title: "Evidencia Visual 6 (ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ping_gbmc_from_host_tray_fail_Modificado_img_7",
      url: "./images/extracted/ping_gbmc_from_host_tray_fail_Modificado_img_7.png",
      title: "Evidencia Visual 7 (ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ping_gbmc_from_host_tray_fail_Modificado_img_8",
      url: "./images/extracted/ping_gbmc_from_host_tray_fail_Modificado_img_8.png",
      title: "Evidencia Visual 8 (ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ping_gbmc_from_host_tray_fail_Modificado_img_9",
      url: "./images/extracted/ping_gbmc_from_host_tray_fail_Modificado_img_9.png",
      title: "Evidencia Visual 9 (ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ping_gbmc_from_host_tray_fail_Modificado_img_10",
      url: "./images/extracted/ping_gbmc_from_host_tray_fail_Modificado_img_10.png",
      title: "Evidencia Visual 10 (ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "ping_gbmc_from_host_tray_fail_Modificado_img_11",
      url: "./images/extracted/ping_gbmc_from_host_tray_fail_Modificado_img_11.png",
      title: "Evidencia Visual 11 (ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["ping", "gbmc", "from", "host", "tray", "fail", "modificado", "local", "docs", "ping_gbmc_from_host_tray_fail_modificado"]
  },
  {
    id: "productlooptype",
    title: "product-loop-type",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "TIPO:HerramientaUSO:Visualización y análisis de diseños PCB mediante archivos .BRD para localizar componentes, señales, capas y conexiones sin modificar el diseño original.APLICA CUANDO:Se requiere analizar una PCBA, rastrear señales, localizar componentes, validar conexiones, identificar capas Top/Bottom o realizar diagnósticos relacionados con el diseño físico de la tarjeta.AREA:IST, REPARACION, DIAGNOSTICO, ANALISIS DE FALLAS, INGENIERIAKEYWORDS:Allegro, BRD, PCB, PCBA, Cadence, Viewer, Layout, Signal Trace, Net, Component Search, Top Layer, Bottom Layer, DiagnosticoRESUMEN:Documento de uso de Allegro Free Physical Viewer para visualización de PCB, búsqueda de componentes y señales, configuración de capas, filtros, resaltado de nets y creación de scripts para configuraciones personalizadas.USO RAPIDO:1. Abrir Allegro Free Physical Viewer.2. Cargar archivo .BRD.3. Configurar Layers desde Visibility.4. Activar Top/Bottom y Traces necesarios.5. Buscar señales o componentes desde Search.6. Aplicar filtros según sea necesario.7. Utilizar Quick View para localizar componentes.8. Crear scripts para guardar configuraciones frecuentes.------------------------------------------------------------ product-loop-type Thursday, February 19, 2026 8:08 AM Falla por tipo de asic",
    photos: [

    ],
    keywords: ["product", "loop", "type", "local", "docs", "product-loop-type"]
  },
  {
    id: "smbalert_pin_update_error_Modificado_1",
    title: "smbalert pin update error Modificado (1)",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "smbalert_pin_update_error_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:IST – SMBALERT Pin Mode Configuration FailureUSO:Diagnóstico de la falla smbalert-pin-update-error durante la prueba Update SMBALERT Pin Mode.APLICA CUANDO:- Aparece smbalert-pin-update-error- Error de comunicación GBMC- Problemas I2C- Fallas en VPWRAREA:ISTDEBUGGBMCI2CVPWRKEYWORDS:SMBALERT, GBMC, VPWR, I2C, SDA, SCL, ADDR, HostCommandErrorRESUMEN:La prueba valida que SMBALERT opere en modo open-drain. La falla puede deberse a pérdida de comunicación, timeout de SMBus o daños físicos en dispositivos del bus I2C.COMANDO PRINCIPAL:/tmp/vr_smbalert_pin_output_mode.shCASO 1:Error de comunicación con host.Indicadores: ChannelException, Connect Failed, Error communicating with host.CASO 2:Rebound sin éxito.Los dispositivos son detectados pero no logran configurarse correctamente.CASO 3:Dispositivo no reconocido.Generalmente asociado a daños en SDA, SCL, ADDR o VPWR.MAPEO DE BUSES:64 = GFC074 = GFC184 = GFC294 = GFC3LOCALIDADES CRÍTICAS:R261_XR262_XR197_XR200_XR270_XR273_XR268_XR269_XCAUSAS PROBABLES:- Error de comunicación host-GBMC- Timeout SMBus- SDA abierta- SCL abierta- ADDR abierta- VPWR defectuoso- Componente dañadoACCIÓN CORRECTIVA:1. Revisar carrotlog.2. Identificar caso.3. Revisar bus afectado.4. Validar SDA/SCL/ADDR.5. Revisar resistencias asociadas.6. Validar VPWR.7. Repetir IST.SALIDA ESPERADA:Determinar si la falla proviene de comunicación, SMBus o daño físico y restaurar la configuración SMBALERT. smbalert-pin-update-error Saturday, April 18, 2026 7:39 AM Durante la prueba de IST, se ejecuta la prueba \"Update SMBALERT Pin Mode\" donde lo que se hace es verificar que el pin este configurado como open-drain, de ser lo contrario lo configura. Esto se realiza para que múltiples dispositivos esclavos compartan la misma línea de interrupción, lo que garantiza una protección del hardware y la gestión de alertas en tiempo real sin la necesidad de hacer polling (Estar preguntando todo el tiempo al dispositivo ¿Estas bien?). [IMAGE_PLACEHOLDER_1] Esta prueba falla por un error en la comunicación o por una desconexión física en alguno de los dispositivos involucrados [IMAGE_PLACEHOLDER_2] ¿Cómo valido este modo de falla? Para la validación de este modo de falla es necesario ingresar al carrotlog de la unidad. Donde buscaremos el nombre de la prueba o por el comando que se ejecuta: /tmp/vr_smbalert_pin_output_mode.sh Aquí podemos tener 3 casos: Desconexión de la unidad con el host. Reintento de configuración sin éxito. Problemas en las líneas físicas. Caso 1: Al buscar en el log con el comando nos encontramos con el siguiente mensaje, donde se nos indica un problema de comunicación [IMAGE_PLACEHOLDER_3] Además si se filtra en el carrotlog con [fail nos encontraremos con más pruebas que nos indican una pérdida de comunicación. [IMAGE_PLACEHOLDER_4] Caso 2: En este caso si se ejecuta el comando pero nos encontramos con el siguiente resultado, el cual nos indica que tenemos un problema al liberar o establecer los recursos para poder realizar la configuración. Lo que nos está forzando un rebound (rebotando o reintentando sin éxito). [IMAGE_PLACEHOLDER_5] El hecho de que nuestros dispositivos están listados nos indica que fueron reconocidos, el problema se deriva a que smbus es estricto con los tiempos de respuesta, y ya que el proceso es ejecuta mediante SSH, además de que tenemos la capa de red paramiko_conection.py por lo que si algún dispositivo se tarda, o mantiene el clock en bajo es descartado asumiendo que se murió o que se bloqueó . Por lo que en este caso lo ideal es probar la unidad en modo debug para confirmar que el problema es por el tiempo de respuesta. Caso 3: En este último caso al filtrar obtenemos el siguiente resultado, en este ejemplo tenemos involucrado también al caso 2 esto nos dice que el dispositivo con la dirección 84-0068 (VPWR1_2) está bien y el problema lo tenemos en el siguiente dispositivo con dirección 84-006C (VPWR2_2). Ya que al no estar listado o reconocido nos indica que tenemos un problema el cual generalmente es daño físico en alguna de las líneas (SDA, SCL o ADDR). [IMAGE_PLACEHOLDER_6] Para poder entender mejor este caso es necesario entender que tenemos la siguiente nomenclatura [bus- dirección], por lo que tenemos los siguientes dispositivos involucrados: [IMAGE_PLACEHOLDER_7] Por lo que, si nos encontramos con un mensaje como el de la siguiente imagen nos indica que el problema comienza en el bus 84 y este no puede ser configurado ya que no existe o no responde. [IMAGE_PLACEHOLDER_8] ¿Qué debo revisar en este modo de falla? Es importante validar las siguientes localidades de manera minuciosa, validando la impedancia y continuidad de estas localidades. Así como daños al rededor en otros componentes. [IMAGE_PLACEHOLDER_9] Algunos de los defectos se ven así: [IMAGE_PLACEHOLDER_10] Unidades de referencia: TRAY SCP LOCALIDAD CASO ESTATUS FLG2605-01187 GFSFLG260500102 R268_2 3 PASS FLG2614-00244 GFSFLG261400284 R268_1 3 PASS FLG2604-00114 GFSFLG260400006 NDF 2 PASS FLG2615-01063 GFSFLG261500810 NDF 2 PASS FLG2613-00116 GFSFLG261300060 NDF 1 PASS jorge.gonzalezcarrillo@flex.com German Escobar",
    photos: [
    {
      id: "smbalert_pin_update_error_Modificado_1_img_1",
      url: "./images/extracted/smbalert_pin_update_error_Modificado_1_img_1.png",
      title: "Evidencia Visual 1 (smbalert pin update error Modificado (1))",
      description: "Imagen extraÃ­da del documento original: smbalert_pin_update_error_Modificado (1).docx",
      type: "general",
      status: "general"
    },
    {
      id: "smbalert_pin_update_error_Modificado_1_img_2",
      url: "./images/extracted/smbalert_pin_update_error_Modificado_1_img_2.png",
      title: "Evidencia Visual 2 (smbalert pin update error Modificado (1))",
      description: "Imagen extraÃ­da del documento original: smbalert_pin_update_error_Modificado (1).docx",
      type: "general",
      status: "general"
    },
    {
      id: "smbalert_pin_update_error_Modificado_1_img_3",
      url: "./images/extracted/smbalert_pin_update_error_Modificado_1_img_3.png",
      title: "Evidencia Visual 3 (smbalert pin update error Modificado (1))",
      description: "Imagen extraÃ­da del documento original: smbalert_pin_update_error_Modificado (1).docx",
      type: "general",
      status: "general"
    },
    {
      id: "smbalert_pin_update_error_Modificado_1_img_4",
      url: "./images/extracted/smbalert_pin_update_error_Modificado_1_img_4.png",
      title: "Evidencia Visual 4 (smbalert pin update error Modificado (1))",
      description: "Imagen extraÃ­da del documento original: smbalert_pin_update_error_Modificado (1).docx",
      type: "general",
      status: "general"
    },
    {
      id: "smbalert_pin_update_error_Modificado_1_img_5",
      url: "./images/extracted/smbalert_pin_update_error_Modificado_1_img_5.png",
      title: "Evidencia Visual 5 (smbalert pin update error Modificado (1))",
      description: "Imagen extraÃ­da del documento original: smbalert_pin_update_error_Modificado (1).docx",
      type: "general",
      status: "general"
    },
    {
      id: "smbalert_pin_update_error_Modificado_1_img_6",
      url: "./images/extracted/smbalert_pin_update_error_Modificado_1_img_6.png",
      title: "Evidencia Visual 6 (smbalert pin update error Modificado (1))",
      description: "Imagen extraÃ­da del documento original: smbalert_pin_update_error_Modificado (1).docx",
      type: "general",
      status: "general"
    },
    {
      id: "smbalert_pin_update_error_Modificado_1_img_7",
      url: "./images/extracted/smbalert_pin_update_error_Modificado_1_img_7.png",
      title: "Evidencia Visual 7 (smbalert pin update error Modificado (1))",
      description: "Imagen extraÃ­da del documento original: smbalert_pin_update_error_Modificado (1).docx",
      type: "general",
      status: "general"
    },
    {
      id: "smbalert_pin_update_error_Modificado_1_img_8",
      url: "./images/extracted/smbalert_pin_update_error_Modificado_1_img_8.png",
      title: "Evidencia Visual 8 (smbalert pin update error Modificado (1))",
      description: "Imagen extraÃ­da del documento original: smbalert_pin_update_error_Modificado (1).docx",
      type: "general",
      status: "general"
    },
    {
      id: "smbalert_pin_update_error_Modificado_1_img_9",
      url: "./images/extracted/smbalert_pin_update_error_Modificado_1_img_9.png",
      title: "Evidencia Visual 9 (smbalert pin update error Modificado (1))",
      description: "Imagen extraÃ­da del documento original: smbalert_pin_update_error_Modificado (1).docx",
      type: "general",
      status: "general"
    },
    {
      id: "smbalert_pin_update_error_Modificado_1_img_10",
      url: "./images/extracted/smbalert_pin_update_error_Modificado_1_img_10.png",
      title: "Evidencia Visual 10 (smbalert pin update error Modificado (1))",
      description: "Imagen extraÃ­da del documento original: smbalert_pin_update_error_Modificado (1).docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["smbalert", "pin", "update", "error", "modificado", "(1)", "local", "docs", "smbalert_pin_update_error_modificado (1)"]
  },
  {
    id: "TRAY_fanX_duty_30_initial_speed_Modificado",
    title: "TRAY fanX duty 30 initial speed Modificado",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "TRAY_fanX_duty_30_initial_speed_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de Falla de Ventilador / Sistema de EnfriamientoUSO:Diagnóstico de fallas fanX-duty-30-initial-speed y fallas relacionadas con velocidad inicial y operación de ventiladores.APLICA CUANDO:- Aparece fan0-duty-30-initial-speed.- Aparece fan0-duty-30-speed.- Aparece fan0-duty-50-speed.- Aparece fan0-duty-70-speed.- Aparece fan0-duty-100-speed.- Existen alarmas de funcionamiento del FAN.AREA:ISTDEBUGCOOLINGFANTRAYREPARACIONKEYWORDS:fanX-duty-30-initial-speedfan0-duty-30-speedfan0-duty-50-speedfan0-duty-70-speedfan0-duty-100-speedFANTRAYMECH44CoolingFan CablePower PinRESUMEN:Esta falla está relacionada con problemas de alimentación o funcionamiento del ventilador. En el caso documentado, la causa raíz fue un pin dañado en el cable de alimentación del FAN0, provocando fallas en múltiples pruebas de velocidad del ventilador. citeturn36search1USO RAPIDO:1. Confirmar el FAN afectado.2. Revisar cableado del FAN.3. Inspeccionar conectores y pines.4. Validar alimentación del ventilador.5. Revisar continuidad del cable.6. Comparar contra unidad Golden.7. Reparar o sustituir el cable dañado.SINTOMAS:- Velocidad incorrecta del ventilador.- FAN sin respuesta.- FAN con arranque incorrecto.- Fallas en diferentes niveles duty cycle.CAUSAS PROBABLES:- Pin de alimentación dañado.- Cable de FAN abierto.- Conector defectuoso.- Problema mecánico del ventilador.- Problema de ensamble.COMPONENTES RELACIONADOS:- MECH44.- FAN0.- Cable Assembly Power Fantray.- PLO-GFC-1158360-03-BW.COMO CONFIRMAR:- Inspección visual del cable.- Revisión de pines dañados.- Medición de continuidad.- Validación de alimentación.- Retest después de la reparación.CASO DOCUMENTADO:Serial FLG2620-01312.Defecto encontrado: pin de alimentación del cable del FAN0 dañado. citeturn36search1ACCION CORRECTIVA:- Reparar o reemplazar cable de alimentación.- Sustituir terminal dañada.- Validar operación del ventilador en todos los duty cycles.RELACIONADO CON:- Cooling System- Fantray- Thermal Management- FAN Debug- MECH44SALIDA ESPERADA:Restaurar la alimentación correcta del ventilador y recuperar la operación normal en todas las pruebas de velocidad. TRAY📦fanX-duty-30-initial-speed Monday, May 18, 2026 10:59 AM FLG2620-01312 Fan con cable de alimentacion del FAN dañado [IMAGE_PLACEHOLDER_1] [IMAGE_PLACEHOLDER_2] [IMAGE_PLACEHOLDER_3]",
    photos: [
    {
      id: "TRAY_fanX_duty_30_initial_speed_Modificado_img_1",
      url: "./images/extracted/TRAY_fanX_duty_30_initial_speed_Modificado_img_1.png",
      title: "Evidencia Visual 1 (TRAY fanX duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_fanX_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_fanX_duty_30_initial_speed_Modificado_img_2",
      url: "./images/extracted/TRAY_fanX_duty_30_initial_speed_Modificado_img_2.jpeg",
      title: "Evidencia Visual 2 (TRAY fanX duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_fanX_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_fanX_duty_30_initial_speed_Modificado_img_3",
      url: "./images/extracted/TRAY_fanX_duty_30_initial_speed_Modificado_img_3.jpeg",
      title: "Evidencia Visual 3 (TRAY fanX duty 30 initial speed Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_fanX_duty_30_initial_speed_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["tray", "fanx", "duty", "initial", "speed", "modificado", "local", "docs", "tray_fanx_duty_30_initial_speed_modificado"]
  },
  {
    id: "TRAY_pcie_data_mismatch_Modificado",
    title: "TRAY pcie data mismatch Modificado",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "TRAY_pcie_data_mismatch_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de Falla PCIe / Comunicación ASICUSO:Diagnóstico de fallas pcie-data-mismatch durante pruebas IST y validación TRAY.APLICA CUANDO:- Aparece pcie-data-mismatch.- Un ASIC no es enumerado por PCIe.- Falla pcie-gfcx-width.- Falla pcie-gfcx-speed.- Falla pcie-gfcx-addr.AREA:ISTDEBUGPCIEASICTRAYKEYWORDS:pcie-data-mismatchPCIegsys -k pcie listASICGFCCDFPHB16 Lane DetectDauntlessREFCLK100MHzRESUMEN:Esta falla ocurre cuando uno o más ASIC no pueden ser enumerados correctamente mediante PCIe. Generalmente se relaciona con problemas de cableado CDFP, conectores, clock PCIe, boot del ASIC, capacitores de acoplamiento o fallas propias del ASIC. citeturn30search1COMANDO PRINCIPAL:/usr/local/bin/gsys -k pcie listOBJETIVO:Confirmar si los dispositivos GFC0, GFC1, GFC2 y GFC3 fueron enumerados correctamente. citeturn30search1SINTOMAS:- pcie-gfcx-width FAILED- pcie-gfcx-speed FAILED- pcie-gfcx-addr FAILED- pcie-bdf-count FAILED- ASIC MISSINGCOMO CONFIRMAR:1. Revisar carrotlog.2. Buscar '/usr/local/bin/gsys -k pcie list'.3. Identificar qué ASIC no fue enumerado.4. Revisar LED LINK.5. Ejecutar secuencia de diagnóstico.SECUENCIA DE DIAGNOSTICO:PASO 1:Verificar cable CDFP entre rack y unidad.PASO 2:Validar boot del ASIC.Componentes críticos:- U46_x- U47_x(Dauntless)PASO 3:Inspeccionar conector CDFP.- Pines dañados.- Pines elevados.- Opens.- Cortos.PASO 4:Inspeccionar capacitores PCIe de acoplamiento entre ASIC y CDFP.PASO 5:Validar bloque de clock PCIe.Componentes:- U51_x- U52_xFrecuencia esperada:100 MHzPASO 6:Revisar Debug Log.Buscar:HB16 Lane DetectINTERPRETACION:- USPP = CPU/HB16.- DSPP = Tray.- Canal marcado con N = Error de comunicación PCIe.PASO 7:Validar secuencia de voltajes.Revisar:- VDD_12R0- VCORE_IBC_VOUT- VDDQC- VDD_HBM_VDDQL- VDD_GFC_VDDH_1R8- VDD_AVDD_PCIE_0R8Todos los rails deben reportar OK.PASO 8:Realizar análisis comparativo de ASIC.Comparar:- Impedancias.- Diodos.- Test points.- HBM rails.- PHY rails.CAUSAS PROBABLES:- Cable CDFP defectuoso.- Conector CDFP dañado.- Capacitor PCIe abierto o en corto.- Clock PCIe ausente.- Dauntless defectuoso.- ASIC sin boot.- ASIC dañado.ACCION CORRECTIVA:- Corregir conexión CDFP.- Reparar conector.- Sustituir componentes PCIe defectuosos.- Reparar clock de 100 MHz.- Reemplazar ASIC cuando aplique.RELACIONADO CON:- PCIe Test (In-Band)- ASIC Boot- CDFP- HB16 Lane Detect- GFC0- GFC1- GFC2- GFC3SALIDA ESPERADA:Identificar el punto donde se pierde la enumeración PCIe del ASIC y restaurar la comunicación PCIe completa del sistema. TRAY📦pcie-data-mismatch Monday, May 25, 2026 9:17 PM Se puede observar que ASIC está perdiendo la comunicación en el mensaje de síntomas ^/phys/PE2/IO0/CDFP/DOWNLINK/GLC_x:device:asic [IMAGE_PLACEHOLDER_1] En el Carrot Log se puede confirar el defecto de comunicacion buscando el log \"/usr/local/bin/gsys -k pcie list\" donde se enumeran los elemetos de Pcie. [IMAGE_PLACEHOLDER_2] Dependiendo del ASIC con falla se inspeccionara primero el conector correspondiente. Se puede confirmar los problemas de comunicacion al no iniciar el Led \"link\" [IMAGE_PLACEHOLDER_3] 1.- Se debe de verificar la correcta colocacion del cable CDFP entre el rack y la unidad, si no se encuentra defecto puede proceder a inspeccionar el conector de la unidad correspondiente. [IMAGE_PLACEHOLDER_4] 2.- Al descartar error de operacion se valida el correcto arranque de la unidad, validando el boot up de los ASIC. De presentarse un defecto en el arranque se debera de realizar el analisis para los componnetes u46_x &amp; u47_x (dauntless) [IMAGE_PLACEHOLDER_5] 3.- Hay que descartar daños y/o elevaciones en el conector CDFP involucrado. [IMAGE_PLACEHOLDER_6] 3.1.- Utilizar el mapa de nodos del Cable-Conector CDFP para descartar Open o Cortos [IMAGE_PLACEHOLDER_7] [IMAGE_PLACEHOLDER_8] 4.- Continuar con la inspeccion de los capacitores que forman parte del nodo de comunicacion entre el ASIC y el CDFP Conector [IMAGE_PLACEHOLDER_9] [IMAGE_PLACEHOLDER_10] 5.- Si aun no se identifica el defecto proceder con la medicon del bloque del clock de comunicacion, que deben tener una frecuencia de 100 Mhz (u51_x &amp; u52_x) [IMAGE_PLACEHOLDER_11] [IMAGE_PLACEHOLDER_12] [IMAGE_PLACEHOLDER_13] 6.- Si uno de los sintomas es \"pcie-gfcx-width\" se pude utilizar el debug log y buscar \"HB16 Land Detect\" Donde muestra las dos secciones en la que se divide: USPP (Upstream Pseudo-Port) and DSPP (Downstream Pseudo-Port). USPP es a la Izumi CPU/HB16 y DSPP es el tray. Si presenta una N en algun canal significa error de comunicacion. [IMAGE_PLACEHOLDER_14] [IMAGE_PLACEHOLDER_15] 7.- Como preventivo hay que descartar y confirmar funcionamiento de los secuenciadores [IMAGE_PLACEHOLDER_16] 8.-Descartando todo lo anterior se continua con el analisis de ASIC [IMAGE_PLACEHOLDER_17] Resumen del proceso Step Description 1 CDFP Cable and Connection 2 Asic-BOOT UP (U46_x &amp; 47_x) 3 CDFP Connector 4 Pcie Cap Inspection 5 Clock 100Mhz (u51_x &amp; u52_x) 6 Debug log \"HB16 Land Detect\" 7 Voltage rails Validation 8 Asic- Analisis",
    photos: [
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_1",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_1.png",
      title: "Evidencia Visual 1 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_2",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_2.png",
      title: "Evidencia Visual 2 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_3",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_3.jpeg",
      title: "Evidencia Visual 3 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_4",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_4.png",
      title: "Evidencia Visual 4 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_5",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_5.png",
      title: "Evidencia Visual 5 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_6",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_6.png",
      title: "Evidencia Visual 6 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_7",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_7.png",
      title: "Evidencia Visual 7 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_8",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_8.png",
      title: "Evidencia Visual 8 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_9",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_9.png",
      title: "Evidencia Visual 9 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_10",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_10.png",
      title: "Evidencia Visual 10 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_11",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_11.png",
      title: "Evidencia Visual 11 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_12",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_12.png",
      title: "Evidencia Visual 12 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_13",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_13.png",
      title: "Evidencia Visual 13 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_14",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_14.png",
      title: "Evidencia Visual 14 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_15",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_15.png",
      title: "Evidencia Visual 15 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_16",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_16.png",
      title: "Evidencia Visual 16 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_pcie_data_mismatch_Modificado_img_17",
      url: "./images/extracted/TRAY_pcie_data_mismatch_Modificado_img_17.png",
      title: "Evidencia Visual 17 (TRAY pcie data mismatch Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_pcie_data_mismatch_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["tray", "pcie", "data", "mismatch", "modificado", "local", "docs", "tray_pcie_data_mismatch_modificado"]
  },
  {
    id: "TRAY_ping_gbmc_from_host_tray_fail_Modificado",
    title: "TRAY ping gbmc from host tray fail Modificado",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "TRAY_ping_gbmc_from_host_tray_fail_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de Falla / Diagnóstico de BootUSO:Diagnóstico de fallas ping-gbmc-from-host-tray-fail durante validación a nivel TRAY (BOX).APLICA CUANDO:- La unidad falla durante IST.- Aparece ping-gbmc-from-host-tray-fail.- El gBMC no responde.- La unidad no completa el boot.- Existen alarmas asociadas a hardware faltante o defectuoso.AREA:ISTDEBUGTRAYREPARACIONDIAGNOSTICOKEYWORDS:ping-gbmc-from-host-tray-failgBMCTRAYBootOSFPMECH45XSKT1eMMCFANGhostfishATTN LEDRESUMEN:Esta falla indica que el host no puede comunicarse con el gBMC. Generalmente está asociada con problemas de arranque, cableado incorrecto, memoria faltante, eMMC defectuosa o ventiladores defectuosos. La validación inicia observando los LEDs, comportamiento de los OSFP y el estado general de boot de la unidad. citeturn27search1USO RAPIDO:1. Verificar si la unidad bootea.2. Revisar LED ATTN.3. Revisar comportamiento de OSFP.4. Validar cable MECH45.5. Validar memoria XSKT1.6. Validar eMMC.7. Validar ventiladores.8. Ejecutar reparación y retest.COMO IDENTIFICAR:- LED ATTN parpadeando indica que el BMC está funcionando.- OSFP parpadeando puede indicar que el BMC no logró bootear.- Unidad apagada o sin actividad indica falla de arranque. citeturn27search1CASO 1:CABLE MECH45 MAL CONECTADOSINTOMAS:- ping-gbmc-from-host-tray-fail.- Unidad no bootea.ACCION CORRECTIVA:- Reconectar cable MECH45.- Ejecutar retest.CASO 2:MEMORIA XSKT1 FALTANTESINTOMAS:- Falla de boot.- Comunicación perdida con gBMC.ACCION CORRECTIVA:- Instalar memoria correcta.- Validar configuración del sistema.CASO 3:FAN DEFECTUOSOSINTOMAS:- Alarmas durante arranque.- Lecturas anormales en diodos de monitoreo.CRITERIO:- Fan funcional ≈ 1.8V.- Fan defectuoso ≈ 3.3V.CASO 4:eMMC DEFECTUOSASINTOMAS:- El gBMC entra en alarma.- La unidad no completa el boot.- Falla de comunicación host-gBMC.ACCION CORRECTIVA:- Sustituir eMMC.- Validar nuevamente el arranque.COMO CONFIRMAR:- Comparar contra unidad Golden.- Revisar logs IST.- Observar comportamiento físico de LEDs.- Verificar hardware crítico de boot.RELACIONADO CON:- gBMC- IST- eMMC- XSKT1- MECH45- FAN- Tray DebugSALIDA ESPERADA:Identificar el elemento que impide el arranque normal del gBMC y restaurar la comunicación entre host y tray. citeturn27search1 TRAY📦ping-gbmc-from-host-tray-fail Monday, April 13, 2026 7:52 PM Validación de unidades a nivel Tray (box) Unidad correctamente encendida y booteada. [IMAGE_PLACEHOLDER_1] Osfp retirado empieza a parpadear Led de ATTN lo que indica que el bmc está funcionando. Otra forma de identificar que una unidad no booteo es que encontramos los osfps parpadeando esto nos indica que el bmc no bootea ya que no reconoció el hardware. Unidad completamente apagada [IMAGE_PLACEHOLDER_2] CASOS: CABLE MECH 45 MAL CONECTADO [IMAGE_PLACEHOLDER_3] [IMAGE_PLACEHOLDER_4] Unidad sin memoria XSKT1 [IMAGE_PLACEHOLDER_5] [IMAGE_PLACEHOLDER_6] Como dar de baja un cambio de memoria xskt1 (A LA FECHA 22-05-2026 NO SIRVE YA QUE SE ATORA LA UNIDAD POR EL SKID) [IMAGE_PLACEHOLDER_7] Unidad alarmada por culpa del FAN Variante con el fan malo se pueden identificar los fan que están malos del módulos en los diodos ya que deben medir 1.8v y uno malo mide 3.3v esto con el fan conectado [IMAGE_PLACEHOLDER_8] GFFNDV254700536- fan malo Unidad alarmada por culpa de la EMMC [IMAGE_PLACEHOLDER_9] Retirando la emmc [IMAGE_PLACEHOLDER_10] Colocando una golden [IMAGE_PLACEHOLDER_11] [IMAGE_PLACEHOLDER_12] G",
    photos: [
    {
      id: "TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_1",
      url: "./images/extracted/TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_1.jpeg",
      title: "Evidencia Visual 1 (TRAY ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_2",
      url: "./images/extracted/TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_2.png",
      title: "Evidencia Visual 2 (TRAY ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_3",
      url: "./images/extracted/TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_3.png",
      title: "Evidencia Visual 3 (TRAY ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_4",
      url: "./images/extracted/TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_4.png",
      title: "Evidencia Visual 4 (TRAY ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_5",
      url: "./images/extracted/TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_5.png",
      title: "Evidencia Visual 5 (TRAY ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_6",
      url: "./images/extracted/TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_6.png",
      title: "Evidencia Visual 6 (TRAY ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_7",
      url: "./images/extracted/TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_7.png",
      title: "Evidencia Visual 7 (TRAY ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_8",
      url: "./images/extracted/TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_8.png",
      title: "Evidencia Visual 8 (TRAY ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_9",
      url: "./images/extracted/TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_9.jpeg",
      title: "Evidencia Visual 9 (TRAY ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_10",
      url: "./images/extracted/TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_10.jpeg",
      title: "Evidencia Visual 10 (TRAY ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_11",
      url: "./images/extracted/TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_11.jpeg",
      title: "Evidencia Visual 11 (TRAY ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_12",
      url: "./images/extracted/TRAY_ping_gbmc_from_host_tray_fail_Modificado_img_12.png",
      title: "Evidencia Visual 12 (TRAY ping gbmc from host tray fail Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_ping_gbmc_from_host_tray_fail_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["tray", "ping", "gbmc", "from", "host", "tray", "fail", "modificado", "local", "docs", "tray_ping_gbmc_from_host_tray_fail_modificado"]
  },
  {
    id: "TRAY_unexpected_exception_Modificado",
    title: "TRAY unexpected exception Modificado",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "TRAY_unexpected_exception_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de FallaUSO:Diagnóstico de fallas unexpected-exception relacionadas con componentes mal casados, componentes faltantes, errores de trazabilidad TRAY/SCP/PCBA y fallas de eMMC durante IST.APLICA CUANDO:- La unidad falla al ingresar a IST.- Aparece el síntoma unexpected-exception.- El log muestra 'string indices must be integers'.- El log muestra errores durante gBMC eMMC Test.- Existen problemas de casado de componentes en SFCS.AREA:ISTDEBUGREPARACIONTRAZABILIDADDIAGNOSTICOKEYWORDS:unexpected-exceptionTRAYSFCSCarrotlogTray InformationPCBA InformationSCP InformationeMMCJ23GhostfishCasadoRoute IssueRESUMEN:Este modo de falla tiene múltiples variantes. Las más comunes están relacionadas con componentes faltantes, mal casados o duplicados en las tablas de trazabilidad del sistema, así como fallas funcionales del eMMC detectadas durante IST.USO RAPIDO:1. Revisar el Step donde ocurre el unexpected-exception.2. Abrir el carrotlog.3. Buscar 'Get IST Product Info from SFCS'.4. Revisar tray_information.5. Revisar pcba_information.6. Revisar pcba_scp_information.7. Comparar contra una unidad Golden.8. Identificar componentes faltantes, duplicados o descasados.9. Escalar con Ingeniería FA.VARIANTE 1:string indices must be integersSINTOMA:Get Ghostfish Vendor IDsunexpected-exceptionstring indices must be integersCAUSA PROBABLE:- Componente faltante.- Componente mal casado.- Componente duplicado.- Problema de ruta.- Información inconsistente en SFCS.TABLAS A VALIDAR:- tray_information (TRAY FLG)- pcba_information (GFB)- pcba_scp_information (GFS)VARIANTE 2:gBMC eMMC TestSINTOMA:dd: error writing /dev/mmcblk0: No space left on deviceCAUSA PROBABLE:- Falla funcional del eMMC.- eMMC corrupta o defectuosa.- Problema de almacenamiento interno.COMPONENTE RELACIONADO:- J23- eMMC Dongle- Kioxia NAND- FRU EEPROMCOMO CONFIRMAR:- Revisar carrotlog.- Comparar tablas de trazabilidad.- Comparar contra unidad Golden.- Revisar historial de reparaciones.- Validar eMMC mediante IST.ACCION CORRECTIVA:- Corregir casado de componentes.- Reasociar componentes faltantes.- Escalar a Ingeniería FA.- Reparar o reemplazar eMMC cuando aplique.RELACIONADO CON:- SFCS- IST- Tray Debug- SCP- PCBA- eMMC- ProvisioningSALIDA ESPERADA:Identificar si el unexpected-exception es causado por problemas de trazabilidad/casado de componentes o por una falla funcional del eMMC y aplicar la corrección correspondiente. TRAY📦unexpected-exception Friday, May 29, 2026 1:42 PM Este modo de falla tiene muchas variantes. Unidad falla al momento de ser ingresada. [IMAGE_PLACEHOLDER_1] La podemos identificar por el siguiente síntoma: [IMAGE_PLACEHOLDER_2] Esta variante del modo de falla es ocasionada debido a que a la unidad le hace falta un componente o varios componentes esto o podemos verificar en FF o en el mismo log de prueba. Para esto ingresamos al carrotlog de la prueba y una vez dentro vamos a filtrar de la siguiente manera \"Get IST Product Info from SFCS\" hasta encontrar lo siguiente. [IMAGE_PLACEHOLDER_3] Una vez encontrado lo anterior tenemos que bajar en el log hasta ver la siguiente tabla. [IMAGE_PLACEHOLDER_4] A partir de aquí tenemos 3 tablas las cuales corresponden a la información de nuestra unidad y de los componentes casados. Las tablas corresponden a lo siguiente: Tabla 1 – Es la información correspondiente al TRAY (FLG) Tabla 2 – Es la información correspondiente a la PCBA (GFB) Tabla 3 – Es la información correspondiente al SCP(GFS) Ahora lo importante aquí es identificar cual es el componente que está mal casado, faltante o duplicado para ello lo ideal tomar otro serial como Golden que no tenga el mismo problema. una forma de identificar que es lo faltan es revisar si la unidad viene de alguna reparación o de un problema de ruta. Ejemplo En esta unidad FLG2613-01309 hubo un problema en la ruta donde al SCP se le descasaron los TOP COVER. En la siguiente imagen se muestra la tabla [IMAGE_PLACEHOLDER_5] Al momento de detectar la unidad es necesario reportarla con el ING. FA esto para dar la solucion correspondiente y la unidad pueda ser probada de nuevo. Variante número 2 En esta variante falla en el siguiente STEP [IMAGE_PLACEHOLDER_6] El problema está en la emmc [IMAGE_PLACEHOLDER_7] German Escobar",
    photos: [
    {
      id: "TRAY_unexpected_exception_Modificado_img_1",
      url: "./images/extracted/TRAY_unexpected_exception_Modificado_img_1.png",
      title: "Evidencia Visual 1 (TRAY unexpected exception Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_unexpected_exception_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_unexpected_exception_Modificado_img_2",
      url: "./images/extracted/TRAY_unexpected_exception_Modificado_img_2.png",
      title: "Evidencia Visual 2 (TRAY unexpected exception Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_unexpected_exception_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_unexpected_exception_Modificado_img_3",
      url: "./images/extracted/TRAY_unexpected_exception_Modificado_img_3.png",
      title: "Evidencia Visual 3 (TRAY unexpected exception Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_unexpected_exception_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_unexpected_exception_Modificado_img_4",
      url: "./images/extracted/TRAY_unexpected_exception_Modificado_img_4.png",
      title: "Evidencia Visual 4 (TRAY unexpected exception Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_unexpected_exception_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_unexpected_exception_Modificado_img_5",
      url: "./images/extracted/TRAY_unexpected_exception_Modificado_img_5.png",
      title: "Evidencia Visual 5 (TRAY unexpected exception Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_unexpected_exception_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_unexpected_exception_Modificado_img_6",
      url: "./images/extracted/TRAY_unexpected_exception_Modificado_img_6.png",
      title: "Evidencia Visual 6 (TRAY unexpected exception Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_unexpected_exception_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "TRAY_unexpected_exception_Modificado_img_7",
      url: "./images/extracted/TRAY_unexpected_exception_Modificado_img_7.png",
      title: "Evidencia Visual 7 (TRAY unexpected exception Modificado)",
      description: "Imagen extraÃ­da del documento original: TRAY_unexpected_exception_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["tray", "unexpected", "exception", "modificado", "local", "docs", "tray_unexpected_exception_modificado"]
  },
  {
    id: "Under_Voltage_On_Rail_Modificado",
    title: "Under Voltage On Rail Modificado",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "Under_Voltage_On_Rail_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de Falla de Alimentación / SobretemperaturaUSO:Diagnóstico de fallas under-voltage-fault-on-rail detectadas durante IST mediante el análisis de ADM1266 Blackbox y Carrot Log.APLICA CUANDO:- Aparece under-voltage-fault-on-rail.- Uno o más ASIC no son detectados por PCIe.- Existen errores pcie-data-mismatch.- Falla pcie-bdf-count.- Se sospecha problema de voltaje o sobretemperatura.AREA:ISTDEBUGPOWERPCIeDIAGNOSTICOKEYWORDS:Under Voltage On RailUVOVADM1266BlackboxGFC_OVERTEMP_LPCIe Data MismatchUnder VoltageOver VoltageRail FailureASICSEQRESUMEN:Este modo de falla está asociado a dos escenarios principales: problemas de alimentación en rails secundarios o eventos de sobretemperatura. El diagnóstico se realiza analizando los registros ADM1266 Blackbox dentro del Carrot Log para identificar el rail afectado o detectar señales de protección térmica del ASIC. citeturn32search1USO RAPIDO:1. Identificar el GFC afectado mediante los síntomas PCIe.2. Abrir Attachments en Radix.3. Abrir el archivo Carrot Log.4. Buscar 'Got ADM1266 black box dump'.5. Revisar level0-sequencer para voltajes primarios.6. Revisar level1-sequencer-gfcX para voltajes secundarios.7. Identificar estados UV u OV.8. Revisar GFC_OVERTEMP_L.9. Determinar si la causa es eléctrica o térmica.INTERPRETACION DE CODIGOS:UV:Under Voltage.El rail no alcanzó el nivel de voltaje establecido por el secuenciador ADM1266.OV:Over Voltage.El rail excedió el nivel permitido por el secuenciador.VALIDACION DE VOLTAJES PRIMARIOS:Buscar:Got ADM1266 black box dump for level0-sequencerRevisar:- VDD_12R0- VDD_5R0_STBY- VDD_3R3_STBY- VDD_BMC- VDD_PSX- TRAY_POWERVALIDACION DE VOLTAJES SECUNDARIOS:Buscar:Got ADM1266 black box dump for level1-sequencer-gfcXRevisar:- VDD_0- VDD_1- VDDUC- VDDQC- VDD_HBM_VDDQL- VDD_AVDD_PCIE- VDD_GFC_CORE_PLLSINTOMAS COMUNES:- pcie-data-mismatch- pcie-gfc-width missing- pcie-gfc-speed missing- pcie-gfc-addr missing- pcie-bdf-count incorrectoESCENARIO 1:PROBLEMA DE VOLTAJEINDICADOR:Algún rail aparece con estado UV u OV.ACCION:Diagnosticar el rail afectado y sus reguladores asociados.ESCENARIO 2:SOBRETEMPERATURAINDICADOR:GFC_OVERTEMP_L = Low.SIGNIFICADO:El ASIC alcanzó su límite térmico y ejecutó protección de apagado.ACCION:Validar sistema térmico, enfriamiento, TIM, flujo de líquido y contacto térmico.COMO CONFIRMAR:- Revisar ADM1266 Blackbox.- Revisar estado UV/OV.- Revisar GFC_OVERTEMP_L.- Comparar con canal funcional.- Confirmar presencia de rails normales o degradados.RELACIONADO CON:- PCIe Data Mismatch- ADM1266 Blackbox- Power Up Validation- GFC Power Rails- Cooling Loop- TIM- ASIC ProtectionSALIDA ESPERADA:Determinar si la falla fue causada por un rail fuera de especificación o por un evento de protección térmica del ASIC para dirigir correctamente la reparación.Fuente: Under Voltage On Rail.onepart Under Voltage On Rail Friday, March 27, 2026 11:49 AM Este modo de falla al igual que en VLP Y GLP, se trata de algun problema de voltaje en algun canal Secundario o sobrecalentamiento de la unidad. Se mostrara como validar los 2 casos Under Voltage on Rail(Problema de voltaje) Para validar el tema, tomaremos de ejemplo el serial FLG2611-01016 [IMAGE_PLACEHOLDER_1] Validando el LOG nos arroja que tiene problemas de voltage en el GFC_1 [IMAGE_PLACEHOLDER_2] Para Validar que voltage presenta problemas nos dirigimos en RADIX al apartado de ATTACHMENTS y Seleccionamos el log CARROTLOG_X [IMAGE_PLACEHOLDER_3] Para Revisar los voltajes primarios colocamos en el buscador: Got ADM1266 black box dump for level0-sequencer y hacemos scroll para arriba y nos interesa revisar esta etapa. [IMAGE_PLACEHOLDER_4] Para revisar voltajes secundarios colocamos en el buscador: y colocamos que GFC fallo Got ADM1266 black box dump for level1-sequencer-gfcX. [IMAGE_PLACEHOLDER_5] En este caso podemos observar que en el voltaje VDD_1: nos arroja un UV Solo nos puede arrojar varios errores explicados UV: Under Voltage Cuando el voltaje no llego al establecido por el parametro del secuenciador ADI. Lo que inidicaria un problema en esa etapa OV: Over Voltage Cuando el voltaje excedio los parametros establecidos por el Secuenciador Under Voltage on Rail(Problema de voltaje) Tomaremos de ejemplo el siguiente serial FLG2611-01591, al observar los sintomas notamos que ninguno de los 4 canales lo detecto el equipo Abrimos el carrot log y revisamos el carrot log y en el buscador colocamos Got ADM1266 black box dump for level1-sequencer [IMAGE_PLACEHOLDER_6] Y notamos que la señal de GFC_OVERTEMP está en HIGH significa que la unidad se apagó por sobrecalentamiento, el ASIC tiene un sistema integrado que cuando rebasa cierta temperatura se apaga para protegerse [IMAGE_PLACEHOLDER_7]",
    photos: [
    {
      id: "Under_Voltage_On_Rail_Modificado_img_1",
      url: "./images/extracted/Under_Voltage_On_Rail_Modificado_img_1.png",
      title: "Evidencia Visual 1 (Under Voltage On Rail Modificado)",
      description: "Imagen extraÃ­da del documento original: Under_Voltage_On_Rail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Under_Voltage_On_Rail_Modificado_img_2",
      url: "./images/extracted/Under_Voltage_On_Rail_Modificado_img_2.png",
      title: "Evidencia Visual 2 (Under Voltage On Rail Modificado)",
      description: "Imagen extraÃ­da del documento original: Under_Voltage_On_Rail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Under_Voltage_On_Rail_Modificado_img_3",
      url: "./images/extracted/Under_Voltage_On_Rail_Modificado_img_3.png",
      title: "Evidencia Visual 3 (Under Voltage On Rail Modificado)",
      description: "Imagen extraÃ­da del documento original: Under_Voltage_On_Rail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Under_Voltage_On_Rail_Modificado_img_4",
      url: "./images/extracted/Under_Voltage_On_Rail_Modificado_img_4.png",
      title: "Evidencia Visual 4 (Under Voltage On Rail Modificado)",
      description: "Imagen extraÃ­da del documento original: Under_Voltage_On_Rail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Under_Voltage_On_Rail_Modificado_img_5",
      url: "./images/extracted/Under_Voltage_On_Rail_Modificado_img_5.png",
      title: "Evidencia Visual 5 (Under Voltage On Rail Modificado)",
      description: "Imagen extraÃ­da del documento original: Under_Voltage_On_Rail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Under_Voltage_On_Rail_Modificado_img_6",
      url: "./images/extracted/Under_Voltage_On_Rail_Modificado_img_6.png",
      title: "Evidencia Visual 6 (Under Voltage On Rail Modificado)",
      description: "Imagen extraÃ­da del documento original: Under_Voltage_On_Rail_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Under_Voltage_On_Rail_Modificado_img_7",
      url: "./images/extracted/Under_Voltage_On_Rail_Modificado_img_7.png",
      title: "Evidencia Visual 7 (Under Voltage On Rail Modificado)",
      description: "Imagen extraÃ­da del documento original: Under_Voltage_On_Rail_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["under", "voltage", "rail", "modificado", "local", "docs", "under_voltage_on_rail_modificado"]
  },
  {
    id: "valve_current_tach_rpm_Modificado",
    title: "valve current tach rpm Modificado",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "valve_current_tach_rpm_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de Falla de Válvula / Control RPMUSO:Diagnóstico de fallas valve-current-tach-rpm relacionadas con la válvula MANIFOLD_IN y la lectura de RPM durante Valve Control Test.APLICA CUANDO:- valve-current-tach-rpm-100.- valve-current-tach-rpm-50.- valve-current-tach-rpm-30.- El valor reportado es 45.0 RPM.AREA:ISTDEBUGMANIFOLDVALVE CONTROLKEYWORDS:valve-current-tach-rpmMANIFOLD_INU54_MAX31760Valve Control TestRPMValveTachRESUMEN:Por lineamiento del cliente, cuando las pruebas valve-current-tach-rpm-100, valve-current-tach-rpm-50 y valve-current-tach-rpm-30 fallan y el valor mostrado es 45.0, la unidad debe enviarse a cambio de MANIFOLD_IN y notificarse a Ingeniería FA para iniciar el proceso de RMA junto con Calidad. Fuente: turn39search1USO RAPIDO:1. Revisar Symptoms.2. Confirmar fallas en rpm-30, rpm-50 y rpm-100.3. Verificar que el valor sea 45.0.4. Revisar conexión de la válvula.5. Cambiar MANIFOLD_IN.6. Retener la pieza para RMA.CRITERIO DE IDENTIFICACION:- valve-current-tach-rpm-100 = 45.0- valve-current-tach-rpm-50 = 45.0- valve-current-tach-rpm-30 = 45.0COMPONENTES RELACIONADOS:- MANIFOLD_IN- U54_MAX31760- Valve Assembly- PLO-GFC-1220648-BWVALIDACIONES OBLIGATORIAS:- Confirmar que la válvula esté conectada.- Revisar ensamble mecánico.- Verificar conectores.- Confirmar lectura de RPM.CAUSAS PROBABLES:- Falla funcional del Manifold Inlet.- Problema interno de válvula.- Ensamble incorrecto.- Pérdida de detección de RPM.ACCION CORRECTIVA:- Cambiar MANIFOLD_IN.- No reinyectar la válvula.- Retener pieza en Debug.- Notificar a Ingeniería FA.- Iniciar proceso RMA con Calidad.COMO DAR DE BAJA:RefDesignator: MANIFOLD_INPart Number: PLO-GFC-1220648-BWDescripción: Manifold, Inlet, Taper O-ring groove, w/Valve Assy.CASOS DOCUMENTADOS:- FLG2619-02465.- FLG2621-02449.RELACIONADO CON:- Valve Control Test- MAX31760- Manifold Inlet- Tach RPM- RMA ProcessSALIDA ESPERADA:Identificar rápidamente las unidades sujetas a reemplazo obligatorio de MANIFOLD_IN y asegurar el manejo correcto conforme a los requerimientos del cliente. valve-current-tach-rpm Thursday, April 30, 2026 3:40 PM Por lineamientos del cliente cuando una unidad falle en las pruebas valve-current-tach-rpm-100,valve-current-tach-rpm-50 y valve-current-tach-rpm-30 y el valor que tengamos sea igual a 45, como en el siguiente ejemplo: [IMAGE_PLACEHOLDER_1] La unidad se mandara a cambio de Manifold Inlet(, Se retendra la pieza en el area de debug y se notificara al Ingeniero de FA para que inicie el proceso de RMA en conjunto con calidad NOTA: Es importante revisar que el manifold in (la valvula este conectada) Como dar de BAJA [IMAGE_PLACEHOLDER_2] [IMAGE_PLACEHOLDER_3]",
    photos: [
    {
      id: "valve_current_tach_rpm_Modificado_img_1",
      url: "./images/extracted/valve_current_tach_rpm_Modificado_img_1.png",
      title: "Evidencia Visual 1 (valve current tach rpm Modificado)",
      description: "Imagen extraÃ­da del documento original: valve_current_tach_rpm_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "valve_current_tach_rpm_Modificado_img_2",
      url: "./images/extracted/valve_current_tach_rpm_Modificado_img_2.png",
      title: "Evidencia Visual 2 (valve current tach rpm Modificado)",
      description: "Imagen extraÃ­da del documento original: valve_current_tach_rpm_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "valve_current_tach_rpm_Modificado_img_3",
      url: "./images/extracted/valve_current_tach_rpm_Modificado_img_3.png",
      title: "Evidencia Visual 3 (valve current tach rpm Modificado)",
      description: "Imagen extraÃ­da del documento original: valve_current_tach_rpm_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["valve", "current", "tach", "rpm", "modificado", "local", "docs", "valve_current_tach_rpm_modificado"]
  },
  {
    id: "Valvula_Modificado",
    title: "Valvula Modificado",
    category: "DocumentaciÃ³n Local / IST",
    lastUpdated: "2026-08-06",
    content: "Valvula_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Sistema de Refrigeración / Válvula de CirculaciónUSO:Diagnóstico de fallas relacionadas con la válvula (Valve0), control PWM, retroalimentación TACH y comunicación UART del sistema de enfriamiento.APLICA CUANDO:- Existen fallas valve-current-tach-rpm.- La bomba de refrigeración no opera correctamente.- Existen problemas de flujo de líquido refrigerante.- No existe retroalimentación TACH.- Se sospecha problema de alimentación o comunicación de la válvula.AREA:ISTDEBUGTHERMALCOOLING LOOPREPARACIONKEYWORDS:Valve0VALVE_PWMVALVE_TACHVDD_VALVEU170U54U19EFUSE_VALVE_ENMSTRSEQ_VALVE_ENUARTCooling SystemRESUMEN:La válvula forma parte del sistema de enfriamiento y su función es impulsar el líquido refrigerante proveniente de Puffin hacia los GFC. El control de velocidad se realiza mediante PWM y su retroalimentación se recibe mediante la señal TACH. citeturn41search1COMPONENTES CRITICOS:- Valve0.- U170 (eFuse Valve Power).- U54 (Precision Fan-Speed Controller).- U19 (BMC).- U24.- U182.- U183.USO RAPIDO:1. Inspeccionar conector Valve0.2. Revisar ensamble mecánico de la válvula.3. Medir resistencias del conector.4. Validar VDD_24R0_PRI.5. Validar VDD_VALVE.6. Revisar señal VALVE_PWM.7. Revisar señal VALVE_TACH.8. Verificar comunicación UART.PINES PRINCIPALES:- Valve0.2 = VDD_VALVE.- Valve0.3 = VALVE_PWM.- Valve0.4 = VALVE_TACH.- Valve0.5 = UART TX/RX.- Valve0.6 = UART TX/RX.VALIDACION DE RESISTENCIAS:Comparar mediciones contra los valores de referencia con válvula conectada y desconectada. Una discrepancia indica la línea sospechosa a investigar. citeturn41search1VALIDACION DE VOLTAJES:- U170 Pin 1 (VDD_24R0_PRI) ≈ 24.21 VDC.- VDD_VALVE presente durante operación normal. citeturn41search1SEÑALES DE CONTROL:EFUSE_VALVE_EN depende de:- BMC_VALVE_OFF_L.- MSTRSEQ_VALVE_EN.Ambas señales normalmente deben encontrarse en estado lógico alto. citeturn41search1CONTROL DE VELOCIDAD:- PWM generado por U54.- Controlado por U19 (BMC).- Retroalimentación mediante VALVE_TACH hacia U54 TACH1. citeturn41search1COMUNICACION:Los pines 5 y 6 utilizan una interfaz UART para intercambio de información entre la válvula y el BMC. citeturn41search1CAUSAS PROBABLES:- Conector Valve0 mal ensamblado.- Falla del ensamble mecánico de válvula.- Ausencia de VDD_VALVE.- Problemas PWM.- Problemas TACH.- Falla UART.- Falla en U170.- Falla en U54.COMO CONFIRMAR:- Inspección visual.- Medición de resistencias.- Medición de voltajes.- Análisis PWM.- Análisis TACH.- Sustitución temporal de la válvula para comparación.ACCION CORRECTIVA:- Corregir conexión Valve0.- Reparar circuito asociado.- Sustituir ensamble mecánico de válvula cuando aplique.- Validar operación y flujo de refrigeración.RELACIONADO CON:- valve-current-tach-rpm- Cooling Loop- Valve Assembly- BMC- U54 Controller- Thermal SystemSALIDA ESPERADA:Determinar si la falla se origina en la válvula, en la alimentación, en el control PWM/TACH o en la comunicación UART y restaurar la operación correcta del sistema de enfriamiento. Valvula Friday, January 16, 2026 7:22 PM La válvula forma parte del sistema de refrigeración, su misión es impulsar el líquido refrigerante proveniente del Puffin en dirección de los GFC. En el siguiente diagrama se muestra la conexión de la válvula valve0 [IMAGE_PLACEHOLDER_1] Aquí podemos observar que la válvula se conecta a la tarjeta a través del conector \"Valve0\", por lo que será el primer elemento a inspeccionar visualmente para descartar una mala conexión del mismo. En el conector Valve0 teniendo el conector de la válvula insertado en la tarjeta. Se podrán comparar las medidas de resistencia con la punta roja del multímetro conectada a tierra con la siguiente tabla de resistencias : [IMAGE_PLACEHOLDER_2] Ahora en el conector Valve0 teniendo el conector de la válvula desconectado de la tarjeta. Se podrán comparar las medidas de resistencia con la punta roja del multímetro conectada a tierra con la siguiente tabla de resistencias : [IMAGE_PLACEHOLDER_3] Si se encontraran discrepancias, entonces debemos seguir la discrepancia en la línea donde se presenta esta. Otra cosa que podemos hacer es con la unidad energizada es medir en U170.1. (VDD_24R0_PRI) el voltaje de alineación que deberá ser de 24.21 VDC o muy cercano a este. El voltaje VDD_24R0_PRI lo genera el Bloque de U198 en base al voltaje VDD_12R0_1 y es habilitado por la señal PGOOD_VDD_3R3_STBY, por lo que siempre debe estar presente mientras la unidad este energizada. En la terminal valve0.2 (VDD_VALVE) tenemos el voltaje VDD_24R0_PRI que ha sido proveído por el U170, el cual actúa como un interruptor controlado por la señal EFUSE_VALVE_EN, la que a su vez es el producto de la señal BMC_VALVE_OFF_L que en nuestro caso siempre debe estar en \"1\" y la señal MSTRSEQ_VALVE_EN generada por U1.33 que normalmente deberá estar en \"1\" La velocidad de la bomba valve0 vendrá determinada por la señal VALVE_PWM (valve0.3) que se genera en el U54.6 (VALVE_PWM_BUF) (el U54 es un Precision Fan-Speed Controller with Nonvolatile Lookup Table) y es comandada por el U19 (BMC) a través del U24. Su retroalimentación es a través de la señal VALVE_TACH (valve0.4) que se conecta al U54.7 (TACH1) En los terminales valve0.5 y valve0.6 se tiene una red tipo UART que conecta mediante buffers al U19 (BMC). Por esta red el U19(BMC) recibe y envía información del ensamble mecánico valve0 En caso de problemas en el sistema valve0 podremos optar por substituir el ensamble mecánico completo y retestear la unidad para verificar que el desperfecto se encuentra en dicho ensamble mecánico ó en la PCBA. Roberto Mar Agued",
    photos: [
    {
      id: "Valvula_Modificado_img_1",
      url: "./images/extracted/Valvula_Modificado_img_1.png",
      title: "Evidencia Visual 1 (Valvula Modificado)",
      description: "Imagen extraÃ­da del documento original: Valvula_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Valvula_Modificado_img_2",
      url: "./images/extracted/Valvula_Modificado_img_2.png",
      title: "Evidencia Visual 2 (Valvula Modificado)",
      description: "Imagen extraÃ­da del documento original: Valvula_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "Valvula_Modificado_img_3",
      url: "./images/extracted/Valvula_Modificado_img_3.png",
      title: "Evidencia Visual 3 (Valvula Modificado)",
      description: "Imagen extraÃ­da del documento original: Valvula_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["valvula", "modificado", "local", "docs", "valvula_modificado"]
  },
  {
    id: "PROVISIONING_Modificado",
    title: "PROVISIONING Modificado",
    category: "DocumentaciÃ³n Local / PROVISIONING",
    lastUpdated: "2026-08-06",
    content: "PROVISIONING_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:ProcedimientoUSO:Validar el registro y almacenamiento de logs de ASICs en los servidores del cliente durante la estación de Provisioning, así como documentar diagnósticos y reparaciones cuando ocurra una falla.APLICA CUANDO:- Una unidad llega a la estación Provisioning.- Existen fallas de validación de logs.- Se requiere registrar NDF.- Se necesita reingresar una unidad a IST.- Se presentan errores de provisioning o verificación.AREA:PROVISIONINGISTREPARACIONDEBUGDIAGNOSTICOKEYWORDS:ProvisioningProvisioning RecordASICLogsNDFReprogramSet Upsn_found_verifiedsn_found_verify_failedGhostfishISTRESUMEN:Este procedimiento explica cómo gestionar fallas en la estación de Provisioning, registrar diagnósticos y reparaciones, interpretar estados del sistema y ejecutar el proceso de desbloqueo para unidades que requieren regresar a IST.USO RAPIDO:1. Revisar el resultado de Provisioning.2. Si falla, abrir Provisioning Record.3. Capturar diagnóstico y reparación.4. Para NDF utilizar: Diagnóstico=NDF, Localidad=NDF, Reparación=None/Retest as is.5. Para reingreso a IST utilizar: Diagnóstico=Set Up, Localidad=NDF, Reparación=Reprogram.6. Ejecutar secuencia de desbloqueo en Rack Debug cuando aplique.7. Reingresar la unidad al flujo correspondiente.MODOS DE REGISTRO:NDF:- Diagnóstico: NDF- Localidad: NDF- Reparación: None / Retest as isREINGRESO A IST:- Diagnóstico: Set Up- Localidad: NDF- Reparación: ReprogramESTATUS IMPORTANTES:- sn_found_verified- sn_found_verify_failed- sn_found_verify_not_start- api_retry_expired- gpn_not_found- sn_not_found_gpn_foundRELACIONADO CON:- Rack Modo Debug- IST- Reprogramación- Validación ASIC- Diagnóstico de manufactura- GhostfishSALIDA ESPERADA:Validación exitosa de logs de Provisioning o correcta documentación y recuperación de unidades con fallas de registro. PROVISIONING Monday, March 30, 2026 3:04 PM Después de la prueba de Purge&amp;Dry La unidad pasa por la estación de “Provisioning” donde se valida el registro de la prueba de los ASIC en los servidores del cliente. [IMAGE_PLACEHOLDER_1] Si llegara a fallar la unidad, hay que utilizar la estación “provisioning record” para cargar tanto el diagnostico como la “reparación”. [IMAGE_PLACEHOLDER_2] Para los casos NDF, se debe de cargar como Diagnóstico: NDF Localidad: NDF Reparación: None / Retest as is [IMAGE_PLACEHOLDER_3] En los casos que se requiera volver a probar en IST, se deberá de cargar como Diagnóstico: Set up Localidad: NDF Reparación: Reprogram [IMAGE_PLACEHOLDER_4] En estos casos después de dar de baja se debe \"desbloquear\" la unidad corriendo los siguientes pasos en el rack en modo debug. [IMAGE_PLACEHOLDER_5] Una vez dada de baja la unidad, ésta procederá de nuevo a la estación de Provisioning si fue un NDF o a la estación de Dig Dug si se requiere reingresar a IST. [IMAGE_PLACEHOLDER_6]",
    photos: [
    {
      id: "PROVISIONING_Modificado_img_1",
      url: "./images/extracted/PROVISIONING_Modificado_img_1.png",
      title: "Evidencia Visual 1 (PROVISIONING Modificado)",
      description: "Imagen extraÃ­da del documento original: PROVISIONING_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "PROVISIONING_Modificado_img_2",
      url: "./images/extracted/PROVISIONING_Modificado_img_2.png",
      title: "Evidencia Visual 2 (PROVISIONING Modificado)",
      description: "Imagen extraÃ­da del documento original: PROVISIONING_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "PROVISIONING_Modificado_img_3",
      url: "./images/extracted/PROVISIONING_Modificado_img_3.png",
      title: "Evidencia Visual 3 (PROVISIONING Modificado)",
      description: "Imagen extraÃ­da del documento original: PROVISIONING_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "PROVISIONING_Modificado_img_4",
      url: "./images/extracted/PROVISIONING_Modificado_img_4.png",
      title: "Evidencia Visual 4 (PROVISIONING Modificado)",
      description: "Imagen extraÃ­da del documento original: PROVISIONING_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "PROVISIONING_Modificado_img_5",
      url: "./images/extracted/PROVISIONING_Modificado_img_5.png",
      title: "Evidencia Visual 5 (PROVISIONING Modificado)",
      description: "Imagen extraÃ­da del documento original: PROVISIONING_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "PROVISIONING_Modificado_img_6",
      url: "./images/extracted/PROVISIONING_Modificado_img_6.png",
      title: "Evidencia Visual 6 (PROVISIONING Modificado)",
      description: "Imagen extraÃ­da del documento original: PROVISIONING_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["provisioning", "modificado", "local", "docs", "provisioning_modificado"]
  },
  {
    id: "sn_found_verify_failed_Modificado",
    title: "sn found verify failed Modificado",
    category: "DocumentaciÃ³n Local / PROVISIONING",
    lastUpdated: "2026-08-06",
    content: "sn_found_verify_failed_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Modo de FallaUSO:Diagnóstico y tratamiento del error sn_found_verify_failed detectado durante la estación de Provisioning.APLICA CUANDO:- La unidad falla en Provisioning.- En Radix aparece el estatus sn_found_verify_failed.- Existen problemas de validación o almacenamiento de logs.- Se requiere determinar la acción correctiva asociada al canal afectado.AREA:PROVISIONINGREPARACIONDEBUGDIAGNOSTICOISTKEYWORDS:sn_found_verify_failedProvisioningRadixDauntlessMemoryChannel BlockGhostfishFunctional FailureU46_0U47_0RESUMEN:Este modo de falla se identifica en Radix como sn_found_verify_failed. El procedimiento indica enviar la unidad a desensamble y reemplazar el Dauntless defectuoso junto con la memoria asociada para evitar bloqueos del canal.USO RAPIDO:1. Confirmar falla sn_found_verify_failed en Radix.2. Enviar unidad a desensamble.3. Identificar canal afectado.4. Reemplazar Dauntless defectuoso.5. Reemplazar memoria asociada.6. Registrar reparación.7. Reingresar unidad al flujo de validación.ACCION CORRECTIVA:- Desensamble de unidad.- Cambio de Dauntless defectuoso.- Cambio de memoria relacionada.- Validación posterior en flujo de pruebas.CASO DOCUMENTADO:Serial: FLG2620-00255Observación: Cambiar U46_0 y U47_0.RELACIONADO CON:- Provisioning- Radix- Diagnóstico funcional- Fallas de canal- Reparación de PCBASALIDA ESPERADA:Recuperación del canal afectado y validación exitosa de Provisioning sin recurrencia del error sn_found_verify_failed. sn_found_verify_failed Este modo de falla se ve reflejado en radix de la siguiente manera [IMAGE_PLACEHOLDER_1] Se debe mandar a desensamble y se tiene que cambiar el dauntless que falla asi como la memoria para evitar que se bloquee el canal. FLG2620-00255 [IMAGE_PLACEHOLDER_2] [IMAGE_PLACEHOLDER_3]",
    photos: [
    {
      id: "sn_found_verify_failed_Modificado_img_1",
      url: "./images/extracted/sn_found_verify_failed_Modificado_img_1.png",
      title: "Evidencia Visual 1 (sn found verify failed Modificado)",
      description: "Imagen extraÃ­da del documento original: sn_found_verify_failed_Modificado.docx",
      type: "general",
      status: "general"
    },
    {
      id: "sn_found_verify_failed_Modificado_img_2",
      url: "./images/extracted/sn_found_verify_failed_Modificado_img_2.png",
      title: "Evidencia Visual 2 (sn found verify failed Modificado)",
      description: "Imagen extraÃ­da del documento original: sn_found_verify_failed_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["found", "verify", "failed", "modificado", "local", "docs", "sn_found_verify_failed_modificado"]
  },
  {
    id: "ASIC_Y_VERTICAL_POWER_Modificado",
    title: "ASIC Y VERTICAL POWER Modificado",
    category: "DocumentaciÃ³n Local / Reglas IST",
    lastUpdated: "2026-08-06",
    content: "ASIC_Y_VERTICAL_POWER_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Regla de Reemplazo ASIC y Vertical PowerUSO:Definir las reglas de baja y reemplazo de ASIC y Vertical Power (VPWR) dentro del sistema FF conforme a los requerimientos del cliente.APLICA CUANDO:- Se da de baja un ASIC.- Se da de baja un Vertical Power.- Se realiza un cambio de componente en FF.- Se requiere cumplir con las reglas de espejo entre ASIC y VPWR.AREA:DEBUGFAREPARACIONFFKEYWORDS:ASICVPWRVertical PowerFFMirror ASICCustomer RequirementComponent ReplacementRESUMEN:Existen reglas específicas definidas por el cliente para el reemplazo de ASIC y Vertical Power. El sistema FF realiza cargas automáticas de componentes relacionados para mantener la configuración requerida. citeturn52search1REGLA 1:BAJA DE ASICCuando se da de baja una localidad ASIC en FF, el sistema carga automáticamente los dos Vertical Power asociados. Esta acción se realiza por requerimiento del cliente. citeturn52search1REGLA 2:BAJA DE VERTICAL POWERCuando se da de baja un Vertical Power, deben darse de baja ambos Vertical Power aunque solamente uno presente el defecto. Esto se debe a restricciones de perfiles dentro del sistema y a requerimientos del cliente. citeturn52search1EFECTO ESPEJO:Al cargar ambos Vertical Power, el sistema también cargará automáticamente el ASIC espejo correspondiente. citeturn52search1COMO CONFIRMAR:1. Revisar la localidad afectada.2. Confirmar si corresponde a ASIC o VPWR.3. Verificar las cargas automáticas realizadas por FF.4. Confirmar que los componentes espejo fueron incluidos.CAUSAS PROBABLES DE ERROR:- Cambio parcial de VPWR.- Omisión de componente espejo.- Aplicación incorrecta de reglas de FF.ACCION CORRECTIVA:- Seguir las reglas de cliente.- Reemplazar ambos VPWR cuando aplique.- Verificar que ASIC espejo sea cargado automáticamente.- Confirmar consistencia de BOM después del reemplazo.RELACIONADO CON:- FF System- ASIC Replacement- Vertical Power Replacement- Mirror Components- Customer RequirementsSALIDA ESPERADA:Garantizar que los reemplazos de ASIC y VPWR cumplan con las reglas definidas por el cliente y evitar discrepancias de configuración en la unidad. ASIC Y VERTICAL POWER Tuesday, April 28, 2026 4:28 PM Regla al dar de baja los VPWR Y ASIC: Cuando damos de Baja una localidad de ASIC en FF, el sistema automáticamente le cargara los 2 vertical power( Esto por indicacion del cliente) Cuando damos de Baja una localidad de VPWR en FF, tenemos que asegurarnos de dar de baja los 2 Vertical power aunque solo 1 tenga el defecto, esto se hace ya que no es posible por temas de perfiles. Solo cambiar 1 y por indicacion de cliente. Y al igual Se cargara el ASIC espejo al cargar los 2 Vertical POWERs Eduardo Audelo [IMAGE_PLACEHOLDER_1]",
    photos: [
    {
      id: "ASIC_Y_VERTICAL_POWER_Modificado_img_1",
      url: "./images/extracted/ASIC_Y_VERTICAL_POWER_Modificado_img_1.png",
      title: "Evidencia Visual 1 (ASIC Y VERTICAL POWER Modificado)",
      description: "Imagen extraÃ­da del documento original: ASIC_Y_VERTICAL_POWER_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["asic", "vertical", "power", "modificado", "local", "docs", "asic_y_vertical_power_modificado"]
  },
  {
    id: "Cadena_Jerarquica_Modificado",
    title: "Cadena Jerarquica Modificado",
    category: "DocumentaciÃ³n Local / Reglas IST",
    lastUpdated: "2026-08-06",
    content: "Cadena_Jerarquica_Modificado INFORMACIÓN BASE DEL SISTEMA EXPERTOTIPO:Cadena Jerárquica de EscalaciónUSO:Definir la ruta de escalación y responsables para el análisis, seguimiento y resolución de unidades falladas dentro de las áreas de Debug e IST.APLICA CUANDO:- Existen unidades en Debug.- Se requiere escalación técnica.- Una unidad supera el tiempo objetivo de reparación.- Se necesita asignar ownership.AREA:DEBUGISTBFTICTBONEPILEKEYWORDS:LeaderFA TechnicianDebug TechnicianHard DebugFirst HandTracker TeamBonepileEscalationRESUMEN:La cadena jerárquica establece los responsables y niveles de soporte para la atención de fallas y seguimiento de unidades dentro de las áreas de Debug, IST, BFT, ICT y Bonepile. También incluye el manejo de unidades con más de 15 días de falla. citeturn51search1AREAS INVOLUCRADAS:- Debug.- FA &amp; BPY Engineers.- IST.- BFT.- ICT.- Bonepile Team. citeturn51search1ROLES PRINCIPALES:- Leader.- First Hand Technician.- FA Technician.- Debug Technician.- Hard Debug Technician.- Tracker Team. citeturn51search1ESCALACION SUGERIDA:1. Técnico asignado.2. Debug Technician.3. Hard Debug Technician.4. FA Technician.5. Leader.6. FA &amp; BPY Engineers. citeturn51search1UNIDADES MAYORES A 15 DIAS:Las unidades con más de 15 días de falla requieren seguimiento especial, revisión de ownership y escalación formal. citeturn51search1COMPONENTES DE SOPORTE:- Tracker Team.- Bonepile Team.- De-Assembly Area. citeturn51search1ACCION CORRECTIVA:- Escalar al siguiente nivel técnico.- Asignar ownership.- Documentar avances.- Mantener seguimiento hasta cierre.SALIDA ESPERADA:Asegurar que cada unidad tenga un responsable definido y una ruta clara de escalación hasta su resolución. Cadena Jerarquica Tuesday, April 28, 2026 4:24 PM [IMAGE_PLACEHOLDER_1]",
    photos: [
    {
      id: "Cadena_Jerarquica_Modificado_img_1",
      url: "./images/extracted/Cadena_Jerarquica_Modificado_img_1.png",
      title: "Evidencia Visual 1 (Cadena Jerarquica Modificado)",
      description: "Imagen extraÃ­da del documento original: Cadena_Jerarquica_Modificado.docx",
      type: "general",
      status: "general"
    }
    ],
    keywords: ["cadena", "jerarquica", "modificado", "local", "docs", "cadena_jerarquica_modificado"]
  }
];

window.INITIAL_KNOWLEDGE_BASE = [
  {
    id: "KB-000001",
    title: "KB-000001: Falla de comunicaciÃ³n gBMC (Ping-gBMC Fail)",
    category: "Base de Conocimientos / Casos HistÃ³ricos",
    lastUpdated: "2026-06-15",
    content: "Caso de soporte tÃ©cnico. SÃ­ntoma: Fallo de booteo. Causa RaÃ­z: Soldadura defectuosa en pin 12 del Mux U144. AcciÃ³n correctiva: Reflujo localizado con estaciÃ³n de aire caliente a 350C por 45 segundos.",
    keywords: ["gbmc", "ping", "u144", "soldadura", "reflux", "reflujo"]
  },
  {
    id: "KB-000002",
    title: "KB-000002: Falla en etapa de potencia / CaÃ­da de ASIC",
    category: "Base de Conocimientos / Casos HistÃ³ricos",
    lastUpdated: "2026-06-20",
    content: "Caso de soporte tÃ©cnico. SÃ­ntoma: ASIC se apaga repentinamente. Causa RaÃ­z: VPWR primario presenta sobrecorriente. AcciÃ³n correctiva: Reemplazo obligatorio de ambos VPWR y el ASIC espejo para equilibrar la impedancia.",
    keywords: ["asic", "vpwr", "potencia", "espejo", "impedancia", "reemplazo"]
  }
];

window.EXTERNAL_SOURCES = [
  {
    id: "EXT-001",
    title: "EXT-001: The Art of Electronics - Reguladores",
    category: "Referencias Externas / Textbooks",
    lastUpdated: "2026-06-20",
    content: "CapÃ­tulo de diseÃ±o de reguladores. Destaca que en controladores simÃ©tricos, la simetrÃ­a de la impedancia del trazado de cobre es crÃ­tica para el balance tÃ©rmico de los transistores.",
    keywords: ["art of electronics", "reguladores", "impedancia", "trazado", "cobre"]
  },
  {
    id: "EXT-002",
    title: "EXT-002: Texas Instruments - Convertidores Buck",
    category: "Referencias Externas / Textbooks",
    lastUpdated: "2026-06-20",
    content: "Nota de aplicaciÃ³n sobre convertidores Buck multifase. Explica que la asimetrÃ­a en la carga de inductores causa fallas tÃ©rmicas catastrÃ³ficas en fases adyacentes.",
    keywords: ["texas instruments", "buck", "multifase", "inductores", "asimetria"]
  },
  {
    id: "EXT-003",
    title: "EXT-003: Keysight Technologies - Mediciones de Alta Frecuencia",
    category: "Referencias Externas / Textbooks",
    lastUpdated: "2026-06-20",
    content: "GuÃ­a de instrumentaciÃ³n. La mediciÃ³n de relojes de alta velocidad (como lÃ­neas PCIe de 16 GT/s) requiere sondas activas de alta impedancia para evitar cargar la lÃ­nea fÃ­sica.",
    keywords: ["keysight", "mediciones", "alta frecuencia", "reloj", "pcie", "sondas"]
  },
  {
    id: "EXT-004",
    title: "EXT-004: Electronics Repair School - InyecciÃ³n de Corriente",
    category: "Referencias Externas / Textbooks",
    lastUpdated: "2026-06-20",
    content: "Video tutorial sobre inyecciÃ³n de corriente para cortos en placas madre. Inyectar voltaje de 1V limitado a 2A y usar cÃ¡mara tÃ©rmica para detectar el componente daÃ±ado.",
    keywords: ["electronics repair", "inyeccion", "corriente", "cortocircuito", "camara termica"]
  }
];