


// Module: Reliability & Error Handling

export const content_errors = `
# ThisError vs Anyhow

Rust has \`Result<T, E>\` built-in, but handling errors in a large codebase requires strategy. The community has settled on two crates that dominate the ecosystem: **thiserror** and **anyhow**.

## The Rule of Thumb

*   **thiserror**: Use for **Libraries**. Use when you want to define specific, structured error types that API consumers can match against.
*   **anyhow**: Use for **Applications**. Use when you just want to handle the error, log it, and maybe bubble it up, but don't care about the specific type.

## Using thiserror (Library Code)

\`\`\`rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum DataStoreError {
    #[error("data store disconnected")]
    Disconnect(#[from] std::io::Error),
    #[error("the data key {0} is invalid")]
    InvalidKey(String),
    #[error("unknown error")]
    Unknown,
}
\`\`\`
It automatically implements \`Display\` and \`std::error::Error\` for you.

## Using anyhow (Application Code)

Anyhow gives you a magic trait object-like type \`Result<T>\` (which defaults to \`anyhow::Error\`). It allows you to add **Context**.

\`\`\`rust
use anyhow::{Context, Result};

fn main() -> Result<()> {
    // If this fails, the error message will be:
    // "Failed to read config file: No such file or directory"
    let content = std::fs::read_to_string("config.toml")
        .context("Failed to read config file")?;
        
    Ok(())
}
\`\`\`

## Visualization: Error Bubble Up

\`\`\`mermaid
graph BT
    A[std::io::Error] -->|?| B[anyhow::Error]
    B -->|.context()| C[Enriched Error]
    C -->|Main| D[Print Trace]
    
    style A fill:#ef4444,color:#fff
    style D fill:#1e293b,stroke:#fff
\`\`\`

> 💎 **Pro Tip: The ? Operator**
> 
> The \`?\` operator automatically converts errors using the \`From\` trait. 
> \`thiserror\` generates that implementation, and \`anyhow\` implements \`From\` for almost all error types. 
> This is why \`?\` works seamlessly to convert a specific low-level error into your high-level generic error.

---
<!-- QUIZ START -->
[?] Which crate should you use if you are writing a reusable library?
[ ] anyhow
[x] thiserror
[ ] std::error

[?] What is the primary purpose of 'anyhow::Context'?
[ ] To speed up error handling
[ ] To retry failed operations
[x] To attach more info (like "failed to open file") to an error chain
`;

export const content_logging = `
# Structured Logging with Tracing

In simple apps, \`println!\` is enough. In distributed systems, async applications, or production services, you need **Structured Logging**.
The standard in Rust is the **tracing** crate.

## Logs vs Spans

*   **Event (Log)**: Something happened at a point in time. ("Request received")
*   **Span**: A period of time with a context. ("Processing Request ID 123... took 50ms")

## Instrumentation

The easiest way to log is the \`#[instrument]\` macro. It automatically creates a Span for the function, capturing all arguments as fields.

\`\`\`rust
use tracing::{info, instrument};

#[instrument]
fn process_order(id: u32) {
    info!("Starting order processing...");
    // The log output will look like:
    // level=INFO span=process_order{id=123}: Starting order processing...
}
\`\`\`

## Async Compatibility

Standard loggers don't work well with \`async/await\` because a task might yield and resume on a different thread. **Tracing** is designed for async. It knows how to track the context of a task even as it jumps between threads.

## Visualization: Spans

\`\`\`mermaid
gantt
    title Request Trace
    dateFormat X
    axisFormat %s
    
    section HTTP Request
    GET /users/1   :active, a1, 0, 100
    
    section Database
    Connect        :        b1, 10, 30
    Query          :        b2, 30, 80
\`\`\`

> 💎 **Pro Tip: Subscribers**
> 
> \`tracing\` libraries don't output text themselves. They emit events. You need a **Subscriber** (like \`tracing-subscriber\`) to format them.
> You can swap the subscriber to output JSON for Datadog/Splunk, or pretty colors for your terminal, without changing a single line of your application code.

---
<!-- QUIZ START -->
[?] Why is 'tracing' better than 'log' for async Rust?
[ ] It is faster
[x] It tracks context (Spans) across async await points
[ ] It uses less memory

[?] What does #[instrument] do?
[ ] It measures CPU usage
[x] It creates a Span for the function and captures arguments
[ ] It catches errors
`;

export const content_config = `
# Configuration Management

Hardcoding settings is a sin. Reading environment variables manually (\`std::env::var\`) is tedious and error-prone. The idiomatic solution is the **config** crate combined with **serde**.

## The Layered Approach

Robust applications follow a hierarchy:
1.  **Default values** (Hardcoded safety net).
2.  **Configuration File** (config.toml/yaml).
3.  **Environment Variables** (Docker/Kubernetes overrides).

## The Implementation

We define a struct representing our config and derive \`Deserialize\`.

\`\`\`rust
use serde::Deserialize;
use config::{Config, File, Environment};

#[derive(Debug, Deserialize)]
struct Settings {
    database_url: String,
    port: u16,
    debug: bool,
}

impl Settings {
    fn new() -> Result<Self, config::ConfigError> {
        let s = Config::builder()
            // 1. Start with defaults
            .set_default("port", 8080)?
            .set_default("debug", false)?
            // 2. Merge config file (optional)
            .add_source(File::with_name("config/default").required(false))
            // 3. Merge Env vars (APP_PORT overrides port)
            .add_source(Environment::with_prefix("APP"))
            .build()?;

        s.try_deserialize()
    }
}
\`\`\`

## Visualization: Merging Layers

The \`config\` crate merges these sources into a single HashMap before deserializing.

\`\`\`mermaid
graph TD
    Defaults[Default: port=8080] --> Merger
    File[File: port=3000] --> Merger
    Env[Env: APP_PORT=9000] --> Merger
    
    Merger{Merge Logic} -->|Last write wins| Final[Final: port=9000]
    
    style Env fill:#f59e0b,color:#000
    style Final fill:#22c55e,stroke:#fff
\`\`\`

> 💎 **Pro Tip: Type Safety at Startup**
> 
> By using \`s.try_deserialize()\`, your application **crashes immediately** at startup if the configuration is invalid (e.g., missing database URL or "port" is not a number).
> This is much better than crashing 2 hours later when you try to access that field. Fail fast!

---
<!-- QUIZ START -->
[?] What is the precedence order in the example above?
[ ] Defaults > File > Env
[x] Env > File > Defaults
[ ] Random

[?] Why do we use Serde for configuration?
[ ] It is faster than reading env vars
[x] To validate types (ensure port is a number, not a string) automatically
[ ] To encrypt the settings
`;