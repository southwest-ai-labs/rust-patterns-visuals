

// Module: Design Patterns & Domain Modeling

export const content_newtype = `
# The Newtype Pattern

This is one of the most impactful patterns in Rust for **Domain Driven Design (DDD)**. It solves "Primitive Obsession" — the bad habit of using simple types like \`u32\` or \`String\` for complex domain concepts.

## The Problem: Swapped IDs

Imagine a game engine.

\`\`\`rust
fn attack(player_id: u32, monster_id: u32) { ... }

let p_id = 10;
let m_id = 55;

// Oops! We swapped them, but the compiler didn't complain.
attack(m_id, p_id); 
\`\`\`

## The Rust Solution: Tuple Structs

We wrap the primitive in a "New Type".

\`\`\`rust
struct PlayerId(u32);
struct MonsterId(u32);

fn attack(p: PlayerId, m: MonsterId) { ... }

fn main() {
    let p = PlayerId(10);
    let m = MonsterId(55);
    
    // attack(m, p); // COMPILE ERROR!
    // Expected PlayerId, found MonsterId.
}
\`\`\`

## Visualization: Zero Cost

You might think creating structs adds overhead. **It does not.**

\`\`\`visualizer
{
  "title": "Zero-Cost Abstraction Proof",
  "steps": [
    {
      "code": "let raw_id: u32 = 100;",
      "description": "A standard u32 integer stored on the stack. Takes 4 bytes.",
      "stack": [
        { "id": "raw", "name": "raw_id", "value": "100", "status": "active" }
      ],
      "heap": []
    },
    {
      "code": "let safe_id = PlayerId(100);",
      "description": "The Newtype wrapper. Notice it looks IDENTICAL in memory. The wrapper is purely a compile-time construct.",
      "stack": [
        { "id": "raw", "name": "raw_id", "value": "100", "status": "active" },
        { "id": "safe", "name": "safe_id", "value": "100", "status": "active" }
      ],
      "heap": []
    }
  ]
}
\`\`\`

Because \`PlayerId\` has a single field and often uses \`#[repr(transparent)]\`, it takes up the exact same space in memory as a \`u32\` and has the same performance. The wrapper exists *only* for the developer and the type checker.

## Adding Behavior

Newtypes allow you to add methods to primitives.

\`\`\`rust
struct Temperature(f64);

impl Temperature {
    fn from_celsius(t: f64) -> Self { Self(t) }
    fn is_freezing(&self) -> bool { self.0 <= 0.0 }
}
\`\`\`

> 💎 **Pro Tip: The From Trait**
> 
> To make your Newtypes easy to use, implement \`From\`:
>
> \`\`\`rust
> impl From<u32> for PlayerId {
>     fn from(id: u32) -> Self { PlayerId(id) }
> }
> // usage:
> let p: PlayerId = 50.into();
> \`\`\`

---
<!-- QUIZ START -->
[?] What is the runtime performance cost of the Newtype pattern?
[ ] Significant (extra pointer hop)
[ ] Small (function call overhead)
[x] Zero (it compiles away)

[?] Why use Newtypes?
[ ] To bypass the borrow checker
[ ] To make code shorter
[x] To enforce type safety and domain logic
`;

