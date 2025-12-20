
export const content_gats = `
# Type Sovereignty: GATs & HRTBs

Los **Generic Associated Types (GATs)** resolvieron una de las mayores limitaciones de Rust: la incapacidad de devolver un tipo que dependiera de un lifetime de entrada en un trait.

## ¿Para qué sirven?
Imagina un trait \`Iterable\`. Sin GATs, no podías definir un iterador que devolviera referencias a los datos internos del contenedor.

\`\`\`rust
trait Iterable {
    type Item<'a> where Self: 'a;
    fn iter<'a>(&'a self) -> Self::Item<'a>;
}
\`\`\`

## HRTBs: Higher-Rank Trait Bounds
El uso de \`for<'a>\` permite decir: "Este bound debe cumplirse para CUALQUIER lifetime, no solo para uno específico". Es esencial para closures que procesan referencias.

> 💎 **Pro Tip: Library Design**
> 
> Si estás diseñando un framework de base de datos o una librería de red, los GATs te permitirán exponer APIs "Zero-Copy" que antes eran imposibles.
`;

export const content_variance = `
# Deep Logic: Variance & Subtyping

La **Varianza** es cómo el compilador decide si un tipo \`Foo<A>\` es un subtipo de \`Foo<B>\` basándose en la relación entre \`A\` y \`B\`. En Rust, esto aplica principalmente a los **Lifetimes**.

## Los Tres Estados
1.  **Covariante**: Si \`'a: 'b\` (A vive más que B), entonces \`T<'a>\` puede usarse donde se espera \`T<'b>\`. (Ej: \`&'a T\`).
2.  **Invariante**: Se requiere el lifetime exacto. Ni más corto, ni más largo. (Ej: \`&'a mut T\`).
3.  **Contravariante**: Lo opuesto a covariante. (Ej: Argumentos de funciones).

## ¿Por qué '&mut T' es Invariante?
Si fuera covariante, podrías escribir una referencia de vida corta en un lugar que espera una vida larga, causando un "Dangling Pointer" al terminar la vida corta. El compilador lo prohíbe para salvar la integridad de la memoria.

> 💎 **Pro Tip: UnsafeCell & Variance**
> 
> \`UnsafeCell<T>\` es invariante en \`T\`. Esta es la razón por la cual casi todos los tipos que permiten mutabilidad interior deshabilitan ciertas optimizaciones automáticas de sub-tipificación.
`;

export const content_loom = `
# Formal Verification: The Loom Engine

Probar concurrencia con tests normales es inútil debido al "Heisenbug": el error desaparece cuando intentas observarlo. **Loom** es un verificador de permutaciones.

## Cómo funciona Loom
En lugar de usar los hilos del SO, Loom ejecuta tu código en un modelo controlado donde **fuerza cada orden posible** de operaciones atómicas.

\`\`\`loom-viz
// Simulator: Exposing a race condition via Loom interleavings
\`\`\`

> 💎 **Pro Tip: Atomic Ordering**
> 
> Usar \`Ordering::Relaxed\` es tentador por velocidad, pero Loom te demostrará por qué suele ser una mala idea en estados globales críticos.
`;
