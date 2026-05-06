/**
 * Navigation utilities and configuration
 * Provides helper functions and route metadata for navigation
 */

export const NAVIGATION_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  BOARD: '/board',
  VS_AI: '/vs-ai',
} as const;

export interface RouteMetadata {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backRoute?: string;
  category?: 'auth' | 'game' | 'home';
}

/**
 * Route metadata for breadcrumbs and navigation
 */
export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  '/': {
    title: 'Home',
    description: 'Play chess online',
    category: 'home',
  },
  '/login': {
    title: 'Log In',
    description: 'Sign in to your account',
    showBackButton: true,
    backRoute: '/',
    category: 'auth',
  },
  '/signup': {
    title: 'Sign Up',
    description: 'Create a new account',
    showBackButton: true,
    backRoute: '/',
    category: 'auth',
  },
  '/board': {
    title: 'Local Game',
    description: 'Play locally with a friend',
    showBackButton: true,
    backRoute: '/',
    category: 'game',
  },
  '/vs-ai': {
    title: 'Play with AI',
    description: 'Challenge the computer',
    showBackButton: true,
    backRoute: '/',
    category: 'game',
  },
};

/**
 * Get route metadata for a given path
 */
export function getRouteMetadata(path: string): RouteMetadata {
  // Handle dynamic routes like /game-id
  if (path.startsWith('/') && path !== '/' && !Object.keys(ROUTE_METADATA).includes(path)) {
    return {
      title: 'Multiplayer Game',
      description: 'Play with a friend online',
      showBackButton: true,
      backRoute: '/',
      category: 'game',
    };
  }

  return (
    ROUTE_METADATA[path] || {
      title: 'Chess Online',
      showBackButton: true,
      backRoute: '/',
    }
  );
}

/**
 * Get game routes for authenticated users
 */
export function getGameRoutes() {
  return [
    {
      label: 'Local Game',
      to: NAVIGATION_ROUTES.BOARD,
      description: 'Play with a friend on same device',
    },
    {
      label: 'Play AI',
      to: NAVIGATION_ROUTES.VS_AI,
      description: 'Challenge the computer',
    },
  ];
}

/**
 * Parse pathname to get breadcrumb items
 */
export function generateBreadcrumbs(pathname: string): Array<{ label: string; href: string }> {
  if (pathname === '/') {
    return [{ label: 'Home', href: '/' }];
  }

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; href: string }> = [
    { label: 'Home', href: '/' },
  ];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const metadata = getRouteMetadata(currentPath);
    breadcrumbs.push({ label: metadata.title, href: currentPath });
  }

  return breadcrumbs;
}
