const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=UTF-8',
};

function safeResolve(p) {
  const resolved = path.resolve(ROOT, p);
  if (!resolved.startsWith(ROOT)) return null; // prevent path traversal
  return resolved;
}

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  if (body) res.end(body); else res.end();
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, { 'Content-Type': 'text/plain; charset=UTF-8' }, 'Not Found');
    const stream = fs.createReadStream(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': 'no-store',
    });
    stream.pipe(res);
    stream.on('error', () => send(res, 500, { 'Content-Type': 'text/plain; charset=UTF-8' }, 'Server Error'));
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, { 'Content-Type': 'text/plain; charset=UTF-8', Allow: 'GET, HEAD' }, 'Method Not Allowed');
  }

  // Parse and normalize URL
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  // Default file
  if (pathname === '/' || pathname === '') pathname = '/index.html';

  const filePath = safeResolve(pathname.slice(1));
  if (!filePath) return send(res, 400, { 'Content-Type': 'text/plain; charset=UTF-8' }, 'Bad Request');

  // If requesting a directory, try index.html inside it
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      return serveFile(res, indexPath);
    }
    return serveFile(res, filePath);
  });
});

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
});
