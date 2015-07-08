var express = require('express');
var cors = require('cors');
var http = require('http');
var https = require('https');
var url = require('url');

var app = express();

// enable CORS
app.use(cors());

// enable OPTIONS for all routes
app.options('*', cors());

app.get('/resource', function resource(req, res, next) {
  var requestedResourceUrl = req.query.url;
  if (requestedResourceUrl) {
    var urlObject = url.parse(requestedResourceUrl);
    if (urlObject) {
      var options = {
        host: urlObject.hostname,
        path: urlObject.path,
        port: urlObject.port,
        method: 'GET'
      };

      function httpCallback(response) {
        console.log('Request started .... ' + requestedResourceUrl);
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
          str += chunk;
        });

        response.on('end', function() {
          console.log('Resource fetched: length=' + str.length);
          res.send(str);
        });

        response.on('error', function() {
          res.status(500).send({
            error: 'Error occurred while fetching the resource'
          })
        });
      }

      if (urlObject.protocol === 'https') {
        https.request(options, httpCallback).end();
      } else {
        http.request(options, httpCallback).end();
      }
    } else {
      res.status(400).send({
        error: 'Bad resource url'
      });
    }
  } else {
    res.status(400).send({
      error: 'Bad resource url'
    });
  }
});

app.listen(process.env.PORT || 4000, function(){
  console.log('CORS-enabled web server listening on port ' + (process.env.PORT || 4000));
});
