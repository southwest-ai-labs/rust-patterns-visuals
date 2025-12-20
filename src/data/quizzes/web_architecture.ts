
import { QuizModule } from '../../types';

export const quiz_web_architecture: QuizModule = {
  id: 'quiz_web_arch_01',
  title: 'Certification: Web Systems (Axum & SQLx)',
  minPassScore: 80, 
  timeLimitSeconds: 900, // 15 minutes for 15 questions
  questions: [
    // --- HIGH LEVEL (Senior/Staff) ---
    {
      id: 'web_q1',
      level: 4,
      points: 15,
      question: "In Axum, why does the order of Extractors in a handler function argument list matter?",
      codeSnippet: `
// Works:
async fn handler(json: Json<Payload>, body: String) { ... }
// Fails to compile or runtime error?
      `,
      options: [
        { id: 'o1', text: "It doesn't matter, Axum reorders them automatically.", isCorrect: false },
        { id: 'o2', text: "Extractors that consume the Request Body (like Json or String) must be last. Once the body is streamed, it cannot be read again.", isCorrect: true },
        { id: 'o3', text: "It only matters for performance, not correctness.", isCorrect: false },
        { id: 'o4', text: "State extractors must always come first.", isCorrect: false }
      ],
      explanation: "The Request Body is a one-time stream. If an extractor consumes it (like `Json` or `Bytes`), no subsequent extractor can read it. Axum enforces that body-consuming extractors must be the last argument."
    },
    {
      id: 'web_q2',
      level: 4,
      points: 15,
      question: "Explain the 'Onion Model' execution order in Tower Middleware.",
      options: [
        { id: 'o1', text: "Request: Layer A -> Layer B. Response: Layer A -> Layer B.", isCorrect: false },
        { id: 'o2', text: "Request: Layer A -> Layer B. Response: Layer B -> Layer A.", isCorrect: true },
        { id: 'o3', text: "All layers run in parallel.", isCorrect: false },
        { id: 'o4', text: "Layers only affect the Request, not the Response.", isCorrect: false }
      ],
      explanation: "Middleware wraps the inner service. The request goes IN through the outer layers to the inner ones. The response comes OUT from the inner layers back through the outer ones (LIFO structure for response processing)."
    },
    {
      id: 'web_q3',
      level: 5,
      points: 20,
      question: "Why is `sqlx::query!` considered safer than `sqlx::query`?",
      options: [
        { id: 'o1', text: "It prevents SQL Injection by sanitizing inputs.", isCorrect: false },
        { id: 'o2', text: "It connects to the database at COMPILE TIME to verify the SQL syntax and that the return types match the Rust structs.", isCorrect: true },
        { id: 'o3', text: "It uses a faster binary protocol.", isCorrect: false },
        { id: 'o4', text: "It automatically commits transactions.", isCorrect: false }
      ],
      explanation: "The macro `query!` expands at compile time. It actually talks to your DB (or the offline data file) to ensure column `id` is actually an Integer and not a Text, preventing runtime type errors."
    },
    {
      id: 'web_q4',
      level: 3,
      points: 10,
      question: "When sharing state (like a DB Pool) in Axum using `State<T>`, what requirement must `T` satisfy?",
      options: [
        { id: 'o1', text: "T must implement Copy.", isCorrect: false },
        { id: 'o2', text: "T must be cheap to Clone (usually wrapped in Arc).", isCorrect: true },
        { id: 'o3', text: "T must implement Default.", isCorrect: false },
        { id: 'o4', text: "T must be a static reference.", isCorrect: false }
      ],
      explanation: "Axum clones the State for every request handler. If your state is heavy (like a config struct), you must wrap it in `Arc`. `PgPool` is already an Arc internally, so it's cheap to clone."
    },
    {
      id: 'web_q5',
      level: 5,
      points: 20,
      question: "What is a potential danger of holding a `sqlx::Transaction` across an `.await` point in a long-running process?",
      options: [
        { id: 'o1', text: "The transaction will timeout immediately.", isCorrect: false },
        { id: 'o2', text: "You might exhaust the connection pool if many tasks are waiting on I/O while holding open connections.", isCorrect: true },
        { id: 'o3', text: "Rust futures cannot hold non-Send types across await.", isCorrect: false },
        { id: 'o4', text: "SQLx transactions are not async.", isCorrect: false }
      ],
      explanation: "A transaction holds a physical TCP connection to the DB. If you `await` a slow operation (like an HTTP call) while inside a transaction, that DB connection is effectively 'frozen' and unusable by other requests, quickly leading to pool starvation."
    },
    {
      id: 'web_q6',
      level: 3,
      points: 10,
      question: "How do you implement a custom HTTP error response in Axum?",
      options: [
        { id: 'o1', text: "Return a String.", isCorrect: false },
        { id: 'o2', text: "Implement the `IntoResponse` trait for your Error Enum.", isCorrect: true },
        { id: 'o3', text: "Panic with the error message.", isCorrect: false },
        { id: 'o4', text: "Use the `anyhow` crate only.", isCorrect: false }
      ],
      explanation: "Handlers return types that implement `IntoResponse`. By implementing this trait for your custom error type, you control the HTTP Status Code and the Body sent back to the client."
    },
    {
      id: 'web_q7',
      level: 4,
      points: 15,
      question: "What is the purpose of `#[serde(flatten)]` when receiving JSON in an Axum handler?",
      options: [
        { id: 'o1', text: "To compress the request body.", isCorrect: false },
        { id: 'o2', text: "To accept unstructured data.", isCorrect: false },
        { id: 'o3', text: "To merge fields from a child struct into the parent struct, allowing flat JSON to map to nested Rust types.", isCorrect: true },
        { id: 'o4', text: "To ignore unknown fields.", isCorrect: false }
      ],
      explanation: "Flatten allows you to compose your Request DTOs. You can have a `Pagination` struct and a `Filters` struct, and flatten them both into a `SearchRequest` struct."
    },
    {
      id: 'web_q8',
      level: 4,
      points: 15,
      question: "In a layered architecture (Controller -> Service -> Repository), where should the Transaction ideally start?",
      options: [
        { id: 'o1', text: "In the Repository.", isCorrect: false },
        { id: 'o2', text: "In the Controller/Handler.", isCorrect: false },
        { id: 'o3', text: "In the Service Layer (Business Logic), to ensure atomicity of multiple repository calls.", isCorrect: true },
        { id: 'o4', text: "In the Database.", isCorrect: false }
      ],
      explanation: "The Service layer defines the 'Unit of Work'. If a business operation requires saving to two different tables, the transaction must encompass both repository calls to ensure consistency."
    },
    {
      id: 'web_q9',
      level: 5,
      points: 20,
      question: "How does `cargo sqlx prepare` facilitate CI/CD pipelines?",
      options: [
        { id: 'o1', text: "It installs Postgres in the CI runner.", isCorrect: false },
        { id: 'o2', text: "It caches the query metadata in a JSON file, allowing the code to compile without a running database connection.", isCorrect: true },
        { id: 'o3', text: "It optimizes SQL queries for production.", isCorrect: false },
        { id: 'o4', text: "It migrates the production database automatically.", isCorrect: false }
      ],
      explanation: "Offline mode is essential for CI. You don't want to spin up a DB instance just to run `cargo check`. The `sqlx-data.json` acts as a cache of the schema for the compiler macros."
    },
    {
      id: 'web_q10',
      level: 3,
      points: 10,
      question: "What happens if a `Tower` middleware panics?",
      options: [
        { id: 'o1', text: "The entire server crashes.", isCorrect: false },
        { id: 'o2', text: "The thread panics, but if using `CatchPanicLayer`, it catches the unwind and returns a 500 error.", isCorrect: true },
        { id: 'o3', text: "Rust cannot panic.", isCorrect: false },
        { id: 'o4', text: "The connection hangs forever.", isCorrect: false }
      ],
      explanation: "While Rust panics abort the thread, web frameworks typically wrap handlers. Using a middleware like `CatchPanicLayer` ensures the server stays alive and sends a proper error response."
    },

    // --- LOW LEVEL (Junior/Mid) ---
    {
      id: 'web_q11',
      level: 1,
      points: 5,
      question: "Which HTTP method is typically used to create a new resource?",
      options: [
        { id: 'o1', text: "GET", isCorrect: false },
        { id: 'o2', text: "POST", isCorrect: true },
        { id: 'o3', text: "DELETE", isCorrect: false },
        { id: 'o4', text: "HEAD", isCorrect: false }
      ],
      explanation: "Standard REST semantics: POST is for creation."
    },
    {
      id: 'web_q12',
      level: 2,
      points: 5,
      question: "In SQLx, what symbol is used for parameter substitution in Postgres?",
      options: [
        { id: 'o1', text: "?", isCorrect: false },
        { id: 'o2', text: "$1, $2, etc.", isCorrect: true },
        { id: 'o3', text: ":name", isCorrect: false },
        { id: 'o4', text: "{}", isCorrect: false }
      ],
      explanation: "Postgres uses `$1`, `$2` notation. MySQL uses `?`."
    },
    {
      id: 'web_q13',
      level: 1,
      points: 5,
      question: "What does JSON stand for?",
      options: [
        { id: 'o1', text: "Java Standard Object Notation", isCorrect: false },
        { id: 'o2', text: "JavaScript Object Notation", isCorrect: true },
        { id: 'o3', text: "Just Some Object Notation", isCorrect: false },
        { id: 'o4', text: "Jason's Serialized Objects", isCorrect: false }
      ],
      explanation: "Basic knowledge check."
    },
    {
      id: 'web_q14',
      level: 2,
      points: 5,
      question: "To read a URL parameter like `/users/:id`, which Axum extractor do you use?",
      options: [
        { id: 'o1', text: "Query", isCorrect: false },
        { id: 'o2', text: "Path", isCorrect: true },
        { id: 'o3', text: "Body", isCorrect: false },
        { id: 'o4', text: "Header", isCorrect: false }
      ],
      explanation: "`Path` extracts variables from the URL path. `Query` extracts from after the `?`."
    },
    {
      id: 'web_q15',
      level: 2,
      points: 5,
      question: "What status code represents 'Not Found'?",
      options: [
        { id: 'o1', text: "200", isCorrect: false },
        { id: 'o2', text: "500", isCorrect: false },
        { id: 'o3', text: "404", isCorrect: true },
        { id: 'o4', text: "401", isCorrect: false }
      ],
      explanation: "Standard HTTP status code."
    }
  ]
};
