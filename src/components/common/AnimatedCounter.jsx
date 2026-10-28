import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter component for luxury stat number animation
 * Automatically parses numbers like "45+", "250k+", "38%", "18-22"
 * and smoothly animates from 0 using an ease-out curve upon entering viewport.
 */
export default function AnimatedCounter({ 
  value, 
  duration = 2000, 
  className = '', 
  prefix = '', 
  suffix = '',
  decimals = 0 
}) {
  const isParsable = typeof value === 'number' || (typeof value === 'string' && /\d/.test(value));
  const [displayValue, setDisplayValue] = useState(() => (isParsable ? '0' : String(value)));
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Parse value if string is provided
    let startVal = 0;
    let endVal = 0;
    let autoSuffix = suffix;
    let autoPrefix = prefix;
    let isRange = false;
    let rangeStartEnd = [0, 0];

    if (typeof value === 'number') {
      endVal = value;
    } else if (typeof value === 'string') {
      const trimmed = value.trim();

      // Check for range like "18-22"
      const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)(.*)$/);
      if (rangeMatch) {
        isRange = true;
        rangeStartEnd = [parseInt(rangeMatch[1], 10), parseInt(rangeMatch[2], 10)];
        autoSuffix = (rangeMatch[3] || '') + suffix;
      } else {
        // Match prefix, number, suffix e.g. "₹99", "250k+", "45+", "38%"
        const match = trimmed.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
        if (match) {
          if (!prefix && match[1]) autoPrefix = match[1];
          const rawNum = match[2].replace(/,/g, '');
          endVal = parseFloat(rawNum) || 0;
          if (!suffix && match[3]) autoSuffix = match[3];
        } else {
          return;
        }
      }
    }

    const startAnimation = () => {
      let startTime = null;
      let animationFrameId = null;

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);

        if (isRange) {
          const current1 = Math.round(rangeStartEnd[0] * easedProgress);
          const current2 = Math.round(rangeStartEnd[1] * easedProgress);
          setDisplayValue(`${autoPrefix}${current1}-${current2}${autoSuffix}`);
        } else {
          const current = startVal + (endVal - startVal) * easedProgress;
          const formattedNumber = decimals > 0 
            ? current.toFixed(decimals) 
            : Math.round(current).toString();
          setDisplayValue(`${autoPrefix}${formattedNumber}${autoSuffix}`);
        }

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setHasAnimated(true);
        }
      };

      animationFrameId = requestAnimationFrame(step);

      return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };
    };

    // Use IntersectionObserver to animate when scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    const currentElem = elementRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    } else {
      // Fallback
      startAnimation();
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
      observer.disconnect();
    };
  }, [value, duration, prefix, suffix, decimals, hasAnimated]);

  return (
    <span 
      ref={elementRef} 
      className={`font-sans inline-block tabular-nums transition-transform duration-300 ${
        hasAnimated ? 'scale-100' : 'scale-95'
      } ${className}`}
    >
      {displayValue}
    </span>
  );
}
