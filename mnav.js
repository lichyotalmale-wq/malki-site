// Mobile menu: on phones the main nav becomes a round menu button that opens
// a full-width panel (titles + short subtitles, then quick-action circles).
(function () {
  var SUBS = {
    help: 'חרדות, כעסים ועוד',
    cbt: 'הגישה הטיפולית',
    about: 'נעים להכיר',
    'quiz.html': 'אבחון קצר',
    'posts.html': 'פוסטים ותובנות',
    'tools.html': 'כלים לבית',
    faq: 'שאלות ותשובות'
  };
  var ICONS = {
    quiz: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg>'
  };

  function keyOf(href) {
    var h = href.split('#');
    return h.length > 1 && h[1] ? h[1] : href.replace(/^\//, '');
  }

  function init() {
    var nav = document.querySelector('nav[aria-label="ניווט ראשי"]');
    if (!nav || nav.dataset.mnav) return;
    nav.dataset.mnav = '1';
    var header = nav.closest('header') || nav.parentNode;

    var css = document.createElement('style');
    css.textContent =
      '.mnav-btn,.mnav-panel{display:none}' +
      '@media (max-width:820px){' +
      'nav[aria-label="ניווט ראשי"]{display:none!important}' +
      '.mnav-btn{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;border:1px solid #E2C6B7;background:linear-gradient(145deg,#F7E7DD,#E6C4B3);box-shadow:0 6px 16px rgba(154,94,74,.22),inset 0 1px 0 rgba(255,255,255,.7);cursor:pointer;padding:0}' +
      '.mnav-panel{display:block;position:fixed;left:0;right:0;bottom:0;z-index:999;background:#FBF7F3;overflow-y:auto;-webkit-overflow-scrolling:touch;border-top:2px solid #C9957F;opacity:0;transform:translateY(-12px);pointer-events:none;transition:opacity .25s ease,transform .3s cubic-bezier(.2,.7,.2,1)}' +
      '.mnav-panel.open{opacity:1;transform:none;pointer-events:auto}' +
      'header.mnav-lift{position:relative;z-index:1000}' +
      '}' +
      '.mnav-ico{display:block;width:22px;height:16px;position:relative}' +
      '.mnav-ico i{position:absolute;right:0;left:0;height:2.5px;border-radius:2px;background:#3B2925;transition:transform .25s ease,opacity .2s ease}' +
      '.mnav-ico i:nth-child(1){top:0}.mnav-ico i:nth-child(2){top:6.75px}.mnav-ico i:nth-child(3){top:13.5px}' +
      '.mnav-btn[aria-expanded="true"] .mnav-ico i:nth-child(1){transform:translateY(6.75px) rotate(45deg)}' +
      '.mnav-btn[aria-expanded="true"] .mnav-ico i:nth-child(2){opacity:0}' +
      '.mnav-btn[aria-expanded="true"] .mnav-ico i:nth-child(3){transform:translateY(-6.75px) rotate(-45deg)}' +
      '.mnav-list{list-style:none;margin:0;padding:10px 24px 0}' +
      '.mnav-list a{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:16px 4px;border-bottom:1px solid #EAD9CF;text-decoration:none;color:#3B2925}' +
      '.mnav-list a b{font-family:Fredoka,sans-serif;font-weight:600;font-size:25px;line-height:1.2}' +
      '.mnav-list a span{font-size:15px;color:#9C8379}' +
      '.mnav-list a.cur{background:linear-gradient(90deg,rgba(243,230,222,0),#F3E6DE);border-bottom-color:#C9957F}' +
      '.mnav-list a.cur b{color:#9A5E4A}' +
      '.mnav-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 10px;padding:30px 20px 40px}' +
      '.mnav-grid a{display:flex;flex-direction:column;align-items:center;gap:10px;text-decoration:none;color:#3B2925;font-family:Fredoka,sans-serif;font-weight:500;font-size:16px;text-align:center}' +
      '.mnav-grid a i{display:grid;place-items:center;width:68px;height:68px;border-radius:50%;box-shadow:0 8px 18px rgba(90,55,45,.18)}' +
      '.mnav-c1{background:#FFFDFB;border:1px solid #E2C6B7;color:#8E5543}' +
      '.mnav-c2{background:#C9957F;color:#fff}' +
      '.mnav-c3{background:#3B2925;color:#F4E6DE}';
    document.head.appendChild(css);

    // panel: text links (all but the CTA)
    var here = location.pathname.replace(/^\//, '') || 'index.html';
    var list = document.createElement('div');
    list.className = 'mnav-list';
    var cta = null;
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
      var href = a.getAttribute('href') || '';
      if (/#contact$/.test(href)) { cta = href; return; }
      var k = keyOf(href);
      var row = document.createElement('a');
      row.href = href;
      var t = document.createElement('b'); t.textContent = a.textContent.trim();
      row.appendChild(t);
      var file = href.split('#')[0].replace(/^\//, '');
      if (file && (file === here || file + '.html' === here || here === file.replace('.html', ''))) row.className = 'cur';
      list.appendChild(row);
    });

    var grid = document.createElement('div');
    grid.className = 'mnav-grid';
    var contact = cta || '/#contact';
    [['quiz.html', 'mnav-c1', ICONS.quiz, 'מה מתיש אותי?'],
     [contact, 'mnav-c2', ICONS.chat, 'לשיחת היכרות'],
     ['tel:0585181285', 'mnav-c3', ICONS.phone, 'התקשרי']].forEach(function (it) {
      var a = document.createElement('a');
      a.href = it[0];
      a.innerHTML = '<i class="' + it[1] + '" aria-hidden="true">' + it[2] + '</i>';
      a.appendChild(document.createTextNode(it[3]));
      grid.appendChild(a);
    });

    var panel = document.createElement('div');
    panel.className = 'mnav-panel';
    panel.id = 'mnav-panel';
    panel.setAttribute('aria-hidden', 'true');
    panel.appendChild(list);
    panel.appendChild(grid);
    document.body.appendChild(panel);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mnav-btn';
    btn.setAttribute('aria-label', 'תפריט');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'mnav-panel');
    btn.innerHTML = '<span class="mnav-ico" aria-hidden="true"><i></i><i></i><i></i></span>';
    nav.parentNode.insertBefore(btn, nav);

    function setOpen(open) {
      if (open) {
        var r = header.getBoundingClientRect();
        panel.style.top = Math.max(0, r.bottom) + 'px';
      }
      panel.classList.toggle('open', open);
      header.classList.toggle('mnav-lift', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.documentElement.style.overflow = open ? 'hidden' : '';
    }
    btn.addEventListener('click', function () { setOpen(!panel.classList.contains('open')); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 820) setOpen(false); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
