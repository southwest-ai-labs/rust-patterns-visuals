
export const content_io_uring = `
# System Sovereignty: io_uring & High Performance

En el pasado, cada vez que leíamos un archivo o un socket, el programa se detenía y pedía permiso al Kernel (\`syscall\`). En sistemas de 10Gbps, el costo de estas interrupciones es inaceptable.

## The Ring Buffer Model
**io_uring** es la revolución de I/O de Linux. Permite una comunicación asíncrona real mediante colas compartidas en memoria entre tu aplicación Rust y el Kernel.

\`\`\`uring-viz
// Interactive: Ring Buffers submission and completion visualization
\`\`\`

## Zero Context Switches
Gracias a crates como \`tokio-uring\`, podemos enviar 100 operaciones de red en un solo viaje al Kernel. Esto elimina el 90% del overhead de CPU en servidores de bases de datos de alto rendimiento.

> 💎 **Pro Tip: Buffered vs Direct I/O**
> 
> Con io_uring y Rust, puedes usar \`O_DIRECT\` para saltarte el cache de archivos del sistema operativo y gestionar tu propio cache en RAM, logrando latencias deterministas de microsegundos.
`;

export const content_identity_attestation = `
# Identity Sovereignty: SPIFFE & SVIDs

En una red Zero-Trust, no confías en la IP ni en el Firewall. Confías en la **Identidad Criptográfica** del proceso.

## Workload Attestation
¿Cómo sabe el servidor de base de datos que la petición viene de tu microservicio de Rust y no de un atacante? El microservicio realiza una "Atestación".

\`\`\`identity-viz
// Visualizer: Hardware-backed identity attestation flow
\`\`\`

## Mutual TLS without Config
Usando el ecosistema de Rust con SPIRE, los certificados se rotan automáticamente cada hora. Tus servicios de Rust simplemente "recogen" su pasaporte del socket local y establecen conexiones seguras sin gestionar archivos \`.pem\` manualmente.

> 💎 **Pro Tip: Security Invariants**
> 
> Implementa el trait \`Identity\` en tus conexiones. Rust te permite asegurar en tiempo de compilación que una función de base de datos solo pueda llamarse si el contexto de la conexión contiene un SVID verificado del dominio de 'Finanzas'.
`;
