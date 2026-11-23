# Arquitectos del Futuro

Sitio web educativo e interactivo en espanol para ninos, creado como propuesta
pedagogica por **Darcy Quiza** y **Nikol Espinosa** ("Arquitecturas de la
Emancipacion Infantil"). Los ninos construyen casitas y ciudades ecologicas,
escuchan cuentos sonoros sobre la naturaleza, completan misiones y ganan
insignias, todo con una estetica amigable tipo "bubble" y la mascota zorro.

## Que se puede hacer

- **Taller de Construccion:** colocar bloques ecologicos (paneles solares, techos
  verdes, lagos, madera, piedra) en una cuadricula y medir la energia limpia.
- **Cuentos Sonoros:** escuchar historias leidas en voz alta (es-ES).
- **Misiones del Pequeno Arquitecto:** retos que se encienden solos segun lo que
  construyes y los cuentos que escuchas, con felicitacion por voz y sonido.
- **Mapa de mi Ciudad Verde:** resumen visual del progreso (bloques, energia
  limpia, insignias) con animo por voz del zorro.
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
