# Arquitectos del Futuro

Sitio web educativo e interactivo en espanol para ninos, creado como propuesta
pedagogica por **Darcy Quiza** y **Nikol Espinosa** ("Arquitecturas de la
Emancipacion Infantil"). Los ninos construyen casitas y ciudades ecologicas,
escuchan cuentos sonoros sobre la naturaleza, completan misiones y ganan
insignias, con una nueva identidad visual inspirada en la campana **MEGA BICHOS /
Territorios de arte, juego y vida para la primera infancia** y la mascota insecto
heroe **Bichi**.

## Identidad visual (estetica MEGA BICHOS)

El sitio usa un estilo ilustrado, pintado a mano y organico, con estas
caracteristicas:

- **Paleta:** base de verdes agua y turquesa con verde musgo, acentos de ocre y
  madera para los carteles, rojo coral para texto destacado y verde lima estilo
  logo. Los colores de marca estan definidos en el `tailwind.config` inline del
  `<head>` (aguaTurquesa, aguaClara, verdeMusgo, verdeMusgoHoja, verdeLima,
  ocreMadera, ocreMaderaClaro, rojoCoral, cremaPapel).
- **Fondo acuarela:** el `body` ya no usa el degradado pastel liso. Ahora combina
  varios `radial-gradient` CSS propios que simulan manchas de acuarela sobre una
  base de verdes agua y musgo, sin imagenes externas con copyright. Hay tambien
  manchas decorativas flotantes (`.mancha-acuarela`) en el hero.
- **Tipografia doodle:** los titulos usan la Google Font libre **Baloo 2** (con
  Patrick Hand como respaldo), registrada como familia `doodle`. El cuerpo
  conserva **Fredoka** y **Outfit**.
- **Carteles de madera:** los encabezados de las seis secciones usan la clase
  `.cartel-madera`, que simula una tabla de madera con vetas, borde y sombra.
- **Mascota:** el zorro se reemplazo por el insecto heroe **Bichi** (emoji de
  mariquita), coherente con la tematica de agua y bichos de la campana. Los textos
  de voz y de los avisos (toast) se actualizaron en toda la pagina.

La estetica respeta la accesibilidad: contraste legible sobre el fondo verde,
foco visible por teclado (`:focus-visible`), todos los `aria-label` y el bloque
`@media (prefers-reduced-motion: reduce)`, que tambien cubre las manchas
flotantes nuevas.

## Graficos oficiales (placeholders)

Por decision del encargo (Opcion B), **no** se incrusta la ilustracion de
referencia ni los logos institucionales (Educacion, Culturas, CO-CREA) ni el
logo "MEGA BICHOS", por ser material de terceros con posible copyright o marca.
En su lugar hay recuadros placeholder claramente marcados, con borde discontinuo
y `aria-label` descriptivo, donde colocar los graficos oficiales cuando esten
disponibles:

- **Franja de logos institucionales:** en el header, justo encima de la barra de
  navegacion. Texto: "Franja de logos institucionales aqui: Educacion / Culturas
  / CO-CREA". Reemplazar por la franja oficial de logos.
- **Logo oficial de campana:** a la derecha de la franja anterior, en el header.
  Texto: "Logo oficial de campana aqui". Reemplazar por el logo oficial de
  MEGA BICHOS.
- **Ilustracion oficial del heroe:** en el hero (`#inicio`), bajo los botones.
  Texto: "Reemplazar por ilustracion oficial del heroe". Mientras tanto, la
  mascota se representa con el emoji de Bichi.

No existe carpeta `assets/` todavia. Si en el futuro se agregan los archivos
oficiales, se recomienda crear `assets/` y colocar ahi las imagenes, actualizando
cada placeholder para que apunte al archivo correspondiente. No usar CDNs de
imagenes de terceros; Tailwind, Google Fonts y FontAwesome por CDN si estan
permitidos.

## Que se puede hacer

- **Taller de Construccion:** colocar bloques ecologicos (paneles solares, techos
  verdes, lagos, madera, piedra) en una cuadricula y medir la energia limpia.
- **Cuentos Sonoros:** escuchar historias leidas en voz alta (es-ES).
- **Misiones del Pequeno Arquitecto:** retos que se encienden solos segun lo que
  construyes y los cuentos que escuchas, con felicitacion por voz y sonido.
- **Mapa de mi Ciudad Verde:** resumen visual del progreso (bloques, energia
  limpia, insignias) con animo por voz de Bichi.
- **Insignias:** medallas que se desbloquean al cumplir objetivos.

El progreso (construccion, insignias, cuentos, misiones y preferencia de sonido)
se guarda en el navegador con `localStorage`, asi que se conserva al recargar.
Hay un boton "Empezar de nuevo" para borrarlo.

## Como abrir el sitio

Es un sitio estatico de un solo archivo, sin pasos de compilacion. Abre
`index.html` en un navegador moderno.

Usa recursos por CDN (Tailwind CSS, Google Fonts y FontAwesome), por lo que para
ver los estilos e iconos completos conviene abrirlo **con conexion a internet**.
Los sonidos usan la Web Audio API y la lectura en voz alta usa
`SpeechSynthesis`, ambos incluidos en los navegadores modernos.
