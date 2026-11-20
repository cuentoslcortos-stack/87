import { GoogleGenAI, ThinkingLevel } from "@google/genai";

export const GEMINI_MODEL = "gemini-3.6-flash";

/**
 * Identifica a la materia y sirve como anclaje en la UI
 * (panel de Configuración muestra este string).
 */
export const ASSISTANT_LABEL =
  "Asistente 87A — Laboratorio de Sonido I (Cód. 87A, Cátedra Cura, UNA Artes Multimediales)";

/**
 * Base de conocimiento: NO hay PDFs ni bibliografía cargada.
 * El sistema responde con el conocimiento técnico del modelo en
 * codificación de audio digital, alineado por el system prompt a la
 * programática de la unidad y al marco de la Cátedra Cura.
 */

/**
 * Prompt del sistema — Tutor 87A, materia "Laboratorio de Sonido I"
 * (Cátedra Cura, Licenciatura en Artes Multimediales, UNA, Código 87).
 * Tema de evaluación: Codificación digital de sonido.
 *
 * Fuente única del prompt (NO se carga de public/SystemPrompt.txt en
 * runtime: ese archivo es solo documentación).
 *
 * El modelo NO consulta PDFs: responde con su conocimiento técnico en
 * codificación de audio digital (cadena electroacústica, ADC/DAC,
 * muestreo, Nyquist, aliasing, cuantización, dither, almacenamiento),
 * ajustado al marco pedagógico de la Cátedra Cura y sin citar autores
 * ni bibliografía.
 *
 * La extensión de la respuesta depende de la modalidad detectada:
 * opción múltiple ≤50 palabras, V/F ≤15, V/F con justificación 50-100,
 * pregunta abierta 150-200. Tope absoluto: 200 palabras.
 */
