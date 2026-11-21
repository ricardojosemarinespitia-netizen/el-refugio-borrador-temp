/* El Refugio · lógica compartida de la zona de estudio
   - Conexión con Supabase (sesión que se recuerda en el teléfono)
   - Guardia: sin sesión, manda a la entrada y luego devuelve al lugar exacto
   - Calendario por persona: cuenta desde participantes.fecha_inicio (la fecha que ella eligió)
     Si fecha_inicio está vacía, no se abre nada y se manda a /privado/comenzar.html
   - MODO DEMO: mientras js/config.js diga "PENDIENTE", no se conecta a nada y usa datos simulados
     (parámetros ?demo_inicio=AAAA-MM-DD|nulo &demo_ahora=AAAA-MM-DDTHH:MM &demo_ver_todo=1) */

(function () {
  var CFG = window.REFUGIO_CONFIG || {};
  var CAL = window.RefugioCalendario;
  var DEMO = /PENDIENTE/i.test(String(CFG.SUPABASE_URL || "")) || !CFG.SUPABASE_URL;

  var sb = null;
  if (!DEMO && window.supabase) {
    sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    });
  }

  // ---------- Modo demo (solo borrador local) ----------
  var CLAVE_DEMO = "refugio-demo";
  function leerDemo() {
    var e = {};
    try { e = JSON.parse(sessionStorage.getItem(CLAVE_DEMO) || "{}") || {}; } catch (x) { e = {}; }
    var q = new URLSearchParams(location.search);
    if (q.has("demo_inicio")) e.inicio = q.get("demo_inicio") === "nulo" ? null : q.get("demo_inicio");
    if (q.has("demo_ahora")) e.ahora = q.get("demo_ahora") || null;
    if (q.has("demo_ver_todo")) e.verTodo = q.get("demo_ver_todo") === "1";
    if (e.inicio === undefined) e.inicio = null;
    try { sessionStorage.setItem(CLAVE_DEMO, JSON.stringify(e)); } catch (x) { /* sin guardar */ }
    return e;
  }
  var demo = DEMO ? leerDemo() : null;

  // "Ahora": en demo se puede simular; en producción es la hora del teléfono
  function ahora() {
    if (demo && demo.ahora) {
      var d = new Date(demo.ahora);
      if (!isNaN(d)) return d;
    }
    return new Date();
  }

  // ---------- Utilidades ----------
  function escapar(t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  var PENDIENTE = '<span class="pendiente">[TEXTO PENDIENTE DE NANALÚ]</span>';

  // ---------- Sesión ----------
  function irAEntrada() {
    var destino = location.pathname + location.search + location.hash;
    location.replace("/el-refugio-borrador-temp/login.html?ir=" + encodeURIComponent(destino));
  }
  async function obtenerSesion() {
    if (DEMO) return { user: { id: "demo", email: "demo@ejemplo.com" } };
    if (!sb) return null;
    try {
      var r = await sb.auth.getSession();
      return r.data && r.data.session ? r.data.session : null;
    } catch (e) { return null; }
  }

  // Carga la ficha de la persona. Sin sesión → entrada.
  // Devuelve p con: nombre, activo, ver_todo, fecha_inicio, calendario (o null si no hay fecha)
  async function cargarParticipante() {
    var sesion = await obtenerSesion();
    if (!sesion) { irAEntrada(); return null; }

    var p;
    if (DEMO) {
      p = { nombre: "Ana María", email: "demo@ejemplo.com", activo: true, ver_todo: !!demo.verTodo, fecha_inicio: demo.inicio, zona_horaria: null };
    } else {
      var r = await sb.from("participantes")
        .select("nombre, email, activo, ver_todo, zona_horaria, fecha_inicio")
        .eq("user_id", sesion.user.id)
        .maybeSingle();
      if (r.error) {
        if (r.error.code === "PGRST301" || /JWT/i.test(r.error.message || "")) {
          await sb.auth.signOut(); irAEntrada(); return null;
        }
        throw r.error;
      }
      p = r.data;
      if (!p) return { sinFicha: true, email: sesion.user.email };
      // Guardar la zona horaria del teléfono para que los recordatorios lleguen a su hora
      try {
        var zona = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (zona && zona !== p.zona_horaria) sb.from("participantes").update({ zona_horaria: zona }).eq("user_id", sesion.user.id).then(function () {});
      } catch (e) { /* no pasa nada */ }
    }
    p.user_id = sesion.user.id;
    p.calendario = CAL.crear(p.fecha_inicio, p.ver_todo); // null si no hay fecha (y no es ver_todo)
    p.sinFecha = !p.calendario;
    p.primerNombre = (p.nombre || "").trim().split(/\s+/)[0] || "";
    return p;
  }

  // Guarda la fecha de inicio en la fila propia (RLS: solo su fila y solo esa columna)
  async function guardarFechaInicio(fechaISO) {
    if (!CAL.fechaValida(fechaISO, ahora())) throw new Error("fecha-fuera-de-rango");
    if (DEMO) {
      demo.inicio = fechaISO;
      try { sessionStorage.setItem(CLAVE_DEMO, JSON.stringify(demo)); } catch (x) { /* sin guardar */ }
      return true;
    }
    var sesion = await obtenerSesion();
    if (!sesion) { irAEntrada(); return false; }
    var r = await sb.from("participantes").update({ fecha_inicio: fechaISO }).eq("user_id", sesion.user.id).select("fecha_inicio");
    if (r.error) throw r.error;
    if (!r.data || !r.data.length) throw new Error("sin-fila");
    return true;
  }

  // Guardia común de las páginas privadas. Devuelve p o null (si ya redirigió o pintó un aviso).
  async function guardia(raiz, opciones) {
    opciones = opciones || {};
    var p;
    try { p = await cargarParticipante(); }
    catch (e) {
      raiz.innerHTML = '<div class="tarjeta centro"><p>No pudimos abrir tu espacio en este momento. Revisa tu conexión e intenta de nuevo.</p><button class="boton" type="button" onclick="location.reload()">Intentar de nuevo</button></div>';
      return null;
    }
    if (!p) return null;
    if (p.sinFicha || !p.activo) { raiz.innerHTML = mensajeAcceso(p); activarSalir(raiz); return null; }
    if (p.sinFecha && !opciones.permitirSinFecha) { location.replace("/el-refugio-borrador-temp/privado/comenzar.html"); return null; }
    return p;
  }

  async function salir() {
    if (DEMO) { try { sessionStorage.removeItem(CLAVE_DEMO); } catch (x) {} location.replace("/el-refugio-borrador-temp/login.html"); return; }
    if (sb) await sb.auth.signOut();
    location.replace("/el-refugio-borrador-temp/login.html");
  }

  // ---------- Reproductores ----------
  // Audios: SoundCloud ("https://api.soundcloud.com/tracks/ID"). Vacío = "Muy pronto".
  function audio(url, titulo) {
    if (!url) return '<div class="pronto" role="note"><span class="pronto-punto" aria-hidden="true"></span>Muy pronto</div>';
    var src = "https://w.soundcloud.com/player/?url=" + encodeURIComponent(url) +
      "&color=%2324452e&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false";
    return '<div class="audio-marco"><iframe height="130" scrolling="no" allow="autoplay" loading="lazy" src="' + escapar(src) + '" title="' + escapar(titulo || "Audio") + '"></iframe></div>';
  }
  function youtubeId(v) {
    var m = String(v || "").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
    return m ? m[1] : "";
  }
  function wistiaId(v) {
    var m = String(v || "").match(/(?:medias|iframe)\/([a-z0-9]+)/i);
    if (m) return m[1];
    return /^[a-z0-9]{6,}$/i.test(v || "") ? v : "";
  }
  // Videos: YouTube o Wistia. Vacío = "Muy pronto".
  function video(valor, titulo) {
    var yt = youtubeId(valor);
    if (yt) return '<div class="video-marco"><iframe src="https://www.youtube.com/embed/' + yt + '?playsinline=1&rel=0" allow="fullscreen; encrypted-media; picture-in-picture" allowfullscreen loading="lazy" title="' + escapar(titulo || "Video") + '"></iframe></div>';
    var id = wistiaId(valor);
    if (id) return '<div class="video-marco"><iframe src="https://fast.wistia.net/embed/iframe/' + escapar(id) + '?videoFoam=true" allow="fullscreen" allowfullscreen loading="lazy" title="' + escapar(titulo || "Video") + '"></iframe></div>';
    return '<div class="pronto" role="note"><span class="pronto-punto" aria-hidden="true"></span>Muy pronto</div>';
  }

  // ---------- Piezas comunes ----------
  function enlaceAyuda() {
    if (!CFG.WHATSAPP_AYUDA) return "";
    return '<a href="https://wa.me/' + escapar(CFG.WHATSAPP_AYUDA) + '" target="_blank" rel="noopener">¿Necesitas ayuda? Escríbenos por WhatsApp</a>';
  }
  function pieHTML() {
    return '<footer class="pie">' +
      '<nav aria-label="Tu espacio"><a href="/el-refugio-borrador-temp/privado/inicio.html">Inicio</a>' +
      '<a href="/el-refugio-borrador-temp/privado/materiales.html">Materiales clave</a>' +
      '<a href="/el-refugio-borrador-temp/privado/contrasena.html">Cambiar mi contraseña</a>' +
      '<button class="enlace-simple" type="button" data-salir>Salir</button></nav>' +
      (enlaceAyuda() ? "<p>" + enlaceAyuda() + "</p>" : "") +
      (CFG.CORREO_SOPORTE ? '<p class="pie-soporte">Soporte: <a href="mailto:' + escapar(CFG.CORREO_SOPORTE) + '">' + escapar(CFG.CORREO_SOPORTE) + "</a></p>" : "") +
      "<p>El Refugio · Sistema terapéutico RESOLVER® · Matriz de Vida</p></footer>";
  }
  function activarSalir(raiz) {
    (raiz || document).querySelectorAll("[data-salir]").forEach(function (b) { b.addEventListener("click", salir); });
  }
  function mensajeAcceso(p) {
    if (p && p.sinFicha) {
      return '<div class="tarjeta centro"><h2>Estamos preparando tu espacio</h2>' +
        "<p>Tu cuenta existe, pero todavía no está lista. Escríbenos y lo resolvemos contigo.</p>" +
        (enlaceAyuda() ? "<p>" + enlaceAyuda() + "</p>" : "") +
        '<button class="boton contorno" data-salir type="button">Salir</button></div>';
    }
    return '<div class="tarjeta centro"><h2>Tu acceso no está activo</h2>' +
      "<p>Si crees que es un error, escríbenos y lo revisamos contigo.</p>" +
      (enlaceAyuda() ? "<p>" + enlaceAyuda() + "</p>" : "") +
      '<button class="boton contorno" data-salir type="button">Salir</button></div>';
  }
  // Aviso discreto de que es un borrador con datos simulados
  function avisoDemo() {
    if (!DEMO || document.getElementById("aviso-demo")) return;
    var d = document.createElement("div");
    d.id = "aviso-demo"; d.className = "aviso-demo"; d.setAttribute("role", "note");
    d.textContent = "Borrador local · datos simulados" + (demo.inicio ? " · inicio " + demo.inicio : " · sin fecha de inicio") + (demo.ahora ? " · hoy " + demo.ahora.slice(0, 10) : "") + (demo.verTodo ? " · ver todo" : "");
    document.body.appendChild(d);
  }
  if (DEMO) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", avisoDemo);
    else avisoDemo();
  }

  // Visor de imágenes (materiales): se abren encima de la página, con una equis para volver
  function activarVisor(raiz) {
    raiz.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("a.ver-grande");
      if (!a) return;
      ev.preventDefault();
      var href = a.getAttribute("href");
      var v = document.createElement("div");
      v.className = "visor"; v.setAttribute("role", "dialog"); v.setAttribute("aria-modal", "true"); v.setAttribute("aria-label", a.getAttribute("data-titulo") || "Imagen");
      v.innerHTML = '<button type="button" class="visor-cerrar" aria-label="Cerrar">×</button>' +
        '<img src="' + escapar(href) + '" alt="' + escapar(a.getAttribute("data-titulo") || "") + '">' +
        '<div class="visor-pie"><a class="boton" href="' + escapar(href) + '" download>Guardar imagen</a><button type="button" class="boton contorno-claro visor-volver">Volver</button></div>';
      function cerrar() { v.remove(); document.removeEventListener("keydown", tecla); a.focus(); }
      function tecla(e) { if (e.key === "Escape") cerrar(); }
      v.addEventListener("click", function (e) { if (e.target === v || e.target.classList.contains("visor-cerrar") || e.target.classList.contains("visor-volver")) cerrar(); });
      document.addEventListener("keydown", tecla);
      document.body.appendChild(v);
      v.querySelector(".visor-cerrar").focus();
    });
  }

  window.Refugio = {
    sb: sb,
    CFG: CFG,
    CAL: CAL,
    DEMO: DEMO,
    PENDIENTE: PENDIENTE,
    ahora: ahora,
    escapar: escapar,
    obtenerSesion: obtenerSesion,
    cargarParticipante: cargarParticipante,
    guardarFechaInicio: guardarFechaInicio,
    guardia: guardia,
    salir: salir,
    audio: audio,
    video: video,
    enlaceAyuda: enlaceAyuda,
    pieHTML: pieHTML,
    activarSalir: activarSalir,
    activarVisor: activarVisor,
    mensajeAcceso: mensajeAcceso
  };
})();
