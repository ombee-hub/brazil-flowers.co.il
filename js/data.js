/* ============================================================
   פרחי ברזיל — נתוני האתר (תוכן מרכזי)
   כל הטקסטים, הקטגוריות והמוצרים במקום אחד.
   ============================================================ */

const BIZ = {
  name: "פרחי ברזיל",
  tagline: "חנות פרחים · רמת אביב",
  phone: "03-6421863",
  phoneHref: "tel:+97236421863",
  whatsapp: "050-9266502",
  whatsappHref: "https://wa.me/972509266502?text=" + encodeURIComponent("היי, אשמח לעזרה בהזמנת זר 🌸"),
  email: "brazilflowers17@gmail.com",
  address: "רחוב ברזיל 17, רמת אביב, תל אביב",
  address2: "מתחת לבית הרופאים · גם ברודצקי 43",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  cutoff: "14:00",
  hours: [
    { d: "ראשון – חמישי", h: "08:30 – 17:00" },
    { d: "שישי וערבי חג", h: "08:00 – 14:00" },
    { d: "שבת", h: "09:00 – 16:00" }
  ]
};

/* סדר הקטגוריות בניווט */
const CATEGORIES = [
  {
    key: "bouquets", page: "bouquets.html", name: "זרים", emoji: "💐",
    blurb: "זרים בסגנון קלאסי-מודרני, שזורים ביד מפרחי העונה הטריים ביותר.",
    hero: "images/products/bouquet-pink-gerbera.jpg",
    subs: ["אהבה", "יום נישואין", "יום הולדת", "ליולדת", "לאמא ולסבתא", "לאבא ולסבא", "החלמה מהירה", "לבית הכנסת"]
  },
  {
    key: "arrangements", page: "arrangements.html", name: "סידורי פרחים", emoji: "🌸",
    blurb: "סידורים מעוצבים לכל אירוע — מהבמה ועד שולחן השבת.",
    hero: "images/products/arrangement-purple-roses.png",
    subs: ["סידור לבמה", "זרים לראש", "זרי כלה", "קישוט רכב", "סידור לשולחן שבת", "סידורי אבל"]
  },
  {
    key: "plants", page: "plants.html", name: "עציצים", emoji: "🪴",
    blurb: "צמחי בית וסחלבים שמביאים נשימה של טבע לכל חלל.",
    hero: "images/products/plants-collection.webp",
    subs: ["צמחי בית", "סחלבים"]
  },
  {
    key: "chocolate", page: "chocolate.html", name: "שוקולד", emoji: "🍫",
    blurb: "פרלינים, שוקולד דה קרינה וכרטיסי ברכה — המתיקות שמשלימה כל זר.",
    hero: "images/products/gift-wine-chocolate.webp",
    subs: ["שוקולד דה קרינה", "שוקולד מובחר", "כרטיסי ברכה"]
  },
  {
    key: "balloons", page: "balloons.html", name: "בלונים", emoji: "🎈",
    blurb: "בלוני הליום וצורות לב — תוספת חגיגית שמרימה כל הפתעה.",
    hero: "images/products/balloons-helium.webp",
    subs: ["לב אהבה", "נשיקות", "בלוני הליום"]
  },
  {
    key: "wine", page: "wine.html", name: "יין מובחר", emoji: "🍷",
    blurb: "יינות בוטיק נבחרים שהופכים משלוח פרחים למתנה שלמה.",
    hero: "images/products/wine-romantic.png",
    subs: ["יין בהט", "יין 5 אבנים", "יינות שונים"]
  },
  {
    key: "gifts", page: "gifts.html", name: "מתנות", emoji: "🎁",
    blurb: "מארזי מתנה ונרות ריחניים, ארוזים באהבה ובהקפדה על כל פרט.",
    hero: "images/products/gifts-collection.png",
    subs: ["מארז מתנה", "נרות עם ריח"]
  },
  {
    key: "vases", page: "vases.html", name: "אגרטלים", emoji: "🏺",
    blurb: "אגרטלי זכוכית ויוקרה שיציגו את הזר שלכם בדיוק כמו שמגיע לו.",
    hero: "images/products/bouquet-great-bloom.png",
    subs: ["אגרטלים שקופים", "אגרטלים יוקרה"]
  }
];

