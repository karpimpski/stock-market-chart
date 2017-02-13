const express = require('express');
const app = express();
const request = require('request');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI);
const Stock = require('./models/stock.js');

app.use(express.static('./client/public'));

//CHANGE THIS NUMBER TO SELECT DIFFERENT RANGE
const days = 100;

io.on('connection', function(socket){

  socket.on('change', function(){
    io.emit('change');
  });

});

app.get('/api/stock/:stock', function(req, res){
  const url = `http://api.kibot.com/?action=history&symbol=${req.params.stock}&interval=daily&period=${days}`;
  request('http://api.kibot.com/?action=login&user=guest&password=guest', function(error, response, body){
    if(!error && response.statusCode == 200){
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const bod = body.split('\r\n');
          const data = bod.map(val => val.split(',').slice(0,2));
          res.end(JSON.stringify(data));
        }
      });
    }
  });
});

app.get('/api/stocks', function(req, res){
  Stock.find({}, function(err, stocks){
    const arr = stocks.map( stock => stock.name);
    res.end(JSON.stringify(arr));
  });
});

app.post('/api/newstock', function(req, res){
  Stock.create({name: req.body.stock}, function(err, newStock){
    if(err) res.end(JSON.stringify(false));

    Stock.find({}, function(err, stocks){
      const arr = stocks.map( stock => stock.name);
      res.end(JSON.stringify(arr));
    });
  });
});

app.delete('/api/deletestock', function(req, res){
  Stock.remove({name: req.body.stock}, function(err){
    if(err) res.end(JSON.stringify('error'));
    Stock.find({}, function(err, stocks){
      if(err) res.end(JSON.stringify('error'));
      const arr = stocks.map( stock => stock.name);
      res.end(JSON.stringify(arr));
    });
  });
})

app.get('*', function(req, res){
	res.sendFile(__dirname + '/client/public/index.html');
});

http.listen(process.env.PORT || 3000, function(){
  
});