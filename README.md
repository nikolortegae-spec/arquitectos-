# Arquitectos del Futuro

Sitio web educativo e interactivo en espanol, creado como propuesta pedagogica
por **Darcy Quiza** y **Nikol Espinosa** ("Arquitecturas de la Emancipacion
Infantil"). La experiencia invita a construir espacios y ciudades sostenibles,
escuchar relatos sonoros sobre el cuidado del entorno, completar misiones de
aprendizaje y reunir reconocimientos. La interfaz esta pensada para un publico
adulto e institucional (educadores, instituciones y jurados que evaluan la
propuesta pedagogica), con un lenguaje visual sobrio y profesional.

## Identidad visual (diseno profesional e institucional)

El sitio usa un estilo institucional y educativo serio, con superficies limpias y
jerarquia clara, con estas caracteristicas:

- **Paleta:** verde bosque sobrio como color de acento, apoyado en neutros
  (blancos, grises y azul pizarra). Los tokens de marca estan definidos en el
  `tailwind.config` inline del `<head>`: `bosque`, `bosqueOscuro`, `bosqueClaro`
  y `bosqueSuave` para el acento verde; `pizarra` y `tinta` para el texto;
  `papel`, `lienzo` y `borde` para superficies y bordes neutros. El contraste se
  mantiene legible segun WCAG.
- **Superficies limpias:** el `body` usa un fondo neutro liso (gris verdoso muy
  claro), sin texturas decorativas ni degradados llamativos. Las secciones son
  tarjetas sobre fondo blanco con bordes discretos y sombras sutiles.
- **Tipografia profesional:** el cuerpo usa la Google Font **Inter** (sans
  moderna) y los titulos usan **Fraunces** (una display serif sobria),
  registradas como familias `sans` y `display`. No se usan fuentes manuscritas ni
  de estilo infantil.
- **Encabezados tipograficos:** los encabezados de las seis secciones usan la
  clase `.section-header` (con `.section-title`, `.section-audio` y
  `.section-sub`), un tratamiento tipografico sobrio con una linea de acento
  verde, en lugar de rotulos decorativos.
- **Componentes sobrios:** tarjetas con radios moderados, bordes discretos y
  sombras suaves (`card` y `cardHover`); se evitan los redondeos exagerados y las
  sombras tipo juguete.
- **Iconografia y voz guia:** se emplean iconos de FontAwesome y algun emoji
  puntual con moderacion. El hero incluye una marca visual sobria (icono) que al
  activarse reproduce una breve voz guia. Los textos de interfaz, avisos (toast)
  y mensajes de voz usan un registro mesurado adecuado a un publico adulto e
  institucional.
- **Animaciones discretas:** micro interacciones sutiles (aparicion suave de
  bloques, realce ligero de reconocimientos) y respeto de la preferencia del
  sistema mediante `@media (prefers-reduced-motion: reduce)`.

El diseno cuida la accesibilidad: contraste legible sobre el fondo claro, foco
visible por teclado (`:focus-visible`), `aria-label` descriptivos y la cobertura
de `prefers-reduced-motion` para las animaciones restantes.

## Graficos oficiales (placeholders)

Por decision del encargo (Opcion B), **no** se incrusta la ilustracion de
referencia ni los logos institucionales (Educacion, Culturas, CO-CREA) ni el
logo oficial de campana, por ser material de terceros con posible copyright o
marca. En su lugar hay recuadros placeholder claramente marcados, con borde
discontinuo discreto, fondo neutro y `aria-label` descriptivo, donde colocar los
graficos oficiales cuando esten disponibles:

- **Franja de logos institucionales:** en el header, justo encima de la barra de
  navegacion. Texto: "Franja de logos institucionales aqui: Educacion / Culturas
  / CO-CREA". Reemplazar por la franja oficial de logos.
- **Logo oficial de campana:** a la derecha de la franja anterior, en el header.
  Texto: "Logo oficial de campana aqui". Reemplazar por el logo oficial de la
  campana.
- **Ilustracion oficial del heroe:** en el hero (`#inicio`), bajo los botones.
  Texto: "Espacio reservado para la ilustracion oficial del heroe". Mientras
  tanto, el espacio del heroe se representa con una marca visual sobria (icono).

No existe carpeta `assets/` todavia. Si en el futuro se agregan los archivos
oficiales, se recomienda crear `assets/` y colocar ahi las imagenes, actualizando
cada placeholder para que apunte al archivo correspondiente. No usar CDNs de
imagenes de terceros; Tailwind, Google Fonts y FontAwesome por CDN si estan
permitidos.

## Que se puede hacer

- **Taller de construccion:** colocar materiales sostenibles (paneles solares,
  techos verdes, agua, madera, piedra) en una cuadricula y medir la energia
  limpia.
- **Relatos sonoros:** escuchar historias breves leidas en voz alta (es-ES).
- **Misiones de aprendizaje:** retos que se marcan como cumplidos segun lo que
  construyes y los relatos que escuchas, con aviso por voz y sonido.
- **Mapa de progreso:** resumen visual del recorrido (bloques, energia limpia,
  reconocimientos) con un resumen por voz.
- **Reconocimientos:** se desbloquean al cumplir objetivos de la propuesta.

El progreso (construccion, reconocimientos, relatos, misiones y preferencia de
sonido) se guarda en el navegador con `localStorage`, asi que se conserva al
recargar. Hay un boton "Empezar de nuevo" para borrarlo.

## Como abrir el sitio

Es un sitio estatico de un solo archivo, sin pasos de compilacion. Abre
`index.html` en un navegador moderno.

Usa recursos por CDN (Tailwind CSS, Google Fonts y FontAwesome), por lo que para
ver los estilos e iconos completos conviene abrirlo **con conexion a internet**.
Los sonidos usan la Web Audio API y la lectura en voz alta usa
`SpeechSynthesis`, ambos incluidos en los navegadores modernos.
