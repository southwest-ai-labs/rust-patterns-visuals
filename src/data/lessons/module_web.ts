

// Module: Web & Data (Serde, etc.)

export const content_serde = `
# Serde: Serialization

**Serde** (SERialization-DEserialization) is arguably the most famous Rust crate. It provides a framework for serializing data structures efficiently and generically.

## The Magic Macros

You almost never write serialization logic manually. You just derive it.

\`\`\`rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct User {
    id: u32,
    username: String,
    // Handle optional fields automatically
    email: Option<String>, 
}

fn main() {
    let u = User {
        id: 1,
        username: "Ferris".into(),
        email: None,
    };

    // To JSON
    let json = serde_json::to_string(&u).unwrap();
    println!("{}", json); // {"id":1,"username":"Ferris","email":null}
}
\`\`\`

## Attribute Powers

Serde is extremely powerful when APIs don't match your code style.

\`\`\`rust
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")] // Converts "first_name" -> "firstName"
struct ApiUser {
    #[serde(rename = "u_id")]      // Maps JSON "u_id" to Rust "id"
    id: u32,
    
    #[serde(skip_serializing)]     // Never send password out
    password: String,
    
    #[serde(default)]              // Use Default::default() if missing
    is_active: bool,
}
\`\`\`

## Visualizing the Process

Serde adds an intermediate layer (the Data Model) so it can support JSON, YAML, TOML, MsgPack, etc., with the same struct.

\`\`\`mermaid
graph LR
    Rust[Rust Struct] -->|Serialize Trait| Model[Serde Data Model]
    Model -->|Serializer| JSON[JSON String]
    Model -->|Serializer| YAML[YAML String]
    
    JSON -->|Deserializer| Model
    Model -->|Deserialize Trait| Rust
    
    style Model fill:#f59e0b,color:#000
\`\`\`

> 💎 **Pro Tip: Flattening**
> 
> Sometimes JSON is flat, but you want nested structs (or vice versa). Use \`#[serde(flatten)]\`.
>
> \`\`\`rust
> #[derive(Serialize)]
> struct Pagination {
>     page: u32,
>     limit: u32,
> }
> 
> #[derive(Serialize)]
> struct Response {
>     data: Vec<String>,
>     #[serde(flatten)] // Merges fields of Pagination into the root JSON
>     pagination: Pagination,
> }
> // Output: { "data": [...], "page": 1, "limit": 10 }
> // No "pagination" key!
> \`\`\`
`;

export const content_reqwest = `
# Robust HTTP with Reqwest

Fetching data is easy. Fetching data **robustly** in production is hard. The ecosystem standard is **reqwest** (usually with the \`json\` feature).

## The Client is a Pool

A common mistake is creating a new \`Client\` for every request.
The \`reqwest::Client\` holds an internal connection pool. **Create it once** (e.g., in \`main\` or a \`once_cell\`) and reuse it.

\`\`\`rust
// BAD: Creates a new pool every time (slow, wastes sockets)
// async fn fetch() { reqwest::get(URL).await; }

// GOOD: Reuse the client
async fn fetch_user(client: &reqwest::Client, id: u32) -> Result<User> {
    let url = format!("https://api.example.com/users/{}", id);
    let user = client
        .get(url)
        .send()
        .await?
        .json::<User>() // Auto-deserialize with Serde
        .await?;
    Ok(user)
}
\`\`\`

## Timeouts are Mandatory

By default, reqwest requests can hang **forever** (until the OS TCP timeout). In a microservice, this causes cascading failures.

\`\`\`rust
let client = reqwest::Client::builder()
    .timeout(std::time::Duration::from_secs(5))
    .build()?;
\`\`\`

## Visualizing Connection Pooling

\`\`\`mermaid
graph LR
    subgraph App
    Req1[Request 1]
    Req2[Request 2]
    Client[Shared Client]
    end
    
    subgraph "Connection Pool"
    S1[Socket 1 (Open)]
    S2[Socket 2 (Busy)]
    end
    
    Req1 --> Client
    Req2 --> Client
    Client --> S1
    Client --> S2
    
    style Client fill:#22c55e,color:#000
\`\`\`
`;

