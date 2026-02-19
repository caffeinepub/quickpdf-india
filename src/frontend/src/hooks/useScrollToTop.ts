import { useEffect } from 'react';

/**
 * Custom hook that scrolls the window to the top when the component mounts.
 * Uses instant scroll on mobile devices for better UX, smooth scroll on desktop.
 */
export function useScrollToTop() {
  useEffect(() => {
    // Detect mobile devices (viewport width < 768px)
    const isMobile = window.innerWidth < 768;
    
    // Scroll to top with appropriate behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: isMobile ? 'instant' : 'smooth'
    });
  }, []);
}
