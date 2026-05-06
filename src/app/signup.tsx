/**
 * Signup page
 * User registration with email and password
 */

'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { auth } from '@/lib/firebase'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

/**
 * Route configuration
 */
export const Route = createFileRoute('/signup')({
  component: SignupPage,
  head: () => ({
    meta: [
      {
        title: 'Sign Up - Chess Online',
      },
      {
        name: 'description',
        content: 'Create a new Chess Online account.',
      },
    ],
  }),
})

/**
 * Signup page component
 */
function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Handle signup
   */
  const handleSignup = useCallback(async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      toast.success('Account created!', {
        description: 'Welcome to Chess Online!',
      })
      navigate({ to: '/' })
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to create account. Please try again.'
      setError(errorMessage)
      toast.error('Signup failed!', {
        description: errorMessage,
      })
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [email, password, confirmPassword, navigate])

  /**
   * Handle Enter key press
   */
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSignup()
      }
    },
    [handleSignup]
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                type="password"
                id="confirm-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError(null)
                }}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-2 rounded">
                {error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Link to="/">
            <Button variant="ghost" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button onClick={handleSignup} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Sign Up'}
          </Button>
        </CardFooter>
        <div className="px-6 pb-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium hover:underline">
            Log in
          </Link>
        </div>
      </Card>
    </div>
  )
}
