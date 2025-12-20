
export const content_cloud_native = `
# Cloud Sovereignty: Rust & Firecracker

En la era del Serverless, el coste se mide en milisegundos y megabytes. Rust es el lenguaje "Cloud Native" por excelencia porque elimina el coste de los lenguajes interpretados y pesados.

## MicroVMs and Cold Starts
Los lenguajes como Java requieren segundos para calentar la JVM. Rust compila a código máquina nativo, permitiendo arranques en <150ms.

\`\`\`micro-vm-lab
// Interactive: Cold Start & Memory footprint simulator
\`\`\`

## Binary Portability with MUSL
Al usar el target \`musl\`, generamos un binario que contiene todo lo que necesita para correr. Puedes meterlo en una imagen de Docker de 5MB basada en \`scratch\` (vacía).

> 💎 **Pro Tip: AWS Firecracker**
> 
> AWS Lambda y Fargate corren sobre **Firecracker**, una tecnología de virtualización escrita en **Rust**. Al escribir tus Lambdas en Rust, estás hablando el mismo lenguaje que la infraestructura que te aloja.
`;

export const content_wasm_lattice = `
# Distributed Sovereignty: WasmCloud

El futuro de los sistemas distribuidos es el **Lattice**. Una red donde los componentes de software (Actores) se conectan dinámicamente a sus dependencias (Capacidades) sin saber dónde están físicamente.

## Distributed Actors
Un actor en WasmCloud es un binario Wasm que solo contiene lógica de negocio. No tiene red, ni base de datos, ni logs integrados.

\`\`\`wasm-orchestrator
// Visualizer: Distributed Actor migration
\`\`\`

## Capability Providers
Si tu actor necesita una Base de Datos, solicita un "Capability Contract". La infraestructura vincula ese contrato a un proveedor real (Redis, Postgres, DynamoDB) en tiempo de ejecución.

> 💎 **Pro Tip: Security by Default**
> 
> Como los actores son Wasm, están en un sandbox total. Incluso si un atacante toma control de un actor, no puede acceder al sistema de archivos ni a la red a menos que la infraestructura le otorgue explícitamente ese permiso.
`;
