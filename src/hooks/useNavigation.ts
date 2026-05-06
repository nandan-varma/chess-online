/**
 * Navigation hook
 * Provides navigation state and utilities
 */

import { useLocation, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { getRouteMetadata, generateBreadcrumbs } from '@/lib/navigation';

/**
 * useNavigation hook - Manage navigation state and utilities
 */
export function useNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  const metadata = getRouteMetadata(currentPath);
  const breadcrumbs = generateBreadcrumbs(currentPath);

  const goBack = useCallback(() => {
    if (metadata.backRoute) {
      navigate({ to: metadata.backRoute });
    } else {
      window.history.back();
    }
  }, [metadata.backRoute, navigate]);

  const goHome = useCallback(() => {
    navigate({ to: '/' });
  }, [navigate]);

  return {
    currentPath,
    metadata,
    breadcrumbs,
    goBack,
    goHome,
  };
}
