import { useCallback, useRef } from 'react';

export const useAccessibility = () => {
  const announcementRef = useRef(null);

  // Screen reader announcements
  const announceToScreenReader = useCallback((message, priority = 'polite') => {
    if (!announcementRef.current) {
      // Create live region if it doesn't exist
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.id = 'screen-reader-announcements';
      document.body.appendChild(liveRegion);
      announcementRef.current = liveRegion;
    }

    // Clear previous message and announce new one
    announcementRef.current.textContent = '';
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = message;
      }
    }, 100);
  }, []);

  // Keyboard navigation handler
  const handleKeyNavigation = useCallback((event, options = {}) => {
    const {
      onEscape,
      onEnter,
      onArrowDown,
      onArrowUp,
      onArrowLeft,
      onArrowRight,
      onTab,
      onSpace
    } = options;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onEscape?.(event.target);
        break;
      
      case 'Enter':
        if (onEnter) {
          event.preventDefault();
          onEnter(event.target);
        }
        break;
      
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event.target);
        }
        break;
      
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event.target);
        }
        break;
      
      case 'ArrowLeft':
        if (onArrowLeft) {
          event.preventDefault();
          onArrowLeft(event.target);
        }
        break;
      
      case 'ArrowRight':
        if (onArrowRight) {
          event.preventDefault();
          onArrowRight(event.target);
        }
        break;
      
      case 'Tab':
        onTab?.(event.target, event.shiftKey);
        break;
      
      case ' ':
        if (onSpace) {
          event.preventDefault();
          onSpace(event.target);
        }
        break;
    }
  }, []);

  // Focus management
  const focusElement = useCallback((selector, options = {}) => {
    const { delay = 0, preventScroll = false } = options;
    
    setTimeout(() => {
      const element = typeof selector === 'string' 
        ? document.querySelector(selector)
        : selector;
      
      if (element && typeof element.focus === 'function') {
        element.focus({ preventScroll });
      }
    }, delay);
  }, []);

  // Trap focus within a container
  const trapFocus = useCallback((containerElement, event) => {
    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, []);

  return {
    announceToScreenReader,
    handleKeyNavigation,
    focusElement,
    trapFocus
  };
};