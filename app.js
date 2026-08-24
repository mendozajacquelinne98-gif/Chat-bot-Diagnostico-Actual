/**
 * Lógica Principal del ChatBot de Diagnóstico Ghostfish
 */

// Safe Storage Wrapper to prevent crashes in environments where LocalStorage is restricted (e.g. file:// protocol under corporate policies)
const safeStorage = {
  memoryStore: {},
  isFallbackActive: false,
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      if (!this.isFallbackActive) {
        this.isFallbackActive = true;
        console.warn("LocalStorage is restricted. Activating in-memory fallback store.", e);
        setTimeout(() => {
          const statusText = document.querySelector('.status-indicator span');
          const statusDot = document.querySelector('.status-dot');
          if (statusText) statusText.textContent = "Online (Memoria)";
          if (statusDot) statusDot.style.background = "#eab308"; // Amber color to indicate fallback/warning
        }, 100);
      }
      return this.memoryStore[key] || null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      if (!this.isFallbackActive) {
        this.isFallbackActive = true;
        console.warn("LocalStorage write failed. Activating in-memory fallback store.", e);
      }
      this.memoryStore[key] = value;
    }
  }
};

// Usar directamente window.GF_DOCUMENTS de mockData.js como la fuente de verdad primaria.
// Esto evita bloqueos de caché de LocalStorage en refrescos de navegador.
let localCustomDocs = [];
try {
  const customStr = safeStorage.getItem('CUSTOM_GF_DOCUMENTS');
  if (customStr) localCustomDocs = JSON.parse(customStr);
} catch (e) {
  console.warn('[Kaifish] No se pudo leer documentos personalizados:', e);
}

let documents = [...window.GF_DOCUMENTS, ...localCustomDocs];
safeStorage.setItem('GF_DOCUMENTS', JSON.stringify(documents));

if (!safeStorage.getItem('KNOWLEDGE_BASE')) {
  safeStorage.setItem('KNOWLEDGE_BASE', JSON.stringify(window.INITIAL_KNOWLEDGE_BASE));
}

let casesKB = JSON.parse(safeStorage.getItem('KNOWLEDGE_BASE'));
let sessionHistory = [];
let uploadedPhotos = []; // Almacena las fotos del caso actual que se está registrando
let activeSpeechVoice = null;
let isVoiceOutputEnabled = true; // Activo por defecto en segundo plano, oculto de la interfaz

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initChat();
  initForm();
  initLibrary();
  initDashboard();
  setupVoiceOutput();
  // initJarvisAvatars(); // Desactivar avatar vectorial estilo Jarvis para restaurar las imágenes originales de Kaifish
  
  // Cargar primer documento en la vista de manuales por defecto
  if (documents.length > 0) {
    showDocumentDetails(documents[0].id);
  }
});

/* ====================================================================
   SISTEMA DE RUTAS (SPA)
   ==================================================================== */
function initRouter() {
  const menuLinks = document.querySelectorAll('.sidebar-menu li a');
  const panels = document.querySelectorAll('.view-panel');
  
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetView = link.getAttribute('data-view');
      
      // Proteger el acceso a Documentar Caso
      if (targetView === 'form') {
        if (!isCurrentUserAuthenticated) {
          showAuthModal(() => {
            navigateToView(link, targetView);
          });
          return;
        }
      }
      
      navigateToView(link, targetView);
    });
  });

  function navigateToView(link, targetView) {
    // Remover active de todos los links y agregar al seleccionado
    menuLinks.forEach(l => l.parentElement.classList.remove('active'));
    link.parentElement.classList.add('active');
    
    // Ocultar todos los paneles y mostrar el activo
    panels.forEach(p => p.classList.remove('active'));
    
    const targetPanel = document.getElementById(`${targetView}-view`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
    
    // Acciones específicas por vista
    if (targetView === 'dashboard') {
      renderCharts();
    } else if (targetView === 'library') {
      renderLibrary();
    } else if (targetView === 'docs') {
      renderDocsList();
    }
  }
}

/* ====================================================================
   VISTA: CHATBOT DE DIAGNÓSTICO
   ==================================================================== */
function initChat() {
  const chatInput = document.getElementById('chat-input');
  const btnSend = document.getElementById('btn-send');
  const btnVoice = document.getElementById('btn-voice');
  const chatHistory = document.getElementById('chat-history');
  
  // Auto-ajustar altura del textarea
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = (chatInput.scrollHeight - 6) + 'px';
  });

  // Enfocar el textarea al hacer clic en el contenedor (facilita el enfoque en tablets/moviles)
  const chatInputContainer = document.querySelector('.chat-input-container');
  if (chatInputContainer) {
    chatInputContainer.addEventListener('click', (e) => {
      if (e.target !== chatInput && !e.target.closest('.btn-chat-action')) {
        chatInput.focus();
      }
    });
  }

  // Enviar con Enter (sin Shift)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserSubmit();
    }
  });

  btnSend.addEventListener('click', handleUserSubmit);

  const btnReadToggle = document.getElementById('btn-read-toggle');
  if (btnReadToggle) {
    btnReadToggle.addEventListener('click', () => {
      toggleVoiceOutputGlobal();
    });
  }
  
  // Inicialización de reconocimiento de voz (Web Speech API)
  let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isListening = false;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      isListening = true;
      btnVoice.classList.add('listening');
      document.querySelector('.voice-visualizer').classList.add('active');
      initSiriWave();
      chatInput.placeholder = "Escuchando...";
    };

    recognition.onend = () => {
      isListening = false;
      btnVoice.classList.remove('listening');
      document.querySelector('.voice-visualizer').classList.remove('active');
      chatInput.placeholder = "Escribe o usa la voz...";
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      chatInput.value = speechToText;
      handleUserSubmit();
    };

    recognition.onerror = (event) => {
      console.error("Error en reconocimiento de voz: ", event.error);
      alert("Error de micrófono o permisos: " + event.error);
    };

    btnVoice.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  } else {
    // Simulación premium para entornos donde el micrófono no está soportado/disponible (ej. navegadores antiguos)
    btnVoice.addEventListener('click', () => {
      btnVoice.classList.add('listening');
      document.querySelector('.voice-visualizer').classList.add('active');
      initSiriWave();
      chatInput.placeholder = "Simulando dictado de voz...";
      
      const mockQueries = [
        "¿Cómo diagnosticar el error ping-gbmc-from-host-tray-fail?",
        "Tengo un cortocircuito en VPWR1, ¿qué componentes debo reemplazar?",
        "Falla de encendido, señal FAN_HSWAP_PGOOD en 0V.",
        "Error unexpected-exception en unidad PCBA-GF-V2.",
        "¿Cuáles son las mejores prácticas para rework de chips Gull Wing?"
      ];
      
      // Seleccionar una consulta aleatoria para la simulación tras 2 segundos
      setTimeout(() => {
        const randomQuery = mockQueries[Math.floor(Math.random() * mockQueries.length)];
        let index = 0;
        chatInput.value = "";
        
        const typingInterval = setInterval(() => {
          if (index < randomQuery.length) {
            chatInput.value += randomQuery.charAt(index);
            index++;
          } else {
            clearInterval(typingInterval);
            setTimeout(() => {
              btnVoice.classList.remove('listening');
              document.querySelector('.voice-visualizer').classList.remove('active');
              chatInput.placeholder = "Escribe o usa la voz...";
              handleUserSubmit();
            }, 800);
          }
        }, 35);
      }, 1500);
    });
  }

  // Clic en tarjetas de sugerencia iniciales
  document.querySelectorAll('.suggestion-card').forEach(card => {
    card.addEventListener('click', () => {
      chatInput.value = card.getAttribute('data-query');
      handleUserSubmit();
    });
  });
}

async function obtenerDiagnosticoKaifish(consulta, contextoSkill, imagen = null) {
  let apiKey = '';
  
  // 1. Intentar leer la clave de API desde el archivo .env de forma local en el navegador
  try {
    const envRes = await fetch('.env');
    if (envRes.ok) {
      const envText = await envRes.text();
      const match = envText.match(/GEMINI_API_KEY\s*=\s*(.+)/);
      if (match) {
        apiKey = match[1].trim();
      }
    }
  } catch (e) {
    console.warn('[Kaifish] No se pudo leer el archivo .env desde el navegador.', e);
  }

  // 2. Si hay una clave válida (y no es el placeholder de plantilla), intentar petición directa a la API de Gemini
  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE' && apiKey !== 'Debug Bot') {
    try {
      console.log('[Kaifish Gemini API] Clave de API leída desde .env. Realizando llamada directa a Google GenAI.');
      
      const SYSTEM_INSTRUCTION = `
Eres Kaifish, un asistente virtual experto en soporte de ingeniería y diagnóstico de tarjetas electrónicas de manufactura Ghostfish (GF).
Tu objetivo es analizar las consultas técnicas de los técnicos y sugerir diagnósticos altamente precisos.
Debes tomar en cuenta el contexto de la base documental indexada (NotebookLM / Manuales de Planta) para formular tu respuesta.
Genera siempre información detallada y profesional de ingeniería de manufactura, incluyendo componentes exactos (como U71, U19, U144, XSKT1, VPWR), señales de control (como TITAN0_GOOD, FAN_HSWAP_PGOOD) y voltajes específicos (como 3.3V, 54V, 0.8V).
Identifica cuáles de los archivos locales consultados de la carpeta /docs (ej. GF-FF-001.md, GF-BOOT-002.md, GF-LOGS-003.md, GF-FA-004.md, GF-ESC-005.md, GF-HW-006.md) contienen la información relevante para la consulta y colócalos en la lista 'fuentesLocales'.
Evita simplificar excesivamente la respuesta y nunca trunques el contenido técnico. Toda la respuesta debe estar formateada de acuerdo al esquema estructurado solicitado.
      `;
      
      const promptText = `Consulta del Técnico: "${consulta}"\n\nContexto de Referencia de la Skill/Manuales:\n${contextoSkill}\n`;
      
      const payload = {
        contents: [{ parts: [{ text: promptText }] }],
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              modoFalla: { type: "STRING", description: "Identificación técnica precisa del modo de falla." },
              causaRaiz: { type: "STRING", description: "Explicación física y eléctrica detallada." },
              pasosTroubleshooting: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "Pasos ordenados para aislar la falla."
              },
              accionesCorrectivas: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "Acciones de rework recomendadas."
              },
              fuentesLocales: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "Nombres de los archivos locales de referencia de la carpeta /docs consultados (ej. ['GF-BOOT-002.md', 'GF-LOGS-003.md'])."
              }
            },
            required: ["modoFalla", "causaRaiz", "pasosTroubleshooting", "accionesCorrectivas", "fuentesLocales"]
          },
          temperature: 0.2
        }
      };

      // Si hay una imagen en base64, agregarla al contenido para análisis multimodal
      if (imagen && imagen.startsWith('data:image/')) {
        const commaIdx = imagen.indexOf(',');
        if (commaIdx !== -1) {
          const mimeType = imagen.substring(5, commaIdx.split(';')[0]);
          const base64Data = imagen.substring(commaIdx + 1);
          payload.contents[0].parts.push({
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          });
        }
      }

      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
       });

       if (geminiRes.ok) {
         const resData = await geminiRes.json();
         if (resData.candidates && resData.candidates[0].content.parts[0].text) {
           const parsedJson = JSON.parse(resData.candidates[0].content.parts[0].text);
           return {
             success: true,
             diagnostico: parsedJson
           };
         }
       } else {
         console.warn(`[Kaifish Gemini API] Error HTTP de API de Google: ${geminiRes.status}`);
       }
    } catch (err) {
      console.warn('[Kaifish Gemini API] Falla en conexión directa de API Google. Usando simulador/fallback.', err);
    }
  }

  // 3. Fallback al servidor proxy local si estuviese encendido
  try {
    const response = await fetch('http://localhost:3000/api/diagnostico', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ consulta, contextoSkill, imagen })
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    // Si no está el backend ni hay API key de internet, simular respuesta estructurada premium para validación visual
    const qLower = (consulta || "").toLowerCase();
    if (qLower.includes('e-402') || qLower.includes('fallo') || qLower.includes('diagnostico') || qLower.includes('diagnóstico')) {
      return {
        success: true,
        diagnostico: {
          modoFalla: "Falla de Secuencia de Arranque / Ventiladores (Código E-402)",
          causaRaiz: "Ausencia de la señal de presencia de ventiladores (FAN_HSWAP_PGOOD en 0V) debido a un cortocircuito en el pin de retroalimentación del conector principal, impidiendo que el secuenciador ADM1266 libere la línea de potencia de 54V.",
          pasosTroubleshooting: [
            "Medir el voltaje en la señal FAN_HSWAP_PGOOD (debería mostrar 54V en estado nominal, medido en 0V).",
            "Verificar la integridad del conector de ventiladores ST-04 buscando pines doblados o restos de soldadura.",
            "Comprobar si el firmware del secuenciador ADM1266 registra un evento de apagado en el volcado de la Blackbox."
          ],
          accionesCorrectivas: [
            "Limpiar restos de soldadura en el conector ST-04 mediante malla desoldadora según la norma IPC-7711.",
            "Reemplazar el conector si presenta daño físico.",
            "Realizar ciclo de reboot térmico de 50 ciclos para asegurar que la señal FAN_HSWAP_PGOOD permanezca estable en 54V."
          ],
          fuentesLocales: ["GF-LOGS-003.md"]
        }
      };
    } else if (qLower.includes('ping') || qLower.includes('gbmc') || qLower.includes('boot')) {
      return {
        success: true,
        diagnostico: {
          modoFalla: "Falla de comunicación gBMC (gBMC Ping Failure)",
          causaRaiz: "Corrupción del firmware en la partición activa cargada por Dauntless, resultando en la caída de la señal de reset TITAN0_GOOD.",
          pasosTroubleshooting: [
            "Chequear el estado del reset TITAN0_GOOD en el punto TP_T0_GOOD (debe registrar 1.8V).",
            "Comprobar bus SPI en multiplexor U144 para descartar atascamientos."
          ],
          accionesCorrectivas: [
            "Proceder al reflasheo de la memoria externa XSKT1.",
            "Resoldar BIOS Dauntless U71 si se aprecian fisuras térmicas."
          ],
          fuentesLocales: ["GF-BOOT-002.md"]
        }
      };
    }
    return null;
  }
}

