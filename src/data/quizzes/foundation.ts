
import { QuizModule } from '../../types';

export const quiz_foundation: QuizModule = {
  id: 'quiz_foundation_01',
  title: 'Certification: Rust Foundations',
  minPassScore: 90, // High bar for basics
  timeLimitSeconds: 600,
  questions: [
    {
      id: 'fnd_q1',
      level: 2,
      points: 10,
      question: "In a `match` expression, what does the `_` pattern represent?",
      options: [
        { id: 'o1', text: "A syntax error.", isCorrect: false },
        { id: 'o2', text: "The default or catch-all case (wildcard) that matches any value not covered by previous arms.", isCorrect: true },
        { id: 'o3', text: "A null value.", isCorrect: false },
        { id: 'o4', text: "A reference to the matched value.", isCorrect: false }
      ],
      explanation: "Rust matches are exhaustive. You must handle every possibility. The `_` acts like `default` in a switch statement, catching anything not explicitly listed."
    },
    {
      id: 'fnd_q2',
      level: 3,
      points: 15,
      question: "Which iterator method transforms items from one type to another (e.g., `i32` to `String`)?",
      options: [
        { id: 'o1', text: ".filter()", isCorrect: false },
        { id: 'o2', text: ".map()", isCorrect: true },
        { id: 'o3', text: ".fold()", isCorrect: false },
        { id: 'o4', text: ".collect()", isCorrect: false }
      ],
      explanation: "`.map(|x| ...)` applies a function to every element, producing a new iterator of the results."
    },
    {
      id: 'fnd_q3',
      level: 2,
      points: 10,
      question: "What is the idiomatic way to handle an `Option` that *might* be `None` without crashing?",
      options: [
        { id: 'o1', text: ".unwrap()", isCorrect: false },
        { id: 'o2', text: "Checking for null.", isCorrect: false },
        { id: 'o3', text: "Pattern matching (`match` or `if let`) or using combinators like `.map()` / `.unwrap_or()`.", isCorrect: true },
        { id: 'o4', text: "Using a try-catch block.", isCorrect: false }
      ],
      explanation: "`.unwrap()` will panic (crash) if the value is None. Using `match`, `if let`, or safe combinators is the robust way to handle optional data."
    },
    {
      id: 'fnd_q4',
      level: 2,
      points: 10,
      question: "What does the `?` operator do when placed after a `Result` function call?",
      codeSnippet: "let f = File::open(\"hello.txt\")?;",
      options: [
        { id: 'o1', text: "It turns the error into a panic.", isCorrect: false },
        { id: 'o2', text: "It unwraps the Ok value if successful; if Error, it returns the Error early from the current function.", isCorrect: true },
        { id: 'o3', text: "It prints the error to the console.", isCorrect: false },
        { id: 'o4', text: "It retries the operation.", isCorrect: false }
      ],
      explanation: "The `?` operator is syntactic sugar for 'If error, return error immediately; else, give me the value inside Ok'."
    },
    {
      id: 'fnd_q5',
      level: 3,
      points: 15,
      question: "Why are Rust iterators considered 'Lazy'?",
      options: [
        { id: 'o1', text: "They run slowly.", isCorrect: false },
        { id: 'o2', text: "They do nothing until a consumer method (like `.collect()`, `.sum()`, or a `for` loop) is called.", isCorrect: true },
        { id: 'o3', text: "They run on a background thread.", isCorrect: false },
        { id: 'o4', text: "They cache results automatically.", isCorrect: false }
      ],
      explanation: "You can chain infinite `.map().filter().map()` calls without any CPU usage. The calculation only happens when you request the final result."
    },
    {
      id: 'fnd_q6',
      level: 2,
      points: 10,
      question: "Which of these is NOT a valid state for a `Result<T, E>`?",
      options: [
        { id: 'o1', text: "Ok(T)", isCorrect: false },
        { id: 'o2', text: "Err(E)", isCorrect: false },
        { id: 'o3', text: "Null", isCorrect: true },
        { id: 'o4', text: "Both Ok and Err are valid enum variants.", isCorrect: false }
      ],
      explanation: "Result is an enum with exactly two variants: Ok and Err. There is no Null state in Rust's safe type system."
    }
  ]
};
