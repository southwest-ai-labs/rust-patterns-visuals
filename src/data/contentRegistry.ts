
import { content_control_flow, content_iterators, content_std_types } from './lessons/module_basics';
import { content_move_semantics } from './lessons/module_ownership';
import { content_borrowing } from './lessons/module_borrowing';
import { content_smart_pointers, content_interior_mutability } from './lessons/module_smart_pointers';
import { content_newtype, content_builder, content_typestate } from './lessons/module_design_patterns';
import { content_async_basics, content_tokio_tasks, content_channels } from './lessons/module_async';
import { content_axum_architecture, content_sqlx, content_middleware } from './lessons/module_web';
// Fix: content_mastery_final is in module_advanced, not module_internals
import { content_unsafe } from './lessons/module_internals';
import { content_mastery_final } from './lessons/module_advanced';

export const CONTENT_MAP: Record<string, string> = {
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
  // Advanced Simulation Placeholders
  'lesson_kernel.md': '# OS Development\nUsa el visualizador abajo para entender el paginado.\n\n```kernel-viz\n```',
  'lesson_raft.md': '# Distributed Consensus\nAlgoritmo Raft en acción.\n\n```quorum-lab\n```',
  'lesson_uring.md': '# io_uring I/O\nMillones de IOPS sin syscalls.\n\n```uring-viz\n```',
  'lesson_crdt.md': '# Global State Convergence\nConflict-free Replicated Data Types.\n\n```crdt-viz\n```',
  'lesson_cloud_native.md': '# Cloud Native Rust\nFirecracker & MicroVMs.\n\n```micro-vm-lab\n```'
};
