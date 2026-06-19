/* ============================================================
   פרחי ברזיל — לוגיקת אתר משותפת
   header / footer / גריד מוצרים / עגלה / אינטראקציות
   ============================================================ */
(function () {
  "use strict";

  /* ---------- אייקונים (SVG, currentColor) ---------- */
  const I = {
    menu:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
    close:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
    cart:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.2L21 8H6"/><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>`,
    search:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>`,
    heart:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.6-9.3-9.2C1.1 7.6 2.7 4.5 6 4.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.3 0 4.9 3.1 3.3 6.3C19 15.4 12 20 12 20Z"/></svg>`,
    user:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>`,
    arrowL:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5m6-7-7 7 7 7"/></svg>`,
    chevL:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>`,
    chevD:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
    check:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 6"/></svg>`,
    plus:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
    star:`<svg class="ic" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.9 6.6 19l1.2-6L3.3 8.8l6.1-.7z"/></svg>`,
    truck:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>`,
    leaf:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c0-9 6-15 16-15 0 10-6 16-15 16-1 0-1 0-1-1Z"/><path d="M9 15c2.5-2.5 5-4 9-5"/></svg>`,
    calendar:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>`,
    shield:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3.4 8.4-7 9.7C8.4 19.4 5 16 5 11V6z"/><path d="m9 12 2 2 4-4"/></svg>`,
    clock:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>`,
    pin:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>`,
    phone:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h3l1.5 5-2 1.2a13 13 0 0 0 6.3 6.3l1.2-2 5 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z"/></svg>`,
    mail:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>`,
    whatsapp:`<svg class="ic" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5-.3.3c-.2.2-.3.4-.2.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.5-.1l.7-.9c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.1.1.6-.1 1.2Z"/></svg>`,
    instagram:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/></svg>`,
    facebook:`<svg class="ic" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V7.5c0-.7.3-1.1 1.2-1.1H17V3.2C16.4 3.1 15.4 3 14.3 3 11.9 3 10.3 4.5 10.3 7.2V9H7.7v3.3h2.6V21h3.7v-8.7h2.6l.4-3.3H14Z"/></svg>`,
    waze:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4a7 7 0 0 1 7 7c0 1 .4 2 1 2.6-1.2 1.4-3 2.4-5 2.4H9a5 5 0 0 1-5-5v-.5A6.5 6.5 0 0 1 12 4Z"/><circle cx="9.5" cy="10.5" r=".8" fill="currentColor"/><circle cx="14.5" cy="10.5" r=".8" fill="currentColor"/><path d="M8 19v1M15 19v1"/></svg>`,
    sparkle:`<svg class="ic" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z"/></svg>`,
    gift:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7S11 3 8.5 3 6 6 6 7M12 7s1-4 3.5-4S18 6 18 7"/></svg>`,
    refresh:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 8a8 8 0 0 0-14-2M4 6v3h3M4 16a8 8 0 0 0 14 2m2-2v-3h-3"/></svg>`,
    chat:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/></svg>`,
    paperPlane:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 2.6 9 21l3.3-7.7L21 9.4z"/><path d="M2.6 2.6 12.3 13.3"/></svg>`
  };

  const fmt = n => "₪" + Number(n).toLocaleString("he-IL");
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  /* ---------- עגלת קניות (localStorage) ---------- */
  const CART_KEY = "bf_cart_v1";
  const Cart = {
    get(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e){ return []; } },
    save(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateBadge(); },
    count(){ return this.get().reduce((s,i)=>s+i.qty,0); },
    total(){ return this.get().reduce((s,i)=>s+i.price*i.qty,0); },
    add(id, opts={}){
      const p = (window.PRODUCTS||[]).find(x=>x.id===id); if(!p) return;
      const c = this.get();
      const key = id + (opts.size||"");
      const line = c.find(x=>x.key===key);
      if(line) line.qty += (opts.qty||1);
      else c.push({ key, id, name:p.name, price:opts.price||p.price, img:p.img, size:opts.size||"", qty:opts.qty||1 });
      this.save(c); toast(`${p.name} נוסף לעגלה`);
    },
    remove(key){ this.save(this.get().filter(x=>x.key!==key)); },
    setQty(key, q){ const c=this.get(); const l=c.find(x=>x.key===key); if(l){ l.qty=Math.max(1,q); this.save(c);} }
  };
  function updateBadge(){
    const n = Cart.count();
    $$(".cart-count").forEach(b=>{ b.textContent = n; b.classList.toggle("is-visible", n>0); });
  }

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg){
    let t = $("#bf-toast");
    if(!t){ t = document.createElement("div"); t.id="bf-toast"; document.body.appendChild(t);
      Object.assign(t.style,{position:"fixed",insetInlineStart:"50%",insetBlockEnd:"24px",transform:"translateX(50%) translateY(20px)",
        background:"var(--ink)",color:"#fff",padding:".85rem 1.4rem",borderRadius:"100px",fontWeight:"600",fontSize:".92rem",
        zIndex:"500",opacity:"0",transition:"all .4s cubic-bezier(.16,1,.3,1)",boxShadow:"0 20px 40px -15px rgba(0,0,0,.4)",display:"flex",gap:".5rem",alignItems:"center"});
    }
    t.innerHTML = I.check + "<span>"+msg+"</span>";
    requestAnimationFrame(()=>{ t.style.opacity="1"; t.style.transform="translateX(50%) translateY(0)"; });
    clearTimeout(toastT);
    toastT = setTimeout(()=>{ t.style.opacity="0"; t.style.transform="translateX(50%) translateY(20px)"; }, 2200);
  }

  /* ---------- HEADER ---------- */
  function buildHeader(){
    const active = document.body.dataset.page || "";
    const transparent = document.body.dataset.header === "transparent";

    const logo = `
      <a class="site-header__logo" href="index.html" aria-label="${BIZ.name} — דף הבית">
        <img class="site-header__logo-img" src="images/brand/brazil_logo.png" alt="${BIZ.name}">
      </a>`;

    const nav = `<nav class="nav" aria-label="ניווט ראשי">
      ${window.CATEGORIES.map(c=>{
        const list = (c.subs||[]);
        const cards = list.map(s=>{
          const p = (window.PRODUCTS||[]).find(pr=>pr.cat===c.key && pr.sub===s);
          const img = (p && p.img) ? p.img : (c.hero||"");
          const pos = (p && p.pos) ? p.pos : "center";
          return `<a class="nav__card" href="${c.page}?sub=${encodeURIComponent(s)}">
              <span class="nav__card-media"><img src="${img}" alt="" loading="lazy" style="object-position:${pos}"></span>
              <span class="nav__card-name">${s}</span>
            </a>`;
        }).join("");
        const hasMenu = list.length > 0;
        return `<div class="nav__item">
          <a class="nav__link" href="${c.page}" ${c.key===active?'aria-current="page"':''}>${c.name}${hasMenu?`<span class="nav__chev">${I.chevD}</span>`:""}</a>
          ${hasMenu?`<div class="nav__menu"><div class="nav__menu-inner">
            <div class="nav__mega-head"><span class="nav__mega-title">${c.name}</span><a class="nav__mega-all" href="${c.page}">כל המוצרים</a></div>
            <div class="nav__cards">${cards}</div>
          </div></div>`:""}
        </div>`;
      }).join("")}
    </nav>`;

    const menuToggle = `<button class="menu-toggle" aria-label="תפריט" aria-expanded="false">${I.menu}</button>`;

    const actions = `<div class="site-header__actions">
      <button class="icon-btn" aria-label="חיפוש">${I.search}</button>
      <a class="icon-btn" href="cart.html" aria-label="עגלת קניות">${I.cart}<span class="cart-count">0</span></a>
      <a class="btn btn--sm site-header__contact" href="contact.html">יצירת קשר ${I.paperPlane}</a>
    </div>`;

    const topbar = `<div class="topbar">
      <div class="container topbar__inner">
        <span>🚚 משלוח היום! הזמינו עד ${BIZ.cutoff} וקבלו עוד היום · פתוחים 7 ימים בשבוע</span>
      </div></div>`;

    const header = document.createElement("header");
    header.className = "site-header " + (transparent ? "site-header--transparent" : "is-scrolled is-solid");
    header.innerHTML = topbar + `<div class="container"><div class="site-header__bar"><div class="site-header__lead">${menuToggle}${logo}</div>${nav}${actions}</div></div>`;

    // Drawer (mobile) — אקורדיון קטגוריות עם תמונות לכל תת-קטגוריה
    const drawerCats = window.CATEGORIES.map(c=>{
      const subs = (c.subs||[]).map(s=>{
        const p = (window.PRODUCTS||[]).find(pr=>pr.cat===c.key && pr.sub===s);
        const img = (p && p.img) ? p.img : (c.hero||"");
        const pos = (p && p.pos) ? p.pos : "center";
        return `<a class="drawer__sub" href="${c.page}?sub=${encodeURIComponent(s)}">
            <span class="drawer__sub-media"><img src="${img}" alt="" loading="lazy" style="object-position:${pos}"></span>
            <span class="drawer__sub-name">${s}</span>
          </a>`;
      }).join("");
      const isOpen = c.key===active;
      return `<div class="drawer__cat${isOpen?' is-open':''}">
        <button class="drawer__cat-head" type="button" aria-expanded="${isOpen?'true':'false'}"><span>${c.name}</span><span class="drawer__cat-chev">${I.chevD}</span></button>
        <div class="drawer__cat-panel"><div class="drawer__cat-inner">
          <div class="drawer__cat-grid">${subs}</div>
          <a class="drawer__cat-all" href="${c.page}">לכל המוצרים ב${c.name}</a>
        </div></div>
      </div>`;
    }).join("");
    const drawer = document.createElement("div");
    drawer.className = "drawer"; drawer.id = "drawer";
    drawer.innerHTML = `
      <div class="drawer__scrim" data-close></div>
      <div class="drawer__panel">
        <div class="drawer__head">${logo}<button class="icon-btn" data-close aria-label="סגירה">${I.close}</button></div>
        <nav class="drawer__nav">
          ${drawerCats}
          <a class="drawer__nav-extra" href="contact.html">יצירת קשר ${I.paperPlane}</a>
        </nav>
        <div class="drawer__foot">
          <a class="btn btn--block" href="${BIZ.whatsappHref}" target="_blank" rel="noopener">${I.whatsapp} הזמנה מהירה בוואטסאפ</a>
          <div class="drawer__copy">© 2026 כל הזכויות שמורות ל-${BIZ.name}</div>
        </div>
      </div>`;

    document.body.prepend(drawer);
    document.body.prepend(header);

    // interactions
    const mt = header.querySelector(".menu-toggle");
    mt.addEventListener("click", ()=>{ drawer.classList.add("is-open"); mt.setAttribute("aria-expanded","true"); document.body.style.overflow="hidden"; });
    drawer.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click", closeDrawer));
    // אקורדיון: פתיחה/סגירה של קטגוריה בלחיצה
    drawer.querySelectorAll(".drawer__cat-head").forEach(b=>b.addEventListener("click", ()=>{
      const cat = b.closest(".drawer__cat");
      const open = cat.classList.toggle("is-open");
      b.setAttribute("aria-expanded", open ? "true" : "false");
    }));
    function closeDrawer(){ drawer.classList.remove("is-open"); mt.setAttribute("aria-expanded","false"); document.body.style.overflow=""; }
    // סגירת תפריט הטלפון אוטומטית במעבר לתצוגת מחשב
    window.addEventListener("resize", ()=>{ if(window.innerWidth > 860 && drawer.classList.contains("is-open")) closeDrawer(); }, {passive:true});

    // scroll behavior
    if(transparent){
      let last = 0;
      const onScroll = ()=>{
        const y = window.scrollY;
        header.classList.toggle("is-scrolled", y > window.innerHeight*0.7);
        last = y;
      };
      window.addEventListener("scroll", onScroll, {passive:true});
      onScroll();
    }
    // ההאדר קבוע וגלוי תמיד בכל הדפים (ללא הסתרה בגלילה)
  }

  /* ---------- FOOTER ---------- */
  function buildFooter(){
    const quick = [
      {n:"דף הבית",p:"index.html"},{n:"זרים",p:"bouquets.html"},{n:"סידורי פרחים",p:"arrangements.html"},
      {n:"מתנות",p:"gifts.html"},{n:"עציצים",p:"plants.html"}
    ];
    const service = [
      {n:"אזורי חלוקה",p:"contact.html#delivery"},{n:"סטטוס הזמנה",p:"contact.html"},{n:"יצירת קשר",p:"contact.html"},
      {n:"שאלות נפוצות",p:"contact.html#faq"},{n:"אודות",p:"about.html"}
    ];
    const f = document.createElement("footer");
    f.className = "site-footer";
    f.innerHTML = `
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a class="footer-logo" href="index.html" aria-label="${BIZ.name} — חזרה לדף הבית"><img src="images/brand/brazil_logo-b.png" alt="${BIZ.name}"></a>
          <p>חנות פרחי ברזיל ממוקמת ברמת אביב. משלוחי פרחים בסגנון קלאסי-מודרני באריזה יפיפייה, בעבודת ידה של השוזרת המקצועית מירלה — כבר 34 שנה.</p>
          <div class="footer-social">
            <a href="${BIZ.instagram}" target="_blank" rel="noopener" aria-label="אינסטגרם">${I.instagram}</a>
            <a href="${BIZ.facebook}" target="_blank" rel="noopener" aria-label="פייסבוק">${I.facebook}</a>
            <a href="${BIZ.whatsappHref}" target="_blank" rel="noopener" aria-label="וואטסאפ">${I.whatsapp}</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>קניות</h4>
          <ul>${quick.map(l=>`<li><a href="${l.p}">${l.n}</a></li>`).join("")}</ul>
        </div>
        <div class="footer-col">
          <h4>שירות</h4>
          <ul>${service.map(l=>`<li><a href="${l.p}">${l.n}</a></li>`).join("")}</ul>
        </div>
        <div class="footer-col">
          <h4>יצירת קשר</h4>
          <ul class="footer-contact">
            <li>${I.phone}<span>טלפון<br><b>${BIZ.phone}</b></span></li>
            <li>${I.whatsapp}<span>וואטסאפ<br><b>${BIZ.whatsapp}</b></span></li>
            <li>${I.mail}<span><b>${BIZ.email}</b></span></li>
            <li>${I.pin}<span>${BIZ.address}</span></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 כל הזכויות שמורות ל-${BIZ.name}</span>
        <div class="footer-bottom__links">
          <a href="accessibility.html">הצהרת נגישות</a><a href="privacy.html">מדיניות פרטיות</a><a href="terms.html">תנאי שימוש</a>
        </div>
        <div class="footer-pay"><span>תשלום מאובטח · אשראי · ביט · PayPal</span></div>
      </div>
    </div>`;
    document.body.appendChild(f);

    // WhatsApp FAB
    const fab = document.createElement("a");
    fab.className="wa-fab"; fab.href=BIZ.whatsappHref; fab.target="_blank"; fab.rel="noopener";
    fab.setAttribute("aria-label","שלחו הודעה בוואטסאפ"); fab.innerHTML=I.whatsapp;
    document.body.appendChild(fab);
  }

  /* ---------- כרטיס מוצר ---------- */
  function card(p){
    const sale = p.was ? `<span class="badge badge--sale">-${Math.round((1-p.price/p.was)*100)}%</span>` : "";
    const best = p.badge==="best" ? `<span class="badge badge--best">הכי נמכר</span>` : "";
    const isNew = p.badge==="new" ? `<span class="badge">חדש</span>` : "";
    const price = p.was
      ? `<span class="now">${fmt(p.price)}</span><span class="was">${fmt(p.was)}</span><span class="save">חיסכון ${fmt(p.was-p.price)}</span>`
      : `<span class="now">${fmt(p.price)}</span>`;
    return `
    <article class="card" data-sub="${p.sub||''}" data-id="${p.id}" data-reveal>
      <div class="card__media">
        <div class="card__badges">${best}${sale}${isNew}</div>
        <a href="product.html?id=${p.id}" aria-label="${p.name}"><img src="${p.img}" alt="${p.name}" loading="lazy"${p.pos?` style="object-position:${p.pos}"`:""}></a>
        <div class="card__quick">
          <button class="btn" data-add="${p.id}">${I.plus} הוספה לעגלה</button>
          <button class="card__wish" aria-label="הוספה למועדפים">${I.heart}</button>
        </div>
      </div>
      <div class="card__body">
        <span class="card__cat">${p.sub||catName(p.cat)}</span>
        <h3 class="card__name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <p class="card__desc">${p.desc||""}</p>
        <div class="card__price">${price}</div>
      </div>
    </article>`;
  }
  function catName(key){ const c=(window.CATEGORIES||[]).find(c=>c.key===key); return c?c.name:""; }

  /* ---------- רינדור גרידים ---------- */
  function renderGrids(){
    $$("[data-grid]").forEach(el=>{
      const spec = el.dataset.grid;
      let list = [];
      if(spec==="best") list = window.PRODUCTS.filter(p=>p.badge==="best" || p.badge==="sale").slice(0,4);
      else if(spec==="all") list = window.PRODUCTS.slice();
      else if(el.dataset.gridIds) list = el.dataset.gridIds.split(",").map(id=>window.PRODUCTS.find(p=>p.id===id.trim())).filter(Boolean);
      else list = window.PRODUCTS.filter(p=>p.cat===spec);
      const limit = el.dataset.limit ? +el.dataset.limit : list.length;
      const shown = list.slice(0,limit);
      el.innerHTML = shown.map(card).join("");
      el._count = shown.length;
    });
    // initial product count label
    const grid = $("[data-grid]");
    const count = $("[data-count]");
    if(grid && count) count.textContent = grid._count;
  }

  /* ---------- צ'יפים של תתי-קטגוריה (אוטומטי מהנתונים) ---------- */
  function renderSubchips(){
    $$("[data-subchips]").forEach(bar=>{
      const cat = (window.CATEGORIES||[]).find(c=>c.key===bar.dataset.subchips);
      if(!cat) return;
      const chips = [`<button class="chip is-active" data-filter="all">הכל</button>`]
        .concat(cat.subs.map(s=>`<button class="chip" data-filter="${s}">${s}</button>`));
      bar.innerHTML = chips.join("");
    });
  }

  /* ---------- סינון לפי תת-קטגוריה (chips) ---------- */
  function initFilters(){
    $$("[data-filter-for]").forEach(bar=>{
      const grid = $("#"+bar.dataset.filterFor);
      if(!grid) return;
      bar.addEventListener("click", e=>{
        const chip = e.target.closest(".chip"); if(!chip) return;
        bar.querySelectorAll(".chip").forEach(c=>c.classList.remove("is-active"));
        chip.classList.add("is-active");
        const f = chip.dataset.filter;
        $$(".card", grid).forEach(c=>{
          const show = !f || f==="all" || c.dataset.sub===f;
          c.style.display = show ? "" : "none";
        });
        const visible = $$(".card", grid).filter(c=>c.style.display!=="none").length;
        const count = $("[data-count]"); if(count) count.textContent = visible;
      });
    });
    // הפעלת סינון לפי ?sub= מקישור בדרופדאון
    const sub = new URLSearchParams(location.search).get("sub");
    if(sub){
      const chip = $$(".chip").filter(c=>c.dataset.filter===sub)[0];
      if(chip){ chip.click(); chip.scrollIntoView({block:"center"}); }
    }
  }

  /* ---------- הוספה לעגלה (delegation) ---------- */
  function initAddToCart(){
    document.addEventListener("click", e=>{
      const b = e.target.closest("[data-add]");
      if(b){ e.preventDefault(); Cart.add(b.dataset.add); animateFly(b); }
    });
  }
  function animateFly(btn){
    btn.style.transition="transform .15s"; btn.style.transform="scale(.94)";
    setTimeout(()=>btn.style.transform="",150);
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal(){
    const els = $$("[data-reveal]");
    if(!("IntersectionObserver" in window) || !els.length){ els.forEach(e=>e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, {threshold:.12, rootMargin:"0px 0px -8% 0px"});
    els.forEach(e=>io.observe(e));
  }

  /* ---------- אקורדיון ---------- */
  function initAccordion(){
    $$(".acc__head").forEach(h=>h.addEventListener("click", ()=>{
      const item = h.closest(".acc__item");
      item.classList.toggle("is-open");
    }));
  }

  /* ---------- חשיפת אייקונים ל-inline ---------- */
  function injectIcons(){
    $$("[data-icon]").forEach(el=>{ const k=el.dataset.icon; if(I[k]) el.innerHTML=I[k]; });
  }

  /* ---------- כלי עזר גלובליים ---------- */
  window.BF = { I, Cart, fmt, card, $, $$, CATEGORIES: window.CATEGORIES, PRODUCTS: window.PRODUCTS, catName };

  /* ---------- init ---------- */
  /* ---------- Favicon (אייקון הדפדפן) ---------- */
  function injectFavicon(){
    if(document.querySelector('link[rel="icon"]')) return;
    var l = document.createElement("link");
    l.rel = "icon"; l.type = "image/png"; l.href = "images/brand/Icon.png";
    document.head.appendChild(l);
  }

  /* ---------- טעינת קטלוג מ-Supabase (אופציונלי, עם fallback ל-data.js) ---------- */
  async function loadCatalog(){
    var cfg = window.SUPABASE_CONFIG;
    if(!cfg || !cfg.url || !cfg.anonKey){
      // אין Supabase → השתמש בנתוני פאנל הניהול המקומי אם קיימים, אחרת data.js
      try {
        var lp = JSON.parse(localStorage.getItem("bf_local_products_v1")||"null");
        var lc = JSON.parse(localStorage.getItem("bf_local_categories_v1")||"null");
        if(lp && lp.length){ window.PRODUCTS = lp.map(function(r){ return { id:r.id,name:r.name,cat:r.cat,sub:r.sub,price:r.price,was:r.was||null,img:r.img,badge:r.badge||null,pos:r.pos||null,desc:r.descr||r.desc||"" }; }); }
        if(lc && lc.length){ window.CATEGORIES = lc.map(function(r){ return { key:r.key,name:r.name,page:r.page||(r.key+".html"),blurb:r.blurb||"",hero:r.hero||"",subs:Array.isArray(r.subs)?r.subs:(r.subs?JSON.parse(r.subs):[]) }; }); }
      } catch(e){}
      return;
    }
    try {
      var headers = { apikey: cfg.anonKey, Authorization: "Bearer " + cfg.anonKey };
      var base = cfg.url.replace(/\/+$/,"") + "/rest/v1/";
      var res = await Promise.all([
        fetch(base + "products?select=*&order=sort.asc", { headers: headers }),
        fetch(base + "categories?select=*&order=sort.asc", { headers: headers })
      ]);
      if(!res[0].ok || !res[1].ok) throw new Error("supabase fetch failed");
      var products = await res[0].json(), cats = await res[1].json();
      if(Array.isArray(products) && products.length){
        window.PRODUCTS = products.map(function(r){
          return { id:r.id, name:r.name, cat:r.cat, sub:r.sub, price:r.price, was:r.was||null,
                   img:r.img, badge:r.badge||null, pos:r.pos||null, desc:r.descr||r.desc||"" };
        });
      }
      if(Array.isArray(cats) && cats.length){
        window.CATEGORIES = cats.map(function(r){
          return { key:r.key, name:r.name, page:r.page||(r.key+".html"), blurb:r.blurb||"",
                   hero:r.hero||"", subs: Array.isArray(r.subs)? r.subs : (r.subs? JSON.parse(r.subs):[]) };
        });
      }
    } catch(e){ console.warn("טעינת Supabase נכשלה — נטען מ-data.js המקומי.", e); }
  }

  var _catalog;
  function ensureCatalog(){ return _catalog || (_catalog = loadCatalog()); }
  window.BF_CATALOG_READY = ensureCatalog();  // נטען מוקדם; דפים אחרים יכולים לחכות לו

  async function init(){
    await window.BF_CATALOG_READY;
    injectFavicon();
    buildHeader();
    renderSubchips();
    renderGrids();
    buildFooter();
    initFilters();
    initAddToCart();
    initAccordion();
    injectIcons();
    updateBadge();
    initReveal();
    // תוסף נגישות + באנר עוגיות (נטען בכל הדפים)
    if(!document.querySelector('script[data-a11y]')){
      var s = document.createElement("script");
      s.src = "js/accessibility.js"; s.defer = true; s.setAttribute("data-a11y","");
      document.body.appendChild(s);
    }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