/* תמונות זמינות (צילומי מוצר אמיתיים מהאתר) */
const IMG = {
  bloom:    "images/products/bouquet-great-bloom.png", // הפריחה הגדולה
  tulips:   "images/products/bouquet-colorful-tulips.png", // שמחה זה אנחנו
  box:      "images/products/flowerbox-chocolate.png", // כי מגיע לך
  purple:   "images/products/arrangement-purple-roses.png", // סידור סגול
  gerbera:  "images/products/bouquet-pink-gerbera.jpg", // זר על שיש
  anthur:   "images/products/plant-anthurium.jpg", // אנטוריום
  plants:   "images/products/plants-collection.webp",// אוסף עציצים
  giftset:  "images/products/gift-wine-chocolate.webp",// יין+שוקולד+כרטיסים
  balloons: "images/products/balloons-helium.webp",// בלונים
  gifts:    "images/products/gifts-collection.png", // מתנות אמא+ילד
  wine:     "images/products/wine-romantic.png", // זוג+יין
  garden:   "images/products/hero-garden-bouquets.webp",// שולחן זרים בגן
  garden2:  "images/products/hero-garden-basket.webp" // סלסלה+קופסאות
};

/* ----- קטלוג מוצרים ----- */
const PRODUCTS = [
  // ===== זרים =====
  { id:"bloom", name:"הפריחה הגדולה", cat:"bouquets", sub:"אהבה", price:250, img:IMG.bloom, badge:"best",
    desc:"זר מרהיב ביופיו, שזור ממיטב פרחי העונה — בדיוק כמו שהשם מבטיח.", sizes:[["רגיל",0],["גדול",60],["ענק",120]] },
  { id:"joy", name:"שמחה זה אנחנו", cat:"bouquets", sub:"יום הולדת", price:220, was:260, img:IMG.tulips, badge:"sale",
    desc:"זר טוליפים צבעוני ומרשים עם ירק מתאים — תאווה לעיניים." },
  { id:"deserve", name:"כי מגיע לך", cat:"bouquets", sub:"אהבה", price:360, img:IMG.box, badge:"best",
    desc:"קופסת פרחים צבעונית בשילוב שוקולדים — מתנה מושלמת לשמח ולהפתיע." },
  { id:"lizzy", name:"זר מיקס ליזי", cat:"bouquets", sub:"יום הולדת", price:200, img:IMG.gerbera,
    desc:"מיקס עשיר של גרברות וליזיאנטוס בגווני ורוד ולבן." },
  { id:"lovecharm", name:"זר קסם האהבה", cat:"bouquets", sub:"יום נישואין", price:300, img:IMG.purple, badge:"best",
    desc:"ורדים וליזיאנטוס סגולים-ורודים בסידור עגול ורומנטי." },
  { id:"pastel", name:"מסע פסטל", cat:"bouquets", sub:"ליולדת", price:240, img:IMG.bloom,
    desc:"גווני פסטל רכים ועדינים, מושלם לברך יולדת או לידה חדשה." },
  { id:"sunshine", name:"קרן שמש", cat:"bouquets", sub:"החלמה מהירה", price:210, img:IMG.tulips,
    desc:"זר חמים ומאיר שמביא חיוך ואיחולי החלמה מהירה." },
  { id:"classicwhite", name:"לבן קלאסי", cat:"bouquets", sub:"לבית הכנסת", price:280, img:IMG.gerbera,
    desc:"זר לבן אלגנטי ומכובד, מתאים לכל אירוע רשמי." },

  // ===== סידורי פרחים =====
  { id:"stage", name:"סידור לבמה", cat:"arrangements", sub:"סידור לבמה", price:450, img:IMG.purple,
    desc:"סידור נפחי ומרשים לבמה, אירוע או נאום — נוכחות שלא מתפשרת." },
  { id:"shabbat", name:"סידור לשולחן שבת", cat:"arrangements", sub:"סידור לשולחן שבת", price:190, img:IMG.bloom,
    desc:"סידור נמוך ומלא שמכבד את שולחן השבת והחג." },
  { id:"bridal", name:"זר כלה רומנטי", cat:"arrangements", sub:"זרי כלה", price:520, img:IMG.gerbera,
    desc:"זר כלה שזור ביד בעבודת מקצוע, מותאם אישית לשמלה ולסגנון." },
  { id:"headwreath", name:"זר לראש", cat:"arrangements", sub:"זרים לראש", price:160, img:IMG.tulips,
    desc:"זר ראש עדין מפרחים טריים לכלה, לשושבינות או לבת מצווה." },
  { id:"cardeco", name:"קישוט רכב", cat:"arrangements", sub:"קישוט רכב", price:380, img:IMG.box,
    desc:"קישוט רכב חתן-כלה אלגנטי, מותקן בקפידה ביום האירוע." },
  { id:"condolence", name:"סידור אבל מכובד", cat:"arrangements", sub:"סידורי אבל", price:340, img:IMG.purple,
    desc:"סידור מכובד ומאופק להבעת תנחומים והשתתפות בצער." },

  // ===== עציצים =====
  { id:"anthurium", name:"אנטוריום אדום", cat:"plants", sub:"צמחי בית", price:180, img:IMG.anthur,
    desc:"צמח בית מרשים בפריחה אדומה, קל לטיפול ועמיד לאורך זמן." },
  { id:"orchidwhite", name:"סחלב לבן קלאסי", cat:"plants", sub:"סחלבים", price:230, img:IMG.plants, pos:"12% 30%",
    desc:"סחלב פלאנופסיס לבן בעציץ קרמיקה — אלגנטיות שקטה." },
  { id:"orchidpink", name:"סחלב ורוד", cat:"plants", sub:"סחלבים", price:250, img:IMG.plants, pos:"88% 35%",
    desc:"סחלב ורוד עז שמוסיף צבע מתוחכם לכל חלל." },
  { id:"greenmix", name:"מיקס צמחי בית", cat:"plants", sub:"צמחי בית", price:210, img:IMG.plants, pos:"50% 90%",
    desc:"שילוב צמחי נוי ירוקים בעציצים תואמים, מנקים את האוויר." },

  // ===== שוקולד =====
  { id:"dekarina", name:"מארז שוקולד דה קרינה", cat:"chocolate", sub:"שוקולד דה קרינה", price:120, img:IMG.giftset, pos:"35% 60%",
    desc:"פרלינים בעבודת יד של דה קרינה — מתיקות שמלווה כל זר." },
  { id:"pralines", name:"קופסת פרלינים מובחרת", cat:"chocolate", sub:"שוקולד מובחר", price:95, img:IMG.box, pos:"50% 75%",
    desc:"מבחר פרלינים בלגיים עשירים בקופסה מהודרת." },
  { id:"choccard", name:"שוקולד + כרטיס ברכה", cat:"chocolate", sub:"כרטיסי ברכה", price:60, img:IMG.giftset, pos:"90% 50%",
    desc:"שוקולד מובחר בלוויית כרטיס ברכה מאויר לבחירתכם." },
  { id:"ferrero", name:"פררו רושה 16 יח׳", cat:"chocolate", sub:"שוקולד מובחר", price:75, img:IMG.box, pos:"50% 30%",
    desc:"קלאסיקה אהובה — מארז פררו רושה להוספה לכל הזמנה." },

  // ===== בלונים =====
  { id:"loveheart", name:"בלון לב אהבה", cat:"balloons", sub:"לב אהבה", price:45, img:IMG.balloons, pos:"8% 28%",
    desc:"בלון הליום בצורת לב עם הכיתוב ׳אהבה׳ — הצהרה חגיגית." },
  { id:"mazaltov", name:"בלון מזל טוב", cat:"balloons", sub:"בלוני הליום", price:45, img:IMG.balloons, pos:"42% 18%",
    desc:"בלון הליום צבעוני לכל שמחה — יום הולדת, לידה או הצלחה." },
  { id:"kisses", name:"מארז נשיקות", cat:"balloons", sub:"נשיקות", price:70, img:IMG.balloons, pos:"92% 30%",
    desc:"צרור בלוני לבבות קטנים בגווני ורוד ואדום." },
  { id:"balloonbundle", name:"חבילת בלונים חגיגית", cat:"balloons", sub:"בלוני הליום", price:130, img:IMG.balloons, pos:"55% 55%",
    desc:"שילוב בלוני הליום בצורות ובכיתובים לבחירתכם." },

  // ===== יין מובחר =====
  { id:"bahatred", name:"יין בהט אדום", cat:"wine", sub:"יין בהט", price:90, img:IMG.giftset, pos:"30% 45%",
    desc:"יין אדום יבש ועשיר מיקב בהט — מושלם לערב מיוחד." },
  { id:"fivestones", name:"יין 5 אבנים לבן", cat:"wine", sub:"יין 5 אבנים", price:95, img:IMG.wine, pos:"15% 35%",
    desc:"יין לבן רענן וקליל, נהדר כמתנה או לארוחה." },
  { id:"rose", name:"יין רוזה קיצי", cat:"wine", sub:"יינות שונים", price:85, img:IMG.giftset, pos:"75% 45%",
    desc:"רוזה ורדרד וקליל — תוספת רומנטית למשלוח פרחים." },
  { id:"winefower", name:"יין + זר רומנטי", cat:"wine", sub:"יינות שונים", price:320, img:IMG.wine,
    desc:"מארז זוגי: יין מובחר לצד זר פרחים — ערב מושלם." },

  // ===== מתנות =====
  { id:"giftbox", name:"מארז מתנה יוקרתי", cat:"gifts", sub:"מארז מתנה", price:280, img:IMG.gifts, pos:"30% 50%",
    desc:"מארז משולב של פרחים, שוקולד ויין — ארוז באהבה." },
  { id:"candle", name:"נר ריחני בוטיק", cat:"gifts", sub:"נרות עם ריח", price:80, img:IMG.giftset, pos:"55% 80%",
    desc:"נר ארומטי בניחוח עדין שממלא את הבית בחמימות." },
  { id:"deluxe", name:"מארז פינוק דה-לוקס", cat:"gifts", sub:"מארז מתנה", price:390, img:IMG.gifts, pos:"75% 45%",
    desc:"הקומבינציה המנצחת: זר, שוקולד דה קרינה, יין ונר ריחני." },
  { id:"newmom", name:"מארז ליולדת", cat:"gifts", sub:"מארז מתנה", price:260, img:IMG.giftset, pos:"45% 25%",
    desc:"מארז מפנק לאמא הטרייה ולתינוק, בגווני פסטל רכים." },

  // ===== אגרטלים =====
  { id:"clearvase", name:"אגרטל זכוכית שקוף", cat:"vases", sub:"אגרטלים שקופים", price:70, img:IMG.tulips,
    desc:"אגרטל זכוכית קלאסי בקו נקי — מתאים לכל זר." },
  { id:"luxvase", name:"אגרטל יוקרה", cat:"vases", sub:"אגרטלים יוקרה", price:160, img:IMG.bloom,
    desc:"אגרטל עיצובי בגימור מט שמשדרג כל סידור." },
  { id:"roundvase", name:"אגרטל בועה עגול", cat:"vases", sub:"אגרטלים שקופים", price:90, img:IMG.gerbera,
    desc:"אגרטל בועה עגול ושקוף, אידיאלי לזרים נמוכים ומלאים." },
  { id:"ceramicvase", name:"אגרטל קרמיקה לבן", cat:"vases", sub:"אגרטלים יוקרה", price:140, img:IMG.purple,
    desc:"אגרטל קרמיקה לבן מינימליסטי שמדגיש את הפרחים." }
];