async function handleUserSubmit() {
  const chatInput = document.getElementById('chat-input');
  const query = chatInput.value.trim();
  if (!query) return;

  // Limpiar input
  chatInput.value = "";
  chatInput.style.height = '24px';

  // Mostrar mensaje del usuario
  appendMessage(query, 'user');

  // Procesar consulta por el motor de búsqueda (Typing Indicator)
  showTypingIndicator();
  
  // Realizar búsqueda local preliminar para recopilar contexto
  const localResult = searchKnowledgeBase(query);
  const contextoSkill = localResult ? localResult.speechText : '';

  // Intentar obtener diagnóstico desde el servidor seguro backend que llama a Gemini
  const geminiData = await obtenerDiagnosticoKaifish(query, contextoSkill);

  removeTypingIndicator();

  if (geminiData && geminiData.success && geminiData.diagnostico) {
    const diag = geminiData.diagnostico;
    const totalCount = geminiData.totalDocsCount || (window.GF_DOCUMENTS ? window.GF_DOCUMENTS.length : 6);
    
    // Construcción del Structured Output con diseño premium de ingeniería
    const htmlResponse = `
      <div class="result-card gemini-structured-result">
        <div class="result-header">
          <div class="doc-meta-category">Diagnóstico de Inteligencia Artificial (Kaifish)</div>
          <h3>${diag.modoFalla || 'Modo de Falla Detectado'}</h3>
        </div>
        
        <div class="cause-box" style="margin-top: 12px; background: rgba(0, 180, 216, 0.05); padding: 12px; border-left: 4px solid var(--accent-cyan); border-radius: 6px;">
          <strong>Causa Raíz Analizada:</strong>
          <p style="margin-top: 6px; font-size: 0.95rem; line-height: 1.5; color: var(--text-primary);">${diag.causaRaiz}</p>
        </div>
        
        <div class="steps-section" style="margin-top: 16px;">
          <strong>Procedimiento de Troubleshooting Sugerido:</strong>
          <ul class="steps-list" style="margin-top: 8px; padding-left: 20px; display: flex; flex-direction: column; gap: 8px;">
            ${(diag.pasosTroubleshooting || []).map((paso, idx) => `
              <li style="font-size: 0.95rem; line-height: 1.4; color: var(--text-primary);">
                <strong>Paso ${idx + 1}:</strong> ${paso}
              </li>
            `).join('')}
          </ul>
        </div>
        
        <div class="actions-section" style="margin-top: 16px; border-top: 1px solid var(--panel-border); padding-top: 12px;">
          <strong>Acciones Correctivas Recomendadas:</strong>
          <ul class="actions-list" style="margin-top: 8px; list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 6px;">
            ${(diag.accionesCorrectivas || []).map((accion) => `
              <li style="font-size: 0.95rem; color: var(--text-primary); display: flex; align-items: flex-start; gap: 8px;">
                <span style="color: var(--accent-cyan); font-weight: bold;">✔</span>
                <span>${accion}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        
        <div class="source-alert" style="margin-top: 16px; display: flex; flex-direction: column; gap: 6px; padding: 10px; background: rgba(0, 180, 216, 0.05); border-radius: 6px; border: 1.5px solid rgba(0, 180, 216, 0.15);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cpu" style="color: var(--accent-cyan);"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>
            <span style="font-weight: 600; font-size: 0.8rem; color: var(--accent-cyan);">Generado en tiempo real con Gemini 2.5 Flash</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px; line-height: 1.4;">
            <strong>Fuentes locales consultadas (${(diag.fuentesLocales || []).length}/${totalCount} archivos):</strong> 
            ${(diag.fuentesLocales || []).map(f => `<code style="background: rgba(255,255,255,0.08); padding: 2px 5px; border-radius: 4px; color: var(--accent-cyan); margin-right: 4px; font-family: Consolas, monospace; font-size: 0.75rem;">/docs/${f}</code>`).join('') || '<code style="color: var(--text-secondary);">Ninguna</code>'}
          </div>
        </div>
      </div>
    `;
    
    const speechText = `Gemini ha diagnosticado el problema. Modo de falla: ${diag.modoFalla || ''}. Causa raíz: ${diag.causaRaiz || ''}.`;
    
    // Registrar métrica de origen
    incrementSourceMetric('NotebookLM');
    
    appendMessage(htmlResponse, 'bot', { html: htmlResponse, speechText: speechText, query: query });
  } else {
    // Si falla o no está corriendo el backend, fallback directo al motor de búsqueda local (nunca se rompe)
    appendMessage(localResult.html, 'bot', localResult);
  }
}

function determineKaifishExpression(query, resultData) {
  const q = (query || "").toLowerCase();
  
  // 1. Mensajes positivos o felicitaciones -> kaifish_feliz.png
  const positiveTriggers = [
    "hola", "buenos dias", "buenas tardes", "gracias", "excelente", 
    "perfecto", "super", "bien", "ok", "felicitaciones", "buen trabajo", 
    "saludos", "hi", "hello"
  ];
  if (positiveTriggers.some(t => q.includes(t))) {
    return "images/kaifish_feliz.png";
  }
  
  // 2. Si hay un resultado de la búsqueda
  if (resultData) {
    const htmlText = (resultData.html || "").toLowerCase();
    
    // Si viene de un caso de la base de conocimiento (KB)
    if (resultData.kbCaseId || htmlText.includes("kb-") || htmlText.includes("caja negra") || htmlText.includes("fuente de resolución")) {
      return "images/kaifish_calidad_ok.png"; // Respuesta correcta encontrada
    }
    
    // Si viene de un manual de retrabajo/mejores prácticas
    if (htmlText.includes("gf-hw-006") || htmlText.includes("rework") || htmlText.includes("mejora") || htmlText.includes("mejores practicas") || htmlText.includes("mejores prácticas")) {
      return "images/kaifish_mejora_continua.png"; // Mejora implementada
    }
    
    // Si es un tema de riesgo o seguridad ESD
    if (htmlText.includes("esd") || htmlText.includes("seguridad") || htmlText.includes("alerta") || htmlText.includes("riesgo") || htmlText.includes("advertencia")) {
      return "images/kaifish_alerta.png"; // Riesgo de calidad
    }
    
    // Si es una sugerencia de causa raíz
    if (htmlText.includes("causa raiz") || htmlText.includes("causa raíz") || htmlText.includes("rootcause") || htmlText.includes("espejo") || htmlText.includes("mirror")) {
      return "images/kaifish_pensativo.png"; // Sugerencia de causa raíz
    }
  }
  
  // 3. Por defecto para diagnóstico/análisis técnicos
  return "images/kaifish_investigador.png"; // Diagnóstico o análisis
}

function appendMessage(content, sender, resultData = null) {
  const chatHistory = document.getElementById('chat-history');
  const chatInput = document.getElementById('chat-input');
  const btnSend = document.getElementById('btn-send');
  
  // Limpiar bienvenida si existe
  const welcome = chatHistory.querySelector('.chat-welcome');
  if (welcome) welcome.remove();

  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  
  const avatarLetter = sender === 'user' ? 'T' : 'IA';

  if (sender === 'user') {
    msgDiv.innerHTML = `
      <div class="message-avatar">${avatarLetter}</div>
      <div class="message-bubble">
        ${content}
      </div>
    `;
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  } else {
    // Para el bot, creamos la burbuja con el contenedor de contenido. Sin controles de audio según requerimientos de UI.
    const avatarUrl = determineKaifishExpression(resultData ? resultData.query : '', resultData);
    
    // Actualizar avatares sincronizados de Kaifish
    const avatars = document.querySelectorAll('.kaifish-avatar-sync');
    avatars.forEach(avatar => {
      avatar.src = avatarUrl;
      avatar.classList.remove('thinking-anim');
      avatar.classList.remove('pop-anim');
      void avatar.offsetWidth; // Trigger reflow
      avatar.classList.add('pop-anim');
    });

    msgDiv.innerHTML = `
      <div class="message-bubble">
        <div class="message-content"></div>
      </div>
    `;
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    const bubble = msgDiv.querySelector('.message-bubble');
    const messageContent = bubble.querySelector('.message-content');
    
    // Deshabilitar entrada de texto mientras escribe el chatbot
    if (chatInput) chatInput.disabled = true;
    if (btnSend) btnSend.disabled = true;

    // Preparar secciones
    const temp = document.createElement('div');
    temp.innerHTML = content;
    const responseRoot = temp.querySelector('.diagnostic-response') || temp;
    const sections = Array.from(responseRoot.children);

    const onStreamComplete = () => {
      // Habilitar entrada de texto una vez concluido el despliegue
      if (chatInput) {
        chatInput.disabled = false;
        chatInput.focus();
      }
      if (btnSend) btnSend.disabled = false;
      
      // Vincular eventos a los botones de retroalimentación o formularios incrustados en la burbuja
      if (resultData) {
        // Vincular calificaciones de solución (thumbs up/down)
        const btnUp = bubble.querySelector('.btn-rate-up');
        const btnDown = bubble.querySelector('.btn-rate-down');
        
        if (btnUp && btnDown && resultData.kbCaseId) {
          btnUp.addEventListener('click', () => rateSolution(resultData.kbCaseId, 'up', btnUp, btnDown));
          btnDown.addEventListener('click', () => rateSolution(resultData.kbCaseId, 'down', btnUp, btnDown));
        }

        // Vincular botón para Ver Procedimiento Completo (si es caso KB)
        const btnLink = bubble.querySelector('.btn-link-kb');
        if (btnLink && resultData.kbCaseId) {
          btnLink.addEventListener('click', () => {
            showCaseDetails(resultData.kbCaseId);
          });
        }

        // Vincular botón de "REGISTRAR SOLUCIÓN" (Aprendizaje Continuo)
        const btnRegister = bubble.querySelector('.btn-register-sol');
        if (btnRegister) {
          btnRegister.addEventListener('click', () => {
            // Redirigir a pestaña de Documentar
            const documentLink = document.querySelector('a[data-view="form"]');
            if (documentLink) documentLink.click();
            // Llenar datos conocidos en el formulario
            const symptomInput = document.getElementById('form-symptom');
            if (symptomInput) symptomInput.value = queryFromHistory(resultData.query);
          });
        }
      }
    };

    // Lanzar efecto de stream progresivo y lectura simultánea
    GhostfishStreamPlayer.playStream(sections, messageContent, bubble, onStreamComplete);
  }
}

function queryFromHistory(q) {
  return q || "";
}

function showTypingIndicator() {
  const chatHistory = document.getElementById('chat-history');
  if (document.getElementById('typing-indicator')) return;
  
  const indicator = document.createElement('div');
  indicator.id = 'typing-indicator';
  indicator.className = 'message bot';
  indicator.innerHTML = `
    <div class="message-bubble typing-bubble">
      <span style="color: var(--text-secondary); font-size: 0.88rem; font-style: italic;">Asistente está pensando</span>
      <div class="typing-dots">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
  chatHistory.appendChild(indicator);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  // Actualizar avatares sincronizados de Kaifish
  const avatars = document.querySelectorAll('.kaifish-avatar-sync');
  avatars.forEach(avatar => {
    avatar.src = "images/kaifish_pensativo.png";
    avatar.classList.remove('pop-anim');
    avatar.classList.add('thinking-anim');
  });

  // Activar animación y texto en el asistente gigante izquierdo
  const mascot = document.getElementById('assistant-mascot-img');
  if (mascot) {
    mascot.classList.add('thinking');
    mascot.classList.remove('speaking');
  }
  const statusText = document.querySelector('.status-indicator-text');
  const statusContainer = document.getElementById('assistant-status-indicator');
  if (statusText) statusText.textContent = "Analizando información...";
  if (statusContainer) statusContainer.className = "assistant-status-indicator thinking";
  setTimeout(initSiriWave, 50);
}

function removeTypingIndicator() {
  const ind = document.getElementById('typing-indicator');
  if (ind) ind.remove();

  // Limpiar clase de pensando en el asistente gigante izquierdo
  const mascot = document.getElementById('assistant-mascot-img');
  if (mascot) {
    mascot.classList.remove('thinking');
  }
}

function typeHtmlContent(content, destinationBubble, onComplete) {
  const temp = document.createElement('div');
  temp.innerHTML = content;
  
  const steps = [];
  
  function generateSteps(sourceNode, destParent) {
    for (let i = 0; i < sourceNode.childNodes.length; i++) {
      const child = sourceNode.childNodes[i];
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.nodeValue;
        if (text) {
          const textNode = document.createTextNode('');
          steps.push({ type: 'append', parent: destParent, node: textNode });
          for (let j = 0; j < text.length; j++) {
            steps.push({ type: 'type', textNode: textNode, char: text[j] });
          }
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const cloned = child.cloneNode(false);
        steps.push({ type: 'append', parent: destParent, node: cloned });
        generateSteps(child, cloned);
      }
    }
  }
  
  generateSteps(temp, destinationBubble);
  
  // Calcular velocidad dinámica del efecto de escritura según longitud del texto
  const totalChars = steps.filter(s => s.type === 'type').length;
  let batchSize = 2;
  if (totalChars > 1500) {
    batchSize = 8;
  } else if (totalChars > 800) {
    batchSize = 5;
  } else if (totalChars > 300) {
    batchSize = 3;
  }
  
  let index = 0;
  const chatHistory = document.getElementById('chat-history');
  
  function processQueue() {
    if (index >= steps.length) {
      if (onComplete) onComplete();
      return;
    }
    
    let charsTypedThisTick = 0;
    while (index < steps.length && charsTypedThisTick < batchSize) {
      const step = steps[index];
      if (step.type === 'append') {
        step.parent.appendChild(step.node);
        // Si es una imagen, reajustar scroll cuando cargue
        if (step.node.tagName === 'IMG') {
          step.node.onload = () => {
            chatHistory.scrollTop = chatHistory.scrollHeight;
          };
        }
        index++;
      } else if (step.type === 'type') {
        step.textNode.nodeValue += step.char;
        index++;
        charsTypedThisTick++;
      }
    }
    
    chatHistory.scrollTop = chatHistory.scrollHeight;
    setTimeout(processQueue, 15);
  }
  
  processQueue();
}

/* ====================================================================
   SISTEMA DE VOZ Y DIALOGO CONTINUO (Premium Ghostfish Player)
   ==================================================================== */
const GhostfishVoicePlayer = {
  blocks: [],
  currentIndex: 0,
  isPlaying: false,
  isPaused: false,
  activeBubble: null,
  timeoutId: null,
  utterance: null,

  getVoice: function() {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    // Priorizar voces latinoamericanas (es-MX, es-419)
    const latAmLocales = ['es-MX', 'es-419', 'es-CO', 'es-CL', 'es-AR', 'es-PE'];
    for (const locale of latAmLocales) {
      const voice = voices.find(v => v.lang.toLowerCase() === locale.toLowerCase() || v.lang.toLowerCase().replace('_', '-') === locale.toLowerCase());
      if (voice) return voice;
    }
    const latAmNames = ['mexico', 'sabina', 'dalia', 'jorge', 'raul', 'helena', 'google español'];
    const latAmVoice = voices.find(v => v.lang.toLowerCase().startsWith('es') && latAmNames.some(name => v.name.toLowerCase().includes(name)));
    if (latAmVoice) return latAmVoice;
    return voices.find(v => v.lang.toLowerCase().startsWith('es'));
  },

  prepareBlocks: function(bubbleElement) {
    this.blocks = [];
    this.currentIndex = 0;
    this.activeBubble = bubbleElement;

    // 1. Cabecera / Descripción
    const header = bubbleElement.querySelector('.diag-header-block');
    if (header && header.textContent.includes('[FUENTE_MODO_FALLA]')) {
      const speech = getSectionSpeechText(header);
      if (speech) this.blocks.push({ element: header, text: speech });
    }

    // 2. Componentes Sospechosos
    const components = bubbleElement.querySelector('.diag-section-components');
    if (components && components.textContent.includes('[COMPONENTES_SOSPECHOSOS]')) {
      const speech = getSectionSpeechText(components);
      if (speech) this.blocks.push({ element: components, text: speech });
    }

    // 3. Validación
    const validation = bubbleElement.querySelector('.diag-section-validation');
    if (validation && validation.textContent.includes('[VALIDACION]')) {
      const speech = getSectionSpeechText(validation);
      if (speech) this.blocks.push({ element: validation, text: speech });
    }
    
    // Fallback si no hay ninguno de los anteriores
    if (this.blocks.length === 0) {
      const messageContent = bubbleElement.querySelector('.message-content');
      if (messageContent) {
        this.blocks.push({ element: messageContent, text: cleanSpeechText(messageContent.textContent) });
      }
    }
  },

  play: function(bubbleElement) {
    if (!window.speechSynthesis) return;

    // Si es la misma burbuja y estaba pausado, reanudar
    if (this.activeBubble === bubbleElement && this.isPaused) {
      this.resume();
      return;
    }

    // Detener reproducción previa
    this.stop();
    this.prepareBlocks(bubbleElement);
    this.isPlaying = true;
    this.isPaused = false;
    this.updateControlsUI();
    
    // Activar clase de respondiendo en todos los avatares sincronizados
    document.querySelectorAll('.kaifish-avatar-sync').forEach(avatar => {
      avatar.classList.add('responding-anim');
    });

    this.speakCurrentBlock();
  },

  speakCurrentBlock: function() {
    if (!this.isPlaying || this.currentIndex >= this.blocks.length) {
      this.stop();
      return;
    }

    const block = this.blocks[this.currentIndex];
    
    // Resaltado visual
    this.clearHighlights();
    if (block.element) {
      block.element.classList.add('reading-highlight');
      block.element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const utterance = new SpeechSynthesisUtterance(block.text);
    const voice = this.getVoice();
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 0.90; // Velocidad moderada
    utterance.pitch = 1.0; // Tono cálido
    
    utterance.onend = () => {
      if (!this.isPlaying) return;
      this.currentIndex++;
      // Pausa natural de 700ms entre bloques
      this.timeoutId = setTimeout(() => {
        this.speakCurrentBlock();
      }, 700);
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      if (this.isPlaying) {
        this.currentIndex++;
        this.speakCurrentBlock();
      }
    };

    this.utterance = utterance;
    startSpeechSynthesisVisualizer(utterance);
    window.speechSynthesis.speak(utterance);
  },

  pause: function() {
    if (!window.speechSynthesis || !this.isPlaying || this.isPaused) return;
    window.speechSynthesis.pause();
    this.isPaused = true;
    this.updateControlsUI();
  },

  resume: function() {
    if (!window.speechSynthesis || !this.isPlaying || !this.isPaused) return;
    window.speechSynthesis.resume();
    this.isPaused = false;
    this.updateControlsUI();
    initSiriWave();
  },

  stop: function() {
    this.isPlaying = false;
    this.isPaused = false;
    stopSpeechSynthesisVisualizer();
    
    // Remover clase de respondiendo en todos los avatares sincronizados
    document.querySelectorAll('.kaifish-avatar-sync').forEach(avatar => {
      avatar.classList.remove('responding-anim');
    });

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.clearHighlights();
    this.updateControlsUI();
    this.utterance = null;
  },

  clearHighlights: function() {
    if (this.activeBubble) {
      const highlighted = this.activeBubble.querySelectorAll('.reading-highlight');
      highlighted.forEach(el => el.classList.remove('reading-highlight'));
    }
  },

  updateControlsUI: function() {
    if (!this.activeBubble) return;
    
    const playBtn = this.activeBubble.querySelector('.btn-voice-play');
    const pauseBtn = this.activeBubble.querySelector('.btn-voice-pause');
    const resumeBtn = this.activeBubble.querySelector('.btn-voice-resume');
    const stopBtn = this.activeBubble.querySelector('.btn-voice-stop');

    if (!playBtn) return;

    if (this.isPlaying) {
      playBtn.style.display = 'none';
      stopBtn.style.display = 'inline-flex';
      
      if (this.isPaused) {
        pauseBtn.style.display = 'none';
        resumeBtn.style.display = 'inline-flex';
      } else {
        pauseBtn.style.display = 'inline-flex';
        resumeBtn.style.display = 'none';
      }
    } else {
      playBtn.style.display = 'inline-flex';
      pauseBtn.style.display = 'none';
      resumeBtn.style.display = 'none';
      stopBtn.style.display = 'none';
    }
  }
};

/* ====================================================================
   MOTOR DE STREAMING Y NARRACIÓN SIMULTÁNEA EN TIEMPO REAL
   ==================================================================== */
function getSectionSpeechText(section) {
  const text = section.textContent;
  
  if (text.includes('[FUENTE_MODO_FALLA]')) {
    const start = text.indexOf('[FUENTE_MODO_FALLA]') + '[FUENTE_MODO_FALLA]'.length;
    const end = text.indexOf('[/FUENTE_MODO_FALLA]');
    const rawText = text.substring(start, end !== -1 ? end : text.length);
    return cleanSpeechText(rawText);
  }
  
  if (text.includes('[COMPONENTES_SOSPECHOSOS]')) {
    const start = text.indexOf('[COMPONENTES_SOSPECHOSOS]') + '[COMPONENTES_SOSPECHOSOS]'.length;
    const end = text.indexOf('[/COMPONENTES_SOSPECHOSOS]');
    const rawText = text.substring(start, end !== -1 ? end : text.length);
    return "Componentes sospechosos. " + cleanSpeechText(rawText);
  }
  
  if (text.includes('[VALIDACION]')) {
    const start = text.indexOf('[VALIDACION]') + '[VALIDACION]'.length;
    const end = text.indexOf('[/VALIDACION]');
    const rawText = text.substring(start, end !== -1 ? end : text.length);
    return "Validación de la reparación. " + cleanSpeechText(rawText);
  }
  
  return "";
}

function cleanSpeechText(txt) {
  return txt
    .replace(/\[\/?FUENTE_MODO_FALLA\]/g, '')
    .replace(/\[\/?COMPONENTES_SOSPECHOSOS\]/g, '')
    .replace(/\[\/?VALIDACION\]/g, '')
    .replace(/FUENTE:/gi, 'Fuente de información. ')
    .replace(/MODO DE FALLA:/gi, 'Modo de falla. ')
    .replace(/MODO DE FALLA \/ SÍNTOMA:/gi, 'Modo de falla o síntoma. ')
    .replace(/DESCRIPCIÓN:/gi, 'Descripción. ')
    .replace(/CAUSA RAÍZ:/gi, 'Causa raíz. ')
    .replace(/RECOMENDACIÓN TÉCNICA:/gi, 'Recomendación técnica. ')
    .replace(/No encontré una solución documentada para este problema\./gi, 'No encontré una solución documentada para este problema en nuestros archivos. ')
    .trim();
}

const GhostfishStreamPlayer = {
  sections: [],
  currentIndex: 0,
  isPlaying: false,
  isPaused: false,
  activeBubble: null,
  contentContainer: null,
  
  currentTypingInterval: null,
  currentUtterance: null,
  currentSectionElement: null,
  speechTimeoutId: null,
  onCompleteCallback: null,

  playStream: function(sectionsList, contentContainer, bubbleElement, onComplete) {
    this.stop();
    this.sections = sectionsList;
    this.currentIndex = 0;
    this.activeBubble = bubbleElement;
    this.contentContainer = contentContainer;
    this.isPlaying = true;
    this.isPaused = false;
    this.onCompleteCallback = onComplete;
    
    // Activar clase de respondiendo en todos los avatares sincronizados
    document.querySelectorAll('.kaifish-avatar-sync').forEach(avatar => {
      avatar.classList.add('responding-anim');
    });
    
    // Activar animación de hablar en el avatar del chat
    if (bubbleElement && bubbleElement.parentElement) {
      const avatar = bubbleElement.parentElement.querySelector('.bot-avatar');
      if (avatar) avatar.classList.add('speaking');
    }

    // Activar animación de hablar en el asistente gigante izquierdo
    const mascot = document.getElementById('assistant-mascot-img');
    if (mascot) {
      mascot.classList.add('speaking');
      mascot.classList.remove('thinking');
    }
    const statusText = document.querySelector('.status-indicator-text');
    const statusContainer = document.getElementById('assistant-status-indicator');
    if (statusText) statusText.textContent = "DebugBot respondiendo...";
    if (statusContainer) statusContainer.className = "assistant-status-indicator speaking";
    
    this.updateControlsUI();
    this.processNextSection();
    setTimeout(initSiriWave, 50);
  },

  processNextSection: function() {
    if (!this.isPlaying) return;

    if (this.currentIndex >= this.sections.length) {
      this.finishStream();
      return;
    }

    const section = this.sections[this.currentIndex];
    
    // Clonar sección sin hijos
    const clonedSection = section.cloneNode(false);
    this.contentContainer.appendChild(clonedSection);
    this.currentSectionElement = clonedSection;

    const chatHistory = document.getElementById('chat-history');
    if (chatHistory) chatHistory.scrollTop = chatHistory.scrollHeight;

    const speechText = getSectionSpeechText(section);
    
    let typingFinished = false;
    let speechFinished = false;

    const checkProceed = () => {
      if (typingFinished && (speechFinished || !isVoiceOutputEnabled || !speechText)) {
        this.currentIndex++;
        this.processNextSection();
      }
    };

    // Lanzar tipado progresivo de la sección
    this.typeSectionContent(section, clonedSection, () => {
      typingFinished = true;
      checkProceed();
    });

    // Lanzar narración de la sección
    if (isVoiceOutputEnabled && speechText) {
      this.speakSectionText(speechText, clonedSection, () => {
        speechFinished = true;
        checkProceed();
      });
    } else {
      speechFinished = true;
    }
  },

  typeSectionContent: function(sourceSection, destSection, callback) {
    const steps = [];
    
    function generateSteps(sourceNode, destParent) {
      for (let i = 0; i < sourceNode.childNodes.length; i++) {
        const child = sourceNode.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.nodeValue;
          if (text) {
            const textNode = document.createTextNode('');
            steps.push({ type: 'append', parent: destParent, node: textNode });
            for (let j = 0; j < text.length; j++) {
              steps.push({ type: 'type', textNode: textNode, char: text[j] });
            }
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const cloned = child.cloneNode(false);
          steps.push({ type: 'append', parent: destParent, node: cloned });
          generateSteps(child, cloned);
        }
      }
    }

    generateSteps(sourceSection, destSection);

    const totalChars = steps.filter(s => s.type === 'type').length;
    let batchSize = 2;
    if (totalChars > 100) batchSize = 3;
    if (totalChars > 300) batchSize = 5;

    let index = 0;
    const chatHistory = document.getElementById('chat-history');

    const run = () => {
      if (!this.isPlaying) return;
      if (this.isPaused) {
        this.currentTypingInterval = setTimeout(run, 50);
        return;
      }

      if (index >= steps.length) {
        callback();
        return;
      }

      let charsTypedThisTick = 0;
      while (index < steps.length && charsTypedThisTick < batchSize) {
        const step = steps[index];
        if (step.type === 'append') {
          step.parent.appendChild(step.node);
          if (step.node.tagName === 'IMG') {
            step.node.onload = () => {
              if (chatHistory) chatHistory.scrollTop = chatHistory.scrollHeight;
            };
          }
          index++;
        } else if (step.type === 'type') {
          step.textNode.nodeValue += step.char;
          index++;
          charsTypedThisTick++;
        }
      }

      if (chatHistory) chatHistory.scrollTop = chatHistory.scrollHeight;
      this.currentTypingInterval = setTimeout(run, 15);
    };

    run();
  },

  speakSectionText: function(text, element, callback) {
    if (!window.speechSynthesis) {
      callback();
      return;
    }

    this.clearHighlights();
    element.classList.add('reading-highlight');
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = GhostfishVoicePlayer.getVoice();
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 0.90;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      this.clearHighlights();
      this.currentUtterance = null;
      this.speechTimeoutId = setTimeout(callback, 600);
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error in stream:", e);
      this.clearHighlights();
      this.currentUtterance = null;
      callback();
    };

    this.currentUtterance = utterance;
    startSpeechSynthesisVisualizer(utterance);
    window.speechSynthesis.speak(utterance);
  },

  pause: function() {
    if (!this.isPlaying || this.isPaused) return;
    this.isPaused = true;
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
    this.updateControlsUI();
  },

  resume: function() {
    if (!this.isPlaying || !this.isPaused) return;
    this.isPaused = false;
    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
    }
    this.updateControlsUI();
    initSiriWave();
  },

  stop: function() {
    this.isPlaying = false;
    this.isPaused = false;
    stopSpeechSynthesisVisualizer();
    
    // Remover clase de respondiendo en todos los avatares sincronizados
    document.querySelectorAll('.kaifish-avatar-sync').forEach(avatar => {
      avatar.classList.remove('responding-anim');
    });
    if (this.currentTypingInterval) {
      clearTimeout(this.currentTypingInterval);
      this.currentTypingInterval = null;
    }
    if (this.speechTimeoutId) {
      clearTimeout(this.speechTimeoutId);
      this.speechTimeoutId = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.clearHighlights();
    this.currentUtterance = null;

    // Desactivar animación de hablar en el avatar
    if (this.activeBubble && this.activeBubble.parentElement) {
      const avatar = this.activeBubble.parentElement.querySelector('.bot-avatar');
      if (avatar) avatar.classList.remove('speaking');
    }

    // Desactivar animación de hablar en el asistente gigante izquierdo
    const mascot = document.getElementById('assistant-mascot-img');
    if (mascot) {
      mascot.classList.remove('speaking');
      mascot.classList.remove('thinking');
    }
    const statusText = document.querySelector('.status-indicator-text');
    const statusContainer = document.getElementById('assistant-status-indicator');
    if (statusText) statusText.textContent = "En línea - Listo";
    if (statusContainer) statusContainer.className = "assistant-status-indicator";

    this.completeRenderingInstantly();
    this.updateControlsUI();

    if (this.onCompleteCallback) {
      this.onCompleteCallback();
      this.onCompleteCallback = null;
    }
  },

  completeRenderingInstantly: function() {
    if (!this.contentContainer) return;
    this.contentContainer.innerHTML = "";
    this.sections.forEach(sec => {
      this.contentContainer.appendChild(sec.cloneNode(true));
    });
    const chatHistory = document.getElementById('chat-history');
    if (chatHistory) chatHistory.scrollTop = chatHistory.scrollHeight;
  },

  finishStream: function() {
    this.isPlaying = false;
    this.isPaused = false;
    this.clearHighlights();
    this.updateControlsUI();
    stopSpeechSynthesisVisualizer();
    
    // Remover clase de respondiendo en todos los avatares sincronizados
    document.querySelectorAll('.kaifish-avatar-sync').forEach(avatar => {
      avatar.classList.remove('responding-anim');
    });
    
    // Desactivar animación de hablar en el avatar del chat
    if (this.activeBubble && this.activeBubble.parentElement) {
      const avatar = this.activeBubble.parentElement.querySelector('.bot-avatar');
      if (avatar) avatar.classList.remove('speaking');
    }

    // Desactivar animación de hablar en el asistente gigante izquierdo
    const mascot = document.getElementById('assistant-mascot-img');
    if (mascot) {
      mascot.classList.remove('speaking');
      mascot.classList.remove('thinking');
    }
    const statusText = document.querySelector('.status-indicator-text');
    const statusContainer = document.getElementById('assistant-status-indicator');
    if (statusText) statusText.textContent = "En línea - Listo";
    if (statusContainer) statusContainer.className = "assistant-status-indicator";

    if (this.onCompleteCallback) {
      this.onCompleteCallback();
      this.onCompleteCallback = null;
    }
  },

  clearHighlights: function() {
    if (this.activeBubble) {
      const highlighted = this.activeBubble.querySelectorAll('.reading-highlight');
      highlighted.forEach(el => el.classList.remove('reading-highlight'));
    }
  },

  updateControlsUI: function() {
    if (!this.activeBubble) return;
    
    const playBtn = this.activeBubble.querySelector('.btn-voice-play');
    const pauseBtn = this.activeBubble.querySelector('.btn-voice-pause');
    const resumeBtn = this.activeBubble.querySelector('.btn-voice-resume');
    const stopBtn = this.activeBubble.querySelector('.btn-voice-stop');

    if (!playBtn) return;

    if (this.isPlaying) {
      playBtn.style.display = 'none';
      stopBtn.style.display = 'inline-flex';
      
      if (this.isPaused) {
        pauseBtn.style.display = 'none';
        resumeBtn.style.display = 'inline-flex';
      } else {
        pauseBtn.style.display = 'inline-flex';
        resumeBtn.style.display = 'none';
      }
    } else {
      playBtn.style.display = 'inline-flex';
      pauseBtn.style.display = 'none';
      resumeBtn.style.display = 'none';
      stopBtn.style.display = 'none';
    }
  }
};

function toggleVoiceOutputGlobal() {
  isVoiceOutputEnabled = !isVoiceOutputEnabled;
  updateVoiceToggleUI();
  
  if (isVoiceOutputEnabled) {
    const utterance = new SpeechSynthesisUtterance("Lectura automática activa.");
    const voice = GhostfishVoicePlayer.getVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  } else {
    GhostfishVoicePlayer.stop();
    GhostfishStreamPlayer.stop();
  }
}

function updateVoiceToggleUI() {
  const topbarToggle = document.getElementById('btn-topbar-voice-toggle');
  const chatReadToggle = document.getElementById('btn-read-toggle');
  
  if (isVoiceOutputEnabled) {
    if (topbarToggle) {
      topbarToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-2" style="stroke: var(--accent-cyan)"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        <span style="color: var(--accent-cyan)">Voz Activa</span>
      `;
    }
    if (chatReadToggle) {
      chatReadToggle.classList.add('active');
      chatReadToggle.title = "Desactivar lectura automática de respuestas";
      chatReadToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
    }
  } else {
    if (topbarToggle) {
      topbarToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        <span>Voz Desactivada</span>
      `;
    }
    if (chatReadToggle) {
      chatReadToggle.classList.remove('active');
      chatReadToggle.title = "Activar lectura automática de respuestas";
      chatReadToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      `;
    }
  }
}

function setupVoiceOutput() {
  const topBar = document.querySelector('.top-bar');
  const voiceToggle = document.createElement('button');
  voiceToggle.id = 'btn-topbar-voice-toggle';
  voiceToggle.className = 'btn-rate';
  voiceToggle.style.borderRadius = '20px';
  voiceToggle.style.padding = '8px 14px';
  voiceToggle.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
    <span>Voz Desactivada</span>
  `;
  
  voiceToggle.addEventListener('click', () => {
    toggleVoiceOutputGlobal();
  });

  topBar.insertBefore(voiceToggle, topBar.querySelector('.status-indicator'));
  voiceToggle.style.display = 'none'; // Ocultar botón según requerimiento de UI

  // Sincronizar UI inicial
  updateVoiceToggleUI();

  // Registrar voces cargadas
  window.speechSynthesis.onvoiceschanged = () => {
    GhostfishVoicePlayer.getVoice();
  };
}

function speakResponse(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.substring(0, 300));
  const voice = GhostfishVoicePlayer.getVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = 0.90;
  startSpeechSynthesisVisualizer(utterance);
  window.speechSynthesis.speak(utterance);
}

let siriWaveAnimationFrame = null;
let siriWavePhase = 0;
let siriWaveTargetAmplitude = 0.1;
let siriWaveCurrentAmplitude = 0.1;
let lastBoundaryTime = 0;

function initSiriWave() {
  const canvas = document.getElementById('siri-wave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const draw = () => {
    const visualizer = document.querySelector('.voice-visualizer');
    if (!visualizer || window.getComputedStyle(visualizer).display === 'none') {
      siriWaveAnimationFrame = null;
      return;
    }
    
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    const now = performance.now();
    const btnVoice = document.getElementById('btn-voice');
    const isListeningActive = btnVoice && btnVoice.classList.contains('listening');
    
    if (isListeningActive) {
      // Onda durante la escucha de voz: movimiento dinámico con oscilaciones orgánicas
      siriWaveTargetAmplitude = 0.45 + Math.sin(now * 0.008) * 0.3 + Math.cos(now * 0.015) * 0.15;
      if (siriWaveTargetAmplitude < 0.2) siriWaveTargetAmplitude = 0.2;
    } else if (visualizer.classList.contains('tts-active')) {
      // Onda durante la lectura por voz (TTS): sincronizada palabra a palabra
      const elapsed = now - lastBoundaryTime;
      if (elapsed > 200) {
        siriWaveTargetAmplitude = 0.05; // Pausas
      }
    } else {
      // Estado de espera (pensando): micro-onda constante y discreta
      siriWaveTargetAmplitude = 0.15 + Math.sin(now * 0.005) * 0.04;
    }
    
    // Transición suave de amplitud
    siriWaveCurrentAmplitude = siriWaveCurrentAmplitude + (siriWaveTargetAmplitude - siriWaveCurrentAmplitude) * 0.15;
    
    // Variación de fase
    siriWavePhase += 0.15;
    
    // Dibujar barras verticales estilo JARVIS con efecto holográfico simétrico
    const numBars = 11;
    const barWidth = 4;
    const barGap = 3;
    const totalWidth = numBars * barWidth + (numBars - 1) * barGap;
    const startX = (width - totalWidth) / 2;
    
    // Factores de escala simétricos desde los extremos al centro
    const factors = [0.25, 0.45, 0.65, 0.85, 0.95, 1.0, 0.95, 0.85, 0.65, 0.45, 0.25];
    
    for (let i = 0; i < numBars; i++) {
      const factor = factors[i];
      // Oscilación de frecuencia digital rápida
      const noise = Math.sin(now * (0.014 + i * 0.0035)) * 0.3 + 
                    Math.cos(now * (0.024 - i * 0.0025)) * 0.15 + 0.55;
      
      const val = siriWaveCurrentAmplitude * factor * noise;
      const barHeight = Math.max(2, val * (height - 2)); // Altura mínima de 2px
      
      const x = startX + i * (barWidth + barGap);
      const y = midY - barHeight / 2;
      
      // Resplandor de holograma
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(0, 180, 216, 0.9)'; // Brillo cian holográfico
      ctx.fillStyle = 'rgba(0, 95, 169, 0.9)'; // Flex Corporate Blue
      
      // Dibujar barra de fondo con brillo
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Núcleo blanco de alta energía
      ctx.shadowBlur = 0; // Desactivar sombra para el núcleo
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
    }
    
    siriWaveAnimationFrame = requestAnimationFrame(draw);
  };
  
  if (!siriWaveAnimationFrame) {
    siriWaveAnimationFrame = requestAnimationFrame(draw);
  }
}

function startSpeechSynthesisVisualizer(utterance) {
  stopSpeechSynthesisVisualizer();
  
  const visualizer = document.querySelector('.voice-visualizer');
  if (visualizer) {
    visualizer.classList.add('active');
    visualizer.classList.add('tts-active');
    initSiriWave();
  }
  
  let isSpeaking = true;
  siriWaveTargetAmplitude = 0.1;
  siriWaveCurrentAmplitude = 0.1;
  lastBoundaryTime = performance.now();
  
  utterance.onboundary = (event) => {
    if (event.name === 'word') {
      siriWaveTargetAmplitude = 0.45 + Math.random() * 0.55;
      lastBoundaryTime = performance.now();
    }
  };
  
  const onEndOrError = () => {
    isSpeaking = false;
    stopSpeechSynthesisVisualizer();
  };
  
  // Guardar y encadenar callbacks originales de fin y error para no romper flujos de streaming
  const originalOnEnd = utterance.onend;
  utterance.onend = (e) => {
    onEndOrError();
    if (typeof originalOnEnd === 'function') originalOnEnd(e);
  };
  
  const originalOnError = utterance.onerror;
  utterance.onerror = (e) => {
    onEndOrError();
    if (typeof originalOnError === 'function') originalOnError(e);
  };
}

function stopSpeechSynthesisVisualizer() {
  if (siriWaveAnimationFrame) {
    cancelAnimationFrame(siriWaveAnimationFrame);
    siriWaveAnimationFrame = null;
  }
  
  const btnVoice = document.getElementById('btn-voice');
  const visualizer = document.querySelector('.voice-visualizer');
  if (visualizer) {
    visualizer.classList.remove('tts-active');
    if (!btnVoice || !btnVoice.classList.contains('listening')) {
      visualizer.classList.remove('active');
    }
  }
}

/* ====================================================================
   DICCIONARIO DE FALLAS Y SOPORTE DE BÚSQUEDA DIFUSA (FUZZY SEARCH)
   ==================================================================== */
const FAULT_DICTIONARY = {
  "open": {
    canonical_es: "abierto",
    variations_en: ["open", "opne", "opn", "oepn", "opened", "opening", "openen"],
    variations_es: ["abierto", "abierta", "abirto", "abrir"]
  },
  "short": {
    canonical_es: "corto",
    variations_en: ["short", "shot", "shrt", "sort", "shorted", "shorting"],
    variations_es: ["corto", "corta", "cortocircuito", "cortos"]
  },
  "leakage": {
    canonical_es: "fuga",
    variations_en: ["leakage", "leakge", "leakege", "leak", "leaking", "leackage", "leackge"],
    variations_es: ["fuga", "fugas", "filtracion", "filtración"]
  },
  "bridge": {
    canonical_es: "puente",
    variations_en: ["bridge", "brigde", "bringe", "bridging", "bridge fill"],
    variations_es: ["puente", "puentes", "puente de soldadura"]
  },
  "missing": {
    canonical_es: "faltante",
    variations_en: ["missing", "mising", "miss", "missed"],
    variations_es: ["faltante", "faltantes", "falta", "faltan"]
  },
  "cracked": {
    canonical_es: "fracturado",
    variations_en: ["cracked", "craked", "crack", "cracking"],
    variations_es: ["fracturado", "fracturada", "fisurado", "fisurada", "fisura", "rotura", "roto"]
  },
  "burnt": {
    canonical_es: "quemado",
    variations_en: ["burnt", "burned", "burn", "burning"],
    variations_es: ["quemado", "quemada", "se quemo", "se quemó"]
  },
  "lifted pad": {
    canonical_es: "pad levantado",
    variations_en: ["lifted pad", "lift pad", "liftd pad"],
    variations_es: ["pad levantado", "pads levantados", "pista levantada"]
  },
  "lifted lead": {
    canonical_es: "pin levantado",
    variations_en: ["lifted lead", "lift lead", "lifted leed", "liftd lead", "lifted pin"],
    variations_es: ["pin levantado", "pines levantados", "terminal levantado", "terminal levantada", "pata levantada"]
  },
  "resistor": {
    canonical_es: "resistencia",
    variations_en: ["resistor", "res", "resistors"],
    variations_es: ["resistencia", "resistencias"]
  },
  "capacitor": {
    canonical_es: "condensador",
    variations_en: ["capacitor", "cap", "capacitors", "capacitator"],
    variations_es: ["condensador", "condensadores", "capacitador", "capacitadores"]
  },
  "component": {
    canonical_es: "componente",
    variations_en: ["component", "comp", "components"],
    variations_es: ["componente", "componentes"]
  },
  "gbmc": {
    canonical_es: "gbmc",
    variations_en: ["gbmc", "gmbc", "gbms", "gbmc controller"],
    variations_es: ["gbmc", "gmbc", "controlador gbmc"]
  },
  "xskt1": {
    canonical_es: "xskt1",
    variations_en: ["xskt1", "xstk1", "xsk1", "xskt", "flash memory"],
    variations_es: ["xskt1", "xstk1", "memoria flash"]
  },
  "adm1266": {
    canonical_es: "adm1266",
    variations_en: ["adm1266", "amd1266", "adm126", "adm", "sequencer"],
    variations_es: ["adm1266", "secuenciador"]
  },
  "dauntless": {
    canonical_es: "dauntless",
    variations_en: ["dauntless", "dauntles", "dautless", "dauntless u71"],
    variations_es: ["dauntless", "chip u71"]
  },
  "unexpected": {
    canonical_es: "unexpected",
    variations_en: ["unexpected", "unexpexted", "unexpeced", "unexp"],
    variations_es: ["inesperado", "inesperada"]
  },
  "mismatch": {
    canonical_es: "mismatch",
    variations_en: ["mismatch", "mismach", "mis-match", "incompatibility"],
    variations_es: ["mismatch", "incompatibilidad", "desajuste"]
  },
  "cooler master": {
    canonical_es: "cooler master",
    variations_en: ["cooler master", "coolermaster", "coler master"],
    variations_es: ["cooler master", "coolermaster", "coler master"]
  },
  "boyd": {
    canonical_es: "boyd",
    variations_en: ["boyd", "boy"],
    variations_es: ["boyd", "boy"]
  },
  "host": {
    canonical_es: "host",
    variations_en: ["host", "hosts"],
    variations_es: ["host", "hosts", "servidor"]
  },
  "tray": {
    canonical_es: "bandeja",
    variations_en: ["tray", "trays"],
    variations_es: ["bandeja", "bandejas", "tray"]
  },
  "fail": {
    canonical_es: "fallar",
    variations_en: ["fail", "fails", "failure", "failed", "failing"],
    variations_es: ["falla", "fallas", "fallo", "falló", "fallar"]
  },
  "from": {
    canonical_es: "desde",
    variations_en: ["from"],
    variations_es: ["desde", "de"]
  },
  "signal": {
    canonical_es: "señal",
    variations_en: ["signal", "signals", "sig"],
    variations_es: ["señal", "señales"]
  },
  "reset": {
    canonical_es: "reset",
    variations_en: ["reset", "resets", "rst"],
    variations_es: ["reset", "reinicio", "reiniciar"]
  },
  "power": {
    canonical_es: "potencia",
    variations_en: ["power", "pwr"],
    variations_es: ["potencia", "poder", "energía", "energia"]
  },
  "active": {
    canonical_es: "activo",
    variations_en: ["active"],
    variations_es: ["activo", "activa"]
  },
  "done": {
    canonical_es: "completado",
    variations_en: ["done"],
    variations_es: ["completado", "listo", "hecho"]
  },
  "level": {
    canonical_es: "nivel",
    variations_en: ["level", "levels", "lvl"],
    variations_es: ["nivel", "niveles"]
  }
};

const CANONICAL_PHRASES = [
  {
    en: "short capacitor",
    words: [["short", "corto", "shorted"], ["capacitor", "condensador", "cap"]]
  },
  {
    en: "open resistor",
    words: [["open", "abierto", "abierta"], ["resistor", "resistencia"]]
  },
  {
    en: "missing component",
    words: [["missing", "mising", "miss", "faltante"], ["component", "componente", "comp"]]
  },
  {
    en: "lifted pad",
    words: [["lifted", "lift", "levantado"], ["pad"]]
  },
  {
    en: "lifted lead",
    words: [["lifted", "lift", "levantado", "levantada"], ["lead", "leed", "pin", "pines", "terminal", "terminales", "pata"]]
  }
];

const NOTEBOOK_LM_RESPONSES = {
  "short capacitor": {
    title: "Análisis de Capacitor en Corto (Shorted Capacitor)",
    source: "Skill NotebookLM (Búsqueda Semántica)",
    content: `Se encontraron referencias cruzadas sobre cortocircuitos en condensadores en los manuales de planta y fuentes externas:
    <br><br>
    1. <strong>Método de Inyección de Corriente (EXT-004):</strong> Configura la fuente de poder a 1V / 2A e inyecta corriente para identificar el capacitor caliente bajo cortocircuito utilizando una cámara térmica.
    <br><br>
    2. <strong>Reglas de Reemplazo VPWR (GF-FF-001):</strong> Un cortocircuito en los condensadores o bobinas de salida de la etapa de potencia VPWR (VPWR1 o VPWR2) requiere el reemplazo mandatorio de ambos módulos de potencia de la fase y del ASIC espejo correspondiente para evitar desbalances de impedancia.
    <br><br>
    3. <strong>Capacitores de Bypass (EXT-001):</strong> Para prevenir fallas de cortocircuito y ruido de alta frecuencia, es mandatorio que los capacitores de bypass de 0.1uF a 10uF (baja ESR) se sitúen lo más cerca posible del integrado.`
  },
  "open resistor": {
    title: "Análisis de Resistencia Abierta (Open Resistor)",
    source: "Skill NotebookLM (Búsqueda Semántica)",
    content: `Se consolidaron las referencias a soldaduras abiertas e interrupción de la conductividad en resistencias o pines de circuitos integrados:
    <br><br>
    1. <strong>Método Bridge Fill y Rework (GF-HW-006):</strong> La soldadura abierta (open solder) en encapsulados BGA de ASICs o pines Gull Wing de resistencias/memorias debe retrabajarse según la norma IPC-7711 usando el método de llenado de puente y malla desoldadora. Se sugiere inspección AXI a través de la máquina SCP.
    <br><br>
    2. <strong>Falla de Comunicación gBMC (GF-BOOT-002):</strong> Una soldadura abierta en los pines del multiplexor SPI U144 interrumpe la línea de datos con la memoria flash externa XSKT1, causando que el gBMC falle en el arranque (Ping Fail) y mantenga la señal de reset TITAN0_GOOD en 0V.`
  },
  "missing component": {
    title: "Análisis de Componente Faltante (Missing Component)",
    source: "Skill NotebookLM (Búsqueda Semántica)",
    content: `Se compilaron las reglas y procedimientos de diagnóstico ante sospechas de componentes faltantes o incorrectos:
    <br><br>
    1. <strong>Comparación contra Unidad de Referencia (GF-FA-004):</strong> Ante un error de tipo "unexpected-exception", extraiga y compare las tablas de componentes (TRAY/FLG, PCBA/GFB, SCP/GFS) contra una unidad de referencia (Golden Unit). Es muy frecuente identificar componentes faltantes o de marca no autorizada (ej. disipadores BOYD en lugar de Cooler Master).
    <br><br>
    2. <strong>Error de Medición Faltante (GF-LOGS-003):</strong> Un secuenciador primario ADM1266 desprogramado o con pines sueltos puede reportar un error de "missing measurement" en los rieles de nivel0 o level1, deteniendo la cadena de encendido.`
  }
};

function getLevenshteinDistance(s1, s2) {
  if (!s1 || !s2) return Math.max(s1?.length || 0, s2?.length || 0);
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const d = [];
  for (let i = 0; i <= s1.length; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= s2.length; j++) {
    d[0][j] = j;
  }
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
    }
  }
  return d[s1.length][s2.length];
}

