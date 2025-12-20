
export const content_async_basics = `
# Async/Await: The Runtime Model

Rust's approach to async is unique. In Go or Java, you have a heavy runtime or Green Threads built-in. In Rust, async is a zero-cost abstraction state machine, and you **choose** your runtime (usually **Tokio**).

## The Work-Stealing Scheduler

¿Cómo gestiona Tokio miles de tareas con solo un puñado de hilos de CPU? La respuesta es el algoritmo **Work-Stealing**.

\`\`\`tokio-sim
// Visualizer: Core work-stealing logic
\`\`\`

## Visualizing the State Machine

The compiler rewrites your async function into an Enum State Machine.

\`\`\`visualizer
{
  "title": "Async Polling Cycle",
  "steps": [
    {
      "code": "let fut = read_db();",
      "description": "The Future is created on the Stack. It is in the 'Pending' state. No code has run yet.",
      "stack": [
        { "id": "fut", "name": "fut", "value": "Future { state: Uninitialized }", "status": "active" }
      ],
      "heap": []
    },
    {
      "code": "fut.await (Poll #1)",
      "description": "The Executor calls poll(). The Future requests I/O and registers a 'Waker'. It returns Pending.",
      "stack": [
        { "id": "fut", "name": "fut", "value": "Future { state: Pending, waker: Registered }", "status": "active" }
      ],
      "heap": [ { "id": "io", "value": "OS: Reading Disk...", "refs": 1 } ]
    },
    {
      "code": "// Thread does other work...",
      "description": "While waiting, the OS thread is free to run other tasks. The Future sits idle.",
      "stack": [
        { "id": "fut", "name": "fut", "value": "Future { state: Pending }", "status": "active" }
      ],
      "heap": [ { "id": "io", "value": "OS: Reading Disk...", "refs": 1 } ]
    },
    {
      "code": "Waker::wake()",
      "description": "The OS finishes reading. It calls the Waker. The Executor puts the task back in the 'Run Queue'.",
      "stack": [
        { "id": "fut", "name": "fut", "value": "Future { state: ReadyToPoll }", "status": "active" }
      ],
      "heap": [ { "id": "io", "value": "Buffer: [DATA]", "refs": 1 } ]
    },
    {
      "code": "fut.await (Poll #2)",
      "description": "Executor polls again. The data is ready. The Future completes and returns the value.",
      "stack": [
        { "id": "res", "name": "result", "value": "5", "status": "active" }
      ],
      "heap": []
    }
  ]
}
\`\`\`

> 💎 **Pro Tip: .await is explicit**
> 
> In JS, promises start executing immediately. In Rust, Futures are **lazy**.
> If you call \`read_db()\` without \`.await\`, nothing happens. The compiler will warn you: "Future is unused". This allows you to set up complex join/race logic before starting execution.
`;

export const content_tokio_tasks = `
# Tokio Tasks: Spawning

Since \`async\` functions just yield control, we need something to drive them. That is the **Executor** (usually Tokio).
Sometimes you want to fire off a background job and keep doing other things concurrently.

## tokio::spawn

Think of \`tokio::spawn\` as launching a lightweight, managed thread (Green Thread).

\`\`\`rust
#[tokio::main]
async fn main() {
    // Spawn a background task
    let handle = tokio::spawn(async {
        // This runs concurrently
        process_heavy_data().await;
        "Done"
    });

    // Main task continues...
    println!("Doing other work");

    // Wait for the background task
    let result = handle.await.unwrap();
}
\`\`\`

## The 'static Requirement

Because the spawned task might outlive the function that spawned it, **it cannot borrow variables** from the stack. It must own its data.

\`\`\`rust
let data = String::from("User input");

// ERROR: 'data' borrowed
// tokio::spawn(async { println!("{}", data); }); 

// CORRECT: 'data' moved
tokio::spawn(async move { 
    println!("{}", data); 
});
\`\`\`
`;

export const content_channels = `
# Channels: Message Passing

"Do not communicate by sharing memory; instead, share memory by communicating." — Go Proverb (adopted by Rust).

Instead of using \`Mutex<T>\` to protect shared data (which can cause contention and deadlocks), use **Channels** to send data between tasks.

## MPSC (Multi-Producer, Single-Consumer)

This is the most common pattern. Many workers sending results to a single aggregator.

\`\`\`rust
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    // Buffer size of 32 messages
    let (tx, mut rx) = mpsc::channel(32);
    
    tokio::spawn(async move {
        tx.send("msg1").await.unwrap();
    });

    // Receiver handles messages
    while let Some(msg) = rx.recv().await {
        println!("Got: {}", msg);
    }
}
\`\`\`
`;
