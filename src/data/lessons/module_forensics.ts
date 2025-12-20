
export const content_flamegraphs = `
# Systems Forensics: Flamegraphs

En sistemas de alta escala, la intuición engaña. Un ingeniero Staff no adivina; mide. Los **Flamegraphs** son la herramienta estándar para entender dónde se queman los ciclos de CPU.

## The Hot Path
El "Hot Path" es el conjunto de funciones que se ejecutan con mayor frecuencia. Optimizar una función que consume el 0.1% del tiempo es una pérdida de recursos.

\`\`\`flame-viz
// Interactive: Call Stack Depth and Heat visualization
\`\`\`

## Deep LTO (Link-Time Optimization)
Rust permite optimizaciones a través de todos los crates de tu proyecto. Al habilitar \`lto = "fat"\`, el compilador puede realizar inlining de funciones de librerías externas en tu código principal, eliminando el coste de la llamada.

> 💎 **Pro Tip: Sample-Based Profiling**
> 
> Usa herramientas como \`cargo-flamegraph\` o \`samply\`. A diferencia de los debuggers, el perfilado por muestreo tiene un impacto mínimo en el rendimiento, permitiéndote medir sistemas en producción real.
`;

export const content_allocations = `
# Zero-Alloc Engineering: SmallVec & ArrayVec

La memoria es el cuello de botella invisible. Cada vez que tu programa pide memoria al Heap (\`Box\`, \`Vec\`, \`String\`), debe detenerse para hablar con el asignador del sistema.

## The Small-Object Optimization
Muchos vectores en producción solo contienen 1 o 2 elementos. Usar un \`Vec\` estándar es overkill.

\`\`\`alloc-tracker
// Visualizer: Heap Churn vs Stack-Based storage
\`\`\`

## Tooling: DHAT & Valgrind
Para encontrar fugas de memoria o excesivas asignaciones, usamos **DHAT**. Te permite ver exactamente qué línea de código generó la mayor cantidad de basura en el heap.

> 💎 **Pro Tip: Allocation Pressure**
> 
> Si tu servicio procesa 100k req/s y cada una asigna 10 veces, estás haciendo 1 millón de llamadas al sistema por segundo. Reducir esto a 0 mediante \`SmallVec\` o \`Bump Allocators\` puede triplicar tu throughput.
`;
