(async function() {
  // Wait for player script/library to load
  while (typeof client?.com?.downdogapp?.client === 'undefined') {
    await new Promise(res => setTimeout(res, 500));
  }
  console.log('Player lib ready.');

  // Wait for the video element
  const video = await new Promise(res => {
    const check = () => {
      const v = document.querySelector('video');
      if (v) res(v);
      else setTimeout(check, 500);
    };
    check();
  });
  console.log('Video element found');

  video.addEventListener('canplay', () => {
    console.log('Video can play — playing now.');
    video.play();
  });

  // Re-trigger the initialization in case it hung
  setTimeout(() => {
    console.log('Re-initializing playback...');
    client.com.downdogapp.client.initializeSequencePlayback(null, false);
  }, 10000);
})();

(function () {
  // CSS style for highlighting focused element
  const style = document.createElement('style');
  style.textContent = `
    .tv-focus {
      outline: 3px solid #00ffff;
      outline-offset: -3px;
      border-radius: 10px;
      transition: outline 0.1s ease-in-out;
    }
  `;
  document.head.appendChild(style);

  // Helper: get all navigable elements
  function getNavigableElements() {
    return Array.from(document.querySelectorAll('button, input, [tabindex="0"]'))
      .filter(el => el.offsetParent !== null); // Only visible
  }

  let focusIndex = 0;

  function focusElement(index) {
    const elements = getNavigableElements();
    if (elements.length === 0) return;
    if (index < 0) index = elements.length - 1;
    if (index >= elements.length) index = 0;

    // Remove highlight from all
    elements.forEach(el => el.classList.remove('tv-focus'));

    const el = elements[index];
    el.focus();
    el.classList.add('tv-focus'); // Highlight current
    focusIndex = index;
  }

  document.addEventListener('keydown', function (e) {
    const key = e.key;
    const elements = getNavigableElements();
    if (elements.length === 0) return;

    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        focusIndex = (focusIndex + 1) % elements.length;
        focusElement(focusIndex);
        e.preventDefault();
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        focusIndex = (focusIndex - 1 + elements.length) % elements.length;
        focusElement(focusIndex);
        e.preventDefault();
        break;
		
      case 'Escape':
      case 'Backspace':
        window.history.back();
        e.preventDefault();
        break;
    }
  });

  window.addEventListener('load', () => {
    setTimeout(() => focusElement(0), 100);
  });
})();
