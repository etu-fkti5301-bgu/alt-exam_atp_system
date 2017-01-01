var express     = require('express');
var bodyParser  = require('body-parser');
var child       = require('child_process');

var app         = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
  console.log('[LOG.INFO]: Connection to server.')
});

app.get('/css/:style', function(req, res) {
  res.sendFile(__dirname + '/css/' + req.params.style);
});

app.post('/', function(req, res) {
  var atp = child.spawn('node', ['./js/atp/core.js', /*req.body.alg,*/ req.body.input]);

  console.log('[LOG.INFO]: Received algorithm: ' +
    '\"' + req.body.alg + '\".');
  console.log('[LOG.INFO]: Received input: ' +
    '\"' + req.body.input + '\".');

  atp.stdout.on('data', function(output) {
    res.send(encodeURIComponent(output));
    res.end();

    console.log('[LOG.INFO]: Correct received message. Results sent to client.');
  });

  atp.stderr.on('data', function(output) {
    res.end();

    console.log('[LOG.ERROR]: Incorrect received message. Abort.');
  });
});

app.listen(app.get('port'), function () {
  console.log('[LOG.INFO]: Server has started. Listening on port ' + app.get('port') + '.');
});
