# Arquitectos del Futuro

Sitio web educativo e interactivo en espanol, creado como propuesta pedagogica
por **Darcy Quiza** y **Nikol Espinosa** ("Arquitecturas de la emancipacion
infantil"). La experiencia invita a explorar materiales sostenibles, construir
territorios de juego para la comunidad, escuchar relatos sonoros sobre el cuidado
del agua, la energia y el entorno, completar misiones de aprendizaje y reunir
insignias. Esta pensada para acompanar a la primera infancia y para que
educadores, instituciones y jurados puedan recorrer la propuesta.

El sitio en vivo se publica con GitHub Pages desde la raiz del repositorio:
[https://nikolortegae-spec.github.io/arquitectos-/](https://nikolortegae-spec.github.io/arquitectos-/).

## Direccion de diseno: "Plano Vivo"

La identidad visual se llama **Plano Vivo** (eco-blueprint editorial): un lenguaje
de plano de construccion aplicado a un tema ecologico, con base de petroleo
profundo, acento solar ambar y resalte aqua. El sistema de diseno vive en
`styles.css` como variables CSS (custom properties) en el selector `:root`, sin
Tailwind ni ningun framework de estilos.

- **Paleta (tokens en `styles.css`).** Superficies y texto: `--color-fondo`
  (petroleo profundo), `--color-fondo-alt`, `--color-superficie` (blanco),
  `--color-superficie-suave`, `--color-superficie-tinta`, `--color-borde` y
  `--color-borde-tinta`. Texto: `--color-texto`, `--color-texto-suave`,
  `--color-texto-claro` y `--color-texto-claro-suave`. Marca y materiales:
  `--color-petroleo` y `--color-petroleo-oscuro`, `--color-aqua` y
  `--color-aqua-suave`, `--color-solar` y `--color-solar-oscuro`, `--color-hoja`
  y `--color-hoja-suave`, `--color-agua`, `--color-piedra` y `--color-madera`.
  Estados: `--color-exito` y `--color-aviso`. El contraste se mantiene legible
  segun WCAG.
- **Tipografia con fallback del sistema.** El cuerpo usa la variable
  `--fuente-cuerpo` con **Space Grotesk** y los titulos usan `--fuente-titulo`
  con **Sora**. Ambas familias incluyen una pila de fallback del sistema
  (`"Segoe UI"`, `system-ui`, `-apple-system`, Roboto, Helvetica, Arial,
  sans-serif), por lo que el sitio se ve coherente aunque la fuente de Google
  Fonts no cargue. Las fuentes se piden por CDN desde `index.html` con
  `preconnect` y `display=swap`.
- **Sistema de espaciado, radios y sombras.** Escala de espaciado `--esp-1` a
  `--esp-8`, radios `--radio-sm`, `--radio-md`, `--radio-lg` y `--radio-full`, y
  sombras `--sombra-sm`, `--sombra-md` y `--sombra-lg`. Hay tokens de ancho
  maximo (`--ancho-max`) y de compensacion de la cabecera fija
  (`--altura-cabecera`).
- **Componentes.** Secciones como tarjetas (`.tarjeta`), encabezados de seccion
  con eyebrow, titulo y subtitulo, botones con variantes (principal, solar,
  contorno, neutro), cuadricula del taller, tarjetas de cuento, insignias, lista
  de misiones y fichas del mapa con barra de progreso y skyline. Los iconos con
  significado se dibujan con SVG inline o con emoji acompanado de `aria-label`;
  no se depende de FontAwesome.
- **Tono.** Lenguaje claro y amable para la primera infancia, con avisos (toast)
  y mensajes de voz breves y en registro cercano.

## Estructura de archivos (sitio estatico buildless)

El sitio es estatico y no tiene ningun paso de compilacion. Son tres archivos en
la raiz del repositorio:

- `index.html`: punto de entrada (entry point). Declara `<!DOCTYPE html>` y
  `<html lang="es">`, enlaza `styles.css` en el `<head>` y carga `app.js` con
  `defer` al final del `<head>`.
- `styles.css`: todo el sistema de diseno y los estilos (CSS propio con variables
  en `:root`).
- `app.js`: toda la logica interactiva (sin dependencias ni modulos externos).

GitHub Pages publica el contenido directamente desde la raiz (`/`), sirviendo
`index.html` tal cual. No hay bundler, ni npm, ni tarea de build: basta con abrir
`index.html` en un navegador moderno para ver el sitio funcionando.

## Experiencia interactiva

- **Taller de construccion (`#taller`).** Selector de seis materiales (madera
  `wood`, techo verde `plants`, agua `water`, panel solar `solar`, piedra
  `stone` y borrador `eraser`) y un terreno de 40 casillas (cuadricula de 10 x 4).
  Se elige un material y se hace clic en las casillas para colocarlo o borrarlo.
  Muestra el contador de bloques colocados y un eco-score de "energia limpia"
  (porcentaje de materiales ecologicos sobre lo colocado), con botones para
  evaluar la construccion y para limpiar todo.
- **Relatos sonoros (`#cuentos`).** Tres cuentos con claves estables `mateo`
  (el oso y la casa solar), `renata` (la rana y el rio limpio) y `maya` (la abeja
  y el techo verde). Cada tarjeta se escucha por voz, queda marcada como
  escuchada y desbloquea la insignia de oyente.
- **Insignias (`#insignias`).** Cuatro insignias que arrancan bloqueadas y se
  iluminan al interactuar: Constructor (`badge-builder`), Energia limpia
  (`badge-eco`), Oyente (`badge-story`) y Maestra del futuro (`badge-master`).
  Al desbloquear suena un efecto y aparece un toast; al restaurar desde el
  almacenamiento se aplican de forma solo visual.
- **Misiones (`#retos`).** Cinco misiones que se marcan solas segun lo que
  construyes y los relatos que escuchas (por ejemplo colocar paneles solares,
  agua y techos verdes, escuchar los relatos y levantar una ciudad con bastantes
  bloques). La lista se pinta desde `app.js` y hay un contador de avance X/5.
- **Mi ciudad (`#mapa`).** Resumen global del progreso: bloques, energia limpia e
  insignias (X/4), una barra de crecimiento de la ciudad con `role="progressbar"`
  y `aria-valuenow`, y un skyline que crece por nivel. Incluye un boton para
  escuchar el resumen por voz.
- **Sonido (Web Audio API).** Motor de sonido propio con contexto de audio
  perezoso para efectos de interaccion, de colocado y de logro, siempre bajo la
  guardia del estado de sonido.
- **Voz (SpeechSynthesis `es-ES`).** Lectura en voz alta de presentaciones,
  secciones, relatos y resumen; cancela la locucion anterior antes de empezar y
  avisa si el navegador no tiene soporte de voz.
- **Toggle de sonido.** Boton global en la cabecera que activa o silencia todo el
  audio (efectos y voz), actualiza su icono, etiqueta y `aria-label`, y guarda la
  preferencia.
- **Avisos (toasts).** Mensajes no bloqueantes en pantalla, sin usar `alert`.
- **Persistencia (`localStorage`).** El progreso (cuadricula del taller,
  insignias desbloqueadas, preferencia de sonido, relatos escuchados y misiones
  completadas) se guarda con la clave `arquitectosDelFuturo_v2` dentro de un
  `try/catch`, asi que se conserva al recargar. El boton **Empezar de nuevo**
  (en `#mapa`) borra el progreso y pide confirmacion con un segundo clic.
- **Navegacion.** Scroll suave que respeta `prefers-reduced-motion`, scrollspy
  con `IntersectionObserver` que resalta la seccion visible, una tab bar movil
  espejo del menu principal y un boton para volver arriba que aparece al bajar.

## Graficos oficiales (placeholders)

Por decision del encargo, **no** se incrustan logos ni ilustraciones de terceros
con copyright o marca (Educacion, Culturas, CO-CREA ni el logo o la ilustracion
oficial de la campana). En su lugar hay recuadros placeholder claramente
marcados, con borde discontinuo, fondo neutro y `aria-label` descriptivo en
espanol. Ubicacion exacta de cada uno dentro de `index.html`:

- **Franja de logos institucionales.** En la cabecera (`header.cabecera`), dentro
  del bloque `div.franja-logos`, como el primer recuadro
  (`div.placeholder.placeholder-logos`), justo encima de la barra de navegacion
  principal. Texto: "Franja de logos institucionales (Educacion, Culturas,
  CO-CREA)". Reemplazar por la franja oficial de logos.
- **Logo oficial de campana.** En la misma cabecera, dentro de `div.franja-logos`,
  como el segundo recuadro (`div.placeholder.placeholder-campana`), a la derecha
  de la franja anterior. Texto: "Logo oficial de campana". Reemplazar por el logo
  oficial de la campana.
- **Ilustracion oficial del hero.** En la seccion de inicio (`#inicio`), dentro de
  la columna de texto del hero y debajo de los botones de accion, en el recuadro
  `div.placeholder.hero-placeholder`. Texto: "Espacio reservado para la
  ilustracion oficial del hero". Reemplazar por la ilustracion oficial del hero.

No existe carpeta `assets/` todavia. Cuando esten disponibles los archivos
oficiales, se recomienda crear `assets/` en la raiz, colocar ahi las imagenes y
actualizar cada placeholder para que apunte al archivo correspondiente (por
ejemplo sustituyendo el recuadro por una etiqueta `<img>` con su `alt`). No se
deben incrustar materiales de terceros con copyright directamente en el
repositorio ni cargarlos desde CDNs de terceros.

## Accesibilidad

- **Contraste WCAG.** Combinaciones de color legibles para texto y controles,
  tanto sobre superficies claras como sobre el petroleo profundo.
- **Foco visible por teclado.** Estilos `:focus-visible` con contorno claro en
  enlaces, botones y elementos interactivos.
- **Etiquetas para iconos y emoji.** Todos los controles cuyo contenido es un
  icono o un emoji llevan `aria-label` descriptivo (toggle de sonido, botones de
  audio, materiales, casillas, volver arriba), y los graficos decorativos usan
  `aria-hidden`.
- **Estructura semantica.** Un solo `h1` y un `h2` por seccion, enlace para
  saltar al contenido, regiones `header`, `nav`, `main` y `footer`, y navegacion
  por teclado con botones reales.
- **Movimiento reducido.** Soporte de `@media (prefers-reduced-motion: reduce)`
  que neutraliza animaciones, transiciones y el scroll suave.
- **Estados comunicados.** `aria-current` en el enlace de navegacion activo,
  `role="progressbar"` con `aria-valuenow` en la barra de crecimiento y zonas
  `aria-live` para avisos y estados de los relatos.

## Como abrir y validar en local

Es un sitio estatico sin pasos de compilacion:

1. Abre `index.html` en un navegador moderno (doble clic o arrastrarlo al
   navegador). Para ver las fuentes de Google Fonts conviene tener conexion a
   internet; si no la hay, el sitio usa la pila de fuentes del sistema. Los
   sonidos usan la Web Audio API y la lectura en voz alta usa `SpeechSynthesis`,
   ambos incluidos en los navegadores modernos.
2. Valida la sintaxis de la logica con Node: `node --check app.js` (debe salir
   sin errores).

No hace falta instalar dependencias ni ejecutar ningun servidor o tarea de build.
