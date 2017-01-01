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
    var atp = child.spawn('node', ['./js/atp/core.js', req.body.message]);
    console.log('[LOG.INFO]: Received message: ' +
      '\"' + req.body.message + '\".');

    atp.stdout.on('data', function(data) {
        var html = '<h3>Results:</h3><p>' + data + '</p><br/><a href="/">Try again</a>';

        res.send(html);
        res.end();

        console.log('[LOG.INFO]: Correct received message. Results sent to client.');
    });

  atp.stderr.on('data', function(data) {
    res.end();

    console.log('[LOG.ERROR]: Incorrect received message. Abort.');
  });
});

app.listen(app.get('port'), function () {
  console.log('[LOG.INFO]: Server has started. Listening on port ' + app.get('port') + '.');
});
