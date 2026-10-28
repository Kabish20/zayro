import { useState, useEffect } from 'react';

/**
 * Hook to track whether the window has been scrolled past a given vertical threshold.
 * @param {number} threshold Pixel threshold to trigger scroll state (default: 400)
 * @returns {{ isScrolled: boolean, scrollToTop: () => void }}
 */
export function useScrollPosition(threshold = 400) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { isScrolled, scrollToTop };
}

