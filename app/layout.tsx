import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from '@/components/providers/providers';

export const metadata: Metadata = {
  title: 'Chess Online - Play with Friends or AI',
  description:
    'Play chess online with friends or challenge the AI. Free online chess game with multiplayer support.',
  openGraph: {
    title: 'Chess Online - Play with Friends or AI',
    description:
      'Play chess online with friends or challenge the AI. Free online chess game with multiplayer support.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
