
// Module: Borrowing & References

export const content_borrowing = `
# Borrowing: The Rules of the Game

In the previous lesson, we saw that assigning a variable moves ownership. But what if we just want to "look" at the data without taking it? We **Borrow** it.

## The Holy Rules of Borrowing

The Rust compiler (Borrow Checker) enforces this invariant at compile time:

> You can have **EITHER** (many immutable references) **OR** (one mutable reference). Never both.

Let's visualize exactly why this rule exists to prevent Data Races.

\`\`\`visualizer
{
  "title": "Borrowing Rules Simulation",
  "steps": [
    {
      "code": "let mut s = String::from(\"hello\");",
      "description": "Owner 's' is created on the Stack. It has exclusive access to the Heap data.",
      "stack": [
        { "id": "s", "name": "s", "value": "ptr -> 0xA1", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "hello", "refs": 1 }
      ]
    },
    {
      "code": "let r1 = &s; let r2 = &s;",
      "description": "We create two immutable references (Borrowing). They are just pointers on the stack pointing to the same data. Read-only access is shared safe.",
      "stack": [
        { "id": "s", "name": "s", "value": "LOCKED (Shared)", "status": "borrowed", "isPointerTo": "h1" },
        { "id": "r1", "name": "r1", "value": "&(0xA1)", "status": "active", "isPointerTo": "h1" },
        { "id": "r2", "name": "r2", "value": "&(0xA1)", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "hello", "refs": 3 }
      ]
    },
    {
      "code": "println!(\"{}, {}\", r1, r2);",
      "description": "We use the references. 's' cannot be mutated here because r1 and r2 are active.",
      "stack": [
        { "id": "s", "name": "s", "value": "LOCKED (Shared)", "status": "borrowed", "isPointerTo": "h1" },
        { "id": "r1", "name": "r1", "value": "&(0xA1)", "status": "active", "isPointerTo": "h1" },
        { "id": "r2", "name": "r2", "value": "&(0xA1)", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "hello", "refs": 3 }
      ]
    },
    {
      "code": "// r1 and r2 scopes end here (NLL)",
      "description": "The compiler sees r1 and r2 are no longer used. The 'Shared Lock' on 's' is released.",
      "stack": [
        { "id": "s", "name": "s", "value": "ptr -> 0xA1", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "hello", "refs": 1 }
      ]
    },
    {
      "code": "let m = &mut s;",
      "description": "Now we can take a MUTABLE borrow. This creates an Exclusive Lock. No one else can read or write 's' while 'm' is active.",
      "stack": [
        { "id": "s", "name": "s", "value": "LOCKED (Excl)", "status": "borrowed", "isPointerTo": "h1" },
        { "id": "m", "name": "m", "value": "&mut(0xA1)", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "hello", "refs": 1 }
      ]
    },
    {
      "code": "m.push_str(\" world\");",
      "description": "We modify the data through 'm'. Since we have exclusive access, there is no risk of a data race.",
      "stack": [
        { "id": "s", "name": "s", "value": "LOCKED (Excl)", "status": "borrowed", "isPointerTo": "h1" },
        { "id": "m", "name": "m", "value": "&mut(0xA1)", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "hello world", "refs": 1 }
      ]
    }
  ]
}
\`\`\`

## Slices: A Window into Memory

A **Slice** is a special kind of reference. It is a "Fat Pointer": it contains a pointer to the start of data AND a length.

\`\`\`rust
let s = String::from("hello world");
let hello: &str = &s[0..5];
let world: &str = &s[6..11];
\`\`\`

> 💎 **Pro Tip: Non-Lexical Lifetimes (NLL)**
> 
> Before Rust 2018, references lived until the end of the scope block \`}\`. 
> Now, Rust is smarter. A reference's lifetime ends the **last time it is used**.
>
> This allows the pattern shown in the visualization above: creating a mutable reference immediately after the immutable ones are done being used.

---
<!-- QUIZ START -->
[?] How many mutable references to a single piece of data can you have at once?
[ ] As many as you want
[x] Exactly one
[ ] One per thread

[?] Can you have an immutable reference active at the same time as a mutable reference?
[ ] Yes, if they are in different threads
[x] No, never
[ ] Only for integers
`;
