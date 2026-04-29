'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function generateRandomId() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(2, 10);
}

export function HomeClient() {
  const [friendUrl, setFriendUrl] = useState<string>('');

  useEffect(() => {
    setFriendUrl('/' + generateRandomId());
  }, []);

  return (
    <Link
      href={friendUrl || '#'}
      className="w-full max-w-[300px]"
      style={{ transform: 'rotate(0deg) translateY(0)', zIndex: 2 }}
    >
      <Card className="transition-all duration-500 ease-out hover:rotate-0 hover:translate-y-0 hover:z-50 hover:scale-105 cursor-pointer">
        <CardHeader>
          <div className="mb-2">
            <Users className="h-10 w-10" />
          </div>
          <CardTitle>Play with Friend</CardTitle>
          <CardDescription>Invite a friend to play online</CardDescription>
        </CardHeader>
        <CardContent>
          {friendUrl && <Button className="w-full">Create Game</Button>}
        </CardContent>
      </Card>
    </Link>
  );
}
