
import { QuizModule } from '../../types';

export const quiz_domain_patterns: QuizModule = {
  id: 'quiz_domain_01',
  title: 'Certification: Domain Driven Design & Patterns',
  minPassScore: 80,
  timeLimitSeconds: 720, // 12 minutes
  questions: [
    // --- HIGH LEVEL (Senior/Staff) ---
    {
      id: 'pat_q1',
      level: 5,
      points: 20,
      question: "In the Typestate Pattern, why do transition methods typically take `self` by value instead of `&mut self`?",
      codeSnippet: `
impl Drone<Idle> {
    fn take_off(self) -> Drone<Flying> { ... }
}
      `,
      options: [
        { id: 'o1', text: "To avoid memory allocation.", isCorrect: false },
        { id: 'o2', text: "To consume the old state, statically preventing the caller from using the invalid state again.", isCorrect: true },
        { id: 'o3', text: "Because generic types cannot be mutable.", isCorrect: false },
        { id: 'o4', text: "To allow the compiler to inline the function.", isCorrect: false }
      ],
      explanation: "By taking `self`, the method consumes ownership of the `Drone<Idle>`. The variable representing the idle drone becomes invalid, and the caller MUST use the returned `Drone<Flying>`. This makes invalid state transitions unrepresentable."
    },
    {
      id: 'pat_q2',
      level: 4,
      points: 15,
      question: "What is the primary benefit of `#[repr(transparent)]` on a Newtype struct?",
      codeSnippet: `
#[repr(transparent)]
struct UserId(u32);
      `,
      options: [
        { id: 'o1', text: "It allows the struct to be public.", isCorrect: false },
        { id: 'o2', text: "It guarantees the struct has the exact same memory layout and ABI as the inner type, enabling safe transmutation and FFI usage.", isCorrect: true },
        { id: 'o3', text: "It makes the struct invisible to the borrow checker.", isCorrect: false },
        { id: 'o4', text: "It auto-implements the Debug trait.", isCorrect: false }
      ],
      explanation: "Without `repr(transparent)`, Rust does not guarantee layout (it might add padding). This attribute ensures `UserId` is binary-identical to `u32`, which is critical for zero-cost FFI or checking layout guarantees."
    },
    {
      id: 'pat_q3',
      level: 3,
      points: 10,
      question: "When implementing the Builder pattern, why might you use `Option<T>` for all fields in the Builder struct?",
      options: [
        { id: 'o1', text: "Because all fields in Rust are optional by default.", isCorrect: false },
        { id: 'o2', text: "To allow the builder to be initialized with 'empty' values before they are set by the user.", isCorrect: true },
        { id: 'o3', text: "To improve memory usage.", isCorrect: false },
        { id: 'o4', text: "Because `Option` implements the `Default` trait.", isCorrect: false }
      ],
      explanation: "A Builder typically starts blank. Fields like `port` or `ip` might not be set yet. Using `Option` allows the `build()` method to check if required fields are present (`.ok_or(...)`) or apply defaults (`.unwrap_or(...)`)."
    },
    {
      id: 'pat_q4',
      level: 4,
      points: 15,
      question: "What is a 'Zero Sized Type' (ZST) often used for in Rust design patterns?",
      options: [
        { id: 'o1', text: "To save hard drive space.", isCorrect: false },
        { id: 'o2', text: "As a marker (e.g., in PhantomData) to carry compile-time information (like State or Lifetime) without consuming runtime memory.", isCorrect: true },
        { id: 'o3', text: "To create null pointers.", isCorrect: false },
        { id: 'o4', text: "It is a deprecated concept.", isCorrect: false }
      ],
      explanation: "ZSTs (like `struct State;`) take up 0 bytes. They exist purely for the type system. They are essential for the Typestate pattern and for informing the compiler about ownership/variance via `PhantomData`."
    },
    {
      id: 'pat_q5',
      level: 3,
      points: 10,
      question: "Why is implementing `From<T>` preferred over implementing `Into<U>` manually?",
      options: [
        { id: 'o1', text: "From is faster.", isCorrect: false },
        { id: 'o2', text: "Because the standard library automatically provides the reciprocal implementation: `impl From<A> for B` gives you `impl Into<B> for A` for free.", isCorrect: true },
        { id: 'o3', text: "Into is deprecated.", isCorrect: false },
        { id: 'o4', text: "It allows function overloading.", isCorrect: false }
      ],
      explanation: "The blanket implementation in std means you should always write `From`. You get `Into` for free, allowing callers to use `.into()` syntax."
    },
    {
      id: 'pat_q6',
      level: 4,
      points: 15,
      question: "How does the 'Extension Trait' pattern allow you to add methods to types you don't own (like adding `.is_even()` to `i32`)?",
      options: [
        { id: 'o1', text: "You can modify the source code of std.", isCorrect: false },
        { id: 'o2', text: "By defining a new Trait, implementing it for the external type, and bringing the Trait into scope.", isCorrect: true },
        { id: 'o3', text: "By using class inheritance.", isCorrect: false },
        { id: 'o4', text: "By using C++ style macros.", isCorrect: false }
      ],
      explanation: "This is the only way to extend external types. `trait IntegerExt { fn is_even(&self) -> bool; } impl IntegerExt for i32 { ... }`. Users must `use IntegerExt` to see the method."
    },
    {
      id: 'pat_q7',
      level: 5,
      points: 20,
      question: "What is the 'RAII' (Resource Acquisition Is Initialization) pattern called in Rust, and what trait powers it?",
      options: [
        { id: 'o1', text: "Constructor / New", isCorrect: false },
        { id: 'o2', text: "Drop / The `Drop` trait", isCorrect: true },
        { id: 'o3', text: "Finalize / The `Finalize` trait", isCorrect: false },
        { id: 'o4', text: "Garbage Collection / The `Gc` trait", isCorrect: false }
      ],
      explanation: "Rust relies on RAII. When a scope ends, the `Drop` trait is called automatically. This is used for closing sockets, unlocking Mutexes (Guard pattern), and freeing memory."
    },

    // --- LOW LEVEL (Junior/Mid) ---
    {
      id: 'pat_q8',
      level: 2,
      points: 5,
      question: "Which trait allows you to define a default value for a struct?",
      options: [
        { id: 'o1', text: "New", isCorrect: false },
        { id: 'o2', text: "Init", isCorrect: false },
        { id: 'o3', text: "Default", isCorrect: true },
        { id: 'o4', text: "Empty", isCorrect: false }
      ],
      explanation: "`Default::default()` provides a standard way to instantiate types with sensible defaults."
    },
    {
      id: 'pat_q9',
      level: 1,
      points: 5,
      question: "What keyword is used to define a new empty struct?",
      options: [
        { id: 'o1', text: "class", isCorrect: false },
        { id: 'o2', text: "object", isCorrect: false },
        { id: 'o3', text: "struct", isCorrect: true },
        { id: 'o4', text: "type", isCorrect: false }
      ],
      explanation: "`struct Name;` defines a unit struct."
    },
    {
      id: 'pat_q10',
      level: 2,
      points: 5,
      question: "In the Builder pattern, what does the final method `build()` usually return?",
      options: [
        { id: 'o1', text: "void", isCorrect: false },
        { id: 'o2', text: "The Builder itself", isCorrect: false },
        { id: 'o3', text: "The constructed Object (or a Result containing it)", isCorrect: true },
        { id: 'o4', text: "A reference to the Object", isCorrect: false }
      ],
      explanation: "The goal is to consume the builder and produce the final, valid object."
    },
    {
      id: 'pat_q11',
      level: 2,
      points: 5,
      question: "If you want to create a constructor in Rust, what is the convention?",
      options: [
        { id: 'o1', text: "Define a method named `constructor`", isCorrect: false },
        { id: 'o2', text: "Use the `new` keyword", isCorrect: false },
        { id: 'o3', text: "Define a static function (associated function) usually named `new`", isCorrect: true },
        { id: 'o4', text: "Rust generates constructors automatically", isCorrect: false }
      ],
      explanation: "There is no `new` keyword. It is just a convention to have `pub fn new() -> Self`."
    }
  ]
};
