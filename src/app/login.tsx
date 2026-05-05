/**
 * Login page
 * User authentication with email and password
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
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

/**
 * Route configuration
 */
export const Route = createFileRoute('/login')({
  component: LoginPage,
  head: () => ({
    meta: [
      {
        title: 'Login - Chess Online',
      },
      {
        name: 'description',
        content: 'Sign in to your Chess Online account.',
      },
    ],
  }),
})

/**
 * Login page component
 */
function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Handle login
   */
  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Login successful!', {
        description: 'Welcome back!',
      })
      navigate({ to: '/' })
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to login. Please try again.'
      setError(errorMessage)
      toast.error('Login failed!', {
        description: errorMessage,
      })
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [email, password, navigate])

  /**
   * Handle Enter key press
   */
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleLogin()
      }
    },
    [handleLogin]
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Access your account</CardDescription>
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
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </CardFooter>
        <div className="px-6 pb-4 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  )
}
