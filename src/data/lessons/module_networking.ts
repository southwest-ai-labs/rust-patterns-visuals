
export const content_protocols = `
# Network Sovereignty: Codecs & Framing

Dominar el networking en Rust significa entender cómo los bytes se convierten en estructuras de datos con **costo cero**. No usamos JSON en la capa de transporte crítica; usamos protocolos binarios.

## El patrón Codec (Framing)
TCP es un stream de bytes, no de mensajes. Necesitamos una capa que decida dónde termina un mensaje y empieza el siguiente.

\`\`\`protocol-lab
// Interactive: Designing a 64-bit Network Header
\`\`\`

## Byte-Order (Endianness)
Al hablar con diferentes CPUs, debemos acordar si el bit más significativo va primero (Big-Endian) o al final (Little-Endian). Rust ofrece métodos integrados como \`to_be_bytes()\` para esto.

> 💎 **Pro Tip: Zero-Copy Parsing**
> 
> Usa la crate \`zerocopy\` o \`rkyv\` para mapear bytes de red directamente a structs de Rust sin realizar una sola asignación en el Heap. Si el layout de la struct coincide con el paquete, el parsing es instantáneo (O(1)).
`;
