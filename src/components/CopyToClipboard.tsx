'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface CopyToClipboardProps {
  link: string;
}

export default function CopyToClipboard({ link }: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullUrl =
      typeof window !== 'undefined' ? `${window.location.origin}${link}` : link;

    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        setCopied(true);
        toast('Link copied!', {
          description: 'Share this link with a friend to play together.',
        });

        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        toast('Failed to copy link', {
          description: 'Please try again.',
        });
      });
  };

  return (
    <Button
      onClick={handleCopy}
      variant={copied ? 'secondary' : 'default'}
      className="w-full max-w-[200px]"
    >
      {copied ? 'Copied!' : 'Copy Game Link'}
    </Button>
  );
}
