// שרת סטטי קטן להרצת האתר מקומית.   הרצה:  node serve.js   →  http://localhost:4173
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 4173;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2"
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  let filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.stat(filePath, (err, stat) => {
    if (err || stat.isDirectory()) {
      const html = filePath + ".html";
      if (fs.existsSync(html)) return send(html);
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end("<h1 dir='rtl'>404 — הדף לא נמצא</h1>");
    }
    send(filePath);
  });
  function send(fp) {
    const ext = path.extname(fp).toLowerCase();
    res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream", "Cache-Control": "no-cache" });
    fs.createReadStream(fp).pipe(res);
  }
}).listen(PORT, () => console.log(`פרחי ברזיל — תצוגה מקומית: http://localhost:${PORT}`));
