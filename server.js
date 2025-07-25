const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev, hostname: '10.30.3.40', port: 6969 });
const app = next({ dev }); // Để Next.js tự xử lý đúng
const handle = app.getRequestHandler();

// const httpsOptions = {
//   key: fs.readFileSync('./certs/key.pem'),
//   cert: fs.readFileSync('./certs/cert.pem'),
// };

const httpsOptions = {
  key: fs.readFileSync('./certs/10.30.3.40-key.pem'),
  cert: fs.readFileSync('./certs/10.30.3.40.pem'),
};

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  }).listen(6969, '10.30.3.40', (err) => {
    if (err) throw err;
    console.log('> Ready on https://10.30.3.40:6969');
  });
});