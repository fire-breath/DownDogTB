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
  `;
  document.head.appendChild(style);

  // Configurable options
  const config = {
    navigableSelector: 'button, input, [tabindex="0"], .navigable',
    excludeSelector: '.navigable-exclude',
    useSpatialNavigation: true,
  };

  // Cache for navigable elements
  let navigableElementsCache = [];
  let focusIndex = 0;
  
  // Helper: get all navigable elements with dynamic updates
  function updateNavigableElements() {
	  		const thumbsUp = document.querySelector('img[src*="thumbs_up"]');
		const thumbsDown = document.querySelector('img[src*="thumbs_down"]');
		
		if (thumbsUp) {
		  thumbsUp.style.display = "flex";
		  thumbsUp.setAttribute('aria-hidden', 'false');
		}
		
		if (thumbsDown) {
		  thumbsDown.style.display = "flex";
		  thumbsDown.setAttribute('aria-hidden', 'false');
		}
	                document.querySelectorAll('[style*="display: flex"], [style*="display: table"], [style*="opacity: 1"], [aria-hidden="false"], [style*="margin-top: 15px"]').forEach(el => {

				 if (el.style.opacity === '1' && el.style.display === 'flex' && el.style.width === '160px') {
                    	el.style.display = 'none';
                    	el.style.opacity = '0';
 }
	    if (el.innerText === 'or' && 
        el.style.marginTop === '15px' && 
        el.style.marginBottom === '15px') {
        el.innerText = '';
    }
              });
	  
    if (([...document.querySelectorAll('span')].find(el => el.textContent.trim() === 'Resume Practice')?.textContent.trim() === 'Resume Practice')||([...document.querySelectorAll('button')].find(el => el.textContent.trim() === 'OK')?.textContent.trim() === 'OK')||([...document.querySelectorAll('button')].find(el => el.textContent.trim() === 'RESET')?.textContent.trim() === 'RESET')) {
      navigableElementsCache = Array.from(document.querySelectorAll(config.navigableSelector))
        .filter(el => el.offsetParent !== null && !el.matches(config.excludeSelector) && ((el.innerText.toLowerCase() == 'no'|| el.innerText.toLowerCase() == 'yes' )||((el.innerText.toLowerCase() == 'ok') || (el.innerText.toLowerCase() == 'cancel'))||(el.innerText.toLowerCase() == 'try again' ||el.innerText.toLowerCase() == 'reset' )));
    }
    else {
      navigableElementsCache = Array.from(document.querySelectorAll(config.navigableSelector))
        .filter(el => el.offsetParent !== null && !el.matches(config.excludeSelector));
    }
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
                                  
document.querySelectorAll('[style*="display: flex"], [style*="opacity: 1"], [style*="margin-top: 15px"]').forEach(el => {
 if (el.style.opacity === '1' && el.style.display === 'flex' && el.style.width === '160px') {
                    	el.style.display = 'none';
                    	el.style.opacity = '0';
 }
	    if (el.innerText === 'or' && 
        el.style.marginTop === '15px' && 
        el.style.marginBottom === '15px') {
        el.innerText = '';
    }
});
       if (closestEl) {
		const thumbsUp = document.querySelector('img[src*="thumbs_up"]');
		const thumbsDown = document.querySelector('img[src*="thumbs_down"]');
		
		if (thumbsUp) {
		  thumbsUp.style.display = "flex";
		  thumbsUp.setAttribute('aria-hidden', 'false');
		}
		
		if (thumbsDown) {
		  thumbsDown.style.display = "flex";
		  thumbsDown.setAttribute('aria-hidden', 'false');
		}
              return closestEl;
          } 
              else if (direction === 'ArrowRight' && currentEl.innerText.toLowerCase().trim() !== 'yes' && !document.querySelector('img[src*="//media.downdogapp.com/asset/play_icon_9b1d81d5"]')) {
              // Special case for ArrowRight: Check for a "SELECT" button
              const selectButton = [...document.querySelectorAll('button')]
                .find(el => el.offsetParent !== null && ['select','start'].includes(el.innerText.toLowerCase().trim()));
              return selectButton || currentEl;
          }
		      if (currentEl.src.toLowerCase().includes('skip_icon')){
document.querySelectorAll('[style*="opacity: 1"], [aria-hidden="false"]').forEach(el => {
			      		
			document.querySelector('img[src*="thumbs_down"]').style.bottom === "10px"
			document.querySelector('img[src*="thumbs_up"]').style.bottom === "10px"
                    if (el.getAttribute('aria-hidden') === 'false' && el.style.opacity === '1' && el.style.paddingBottom === '10px') {
                    	el.style.display = 'none';
                    	el.style.opacity = '0';
                    	el.setAttribute('aria-hidden', 'true');
                    }
                    else if (el.getAttribute('aria-hidden') === 'false' && el.style.opacity === '1' && el.style.display === 'table' && el.style.width === '100%' && el.style.height === '40px') {
                    	el.style.display = 'none';
                    	el.style.opacity = '0';
                    	el.setAttribute('aria-hidden', 'true');
                    }
                    else if (el.getAttribute('aria-hidden') === 'false' && el.style.opacity === '1' && el.style.width === '100vw' && el.style.height === '93px') {
                    	el.style.display = 'none';
                    	el.style.opacity = '0';
                    	el.setAttribute('aria-hidden', 'true');
                    }
                    else if (el.getAttribute('aria-hidden') === 'false' && el.style.opacity === '1' && el.style.display === 'flex' && el.style.height === '91px') {
                    	el.style.display = 'none';
                    	el.style.opacity = '0';
                    	el.setAttribute('aria-hidden', 'true');
                    }
		});
            
          }
if (direction === 'ArrowDown' && (currentEl.src.toLowerCase().includes('thumbs_up')||currentEl.src.toLowerCase().includes('thumbs_down'))){       
              document.querySelector('img[src*="thumbs_up"]').style.bottom = "193px";
              document.querySelector('img[src*="thumbs_down"]').style.bottom = "193px";
              document.querySelectorAll('[style*="display: none"], [style*="opacity: 0"], [aria-hidden="true"]').forEach(el => {

if (el.getAttribute('aria-hidden') === 'true' && el.style.opacity === '0' && el.style.display === 'none' && el.style.width === '100%' && el.style.height === '40px') {
	el.style.display = 'table';
	el.style.opacity = '1';
	el.setAttribute('aria-hidden', 'false');
}
else if (el.style.paddingBottom === '10px' && el.style.opacity === '0' && el.style.display === 'none' && el.getAttribute('aria-hidden') === 'true') {
	el.style.display = '';
	el.style.opacity = '1';
	el.setAttribute('aria-hidden', 'false');
}
else if (el.getAttribute('aria-hidden') === 'true' && el.style.opacity === '0' && el.style.display === 'none' && el.style.width === '100vw' && el.style.height === '93px') {
	el.style.display = '';
	el.style.opacity = '1';
	el.setAttribute('aria-hidden', 'false');
}
else if (el.getAttribute('aria-hidden') === 'true' && el.style.opacity === '0' && el.style.display === 'none' && el.style.height === '91px') {
	el.style.display = 'flex';
	el.style.opacity = '1';
	el.setAttribute('aria-hidden', 'false');
}

              });}


      

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

    // Remove highlight
    elements.forEach(el => {
      el.classList.remove('tv-focus');
    });

    // Apply focus and highlight
    targetEl.focus();
    targetEl.classList.add('tv-focus');

    // Accessibility: Announce to screen readers
    targetEl.setAttribute('aria-live', 'polite');
    targetEl.setAttribute('aria-label', targetEl.textContent.trim() || 'Focused element');
    
  }

  // Keyboard event handler with extended key support
  window.addEventListener('keydown', function (e) {
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
        e.stopImmediatePropagation();
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
        e.stopImmediatePropagation();
        e.preventDefault();
        break;

      case 'Enter':
        const overlay = document.querySelector('div[aria-label="Tap to begin"]');
        updateNavigableElements();
        if (overlay) {
          overlay.click(); // Dismiss the overlay
          e.stopImmediatePropagation();
          e.preventDefault();
        }
        break;
      default:
        if (e.keyCode === 10009) { // Return button on Tizen remotes
          if (window.location.href !== 'https://www.downdogapp.com/web') {
            window.location.href = 'https://www.downdogapp.com/web';
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        }
        break;
    }
  }, true); // Use capture phase

	setInterval(() => {
    updateNavigableElements();
}, 100);

  // Handle dynamic content changes
  const observer = new MutationObserver(() => {
    updateNavigableElements();
    if (!document.activeElement || !navigableElementsCache.includes(document.activeElement)) {
      if ([...document.querySelectorAll('div')].find(el => getComputedStyle(el).backgroundColor === 'rgba(255, 255, 255, 0.9)')) {
        focusElement([...document.querySelectorAll('div')].find(el => getComputedStyle(el).backgroundColor === 'rgba(255, 255, 255, 0.9)'));
      } else {
        focusElement(0); // Reset focus if lost
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
