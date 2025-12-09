const http = require('http');
const PORT = 3000;

function parseJsonBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const json = body ? JSON.parse(body) : {};
      callback(null, json);
    } catch (err) {
      callback(err, null);
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to the Home Page');
    return;
  }
  
  if (req.method === 'GET' && req.url === '/info') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('This is the information page');
    return;
  }

  if (req.method === 'POST' && req.url === '/submit') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request: Content-Type must be application/json');
      return;
    }

    parseJsonBody(req, (err, jsonData) => {
      if (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(jsonData));
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});