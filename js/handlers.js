const undefinedErrorMessage = 'undefined',
      syntaxErrorMessage = 'Входные данные некорректны. Попробуйте снова.',
      emptyFieldMessage = 'Входные данные отсутствуют. Попробуйте снова.';

const stateComplete = 4, // Request to server completeed and we got some response.
      statusOK = 200; // HTTP status code if everything is OK.

function printResult(message) {
  document.getElementById('output-content').innerHTML = '<p>' + message + '</p>';
  document.getElementById('output').style.visibility = 'visible';
}

/* Unification algorithm has two input arguments. If one checked,
   show second empty input field. User inputs two terms P(...) and P(...). */
function checkAlgorithm() {
  if (document.getElementById('alg').value == 'unf') {
    document.getElementById('sndInput').value = ''
    document.getElementById('sndInput').hidden = false;
  } else {
    document.getElementById('sndInput').hidden = true;
    document.getElementById('sndInput').value = 'null';
  }
}

function sendRequest() {
  if (document.getElementById('fstInput').value == '' ||
      document.getElementById('sndInput').value == '') {
    printResult(emptyFieldMessage);
    return;
  }

  document.getElementById('output').style.visibility = 'hidden';

  var message = 'alg=' + encodeURIComponent(document.getElementById('alg').value) +
                '&fstInput=' + encodeURIComponent(document.getElementById('fstInput').value) +
                '&sndInput=' + encodeURIComponent(document.getElementById('sndInput').value);
                /* In case of secondInput is empty, server handles it and doesn't care.
                   So we don't care too, send it. */

  var request = new XMLHttpRequest();
  request.open('POST', '/', true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.onreadystatechange = function() {
    if (request.readyState == stateComplete) {
      if (request.status == statusOK) {
        /* Server sends not rendered special symbols and '\n' in special cases (unf algorithm).
           Remove '\n' and make HTML to render specal symbols. */
        var serverResponse = decodeURIComponent(request.responseText).replace(/\\n/g, '')
                                                                     .replace(/\\/g, "&#");
        switch (serverResponse) {
          case 'undefined':
            printResult(undefinedErrorMessage);
            break;

          case 'stderr':
            printResult(syntaxErrorMessage);
            break;

          default:
            response = JSON.parse(serverResponse);
            printResult('<b>Parsed: </b>' + response.parsed[0] + '</br>' +
                        '<b>Result: </b>'+ response.result[0] + '</br>');
            break;
        }
      } else {
        /* In case of server is down. Actually, can't be possible because the page itself
           wouldn't be available. But must be handled.*/
        console.log('error: server: ' + request.status + ': ' + request.statusText);
      }
    }
  }

  request.send(message);
}