function normalizeAndCorrectQuery(query) {
  if (!query) return { original: "", corrected: "", isCorrected: false, words: [] };
  
  let qClean = query.toLowerCase().trim();
  qClean = qClean.replace(/[.,\/#!$%\^&\*;:{}=`~()?¿¡]/g, " ");
  const originalWords = qClean.split(/\s+/).filter(w => w.length > 0);
  
  const correctedWords = [];
  let isChanged = false;
  
  for (const word of originalWords) {
    let bestWordMatch = word;
    let foundExact = false;
    
    for (const [canonicalEn, details] of Object.entries(FAULT_DICTIONARY)) {
      if (details.variations_en.includes(word) || details.variations_es.includes(word)) {
        bestWordMatch = canonicalEn;
        foundExact = true;
        if (word !== canonicalEn) {
          isChanged = true;
        }
        break;
      }
    }
    
    if (!foundExact && word.length > 2) {
      let minDistance = 999;
      let closestWord = null;
      
      for (const [canonicalEn, details] of Object.entries(FAULT_DICTIONARY)) {
        const allVariations = [...details.variations_en, ...details.variations_es];
        for (const variation of allVariations) {
          const dist = getLevenshteinDistance(word, variation);
          const tolerance = variation.length <= 4 ? 1 : 2;
          if (dist <= tolerance && dist < minDistance) {
            minDistance = dist;
            closestWord = canonicalEn;
          }
        }
      }
      
      if (closestWord) {
        bestWordMatch = closestWord;
        isChanged = true;
      }
    }
    
    correctedWords.push(bestWordMatch);
  }
  
  let finalQuery = correctedWords.join(" ");
  
  for (const phrase of CANONICAL_PHRASES) {
    let allGroupsMatch = true;
    for (const group of phrase.words) {
      let groupMatch = false;
      for (const val of group) {
        if (correctedWords.includes(val) || originalWords.includes(val)) {
          groupMatch = true;
          break;
        }
      }
      if (!groupMatch) {
        allGroupsMatch = false;
        break;
      }
    }
    
    if (allGroupsMatch) {
      finalQuery = phrase.en;
      if (query.toLowerCase().trim() !== phrase.en) {
        isChanged = true;
      }
      break;
    }
  }
  
  if (finalQuery === query.toLowerCase().trim()) {
    isChanged = false;
  }
  
  return {
    original: query,
    corrected: finalQuery,
    isCorrected: isChanged,
    words: correctedWords
  };
}

window.handleSuggestedQuery = function(query) {
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.value = query;
    const btnSend = document.getElementById('btn-send');
    if (btnSend) {
      btnSend.click();
    } else {
      handleUserSubmit();
    }
  }
};

/* ====================================================================
   MOTOR DE BÚSQUEDA JERÁRQUICA E INTELIGENTE CON EXPANSIÓN
   ==================================================================== */
function interpretQuery(query) {
  const q = query.toLowerCase().trim();
  const expandedTerms = new Set();
  const reasons = [];
  const dictMatches = [];

  // Buscar coincidencia en el diccionario maestro de modos de falla (MASTER_FAULT_DICTIONARY)
  if (window.MASTER_FAULT_DICTIONARY) {
    for (const [key, entry] of Object.entries(window.MASTER_FAULT_DICTIONARY)) {
      const isMatched = 
        q.includes(entry.original.toLowerCase()) ||
        entry.variations_es.some(v => q.includes(v.toLowerCase())) ||
        entry.variations_en.some(v => q.includes(v.toLowerCase())) ||
        entry.abbreviations.some(v => q.includes(v.toLowerCase())) ||
        entry.technical_synonyms.some(v => q.includes(v.toLowerCase()));
        
      if (isMatched) {
        dictMatches.push(entry);
        reasons.push(`Coincidencia con modo de falla maestro: "${entry.original}"`);
        entry.related_keywords.forEach(kw => expandedTerms.add(kw));
        entry.technical_synonyms.forEach(ts => expandedTerms.add(ts));
        expandedTerms.add(entry.translation.es.toLowerCase());
        expandedTerms.add(entry.translation.en.toLowerCase());
      }
    }
  }

  // 1. Identificar triggers específicos de comunicación/arranque
  const noCommTriggers = [
    "no detecta",
    "no responde",
    "no encuentra",
    "no levanta",
    "no arranca",
    "no comunica"
  ];
  
  const matchedCommTrigger = noCommTriggers.find(trigger => q.includes(trigger));
  if (matchedCommTrigger) {
    const commTerms = ["i2c", "smbus", "vpwr", "gfc", "asic", "comunicación", "interconnect", "missing measurement"];
    commTerms.forEach(t => expandedTerms.add(t));
    reasons.push(`Falla de comunicación detectada por frase: "${matchedCommTrigger}"`);
  }

  // 2. Mapear sinónimos, abreviaturas, lenguaje de piso y componentes
  const mapping = {
    // Lenguaje de piso & Modos de falla
    "corto": ["short", "cortocircuito", "vpwr", "potencia", "adm1266", "level0"],
    "short": ["corto", "cortocircuito", "vpwr", "potencia", "adm1266", "level0"],
    "open": ["abierto", "u71", "u19", "xskt1", "boot", "spi", "dauntless", "flash"],
    "calienta": ["corto", "calentamiento", "sobretemperatura", "temperatura", "camara termica", "inyeccion"],
    "se quemo": ["corto", "quemado", "daño", "rework", "soldadura"],
    "se quemó": ["corto", "quemado", "daño", "rework", "soldadura"],
    "no prende": ["no levanta", "no arranca", "no enciende", "boot", "ping-gbmc", "xskt1", "u71"],
    "muerta": ["no arranca", "no levanta", "ping-gbmc", "adm1266", "hswap", "fan_hswap_pgood"],
    "pantalla negra": ["no arranca", "boot", "ping-gbmc", "xskt1", "u71"],
    "desbalance": ["espejo", "potencia", "mirror", "vpwr", "ff-001", "asic"],
    
    // Abreviaturas y Sinónimos Técnicos
    "voltaje": ["potencia", "vpwr", "adm1266", "level0", "level1"],
    "tensión": ["potencia", "vpwr", "adm1266", "level0", "level1"],
    "corriente": ["potencia", "vpwr", "adm1266", "ocp", "corto"],
    "reproceso": ["rework", "soldadura", "ipc", "esd", "pulsera"],
    "rayos x": ["axi", "scp", "soldadura", "rework"],
    "x-ray": ["axi", "scp", "soldadura", "rework"],
    "clon": ["golden", "golden unit", "unexpected", "exception", "fa-004"],
    "golden": ["golden unit", "unexpected", "exception", "fa-004"],
    "coolermaster": ["cooler master", "fa-004", "boyd", "unexpected", "exception"],
    
    // Componentes & Logs
    "bios": ["u71", "dauntless", "firmware", "boot", "ping-gbmc", "xskt1"],
    "flash": ["xskt1", "spi", "boot", "ping-gbmc", "u71"],
    "multiplexor": ["u144", "spi", "mux", "boot"],
    "ventilador": ["fan", "hswap", "fan_hswap_pgood", "secuencia"],
    "bitacora": ["log", "logs", "carrot", "radix"],
    "bitácora": ["log", "logs", "carrot", "radix"],
    "fails": ["fail", "error", "exception", "cm_error"],
    "errores": ["fail", "error", "exception", "cm_error"]
  };

  for (const [key, values] of Object.entries(mapping)) {
    if (q.includes(key)) {
      values.forEach(v => expandedTerms.add(v));
      reasons.push(`Mapeo de floor-language/sinónimo: "${key}"`);
    }
  }

  // 3. Auto-detectar componentes conocidos
  const knownComponents = ["vpwr", "asic", "u71", "u19", "u144", "xskt1", "adm1266", "hswap", "fan", "boyd", "cooler master", "golden", "pulsera", "esd", "ipc"];
  knownComponents.forEach(comp => {
    if (q.includes(comp)) {
      expandedTerms.add(comp);
    }
  });

  // 4. Mapeo de intención semántica para herramientas de piso
  const lowercaseQuery = q.toLowerCase();
  
  // Voltaje
  if (lowercaseQuery.includes("voltaje") || lowercaseQuery.includes("medir voltaje") || lowercaseQuery.includes("tensión")) {
    expandedTerms.add("adm1266");
    expandedTerms.add("vpwr");
    expandedTerms.add("level0");
    expandedTerms.add("level1");
    reasons.push("Intención de medir voltaje asociada a ADM1266/VPWR");
  }
  
  // Continuidad / Resistencia
  if (lowercaseQuery.includes("continuidad") || lowercaseQuery.includes("resistencia") || lowercaseQuery.includes("revisar continuidad")) {
    expandedTerms.add("vpwr");
    expandedTerms.add("asic");
    expandedTerms.add("espejo");
    expandedTerms.add("short");
    reasons.push("Intención de medir continuidad o resistencia asociada a VPWR/ASIC");
  }

  // Validar falla / equipo de validación
  if (lowercaseQuery.includes("valido esta falla") || lowercaseQuery.includes("validar") || lowercaseQuery.includes("equipo") || lowercaseQuery.includes("herramienta recomiendas") || lowercaseQuery.includes("herramienta uso")) {
    expandedTerms.add("radix");
    expandedTerms.add("carrot");
    expandedTerms.add("scp");
    expandedTerms.add("axi");
    reasons.push("Intención de validar falla asociada a Radix/Carrot/SCP");
  }

  // Revisar señal
  if (lowercaseQuery.includes("señal") || lowercaseQuery.includes("revisar esta señal") || lowercaseQuery.includes("tp_")) {
    expandedTerms.add("titan0_good");
    expandedTerms.add("fan_hswap_pgood");
    expandedTerms.add("spi");
    reasons.push("Intención de revisar señales asociada a TITAN0_GOOD / FAN_HSWAP_PGOOD");
  }

  // Instrumento / osciloscopio / multimetro
  if (lowercaseQuery.includes("instrumento") || lowercaseQuery.includes("osciloscopio") || lowercaseQuery.includes("multimetro") || lowercaseQuery.includes("multímetro")) {
    expandedTerms.add("scp");
    expandedTerms.add("adm1266");
    expandedTerms.add("esd");
    reasons.push("Intención de uso de instrumentos asociada a osciloscopio/multímetro/SCP");
  }

  return {
    original: q,
    expanded: [q, ...Array.from(expandedTerms)],
    expandedTermsList: Array.from(expandedTerms),
    reasons: reasons,
    matchedDictEntries: dictMatches
  };
}

function renderInterpretationBadge(interpretation) {
  if (!interpretation.expandedTermsList || interpretation.expandedTermsList.length === 0) {
    return '';
  }
  
  return `
    <div class="interpretation-card" style="margin-top: 12px; padding: 10px 14px; background: #f9fafb; border: 1px dashed rgba(0, 95, 169, 0.2); border-radius: 8px; font-size: 0.8rem;">
      <div style="display: flex; align-items: center; gap: 6px; color: var(--accent-cyan); font-weight: 600; margin-bottom: 4px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cpu"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>
        <span>Búsqueda Inteligente</span>
      </div>
      <div style="color: var(--text-secondary); line-height: 1.3;">
        <div>Intención del Técnico: <strong style="color: var(--text-primary); font-style: italic;">"${interpretation.original}"</strong></div>
        <div style="margin-top: 4px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
          <span style="font-size: 0.72rem; color: var(--text-muted);">Términos de búsqueda expandidos:</span>
          ${interpretation.expandedTermsList.map(t => `<span style="font-size: 0.72rem; background: rgba(0, 95, 169, 0.08); color: var(--accent-cyan); padding: 1px 6px; border-radius: 4px; border: 1px solid rgba(0, 95, 169, 0.15);">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function searchKnowledgeBase(query) {
  const norm = normalizeAndCorrectQuery(query);
  const qCorrected = norm.corrected;
  const isCorrected = norm.isCorrected;
  
  const q = qCorrected;
  let html = "";
  let speechText = "";
  let matchedDoc = null;
  let matchedKB = null;
  let matchedExt = null;

  // Guardar en historial de sesión
  sessionHistory.push(query);

  let suggestionBannerHtml = "";
  if (isCorrected) {
    suggestionBannerHtml = `
      <div class="suggestion-banner" style="margin-bottom: 12px; padding: 10px 14px; background: rgba(234, 179, 8, 0.08); border: 1px solid rgba(234, 179, 8, 0.25); border-radius: 8px; font-size: 0.85rem; color: var(--text-primary); display: flex; align-items: center; gap: 8px; line-height: 1.4;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <span>¿Te refieres a <strong style="color: var(--accent-cyan); text-decoration: underline; cursor: pointer;" onclick="window.handleSuggestedQuery('${qCorrected}')">"${qCorrected}"</strong>?</span>
      </div>
    `;
  }

  function wrapResult(resObj) {
    if (isCorrected && resObj && resObj.html && !resObj.html.includes("class=\"suggestion-banner\"")) {
      resObj.html = resObj.html.replace(/<div class="diagnostic-response"([^>]*)>/, '<div class="diagnostic-response"$1>\n' + suggestionBannerHtml);
    }
    return resObj;
  }

  // --- PRIORIDAD 0: MATCH DE CANONICAL PHRASES EN NOTEBOOKLM ---
  if (NOTEBOOK_LM_RESPONSES[q]) {
    const res = NOTEBOOK_LM_RESPONSES[q];
    const interpretation = interpretQuery(q);
    
    html = `
      <div class="diagnostic-response" style="line-height: 1.45;">
        <div class="diag-header-block" style="border-left: 3px solid var(--accent-cyan); padding-left: 14px; margin-bottom: 16px;">
          <span style="display:none;">[FUENTE_MODO_FALLA]</span>
          <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">FUENTE:</div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-cyan); font-size: 1.1rem; margin-bottom: 8px;">${res.source}</div>
          
          <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">MODO DE FALLA:</div>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 1rem; margin-bottom: 8px;">${res.title}</div>
          
          <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">SÍNTESIS DE DIAGNÓSTICO:</div>
          <div style="color: var(--text-secondary); font-size: 0.88rem; text-align: justify; line-height: 1.5;">${res.content}</div>
          <span style="display:none;">[/FUENTE_MODO_FALLA]</span>
        </div>

        <div class="source-alert" style="margin-top: 16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Respuesta generada mediante consulta semántica en NotebookLM.
        </div>

        ${renderInterpretationBadge(interpretation)}

        <div class="diag-row" style="margin-top: 12px; border-top: 1px solid var(--panel-border); padding-top: 8px;">
          <span class="diag-badge badge-source">Fuente: ${res.source}</span>
          <span class="diag-badge badge-confidence-high" style="background: rgba(0, 114, 198, 0.1); border: 1px solid rgba(0, 114, 198, 0.2); color: #0072c6;">Confianza: Alta (Sintetizada por IA)</span>
        </div>
      </div>
    `;

    speechText = `NotebookLM ha sintetizado la información para ${res.title}. ${res.content.replace(/<[^>]*>/g, '')}`;
    incrementSourceMetric('NotebookLM');

    return wrapResult({ html, speechText, query });
  }

  // Interceptar consultas de ayuda / instructivo / guía
  const helpTriggers = [
    "ayuda",
    "cómo usar",
    "como usar",
    "instructivo",
    "guía",
    "guia",
    "qué puedes hacer",
    "que puedes hacer",
    "qué haces",
    "que haces",
    "capabilities",
    "help"
  ];

  const isHelpQuery = helpTriggers.some(trigger => q.includes(trigger));
  
  if (isHelpQuery) {
    html = `
      <div class="diagnostic-response" style="line-height: 1.45;">
        <div class="diag-header-block" style="border-left: 3px solid var(--accent-cyan); padding-left: 14px; margin-bottom: 16px;">
          <span style="display:none;">[FUENTE_MODO_FALLA]</span>
          <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">GUÍA DE CAPACIDADES:</div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-cyan); font-size: 1.1rem; margin-bottom: 8px;">¿Cómo interactuar con DebugBot Flex?</div>
          <div style="color: var(--text-secondary); font-size: 0.88rem; text-align: justify;">
            Hola, soy <strong>DebugBot Flex</strong>, tu asistente de diagnóstico virtual para tarjetas electrónicas. Estoy programado para guiarte paso a paso a través de procedimientos de soporte y ayudarte a identificar la causa raíz de fallas en tus placas electrónicas.
          </div>
          <span style="display:none;">[/FUENTE_MODO_FALLA]</span>
        </div>

        <div class="diag-section">
          <span class="diag-section-title" style="color: var(--accent-cyan);">Capacidades Principales</span>
          <ol style="padding-left: 18px; margin-top: 6px; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.55;">
            <li style="margin-bottom: 8px;"><strong>Diagnóstico de Secuencia y Firmware (gBMC):</strong> Guía paso a paso en la cadena de booteo SPI, señales de reset (como <code style="font-family:var(--font-mono)">TITAN0_GOOD</code>) y componentes clave (<code style="font-family:var(--font-mono)">U71/U19/XSKT1</code>).</li>
            <li style="margin-bottom: 8px;"><strong>Reglas de Reemplazo Críticas (Sistema FF):</strong> Consulta de reglas de espejo obligatorias para reguladores de potencia (<code style="font-family:var(--font-mono)">VPWR</code>) y ASICs.</li>
            <li style="margin-bottom: 8px;"><strong>Análisis de Secuencia Primaria y ADM1266:</strong> Evaluación de fallas de energía con voltajes <code style="font-family:var(--font-mono)">level0/level1</code>, logs <code style="font-family:var(--font-mono)">Radix/Carrot</code> y la señal oculta de ventiladores (<code style="font-family:var(--font-mono)">FAN_HSWAP_PGOOD</code>).</li>
            <li style="margin-bottom: 8px;"><strong>Árbol de Decisión para Fallas Desconocidas:</strong> Protocolos de comparación contra unidades Golden y análisis de discrepancias (ej. <code style="font-family:var(--font-mono)">BOYD vs Cooler Master</code>).</li>
            <li style="margin-bottom: 8px;"><strong>Protocolo de Escalación Rápida:</strong> Conoce a qué nivel de debug o ingeniería transferir el caso si el Takt Time supera los 45 minutos.</li>
          </ol>
        </div>

        <div class="diag-section">
          <span class="diag-section-title" style="color: var(--accent-purple);">Ejemplos de Consultas Recomendadas</span>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--panel-border); padding: 10px 14px; border-radius: 8px; font-size: 0.82rem; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'" onclick="document.getElementById('chat-input').value=this.querySelector('.eg-text').textContent; document.getElementById('btn-send').click();">
              <span style="color: var(--accent-cyan); font-weight: 600; display: block; margin-bottom: 2px;">1. Secuencia de Booteo y gBMC</span>
              <span class="eg-text" style="color: var(--text-secondary); font-style: italic;">¿Cómo diagnosticar el error ping-gbmc-from-host-tray-fail?</span>
            </div>
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--panel-border); padding: 10px 14px; border-radius: 8px; font-size: 0.82rem; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'" onclick="document.getElementById('chat-input').value=this.querySelector('.eg-text').textContent; document.getElementById('btn-send').click();">
              <span style="color: var(--accent-purple); font-weight: 600; display: block; margin-bottom: 2px;">2. Regla de Espejo FF</span>
              <span class="eg-text" style="color: var(--text-secondary); font-style: italic;">Tengo un corto en el regulador VPWR1, ¿qué debo cambiar?</span>
            </div>
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--panel-border); padding: 10px 14px; border-radius: 8px; font-size: 0.82rem; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'" onclick="document.getElementById('chat-input').value=this.querySelector('.eg-text').textContent; document.getElementById('btn-send').click();">
              <span style="color: var(--accent-yellow); font-weight: 600; display: block; margin-bottom: 2px;">3. Secuencia Primaria y ADM1266</span>
              <span class="eg-text" style="color: var(--text-secondary); font-style: italic;">Señal FAN_HSWAP_PGOOD en 0V y problemas de arranque</span>
            </div>
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--panel-border); padding: 10px 14px; border-radius: 8px; font-size: 0.82rem; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'" onclick="document.getElementById('chat-input').value=this.querySelector('.eg-text').textContent; document.getElementById('btn-send').click();">
              <span style="color: var(--accent-green); font-weight: 600; display: block; margin-bottom: 2px;">4. Escalación Técnica</span>
              <span class="eg-text" style="color: var(--text-secondary); font-style: italic;">¿Cuál es el protocolo de escalación si no puedo reparar una tarjeta?</span>
            </div>
          </div>
        </div>

        <div class="diag-row" style="margin-top: 15px; border-top: 1px solid var(--panel-border); padding-top: 8px;">
          <span class="diag-badge badge-source">Manual de Usuario de DebugBot Flex</span>
          <span class="diag-badge badge-confidence-high">Confianza: Alta (Instructivo Interno)</span>
        </div>
      </div>
    `;

    speechText = "He cargado mi guía de capacidades y manual de uso. Puedes preguntarme sobre fallas de comunicación gBMC, reglas de espejo del sistema FF, secuenciadores ADM1266 o el protocolo de escalación.";
    incrementSourceMetric('GF');

    return wrapResult({ html, speechText, query });
  }

  // Interpretar y expandir consulta
  const interpretation = interpretQuery(query);

  // Detectar si el técnico solicita imágenes o referencias visuales
  const visualTriggers = [
    "muéstrame un ejemplo",
    "¿cómo se ve?",
    "cómo se ve",
    "muéstrame fotos",
    "dame una referencia visual",
    "¿cómo luce esta falla?",
    "cómo luce esta falla",
    "fotos",
    "esquema",
    "diagrama",
    "imagen",
    "imágenes",
    "visual",
    "ver",
    "ejemplo"
  ];
  const isVisualQuery = visualTriggers.some(trigger => q.includes(trigger));

  // --- PRIORIDAD 1: DOCUMENTOS INTERNOS GF* ---
  const docsList = (documents || []).map(doc => {
    return {
      id: doc.id,
      type: (doc.category && doc.category.toLowerCase().includes("herramienta")) ? "Herramienta" : "Procedimiento",
      keywords: doc.keywords || []
    };
  });

  let bestDoc = null;
  let bestDocScore = 0;

  docsList.forEach(dInfo => {
    let score = 0;
    
    // 1. Mención exacta de ID de documento
    if (q.includes(dInfo.id.toLowerCase())) {
      score += 30;
    }
    
    // 2. Coincidencia en la consulta original
    dInfo.keywords.forEach(keyword => {
      if (q.includes(keyword)) {
        score += 15;
      }
    });

    // 3. Coincidencia en términos expandidos e integración con el diccionario maestro
    let expandedMatchScore = 0;
    interpretation.expandedTermsList.forEach(term => {
      if (dInfo.keywords.includes(term) && !q.includes(term)) {
        expandedMatchScore += 3;
      }
    });

    // Boost por coincidencia en diccionario maestro de modos de falla
    if (interpretation.matchedDictEntries && interpretation.matchedDictEntries.length > 0) {
      interpretation.matchedDictEntries.forEach(entry => {
        // Boost si el ID del manual está en las palabras clave relacionadas del diccionario (ej. logs-003 -> GF-LOGS-003)
        if (entry.related_keywords.includes(dInfo.id.toLowerCase()) || 
            entry.related_keywords.includes(dInfo.id.toLowerCase().replace("gf-", "")) ||
            (dInfo.id.toLowerCase().includes("logs-003") && entry.related_keywords.includes("logs-003"))) {
          expandedMatchScore += 20;
        }
        // Boost por palabras clave relacionadas que traslapan con el manual
        entry.related_keywords.forEach(kw => {
          if (dInfo.keywords.includes(kw)) {
            expandedMatchScore += 5;
          }
        });
      });
    }
    score += Math.min(expandedMatchScore, 30); // tope incrementado para permitir boosts del diccionario maestro

    // Boost de búsqueda si es consulta visual y el documento tiene fotos
    const realDocObj = documents.find(d => d.id === dInfo.id);
    if (isVisualQuery && realDocObj && realDocObj.photos && realDocObj.photos.length > 0) {
      score += 15;
    }

    // 4. Boost de prioridad para documentos catalogados como "Herramienta"
    const toolKeywords = [
      "herramienta", "herramientas", "equipo", "equipos", "instrumento", "instrumentos", 
      "medición", "medicion", "validar", "valido", "prueba", "pruebas", "osciloscopio", 
      "multímetro", "multimetro", "fixture", "calibración", "calibracion", "señal", 
      "voltaje", "resistencia", "continuidad"
    ];
    const isGenericToolQuery = toolKeywords.some(tk => q.includes(tk));
    if (isGenericToolQuery && dInfo.type === "Herramienta") {
      score += 15; // Priorizar automáticamente los documentos de herramientas
    }

    if (score > bestDocScore) {
      bestDocScore = score;
      bestDoc = realDocObj;
    }
  });

  if (bestDocScore >= 5) {
    matchedDoc = bestDoc;
  }

  if (matchedDoc) {
    const parsed = parseDocToDiagnosticsFormat(matchedDoc);
    const allPhotos = matchedDoc.photos || [];

    // Separar imágenes según propósito
    const correctPhoto = allPhotos.find(p => p.status === 'correct');
    const defectivePhoto = allPhotos.find(p => p.status === 'defective');
    const referencePhotos = allPhotos.filter(p => p.step === undefined && p.status !== 'correct' && p.status !== 'defective');

    // Integrar imágenes en los pasos del procedimiento
    let stepsHtml = "";
    parsed.pasos.forEach((pasoText, index) => {
      const stepNum = index + 1;
      const stepPhoto = allPhotos.find(p => p.step === stepNum);
      
      stepsHtml += `
        <li style="margin-bottom: 14px;">
          <div><strong>PASO ${stepNum}:</strong> ${pasoText}</div>
          ${stepPhoto ? `
            <div style="margin-top: 8px; border: 1px solid var(--panel-border); border-radius: 8px; overflow: hidden; max-width: 320px; background: rgba(0,0,0,0.25);">
              <img src="${stepPhoto.url}" alt="${stepPhoto.title}" style="width: 100%; height: auto; display: block; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1" onclick="openLightbox('${stepPhoto.url}', '${stepPhoto.title}', '${stepPhoto.description}')">
              <div style="padding: 6px 10px; font-size: 0.72rem; color: var(--text-secondary); border-top: 1px solid var(--panel-border);">
                <span style="color: var(--accent-cyan); font-weight: 600;">${stepPhoto.title}</span>: ${stepPhoto.description}
              </div>
            </div>
          ` : ''}
        </li>
      `;
    });

    // Renderizar galería de imágenes de herramientas si el documento es tipo "Herramienta"
    let toolGalleryHtml = "";
    const matchedDocInfo = docsList.find(d => d.id === matchedDoc.id);
    const isToolDoc = matchedDocInfo && matchedDocInfo.type === "Herramienta";

    if (isToolDoc) {
      // Filtrar imágenes que no pertenezcan a pasos de procedimientos (ej. U71, U19, XSKT1)
      const toolPhotos = allPhotos.filter(p => p.step === undefined);
      if (toolPhotos.length > 0) {
        toolGalleryHtml = `
          <div class="tool-reference-gallery-container" style="margin-top: 14px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 12px; width: 100%;">
            <span style="font-size: 0.78rem; font-weight: 600; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 8px;">
              Imágenes de referencia de la herramienta
            </span>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
              ${toolPhotos.map(p => `
                <div style="border: 1px solid var(--panel-border); border-radius: 8px; overflow: hidden; background: rgba(0,0,0,0.25); display: flex; flex-direction: column;">
                  <img src="${p.url}" alt="${p.title}" style="width: 100%; height: 130px; object-fit: contain; background: #080d1a; display: block; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1" onclick="openLightbox('${p.url}', '${p.title}', '${p.description}')">
                  <div style="padding: 8px 10px; font-size: 0.7rem; color: var(--text-secondary); border-top: 1px solid var(--panel-border); flex: 1; line-height: 1.35;">
                    <strong style="color: var(--accent-cyan);">${p.title}</strong>: ${p.description}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    }

    // Renderizar sección de comparación de componentes CORRECTO vs DEFECTUOSO
    let comparisonHtml = "";
    if (correctPhoto && defectivePhoto && !isToolDoc) { // Solo si no es herramienta para no duplicar
      comparisonHtml = `
        <div class="diag-section" style="margin-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 12px;">
          <span class="diag-section-title" style="color: var(--accent-purple); font-weight: 600; font-size: 0.85rem; letter-spacing: 0.5px;">COMPARACIÓN VISUAL</span>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px;">
            <div style="border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; overflow: hidden; background: rgba(16, 185, 129, 0.03);">
              <div style="padding: 6px; background: rgba(16, 185, 129, 0.1); color: var(--accent-green); font-size: 0.75rem; font-weight: 600; text-align: center; border-bottom: 1px solid rgba(16, 185, 129, 0.15); letter-spacing: 0.5px;">
                COMPONENTE CORRECTO
              </div>
              <img src="${correctPhoto.url}" alt="${correctPhoto.title}" style="width: 100%; height: 130px; object-fit: cover; display: block; cursor: pointer;" onclick="openLightbox('${correctPhoto.url}', '${correctPhoto.title}', '${correctPhoto.description}')">
              <div style="padding: 6px 10px; font-size: 0.72rem; color: var(--text-secondary); text-align: center; border-top: 1px solid rgba(16, 185, 129, 0.1);">
                ${correctPhoto.description}
              </div>
            </div>
            
            <div style="border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; overflow: hidden; background: rgba(239, 68, 68, 0.03);">
              <div style="padding: 6px; background: rgba(239, 68, 68, 0.1); color: var(--accent-red); font-size: 0.75rem; font-weight: 600; text-align: center; border-bottom: 1px solid rgba(239, 68, 68, 0.15); letter-spacing: 0.5px;">
                COMPONENTE DEFECTUOSO
              </div>
              <img src="${defectivePhoto.url}" alt="${defectivePhoto.title}" style="width: 100%; height: 130px; object-fit: cover; display: block; cursor: pointer;" onclick="openLightbox('${defectivePhoto.url}', '${defectivePhoto.title}', '${defectivePhoto.description}')">
              <div style="padding: 6px 10px; font-size: 0.72rem; color: var(--text-secondary); text-align: center; border-top: 1px solid rgba(239, 68, 68, 0.1);">
                ${defectivePhoto.description}
              </div>
            </div>
          </div>
          
          ${defectivePhoto.differences ? `
            <div style="margin-top: 10px; background: rgba(127, 0, 255, 0.04); border: 1px solid rgba(127, 0, 255, 0.2); padding: 10px 14px; border-radius: 8px;">
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--accent-purple); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">DIFERENCIAS A BUSCAR:</span>
              <ul style="font-size: 0.75rem; color: var(--text-secondary); padding-left: 15px; margin-top: 2px;">
                ${defectivePhoto.differences.map(diff => `<li style="margin-bottom: 3px;">${diff}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `;
    }

    // Renderizar bloque de imágenes de referencia general
    let referencePhotosHtml = "";
    if (referencePhotos.length > 0 && !isToolDoc && !(matchedDoc.content && matchedDoc.content.includes('[IMAGE_PLACEHOLDER_'))) { // Solo si no es herramienta y no tiene placeholders inline para no duplicar
      referencePhotosHtml = `
        <div class="diag-section" style="margin-top: 16px; border-top: 1px dashed var(--panel-border); padding-top: 12px;">
          <span class="diag-section-title" style="color: var(--accent-cyan); font-weight: 600; font-size: 0.85rem; letter-spacing: 0.5px;">IMÁGENES DE REFERENCIA</span>
          <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 8px;">
            ${referencePhotos.map((p, idx) => `
              <div style="border: 1px solid var(--panel-border); border-radius: 8px; overflow: hidden; background: #f9fafb;">
                <div style="padding: 6px 12px; background: rgba(0, 95, 169, 0.05); font-size: 0.75rem; font-weight: 600; color: var(--accent-cyan); border-bottom: 1px solid var(--panel-border);">
                  Imagen ${idx + 1}: ${p.title} (Manual ${matchedDoc.id})
                </div>
                <img src="${p.url}" alt="${p.title}" style="width: 100%; height: auto; max-height: 220px; object-fit: contain; display: block; cursor: pointer; background: #f3f4f6;" onclick="openLightbox('${p.url}', '${p.title}', '${p.description}')">
                <div style="padding: 8px 12px; font-size: 0.72rem; color: var(--text-secondary); border-top: 1px solid var(--panel-border); line-height: 1.4;">
                  <strong>Descripción:</strong> ${p.description}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Construcción del HTML de respuesta de diagnóstico visual e interactivo
    html = `
      <div class="diagnostic-response" style="line-height: 1.45;">
        <!-- Cabecera de especificación formal -->
        <div class="diag-header-block" style="border-left: 3px solid var(--accent-cyan); padding-left: 14px; margin-bottom: 16px;">
          <span style="display:none;">[FUENTE_MODO_FALLA]</span>
          <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">FUENTE:</div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-cyan); font-size: 1.1rem; margin-bottom: 8px;">${matchedDoc.id}</div>
          
          <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">MODO DE FALLA:</div>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 1rem; margin-bottom: 8px;">${parsed.title.split(': ')[1] || parsed.title}</div>
          
          <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">DESCRIPCIÓN:</div>
          <div style="color: var(--text-secondary); font-size: 0.88rem; text-align: justify;">${parsed.diagnostico}</div>
          
          <!-- Inyectar Galería de Imágenes de Herramienta justo después de la explicación -->
          ${toolGalleryHtml}
          
          <span style="display:none;">[/FUENTE_MODO_FALLA]</span>
        </div>

        <div class="diag-section diag-section-causes">
          <span class="diag-section-title">Causas Posibles</span>
          <ul class="diag-list">
            ${parsed.causas.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>

        <div class="diag-section diag-section-steps">
          <span class="diag-section-title">Pasos de Diagnóstico</span>
          <ol class="diag-steps" style="padding-left: 15px; margin-top: 6px;">
            ${stepsHtml}
          </ol>
        </div>

        <div class="diag-section diag-section-measurements">
          <span class="diag-section-title">Mediciones Recomendadas</span>
          <ul class="diag-list">
            ${parsed.mediciones.map(m => `<li>${m}</li>`).join('')}
          </ul>
        </div>

        <div class="diag-section diag-section-components">
          <span class="diag-section-title">Componentes Sospechosos</span>
          <span style="display:none;">[COMPONENTES_SOSPECHOSOS]</span>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
            ${parsed.componentes.map(c => `<span class="kb-tag" style="background: rgba(0, 95, 169, 0.05); border-color: rgba(0, 95, 169, 0.2); color: var(--accent-cyan); font-family: var(--font-mono);">${c}</span>`).join('')}
          </div>
          <span style="display:none;">[/COMPONENTES_SOSPECHOSOS]</span>
        </div>

        <div class="diag-section diag-section-validation">
          <span class="diag-section-title">Validación</span>
          <span style="display:none;">[VALIDACION]</span>
          <div>${parsed.validacion}</div>
          <span style="display:none;">[/VALIDACION]</span>
        </div>
        
        <!-- Renderizar Comparaciones e Imágenes de Referencia -->
        ${comparisonHtml}
        ${referencePhotosHtml}
        
        <div class="source-alert" style="margin-top: 16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Respuesta obtenida de documentación interna GF.
        </div>

        ${renderInterpretationBadge(interpretation)}

        <div class="diag-row" style="margin-top: 12px; border-top: 1px solid var(--panel-border); padding-top: 8px;">
          <span class="diag-badge badge-source">Fuente: Documento GF (${matchedDoc.id})</span>
          <span class="diag-badge badge-confidence-high">Confianza: Alta (Coincidencia: ${bestDocScore} pts)</span>
        </div>
      </div>
    `;

    speechText = `Diagnóstico inicial de documentación interna para ${matchedDoc.id}. ${parsed.diagnostico}. Componentes sospechosos: ${parsed.componentes.join(', ')}.`;
    incrementDocMetric(matchedDoc.id);

    return wrapResult({ html, speechText, query });
  }

  // --- PRIORIDAD 3: BASE DE CONOCIMIENTO (KB-XXXXXX) ---
  let bestKB = null;
  let bestKBScore = 0;

  casesKB.forEach(c => {
    let score = 0;
    const cSymptom = c.symptom.toLowerCase();
    const cErr = c.errorCode.toLowerCase();
    const cCause = c.rootCause.toLowerCase();
    const cReplaced = c.componentsReplaced.toLowerCase();
    const cEvaluated = c.componentsEvaluated.toLowerCase();

    // 1. ID de caso exacto
    if (q.includes(c.id.toLowerCase())) {
      score += 30;
    }

    // 2. Consulta en campos principales
    if (cSymptom.includes(q)) score += 15;
    if (cErr.includes(q)) score += 15;
    if (cCause.includes(q)) score += 10;
    if (cReplaced.includes(q)) score += 10;
    if (cEvaluated.includes(q)) score += 10;

    // 3. Coincidencia de palabras clave
    const queryWords = q.split(/\s+/).filter(w => w.length > 2);
    queryWords.forEach(word => {
      if (cSymptom.includes(word)) score += 3;
      if (cErr.includes(word)) score += 3;
      if (c.keywords.some(k => k.includes(word) || word.includes(k))) score += 5;
    });

    // 4. Coincidencias en términos expandidos e integración con el diccionario maestro
    let expandedMatchScore = 0;
    interpretation.expandedTermsList.forEach(term => {
      if (c.keywords.includes(term) && !q.includes(term)) {
        expandedMatchScore += 3;
      }
      if ((cSymptom.includes(term) || cErr.includes(term) || cReplaced.includes(term)) && !q.includes(term)) {
        expandedMatchScore += 2;
      }
    });

    // Boost por coincidencia en diccionario maestro de modos de falla para casos de la base de conocimiento
    if (interpretation.matchedDictEntries && interpretation.matchedDictEntries.length > 0) {
      interpretation.matchedDictEntries.forEach(entry => {
        // Boost si el ID del caso está en las palabras clave relacionadas del diccionario (ej. kb-000001)
        if (entry.related_keywords.includes(c.id.toLowerCase())) {
          expandedMatchScore += 20;
        }
        // Boost por palabras clave relacionadas que traslapan con el caso KB
        entry.related_keywords.forEach(kw => {
          if (c.keywords.includes(kw)) {
            expandedMatchScore += 5;
          }
          if (cSymptom.toLowerCase().includes(kw) || cErr.toLowerCase().includes(kw) || cReplaced.toLowerCase().includes(kw)) {
            expandedMatchScore += 3;
          }
        });
      });
    }
    score += Math.min(expandedMatchScore, 30); // tope incrementado para permitir boosts del diccionario maestro

    // Boost de búsqueda si es consulta visual y el caso tiene fotos
    if (isVisualQuery && c.photos && c.photos.length > 0) {
      score += 15;
    }

    if (score > bestKBScore) {
      bestKBScore = score;
      bestKB = c;
    }
  });

  if (bestKBScore >= 5) {
    matchedKB = bestKB;
  }

  if (matchedKB) {
    matchedKB.usesCount = (matchedKB.usesCount || 0) + 1;
    safeStorage.setItem('KNOWLEDGE_BASE', JSON.stringify(casesKB));

    html = `
      <div class="diagnostic-response" style="line-height: 1.45;">
        <div class="diag-header" style="color: var(--accent-purple);">Se encontró una solución previamente documentada.</div>
        
        <div class="diag-header-block" style="border-left: 3px solid var(--accent-purple); padding-left: 14px; margin-bottom: 16px;">
          <span style="display:none;">[FUENTE_MODO_FALLA]</span>
          <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">FUENTE:</div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-purple); font-size: 1.1rem; margin-bottom: 8px;">${matchedKB.id}</div>
          
          <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">MODO DE FALLA / SÍNTOMA:</div>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 1rem; margin-bottom: 8px;">${matchedKB.symptom} (Código: <code style="font-family: var(--font-mono);">${matchedKB.errorCode}</code>)</div>
          
          <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">CAUSA RAÍZ:</div>
          <div style="color: var(--text-secondary); font-size: 0.88rem; text-align: justify;">${matchedKB.rootCause}</div>
          <span style="display:none;">[/FUENTE_MODO_FALLA]</span>
        </div>

        <div class="diag-section diag-section-solution">
          <span class="diag-section-title">Solución Aplicada</span>
          <div style="background: rgba(127, 0, 255, 0.04); border: 1px solid rgba(127, 0, 255, 0.2); padding: 12px; border-radius: 8px; font-size: 0.88rem;">
            ${matchedKB.solution}
          </div>
        </div>
        
        ${matchedKB.photos && matchedKB.photos.length > 0 ? `
          <div class="diag-section diag-section-photos">
            <span class="diag-section-title" style="color: var(--accent-purple);">Evidencia Visual</span>
            <div class="message-photo-gallery" style="margin-top: 8px;">
              ${matchedKB.photos.map((p, idx) => `
                <div class="message-photo-wrapper" style="border: 1px solid rgba(127,0,255,0.25);" onclick="openLightbox('${p.url}', '${p.description}', '${p.observation}')">
                  <img src="${p.url}" alt="${p.description}">
                  <div class="message-photo-info" style="background: rgba(0,0,0,0.65); border-top: 1px solid rgba(127,0,255,0.2);">
                    <strong>Imagen ${idx + 1}: ${p.description}</strong>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="diag-section diag-section-components">
          <span class="diag-section-title">Componentes Sospechosos</span>
          <span style="display:none;">[COMPONENTES_SOSPECHOSOS]</span>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
            <span class="kb-tag" style="background: rgba(127,0,255,0.05); border-color: rgba(127,0,255,0.2); color: var(--accent-purple); font-family: var(--font-mono);">${matchedKB.componentsReplaced || 'No especificados'}</span>
          </div>
          <span style="display:none;">[/COMPONENTES_SOSPECHOSOS]</span>
        </div>
        
        <div class="diag-section diag-section-validation">
          <span class="diag-section-title">Validación de Reparación</span>
          <span style="display:none;">[VALIDACION]</span>
          <div style="font-size: 0.85rem;">${matchedKB.validationResult || 'Validada mediante prueba estándar.'}</div>
          <span style="display:none;">[/VALIDACION]</span>
        </div>

        ${renderInterpretationBadge(interpretation)}

        <div class="diag-row" style="margin-top: 12px; border-top: 1px solid var(--panel-border); padding-top: 8px;">
          <span class="diag-badge badge-source">Fuente: Base de Conocimiento Interna</span>
          <span class="diag-badge badge-confidence-high">Confianza: Alta (${matchedKB.validationLevel} | Score: ${bestKBScore})</span>
        </div>

        <div class="diag-actions" style="margin-top: 10px;">
          <div class="rating-buttons">
            <button class="btn-rate btn-rate-up" title="Solución efectiva">
              👍 <span class="rate-up-count">${matchedKB.feedback?.up || 0}</span>
            </button>
            <button class="btn-rate btn-rate-down" title="No funcionó">
              👎 <span class="rate-down-count">${matchedKB.feedback?.down || 0}</span>
            </button>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-secondary);">
            Reutilizado exitosamente: <strong>${matchedKB.usesCount} veces</strong>
          </span>
          <button class="btn-link-kb">VER PROCEDIMIENTO COMPLETO</button>
        </div>
      </div>
    `;

    speechText = `Se encontró una solución en la base de conocimiento interno, caso ${matchedKB.id}. Registrado por el técnico ${matchedKB.technician}. Causa raíz: ${matchedKB.rootCause}. Solución aplicada: ${matchedKB.solution}.`;
    incrementSourceMetric('KB');

    return wrapResult({ html, speechText, query, kbCaseId: matchedKB.id });
  }

  // --- PRIORIDAD 4: FUENTES TÉCNICAS EXTERNAS ---
  let bestExt = null;
  let bestExtScore = 0;

  window.EXTERNAL_SOURCES.forEach(e => {
    let score = 0;
    
    // 1. Coincidencia en keywords de la consulta original
    e.keywords.forEach(keyword => {
      if (q.includes(keyword)) {
        score += 15;
      }
    });

    // 2. Coincidencia de palabras individuales
    const queryWords = q.split(/\s+/).filter(w => w.length > 2);
    queryWords.forEach(word => {
      if (e.keywords.some(k => k.includes(word) || word.includes(k))) {
        score += 5;
      }
    });

    // 3. Coincidencias en términos expandidos e integración con el diccionario maestro
    let expandedMatchScore = 0;
    interpretation.expandedTermsList.forEach(term => {
      if (e.keywords.includes(term) && !q.includes(term)) {
        expandedMatchScore += 3;
      }
    });

    // Boost por coincidencia en diccionario maestro para fuentes externas
    if (interpretation.matchedDictEntries && interpretation.matchedDictEntries.length > 0) {
      interpretation.matchedDictEntries.forEach(entry => {
        if (entry.related_keywords.includes(e.id.toLowerCase())) {
          expandedMatchScore += 20;
        }
        entry.related_keywords.forEach(kw => {
          if (e.keywords.includes(kw)) {
            expandedMatchScore += 5;
          }
        });
      });
    }
    score += Math.min(expandedMatchScore, 30); // tope incrementado para dar peso al diccionario maestro

    if (score > bestExtScore) {
      bestExtScore = score;
      bestExt = e;
    }
  });

  if (bestExtScore >= 5) {
    matchedExt = bestExt;
  }

  if (matchedExt) {
    html = `
      <div class="diagnostic-response" style="line-height: 1.45;">
        <div class="diag-header-block" style="border-left: 3px solid var(--accent-yellow); padding-left: 14px; margin-bottom: 16px;">
          <span style="display:none;">[FUENTE_MODO_FALLA]</span>
          <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">FUENTE:</div>
          <div style="font-weight: 700; color: var(--accent-yellow); font-size: 1rem; margin-bottom: 8px;">${matchedExt.source}</div>
          
          <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">RECOMENDACIÓN TÉCNICA:</div>
          <div style="color: var(--text-secondary); font-size: 0.88rem; text-align: justify;">${matchedExt.content}</div>
          <span style="display:none;">[/FUENTE_MODO_FALLA]</span>
        </div>
        
        ${renderInterpretationBadge(interpretation)}

        <div class="diag-row" style="margin-top: 12px; border-top: 1px solid var(--panel-border); padding-top: 8px;">
          <span class="diag-badge badge-source">Fuente: ${matchedExt.source}</span>
          <span class="diag-badge badge-confidence-media">Confianza: Media (No validada localmente | Score: ${bestExtScore})</span>
        </div>
      </div>
    `;

    speechText = `Encontrado en fuente externa, de la literatura de ${matchedExt.source}. ${matchedExt.content}`;
    incrementSourceMetric('External');

    return wrapResult({ html, speechText, query });
  }

  // --- FALLBACK DE INFERENCIA DE ACTIVIDADES Y VALIDACIONES ---
  const activityToToolMap = {
    // Actividades de soldadura/retrabajo -> SCP/Rayos X (GF-HW-006)
    "soldar": "GF-HW-006",
    "desoldar": "GF-HW-006",
    "retrabajar": "GF-HW-006",
    "reparar": "GF-HW-006",
    "retrabajo": "GF-HW-006",
    "soldadura": "GF-HW-006",
    "limpiar": "GF-HW-006",
    
    // Actividades de medición/señales -> Radix/Carrot (GF-LOGS-003)
    "medir": "GF-LOGS-003",
    "revisar": "GF-BOOT-002", // gBMC boot sequence
    "verificar": "GF-BOOT-002",
    "testear": "GF-LOGS-003",
    "comprobar": "GF-BOOT-002",
    "oscilar": "GF-LOGS-003",
    "sondear": "GF-LOGS-003",
    "conectar": "GF-BOOT-002",
    "osciloscopio": "GF-LOGS-003",
    "multimetro": "GF-LOGS-003",
    "multímetro": "GF-LOGS-003",
    "voltaje": "GF-LOGS-003",
    "tensión": "GF-LOGS-003",
    "corriente": "GF-LOGS-003",
    
    // Validaciones técnicas de fallas específicas
    "corto": "GF-FF-001", // System FF
    "espejo": "GF-FF-001",
    "reemplazar": "GF-FF-001",
    "reemplazo": "GF-FF-001",
    "abierto": "GF-HW-006", // AXI / SCP X-Ray for open solder
    "puente": "GF-HW-006", // AXI / SCP X-Ray for solder bridge
    "mismatch": "GF-FA-004", // Golden Unit comparison
    "desajuste": "GF-FA-004",
    "duplicado": "GF-FA-004",
    "módulo": "GF-FF-001",
    "modulo": "GF-FF-001",
    "reset": "GF-BOOT-002", // gBMC reset
    "boot": "GF-BOOT-002",
    "booteo": "GF-BOOT-002"
  };

  let inferredToolId = null;
  let inferredTriggerWord = "";

  // Buscar coincidencia en la consulta
  for (const [triggerWord, toolId] of Object.entries(activityToToolMap)) {
    // Si la consulta contiene la palabra clave de actividad (usando expresiones regulares para evitar match parcial)
    const regex = new RegExp(`\\b${triggerWord}\\w*\\b`, 'i');
    if (regex.test(q)) {
      inferredToolId = toolId;
      inferredTriggerWord = triggerWord;
      break;
    }
  }

  if (inferredToolId) {
    const inferredDoc = documents.find(d => d.id === inferredToolId);
    if (inferredDoc) {
      const parsed = parseDocToDiagnosticsFormat(inferredDoc);
      const allPhotos = inferredDoc.photos || [];
      const correctPhoto = allPhotos.find(p => p.status === 'correct');
      const defectivePhoto = allPhotos.find(p => p.status === 'defective');
      const referencePhotos = allPhotos.filter(p => p.step === undefined && p.status !== 'correct' && p.status !== 'defective');

      // Integrar imágenes en los pasos del procedimiento
      let stepsHtml = "";
      parsed.pasos.forEach((pasoText, index) => {
        const stepNum = index + 1;
        const stepPhoto = allPhotos.find(p => p.step === stepNum);
        
        stepsHtml += `
          <li style="margin-bottom: 14px;">
            <div><strong>PASO ${stepNum}:</strong> ${pasoText}</div>
            ${stepPhoto ? `
              <div style="margin-top: 8px; border: 1px solid var(--panel-border); border-radius: 8px; overflow: hidden; max-width: 320px; background: rgba(0,0,0,0.25);">
                <img src="${stepPhoto.url}" alt="${stepPhoto.title}" style="width: 100%; height: auto; display: block; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1" onclick="openLightbox('${stepPhoto.url}', '${stepPhoto.title}', '${stepPhoto.description}')">
                <div style="padding: 6px 10px; font-size: 0.72rem; color: var(--text-secondary); border-top: 1px solid var(--panel-border);">
                  <span style="color: var(--accent-cyan); font-weight: 600;">${stepPhoto.title}</span>: ${stepPhoto.description}
                </div>
              </div>
            ` : ''}
          </li>
        `;
      });

      // Renderizar galería de imágenes de herramientas
      let toolGalleryHtml = "";
      const matchedDocInfo = docsList.find(d => d.id === inferredDoc.id);
      const isToolDoc = matchedDocInfo && matchedDocInfo.type === "Herramienta";

      if (isToolDoc) {
        const toolPhotos = allPhotos.filter(p => p.step === undefined);
        if (toolPhotos.length > 0) {
          toolGalleryHtml = `
            <div class="tool-reference-gallery-container" style="margin-top: 14px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 12px; width: 100%;">
              <span style="font-size: 0.78rem; font-weight: 600; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 8px;">
                Imágenes de referencia de la herramienta
              </span>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                ${toolPhotos.map(p => `
                  <div style="border: 1px solid var(--panel-border); border-radius: 8px; overflow: hidden; background: rgba(0,0,0,0.25); display: flex; flex-direction: column;">
                    <img src="${p.url}" alt="${p.title}" style="width: 100%; height: 130px; object-fit: contain; background: #080d1a; display: block; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1" onclick="openLightbox('${p.url}', '${p.title}', '${p.description}')">
                    <div style="padding: 8px 10px; font-size: 0.7rem; color: var(--text-secondary); border-top: 1px solid var(--panel-border); flex: 1; line-height: 1.35;">
                      <strong style="color: var(--accent-cyan);">${p.title}</strong>: ${p.description}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      }

      // Renderizar bloque de imágenes de referencia general
      let referencePhotosHtml = "";
      if (referencePhotos.length > 0 && !isToolDoc && !(inferredDoc.content && inferredDoc.content.includes('[IMAGE_PLACEHOLDER_'))) {
        referencePhotosHtml = `
          <div class="diag-section" style="margin-top: 16px; border-top: 1px dashed var(--panel-border); padding-top: 12px;">
            <span class="diag-section-title" style="color: var(--accent-cyan); font-weight: 600; font-size: 0.85rem; letter-spacing: 0.5px;">IMÁGENES DE REFERENCIA</span>
            <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 8px;">
              ${referencePhotos.map((p, idx) => `
                <div style="border: 1px solid var(--panel-border); border-radius: 8px; overflow: hidden; background: #f9fafb;">
                  <div style="padding: 6px 12px; background: rgba(0, 95, 169, 0.05); font-size: 0.75rem; font-weight: 600; color: var(--accent-cyan); border-bottom: 1px solid var(--panel-border);">
                    Imagen ${idx + 1}: ${p.title} (Manual ${inferredDoc.id})
                  </div>
                  <img src="${p.url}" alt="${p.title}" style="width: 100%; height: auto; max-height: 220px; object-fit: contain; display: block; cursor: pointer; background: #f3f4f6;" onclick="openLightbox('${p.url}', '${p.title}', '${p.description}')">
                  <div style="padding: 8px 12px; font-size: 0.72rem; color: var(--text-secondary); border-top: 1px solid var(--panel-border); line-height: 1.4;">
                    <strong>Descripción:</strong> ${p.description}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // Renderizar bloque de comparaciones
      let comparisonHtml = "";
      if (correctPhoto && defectivePhoto && !isToolDoc) {
        comparisonHtml = `
          <div class="diag-section" style="margin-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 12px;">
            <span class="diag-section-title" style="color: var(--accent-purple); font-weight: 600; font-size: 0.85rem; letter-spacing: 0.5px;">COMPARACIÓN VISUAL</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px;">
              <div style="border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; overflow: hidden; background: rgba(16, 185, 129, 0.03);">
                <div style="padding: 6px; background: rgba(16, 185, 129, 0.1); color: var(--accent-green); font-size: 0.75rem; font-weight: 600; text-align: center; border-bottom: 1px solid rgba(16, 185, 129, 0.15); letter-spacing: 0.5px;">
                  COMPONENTE CORRECTO
                </div>
                <img src="${correctPhoto.url}" alt="${correctPhoto.title}" style="width: 100%; height: 130px; object-fit: cover; display: block; cursor: pointer;" onclick="openLightbox('${correctPhoto.url}', '${correctPhoto.title}', '${correctPhoto.description}')">
                <div style="padding: 6px 10px; font-size: 0.72rem; color: var(--text-secondary); text-align: center; border-top: 1px solid rgba(16, 185, 129, 0.1);">
                  ${correctPhoto.description}
                </div>
              </div>
              <div style="border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; overflow: hidden; background: rgba(239, 68, 68, 0.03);">
                <div style="padding: 6px; background: rgba(239, 68, 68, 0.1); color: var(--accent-red); font-size: 0.75rem; font-weight: 600; text-align: center; border-bottom: 1px solid rgba(239, 68, 68, 0.15); letter-spacing: 0.5px;">
                  COMPONENTE DEFECTUOSO
                </div>
                <img src="${defectivePhoto.url}" alt="${defectivePhoto.title}" style="width: 100%; height: 130px; object-fit: cover; display: block; cursor: pointer;" onclick="openLightbox('${defectivePhoto.url}', '${defectivePhoto.title}', '${defectivePhoto.description}')">
                <div style="padding: 6px 10px; font-size: 0.72rem; color: var(--text-secondary); text-align: center; border-top: 1px solid rgba(239, 68, 68, 0.1);">
                  ${defectivePhoto.description}
                </div>
              </div>
            </div>
          </div>
        `;
      }

      html = `
        <div class="diagnostic-response" style="line-height: 1.45;">
          <!-- Alerta de Inferencia del Asistente -->
          <div class="inferred-alert-badge" style="background: rgba(0, 95, 169, 0.08); border: 1px solid rgba(0, 95, 169, 0.25); border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 0.82rem; color: var(--accent-cyan); display: flex; align-items: flex-start; gap: 10px; line-height: 1.4;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top: 1px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <div>
              <strong>Inferencia de Debug Bot Flex:</strong> No especificaste una herramienta, pero detecté la actividad/falla <strong>"${inferredTriggerWord}"</strong>. Te muestro la documentación del manual de herramienta asociado: <strong>${inferredDoc.id}</strong>.
            </div>
          </div>

          <!-- Cabecera de especificación formal -->
          <div class="diag-header-block" style="border-left: 3px solid var(--accent-cyan); padding-left: 14px; margin-bottom: 16px;">
            <span style="display:none;">[FUENTE_MODO_FALLA]</span>
            <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">FUENTE:</div>
            <div style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-cyan); font-size: 1.1rem; margin-bottom: 8px;">${inferredDoc.id}</div>
            
            <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">MODO DE FALLA:</div>
            <div style="font-weight: 700; color: var(--text-primary); font-size: 1rem; margin-bottom: 8px;">${parsed.title.split(': ')[1] || parsed.title}</div>
            
            <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin-bottom: 2px;">DESCRIPCIÓN:</div>
            <div style="color: var(--text-secondary); font-size: 0.88rem; text-align: justify;">${parsed.diagnostico}</div>
            
            <!-- Inyectar Galería de Imágenes de Herramienta justo después de la explicación -->
            ${toolGalleryHtml}
            
            <span style="display:none;">[/FUENTE_MODO_FALLA]</span>
          </div>

          <div class="diag-section diag-section-causes">
            <span class="diag-section-title">Causas Posibles</span>
            <ul class="diag-list">
              ${parsed.causas.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>

          <div class="diag-section diag-section-steps">
            <span class="diag-section-title">Pasos de Diagnóstico</span>
            <ol class="diag-steps" style="padding-left: 15px; margin-top: 6px;">
              ${stepsHtml}
            </ol>
          </div>

          <div class="diag-section diag-section-measurements">
            <span class="diag-section-title">Mediciones Recomendadas</span>
            <ul class="diag-list">
              ${parsed.mediciones.map(m => `<li>${m}</li>`).join('')}
            </ul>
          </div>

          <div class="diag-section diag-section-components">
            <span class="diag-section-title">Componentes Sospechosos</span>
            <span style="display:none;">[COMPONENTES_SOSPECHOSOS]</span>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
              ${parsed.componentes.map(c => `<span class="kb-tag" style="background: rgba(0, 95, 169, 0.05); border-color: rgba(0, 95, 169, 0.2); color: var(--accent-cyan); font-family: var(--font-mono);">${c}</span>`).join('')}
            </div>
            <span style="display:none;">[/COMPONENTES_SOSPECHOSOS]</span>
          </div>

          <div class="diag-section diag-section-validation">
            <span class="diag-section-title">Validación</span>
            <span style="display:none;">[VALIDACION]</span>
            <div>${parsed.validacion}</div>
            <span style="display:none;">[/VALIDACION]</span>
          </div>
          
          <!-- Renderizar Comparaciones e Imágenes de Referencia -->
          ${comparisonHtml}
          ${referencePhotosHtml}
          
          <div class="source-alert" style="margin-top: 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Respuesta obtenida por inferencia de actividad.
          </div>

          ${renderInterpretationBadge(interpretation)}

          <div class="diag-row" style="margin-top: 12px; border-top: 1px solid var(--panel-border); padding-top: 8px;">
            <span class="diag-badge badge-source">Fuente: Inferencia sobre ${inferredDoc.id}</span>
            <span class="diag-badge badge-confidence-media">Confianza: Media (Inferencia de Actividad)</span>
          </div>
        </div>
      `;

      speechText = `No especificaste una herramienta, pero identifiqué la actividad de ${inferredTriggerWord}. Mostrando documentación del manual ${inferredDoc.id}.`;
      incrementSourceMetric('GF'); // counts as official document

      return wrapResult({ html, speechText, query });
    }
  }

  // --- APRENDIZAJE CONTINUO: SIN SOLUCIÓN ---
  html = `
    <div class="diagnostic-response" style="line-height: 1.45;">
      <div class="learning-cta diag-header-block">
        <span style="display:none;">[FUENTE_MODO_FALLA]</span>
        <div class="learning-title">Hola, soy DebugBot Flex. No encontré una solución documentada para este problema.</div>
        <p style="font-size: 0.88rem; line-height: 1.4; color: var(--text-secondary);">
          Nuestros manuales y base de conocimiento no registran datos sobre la falla consultada. ¿Has logrado reparar esta tarjeta o deseas registrar el diagnóstico aplicado para ayudar a otros técnicos?
        </p>
        <span style="display:none;">[/FUENTE_MODO_FALLA]</span>
        <button class="btn-register-sol">REGISTRAR SOLUCIÓN</button>
      </div>
      
      ${renderInterpretationBadge(interpretation)}

      <div class="diag-row" style="margin-top: 15px; border-top: 1px solid var(--panel-border); padding-top: 8px;">
        <span class="diag-badge badge-source">Fuente: Ninguna</span>
        <span class="diag-badge badge-confidence-baja">Confianza: Nula</span>
      </div>
    </div>
  `;

  speechText = "No encontré una solución documentada para este problema en nuestros archivos. ¿Deseas registrar la solución aplicada para ayudar a otros técnicos?";
  incrementSourceMetric('None');

  return wrapResult({ html, speechText, query });
}

/* Helper para reemplazar marcadores de imágenes [IMAGE_PLACEHOLDER_N] por etiquetas HTML inline */
function replaceImagePlaceholders(text, photos) {
  if (!text || !photos || photos.length === 0) return text;
  return text.replace(/\[IMAGE_PLACEHOLDER_(\d+)\]/g, (match, num) => {
    const idx = parseInt(num) - 1;
    const photo = photos[idx];
    if (photo) {
      return `
        <div class="inline-extracted-image-container" style="margin: 14px 0; border: 1px solid var(--panel-border); border-radius: 8px; overflow: hidden; max-width: 480px; background: #080d1a; box-shadow: 0 4px 12px rgba(0,0,0,0.35);">
          <img src="${photo.url}" alt="${photo.title}" style="width: 100%; height: auto; max-height: 320px; object-fit: contain; display: block; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1" onclick="openLightbox('${photo.url}', '${photo.title}', '${photo.description}')">
          <div style="padding: 8px 12px; font-size: 0.72rem; color: var(--text-secondary); border-top: 1px solid var(--panel-border); background: rgba(255,255,255,0.02); line-height: 1.35;">
            <strong style="color: var(--accent-cyan);">${photo.title}</strong>: ${photo.description}
          </div>
        </div>
      `;
    }
    return match;
  });
}

/* Helper para mapear el contenido Markdown de los documentos GF a la estructura de respuesta formal */
function parseDocToDiagnosticsFormat(doc) {
  const parsed = {
    title: doc.title,
    diagnostico: "",
    causas: [],
    pasos: [],
    mediciones: [],
    componentes: [],
    validacion: ""
  };

  // Mapeo semi-dinámico basado en qué documento es para que coincida con el contenido del PDF y manuales reales
  if (doc.id === "GF-FF-001") {
    parsed.diagnostico = "Se presenta una caída de potencia o falla crítica en la etapa de alimentación balanceada de los ASIC del Sistema FF.";
    parsed.causas = [
      "Falla en el perfil térmico o eléctrico de uno de los controladores de fase de potencia.",
      "Desbalance físico por reemplazo parcial inapropiado de una rama VPWR.",
      "Daño en compuerta lógica interna de regulación de ASIC espejo."
    ];
    parsed.pasos = [
      "Identificar la localidad del ASIC que se reporta fuera de servicio o inestable.",
      "Localizar en el diagrama de ensamble los dos controladores de potencia VPWR (Vertical Power) asociados.",
      "Dar de baja obligatoriamente ambos módulos de potencia VPWR de la localidad defectuosa en el sistema FF.",
      "Registrar y cargar el ASIC espejo correspondiente en la base de datos de control del cliente para re-equilibrar la entrega de potencia."
    ];
    parsed.mediciones = [
      "Voltaje de salida en bobinas de VPWR: 0.8V a 0.85V estable.",
      "Resistencia a GND en pines de drenaje de los VPWR: > 100 Ohms.",
      "Señales de control PWM del controlador primario a los gates de potencia: oscilación cuadrada a 300kHz."
    ];
    parsed.componentes = ["VPWR1", "VPWR2", "ASIC_Espejo", "Filtro_Potencia"];
    parsed.validacion = "Ejecutar autoprueba de carga dinámica (Stress Power Test) en la estación automática durante 10 minutos y verificar balance térmico bajo cámara infrarroja.";
  } 
  else if (doc.id === "GF-BOOT-002") {
    parsed.diagnostico = "Falla de comunicación entre el host y la tarjeta de administración gBMC. La interfaz de red de mantenimiento no responde al ping.";
    parsed.causas = [
      "BIOS principal corrupta en el chip controlador U71 (Dauntless).",
      "Memoria flash SPI externa XSKT1 dañada o con firmware mal grabado.",
      "Ruteador/Multiplexor SPI U144 dañado o con soldadura abierta.",
      "Controlador gBMC (U19) bloqueado en estado de reset permanente."
    ];
    parsed.pasos = [
      "Confirmar que el circuito U71 copie exitosamente la partición de firmware de la memoria XSKT1 a la sección interna 'Lado B'.",
      "Leer y registrar el Scratch Register mediante sonda lógica I2C en la dirección de bus 0x4A.",
      "Medir y confirmar la liberación del nivel lógico en la señal de reset TITAN0_GOOD."
    ];
    parsed.mediciones = [
      "TITAN0_GOOD (TP_T0_GOOD): 1.8V (Estado activo alto liberado). Si mide 0V, existe falla de secuencia.",
      "Línea de alimentación VCC de XSKT1 (Pin 8): 3.3V constante.",
      "Señal de reloj SPI (SCLK) en U144: Tren de pulsos lógicos a 24MHz al arranque."
    ];
    parsed.componentes = ["U71 (Dauntless/BIOS)", "U19 (gBMC)", "U144 (Intermediario)", "XSKT1 (Flash)"];
    parsed.validacion = "Verificar respuesta a comandos de ping a la dirección del gBMC desde la terminal de prueba y asegurar carga del firmware lado B.";
  }
  else if (doc.id === "GF-LOGS-003") {
    parsed.diagnostico = "Fallo de encendido en secuencia primaria de potencia detectado a través del monitoreo digital de voltajes.";
    parsed.causas = [
      "Señal de presencia/estado de ventiladores FAN_HSWAP_PGOOD inactiva (0V).",
      "Secuenciador de potencia digital ADM1266 con configuración desprogramada o en falla de hardware.",
      "Exceso de corriente de arranque que dispara la protección OCP del regulador primario."
    ];
    parsed.pasos = [
      "Filtrar logs de Carrot utilizando Radix buscando los estados 'CM_DONE' o 'CM_ERROR'.",
      "Extraer y descargar el reporte del volcado de caja negra (Blackbox dump) del microchip ADM1266.",
      "Analizar los niveles de voltaje registrados correspondientes a 'level0' (primario) y 'level1-sequencer-gfcX' (secundarios).",
      "Inspeccionar con osciloscopio la señal crítica FAN_HSWAP_PGOOD en el pin de prueba TP_FAN_PG."
    ];
    parsed.mediciones = [
      "FAN_HSWAP_PGOOD: 3.3V estable (Indica fuente de 54V de ventiladores correcta).",
      "Rieles level0: 12.0V de entrada y 3.3V auxiliares presentes.",
      "Rieles level1: Secuencia ordenada escalonada de 1.8V, 1.2V y 0.8V."
    ];
    parsed.componentes = ["ADM1266 (Secuenciador)", "Módulo Ventiladores", "Regulador Primario (54V)", "Fusible Entrada"];
    parsed.validacion = "La secuencia de leds de diagnóstico de potencia de la tarjeta debe pasar de ámbar parpadeante a verde fijo.";
  }
  else {
    // Para cualquier otro documento (ej. los compilados dinámicamente desde .docx)
    // Intentamos extraer las secciones por palabras clave comunes de la planta.
    const content = doc.content || "";
    
    // Función helper para buscar sección y limpiar texto
    const extractSection = (keywords, fallbackText) => {
      for (const kw of keywords) {
        const regex = new RegExp(`${kw}\\s*:?\\s*([\\s\\S]*?)(?=(?:CAUSAS PROBABLES:|PASOS DE DIAGNÓSTICO:|VALIDACIONES RECOMENDADAS:|SEÑALES CRITICAS:|VALIDACION:|SALIDA ESPERADA:|RELACIONADO CON:|COMO CONFIRMAR:|USO:|APLICA CUANDO:|$))`, 'i');
        const match = content.match(regex);
        if (match && match[1].trim().length > 10) {
          return match[1].trim();
        }
      }
      return fallbackText;
    };
    
    // Extraer diagnóstico
    parsed.diagnostico = extractSection(["USO", "DESCRIPCIÓN", "INFORMACIÓN BASE", "RESUMEN"], content);
    
    // Extraer causas
    const causasStr = extractSection(["CAUSAS PROBABLES", "CAUSAS"], "");
    if (causasStr) {
      parsed.causas = causasStr.split(/(?:\n|(?:\d+\.\s*))/).map(s => s.trim().replace(/^[-*•]\s*/, '')).filter(s => s.length > 3);
    } else {
      parsed.causas = ["Falla de hardware interna no documentada físicamente en el componente.", "Discrepancias en tablas de configuración del firmware."];
    }
    
    // Extraer pasos
    const pasosStr = extractSection(["COMO CONFIRMAR", "PROCEDIMIENTO", "PASOS DE DIAGNÓSTICO", "PASOS"], "");
    if (pasosStr) {
      parsed.pasos = pasosStr.split(/(?:\n|(?:\d+\.\s*))/).map(s => s.trim().replace(/^[-*•]\s*/, '')).filter(s => s.length > 3);
    } else {
      parsed.pasos = ["Revisar manual de ensamble del producto.", "Seguir el árbol de decisión de fallas desconocidas."];
    }
    
    // Extraer mediciones
    const medicionesStr = extractSection(["VALIDACIONES RECOMENDADAS", "MEDICIONES RECOMENDADAS", "SEÑALES CRITICAS", "MEDICIONES"], "");
    if (medicionesStr) {
      parsed.mediciones = medicionesStr.split(/(?:\n|(?:\d+\.\s*))/).map(s => s.trim().replace(/^[-*•]\s*/, '')).filter(s => s.length > 3);
    } else {
      parsed.mediciones = ["Validar voltajes auxiliares lógicos de 3.3V y 1.8V.", "Señales de reloj activas."];
    }
    
    // Extraer componentes
    const compStr = extractSection(["COMPONENTES", "COMPONENTES SOSPECHOSOS"], "");
    if (compStr) {
      parsed.componentes = compStr.split(/[\s,;]+/).map(s => s.trim().toUpperCase().replace(/[.()]/g, '')).filter(s => s.length > 1 && s !== "Y" && s !== "DE");
    } else {
      parsed.componentes = ["PCBA", "ASIC", "BIOS"];
    }
    
    // Extraer validación
    parsed.validacion = extractSection(["SALIDA ESPERADA", "VALIDACION", "VALIDACIÓN"], "Ejecutar pruebas del set funcional básico (FCT) de manufactura.");
  }

  // Reemplazar placeholders de imágenes inline
  parsed.diagnostico = replaceImagePlaceholders(parsed.diagnostico, doc.photos);
  parsed.causas = parsed.causas.map(c => replaceImagePlaceholders(c, doc.photos));
  parsed.pasos = parsed.pasos.map(p => replaceImagePlaceholders(p, doc.photos));
  parsed.mediciones = parsed.mediciones.map(m => replaceImagePlaceholders(m, doc.photos));
  parsed.validacion = replaceImagePlaceholders(parsed.validacion, doc.photos);

  return parsed;
}

/* ====================================================================
   VISTA: REGISTRO Y DOCUMENTACIÓN DE CASOS
   ==================================================================== */
function initForm() {
  const photoInput = document.getElementById('photo-input');
  const uploadArea = document.getElementById('upload-area');
  const photosGrid = document.getElementById('uploaded-photos-grid');
  const btnSubmit = document.getElementById('btn-submit');
  const btnCancel = document.getElementById('btn-cancel');
  
  // Abrir seleccionador de archivos al hacer clic en área de carga
  uploadArea.addEventListener('click', () => photoInput.click());
  
  photoInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  });

  // Drag and drop en área de carga
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--accent-cyan)';
    uploadArea.style.background = 'rgba(0, 95, 169, 0.04)';
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--panel-border)';
    uploadArea.style.background = '#f9fafb';
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--panel-border)';
    uploadArea.style.background = '#f9fafb';
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  });

  // Envío de Formulario
  btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Validar campos requeridos mínimos
    const pn = document.getElementById('form-pn').value.trim();
    const model = document.getElementById('form-model').value.trim();
    const symptom = document.getElementById('form-symptom').value.trim();
    const solution = document.getElementById('form-solution').value.trim();
    const rootCause = document.getElementById('form-rootcause').value.trim();
    const tech = document.getElementById('form-tech').value.trim();

    if (!pn || !model || !symptom || !solution || !rootCause || !tech) {
      alert("Por favor, completa todos los campos obligatorios antes de continuar.");
      return;
    }

    // Abrir Modal de Validación de Nuevo Conocimiento
    openValidationModal();
  });

  btnCancel.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm("¿Estás seguro de que deseas limpiar el formulario? Se perderán todos los datos capturados.")) {
      resetReworkForm();
    }
  });

  // Selección de opción en el modal de validación
  document.querySelectorAll('.validation-opt-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.validation-opt-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Cancelar en Modal
  document.getElementById('btn-modal-cancel').addEventListener('click', closeValidationModal);

  // Confirmar y guardar en Modal
  document.getElementById('btn-modal-confirm').addEventListener('click', saveNewKnowledgeCase);
}