export const content_builder = `
# The Builder Pattern

In languages like Python or JavaScript, you can construct objects with named arguments and default values: \`Server(port=80, timeout=30)\`.
Rust does **not** support function overloading or named arguments. The idiomatic solution is the **Builder Pattern**.

## The Consuming Builder

The most common Rust pattern is the "Consuming Builder", which uses method chaining to transform the builder into the final object.

\`\`\`rust
struct Server {
    host: String,
    port: u16,
    tls: bool,
}

// 1. The Builder Struct (Often mirrors the target, but with Options)
struct ServerBuilder {
    host: String,
    port: u16,
    tls: bool,
}

impl ServerBuilder {
    fn new(host: &str) -> ServerBuilder {
        ServerBuilder {
            host: host.to_string(),
            port: 8080, // Default
            tls: false, // Default
        }
    }

    // 2. Chainable methods consume 'self' and return 'self'
    fn port(mut self, port: u16) -> ServerBuilder {
        self.port = port;
        self
    }

    fn tls(mut self) -> ServerBuilder {
        self.tls = true;
        self
    }

    // 3. Finalize
    fn build(self) -> Server {
        Server {
            host: self.host,
            port: self.port,
            tls: self.tls,
        }
    }
}

fn main() {
    let s = ServerBuilder::new("localhost")
        .port(3000)
        .tls()
        .build();
}
\`\`\`

## Visualization: Construction Pipeline

Watch how ownership is passed through the chain.

\`\`\`visualizer
{
  "title": "Consuming Builder Flow",
  "steps": [
    {
      "code": "let b1 = ServerBuilder::new(\"loc\");",
      "description": "Builder created on stack with defaults. 'host' is on heap.",
      "stack": [
        { "id": "b1", "name": "b1", "value": "{port:8080, tls:0}", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [ { "id": "h1", "value": "loc", "refs": 1 } ]
    },
    {
      "code": "let b2 = b1.port(3000);",
      "description": "b1 is MOVED into the method. It is modified and returned as b2. b1 is now invalid.",
      "stack": [
        { "id": "b1", "name": "b1", "value": "MOVED", "status": "moved" },
        { "id": "b2", "name": "b2", "value": "{port:3000, tls:0}", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [ { "id": "h1", "value": "loc", "refs": 1 } ]
    },
    {
      "code": "let final = b2.build();",
      "description": "b2 is MOVED into build(). The data is extracted to create the final Server struct.",
      "stack": [
        { "id": "b1", "name": "b1", "value": "MOVED", "status": "moved" },
        { "id": "b2", "name": "b2", "value": "MOVED", "status": "moved" },
        { "id": "s", "name": "final", "value": "SERVER{3000}", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [ { "id": "h1", "value": "loc", "refs": 1 } ]
    }
  ]
}
\`\`\`

> 💎 **Pro Tip: The derive_builder crate**
> 
> Writing builders manually is tedious boilerplate. In production, most Rustaceans use the \`derive_builder\` crate.
>
> \`\`\`rust
> #[derive(Builder)]
> struct Server {
>    host: String,
>    #[builder(default = "8080")]
>    port: u16,
> }
> \`\`\`
>
> This automatically generates the entire builder code for you at compile time!

---
<!-- QUIZ START -->
[?] Why do we use the Builder pattern in Rust?
[ ] Because classes don't exist
[x] To handle complex construction with optional parameters (simulating named args)
[ ] To improve runtime performance

[?] What does a consuming builder method (fn port(self, ...)) usually return?
[ ] Nothing (void)
[ ] A reference (&Self)
[x] The Builder itself (Self)
`;

