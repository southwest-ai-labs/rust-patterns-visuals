
export const content_service_mesh = `
# Mesh Sovereignty: Rust Control Plane

En arquitecturas distribuidas modernas, la red es el sistema operativo. Usamos **Service Meshes** para abstraer la complejidad de la comunicación entre cientos de micro-servicios.

## Mutual TLS (mTLS)
Rust es el lenguaje ideal para proxies de alto rendimiento (como \`linkerd-proxy\`). Procesa miles de handshakes por segundo con seguridad de memoria garantizada.

\`\`\`mesh-viz
// Interactive: Service Traffic and Encryption HUD
\`\`\`

## Intelligent Routing
Una Mesh permite realizar despliegues **Canary** (ej: enviar solo el 5% del tráfico a la nueva versión v2) sin cambiar el código de la aplicación, basándose en la identidad criptográfica del servicio.

> 💎 **Pro Tip: Sidecar Overhead**
> 
> Usar Rust en el plano de datos de la malla reduce la latencia agregada a menos de 1ms, algo vital cuando una sola petición de usuario puede desencadenar 50 llamadas internas.
`;

export const content_consensus = `
# Distributed Sovereignty: Raft & Quorum

Un sistema distribuido es inútil si los nodos no están de acuerdo en los datos. El **Consenso Distribuido** es el reto más difícil de la ingeniería de software.

## The Raft Algorithm
Raft es un algoritmo de consenso diseñado para ser comprensible. Rust, con su manejo estricto de estados y \`async/await\`, permite implementar Raft de forma segura y libre de deadlocks.

\`\`\`quorum-lab
// Visualizer: Leader election and Heartbeat monitoring
\`\`\`

## Linearizability
Significa que el sistema se comporta como si hubiera una sola copia de los datos, a pesar de estar replicado en 5 continentes. Rust ayuda a modelar estos estados inmutables con precisión quirúrgica.

> 💎 **Pro Tip: Network Partitions**
> 
> Un arquitecto senior siempre diseña para el fallo. Prueba tu sistema usando "Chaos Engineering" para simular cortes de red y asegurar que tu implementación de Raft no entre en un estado de división cerebral (Split-Brain).
`;
