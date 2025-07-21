window.onload = function () {
    // Register Tizen remote keys
    if (typeof tizen !== 'undefined') {
        tizen.tvinputdevice.registerKey('ArrowUp');
        tizen.tvinputdevice.registerKey('ArrowDown');
        tizen.tvinputdevice.registerKey('Enter');
    }

    // Create and append UI container
    var uiContainer = document.createElement('div');
    uiContainer.classList.add('downdog-ui-container');
    uiContainer.setAttribute('tabindex', '0');
    uiContainer.innerHTML = `
        <button class="menu-item" tabindex="0">Workout 1</button>
        <button class="menu-item" tabindex="0">Workout 2</button>
        <button class="menu-item" tabindex="0">Workout 3</button>
    `;
    document.body.appendChild(uiContainer);

    // Focus first menu item
    uiContainer.querySelector('.menu-item').focus();

    // Handle key events
    document.addEventListener('keydown', function (evt) {
        const focusedElement = document.querySelector(':focus');

        if (typeof tizen !== 'undefined') {
            const key = tizen.tvinputdevice.getKeyByCode(evt.keyCode);
            if (!key) return;

            switch (key.name) {
                case 'ArrowUp':
                    focusedElement?.previousElementSibling?.focus();
                    break;
                case 'ArrowDown':
                    focusedElement?.nextElementSibling?.focus();
                    break;
                case 'Enter':
                    focusedElement?.click();
                    break;
            }
        }
    });
};
