import { GoogleGenAI, ThinkingLevel } from "@google/genai";

export const GEMINI_MODEL = "gemini-3.6-flash";

/**
 * Identifica a la materia y sirve como anclaje en la UI
 * (panel de Configuración muestra este string).
 */
export const ASSISTANT_LABEL =
  "Asistente 87A — Laboratorio de Sonido I (Cód. 87A, Cátedra Cura, UNA Artes Multimediales)";

/**
 * Esta versión del tutor NO usa PDFs como base de conocimiento.
 * El sistema responde con el conocimiento de entrenamiento del modelo
 * sobre acústica, psicoacústica, audio digital, DSP y montaje sonoro,
 * ajustado por el system prompt al marco de la Cátedra Cura.
 */

/**
 * Prompt del sistema — Tutor 87A, materia "Laboratorio de Sonido I"
 * (Cátedra Cura, Licenciatura en Artes Multimediales, UNA, Código 87).
 *
 * Fuente única del prompt (NO se carga de public/SystemPrompt.txt en
 * runtime: ese archivo es solo documentación).
 *
 * Esta versión NO usa PDFs como base de conocimiento. El modelo responde
 * con su conocimiento de entrenamiento en física acústica, psicoacústica,
 * audio digital y DSP, ajustado al marco pedagógico de la Cátedra Cura.
 * Respuestas SIEMPRE cortas: < 200 palabras (ideal 60-150).
 */
