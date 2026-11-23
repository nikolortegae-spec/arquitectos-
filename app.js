/* =========================================================================
   Arquitectos del Futuro - Logica de la experiencia
   Sitio estatico buildless. Sin dependencias externas de ejecucion.
   Nota: no se usan guiones largos en ningun texto o comentario.
   ========================================================================= */

"use strict";

/* ----------------------------- Estado global --------------------------- */
var STORAGE_KEY = "arquitectosDelFuturo_v2";

var GRID_SIZE = 40; // casillas del taller (10 x 4)

var MATERIALS = {
  wood:   { nombre: "madera",      emoji: "🪵", eco: false },
  plants: { nombre: "techo verde", emoji: "🌱", eco: true },
  water:  { nombre: "agua",        emoji: "💧", eco: true },
  solar:  { nombre: "panel solar", emoji: "☀️", eco: true },
  stone:  { nombre: "piedra",      emoji: "🪨", eco: false },
  eraser: { nombre: "borrador",    emoji: "🧹", eco: false }
};

var STORIES = {
  mateo: {
    titulo: "El oso Mateo y la casa solar",
    texto: "El oso Mateo queria luz en su cueva sin cortar arboles. " +
      "Con ayuda de sus amigos coloco paneles solares en el techo. " +
      "Asi el sol ilumino su hogar y el bosque siguio sano y feliz."
  },
  renata: {
    titulo: "La rana Renata y el rio limpio",
    texto: "La rana Renata vio el rio sucio y triste. " +
      "Junto a sus vecinos construyo un filtro con piedras y plantas. " +
      "Poco a poco el agua volvio a estar clara y todos pudieron nadar."
  },
  maya: {
    titulo: "La abeja Maya y el techo verde",
    texto: "La abeja Maya buscaba flores en la ciudad. " +
      "Los ninos sembraron un techo verde lleno de plantas. " +
      "Maya encontro nectar, sombra y un hogar para toda su colmena."
  }
};

// Estado en memoria (se sincroniza con localStorage)
var state = {
  grid: new Array(GRID_SIZE).fill(null),
  badges: {},            // clave de insignia -> true
  soundEnabled: true,
  storiesHeard: {},      // clave de cuento -> true
  questsDone: {}         // id de mision -> true
};

var currentMaterial = "wood";
var audioCtx = null;
var resetArmed = false;
var resetTimer = null;

/* ----------------------------- Persistencia ---------------------------- */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // El almacenamiento puede estar bloqueado; la app sigue funcionando en memoria.
  }
}

function loadState() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    var saved = JSON.parse(raw);
    if (saved && typeof saved === "object") {
      if (Array.isArray(saved.grid) && saved.grid.length === GRID_SIZE) {
        state.grid = saved.grid;
      }
      if (saved.badges && typeof saved.badges === "object") state.badges = saved.badges;
      if (typeof saved.soundEnabled === "boolean") state.soundEnabled = saved.soundEnabled;
      if (saved.storiesHeard && typeof saved.storiesHeard === "object") state.storiesHeard = saved.storiesHeard;
      if (saved.questsDone && typeof saved.questsDone === "object") state.questsDone = saved.questsDone;
    }
  } catch (e) {
    // Datos corruptos: se ignora y se parte de un estado limpio.
  }
}

