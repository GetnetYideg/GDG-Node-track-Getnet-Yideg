const http = require('http');
const url = require('url');
const PORT = 4000;

let students = [
  { id: 1, name: "Eyob" },
  { id: 2, name: "Fahmi" }
];

function getNextId() {
  return students.length > 0 
    ? Math.max(...students.map(s => s.id)) + 1 
    : 1;
}

function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    try {
      callback(null, body ? JSON.parse(body) : {});
    } catch (err) {
      callback(err);
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (method === 'GET' && path === '/students') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(students));
    return;
  }

  if (method === 'POST' && path === '/students') {
    parseBody(req, (err, data) => {
      if (err || !data.name || typeof data.name !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Name is required and must be a string" }));
        return;
      }

      const newStudent = {
        id: getNextId(),
        name: data.name.trim()
      };

      students.push(newStudent);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newStudent));
    });
    return;
  }

  if (method === 'PUT' && /^\/students\/\d+$/.test(path)) {
    const id = parseInt(path.split('/')[2]);

    parseBody(req, (err, data) => {
      if (err || !data.name || typeof data.name !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Name is required and must be a string" }));
        return;
      }

      const student = students.find(s => s.id === id);
      if (!student) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Student not found" }));
        return;
      }

      student.name = data.name.trim();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(student));
    });
    return;
  }

  if (method === 'DELETE' && /^\/students\/\d+$/.test(path)) {
    const id = parseInt(path.split('/')[2]);
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Student not found" }));
      return;
    }

    students.splice(index, 1);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `Student with id ${id} deleted successfully` }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(PORT, () => {
  console.log(`Students API server running on http://localhost:${PORT}`);
  console.log(`Try: curl http://localhost:${PORT}/students`);
});