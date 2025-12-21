
// Module: Basic Patterns, Iterators, and Std Lib

export const content_onboarding: { en: string; es: string } = {
  es: `
# Onboarding: Cómo usar RUST.HUB

Bienvenido. Esta es una experiencia **lesson-first**: eliges una lección en la barra lateral, lees el contenido y completas el reto/quiz cuando exista.

## Objetivo (3–5 min)

- Entender cómo navegar el curso.
- Saber cómo funciona tu progreso (MMR / rango).
- Conocer atajos y configuración.

## Cómo navegar

- **Barra lateral (izquierda):** módulos → lecciones.
- **Pestañas arriba:**
  - **Neural Uplink:** contenido de lección.
  - **Command Deck:** dashboard/visuales cuando aplique.

## Progreso y rango

- Completar lecciones te otorga **MMR**.
- Tu rango se calcula con el MMR y queda guardado en tu navegador (local-first).

## Idioma y atajos

- Botón de idioma en el sidebar (EN/ES).
- **Alt+S:** Ajustes.
- **Ctrl+K / Cmd+K:** Búsqueda (Command Palette).

## GitHub (opcional)

En la parte inferior del sidebar puedes abrir el panel de GitHub para sincronizar tu progreso. Si no lo activas, todo queda local.

## Siguiente paso

Abre la lección **Match & If Let** y enfócate en 2 ideas: *exhaustividad* y *destructuring*.
`,
  en: `
# Onboarding: How to use RUST.HUB

Welcome. This is a **lesson-first** experience: pick a lesson from the sidebar, read it, and complete the challenge/quiz when available.

## Goal (3–5 min)

- Learn how to navigate the course.
- Understand how progress works (MMR / rank).
- Learn the main shortcuts and settings.

## Navigation

- **Left sidebar:** modules → lessons.
- **Top tabs:**
  - **Neural Uplink:** lesson content.
  - **Command Deck:** dashboards/visuals when applicable.

## Progress and rank

- Completing lessons grants **MMR**.
- Your rank is computed from MMR and saved in your browser (local-first).

## Language and shortcuts

- Language button in the sidebar (EN/ES).
- **Alt+S:** Settings.
- **Ctrl+K / Cmd+K:** Search (Command Palette).

## GitHub (optional)

At the bottom of the sidebar you can open the GitHub panel to sync progress. If you don’t enable it, everything stays local.

## Next step

Open **Match & If Let** and focus on 2 ideas: *exhaustiveness* and *destructuring*.
`
};

