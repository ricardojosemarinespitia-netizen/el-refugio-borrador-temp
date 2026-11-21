/* El Refugio · página de un paso del recorrido: /privado/dia.html?n=N
   n = 0  → NOCHE 1 (va sola, antes del Día 1)
   n = 1..21 → DÍA n y NOCHE n+1 (el 21: DÍA 21 y NOCHE de Unidad)
   Los audios de día y noche son los mismos en las tres semanas: se buscan por clave
   (RefugioCalendario.claveDia / claveNoche) en contenido.js, sin duplicar archivos. */
(async function () {
  var H = window.Refugio, CAL = H.CAL, C = window.REFUGIO_CONTENIDO, esc = H.escapar;
  var raiz = document.getElementById("contenido");

  var q = new URLSearchParams(location.search).get("n");
  var n = /^\d{1,2}$/.test(q || "") ? parseInt(q, 10) : NaN;
  if (isNaN(n) || n < 0 || n > CAL.TOTAL_DIAS) { location.replace("/el-refugio-borrador-temp/privado/inicio.html"); return; }

  var p = await H.guardia(raiz);
  if (!p) return;

  var cal = p.calendario, ahora = H.ahora();
  var paso = cal.pasoActual(ahora);
  var sNum = CAL.semanaDe(n), S = C.semanas[sNum - 1];
  var k = CAL.posicionDe(n);
  var nombrePaso = n === 0 ? "Noche 1" : "Día " + n;
  var nombreNoche = n === 0 ? "Noche 1" : (n === CAL.TOTAL_DIAS ? "Noche de Unidad" : "Noche " + (n + 1));
  document.title = nombrePaso + " · El Refugio";

  var cabecera = '<div class="dia-cabecera"><span class="rotulo">Semana ' + sNum + " · " + esc(S.nombre) + "</span>" +
    "<h1>" + nombrePaso + (n > 0 ? ' <span class="suave" style="font-size:.5em;font-style:italic">y ' + nombreNoche + "</span>" : "") + "</h1>" +
    '<p class="semana-lema">' + esc(S.lema) + "</p></div>";

  // ---------- Paso todavía cerrado ----------
  if (!cal.abierto(n, ahora)) {
    raiz.innerHTML = cabecera +
      '<section class="tarjeta dia-cerrado"><span class="rotulo">Todavía no</span>' +
      '<p class="cuando">Este paso se abre ' + esc(cal.textoApertura(n, ahora)) + ".</p>" +
      '<p class="suave italica">Un día a la vez. ' + H.PENDIENTE + "</p>" +
      (paso >= 0
        ? '<a class="boton grande" href="/el-refugio-borrador-temp/privado/dia.html?n=' + paso + '">Volver a mi día de hoy</a>'
        : '<a class="boton grande" href="/el-refugio-borrador-temp/privado/inicio.html">Volver al inicio</a>') +
      "</section>";
    raiz.insertAdjacentHTML("afterend", H.pieHTML());
    H.activarSalir();
    return;
  }

  var html = cabecera;

  // ---------- Momento clave del viaje (literal de la guía, uno por posición en la semana) ----------
  if (k > 0 && C.momentos[k - 1]) {
    html += '<figure class="momento-clave"><span class="rotulo">Momento clave · día ' + k + ' de la semana</span>' +
      "<p>“" + esc(C.momentos[k - 1]) + "”</p>" + '<span class="estrella" aria-hidden="true">✦</span></figure>';
  }

  // ---------- El día ----------
  if (n > 0) {
    var dia = C.capsulasDia[CAL.claveDia(n)] || {};
    html += '<section class="tarjeta bloque-practica" id="dia"><span class="rotulo">' + esc(C.recorrido.dia.titulo) + "</span>" +
      "<h2>Cápsula del día " + k + (dia.duracion ? ' <span class="duracion">' + esc(dia.duracion) + "</span>" : "") + "</h2>" +
      '<p class="intro">' + esc(C.recorrido.dia.texto) + "</p>" +
      H.audio(dia.audio, "Cápsula del día " + k) + "</section>";
  }

  // ---------- Escaneo y restauración de la semana ----------
  var E = S.escaneo || {};
  var cuerpoE = "";
  if (E.explicacion) {
    cuerpoE += '<div class="paso-escaneo"><h3>' + esc(E.explicacion.titulo) + ' <span class="duracion">' + esc(E.explicacion.duracion) + "</span></h3>" + H.audio(E.explicacion.audio, E.explicacion.titulo) + "</div>";
  }
  if (E.general) {
    cuerpoE += '<div class="paso-escaneo"><h3>' + esc(E.general.titulo) + ' <span class="duracion">' + esc(E.general.duracion) + "</span></h3>" + H.audio(E.general.audio, E.general.titulo) + "</div>";
  }
  var estados = [
    { clave: "simpatico", nombre: "Simpático" },
    { clave: "dorsal", nombre: "Dorsal" },
    { clave: "ventral", nombre: "Ventral" }
  ];
  cuerpoE += '<div class="paso-escaneo"><h3>Cápsulas de restauración</h3><div class="estados">' +
    estados.map(function (e) {
      return '<button type="button" class="estado" aria-expanded="false" aria-controls="panel-' + e.clave + '" data-estado="' + e.clave + '">' + e.nombre + "</button>";
    }).join("") + "</div>" +
    estados.map(function (e) { return '<div class="panel-estado" id="panel-' + e.clave + '"></div>'; }).join("") + "</div>";
  html += '<section class="tarjeta bloque-practica" id="escaneo"><span class="rotulo">Semana ' + sNum + " · " + esc(S.foco) + "</span>" +
    "<h2>Escaneo y restauración</h2>" + cuerpoE + "</section>";

  // ---------- La noche ----------
  var noche = C.noches[CAL.claveNoche(n)] || {};
  html += '<section class="caja-bosque bloque-practica" id="noche"><img class="mariposa-fondo" src="/el-refugio-borrador-temp/img/mariposa-crema.webp" alt="" width="241" height="197" aria-hidden="true">' +
    '<span class="rotulo">' + esc(C.recorrido.noche.titulo) + "</span>" +
    "<h2>" + nombreNoche + "</h2>" +
    '<p class="intro">' + esc(C.recorrido.noche.texto) + "</p>" +
    H.audio(noche.audio, nombreNoche) + "</section>";

  // ---------- Navegación ----------
  html += '<nav class="navegacion-dia" id="navegacion" aria-label="Entre días"></nav>';

  raiz.innerHTML = html;
  raiz.insertAdjacentHTML("afterend", H.pieHTML());
  H.activarSalir();

  // Cápsulas: se abre una a la vez
  raiz.querySelectorAll("[data-estado]").forEach(function (b) {
    b.addEventListener("click", function () {
      var clave = b.getAttribute("data-estado");
      var abierto = b.getAttribute("aria-expanded") === "true";
      raiz.querySelectorAll("[data-estado]").forEach(function (o) {
        o.setAttribute("aria-expanded", "false");
        document.getElementById("panel-" + o.getAttribute("data-estado")).classList.remove("abierto");
      });
      if (!abierto) {
        var panel = document.getElementById("panel-" + clave);
        var x = E[clave] || {};
        if (!panel.innerHTML) panel.innerHTML = (x.duracion ? '<p class="duracion">' + esc(x.duracion) + "</p>" : "") + H.audio(x.audio, b.textContent);
        b.setAttribute("aria-expanded", "true");
        panel.classList.add("abierto");
      }
    });
  });

  function pintarNavegacion() {
    var ya = H.ahora(), nav = "";
    if (n < CAL.TOTAL_DIAS) {
      var sig = n + 1;
      if (cal.abierto(sig, ya)) nav += '<a class="boton grande" href="/el-refugio-borrador-temp/privado/dia.html?n=' + sig + '">Ir al Día ' + sig + "</a>";
      else nav += '<div class="boton esperando">Tu Día ' + sig + " se abre " + esc(cal.textoApertura(sig, ya)) + "</div>";
    }
    nav += '<div class="fila">' +
      (n > 0 ? '<a class="boton contorno" href="/el-refugio-borrador-temp/privado/dia.html?n=' + (n - 1) + '">' + (n === 1 ? "Noche 1" : "Día " + (n - 1)) + "</a>" : "") +
      '<a class="boton contorno" href="/el-refugio-borrador-temp/privado/inicio.html">Inicio</a></div>';
    document.getElementById("navegacion").innerHTML = nav;
  }
  pintarNavegacion();
  setInterval(pintarNavegacion, 60000);

  var destino = (location.hash || "").replace("#", "");
  if (destino && document.getElementById(destino)) document.getElementById(destino).scrollIntoView({ block: "start" });
})();
