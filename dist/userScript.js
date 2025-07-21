(function() {
    // Function to initialize navigation
    function initializeNavigation() {
        // Select focusable elements: inputs and buttons with tabindex="0"
        const focusableElements = Array.from(document.querySelectorAll('input[type="text"]:not([style*="display: none"]), input[type="password"]:not([style*="display: none"]), button[tabindex="0"]:not([style*="display: none"])'))
            .filter(el => !el.disabled && el.offsetParent !== null)
            .filter(el => {
                // Exclude social login buttons (Apple, Google, Facebook) unless desired
                const isSocialLogin = (
                    el.tagName === 'IMG' && el.getAttribute('role') === 'button' ||
                    el.closest('[id*="gsi_"]') || // Google Sign-In button
                    el.src && el.src.includes('facebook_login') ||
                    el.src && el.src.includes('apple_login')
                );
                return !isSocialLogin;
            });

        if (focusableElements.length === 0) {
            console.log('No focusable elements found.');
            console.log('Document body visibility:', getComputedStyle(document.body).display);
            return false;
        }

        console.log('Found focusable elements:', focusableElements.map(el => ({
            tag: el.tagName,
            type: el.type || 'N/A',
            text: el.textContent.trim() || el.placeholder || 'N/A',
            attributes: Array.from(el.attributes).map(attr => `${attr.name}: ${attr.value}`)
        })));

        // Force initial focus to the first element
        if (document.activeElement !== focusableElements[0]) {
            focusableElements[0].focus();
            console.log('Initial focus forced to:', focusableElements[0].textContent.trim() || focusableElements[0].placeholder || focusableElements[0].tagName);
        }

        // Remove existing keydown listeners and add new one in capture phase
        document.removeEventListener('keydown', handleKeydown);
        document.addEventListener('keydown', handleKeydown, { capture: true });

        function handleKeydown(event) {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
                event.stopPropagation();
            }

            // Allow typing in input fields
            if (document.activeElement.tagName === 'INPUT' && !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(event.key)) {
                return;
            }

            let currentElement = document.activeElement;
            let currentIndex = focusableElements.indexOf(currentElement);

            // If focus is not on a target element, force it to the first element
            if (currentIndex === -1) {
                console.log('No valid focus. Current active element:', {
                    tag: currentElement.tagName,
                    id: currentElement.id,
                    class: currentElement.className,
                    text: currentElement.textContent.trim().substring(0, 20)
                });
                focusableElements[0].focus();
                currentElement = focusableElements[0];
                currentIndex = 0;
                console.log('Focus reset to:', currentElement.textContent.trim() || currentElement.placeholder || currentElement.tagName);
            }

            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    if (currentIndex > 0) {
                        focusableElements[currentIndex - 1].focus();
                        console.log('Focused:', focusableElements[currentIndex - 1].textContent.trim() || focusableElements[currentIndex - 1].placeholder || focusableElements[currentIndex - 1].tagName);
                    }
                    break;

                case 'ArrowDown':
                case 'ArrowRight':
                    if (currentIndex < focusableElements.length - 1) {
                        focusableElements[currentIndex + 1].focus();
                        console.log('Focused:', focusableElements[currentIndex + 1].textContent.trim() || focusableElements[currentIndex + 1].placeholder || focusableElements[currentIndex + 1].tagName);
                    }
                    break;

                case 'Enter':
                    if (currentElement.tagName === 'BUTTON') {
                        event.preventDefault();
                        currentElement.click();
                        console.log(`Button clicked: ${currentElement.textContent.trim()}`);
                    } else if (currentElement.tagName === 'INPUT' && currentElement.form) {
                        // Find the submit button in the same form
                        const submitButton = Array.from(currentElement.form.querySelectorAll('button[tabindex="0"]'))
                            .find(btn => btn.textContent.trim() === 'LOG IN' || btn.type === 'submit');
                        if (submitButton) {
                            event.preventDefault();
                            submitButton.click();
                            console.log('Form submitted via Enter on input');
                        }
                    }
                    break;

                case 'Escape':
                    event.preventDefault();
                    focusableElements[0].focus();
                    console.log('Focus reset to:', focusableElements[0].textContent.trim() || focusableElements[0].placeholder || focusableElements[0].tagName);
                    break;
            }
        }

        return true;
    }

    // Add focus styling with high specificity
    const style = document.createElement('style');
    style.textContent = `
        input[type="text"]:focus, input[type="password"]:focus, button[tabindex="0"]:focus {
            outline: 3px solid #ffffff !important;
            outline-offset: 3px !important;
            background-color: rgba(255, 255, 255, 0.7) !important;
            z-index: 1000 !important;
        }
    `;
    document.head.appendChild(style);

    // Attempt initialization immediately
    if (!initializeNavigation()) {
        // Retry with MutationObserver for dynamic content
        const observer = new MutationObserver(() => {
            if (initializeNavigation()) {
                observer.disconnect();
                console.log('Navigation initialized after DOM change');
            }
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });

        // Fallback: retry after delays
        const retries = [1000, 2000, 3000, 5000, 10000, 15000];
        retries.forEach((delay, index) => {
            setTimeout(() => {
                if (initializeNavigation()) {
                    observer.disconnect();
                    console.log(`Navigation initialized after ${delay}ms timeout`);
                }
            }, delay);
        });
    }

    // Reinitialize on click events for LOG IN or navigation
    document.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.textContent.trim() === 'LOG IN') {
            console.log('LOG IN button clicked, reinitializing navigation');
            setTimeout(initializeNavigation, 100);
        }
    }, { capture: true });

    // Reinitialize on page navigation (hash or URL changes)
    window.addEventListener('popstate', () => {
        console.log('Page navigation detected, reinitializing navigation');
        setTimeout(initializeNavigation, 100);
    });
})();
