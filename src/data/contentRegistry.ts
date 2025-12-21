
import { content_onboarding, content_control_flow, content_iterators, content_std_types } from './lessons/module_basics';
import { content_move_semantics } from './lessons/module_ownership';
import { content_borrowing } from './lessons/module_borrowing';
import { content_smart_pointers, content_interior_mutability } from './lessons/module_smart_pointers';
import { content_newtype, content_builder, content_typestate } from './lessons/module_design_patterns';
import { content_async_basics, content_tokio_tasks, content_channels } from './lessons/module_async';
import { content_axum_architecture, content_sqlx, content_middleware } from './lessons/module_web';
// Fix: content_mastery_final is in module_advanced, not module_internals
import { content_unsafe } from './lessons/module_internals';
import { content_mastery_final } from './lessons/module_advanced';

export const CONTENT_MAP: Record<string, string | { en: string; es: string }> = {
  'lesson00_onboarding.md': content_onboarding,
  'lesson01_control_flow.md': content_control_flow,
  'lesson02_iterators.md': content_iterators,
  'lesson03_std_types.md': content_std_types,
  'lesson04_move_semantics.md': content_move_semantics,
  'lesson05_borrowing.md': content_borrowing,
  'lesson06_smart_pointers.md': content_smart_pointers,
  'lesson07_interior_mutability.md': content_interior_mutability,
  'lesson08_newtype.md': content_newtype,
  'lesson09_builder.md': content_builder,
  'lesson11_typestate.md': content_typestate,
  'lesson15_async_basics.md': content_async_basics,
  'lesson16_tokio_tasks.md': content_tokio_tasks,
  'lesson17_channels.md': content_channels,
  'lesson22_axum_architecture.md': content_axum_architecture,
  'lesson20_sqlx.md': content_sqlx,
  'lesson23_middleware.md': content_middleware,
  'lesson_99_unsafe.md': content_unsafe,
  'lesson_mastery_final.md': content_mastery_final,

  // Curriculum placeholders (ensure every curriculum filename resolves)
  'lesson_macros_basics.md': {
    es: '# Macros Declarativas\n\nEste módulo es una demo interactiva.\n\n```macro-sandbox\n```\n',
    en: '# Declarative Macros\n\nThis module is an interactive demo.\n\n```macro-sandbox\n```\n'
  },
  'lesson_proc_macros.md': {
    es: '# Macros Procedurales\n\nLab interactivo para entender el pipeline de macros.\n\n```proc-macro-lab\n```\n',
    en: '# Procedural Macros\n\nInteractive lab to understand the macro pipeline.\n\n```proc-macro-lab\n```\n'
  },
  'lesson_embedded.md': {
    es: '# Embedded & HAL\n\nExplora registros y periféricos con un HUD interactivo.\n\n```embedded-hud\n```\n',
    en: '# Embedded & HAL\n\nExplore registers and peripherals with an interactive HUD.\n\n```embedded-hud\n```\n'
  },
  'lesson_asm.md': {
    es: '# Inline Assembly\n\nExperimenta con ASM inline de forma guiada.\n\n```asm-lab\n```\n',
    en: '# Inline Assembly\n\nExperiment with inline asm in a guided lab.\n\n```asm-lab\n```\n'
  },
  'lesson_observability.md': {
    es: '# Tracing & Metrics\n\nVisualiza trazas y cuellos de botella.\n\n```flame-viz\n```\n',
    en: '# Tracing & Metrics\n\nVisualize traces and bottlenecks.\n\n```flame-viz\n```\n'
  },
  'lesson_flame.md': {
    es: '# Flamegraphs\n\nInterpreta flamegraphs y aprende a optimizar.\n\n```flame-viz\n```\n',
    en: '# Flamegraphs\n\nInterpret flamegraphs and learn how to optimize.\n\n```flame-viz\n```\n'
  },
  'lesson_alloc.md': {
    es: '# Memory Forensics\n\nSigue asignaciones y fugas con un tracker interactivo.\n\n```alloc-tracker\n```\n',
    en: '# Memory Forensics\n\nTrack allocations and leaks with an interactive tracker.\n\n```alloc-tracker\n```\n'
  },
  'lesson_protocols.md': {
    es: '# Network Protocols\n\nConstruye y analiza un protocolo binario.\n\n```protocol-lab\n```\n',
    en: '# Network Protocols\n\nBuild and analyze a binary protocol.\n\n```protocol-lab\n```\n'
  },
  'lesson_mesh.md': {
    es: '# Service Mesh\n\nExplora enrutamiento y topologías en un mesh.\n\n```mesh-viz\n```\n',
    en: '# Service Mesh\n\nExplore routing and topologies in a mesh.\n\n```mesh-viz\n```\n'
  },
  'lesson_wasm_cloud.md': {
    es: '# WasmCloud Actors\n\nOrquesta actores Wasm con un simulador interactivo.\n\n```wasm-orchestrator\n```\n',
    en: '# WasmCloud Actors\n\nOrchestrate Wasm actors with an interactive simulator.\n\n```wasm-orchestrator\n```\n'
  },
  'lesson_formal.md': {
    es: '# Formal Proofs (Kani)\n\nEste apartado incluye un laboratorio de circuitos como demo interactiva.\n\n```zk-lab\n```\n',
    en: '# Formal Proofs (Kani)\n\nThis section includes a circuit lab as an interactive demo.\n\n```zk-lab\n```\n'
  },
  'lesson_pqc.md': {
    es: '# Post-Quantum Cryptography\n\nDemo interactiva para razonar sobre seguridad y verificaciones.\n\n```zk-lab\n```\n',
    en: '# Post-Quantum Cryptography\n\nInteractive demo for reasoning about security and verification.\n\n```zk-lab\n```\n'
  },
  'lesson_mir.md': {
    es: '# Compiler Internals (MIR)\n\nVisualiza MIR y transforma el flujo.\n\n```mir-viz\n```\n',
    en: '# Compiler Internals (MIR)\n\nVisualize MIR and transform control flow.\n\n```mir-viz\n```\n'
  },
  'lesson_dsp.md': {
    es: '# Real-Time Audio (DSP)\n\nPrueba un pipeline DSP en tiempo real.\n\n```dsp-viz\n```\n',
    en: '# Real-Time Audio (DSP)\n\nTry a real-time DSP pipeline.\n\n```dsp-viz\n```\n'
  },
  'lesson_hotswap.md': {
    es: '# Dynamic Hot-Swapping\n\nSimula hot-swapping y rollback de componentes.\n\n```hotswap-viz\n```\n',
    en: '# Dynamic Hot-Swapping\n\nSimulate component hot-swaps and rollbacks.\n\n```hotswap-viz\n```\n'
  },
  // Advanced Simulation Placeholders
  'lesson_kernel.md': {
    es: '# OS Development\n\nUsa el visualizador para entender el paginado.\n\n```kernel-viz\n```\n',
    en: '# OS Development\n\nUse the visualizer to understand paging.\n\n```kernel-viz\n```\n'
  },
  'lesson_raft.md': {
    es: '# Distributed Consensus\n\nRaft en acción (demo interactiva).\n\n```quorum-lab\n```\n',
    en: '# Distributed Consensus\n\nRaft in action (interactive demo).\n\n```quorum-lab\n```\n'
  },
  'lesson_uring.md': {
    es: '# io_uring I/O\n\nMillones de IOPS sin syscalls (demo).\n\n```uring-viz\n```\n',
    en: '# io_uring I/O\n\nMillions of IOPS without syscalls (demo).\n\n```uring-viz\n```\n'
  },
  'lesson_crdt.md': {
    es: '# Global State (CRDTs)\n\nConvergencia global con CRDTs (demo).\n\n```crdt-viz\n```\n',
    en: '# Global State (CRDTs)\n\nGlobal convergence with CRDTs (demo).\n\n```crdt-viz\n```\n'
  },
  'lesson_cloud_native.md': {
    es: '# MicroVMs (Firecracker)\n\nExplora MicroVMs con un lab interactivo.\n\n```micro-vm-lab\n```\n',
    en: '# MicroVMs (Firecracker)\n\nExplore MicroVMs with an interactive lab.\n\n```micro-vm-lab\n```\n'
  }
};
