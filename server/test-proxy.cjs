// Test login via the Vite proxy (port 8080 → port 5000)
const http = require('http');

const body = JSON.stringify({
  email: 'harry@hogwarts.com',
  password: 'expelliarmus123'
});

const opts = {
  hostname: '127.0.0.1',
  port: 8080,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = http.request(opts, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log('SUCCESS:', json.success);
      console.log('MESSAGE:', json.message);
      if (json.token) console.log('TOKEN received ✅');
      if (json.user) console.log('USER:', json.user.username, '| House:', json.user.hogwartsHouse);
    } catch {
      console.log('RAW:', data);
    }
  });
});

req.on('error', (e) => console.error('PROXY ERROR:', e.message));
req.write(body);
req.end();
