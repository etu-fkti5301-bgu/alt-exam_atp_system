var express = require('express'),
    app = express();
var child = require('child_process');

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req,res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/process', function(req, res) {
  var atp = child.spawn('node', ['./js/atp/core.js', req.body.message]);

  atp.stdout.on('data', function(data) {
    res.end(data);

    console.log('[LOG]: Results sent.');
  });

  atp.stderr.on('data', function(data) {
    res.end();

    console.log('[LOG]: Error. Incorrect message.')
  });
});

app.listen(app.get('port'));
