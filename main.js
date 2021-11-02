const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.sendFile(`${__dirname}/views/home.html`);
});

app.get('/home.css', function(req, res) {
  res.sendFile(`${__dirname}/css/home.css`);
})

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