/* ----------------------------- Motor de sonido ------------------------- */
function getAudioContext() {
  if (!audioCtx) {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

// Reproduce un tono simple. tipo: "interaccion", "colocado" o "logro".
function playSound(tipo) {
  if (!state.soundEnabled) return;
  var ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended" && ctx.resume) ctx.resume();

  var ahora = ctx.currentTime;

  function tono(freq, inicio, duracion, volumen, forma) {
    var osc = ctx.createOscillator();
    var gan = ctx.createGain();
    osc.type = forma || "sine";
    osc.frequency.setValueAtTime(freq, ahora + inicio);
    gan.gain.setValueAtTime(0.0001, ahora + inicio);
    gan.gain.exponentialRampToValueAtTime(volumen, ahora + inicio + 0.02);
    gan.gain.exponentialRampToValueAtTime(0.0001, ahora + inicio + duracion);
    osc.connect(gan);
    gan.connect(ctx.destination);
    osc.start(ahora + inicio);
    osc.stop(ahora + inicio + duracion + 0.02);
  }

  if (tipo === "interaccion") {
    tono(520, 0, 0.12, 0.14, "triangle");
  } else if (tipo === "colocado") {
    tono(330, 0, 0.14, 0.16, "sine");
    tono(440, 0.05, 0.14, 0.12, "sine");
  } else if (tipo === "logro") {
    tono(523, 0, 0.16, 0.16, "triangle");
    tono(659, 0.12, 0.16, 0.16, "triangle");
    tono(784, 0.24, 0.22, 0.16, "triangle");
  }
}

/* ----------------------------- Lectura por voz ------------------------- */
function readText(texto) {
  if (!state.soundEnabled) {
    showToast("🔈", "Activa el sonido para escuchar la voz.");
    return;
  }
  if (!("speechSynthesis" in window)) {
    showToast("🔈", "Tu navegador no admite la lectura por voz.");
    return;
  }
  try {
    window.speechSynthesis.cancel(); // cancela locucion previa
    var u = new SpeechSynthesisUtterance(texto);
    u.lang = "es-ES";
    u.rate = 0.98;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  } catch (e) {
    showToast("🔈", "No se pudo iniciar la lectura por voz.");
  }
}

function playGuideVoice() {
  playSound("interaccion");
  readText("Hola, soy tu guia. Construye en el taller, escucha los relatos y completa las misiones para hacer crecer tu ciudad sostenible.");
}

/* ----------------------------- Toggle de sonido ------------------------ */
function toggleSoundMaster() {
  state.soundEnabled = !state.soundEnabled;
  updateSoundButton();
  if (state.soundEnabled) {
    playSound("interaccion");
    showToast("🔊", "Sonido activado.");
  } else {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    showToast("🔈", "Sonido silenciado.");
  }
  saveState();
}

function updateSoundButton() {
  var icon = document.getElementById("soundIcon");
  var label = document.getElementById("soundLabel");
  var btn = document.getElementById("soundToggleBtn");
  if (icon) icon.textContent = state.soundEnabled ? "🔊" : "🔈";
  if (label) label.textContent = state.soundEnabled ? "Sonido activo" : "Sonido apagado";
  if (btn) btn.setAttribute("aria-label", state.soundEnabled ? "Desactivar los sonidos" : "Activar los sonidos");
}

/* ----------------------------- Toasts ---------------------------------- */
function showToast(emoji, mensaje, exito) {
  var zona = document.getElementById("toastZona");
  if (!zona) return;
  var el = document.createElement("div");
  el.className = "toast" + (exito ? " exito" : "");
  el.setAttribute("role", "status");

  var span1 = document.createElement("span");
  span1.className = "toast-emoji";
  span1.setAttribute("aria-hidden", "true");
  span1.textContent = emoji;

  var span2 = document.createElement("span");
  span2.className = "toast-texto";
  span2.textContent = mensaje;

  el.appendChild(span1);
  el.appendChild(span2);
  zona.appendChild(el);

  // Fuerza reflow para que la transicion de entrada se aplique.
  void el.offsetWidth;
  el.classList.add("visible");

  setTimeout(function () {
    el.classList.remove("visible");
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 320);
  }, 3200);
}

/* ----------------------------- Taller ---------------------------------- */
function buildGrid() {
  var grid = document.getElementById("sandboxGrid");
  if (!grid) return;
  grid.innerHTML = "";
  for (var i = 0; i < GRID_SIZE; i++) {
    (function (index) {
      var casilla = document.createElement("button");
      casilla.type = "button";
      casilla.className = "casilla";
      casilla.setAttribute("data-index", String(index));
      casilla.setAttribute("aria-label", "Casilla " + (index + 1) + " del terreno, vacia");
      casilla.addEventListener("click", function () {
        placeOnTile(index);
      });
      grid.appendChild(casilla);
    })(i);
  }
  renderGrid();
}

function renderGrid() {
  var grid = document.getElementById("sandboxGrid");
  if (!grid) return;
  var casillas = grid.querySelectorAll(".casilla");
  for (var i = 0; i < casillas.length; i++) {
    var mat = state.grid[i];
    var casilla = casillas[i];
    if (mat && MATERIALS[mat]) {
      casilla.textContent = MATERIALS[mat].emoji;
      casilla.classList.add("ocupada");
      casilla.setAttribute("aria-label", "Casilla " + (i + 1) + " con " + MATERIALS[mat].nombre + ". Pulsa para cambiar.");
    } else {
      casilla.textContent = "";
      casilla.classList.remove("ocupada");
      casilla.setAttribute("aria-label", "Casilla " + (i + 1) + " del terreno, vacia");
    }
  }
}

function selectMaterial(mat) {
  if (!MATERIALS[mat]) return;
  currentMaterial = mat;
  var botones = document.querySelectorAll(".material");
  for (var i = 0; i < botones.length; i++) {
    botones[i].classList.remove("activo");
  }
  var activo = document.getElementById("mat-" + mat);
  if (activo) activo.classList.add("activo");

  var badge = document.getElementById("activeMaterialBadge");
  if (badge) {
    var info = MATERIALS[mat];
    badge.textContent = "Seleccionado: " + info.nombre + " " + info.emoji;
  }
  playSound("interaccion");
}

function placeOnTile(index) {
  var casilla = document.querySelector('.casilla[data-index="' + index + '"]');
  if (currentMaterial === "eraser") {
    state.grid[index] = null;
    playSound("interaccion");
  } else {
    state.grid[index] = currentMaterial;
    if (casilla) {
      casilla.classList.remove("placed-block");
      void casilla.offsetWidth;
      casilla.classList.add("placed-block");
    }
    playSound("colocado");
  }
  renderGrid();
  updateTallerStats();
  saveState();
  checkBuilderBadge();
  checkQuests();
  updateCityMap();
}

function countBlocks() {
  var n = 0;
  for (var i = 0; i < state.grid.length; i++) {
    if (state.grid[i]) n++;
  }
  return n;
}

function countMaterial(mat) {
  var n = 0;
  for (var i = 0; i < state.grid.length; i++) {
    if (state.grid[i] === mat) n++;
  }
  return n;
}

function ecoScore() {
  var total = countBlocks();
  if (total === 0) return 0;
  var eco = 0;
  for (var i = 0; i < state.grid.length; i++) {
    var mat = state.grid[i];
    if (mat && MATERIALS[mat] && MATERIALS[mat].eco) eco++;
  }
  return Math.round((eco / total) * 100);
}

function updateTallerStats() {
  var bloques = document.getElementById("statBlocksCount");
  var eco = document.getElementById("statEcoScore");
  if (bloques) bloques.textContent = String(countBlocks());
  if (eco) eco.textContent = ecoScore() + "%";
}

function clearSandbox() {
  state.grid = new Array(GRID_SIZE).fill(null);
  renderGrid();
  updateTallerStats();
  updateCityMap();
  checkQuests();
  saveState();
  playSound("interaccion");
  showToast("🧽", "Terreno limpio. A construir de nuevo.");
}

function checkSandboxAchievement() {
  var bloques = countBlocks();
  var eco = ecoScore();
  if (bloques === 0) {
    showToast("🧱", "Coloca materiales en el terreno para evaluar tu construccion.");
    readText("Coloca materiales en el terreno para evaluar tu construccion.");
    return;
  }
  var mensaje = "Has colocado " + bloques + " bloques con " + eco + " por ciento de energia limpia. ";
  if (eco >= 60) {
    mensaje += "Excelente trabajo sostenible.";
    showToast("🌟", "Construccion sostenible: " + eco + "% de energia limpia.", true);
  } else {
    mensaje += "Prueba a sumar paneles solares, techos verdes o agua para subir la energia limpia.";
    showToast("💡", "Suma materiales ecologicos para subir la energia limpia.");
  }
  readText(mensaje);
  checkBuilderBadge();
  checkEcoBadge();
  checkQuests();
}

/* ----------------------------- Cuentos --------------------------------- */
function playStory(clave) {
  var relato = STORIES[clave];
  if (!relato) return;
  playSound("interaccion");
  readText(relato.titulo + ". " + relato.texto);

  var estado = document.getElementById("estado-cuento-" + clave);
  if (estado) estado.textContent = "Escuchado ✓";

  if (!state.storiesHeard[clave]) {
    state.storiesHeard[clave] = true;
    saveState();
  }
  unlockBadge("story");
  checkQuests();
}

function countStoriesHeard() {
  var n = 0;
  for (var k in state.storiesHeard) {
    if (state.storiesHeard.hasOwnProperty(k) && state.storiesHeard[k]) n++;
  }
  return n;
}

function refreshStoryStates() {
  for (var clave in STORIES) {
    if (!STORIES.hasOwnProperty(clave)) continue;
    var estado = document.getElementById("estado-cuento-" + clave);
    if (estado) estado.textContent = state.storiesHeard[clave] ? "Escuchado ✓" : "";
  }
}

/* ----------------------------- Insignias ------------------------------- */
var BADGES = {
  builder: "Constructor",
  eco: "Energia limpia",
  story: "Oyente",
  master: "Maestra del futuro"
};

// Desbloqueo con efecto (sonido + toast).
function unlockBadge(clave) {
  if (!BADGES[clave] || state.badges[clave]) return;
  state.badges[clave] = true;
  applyBadgeVisual(clave);
  saveState();
  playSound("logro");
  showToast("🏅", "Nueva insignia: " + BADGES[clave] + ".", true);
  updateCityMap();
}

// Variante solo visual (para restaurar desde storage sin sonido ni toast).
function applyBadgeVisual(clave) {
  var el = document.getElementById("badge-" + clave);
  if (!el) return;
  el.classList.add("unlocked-badge");
  var candado = el.querySelector(".insignia-candado");
  if (candado) candado.textContent = "Desbloqueada";
}

function countBadges() {
  var n = 0;
  for (var k in state.badges) {
    if (state.badges.hasOwnProperty(k) && state.badges[k]) n++;
  }
  return n;
}

function restoreBadges() {
  for (var clave in state.badges) {
    if (state.badges.hasOwnProperty(clave) && state.badges[clave]) {
      applyBadgeVisual(clave);
    }
  }
}

function checkBuilderBadge() {
  if (countBlocks() >= 12) unlockBadge("builder");
}

function checkEcoBadge() {
  if (ecoScore() >= 60 && countBlocks() > 0) unlockBadge("eco");
}

/* ----------------------------- Misiones -------------------------------- */
var QUESTS = [
  {
    id: "solar",
    titulo: "Energia del sol",
    meta: "Coloca 5 paneles solares o mas.",
    check: function () { return countMaterial("solar") >= 5; }
  },
  {
    id: "agua",
    titulo: "Cuidar el agua",
    meta: "Coloca 3 casillas de agua o mas.",
    check: function () { return countMaterial("water") >= 3; }
  },
  {
    id: "verde",
    titulo: "Techos que respiran",
    meta: "Coloca 3 techos verdes o mas.",
    check: function () { return countMaterial("plants") >= 3; }
  },
  {
    id: "relatos",
    titulo: "Oyente de relatos",
    meta: "Escucha los 3 cuentos sonoros.",
    check: function () { return countStoriesHeard() >= 3; }
  },
  {
    id: "ciudad",
    titulo: "Una ciudad en pie",
    meta: "Coloca 12 bloques o mas en el taller.",
    check: function () { return countBlocks() >= 12; }
  }
];

function renderQuests() {
  var lista = document.getElementById("misionesLista");
  if (!lista) return;
  lista.innerHTML = "";
  for (var i = 0; i < QUESTS.length; i++) {
    var q = QUESTS[i];
    var li = document.createElement("li");
    li.className = "mision";
    li.id = "mision-" + q.id;

    var marca = document.createElement("span");
    marca.className = "mision-marca";
    marca.setAttribute("aria-hidden", "true");
    marca.textContent = "✓";

    var cuerpo = document.createElement("div");
    cuerpo.className = "mision-cuerpo";

    var titulo = document.createElement("p");
    titulo.className = "mision-titulo";
    titulo.textContent = q.titulo;

    var meta = document.createElement("p");
    meta.className = "mision-meta";
    meta.textContent = q.meta;

    cuerpo.appendChild(titulo);
    cuerpo.appendChild(meta);
    li.appendChild(marca);
    li.appendChild(cuerpo);
    lista.appendChild(li);
  }
  paintQuestStates();
  updateQuestCounter();
}

function paintQuestStates() {
  for (var i = 0; i < QUESTS.length; i++) {
    var q = QUESTS[i];
    var li = document.getElementById("mision-" + q.id);
    if (!li) continue;
    if (state.questsDone[q.id]) {
      li.classList.add("completada");
      li.setAttribute("aria-label", q.titulo + ". Completada.");
    } else {
      li.classList.remove("completada");
      li.setAttribute("aria-label", q.titulo + ". Pendiente.");
    }
  }
}

function countQuestsDone() {
  var n = 0;
  for (var i = 0; i < QUESTS.length; i++) {
    if (state.questsDone[QUESTS[i].id]) n++;
  }
  return n;
}

function updateQuestCounter() {
  var cont = document.getElementById("misionesContador");
  if (cont) cont.textContent = countQuestsDone() + "/" + QUESTS.length;
}

function checkQuests() {
  var nuevas = 0;
  for (var i = 0; i < QUESTS.length; i++) {
    var q = QUESTS[i];
    if (!state.questsDone[q.id] && q.check()) {
      state.questsDone[q.id] = true;
      nuevas++;
      showToast("🎯", "Mision cumplida: " + q.titulo + ".", true);
    }
  }
  if (nuevas > 0) {
    playSound("logro");
    saveState();
  }
  paintQuestStates();
  updateQuestCounter();

  if (countQuestsDone() === QUESTS.length) {
    unlockBadge("master");
  }
}

/* ----------------------------- Mapa / resumen -------------------------- */
function updateCityMap() {
  var bloques = countBlocks();
  var eco = ecoScore();
  var badges = countBadges();

  var mBloques = document.getElementById("mapaBloques");
  var mEco = document.getElementById("mapaEco");
  var mBadges = document.getElementById("mapaBadges");
  if (mBloques) mBloques.textContent = String(bloques);
  if (mEco) mEco.textContent = eco + "%";
  if (mBadges) mBadges.textContent = badges + "/4";

  // Barra de crecimiento: 40 bloques equivalen al 100 por ciento.
  var porcentaje = Math.min(100, Math.round((bloques / GRID_SIZE) * 100));
  var nivel = Math.min(5, Math.floor(bloques / 8));

  var relleno = document.getElementById("progresoRelleno");
  var barra = document.getElementById("progresoBarra");
  var texto = document.getElementById("progresoTexto");
  if (relleno) relleno.style.width = porcentaje + "%";
  if (barra) barra.setAttribute("aria-valuenow", String(porcentaje));
  if (texto) texto.textContent = "Nivel " + nivel;

  renderSkyline(bloques);
}

function renderSkyline(bloques) {
  var skyline = document.getElementById("skyline");
  if (!skyline) return;
  skyline.innerHTML = "";

  if (bloques === 0) {
    var vacio = document.createElement("span");
    vacio.className = "skyline-vacio";
    vacio.id = "skylineVacio";
    vacio.textContent = "Construye bloques para levantar tu ciudad.";
    skyline.appendChild(vacio);
    return;
  }

  var edificios = Math.min(12, Math.max(1, Math.ceil(bloques / 3)));
  var alturas = [40, 70, 55, 90, 65, 100, 50, 80, 60, 95, 45, 75];
  for (var i = 0; i < edificios; i++) {
    var ed = document.createElement("div");
    ed.className = "skyline-edificio";
    ed.style.height = alturas[i % alturas.length] + "px";
    skyline.appendChild(ed);
  }
}

function speakCitySummary() {
  var bloques = countBlocks();
  var eco = ecoScore();
  var badges = countBadges();
  var misiones = countQuestsDone();
  playSound("interaccion");
  var resumen = "Resumen de tu ciudad. Has colocado " + bloques + " bloques, " +
    "con " + eco + " por ciento de energia limpia. " +
    "Tienes " + badges + " de 4 insignias y " + misiones + " de 5 misiones completadas.";
  readText(resumen);
  showToast("🗺️", "Resumen: " + bloques + " bloques, " + eco + "% limpia.");
}

/* ----------------------------- Empezar de nuevo ------------------------ */
function resetProgress() {
  var btn = document.getElementById("reiniciarBtn");
  if (!resetArmed) {
    resetArmed = true;
    if (btn) btn.innerHTML = '<span aria-hidden="true">⚠️</span> Pulsa otra vez para borrar';
    showToast("⚠️", "Pulsa otra vez para borrar todo tu progreso.");
    resetTimer = setTimeout(function () {
      resetArmed = false;
      if (btn) btn.innerHTML = '<span aria-hidden="true">🔄</span> Empezar de nuevo';
    }, 4000);
    return;
  }

  if (resetTimer) clearTimeout(resetTimer);
  resetArmed = false;

  state.grid = new Array(GRID_SIZE).fill(null);
  state.badges = {};
  state.storiesHeard = {};
  state.questsDone = {};
  saveState();

  // Reinicia la interfaz de insignias.
  var insignias = document.querySelectorAll(".insignia");
  for (var i = 0; i < insignias.length; i++) {
    insignias[i].classList.remove("unlocked-badge");
    var candado = insignias[i].querySelector(".insignia-candado");
    if (candado) candado.textContent = "Bloqueada";
  }

  renderGrid();
  updateTallerStats();
  refreshStoryStates();
  paintQuestStates();
  updateQuestCounter();
  updateCityMap();

  if (btn) btn.innerHTML = '<span aria-hidden="true">🔄</span> Empezar de nuevo';
  playSound("interaccion");
  showToast("🔄", "Progreso reiniciado. Empieza una nueva ciudad.");
}

/* ----------------------------- Navegacion ------------------------------ */
var SECTION_IDS = ["inicio", "taller", "cuentos", "insignias", "retos", "mapa"];

function setActiveNav(id) {
  var enlaces = document.querySelectorAll(".nav-enlace, .tab-enlace");
  for (var i = 0; i < enlaces.length; i++) {
    var el = enlaces[i];
    if (el.getAttribute("data-section") === id) {
      el.classList.add("activo");
      if (el.classList.contains("nav-enlace")) {
        el.setAttribute("aria-current", "true");
      }
    } else {
      el.classList.remove("activo");
      el.removeAttribute("aria-current");
    }
  }
}

function initNavigation() {
  // Scroll suave respetando movimiento reducido.
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var enlaces = document.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < enlaces.length; i++) {
    enlaces[i].addEventListener("click", function (ev) {
      var href = this.getAttribute("href");
      if (!href || href.charAt(0) !== "#" || href.length < 2) return;
      var destino = document.getElementById(href.slice(1));
      if (!destino) return;
      ev.preventDefault();
      destino.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start"
      });
      if (history.replaceState) history.replaceState(null, "", href);
    });
  }

  // Scrollspy con IntersectionObserver.
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      var visibles = entries.filter(function (e) { return e.isIntersecting; });
      if (visibles.length === 0) return;
      visibles.sort(function (a, b) {
        return b.intersectionRatio - a.intersectionRatio;
      });
      setActiveNav(visibles[0].target.id);
    }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] });

    for (var s = 0; s < SECTION_IDS.length; s++) {
      var sec = document.getElementById(SECTION_IDS[s]);
      if (sec) observer.observe(sec);
    }
  }

  // Boton volver arriba.
  var backBtn = document.getElementById("backToTopBtn");
  window.addEventListener("scroll", function () {
    if (!backBtn) return;
    if (window.pageYOffset > 400) {
      backBtn.classList.remove("oculto");
    } else {
      backBtn.classList.add("oculto");
    }
  }, { passive: true });
}

function scrollToTop() {
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

/* ----------------------------- Arranque -------------------------------- */
function init() {
  loadState();
  updateSoundButton();
  buildGrid();
  selectMaterial(currentMaterial);
  restoreBadges();
  refreshStoryStates();
  renderQuests();
  updateTallerStats();
  updateCityMap();
  initNavigation();
  setActiveNav("inicio");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
