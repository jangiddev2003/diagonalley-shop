const http = require('http');

const body = JSON.stringify({
  username: 'harrypotter',
  email: 'harry@hogwarts.com',
  password: 'expelliarmus123'
});

const opts = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/auth/register',
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
    console.log('RESPONSE:', data);
  });
});

req.on('error', (e) => console.error('ERROR:', e.message));
req.write(body);
req.end();
