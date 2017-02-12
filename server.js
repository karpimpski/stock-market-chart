const express = require('express');
const app = express();
const request = require('request');

app.use(express.static('./client/public'));

app.get('/api/stock/:stock', function(req, res){
  const url = `http://api.kibot.com/?action=history&symbol=${req.params.stock}&interval=daily&period=365`;
  request('http://api.kibot.com/?action=login&user=guest&password=guest', function(error, response, body){
    if(!error && response.statusCode == 200){
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const bod = body.split('\r\n');
          const data = bod.map(val => val.split(',').slice(0,2)); 
          console.log(data);
          res.end(JSON.stringify(data));
        }
      });
    }
  });
  
});

app.get('*', function(req, res){
	res.sendFile(__dirname + '/client/public/index.html');
});

app.listen(process.env.PORT || 3000);