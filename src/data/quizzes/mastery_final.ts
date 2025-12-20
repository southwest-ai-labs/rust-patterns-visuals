
import { QuizModule } from '../../types';

export const quiz_mastery_final: QuizModule = {
  id: 'quiz_mastery_final',
  title: 'GRAND RUSTACEAN: FINAL CERTIFICATION (L5)',
  minPassScore: 90, 
  timeLimitSeconds: 1800, // 30 minutos
  questions: [
    {
      id: 'm1',
      level: 5,
      points: 20,
      question: "¿Cuál es el riesgo de 'Unsoundness' más común al implementar un wrapper seguro sobre una librería C que utiliza callbacks?",
      options: [
        { id: 'o1', text: "Fugas de memoria en el heap de C.", isCorrect: false },
        { id: 'o2', text: "Que el callback de C intente llamar a una clausura de Rust que ya ha sido liberada (Lifetime Violation).", isCorrect: true },
        { id: 'o3', text: "El uso de tipos de datos de 32 bits en sistemas de 64 bits.", isCorrect: false },
        { id: 'o4', text: "La falta de optimización del compilador.", isCorrect: false }
      ],
      explanation: "Al pasar clausuras de Rust a C, debemos asegurar que la clausura viva al menos tanto como la librería C la necesite (usualmente 'static o mediante Box::leak). De lo contrario, C llamará a memoria liberada."
    },
    {
      id: 'm2',
      level: 5,
      points: 20,
      question: "En un entorno de alta concurrencia con Tokio, ¿qué sucede si una tarea realiza una operación bloqueante (std::fs o un loop infinito) sin usar spawn_blocking?",
      options: [
        { id: 'o1', text: "Tokio crea automáticamente un nuevo hilo para compensar.", isCorrect: false },
        { id: 'o2', text: "Se produce 'Worker Starvation', donde otras tareas en el mismo hilo del runtime no pueden progresar.", isCorrect: true },
        { id: 'o3', text: "El sistema operativo mata el proceso por uso excesivo de CPU.", isCorrect: false },
        { id: 'o4', text: "La tarea se mueve automáticamente a otro núcleo.", isCorrect: false }
      ],
      explanation: "El scheduler de Tokio es cooperativo. Si una tarea no cede el control (.await), el hilo del worker queda bloqueado y todas las demás tareas asignadas a ese hilo se detienen."
    },
    {
      id: 'm3',
      level: 5,
      points: 20,
      question: "Diferencia crítica entre 'Stacked Borrows' y 'Tree Borrows' en el modelo de memoria de Rust:",
      options: [
        { id: 'o1', text: "Stacked Borrows es para el Stack, Tree Borrows para el Heap.", isCorrect: false },
        { id: 'o2', text: "Tree Borrows permite optimizaciones de punteros más agresivas al tratar el acceso como un árbol de permisos en lugar de una pila estricta.", isCorrect: true },
        { id: 'o3', text: "Stacked Borrows solo funciona en modo debug.", isCorrect: false },
        { id: 'o4', text: "No hay diferencia, son sinónimos.", isCorrect: false }
      ],
      explanation: "Tree Borrows es un modelo experimental que intenta definir qué optimizaciones del compilador son válidas para punteros que hacen alias, siendo más permisivo que Stacked Borrows en ciertos casos de reordenamiento."
    },
    {
        id: 'm4',
        level: 5,
        points: 20,
        question: "Sobre Variance: ¿Por qué `&mut T` es invariante respecto a T?",
        options: [
          { id: 'o1', text: "Para permitir que se guarden referencias de vida corta en structs de vida larga.", isCorrect: false },
          { id: 'o2', text: "Para evitar que un usuario escriba un tipo con vida corta en una ubicación que espera un tipo con vida larga, causando punteros colgantes.", isCorrect: true },
          { id: 'o3', text: "Es una limitación técnica del compilador que se corregirá en Rust 2.0.", isCorrect: false },
          { id: 'o4', text: "Porque todas las referencias mutables deben ser estáticas.", isCorrect: false }
        ],
        explanation: "Si `&mut T` fuera covariante, podrías usar una referencia mutable a algo que vive mucho para guardar algo que vive poco. Al terminar la vida corta, el dueño de la vida larga tendría un puntero a memoria inválida."
    },
    {
        id: 'm5',
        level: 5,
        points: 20,
        question: "¿Qué garantiza realmente el contrato de `UnsafeCell<T>`?",
        options: [
          { id: 'o1', text: "Que los datos están cifrados en memoria.", isCorrect: false },
          { id: 'o2', text: "Es el único tipo legítimo para obtener una referencia mutable a partir de una compartida (&T -> &mut T) sin violar las reglas de aliasing del compilador.", isCorrect: true },
          { id: 'o3', text: "Que el compilador nunca optimizará el código que lo rodea.", isCorrect: false },
          { id: 'o4', text: "Que los datos se almacenan en la sección de solo lectura del binario.", isCorrect: false }
        ],
        explanation: "Rust asume que las referencias compartidas (&T) son inmutables. `UnsafeCell` es el 'magic building block' que le dice al compilador: 'este dato puede cambiar incluso con una referencia compartida', permitiendo mutabilidad interior legal."
    },
    {
        id: 'm6',
        level: 5,
        points: 20,
        question: "¿Cuál es el propósito de `std::hint::black_box`?",
        options: [
          { id: 'o1', text: "Cifrar variables sensibles.", isCorrect: false },
          { id: 'o2', text: "Evitar que el optimizador del compilador elimine código que considera 'inútil' (ej. en benchmarks), forzándolo a tratar el valor como opaco.", isCorrect: true },
          { id: 'o3', text: "Crear un entorno de ejecución aislado (sandbox).", isCorrect: false },
          { id: 'o4', text: "Ocultar errores de compilación.", isCorrect: false }
        ],
        explanation: "En benchmarks, el compilador puede notar que un cálculo no se usa y eliminarlo. `black_box` engaña al compilador para que crea que el valor se usará de formas desconocidas, asegurando que el cálculo ocurra."
    },
    {
        id: 'm7',
        level: 5,
        points: 20,
        question: "En el contexto de `Pin<P>`, ¿cuándo es SEGURO mover un objeto que ha sido fijado?",
        options: [
          { id: 'o1', text: "Nunca.", isCorrect: false },
          { id: 'o2', text: "Si el objeto implementa el trait auto `Unpin`.", isCorrect: true },
          { id: 'o3', text: "Solo si se hace dentro de un bloque unsafe.", isCorrect: false },
          { id: 'o4', text: "Si el objeto está guardado en el Heap.", isCorrect: false }
        ],
        explanation: "La mayoría de los tipos en Rust son `Unpin`, lo que significa que no les importa ser movidos. `Pin` solo tiene efecto real sobre tipos que NO implementan `Unpin` (como los futures generados por async/await)."
    },
    {
        id: 'm8',
        level: 5,
        points: 20,
        question: "¿Qué ocurre con el 'Drop Check' en tipos genéricos `Struct<T>`?",
        options: [
          { id: 'o1', text: "Rust asume que `T` no tiene destructor.", isCorrect: false },
          { id: 'o2', text: "El compilador debe asegurar que `T` viva al menos tanto como `Struct<T>` si el destructor de `Struct` accede a campos de tipo `T`.", isCorrect: true },
          { id: 'o3', text: "Se ignora si se usa `Box`.", isCorrect: false },
          { id: 'o4', text: "El usuario debe llamar a `drop()` manualmente.", isCorrect: false }
        ],
        explanation: "El Drop Check previene que un destructor acceda a datos que ya han sido liberados. Si `Struct<T>` tiene un destructor que usa un `&T`, el compilador se asegura de que esa referencia sea válida durante la ejecución del drop."
    },
    {
        id: 'm9',
        level: 5,
        points: 20,
        question: "¿Cuál es la función del atributo `#[non_exhaustive]` en un Enum público?",
        options: [
          { id: 'o1', text: "Permite que el Enum tenga infinitas variantes.", isCorrect: false },
          { id: 'o2', text: "Obliga a los usuarios externos a añadir un brazo de coincidencia comodín (`_`), permitiendo que la librería añada variantes en el futuro sin romper el código del usuario.", isCorrect: true },
          { id: 'o3', text: "Reduce el tamaño del Enum en memoria.", isCorrect: false },
          { id: 'o4', text: "Desactiva el chequeo de exhaustividad en toda la aplicación.", isCorrect: false }
        ],
        explanation: "Es una herramienta de estabilidad de API. Sin ella, añadir una variante a un Enum público rompería todos los `match` de los usuarios. Con ella, los usuarios están forzados a manejar el caso por defecto."
    },
    {
        id: 'm10',
        level: 5,
        points: 20,
        question: "¿Cómo interactúa `AtomicPtr` con el modelo de consistencia de memoria de Rust?",
        options: [
          { id: 'o1', text: "No interactúa, los punteros atómicos son ilegales.", isCorrect: false },
          { id: 'o2', text: "Requiere especificar un `Ordering` (como `SeqCst` o `Relaxed`) que define cómo se sincronizan los accesos entre diferentes núcleos de CPU.", isCorrect: true },
          { id: 'o3', text: "Bloquea todos los hilos del sistema hasta que se completa la operación.", isCorrect: false },
          { id: 'o4', text: "Es idéntico a un `Mutex<*mut T>`.", isCorrect: false }
        ],
        explanation: "Las operaciones atómicas no son solo 'rápidas', sino que definen la visibilidad de la memoria entre hilos. Elegir el `Ordering` correcto es vital para evitar condiciones de carrera sutiles sin el coste de un Mutex."
    }
  ]
};
