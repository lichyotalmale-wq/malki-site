// Mobile menu: collapses the main nav into a "תפריט" button on narrow screens.
(function () {
  function init() {
    var nav = document.querySelector('nav[aria-label="ניווט ראשי"]');
    if (!nav || nav.dataset.mnav) return;
    nav.dataset.mnav = '1';

    var css = document.createElement('style');
    css.textContent =
      '.mnav-bar{display:none}' +
      '@media (max-width:820px){' +
      '.mnav-bar{display:flex;align-items:center;gap:8px}' +
      'nav[aria-label="ניווט ראשי"]{display:none!important}' +
      'nav[aria-label="ניווט ראשי"].mnav-open{display:flex!important;flex-direction:column;align-items:stretch!important;flex-basis:100%;border-radius:24px!important;padding:8px!important;gap:2px!important}' +
      'nav[aria-label="ניווט ראשי"].mnav-open a{text-align:center;padding:12px 16px!important;font-size:17px}' +
      'nav[aria-label="ניווט ראשי"].mnav-open a.mnav-cta-src{display:none}' +
      '}' +
      '.mnav-btn{display:inline-flex;align-items:center;gap:8px;font:inherit;font-size:16px;color:#3B2925;background:rgba(255,253,251,.8);border:1px solid rgba(217,182,165,.7);border-radius:999px;padding:9px 16px;cursor:pointer}' +
      '.mnav-ico{display:inline-block;width:18px;height:12px;position:relative}' +
      '.mnav-ico i{position:absolute;right:0;left:0;height:2px;border-radius:2px;background:#3B2925;transition:transform .25s ease,opacity .2s ease}' +
      '.mnav-ico i:nth-child(1){top:0}.mnav-ico i:nth-child(2){top:5px}.mnav-ico i:nth-child(3){top:10px}' +
      '.mnav-btn[aria-expanded="true"] .mnav-ico i:nth-child(1){transform:translateY(5px) rotate(45deg)}' +
      '.mnav-btn[aria-expanded="true"] .mnav-ico i:nth-child(2){opacity:0}' +
      '.mnav-btn[aria-expanded="true"] .mnav-ico i:nth-child(3){transform:translateY(-5px) rotate(-45deg)}' +
      '.mnav-cta{font-family:Fredoka,sans-serif;font-weight:500;font-size:15px;text-decoration:none;color:#fff!important;background:#3B2925;padding:10px 18px;border-radius:999px;white-space:nowrap}';
    document.head.appendChild(css);

    if (!nav.id) nav.id = 'main-nav';
    var bar = document.createElement('div');
    bar.className = 'mnav-bar';

    var cta = nav.querySelector('a[href$="#contact"]');
    if (cta) {
      cta.classList.add('mnav-cta-src');
      var c = document.createElement('a');
      c.href = cta.getAttribute('href');
      c.className = 'mnav-cta';
      c.textContent = cta.textContent.trim();
      bar.appendChild(c);
    }

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mnav-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', nav.id);
    btn.innerHTML = '<span class="mnav-ico" aria-hidden="true"><i></i><i></i><i></i></span><span>תפריט</span>';
    bar.insertBefore(btn, bar.firstChild);

    nav.parentNode.insertBefore(bar, nav);

    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('mnav-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('mnav-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
