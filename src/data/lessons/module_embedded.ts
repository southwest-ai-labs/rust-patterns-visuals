
export const content_embedded = `
# Bare Metal: Rust in Silicon

Rust es el lenguaje perfecto para microcontroladores. Ofrece seguridad de memoria sin necesidad de un recolector de basura ni un sistema operativo pesado.

## PAC vs HAL
1.  **PAC (Peripheral Access Crate)**: Acceso directo a los registros de hardware (unsafe, nivel bit).
2.  **HAL (Hardware Abstraction Layer)**: Traits seguros para interactuar con periféricos (I2C, SPI, GPIO).

## The Register Interface
Interactuar con el hardware significa leer y escribir en direcciones de memoria específicas que están mapeadas a los pines físicos del chip.

\`\`\`embedded-hud
// Visualizer: GPIO Register Manipulation
\`\`\`

> 💎 **Pro Tip: Interrupt Handlers**
> 
> En embebidos, la concurrencia se maneja mediante interrupciones. El sistema de tipos de Rust asegura que no haya condiciones de carrera al acceder a periféricos compartidos entre el bucle principal y las interrupciones.
`;