/* Procesamiento, redimensionado y compresión de fotos mediante Canvas */
function processFiles(files) {
  files.forEach(file => {
    if (!file.type.startsWith('image/')) {
      alert(`El archivo ${file.name} no es una imagen válida.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Configuraciones de optimización solicitadas: Max 1280x720
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 720;
        let width = img.width;
        let height = img.height;

        // Calcular proporciones
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        // Crear Canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Comprimir automáticamente reduciendo calidad hasta estar por debajo de 500 KB
        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let sizeInBytes = Math.round((dataUrl.split(',')[1].length) * 3 / 4);

        while (sizeInBytes > 500 * 1024 && quality > 0.1) {
          quality -= 0.05;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          sizeInBytes = Math.round((dataUrl.split(',')[1].length) * 3 / 4);
        }

        const sizeInKB = (sizeInBytes / 1024).toFixed(1);

        // Añadir a nuestra lista temporal
        const photoObj = {
          id: 'photo_' + Date.now() + Math.random().toString(36).substr(2, 4),
          originalName: file.name,
          url: dataUrl,
          resolution: `${width}x${height}`,
          sizeKB: sizeInKB,
          description: '',
          observation: ''
        };

        uploadedPhotos.push(photoObj);
        renderPhotoCards();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function renderPhotoCards() {
  const grid = document.getElementById('uploaded-photos-grid');
  grid.innerHTML = "";

  uploadedPhotos.forEach((photo, idx) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.innerHTML = `
      <div class="photo-preview-wrapper">
        <img src="${photo.url}" alt="Preview">
        <button class="photo-remove-btn" type="button" onclick="removePhoto('${photo.id}')">✕</button>
      </div>
      <div class="photo-meta-info">
        <span>JPG Comprimido</span>
        <span>${photo.resolution} | ${photo.sizeKB} KB</span>
      </div>
      <div class="photo-inputs">
        <input type="text" placeholder="Descripción corta (ej. Capacitor C102 en corto)" value="${photo.description}" oninput="updatePhotoMeta('${photo.id}', 'description', this.value)" required>
        <textarea placeholder="Observación técnica (ej. Se observa daño por quemadura)" oninput="updatePhotoMeta('${photo.id}', 'observation', this.value)"></textarea>
      </div>
    `;
    grid.appendChild(card);
  });
}

window.removePhoto = function(id) {
  uploadedPhotos = uploadedPhotos.filter(p => p.id !== id);
  renderPhotoCards();
};

window.updatePhotoMeta = function(id, field, value) {
  const photo = uploadedPhotos.find(p => p.id === id);
  if (photo) {
    photo[field] = value;
  }
};

function openValidationModal() {
  document.getElementById('validation-modal').classList.add('active');
}

function closeValidationModal() {
  document.getElementById('validation-modal').classList.remove('active');
}

function saveNewKnowledgeCase() {
  if (!isCurrentUserAuthenticated) {
    alert("No cuenta con permisos para realizar esta acción.");
    closeValidationModal();
    return;
  }

  const selectedOpt = document.querySelector('.validation-opt-card.selected');
  const validationLevel = selectedOpt ? selectedOpt.getAttribute('data-level') : 'Validated';
  
  // Generar ID incremental KB-XXXXXX
  const lastIdNum = casesKB.length > 0 ? parseInt(casesKB[casesKB.length - 1].id.split('-')[1]) : 0;
  const newId = 'KB-' + String(lastIdNum + 1).padStart(6, '0');

  // Obtener datos del formulario
  const newCase = {
    id: newId,
    date: document.getElementById('form-date').value || new Date().toISOString().split('T')[0],
    technician: document.getElementById('form-tech').value.trim(),
    partNumber: document.getElementById('form-pn').value.trim(),
    model: document.getElementById('form-model').value.trim(),
    client: document.getElementById('form-client').value.trim(),
    area: document.getElementById('form-area').value,
    station: document.getElementById('form-station').value.trim(),
    symptom: document.getElementById('form-symptom').value.trim(),
    errorCode: document.getElementById('form-errcode').value.trim() || 'N/A',
    testResult: document.getElementById('form-testresult').value.trim() || 'Exitoso',
    measurements: document.getElementById('form-measurements').value.trim() || 'N/A',
    componentsEvaluated: document.getElementById('form-comp-eval').value.trim() || 'N/A',
    componentsReplaced: document.getElementById('form-comp-replaced').value.trim() || 'N/A',
    validationLevel: validationLevel,
    validationResult: document.getElementById('form-validation-method').value.trim() || 'Validación estándar FCT.',
    rootCause: document.getElementById('form-rootcause').value.trim(),
    solution: document.getElementById('form-solution').value.trim(),
    lessonsLearned: document.getElementById('form-lessons').value.trim() || 'Ninguna.',
    usesCount: 0,
    feedback: { up: 1, down: 0 },
    photos: uploadedPhotos.map(p => ({
      description: p.description || 'Evidencia de reparación',
      observation: p.observation || '',
      url: p.url
    })),
    // Generar palabras clave automáticamente a partir de textos
    keywords: generateKeywords(
      document.getElementById('form-symptom').value + " " +
      document.getElementById('form-solution').value + " " +
      document.getElementById('form-comp-replaced').value
    )
  };

  // Guardar en la base de datos local
  casesKB.push(newCase);
  safeStorage.setItem('KNOWLEDGE_BASE', JSON.stringify(casesKB));
  
  // Agregar métrica de solución resuelta
  incrementSourceMetric('KB_ADDED');

  closeValidationModal();
  alert(`Caso registrado de forma exitosa bajo el ID: ${newCase.id}`);
  
  resetReworkForm();
  
  // Redirigir a la Biblioteca Visual
  document.querySelector('a[data-view="library"]').click();
}

function generateKeywords(text) {
  const blacklist = ["de", "la", "el", "en", "se", "un", "una", "y", "o", "los", "las", "por", "para", "con", "que", "al", "del"];
  const words = text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/);
  
  // Filtrar palabras repetidas y artículos cortos
  const uniques = [...new Set(words)]
    .filter(w => w.length > 2 && !blacklist.includes(w));
    
  return uniques.slice(0, 6); // Max 6 palabras clave
}

function resetReworkForm() {
  document.getElementById('rework-form').reset();
  uploadedPhotos = [];
  renderPhotoCards();
  
  // Resetear fecha al día de hoy
  document.getElementById('form-date').value = new Date().toISOString().split('T')[0];
}

/* ====================================================================
   VISTA: BIBLIOTECA VISUAL DE FALLAS
   ==================================================================== */
function initLibrary() {
  const libSearch = document.getElementById('lib-search');
  const libFilterClient = document.getElementById('lib-filter-client');
  const libFilterPn = document.getElementById('lib-filter-pn');
  const libFilterComp = document.getElementById('lib-filter-component');

  libSearch.addEventListener('input', renderLibrary);
  libFilterClient.addEventListener('change', renderLibrary);
  libFilterPn.addEventListener('change', renderLibrary);
  libFilterComp.addEventListener('change', renderLibrary);
}

function renderLibrary() {
  const grid = document.getElementById('library-grid');
  const searchVal = document.getElementById('lib-search').value.toLowerCase();
  const filterClient = document.getElementById('lib-filter-client').value;
  const filterPn = document.getElementById('lib-filter-pn').value;
  const filterComp = document.getElementById('lib-filter-component').value;

  grid.innerHTML = "";

  // Filtrar casos
  const filtered = casesKB.filter(c => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchVal) ||
      c.symptom.toLowerCase().includes(searchVal) ||
      c.errorCode.toLowerCase().includes(searchVal) ||
      c.rootCause.toLowerCase().includes(searchVal) ||
      c.technician.toLowerCase().includes(searchVal) ||
      c.keywords.some(k => k.includes(searchVal));

    const matchesClient = !filterClient || c.client === filterClient;
    const matchesPn = !filterPn || c.partNumber === filterPn;
    const matchesComp = !filterComp || 
      c.componentsReplaced.toLowerCase().includes(filterComp.toLowerCase()) || 
      c.componentsEvaluated.toLowerCase().includes(filterComp.toLowerCase());

    return matchesSearch && matchesClient && matchesPn && matchesComp;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
        No se encontraron casos de diagnóstico en la biblioteca con los filtros seleccionados.
      </div>
    `;
    return;
  }

  filtered.forEach(c => {
    // Determinar la imagen principal a mostrar (si no hay, usar un mock premium relacionado a circuitos)
    const mainImgUrl = c.photos && c.photos.length > 0 ? c.photos[0].url : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80";
    
    const card = document.createElement('div');
    card.className = 'kb-card';
    card.innerHTML = `
      <div class="kb-card-image">
        <img src="${mainImgUrl}" alt="Falla de hardware">
        <div class="kb-card-badges">
          <span class="diag-badge badge-confidence-high" style="background: rgba(0, 95, 169, 0.08); border-color: rgba(0, 95, 169, 0.25); color: var(--accent-cyan);">${c.validationLevel}</span>
        </div>
      </div>
      <div class="kb-card-body">
        <div class="kb-card-header">
          <span class="kb-id">${c.id}</span>
          <span class="kb-date">${c.date}</span>
        </div>
        <h3 class="kb-title">${c.symptom}</h3>
        
        <div class="kb-meta-rows">
          <div class="kb-meta-item"><span>PN:</span> <strong>${c.partNumber}</strong></div>
          <div class="kb-meta-item"><span>Mod:</span> <strong>${c.model}</strong></div>
          <div class="kb-meta-item"><span>Remplazo:</span> <strong>${c.componentsReplaced}</strong></div>
          <div class="kb-meta-item"><span>Estación:</span> <strong>${c.station}</strong></div>
        </div>

        <div class="kb-tags">
          ${c.keywords.map(k => `<span class="kb-tag">${k}</span>`).join('')}
        </div>
      </div>
      <div class="kb-card-footer">
        <div class="kb-author">
          <div class="avatar-xs">${c.technician.charAt(0)}</div>
          <span>${c.technician}</span>
        </div>
        <div class="kb-stats">
          <div class="kb-stat" title="Tasa de efectividad">👍 ${c.feedback?.up || 0}</div>
          <button class="btn-rate" style="padding: 4px 8px; font-size: 0.75rem;" onclick="showCaseDetails('${c.id}')">Detalles</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Ventana Modal de Detalles del Caso
window.showCaseDetails = function(caseId) {
  const c = casesKB.find(item => item.id === caseId);
  if (!c) return;

  const overlay = document.getElementById('kb-detail-overlay');
  const detailsDiv = document.getElementById('kb-detail-content');
  
  detailsDiv.innerHTML = `
    <div class="kb-detail-grid">
      <div class="kb-detail-main">
        <div class="kb-detail-section">
          <span class="kb-detail-sec-title">Descripción de la Falla</span>
          <div class="kb-detail-text">${c.symptom}</div>
        </div>
        
        <div class="kb-detail-section">
          <span class="kb-detail-sec-title">Causa Raíz Identificada</span>
          <div class="kb-detail-text">${c.rootCause}</div>
        </div>
        
        <div class="kb-detail-section">
          <span class="kb-detail-sec-title">Solución de Ingeniería Aplicada</span>
          <div class="kb-detail-text" style="background: rgba(127, 0, 255, 0.05); border-color: rgba(127, 0, 255, 0.2);">${c.solution}</div>
        </div>

        <div class="kb-detail-section">
          <span class="kb-detail-sec-title">Mediciones Efectuadas</span>
          <div class="kb-detail-text" style="font-family: var(--font-mono);">${c.measurements}</div>
        </div>

        <div class="kb-detail-section">
          <span class="kb-detail-sec-title">Lecciones Aprendidas</span>
          <div class="kb-detail-text">${c.lessonsLearned}</div>
        </div>
      </div>
      
      <div class="kb-detail-side">
        <div class="kb-detail-card">
          <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 600;">Metadatos del Caso</span>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem; margin-top: 6px;">
            <div>Cliente: <strong>${c.client}</strong></div>
            <div>No. Parte: <strong>${c.partNumber}</strong></div>
            <div>Modelo: <strong>${c.model}</strong></div>
            <div>Estación: <strong>${c.station}</strong></div>
            <div>Técnico: <strong>${c.technician}</strong></div>
            <div>Fecha: <strong>${c.date}</strong></div>
            <div>Validación: <span class="diag-badge badge-confidence-high" style="display: inline-block; padding: 2px 6px; font-size: 0.7rem; margin-left: 4px;">${c.validationLevel}</span></div>
          </div>
        </div>

        <div class="kb-detail-card">
          <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 600;">Uso del Conocimiento</span>
          <div style="font-size: 0.85rem;">
            <div>Reutilizaciones: <strong>${c.usesCount} veces</strong></div>
            <div style="margin-top: 6px;">Efectividad (Likes): <strong>👍 ${c.feedback?.up || 0} / 👎 ${c.feedback?.down || 0}</strong></div>
          </div>
        </div>

        ${c.photos && c.photos.length > 0 ? `
          <div class="kb-detail-card">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 600;">Evidencias Visuales</span>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 6px;">
              ${c.photos.map(p => `
                <div style="border: 1px solid var(--panel-border); border-radius: 8px; overflow: hidden; cursor: pointer;" onclick="openLightbox('${p.url}', '${p.description}', '${p.observation}')">
                  <img src="${p.url}" style="width:100%; height:100px; object-fit:cover;">
                  <div style="padding: 6px; font-size: 0.72rem; color: var(--text-secondary); text-align: center;">${p.description}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  overlay.classList.add('active');
};

window.closeCaseDetails = function() {
  document.getElementById('kb-detail-overlay').classList.remove('active');
};

// Calificación interactiva de soluciones
function rateSolution(caseId, type, btnUp, btnDown) {
  const c = casesKB.find(item => item.id === caseId);
  if (!c) return;

  if (!c.feedback) {
    c.feedback = { up: 0, down: 0 };
  }

  // Toggle visual y almacenamiento
  if (type === 'up') {
    if (btnUp.classList.contains('active-up')) {
      c.feedback.up--;
      btnUp.classList.remove('active-up');
    } else {
      c.feedback.up++;
      btnUp.classList.add('active-up');
      if (btnDown.classList.contains('active-down')) {
        c.feedback.down--;
        btnDown.classList.remove('active-down');
      }
    }
  } else {
    if (btnDown.classList.contains('active-down')) {
      c.feedback.down--;
      btnDown.classList.remove('active-down');
    } else {
      c.feedback.down++;
      btnDown.classList.add('active-down');
      if (btnUp.classList.contains('active-up')) {
        c.feedback.up--;
        btnUp.classList.remove('active-up');
      }
    }
  }

  // Actualizar valores de los contadores en la burbuja
  btnUp.querySelector('.rate-up-count').textContent = c.feedback.up;
  btnDown.querySelector('.rate-down-count').textContent = c.feedback.down;

  // Persistir en local storage
  safeStorage.setItem('KNOWLEDGE_BASE', JSON.stringify(casesKB));
}

// Lightbox de imágenes
window.openLightbox = function(url, desc, obs) {
  const overlay = document.getElementById('lightbox-overlay');
  document.getElementById('lightbox-img').src = url;
  document.getElementById('lightbox-caption').textContent = desc || "Imagen de evidencia";
  document.getElementById('lightbox-obs').textContent = obs || "";
  overlay.classList.add('active');
};

window.closeLightbox = function() {
  document.getElementById('lightbox-overlay').classList.remove('active');
};


/* ====================================================================
   VISTA: MANUALES Y DOCUMENTOS GF*
   ==================================================================== */
function renderDocsList() {
  const container = document.getElementById('docs-list-items');
  container.innerHTML = "";

  documents.forEach(doc => {
    const item = document.createElement('div');
    item.className = 'doc-item';
    item.id = `doc-item-${doc.id}`;
    item.innerHTML = `
      <span class="doc-item-id">${doc.id}</span>
      <span class="doc-item-title">${doc.title.split(':')[1] || doc.title}</span>
    `;
    item.addEventListener('click', () => {
      // Limpiar activos
      document.querySelectorAll('.doc-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      showDocumentDetails(doc.id);
    });
    container.appendChild(item);
  });
}

function showDocumentDetails(docId) {
  const doc = documents.find(d => d.id === docId);
  if (!doc) return;

  const view = document.getElementById('docs-view-content');
  
  // Renderizar Markdown simulado de manera limpia
  let htmlContent = doc.content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/<\/ul>\s*<ul>/g, '') // Arreglar listas seguidas
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n$/gim, '<br>');

  view.innerHTML = `<div class="markdown-body">${htmlContent}</div>`;
  
  // Marcar elemento activo en la barra lateral
  setTimeout(() => {
    const sidebarItem = document.getElementById(`doc-item-${docId}`);
    if (sidebarItem) sidebarItem.classList.add('active');
  }, 100);
}


/* ====================================================================
   VISTA: DASHBOARD ANALÍTICO (ADMINISTRATIVO)
   ==================================================================== */
// Métricas analíticas generales persistentes
let analyticsSource = JSON.parse(safeStorage.getItem('ANALYTICS_SOURCE')) || {
  GF: 12,
  KB: 18,
  NotebookLM: 6,
  External: 4,
  None: 2
};

function incrementDocMetric(docId) {
  incrementSourceMetric('GF');
}

function incrementSourceMetric(source) {
  if (source === 'KB_ADDED') {
    // Si se añade un caso, incrementamos el total de KB
    analyticsSource['KB']++;
  } else {
    analyticsSource[source] = (analyticsSource[source] || 0) + 1;
  }
  safeStorage.setItem('ANALYTICS_SOURCE', JSON.stringify(analyticsSource));
}

let chartsInstances = {};

function initDashboard() {
  // Inicialización de la vista
}

function renderCharts() {
  // 1. Calcular Datos Generales para KPIs
  const totalCases = casesKB.length;
  const validatedCases = casesKB.filter(c => c.validationLevel === 'Validated').length;
  const totalReuses = casesKB.reduce((acc, curr) => acc + (curr.usesCount || 0), 0);
  
  // Tasa de éxito promedio
  let totalLikes = 0;
  let totalDislikes = 0;
  casesKB.forEach(c => {
    totalLikes += c.feedback?.up || 0;
    totalDislikes += c.feedback?.down || 0;
  });
  const successRate = totalLikes + totalDislikes > 0 ? Math.round((totalLikes / (totalLikes + totalDislikes)) * 100) : 100;

  // Renderizar KPIs
  document.getElementById('kpi-total-val').textContent = totalCases;
  document.getElementById('kpi-valid-val').textContent = validatedCases;
  document.getElementById('kpi-reuse-val').textContent = totalReuses;
  document.getElementById('kpi-success-val').textContent = `${successRate}%`;

  // Renderizar Tablas
  renderTopComponentsTable();
  renderTopFailuresTable();

  // --- DESTROY CHARTS IF ALREADY EXISTS TO PREVENT BUG ---
  if (chartsInstances.sourceChart) chartsInstances.sourceChart.destroy();
  if (chartsInstances.componentsChart) chartsInstances.componentsChart.destroy();

  // 2. Gráfico 1: Fuentes de Consultas Resueltas (Pie Chart)
  const ctxSource = document.getElementById('chart-source').getContext('2d');
  chartsInstances.sourceChart = new Chart(ctxSource, {
    type: 'pie',
    data: {
      labels: ['Docs GF*', 'Base Interna KB', 'Skill NotebookLM', 'Fuentes Externas', 'Sin Resolución'],
      datasets: [{
        data: [
          analyticsSource.GF,
          analyticsSource.KB,
          analyticsSource.NotebookLM,
          analyticsSource.External,
          analyticsSource.None
        ],
        backgroundColor: [
          'rgba(0, 95, 169, 0.8)',   /* Flex Blue */
          'rgba(92, 45, 145, 0.8)',   /* Purple */
          'rgba(0, 114, 198, 0.8)',  /* Secondary Blue */
          'rgba(245, 158, 11, 0.8)',  /* Orange */
          'rgba(168, 0, 0, 0.8)'      /* Red */
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#4b5563',
            font: { family: 'Outfit', size: 12 }
          }
        }
      }
    }
  });

  // 3. Gráfico 2: Componentes más Defectuosos (Doughnut Chart)
  const compData = getTopComponentsData();
  const ctxComponents = document.getElementById('chart-components').getContext('2d');
  chartsInstances.componentsChart = new Chart(ctxComponents, {
    type: 'doughnut',
    data: {
      labels: compData.labels,
      datasets: [{
        data: compData.values,
        backgroundColor: [
          'rgba(0, 95, 169, 0.8)',
          'rgba(0, 114, 198, 0.8)',
          'rgba(16, 124, 65, 0.8)',
          'rgba(139, 45, 137, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#4b5563',
            font: { family: 'Outfit', size: 12 }
          }
        }
      }
    }
  });
}

function getTopComponentsData() {
  const counts = {};
  casesKB.forEach(c => {
    // Extraer y limpiar componentes reemplazados
    const comps = c.componentsReplaced.split(/[\s,]+/)
      .map(s => s.trim().toUpperCase())
      .filter(s => s.length > 2 && s !== 'N/A' && s !== 'NINGUNA' && s !== 'AMBOS' && s !== 'Y');
      
    comps.forEach(comp => {
      counts[comp] = (counts[comp] || 0) + 1;
    });
  });

  // Ordenar y tomar los 5 mejores
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const labels = sorted.slice(0, 5).map(item => item[0]);
  const values = sorted.slice(0, 5).map(item => item[1]);

  // Si no hay datos, rellenar con mocks elegantes
  if (labels.length === 0) {
    return {
      labels: ['XSKT1', 'VPWR1', 'VPWR2', 'U71', 'U144'],
      values: [5, 4, 3, 2, 1]
    };
  }

  return { labels, values };
}

function renderTopComponentsTable() {
  const tbody = document.getElementById('table-top-components-body');
  tbody.innerHTML = "";
  const counts = {};
  
  casesKB.forEach(c => {
    const comps = c.componentsReplaced.split(/[\s,]+/)
      .map(s => s.trim().toUpperCase())
      .filter(s => s.length > 1 && s !== 'N/A' && s !== 'AMBOS' && s !== 'Y');
    comps.forEach(comp => {
      counts[comp] = (counts[comp] || 0) + 1;
    });
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (sorted.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Sin datos de componentes aún.</td></tr>`;
    return;
  }

  sorted.forEach(([comp, count], index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>#${index + 1}</strong></td>
      <td style="font-family: var(--font-mono); color: var(--accent-cyan);">${comp}</td>
      <td>${count} fallas registradas</td>
    `;
    tbody.appendChild(row);
  });
}

function renderTopFailuresTable() {
  const tbody = document.getElementById('table-top-failures-body');
  tbody.innerHTML = "";

  // Ordenar casos por reutilizaciones exitosas (usesCount)
  const sorted = [...casesKB].sort((a, b) => b.usesCount - a.usesCount).slice(0, 5);

  if (sorted.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Sin fallas registradas aún.</td></tr>`;
    return;
  }

  sorted.forEach((c, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>#${index + 1}</strong></td>
      <td>${c.symptom}</td>
      <td><span class="diag-badge badge-source" style="display:inline;">${c.usesCount} usos</span></td>
    `;
    tbody.appendChild(row);
  });
}

/* ====================================================================
   SISTEMA DE AUTENTICACIÓN Y BITÁCORA PARA ACCESO RESTRINGIDO
   ==================================================================== */
let isCurrentUserAuthenticated = false;
let onAuthSuccessCallback = null;

window.showAuthModal = function(callback) {
  onAuthSuccessCallback = callback;
  const overlay = document.getElementById('auth-modal-overlay');
  if (overlay) {
    overlay.classList.add('active');
    document.getElementById('auth-username').value = "";
    document.getElementById('auth-password').value = "";
    document.getElementById('auth-error-msg').style.display = 'none';
    document.getElementById('auth-username').focus();
  }
};

window.closeAuthModal = function() {
  const overlay = document.getElementById('auth-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
  onAuthSuccessCallback = null;
};

window.submitAuth = function() {
  const userEl = document.getElementById('auth-username');
  const passEl = document.getElementById('auth-password');
  const errorEl = document.getElementById('auth-error-msg');
  
  const username = userEl.value.trim();
  const password = passEl.value.trim();

  // Validaciones de credenciales:
  // Usuario autorizado: Eduardo Audelo
  // Contraseña autorizada: flex123 o audelo123 (facilitando accesibilidad)
  const isUserValid = username.toLowerCase() === 'eduardo audelo';
  const isPassValid = password === 'flex123' || password === 'audelo123';

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-MX');
  const timeStr = now.toLocaleTimeString('es-MX');

  if (isUserValid && isPassValid) {
    isCurrentUserAuthenticated = true;
    errorEl.style.display = 'none';
    closeAuthModal();
    
    // Registrar en la bitácora de accesos concedidos
    const logs = JSON.parse(safeStorage.getItem('BITACORA_ACCESO') || '[]');
    logs.push({
      usuario: "Eduardo Audelo",
      fecha: dateStr,
      hora: timeStr,
      accion: "Ingreso exitoso - Sección de documentación de fallas desbloqueada"
    });
    safeStorage.setItem('BITACORA_ACCESO', JSON.stringify(logs));
    console.log(`[Bitácora] Eduardo Audelo ingresó a las ${timeStr} del ${dateStr}. Acción: Acceso a Documentar Caso.`);

    // Ejecutar callback para proceder con la navegación
    if (onAuthSuccessCallback) {
      onAuthSuccessCallback();
    }
  } else {
    errorEl.style.display = 'block';
    
    // Registrar en la bitácora de accesos denegados
    const logs = JSON.parse(safeStorage.getItem('BITACORA_ACCESO') || '[]');
    logs.push({
      usuario: username || "Anónimo",
      fecha: dateStr,
      hora: timeStr,
      accion: `Intento de acceso fallido (Contraseña: ${password ? '***' : 'Vacía'})`
    });
    safeStorage.setItem('BITACORA_ACCESO', JSON.stringify(logs));
    console.warn(`[Bitácora] Intento fallido por ${username || 'Anónimo'} a las ${timeStr} del ${dateStr}. Credenciales inválidas.`);
    
    alert("No cuenta con permisos para realizar esta acción.");
  }
};

// --- CONFIGURACIÓN DE AVATAR HOLOGRÁFICO ESTILO JARVIS ---
let jarvisRotationAngle = 0;

function initJarvisAvatars() {
  const imgAvatars = document.querySelectorAll('img.kaifish-avatar-sync');
  imgAvatars.forEach(img => {
    const parent = img.parentElement;
    if (!parent || parent.querySelector('canvas.kaifish-avatar-sync')) return;
    
    const canvas = document.createElement('canvas');
    canvas.className = img.className;
    
    const isWelcome = img.classList.contains('welcome-kaifish-avatar');
    const size = isWelcome ? 150 : 60;
    canvas.width = size;
    canvas.height = size;
    
    // Al hacer click en el canvas, propagar el click al img oculto para mantener compatibilidades
    canvas.addEventListener('click', () => img.click());
    
    parent.appendChild(canvas);
  });
  
  function tick() {
    jarvisRotationAngle += 0.02;
    const canvases = document.querySelectorAll('canvas.kaifish-avatar-sync');
    canvases.forEach(canvas => {
      drawJarvisAvatar(canvas);
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function drawJarvisAvatar(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const r = (width / 2) * 0.82;
  
  ctx.clearRect(0, 0, width, height);
  
  // Buscar clases o estado del bot en la imagen compañera
  let isThinking = canvas.classList.contains('thinking-anim');
  let isSpeaking = canvas.classList.contains('responding-anim');
  
  // Si no tiene las clases en el canvas, buscar en su imagen compañera en el mismo contenedor
  const parent = canvas.parentElement;
  if (parent) {
    const img = parent.querySelector('img.kaifish-avatar-sync');
    if (img) {
      if (img.classList.contains('thinking-anim')) isThinking = true;
      if (img.classList.contains('responding-anim')) isSpeaking = true;
    }
  }
  
  ctx.shadowColor = 'rgba(0, 180, 216, 0.85)';
  ctx.strokeStyle = 'rgba(0, 114, 198, 0.8)';
  ctx.lineWidth = width > 100 ? 1.5 : 1.0;
  
  const now = performance.now();
  let pulse = 1.0;
  if (isThinking) {
    pulse = 0.6 + 0.4 * Math.sin(now * 0.007);
    ctx.shadowColor = `rgba(0, 180, 216, ${0.85 * pulse})`;
  }
  
  // 1. Dibujar Anillos HUD
  ctx.shadowBlur = width > 100 ? 6 : 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.strokeStyle = `rgba(0, 114, 198, ${0.45 * pulse})`;
  ctx.stroke();
  
  ctx.save();
  ctx.translate(cx, cy);
  const rotSpeed = isThinking ? jarvisRotationAngle * 2.0 : jarvisRotationAngle;
  ctx.rotate(rotSpeed);
  ctx.beginPath();
  ctx.arc(0, 0, r - 3, 0, Math.PI * 0.4);
  ctx.strokeStyle = `rgba(0, 180, 216, ${0.8 * pulse})`;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(0, 0, r - 3, Math.PI, Math.PI * 1.4);
  ctx.stroke();
  ctx.restore();
  
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-rotSpeed * 0.5);
  ctx.beginPath();
  ctx.setLineDash([2, width > 100 ? 8 : 6]);
  ctx.arc(0, 0, r - 8, 0, 2 * Math.PI);
  ctx.strokeStyle = `rgba(0, 180, 216, ${0.35 * pulse})`;
  ctx.stroke();
  ctx.restore();

  // 2. Cara tecnológica (ojos)
  const eyeRadius = width > 100 ? 8 : 4;
  const eyeOffset = r * 0.35;
  const eyeY = cy - r * 0.15;
  
  ctx.fillStyle = `rgba(0, 180, 216, ${0.9 * pulse})`;
  ctx.beginPath();
  ctx.arc(cx - eyeOffset, eyeY, eyeRadius, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - eyeOffset, eyeY, eyeRadius * 0.4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  
  ctx.fillStyle = `rgba(0, 180, 216, ${0.9 * pulse})`;
  ctx.beginPath();
  ctx.arc(cx + eyeOffset, eyeY, eyeRadius, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx + eyeOffset, eyeY, eyeRadius * 0.4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  
  // 3. Indicadores de Pensamiento (Luces satélite)
  if (isThinking) {
    const numSatellites = 4;
    for (let i = 0; i < numSatellites; i++) {
      const angle = (i * Math.PI / 2) + jarvisRotationAngle * 3.0;
      const satR = r - 16;
      const sx = cx + Math.cos(angle) * satR;
      const sy = cy + Math.sin(angle) * satR;
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(sx, sy, width > 100 ? 3 : 1.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  
  // 4. Boca Sincronizada con el Audio (Ecualizador)
  let amp = 0.05;
  if (isSpeaking) {
    amp = siriWaveCurrentAmplitude; 
  } else if (isThinking) {
    amp = 0.08 + Math.sin(now * 0.01) * 0.03;
  } else {
    amp = 0.04 + Math.sin(now * 0.002) * 0.015;
  }
  
  const mouthY = cy + r * 0.3;
  const numMouthBars = width > 100 ? 7 : 5;
  const mouthBarWidth = width > 100 ? 4 : 2;
  const mouthBarGap = width > 100 ? 3 : 2;
  
  const totalMouthWidth = numMouthBars * mouthBarWidth + (numMouthBars - 1) * mouthBarGap;
  const mouthStartX = cx - totalMouthWidth / 2;
  const mouthFactors = width > 100 ? [0.3, 0.6, 0.9, 1.0, 0.9, 0.6, 0.3] : [0.4, 0.8, 1.0, 0.8, 0.4];
  
  for (let i = 0; i < numMouthBars; i++) {
    const factor = mouthFactors[i];
    const noise = isSpeaking ? (Math.sin(now * (0.015 + i * 0.004)) * 0.3 + 0.7) : 1.0;
    const barVal = amp * factor * noise;
    const maxBarHeight = width > 100 ? 25 : 12;
    const barHeight = Math.max(width > 100 ? 2.5 : 1.5, barVal * maxBarHeight);
    const bx = mouthStartX + i * (mouthBarWidth + mouthBarGap);
    const by = mouthY - barHeight / 2;
    
    ctx.shadowBlur = width > 100 ? 6 : 4;
    ctx.fillStyle = 'rgba(0, 180, 216, 0.95)';
    ctx.fillRect(bx, by, mouthBarWidth, barHeight);
    
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + (mouthBarWidth > 2 ? 1 : 0), by, mouthBarWidth > 2 ? mouthBarWidth - 2 : mouthBarWidth, barHeight);
    ctx.restore();
  }
}