export const SYSTEM_PROMPT = `# SYSTEM PROMPT: TUTOR IA DE LABORATORIO DE SONIDO 1 (CÁTEDRA CURA)
Rol: Tutor IA experto y Jefe de Trabajos Prácticos en Laboratorio de Sonido I (Cátedra Cura, Licenciatura en Artes Multimediales, Universidad Nacional de las Artes - UNA).
Objetivo: Responder con precisión técnica evaluaciones en tres modalidades: (1) Multiple Choice, (2) Verdadero/Falso, y (3) Cloze. El foco principal es la OPCIÓN CORRECTA. Las justificaciones son BREVES (una o dos oraciones como máximo). Respuesta total por ejercicio: entre 40 y 150 palabras; NUNCA superar las 200 palabras.

BASE DE CONOCIMIENTO
Esta versión NO carga PDFs. Respondés exclusivamente con tu conocimiento de entrenamiento en física acústica, psicoacústica, audio digital, DSP y montaje sonoro, alineado a la tradición de la Cátedra Cura (Di Liscia, Cura, Basso, Roederer). NO inventes citas textuales ni atribuyas afirmaciones a autores específicos como si fueran textualidades: solo usá la terminología del campo y mencioná autores cuando el concepto les pertenezca estructuralmente (ej. "bandas críticas", "aliasing", "FFT", "tonicidad", "sonidos lisos/rugosos", "sonomontaje narrativo/poético").

1. IDENTIDAD Y ROL
Tutor Experto y Jefe de Trabajos Prácticos de "Laboratorio de Sonido I" (Cátedra Cura, UNA Artes Multimediales). Resolvés evaluaciones en tres modalidades: Multiple Choice, Verdadero/Falso con justificación, Cloze con términos técnicos exactos. Aclarás dudas de acústica física, psicoacústica, digitalización, análisis espectral, DSP y montaje sonoro dentro del marco del programa oficial.

2. NÚCLEO TEÓRICO
Toda respuesta se apoya en la interrelación entre física del sonido, psicoacústica, técnica digital y poética multimedial:
- Cadena Acústica: fuente-medio-receptor, MAS, superposición, batidos, ondas estacionarias, reflexión, refracción, difracción y absorción.
- Psicoacústica: curvas isofónicas (Fletcher-Munson), fonios/sones, integración temporal, bandas críticas, enmascaramiento frecuencial y temporal, altura tonal.
- Audio Digital: ADC/DAC, muestreo (Fs, Ts), Nyquist-Shannon, aliasing, cuantización (bits, SNR ≈ 6.02 dB/bit, dither), formatos PCM y comprimidos.
- Análisis Espectral y DSP: DFT/FFT, ventana/hop, sonogramas, normalización, AM/FM, compresión/expansión de dinámica, time-stretch, pitch-shift, filtros.
- Morfología del Timbre: dimensión espectral (centroide, balance, tonicidad), temporal (ADSR, ataque), de superficie (liso/rugoso), espacial (localización, espacialidad).
- Sonomontaje: tipología de fuentes, clasificación narrativo / poético / poético-narrativo, guion sonoro, criterios de enlace, planos, paneo, reverberación y mezcla estéreo.

3. EJES TEMÁTICOS
- Unidad I — Aspectos físicos del sonido: fuente-medio-receptor, MAS, superposición, ondas estacionarias, reflexión, absorción, refracción, difracción.
- Unidad II — Sistema auditivo y percepción: oído, transducción mecánica-neuronal, sonoridad, fonios/sones, integración temporal, selectividad en frecuencia, enmascaramiento, banda crítica, altura tonal.
- Unidad III — Audio digital: ADC/DAC, muestreo, Nyquist, aliasing, cuantización, PCM, compresión, FFT y lectura de espectros.
- Unidad IV — DSP: edición no destructiva, ganancia, AM/FM, dinámica, time-stretch, pitch-shift, restauración, filtros.
- Unidad V — Timbre y secuencias: parámetros del timbre, textura, densidad, velocidad, articulación.
- Unidad VI — Montaje sonoro: cuadro tipológico, sonomontaje narrativo/poético/poético-narrativo, guion, planos, espacialización, paneo, reverberación, mezcla multitrack.

4. REGLAS Y RESTRICCIONES (STRICT MODE)
REGLA 1 (Concisión): Cada respuesta debe tener entre 40 y 150 palabras. NUNCA superar las 200 palabras. Sin digresiones, sin rodeos.
REGLA 2 (Límites del Programa): Si la consulta excede el programa (armonía tonal tradicional, electrónica analógica de hardware, acústica arquitectónica compleja fuera de propagación básica, síntesis de sonido avanzada), responder textualmente: "Como tutor, me ciño estrictamente al programa de Laboratorio de Sonido I de la Cátedra Cura. Ese tema excede los contenidos evaluados en la materia."
REGLA 3 (Generación de Práctica): Solo generás simulacros si el usuario lo pide explícitamente ("Dame un simulacro", "Quiero practicar", "Genera preguntas"). En tal caso, generá entre 3 y 5 preguntas alternando acústica, audio digital, psicoacústica o montaje sonoro.
REGLA 4 (Invisibilidad de la Estructura): NUNCA menciones semanas, unidades numeradas ni cronogramas de cursada. Limitate al contenido conceptual.
REGLA 5 (Cero Cortesías): Sin saludos, sin introducciones ni despedidas. Empezá directamente con el bloque de respuesta técnica.
REGLA 6 (Sin Preguntas al Final): Prohibido cerrar con "¿Necesitas más ayuda?", "¿Te quedó claro?" o equivalentes.
REGLA 7 (Idioma): Responde siempre en español rioplatense.

5. FORMATOS OBLIGATORIOS DE RESPUESTA
Aplicá únicamente el bloque correspondiente:

CASO A — Multiple Choice:
Opción correcta: [Letra/número y texto exacto]
Por qué las otras son incorrectas: [Una sola oración técnica descartando los distractores]

CASO B — Verdadero / Falso:
Calificación: [Verdadero o Falso]
Justificación: [Una o dos oraciones técnicas]

CASO C — Completar Frases (Cloze):
Palabra(s) faltante(s): [Término o términos exactos]
Frase completa: [Oración reconstituida]
Fundamento: [Una sola oración]`;

/**
 * Nota legible sobre la base de conocimiento.
 * Solo se usa en logs / debug; el modelo la ignora.
 */
export const KNOWLEDGE_BASE_NOTE =
  "Esta versión del tutor NO usa PDFs como base de conocimiento. Las respuestas se generan exclusivamente a partir del system prompt + conocimiento de entrenamiento del modelo en acústica, psicoacústica, audio digital, DSP y montaje sonoro (Cátedra Cura).";

/**
 * Esta constante quedó vacía por seguridad: la API key SOLO vive en el
 * navegador del usuario (campo "API Key de Gemini" en el panel de
 * Configuración, persistida en localStorage). NO la leemos de variables
 * de entorno porque las `VITE_*` se compilan dentro del bundle JS público
 * y quedan expuestas en GitHub Pages.
 *
 * El nombre del export se mantiene para no romper App.tsx ni a ningún
 * importador externo; su valor siempre es "" en build, y la app usa la
 * key que venga como argumento (`apiKey` en cada llamada).
 */
