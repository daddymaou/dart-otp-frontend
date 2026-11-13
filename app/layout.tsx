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
