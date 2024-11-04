import path from "path";

const MIME = {
  ".svg": "image/svg+xml",
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  ".ico": "image/x-icon"
}

export const get_type = (req) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`)
  if (pathname === "/") return "text/html"
  if (pathname.includes('/img/')) return "image/png"
  return MIME[path.extname(pathname)] || "text/plain"
}