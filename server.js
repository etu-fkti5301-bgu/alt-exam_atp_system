const errorMessage = 'undefined';

var express     = require('express');
var bodyParser  = require('body-parser');
var child       = require('child_process');

var app         = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
  console.log('info: Connection to server.')
});

app.get('/css/:style', function(req, res) {
  res.sendFile(__dirname + '/css/' + req.params.style);
});

app.post('/', function(req, res) {
  var atp;

  if (req.body.alg != 'unf') {
    atp = child.spawn('node', ['./js/atp/core.js', req.body.alg, req.body.fstInput]);
  } else {
    atp = child.spawn('node', ['./js/atp/core.js', req.body.alg, req.body.fstInput, req.body.sndInput]);
  }

  console.log('info: Received algorithm: ' +
    '\"' + req.body.alg + '\".');
  console.log('info: Received first input: ' +
    '\"' + req.body.fstInput + '\".');
  console.log('info: Received second input: ' +
    '\"' + req.body.sndInput + '\".');

  atp.stdout.on('data', function(output) {
    res.send(encodeURIComponent(output));
    res.end();

    console.log('info: Received correct message. Results sent to client.');
  });

  atp.stderr.on('data', function(output) {
    res.send(encodeURIComponent(errorMessage));
    res.end();

    console.log('error: Received incorrect message. Abort.');
  });
});

app.listen(app.get('port'), function () {
  console.log('info: Server has started. Listening on port ' + app.get('port') + '.');
});
