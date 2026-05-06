/**
 * Enhanced Navigation Bar component
 * Displays navigation with breadcrumbs, back button, and user menu
 */

'use client';

import { Link, useNavigate } from '@tanstack/react-router';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  ArrowLeft,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  Gamepad2,
  User as UserIcon,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { auth } from '@/lib/firebase';
import { useNavigation } from '@/hooks/useNavigation';
import { getGameRoutes } from '@/lib/navigation';

/**
 * Navigation breadcrumb component
 */
function Breadcrumbs({
  items,
}: {
  items: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          <Link
            to={item.href}
            className="hover:text-foreground transition-colors"
          >
            {item.label}
          </Link>
        </div>
      ))}
    </div>
  );
}

/**
 * Enhanced navigation bar component
 */
const NavBar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { currentPath, metadata, breadcrumbs, goBack } = useNavigation();

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate({ to: '/' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const gameRoutes = getGameRoutes();
  const showBackButton = metadata.showBackButton && currentPath !== '/';
  const isAuthPage = currentPath === '/login' || currentPath === '/signup';
  const isGamePage = currentPath.startsWith('/board') || currentPath.startsWith('/vs-ai');

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main nav row */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left section - Logo and back button */}
          <div className="flex items-center gap-3 min-w-0">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                className="h-10 w-10 shrink-0"
                title="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
            >
              <Gamepad2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight hidden sm:inline">
                Chess Online
              </span>
              <span className="text-lg font-bold tracking-tight sm:hidden">
                Chess
              </span>
            </Link>
          </div>

          {/* Center section - Breadcrumbs (desktop only) */}
          {!isAuthPage && breadcrumbs.length > 1 && (
            <div className="hidden md:flex flex-1 justify-center px-4">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}

          {/* Right section - Auth and menu */}
          {!isLoading && (
            <>
              {/* Desktop menu */}
              <div className="hidden md:flex items-center gap-2">
                {user ? (
                  <>
                    {/* Game links for authenticated users */}
                    {!isGamePage && (
                      <div className="flex items-center gap-1 border-r pr-2 mr-2">
                        {gameRoutes.map((route) => (
                          <Link key={route.to} to={route.to}>
                            <Button
                              variant={
                                currentPath === route.to
                                  ? 'default'
                                  : 'ghost'
                              }
                              size="sm"
                              className="text-xs sm:text-sm"
                              title={route.description}
                            >
                              {route.label}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* User menu */}
                    <DropdownMenu
                      open={isMenuOpen}
                      onOpenChange={setIsMenuOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                        >
                          <UserIcon className="h-4 w-4" />
                          <span className="max-w-[150px] truncate text-sm hidden sm:inline">
                            {user.email}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                          Signed in as
                        </DropdownMenuLabel>
                        <DropdownMenuLabel className="text-sm font-semibold truncate">
                          {user.email}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground py-1">
                          GAMES
                        </DropdownMenuLabel>
                        {gameRoutes.map((route) => (
                          <DropdownMenuItem key={route.to} asChild>
                            <Link to={route.to} className="cursor-pointer">
                              {route.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login">
                      <Button variant="ghost" size="sm">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button size="sm">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu */}
              <div className="md:hidden">
                <DropdownMenu
                  open={isMobileMenuOpen}
                  onOpenChange={setIsMobileMenuOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {user ? (
                      <>
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                          Signed in as
                        </DropdownMenuLabel>
                        <DropdownMenuLabel className="text-sm font-semibold truncate">
                          {user.email}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground py-1">
                          GAMES
                        </DropdownMenuLabel>
                        {gameRoutes.map((route) => (
                          <DropdownMenuItem
                            key={route.to}
                            asChild
                            className="cursor-pointer"
                          >
                            <Link to={route.to}>
                              {route.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground py-1">
                          ACCOUNT
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link to="/login">
                            Log In
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link to="/signup">
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

        {/* Page title row (mobile only) */}
        <div className="md:hidden -mx-4 px-4 py-2 border-t bg-muted/30">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {metadata.title}
              </p>
              {metadata.description && (
                <p className="text-xs text-muted-foreground truncate">
                  {metadata.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
