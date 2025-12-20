
// Module: Basic Patterns, Iterators, and Std Lib

export const content_control_flow = `
# Engineering Patterns: Performance Impact

En Rust, las decisiones arquitectónicas sobre cómo compartimos datos afectan directamente la experiencia del usuario final. No es solo sintaxis; es **Ingeniería de Sistemas**.

## Real-World Impact: The Dashboard Scenario

Imagina que estás construyendo un Dashboard de Trading en tiempo real. Miles de mensajes llegan cada segundo. ¿Cómo sincronizamos el acceso a esos datos sin congelar la interfaz de usuario (UI)?

\`\`\`arch-workbench
// Interactive Workbench: Synchronization vs UI Performance
\`\`\`

## Control Flow: The Rust Way

In C or Java, you use \`switch\`. In Rust, we use \`match\`, and it is far more powerful. It's not just about control flow; it's about **Pattern Matching**.

## The Match Statement

\`match\` requires you to handle *every possible case*. This is exhaustive checking, a core safety feature.

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

> 💎 **Pro Tip: The Power of Destructuring**
> 
> Don't just match values. Match **structure**. You can extract values from inside Enums directly in the match arm.
>
> \`\`\`rust
> match message {
>     Message::Move { x, y } => println!("Moved to x: {}, y: {}", x, y),
>     Message::Write(text) => println!("Text: {}", text),
>     _ => {}
> }
> \`\`\`
>
> This is a **Zero Cost Abstraction**. Rust compiles this down to efficient jump tables.

## Concise Control with \`if let\`

Sometimes \`match\` is too verbose when you only care about *one* specific case. Use \`if let\` to handle the match elegantly.

\`\`\`rust
let config = Some("config.toml");

// Idiomatic way to handle just the Some case
if let Some(filename) = config {
    println!("Loading config from: {}", filename);
}
// Optional else
else {
    println!("No config found.");
}
\`\`\`
`;

export const content_iterators = `
# Iterators: The Functional Path

Stop writing C-style \`for (int i=0; i<len; i++)\` loops. Rust's iterators are lazy, composable, and often faster than manual loops due to compiler optimizations (bounds check elision).

## The Idiomatic Approach

Instead of manually indexing:

\`\`\`rust
let numbers = vec![1, 2, 3, 4, 5];

// The "Gem" way
let squares: Vec<i32> = numbers
    .iter()
    .map(|x| x * x)
    .filter(|x| x % 2 == 0)
    .collect();
\`\`\`

## Visualizing the Stream

Think of data flowing through a pipe of transformations.

\`\`\`mermaid
graph LR
    A[Vec Data] -->|iter()| B(Iterator Stream)
    B -->|map| C(Transformed Items)
    C -->|filter| D(Filtered Items)
    D -->|collect| E[New Vec]
    style A fill:#1e293b,stroke:#38bdf8
    style E fill:#1e293b,stroke:#22c55e
\`\`\`

> 💎 **Pro Tip: Lazy Evaluation**
>
> Iterators do **nothing** until you consume them (e.g., with \`collect()\`, \`sum()\`, or a \`for\` loop). You can chain infinite transformations with zero overhead until the final consumption step.
`;

export const content_std_types = `
# Standard Library Essentials

The Rust Standard Library (\`std\`) is lean but powerful. Understanding \`Option\` and \`Result\` is critical to writing "safe" code.

## Option<T>: No More Nulls

In many languages, references can be \`null\`. In Rust, if a value might be missing, it MUST be wrapped in \`Option\`.

\`\`\`rust
let present: Option<Box<i32>> = Some(Box::new(5));
let missing: Option<Box<i32>> = None;
\`\`\`

## Visualizing Null Pointer Optimization

You might be worried that \`Option\` uses extra memory for the "tag" (to say if it is Some or None).
However, for pointer-like types (like \`Box\`, \`&T\`, \`Vec\`), Rust is incredibly smart.

Since a pointer can never be 0 (null) in Rust, the compiler uses the **0x0 address** to represent \`None\`. This makes \`Option<Box<T>>\` take **0 extra bytes** compared to a raw pointer.

\`\`\`visualizer
{
  "title": "Null Pointer Optimization",
  "steps": [
    {
      "code": "let a = Some(Box::new(10));",
      "description": "Option::Some contains a valid non-zero pointer. It looks exactly like a standard Box in memory.",
      "stack": [
        { "id": "a", "name": "a (Some)", "value": "ptr -> 0xF1", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "10", "refs": 1 }
      ]
    },
    {
      "code": "let b = None;",
      "description": "Option::None is represented internally as 0x0 (Null). No tag byte is needed. It consumes the same space as a pointer (8 bytes).",
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
`;
