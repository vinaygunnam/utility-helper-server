var express = require('express');
var cors = require('cors');
var request = require('request');
var url = require('url');

var app = express();

// enable CORS
app.use(cors());

// enable OPTIONS for all routes
app.options('*', cors());

app.get('/resource', function resource(req, res, next) {
  var url = req.query.url;
  request(url, function (error, response, body) {
    res.status(response.statusCode).send(body);
  });
});

app.listen(process.env.PORT || 4000, function(){
  console.log('Server listening on port ' + (process.env.PORT || 4000));
});
