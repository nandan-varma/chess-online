export interface RouteMetadata {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backRoute?: string;
  category?: 'auth' | 'game' | 'home';
}

const ROUTE_METADATA: Record<string, RouteMetadata> = {
  '/': { title: 'Home', description: 'Play chess online', category: 'home' },
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

export function getRouteMetadata(path: string): RouteMetadata {
  if (ROUTE_METADATA[path]) return ROUTE_METADATA[path];
  if (path !== '/') {
    return {
      title: 'Multiplayer Game',
      description: 'Play with a friend online',
      showBackButton: true,
      backRoute: '/',
      category: 'game',
    };
  }
  return { title: 'Chess Online', showBackButton: true, backRoute: '/' };
}

export function generateBreadcrumbs(
  pathname: string
): Array<{ label: string; href: string }> {
  if (pathname === '/') return [{ label: 'Home', href: '/' }];

  const breadcrumbs: Array<{ label: string; href: string }> = [
    { label: 'Home', href: '/' },
  ];
  let currentPath = '';
  for (const segment of pathname.split('/').filter(Boolean)) {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      label: getRouteMetadata(currentPath).title,
      href: currentPath,
    });
  }
  return breadcrumbs;
}
