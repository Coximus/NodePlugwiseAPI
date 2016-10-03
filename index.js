// var Plugwise = require('NodePlugwise');
// var express = require('express');
// var app = express();
// var routes = require('./src/routes');

var app = require('./app');

var port = 3000;
app.restAPI.start(port, function(err, something) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Listening on port ' + port);
    app.restAPI.setupServices([{name: 'Plugwise', module: 'NodePlugwise'}]);
});
// app.get('/', function (req, res) {
//     res.send('Hello World!');
// });

// app.get('/on', function (req, res) {
//     Plugwise.switchPlug('000D6F0000768D95', 1, function(error, response) {
//         if (error) {
//             return res.json({error: 'Failed to switch plug'});
//         }

//         res.json(response);
//     });
// });

// app.get('/off', function (req, res) {
//     Plugwise.switchPlug('000D6F0000768D95', 0, function(error, response) {
//         if (error) {
//             return res.json({error: 'Failed to switch plug'});
//         }

//         res.json(response);
//     });
// });

// app.get('/switch-plugwise/:address/:state', function(request, response) {
//     return routes.switchController.handler(request, response);
// });

// Plugwise.connect('/dev/tty.usbserial-A700drEa', function(error, plugwise) { 
//     if (error) {
//         return console.error(error);
//     }

//     app.listen(port, function () {
//         console.log('Plugwise started. Listening on port: ' + port);
//     });
// });