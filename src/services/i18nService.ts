
export type Language = 'en' | 'es';

export const TRANSLATIONS = {
  en: {
    // HUD & Navigation
    neural_uplink: "Neural_Uplink",
    command_deck: "Command_Deck",
    search_core: "Search_Core",
    network_status: "Network_Status",
    local_first: "Local_First",
    operator_mmr: "Operator_MMR",
    daily_challenge: "Daily_Challenge",
    settings: "Settings",
    exit_gate: "Exit_Gate",

    // Dashboard Tabs
    neural_map: "Neural_Map",
    career_path: "Career_Path",
    hive_mind: "Hive_Mind",
    identity: "Identity",

    // Settings & Pro
    sys_config: "System_Configuration",
    mastery_protocol: "Mastery Protocol",
    neural_handshake: "Initialize Neural Handshake",
    status_verified: "Status: Uplink_Verified",
    commit_state: "Commit_State",
    intel_model: "Intelligence_Model",

    // Common Actions
    run: "RUN",
    copy: "COPY",
    copied: "COPIED",
    syncing: "SYNCING...",
    abort: "Abort",
    save_github: "Save to GitHub",

    // Quiz & Certs
    eng_assessment: "Engineering Assessment",
    finalize_eval: "Finalize Neural Evaluation",
    mint_cert: "Mint Verified Certificate",
    score: "SYSTEM_SCORE",
    passed: "Passed",
    failed: "Failed",

    // AI Tutor
    tutor_welcome: "Hi! I'm Ferris. I can help you understand this code!",
    tutor_placeholder: "Ask Ferris (Search enabled)...",
    thinking: "Thinking...",

    // Ranks
    rank_initiate: "Initiate",
    rank_ferris_fan: "Ferris Fan",
    rank_apprentice: "Apprentice",
    rank_journeyman: "Journeyman",
    rank_grand_rustacean: "Grand Rustacean",

    // Curriculum - Tracks
    track_01_title: "1. Control Flow Mastery",
    track_01_desc: "Moving beyond C-style logic into idiomatic Rust control flow.",
    track_02_title: "2. Functional Iteration",
    track_02_desc: "Embracing the power of Iterators and Closures.",
    track_03_title: "3. Standard Lib Essentials",
    track_03_desc: "Core types that every Rust developer uses daily.",
    track_04_title: "4. Ownership & Memory",
    track_04_desc: "The core innovation of Rust.",
    track_05_title: "5. Smart Pointers",
    track_05_desc: "Managing heap memory and shared state.",
    track_06_title: "6. Async Runtime Ops",
    track_06_desc: "Deep dive into Tokio and task scheduling.",
    track_07_title: "7. Design Patterns",
    track_07_desc: "Architectural patterns for robust systems.",
    track_08_title: "8. Web Architecture",
    track_08_desc: "Building high-performance APIs.",
    track_09_title: "9. Metaprogramming",
    track_09_desc: "Code that writes code: Declarative and Procedural Macros.",
    track_10_title: "10. Systems Engineering",
    track_10_desc: "Bare metal, kernels, and direct hardware access.",
    track_11_title: "11. Deep Observability",
    track_11_desc: "Profiling, flamegraphs, and memory forensics.",

    // Curriculum - Lessons
    lesson_01_match: "Match & If Let",
    lesson_02_iterators: "Iterators vs Loops",
    lesson_03_options: "Option & Result",
    lesson_04_move: "Move Semantics",
    lesson_05_borrow: "Borrowing Rules",
    lesson_06_smart: "Box, Rc & Arc",
    lesson_07_interior: "Interior Mutability",
    lesson_08_newtype: "Newtype Pattern",
    lesson_09_builder: "Builder Pattern",
    lesson_11_typestate: "Typestate Pattern",
    lesson_async_basics: "Work-Stealing Scheduler",
    lesson_tokio_tasks: "Tokio Spawning",
    lesson_channels: "Channels (MPSC)",
    lesson_axum: "Axum Extractors",
    lesson_sqlx: "SQLx Compile-Time Checks",
    lesson_middleware: "Tower Middleware",
    lesson_macros_basics: "Declarative Macros",
    lesson_proc_macros: "Procedural Macros",
    lesson_embedded: "Embedded & HAL",
    lesson_kernel: "OS Development",
    lesson_asm: "Inline Assembly",

    // Difficulty Levels
    difficulty_beginner: "Beginner",
    difficulty_intermediate: "Intermediate",
    difficulty_rustacean: "Rustacean",

    // UI Text
    read_time: "Read Time",
    min: "min",
    complete_lesson: "Complete Lesson",
    back_to_hub: "Back to Hub",
    next_lesson: "Next Lesson",
    take_quiz: "Take Quiz",
    view_certificate: "View Certificate"
  },
  es: {
    // HUD & Navigation
    neural_uplink: "Enlace_Neural",
    command_deck: "Cubierta_Mando",
    search_core: "Núcleo_Búsqueda",
    network_status: "Estado_Red",
    local_first: "Local_Primero",
    operator_mmr: "MMR_Operador",
    daily_challenge: "Reto_Diario",
    settings: "Ajustes",
    exit_gate: "Salir_Puerta",

    // Dashboard Tabs
    neural_map: "Mapa_Neural",
    career_path: "Carrera_Técnica",
    hive_mind: "Mente_Enjambre",
    identity: "Identidad",

    // Settings & Pro
    sys_config: "Configuración_Sistema",
    mastery_protocol: "Protocolo de Maestría",
    neural_handshake: "Iniciar Apretón de Manos Neural",
    status_verified: "Estado: Enlace_Verificado",
    commit_state: "Confirmar_Estado",
    intel_model: "Modelo_Inteligencia",

    // Common Actions
    run: "EJECUTAR",
    copy: "COPIAR",
    copied: "COPIADO",
    syncing: "SINCRONIZANDO...",
    abort: "Abortar",
    save_github: "Guardar en GitHub",

    // Quiz & Certs
    eng_assessment: "Evaluación de Ingeniería",
    finalize_eval: "Finalizar Evaluación Neural",
    mint_cert: "Emitir Certificado Verificado",
    score: "PUNTUACIÓN_SISTEMA",
    passed: "Aprobado",
    failed: "Fallido",

    // AI Tutor
    tutor_welcome: "¡Hola! Soy Ferris. ¡Puedo ayudarte a entender este código!",
    tutor_placeholder: "Pregunta a Ferris (Búsqueda activa)...",
    thinking: "Pensando...",

    // Ranks
    rank_initiate: "Iniciado",
    rank_ferris_fan: "Fan de Ferris",
    rank_apprentice: "Aprendiz",
    rank_journeyman: "Oficial",
    rank_grand_rustacean: "Gran Rustaceano",

    // Curriculum - Tracks
    track_01_title: "1. Dominio del Control de Flujo",
    track_01_desc: "Ir más allá de la lógica de estilo C hacia el control de flujo idiomático de Rust.",
    track_02_title: "2. Iteración Funcional",
    track_02_desc: "Abrazar el poder de Iteradores y Closures.",
    track_03_title: "3. Esenciales de la Librería Estándar",
    track_03_desc: "Tipos principales que todo desarrollador de Rust usa a diario.",
    track_04_title: "4. Propiedad y Memoria",
    track_04_desc: "La innovación central de Rust.",
    track_05_title: "5. Punteros Inteligentes",
    track_05_desc: "Gestión de memoria dinámica y estado compartido.",
    track_06_title: "6. Operaciones de Tiempo de Ejecución Asincrónico",
    track_06_desc: "Profundizar en Tokio y programación de tareas.",
    track_07_title: "7. Patrones de Diseño",
    track_07_desc: "Patrones arquitectónicos para sistemas robustos.",
    track_08_title: "8. Arquitectura Web",
    track_08_desc: "Construir APIs de alto rendimiento.",
    track_09_title: "9. Metaprogramación",
    track_09_desc: "Código que escribe código: Macros Declarativas y Procedurales.",
    track_10_title: "10. Ingeniería de Sistemas",
    track_10_desc: "Metal desnudo, kernels y acceso directo a hardware.",
    track_11_title: "11. Observabilidad Profunda",
    track_11_desc: "Perfilamiento, flamegraphs y análisis forense de memoria.",

    // Curriculum - Lessons
    lesson_01_match: "Match e If Let",
    lesson_02_iterators: "Iteradores vs Bucles",
    lesson_03_options: "Option y Result",
    lesson_04_move: "Semántica de Movimiento",
    lesson_05_borrow: "Reglas de Préstamo",
    lesson_06_smart: "Box, Rc y Arc",
    lesson_07_interior: "Mutabilidad Interior",
    lesson_08_newtype: "Patrón Newtype",
    lesson_09_builder: "Patrón Builder",
    lesson_11_typestate: "Patrón Typestate",
    lesson_async_basics: "Planificador de Robo de Trabajo",
    lesson_tokio_tasks: "Spawning en Tokio",
    lesson_channels: "Canales (MPSC)",
    lesson_axum: "Extractores de Axum",
    lesson_sqlx: "Verificación en Tiempo de Compilación de SQLx",
    lesson_middleware: "Middleware de Tower",
    lesson_macros_basics: "Macros Declarativas",
    lesson_proc_macros: "Macros Procedurales",
    lesson_embedded: "Embebido y HAL",
    lesson_kernel: "Desarrollo de SO",
    lesson_asm: "Ensamblador en Línea",

    // Difficulty Levels
    difficulty_beginner: "Principiante",
    difficulty_intermediate: "Intermedio",
    difficulty_rustacean: "Rustaceano",

    // UI Text
    read_time: "Tiempo de Lectura",
    min: "min",
    complete_lesson: "Completar Lección",
    back_to_hub: "Volver al Hub",
    next_lesson: "Siguiente Lección",
    take_quiz: "Realizar Quiz",
    view_certificate: "Ver Certificado"
  }
};
