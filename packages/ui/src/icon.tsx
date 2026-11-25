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
  chevron: { paths: ['M9 6l6 6-6 6'] },
  external: {
    paths: ['M14 4h6v6M20 4l-9 9', 'M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'],
  },
  history: { paths: ['M12 7.5V12l3 2'], circles: [[12, 12, 8.5]] },
  back: { paths: ['M15 6l-6 6 6 6'] },
  lock: {
    paths: [
      'M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z',
      'M8 11V8a4 4 0 0 1 8 0v3',
    ],
  },
  clock: { paths: ['M12 9v4l2.5 2M9.5 3h5'], circles: [[12, 13, 8]] },
  info: { paths: ['M12 11v5', 'M12 7.6v.01'], circles: [[12, 12, 9]] },
  flag: { paths: ['M6 21V4', 'M6 4h11l-2.5 4L17 12H6'] },
  grid: { paths: ['M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z'] },
  // Cuenta v2 (prototipo cuenta-v2.html).
  bell: { paths: ['M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z', 'M10 20a2 2 0 0 0 4 0'] },
  sound: { paths: ['M4 10v4h4l5 4V6L8 10z', 'M16.5 9a4 4 0 0 1 0 6'] },
  calendar: {
    paths: [
      'M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
      'M4 10h16M9 3v4M15 3v4',
    ],
  },
  cloud: { paths: ['M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z'] },
  logout: { paths: ['M10 4H5v16h5', 'M14 8l4 4-4 4M18 12H9'] },
  help: {
    paths: ['M9.5 9.5a2.5 2.5 0 0 1 5 .5c0 1.5-2.5 2-2.5 3.5M12 17v.01'],
    circles: [[12, 12, 9]],
  },
  mail: {
    paths: [
      'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
      'M3 7l9 6 9-6',
    ],
  },
  eye: { paths: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z'], circles: [[12, 12, 3]] },
  star: { paths: ['M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'] },
  trash: { paths: ['M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13'] },
  refresh: {
    paths: [
      'M20 11a8 8 0 0 0-14.5-4.5L4 8',
      'M4 4v4h4',
      'M4 13a8 8 0 0 0 14.5 4.5L20 16',
      'M20 20v-4h-4',
    ],
  },
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
      importantForAccessibility="no"
    >
      {icon.paths.map((d) => (
        <Path key={d} d={d} />
      ))}
      {icon.circles?.map(([cx, cy, r]) => (
        <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </Svg>
  );
}
