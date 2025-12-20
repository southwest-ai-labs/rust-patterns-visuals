
// Module: Testing & Quality Assurance

export const content_testing_basics = `
# Unit vs Integration Tests

Rust has a first-class testing framework built-in. No need for Jest or Mocha.
Understanding where to put your tests is key to a clean project structure.

## Unit Tests: Test Implementation

Unit tests go **inside the same file** as the code. This allows them to test private functions.

\`\`\`rust
// src/math.rs

fn add(a: i32, b: i32) -> i32 {
    a + b
}

// The testing module
#[cfg(test)]
mod tests {
    use super::*; // Import parent scope

    #[test]
    fn test_add() {
        assert_eq!(add(2, 2), 4);
    }
}
\`\`\`

## Integration Tests: Test API

Integration tests go in a separate \`tests/\` directory at the project root. They compile as a **separate crate**.
They can only access \`pub\` (public) API methods, just like a real user of your library.

\`\`\`
my_project/
├── src/lib.rs
└── tests/
    └── integration_test.rs
\`\`\`

\`\`\`rust
// tests/integration_test.rs
use my_project;

#[test]
fn test_public_api() {
    // Only public functions are accessible
    assert_eq!(my_project::public_calc(2), 4);
}
\`\`\`

## Visualizing the Testing Pyramid

\`\`\`mermaid
graph TD
    UI[End-to-End Tests]
    Integration[Integration Tests (tests/ folder)]
    Unit[Unit Tests (#[cfg(test)])]
    
    UI --- Integration
    Integration --- Unit
    
    style Unit fill:#22c55e,stroke:#fff,stroke-width:2px
    style Integration fill:#f59e0b
    style UI fill:#ef4444
\`\`\`

> 💎 **Pro Tip: Doctests**
> 
> Documentation comments (\`///\`) in Rust are also tests!
> 
> \`\`\`rust
> /// Adds one to the number.
> /// \`\`\`
> /// let x = 5;
> /// assert_eq!(my_crate::add_one(x), 6);
> /// \`\`\`
> 
> When you run \`cargo test\`, it extracts these code blocks and runs them. This ensures your documentation **never goes out of date**.

---
<!-- QUIZ START -->
[?] Where should you put tests that need to access private functions?
[x] Inside the same file (Unit Tests)
[ ] In the tests/ folder
[ ] In a separate git repo

[?] What is a major benefit of Documentation Tests (Doctests)?
[ ] They run faster
[x] They ensure documentation examples actually work
[ ] They don't require assert_eq
`;

export const content_property_testing = `
# Property-Based Testing

Writing unit tests like \`assert_eq!(add(2, 2), 4)\` is necessary, but limited. You are only testing "Happy Paths" or specific edge cases you thought of.
**Property-Based Testing** (using the **proptest** crate) tests the *properties* of your function against **thousands** of random inputs.

## The Paradigm Shift

Instead of: "2 + 2 = 4"
Think: "For ANY integer X and Y, addition is commutative (X + Y = Y + X)".

\`\`\`rust
use proptest::prelude::*;

proptest! {
    #[test]
    fn test_reverse_string_twice_is_identity(s in "\\PC*") {
        // Run this with 1000s of random strings (s)
        let reversed = s.chars().rev().collect::<String>();
        let double_reversed = reversed.chars().rev().collect::<String>();
        
        // The property: reversing twice should get back the original
        assert_eq!(s, double_reversed);
    }
}
\`\`\`

## Shrinking

If \`proptest\` finds a bug (e.g., a specific unicode character crashes your parser), it doesn't just fail. It attempts to **shrink** the input to the simplest possible case that still causes the failure.
It might turn a 50kb JSON file into \`{"a": null}\` that triggers the bug.

## Visualizing the Fuzzing

\`\`\`mermaid
graph TD
    Gen[Generator] -->|Random Input| Func[Your Function]
    Func -->|Result| Check{Check Property}
    Check -->|Pass| Gen
    Check -->|Fail| Shrink[Shrinker]
    Shrink -->|Simplify Input| Func
    Shrink -->|Minimal Repro| Report[Report Error]
    
    style Shrink fill:#ef4444,color:#fff
\`\`\`

> 💎 **Pro Tip: Parsing untrusted input**
> 
> Property-based testing is effectively **Fuzzing**. It is absolutely essential if you are writing a parser, a serialization library, or anything that accepts user input from the internet. It WILL find crashes you didn't expect.

---
<!-- QUIZ START -->
[?] What is "Shrinking" in the context of proptest?
[ ] Reducing code size
[x] Reducing a failing input to its simplest form
[ ] Compressing the binary

[?] When is property-based testing most useful?
[ ] For checking UI colors
[x] For logic with complex rules or parsing untrusted input
[ ] For testing database connections
`;