export const content_sqlx = `
# SQLx: The Compile-Time SQL Toolkit

ORMs (like Diesel or SeaORM) are great, but sometimes you want raw SQL performance with type safety. **SQLx** gives you exactly that.

## The Superpower: Checked Queries

SQLx connects to your running database **during compilation** to verify your SQL syntax and types.

\`\`\`rust
// If 'users' table doesn't have an 'email' column, 
// THIS WILL FAIL TO COMPILE!
let user = sqlx::query!(
    "SELECT id, username FROM users WHERE email = $1",
    email
)
.fetch_one(&pool)
.await?;

println!("User ID: {}", user.id); // Validated to be correct type
\`\`\`

## Connection Pools

Like HTTP clients, Database connections are expensive. Always use a \`PgPool\` (Postgres) or \`MySqlPool\`.

\`\`\`rust
#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://...").await?;

    // Pass 'pool' to your handlers (usually via Axum state)
    // ...
}
\`\`\`

## Transactions and Await

A common pitfall in Async Rust is holding a transaction across a long-running await point.

\`\`\`rust
// DANGER ZONE
let mut tx = pool.begin().await?;
// If this API call takes 5 seconds, the DB connection is held open, doing nothing.
// If you have 50 req/sec, you will exhaust the pool in < 1 second.
let data = fetch_slow_api().await; 
sqlx::query("INSERT...").execute(&mut tx).await?;
tx.commit().await?;
\`\`\`

## Visualizing Compile Time Checks

\`\`\`mermaid
sequenceDiagram
    participant Dev as Developer
    participant Compiler as Rust Compiler
    participant Macro as sqlx::query!
    participant DB as Dev Database

    Dev->>Compiler: cargo build
    Compiler->>Macro: Expand Macro
    Macro->>DB: "EXPLAIN SELECT..."
    DB-->>Macro: "Result Schema: { id: Int, name: Text }"
    Macro-->>Compiler: Generate Rust Structs
    Compiler-->>Dev: Success Binary
\`\`\`

> 💎 **Pro Tip: Offline Mode**
> 
> "Wait, do I need a database running in CI/CD to build my app?"
> No! You can use \`cargo sqlx prepare\`. This saves the query metadata to a \`sqlx-data.json\` file.
> You check this file into Git. Now your CI (and teammates) can compile the app without a running DB.
`;

export const content_repository = `
# The Repository Pattern

Separating your **Business Logic** from your **Data Access** is critical for testing and maintenance.
The Repository pattern hides the details of SQL/Redis behind a trait.

## Defining the Port (Trait)

First, define *what* needs to be done, not *how*.

\`\`\`rust
use async_trait::async_trait;

#[async_trait]
trait UserRepository {
    async fn find_by_id(&self, id: u32) -> Result<Option<User>>;
    async fn save(&self, user: User) -> Result<()>;
}
\`\`\`

## The Adapter (Implementation)

Then, implement it for your real database (SQLx).

\`\`\`rust
struct PostgresUserRepository {
    pool: PgPool,
}

#[async_trait]
impl UserRepository for PostgresUserRepository {
    async fn find_by_id(&self, id: u32) -> Result<Option<User>> {
        sqlx::query_as!(User, "SELECT * FROM users WHERE id=$1", id)
            .fetch_optional(&self.pool)
            .await
            .map_err(Into::into)
    }
    // ...
}
\`\`\`

## Visualizing the Hexagonal Architecture

\`\`\`mermaid
graph TD
    subgraph Core Domain
    Service[UserService]
    Trait[<Trait>\nUserRepository]
    end
    
    subgraph Infrastructure
    Impl[PostgresRepo]
    Mock[MockRepo]
    DB[(Postgres)]
    end
    
    Service --> Trait
    Impl -.->|Implements| Trait
    Mock -.->|Implements| Trait
    Impl --> DB
    
    style Trait fill:#f59e0b,color:#000
    style Mock fill:#38bdf8,color:#000
\`\`\`
`;

