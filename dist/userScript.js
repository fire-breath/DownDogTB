window.onload = function () {
  const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'LOG IN');
  if (btn) btn.click();
};
