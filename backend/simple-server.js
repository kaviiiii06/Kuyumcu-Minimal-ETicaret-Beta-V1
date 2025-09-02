const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server çalışıyor!' });
});

app.listen(port, () => {
  console.log(`Server http://localhost:${port} üzerinde çalışıyor`);
});