export const content_axum_architecture = `
# Axum Architecture: Extractors

**Axum** is the most popular web framework in Rust today. It is built on top of **Tokio**, **Hyper**, and **Tower**.
Its key feature is **Extractors**: a type-safe way to unpack the HTTP Request arguments.

## How Extractors Work

You don't parse the request manually. You declare what you want in the function signature.

\`\`\`rust
use axum::{
    extract::{Path, Query, State, Json},
    http::StatusCode,
};
use serde::Deserialize;

#[derive(Deserialize)]
struct CreateUser {
    username: String,
}

// Handler
async fn create_user(
    // 1. Extract Shared State (DB Pool)
    State(pool): State<PgPool>,
    // 2. Extract Path Param (/users/:id)
    Path(id): Path<u32>,
    // 3. Extract JSON Body (Must be last!)
    Json(payload): Json<CreateUser>,
) -> impl IntoResponse {
    // ... logic ...
    (StatusCode::CREATED, "User Created")
}
\`\`\`

## The Order Matters!

The request body is a **Stream**. Once it is read, it is gone.
Therefore, any extractor that consumes the body (like \`Json\`, \`String\`, or \`Bytes\`) **must be the last argument**.
If you put \`Json\` before \`Path\`, your code might fail to compile or runtime error.

## Sharing State

Axum passes state via cloning.
\`\`\`rust
// Bad: Expensive clone every request
struct AppState { config: HeavyConfig }

// Good: Cheap pointer clone
#[derive(Clone)]
struct AppState {
    pool: PgPool, // Internally Arc
    config: Arc<HeavyConfig>,
}
\`\`\`

## Visualizing the Flow

\`\`\`mermaid
graph TD
    Req[HTTP Request] --> Router
    Router -->|Match Path| Handler
    
    subgraph "Extractor Pipeline"
    E1[State Extractor]
    E2[Path Extractor]
    E3[Body Extractor]
    end
    
    Handler --> E1
    Handler --> E2
    Handler --> E3
    
    E1 -->|Inject| Logic[Business Logic]
    E2 -->|Inject| Logic
    E3 -->|Inject| Logic
    
    Logic -->|Return| IntoResponse
    IntoResponse --> Res[HTTP Response]
    
    style E3 fill:#ef4444,color:#fff
\`\`\`

> 💎 **Pro Tip: Custom Extractors**
> 
> Need to extract the Current User from a JWT header? Don't repeat code. Implement the \`FromRequestParts\` trait.
>
> \`\`\`rust
> async fn handler(user: CurrentUser) { ... }
> \`\`\`
>
> If the JWT is missing/invalid, the extractor rejects the request (401 Unauthorized) *before* your handler even runs.
`;

export const content_middleware = `
# Middleware Layers (Tower)

In web development (Axum, Actix), you often need to run code **before** and **after** every request (Logging, Authentication, Rate Limiting).
Rust ecosystem uses the **Tower** crate service definition for this.

## The Onion Model

Think of your request wrapping around layers like an onion.

1.  **Request** enters the outer layer (Timeout).
2.  Passes to next layer (Auth).
3.  Reaches your Handler (Business Logic).
4.  **Response** bubbles back up (Logging).

\`\`\`rust
use axum::{
    routing::get,
    Router,
    middleware,
};

async fn my_handler() -> &'static str {
    "Hello, World!"
}

async fn logging_middleware(
    req: axum::extract::Request,
    next: middleware::Next,
) -> axum::response::Response {
    println!("--> Request: {} {}", req.method(), req.uri());
    
    // Execute the remaining layers
    let res = next.run(req).await;
    
    println!("<-- Response status: {}", res.status());
    res
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(my_handler))
        .layer(middleware::from_fn(logging_middleware));
        // .layer(TowerHttp::Trace) // Production ready alternative
}
\`\`\`

## Visualizing Layers

\`\`\`mermaid
graph LR
    Req[Request] --> L1(Timeout Layer)
    L1 --> L2(Auth Layer)
    L2 --> L3(Log Layer)
    L3 --> H[Handler]
    
    H -->|Response| L3
    L3 --> L2
    L2 --> L1
    L1 --> Res[Response]
    
    style H fill:#22c55e,color:#000
    style L2 fill:#f59e0b,color:#000
\`\`\`

> 💎 **Pro Tip: Ordering Matters**
> 
> In Axum/Tower, layers wrap the *inner* service. 
> If you add a \`TimeoutLayer\` *before* a \`TraceLayer\`, the timeout logic runs *outside* the tracing. 
> Typically you want: \`Router -> Trace -> Auth -> Timeout\`.
`;
