/* El Refugio · calendario de cada persona
   Funciona igual en el navegador (window.RefugioCalendario) y en Node (require), para poder probarlo.

   Cómo se cuenta (con la fecha que eligió la persona, "fecha_inicio"):
     paso 0  = NOCHE 1 ........................ se abre el día de fecha_inicio
     paso 1  = DÍA 1 y NOCHE 2 ................. se abre fecha_inicio + 1 día
     ...
     paso 21 = DÍA 21 y NOCHE de Unidad ........ se abre fecha_inicio + 21 días
   Cada paso se abre a las 00:00 de su fecha, en la hora del teléfono de la persona.
   Semana 1 = días 1-7 (más la Noche 1), semana 2 = días 8-14, semana 3 = días 15-21.
   Una vez abierto, un paso queda abierto para siempre. */
(function (raiz) {
  var TOTAL_DIAS = 21;
  var DIAS_SEMANA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
    "septiembre", "octubre", "noviembre", "diciembre"];

  function fechaLarga(d) { return DIAS_SEMANA[d.getDay()] + " " + d.getDate() + " de " + MESES[d.getMonth()]; }
  function fechaCorta(d) { return d.getDate() + " " + MESES[d.getMonth()].slice(0, 3); }
  function mismoDia(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  function iso(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  function esFechaISO(t) { return /^\d{4}-\d{2}-\d{2}$/.test(String(t || "")); }

  // Semana de un paso (la Noche 1 pertenece a la semana 1)
  function semanaDe(n) { return n <= 7 ? 1 : n <= 14 ? 2 : 3; }
  // Posición dentro de la semana (1..7); la Noche 1 no tiene posición de día
  function posicionDe(n) { return n === 0 ? 0 : ((n - 1) % 7) + 1; }
  // Clave del audio de la noche que acompaña al paso n
  //   n=0 → noche-1 · posición 1..6 → noche-2..noche-7 · posición 7 → noche-cierre (noches 8 y 15) · n=21 → noche-unidad
  function claveNoche(n) {
    if (n === 0) return "noche-1";
    if (n === TOTAL_DIAS) return "noche-unidad";
    var k = posicionDe(n);
    return k === 7 ? "noche-cierre" : "noche-" + (k + 1);
  }
  function claveDia(n) { return n === 0 ? "" : "dia-" + posicionDe(n); }

  // ---- Límites para elegir la fecha (mínimo hoy, máximo hoy + 60) ----
  var MAX_DIAS_ESPERA = 60;
  function limitesFecha(ahora) {
    ahora = ahora || new Date();
    var hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    return { min: iso(hoy), max: iso(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + MAX_DIAS_ESPERA)) };
  }
  function fechaValida(t, ahora) {
    if (!esFechaISO(t)) return false;
    var l = limitesFecha(ahora);
    return t >= l.min && t <= l.max;
  }

  // ---- El calendario de una persona ----
  // fechaInicio: "AAAA-MM-DD" o null · verTodo: true = todo abierto (Nanalú y pruebas)
  function crear(fechaInicio, verTodo) {
    if (!esFechaISO(fechaInicio)) {
      if (!verTodo) return null;                       // sin fecha: no se abre nada
      fechaInicio = iso(new Date());                    // ver_todo sin fecha: se cuenta desde hoy, todo abierto
    }
    var p = String(fechaInicio).split("-").map(Number);
    var y = p[0], m = p[1] - 1, d = p[2];

    function apertura(n) { return new Date(y, m, d + n, 0, 0, 0); }

    return {
      fechaInicio: fechaInicio,
      verTodo: !!verTodo,
      apertura: apertura,
      abierto: function (n, ahora) {
        if (n < 0 || n > TOTAL_DIAS) return false;
        if (verTodo) return true;
        return (ahora || new Date()) >= apertura(n);
      },
      // -1 = todavía no comienza · 0 = Noche 1 · 1..21 = día
      pasoActual: function (ahora) {
        ahora = ahora || new Date();
        var actual = -1;
        for (var n = 0; n <= TOTAL_DIAS; n++) { if (ahora >= apertura(n)) actual = n; else break; }
        return actual;
      },
      terminado: function (ahora) { return (ahora || new Date()) >= apertura(TOTAL_DIAS + 1); },
      diasParaComenzar: function (ahora) {
        ahora = ahora || new Date();
        var hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        return Math.round((apertura(0) - hoy) / 86400000);
      },
      // ¿Todavía puede cambiar su fecha? Solo antes de que se abra la Noche 1
      puedeCambiarFecha: function (ahora) { return (ahora || new Date()) < apertura(0); },
      textoApertura: function (n, ahora) {
        ahora = ahora || new Date();
        var a = apertura(n);
        var manana = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);
        if (mismoDia(a, ahora)) return "hoy";
        if (mismoDia(a, manana)) return "mañana, " + fechaLarga(a);
        return "el " + fechaLarga(a);
      }
    };
  }

  var API = {
    TOTAL_DIAS: TOTAL_DIAS,
    MAX_DIAS_ESPERA: MAX_DIAS_ESPERA,
    crear: crear,
    semanaDe: semanaDe,
    posicionDe: posicionDe,
    claveNoche: claveNoche,
    claveDia: claveDia,
    limitesFecha: limitesFecha,
    fechaValida: fechaValida,
    fechaLarga: fechaLarga,
    fechaCorta: fechaCorta,
    mismoDia: mismoDia,
    iso: iso,
    DIAS_SEMANA: DIAS_SEMANA,
    MESES: MESES
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else raiz.RefugioCalendario = API;
})(typeof window !== "undefined" ? window : this);
