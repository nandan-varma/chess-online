/**
 * Home page client-side component
 * Handles generation of random game IDs for multiplayer play
 */

'use client';

import { Link } from '@tanstack/react-router';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Generate a random game ID
 */
function generateRandomId(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(2, 10);
}

/**
 * Home page client card component
 * Creates a link to a randomly generated multiplayer game
 */
function HomeClientCard() {
  const [friendUrl, setFriendUrl] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Generate URL only on client side
    setFriendUrl('/' + generateRandomId());
    setIsHydrated(true);
  }, []);

  if (!isHydrated || !friendUrl) {
    // Show placeholder while generating
    return (
      <div
        className="w-full max-w-[300px]"
        style={{
          transform: 'rotate(0deg) translateY(0)',
          zIndex: 2,
        }}
      >
        <Card className="transition-all duration-500 ease-out hover:rotate-0 hover:translate-y-0 hover:z-50 h-full animate-pulse">
          <CardHeader>
            <div className="mb-2">
              <Users className="h-10 w-10" />
            </div>
            <CardTitle>Play with Friend</CardTitle>
            <CardDescription>Invite a friend to play online</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Loading...
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Link
      to={friendUrl}
      className="w-full max-w-[300px] transition-transform duration-300 hover:scale-105"
      style={{
        transform: 'rotate(0deg) translateY(0)',
        zIndex: 2,
      }}
    >
      <Card className="transition-all duration-500 ease-out hover:rotate-0 hover:translate-y-0 hover:z-50 cursor-pointer h-full">
        <CardHeader>
          <div className="mb-2">
            <Users className="h-10 w-10" />
          </div>
          <CardTitle>Play with Friend</CardTitle>
          <CardDescription>Invite a friend to play online</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Create Game</Button>
        </CardContent>
      </Card>
    </Link>
  );
}

export default HomeClientCard;
