
export const content_dsp = `
# Real-Time Audio: DSP & CPAL

El procesamiento de audio en tiempo real es una de las disciplinas más estrictas de la informática. Tienes un presupuesto de ~1.3ms para llenar el buffer de audio. Si fallas, el audio cruje ("glitch").

## The Real-Time Constraints
1.  **No Allocations**: Nunca uses \`Box\`, \`Vec\` o \`String\` en el hilo de audio.
2.  **No Locks**: Un \`Mutex\` puede bloquear tu hilo si el sistema operativo decide programar otra tarea.
3.  **No IO**: Nada de \`println!\` o lectura de archivos.

\`\`\`dsp-viz
// Interactive: Latency Visualizer & GC Glitch Simulation
\`\`\`

## Lock-Free Ring Buffers
Para comunicar la UI (hilo principal) con el Audio (hilo de alta prioridad), usamos estructuras **SPSC (Single-Producer Single-Consumer)** como \`ringbuf\`.

> 💎 **Pro Tip: SIMD for DSP**
> 
> Procesar audio es matemática pura sobre arrays. Usar \`std::simd\` te permite procesar 4, 8 o 16 muestras de audio simultáneamente, multiplicando el rendimiento de tus filtros y sintetizadores.
`;

export const content_hotswap = `
# The Final Frontier: Dynamic Systems & Hot Reload

La máxima expresión de un sistema robusto es aquel que puede actualizarse a sí mismo sin detenerse. Esto es vital para sistemas de alta disponibilidad y motores de juegos (DX).

## Architecture for Reloading
Separamos el programa en dos crates:
1.  **Host (App)**: Gestiona la ventana, el estado y el bucle principal.
2.  **Logic (Dylib)**: Contiene la lógica de negocio, compilada como \`.so\` o \`.dll\`.

\`\`\`hotswap-viz
// Visualizer: Live code swapping and state persistence
\`\`\`

## ABI Stability
Rust no tiene un ABI estable por defecto. Para que el Host cargue la nueva Logic sin crashear, debemos usar \`#[repr(C)]\` en las estructuras de estado compartidas o usar una librería como \`abi_stable\`.

> 💎 **Pro Tip: State Serialization**
> 
> Al recargar, la nueva librería necesita el estado de la vieja. El patrón común es serializar el estado a memoria (bytes), descargar la librería vieja, cargar la nueva, y deserializar el estado.
`;
