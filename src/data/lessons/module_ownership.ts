
// Module: Ownership & Memory

export const content_move_semantics = `
# Ownership: Move Semantics

This is the concept that confuses most beginners, but it is the secret sauce of Rust. It allows memory safety without a Garbage Collector.

## The Rule of "Move"

By default, when you assign a variable to another in Rust, you **move** ownership. The original variable becomes invalid.

\`\`\`rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; 
    
    // println!("{}", s1); // COMPILE ERROR! s1 is gone.
    println!("{}", s2); // "hello"
}
\`\`\`

## Visualizing the Move

Interact with the memory model below to understand exactly what happens in the Stack and Heap during a move operation.

\`\`\`visualizer
{
  "title": "Move Semantics Animation",
  "steps": [
    {
      "code": "let s1 = String::from(\"hello\");",
      "description": "s1 is allocated on the Stack. It contains a pointer (ptr), length, and capacity. The actual bytes 'hello' are stored on the Heap.",
      "stack": [
        { "id": "s1", "name": "s1", "value": "ptr -> 0xA1", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "hello", "refs": 1 }
      ]
    },
    {
      "code": "let s2 = s1;",
      "description": "Rust performs a bitwise copy of the Stack data. s2 now points to the same Heap memory. Crucially, s1 is marked INVALID.",
      "stack": [
        { "id": "s1", "name": "s1", "value": "INVALID", "status": "moved" },
        { "id": "s2", "name": "s2", "value": "ptr -> 0xA1", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "hello", "refs": 1 }
      ]
    },
    {
      "code": "println!(\"{}\", s2);",
      "description": "We can use s2 because it is the valid owner. The Heap data is untouched.",
      "stack": [
        { "id": "s1", "name": "s1", "value": "INVALID", "status": "moved" },
        { "id": "s2", "name": "s2", "value": "ptr -> 0xA1", "status": "active", "isPointerTo": "h1" }
      ],
      "heap": [
        { "id": "h1", "value": "hello", "refs": 1 }
      ]
    },
    {
      "code": "}",
      "description": "Scope ends. Rust calls drop(s2). The heap memory at 0xA1 is freed. s1 is ignored because it was moved.",
      "stack": [],
      "heap": []
    }
  ]
}
\`\`\`

Unlike C++ (which might copy) or Java (which shares references with GC), Rust simply updates the pointer record and invalidates the old one.

> 💎 **Pro Tip: The Copy Trait**
> 
> You might notice that \`let x = 5; let y = x;\` *doesn't* invalidate \`x\`. Why?
>
> Because primitive types (integers, floats, bools) implement the **Copy** trait. They are stored entirely on the Stack and are cheap to duplicate. \`String\` is on the Heap, so it is **Moved**, not Copied.

---
<!-- QUIZ START -->
[?] What happens to s1 after 'let s2 = s1' if s1 is a String?
[ ] It shares the data with s2.
[x] It becomes invalid (Moved).
[ ] It is deep copied.
Rust enforces "Single Ownership" for heap-allocated types like String. Assigning s1 to s2 moves the ownership to s2, marking s1 as invalid to prevent double-free errors.

[?] Why do integers not move?
[ ] They are special.
[ ] They use reference counting.
[x] They implement the Copy trait.
Simple types with a known size at compile time (like integers, bools, chars) implement the 'Copy' trait. This means they are cheaply duplicated on the stack rather than moving ownership.
`;
