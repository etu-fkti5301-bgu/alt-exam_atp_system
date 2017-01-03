// * Definitions
// Dependencies
var express     = require('express');
var bodyParser  = require('body-parser');
var child       = require('child_process');

// Stuff
const debugMode = false;
const errorMessage = 'undefined';

var app         = express();

// * Methods
// Configuration
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: false })); // Client request type is "application/x-www-form-urlencoded"

// Routing
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
  console.log('info: Connection to server.')
});

app.get('/css/:style', function(req, res) {
  res.sendFile(__dirname + '/css/' + req.params.style);
});

// POST request to root is to compute stuff taken from client
app.post('/', function(req, res) {
  var atp;

  if (req.body.alg != 'unf') { // Unification algorithm must take two terms. Otherwise it takes one formula.
    atp = child.spawn('node', ['./js/atp/core.js', req.body.alg, req.body.fstInput]);
  } else {
    atp = child.spawn('node', ['./js/atp/core.js', req.body.alg, req.body.fstInput, req.body.sndInput]);
  }

  if (debugMode) {
    console.log('debug: Received algorithm: ' +
      '\"' + req.body.alg + '\".');
    console.log('debug: Received first input: ' +
      '\"' + req.body.fstInput + '\".');
    console.log('debug: Received second input: ' +
      '\"' + req.body.sndInput + '\".');
  }

  atp.stdout.on('data', function(output) {
    // Core can return result or 'undefined' if something went wrong. TODO: Detect types of errors.
    res.send(encodeURIComponent((output != 'undefined\n') ? (output) : (errorMessage)));
    res.end();

    console.log('info: Received correct message. Results sent to client.');
  });

  // Output to stderr means something went wrong.
  atp.stderr.on('data', function(output) {
    res.send(encodeURIComponent(errorMessage));
    res.end();

    console.log('error: **** happenned.');
  });
});

// Initialization
app.listen(app.get('port'), function () {
  console.log('info: Server has started. Listening on port ' + app.get('port') + '.');
});
