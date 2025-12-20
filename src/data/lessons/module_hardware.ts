

export const content_assembly = `
# Hardware Sovereignty: Rust Inline ASM

Un arquitecto L7 no se detiene en el código de Rust. Cuando cada nanosegundo cuenta, usamos \`asm!\` para inyectar instrucciones específicas del procesador que el compilador no puede generar automáticamente.

## Direct CPU Control
Con \`asm!\`, puedes usar instrucciones como \`RDTSC\` para medir ciclos de reloj exactos o instrucciones SIMD personalizadas de arquitecturas ARM o x86.

\`\`\`asm-lab
// Interactive: CPU Register Stepper
\`\`\`

## Memory Fences
Al escribir código multi-hilo de muy bajo nivel (como un Mutex propio), necesitas asegurar que el hardware no reordene tus instrucciones. Usamos \`std::sync::atomic::fence\` para dictar el orden al procesador.

> 💎 **Pro Tip: Architecture Crate**
> 
> Antes de escribir assembly manual, revisa \`std::arch\`. Contiene funciones seguras (intrinsics) para casi todas las instrucciones especiales de las CPUs modernas.
`;

export const content_numa = `
# System Topology: NUMA Mastery

En servidores modernos con múltiples CPUs físicas, la memoria no es "igual" para todos los núcleos. Esto se llama **Non-Uniform Memory Access (NUMA)**.

## Local vs Remote Access
Si un hilo en la CPU 0 intenta leer memoria conectada físicamente a la CPU 1, los datos deben viajar por un bus de interconexión (UPI/QPI), lo que dobla la latencia.

\`\`\`numa-viz
// Visualizer: NUMA Sockets and Latency Penalties
\`\`\`

## Core Pinning
En Rust, usamos la crate \`hwloc\` o \`core_affinity\` para anclar (pin) un hilo de Tokio a un núcleo específico de la CPU. Esto maximiza el uso de la caché L1/L2 y evita accesos remotos a RAM.

> 💎 **Pro Tip: Data Locality**
> 
> Un sistema distribuido eficiente empieza por la eficiencia dentro de un solo servidor. Si no respetas la topología NUMA, tu base de datos de alto rendimiento perderá el 50% de su capacidad potencial de throughput.
`;
