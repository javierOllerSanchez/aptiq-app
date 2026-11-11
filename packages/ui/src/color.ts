/** «#121316» + 0.12 → «rgba(18,19,22,0.12)», para usar los colores de tokens con transparencia. */
export function withAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${alpha})`;
}
