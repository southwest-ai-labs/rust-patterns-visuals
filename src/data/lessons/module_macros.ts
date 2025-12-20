
export const content_declarative_macros = `
# Metaprogramming: Declarative Macros

Las macros declarativas (\`macro_rules!\`) permiten escribir código que genera código mediante **pattern matching** a nivel de tokens. Es como un \`match\` gigante para la sintaxis de Rust.

## El patrón "Incremental TT Muncher"
¿Cómo procesas una lista de argumentos de longitud desconocida? Usamos recursividad de macros.

\`\`\`rust
macro_rules! my_vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}
\`\`\`

> 💎 **Pro Tip: Macro Hygiene**
> 
> A diferencia de las macros de C, las de Rust son "higiénicas". No pueden acceder accidentalmente a variables locales del scope donde se expanden a menos que se les pase explícitamente.
`;

export const content_proc_macros = `
# Advanced Metaprogramming: Procedural Macros

Las Procedural Macros son funciones de Rust que se ejecutan **durante la compilación**. Reciben un \`TokenStream\` y devuelven otro. Es la herramienta definitiva para crear frameworks y abstracciones de alto nivel.

## Tipos de Proc Macros
1.  **Custom Derive**: Añade funcionalidad automática (\`#[derive(MyTrait)]\`).
2.  **Attribute-like**: Transforma items arbitrarios (\`#[my_attr]\`).
3.  **Function-like**: Macros que parecen llamadas a funciones (\`my_macro!(...)\`).

## El Pipeline de Transformación
Para escribir proc-macros efectivas, usamos el ecosistema \`syn\` (para parsear tokens en un AST) y \`quote\` (para convertir código de vuelta a tokens).

\`\`\`proc-macro-lab
// Visualizing the TokenStream transformation
\`\`\`

> 💎 **Pro Tip: Compilation Speed**
> 
> Las proc-macros viven en su propio crate de tipo \`proc-macro = true\`. Como se ejecutan en compilación, abusar de ellas puede ralentizar significativamente los tiempos de build. Úsalas con sabiduría.
`;
