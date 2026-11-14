import type { Metadata } from 'next';
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  display: 'swap',
  subsets: ['latin'],
  weight: ['700', '800'],
});

const dmSans = DM_Sans({
  variable: '--font-dmsans',
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  display: 'swap',
  subsets: ['latin'],
  weight: ['500', '700'],
});

export const metadata: Metadata = {
  title: 'Dart-OTP',
  description: 'Send one-time passcodes through Telegram',
  icons: {
    icon: [
      { url: '/assets/brand/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/assets/brand/favicon-32.png',
    apple: '/assets/brand/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${dmSans.variable} ${jetbrains.variable}`}>
        {children}
      </body>
    </html>
  );
}
