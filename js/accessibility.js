/* ============================================================
   פרחי ברזיל — תוסף נגישות + באנר עוגיות
   נטען בכל הדפים דרך site.js. כל ההגדרות נשמרות ב-localStorage.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- אייקונים ---------- */
  var IC = {
    a11y:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="3.6" r="2"/><path d="M21 8.5c0 .7-.5 1.2-1.2 1.3L15 10.4V14l1.9 6.1c.2.8-.2 1.4-1 1.6-.7.2-1.4-.2-1.6-1L12.4 15h-.8L9.7 20.7c-.2.8-.9 1.2-1.6 1-.8-.2-1.2-.8-1-1.6L9 14v-3.6l-4.8-.6C3.5 9.7 3 9.2 3 8.5c0-.8.7-1.4 1.5-1.3L9 7.8c2 .3 4 .3 6 0l4.5-.6c.8-.1 1.5.5 1.5 1.3Z"/></svg>',
    close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    reset:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 8a8 8 0 0 0-14-2M4 6v3h3M4 16a8 8 0 0 0 14 2m2-2v-3h-3"/></svg>',
    contrast:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none"/></svg>',
    link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M9 15l6-6M10 7l1-1a4 4 0 0 1 6 6l-1 1M14 17l-1 1a4 4 0 0 1-6-6l1-1"/></svg>',
    text:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7V5h14v2M12 5v14M9 19h6"/></svg>',
    spacing:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/></svg>',
    line:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18M22 4v4M22 16v4"/></svg>',
    font:'<svg viewBox="0 0 24 24" fill="currentColor" font-family="serif"><text x="3" y="19" font-size="20" font-weight="700">Df</text></svg>',
    anim:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="6" y="5" width="3.5" height="14" rx="1"/><rect x="14.5" y="5" width="3.5" height="14" rx="1"/></svg>',
    img:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="m4 16 4-4 3 3 4-4 5 5"/><path d="m3 3 18 18"/></svg>',
    cursor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M5 3l5 16 2.5-6.5L19 10z"/></svg>',
    head:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5v14M5 12h8M13 5v14M17 9v10M17 9l3-1"/></svg>',
    drop:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5S5 10 5 14.5a7 7 0 0 0 14 0C19 10 12 2.5 12 2.5Z"/></svg>',
    align:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 5h18M7 10h14M3 15h18M9 20h12"/></svg>'
  };

  /* ---------- הגדרת הפקדים ---------- */
  var CONTROLS = [
    { key:"contrast", attr:"data-a11y-contrast", label:"ניגודיות", icon:IC.contrast, values:[null,"high","invert"], names:["","ניגודיות גבוהה","היפוך צבעים"] },
    { key:"links", attr:"data-a11y-links", label:"הדגשת קישורים", icon:IC.link, values:[null,"on"] },
    { key:"textsize", attr:"data-a11y-textsize", label:"טקסט גדול", icon:IC.text, values:[null,"1","2","3"], names:["","רמה 1","רמה 2","רמה 3"] },
    { key:"spacing", attr:"data-a11y-spacing", label:"ריווח טקסט", icon:IC.spacing, values:[null,"1","2"], names:["","בינוני","רחב"] },
    { key:"lineheight", attr:"data-a11y-lineheight", label:"גובה שורה", icon:IC.line, values:[null,"1","2"], names:["","בינוני","גבוה"] },
    { key:"font", attr:"data-a11y-font", label:"גופן קריא", icon:IC.font, values:[null,"readable"] },
    { key:"anim", attr:"data-a11y-anim", label:"עצירת הנפשות", icon:IC.anim, values:[null,"off"] },
    { key:"images", attr:"data-a11y-images", label:"הסתרת תמונות", icon:IC.img, values:[null,"off"] },
    { key:"cursor", attr:"data-a11y-cursor", label:"סמן גדול", icon:IC.cursor, values:[null,"big"] },
    { key:"headings", attr:"data-a11y-headings", label:"הדגשת כותרות", icon:IC.head, values:[null,"on"] },
    { key:"sat", attr:"data-a11y-sat", label:"רוויה", icon:IC.drop, values:[null,"low","high","gray"], names:["","רוויה נמוכה","רוויה גבוהה","גווני אפור"] },
    { key:"align", attr:"data-a11y-align", label:"יישור טקסט", icon:IC.align, values:[null,"right","center","left"], names:["","ימין","מרכז","שמאל"] }
  ];

  var KEY = "bf_a11y_v1";
  var state = load();

  function load(){ try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e){ return {}; } }
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){} }

  function apply(){
    var root = document.documentElement;
    CONTROLS.forEach(function(c){
      var v = state[c.key];
      if (v) root.setAttribute(c.attr, v);
      else root.removeAttribute(c.attr);
    });
  }

  /* ---------- בניית הווידג'ט ---------- */
  function build(){
    apply(); // החל הגדרות שמורות מיד

    var fab = document.createElement("button");
    fab.className = "a11y-fab"; fab.setAttribute("aria-label","פתיחת תפריט נגישות"); fab.innerHTML = IC.a11y;

    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="a11y-scrim" data-a11y-close></div>' +
      '<aside class="a11y-panel" role="dialog" aria-label="תפריט נגישות" aria-hidden="true">' +
        '<div class="a11y-panel__head"><strong>' + IC.a11y + ' תפריט נגישות</strong>' +
          '<button class="a11y-close" data-a11y-close aria-label="סגירה">' + IC.close + '</button></div>' +
        '<div class="a11y-body"><div class="a11y-grid">' +
          CONTROLS.map(function(c){
            return '<button class="a11y-card" data-key="'+c.key+'">' +
              '<span class="a11y-card__level"></span>' + c.icon +
              '<span class="a11y-card__label">'+c.label+'</span></button>';
          }).join("") +
        '</div></div>' +
        '<div class="a11y-foot">' +
          '<button class="a11y-reset" data-a11y-reset>' + IC.reset + ' איפוס כל הגדרות הנגישות</button>' +
          '<div class="a11y-links"><a href="accessibility.html">הצהרת נגישות</a><a href="privacy.html">מדיניות פרטיות</a></div>' +
        '</div>' +
      '</aside>';

    document.body.appendChild(fab);
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    var panel = document.querySelector(".a11y-panel");
    function open(){ document.body.classList.add("a11y-open"); panel.setAttribute("aria-hidden","false"); }
    function close(){ document.body.classList.remove("a11y-open"); panel.setAttribute("aria-hidden","true"); }
    fab.addEventListener("click", open);
    document.querySelectorAll("[data-a11y-close]").forEach(function(b){ b.addEventListener("click", close); });
    document.addEventListener("keydown", function(e){ if(e.key==="Escape") close(); });

    // לחיצה על פקד
    document.querySelectorAll(".a11y-card").forEach(function(card){
      card.addEventListener("click", function(){
        var c = CONTROLS.filter(function(x){ return x.key===card.dataset.key; })[0];
        var cur = state[c.key] || null;
        var i = c.values.indexOf(cur);
        var next = c.values[(i+1) % c.values.length];
        if (next) state[c.key] = next; else delete state[c.key];
        save(); apply(); refresh();
      });
    });

    document.querySelector("[data-a11y-reset]").addEventListener("click", function(){
      state = {}; save(); apply(); refresh();
    });

    refresh();
  }

  function refresh(){
    document.querySelectorAll(".a11y-card").forEach(function(card){
      var c = CONTROLS.filter(function(x){ return x.key===card.dataset.key; })[0];
      var v = state[c.key] || null;
      var on = !!v;
      card.classList.toggle("is-active", on);
      var lvl = card.querySelector(".a11y-card__level");
      if (on && c.names) { var idx = c.values.indexOf(v); lvl.textContent = c.names[idx] || "פעיל"; }
      else lvl.textContent = on ? "פעיל" : "";
    });
  }

  /* ---------- באנר עוגיות ---------- */
  var COOKIE = "bf_cookie_consent_v1";
  function cookieBanner(){
    var consent;
    try { consent = localStorage.getItem(COOKIE); } catch(e){}
    if (consent) return; // כבר הוחלט

    var b = document.createElement("div");
    b.className = "cookie-banner"; b.setAttribute("role","dialog"); b.setAttribute("aria-label","הסכמה לשימוש בעוגיות");
    b.innerHTML =
      '<div class="cookie-banner__text"><strong>אנחנו משתמשים בעוגיות 🍪</strong>' +
        '<p>האתר עושה שימוש בעוגיות כדי לשפר את חוויית הגלישה ולנתח את השימוש. ' +
        'לפרטים נוספים <a href="privacy.html">מדיניות הפרטיות</a>.</p></div>' +
      '<div class="cookie-banner__actions">' +
        '<button class="btn btn--sm" data-cookie="accept">מאשר/ת</button>' +
        '<button class="btn btn--sm c-decline" data-cookie="decline">לא תודה</button>' +
      '</div>';
    document.body.appendChild(b);
    requestAnimationFrame(function(){ b.classList.add("is-in"); });

    b.querySelectorAll("[data-cookie]").forEach(function(btn){
      btn.addEventListener("click", function(){
        try { localStorage.setItem(COOKIE, btn.dataset.cookie); } catch(e){}
        b.classList.remove("is-in");
        setTimeout(function(){ b.remove(); }, 500);
      });
    });
  }

  function init(){ build(); cookieBanner(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
