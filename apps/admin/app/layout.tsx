import { tokens } from '@aptiq/tokens';
import type { Metadata } from 'next';
import { IBM_Plex_Mono, Instrument_Sans } from 'next/font/google';
import type { CSSProperties, ReactNode } from 'react';

import { Gate } from '@/components/gate';

import './globals.css';

const ui = Instrument_Sans({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-ui' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-mono' });

export const metadata: Metadata = { title: 'Aptiq · Panel interno', robots: { index: false, follow: false } };

/** Los valores de la guía, como variables CSS: globals.css no escribe ningún color ni medida a mano. */
const vars = {
  ...Object.fromEntries(Object.entries(tokens.color).map(([k, v]) => [`--${k}`, v])),
  ...Object.fromEntries(Object.entries(tokens.radius).map(([k, v]) => [`--r-${k}`, `${v}px`])),
  ...Object.fromEntries(Object.entries(tokens.spacing).map(([k, v]) => [`--s-${k}`, `${v}px`])),
  '--b-default': `${tokens.border.default}px`,
  '--b-hairline': `${tokens.border.hairline}px`,
  '--touch': `${tokens.size.touchMin}px`,
  '--button-h': `${tokens.size.buttonHeight}px`,
  '--option-h': `${tokens.size.optionHeight}px`,
  '--bubble': `${tokens.size.bubble}px`,
  '--t-body': `${tokens.type.body.size}px`,
  '--t-caption': `${tokens.type.caption.size}px`,
  '--t-label': `${tokens.type.label.size}px`,
  '--t-title': `${tokens.type.screenTitle.size}px`,
  '--t-question': `${tokens.type.questionTitle.size}px`,
  '--t-option': `${tokens.type.optionValue.size}px`,
  '--o-divider': String(tokens.opacity.divider),
  '--o-disabled': String(tokens.opacity.disabled),
} as CSSProperties;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${ui.variable} ${mono.variable}`}>
      <body style={vars}>
        <Gate>{children}</Gate>
      </body>
    </html>
  );
}
