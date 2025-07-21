(function () {
  // CSS style for highlighting focused element with enhanced visuals
  const style = document.createElement('style');
  style.textContent = `
    .tv-focus {
      outline: 4px solid #00ffff;
      outline-offset: -4px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
      background-color: rgba(0, 255, 255, 0.1);
      transition: all 0.2s ease-in-out;
      z-index: 10;
      position: relative;
    }
    .navigable-excluded {
      outline: none !important;
    }
    .focus-tooltip {
      position: absolute;
      background: #333;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 12px;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
    }
  `;
  document.head.appendChild(style);

  // Configurable options
  const config = {
    navigableSelector: 'button, input, [tabindex="0"], .navigable',
    excludeSelector: '.navigable-exclude',
    useSpatialNavigation: true,
    tooltipEnabled: true
  };

  // Cache for navigable elements
  let navigableElementsCache = [];
  let focusIndex = 0;

  // Helper: get all navigable elements with dynamic updates
  function updateNavigableElements() {
    navigableElementsCache = Array.from(document.querySelectorAll(config.navigableSelector))
      .filter(el => el.offsetParent !== null && !el.matches(config.excludeSelector));
    return navigableElementsCache;
  }

  // Spatial navigation helper
  function getClosestElement(currentEl, direction) {
    const elements = updateNavigableElements();
    if (!currentEl || elements.length === 0) return elements[0] || null;

    const currentRect = currentEl.getBoundingClientRect();
    let closestEl = null;
    let minDistance = Infinity;

    elements.forEach(el => {
      if (el === currentEl) return;
      const rect = el.getBoundingClientRect();
      let distance = 0;

      switch (direction) {
        case 'ArrowUp':
          if (rect.bottom <= currentRect.top) {
            distance = Math.hypot(rect.left - currentRect.left, rect.top - currentRect.top);
            if (distance < minDistance) {
              minDistance = distance;
              closestEl = el;
            }
          }
          break;
        case 'ArrowDown':
          if (rect.top >= currentRect.bottom) {
            distance = Math.hypot(rect.left - currentRect.left, rect.top - currentRect.top);
            if (distance < minDistance) {
              minDistance = distance;
              closestEl = el;
            }
          }
          break;
        case 'ArrowLeft':
          if (rect.right <= currentRect.left) {
            distance = Math.hypot(rect.left - currentRect.left, rect.top - currentRect.top);
            if (distance < minDistance) {
              minDistance = distance;
              closestEl = el;
            }
          }
          break;
        case 'ArrowRight':
          if (rect.left >= currentRect.right) {
            distance = Math.hypot(rect.left - currentRect.left, rect.top - currentRect.top);
            if (distance < minDistance) {
              minDistance = distance;
              closestEl = el;
            }
          }
          break;
      }
    });

    return closestEl || currentEl;
  }

  // Focus an element with visual and accessibility enhancements
  function focusElement(indexOrEl) {
    const elements = updateNavigableElements();
    if (elements.length === 0) return;

    let targetEl;
    if (typeof indexOrEl === 'number') {
      let index = indexOrEl;
      if (index < 0) index = elements.length - 1;
      if (index >= elements.length) index = 0;
      targetEl = elements[index];
      focusIndex = index;
    } else {
      targetEl = indexOrEl;
      focusIndex = elements.indexOf(targetEl);
    }

    // Remove highlight and tooltips from all
    elements.forEach(el => {
      el.classList.remove('tv-focus');
      const tooltip = el.querySelector('.focus-tooltip');
      if (tooltip) tooltip.remove();
    });

    // Apply focus and highlight
    targetEl.focus();
    targetEl.classList.add('tv-focus');

    // Accessibility: Announce to screen readers
    targetEl.setAttribute('aria-live', 'polite');
    targetEl.setAttribute('aria-label', targetEl.textContent.trim() || 'Focused element');

    // Add tooltip if enabled
    if (config.tooltipEnabled && targetEl.textContent.trim()) {
      const tooltip = document.createElement('span');
      tooltip.className = 'focus-tooltip';
      tooltip.textContent = targetEl.textContent.trim();
      targetEl.appendChild(tooltip);
      requestAnimationFrame(() => tooltip.style.opacity = '1');
    }
  }

  // Keyboard event handler with extended key support
  document.addEventListener('keydown', function (e) {
    const key = e.key;
    const elements = updateNavigableElements();
    if (elements.length === 0) return;

    const currentEl = elements[focusIndex];
    let nextIndex;

    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        if (config.useSpatialNavigation) {
          const nextEl = getClosestElement(currentEl, key);
          focusElement(nextEl);
        } else {
          nextIndex = (focusIndex + 1) % elements.length;
          focusElement(nextIndex);
        }
        e.preventDefault();
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        if (config.useSpatialNavigation) {
          const nextEl = getClosestElement(currentEl, key);
          focusElement(nextEl);
        } else {
          nextIndex = (focusIndex - 1 + elements.length) % elements.length;
          focusElement(nextIndex);
        }
        e.preventDefault();
        break;

      case 'Home':
        focusElement(0);
        e.preventDefault();
        break;

      case 'End':
        focusElement(elements.length - 1);
        e.preventDefault();
        break;

      case 'Enter':
        currentEl.click(); // Activate focused element
        e.preventDefault();
        break;

      case 'Escape':
      case 'Backspace':
        window.history.back();
        e.preventDefault();
        break;
    }
  });

  // Handle dynamic content changes
  const observer = new MutationObserver(() => {
    updateNavigableElements();
    if (!document.activeElement || !navigableElementsCache.includes(document.activeElement)) {
      focusElement(0); // Reset focus if lost
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial focus on load
  window.addEventListener('load', () => {
    setTimeout(() => focusElement(0), 100);
  });

  // Debugging: Log focus changes (optional)
  // window.addEventListener('focusin', (e) => console.log('Focus moved to:', e.target));
})();
