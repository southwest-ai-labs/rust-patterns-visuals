
// Module: Smart Pointers

export const content_smart_pointers = `
# Smart Pointers: Beyond the Stack

By default, Rust stores values on the Stack. But sometimes you need data to live longer, be shared, or have a size unknown at compile time. Enter **Smart Pointers**.

## Box<T>: Heap Allocation

\`Box<T>\` is the simplest smart pointer. It forces data onto the Heap. It has a single owner.

\`\`\`visualizer
{
  "title": "Box Memory Layout",
  "steps": [
    {
      "code": "let b = Box::new(5);",
      "description": "'b' is just a pointer (ptr) on the Stack. The value '5' lives on the Heap.",
      "stack": [
        { "id": "b", "name": "b", "value": "ptr -> 0xB1", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "5", "refs": 1 }
      ]
    }
  ]
}
\`\`\`

## Rc<T>: Reference Counting

Ownership rules say "One Owner". But what if a graph node is pointed to by multiple other nodes?
\`Rc<T>\` enables **Multiple Ownership** via reference counting.

Let's watch the reference count (strong_count) change in real-time.

\`\`\`visualizer
{
  "title": "Rc Reference Counting",
  "steps": [
    {
      "code": "let a = Rc::new(String::from(\"shared\"));",
      "description": "Rc allocates the data AND a Control Block (counters) on the heap. Strong count is 1.",
      "stack": [
        { "id": "a", "name": "a", "value": "ptr -> 0xC1", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "shared", "refs": 1 }
      ]
    },
    {
      "code": "let b = Rc::clone(&a);",
      "description": "Rc::clone does NOT copy the data. It copies the pointer and increments the counter. 'a' and 'b' point to the same address.",
      "stack": [
        { "id": "a", "name": "a", "value": "ptr -> 0xC1", "status": "active", "isPointerTo": "h1" },
        { "id": "b", "name": "b", "value": "ptr -> 0xC1", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "shared", "refs": 2 }
      ]
    },
    {
      "code": "{ let c = Rc::clone(&a); }",
      "description": "Inside a new scope, we clone again. Count goes to 3. Then scope ends...",
      "stack": [
        { "id": "a", "name": "a", "value": "ptr -> 0xC1", "status": "active", "isPointerTo": "h1" },
        { "id": "b", "name": "b", "value": "ptr -> 0xC1", "status": "active", "isPointerTo": "h1" },
        { "id": "c", "name": "c", "value": "ptr -> 0xC1", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "shared", "refs": 3 }
      ]
    },
    {
      "code": "// 'c' dropped",
      "description": "'c' goes out of scope. drop(c) decrements the counter. Data is still alive because count > 0.",
      "stack": [
        { "id": "a", "name": "a", "value": "ptr -> 0xC1", "status": "active", "isPointerTo": "h1" },
        { "id": "b", "name": "b", "value": "ptr -> 0xC1", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "shared", "refs": 2 }
      ]
    }
  ]
}
\`\`\`

## Arc<T>: Atomic Reference Counting

\`Rc\` is fast but **not thread-safe**. If you need to share data across threads, you must use \`Arc<T>\` (Atomic Reference Counted). It works exactly like \`Rc\`, but uses atomic hardware instructions to update the counter safely.

> 💎 **Pro Tip: Deref Coercion**
> 
> Smart pointers implement the \`Deref\` trait. This allows you to treat \`Box<T>\` or \`Rc<T>\` just like normal references.
> 
> \`\`\`rust
> let s = Box::new(String::from("hello"));
> // You can call String methods directly on the Box!
> // Rust automatically dereferences Box -> String -> &str
> let len = s.len(); 
> \`\`\`

---
<!-- QUIZ START -->
[?] Which smart pointer allows multiple owners in a single thread?
[ ] Box
[x] Rc
[ ] Arc
[ ] RefCell

[?] If you need to send shared data to another thread, which pointer must you use?
[ ] Rc
[x] Arc
[ ] Box
[ ] &mut T
`;

export const content_interior_mutability = `
# Interior Mutability: Bending the Rules

Normally, Rust borrowing rules are strict: you cannot mutate data via an immutable reference. But what if you need to implement a **cache** or a **logger** inside an object that is technically "immutable" to the outside world?

## The Solution: RefCell<T>

\`RefCell<T>\` moves the borrowing checks from **Compile Time** to **Runtime**.

*   It allows you to mutate data even when you hold an immutable reference to the \`RefCell\`.
*   It tracks how many readers and writers exist dynamically.

\`\`\`rust
use std::cell::RefCell;

struct User {
    name: String,
    login_count: RefCell<u32>, // Mutable inside immutable struct
}

fn main() {
    let user = User {
        name: String::from("Ferris"),
        login_count: RefCell::new(0),
    };

    // User is immutable, but we can mutate the field!
    *user.login_count.borrow_mut() += 1;
    
    println!("Logins: {}", user.login_count.borrow());
}
\`\`\`

## Visualizing Runtime Checks

If you break the rules at runtime (e.g., two writers at once), the program **Panics**.

\`\`\`mermaid
graph TD
    A[RefCell Access] --> B{Check Flags}
    B -->|No Writer, Any Readers| C[Grant Immutable Borrow]
    B -->|No Writer, No Readers| D[Grant Mutable Borrow]
    B -->|Writer Exists| E[PANIC!]
    
    style E fill:#ef4444,color:#fff
    style D fill:#22c55e,color:#000
\`\`\`

## Thread Safety: Mutex<T>

\`RefCell\` is for single threads. For multi-threading, we use \`Mutex<T>\` (Mutual Exclusion). It blocks the thread until the lock is acquired.

The most common concurrency pattern in Rust is \`Arc<Mutex<T>>\`:
1.  **Arc**: To share the data across threads.
2.  **Mutex**: To allow safe mutation.

\`\`\`rust
use std::sync::{Arc, Mutex};
use std::thread;

let counter = Arc::new(Mutex::new(0));
let c_clone = Arc::clone(&counter);

thread::spawn(move || {
    // Lock logic handles the "borrowing" check
    let mut num = c_clone.lock().unwrap();
    *num += 1;
});
\`\`\`

> 💎 **Pro Tip: Deadlocks**
> 
> Unlike RefCell which panics immediately, a Mutex will **wait forever** if you try to lock it twice in the same thread (or create a cycle). Always keep your critical sections (time holding the lock) as short as possible.

---
<!-- QUIZ START -->
[?] When does RefCell check borrowing rules?
[ ] At Compile Time
[x] At Runtime
[ ] Never
[ ] When the garbage collector runs

[?] What happens if you try to borrow_mut() from a RefCell while a borrow() is active?
[ ] It waits
[ ] It returns an error Result
[x] It Panics (crashes)
[ ] It clones the data automatically
`;
