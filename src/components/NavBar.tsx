/**
 * Enhanced Navigation Bar component
 * Displays navigation with breadcrumbs, back button, and user menu
 * Uses brand colors and design system components throughout
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
  Zap,
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
 * Shows navigation hierarchy with brand styling
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
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
          )}
          <Link
            to={item.href}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-muted-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200 font-medium"
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
 * Uses brand colors and design system components throughout
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
    <nav className="sticky top-0 z-40 w-full bg-gradient-to-r from-background to-background/95 border-b border-border/50 shadow-card backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                className="h-10 w-10 shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10 active:bg-primary/20"
                title="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 group"
            >
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-3d-sm group-hover:shadow-3d transition-all duration-200 active:shadow-sm">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hidden sm:inline">
                Chess Online
              </span>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent sm:hidden">
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
                      <div className="flex items-center gap-1 border-r border-border/50 pr-3 mr-2">
                        {gameRoutes.map((route, index) => (
                          <Link key={route.to} to={route.to}>
                            <Button
                              variant={
                                currentPath === route.to
                                  ? 'default'
                                  : 'ghost'
                              }
                              size="sm"
                              className="text-xs sm:text-sm gap-1.5 group"
                              title={route.description}
                            >
                              {index === 0 ? (
                                <Home className="h-3.5 w-3.5" />
                              ) : (
                                <Zap className="h-3.5 w-3.5" />
                              )}
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
                          className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          <div className="p-1 rounded-md bg-primary/10 text-primary">
                            <UserIcon className="h-4 w-4" />
                          </div>
                          <span className="max-w-[150px] truncate text-sm hidden sm:inline">
                            {user.email}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 shadow-3d-lg border-border/50">
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                          Signed in as
                        </DropdownMenuLabel>
                        <DropdownMenuLabel className="text-sm font-semibold text-primary truncate">
                          {user.email}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuLabel className="text-xs font-semibold text-primary py-1 flex items-center gap-1">
                          <Gamepad2 className="h-3 w-3" />
                          GAMES
                        </DropdownMenuLabel>
                        {gameRoutes.map((route) => (
                          <DropdownMenuItem key={route.to} asChild className="cursor-pointer text-muted-foreground hover:text-primary hover:bg-primary/5">
                            <Link to={route.to} className="flex items-center gap-2">
                              {gameRoutes.indexOf(route) === 0 ? (
                                <Home className="h-3.5 w-3.5" />
                              ) : (
                                <Zap className="h-3.5 w-3.5" />
                              )}
                              {route.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/5">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button size="sm" className="gap-1.5 shadow-3d-sm hover:shadow-sm">
                        <Zap className="h-4 w-4" />
                        <span>Sign Up</span>
                      </Button>
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
                      className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 shadow-3d-lg border-border/50">
                    {user ? (
                      <>
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                          Signed in as
                        </DropdownMenuLabel>
                        <DropdownMenuLabel className="text-sm font-semibold text-primary truncate">
                          {user.email}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuLabel className="text-xs font-semibold text-primary py-1 flex items-center gap-1">
                          <Gamepad2 className="h-3 w-3" />
                          GAMES
                        </DropdownMenuLabel>
                        {gameRoutes.map((route) => (
                          <DropdownMenuItem
                            key={route.to}
                            asChild
                            className="cursor-pointer text-muted-foreground hover:text-primary hover:bg-primary/5"
                          >
                            <Link to={route.to} className="flex items-center gap-2">
                              {gameRoutes.indexOf(route) === 0 ? (
                                <Home className="h-3.5 w-3.5" />
                              ) : (
                                <Zap className="h-3.5 w-3.5" />
                              )}
                              {route.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/5">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuLabel className="text-xs font-semibold text-primary py-1 flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          ACCOUNT
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild className="cursor-pointer text-muted-foreground hover:text-primary hover:bg-primary/5">
                          <Link to="/login" className="flex items-center gap-2">
                            <Home className="h-3.5 w-3.5" />
                            Log In
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer text-muted-foreground hover:text-primary hover:bg-primary/5">
                          <Link to="/signup" className="flex items-center gap-2">
                            <Zap className="h-3.5 w-3.5" />
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
        <div className="md:hidden -mx-4 px-4 py-3 border-t border-border/50 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <Home className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary truncate">
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
