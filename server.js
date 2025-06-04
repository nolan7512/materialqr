const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, hostname: '10.30.3.40', port: 3000 });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
};

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  }).listen(3000, '10.30.3.40', (err) => {
    if (err) throw err;
    console.log('> Ready on https://10.30.3.40:3000');
  });
});