export const content_from_into = `
# From & Into Traits

Data conversion is a huge part of software engineering. Converting a Database Entity to an API Response, or a String to a Config object.
Rust formalizes this with the \`From\` and \`Into\` traits.

## The From Trait

Always implement \`From\`. It defines how to create Type A *from* Type B.

\`\`\`rust
struct UserId(u32);

impl From<u32> for UserId {
    fn from(value: u32) -> Self {
        UserId(value)
    }
}
\`\`\`

## The "Free" Into Trait

Here is the magic: **If you implement From, you get Into for free.**

\`\`\`rust
let id_u32 = 100;

// Explicit call
let u1 = UserId::from(id_u32);

// Idiomatic conversion using .into()
// Rust infers the type required is UserId
let u2: UserId = id_u32.into(); 
\`\`\`

## Use Case: Flexible Arguments

This is why functions often accept \`impl Into<String>\` instead of just \`String\`. It allows the caller to pass anything that *can be converted* to a String (like \`&str\`), making the API nicer to use.

\`\`\`rust
struct Person {
    name: String,
}

impl Person {
    // Accepts "Bob", String::from("Bob"), etc.
    fn new(name: impl Into<String>) -> Person {
        Person { name: name.into() }
    }
}
\`\`\`

## Visualization: The Bridge

\`\`\`mermaid
graph TD
    subgraph "Your Code"
    Input[u32: 100]
    end
    
    subgraph "Trait Bridge"
    From[impl From<u32> for UserId]
    Into[impl Into<UserId> for u32]
    From -.->|Auto Generated| Into
    end
    
    subgraph "Destination"
    Output[UserId(100)]
    end
    
    Input --> Into
    Into --> Output
    
    style Into fill:#f59e0b,color:#000
\`\`\`

> 💎 **Pro Tip: TryFrom**
> 
> \`From\` is for conversions that **cannot fail** (e.g., u32 to u64).
> If conversion might fail (e.g., parsing a string "abc" into a number), use \`TryFrom\`. It returns a \`Result<T, E>\`.

---
<!-- QUIZ START -->
[?] If you implement From<A> for B, what else do you get automatically?
[ ] TryFrom<A> for B
[x] Into<B> for A
[ ] Default for B

[?] Which trait should you use for conversions that might fail (return an error)?
[ ] From
[ ] Into
[x] TryFrom
[ ] Convert
`;

export const content_typestate = `
# The Typestate Pattern

Most bugs in business logic come from performing an operation when the system is in the **wrong state**.
Example: Trying to read a file before opening it, or trying to refund a payment that hasn't been captured.

The Typestate pattern uses Rust's type system to make invalid states **unrepresentable**.

## The Problem: Runtime Checks

\`\`\`rust
struct Drone {
    is_flying: bool,
    position: (i32, i32)
}

impl Drone {
    fn fly(&mut self) {
        if self.is_flying { panic!("Already flying!"); }
        self.is_flying = true;
    }
}
\`\`\`
This relies on runtime checks (and crashes). We can do better.

## The Solution: Generic States

We create zero-sized types (Marker Types) to represent state.

\`\`\`rust
// States
struct Idle;
struct Hovering;

// The Context
struct Drone<State> {
    x: i32,
    y: i32,
    state: std::marker::PhantomData<State>, // Zero size
}

// Methods available ONLY when Idle
impl Drone<Idle> {
    fn take_off(self) -> Drone<Hovering> {
        Drone { 
            x: self.x, 
            y: self.y, 
            state: std::marker::PhantomData 
        }
    }
}

// Methods available ONLY when Hovering
impl Drone<Hovering> {
    fn land(self) -> Drone<Idle> {
        // ...
    }
}
\`\`\`

## Visualization: State Transitions

In this pattern, calling methods consumes the old object (\`self\`) and returns a new one with a different type.

\`\`\`mermaid
stateDiagram-v2
    [*] --> Drone~Idle~
    Drone~Idle~ --> Drone~Hovering~ : take_off()
    Drone~Hovering~ --> Drone~Idle~ : land()
    
    note right of Drone~Idle~
      Has no .land() method.
      Compiler prevents mistakes!
    end note
\`\`\`

> 💎 **Pro Tip: Consuming Self**
> 
> Notice we use \`self\` (consume) instead of \`&mut self\`. 
> \`\`\`rust
> fn take_off(self) -> Drone<Hovering>
> \`\`\`
> This invalidates the old \`Drone<Idle>\` variable. You literally **cannot** access the old state anymore. It physically transforms into the new state.

---
<!-- QUIZ START -->
[?] What is the main benefit of the Typestate Pattern?
[ ] It saves memory
[x] It prevents calling methods in the wrong state at compile time
[ ] It makes code shorter

[?] What happens to the old state variable after a transition?
[ ] It remains valid
[x] It is consumed and becomes invalid
[ ] It is automatically dropped
`;
