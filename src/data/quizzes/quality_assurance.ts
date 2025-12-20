
import { QuizModule } from '../../types';

export const quiz_quality_assurance: QuizModule = {
  id: 'quiz_qa_01',
  title: 'Certification: Reliability & QA Engineering',
  minPassScore: 80,
  timeLimitSeconds: 720, // 12 minutes
  questions: [
    // --- HIGH LEVEL (Senior/Staff) ---
    {
      id: 'qa_q1',
      level: 4,
      points: 15,
      question: "In Property-Based Testing (proptest), what is the process of 'Shrinking'?",
      options: [
        { id: 'o1', text: "Removing unused code from the binary.", isCorrect: false },
        { id: 'o2', text: "When a failure occurs, the framework iteratively simplifies the input to find the minimal case that still triggers the bug.", isCorrect: true },
        { id: 'o3', text: "Compressing the test data to save memory.", isCorrect: false },
        { id: 'o4', text: "Reducing the number of random iterations based on code coverage.", isCorrect: false }
      ],
      explanation: "Shrinking is the superpower of PBT. If a random string of 1000 chars causes a crash, Proptest tries to reduce it to just the 1 char that actually breaks the parser, saving hours of debugging."
    },
    {
      id: 'qa_q2',
      level: 4,
      points: 15,
      question: "Why can't Integration Tests (in the `tests/` folder) test private functions of your library?",
      options: [
        { id: 'o1', text: "They can, if you use the #[cfg(test)] attribute.", isCorrect: false },
        { id: 'o2', text: "Because they are compiled as a completely separate crate that links to your library, enforcing public API usage only.", isCorrect: true },
        { id: 'o3', text: "Because they run in a different process.", isCorrect: false },
        { id: 'o4', text: "It is a bug in Cargo.", isCorrect: false }
      ],
      explanation: "Rust treats files in `tests/` as if they were an external user consuming your crate via `Cargo.toml`. This ensures you are testing the actual Public API experience."
    },
    {
      id: 'qa_q3',
      level: 3,
      points: 10,
      question: "What is the primary architectural difference between the `log` crate and the `tracing` crate?",
      options: [
        { id: 'o1', text: "Tracing is faster.", isCorrect: false },
        { id: 'o2', text: "Tracing is context-aware (Spans) and handles async/await execution flow correctly, whereas log is linear text only.", isCorrect: true },
        { id: 'o3', text: "Log is deprecated.", isCorrect: false },
        { id: 'o4', text: "Tracing only writes to JSON.", isCorrect: false }
      ],
      explanation: "In Async Rust, tasks jump between threads. Standard logging loses context. Tracing maintains a 'Span' context regardless of which thread is currently executing the Future."
    },
    {
      id: 'qa_q4',
      level: 5,
      points: 20,
      question: "When using `thiserror` vs `anyhow`, what is the rule of thumb?",
      options: [
        { id: 'o1', text: "Use `thiserror` for everything.", isCorrect: false },
        { id: 'o2', text: "Use `anyhow` for Libraries (to be flexible), `thiserror` for Apps.", isCorrect: false },
        { id: 'o3', text: "Use `thiserror` for Libraries (structured types), `anyhow` for Applications (easy error propagation).", isCorrect: true },
        { id: 'o4', text: "They are incompatible with each other.", isCorrect: false }
      ],
      explanation: "Libraries should provide specific, matchable error enums (`thiserror`). Applications just need to bubble up errors with context to the top level for logging (`anyhow`)."
    },
    {
      id: 'qa_q5',
      level: 4,
      points: 15,
      question: "How do Documentation Tests (Doctests) contribute to Reliability?",
      options: [
        { id: 'o1', text: "They don't, they are just comments.", isCorrect: false },
        { id: 'o2', text: "They ensure that the examples in your documentation actually compile and run, preventing stale or misleading docs.", isCorrect: true },
        { id: 'o3', text: "They generate unit tests automatically.", isCorrect: false },
        { id: 'o4', text: "They increase compile time significantly.", isCorrect: false }
      ],
      explanation: "There is nothing worse than copy-pasting an example from docs and having it fail. Rust runs code blocks in `///` comments as actual tests."
    },
    {
      id: 'qa_q6',
      level: 5,
      points: 20,
      question: "In a CI pipeline, why is `cargo clippy -- -D warnings` preferred over just `cargo clippy`?",
      options: [
        { id: 'o1', text: "It runs faster.", isCorrect: false },
        { id: 'o2', text: "It treats all warnings as errors, causing the build to fail if code quality standards (like lint rules) are not met.", isCorrect: true },
        { id: 'o3', text: "It ignores warnings.", isCorrect: false },
        { id: 'o4', text: "It automatically fixes the code.", isCorrect: false }
      ],
      explanation: "To enforce quality in a team, you must fail the build on bad patterns. Otherwise, warnings pile up and are ignored."
    },
    {
      id: 'qa_q7',
      level: 3,
      points: 10,
      question: "What is 'Shadowing' in Rust and how does it aid refactoring?",
      options: [
        { id: 'o1', text: "It is a memory leak.", isCorrect: false },
        { id: 'o2', text: "Redeclaring a variable with the same name (e.g., `let x = x.parse()?`). It allows transforming data types without inventing temporary names like `x_str`.", isCorrect: true },
        { id: 'o3', text: "Hiding variables in inner scopes so they cannot be accessed.", isCorrect: false },
        { id: 'o4', text: "A technique for mocking objects.", isCorrect: false }
      ],
      explanation: "Shadowing is idiomatic in Rust. It allows you to reuse variable names when you are effectively transforming the data into a new form or type."
    },
    {
      id: 'qa_q8',
      level: 4,
      points: 15,
      question: "When mocking dependencies in Rust (since there are no classes), what is the primary abstraction used?",
      options: [
        { id: 'o1', text: "Function Pointers", isCorrect: false },
        { id: 'o2', text: "Traits", isCorrect: true },
        { id: 'o3', text: "Inheritance", isCorrect: false },
        { id: 'o4', text: "Macros", isCorrect: false }
      ],
      explanation: "To mock a Database, you define a `Trait` (e.g., `UserRepository`). The production code uses the struct implementing it, and tests use a Mock struct implementing the same Trait."
    },

    // --- LOW LEVEL (Junior/Mid) ---
    {
      id: 'qa_q9',
      level: 1,
      points: 5,
      question: "What command runs all tests in a Rust project?",
      options: [
        { id: 'o1', text: "npm test", isCorrect: false },
        { id: 'o2', text: "cargo test", isCorrect: true },
        { id: 'o3', text: "rustc --test", isCorrect: false },
        { id: 'o4', text: "make test", isCorrect: false }
      ],
      explanation: "The standard command."
    },
    {
      id: 'qa_q10',
      level: 1,
      points: 5,
      question: "Which attribute marks a function as a unit test?",
      options: [
        { id: 'o1', text: "#[test]", isCorrect: true },
        { id: 'o2', text: "@Test", isCorrect: false },
        { id: 'o3', text: "#[unit]", isCorrect: false },
        { id: 'o4', text: "test:", isCorrect: false }
      ],
      explanation: "Rust uses attributes for metadata."
    },
    {
      id: 'qa_q11',
      level: 2,
      points: 5,
      question: "What macro is used to assert that two values are equal?",
      options: [
        { id: 'o1', text: "assert!(a == b)", isCorrect: false },
        { id: 'o2', text: "assert_eq!(a, b)", isCorrect: true },
        { id: 'o3', text: "expect(a).toBe(b)", isCorrect: false },
        { id: 'o4', text: "equal!(a, b)", isCorrect: false }
      ],
      explanation: "`assert_eq!` prints the values of left and right if they don't match, which `assert!` does not do automatically."
    },
    {
      id: 'qa_q12',
      level: 2,
      points: 5,
      question: "Which tool formats your Rust code according to community standards?",
      options: [
        { id: 'o1', text: "Prettier", isCorrect: false },
        { id: 'o2', text: "rustfmt / cargo fmt", isCorrect: true },
        { id: 'o3', text: "Lint", isCorrect: false },
        { id: 'o4', text: "ClangFormat", isCorrect: false }
      ],
      explanation: "The official formatter is `rustfmt`."
    },
    {
      id: 'qa_q13',
      level: 2,
      points: 5,
      question: "Which tool acts as a Linter to catch common mistakes?",
      options: [
        { id: 'o1', text: "Clippy", isCorrect: true },
        { id: 'o2', text: "Rusty", isCorrect: false },
        { id: 'o3', text: "Checker", isCorrect: false },
        { id: 'o4', text: "Valgrind", isCorrect: false }
      ],
      explanation: "Clippy is the official Rust linter."
    }
  ]
};
