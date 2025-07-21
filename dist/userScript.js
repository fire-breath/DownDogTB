(function() {
    // Function to initialize navigation
    function initializeNavigation() {
        // Select initial buttons (SIGN UP and LOG IN)
        const mainContainer = document.querySelector('div[style*="flex-direction: column; align-items: center; justify-content: center; height: 100vh"]');
        const initialButtons = mainContainer && mainContainer.offsetParent !== null
            ? Array.from(mainContainer.querySelectorAll('button[tabindex="0"][style*="font-family: \\"Montserrat\\", sans-serif; cursor: pointer; height: 50px;"]'))
                .filter(el => !el.disabled && el.offsetParent !== null && (el.textContent.trim() === 'SIGN UP' || el.textContent.trim() === 'LOG IN'))
            : [];

        // Select login form elements (Email, Password, LOG IN button, Forgot Password?)
        const loginContainer = Array.from(document.querySelectorAll('div[style*="flex-direction: column; justify-content: space-between; padding-top: 60px"]'))
            .find(el => el.offsetParent !== null && getComputedStyle(el).display !== 'none');
        const loginElements = loginContainer
            ? Array.from(loginContainer.querySelectorAll('input[type="text"], input[type="password"], button[tabindex="0"]'))
                .filter(el => !el.disabled && el.offsetParent !== null && el.style.display !== 'none' && (el.tagName === 'INPUT' || el.textContent.trim() === 'LOG IN' || el.textContent.trim() === 'Forgot Password?'))
            : [];

        // Use login elements if available, otherwise initial buttons
        const focusableElements = loginElements.length > 0 ? loginElements : initialButtons;

        if (focusableElements.length === 0) {
            console.log('No focusable elements found.');
            console.log('Main container found:', !!mainContainer, mainContainer ? getComputedStyle(mainContainer).display : 'N/A');
            console.log('Login container found:', !!loginContainer, loginContainer ? getComputedStyle(loginContainer).display : 'N/A');
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
        button[tabindex="0"][style*="font-family: \\"Montserrat\\", sans-serif"]:focus,
        input.no-outline-focus:focus {
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
        const retries = [1000, 2000, 3000, 5000, 10000];
        retries.forEach((delay, index) => {
            setTimeout(() => {
                if (initializeNavigation()) {
                    observer.disconnect();
                    console.log(`Navigation initialized after ${delay}ms timeout`);
                }
            }, delay);
        });
    }

    // Monitor LOG IN button click to reinitialize navigation
    document.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.textContent.trim() === 'LOG IN') {
            console.log('LOG IN button clicked, reinitializing navigation');
            setTimeout(initializeNavigation, 100); // Short delay to allow DOM update
        }
    }, { capture: true });
})();