export const content_control_flow: { en: string; es: string } = {
  es: `
# Match & If Let

## Qué vas a aprender

- Por qué Rust prefiere \`match\` (exhaustividad).
- Cómo extraer valores con *pattern matching* (destructuring).
- Cuándo usar \`if let\` para un solo caso.

## Impacto real: el escenario del dashboard

Imagina que estás construyendo un Dashboard de Trading en tiempo real. Miles de mensajes llegan cada segundo. ¿Cómo sincronizamos el acceso a esos datos sin congelar la interfaz de usuario (UI)?

\`\`\`arch-workbench
// Interactive Workbench: Synchronization vs UI Performance
\`\`\`

## Control de flujo: a la manera de Rust

En C o Java sueles usar \`switch\`. En Rust usamos \`match\` y es mucho más potente: no es solo control flow, es **Pattern Matching**.

## La sentencia \`match\`

\`match\` te obliga a manejar *cada caso posible*. Esto es *exhaustive checking*, una pieza clave de seguridad.

\`\`\`rust
enum Direction {
  North,
  South,
  East,
  West,
}

fn main() {
  let dir = Direction::North;

  // Every variant must be covered
  match dir {
    Direction::North => println!("Heading Up!"),
    Direction::South => println!("Heading Down!"),
    _ => println!("Heading Sideways"), // Catch-all
  }
}
\`\`\`

> 💎 **Tip: el poder del destructuring**
>
> No solo matchees valores: matchea **estructura**. Puedes extraer valores dentro de enums directamente en el brazo del match.
>
> \`\`\`rust
> match message {
>   Message::Move { x, y } => println!("Moved to x: {}, y: {}", x, y),
>   Message::Write(text) => println!("Text: {}", text),
>   _ => {}
> }
> \`\`\`
>
> Esto es una **abstracción de costo cero**: el compilador lo baja a saltos eficientes.

## Control conciso con \`if let\`

A veces \`match\` es verboso si solo te importa *un* caso. Usa \`if let\` para manejarlo de forma concisa.

\`\`\`rust
let config = Some("config.toml");

// Idiomatic way to handle just the Some case
if let Some(filename) = config {
  println!("Loading config from: {}", filename);
} else {
  println!("No config found.");
}
\`\`\`
`,
  en: `
# Match & If Let

## What you’ll learn

- Why Rust prefers \`match\` (exhaustiveness).
- How to extract values via *pattern matching* (destructuring).
- When to use \`if let\` for a single case.

## Real-world impact: the dashboard scenario

Imagine you’re building a real-time trading dashboard. Thousands of messages arrive every second. How do we synchronize access to that data without freezing the UI?

\`\`\`arch-workbench
// Interactive Workbench: Synchronization vs UI Performance
\`\`\`

## Control flow: the Rust way

In C or Java you often use \`switch\`. In Rust we use \`match\`, and it’s far more powerful: it’s not just control flow, it’s **pattern matching**.

## The \`match\` statement

\`match\` forces you to handle *every possible case*. This is exhaustive checking, a core safety feature.

\`\`\`rust
enum Direction {
  North,
  South,
  East,
  West,
}

fn main() {
  let dir = Direction::North;

  // Every variant must be covered
  match dir {
    Direction::North => println!("Heading Up!"),
    Direction::South => println!("Heading Down!"),
    _ => println!("Heading Sideways"), // Catch-all
  }
}
\`\`\`

> 💎 **Tip: the power of destructuring**
>
> Don’t just match values. Match **structure**. You can extract values from inside enums directly in the match arm.
>
> \`\`\`rust
> match message {
>   Message::Move { x, y } => println!("Moved to x: {}, y: {}", x, y),
>   Message::Write(text) => println!("Text: {}", text),
>   _ => {}
> }
> \`\`\`
>
> This is a **zero-cost abstraction**: the compiler lowers it into efficient branching.

## Concise control with \`if let\`

Sometimes \`match\` is verbose when you only care about *one* case. Use \`if let\` to handle it concisely.

\`\`\`rust
let config = Some("config.toml");

// Idiomatic way to handle just the Some case
if let Some(filename) = config {
  println!("Loading config from: {}", filename);
} else {
  println!("No config found.");
}
\`\`\`
`
};

export const content_iterators: { en: string; es: string } = {
  es: `
# Iteradores: el camino funcional

Deja de escribir bucles estilo C como \`for (int i=0; i<len; i++)\`. En Rust, los iteradores son *lazy*, componibles y a menudo más rápidos gracias a optimizaciones del compilador (por ejemplo, eliminación de bounds checks).

## Enfoque idiomático

En vez de indexar manualmente:

\`\`\`rust
let numbers = vec![1, 2, 3, 4, 5];

// La forma idiomática
let squares: Vec<i32> = numbers
  .iter()
  .map(|x| x * x)
  .filter(|x| x % 2 == 0)
  .collect();
\`\`\`

## Visualizando el stream

Piensa en los datos fluyendo por una tubería de transformaciones.

\`\`\`mermaid
graph LR
    A[Vec Data] -->|iter()| B(Iterator Stream)
    B -->|map| C(Transformed Items)
    C -->|filter| D(Filtered Items)
    D -->|collect| E[New Vec]
    style A fill:#1e293b,stroke:#38bdf8
    style E fill:#1e293b,stroke:#22c55e
\`\`\`

> 💎 **Tip: evaluación perezosa (lazy)**
>
> Los iteradores no hacen **nada** hasta que los consumes (por ejemplo, con \`collect()\`, \`sum()\` o un \`for\`). Puedes encadenar transformaciones con costo casi cero hasta el paso final.
`,
  en: `
# Iterators: the functional path

Stop writing C-style loops like \`for (int i=0; i<len; i++)\`. Rust iterators are lazy, composable, and often faster than manual loops thanks to compiler optimizations (e.g. bounds-check elision).

## The idiomatic approach

Instead of manually indexing:

\`\`\`rust
let numbers = vec![1, 2, 3, 4, 5];

// The idiomatic way
let squares: Vec<i32> = numbers
  .iter()
  .map(|x| x * x)
  .filter(|x| x % 2 == 0)
  .collect();
\`\`\`

## Visualizing the stream

Think of data flowing through a pipeline of transformations.

\`\`\`mermaid
graph LR
    A[Vec Data] -->|iter()| B(Iterator Stream)
    B -->|map| C(Transformed Items)
    C -->|filter| D(Filtered Items)
    D -->|collect| E[New Vec]
    style A fill:#1e293b,stroke:#38bdf8
    style E fill:#1e293b,stroke:#22c55e
\`\`\`

> 💎 **Tip: lazy evaluation**
>
> Iterators do **nothing** until you consume them (e.g. with \`collect()\`, \`sum()\`, or a \`for\` loop). You can chain transformations with near-zero overhead until the final step.
`
};

