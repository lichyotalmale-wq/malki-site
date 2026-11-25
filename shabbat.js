/* האתר סגור בשבת ובחג (זמני ירושלים, Hebcal) */
(function () {
  function closed() {
    var d = document.createElement('div');
    d.setAttribute('dir', 'rtl');
    d.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#FAF6F1;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;font-family:Arial,sans-serif;color:#3B2925';
    d.innerHTML = '<div><div style="font-size:46px;margin-bottom:12px">🕯️🕯️</div><h1 style="font-size:28px;margin:0 0 10px">האתר סגור בשבת ובחג</h1><p style="font-size:18px;margin:0;color:#5E4840">נשמח לראותך במוצאי שבת / חג 🌸</p></div>';
    (document.body || document.documentElement).appendChild(d);
    document.documentElement.style.overflow = 'hidden';
  }
  function check(iv) {
    var now = Date.now();
    for (var i = 0; i < iv.length; i++) if (now >= iv[i][0] && now <= iv[i][1]) { if (document.body) closed(); else document.addEventListener('DOMContentLoaded', closed); return; }
  }
  function fallback() {
    var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var g = {}; p.forEach(function (x) { g[x.type] = x.value; });
    var hm = g.hour + ':' + g.minute;
    if ((g.weekday === 'Fri' && hm >= '15:30') || (g.weekday === 'Sat' && hm <= '19:15')) check([[0, Infinity]]);
  }
  var key = 'holy_iv', c = null;
  try { c = JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) {}
  if (c && Date.now() - c.at < 12 * 3600e3) return check(c.iv);
  var t = new Date(), d0 = new Date(t - 3 * 864e5).toISOString().slice(0, 10), d1 = new Date(+t + 14 * 864e5).toISOString().slice(0, 10);
  fetch('https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&c=on&geo=geoname&geonameid=281184&i=on&M=on&b=40&start=' + d0 + '&end=' + d1)
    .then(function (r) { return r.json(); })
    .then(function (j) {
      var iv = [], open = null;
      (j.items || []).forEach(function (it) {
        if (it.category === 'candles' && open === null) open = new Date(it.date).getTime();
        if (it.category === 'havdalah' && open !== null) { iv.push([open - 15 * 60e3, new Date(it.date).getTime() + 15 * 60e3]); open = null; }
      });
      try { localStorage.setItem(key, JSON.stringify({ at: Date.now(), iv: iv })); } catch (e) {}
      check(iv);
    })
    .catch(fallback);
})();