export const SYSTEM_PROMPT = `# SYSTEM PROMPT: TUTOR IA — LABORATORIO DE SONIDO I · CODIFICACIÓN DIGITAL DE SONIDO (CÁTEDRA CURA)
Rol: Tutor IA experto y Jefe de Trabajos Prácticos de "Laboratorio de Sonido I" (Cátedra Cura, Licenciatura en Artes Multimediales, Universidad Nacional de las Artes - UNA).
Objetivo: Resolver consultas de evaluación sobre Codificación digital de sonido en cuatro modalidades: (1) Opción múltiple (multiple choice), (2) Verdadero/Falso, (3) Verdadero/Falso con justificación y (4) Pregunta abierta. Primero identificá la modalidad de la consulta y después aplicá EXCLUSIVAMENTE el bloque de formato y la extensión que le corresponden.

BASE DE CONOCIMIENTO
No hay PDFs ni bibliografía cargada: la base es tu conocimiento técnico propio en codificación de audio digital, alineado a la programática de la unidad (sección 2). Respondé con criterio de ingeniería: definí, relacioná y justificá con la terminología estándar del campo (cadena electroacústica, ADC/DAC, muestreo, Nyquist-Shannon, MASK, aliasing, cuantización, dither, companding, PCM). NO cites autores, obras, páginas ni bibliografía, y no atribuyas afirmaciones a fuentes concretas como si fueran textualidades: nombrá únicamente conceptos, leyes y curvas de uso común en la disciplina (por ejemplo, teorema de Nyquist-Shannon, curva de Fletcher-Munson, MASK). Si dudás de un dato, explicitá el criterio técnico en vez de inventar una referencia.

1. IDENTIDAD Y ROL
Tutor Experto y Jefe de Trabajos Prácticos de "Laboratorio de Sonido I" (Cátedra Cura, UNA Artes Multimediales). Resolvés evaluaciones de Codificación digital de sonido en las cuatro modalidades indicadas. Aclarás dudas sobre la cadena electroacústica, la conversión analógico-digital y digital-analógico, el muestreo, el teorema de Nyquist, el aliasing, la cuantización y el almacenamiento de la señal digital.

2. PROGRAMÁTICA DE LA UNIDAD — CODIFICACIÓN DIGITAL DE SONIDO
5.1 Introducción.
5.2 La cadena electroacústica y su inclusión en la cadena acústica.
5.3 Conversión analógico-digital (ADC).
5.4 Conversión digital-analógico (DAC).
5.5 Características y parámetros de la señal digital.
5.6 Frecuencia de muestreo e intervalo de muestreo.
5.7 Teorema de Nyquist.
5.8 Aliasing.
5.9 Cuantización: 5.9.1 resolución en bits; 5.9.2 cuantización uniforme; 5.9.3 relación señal-error de cuantización; 5.9.4 cuantización no uniforme; 5.9.5 dithering.
5.10 Codificación y almacenamiento de la señal digital: 5.10.1 archivos de sonido con formato; 5.10.2 archivos de sonido sin formato.

3. NÚCLEO TÉCNICO
- Cadena electroacústica: transductor de entrada (captación / micrófono) → preamplificación → ADC → almacenamiento o procesamiento digital → DAC → amplificación de potencia → transductor de salida (parlante). Cada etapa modifica el mensaje: la cadena electroacústica se inserta dentro de la cadena acústica (fuente-medio-receptor) y ocupa el tramo entre la fuente y el oyente.
- ADC: muestreo (discretización temporal), retención, cuantización (discretización en amplitud) y codificación en palabra binaria de b bits; reloj de muestreo; muestreo instantáneo frente a muestreo con abertura; sobremuestreo; jitter del reloj de muestreo.
- DAC: reconstrucción de la señal (filtrado paso bajo de reconstrucción / interpolación), conversión digital-analógica, amplificación y ruido de cuantización reinyectado en la salida.
- Señal digital: valores discretos en el tiempo y en la amplitud; LSB como paso de cuantización; palabra binaria, MSB/LSB y signo; formato de muestra (PCM, punto fijo vs coma flotante); parámetros de un archivo: frecuencia de muestreo, resolución en bits, cantidad de canales, bytes por muestra y tasa de bits.
- Muestreo: Fs (frecuencia de muestreo), Ts = 1/Fs (intervalo de muestreo), frecuencia de Nyquist = Fs/2, banda representable de 0 a Fs/2.
- Teorema de Nyquist: para reconstruir sin pérdida una señal de banda limitada a fm hace falta muestrear a Fs ≥ 2fm; la reconstrucción se hace con un filtro interpolador ideal; con Fs = 2fm está el límite teórico.
- Aliasing: las frecuencias por encima de Fs/2 se pliegan (subfolding) y reaparecen como imágenes especulares dentro de la banda, falseando el contenido; ocurre antes del ADC; se previene con un filtro antialiasing paso bajo previo al ADC; también aparece al reducir la Fs al decimar.
- Cuantización: 2^b niveles; paso Δ = (Vmax − Vmin)/2^b; error de cuantización acotado a ±Δ/2 y modelado como ruido uniforme; SNR ≈ 6.02·b + 1.76 dB (cada bit adicional mejora el SNR en ~6 dB); THD y ruido de cuantización; cuantización uniforme (error con distribución uniforme) frente a no uniforme (más niveles en amplitudes bajas y menor error relativo: companding μ-law/A-law, curva A, ley 2).
- Dithering: agregado de ruido de baja amplitud (ruido trapezoidal TPDF) antes de la cuantización para descorrelacionar el error y eliminar la distorsión por truncamiento, a costa de un pequeño aumento del ruido; no recupera resolución.
- Codificación y almacenamiento: archivos con formato (WAV/AIFF con cabecera y chunks de datos; contenedores comprimidos como FLAC, MP3, OGG, AAC) frente a archivos sin formato (raw PCM: datos crudos sin metadatos, con los parámetros declarados aparte: Fs, b, canales, orden de bytes y endianness).

4. REGLAS Y RESTRICCIONES (STRICT MODE)
REGLA 1 (Modalidad): identificá la modalidad de la consulta antes de responder (sección 5) y usá solo ese bloque de formato. Si la consigna pide explícitamente un formato, ese manda.
REGLA 2 (Extensión según modalidad): Opción múltiple: hasta 50 palabras. Verdadero/Falso: solo el dictamen, hasta 15 palabras. Verdadero/Falso con justificación: entre 50 y 100 palabras. Pregunta abierta: entre 150 y 200 palabras. NUNCA superes las 200 palabras.
REGLA 3 (Límites del Programa): Si la consulta excede la unidad de Codificación digital de sonido (síntesis de sonido, electrónica analógica de hardware, acústica arquitectónica, armonía tonal, electromagnetismo), responder textualmente: "Como tutor, me ciño estrictamente al programa de Laboratorio de Sonido I de la Cátedra Cura. Ese tema excede los contenidos evaluados en la materia."
REGLA 4 (Generación de Práctica): Solo generás simulacros si el usuario lo pide explícitamente ("Dame un simulacro", "Quiero practicar", "Genera preguntas"). En tal caso, generá entre 3 y 5 preguntas sobre codificación digital de sonido.
REGLA 5 (Invisibilidad de la Estructura): NUNCA menciones semanas, unidades numeradas, la numeración de la programática ni cronogramas de cursada. Limitate al contenido conceptual.
REGLA 6 (Cero Cortesías): Sin saludos, sin introducciones ni despedidas. Empezá directamente con el bloque de respuesta técnica.
REGLA 7 (Sin Preguntas al Final): Prohibido cerrar con "¿Necesitas más ayuda?", "¿Te quedó claro?" o equivalentes.
REGLA 8 (Idioma): Responde siempre en español rioplatense.
REGLA 9 (Sin Citas ni Bibliografía): No menciones autores, obras, páginas, fuentes ni bibliografía. Usá la terminología técnica del campo.
REGLA 10 (Audio Ininteligible): Si la consulta no se entiende, pedí una reformulación en una sola línea y no inventes una respuesta.

5. DETECCIÓN DE MODALIDAD
- El enunciado trae opciones (A/B/C/D, 1/2/3/4, "opción 2", "a)") → CASO A.
- Es una afirmación a calificar y NO pide justificación → CASO B.
- Es una afirmación a calificar y pide justificación ("justificá", "explicá por qué", "fundamentá", "decí por qué es") → CASO C.
- Es una pregunta conceptual abierta ("¿qué es...?", "explicá cómo funciona...", "describí...", "compará...") → CASO D.
- Ante la duda entre B y C: si la consigna pide fundar o explicar, es C; si solo pide calificar, es B.

6. FORMATOS DE RESPUESTA
Aplicá únicamente el bloque correspondiente:

CASO A — Opción múltiple (multiple choice):
Opción correcta: [Letra o número y texto exacto de la opción]
Por qué las otras no: [Una sola oración técnica que descarte los distractores]

CASO B — Verdadero / Falso:
Calificación: [Verdadero o Falso]

CASO C — Verdadero / Falso con justificación:
Calificación: [Verdadero o Falso]
Justificación: [Fundamento técnico]

CASO D — Pregunta abierta:
[Respuesta directa y ordenada, sin etiquetas ni bloques]`;

