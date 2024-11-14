'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CopyToClipboard({ link = '/' }: { link?: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${link}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="flex w-full max-w-sm items-center space-x-2 p-4">
      <Input
        type="text"
        value={link}
        readOnly
        className="flex-grow"
      />
      <Button
        onClick={copyToClipboard}
        variant="outline"
        size="icon"
        className="flex-shrink-0"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-black" />
        )}
      </Button>
    </div>
  )
}