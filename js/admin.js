/* ============================================================
   פרחי ברזיל — לוגיקת פאנל הניהול
   שני מצבים אוטומטיים:
   • מחובר Supabase  → כניסה מאובטחת אמיתית + מסד נתונים בענן (RLS).
   • לא מחובר        → מצב מקומי: סיסמה + שמירה בדפדפן + ייצוא.
   ============================================================ */
(function () {
  "use strict";
  var cfg = window.SUPABASE_CONFIG || {};
  var SUPA = !!(cfg.url && cfg.anonKey && window.supabase);
  var sb = SUPA ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;
  var BUCKET = "product-images";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var app = document.getElementById("admin-app");
  var fmt = function (n) { return "₪" + Number(n || 0).toLocaleString("he-IL"); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };
  var state = { products: [], categories: [] };

  function toast(msg) { var t = $("#admin-toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove("show"); }, 2400); }

  /* ===================== STORE — שכבת נתונים ===================== */
  var LP = "bf_local_products_v1", LC = "bf_local_categories_v1", LPASS = "bf_admin_pass_v1", LSESS = "bf_admin_session";
  function lget(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lset(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  function seedProducts() { return (window.PRODUCTS || []).map(function (p) { return { id: p.id, name: p.name, cat: p.cat, sub: p.sub || null, price: p.price, was: p.was || null, img: p.img, badge: p.badge || null, pos: p.pos || null, descr: p.desc || null }; }); }
  function seedCategories() { return (window.CATEGORIES || []).map(function (c, i) { return { key: c.key, name: c.name, page: c.page, blurb: c.blurb || null, hero: c.hero || null, subs: c.subs || [], sort: i }; }); }

  var store = SUPA ? {
    mode: "supabase",
    signIn: function (email, pass) { return sb.auth.signInWithPassword({ email: email, password: pass }).then(function (r) { return !r.error; }); },
    session: function () { return sb.auth.getSession().then(function (r) { return r.data && r.data.session ? { email: r.data.session.user.email } : null; }); },
    signOut: function () { return sb.auth.signOut(); },
    load: function () {
      return Promise.all([sb.from("products").select("*").order("sort", { ascending: true }), sb.from("categories").select("*").order("sort", { ascending: true })])
        .then(function (r) { state.products = r[0].data || []; state.categories = (r[1].data || []).map(function (c) { return { key: c.key, name: c.name, page: c.page, blurb: c.blurb, hero: c.hero, subs: c.subs || [], sort: c.sort }; }); });
    },
    saveProduct: function (row) { return sb.from("products").upsert(row); },
    delProduct: function (id) { return sb.from("products").delete().eq("id", id); },
    saveCategory: function (row) { return sb.from("categories").upsert(row); },
    upload: async function (file) { var n = imgName(file); var up = await sb.storage.from(BUCKET).upload(n, file, { upsert: true }); if (up.error) return { error: up.error.message }; return { url: sb.storage.from(BUCKET).getPublicUrl(n).data.publicUrl }; },
    importAll: async function () { var r1 = await sb.from("categories").upsert(seedCategories()); var r2 = await sb.from("products").upsert(seedProducts()); return (r1.error || r2.error) ? { error: (r1.error || r2.error).message } : {}; },
    canExport: false
  } : {
    mode: "local",
    signIn: function (email, pass) {
      var stored = localStorage.getItem(LPASS);
      if (!stored) { localStorage.setItem(LPASS, pass); sessionStorage.setItem(LSESS, "1"); return Promise.resolve(true); }
      if (pass === stored) { sessionStorage.setItem(LSESS, "1"); return Promise.resolve(true); }
      return Promise.resolve(false);
    },
    session: function () { return Promise.resolve(sessionStorage.getItem(LSESS) ? { email: "מנהל (מצב מקומי)" } : null); },
    signOut: function () { sessionStorage.removeItem(LSESS); return Promise.resolve(); },
    load: function () {
      if (!localStorage.getItem(LP)) { lset(LP, seedProducts()); lset(LC, seedCategories()); }
      state.products = lget(LP, []); state.categories = lget(LC, []);
      return Promise.resolve();
    },
    saveProduct: function (row) { var a = lget(LP, []); var i = a.findIndex(function (p) { return p.id === row.id; }); if (i >= 0) a[i] = row; else a.push(row); try { lset(LP, a); } catch (e) { return Promise.resolve({ error: "אין מקום בדפדפן — התמונה כנראה גדולה מדי. השתמשו בקישור תמונה או חברו Supabase." }); } return Promise.resolve({}); },
    delProduct: function (id) { lset(LP, lget(LP, []).filter(function (p) { return p.id !== id; })); return Promise.resolve({}); },
    saveCategory: function (row) { var a = lget(LC, []); var i = a.findIndex(function (c) { return c.key === row.key; }); if (i >= 0) a[i] = row; else a.push(row); lset(LC, a); return Promise.resolve({}); },
    upload: async function (file) { try { var url = await downscale(file, 1000); return { url: url }; } catch (e) { return { error: "טעינת התמונה נכשלה" }; } },
    importAll: function () { lset(LP, seedProducts()); lset(LC, seedCategories()); return Promise.resolve({}); },
    canExport: true
  };

  function imgName(f) { var ext = (f.name.split(".").pop() || "jpg").toLowerCase(); return (f.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase() || "image") + "-" + Date.now() + "." + ext; }
  function downscale(file, max) {
    return new Promise(function (res, rej) {
      var img = new Image(); img.onload = function () {
        var w = img.width, h = img.height; if (w > max || h > max) { if (w > h) { h = Math.round(h * max / w); w = max; } else { w = Math.round(w * max / h); h = max; } }
        var c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(img, 0, 0, w, h);
        res(c.toDataURL("image/jpeg", 0.85));
      }; img.onerror = rej; img.src = URL.createObjectURL(file);
    });
  }

  /* ===================== מסכים ===================== */
  function loginScreen(err) {
    document.body.classList.add("login-body");
    var localHint = store.mode === "local"
      ? '<span class="lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg> מצב מקומי</span><p class="sub">' + (localStorage.getItem(LPASS) ? 'הזינו את סיסמת הניהול' : 'התחברות ראשונה — הסיסמה שתזינו תיקבע כסיסמת הניהול') + '</p>'
      : '<span class="lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg> כניסה מאובטחת</span><p class="sub">התחברו כדי לנהל מוצרים, קטגוריות ומחירים</p>';
    app.innerHTML = '<div class="login-screen"><form class="login-card" id="login-form">' +
      '<img src="images/brand/brazil_logo.png" alt="פרחי ברזיל"><h1>ניהול האתר</h1>' + localHint +
      (store.mode === "supabase" ? '<div class="field"><label for="em">אימייל</label><input class="input" id="em" type="email" autocomplete="username" required placeholder="admin@brazil-flowers.co.il"></div>' : '<input id="em" type="hidden" value="local@admin">') +
      '<div class="field"><label for="pw">סיסמה</label><input class="input" id="pw" type="password" autocomplete="current-password" required placeholder="••••••••"></div>' +
      '<button class="btn btn--lg btn--block" type="submit">' + (store.mode === "local" && !localStorage.getItem(LPASS) ? "כניסה וקביעת סיסמה" : "התחברות") + '</button>' +
      '<div class="login-error">' + (err ? esc(err) : "") + '</div></form></div>';
    $("#login-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      var ok = await store.signIn(($("#em").value || "").trim(), $("#pw").value);
      if (ok) boot(); else $(".login-error").textContent = store.mode === "supabase" ? "התחברות נכשלה — בדקו אימייל וסיסמה." : "סיסמה שגויה.";
    });
  }

  function dashboard(email) {
    document.body.classList.remove("login-body");
    var banner = store.mode === "local"
      ? '<div class="admin-banner">⚠️ <b>מצב מקומי</b> — השינויים נשמרים בדפדפן זה. כדי שיעלו לאוויר לכל הגולשים: חברו Supabase (ADMIN-SETUP.md) או לחצו „ייצוא קטלוג”.</div>'
      : '<div class="admin-banner ok">✓ מחובר ל-Supabase — שינויים מתעדכנים מיד באתר.</div>';
    app.innerHTML =
      '<div class="admin-top"><div class="admin-top__bar"><div class="admin-top__brand"><img src="images/brand/brazil_logo.png" alt=""> ניהול פרחי ברזיל</div>' +
      '<div class="admin-top__user"><span class="who">' + esc(email || "") + '</span><button class="btn-logout" id="logout">יציאה</button></div></div></div>' +
      '<div class="admin-wrap">' + banner +
      '<div class="tabs"><button class="tab is-active" data-tab="products">מוצרים</button><button class="tab" data-tab="categories">קטגוריות</button><button class="tab" data-tab="promos">מבצעים</button></div><div id="tab-body"></div></div>';
    $("#logout").addEventListener("click", function () { store.signOut().then(function () { location.reload(); }); });
    state.tab = "products";
    app.querySelectorAll(".tab").forEach(function (t) { t.addEventListener("click", function () { app.querySelectorAll(".tab").forEach(function (x) { x.classList.remove("is-active"); }); t.classList.add("is-active"); state.tab = t.dataset.tab; renderTab(); }); });
    renderTab();
  }
  function renderTab() { if (state.tab === "products") renderProducts(); else if (state.tab === "categories") renderCategories(); else renderPromos(); }

  /* ----- מבצעים ----- */
  function renderPromos() {
    var body = $("#tab-body");
    var rows = state.products.map(function (p) {
      var onSale = p.was && p.was > p.price;
      var pct = onSale ? Math.round((1 - p.price / p.was) * 100) : 0;
      var ctrl = onSale
        ? '<div class="promo-ctrl on"><span class="promo-badge">−' + pct + '%</span><span class="promo-prices"><b>' + fmt(p.price) + '</b> <s>' + fmt(p.was) + '</s></span><button class="btn btn--ghost btn--sm" data-promo-off="' + esc(p.id) + '">ביטול מבצע</button></div>'
        : '<div class="promo-ctrl"><span class="muted">מחיר: ' + fmt(p.price) + '</span><input type="number" class="promo-pct input" min="1" max="90" placeholder="% הנחה" data-id="' + esc(p.id) + '"><button class="btn btn--sm" data-promo-on="' + esc(p.id) + '">הפעלת מבצע</button></div>';
      return '<div class="promo-row"><div class="promo-row__img"><img src="' + esc(p.img || "") + '" alt="" onerror="this.style.opacity=.2"></div><div class="promo-row__name">' + esc(p.name) + '</div>' + ctrl + '</div>';
    }).join("");
    var saleCount = state.products.filter(function (p) { return p.was && p.was > p.price; }).length;
    body.innerHTML = '<div class="admin-toolbar"><h2>מבצעים <span class="muted" style="font-weight:400">(' + saleCount + ' פעילים)</span></h2></div>' +
      '<p class="muted" style="margin-bottom:1.1rem">קבעו אחוז הנחה למוצר — המחיר המקורי יוצג מחוק, תופיע תגית „מבצע” והמוצר ישולב בקרוסלת „רבי המכר”.</p>' +
      '<div class="promo-list">' + rows + '</div>';
    body.querySelectorAll("[data-promo-on]").forEach(function (b) { b.addEventListener("click", function () { setSale(b.dataset.promoOn); }); });
    body.querySelectorAll("[data-promo-off]").forEach(function (b) { b.addEventListener("click", function () { clearSale(b.dataset.promoOff); }); });
    body.querySelectorAll(".promo-pct").forEach(function (i) { i.addEventListener("keydown", function (e) { if (e.key === "Enter") setSale(i.dataset.id); }); });
  }
  function prodRow(p, over) { return Object.assign({ id: p.id, name: p.name, cat: p.cat, sub: p.sub || null, price: p.price, was: p.was || null, badge: p.badge || null, pos: p.pos || null, descr: p.descr || p.desc || null, img: p.img }, over); }
  async function setSale(id) {
    var p = state.products.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    var inp = $('.promo-pct[data-id="' + id + '"]'); var pct = parseInt(inp && inp.value);
    if (!pct || pct < 1 || pct > 90) { alert("הזינו אחוז הנחה בין 1 ל-90"); return; }
    var regular = (p.was && p.was > p.price) ? p.was : p.price;
    var r = await store.saveProduct(prodRow(p, { price: Math.round(regular * (1 - pct / 100)), was: regular, badge: "sale" }));
    if (r && r.error) { alert(r.error); return; }
    toast("המבצע הופעל ✓"); await store.load(); renderPromos();
  }
  async function clearSale(id) {
    var p = state.products.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    var r = await store.saveProduct(prodRow(p, { price: p.was || p.price, was: null, badge: p.badge === "sale" ? null : p.badge }));
    if (r && r.error) { alert(r.error); return; }
    toast("המבצע בוטל ✓"); await store.load(); renderPromos();
  }

  /* ----- מוצרים ----- */
  function renderProducts() {
    var body = $("#tab-body");
    var cards = state.products.map(function (p) {
      var cat = state.categories.filter(function (c) { return c.key === p.cat; })[0];
      return '<div class="admin-card"><div class="admin-card__media"><img src="' + esc(p.img || "") + '" alt="" onerror="this.style.opacity=.2"></div>' +
        '<div class="admin-card__body"><span class="admin-card__cat">' + esc(p.sub || (cat ? cat.name : p.cat || "")) + '</span><span class="admin-card__name">' + esc(p.name) + '</span>' +
        '<span class="admin-card__price">' + fmt(p.price) + (p.was ? '<span class="was">' + fmt(p.was) + '</span>' : "") + '</span></div>' +
        '<div class="admin-card__actions"><button class="edit" data-edit="' + esc(p.id) + '">עריכה</button><button class="del" data-del="' + esc(p.id) + '">מחיקה</button></div></div>';
    }).join("");
    body.innerHTML = '<div class="admin-toolbar"><h2>מוצרים (' + state.products.length + ')</h2><div class="actions">' +
      '<button class="btn btn--ghost btn--sm" id="import">ייבוא קטלוג נוכחי</button>' +
      (store.canExport ? '<button class="btn btn--ghost btn--sm" id="export">ייצוא קטלוג</button>' : "") +
      '<button class="btn btn--sm" id="new-product">+ מוצר חדש</button></div></div>' +
      (state.products.length ? '<div class="admin-grid">' + cards + '</div>' : '<div class="admin-empty">אין מוצרים. הוסיפו מוצר או ייבאו את הקטלוג הנוכחי.</div>');
    $("#new-product").addEventListener("click", function () { openProductEditor(null); });
    $("#import").addEventListener("click", importCatalog);
    if ($("#export")) $("#export").addEventListener("click", exportCatalog);
    body.querySelectorAll("[data-edit]").forEach(function (b) { b.addEventListener("click", function () { openProductEditor(b.dataset.edit); }); });
    body.querySelectorAll("[data-del]").forEach(function (b) { b.addEventListener("click", function () { delProduct(b.dataset.del); }); });
  }

  function openProductEditor(id) {
    var p = id ? state.products.filter(function (x) { return x.id === id; })[0] : { id: "", name: "", cat: (state.categories[0] || {}).key || "bouquets", sub: "", price: 0, was: null, img: "", badge: "", descr: "" };
    var catOpts = state.categories.map(function (c) { return '<option value="' + esc(c.key) + '"' + (c.key === p.cat ? " selected" : "") + '>' + esc(c.name) + '</option>'; }).join("");
    var badgeOpts = ["", "best", "sale", "new"].map(function (b) { var l = { "": "ללא", best: "הכי נמכר", sale: "מבצע", "new": "חדש" }[b]; return '<option value="' + b + '"' + (b === (p.badge || "") ? " selected" : "") + '>' + l + '</option>'; }).join("");
    openModal(id ? "עריכת מוצר" : "מוצר חדש",
      '<div class="admin-field"><label>שם המוצר</label><input id="f-name" value="' + esc(p.name) + '"></div>' +
      '<div class="admin-field"><label>מזהה (אנגלית, ללא רווחים)</label><input id="f-id" value="' + esc(p.id) + '" placeholder="great-bloom" ' + (id ? "readonly" : "") + '></div>' +
      '<div class="admin-field-row"><div class="admin-field"><label>קטגוריה</label><select id="f-cat">' + catOpts + '</select></div><div class="admin-field"><label>תת-קטגוריה</label><input id="f-sub" value="' + esc(p.sub || "") + '"></div></div>' +
      '<div class="admin-field-row"><div class="admin-field"><label>מחיר (₪)</label><input id="f-price" type="number" value="' + (p.price || 0) + '"></div><div class="admin-field"><label>מחיר לפני מבצע</label><input id="f-was" type="number" value="' + (p.was || "") + '"></div></div>' +
      '<div class="admin-field"><label>תגית</label><select id="f-badge">' + badgeOpts + '</select></div>' +
      '<div class="admin-field"><label>תיאור</label><textarea id="f-descr" rows="3">' + esc(p.descr || p.desc || "") + '</textarea></div>' +
      '<div class="admin-field"><label>תמונה</label><div class="img-drop" id="drop">' + (p.img ? '<img id="prev" src="' + esc(p.img) + '">' : '<div id="prev"></div>') + '<div class="hint">לחצו להעלאת תמונה</div><input type="file" id="f-file" accept="image/*" hidden></div><input type="hidden" id="f-img" value="' + esc(p.img || "") + '"></div>',
      async function () {
        var row = { id: ($("#f-id").value.trim() || $("#f-name").value.trim().replace(/\s+/g, "-")), name: $("#f-name").value.trim(), cat: $("#f-cat").value, sub: $("#f-sub").value.trim() || null, price: parseInt($("#f-price").value) || 0, was: $("#f-was").value ? parseInt($("#f-was").value) : null, badge: $("#f-badge").value || null, descr: $("#f-descr").value.trim() || null, pos: p.pos || null, img: $("#f-img").value };
        if (!row.name) { alert("נא להזין שם מוצר"); return false; }
        var r = await store.saveProduct(row); if (r && r.error) { alert("שמירה נכשלה: " + r.error); return false; }
        toast("המוצר נשמר ✓"); await store.load(); renderProducts(); return true;
      });
    var drop = $("#drop"), file = $("#f-file");
    drop.addEventListener("click", function () { file.click(); });
    file.addEventListener("change", async function () {
      if (!file.files[0]) return; drop.querySelector(".hint").textContent = "מעלה...";
      var r = await store.upload(file.files[0]);
      if (r.url) { $("#f-img").value = r.url; $("#prev").outerHTML = '<img id="prev" src="' + r.url + '">'; drop.querySelector(".hint").textContent = "הועלה ✓ — לחצו להחלפה"; }
      else { drop.querySelector(".hint").textContent = r.error || "העלאה נכשלה"; }
    });
  }

  async function delProduct(id) { if (!confirm("למחוק את המוצר?")) return; var r = await store.delProduct(id); if (r && r.error) { alert(r.error); return; } toast("נמחק ✓"); await store.load(); renderProducts(); }

  /* ----- קטגוריות ----- */
  function renderCategories() {
    var body = $("#tab-body");
    var rows = state.categories.map(function (c) { return '<div class="cat-row"><span class="cat-row__name">' + esc(c.name) + '</span><span class="cat-row__subs">' + esc((c.subs || []).join(" · ")) + '</span><button class="btn btn--ghost btn--sm" data-ecat="' + esc(c.key) + '">עריכה</button></div>'; }).join("");
    body.innerHTML = '<div class="admin-toolbar"><h2>קטגוריות (' + state.categories.length + ')</h2></div>' + (state.categories.length ? rows : '<div class="admin-empty">אין קטגוריות. ייבאו את הקטלוג הנוכחי מטאב המוצרים.</div>');
    body.querySelectorAll("[data-ecat]").forEach(function (b) { b.addEventListener("click", function () { openCatEditor(b.dataset.ecat); }); });
  }
  function openCatEditor(key) {
    var c = state.categories.filter(function (x) { return x.key === key; })[0];
    openModal("עריכת קטגוריה",
      '<div class="admin-field"><label>שם הקטגוריה</label><input id="c-name" value="' + esc(c.name) + '"></div><div class="admin-field"><label>תתי-קטגוריות (מופרדות בפסיק)</label><textarea id="c-subs" rows="3">' + esc((c.subs || []).join(", ")) + '</textarea></div>',
      async function () {
        var row = { key: c.key, name: $("#c-name").value.trim(), page: c.page, blurb: c.blurb || null, hero: c.hero || null, subs: $("#c-subs").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean), sort: c.sort || 0 };
        var r = await store.saveCategory(row); if (r && r.error) { alert("שמירה נכשלה: " + r.error); return false; }
        toast("הקטגוריה נשמרה ✓"); await store.load(); renderCategories(); return true;
      });
  }

  /* ----- ייבוא / ייצוא ----- */
  async function importCatalog() {
    if (!confirm("לייבא מחדש את כל הקטלוג מהאתר? (ידרוס שינויים מקומיים)")) return;
    toast("מייבא..."); var r = await store.importAll(); if (r && r.error) { alert("ייבוא נכשל: " + r.error); return; }
    await store.load(); renderTab(); toast("הקטלוג יובא ✓");
  }
  function exportCatalog() {
    var data = { products: lget(LP, []), categories: lget(LC, []), exportedFrom: "brazil-flowers local admin" };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "brazil-flowers-catalog.json"; a.click();
    toast("הקובץ ירד ✓ — שלחו אותו כדי לעדכן את האתר");
  }

  /* ----- מודאל ----- */
  function openModal(title, html, onSave) {
    var m = $("#admin-modal"); m.querySelector(".modal__title").textContent = title; m.querySelector(".modal__content").innerHTML = html; m.classList.add("is-open");
    var btn = m.querySelector(".modal__save"); btn.onclick = async function () { btn.disabled = true; var ok = await onSave(); btn.disabled = false; if (ok !== false) closeModal(); };
  }
  function closeModal() { $("#admin-modal").classList.remove("is-open"); }

  /* ----- boot ----- */
  async function boot() { var s = await store.session(); if (s) { await store.load(); dashboard(s.email); } else { loginScreen(); } }

  function start() {
    var modal = document.createElement("div"); modal.id = "admin-modal"; modal.className = "modal";
    modal.innerHTML = '<div class="modal__scrim"></div><div class="modal__panel"><div class="modal__head"><h3 class="modal__title"></h3><button class="modal__close" aria-label="סגירה">✕</button></div><div class="modal__content"></div><div class="modal__foot"><button class="btn btn--ghost modal__cancel">ביטול</button><button class="btn modal__save">שמירה</button></div></div>';
    document.body.appendChild(modal);
    modal.querySelector(".modal__scrim").addEventListener("click", closeModal);
    modal.querySelector(".modal__close").addEventListener("click", closeModal);
    modal.querySelector(".modal__cancel").addEventListener("click", closeModal);
    var t = document.createElement("div"); t.id = "admin-toast"; t.className = "toast-ok"; document.body.appendChild(t);
    boot();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
