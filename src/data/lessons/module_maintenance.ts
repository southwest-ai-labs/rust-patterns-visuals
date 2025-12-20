
export const content_refactoring = `
# Maintenance Mastery: Idiomatic Refactoring

Un sistema en Rust que sobrevive al tiempo es aquel que evoluciona hacia patrones idiomáticos. La refactorización no es solo estética; es una herramienta para prevenir bugs de concurrencia y reducir la presión sobre el asignador de memoria.

## El costo de la Deuda Técnica
Código escrito al estilo C (bucles manuales, manejo de memoria inseguro) suele ocultar cuellos de botella que el compilador no puede optimizar.

\`\`\`refactor-lab
// Interactive: Legacy to Idiomatic transformation
\`\`\`

## Patrones de Limpieza
1.  **Entry API**: Evita dobles búsquedas en HashMaps.
2.  **Borrowing vs Cloning**: Usa \`Cow\` para evitar clonaciones cuando la mayoría de las veces el dato es de solo lectura.
3.  **Combinadores Funcionales**: Reemplaza \`for\` loops con iteradores para habilitar optimizaciones de límites (bounds checking elision).

> 💎 **Pro Tip: Refactoring Safety**
> 
> Antes de refactorizar, asegúrate de tener una suite de **Property-Based Testing** activa. Si el comportamiento cambia bajo miles de entradas aleatorias, tu refactorización ha roto una invariante.
`;

export const content_cluster_ops = `
# Swarm Sovereignty: Cluster Observability

En la arquitectura L5, un nodo es solo una pieza de un enjambre (Swarm). La observabilidad distribuida es lo que separa a un desarrollador senior de un arquitecto Staff.

## Context Propagation
¿Cómo sabes que un error en el microservicio de Pagos fue causado por un timeout en la Base de Datos a 3 saltos de distancia? La respuesta es el **Trace ID**.

\`\`\`swarm-monitor
// Visualizer: Distributed request flow
\`\`\`

## Resilience Patterns
- **Circuit Breakers**: Detén el tráfico hacia un servicio herido para permitir que se recupere.
- **Adaptive Concurrency**: Ajusta el número de tareas permitidas basándote en la latencia medida en tiempo real.

> 💎 **Pro Tip: Zero-Cost Metrics**
> 
> Usa la librería \`metrics\` de Rust para registrar contadores y tiempos de ejecución. En modo release, muchas de estas métricas se compilan como operaciones atómicas rápidas, permitiendo monitoreo extremo con impacto <1%.
`;
