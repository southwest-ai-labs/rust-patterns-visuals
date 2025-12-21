
import { Curriculum } from '../types';

export const CURRICULUM: Curriculum = {
  "tracks": [
    {
      "id": "track_00_onboarding",
      "title": "0. Onboarding",
      "description": "Cómo usar RUST.HUB y empezar con buen ritmo.",
      "lessons": [
        {
          "id": "lesson_00_onboarding",
          "title": "Onboarding",
          "description": "Navegación, progreso, atajos y flujo del curso.",
          "filename": "lesson00_onboarding.md",
          "difficulty": "Beginner",
          "readTime": "4 min"
        }
      ]
    },
    {
      "id": "track_01_flow",
      "title": "1. Control Flow Mastery",
      "description": "Moving beyond C-style logic into idiomatic Rust control flow.",
      "lessons": [
        { "id": "lesson_01_match", "title": "Match & If Let", "filename": "lesson01_control_flow.md", "difficulty": "Beginner", "readTime": "5 min" }
      ]
    },
    {
      "id": "track_02_iter",
      "title": "2. Functional Iteration",
      "description": "Embracing the power of Iterators and Closures.",
      "lessons": [
        { "id": "lesson_02_iterators", "title": "Iterators vs Loops", "filename": "lesson02_iterators.md", "difficulty": "Intermediate", "readTime": "8 min" }
      ]
    },
    {
      "id": "track_03_std",
      "title": "3. Standard Lib Essentials",
      "description": "Core types that every Rust developer uses daily.",
      "lessons": [
        { "id": "lesson_03_options", "title": "Option & Result", "filename": "lesson03_std_types.md", "difficulty": "Beginner", "readTime": "6 min" }
      ]
    },
    {
      "id": "track_04_ownership",
      "title": "4. Ownership & Memory",
      "description": "The core innovation of Rust.",
      "lessons": [
        { "id": "lesson_04_move", "title": "Move Semantics", "filename": "lesson04_move_semantics.md", "difficulty": "Intermediate", "readTime": "10 min" },
        { "id": "lesson_05_borrow", "title": "Borrowing Rules", "filename": "lesson05_borrowing.md", "difficulty": "Intermediate", "readTime": "12 min", "quizId": "quiz_adv_own_01" }
      ]
    },
    {
      "id": "track_05_smart_ptrs",
      "title": "5. Smart Pointers",
      "description": "Managing heap memory and shared state.",
      "lessons": [
        { "id": "lesson_06_smart", "title": "Box, Rc & Arc", "filename": "lesson06_smart_pointers.md", "difficulty": "Intermediate", "readTime": "12 min" },
        { "id": "lesson_07_interior", "title": "Interior Mutability", "filename": "lesson07_interior_mutability.md", "difficulty": "Rustacean", "readTime": "15 min" }
      ]
    },
    {
        "id": "track_async",
        "title": "6. Async Runtime Ops",
        "description": "Deep dive into Tokio and task scheduling.",
        "lessons": [
          { "id": "lesson_async_basics", "title": "Work-Stealing Scheduler", "filename": "lesson15_async_basics.md", "difficulty": "Rustacean", "readTime": "10 min", "quizId": "quiz_async_01" },
          { "id": "lesson_tokio_tasks", "title": "Tokio Spawning", "filename": "lesson16_tokio_tasks.md", "difficulty": "Rustacean", "readTime": "12 min" },
          { "id": "lesson_channels", "title": "Channels (MPSC)", "filename": "lesson17_channels.md", "difficulty": "Rustacean", "readTime": "10 min" }
        ]
    },
    {
        "id": "track_patterns",
        "title": "7. Design Patterns",
        "description": "Architectural patterns for robust systems.",
        "lessons": [
            { "id": "lesson_newtype", "title": "Newtype Pattern", "filename": "lesson08_newtype.md", "difficulty": "Intermediate", "readTime": "8 min" },
            { "id": "lesson_builder", "title": "Builder Pattern", "filename": "lesson09_builder.md", "difficulty": "Beginner", "readTime": "8 min" },
            { "id": "lesson_typestate", "title": "Typestate Pattern", "filename": "lesson11_typestate.md", "difficulty": "Rustacean", "readTime": "15 min", "quizId": "quiz_domain_01" }
        ]
    },
    {
        "id": "track_web",
        "title": "8. Web Architecture",
        "description": "Building high-performance APIs.",
        "lessons": [
            { "id": "lesson_axum", "title": "Axum Extractors", "filename": "lesson22_axum_architecture.md", "difficulty": "Intermediate", "readTime": "15 min", "quizId": "quiz_web_arch_01" },
            { "id": "lesson_sqlx", "title": "SQLx Compile-Time Checks", "filename": "lesson20_sqlx.md", "difficulty": "Intermediate", "readTime": "12 min" },
            { "id": "lesson_middleware", "title": "Tower Middleware", "filename": "lesson23_middleware.md", "difficulty": "Rustacean", "readTime": "15 min" }
        ]
    },
    {
        "id": "track_macros",
        "title": "9. Metaprogramming",
        "description": "Code that writes code: Declarative and Procedural Macros.",
        "lessons": [
            { "id": "lesson_macros_basics", "title": "Declarative Macros", "filename": "lesson_macros_basics.md", "difficulty": "Intermediate", "readTime": "10 min" },
            { "id": "lesson_proc_macros", "title": "Procedural Macros", "filename": "lesson_proc_macros.md", "difficulty": "Rustacean", "readTime": "15 min" }
        ]
    },
    {
        "id": "track_systems",
        "title": "10. Systems Engineering",
        "description": "Bare metal, kernels, and direct hardware access.",
        "lessons": [
            { "id": "lesson_embedded", "title": "Embedded & HAL", "filename": "lesson_embedded.md", "difficulty": "Intermediate", "readTime": "12 min" },
            { "id": "lesson_kernel", "title": "OS Development", "filename": "lesson_kernel.md", "difficulty": "Rustacean", "readTime": "20 min" },
            { "id": "lesson_asm", "title": "Inline Assembly", "filename": "lesson_asm.md", "difficulty": "Rustacean", "readTime": "15 min" }
        ]
    },
    {
        "id": "track_observability",
        "title": "11. Deep Observability",
        "description": "Profiling, flamegraphs, and memory forensics.",
        "lessons": [
            { "id": "lesson_observability", "title": "Tracing & Metrics", "filename": "lesson_observability.md", "difficulty": "Intermediate", "readTime": "12 min" },
            { "id": "lesson_flame", "title": "Flamegraphs", "filename": "lesson_flame.md", "difficulty": "Rustacean", "readTime": "10 min" },
            { "id": "lesson_alloc", "title": "Memory Forensics", "filename": "lesson_alloc.md", "difficulty": "Rustacean", "readTime": "12 min" }
        ]
    },
    {
        "id": "track_distributed",
        "title": "12. Distributed Primitives",
        "description": "Consensus, binary protocols, and networking.",
        "lessons": [
            { "id": "lesson_protocols", "title": "Network Protocols", "filename": "lesson_protocols.md", "difficulty": "Rustacean", "readTime": "15 min" },
            { "id": "lesson_raft", "title": "Raft Consensus", "filename": "lesson_raft.md", "difficulty": "Rustacean", "readTime": "20 min" },
            { "id": "lesson_mesh", "title": "Service Mesh", "filename": "lesson_mesh.md", "difficulty": "Intermediate", "readTime": "12 min" }
        ]
    },
    {
        "id": "track_cloud",
        "title": "13. Cloud Native",
        "description": "MicroVMs, WebAssembly, and Distributed Actors.",
        "lessons": [
            { "id": "lesson_cloud_native", "title": "MicroVMs (Firecracker)", "filename": "lesson_cloud_native.md", "difficulty": "Intermediate", "readTime": "15 min" },
            { "id": "lesson_wasm_cloud", "title": "WasmCloud Actors", "filename": "lesson_wasm_cloud.md", "difficulty": "Rustacean", "readTime": "15 min" }
        ]
    },
    {
      "id": "track_sovereign_horizon",
      "title": "25. The Sovereign Horizon",
      "description": "Formal Verification and Post-Quantum security.",
      "lessons": [
        { "id": "lesson_formal", "title": "Formal Proofs (Kani)", "filename": "lesson_formal.md", "difficulty": "Rustacean", "readTime": "20 min" },
        { "id": "lesson_pqc", "title": "Post-Quantum Cryptography", "filename": "lesson_pqc.md", "difficulty": "Rustacean", "readTime": "20 min" }
      ]
    },
    {
      "id": "track_source_truth",
      "title": "30. The Source of Truth",
      "description": "CRDTs for Global State and Compiler Internals (MIR).",
      "lessons": [
        { "id": "lesson_crdt", "title": "Global State (CRDTs)", "filename": "lesson_crdt.md", "difficulty": "Rustacean", "readTime": "18 min" },
        { "id": "lesson_mir", "title": "Compiler Internals (MIR)", "filename": "lesson_mir.md", "difficulty": "Rustacean", "readTime": "18 min" }
      ]
    },
    {
      "id": "track_final_frontier",
      "title": "31. The Final Frontier",
      "description": "Real-time DSP and Dynamic Hot-Swapping.",
      "lessons": [
        { "id": "lesson_dsp", "title": "Real-Time Audio (DSP)", "filename": "lesson_dsp.md", "difficulty": "Rustacean", "readTime": "20 min" },
        { "id": "lesson_hotswap", "title": "Dynamic Hot-Swapping", "filename": "lesson_hotswap.md", "difficulty": "Rustacean", "readTime": "20 min" }
      ]
    },
    {
      "id": "track_10_internals",
      "title": "40. Advanced Internals",
      "description": "The dark arts of low-level programming.",
      "lessons": [
        { "id": "lesson_99_unsafe", "title": "Unsafe Rust & FFI", "filename": "lesson_99_unsafe.md", "difficulty": "Rustacean", "readTime": "25 min", "quizId": "quiz_unsafe_01" },
        { "id": "lesson_mastery_final", "title": "GRAND MASTER CERTIFICATION", "filename": "lesson_mastery_final.md", "difficulty": "Rustacean", "readTime": "45 min", "quizId": "quiz_mastery_final" }
      ]
    }
  ]
};

export const LESSON_LOOKUP = CURRICULUM.tracks.flatMap(t => t.lessons);
