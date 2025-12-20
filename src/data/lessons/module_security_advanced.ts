
export const content_ebpf = `
# Kernel Sovereignty: eBPF & Aya

Para un ingeniero L7, el Kernel no es una caja negra. Con **eBPF (Extended Berkeley Packet Filter)**, podemos inyectar lógica de Rust directamente en el corazón del Sistema Operativo sin recompilarlo.

## Rust as a First-Class Citizen
Gracias a crates como \`aya\`, podemos escribir sondas de eBPF en Rust puro, aprovechando la seguridad de tipos antes de cargar el bytecode en el verificador del kernel.

\`\`\`ebpf-viz
// Interactive: Injecting and monitoring Kernel Probes
\`\`\`

## High Performance Observability
eBPF es la base de herramientas como **Cilium** o **Falco**. Permite monitorizar cada llamada al sistema (syscall) con un impacto en el rendimiento casi nulo.

> 💎 **Pro Tip: XDP (Express Data Path)**
> 
> Si necesitas construir el firewall más rápido del mundo, usa Rust con XDP. Los paquetes se filtran directamente en la tarjeta de red, antes de que el stack de red del Kernel siquiera los toque.
`;

export const content_confidential_computing = `
# Hardware Sovereignty: Secure Enclaves

En un mundo de nubes públicas, ¿cómo confías en que el dueño del servidor no lea tus claves privadas? La respuesta es **Confidential Computing**.

## Memory Isolation via TEE
Los **Trusted Execution Environments (TEE)** como Intel SGX crean "Enclaves": regiones de memoria cifradas por hardware que son invisibles incluso para el Kernel del SO o el Hypervisor.

\`\`\`enclave-viz
// Visualizer: Hardware Memory Isolation and Ciphers
\`\`\`

## Rust-TEE Ecosystem
Proyectos como \`Fortanix EDP\` o \`Apache Teaclave\` permiten compilar aplicaciones de Rust para que corran dentro de estos enclaves seguros, garantizando que el estado interno sea privado por diseño de hardware.

> 💎 **Pro Tip: Attestation**
> 
> Un enclave no solo protege datos; también permite la "Atestación". El hardware genera un certificado firmado que demuestra al cliente remoto que el binario de Rust que está ejecutando no ha sido modificado.
`;
