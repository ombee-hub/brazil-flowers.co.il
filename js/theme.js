/* ============================================================
   פרחי ברזיל — מנוע צבעים (Theme)
   מאפשר להגדיר את צבעי האתר מפאנל הניהול. הצבעים נשמרים
   ומוחלים על משתני ה-CSS, כך שכל האתר משתנה.
   ============================================================ */
(function () {
  "use strict";
  var KEY = "bf_theme_v1";

  // ברירת המחדל — תואם ל-styles.css
  var DEFAULT = { green: "#5a7a1b", dark: "#28400a", rose: "#cf6a62", gold: "#cf9f1f" };

  function clamp(n) { return Math.max(0, Math.min(255, Math.round(n))); }
  function hex2rgb(h) { h = (h || "").replace("#", ""); if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join(""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function rgb2hex(r) { return "#" + r.map(function (v) { return ("0" + clamp(v).toString(16)).slice(-2); }).join(""); }
  function mix(a, b, t) { var x = hex2rgb(a), y = hex2rgb(b); return rgb2hex([0, 1, 2].map(function (i) { return x[i] + (y[i] - x[i]) * t; })); }

  function get() { try { return Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return Object.assign({}, DEFAULT); } }
  function save(t) { try { localStorage.setItem(KEY, JSON.stringify(t)); } catch (e) {} }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  function apply(t) {
    t = t || get();
    var r = document.documentElement.style;
    if (t.green) {
      r.setProperty("--green", t.green);
      r.setProperty("--green-700", mix(t.green, "#000000", 0.28));
      r.setProperty("--green-500", mix(t.green, "#ffffff", 0.12));
      r.setProperty("--green-400", mix(t.green, "#ffffff", 0.30));
      r.setProperty("--green-100", mix(t.green, "#ffffff", 0.86));
      r.setProperty("--green-50", mix(t.green, "#ffffff", 0.93));
    }
    if (t.dark) r.setProperty("--green-900", t.dark);
    if (t.rose) { r.setProperty("--rose", t.rose); r.setProperty("--blush", mix(t.rose, "#ffffff", 0.28)); }
    if (t.gold) r.setProperty("--gold", t.gold);
  }

  function reset() { clear(); ["--green", "--green-700", "--green-500", "--green-400", "--green-100", "--green-50", "--green-900", "--rose", "--blush", "--gold"].forEach(function (v) { document.documentElement.style.removeProperty(v); }); }

  window.BFTheme = { DEFAULT: DEFAULT, get: get, save: save, apply: apply, reset: reset, mix: mix };

  // החלה מיידית של הצבע השמור (אם קיים)
  try { if (localStorage.getItem(KEY)) apply(get()); } catch (e) {}
})();
