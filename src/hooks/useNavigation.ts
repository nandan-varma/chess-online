import { useLocation, useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import { generateBreadcrumbs, getRouteMetadata } from '@/lib/navigation';

export function useNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const metadata = useMemo(() => getRouteMetadata(currentPath), [currentPath]);
  const breadcrumbs = useMemo(
    () => generateBreadcrumbs(currentPath),
    [currentPath]
  );

  const goBack = useCallback(() => {
    if (metadata.backRoute) {
      navigate({ to: metadata.backRoute });
    } else {
      window.history.back();
    }
  }, [metadata.backRoute, navigate]);

  const goHome = useCallback(() => navigate({ to: '/' }), [navigate]);

  return { currentPath, metadata, breadcrumbs, goBack, goHome };
}
