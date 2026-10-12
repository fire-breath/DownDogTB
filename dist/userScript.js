// ===== DownDogTB diagnostic probe: paste at the very top of dist/userScript.js =====
(function () {
  try {
    if (window.top !== window || location.hostname.indexOf('downdogapp.com') === -1) return;
    var T0 = Date.now();
    function collect(tag) {
      var info = {};
      try { info.tag = tag + ' +' + Math.round((Date.now() - T0) / 1000) + 's'; } catch (e) {}
      try { info.ua = navigator.userAgent; } catch (e) {}
      try { info.href = location.href; } catch (e) {}
      try { info.canvas = document.querySelectorAll('canvas').length; } catch (e) {}
      try { info.buttons = document.querySelectorAll('button').length; } catch (e) {}
      try { info.imgs = document.querySelectorAll('img').length; } catch (e) {}
      try { info.inputs = document.querySelectorAll('input').length; } catch (e) {}
      try { info.scripts = Array.prototype.slice.call(document.scripts).map(function (s) { return s.src; }).filter(Boolean); } catch (e) {}
      try { info.cookieNames = document.cookie.split(';').map(function (c) { return c.split('=')[0].trim(); }).filter(Boolean); } catch (e) {}
      try { info.storageKeys = Object.keys(localStorage); } catch (e) {}
      try { info.wasm = typeof WebAssembly; info.wasmGC = WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,95,1,120,0])); } catch (e) {}
      try { info.text = (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 160); } catch (e) {}
      return info;
    }
    function send(info) {
      try {
        var x = new XMLHttpRequest();
        x.open('POST', 'http://127.0.0.1:8099/__tube/clientlog', true);
        x.setRequestHeader('Content-Type', 'text/plain');
        x.send(JSON.stringify([{ t: Date.now() - T0, k: 'tizenbrew-probe', x: JSON.stringify(info) }]));
      } catch (e) {}
    }
    var box;
    function show(info) {
      try {
        if (!box) {
          box = document.createElement('pre');
          box.style.cssText = 'position:fixed;left:0;top:0;right:0;z-index:2147483647;margin:0;padding:8px;' +
            'background:rgba(0,0,0,.88);color:#7f7;font:15px/19px monospace;white-space:pre-wrap;word-break:break-all;pointer-events:none';
          document.body.appendChild(box);
        }
        box.textContent = JSON.stringify(info, null, 1);
      } catch (e) {}
    }
    function run(tag) { var i = collect(tag); send(i); show(i); }
    [3000, 12000, 30000].forEach(function (ms, n) {
      setTimeout(function () { run('probe' + (n + 1)); }, ms);
    });
    setTimeout(function () { try { if (box) box.style.display = 'none'; } catch (e) {} }, 60000);
  } catch (e) {}
})();
// ===== end probe =====
