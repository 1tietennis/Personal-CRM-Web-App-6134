import React, { useEffect, useRef } from 'react';

const AccessibilityAnnouncer = () => {
  const liveRegionRef = useRef(null);

  useEffect(() => {
    // Create live region for screen reader announcements
    if (!document.getElementById('screen-reader-announcements')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'screen-reader-announcements';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(liveRegion);
      liveRegionRef.current = liveRegion;
    }

    return () => {
      // Cleanup on unmount
      const existingRegion = document.getElementById('screen-reader-announcements');
      if (existingRegion) {
        document.body.removeChild(existingRegion);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default AccessibilityAnnouncer;