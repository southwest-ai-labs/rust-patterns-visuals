
export const content_crdt = `
# Global State: CRDTs & Eventual Consistency

En sistemas distribuidos globales (Multi-Region), el teorema CAP nos dice que debemos elegir entre Disponibilidad o Consistencia ante particiones. Los **CRDTs** nos permiten mantener Disponibilidad y Convergencia Fuerte.

## Conflict-free Replicated Data Types
Un CRDT es una estructura de datos que se puede actualizar en múltiples nodos sin coordinación, y que garantiza matemáticamente que todos los nodos convergerán al mismo estado.

\`\`\`crdt-viz
// Interactive: Simulating a network partition and state merge
\`\`\`

## Vector Clocks
Para fusionar estados, no podemos confiar en \`Date.now()\` (los relojes de los servidores varían). Usamos **Vector Clocks** para establecer una relación de causalidad ("esto ocurrió antes que aquello").

> 💎 **Pro Tip: Collaborative Editing**
> 
> Aplicaciones como Google Docs o Figma usan CRDTs para permitir que varios usuarios editen el mismo documento en tiempo real sin conflictos de sobreescritura.
`;

export const content_compiler_internals = `
# Compiler Sovereignty: MIR & rustc

Para dominar Rust, debes entender cómo piensa. El compilador no traduce tu código directamente a binario; pasa por varias etapas intermedias donde ocurre la magia.

## The MIR (Mid-level IR)
MIR es la representación donde el **Borrow Checker** cobra vida. Aquí, todos los bucles y construcciones complejas se han simplificado a un Grafo de Flujo de Control (CFG) primitivo.

\`\`\`mir-viz
// Visualizer: Inspecting the compilation pipeline stages
\`\`\`

## Monomorphization
Rust genera una copia de cada función genérica para cada tipo concreto que se usa. Esto permite optimizaciones extremas (inlining) pero aumenta el tamaño del binario.

> 💎 **Pro Tip: Inspecting MIR**
> 
> Puedes ver el MIR de tu código ejecutando: \`cargo rustc -- -Z unpretty=mir\`. Esto es invaluable para depurar por qué el Borrow Checker rechaza un programa que parece válido.
`;
