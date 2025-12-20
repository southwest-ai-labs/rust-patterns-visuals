
export interface ReferenceItem {
    id: string;
    title: string;
    category: 'Pattern' | 'Crate' | 'Concept';
    snippet: string;
    description: string;
    bestPractice: string;
}

export const REFERENCE_VAULT: ReferenceItem[] = [
    {
        id: 'ref_typestate',
        title: 'Typestate Pattern',
        category: 'Pattern',
        snippet: 'struct StateA; struct StateB; struct Context<S> { _s: PhantomData<S> }',
        description: 'Usa el sistema de tipos para codificar las máquinas de estado, haciendo que las transiciones inválidas sean imposibles de compilar.',
        bestPractice: 'Siempre consume "self" en los métodos de transición para invalidar el estado anterior.'
    },
    {
        id: 'ref_raii',
        title: 'RAII (Drop Trait)',
        category: 'Pattern',
        snippet: 'impl Drop for Guard { fn drop(&mut self) { /* cleanup */ } }',
        description: 'Resource Acquisition Is Initialization. Garantiza que los recursos se liberen automáticamente al salir del scope.',
        bestPractice: 'Usa Guards para Mutexes y conexiones de base de datos.'
    },
    {
        id: 'ref_newtype',
        title: 'Newtype Pattern',
        category: 'Pattern',
        snippet: 'struct UserId(u32);',
        description: 'Envuelve tipos primitivos en tuplas-structs para evitar confusiones de unidades y mejorar la legibilidad.',
        bestPractice: 'Usa #[repr(transparent)] para asegurar costo cero en tiempo de ejecución.'
    },
    {
        id: 'ref_tokio',
        title: 'Tokio Runtime',
        category: 'Crate',
        snippet: '#[tokio::main] async fn main() { ... }',
        description: 'El estándar de facto para runtime asíncrono multi-hilo en Rust.',
        bestPractice: 'Evita bloquear el thread de Tokio con código CPU-bound pesado; usa spawn_blocking.'
    },
    {
        id: 'ref_serde',
        title: 'Serde Framework',
        category: 'Crate',
        snippet: '#[derive(Serialize, Deserialize)]',
        description: 'Serialización y deserialización genérica extremadamente eficiente.',
        bestPractice: 'Usa #[serde(rename_all = "camelCase")] para integraciones con APIs JS.'
    }
];
