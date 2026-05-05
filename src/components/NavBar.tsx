/**
 * Navigation bar component
 * Displays top navigation with authentication state and user menu
 */

'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { auth } from '@/lib/firebase'
import { Link } from '@tanstack/react-router'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { LogOut, Menu, User as UserIcon } from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'

/**
 * Navigation bar component
 */
const NavBar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setIsLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="w-full border-b bg-card shadow-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
              Chess Online
            </Link>
          </div>

          {!isLoading && (
            <>
              {/* Desktop menu */}
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  {user ? (
                    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <UserIcon className="h-4 w-4" />
                          <span className="max-w-[150px] truncate text-sm">
                            {user.email}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button variant="ghost" size="sm">
                          Log In
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button variant="default" size="sm">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile menu */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {user ? (
                      <>
                        <DropdownMenuLabel className="text-xs">
                          {user.email}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/login" className="cursor-pointer">
                            Log In
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/signup" className="cursor-pointer">
                            Sign Up
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
