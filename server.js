var express = require('express'),
    app = express();
var child = require('child_process');

app.post('/', function(req, res) {
  var atp = child.spawn('node', ['./atp.js', req.body.message]);

  atp.stdout.on('data', function(data) {
    res.end(data);

    console.log('[LOG]: Results sent.');
  });

  atp.stderr.on('data', function(data) {
    res.end();

    console.log('[LOG]: Error. Incorrect message.')
  });
});

app.get('/',function(req,res){

  res.sendFile(__dirname + '/index.html');

});

app.listen(8080);
