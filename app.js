var index = require('./index');
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/on', function (req, res) {
    index.switchPlug('768D95', 1, function(error, response) {
        if (error) {
            return res.json({error: 'Failed to switch plug'});
        }

        res.json(response);
    });
});

app.get('/off', function (req, res) {
    index.switchPlug('000D6F0000768D95', 0, function(error, response) {
        if (error) {
            return res.json({error: 'Failed to switch plug'});
        }

        res.json(response);
    });
});

index.connect('/dev/ttyUSB0', function(error, plugwise) { 
    if (error) {
        return console.error(error);
    }

    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });
});