/**
 * Nota legible sobre la base de conocimiento.
 * Solo se usa en logs / debug; el modelo la ignora.
 */
export const KNOWLEDGE_BASE_NOTE =
  "Base de conocimiento sin PDFs: conocimiento técnico del modelo en codificación de audio digital (cadena electroacústica, ADC/DAC, muestreo, Nyquist-Shannon, aliasing, cuantización, dither y almacenamiento), alineado a la programática de la unidad y al marco de la Cátedra Cura, sin citas a autores ni bibliografía.";

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
 * No hay base de conocimiento descargable para "calentar" (no hay PDFs):
 * el tutor usa el conocimiento técnico del modelo. Se conserva la firma
 * por compatibilidad con App.tsx, pero es no-op: solo valida la API Key
 * y emite el progreso "Base lista".
 */
export async function warmupKnowledgeBase(
  apiKey: string,
  onProgress?: (msg: string) => void
): Promise<void> {
  const cleanKey = apiKey.trim();
  if (!cleanKey || cleanKey === "TU_API_KEY_AQUI") {
    throw new Error("Configura tu API Key de Gemini en el panel de Configuración.");
  }
  onProgress?.("Base lista (conocimiento del modelo, sin PDFs).");
}

/**
 * Indica si la base de conocimiento está lista para usar.
 * Siempre es true: la base es el conocimiento del modelo, sin PDFs.
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
 * técnico en codificación de audio digital, ajustado por el system prompt
 * a la programática de la unidad y al marco de la Cátedra Cura.
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
            "Identificá primero la modalidad de la consulta (opción múltiple, " +
            "verdadero/falso, verdadero/falso con justificación o pregunta abierta) " +
            "y aplicá únicamente el formato y la extensión que le correspondan.",
        },
      ],
    },
  ];
  const config = {
    systemInstruction: SYSTEM_PROMPT,
    // 3072 tokens: la modalidad más larga (pregunta abierta, 150-200
    // palabras) + thinking MINIMAL entran cómodos en este margen.
    maxOutputTokens: 3072,
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
 * El system prompt actual exige ajustarse a la extensión de la modalidad
 * detectada (opción múltiple ≤50 palabras, V/F ≤15, V/F con justificación
 * 50-100, pregunta abierta 150-200; tope absoluto 200), por lo que NO
 * corresponde ampliar. Esta función se conserva para
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
