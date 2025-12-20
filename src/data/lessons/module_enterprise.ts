
export const content_distributed_systems = `
# Distributed Systems with Rust

A escala empresarial, un solo nodo no es suficiente. Rust brilla en sistemas distribuidos debido a su bajo consumo de memoria y predecibilidad.

## The Raft Consensus Pattern
¿Cómo se ponen de acuerdo 5 servidores en el valor de una variable sin un nodo central? Usamos el algoritmo **Raft**.

## Corporate Vaults: Team Engineering
En organizaciones grandes, los patrones de código deben ser consistentes. El **Architectural Vault** permite a los equipos compartir "Templates de Diseño" verificados por el departamento de seguridad.

\`\`\`arch-workbench
// Simulation: Team-wide pattern enforcement
\`\`\`

> 💎 **Pro Tip: Static Binaries**
> 
> Usar el target \`x86_64-unknown-linux-musl\` produce un binario estático total que no depende de librerías del sistema. Ideal para despliegues ultra-seguros en Scratch Docker images.
`;

export const content_observability = `
# Observability: Staff-Level Monitoring

En producción, "que funcione" no es suficiente. Necesitas saber **por qué** falló hace 3 horas.

## The Three Pillars: Metrics, Logs, Traces
Usando la librería \`tracing\`, podemos emitir eventos que se propagan a través de microservicios usando **Context Propagation**.

## OpenTelemetry (OTEL)
El estándar global para telemetría. Rust tiene una de las implementaciones más rápidas y seguras.

\`\`\`mermaid
graph LR
    App[Rust App] -->|OTLP| Collector[OTEL Collector]
    Collector -->|Export| Jaeger[Jaeger Tracing]
    Collector -->|Export| Prometheus[Prometheus Metrics]
    Collector -->|Export| Loki[Loki Logs]
\`\`\`

> 💎 **Pro Tip: B3 Propagation**
> 
> Al enviar headers HTTP, inyecta el \`trace_id\`. Esto permite ver una sola petición fluyendo desde el Gateway hasta la DB a través de 10 microservicios diferentes.
`;
