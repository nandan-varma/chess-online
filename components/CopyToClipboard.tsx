'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button'
import { toast } from 'sonner';

interface CopyToClipboardProps {
  link: string;
}

export default function CopyToClipboard({ link }: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Create full URL with current hostname
    const fullUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}${link}` 
      : link;
      
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        setCopied(true);
        toast("Link copied!", {
          description: "Share this link with a friend to play together.",
        });
        
        // Reset the copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast("Failed to copy link", {
          description: "Please try again.",
        });
      });
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <p className="mb-2 text-sm">Share this game with a friend:</p>
      <Button 
        onClick={handleCopy} 
        className={`${copied ? 'bg-green-600' : 'bg-blue-600'} text-white px-4 py-2 rounded`}
      >
        {copied ? 'Copied!' : 'Copy Game Link'}
      </Button>
    </div>
  );
}