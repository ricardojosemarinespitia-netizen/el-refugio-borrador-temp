// ================================================================
//  CONTENIDO DE EL REFUGIO (Hotmart, curso 5838211 · 29 módulos)
//  Todo lo que se ve dentro de la zona vive aquí.
//  Para llenar un audio: pegar el enlace de SoundCloud entre las comillas,
//  así: "https://api.soundcloud.com/tracks/ID". Para un video: YouTube o Wistia.
//  Lo que quede vacío ("") se muestra como "Muy pronto".
//  Qué archivo va en cada clave: ver AUDIOS.md. Lo que falta: ver PENDIENTES.md.
//  Los textos de Nanalú van LITERALES, palabra por palabra.
// ================================================================

window.REFUGIO_CONTENIDO = {

  // ---------- Módulo 1 · BIENVENIDA ----------
  // Texto literal copiado de Hotmart (Saludo de Nanalú) el 2026-11-21. No se parafrasea.
  bienvenida: {
    titulo: "Saludo de Nanalú",
    encabezado: "Bienvenida a El Refugio",
    parrafos: [
      "Este es tu espacio seguro para volver a la calma, a la claridad y al vínculo vivo con tu ser amado.",
      "Aquí no se trata de apresurarte ni de exigirte, sino de ofrecerte un sostén real para tu cuerpo, tu corazón y tu mente, mientras poco a poco vuelves a sentirte en paz.",
      "Cada práctica, cada palabra y cada ritual han sido creados para acompañarte a equilibrar tu sistema nervioso, recuperar vitalidad y recordar que, incluso en medio del dolor, hay un refugio profundo que siempre te sostiene: la vida y el amor que nunca terminan.",
      "Recuerda: no estás sola, este es un viaje acompañado. Aquí encontrarás guía, sostén y un espacio sagrado donde tu proceso es bienvenido tal como es.",
      "🌿 Respira hondo, entra con confianza y permite que El Refugio te envuelva.",
      "Bienvenida a tu propio retorno a la calma.",
      "📩 Y si tienes alguna duda, dificultad técnica o necesitas soporte con tu acceso, puedes escribirnos a contacto@matrizdevida.com",
      "Gracias por confiar en este proceso. Recuerda que no estás sol@. Estamos contigo, paso a paso. 🌿"
    ],
    firma: ["Con todo mi amor,", "Nanalú y el equipo de Matriz de Vida"]
  },

  // ---------- Módulo 2 · ENCUENTRO TERAPÉUTICO (videos de Hotmart, faltan los archivos) ----------
  encuentro: [
    { titulo: "Encuentro inicial", duracion: "12:53", video: "" },               // PENDIENTE: video de Hotmart / Nanalú
    { titulo: "Los pilares que nos sostienen", duracion: "16:29", video: "" },   // PENDIENTE
    { titulo: "Plan de acción", duracion: "10:22", video: "" }                   // PENDIENTE
  ],

  // ---------- Módulo 3 · MATERIALES CLAVE ----------
  // Las imágenes son páginas de Guia-El-Refugio.pdf (la guía nueva que mandó Nanalú).
  materiales: [
    { clave: "guia", titulo: "Guía general", detalle: "La guía completa de El Refugio, para leer o imprimir.",
      tipo: "pdf", enlace: "/el-refugio-borrador-temp/materiales/guia-el-refugio.pdf", mini: "/el-refugio-borrador-temp/materiales/guia-portada-mini.jpg", boton: "Abrir la guía" },
    { clave: "acciones", titulo: "Acciones diarias", detalle: "Guía de pasos para el cuidado de tu sistema nervioso.",
      tipo: "imagen", enlace: "/el-refugio-borrador-temp/materiales/acciones-diarias.jpg", mini: "/el-refugio-borrador-temp/materiales/acciones-diarias-mini.jpg" },
    { clave: "checklist", titulo: "Checklist imprimible", detalle: "Una hoja por semana.",
      tipo: "imagenes", imagenes: [
        { titulo: "Semana 1 · Sembramos", enlace: "/el-refugio-borrador-temp/materiales/checklist-semana-1.jpg", mini: "/el-refugio-borrador-temp/materiales/checklist-semana-1-mini.jpg" },
        { titulo: "Semana 2 · Nutrimos", enlace: "/el-refugio-borrador-temp/materiales/checklist-semana-2.jpg", mini: "/el-refugio-borrador-temp/materiales/checklist-semana-2-mini.jpg" },
        { titulo: "Semana 3 · Integramos", enlace: "/el-refugio-borrador-temp/materiales/checklist-semana-3.jpg", mini: "/el-refugio-borrador-temp/materiales/checklist-semana-3-mini.jpg" }
      ] },
    // Archivo local: EXPORT-SYSTEME-2026-10-02/medios/478495-el-refugio-nuevo/08-1-saludo-al-sol--720.mp4 (06:24). Subir a YouTube/Wistia.
    { clave: "saludo-sol", titulo: "Saludo al sol", duracion: "06:23", detalle: "", tipo: "video", enlace: "" }
  ],

  // ---------- Las tres semanas (nombre y lema: literales de la guía, pág. 5) ----------
  // Cada semana abre con su módulo ESCANEO Y RESTAURACIÓN.
  // audio vacío = "Muy pronto". Qué archivo va: ver AUDIOS.md.
  semanas: [
    { numero: 1, nombre: "Sembramos", lema: "Tu cuerpo empieza a salir de la alerta.", foco: "cuerpo",
      escaneo: {
        explicacion: { titulo: "Explicación", duracion: "06:27", audio: "" },           // PENDIENTE: no existe en Systeme
        general:     { titulo: "Ejercicio de escaneo general", duracion: "02:46", audio: "" }, // sem1-escaneo-general → B/06-2-capsulas--3.EscaneoGeneral.mp3
        simpatico:   { duracion: "07:46", audio: "" },   // PENDIENTE versión nueva (la vieja: B/06-3 Dia1snsR, 09:42)
        dorsal:      { duracion: "08:25", audio: "" },   // PENDIENTE versión nueva (la vieja: B/06-4 DIA1SndR, 08:37)
        ventral:     { duracion: "07:46", audio: "" }    // PENDIENTE versión nueva (la vieja: B/06-5 dia1snvR, 09:37)
      } },
    { numero: 2, nombre: "Nutrimos", lema: "La calma empieza a echar raíces.", foco: "mente",
      escaneo: {
        general:   { titulo: "Ejercicio de escaneo general", duracion: "02:46", audio: "" }, // B/06-2 EscaneoGeneral.mp3 (el mismo de las 3 semanas)
        simpatico: { duracion: "06:56", audio: "" },   // B/27-1-capsulas-dia-8--dia8snsR.mp3
        dorsal:    { duracion: "05:59", audio: "" },   // B/27-2-capsulas-dia-8--dia8sndR.mp3
        ventral:   { duracion: "05:18", audio: "" }    // PENDIENTE versión nueva (la vieja: B/27-3 Dia8snv, 06:56)
      } },
    { numero: 3, nombre: "Integramos", lema: "La paz y el vínculo se vuelven tuyos.", foco: "cuerpo emocional",
      escaneo: {
        general:   { titulo: "Ejercicio de escaneo general", duracion: "02:46", audio: "" }, // B/06-2 EscaneoGeneral.mp3
        simpatico: { duracion: "07:56", audio: "" },   // B/45-1-capsulas-dia-14--Dia14snsR.mp3
        dorsal:    { duracion: "06:56", audio: "" },   // B/45-2-capsulas-dia-14--dia14sndR.mp3
        ventral:   { duracion: "07:52", audio: "" }    // B/45-3-capsulas-dia-14--dia14snv.mp3
      } }
  ],

  // ---------- Las 7 cápsulas del día (las mismas en las tres semanas) ----------
  // dia-1 sirve para los días 1, 8 y 15; dia-2 para 2, 9 y 16; … dia-7 para 7, 14 y 21.
  capsulasDia: {
    "dia-1": { duracion: "16:11", audio: "" },  // A/10-1-dia-1--capsuladia1RN.mp3
    "dia-2": { duracion: "13:20", audio: "" },  // A/12-1-dia-2--capsuladia2RN.mp3
    "dia-3": { duracion: "14:29", audio: "" },  // B/51-1-dia-17--capsula3RN.mp3
    "dia-4": { duracion: "13:57", audio: "" },  // B/53-1-dia-18--capsuladia4RN.mp3
    "dia-5": { duracion: "13:47", audio: "" },  // B/55-1-dia-19--Capsuladia5RN.mp3
    "dia-6": { duracion: "17:26", audio: "" },  // B/57-1-dia-20--capsuladia6RN.mp3
    "dia-7": { duracion: "20:48", audio: "" }   // B/59-1-dia-21--capsuladia7RN.mp3
  },

  // ---------- Las noches (las mismas en las tres semanas) ----------
  // noche-1: solo la Noche 1 · noche-2..noche-7: noches 2-7, 9-14, 16-21
  // noche-cierre: noches 8 y 15 (cierre de semana) · noche-unidad: la Noche de Unidad (después del Día 21)
  noches: {
    "noche-1":      { titulo: "Noche 1",       audio: "" },  // A/09-2-noche-1--NOCHEINICIO.mp3
    "noche-2":      { audio: "" },                           // A/11-1-noche-2--NOCHE2-1.mp3
    "noche-3":      { audio: "" },                           // B/50-1-noche-17--NOCHE3-1.mp3
    "noche-4":      { audio: "" },                           // B/52-1-noche-18--NOCHE4.mp3
    "noche-5":      { audio: "" },                           // B/54-1-noche-19--NOCHE5-1.mp3
    "noche-6":      { audio: "" },                           // B/56-1-noche-20--NOCHE6.mp3
    "noche-7":      { audio: "" },                           // B/58-1-noche-21--NOCHE7.mp3
    "noche-cierre": { audio: "" },                           // A CONFIRMAR: B/46-1-noche-15--NOCHE15.mp3 (Hotmart: Noche 8 11:13, Noche 15 11:23)
    "noche-unidad": { titulo: "Noche de Unidad", audio: "" } // PENDIENTE: confirmar con Nanalú qué audio es
  },

  // ---------- 7 momentos clave del viaje (literales de la guía, pág. 15) ----------
  // momentos[0] acompaña los días 1, 8 y 15; momentos[6] los días 7, 14 y 21.
  momentos: [
    "Hoy me permito sentir y recuerdo que no estoy solo, que no estoy sola en esto.",
    "Hoy recuerdo que soy más que un cuerpo: soy espíritu, y así también lo es quien amo.",
    "Hoy cultivo la certeza de que al amor verdadero nada lo puede amenazar.",
    "Hoy me rindo a una verdad mayor: descanso en Dios, y mi ser amado también.",
    "Hoy decido ver desde el alma y no desde el miedo.",
    "Hoy dejo espacio a los milagros: la paz es posible incluso aquí.",
    "Hoy lleno de oro a mi ser amado y recibo esas bendiciones para mí también. Entrego lo vivido al Amor y celebro la libertad del alma."
  ],

  // ---------- Así es el recorrido (literal de la guía, pág. 5) ----------
  recorrido: {
    noche: { titulo: "15 minutos en la noche", texto: "Siembras. Todo empieza en la noche, como la semilla que se entrega a la tierra." },
    dia:   { titulo: "15 minutos en el día", texto: "Lo sembrado crece, con la labor del día y el cuidado de tu sistema nervioso." },
    semanas: "Una misma semana, vivida tres veces"
  },

  // ---------- Módulo 29 · BONOS (3 en Hotmart, sin leer todavía) ----------
  // Llenar titulo, detalle y tipo/enlace cuando se lean en Hotmart o los mande Nanalú.
  bonos: [
    { titulo: "", detalle: "", tipo: "audio", enlace: "" },
    { titulo: "", detalle: "", tipo: "audio", enlace: "" },
    { titulo: "", detalle: "", tipo: "audio", enlace: "" }
  ]
};
