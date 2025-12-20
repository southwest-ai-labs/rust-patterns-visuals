
export const content_formal_methods = `
# Formal Sovereignty: Kani & Proofs

Un ingeniero Distinguished no confía en "miles de tests". Confía en la matemática. La **Verificación Formal** es el proceso de demostrar que un programa es correcto para TODA entrada posible.

## Model Checking with Kani
Kani es un model checker para Rust que utiliza lógica simbólica. No ejecuta el código; analiza todas las ramas de ejecución simultáneamente.

\`\`\`model-viz
// Visualizer: State Space exploration and pruning
\`\`\`

## Symbolic Execution
Imagina que \`x\` es un entero. Un test normal prueba 10 o 100 valores. Kani trata a \`x\` como un símbolo matemático y demuestra que para cualquier valor de 32 bits, la propiedad se mantiene.

> 💎 **Pro Tip: Bound Checks**
> 
> Usa la verificación formal para asegurar que tus algoritmos \`unsafe\` de alto rendimiento nunca se salgan de los límites del buffer. Es la única forma de garantizar "cero bugs" de memoria.
`;

export const content_pqc = `
# National Security Sovereignty: Post-Quantum Rust

RSA y Curva Elíptica (ECC) serán vulnerables cuando los ordenadores cuánticos escalen. El mundo está migrando a **Post-Quantum Cryptography (PQC)**, y Rust es el motor de esta transición.

## Lattice-Based Cryptography
Casi todos los algoritmos PQC aprobados por el NIST (como Kyber) se basan en la dificultad matemática de navegar rejillas multidimensionales.

\`\`\`lattice-viz
// Visualizer: Multi-dimensional grid and shortest vector problem
\`\`\`

## Timing Attack Mitigation
Rust permite escribir código de "Tiempo Constante" de forma más natural que C. Esto es crítico en criptografía para evitar que un atacante adivine la clave midiendo cuánto tarda en ejecutarse una función.

> 💎 **Pro Tip: The Crypto Crate**
> 
> Explora la organización \`RustCrypto\`. Están reescribiendo la infraestructura de seguridad del mundo en Rust puro, eliminando décadas de vulnerabilidades acumuladas en librerías C como OpenSSL.
`;
