import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, Users, Clock } from "lucide-react";

function generateRandomId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, "").substr(2, 10);
}

const Index = () => {
  const [friendUrl, setFriendUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFriendUrl("/" + generateRandomId());
    setMounted(true);
  }, []);

  const cardBase = "w-full max-w-[300px] relative transition-all duration-500 ease-out hover:rotate-0 hover:translate-y-0 hover:z-50 hover:scale-105 cursor-pointer";

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
            <Link href="/vsAI" className={`${cardBase} ${mounted ? 'animate-card-left' : ''}`}
              style={{ transform: 'rotate(-6deg) translateY(0.5rem)', zIndex: 1 }}>
              <Card>
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

            <Link href={friendUrl || "#"} className={`${cardBase} ${mounted ? 'animate-card-center' : ''}`}
              style={{ transform: 'rotate(0deg) translateY(0)', zIndex: 2 }}>
              <Card>
                <CardHeader>
                  <div className="mb-2">
                    <Users className="h-10 w-10" />
                  </div>
                  <CardTitle>Play with Friend</CardTitle>
                  <CardDescription>
                    Invite a friend to play online
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {friendUrl && (
                    <Button className="w-full">Create Game</Button>
                  )}
                </CardContent>
              </Card>
            </Link>

            <Link href="/board" className={`${cardBase} ${mounted ? 'animate-card-right' : ''}`}
              style={{ transform: 'rotate(6deg) translateY(0.5rem)', zIndex: 1 }}>
              <Card>
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
};

export default Index;