
export interface BenchmarkMetric {
    id: string;
    label: string;
    value: number; // relative cost or nanoseconds
    unit: 'ns' | 'cycles' | 'bytes';
    description: string;
}

export interface TradeOff {
    title: string;
    metrics: BenchmarkMetric[];
    conclusion: string;
}

export const PERFORMANCE_BENCHMARKS: Record<string, TradeOff> = {
    pointers: {
        title: "Pointer Indirection & Allocation",
        metrics: [
            { id: 'stack', label: 'Stack Access', value: 0.5, unit: 'ns', description: 'Direct access, zero overhead.' },
            { id: 'box', label: 'Box<T> (Heap)', value: 5.2, unit: 'ns', description: 'One pointer indirection + heap allocation.' },
            { id: 'rc', label: 'Rc<T> (Reference Counted)', value: 8.4, unit: 'ns', description: 'Atomic/Non-atomic counter update + indirection.' }
        ],
        conclusion: "Usa el Stack siempre que sea posible. Reserva Box para tipos recursivos o cuando el tamaño sea prohibitivo para el stack."
    },
    concurrency: {
        title: "Thread Communication Latency",
        metrics: [
            { id: 'mutex', label: 'Mutex Lock (Uncontended)', value: 15, unit: 'ns', description: 'Atomic CAS operation.' },
            { id: 'mpsc', label: 'MPSC Channel (Send)', value: 45, unit: 'ns', description: 'Buffer write + Task notification.' },
            { id: 'mutex_contended', label: 'Mutex Lock (Contended)', value: 250, unit: 'ns', description: 'Context switch and thread park.' }
        ],
        conclusion: "Los canales son mejores para la arquitectura, pero el Mutex es imbatible en baja latencia si no hay contención."
    }
};
