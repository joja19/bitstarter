var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());
/* var app = express.createServer();*/
app.use(express.static(__dirname + '/public'));

var buffer = fs.readFileSync("index.html");
var myString = buffer.toString("utf-8");


app.get('/', function(request, response) {
  response.send(myString);
});


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