const REVIEWS = [
  { text:"הזמנתי זר ליום ההולדת של אמא — הגיע תוך שעה, רענן ומדהים. מושלם!", name:"כרמלה שרעבי", role:"רמת אביב", initial:"כ" },
  { text:"ראיתי את הדירוג של פרחי ברזיל בגוגל, בּאיזי ובוולט — ומיד החלטתי. הטובים ביותר, בלי ספק.", name:"רונית דוד", role:"תל אביב", initial:"ר" },
  { text:"הפתעתי את אשתי ליום הנישואין והיא ממש התרגשה. שירות אישי ואדיב מהרגע הראשון. תודה!", name:"יוסי מזרחי", role:"הרצליה", initial:"י" }
];

/* פסקול אמון לרצועת המרקי */
const TRUST = [
  ["truck","משלוח עד שעה בצפון ת״א"],
  ["leaf","פרחים טריים שנקטפו הבוקר"],
  ["calendar","פתוחים 7 ימים בשבוע"],
  ["shield","תשלום מאובטח · אשראי · ביט · פייפאל"],
  ["star","אלפי לקוחות מרוצים"],
  ["heart","34 שנות ניסיון בשזירה"]
];

/* חשיפה גלובלית (const אינו נחשף אוטומטית ל-window בסקריפט קלאסי) */
Object.assign(window, { BIZ, CATEGORIES, IMG, PRODUCTS, REVIEWS, TRUST });