export const content_std_types: { en: string; es: string } = {
  es: `
# Esenciales de la librería estándar

La librería estándar de Rust (\`std\`) es pequeña pero potente. Entender \`Option\` y \`Result\` es clave para escribir código seguro sin \`null\` ni excepciones.

## Option<T>: adiós a null

En muchos lenguajes las referencias pueden ser \`null\`. En Rust, si un valor puede faltar, **debe** estar envuelto en \`Option\`.

\`\`\`rust
let present: Option<Box<i32>> = Some(Box::new(5));
let missing: Option<Box<i32>> = None;
\`\`\`

## Visualizando la optimización de puntero nulo (NPO)

Quizá te preocupe que \`Option\` use memoria extra para un “tag”. Para tipos tipo puntero (\`Box\`, \`&T\`, \`Vec\`), el compilador usa el **0x0** para representar \`None\`, así que \`Option<Box<T>>\` puede costar **0 bytes extra**.

\`\`\`visualizer
{
  "title": "Null Pointer Optimization",
  "steps": [
    {
      "code": "let a = Some(Box::new(10));",
      "description": "Option::Some contiene un puntero no-cero válido. En memoria se ve igual que un Box normal.",
      "stack": [
        { "id": "a", "name": "a (Some)", "value": "ptr -> 0xF1", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "10", "refs": 1 }
      ]
    },
    {
      "code": "let b = None;",
      "description": "Option::None se representa internamente como 0x0 (Null). No hace falta tag y ocupa lo mismo que un puntero.",
      "stack": [
        { "id": "a", "name": "a (Some)", "value": "ptr -> 0xF1", "status": "active", "isPointerTo": "h1" },
        { "id": "b", "name": "b (None)", "value": "0x000000", "status": "active" }
      ],
      "heap": [
        { "id": "h1", "value": "10", "refs": 1 }
      ]
    }
  ]
}
\`\`\`
`,
  en: `
# Standard Library Essentials

Rust’s standard library (\`std\`) is lean but powerful. Understanding \`Option\` and \`Result\` is critical for writing safe code without \`null\` or exceptions.

## Option<T>: no more nulls

In many languages, references can be \`null\`. In Rust, if a value might be missing, it **must** be wrapped in \`Option\`.

\`\`\`rust
let present: Option<Box<i32>> = Some(Box::new(5));
let missing: Option<Box<i32>> = None;
\`\`\`

## Visualizing Null Pointer Optimization (NPO)

You might worry that \`Option\` needs extra space for a “tag”. For pointer-like types (\`Box\`, \`&T\`, \`Vec\`), the compiler can use **0x0** to represent \`None\`, so \`Option<Box<T>>\` can cost **0 extra bytes**.

\`\`\`visualizer
{
  "title": "Null Pointer Optimization",
  "steps": [
    {
      "code": "let a = Some(Box::new(10));",
      "description": "Option::Some contains a valid non-zero pointer. In memory it looks exactly like a normal Box.",
      "stack": [
        { "id": "a", "name": "a (Some)", "value": "ptr -> 0xF1", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "10", "refs": 1 }
      ]
    },
    {
      "code": "let b = None;",
      "description": "Option::None is represented internally as 0x0 (Null). No tag is needed and it takes the same space as a pointer.",
      "stack": [
        { "id": "a", "name": "a (Some)", "value": "ptr -> 0xF1", "status": "active", "isPointerTo": "h1" },
        { "id": "b", "name": "b (None)", "value": "0x000000", "status": "active" }
      ],
      "heap": [
        { "id": "h1", "value": "10", "refs": 1 }
      ]
    }
  ]
}
\`\`\`
`
};
