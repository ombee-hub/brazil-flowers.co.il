/* ============================================================
   פרחי ברזיל — לוגיקת פאנל הניהול
   כניסה מאובטחת (Supabase Auth) + ניהול מוצרים/קטגוריות/תמונות.
   האבטחה נאכפת בצד-השרת ע"י RLS (ראו ADMIN-SETUP.md).
   ============================================================ */
(function () {
  "use strict";
  var cfg = window.SUPABASE_CONFIG || {};
  var configured = !!(cfg.url && cfg.anonKey);
  var sb = (configured && window.supabase) ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;
  var BUCKET = "product-images";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var app = document.getElementById("admin-app");
  var fmt = function (n) { return "₪" + Number(n || 0).toLocaleString("he-IL"); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };

  var state = { products: [], categories: [], tab: "products", editing: null };

  function toast(msg) {
    var t = $("#admin-toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- מסכים ---------- */
  function notConfigured() {
    app.innerHTML =
      '<div class="admin-notice"><h2>🔌 צריך לחבר את Supabase קודם</h2>' +
      '<p style="color:var(--ink-soft);margin-bottom:1rem">כדי להפעיל כניסה מאובטחת וניהול אמיתי, יש להשלים הקמה חד-פעמית (כ-5 דקות):</p>' +
      '<ol><li>פתחו פרויקט חינמי ב-<code>supabase.com</code></li>' +
      '<li>הריצו את ה-SQL מתוך <code>ADMIN-SETUP.md</code> (טבלאות + הרשאות + אחסון תמונות)</li>' +
      '<li>צרו משתמש מנהל ב-Authentication → Users</li>' +
      '<li>הדביקו את <code>Project URL</code> ו-<code>anon key</code> בקובץ <code>js/supabase-config.js</code></li>' +
      '<li>רעננו את העמוד הזה והתחברו 🎉</li></ol></div>';
  }

  function loginScreen(errMsg) {
    document.body.classList.add("login-body");
    app.innerHTML =
      '<div class="login-screen"><form class="login-card" id="login-form">' +
      '<img src="images/brand/brazil_logo.png" alt="פרחי ברזיל">' +
      '<span class="lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg> כניסה מאובטחת</span>' +
      '<h1>ניהול האתר</h1><p class="sub">התחברו כדי לנהל מוצרים, קטגוריות ומחירים</p>' +
      '<div class="field"><label for="em">אימייל</label><input class="input" id="em" type="email" autocomplete="username" required placeholder="admin@brazil-flowers.co.il"></div>' +
      '<div class="field"><label for="pw">סיסמה</label><input class="input" id="pw" type="password" autocomplete="current-password" required placeholder="••••••••"></div>' +
      '<button class="btn btn--lg btn--block" type="submit">התחברות</button>' +
      '<div class="login-error">' + (errMsg ? esc(errMsg) : "") + '</div>' +
      '</form></div>';
    $("#login-form").addEventListener("submit", function (e) {
      e.preventDefault();
      doLogin($("#em").value.trim(), $("#pw").value);
    });
  }

  async function doLogin(email, password) {
    var err = $(".login-error"); err.textContent = "מתחבר...";
    var res = await sb.auth.signInWithPassword({ email: email, password: password });
    if (res.error) { err.textContent = "התחברות נכשלה — בדקו אימייל וסיסמה."; return; }
    boot();
  }

  async function logout() { await sb.auth.signOut(); location.reload(); }

  /* ---------- דשבורד ---------- */
  function dashboard(email) {
    document.body.classList.remove("login-body");
    app.innerHTML =
      '<div class="admin-top"><div class="admin-top__bar">' +
      '<div class="admin-top__brand"><img src="images/brand/brazil_logo.png" alt=""> ניהול פרחי ברזיל</div>' +
      '<div class="admin-top__user"><span class="who">' + esc(email || "") + '</span>' +
      '<button class="btn-logout" id="logout"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg> יציאה</button></div>' +
      '</div></div>' +
      '<div class="admin-wrap">' +
      '<div class="tabs"><button class="tab is-active" data-tab="products">מוצרים</button><button class="tab" data-tab="categories">קטגוריות</button></div>' +
      '<div id="tab-body"></div></div>';
    $("#logout").addEventListener("click", logout);
    app.querySelectorAll(".tab").forEach(function (t) {
      t.addEventListener("click", function () {
        app.querySelectorAll(".tab").forEach(function (x) { x.classList.remove("is-active"); });
        t.classList.add("is-active"); state.tab = t.dataset.tab; renderTab();
      });
    });
    renderTab();
  }

  function renderTab() {
    if (state.tab === "products") renderProducts(); else renderCategories();
  }

  /* ---------- מוצרים ---------- */
  function renderProducts() {
    var body = $("#tab-body");
    var cards = state.products.map(function (p) {
      var cat = state.categories.filter(function (c) { return c.key === p.cat; })[0];
      return '<div class="admin-card">' +
        '<div class="admin-card__media"><img src="' + esc(p.img || "") + '" alt="" onerror="this.style.opacity=.2"></div>' +
        '<div class="admin-card__body"><span class="admin-card__cat">' + esc(p.sub || (cat ? cat.name : p.cat || "")) + '</span>' +
        '<span class="admin-card__name">' + esc(p.name) + '</span>' +
        '<span class="admin-card__price">' + fmt(p.price) + (p.was ? '<span class="was">' + fmt(p.was) + '</span>' : "") + '</span></div>' +
        '<div class="admin-card__actions"><button class="edit" data-edit="' + esc(p.id) + '">עריכה</button>' +
        '<button class="del" data-del="' + esc(p.id) + '">מחיקה</button></div></div>';
    }).join("");
    body.innerHTML =
      '<div class="admin-toolbar"><h2>מוצרים (' + state.products.length + ')</h2>' +
      '<div class="actions"><button class="btn btn--ghost btn--sm" id="import">ייבוא קטלוג נוכחי</button>' +
      '<button class="btn btn--sm" id="new-product">+ מוצר חדש</button></div></div>' +
      (state.products.length ? '<div class="admin-grid">' + cards + '</div>' : '<div class="admin-empty">אין מוצרים עדיין. הוסיפו מוצר חדש או ייבאו את הקטלוג הנוכחי.</div>');
    $("#new-product").addEventListener("click", function () { openProductEditor(null); });
    $("#import").addEventListener("click", importCatalog);
    body.querySelectorAll("[data-edit]").forEach(function (b) {
      b.addEventListener("click", function () { openProductEditor(b.dataset.edit); });
    });
    body.querySelectorAll("[data-del]").forEach(function (b) {
      b.addEventListener("click", function () { delProduct(b.dataset.del); });
    });
  }

  function openProductEditor(id) {
    var p = id ? state.products.filter(function (x) { return x.id === id; })[0] : { id: "", name: "", cat: (state.categories[0] || {}).key || "bouquets", sub: "", price: 0, was: null, img: "", badge: "", descr: "" };
    var catOpts = state.categories.map(function (c) { return '<option value="' + esc(c.key) + '"' + (c.key === p.cat ? " selected" : "") + '>' + esc(c.name) + '</option>'; }).join("");
    var badgeOpts = ["", "best", "sale", "new"].map(function (b) {
      var lbl = { "": "ללא", best: "הכי נמכר", sale: "מבצע", "new": "חדש" }[b];
      return '<option value="' + b + '"' + (b === (p.badge || "") ? " selected" : "") + '>' + lbl + '</option>';
    }).join("");
    openModal((id ? "עריכת מוצר" : "מוצר חדש"),
      '<div class="admin-field"><label>שם המוצר</label><input id="f-name" value="' + esc(p.name) + '"></div>' +
      '<div class="admin-field"><label>מזהה (אנגלית, ללא רווחים)</label><input id="f-id" value="' + esc(p.id) + '" placeholder="great-bloom" ' + (id ? "readonly" : "") + '></div>' +
      '<div class="admin-field-row"><div class="admin-field"><label>קטגוריה</label><select id="f-cat">' + catOpts + '</select></div>' +
      '<div class="admin-field"><label>תת-קטגוריה</label><input id="f-sub" value="' + esc(p.sub || "") + '"></div></div>' +
      '<div class="admin-field-row"><div class="admin-field"><label>מחיר (₪)</label><input id="f-price" type="number" value="' + (p.price || 0) + '"></div>' +
      '<div class="admin-field"><label>מחיר לפני מבצע (אופציונלי)</label><input id="f-was" type="number" value="' + (p.was || "") + '"></div></div>' +
      '<div class="admin-field"><label>תגית</label><select id="f-badge">' + badgeOpts + '</select></div>' +
      '<div class="admin-field"><label>תיאור</label><textarea id="f-descr" rows="3">' + esc(p.descr || p.desc || "") + '</textarea></div>' +
      '<div class="admin-field"><label>תמונה</label><div class="img-drop" id="drop">' +
      (p.img ? '<img id="prev" src="' + esc(p.img) + '">' : '<div id="prev"></div>') +
      '<div class="hint">לחצו להעלאת תמונה (תיאור הקובץ באנגלית)</div><input type="file" id="f-file" accept="image/*" hidden></div>' +
      '<input type="hidden" id="f-img" value="' + esc(p.img || "") + '"></div>',
      async function save() {
        var row = {
          id: ($("#f-id").value.trim() || $("#f-name").value.trim().replace(/\s+/g, "-")),
          name: $("#f-name").value.trim(),
          cat: $("#f-cat").value,
          sub: $("#f-sub").value.trim() || null,
          price: parseInt($("#f-price").value) || 0,
          was: $("#f-was").value ? parseInt($("#f-was").value) : null,
          badge: $("#f-badge").value || null,
          descr: $("#f-descr").value.trim() || null,
          img: $("#f-img").value
        };
        if (!row.name) { alert("נא להזין שם מוצר"); return false; }
        var res = await sb.from("products").upsert(row);
        if (res.error) { alert("שמירה נכשלה: " + res.error.message); return false; }
        toast("המוצר נשמר ✓"); await loadProducts(); renderProducts(); return true;
      });
    // image upload wiring
    var drop = $("#drop"), file = $("#f-file");
    drop.addEventListener("click", function () { file.click(); });
    file.addEventListener("change", async function () {
      if (!file.files[0]) return;
      drop.querySelector(".hint").textContent = "מעלה...";
      var url = await uploadImage(file.files[0]);
      if (url) {
        $("#f-img").value = url;
        var prev = $("#prev"); prev.outerHTML = '<img id="prev" src="' + url + '">';
        drop.querySelector(".hint").textContent = "הועלה ✓ — לחצו להחלפה";
      } else { drop.querySelector(".hint").textContent = "העלאה נכשלה"; }
    });
  }

  async function uploadImage(f) {
    var ext = (f.name.split(".").pop() || "jpg").toLowerCase();
    var name = (f.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase() || "image") + "-" + Date.now() + "." + ext;
    var up = await sb.storage.from(BUCKET).upload(name, f, { upsert: true });
    if (up.error) { alert("העלאת תמונה נכשלה: " + up.error.message); return null; }
    return sb.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
  }

  async function delProduct(id) {
    if (!confirm("למחוק את המוצר?")) return;
    var res = await sb.from("products").delete().eq("id", id);
    if (res.error) { alert("מחיקה נכשלה: " + res.error.message); return; }
    toast("נמחק ✓"); await loadProducts(); renderProducts();
  }

  /* ---------- קטגוריות ---------- */
  function renderCategories() {
    var body = $("#tab-body");
    var rows = state.categories.map(function (c) {
      return '<div class="cat-row"><span class="cat-row__name">' + esc(c.name) + '</span>' +
        '<span class="cat-row__subs">' + esc((c.subs || []).join(" · ")) + '</span>' +
        '<button class="btn btn--ghost btn--sm" data-ecat="' + esc(c.key) + '">עריכה</button></div>';
    }).join("");
    body.innerHTML = '<div class="admin-toolbar"><h2>קטגוריות (' + state.categories.length + ')</h2></div>' +
      (state.categories.length ? rows : '<div class="admin-empty">אין קטגוריות. ייבאו את הקטלוג הנוכחי מטאב המוצרים.</div>');
    body.querySelectorAll("[data-ecat]").forEach(function (b) {
      b.addEventListener("click", function () { openCatEditor(b.dataset.ecat); });
    });
  }

  function openCatEditor(key) {
    var c = state.categories.filter(function (x) { return x.key === key; })[0];
    openModal("עריכת קטגוריה",
      '<div class="admin-field"><label>שם הקטגוריה</label><input id="c-name" value="' + esc(c.name) + '"></div>' +
      '<div class="admin-field"><label>תתי-קטגוריות (מופרדות בפסיק)</label><textarea id="c-subs" rows="3">' + esc((c.subs || []).join(", ")) + '</textarea></div>',
      async function save() {
        var row = { key: c.key, name: $("#c-name").value.trim(), page: c.page, blurb: c.blurb || null, hero: c.hero || null,
          subs: $("#c-subs").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean), sort: c.sort || 0 };
        var res = await sb.from("categories").upsert(row);
        if (res.error) { alert("שמירה נכשלה: " + res.error.message); return false; }
        toast("הקטגוריה נשמרה ✓"); await loadCategories(); renderCategories(); return true;
      });
  }

  /* ---------- ייבוא קטלוג נוכחי (מתוך data.js) ---------- */
  async function importCatalog() {
    if (!confirm("לייבא את כל הקטגוריות והמוצרים הקיימים מהאתר אל Supabase?")) return;
    toast("מייבא...");
    var cats = (window.CATEGORIES || []).map(function (c, i) {
      return { key: c.key, name: c.name, page: c.page, blurb: c.blurb || null, hero: c.hero || null, subs: c.subs || [], sort: i };
    });
    var prods = (window.PRODUCTS || []).map(function (p, i) {
      return { id: p.id, name: p.name, cat: p.cat, sub: p.sub || null, price: p.price, was: p.was || null,
        img: p.img, badge: p.badge || null, pos: p.pos || null, descr: p.desc || null, sort: i };
    });
    var r1 = await sb.from("categories").upsert(cats);
    var r2 = await sb.from("products").upsert(prods);
    if (r1.error || r2.error) { alert("ייבוא נכשל: " + ((r1.error || r2.error).message)); return; }
    toast("יובאו " + prods.length + " מוצרים ו-" + cats.length + " קטגוריות ✓");
    await loadAll(); renderTab();
  }

  /* ---------- טעינה ---------- */
  async function loadProducts() {
    var r = await sb.from("products").select("*").order("sort", { ascending: true });
    state.products = r.data || [];
  }
  async function loadCategories() {
    var r = await sb.from("categories").select("*").order("sort", { ascending: true });
    state.categories = (r.data || []).map(function (c) { return { key: c.key, name: c.name, page: c.page, blurb: c.blurb, hero: c.hero, subs: c.subs || [], sort: c.sort }; });
  }
  async function loadAll() { await Promise.all([loadCategories(), loadProducts()]); }

  /* ---------- מודאל גנרי ---------- */
  function openModal(title, html, onSave) {
    var m = $("#admin-modal");
    m.querySelector(".modal__title").textContent = title;
    m.querySelector(".modal__content").innerHTML = html;
    m.classList.add("is-open");
    var saveBtn = m.querySelector(".modal__save");
    saveBtn.onclick = async function () { saveBtn.disabled = true; var ok = await onSave(); saveBtn.disabled = false; if (ok !== false) closeModal(); };
  }
  function closeModal() { $("#admin-modal").classList.remove("is-open"); }

  /* ---------- boot ---------- */
  async function boot() {
    var ses = await sb.auth.getSession();
    if (ses.data && ses.data.session) {
      await loadAll();
      dashboard(ses.data.session.user.email);
    } else {
      loginScreen();
    }
  }

  function start() {
    // build modal shell once
    var modal = document.createElement("div");
    modal.id = "admin-modal"; modal.className = "modal";
    modal.innerHTML = '<div class="modal__scrim"></div><div class="modal__panel"><div class="modal__head"><h3 class="modal__title"></h3>' +
      '<button class="modal__close" aria-label="סגירה">✕</button></div><div class="modal__content"></div>' +
      '<div class="modal__foot"><button class="btn btn--ghost modal__cancel">ביטול</button><button class="btn modal__save">שמירה</button></div></div>';
    document.body.appendChild(modal);
    modal.querySelector(".modal__scrim").addEventListener("click", closeModal);
    modal.querySelector(".modal__close").addEventListener("click", closeModal);
    modal.querySelector(".modal__cancel").addEventListener("click", closeModal);
    var toastEl = document.createElement("div"); toastEl.id = "admin-toast"; toastEl.className = "toast-ok"; document.body.appendChild(toastEl);

    if (!configured || !sb) { notConfigured(); return; }
    boot();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
