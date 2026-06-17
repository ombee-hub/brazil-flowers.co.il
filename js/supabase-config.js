/* ============================================================
   הגדרות Supabase — פרחי ברזיל
   ------------------------------------------------------------
   מלאו את שני הערכים לאחר יצירת פרויקט Supabase (ראו ADMIN-SETUP.md).
   * המפתח הציבורי (anon public) מיועד לחשיפה בצד-לקוח — האבטחה
     נאכפת בצד-השרת ע"י Row Level Security + הרשאות (Auth).
   * כל עוד הערכים ריקים — האתר עובד רגיל מתוך js/data.js.
   ============================================================ */
window.SUPABASE_CONFIG = {
  url: "",      // לדוגמה: https://abcdxyz.supabase.co
  anonKey: ""   // anon public key
};
window.SB_READY = !!(window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey);