export const GEMINI_API_KEY: string = "";


export function pickMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "audio/webm";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  return candidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? "audio/webm";
}

/**
 * Convierte un Blob (audio grabado) a una cadena Base64 *sin* el prefijo
 * `data:<mime>;base64,` que agrega FileReader — es lo que espera Gemini
 * en `inlineData.data`.
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("No se pudo codificar el audio a Base64."));
    reader.readAsDataURL(blob);
  });
}

/**
 * Limpia el texto que devuelve Gemini antes de mostrarlo o leerlo en voz
 * alta. Caza los artefactos típicos de cuando el modelo se "contagia" del
 * formato de transcripción de audio (timecodes SRT/VTT, etiquetas de
 * hablante, etc.) y de cualquier residuo de markdown que el TTS leería
 * literal (asteriscos, guiones bajos, etc.). Pensada como red de seguridad:
 * aunque el system prompt lo prohíba, el modelo a veces los emite igual.
 *
 * Patrones que elimina:
 *  - Sello MM:SS o HH:MM:SS pegado o suelto:           00:05 · 1:23 · 00:05.123
 *  - Pegado a una palabra (sin espacio):                "socio01:03estructural" → "socioestructural"
 *  - Con corchetes / ángulos / paréntesis:              [00:05] · <00:05> · (00:05)
 *  - Rangos SRT/VTT:                                    00:05 --> 00:08 · 00:05,000 --> 00:08,000
 *  - Etiquetas de hablante:                             Speaker 1: · Hablante 2:
 *  - Líneas que son solo un número (índices SRT)
 *  - Marcado Markdown simple: **negrita**, *itálica*, _itálica_, `código`
 */
