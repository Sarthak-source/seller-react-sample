import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for navigation using React Router's useNavigate.
 *
 * @returns {Object} Router object with navigation methods.
 */
export function useRouter() {
  const navigate = useNavigate();

  // Memoize the router object to optimize performance
  const router = useMemo(
    () => ({
      /**
       * Navigate back in history.
       */
      back: () => navigate(-1),

      /**
       * Navigate forward in history.
       */
      forward: () => navigate(1),

      /**
       * Reload the current page.
       */
      reload: () => window.location.reload(),

      /**
       * Push a new entry onto the history stack.
       *
       * @param {string} href - The path to navigate to.
       */
      push: (href) => navigate(href),

      /**
       * Replace the current entry on the history stack.
       *
       * @param {string} href - The path to navigate to.
       */
      replace: (href) => navigate(href, { replace: true }),
    }),
    [navigate]
  );

  return router;
}
