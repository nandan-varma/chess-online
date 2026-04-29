import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bot, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { HomeClient } from './home-client';

export default function Home() {
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
            <Link
              href="/vs-ai"
              className="w-full max-w-[300px]"
              style={{
                transform: 'rotate(-6deg) translateY(0.5rem)',
                zIndex: 1,
              }}
            >
              <Card className="transition-all duration-500 ease-out hover:rotate-0 hover:translate-y-0 hover:z-50 hover:scale-105 cursor-pointer">
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

            <HomeClient />

            <Link
              href="/board"
              className="w-full max-w-[300px]"
              style={{
                transform: 'rotate(6deg) translateY(0.5rem)',
                zIndex: 1,
              }}
            >
              <Card className="transition-all duration-500 ease-out hover:rotate-0 hover:translate-y-0 hover:z-50 hover:scale-105 cursor-pointer">
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

      <footer className="py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Nandan Varma
      </footer>
    </div>
  );
}
