window.addEventListener('load', function () {
  const observer = new MutationObserver(() => {
    const loginButton = Array.from(document.querySelectorAll('button'))
      .find(btn => btn.textContent.trim() === 'LOG IN');

    if (loginButton) {
      loginButton.click();
      observer.disconnect(); // stop observing once clicked
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
