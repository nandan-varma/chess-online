/**
 * Home page component
 * Landing page with game mode selection
 */

import { createFileRoute, Link } from '@tanstack/react-router';
import { Bot, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import HomeClientCard from './-HomeClientCard';

/**
 * Route configuration
 */
export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      {
        title: 'Chess Online - Play with Friends or AI',
      },
      {
        name: 'description',
        content:
          'Play chess online with friends or challenge the AI. Free online chess game with multiplayer support.',
      },
    ],
  }),
});

/**
 * Home page component
 */
function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8 sm:py-16">
        <div className="mx-auto max-w-md sm:max-w-4xl">
          <div className="text-center mb-8 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-4">
              Chess Online
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Play chess with friends or AI online
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-4 sm:gap-6 perspective-1000">
            {/* Play vs AI Card */}
            <Link
              to="/vs-ai"
              className="w-full max-w-[300px] transition-transform duration-300 hover:scale-105"
              style={{
                transform: 'rotate(-6deg) translateY(0.5rem)',
                zIndex: 1,
              }}
            >
              <Card className="transition-all duration-500 ease-out hover:rotate-0 hover:translate-y-0 hover:z-50 cursor-pointer h-full">
                <CardHeader>
                  <div className="mb-2">
                    <Bot className="h-10 w-10" />
                  </div>
                  <CardTitle>Play with AI</CardTitle>
                  <CardDescription>
                    Challenge the computer at various difficulty levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Game</Button>
                </CardContent>
              </Card>
            </Link>

            {/* Play with Friend Card */}
            <HomeClientCard />

            {/* Local Game Card */}
            <Link
              to="/board"
              className="w-full max-w-[300px] transition-transform duration-300 hover:scale-105"
              style={{
                transform: 'rotate(6deg) translateY(0.5rem)',
                zIndex: 1,
              }}
            >
              <Card className="transition-all duration-500 ease-out hover:rotate-0 hover:translate-y-0 hover:z-50 cursor-pointer h-full">
                <CardHeader>
                  <div className="mb-2">
                    <Clock className="h-10 w-10" />
                  </div>
                  <CardTitle>Local Game</CardTitle>
                  <CardDescription>
                    Play locally on the same device
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Game</Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        &copy; {currentYear} Nandan Varma
      </footer>
    </div>
  );
}
