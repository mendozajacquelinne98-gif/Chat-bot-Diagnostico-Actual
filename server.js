import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' })); // Permitir payloads grandes para imágenes base64

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
  console.warn('[ADVERTENCIA] GEMINI_API_KEY no está configurada correctamente en el archivo .env. Las llamadas a Gemini fallarán.');
}

// Inicializar el cliente de la SDK unificada de Google Gen AI (@google/genai)
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Definición del esquema JSON para Structured Outputs
const schemaDiagnostico = {
  type: Type.OBJECT,
  properties: {
    modoFalla: {
      type: Type.STRING,
      description: "Identificación técnica precisa del modo de falla detectado en la tarjeta Ghostfish."
    },
    causaRaiz: {
      type: Type.STRING,
      description: "Explicación física y eléctrica detallada del origen del fallo."
    },
    pasosTroubleshooting: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de pasos y mediciones físicas secuenciales ordenadas para aislar la falla."
    },
    accionesCorrectivas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Acciones recomendadas de rework, soldadura, reemplazo o validación de calidad."
    },
    fuentesLocales: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Nombres de los archivos locales de referencia de la carpeta /docs consultados para responder (ej. ['GF-BOOT-002.md', 'GF-LOGS-003.md'])."
    }
  },
  required: ["modoFalla", "causaRaiz", "pasosTroubleshooting", "accionesCorrectivas", "fuentesLocales"]
};

// Instrucción de Sistema oficial para Kaifish
const SYSTEM_INSTRUCTION = `
Eres Kaifish, un asistente virtual experto en soporte de ingeniería y diagnóstico de tarjetas electrónicas de manufactura Ghostfish (GF).
Tu objetivo es analizar las consultas técnicas de los técnicos y sugerir diagnósticos altamente precisos.
Debes tomar en cuenta el contexto de la base documental indexada (NotebookLM / Manuales de Planta) para formular tu respuesta.
Genera siempre información detallada y profesional de ingeniería de manufactura, incluyendo componentes exactos (como U71, U19, U144, XSKT1, VPWR), señales de control (como TITAN0_GOOD, FAN_HSWAP_PGOOD) y voltajes específicos (como 3.3V, 54V, 0.8V).
Identifica cuáles de los archivos locales consultados de la carpeta /docs (ej. GF-FF-001.md, GF-BOOT-002.md, GF-LOGS-003.md, GF-FA-004.md, GF-ESC-005.md, GF-HW-006.md) contienen la información relevante para la consulta y colócalos en la lista 'fuentesLocales'.
Evita simplificar excesivamente la respuesta y nunca trunques el contenido técnico. Toda la respuesta debe estar formateada de acuerdo al esquema estructurado solicitado.
`;

// Función helper para escanear directorios recursivamente
function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Endpoint seguro de diagnóstico
app.post('/api/diagnostico', async (req, res) => {
  const { consulta, contextoSkill, imagen } = req.body;

  if (!consulta) {
    return res.status(400).json({ error: 'La consulta técnica es requerida.' });
  }

  // 1. Escanear dinámicamente la carpeta /docs recursivamente
  const docsDir = path.join(__dirname, 'docs');
  let dynamicContext = '';
  let localDocsCount = 0;
  try {
    if (fs.existsSync(docsDir)) {
      const filePaths = getAllFiles(docsDir);
      localDocsCount = filePaths.length;
      
      // Tokenizar consulta del usuario para filtrado inteligente de nombres de archivo
      const queryTerms = (consulta || "").toLowerCase().split(/[^a-zA-Z0-9áéíóúüñ_]+/g).filter(t => t.length >= 3);
      
      const readPromises = filePaths.map(async (filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath);
        const relativePath = path.relative(docsDir, filePath).toLowerCase();
        
        // Determinar si el archivo es relevante para la consulta (filtro RAG por nombre de archivo)
        let isRelevant = false;
        
        // Siempre incluir los manuales principales de referencia para tener contexto general
        if (fileName.startsWith('GF-') && ext === '.md') {
          isRelevant = true;
        } else {
          // Chequear si el nombre del archivo contiene palabras clave de la consulta
          isRelevant = queryTerms.some(term => relativePath.includes(term));
        }
        
        // Si no es relevante, no gastamos CPU ni memoria leyéndolo
        if (!isRelevant) return null;
        
        if (ext === '.md' || ext === '.txt' || ext === '.json') {
          const content = fs.readFileSync(filePath, 'utf-8');
          return `\n--- ARCHIVO GHOSTFISH: ${fileName} ---\n${content}\n`;
        } else if (ext === '.pdf') {
          try {
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdf(dataBuffer);
            return `\n--- MANUAL PDF GHOSTFISH: ${fileName} ---\n${pdfData.text}\n`;
          } catch (pdfErr) {
            console.error(`[Error] No se pudo extraer texto del PDF ${fileName}:`, pdfErr);
            return `\n--- ERROR DE LECTURA PDF: ${fileName} ---\n`;
          }
        } else if (ext === '.docx') {
          try {
            const dataBuffer = fs.readFileSync(filePath);
            const docxResult = await mammoth.extractRawText({ buffer: dataBuffer });
            return `\n--- MANUAL DOCX GHOSTFISH: ${fileName} ---\n${docxResult.value}\n`;
          } catch (docxErr) {
            console.error(`[Error] No se pudo extraer texto del DOCX ${fileName}:`, docxErr);
            return `\n--- ERROR DE LECTURA DOCX: ${fileName} ---\n`;
          }
        }
        return null;
      });

      const results = await Promise.all(readPromises);
      dynamicContext = results.filter(Boolean).join('');
    }
  } catch (err) {
    console.error('[Warning] No se pudo escanear la carpeta docs/:', err);
  }

  try {
    const contents = [];

    // Formatear el Prompt uniendo consulta, el contexto de la Skill y la carpeta /docs
    let promptText = `Consulta del Técnico: "${consulta}"\n\n`;
    if (dynamicContext) {
      promptText += `Contexto Extraído Dinámicamente de la Carpeta /docs:\n${dynamicContext}\n`;
    }
    if (contextoSkill) {
      promptText += `Contexto Local Complementario:\n${contextoSkill}\n`;
    }
    contents.push(promptText);

    // Si se incluye una imagen en Base64, agregarla al contenido para análisis multimodal
    if (imagen && imagen.startsWith('data:image/')) {
      const commaIdx = imagen.indexOf(',');
      if (commaIdx !== -1) {
        const mimeType = imagen.substring(5, commaIdx.split(';')[0]);
        const base64Data = imagen.substring(commaIdx + 1);
        contents.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      }
    }

    console.log(`[Gemini API] Procesando consulta dinámica. Archivos locales en /docs: ${localDocsCount}`);

    // Llamada oficial usando @google/genai
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: schemaDiagnostico,
        temperature: 0.2 // Baja temperatura para respuestas más precisas y deterministas
      }
    });

    const resultText = response.text;
    const parsedData = JSON.parse(resultText);

    res.json({
      success: true,
      diagnostico: parsedData,
      totalDocsCount: localDocsCount,
      rawResponse: resultText
    });

  } catch (error) {
    console.error('[Gemini API Error] Falla en generación de diagnóstico:', error);
    res.status(500).json({
      success: false,
      error: 'Error al comunicarse con la API de Gemini.',
      details: error.message
    });
  }
});

// Inicialización del servidor
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(` Servidor de Kaifish listo en http://localhost:${PORT}`);
  console.log(` Endpoint de Diagnóstico: POST http://localhost:${PORT}/api/diagnostico`);
  console.log(`================================================================`);
});