export function sanitizeResponseText(text: string): string {
  if (!text) return text;
  let t = text;
  // 1) Índices de bloque SRT: una línea entera que es solo 1-4 dígitos
  t = t.replace(/^\s*\d{1,4}\s*$/gm, "");
  // 2) Rangos SRT/VTT: "00:05 --> 00:08" / "00:05,000 --> 00:08,000"
  t = t.replace(
    /\b\d{1,2}:\d{2}(?:[.,]\d{1,3})?\s*-->\s*\d{1,2}:\d{2}(?:[.,]\d{1,3})?\b/g,
    " "
  );
  // 3) Sellos de tiempo con corchetes/ángulos/paréntesis: [00:05], <1:23>
  t = t.replace(
    /[\[\<\(]\s*\b\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d{1,3})?\b\s*[\]\>\)]/g,
    " "
  );
  // 4) Sellos sueltos: 00:05, 1:23, 00:05.123 (incluye HH:MM:SS).
  //    Importante: NO usar \b al final, porque un sello pegado a una
  //    palabra ("socio01:03estructural") no tiene word boundary y el
  //    \b lo dejaría pasar. Usamos (?<!\d) al inicio (para no
  //    comernos el "12" de "12:00:30") y (?!\d) al final (para no
  //    comernos el "00" de "12:00:30.5"). El reemplazo es "" (sin
  //    espacio) para que el texto fluya al pegarse a la palabra.
  t = t.replace(/(?<!\d)\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d{1,3})?(?!\d)/g, "");
  // 5) Etiquetas de hablante: "Speaker 1:", "Hablante 2]", "Speaker1 -"
  t = t.replace(/\b(?:Speaker|Hablante|Unknown)\s*\d+\s*[:\-\]]\s*/gi, " ");
  // 6) Markdown residual: negrita (**), itálica (*) y código (`).
  //    El system prompt prohíbe markdown, pero a veces el modelo se
  //    "contagia" y lo emite igual — y speechSynthesis lo lee literal
  //    ("asterisco asterisco negrita asterisco asterisco").
  t = t.replace(/\*\*([^*]+)\*\*/g, "$1");
  t = t.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1$2");
  t = t.replace(/`([^`]+)`/g, "$1");
  // 6.5) Guiones largos / rayas (—, –) y secuencias de guiones
  //      enfáticos. El system prompt los prohíbe, pero el modelo
  //      a veces los emite como pausas dramáticas. speechSynthesis
  //      los lee literal ("guión guión guión..."). Los borramos como
  //      red de seguridad antes de la limpieza final.
  t = t.replace(/[—–]+/g, " ");
  // 7) Limpieza: colapsa espacios y saltos de línea sobrantes
  t = t.replace(/[ \t]{2,}/g, " ");
  t = t.replace(/[ \t]+\n/g, "\n");
  t = t.replace(/\n{3,}/g, "\n\n");
  return t.trim();
}

/** Extrae un mensaje legible de un error arbitrario (incluido el del SDK). */
function describeError(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const e = err as {
      message?: string;
      status?: number | string;
      code?: number | string;
      error?: { message?: string; code?: number | string; status?: string };
    };
    if (e.error?.message) {
      const code = e.error.code ?? e.error.status ?? e.status ?? e.code;
      return code ? `[${code}] ${e.error.message}` : e.error.message;
    }
    if (e.message) return e.message;
  }
  return "Error desconocido al hablar con Gemini.";
}

/**
 * Detecta errores transitorios del servicio (503 UNAVAILABLE,
 * "high demand", "overloaded", etc.). En esos casos, reintentamos
 * una vez antes de mostrar el error al usuario.
 */
function isTransientError(err: unknown): boolean {
  const detail = describeError(err).toLowerCase();
  return (
    detail.includes("503") ||
    detail.includes("unavailable") ||
    detail.includes("high demand") ||
    detail.includes("overloaded") ||
    detail.includes("try again later")
  );
}

/**
 * Esta versión del tutor NO tiene base de conocimiento para "calentar".
 * Se conserva la firma por compatibilidad con App.tsx pero es no-op:
 * solo valida la API Key y emite el progreso "Base lista".
 */
export async function warmupKnowledgeBase(
  apiKey: string,
  onProgress?: (msg: string) => void
): Promise<void> {
  const cleanKey = apiKey.trim();
  if (!cleanKey || cleanKey === "TU_API_KEY_AQUI") {
    throw new Error("Configura tu API Key de Gemini en el panel de Configuración.");
  }
  onProgress?.("Base lista (sin PDFs).");
}

/**
 * Indica si la base de conocimiento está lista para usar.
 * En esta versión siempre es true: no hay PDFs que cargar.
 */
export function isKnowledgeBaseReady(): boolean {
  return true;
}

/**
 * Envía el audio al tutor de Gemini usando el SDK oficial `@google/genai`.
 *
 * Estructura del request:
 *   parts: [
 *     { inlineData: <audio> },       // clip grabado
 *     { text: <instrucción> }        // "Escuchá el audio y respondé…"
 *   ]
 *
 * Esta versión NO envía PDFs: el modelo responde con su conocimiento
 * de entrenamiento sobre acústica, psicoacústica, audio digital y DSP,
 * ajustado por el system prompt al marco de la Cátedra Cura.
 *
 * Manejo de errores:
 *  - Errores transitorios (503/UNAVAILABLE/"high demand"): reintenta una
 *    vez con 4 s de espera. Si el segundo intento también falla, muestra
 *    un mensaje claro en español.
 *  - API key inválida / 401/403: mensaje específico, sin reintento.
 *  - Cuota agotada / 429: mensaje específico, sin reintento.
 *  - Errores de red: mensaje específico, sin reintento.
 */
export async function askGemini(
  base64Audio: string,
  mimeType: string,
  apiKey: string,
  onProgress?: (msg: string) => void
): Promise<string> {
  const cleanKey = apiKey.trim();
  if (!cleanKey || cleanKey === "TU_API_KEY_AQUI") {
    throw new Error("Configura tu API Key de Gemini en el panel de Configuración.");
  }

  const ai = new GoogleGenAI({ apiKey: cleanKey });

  onProgress?.("Enviando audio al tutor…");

  const contents = [
    {
      parts: [
        { inlineData: { mimeType, data: base64Audio } },
        {
          text:
            "Escuchá el audio adjunto y respondé según las instrucciones del sistema. " +
            "Respondé brevemente (40-150 palabras, máximo 200) y ajustate al formato " +
            "definido en el system prompt.",
        },
      ],
    },
  ];
  const config = {
    systemInstruction: SYSTEM_PROMPT,
    // 1500 tokens: respuestas cortas (≤200 palabras) + thinking MINIMAL
    // entran cómodos en este margen.
    maxOutputTokens: 1500,
    thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
    temperature: 0.3,
  };

  const MAX_ATTEMPTS = 2;
  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config,
      });
      const text = (response?.text ?? "").trim();
      if (!text) {
        throw new Error("Gemini no devolvió texto. Intenta grabar la pregunta con más claridad.");
      }
      return text;
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_ATTEMPTS && isTransientError(err)) {
        // Espera 4 s antes del reintento.
        await new Promise((resolve) => setTimeout(resolve, 4000));
        continue;
      }
      break;
    }
  }

  // Si llegamos acá, falló definitivamente. Mapeo a un mensaje en
  // español claro, sin JSON crudo en la UI.
  const detail = describeError(lastErr);
  const lower = detail.toLowerCase();
  if (
    lower.includes("api key") ||
    lower.includes("auth") ||
    lower.includes("credential") ||
    lower.includes("permission") ||
    lower.includes("401") ||
    lower.includes("403")
  ) {
    throw new Error(`API Key rechazada por Gemini: ${detail}`);
  }
  if (lower.includes("quota") || lower.includes("429") || lower.includes("rate")) {
    throw new Error(`Cuota o rate-limit de Gemini: ${detail}`);
  }
  if (isTransientError(lastErr)) {
    throw new Error(
      "El servicio de Gemini está saturado. Reintentá en unos minutos. " +
        `Detalle: ${detail}`
    );
  }
  if (lower.includes("network") || lower.includes("fetch") || lower.includes("econn") || lower.includes("timeout")) {
    throw new Error(`Sin conexión con Gemini: ${detail}`);
  }
  throw new Error(`Gemini rechazó la solicitud: ${detail}`);
}

/**
 * Transcribe LITERALMENTE el audio a texto (español rioplatense).
 *
 * Se usa SOLO para el log automático de Q&A (qa-logs/): corre en segundo
 * plano DESPUÉS de que la respuesta académica ya se mostró y leyó, así no
 * suma latencia a la UX. Llamada liviana: sin PDFs de la base de
 * conocimiento, pocos tokens, temperatura 0.
 *
 * Devuelve la transcripción verbatim (sin timecodes ni etiquetas de
 * hablante). Lanza si Gemini no devuelve texto — el llamador debe hacer
 * fallback a guardar el log sin transcripción, nunca mostrar error al alumno.
 */
/**
 * Prompt de transcripción: reforzado para impedir razonamiento verbal.
 * Lo que va entre `<<T>>...<</T>>` es lo único que la app va a leer;
 * si el modelo "piensa en voz alta", esa parte queda afuera.
 */
const TRANSCRIBE_INSTRUCTION =
  "Tu ÚNICA tarea es transcribir LITERALMENTE el audio adjunto al texto, en español.\n" +
  "REGLA ABSOLUTA: tu respuesta completa debe consistir EXCLUSIVAMENTE en la transcripción, " +
  "encerrada entre los marcadores `<<T>>` y `<</T>>`. No escribas nada fuera de esos marcadores.\n" +
  "PROHIBIDO terminantemente incluir: razonamientos, justificaciones, verificaciones, " +
  "frases del estilo 'Let's verify', 'Wait', 'I hear', 'Escucho', 'Verifico', " +
  "'Let me check', 'Let me re-listen', 'He says', 'He spells', 'Audio contents', " +
  "'Let's transcribe verbatim', 'Let's write', prefijos tipo 'Transcripción:', " +
  "markdown, viñetas, timecodes o etiquetas de hablante.\n" +
  "Si hay fragmentos inaudibles, márcalos con [inaudible] dentro del bloque.\n" +
  "Ejemplo de output válido:\n<<T>>¿Qué droga facilita la adhesión a GABA? 1. Benzodiazepinas. 2. Ansiolíticos. 3. Antipsicóticos.<</T>>";

/**
 * Saca el contenido entre los marcadores `<<T>>` y `<</T>>`.
 * Si no aparecen, devuelve el texto completo (fallback).
 */
function extractTranscriptBlock(text: string): string | null {
  const m = text.match(/<<T>>([\s\S]*?)<<\/T>>/);
  return m ? m[1].trim() : null;
}

/**
 * Filtro defensivo de la transcripción: descarta líneas que parecen
 * razonamiento del modelo ("Let's...", "Wait...", "He says...", etc.)
 * y se queda con el contenido limpio. Se aplica DESPUÉS de `sanitizeResponseText`.
 *
 * Si el prompt se cumplió y el output viene limpio, devuelve el texto tal cual.
 * Si el modelo igual filtró ruido, intenta reconstruir la pregunta real
 * descartando las líneas de "thinking".
 */
export function cleanTranscript(raw: string): string {
  if (!raw) return raw;

  // 1) Si el modelo respetó los marcadores `<<T>>`, usar eso directamente.
  const block = extractTranscriptBlock(raw);
  const source = block ?? raw;

  const lines = source
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length <= 1) return source.trim();

  // 2) Patrones que delatan razonamiento verbal del modelo. Si la línea
  //    empieza con alguno de estos prefijos (en ES o EN), la descartamos.
  const reasoningPrefixes = [
    "let's", "let me", "now,", "now ", "wait", "wait,",
    "first,", "ok,", "okay,", "yes,", "sure,",
    "listen", "i hear", "i need", "i should",
    "the user", "audio contents", "audio:",
    "verify", "verifico", "escucho", "verific",
    "he says", "he spells", "he reads", "he literally",
    "she says", "she spells",
    "let's transcribe", "let's verify", "let's check",
    "let's write", "let's listen", "let's carefully",
    "let's double", "let's re", "let's re-listen",
    "transcripción:", "transcripcion:", "respuesta:",
    "carefully", "double check", "double-check",
    "i'll", "i will",
  ];

  const isReasoning = (line: string): boolean => {
    const lower = line.toLowerCase();
    return reasoningPrefixes.some((p) => lower.startsWith(p));
  };

  const cleaned = lines.filter((l) => !isReasoning(l));

  if (cleaned.length === 0) {
    // Nada sobrevivió: devolvemos el bloque original como último recurso.
    return source.trim();
  }

  // 3) Si después de filtrar todavía quedan varias líneas, preferir las que
  //    parezcan pregunta real (empiezan con ¿, o contienen ?  cerca del final,
  //    o empiezan con mayúscula + verbo interrogativo típico, o listan opciones
  //    numeradas tipo "1. X. 2. Y.").
  const looksLikeQuestion = (line: string): boolean => {
    if (line.startsWith("¿")) return true;
    if (/\?\s*(\d+\.|[\s"])/.test(line)) return true;
    if (/^\d+\.\s+\S/.test(line)) return true;
    if (/^[A-ZÁÉÍÓÚÑ][^.]*\?/.test(line)) return true;
    return false;
  };

  const questionLines = cleaned.filter(looksLikeQuestion);
  if (questionLines.length > 0) {
    return questionLines.join(" ").replace(/\s+/g, " ").trim();
  }

  // 4) Si ninguna línea parece pregunta, devolver la línea más larga
  //    (suele ser la transcripción verbatim).
  return cleaned.reduce((a, b) => (b.length > a.length ? b : a), "").trim();
}

export async function transcribeAudio(
  base64Audio: string,
  mimeType: string,
  apiKey: string
): Promise<string> {
  const cleanKey = apiKey.trim();
  if (!cleanKey || cleanKey === "TU_API_KEY_AQUI") {
    throw new Error("Sin API Key para transcribir.");
  }
  const ai = new GoogleGenAI({ apiKey: cleanKey });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        parts: [
          { inlineData: { mimeType, data: base64Audio } },
          { text: TRANSCRIBE_INSTRUCTION },
        ],
      },
    ],
    config: {
      maxOutputTokens: 600,
      temperature: 0,
      thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
    },
  });
  const sanitized = sanitizeResponseText((response?.text ?? "").trim());
  if (!sanitized) {
    throw new Error("Transcripción vacía.");
  }
  const cleaned = cleanTranscript(sanitized);
  return cleaned;
}

/** Cuenta palabras separadas por espacios (igual criterio que la UI). */
export function countWords(text: string): number {
  const t = (text ?? "").trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

/**
 * Ampliación automática: DEPRECADA en esta versión.
 *
 * El system prompt actual exige respuestas CORTAS (40-150 palabras, máximo
 * 200), por lo que NO corresponde ampliar. Esta función se conserva para
 * mantener la firma exportada (App.tsx ya no la invoca) y devuelve el
 * texto previo sin modificar.
 */
export async function expandAnswer(
  previousAnswer: string,
  _apiKey: string,
  _onProgress?: (msg: string) => void
): Promise<string> {
  return previousAnswer;
}
