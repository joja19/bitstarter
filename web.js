var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());
/* var app = express.createServer();*/
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

var buffer = fs.readFileSync("index.html");
var myString = buffer.toString("utf-8");


app.get('/', function(request, response) {
  response.send(myString);
});

app.post('/myaction', function(req, res) {
	  res.send('You sent the values: "' + req.body.user.name + '"as username, and "' + req.body.user.email + '"as useremail.');
});


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
