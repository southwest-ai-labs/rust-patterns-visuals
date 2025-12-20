
import { QuizModule } from '../../types';

export const quiz_unsafe_internals: QuizModule = {
  id: 'quiz_unsafe_01',
  title: 'Certification: Unsafe Rust & Internals',
  minPassScore: 85, // High bar for unsafe code
  timeLimitSeconds: 600,
  questions: [
    // --- HIGH LEVEL (Staff/Distinguished) ---
    {
      id: 'int_q1',
      level: 5,
      points: 20,
      question: "What exactly does the `unsafe` keyword do in Rust?",
      options: [
        { id: 'o1', text: "It turns off the borrow checker completely.", isCorrect: false },
        { id: 'o2', text: "It allows you to perform 5 specific actions (like dereferencing raw pointers) that the compiler cannot guarantee are memory-safe.", isCorrect: true },
        { id: 'o3', text: "It prevents the code from panicking.", isCorrect: false },
        { id: 'o4', text: "It optimizes the code by removing bounds checks.", isCorrect: false }
      ],
      explanation: "`unsafe` does not disable the borrow checker. It simply allows you to step into a 'superset' of Rust where you can dereference raw pointers, call FFI functions, read unions, access mutable statics, and impl unsafe traits. YOU are responsible for upholding invariants."
    },
    {
      id: 'int_q2',
      level: 4,
      points: 15,
      question: "When interfacing with C code (FFI), why is `#[repr(C)]` mandatory on your Structs?",
      codeSnippet: `
#[repr(C)]
struct MyData {
    x: u32,
    y: u32,
}
      `,
      options: [
        { id: 'o1', text: "It is not mandatory, just recommended.", isCorrect: false },
        { id: 'o2', text: "Rust's default struct layout is undefined (the compiler can reorder fields for optimization). `#[repr(C)]` guarantees the layout matches the C ABI.", isCorrect: true },
        { id: 'o3', text: "It converts the fields to C types automatically.", isCorrect: false },
        { id: 'o4', text: "It allows the struct to be allocated on the stack.", isCorrect: false }
      ],
      explanation: "Without `repr(C)`, Rust might reorder fields to save padding bytes. C expects fields in declaration order. Passing a default Rust struct to C creates Undefined Behavior."
    },
    {
      id: 'int_q3',
      level: 5,
      points: 20,
      question: "What is `Miri` used for?",
      options: [
        { id: 'o1', text: "Compiling Rust to WebAssembly.", isCorrect: false },
        { id: 'o2', text: "An interpreter that runs your binary to detect Undefined Behavior (UB) that the compiler cannot catch (like invalid pointer arithmetic).", isCorrect: true },
        { id: 'o3', text: "A macro expansion tool.", isCorrect: false },
        { id: 'o4', text: "A database migration tool.", isCorrect: false }
      ],
      explanation: "Miri is the ultimate sanitizer. It interprets Rust Mid-level Intermediate Representation (MIR) and checks for validity of pointers, uninitialized memory usage, and data races."
    },
    {
      id: 'int_q4',
      level: 4,
      points: 15,
      question: "In the context of Macros, what is the difference between `macro_rules!` and Procedural Macros?",
      options: [
        { id: 'o1', text: "Procedural macros are faster.", isCorrect: false },
        { id: 'o2', text: "`macro_rules!` does simple pattern matching. Procedural macros operate on the Token Stream, allowing complex code generation (like `#[derive(Serialize)]`).", isCorrect: true },
        { id: 'o3', text: "`macro_rules!` are deprecated.", isCorrect: false },
        { id: 'o4', text: "Procedural macros cannot modify the AST.", isCorrect: false }
      ],
      explanation: "Declarative macros (`macro_rules!`) are like regex replace for code. Proc macros are actual Rust functions that run at compile time, take code as input, and output new code."
    },
    {
      id: 'int_q5',
      level: 5,
      points: 20,
      question: "Why is `std::mem::transmute` considered incredibly dangerous?",
      options: [
        { id: 'o1', text: "It is slow.", isCorrect: false },
        { id: 'o2', text: "It reinterprets the bits of one type as another. If the types have different sizes or valid bit-patterns (e.g. converting 3 to a bool), it causes instant UB.", isCorrect: true },
        { id: 'o3', text: "It allocates memory on the heap.", isCorrect: false },
        { id: 'o4', text: "It requires `std` lib.", isCorrect: false }
      ],
      explanation: "Transmute is a 'reinterpret_cast'. Rust only checks that the input and output have the same size in bytes. It does NOT check if the bit pattern is valid for the target type."
    },
    {
      id: 'int_q6',
      level: 3,
      points: 10,
      question: "What is a `Raw Pointer` (`*const T` or `*mut T`)?",
      options: [
        { id: 'o1', text: "A reference that is always null.", isCorrect: false },
        { id: 'o2', text: "A memory address without borrowing guarantees. It can be null, dangling, or unaligned. Dereferencing it is unsafe.", isCorrect: true },
        { id: 'o3', text: "A smart pointer.", isCorrect: false },
        { id: 'o4', text: "A pointer that lives on the Heap.", isCorrect: false }
      ],
      explanation: "Raw pointers are just memory addresses (like C pointers). Rust compiler ignores them. You can pass them around safely, but reading from them (dereferencing) requires `unsafe`."
    },
    {
      id: 'int_q7',
      level: 4,
      points: 15,
      question: "What is `ManuallyDrop<T>` used for?",
      options: [
        { id: 'o1', text: "To optimize memory usage.", isCorrect: false },
        { id: 'o2', text: "To prevent the compiler from automatically calling the destructor (`drop`). Essential when handing ownership of memory over to C (FFI).", isCorrect: true },
        { id: 'o3', text: "To drop a value twice.", isCorrect: false },
        { id: 'o4', text: "To implement the Copy trait.", isCorrect: false }
      ],
      explanation: "If you pass a `Vec`'s pointer to C, Rust still thinks it owns the Vec. When the function ends, Rust will free the memory. `ManuallyDrop` tells Rust: 'I got this, don't run the destructor'."
    },

    // --- LOW LEVEL (Junior/Mid) ---
    {
      id: 'int_q8',
      level: 2,
      points: 5,
      question: "Which macro allows you to assert a condition is true only in debug builds?",
      options: [
        { id: 'o1', text: "assert!", isCorrect: false },
        { id: 'o2', text: "debug_assert!", isCorrect: true },
        { id: 'o3', text: "check!", isCorrect: false },
        { id: 'o4', text: "verify!", isCorrect: false }
      ],
      explanation: "Useful for checking expensive invariants that shouldn't slow down production."
    },
    {
      id: 'int_q9',
      level: 2,
      points: 5,
      question: "Can safe code cause Undefined Behavior?",
      options: [
        { id: 'o1', text: "Yes, frequently.", isCorrect: false },
        { id: 'o2', text: "No. If Safe Rust causes UB, it is considered a bug in the Rust compiler or standard library.", isCorrect: true },
        { id: 'o3', text: "Only if using threads.", isCorrect: false },
        { id: 'o4', text: "Only on Windows.", isCorrect: false }
      ],
      explanation: "The core promise of Rust is that Safe Rust cannot trigger UB (segfaults, data races). UB is only possible within `unsafe` blocks."
    }
  ]
};
