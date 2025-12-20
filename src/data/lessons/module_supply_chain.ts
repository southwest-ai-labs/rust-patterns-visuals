
export const content_supply_chain = `
# Supply Chain Sovereignty: SBOM & Auditing

Un sistema es tan fuerte como su eslabón más débil. En Rust, nuestras aplicaciones dependen de cientos de crates de terceros. La soberanía técnica requiere saber exactamente qué código estás metiendo en tu binario.

## The Dependency Explosion
A diferencia de C++, el ecosistema de Rust (\`crates.io\`) fomenta pequeñas piezas modulares. Esto es excelente para la mantenibilidad, pero crea una superficie de ataque masiva.

\`\`\`dep-graph-viz
// Visualizer: Real-time Dependency Security Auditing
\`\`\`

## Software Bill of Materials (SBOM)
Un SBOM es un inventario completo de todos los componentes. Herramientas como \`cargo-cyclonedx\` generan estos reportes para que los departamentos de seguridad puedan validar la integridad del software.

> 💎 **Pro Tip: cargo-audit**
> 
> Integra \`cargo-audit\` en tu pipeline de CI. Cruzará tu \`Cargo.lock\` con la base de datos de vulnerabilidades de RustSec y fallará el build si se detecta un crate con un parche de seguridad pendiente.
`;

export const content_build_security = `
# Build-Time Sovereignty: Proc Macros & build.rs

El mayor riesgo de seguridad en Rust no ocurre en el tiempo de ejecución (donde el SO nos protege), sino durante la **compilación**.

## The build.rs Trap
El archivo \`build.rs\` es un binario de Rust que se compila y ejecuta ANTES que tu aplicación. Tiene acceso total al sistema de archivos y la red de tu máquina de desarrollo.

\`\`\`macro-sandbox
// Visualizer: Build-time vs Runtime security boundaries
\`\`\`

## Auditing Proc Macros
Las macros procedurales son código de Rust que se ejecuta dentro del proceso del compilador. Pueden observar tu código fuente, enviarlo a un servidor externo o modificar el binario final sin dejar rastro en los logs.

> 💎 **Pro Tip: Watts & Sandboxing**
> 
> Proyectos como \`watt\` permiten ejecutar proc-macros dentro de un sandbox de **WebAssembly**. Esto garantiza que la macro no pueda acceder a tus archivos ni a la red, protegiendo tu estación de trabajo de crates maliciosos.
`;
