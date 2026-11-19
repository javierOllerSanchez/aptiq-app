import { tokens } from '@aptiq/tokens';
import Svg, { Path } from 'react-native-svg';

/** Dibujo del motor (`Drawing` de @aptiq/engine): caja cuadrada y trazos con colores de token. */
export interface FigureDrawing {
  size: number;
  shapes: { d: string; fill: 'ink' | 'paper' | 'none'; stroke: 'ink' | 'paper' | 'none'; width: number }[];
}

const paint = (p: 'ink' | 'paper' | 'none') =>
  p === 'none' ? 'none' : p === 'ink' ? tokens.color.ink : tokens.color.paperCard;

/**
 * Figura de una pregunta espacial. Con `label` es una imagen para el lector de pantalla; sin él,
 * decorativa (cuando la descripción ya la da el control que la contiene).
 */
export function Figure({ drawing, size, label }: { drawing: FigureDrawing; size: number; label?: string }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${drawing.size} ${drawing.size}`}
      {...(label
        ? { accessible: true, accessibilityRole: 'image' as const, accessibilityLabel: label }
        : { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const })}
    >
      {drawing.shapes.map((s, i) => (
        <Path key={i} d={s.d} fill={paint(s.fill)} stroke={paint(s.stroke)} strokeWidth={s.width} strokeLinejoin="round" />
      ))}
    </Svg>
  );
}
