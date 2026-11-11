import { tokens } from '@aptiq/tokens';
import Svg, { Circle, Path } from 'react-native-svg';

import type { ColorName } from './text';

// Trazos copiados de docs/prototipos (viewBox 24, puntas redondeadas).
const icons = {
  check: { paths: ['M5 12.5l4.5 4.5L19 7.5'] },
  cross: { paths: ['M7 7l10 10M17 7L7 17'] },
  home: { paths: ['M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z'] },
  tests: {
    paths: ['M13 7h7M13 17h7'],
    circles: [
      [7, 7, 2.5],
      [7, 17, 2.5],
    ],
  },
  stats: { paths: ['M5 20v-8M12 20V5M19 20v-11'] },
  profile: { paths: ['M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6'], circles: [[12, 8, 4]] },
  document: { paths: ['M7 3h7l5 5v13H7z', 'M14 3v5h5M10 13h6M10 17h6'] },
} satisfies Record<string, { paths: string[]; circles?: number[][] }>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  color = 'ink',
  size = tokens.size.icon,
  strokeWidth = 2,
}: {
  name: IconName;
  color?: ColorName;
  size?: number;
  strokeWidth?: number;
}) {
  const icon: { paths: string[]; circles?: number[][] } = icons[name];
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={tokens.color[color]}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessible={false}
      importantForAccessibility="no">
      {icon.paths.map((d) => (
        <Path key={d} d={d} />
      ))}
      {icon.circles?.map(([cx, cy, r]) => (
        <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </Svg>
  );
}
