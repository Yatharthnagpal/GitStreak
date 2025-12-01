import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'GitStreak — Precision GitHub Contribution Engine',
  description: 'GitStreak is a state-of-the-art GitHub contribution engine and activity scheduler featuring real-time heatmap preview, time jitter realism, and OAuth authentication.',
  icons: {
    icon: [
      { url: '/gitpulse_logo.png', type: 'image/png' },
    ],
    shortcut: '/gitpulse_logo.png',
    apple: '/gitpulse_logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="cyan">
      <head>
        <link rel="icon" type="image/png" href="/gitpulse_logo.png" />
        <link rel="shortcut icon" href="/gitpulse_logo.png" />
        <link rel="apple-touch-icon" href="/gitpulse_logo.png" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
